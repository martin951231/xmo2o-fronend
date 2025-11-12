<template>
  <div class="cloudintercom">
    <div class="search-box">
      <a-row type="flex">
        <a-col :span="15">
          <a-input-group compact>
            <p style="margin-top: 5px;">姓名：</p>
            <a-input class="select_position" v-model="search.keyword" placeholder="请输入姓名"/>

            <p style="margin-top: 5px;">非机动车卡：</p>
            <a-input class="select_position" v-model="search.nmvCard" placeholder="请输入非机动车卡"/>

            <p style="margin-top: 5px;">剩余天数：</p>
            <a-input class="select_position" v-model="search.surplusDays" placeholder="请输入剩余天数"/>

            <p style="margin-top: 5px;">状态：</p>
            <a-select class="select_position" v-model="search.status">
              <a-select-option :value="0">请选择状态</a-select-option>
              <a-select-option :value="1">已到期</a-select-option>
              <a-select-option :value="2">未到期</a-select-option>
              <a-select-option :value="3">未缴费</a-select-option>
            </a-select>
          </a-input-group>
        </a-col>
        <a-col :span="1" style="margin-right: 10px">
          <a-button type="primary" @click="getNmvCardList(1)">查询</a-button>
        </a-col>
        <a-col :span="1">
          <a-button @click="resetList()">重置</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="add-box">
      <a-row>
        <a-col :span="2">
          <a-popconfirm
            style="margin-left: 10px"
            class="ant-dropdown-link"
            title="确认通知?"
            ok-text="是"
            cancel-text="否"
            @confirm="payNotice(0,'batch')"
          >
            <a-button type="primary" >批量通知</a-button>
          </a-popconfirm>
        </a-col>
        <a-col >
            <a-button type="primary" @click="$refs.nonMotorVehiclePay.addpay()">电动车缴费</a-button>
         </a-col>
      </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      rowKey="id"
      :row-selection="rowSelection"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'
      :loading="loading"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="paymentRecordPage(record.id)">缴费记录</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          style="margin-left: 10px"
          class="ant-dropdown-link"
          title="确认通知?"
          ok-text="是"
          cancel-text="否"
          @confirm="payNotice(record.id,'single')"
        >
          <a>一键通知</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal title="缴费记录" :width="1000" :visible="visible" :footer="null" v-if="visible" :maskClosable="false" @cancel="handleCancel" >
      <a-table
        :columns="columnsOrder"
        :data-source="dataOrder"
        rowKey="order_id"
        class="components-table-demo-nested"
        :pagination="paginationOrder"
        @change='table_changeOrder'
        :loading="loadingOrder"
      >
      </a-table>
    </a-modal>
    <non-motor-vehicle-pay ref="nonMotorVehiclePay" @ok="bindOk" />
  </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import nonMotorVehiclePay from './nonMotorVehiclePay'

    const columns = [
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '非机动车卡', dataIndex: 'nmv_card', key: 'nmv_card' },
      { title: '到期时间', dataIndex: 'expiration_time', key: 'expiration_time' },
      { title: '剩余天数', dataIndex: 'surplus_days', key: 'surplus_days' },
      { title: '状态', dataIndex: 'status', key: 'status' },
      { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } }
    ]
    const columnsOrder = [
      { title: '支付类型', dataIndex: 'type_name', key: 'type_name' },
      { title: '缴费周期', dataIndex: 'cycle_num', key: 'cycle_num' },
      { title: '支付金额', dataIndex: 'pay_money', key: 'pay_money' },
      { title: '支付时间', dataIndex: 'pay_time', key: 'pay_time' },
      { title: '支付方式', dataIndex: 'pay_type', key: 'pay_type' },
      { title: '支付状态', dataIndex: 'is_paid', key: 'is_paid' }
    ]
    const data = []
    const dataOrder = []
    export default {
      name: 'paymentRecord',
      components: {
        nonMotorVehiclePay,
      },
      data () {
        return {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
          pagination: { current: 1, pageSize: 10, total: 10 },
          paginationOrder: { current: 1, pageSize: 10, total: 10 },
          search: { keyword: '', nmvCard: '', page: 1, surplusDays: '', status: 0 },
          loading: false,
          card_id: 0,
          loadingOrder: false,
          columns,
          columnsOrder,
          data,
          dataOrder,
          villageId: '',
          visible: false,
          selectedSendUser: []
        }
      },
      mounted () {
        this.getNmvCardList()
      },
      computed: {
        // 复选框选择  审核未通过的用户不能被选中
        rowSelection () {
          const _this = this
          return {
            onChange: (selectedRowKeys, selectedRows) => {
              _this.selectedSendUser = selectedRowKeys
            }
          }
        }
      },
      methods: {
        // 非机动车卡号列表
        getNmvCardList (t = 0) {
          this.loading = true
          if (t === 1) {
            this.$set(this.pagination, 'current', 1)
          }
          this.search['page'] = this.pagination.current
          this.request(villageApi.getNmvCardList, this.search)
            .then((res) => {
              console.log(res)
              this.pagination.total = res.count ? res.count : 0
              this.pagination.pageSize = res.total_limit ? res.total_limit : 10
              this.data = res.list
              this.loading = false
            })
        },
        // 缴费记录弹出层
        paymentRecordPage (id) {
          this.card_id = id
          this.getNmvChargeOrderList(0, id)
          this.visible = true
        },
        bindOk(){
            this.getNmvCardList();
            
        },
        // 缴费记录 数据列表
        getNmvChargeOrderList (t = 0, id) {
          this.loadingOrder = true
          let param = {
            id: id
          }
            if (t === 1) {
                this.$set(this.paginationOrder, 'current', 1)
            }
          param['page'] = this.paginationOrder.current
          this.request(villageApi.getNmvChargeOrderList, param)
            .then((res) => {
              this.paginationOrder.total = res.count ? res.count : 0
              this.paginationOrder.pageSize = res.total_limit ? res.total_limit : 10
              this.dataOrder = res.list
              this.loadingOrder = false
            })
        },
        // 进行重置
        resetList () {
          this.$set(this.pagination, 'current', 1)
          this.search = { keyword: '', nmvCard: '', page: 1, surplusDays: '', status: 0 }
          this.getNmvCardList()
        },
        // 分页
        table_change (e) {
          let _this = this
          if (e.current && e.current > 0) {
            _this.$set(_this.pagination, 'current', e.current)
            _this.getNmvCardList()
          }
        },
        table_changeOrder (e) {
          let _this = this
          if (e.current && e.current > 0) {
            _this.$set(_this.paginationOrder, 'current', e.current)
            _this.getNmvChargeOrderList(0, this.card_id)
          }
        },
        // 取消
        handleCancel () {
          this.visible = false
            this.$set(this.paginationOrder, 'current', 1)
          this.getNmvCardList()
        },
        // 通知 发送消息模板
        payNotice (value, type) {
          if (type === 'single') {
            this.selectedSendUser = [value]
          } else {
            if (this.selectedSendUser.length < 1) {
              this.$message.error('请先选择需要通知的用户')
              return false
            }
          }
          let param = {
            send: this.selectedSendUser
          }
          this.request(villageApi.sendNmvMessage, param)
            .then((res) => {
              this.$message.success('操作成功')
              this.getNmvCardList()
            })
        }
      }
    }
</script>
<style>
.select_position{
  width: 150px !important;
  margin-right: 10px !important;
}
</style>