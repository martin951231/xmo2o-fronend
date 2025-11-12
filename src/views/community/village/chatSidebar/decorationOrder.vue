<template>
  <div class="message-suggestions-list-box">
<!--    装修申请单列表-->
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      rowKey="id"
      @change='table_change'
      :loading="loading"
    >
      <span slot="enclosure" slot-scope="text, record">
        <a @click="enclosureList(record.id)">附件</a>
      </span>
      <span slot="remark" slot-scope="text, record">
        <a @click="remarkList(record.id)">备注</a>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="editDecorationOrder(record.edit_url)">编辑</a>
        <a-divider type="vertical"/>
        <a @click="delDecorationOrder(record.id)">删除</a>
      </span>
    </a-table>

    <!--    模板编辑-->
    <a-modal title="模板编辑" :width="1300" :footer="null" v-if="visible" :visible="visible" :maskClosable="false" :confirmLoading="false" @cancel="handleCancel">
      <iframe id="myframe" ref="editDecorationOrderIframe" frameborder="0" :src="editUrl" style="width: 100% !important;height: 550px !important;"></iframe>
    </a-modal>

    <!--    附件-->
    <a-modal title="附件" :width="600" :footer="null" :visible="enclosureVisible" :maskClosable="false" :confirmLoading="false" @cancel="enclosureHandleCancel">
      <a-button type="primary" round size="small" @click="uploadFileSingle()" style="margin-bottom: 10px;">上传附件</a-button>
      <a-table
        :columns="enclosureColumns"
        :data-source="enclosureData"
        class="components-table-demo-nested"
        :pagination="enclosurePagination"
        rowKey="id"
        @change='table_change_enclosure'
        :loading="enclosureLoading"
      >
        <span slot="enclosureAction" slot-scope="text, record">
          <a :href="record.file_url_path" target="_blank">查看图片</a>
          <a-divider type="vertical"/>
          <a @click="delEnclosure(record.file_id)">删除</a>
        </span>
      </a-table>
      <a-modal title="上传附件" :center="true" :footer="null" @cancel="enclosureFileHandleCancel" v-if="uploadFileDialog" :visible="uploadFileDialog" width="450px">
        <a-row>
          <a-col :span="24" style="text-align: -webkit-center;">
            <a-upload
              name="file"
              :multiple="true"
              :data="uploadFileData"
              action="/v20/public/index.php/community/village_api.ChatSidebar/uploadFile"
              :headers="headers"
              @change="handleChange"
            >
              <a-button> <a-icon type="upload" /> 点击上传文件 </a-button>
            </a-upload>
          </a-col>
          <a-col :span="24" style="text-align: -webkit-center;padding: 25px;">
            类型支持：EXCEL、PDF、WORD、图片
          </a-col>
        </a-row>
      </a-modal>
    </a-modal>

    <!--    备注-->
    <a-modal title="备注" :width="600" :footer="null" :visible="remarkVisible" :maskClosable="false" :confirmLoading="false" @cancel="remarkHandleCancel">
      <a-button type="primary" round size="small" @click="addRemarkSingle()" style="margin-bottom: 10px;">添加备注</a-button>
      <a-table
        :columns="remarkColumns"
        :data-source="remarkData"
        class="components-table-demo-nested"
        :pagination="remarkPagination"
        rowKey="id"
        @change='table_change_remark'
        :loading="remarkLoading"
      >
        <span slot="remarkAction" slot-scope="text, record">
          <a @click="editRemark(record.remark_id, record.remark)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="delRemark(record.remark_id)">删除</a>
        </span>
      </a-table>
      <a-modal :title="remarkTitle" :center="true" :footer="null" @cancel="remarkAddHandleCancel" v-if="addRemarkListShow" :visible="addRemarkListShow" width="450px">
        <a-row>
          <a-col :span="24" style="text-align: -webkit-center;">
            <a-input
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
              v-model="remarkVal">
            </a-input>
            <a-button style="margin-top: 20px" type="primary" @click="trueAddRemark()">确 定</a-button>
          </a-col>
        </a-row>
      </a-modal>
    </a-modal>
  </div>
</template>
<script>

import villageApi from "@/api/community/village";

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '模板标题', dataIndex: 'title', key: 'title' },
  { title: '申请填写时间', dataIndex: 'add_time', key: 'add_time' },
  { title: '附件', scopedSlots: { customRender: 'enclosure' } },
  { title: '备注', scopedSlots: { customRender: 'remark' } },
  { title: '状态', dataIndex: 'diy_tatus_txt', key: 'diy_tatus_txt' },
  { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } }
]
const data = []

const enclosureColumns = [
  { title: '文件名称', dataIndex: 'title', key: 'title' },
  { title: '上传人', dataIndex: 'account', key: 'account' },
  { title: '上传时间', dataIndex: 'add_time_txt', key: 'add_time_txt' },
  { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'enclosureAction' } }
]
const enclosureData = []

const remarkColumns = [
  { title: '备注内容', dataIndex: 'remark', key: 'remark' },
  { title: '添加人', dataIndex: 'account', key: 'account' },
  { title: '最新记录时间', dataIndex: 'add_time_text', key: 'add_time_text' },
  { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'remarkAction' } }
]
const remarkData = []

export default {
  name: 'decorationOrder',
  components: {
  },
  data () {
    return {
      pagination: { current: 1, pageSize: 10, total: 10 },
      enclosurePagination: { current: 1, pageSize: 10, total: 10 },
      remarkPagination: { current: 1, pageSize: 10, total: 10 },
      search: { page: 1 },
      enclosureSearch: { page: 1 },
      remarkSearch: { page: 1 },
      headers: {
        authorization: 'authorization-text'
      },
      uploadFileData: {
        path: 'writeFile'
      },
      loading: false,
      enclosureLoading: false,
      uploadFileDialog: false,
      remarkLoading: false,
      addRemarkListShow: false,
      visible: false,
      enclosureVisible: false,
      remarkTitle: '',
      remarkVisible: false,
      data,
      columns,
      enclosureData,
      enclosureColumns,
      diyId: 0,
      remarkData,
      remarkColumns,
      remarkVal: '',
      type: 'add',
      remarkId: 0,
      editUrl: '',
      iframe: ''
    }
  },
  props: {
    pigcmsId: {
      type: Number,
      default: 0
    },
    uid: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.getList(1)
  },
  methods: {
    // 获取列表信息
    getList (t = 0) {
      this.loading = true
      if (t === 1) {
        this.$set(this.pagination, 'current', 1)
      }
      this.search['page'] = this.pagination.current
      this.search['uid'] = this.uid
      this.request(villageApi.getDecorationOrderList, this.search)
        .then((res) => {
          console.log(res)
          this.pagination.total = res.count ? res.count : 0
          this.pagination.pageSize = res.total_limit ? res.total_limit : 10
          this.data = res.list
          this.loading = false
        })
    },
    // 表格中变动  这里只针对页面页数切换
    table_change (e) {
      let that = this
      console.log('e', e)
      if (e.current && e.current > 0) {
        that.$set(that.pagination, 'current', e.current)
        that.getList()
      }
    },
    handleCancel (e) {
      this.visible = false
    },
    editDecorationOrder (url) {
      this.editUrl = url
      this.visible = true
      this.$nextTick(() => {
        const iframe = document.querySelector('#myframe')
        iframe.contentWindow.addEventListener('click', (eve) => {
          console.log('返回触发此事件的元素（事件的目标节点）', eve.target)
          console.log('返回触发此事件的元素（事件的目标节点）文本====innerText', eve.target.innerText)
          if (eve.target.innerText.indexOf('保存') !== -1) {
            this.visible = false
            this.$message.success('修改成功')
            this.getList(1)
          }
          if (eve.target.innerText.indexOf('返回') !== -1) {
            this.visible = false
            this.getList(1)
          }
        })
      })
    },
    // 附件列表
    enclosureList (id, t = 0) {
      this.enclosureLoading = true
      this.diyId = id
      if (t === 1) {
        this.$set(this.enclosurePagination, 'current', 1)
      }
      this.enclosureSearch['page'] = this.enclosurePagination.current
      this.enclosureSearch['diy_id'] = id
      this.request(villageApi.getWriteFileList, this.enclosureSearch)
        .then((res) => {
          console.log(res)
          this.enclosurePagination.total = res.count ? res.count : 0
          this.enclosurePagination.pageSize = res.total_limit ? res.total_limit : 10
          this.enclosureData = res.list
          this.enclosureLoading = false
          this.enclosureVisible = true
        })
    },
    // 删除附件弹窗
    enclosureHandleCancel () {
      this.enclosureVisible = false
    },
    // 附件列表分页
    table_change_enclosure (e) {
      let that = this
      if (e.current && e.current > 0) {
        that.$set(that.enclosurePagination, 'current', e.current)
        that.enclosureList(this.diyId)
      }
    },
    // 上传附件页显示
    uploadFileSingle () {
      this.uploadFileDialog = true
    },
    // 触发附件上传图片
    handleChange (info) {
      if (info.file.status === 'done') {
        console.log(info)
        // 保存数据
        if (info.file.response.status === 1000) {
          let param = {
            'diy_id': this.diyId,
            'file_remark': info.file.name,
            'file_type': info.file.type,
            'file_url': info.file.response.data.url
          }
          this.request(villageApi.addWriteFile, param)
            .then((res) => {
              this.enclosureList(this.diyId, 1)
            })
          this.$message.success(`${info.file.name} 图片上传成功`)
        } else {
          this.$message.error(`${info.file.name} 图片上传失败.`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 图片上传失败.`)
      }
    },
    enclosureFileHandleCancel () {
      this.uploadFileDialog = false
    },
    // 删除附件
    delEnclosure (fileId) {
      let param = {
        file_id: fileId
      }
      this.request(villageApi.delWriteFileList, param)
        .then((res) => {
          this.$message.success('删除成功')
          this.enclosureList(this.diyId, 1)
        })
    },
    // 删除备注弹窗
    remarkHandleCancel () {
      this.remarkVisible = false
    },
    // 备注列表分页
    table_change_remark (e) {
      let that = this
      if (e.current && e.current > 0) {
        that.$set(that.remarkPagination, 'current', e.current)
        that.remarkList(this.diyId)
      }
    },
    // 备注列表
    remarkList (id, t = 0) {
      this.remarkLoading = true
      this.diyId = id
      if (t === 1) {
        this.$set(this.remarkPagination, 'current', 1)
      }
      this.remarkSearch['page'] = this.remarkPagination.current
      this.remarkSearch['diy_id'] = id
      this.request(villageApi.getRemarkList, this.remarkSearch)
        .then((res) => {
          console.log(res)
          this.remarkPagination.total = res.count ? res.count : 0
          this.remarkPagination.pageSize = res.total_limit ? res.total_limit : 10
          this.remarkData = res.list
          this.remarkLoading = false
          this.remarkVisible = true
        })
    },
    // 添加备注显示
    addRemarkSingle () {
      this.remarkTitle = '添加备注'
      this.type = 'add'
      this.remarkVal = ''
      this.remarkId = 0
      this.addRemarkListShow = true
    },
    // 关闭添加备注页面
    remarkAddHandleCancel () {
      this.addRemarkListShow = false
    },
    // 新增备注
    trueAddRemark () {
      let param = {
        'diy_id': this.diyId,
        'remark_value': this.remarkVal,
        'remark_id': this.remarkId,
        'type': this.type
      }
      this.request(villageApi.addRemark, param)
        .then((res) => {
          this.remarkList(this.diyId, 1)
          this.addRemarkListShow = false
        })
    },
    // 编辑备注
    editRemark (remarkId, remarkVal) {
      this.remarkTitle = '编辑备注'
      this.type = 'update'
      this.remarkId = remarkId
      this.remarkVal = remarkVal
      this.addRemarkListShow = true
    },
    // 删除备注
    delRemark (remarkId) {
      let param = {
        remark_id: remarkId
      }
      this.request(villageApi.delRemark, param)
        .then((res) => {
          this.$message.success('删除成功')
          this.remarkList(this.diyId, 1)
        })
    }
  },
}
</script>
<style>
.statistical_data{
  margin: 20px 20px;
  padding: 14px 0;
  text-align: center;
  background-color: #eee;
  font-size: 14px;
}
.statistical_fir_p{
  font-size: 16px;
}
.statistical_data p{
  margin: 0 0;
}
.tab_list{
  padding: 14px 0;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ccc;
}
.ant-modal{
  top: 20px !important;
}
.container .vote_add_top{
  display: none;
}
</style>