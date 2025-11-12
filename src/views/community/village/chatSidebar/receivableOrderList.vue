<template>
  <div class="message-suggestions-list-box">
    <div class="message-suggestions-list-box">
      <div class="search-box">
        <a-row :gutter="48" style="display: flex; flex-wrap: wrap;">
          <a-col :md="6" :sm="20" style="width: 240px; display: flex; margin-top: 15px;" v-if="is_vacancy_show">
            <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
            <a-cascader
              class="cascader_style margin_left_10"
              style="width: 150px"
              :options="options"
              :load-data="loadDataFunc"
              :placeholder="'请选择'+$store.getters.config.room_name"
              change-on-select
              @change="setVisionsFunc"
              v-model="search__detail.room_id" />
          </a-col>
          <a-col :md="6" :sm="20" style="width: 240px; display: flex; margin-top: 15px;">
            <a-input-group compact>
              <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 120px" placeholder="请输入车位号" v-model="search__detail.position_num"/>
            </a-input-group>
          </a-col>
          <a-col :md="6" :sm="20" style="width: 240px; display: flex; margin-top: 15px;">
            <label style="margin-top: 5px;">所属车库：</label>
            <a-select default-value="0" style="width: 117px" placeholder="请选择车库" v-model="search__detail.garage_id">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
                {{ item.garage_num }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="6" :sm="20" style="width: 240px; display: flex; margin-top: 15px;">
            <label style="margin-top: 5px;">收费项目：</label>
            <a-select default-value="0" style="width: 117px" placeholder="请选择项目" v-model="search__detail.project_id">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
                {{ item1.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="6" :sm="20" style="width: 240px; display: flex; margin-top: 15px;" v-if="is_namephone_show">
            <a-input-group compact style="display: flex;">
              <a-select placeholder="请选择筛选项" style="width: 80px" default-value="name" v-model="search__detail.key_val">
                <a-select-option value="name">
                  姓名
                </a-select-option>
                <a-select-option value="phone">
                  电话
                </a-select-option>
              </a-select>
              <a-input style="width: 150px" v-model="search__detail.value"/>
            </a-input-group>
          </a-col>
          <a-col :md="6" :sm="20" style="width: 360px; display: flex; margin-top: 15px;">
            <label style="margin-top: 5px;">时间筛选：</label>
            <a-range-picker style="width: 220px" :allowClear="true" @change="dateOnChange" />
          </a-col>
          <a-col :md="2" :sm="24" style="width: 90px; margin-top: 15px;">
            <a-button type="primary" icon="search" @click="searchList_detail()">
              查询
            </a-button>
          </a-col>
          <a-col :md="2" :sm="24" style="margin-top: 15px;">
            <a-button type="primary" @click="printListDetail()">Excel导出</a-button>
          </a-col>
          <a-col :md="2" :sm="24" style="margin-top: 15px;">
            <a-button type="primary" @click="send_message(3,[],1)" >全部催缴</a-button>
          </a-col>
          <a-col :md="2" :sm="24" style="margin-top: 15px;">
            <a-button type="primary" @click="send_message(2,[],1)" >批量催缴</a-button>
          </a-col>
        </a-row>
      </div>
      <br>
      <a-table
        :columns="columns_detail"
        :data-source="data_detail"
        :row-selection="rowSelectionDetail"
        class="components-table-demo-nested"
        :pagination="pagination_detail"
        @change="table_change_detail"
        :loading="loading_detail" >
        <span slot="action_detail" slot-scope="text, record">
          <a v-if="!record.my_check_status || record.my_check_status==0" @click="discard_order(record.order_id)">作废账单</a>
          <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
          <a-divider type="vertical"/>
          <a v-if="record.my_check_status==2" @click="$refs.checkRefundModel.add(record.order_id,record.order_apply_info,record.orderApplyType)">需审核</a>
          <a v-if="record.my_check_status>0" @click="showpopup_detailsList(record)">审核详情</a>
        </span>
      </a-table>
      <a-modal
        :width="500"
        title="作废账单"
        :visible="visible_invalid"
        :maskClosable="false"
        :confirm-loading="confirmLoading"
        @ok="confirm_invalid"
        @cancel="handleCancel">
        <div class="modal_box">
          <div class="flex_text_box margin_top_10">
            <div class="text_1">作废原因：</div>
            <a-textarea v-model="invalidReasons" style="width: 200px" placeholder="请输入" auto-size />
          </div>
        </div>
      </a-modal>
    </div>
    <a-modal
      :width="1000"
      title="详情"
      :visible="visible_details"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="handle2Cancel"
      style="z-index: 1000;">

      <div v-if="currentIndex == 0">
        <a-button type="primary" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
        <a-button type="default" @click="changeXTab(1, 'order_discard')" style="margin-right: 30px" v-if="show_check_detail && (!details_data['orderApplyType'] || details_data['orderApplyType'] == 'order_discard')" >作废审核记录</a-button>
        <a-button type="default" @click="changeXTab(2, 'modify_money_check')" style="margin-right: 30px" v-if="show_check_detail && details_data['orderApplyType'] == 'modify_money_check'" >修改费用审核记录</a-button>
      </div>
      <div v-else-if="currentIndex == 1">
        <a-button type="default" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
        <a-button type="primary" @click="changeXTab(1, 'order_discard')" style="margin-right: 30px" v-if="show_check_detail && (!details_data['orderApplyType'] || details_data['orderApplyType'] == 'order_discard')" >作废审核记录</a-button>
        <a-button type="default" @click="changeXTab(2, 'modify_money_check')" style="margin-right: 30px" v-if="show_check_detail && details_data['orderApplyType'] == 'modify_money_check'" >修改费用审核记录</a-button>
      </div>
      <div v-else>
        <a-button type="default" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
        <a-button type="default" @click="changeXTab(1, 'order_discard')" style="margin-right: 30px" v-if="show_check_detail && (!details_data['orderApplyType'] || details_data['orderApplyType'] == 'order_discard')" >作废审核记录</a-button>
        <a-button type="primary" @click="changeXTab(2, 'modify_money_check')" style="margin-right: 30px" v-if="show_check_detail && details_data['orderApplyType'] == 'modify_money_check'" >修改费用审核记录</a-button>
      </div>
      <div class="modal_box_1" v-if="currentIndex == 0">
        <div class="flex_text_box">
          <div class="text_1">收费标准名称：</div>
          <div class="text_2">{{ details_data.charge_name }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">收费项目：</div>
          <div class="text_2">{{ details_data.project_name }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">应收费用：</div>
          <div class="text_2">{{ details_data.total_money }}元</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">实收费用：</div>
          <div class="text_2">{{ details_data.modify_money }}元</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">预计计费开始时间：</div>
          <div class="text_2">{{ details_data.service_start_time }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">预计计费结束时间：</div>
          <div class="text_2">{{ details_data.service_end_time }}</div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="details_data.now_ammeter-details_data.last_ammeter > 0">
          <div class="text_1">使用电量：</div>
          <div class="text_2">{{ details_data.now_ammeter-details_data.last_ammeter }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">违约天数：</div>
          <div class="text_2">{{ details_data.late_payment_day }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">违约金收取比例（每天）：</div>
          <div class="text_2">{{ details_data.late_fee_rate }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">违约金费用：</div>
          <div class="text_2">{{ details_data.late_payment_money }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">收费标准生效时间：</div>
          <div class="text_2">{{ details_data.charge_valid_time_txt }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">预缴周期：</div>
          <div class="text_2">{{ details_data.service_month_num?details_data.service_month_num:'无' }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">预缴优惠：</div>
          <div class="text_2">{{ details_data.diy_content?details_data.diy_content:'无' }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">计费模式：</div>
          <div class="text_2">{{ details_data.fees_type_txt?details_data.fees_type_txt:'无' }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">账单生成周期设置：</div>
          <div class="text_2">{{ details_data.bill_create_set_txt?details_data.bill_create_set_txt:'无' }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">账单欠费模式：</div>
          <div class="text_2">{{ details_data.bill_arrears_set_txt?details_data.bill_arrears_set_txt:'无' }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">生成账单模式：</div>
          <div class="text_2">{{ details_data.bill_type_txt?details_data.bill_type_txt:'无' }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">预缴费用：</div>
          <div class="text_2">{{ details_data.prepare_money?details_data.prepare_money:'无' }}</div>
        </div>
        <!-- 以下后端暂无字段 -->
        <div class="flex_text_box margin_top_10">
          <div class="text_1">账单生成时间：</div>
          <div class="text_2">{{ details_data.add_time_txt }}</div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="details_data.parking_num_txt">
            <div class="text_1">车位数量：</div>
            <div class="text_2">{{ details_data.parking_num_txt }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">合计欠费：</div>
          <div class="text_2">{{ details_data.all_fee }}元</div>
        </div>
      </div>
      <div class="order_apply_list" v-if="currentIndex == 1" style="margin: 30px 0px 20px 35px;">
        <div>
          <p><strong>申请详情</strong> </p>
          <p><strong>申请人：</strong> {{ apply_check_info.apply_name }}</p>
          <p><strong>申请时间：</strong> {{ apply_check_info.add_time_str }}</p>
          <p><strong>作废原因：</strong> {{ apply_check_info.apply_reason }}</p>
        </div>
        <a-timeline>
          <a-timeline-item v-for="(item,index) in dataCheckDetail" :color="item.color_v">
            <p><strong>审批人：</strong> {{ item.pname }}</p>
            <p><strong>审核状态：</strong> {{ item.status_str }}</p>
            <p><strong>审核时间：</strong> {{ item.apply_time_str }}</p>
            <p><strong>审核说明：</strong> {{ item.bak }}</p>
          </a-timeline-item>
        </a-timeline>
      </div>
      <div class="order_apply_list" v-if="currentIndex == 2" style="margin: 30px 0px 20px 35px;">
        <div>
          <p><strong>申请详情</strong> </p>
          <p><strong>申请人：</strong> {{ apply_check_info.apply_name }}</p>
          <p><strong>申请时间：</strong> {{ apply_check_info.add_time_str }}</p>
          <p><strong>修改原因：</strong> {{ apply_check_info.apply_reason }}</p>
          <p><strong>订单金额：</strong> {{ apply_check_info.total_money }}</p>
          <p><strong>申请修改金额：</strong> {{ apply_check_info.apply_money }}</p>
        </div>
        <a-divider type="horizontal"/>
        <a-timeline>
          <a-timeline-item v-for="(item,index) in dataCheckDetail" :color="item.color_v">
            <p><strong>审批人：</strong> {{ item.pname }}</p>
            <p><strong>审核状态：</strong> {{ item.status_str }}</p>
            <p><strong>审核时间：</strong> {{ item.apply_time_str }}</p>
            <p><strong>审核说明：</strong> {{ item.bak }}</p>
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-modal>
    <check-refund-info ref="checkRefundModel" @ok="bindOk"/>
    <receivableModal ref="OrderModel"></receivableModal>
    <send-type ref="SendTypeModel" />
  </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    import receivableModal from '../charge/components/receivableModal.vue'
    import SendType from '@/views/community/village/charge/cashier/sendType'
    import checkRefundInfo from '@/views/community/village/charge/cashier/checkRefundInfo'
    import { Collapse } from 'ant-design-vue'
	import store from '@/store';
    const columns = [
        { title: store.getters.config.room_name+'号/车位号', dataIndex: 'number', key: 'number' },
        { title: '业主名', dataIndex: 'name', key: 'name' },
        { title: '电话', dataIndex: 'phone', key: 'phone' },
        { title: '合计', dataIndex: 'total_money', key: 'total_money' },
        { title: '操作', key: 'action', dataIndex: '', scopedSlots: { customRender: 'action' } }
    ]
    const columns_detail = [
        { title: store.getters.config.room_name+'号/车位号', dataIndex: 'number', key: 'number' },
        { title: '业主名', dataIndex: 'name', key: 'name' },
        { title: '电话', dataIndex: 'phone', key: 'phone' },
        { title: '收费标准', dataIndex: 'charge_name', key: 'charge_name' },
        { title: '收费项目名称', dataIndex: 'project_name', key: 'project_name' },
        { title: '收费所属科目', dataIndex: 'charge_number_name', key: 'charge_number_name' },
        { title: '应收费用', dataIndex: 'total_money', key: 'total_money' },
        { title: '计费开始时间', dataIndex: 'service_start_time_txt', key: 'service_start_time_txt' },
        { title: '计费结束时间', dataIndex: 'service_end_time_txt', key: 'service_end_time_txt' },
        { title: '账单生成时间', dataIndex: 'add_time_txt', key: 'add_time_txt' },
        { title: '上次度数', dataIndex: 'last_ammeter', key: 'last_ammeter' },
        { title: '本次度数', dataIndex: 'now_ammeter', key: 'now_ammeter' },
        { title: '审核状态', dataIndex: 'check_status_str', key: 'check_status_str' },
        { title: '操作', key: 'action_detail', width: '100px', dataIndex: '', scopedSlots: { customRender: 'action_detail' } }
    ]
    const data = []
    const data_detail = []
    export default {
        name: 'ReceivableOrderList',
        filters: {

        },
        props:{
          roomKey: {
              type: Array,
              default: ()=>{return []}
          },
          pigcmsId: {
              type: Number,
              default: 0
          },
          villageId: {
              type: Number,
              default: 0
          } ,
          usernum: {
              type: String,
              default: ''
          } 
        },
        components: {
          SendType,
          receivableModal,
          checkRefundInfo,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data () {
            return {
                reply_content: '',
                pagination: { pageSize: 10, total: 10, current: 1 },
                search: { keyword: '', key_val: 'name', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                visible_details: false,
                currentIndex: 0,
                data,
                columns,
                options: [],
                garage_list: [],
                project_list: [],
                dataCheckDetail: [],
                show_check_detail: false,
                search_data: '',
                page: 1,
                selectedRows: [],
                total_money: 0.00,
                details_data: [],
                pagination_detail: { pageSize: 10, total: 10, current: 1 },
                search__detail: { keyword: '', key_val: 'name', page: 1, time_slot: null },
                visible_detail: false,
                loading_detail: false,
                page_detail: 1,
                data_detail,
                columns_detail,
                options_detail: [],
                selectedRows_detail: [],
                visible_invalid: false,
                order_id: 0, // 作废订单id
                invalidReasons: '', // 作废原因
                confirmLoading: false,
                apply_check_info: {},
                is_vacancy_show:true,
                is_namephone_show:true,
            }
        },
        activated () {

        },
        mounted() {
          console.log("pigcmsId======>", this.pigcmsId)
          console.log("village_id======>", this.village_id)  
          console.log("usernum======>", this.usernum) 
          if(this.roomKey.length>0){
              this.search.room_id=this.roomKey;
          }
          if(this.pigcmsId>0){
              this.search.pigcms_id=this.pigcmsId;
              // this.search__detail.pigcms_id=this.pigcmsId;
              this.is_vacancy_show=false;
              this.is_namephone_show=false;
          }else{
              this.search.pigcms_id=0;
              // this.search__detail.pigcms_id=0;
              this.is_vacancy_show=true;
              this.is_namephone_show=true;
          }
          this.getList()
          this.getLists()
          this.getSingleListByVillage()
          this.getProjectList()
          this.getGarageList()
        },
        computed: {
            rowSelection () {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                        this.selectedRows = selectedRows
                    },
                    getCheckboxProps: record => ({
                        props: {
                            disabled: record.name === 'Disabled User', // Column configuration not to be checked
                            name: record.name
                        }
                    })
                }
            },
            rowSelectionDetail () {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                        this.selectedRows_detail = selectedRows
                    },
                    getCheckboxProps: record => ({
                        props: {
                            disabled: record.name === 'Disabled User', // Column configuration not to be checked
                            name: record.name
                        }
                    })
                }
            }
        },
        methods: {
            clear () {
                console.log(1234545)
            },
            // 发送模板消息通知
            send_message (type = 1, record = [], is_detail = 0) {
                if (type == 1) {
                    if (record == '') {
                        this.$message.error('无法发送')
                        return false
                    } else {
                        this.$refs.SendTypeModel.select(type, record, is_detail)
                        /* this.request(villageApi.sendMessage,{
                            type:type,
                            list:record
                        }).then((res)=>{
                            this.$message.success('发送成功');
                        }) */
                    }
                } else if (type == 2) {
                   console.log('SendTypeModel',this.$refs.SendTypeModel) 
                    if (is_detail == 0) {
                        var list = this.selectedRows
                    } else {
                        var list = this.selectedRows_detail
                    }
                    if (list == '') {
                        this.$message.warn('请选择需要发送的对象')
                        return false
                    } else {
                        this.$refs.SendTypeModel.select(type, list, is_detail)
                        /* this.request(villageApi.sendMessage,{
                            type:type,
                            list:list,
                            is_detail:is_detail,
                        }).then((res)=>{
                            this.$message.success('发送成功');
                        }) */
                    }
                } else {
                    this.$refs.SendTypeModel.select(type, [], is_detail)
                    /* this.request(villageApi.sendMessage,{
                        type:type,
                        is_detail:is_detail,
                    }).then((res)=>{
                        this.$message.success('发送成功');
                    }) */
                }
            },
            // 获取账单信息
            getList () {
                this.loading = true
                this.search['page'] = this.page
                this.request(villageApi.receivableOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                        this.total_money = res.total_money
                    })
            },
            // 获取应收明细
            getLists () {
                this.loading_detail = true
                this.search__detail['page'] = this.page_detail
                if(this.roomKey.length>0){
                    this.search__detail.room_id=this.roomKey
                }
                this.request(villageApi.getNewPayOrders, this.search__detail)
                    .then((res) => {
                        this.pagination_detail.total = res.count ? res.count : 0
                        this.pagination_detail.pageSize = res.total_limit ? res.total_limit : 10
                        this.data_detail = res.list
                        this.loading_detail = false
                    })
            },
            bindOk () {
              this.getLists()
            },
            // 作废账单
            discard_order (order_id) {
                this.visible_invalid = true
                this.order_id = order_id
            },
            // 作废确定提交
            confirm_invalid () {
                if (this.invalidReasons == '') {
                    this.$message.warning('请填写作废原因')
                    return
                }
                this.discardOrder(this.order_id)
            },
            // 作废账单
            discardOrder (order_id) {
                this.request(villageApi.discardOrder, {
                    discard_reason: this.invalidReasons,
                    order_id: order_id
                }).then(res => {
                    if (res) {
                        this.$message.success('操作成功')
                        this.order_id = 0
                        this.visible_invalid = false
                        this.invalidReasons = ''
                        this.getLists()
                    }
                })
            },
            handleCancel (e) {
                this.visible_invalid = false
                this.order_id = 0
                this.getLists()
            },
            handle2Cancel (e) {
                this.visible_details = false
                this.order_id = 0
                this.currentIndex = 0
            },
            // 添加
            addActive (val) {
                this.getList()
            },
            // 编辑
            editActive (val) {
                this.getList()
            },
            getProjectList () {
                this.request(villageApi.ChargeProjectList)
                    .then((res) => {
                        this.project_list = res.list
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            getGarageList () {
                this.request(villageApi.garageList)
                    .then((res) => {
                        console.log('garage_list', res)
                        this.garage_list = res
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            // 楼栋号
            getSingleListByVillage () {
                this.request(villageApi.getSingleListByVillage).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        const array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            })
                        })
                        this.options = array
                    }
                })
            },
            // 详情点击未交列表
            showpopup_detailsList (record) {
                this.visible_details = true
               if (record.check_apply_id > 0) {
                   this.show_check_detail = true
               } else {
                   this.show_check_detail = false
               }
                this.getNeedPayOrderInfo(record)
                this.getCheckauthDetail(record)
            },
            getCheckauthDetail (record) {
                this.loading = true
                this.request(villageApi.getCheckauthDetail, { order_id: record.order_id, check_apply_id: record.check_apply_id, xtype: 'order_discard', page: 1 })
                    .then((res) => {
                        this.dataCheckDetail = res.list
                        this.loading = false
                        this.apply_check_info = res.apply_info
                    })
            },
            changeXTab (index) {
                this.currentIndex = index
                if (this.currentIndex == 0) {

                } else {
                    // this.getCheckauthDetail()
                }
            },
            getNeedPayOrderInfo (record) {
                this.request(villageApi.getPayOrderInfo, {
                  order_id: record.order_id
                }).then(res => {
                  if (res) {
                    this.details_data = res
                  }
                })
            },

            // 单元楼
            getFloorList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        console.log('resolve', resolve)
                        resolve(res)
                    })
                })
            },
            // 楼层
            getLayerList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getLayerList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res)
                        }
                    })
                })
            },
            // 房间
            getVacancyList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getVacancyList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res)
                        }
                    })
                })
            },
            async loadDataFunc (selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.loading = true
                setTimeout(function () {
                    targetOption.loading = false
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc (selectedOptions) {
                if (selectedOptions.length === 1) {
                    const options_temp = [...this.options]
                    const res = await this.getFloorList(selectedOptions[0])
                    console.log('res', res)
                    const children = []
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        options_temp['children'] = children
                        return true
                    })
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children
                    this.options = options_temp
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getLayerList(selectedOptions[1])
                    const options_temp = [...this.options]
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = []
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        return true
                    })
                    const product = options_temp.find(_ => _.value === selectedOptions[0])
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children
                    this.options = options_temp
                } else if (selectedOptions.length === 3) {
                    const apps = await this.getVacancyList(selectedOptions[2])
                    const options_temp = [...this.options]
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = []
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        })
                        return true
                    })
                    const product = options_temp.find(_ => _.value === selectedOptions[0])
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children
                    this.options = options_temp
                    console.log('_this.options', this.options)
                } else if (selectedOptions.length == 4) {
                    // this.search['room_id'] = selectedOptions[3];
                }
            },
            // 日期切换，重新赋值
            dateOnChange (date, dateString) {
                this.search.date = dateString
                console.log('search', this.search)
            },
            // 表格中变动  这里只针对页面页数切换
            table_change (e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                  this.pagination.current = e.current
                    this.page = e.current
                    this.getList()
                }
            },
            // 应收明细
            dateOnChangeDetail (date, dateString) {
                this.search__detail.date = dateString
                console.log('search', this.search)
            },
            // 应收明细
            table_change_detail (e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                    this.pagination_detail.current = e.current
                    this.page_detail = e.current
                    this.getLists()
                }
            },
            // 应收明细
            searchList_detail () {
                console.log('search', this.search)
                this.page_detail = 1
                const val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                console.log('searchList')
                this.table_change_detail(val)
                // this.getList()
            },

            // 进行搜索
            searchList () {
                console.log('search', this.search)
                this.page = 1
              const val = {
                current: 1,
                pageSize: 10,
                total: 10
              }
              console.log('searchList')
              this.table_change(val)
               // this.getList()
            },
          // 导出
          printList () {
            this.loading = true
            this.request(villageApi.printReceivableOrder, this.search)
              .then((res) => {
                console.log('list', res.list)
                window.location.href = res.url
                this.loading = false
              })
          },
            // 应收明细导出
            printListDetail () {
                this.loading_detail = true
                this.request(villageApi.receivableOrderImport, this.search__detail)
                    .then((res) => {
                        console.log('list', res.list)
                        window.location.href = res.url
                        this.loading_detail = false
                    })
            },
            // 日期切换，重新赋值
            dateOnChange (date, dateString) {
                // search__detail.time_slot
                this.search__detail.time_slot = dateString
            }
        }
    }
</script>
<style lang="less" scoped>
  .message-suggestions-list-box {
    background-color: white;
  }
  .message-suggestions-list-box .search-box {
    padding: 10px 10px 20px 10px;
    border: 1px solid #e4dfdf;
  }
  .message-suggestions-list-box .add-box {
    padding: 20px 20px 0;
  }
  .message-suggestions-list-box .components-table-demo-nested {
    padding: 20px;
  }
  .message-suggestions-list-box .message_box {
    padding: 20px;
  }
  .lbsf{
    float: right;margin-right: 24px;
  }
  .padding-tp10{
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .modal_box_1 {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    .flex_text_box {
      width: 50%;
    }
  }
  // 公共样式
  .margin_top_10 {
    margin-top: 10px;
  }
  .flex_text_box {
      display: flex;
      flex-direction: row;
      align-items: center;

      .text_1 {
          flex-shrink: 0;
      }
  }
  .page_top{
      background-color: #e6f7ff;
      display: inline-block;
      width: 98%;
      padding: 20px 20px;
      margin: 15px;
      color: #666666;
  }
  
  .a_row_dill{
      display: flex;
      flex-wrap: wrap;
  }
  
  .a_col_dill{
      display: flex;
      width: 320px;
      margin-top: 15px;
  }
  .a_col_btn{
      display: flex;
      width: 120px;
      margin-top: 15px;
  }
</style>
