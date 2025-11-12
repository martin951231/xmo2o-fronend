<template>
  <div class="cloudintercom">
    <span class="page_top">
      1、自然月天数计算：收费的起止时间根据每月的实际天数计算费用。若足月的情兄下按照自然月计算,不足月的情况下按照天数计算;<br/>
      2、一个月天数计算：收费的起止时间为根据每月的实际天数往后计算一个月费用;<br/>
      3、收费类型为每天：起始时间为当天的时间。例：2021-12-04 15:20:21至2021-12-04 23:59:59;<br/>
      4、收费类型为每月：起始时间为一个月的时间。例：2021-12-01至2021-12-31;<br/>
      5、收费类型为每年：起始时间为一年的时间。例：2021-12-04至2022-12-03;<br/>
      <span class="notice">注意：收费的起始时间跟开启的"自然月天数或一个月天数"有关联</span>
    </span>
    <div class="search-box">
      <a-row type="flex">
        <a-col :span="12">
          <a-input-group compact>
            <p style="margin-top: 5px;">收费项目名称：</p>
            <a-input style="width: 160px;margin-right: 10px" v-model="search.keyword" placeholder="请输入收费项目名称"/>

            <p style="margin-top: 5px;">收费类型：</p>
            <a-select style="width: 150px;margin-right: 10px" v-model="search.type">
              <a-select-option :value="0">请选择状态</a-select-option>
              <a-select-option :value="1">每天</a-select-option>
              <a-select-option :value="2">每月</a-select-option>
              <a-select-option :value="3">每年</a-select-option>
            </a-select>

            <p style="margin-top: 5px;">状态：</p>
            <a-select style="width: 150px;margin-right: 10px" v-model="search.status">
              <a-select-option :value="-1">请选择状态</a-select-option>
              <a-select-option :value="1">启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
            </a-select>
          </a-input-group>
        </a-col>
        <a-col :span="1" style="margin-right: 10px">
          <a-button type="primary" @click="getNmvChargeList(1)">查询</a-button>
        </a-col>
        <a-col :span="1">
          <a-button @click="resetList()">重置</a-button>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="1">
          <a-button type="primary" @click="editNmvChargePage(info,'add')">新增非机动车收费标准</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      rowKey="id"
      @change='table_change'
      :loading="loading"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="editNmvChargePage(record,'edit')">编辑</a>
        <a-divider type="vertical"/>
        <a @click="editNmvCharge(record.id,'del')">删除</a>
      </span>
    </a-table>

    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" @cancel="handleCancel" @ok="handleSubmit" >
      <a-form :form="checkForm" class="third_user_info" labelAlign="left">
        <a-form-item label="收费项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" placeholder="请输入收费项目名称">
          <a-input v-decorator="['nmvChargeName', { initialValue: info.nmvChargeName, rules: [{ required: true, message: '请输入收费项目名称!' }] }]"/>
        </a-form-item>
        <a-form-item label="收费类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['type', { initialValue: info.type, rules: [{ required: true }] }]">
            <a-radio :value="1">每天</a-radio>
            <a-radio :value="2">每月</a-radio>
            <a-radio :value="3">每年</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="收费标准金额" :labelCol="labelCol" :wrapperCol="wrapperCol" placeholder="请输入收费标准金额">
          <a-input-number :min="0" style="width: 150px" :precision="2" v-decorator="['price', { initialValue: info.price, rules: [{ required: true, message: '请输入收费标准金额!' }] }]"/>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-radio-group v-decorator="['status', { initialValue: info.status, rules: [{ required: true }] }]">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    const columns = [
      { title: '收费项目名称', dataIndex: 'nmv_charge_name', key: 'nmv_charge_name' },
      { title: '收费类型', dataIndex: 'type_text', key: 'type_text' },
      { title: '收费标准金额', dataIndex: 'price', key: 'price' },
      { title: '状态', dataIndex: 'status_text', key: 'status_text' },
      { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } }
    ]
    const data = []
    export default {
      name: 'nmvChargeRule',
      data () {
        return {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
          pagination: { current: 1, pageSize: 10, total: 10 },
          search: { keyword: '', type: 0, status: -1, page: 1 },
          loading: false,
          columns,
          data,
          visible: false,
          title: '编辑',
          type: 'edit',
          checkForm: this.$form.createForm(this),
          info: {
            id: '',
            nmvChargeName: '', // 收费项目名称
            type: 1, // 收费类型 1是每日 2是每月 3是每年
            price: '', // 收费标准金额
            status: 0 // 状态  1启用 0禁用
          }
        }
      },
      mounted () {
        this.getNmvChargeList()
      },
      methods: {
        // 数据列表
        getNmvChargeList (t = 0) {
          this.loading = true
          if (t === 1) {
            this.$set(this.pagination, 'current', 1)
          }
          this.search['page'] = this.pagination.current
          this.request(villageApi.getNmvChargeList, this.search)
            .then((res) => {
              console.log(res)
              this.pagination.total = res.count ? res.count : 0
              this.pagination.pageSize = res.total_limit ? res.total_limit : 10
              this.data = res.list
              this.loading = false
            })
        },
        // 进行重置
        resetList () {
          this.$set(this.pagination, 'current', 1)
          this.search = { keyword: '', type: 0, status: -1, page: 1 }
          this.getNmvChargeList()
        },
        // 分页
        table_change (e) {
          let _this = this
          if (e.current && e.current > 0) {
            _this.$set(_this.pagination, 'current', e.current)
            _this.getNmvChargeList()
          }
        },
        // 编辑弹出层
        editNmvChargePage (value, type) {
          this.visible = true
          this.type = type
          if (type === 'edit') {
            this.title = '编辑'
          } else {
            this.title = '添加'
          }
          this.info = {
            id: value['id'],
            nmvChargeName: value['nmv_charge_name'], // 收费项目名称
            type: value['type'], // 收费类型 1是每日 2是每月 3是每年
            price: value['price'], // 收费标准金额
            status: value['status'] // 状态  1启用 0禁用
          }
        },
        // 编辑
        editNmvCharge (value, type) {
          let param = {
            type: type,
            id: value,
            info: this.info
          }
          this.request(villageApi.editNmvChargeInfo, param)
            .then((res) => {
              this.$message.success(res.message)
              this.handleCancel()
            })
        },
        // 取消
        handleCancel () {
          this.visible = false
          this.info = {
            id: '',
            nmvChargeName: '', // 收费项目名称
            type: 1, // 收费类型 1是每日 2是每月 3是每年
            price: '', // 收费标准金额
            status: 0 // 状态  1启用 0禁用
          }
          this.type = ''
          this.getNmvChargeList()
          setTimeout(() => {
            this.checkForm = this.$form.createForm(this)
          }, 500)
        },
        // 确认按钮
        handleSubmit () {
          this.checkForm.validateFields((err, values) => {
            if (!err) {
              this.info.nmvChargeName = values['nmvChargeName'] // 收费项目名称
              this.info.type = values['type'] // 收费项目名称
              this.info.price = values['price'] // 收费项目名称
              this.info.status = values['status'] // 收费项目名称
            }
          })
          this.editNmvCharge(this.info.id, this.type)
        }
      }
    }
</script>
<style>
.page_top{
  background-color: #e6f7ff;
  display: inline-block;
  width: 100%;
  padding: 20px 20px;
  margin-bottom: 20px;
  color: #666666;
}
.notice{
    color: red;
}
</style>