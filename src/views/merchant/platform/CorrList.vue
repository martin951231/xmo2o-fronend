/**
* 营业信息纠错列表
* @author 汪晨
* @date 2021-05-07
*/
<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <div style="float:left;font-size:26px">反馈列表</div>
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm" style="float:right;margin-bottom:30px">
      <a-form-model-item label="反馈时间">
        <a-range-picker
          :ranges="{
            过去30天: [moment().subtract(30, 'days'), moment()],
            过去15天: [moment().subtract(15, 'days'), moment()],
            过去7天: [moment().subtract(7, 'days'), moment()],
            今日: [moment(), moment()],
          }"
          :value="searchForm.time"
          format="YYYY-MM-DD"
          @change="onDateRangeChange"
        />
      </a-form-model-item>
      <a-form-model-item label="">
        
        <a-select
          v-model="searchForm.status"
          style="width:115px;"
        >
          <a-select-option :value="2"> 全部</a-select-option>
          <a-select-option :value="0"> 未处理</a-select-option>
          <a-select-option :value="1"> 已处理</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="">
        <a-input v-model="searchForm.content" placeholder="请输入店铺名称" style="width:160px;"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20"> 查询</a-button>
        <!--<a-button @click="resetForm()" class="ml-20"> 重置</a-button>-->
      </a-form-model-item>
    </a-form-model>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-badge v-if="text == 0" status="default" text="未处理" />
        <a-badge v-if="text == 1" status="success" text="已处理" />
      </span>
      <!-- 内容查看栏 -->
      <span slot="content" slot-scope="text">
       <a class="ml-10 inline-block" @click="$refs.corrModel.showCorr(text)">查看</a>
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
       <a class="ml-10 inline-block" v-if="text.status == 0" @click="removeComment(text.id)">标记为已处理</a>
      </span>
    </a-table>
    <corr-detail @loadRefresh="getDataList" ref="corrModel"/>
  </div>
</template>

<script>
import moment from 'moment'
import CorrDetail from './modules/CorrDetail.vue'
import merchantPlatformApi from '@/api/merchant/platform/index'

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
    CorrDetail,
    videoPlayer,
  },
  data() {
    return {
      // 搜索框表单
      searchForm: {
        content: '',    // 搜索内容
        type: 1,        // 搜索类型
        time: [],
        begin_time: '', // 开始时间
        end_time: '',   // 结束时间
        status:2,
      },
      store_list: [], // 店铺列表
      //   table表格头部
      columns: [
        {
          title: '反馈内容',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: { customRender: 'content' },
        },
        {
          title: '店铺名称',
          dataIndex: 'store_name',
          key: 'store_name',
        },
        {
          title: '用户昵称',
          dataIndex: 'user_name',
          key: 'user_name',
        },
        {
          title: '用户手机号',
          dataIndex: 'user_phone',
          scopedSlots: { customRender: 'user_phone' },
        },
        {
          title: '时间',
          dataIndex: 'add_time',
          key: 'add_time',
        },
        {
          title: '团购状态',
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
      params.pageSize = this.pagination.pageSize
      this.request(merchantPlatformApi.getCorrList, params).then((res) => {
        this.dataList = res.list
        this.$set(this.pagination, 'total', res.count)
        if (this.dataList && this.dataList.length) {
          this.dataList = this.dataList.filter(item => {
            if (item.comment && item.comment.length > 32) {
              item.showCommentText = item.comment.substring(0,32) + '...'
            }

            if (item.pic.length || item.showCommentText) {
              item.show = false
            } else {
              item.show = true
            }
            return item
          })
        }
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
      console.log(params)
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
    // 查看
    showCorr() {},
    // 设置为已处理
    removeComment(id) {
      this.$confirm({
        title: '是否标记为已处理?',
        centered: true,
        onOk: () => {
          this.request(merchantPlatformApi.getEditCorr, { id: id }).then((res) => {
            this.$message.success('操作成功！')
            this.getDataList({is_search: false})
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
.ant-table-wrapper {
  margin-top: 40px;
}
</style>