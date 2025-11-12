<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <div>
      <a-tabs default-active-key="1"><a-tab-pane tab="岗位列表"></a-tab-pane></a-tabs>
    </div>
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm" style="margin-bottom:20px;margin-left:20px">
      <a-form-model-item label="职位分类">
        <a-select
          v-model="searchForm.cat_id"
          style="width:160px;"
        >
          <a-select-option :value="0"> 全部</a-select-option>
          <a-select-option
            v-for="items in categoryList"
            :key="items.cat_id"
            :cat_id="items.cat_id"
            >{{items.cat_name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="岗位名称">
        <a-input v-model="searchForm.remarks" placeholder="请输入岗位名称" style="width:160px;"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20"> 查询</a-button>
        <a-button @click="resetForm()" class="ml-20"> 重置</a-button>
      </a-form-model-item>
    </a-form-model>
    <div>
      <a-form-model-item>
        <a-button type="primary" @click="$refs.createModal.add()" class="ml-20 maxbox"> 添加岗位</a-button>
        <a-button @click="delAll()" class="ml-20 maxbox"> 删除</a-button>
      </a-form-model-item>
    </div>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="dataList" :row-selection="rowSelection" :pagination="pagination">
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
       <a class="ml-10 inline-block" @click="$refs.createModal.edit(text)">编辑</a>
       <a class="ml-10 inline-block" v-if="record.people_number < 1" @click="delAll(text)">删除</a>
      </span>
    </a-table>
    <position-create @loaddata="getDataList" ref="createModal"/>
  </div>
</template>

<script>
import moment from 'moment'
import PositionCreate from './PositionCreate.vue'
import merchantPlatformApi from '@/api/merchant/platform/index'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'

Vue.use(Viewer)

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css';

export default {
  name: 'PositionList',
  components: {
    PositionCreate,
    videoPlayer,
  },
  data() {
    return {
      // 搜索框表单
      searchForm: {
        cat_id:0,    // 职位分类
        remarks: '',    // 岗位名称
      },
      categoryList:[],
      selectedRowKeys: [],
      store_list: [], // 店铺列表
      //   table表格头部
      columns: [
        {
          title: '岗位名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '分类',
          dataIndex: 'cat_name',
          key: 'cat_name',
        },
        {
          title: '职位绑定人数',
          dataIndex: 'people_number',
          key: 'people_number',
          width:'12%',
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
    handleRowSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys)
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
      this.request(merchantPlatformApi.getPositionList, params).then((res) => {
        this.dataList = res.list
        this.categoryList = res.categoryList
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
      this.$set(this, 'searchForm', {remarks: '', cat_id: 0})
      this.$set(this.pagination, 'current', 1)
      this.getDataList({is_search: false})
    },
    // 查看
    showCorr() {},
    // 删除
    delAll(id) {
      let ids = []
      if (id) {
        ids = [id]
      } else {
        ids = this.selectedRowKeys
      }
      if(!ids.length) {
        this.$message.warning('请先选择要删除的岗位~')
        return
      }
      const modal = this.$confirm({
        title: '确定要删除选择的岗位吗?',
        centered: true,
        onOk: () => {
          this.request(merchantPlatformApi.getPositionDelAll, { ids }).then((res) => {
            this.$message.success('删除成功！')
            this.getDataList({is_search: false})
            modal.destroy()
          })
        },
      })
      console.log(ids)
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