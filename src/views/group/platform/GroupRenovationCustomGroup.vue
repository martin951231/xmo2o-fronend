<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
    <a-card :bordered="false">
      <div>
        <a-form layout="inline">
          <a-col :md="7">
            <a-form-item label="手动搜索：">
              <a-input
                style="width: 235px"
                v-model="queryParam.keyword"
                placeholder="请输入商品名称"
              />
            </a-form-item>
          </a-col>
          <a-col :md="3">
            <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">查询</a-button>
          </a-col>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        @change="tableChange"
        :pagination="pagination"
        style="min-height: 700px"
      >
            <span slot="sort" slot-scope="text, record">
              <a-input-number :min="0" step="1" style="width: 100px" v-model="record.sort"
                              @blur="handleSortChange(text,record.id)"/>
            </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import GroupPlatformApi from '@/api/group/platform'

export default {
  data() {
    return {
      // 查询参数
      queryParam: {
        custom_id: '0',
        keyword: ''
      },
      pagination: {
        pageSize: 10,
        total: 10,
        'show-total': (total) => `共 ${total} 条记录`,
      },
      page: 1,
      // 表头
      columns: [
        {
          title: '所属商家',
          dataIndex: 'merchant_name',
          width: '8%',
        },
        {
          title: '商品名称',
          dataIndex: 'group_name',
          width: '15%',
        },
        {
          title: '添加时间',
          dataIndex: 'add_time',
          width: '8%',
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: '15%',
          scopedSlots: {
            customRender: 'sort',
          },
        },
      ],
      data: [],
    }
  },
  watch: {
    '$route.query.custom_id': {
      immediate: true,
      handler(val) {
        this.queryParam.custom_id = val
        this.getList()
      },
    },
  },
  created() {
    console.log(this.$route.query.custom_id,"val==val=val1")
    this.queryParam.custom_id = this.$route.query.custom_id
    this.getList()
  },
  activated() {
    console.log(this.$route.query.custom_id,"val==val=val2")
    this.queryParam.custom_id = this.$route.query.custom_id
    this.getList()
  },
  mounted() {
    console.log(this.$route.query.custom_id,"val==val=val3")
    this.queryParam.custom_id = this.$route.query.custom_id
    this.getList()
  },
  methods: {
    // 获取列表信息
    getList() {
      this.queryParam['page'] = this.page
      this.request(GroupPlatformApi.getRenovationCustomGroupSortList, this.queryParam).then((res) => {
        this.data = res.list
        this.pagination.total = res.count
      })
    },
    // 设置排序
    handleSortChange(val, id) {
      this.request(GroupPlatformApi.editRenovationCustomGroupSort, {
        id: id,
        sort: val,
      }).then((res) => {
        this.request(GroupPlatformApi.getRenovationCustomGroupSortList, this.queryParam).then((res) => {
          this.data = res.list
          this.pagination.total = res.count
        })
      })
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e) {
      // 分页
      this.queryParam['pageSize'] = e.pageSize
      this.queryParam['page'] = e.current

      if (e.current && e.current > 0) {
        this.page = e.current
      }
      this.getList()
    },
    // 查询
    searchBtn() {
      this.page = 1
      this.getList()
    },
  }
}
</script>
<style scoped lang="less">
</style>