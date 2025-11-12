<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <h3><a>活动列表</a></h3>
    <a-divider style="margin-top: 10px" />

    <a-row style="margin-top: 20px">
      <a-col :span="8">
        <a-input-search
          placeholder="请输入活动名称"
          style="width: 300px"
          v-model="queryParams.name"
          @search="onSearch"
        />
        <a-button type="primary" style="margin: 10px 10px" @click="onSearch">
          {{ L('搜索') }}
        </a-button>
      </a-col>
      <a-col :span="8" :offset="8">
        <a-button type="primary" style="margin: 10px 10px; float: right" @click="onAdd">
          {{ L('新建') }}
        </a-button>
        <a-button type="danger" style="margin: 10px 10px; float: right" @click="onDelete">
          {{ L('删除') }}
        </a-button>
      </a-col>
    </a-row>

    <a-table
      bordered
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      @change="changePage"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :pagination="pagination"
    >
      <!-- 活动二维码 -->
      <span slot="ewm" slot-scope="text, item">
        <a @click="onSeeImage(text, item)">查看</a>
      </span>

      <!-- 状态 -->
      <span slot="status" slot-scope="text, item">
        <a-switch
          checked-children="开"
          un-checked-children="关"
          :checked="item.status == 1 ? true : false"
          @change="switchChange(item.id, $event)"
        />
      </span>

      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
        <a class="inline-block" @click="delLifeTools(text)" style="margin-right: 10px">{{ L('删除') }}</a>
        <a class="inline-block" @click="addEditLifeTools(text)">{{ L('编辑') }}</a>
      </span>
    </a-table>
    <a-modal
      :visible="previewVisible"
      :destroyOnClose="true"
      :footer="null"
      @cancel="handleCancel"
      title="活动页二维码"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
      <div class="copyInput">
        <a-textarea
          placeholder=""
          auto-size
          style="resize: none;"
          v-if="listItem && listItem.url"
          v-model="listItem.url"
          disabled
        />
        <a-button type="primary" slot="addonAfter" @click="copy"> 复制 </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import douyinMerchantApi from '@/api/douyin/merchant'
export default {
  components: {},

  data() {
    return {
      selectedRowKeys: [], // 选中的数据列表
      previewVisible: false, // 图片弹窗控制
      previewImage: '', // 展示的图片
      dataList: [], // 列表
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        page: 1,
      },
      queryParams: {
        page_size: 0,
        page: 1,
        name: '',
      },
      columns: [
        {
          title: this.L('活动ID'),
          dataIndex: 'id',
        },
        {
          title: this.L('活动名称'),
          dataIndex: 'name',
        },
        {
          title: this.L('视频转发'),
          dataIndex: 'share_count',
          sorter: (a, b) => a.share_count - b.share_count, // 排序
        },
        {
          title: this.L('活动二维码'),
          dataIndex: 'ewm',
          scopedSlots: {
            customRender: 'ewm',
          },
        },

        {
          title: this.L('添加时间 '),
          dataIndex: 'create_time',
        },
        {
          title: this.L('状态'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: {
            customRender: 'status',
          },
        },
        {
          title: this.L('操作'),
          dataIndex: 'id',
          key: 'action',
          width: 100,
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      listItem: null,
    }
  },
  watch: {
    $route() {
      this.getLifeToolsList()
    },
  },
  mounted() {
    this.getLifeToolsList()
  },
  methods: {
    // 数据列表
    getLifeToolsList() {
      this.queryParams.page_size = this.pagination.pageSize
      this.queryParams.page = this.pagination.current
      console.log(this.queryParams, '12313123123')
      this.request(douyinMerchantApi.getActivityList, this.queryParams).then((res) => {
        console.log(res, '--------打印表格---------------')
        this.dataList = res.data
        this.pagination.total = res.total
      })
    },

    // 切换表格分页
    changePage(page, pageSize) {
      this.pagination.current = page.current
      this.getLifeToolsList()
    },

    // 点击选中的列表
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    // 搜索活动名称
    onSearch() {
      console.log(this.queryParams, '------------活动名称搜索-----------')
      this.getLifeToolsList()
    },
    // 新建列表
    onAdd() {
      console.log('---------新建列表--------------')
      this.$router.push({ path: '/douyin/merchant.Activity/ActivityAdd' })
    },
    // 删除选中列表
    onDelete() {
      console.log(this.selectedRowKeys)
      if (!this.selectedRowKeys.length) {
        this.$message.error(this.L('请选择要删除的列表'))
        return false
      }
      this.$confirm({
        title: '确定要删除列表吗？',
        centered: true,
        onOk: () => {
          this.request(douyinMerchantApi.delActivity, {
            ids: this.selectedRowKeys,
          }).then((res) => {
            this.$message.success(this.L('操作成功！'))
            this.getLifeToolsList()
          })
        },
        onCancel() {}, // 点击取消无需操作
      })
    },
    copy() {
      this.$copyText(this.listItem.url)
        .then((message) => {
          console.log('copy', message)
          this.$message.success('复制完毕')
        })
        .catch((err) => {
          console.log('copy.err', err)
          this.$message.error('复制失败')
        })
    },
    // 改变排序
    // changeSort (e, tools_id) {
    //   const sort = e.currentTarget.value
    //   this.request(lifeToolsMerchantApi.setLifeToolsAttrs, {
    //     tools_id,
    //     sort
    //   }).then((res) => {
    //     this.getLifeToolsList()
    //   })
    // },

    // 改变开关状态
    switchChange(id, status) {
      status = status ? 1 : 0
      console.log(id, status)
      this.request(douyinMerchantApi.setActivityStatus, {
        id,
        status,
      }).then((res) => {
        this.getLifeToolsList()
      })
    },
    // 点击查看二维码
    onSeeImage(text, item) {
      this.listItem = JSON.parse(JSON.stringify(item))
      console.log(text, item)
      this.previewVisible = true
      this.previewImage = text
    },
    // 点击弹窗取消
    handleCancel() {
      this.previewVisible = false
    },

    addEditLifeTools(tools_id) {
      this.$router.push({ path: '/douyin/merchant.Activity/ActivityAdd', query: { tools_id: tools_id } })
    },

    // 删除表格
    delLifeTools(id) {
      console.log(id)
      this.$confirm({
        title: '确定删除吗？',
        centered: true,
        onOk: () => {
          this.request(douyinMerchantApi.delActivity, { ids: id }).then((res) => {
            this.$message.success(this.L('操作成功！'))
            this.getLifeToolsList()
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style>
.copyInput {
  display: flex;
  align-items: center;
}
.copyInput button{
  margin-left: 10px;
}
</style>