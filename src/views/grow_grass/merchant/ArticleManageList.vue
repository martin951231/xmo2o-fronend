<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <div style="width:100%;padding-bottom:30px">
    <div style="float:left;font-size:26px">发布管理</div>
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm" style="text-align:right">
      <!-- 关联分类 -->
      <a-form-model-item>
        <a-select
          v-model="searchForm.category_id"
          style="width:115px;"
          >
          <a-select-option
            v-for="item in categoryList"
            :key="item.category_id"
            :category_id="item.category_id">{{item.name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- 关联店铺 -->
      <a-form-model-item>
        <a-select
          v-model="searchForm.store_id"
          style="width:115px;"
          >
          <a-select-option
            v-for="item in storeList"
            :key="item.store_id"
            :store_id="item.store_id">{{item.name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- 发布状态 -->
      <a-form-model-item>
        <a-select
          v-model="searchForm.status"
          style="width:115px;"
        >
          <a-select-option :value="-1"> 发布状态</a-select-option>
          <a-select-option :value="10"> 待审核</a-select-option>
          <a-select-option :value="20"> 发布中</a-select-option>
          <a-select-option :value="30"> 未发布</a-select-option>
          <a-select-option :value="1"> 用户删除</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="">
        <a-input v-model="searchForm.name" placeholder="请输入关键字" style="width:160px;"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20"> 查询</a-button>
      </a-form-model-item>
    </a-form-model>
    </div>
    <div>
      <a-tabs default-active-key="0" @change="statusChange">
        <a-tab-pane key="0" tab="全部"></a-tab-pane>
        <a-tab-pane key="1" tab="待审核"></a-tab-pane>
        <a-tab-pane key="2" tab="已发布"></a-tab-pane>
        <a-tab-pane key="3" tab="未发布"></a-tab-pane>
        <a-tab-pane key="4" tab="用户删除"></a-tab-pane>
      </a-tabs>
    </div>
    <!-- 数据列表 -->
    <a-table rowKey="article_id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <!-- 状态 -->
      <span slot="status" slot-scope="text, item">
        <span v-if="item.is_del == 1">
          <a-badge status="default" text="用户已删除" />
        </span>
        <span v-else>
          <a-badge v-if="item.status == 10" status="default" text="待审核" />
          <a-badge v-if="item.status == 20" status="success" text="发布中" />
          <a-badge v-if="item.status == 30" status="success" text="未发布" />
        </span>
      </span>
      <!-- 标题查看栏 -->
      <span slot="name" slot-scope="text">
      <a class="ml-10 inline-block" @click="$refs.articleModel.showArticle(text.id)">{{text.name}}</a>
      </span>
      <!-- 话题查看栏 -->
      <span slot="category_name" slot-scope="text">
      <a class="ml-10 inline-block" @click="$refs.categoryModel.showCategory(text.id)">{{text.name}}</a>
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text,item">
        <span v-if="item.is_del == 0">
          <a class="ml-10 inline-block" v-if="item.status == 10 || item.status == 30" @click="articleRelease(item.article_id)">发布</a>
          <a class="ml-10 inline-block" v-if="item.status == 10 || item.status == 20" @click="articleNoRelease(item.article_id)">不予发布</a>
        </span>
        <a class="ml-10 inline-block" @click="articleDel(item.article_id)">删除</a>
      </span>
    </a-table>
    <article-detail @loadRefresh="getDataList" ref="articleModel"/>
    <article-category-detail @loadRefresh="getDataList" ref="categoryModel"/>
  </div>
</template>

<script>
import moment from 'moment'
import ArticleDetail from './ArticleDetail.vue'
import ArticleCategoryDetail from './ArticleCategoryDetail.vue'
import growGrassCommentApi from '@/api/grow_grass/merchant'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'

Vue.use(Viewer)

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css';

export default {
  name: 'CorrList',
  components: {
    ArticleDetail,
    ArticleCategoryDetail,
    videoPlayer,
  },
  data() {
    return {
      categoryList: [],
      storeList: [],
      // 搜索框表单
      searchForm: {
        name: '',    // 搜索内容
        store_id: "-1",
        category_id:"-1",
        status:-1,
      },
      store_list: [], // 店铺列表
      //   table表格头部
      columns: 
      [
        {
          title: '发布标题',
          dataIndex: 'id_name',
          key: 'id_name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '发布人',
          dataIndex: 'user_name',
          key: 'user_name',
        },
        {
          title: '关联话题',
          dataIndex: 'category_id_name',
          key: 'category_id_name',
          scopedSlots: { customRender: 'category_name' },
        },
        {
          title: '关联店铺',
          dataIndex: 'store_name',
          scopedSlots: { customRender: 'store_name' },
        },
        {
          title: '关联商品',
          dataIndex: 'goods_name',
          scopedSlots: { customRender: 'goods_name' },
        },
        {
          title: '查看数',
          dataIndex: 'views_num',
          scopedSlots: { customRender: 'views_num' },
        },
        {
          title: '评论数',
          dataIndex: 'reply_num',
          scopedSlots: { customRender: 'reply_num' },
        },
        {
          title: '发布时间',
          dataIndex: 'publish_time',
          key: 'publish_time',
        },
        {
          title: '发布状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '操作',
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: {customRender: 'action'},
        },
      ],
      //   列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        type:0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
    }
  },
  created() {
    this.getDataList({is_search: false})
  },
  methods: {
    moment,
    // 获取table数据
    getDataList(param) {
      let params = {...this.searchForm}
      delete params.time
      if (param.is_search == true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      if(this.pagination.type){
        params.type = this.pagination.type
      }else{
        params.type = 0
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
      this.request(growGrassCommentApi.getArticleLists, params).then((res) => {
        this.dataList = res.list
        this.categoryList = res.categoryList
        this.storeList = res.storeList
        if (param.is_del == true){
          if(res.list_count == 0){
            this.getDataList({is_search: false,is_page:true})
            this.pagination.current = 1
          }
        }
        this.$set(this.pagination, 'total', res.count)
      })
    },
    // 切换状态
    statusChange(key) {
      this.pagination.type = key
      this.getDataList({is_search: false,type:key})
    },
    // 监听日期选择变化
    onDateRangeChange(date, dateString) {
      // 更新搜索框表单数据
      this.$set(this.searchForm, 'time', [date[0], date[1]])
      this.$set(this.searchForm, 'begin_time', dateString[0])
      this.$set(this.searchForm, 'end_time', dateString[1])
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      let params = {...this.searchForm}
      delete params.time
      params.is_search = is_search
      this.getDataList(params)
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
    // 重置表单
    resetForm() {
      this.$set(this, 'searchForm', {content: '', begin_time: '', end_time: '', type: 1, status: 2})
      this.$set(this.pagination, 'current', 1)
      this.getDataList({store_id: this.store_id, is_search: false})
    },
    // 查看文字文字
    showArticle() {},
    // 查看话题文字
    showCategory() {},
    // 设置为发布
    articleRelease(id) {
      this.$confirm({
        title: '是否标记为发布?',
        centered: true,
        onOk: () => {
          this.request(growGrassCommentApi.getEditArticle, { id: id,type:1 }).then((res) => {
            this.$message.success('操作成功！')
            this.getDataList({is_search: false})
          })
        },
        onCancel() {},
      })
    },
    // 设置为不予发布
    articleNoRelease(id) {
      this.$confirm({
        title: '是否标记为不予发布?',
        centered: true,
        onOk: () => {
          this.request(growGrassCommentApi.getEditArticle, { id: id,type:2 }).then((res) => {
            this.$message.success('操作成功！')
            this.getDataList({is_search: false})
          })
        },
        onCancel() {},
      })
    },
    // 设置为删除
    articleDel(id) {
      this.$confirm({
        title: '是否删除?',
        centered: true,
        onOk: () => {
          this.request(growGrassCommentApi.getEditArticle, { id: id,type:3 }).then((res) => {
            this.$message.success('操作成功！')
            this.getDataList({is_search: false,is_del:true})
          })
        },
        onCancel() {},
      })
    },
  }
}
</script>
<style scoped lang="less">
.product-info {
  display: flex;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
    margin-right: 15px;
  }
}

img {
  width: 50px;
  height: 50px;
  margin: 10px;
  border-radius: 5px;
  position: relative;
  display: inline-block;
  border: 1px solid #d9d9d9;
}

.video-player{
  margin: 10px auto;
}
.showMore {
  position: relative;
}
.fold {
  position: absolute;
  right: 0;
  bottom: 4px;
}
</style>