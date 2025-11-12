<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
    <div style="float:left;font-size:26px;line-height:30px">话题管理</div><a-button type="primary" @click="add(category_id)"  style="margin-left:15px"><a-icon type="plus" />添加话题</a-button>
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm" style="float:right;margin-bottom:30px">
      <!-- 关联分类 -->
      <a-form-model-item>
        <a-select
          v-model="searchForm.cat_id"
          style="width:115px;"
          >
          <a-select-option
            v-for="item in catList"
            :key="item.cat_id"
            :cat_id="item.cat_id">{{item.cat_name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- 话题状态 -->
      <a-form-model-item>
        <a-select
          v-model="searchForm.status"
          style="width:115px;"
        >
          <a-select-option :value="-1"> 话题状态</a-select-option>
          <a-select-option :value="0"> 关闭</a-select-option>
          <a-select-option :value="1"> 正常</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="">
        <a-input v-model="searchForm.content" placeholder="请输入话题名称" style="width:160px;"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20"> 查询</a-button>
      </a-form-model-item>
    </a-form-model><div style="height: 30px"></div>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="category_id"
        :pagination="pagination"
        style="min-height: 700px"
      >
        <span slot="sort" slot-scope="text, record">
            <a-input-number :min="0" step="1" style="width: 100px" v-model="record.sort"
            @blur="handleSortChange(text,record.category_id)"/>
        </span>
        <span slot="status" slot-scope="text">
            <a-badge v-if="text == 0" status="default" text="关闭" />
            <a-badge v-if="text == 1" status="success" text="正常" />
        </span>
        <span slot="action" slot-scope="text, record">
            <template>
              <a @click="$refs.createModal.edit(record.category_id )">编辑</a>
              <a-divider type="vertical"/>
            </template>
            <a @click="delOne(record.category_id)">删除</a>
        </span>
      </a-table>
      <category-manage-edit ref="createModal" @loaddata="getList"/>
    </a-card>
  </div>
</template>
<script>
import CategoryManageEdit from "@/views/grow_grass/modules/CategoryManageEdit";
import growGrassCommentApi from '@/api/grow_grass/merchant'

export default {
  name: 'GroupSearchHotList',
  components: {
    CategoryManageEdit,
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
          title: '话题名称',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '排序',
          dataIndex: 'sort',
          key: 'sort',
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: '发布数',
          dataIndex: 'article_num',
          key: 'article_num',
        },
        {
          title: '查看数',
          dataIndex: 'views_num',
          scopedSlots: { customRender: 'views_num' },
        },
        {
          title: '评论数',
          dataIndex: 'reply_num',
          key: 'reply_num',
        },
        {
          title: '关联分类',
          dataIndex: 'cat_name',
          scopedSlots: { customRender: 'cat_name' },
        },
        {
          title: '最后修改时间',
          dataIndex: 'last_time',
          key: 'last_time',
        },
        {
          title: '话题状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: {customRender: 'action'},
        },
      ],
      data: [],
      category_id: '',
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
    this.category_id = this.$route.query.category_id
    this.getList({is_search: false})
  },
  mounted() {
  },
  watch: {
    '$route.query.category_id'() {
      this.category_id = this.$route.query.category_id
      this.getList(this.category_id)
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
      if(this.pagination.total > 0){
        if(Math.ceil(this.pagination.total/this.pagination.pageSize) < params.page){
          this.pagination.current = 0
          params.page = 1
        }
      }
      if(param.is_page == true){
        params.page = 1
      }
      params.pageSize = this.pagination.pageSize
      this.request(growGrassCommentApi.getCategoryList, params).then((res) => {
        this.data = res.list
        this.catList = res.catList
        if (param.is_del == true){
          if(res.list_count == 0){
            this.getList({is_search: false,is_page:true})
            this.pagination.current = 1
          }
        }
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
    // 设置排序
    handleSortChange(val, id) {
      this.request(growGrassCommentApi.getCategorySort, {
        id: id,
        sort: val,
      }).then((res) => {
        this.getList({is_search: false})
      })
    },
    // 新建
    add(category_id) {
      this.$refs.createModal.add(category_id)
    },
    // 返回装修页面
    btnClick() {
      alert(2)
      // this.$router.push({path: '/group/platform.groupRenovationCustomStore/index', query: {custom_id: custom_id}})
    },
    // 删除
    delOne(id) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk: () => {
          this.request(growGrassCommentApi.getCategoryDel, {id: id}).then((res) => {
            this.getList({is_search: false,is_del:true})
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