<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="跟进阶段配置"></a-tab-pane>
    </a-tabs>
    <a-row type="flex" align="middle" class="center">
      <div class="btn_list">
        <a-button type="primary" style="margin: 10px 20px" @click="addClick">{{ L('新建') }}</a-button>
      </div>
    </a-row>
    <!-- 数据列表 -->
    <a-table
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
    >
      <template slot="sort" slot-scope="text, record">
        <a-input-number :defaultValue="record.sort" :min="1" @blur="onSortChange($event, record)" />
      </template>
      <template slot="pay_type" slot-scope="pay_type">
        <span :title="pay_type.join('、')">{{ pay_type.join('、') }}</span>
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
      @cancel="()=>is_lodingTrue = false"
    >
      <div class="newBox">
        <a-form-model :rules="rules" ref="ruleForm" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="名称" prop="name">
            <a-input v-model="formData.name" placeholder="请输入名称"></a-input>
          </a-form-model-item>
          <a-form-model-item label="步骤顺序" prop="sort">
            <a-input-number id="inputNumber" v-model="formData.sort" :min="1" :max="10" />
          </a-form-model-item>
          <a-form-model-item label="付款类型" prop="pay_type">
            <a-select
              mode="multiple"
              :size="'default'"
              placeholder="请选择付款类型"
              v-model="formData.pay_type"
            >
              <a-select-option v-for="item in paymentTypeList" :key="item.id">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="状态颜色" prop="font_color">
            <!-- <a-input :disabled="true" v-model="formData.font_color" placeholder="请输入状态颜色值(如：#232323)"></a-input> -->
            <color-picker v-if="is_lodingTrue" :color.sync="formData.font_color"/>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import real_estatePlatformApi from '@/api/real_estate/platform'
import ColorPicker from '@/components/ColorPicker/ColorPicker.vue'
export default {
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入步骤顺序', trigger: 'blur' }],
        pay_type: [{ required: true, message: '请选择付款类型', trigger: 'blur' }],
        font_color: [{ required: true, message: '请点击选择状态颜色值', trigger: 'blur' }],
      },
      visible: false,
      paymentTypeList: [],
      formData: {
        name: '',
        sort: 1,
        pay_type: [],
        font_color: '',
      },
      titles: '新建',
      //table表格头部
      columns: [
        {
          title: this.L('名称'),
          dataIndex: 'name',
          ellipsis: true,
          width: 300,
        },
        {
          title: this.L('步骤顺序'),
          dataIndex: 'sort',
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: this.L('付款类型'),
          dataIndex: 'pay_type',
          ellipsis: true,
          width: 200,
          scopedSlots: { customRender: 'pay_type' },
        },
        {
          title: this.L('更改时间'),
          dataIndex: 'update_time',
          ellipsis: true,
          width: 300,
          scopedSlots: { customRender: 'update_time' },
        },
        {
          title: this.L('操作'),
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
      is_lodingTrue: false
    }
  },
  created() {
    this.getDataList()
  },
  components:{
    ColorPicker
  },
  methods: {
    //列表步骤顺序事件
    onSortChange(event, item) {
      this.request(real_estatePlatformApi.changeSort, { id: item.id, sort: event.target._value }).then((res) => {
        this.$message.success('修改顺序成功')
        this.getDataList()
      })
    },
    // 获取table数据
    getDataList() {
      let params = {
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        keywords: this.keywords,
      }
      this.request(real_estatePlatformApi.getList, params).then((res) => {
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
      this.is_lodingTrue = true;
      this.types = 1
      this.formData = {
        name: '',
        sort: 1,
        pay_type: [],
        font_color: '',
      }
      this.request(real_estatePlatformApi.payNameList).then((res1) => {
          this.paymentTypeList = res1.pay_name_list
        })
    },
    // 编辑
    editTicket(e) {
      this.titles = '编辑'
      this.types = 2
      this.visible = true
      this.dataListId = e.id
      this.request(real_estatePlatformApi.show, { id: e.id }).then((res) => {
        this.request(real_estatePlatformApi.payNameList).then((res1) => {
          this.paymentTypeList = res1.pay_name_list
          this.formData = res
          this.is_lodingTrue = true;
        })
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
        title: '是否删除该流程?',
        centered: true,
        onOk: () => {
          this.request(real_estatePlatformApi.delete, { id: e.id }).then((res) => {
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
          this.addAndEdlt(this.formData);
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //添加或编辑
    addAndEdlt(params) {
      let paramsData = params
      if(this.types == 2){
        paramsData.id = this.dataListId
      }
      this.request(this.types == 1?real_estatePlatformApi.add:real_estatePlatformApi.edit, paramsData).then((res) => {
        this.$message.success('操作成功')
        this.visible = false
        this.is_lodingTrue = false;
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
  // height: 30vh;
}
</style>
