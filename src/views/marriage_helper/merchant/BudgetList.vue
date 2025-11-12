<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
    <!-- <div style="float:left;font-size:26px;line-height:30px">结婚预算</div> -->
    <a-button type="primary" @click="$refs.createModal.add()"  style="margin-left:15px"><a-icon type="plus" />新建预算</a-button>
    <a-button @click="$refs.scaleModal.scale()" class="ml-20"> 设置预算比例</a-button>
    <div style="height: 20px"></div>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :pagination="pagination"
      >
        <span slot="action" slot-scope="text, record">
            <template>
              <a @click="$refs.createModal.edit(record.id)">编辑</a>
              <a-divider type="vertical"/>
            </template>
            <a @click="delOne(record.id)">删除</a>
        </span>
      </a-table>
      <budget-create ref="createModal" @loaddata="getList"/>
      <budget-scale ref="scaleModal" @loaddata="getList"/>
    </a-card>
  </div>
</template>
<script>
import BudgetCreate from "@/views/marriage_helper/merchant/BudgetCreate";
import BudgetScale from "@/views/marriage_helper/merchant/BudgetScale";
import marriageHelperCommentApi from '@/api/marriage_helper/platform'

export default {
  name: 'BudgetList',
  components: {
    BudgetCreate,
    BudgetScale,
  },
  data() {
    return {
      catList: [],
      // 搜索框表单
      searchForm: {
        name: '',    // 搜索内容
        cat_id:"-1",
        status:-1,
      },
      // 表头
      columns: [
        {
          title: '预算名称',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '预算比例(%)',
          dataIndex: 'scale',
          key: 'scale',
        },
        {
          title: '最后操作时间',
          dataIndex: 'create_time',
          key: 'create_time',
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: {customRender: 'action'},
        },
      ],
      data: [],
      id: '',
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
    }
  },
  created() {
    this.getList({is_search: false})
  },
  activated() {
    this.id = this.$route.query.id
    this.getList({is_search: false})
  },
  mounted() {
  },
  watch: {
    '$route.query.id'() {
      this.id = this.$route.query.id
      this.getList(this.id)
    },
  },
  methods: {
    // 获取列表信息
    getList(param) {
      let params = {...this.searchForm}
      delete params.time
      if (param.is_search == true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.pageSize = this.pagination.pageSize
      this.request(marriageHelperCommentApi.getBudgetList, params).then((res) => {
        this.data = res.list
        this.catList = res.catList
        this.$set(this.pagination, 'total', res.count)
      })
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      let params = {...this.searchForm}
      delete params.time
      params.is_search = is_search
      params.tablekey = 1
      this.getList(params)
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.submitForm()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.submitForm()
    },
    // 删除
    delOne(id) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk: () => {
          this.request(marriageHelperCommentApi.getBudgetDel, {id: id}).then((res) => {
            this.getList({is_search: false})
          })
        },
        onCancel() {
        },
      });
    },
  }
}
</script>
<style scoped lang="less">
</style>