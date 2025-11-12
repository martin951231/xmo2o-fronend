<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <div>
      <a-tabs default-active-key="1" @change="statusChange">
        <a-tab-pane key="1" tab="技师审核列表"></a-tab-pane>
        <a-tab-pane key="2" tab="黑名单"></a-tab-pane>
      </a-tabs>
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
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-badge v-if="text == 0" status="default" text="未申请" />
        <a-badge v-if="text == 1" status="default" text="审核中" />
        <a-badge v-if="text == 2" status="success" text="已认证" />
        <a-badge v-if="text == 3" status="default" text="未通过" />
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
       <a class="ml-10 inline-block" @click="$refs.createModal.view(text)">查看</a>
       <a class="ml-10 inline-block" @click="del(text)" v-if="pagination.type == 1 && (record.status == 2 || record.status == 3 || record.status == 0)">拉黑</a>
       <a class="ml-10 inline-block" @click="examine_adopt(text)" v-if="pagination.type == 1 && record.status == 1">给予通过</a>
       <a class="ml-10 inline-block" @click="examine(text)" v-if="pagination.type == 1 && record.status == 1">不予通过</a>
       <a class="ml-10 inline-block" @click="del_on(text)" v-if="pagination.type == 2">移出黑名单</a>
      </span>
    </a-table>
    <technician-view @loaddata="getDataList" ref="createModal"/>
  </div>
</template>

<script>
import moment from 'moment'
import TechnicianView from './TechnicianView.vue'
import merchantPlatformApi from '@/api/merchant/platform/index'

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
    TechnicianView,
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
          title: '账号（手机号）',
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
          title: '申请时间',
          dataIndex: 'auth_time',
          key: 'auth_time',
        },
        {
          title: '审核状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          width:'16%',
          scopedSlots: {customRender: 'action'},
        },
      ],
      //   列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        type:1,
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
    // 切换状态
    statusChange(key) {
      this.pagination.type = key
      this.getDataList({is_search: false,type:key})
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
      params.type = this.pagination.type;
      params.pageSize = this.pagination.pageSize
      this.request(merchantPlatformApi.getTechnicianList, params).then((res) => {
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
    // 加入黑名单
    del(id) {
      const modal = this.$confirm({
        title: '你确定要拉黑该技师吗?',
        centered: true,
        onOk: () => {
          this.request(merchantPlatformApi.getTechnicianDel, { id: id, type:1 }).then((res) => {
            this.$message.success('拉黑成功！')
            this.getDataList({is_search: false})
            modal.destroy()
          })
        },
      })
    },
    // 移出黑名单
    del_on(id){
      const modal = this.$confirm({
        title: '你确定要从黑名单中移出该技师吗?移出后该技师可重新获得申请认证资格！',
        centered: true,
        onOk: () => {
          this.request(merchantPlatformApi.getTechnicianDel, { id: id, type:0 }).then((res) => {
            this.$message.success('移出成功！')
            this.getDataList({is_search: false})
            modal.destroy()
          })
        },
      })
    },
    // 给予通过
    examine_adopt(id){
      const modal = this.$confirm({
        title: '请确认审核通过?',
        centered: true,
        onOk: () => {
          this.request(merchantPlatformApi.getTechnicianExamine, { id: id, type:1 }).then((res) => {
            this.$message.success('审核通过！')
            this.getDataList({is_search: false})
            modal.destroy()
          })
        },
      })
    },
    // 不予通过
    examine(id){
      const modal = this.$confirm({
        title: '请确认审核不予通过?',
        centered: true,
        onOk: () => {
          this.request(merchantPlatformApi.getTechnicianExamine, { id: id, type:0 }).then((res) => {
            this.$message.success('不予通过！')
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