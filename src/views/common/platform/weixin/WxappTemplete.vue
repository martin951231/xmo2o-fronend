<template>
  <a-card :bordered="false">
    <div class="table-operator"></div>
    <a-table
      :columns="columns"
      :data-source="list"
      :pagination="false"
      @change="tableChange"
      rowKey="id"
      :loading="loading"
    >
      <span slot="status" slot-scope="text, record">
        <a-switch
          checked-children="开启"
          un-checked-children="关闭"
          @change="statusChange($event, record.id)"
          :data-id="record.id"
          :default-checked="text == 1 ? true : false"
        />
      </span>
      <span slot="template_key" slot-scope="text, record">
        <a-button v-if="text == ''" @click="addTemplate(record.id)">一键获取</a-button>
        <span v-if="text" class="template_key">{{ text }}</span>
      </span>
      <span slot="image" slot-scope="text">
        <div class="right-c">
          <div class="img-wrap">
            <a-popover placement="left">
              <template slot="content">
                <img class="goods-image-big" :src="text" />
              </template>
              预览
            </a-popover>
          </div>
        </div>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import weixinPlatformApi from '@/api/common/platform/weixin'

export default {
  name: 'MenuList',
  components: {
    STable,
    Ellipsis,
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      loading: true,
      list: [],
      // 表头
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
        },
        {
          title: '所属类目',
          dataIndex: 'category',
        },
        {
          title: '推送规则',
          dataIndex: 'rule',
        },
        {
          title: '状态',
          dataIndex: 'status',
          // customRender: (text) => (text == 1 ? '开启' : '关闭'),
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '模板ID',
          dataIndex: 'template_key',
          scopedSlots: { customRender: 'template_key' },
        },
        {
          title: '预览',
          dataIndex: 'image',
          scopedSlots: { customRender: 'image' },
        },
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获得列表
    getList() {
      this.request(weixinPlatformApi.getWxappTemplateList).then((res) => {
        this.list = res.list
        this.loading = false
      })
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    tableChange() {},
    // 修改状态
    statusChange(value, id) {
      var status = value == true ? 1 : 0
      var data = {
        id,
        status,
      }
      if (id) {
        this.request(weixinPlatformApi.editWxappTemplate, data).then((res) => {
          this.$message.success(res.msg)
        })
      }
    },
    // 获取模板id
    addTemplate(id) {
      this.request(weixinPlatformApi.addTemplate, { id }).then((res) => {
        this.$message.success(res.msg)
        this.getList()
      })
    },
  },
}
</script>

<style scoped>
.img-wrap {
  cursor: pointer;
}
.goods-image-big {
  width: 334px;
  height: auto;
}
</style>
