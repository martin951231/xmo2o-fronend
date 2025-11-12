<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <div>
      <a-tabs default-active-key="1"><a-tab-pane tab="高手列表"></a-tab-pane></a-tabs>
    </div>
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm" style="float:right;margin-bottom:30px">
      <!-- 分类筛选 -->
      <!-- <a-form-model-item label="分类筛选">
        <a-select
          v-model="searchForm.category"
          style="width:160px;"
          >
          <a-select-option
            v-for="item in category_list"
            :key="item.cat_id"
            :cat_id="item.cat_id">{{item.cat_name}}
          </a-select-option>
        </a-select>
      </a-form-model-item> -->
      <!-- 岗位筛选 -->
      <a-form-model-item label="岗位筛选">
        <a-select
          v-model="searchForm.position"
          style="width:160px;"
        >
          <a-select-option
            v-for="item in position_list"
            :key="item.id"
            :id="item.id">{{item.name}}
            </a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- 条件筛选 -->
      <a-form-model-item label="条件筛选">
        <a-select
          v-model="searchForm.type_id"
          style="width:160px;"
        >
          <a-select-option :value="0"> 商家名称</a-select-option>
          <a-select-option :value="1"> 店铺名称</a-select-option>
          <a-select-option :value="2"> 联系电话</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="">
        <a-input v-model="searchForm.name" placeholder="请输入名称" style="width:200px;"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20"> 查询</a-button>
      </a-form-model-item>
    </a-form-model><div style="height: 30px"></div>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="cat_id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <!-- 图片 -->
      <span slot="headimg" slot-scope="text">
        <img :src="text" style="width:30px;height:30px;">
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
       <a class="ml-10 inline-block" @click="$refs.createModal.view(text)">查看</a>
       <a class="ml-10 inline-block" @click="del(text)">拉黑</a>
      </span>
    </a-table>
    <person-view @loaddata="getDataList" ref="createModal"/>
  </div>
</template>

<script>
import moment from 'moment'
import PersonView from './PersonView.vue'
import marriageHelperCommentApi from '@/api/marriage_helper/platform'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'

Vue.use(Viewer)

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css';

export default {
  name: 'CategoryList',
  components: {
    PersonView,
    videoPlayer,
  },
  data() {
    return {
      // 搜索框表单
      searchForm: {
        category:0,
        position:0,
        type_id:0,
        name: '',
      },
      selectedRowKeys: [],
      category_list: [], // 分类列表
      position_list: [], // 岗位列表
      //   table表格头部
      columns: [
        {
          title: '头像',
          dataIndex: 'headimg',
          key: 'headimg',
          scopedSlots: {customRender: 'headimg'},
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '岗位',
          dataIndex: 'pos_name',
          key: 'pos_name',
        },
        {
          title: '从业年限',
          dataIndex: 'job_time',
          key: 'job_time',
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: '归属商家',
          dataIndex: 'mer_name',
          key: 'mer_name',
        },
        {
          title: '所在店铺',
          dataIndex: 'store_name',
          key: 'store_name',
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          width:'12%',
          scopedSlots: {customRender: 'action'},
        },
      ],
      //   列表数据
      dataList: [],
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
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.handleRowSelectChange,
      }
    },
  },
  mounted() {
    this.getDataList({is_search: false})
  },
  methods: {
    moment,
    // 设置排序
    handleSortChange(val, cat_id) {
      this.request(marriageHelperCommentApi.getCategorySort, {
        cat_id: cat_id,
        sort: val,
      }).then((res) => {
        this.getDataList({is_search: false})
      })
    },
    handleRowSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },    // 获取table数据
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
      params.pageSize = this.pagination.pageSize
      this.request(marriageHelperCommentApi.getPersonList, params).then((res) => {
        this.dataList = res.list
        this.category_list = res.categoryList
        this.position_list = res.positionList
        console.log(res)
        this.$set(this.pagination, 'total', res.count)
      })
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
      this.$set(this, 'searchForm', {remarks: '', cat_id: 0})
      this.$set(this.pagination, 'current', 1)
      this.getDataList({is_search: false})
    },
    // 查看
    showCorr() {},
    // 删除
    del(id) {
      const modal = this.$confirm({
        title: '确定要拉黑吗?',
        centered: true,
        onOk: () => {
          this.request(marriageHelperCommentApi.getPersonDel, { id }).then((res) => {
            this.$message.success('拉黑成功！')
            this.getDataList({is_search: false})
            modal.destroy()
          })
        },
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
.maxbox {
  padding: 10px 20px 30px 20px;
  border-radius:5px;
}
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  text-align: center;
}
</style>