<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="推荐列表"></a-tab-pane>
    </a-tabs>
    <a-row
      type="flex"
      v-if="project_list.length > 0 || type_list.length > 0 || process_list.length > 0 || pay_name_list.length > 0"
    >
      <div style="margin-right: 30px">
        <span>推荐项目：</span>
        <a-select
          :default-value="project_list[0] ? project_list[0].value : ''"
          style="width: 130px"
          @change="selectChange($event, 1)"
        >
          <a-select-option :value="item.id" v-for="item in project_list" :key="item.id">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>
      <div style="margin-right: 30px">
        <span>房产类型：</span>
        <a-select
          :default-value="type_list[0] ? type_list[0].value : ''"
          style="width: 130px"
          @change="selectChange($event, 2)"
        >
          <a-select-option :value="item.id" v-for="item in type_list" :key="item.id">{{ item.value }}</a-select-option>
        </a-select>
      </div>
      <div style="margin-right: 30px">
        <span>当前状态：</span>
        <a-select
          :default-value="process_list[0] ? process_list[0].value : ''"
          style="width: 130px"
          @change="selectChange($event, 3)"
        >
          <a-select-option :value="item.id" v-for="item in process_list" :key="item.id">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>
      <div style="margin-right: 30px">
        <span>付款状态：</span>
        <a-select
          :default-value="pay_name_list[0] ? pay_name_list[0].value : ''"
          style="width: 130px"
          @change="selectChange($event, 4)"
        >
          <a-select-option :value="item.id" v-for="item in pay_name_list" :key="item.id">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>
     <div style="margin-right: 20px">
      <span>录入日期：</span>
      <a-range-picker @change="onPickerChange" />
    </div>
    </a-row>
    <a-row type="flex" align="middle"> 
    <div style="margin-right: 30px" v-if="is_show == 1">
            <span>置业顾问筛选：</span>
            <a-select
              :default-value="0"
              style="width: 130px"
              v-model="paramsData.user_id"
            >
              <a-select-option :value="item.id" v-for="item in userList" :key="item.id">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>
          <div>
            <a-select
              :default-value="1"
              v-model="paramsData.type"
              :options="selectNameType"
              style="width: 130px; margin-right: 10px"
            ></a-select>
            <a-input style="width: 170px" v-model="paramsData.search_kewords" allowClear placeholder="请输入" />
            <a-button @click="search" type="primary" style="margin: 10px 20px">{{ L('搜索') }}</a-button>
          </div>
    </a-row>
     
    <div class="btn_list">
      <a-button type="primary" style="margin: 10px 0px" @click="addClick">{{ L('新建') }}</a-button>
      <div>
        <a-button type="primary" style="margin: 10px 0px; margin-right: 20px" @click="batchModification">{{
          L('批量修改状态')
        }}</a-button>
        <a-button type="primary" style="margin: 10px 0px" @click="exportData">{{ L('导出') }}</a-button>
      </div>
    </div>
    <!-- 数据列表 -->
    <a-table
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onParkingChange,
      }"
    >
      <template slot="commission_pay" slot-scope="text, record">
        <a-switch
          @change="switchOnChange($event, record)"
          checked-children="已结清"
          un-checked-children="未结清"
          :default-checked="record.commission_pay == 0 ? false : true"
        />
      </template>
      <template slot="process_name" slot-scope="text, record">
        <span :title="record.process_name" :style="'color:' + record.font_color">{{ record.process_name }}</span>
        <a @click="setProcess_name(record)">&nbsp;&nbsp;&nbsp;&nbsp; 编辑</a>
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
      width="32%"
      v-model="visible"
      :title="titles"
      @ok="handleOk"
    >
      <div class="newBox" v-if="details">
        <a-form-model :rules="rules" ref="ruleForm" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="项目名称" prop="project_id">
            <a-select
              :defaultValue="formData.project_id ? formData.project_id : ''"
              @change="selectChange($event, '11')"
              placeholder="请选择"
            >
              <a-select-option :value="item.id" v-for="item in details.project_list" :key="item.id">{{
                item.value
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="位置">
            <span>{{ address ? address.place : '暂无' }}</span>
          </a-form-model-item>
          <a-form-model-item label="客户姓名" prop="buyer_name">
            <a-input v-model="formData.buyer_name" placeholder="请输入客户姓名"></a-input>
          </a-form-model-item>
          <a-form-model-item label="客户手机号" prop="buyer_phone">
            <a-input v-model="formData.buyer_phone" placeholder="请输入客户手机号"></a-input>
          </a-form-model-item>
          <a-form-model-item label="推荐人姓名" prop="referee_name">
            <a-input v-model="formData.referee_name" placeholder="请输入推荐人姓名"></a-input>
          </a-form-model-item>
          <a-form-model-item label="推荐人手机号" prop="referee_phone">
            <a-input v-model="formData.referee_phone" placeholder="请输入推荐人手机号"></a-input>
          </a-form-model-item>

          <a-form-model-item label="付款方式" prop="pay_type">
            <a-select v-model="formData.pay_type" placeholder="请选择">
              <a-select-option :value="item.id" v-for="item in details.pay_name_list" :key="item.id">{{
                item.value
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="房产类型" prop="type_id">
            <a-select v-model="formData.type_id" placeholder="请选择">
              <a-select-option :value="item.id" v-for="item in details.type_list" :key="item.id">{{
                item.value
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="当前状态" prop="process_id">
            <a-select v-model="formData.process_id" placeholder="请选择">
              <a-select-option :value="item.id" v-for="item in details.process_list" :key="item.id">{{
                item.value
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="备注">
            <a-textarea
              v-model="formData.note"
              placeholder="请输入备注"
              :auto-size="{ minRows: 3, maxRows: 6 }"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <!-- 批量修改状态弹框 -->
    <a-modal :centered="true" destroyOnClose v-model="visible1" :title="'修改当前状态'" @ok="handleOk1">
      <div class="newBox aaa" v-if="details && details.process_list.length > 0">
        <a-select placeholder="请选择" style="width: 300px" @change="selectChangeAll">
          <a-select-option :value="item.id" v-for="item in details.process_list" :key="item.id">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>
    </a-modal>
  </div>
</template>
<script>
import real_estatePlatformApi from '@/api/real_estate/platform'
export default {
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      rules: {
        buyer_name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        buyer_phone: [{ required: true, message: '请输入客户手机号', trigger: 'blur' }],
        referee_name: [{ required: true, message: '请输入推荐人姓名', trigger: 'blur' }],
        referee_phone: [{ required: true, message: '请输入推荐人手机号', trigger: 'blur' }],
        project_id: [{ required: true, message: '请选择项目名称', trigger: 'blur' }],
        process_id: [{ required: true, message: '请选择当前状态', trigger: 'blur' }],
        type_id: [{ required: true, message: '请选择房产类型', trigger: 'blur' }],
        pay_type: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
      },
      visible: false,
      visible1: false,
      selectNameType: [
        // {
        //   label: '全部',
        //   value: 0,
        // },
        {
          label: '客户名称',
          value: 1,
        },
        {
          label: '客户手机号',
          value: 2,
        },
      ],
      pay_name_list: [],
      process_list: [],
      project_list: [],
      type_list: [],
      details: null,
      selectedRowKeys: [],
      formData: {
        buyer_name: '',
        buyer_phone: '',
        referee_name: '',
        referee_phone: '',
        project_id: '',
        process_id: '',
        type_id: '',
        pay_type: '',
        note: '',
      },
      titles: '新建',
      //table表格头部
      columns: [
        {
          title: this.L('客户姓名'),
          dataIndex: 'buyer_name',
          ellipsis: true,
        },
        {
          title: this.L('客户手机号'),
          dataIndex: 'buyer_phone',
        },
        {
          title: this.L('推荐人姓名'),
          dataIndex: 'referee_name',
          ellipsis: true,
        },
        {
          title: this.L('推荐人手机号'),
          dataIndex: 'referee_phone',
          ellipsis: true,
        },
        {
          title: this.L('推荐项目'),
          dataIndex: 'project_name',
          ellipsis: true,
        },
        {
          title: this.L('房产类型'),
          dataIndex: 'type_name',
          ellipsis: true,
        },
        {
          title: this.L('付款方式'),
          dataIndex: 'pay_type',
          ellipsis: true,
        },
        {
          title: this.L('当前状态'),
          dataIndex: 'process_name',
          width: 170,
          scopedSlots: { customRender: 'process_name' },
        },
        {
          title: this.L('佣金是否支付'),
          dataIndex: 'commission_pay',
          scopedSlots: { customRender: 'commission_pay' },
          ellipsis: true,
        },
        {
          title: this.L('录入日期'),
          dataIndex: 'add_time',
          scopedSlots: { customRender: 'add_time' },
        },
         {
          title: this.L('备注'),
          dataIndex: 'note',
          scopedSlots: { customRender: 'note' },
          ellipsis: true,
        },
        {
          title: this.L('置业顾问'),
          dataIndex: 'account',
          scopedSlots: { customRender: 'account' },
          ellipsis: true,
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      //   列表数据
      dataList: [],
      keywords: '',
      paramsData: {
        page: 1,
        page_size: 10,
        type: 1,
        search_kewords: '',
        search_process: 0,
        search_project: 0,
        search_type: 0,
        search_pay_type: 0,
        search_sdate: '',
        search_edate: '',
        user_id: 0
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onPageChange,
      },
      process_id: '',
      btn_type: '',
      address: null,
      formDataId: '',
      userList: [],
      is_show: 0
    }
  },
  created() {
    this.request(real_estatePlatformApi.getOtherList).then((res) => {
      this.details = JSON.parse(JSON.stringify(res))
      this.pay_name_list = res.pay_name_list
      this.pay_name_list.unshift({ id: 0, value: '全部' })
      this.process_list = res.process_list
      this.process_list.unshift({ id: 0, value: '全部' })
      this.project_list = res.project_list
      this.project_list.unshift({ id: 0, value: '全部' })
      this.type_list = res.type_list
      this.type_list.unshift({ id: 0, value: '全部' })
       this.request(real_estatePlatformApi.getUserList).then((res) => {
        this.userList = res.data;
        this.is_show = res.is_show
    })
    })
   
    this.getDataList()
  },
  methods: {
    //表格开关事件
    switchOnChange(event, item) {
      this.request(real_estatePlatformApi.changeStatus, { id: item.id, status: event }).then((res) => {
        this.$message.success('修改状态成功')
        this.getDataList()
      })
    },
    //批量修改状态
    batchModification() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择单个或多个')
        return
      }
      this.visible1 = true
    },
    selectChangeAll(e) {
      this.process_id = e
    },
    //编辑多个当前状态
    handleOk1() {
      this.setChangeProcess(this.selectedRowKeys)
    },
    //编辑当前状态
    setProcess_name(record) {
      this.visible1 = true
      this.selectedRowKeys = [record.id]
    },
    setChangeProcess(e) {
      this.request(real_estatePlatformApi.changeProcess, { id: e, process_id: this.process_id }).then((res) => {
        this.$message.success('修改状态成功')
        this.selectedRowKeys = []
        this.visible1 = false
        this.getDataList()
      })
    },
    selectChange(event, i) {
      //推荐项目
      if (i == 1) {
        this.paramsData.search_project = event
      } else if (i == 2) {
        this.paramsData.search_type = event
      } else if (i == 3) {
        this.paramsData.search_process = event
      } else if (i == 4) {
        this.paramsData.search_pay_type = event
      } else if (i == '11') {
        this.formData.project_id = event
        this.address = this.project_list.filter((v) => {
          return v.id == event
        })[0]
      }
    },
    onPickerChange(e1, e2) {
      this.paramsData.search_sdate = e2[0]
      this.paramsData.search_edate = e2[1]
      this.getDataList()
    },
    // 获取table数据
    getDataList() {
      this.paramsData.page = this.pagination.current
      this.paramsData.page_size = this.pagination.pageSize
      this.request(real_estatePlatformApi.getWishList, this.paramsData).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
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
        title: '是否删除该条数据?',
        centered: true,
        onOk: () => {
          this.request(real_estatePlatformApi.deleteWish, { id: [e.id] }).then((res) => {
            this.toSetPage(1)
            this.$message.success('删除成功')
            this.getDataList()
          })
        },
        onCancel() {},
      })
    },
    //导出表格
    exportData() {
      this.request(real_estatePlatformApi.exportData, this.paramsData).then((res) => {
        let url = res.filename
        if (url) {
          window.open(url)
        }

        this.$message.success({ content: '下载成功!', key: 'updatable', duration: 2 })
      })
    },
    //搜索
    search() {
      this.pagination.current = 1
      this.getDataList()
    },
    //新建
    addClick() {
      this.titles = '新建'
      this.visible = true
      this.btn_type = 'add'
      this.address = null
      Object.keys(this.formData).forEach((key) => (this.formData[key] = ''))
    },
    // 编辑
    editTicket(e) {
      this.titles = '编辑'
      this.btn_type = 'deit'
      this.request(real_estatePlatformApi.showWish, { id: e.id }).then((res) => {
        console.log(res)
        this.address = this.project_list.filter((v) => {
          return v.id == res.project_id
        })[0]
        this.formDataId = res.id
        this.visible = true
        this.formData = JSON.parse(JSON.stringify(res))
        delete this.formData.add_time
        delete this.formData.id
        delete this.formData.commission_pay
        delete this.formData.uid
        delete this.formData.update_time
      })
    },
    //新建确认事件
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.btn_type == 'add') {
            this.request(real_estatePlatformApi.addWish, this.formData).then((res) => {
              this.visible = false
              this.$message.success('添加成功')
              this.getDataList()
            })
          } else {
            this.formData.id = this.formDataId
            this.request(real_estatePlatformApi.editWish, this.formData).then((res) => {
              this.visible = false
              this.$message.success('编辑成功')
              this.getDataList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //列表单选多选
    onParkingChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
.btn_list {
  display: flex;
  justify-content: space-between;
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
// .newBox {
//   height: 30vh;
// }
.aaa {
  display: flex;
  justify-content: center;
}
</style>
