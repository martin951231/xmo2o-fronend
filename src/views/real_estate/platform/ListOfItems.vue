<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-tabs v-model="tabKey" @change="tabsChange">
      <a-tab-pane :key="1" tab="项目列表"></a-tab-pane>
      <a-tab-pane :key="2" tab="房产类型"></a-tab-pane>
    </a-tabs>
    <a-row type="flex" align="middle" class="center">
      <div class="btn_list">
        <a-button type="primary" style="margin: 10px 20px" @click="addClick">{{ L('新建') }}</a-button>
      </div>
    </a-row>
    <!-- 数据列表 -->
    <a-table
      style="background: #ffffff"
      :columns="tabKey == 1 ? columns1 : columns2"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
    >
      <template slot="place" slot-scope="place">
        <span :title="place">{{ place }}</span>
      </template>

      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
        <a class="inline-block" @click="editTicket(record)" style="margin-right: 10px">{{ L('编辑') }}</a>
        <a style="color: red" class="inline-block" @click="delPackage(record)">{{ L('删除') }}</a>
      </span>
    </a-table>

    <!-- 新建弹框 -->
    <a-modal
      :maskClosable="false"
      :centered="true"
      destroyOnClose
      width="30%"
      v-model="visible"
      :title="titles"
      @ok="handleOk"
    >
      <div class="newBox">
        <a-form-model :rules="rules" ref="ruleForm" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="项目名称" prop="name" v-if="tabKey == 1">
            <a-input v-model="formData.name" placeholder="请输入项目名称"></a-input>
          </a-form-model-item>
          <a-form-model-item label="房产类型" prop="name" v-if="tabKey == 2">
            <a-input v-model="formData.name" placeholder="请输入房产类型"></a-input>
          </a-form-model-item>
          <a-form-model-item label="位置" prop="place" v-if="tabKey == 1">
            <a-input v-model="formData.place" placeholder="请输入位置"></a-input>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import real_estatePlatformApi from '@/api/real_estate/platform'
export default {
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        place: [{ required: true, message: '请输入步骤顺序', trigger: 'blur' }],
      },
      visible: false,
      paymentTypeList: [],
      formData: {
        name: '',
        place: '',
      },
      tabKey: 1,
      titles: '新建',
      //table表格头部
      columns1: [
        {
          title: this.L('项目名称'),
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: this.L('位置'),
          dataIndex: 'place',
          scopedSlots: { customRender: 'place' },
        },
        {
          title: this.L('更改时间'),
          dataIndex: 'update_time',
          ellipsis: true,
          scopedSlots: { customRender: 'update_time' },
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      columns2: [
        {
          title: this.L('房产类型'),
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: this.L('更改时间'),
          dataIndex: 'update_time',
          ellipsis: true,
          scopedSlots: { customRender: 'update_time' },
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      //列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onPageChange,
      },
      dataListId: '',
      types: 1,
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    //头部切换栏事件
    tabsChange(e) {
      this.getDataList()
    },
    // 获取table数据
    getDataList() {
      let params = {
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        keywords: this.keywords,
      }
      let url = this.tabKey == 1 ? real_estatePlatformApi.getProjectList : real_estatePlatformApi.getPropertyTypeList
      this.request(url, params).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    //新建
    addClick() {
      this.titles = '新建'
      this.visible = true
      this.types = 1
      this.formData = {
        name: '',
        place: '',
      }
      if (this.tabKey == 2) {
        delete delete this.formData.place
      }
    },
    // 编辑
    editTicket(e) {
      this.titles = '编辑'
      this.types = 2
      this.visible = true
      this.dataListId = e.id
      //显示详情
      let url = this.tabKey == 1 ? real_estatePlatformApi.showProjectList : real_estatePlatformApi.showPropertyTypeList
      this.request(url, { id: e.id }).then((res) => {
        this.formData.name = res.name
        this.formData.place = res.place
      })
    },
    toSetPage(type) {
      const totalPage = Math.ceil(
        (this.pagination.total - (type == 1 ? 1 : this.dataList.length)) / this.pagination.pageSize
      ) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },
    // 删除
    delPackage(e) {
      this.$confirm({
        title: '是否删除该数据?',
        centered: true,
        onOk: () => {
          let url =
            this.tabKey == 1 ? real_estatePlatformApi.deleteProjectList : real_estatePlatformApi.deletePropertyTypeList
          this.request(url, { id: e.id }).then((res) => {
            this.toSetPage(1)
            this.$message.success('删除成功')
            this.getDataList()
          })
        },
        onCancel() {},
      })
    },
    //新建确认事件
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.formData)
          this.addAndEdlt(this.formData)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //添加或编辑
    addAndEdlt(params) {
      let paramsData = params
      let url = null
      if (this.types == 2) {
        url = this.tabKey == 1 ? real_estatePlatformApi.editProjectList : real_estatePlatformApi.editPropertyTypeList
        paramsData.id = this.dataListId
      } else {
        url = this.tabKey == 1 ? real_estatePlatformApi.addProjectList : real_estatePlatformApi.addPropertyTypeList
      }
      this.request(url, paramsData).then((res) => {
        this.$message.success('操作成功')
        this.visible = false
        this.getDataList()
      })
    },
  },
}
</script>
<style scoped lang="less">
.center {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.textarea-wrapper {
  position: relative;
  display: block;
  .m-textarea {
    padding: 8px 12px;
    padding-bottom: 25px;
    height: 100%;
  }
  .m-count {
    color: #808080;
    position: absolute;
    font-size: 12px;
    bottom: 0px;
    right: 12px;
  }
}
.newBox {
  height: 15vh;
}
</style>
