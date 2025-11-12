<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <div class="mt-20">
      <a-button type="primary" @click="createUser()"> 添加提醒人 </a-button>
    </div>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="mer_id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <!-- 商品信息 -->
      <span slot="goods_name" slot-scope="text, record" class="flex align-center">
        <a-avatar shape="square" size="large" :src="record.goods_image" />
        <span class="ml-10">{{ text }}</span>
      </span>
      <!-- 活动时间 -->
      <span slot="activityTime" slot-scope="text, record"> {{ text }} ~ {{ record.end_time }} </span>
      <!-- 二维码 -->
      <span slot="qrcode" slot-scope="text">
        <a-popover trigger="click">
          <img slot="content" :src="text" alt="二维码" />
          <a-button type="link">二维码</a-button>
        </a-popover>
      </span>
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-badge v-if="text == 1" status="1" text="正常" />
        <a-badge v-if="text == 2" status="0" text="禁止" />
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
        <a class="mr-10 inline-block" style="color: red" @click="removeUser(text)">删除</a>
        <a class="inline-block" @click="editUser(text)">编辑</a>
      </span>
    </a-table>
    <!-- 弹窗框 -->
    <a-modal :title="title" v-model="visible" @ok="handleOk" width="45%">
      <div>
        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="姓名">
            <a-input v-model="formData.name" placeholder="请输入姓名"></a-input>
          </a-form-model-item>
          <a-form-model-item label="手机号">
            <a-input v-model="formData.phone" placeholder="请输入手机号"></a-input>
              <span style="color:#999;">需要先绑定公众号，再使用手机号注册用户端，授权微信</span>
          </a-form-model-item>
          <a-form-model-item label="业务">
            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
              <a-checkbox
                :indeterminate="businessMinate"
                :checked="formData.checkBusinessAll"
                @change="checkBusinessChange"
                >全选</a-checkbox
              >
            </div>
            <a-checkbox-group
              v-model="formData.businessCheckedList"
              :options="formData.businessOptions"
              @change="checkBusinessGroupChange"
            />
          </a-form-model-item>
            <a-form-model-item label="上班时间">
                <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                    <a-checkbox
                        :indeterminate="workMinate"
                        :checked="formData.checkWorkAll"
                        @change="checkWorkChange"
                    >全选</a-checkbox
                    >
                </div>
                <a-checkbox-group
                    v-model="formData.workCheckedList"
                    :options="formData.workOptions"
                    @change="checkWorkGroupChange"
                />
            </a-form-model-item>
          <a-form-model-item label="状态">
              <a-radio-group
                  v-model="formData.statusCheckedList"
                  :options="formData.statusOptions"
              />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import warnMerchantApi from '@/api/warn/user/index'
export default {
  name: 'GroupList',
  data() {
    return {
      //   table表格头部
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          key: 'phone',
          scopedSlots: { customRender: 'phone' },
        },
        {
          title: '业务',
          dataIndex: 'business',
          key: 'business',
          scopedSlots: { customRender: 'business' },
        },
        {
          title: '工作时间',
          dataIndex: 'work_time',
          key: 'work_time',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          dataIndex: 'pigcms_id',
          key: 'pigcms_id',
          scopedSlots: { customRender: 'action' },
        },
      ],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      //   列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      queryParams: {
        page: 1,
        pageSize: 10,
        store_id: '',
      },
      title: '新建运营',
      modalType: 'add',
      visible: false,
      formData: {
        id: '',
        name: '',
        phone: '',
        businessCheckedList: [],
        businessOptions: [
          { label: '新版商城', value: 'mall' },
          { label: '外卖', value: 'shop' },
          { label: '团购', value: 'group' },
        ],
        workCheckedList: [],
        workOptions: [
          { label: '周一', value: 1 },
          { label: '周二', value: 2 },
          { label: '周三', value: 3 },
          { label: '周四', value: 4 },
          { label: '周五', value: 5 },
          { label: '周六', value: 6 },
          { label: '周日', value: 0 },
        ],
        statusCheckedList: [],
        statusOptions: [
          { label: '正常', value: 1 },
          { label: '禁止', value: 0 }
        ],
        checkBusinessAll: false,
        checkWorkAll: false,
      },
      businessMinate: true,
      workMinate: true,
    }
  },
  watch: {
    '$route.query.store_id'(val) {
      if ('/merchant/merchant.mall/groupList' == this.$route.path && val) {
        this.queryParams.store_id = val
        this.getDataList()
      }
    },
  },
  created() {
    this.getDataList()
  },
  activated() {
    //   添加活动后更新订单列表
    let groupEdit = sessionStorage.getItem('groupEdit') || ''
    if (groupEdit && groupEdit == 1) {
      this.queryParams.store_id = this.$route.query.store_id
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', 10)
      this.$set(this.pagination, 'total', 0)
      this.getDataList()
      sessionStorage.removeItem('groupEdit')
    }
  },
  methods: {
    moment,
    // 获取table数据
    getDataList() {
      this.queryParams.page = this.pagination.current
      this.queryParams.pageSize = this.pagination.pageSize
      this.request(warnMerchantApi.getLists, this.queryParams).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 监听日期选择变化
    onDateRangeChange(date, dateString) {
      // 更新搜索框表单数据
      this.$set(this.searchForm, 'time', [date[0], date[1]])
      this.$set(this.searchForm, 'start_time', dateString[0])
      this.$set(this.searchForm, 'end_time', dateString[1])
    },
    // 提交搜索表单
    submitForm() {
      let params = { store_id: this.store_id, ...this.searchForm }
      delete params.time
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
    // 新建活动
    createUser() {
      this.visible = true
      this.modalType = 'add'
      this.title = '新建提醒人'
        this.formData.id = '';
        this.formData.name = '';
        this.formData.phone = '';
        this.formData.businessCheckedList = [];
        this.formData.workCheckedList = [];
        this.formData.statusCheckedList = [];
    },
    // 编辑活动
    editUser(id) {
      this.visible = true
      this.modalType = 'edit'
      this.title = '编辑提醒人'
        this.request(warnMerchantApi.getUserDetail, { id }).then((res) => {
            this.formData.id = res.pigcms_id;
            this.formData.name = res.name;
            this.formData.phone = res.phone;
            this.formData.businessCheckedList = res.business;
            this.formData.workCheckedList = res.work_times;
            this.formData.statusCheckedList = res.status;
        })
    },
    // 删除消息提醒人
    removeUser(id) {
      this.$confirm({
        title: '是否确定删除该消息提醒人?',
        centered: true,
        onOk: () => {
          this.request(warnMerchantApi.delUser, { id }).then((res) => {
            this.$message.success('操作成功！')
            this.submitForm()
          })
        },
        onCancel() {},
      })
    },
    //弹框确认事件
    handleOk() {
        if(this.modalType == 'edit'){//编辑
            this.request(warnMerchantApi.editUser, {
                id:this.formData.id,
                name:this.formData.name,
                phone:this.formData.phone,
                businessCheckedList:this.formData.businessCheckedList,
                workCheckedList:this.formData.workCheckedList,
                statusCheckedList:this.formData.statusCheckedList,
            }).then((res) => {
                this.$message.success('操作成功！')
                let params = { store_id: this.store_id, ...this.searchForm }
                this.getDataList(params)
                this.visible = false
            })
        }else{//新增
            var data = this.formData;
            this.request(warnMerchantApi.addUser, {
                name:this.formData.name,
                phone:this.formData.phone,
                businessCheckedList:this.formData.businessCheckedList,
                workCheckedList:this.formData.workCheckedList,
                statusCheckedList:this.formData.statusCheckedList,
            }).then((res) => {
                this.$message.success('操作成功！')
                let params = { store_id: this.store_id, ...this.searchForm }
                this.getDataList(params)
                this.visible = false
            })
        }
    },
    //业务全选
    checkBusinessChange(e) {
        console.log(e);
        let arr = []
        this.formData.businessOptions.forEach(v => {
            arr.push(v.value)
        }); 
      this.formData.checkBusinessAll = e.target.checked;
      this.businessMinate = false;
      this.formData.businessCheckedList = e.target.checked ? arr : []
      
    },
    //业务单选
    checkBusinessGroupChange(checkedList) {
      this.businessMinate = !!checkedList.length && checkedList.length < this.formData.businessOptions.length
      this.formData.checkBusinessAll = checkedList.length === this.formData.businessOptions.length
    },
    //工作时间全选
    checkWorkChange(e) {
        console.log(e);
        let arr = []
        console.log(123,this.formData.workOptions);
        this.formData.workOptions.forEach(v => {
            arr.push(v.value)
        });
      this.formData.checkWorkAll = e.target.checked;
      this.workMinate = false;
      this.formData.workCheckedList = e.target.checked ? arr : []
      
    },
    //工作时间单选
    checkWorkGroupChange(checkedList) {
      this.workMinate = !!checkedList.length && checkedList.length < this.formData.workOptions.length
      this.formData.checkWorkAll = checkedList.length === this.formData.workOptions.length
    },
  },
}
</script>
<style scoped lang="less"></style>
