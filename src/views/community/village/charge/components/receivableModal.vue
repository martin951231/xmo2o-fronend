<template>
    <a-drawer :title="title" placement="right" :width="widthDrawer" :closable="true" :visible="visible" @close="onClose">
        <div class="flex_row_center">
            <div class="top_title fix_top_title">{{$store.getters.config.room_name}}号/车位号：<span class="top_title_color">{{lastinfo.number}}</span></div>
            <div class="top_title">业主名：<span class="top_title_color">{{lastinfo.name}}</span></div>
            <div class="top_title">电话：<span class="top_title_color">{{lastinfo.phone}}</span></div>
            <div class="top_title">合计：<span class="top_title_color">{{lastinfo.total_money}}</span></div>
        </div>
        <div class="father_box" v-for="(item,index) in OrderData" :key="index">
            <div class="top_box flex_row_center flex_row_center_color" @click.stop="changeyear(index)">
                <div class="right_icon">{{item.active?'-':'+'}}</div>
                <div class="title">{{item.title}}</div>
                <div class="text_1">本年应收金额合计: ￥{{item.money}}</div>
            </div>
            <div v-if="item.active" class="father_box childer_box" v-for="(itm,idx) in item.childerList" :key="idx">
                <div class="top_box flex_row_center flex_row_center_color" @click.stop="changemonth(index,idx)">
                    <div class="right_icon">{{itm.active?'-':'+'}}</div>
                    <div class="title_1">{{itm.title}}</div>
                    <div class="text_1">本月应收金额合计: ￥{{itm.money}}</div>
                </div>
                <a-table v-if="itm.active" :columns="columns" :data-source="itm.childerList" :pagination="pagination"
                @change='table_change' :loading="loading">
                    <span slot="action" slot-scope="text, record">
                        <a v-if="(!record.my_check_status || record.my_check_status==0) && role_discard==1" @click="invalidShow(record.order_id)">作废账单</a>
                        <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
                        <a v-if="record.my_check_status==2" @click="needCheckOrder(record)">需审核</a>
                        <a-divider type="vertical" v-if="record.my_check_status>0" />
                        <a v-if="record.my_check_status>0" @click="showpopup_detailsList(record)">审核详情</a>
                    </span>
                </a-table>
            </div>
        </div>
        <a-modal :width="500" title="作废账单" :visible="visible_invalid" :confirm-loading="confirmLoading"
                 @ok="confirm_invalid" :maskClosable="false" @cancel="handleCancel1">
          <div class="modal_box">
            <div class="flex_text_box margin_top_10">
              <div class="text_1">作废原因：</div>
              <a-textarea v-model="invalidReasons" style="width: 200px;height: 100px" placeholder="请输入作废原因" auto-size />
            </div>
            <br><br><br>
          </div>
        </a-modal>
        
        <a-modal :width="1000" title="详情" :visible="visible_details" :maskClosable="false" :confirm-loading="confirmLoading"
                 :footer="null" @cancel="handle2Cancel" style="z-index: 1000;">
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
              <div class="text_2">{{details_data.charge_name}}</div>
            </div>
            <div class="flex_text_box margin_top_10">
              <div class="text_1">收费项目：</div>
              <div class="text_2">{{details_data.project_name}}</div>
            </div>
            <div class="flex_text_box">
              <div class="text_1">应收费用：</div>
              <div class="text_2">{{details_data.total_money}}元</div>
            </div>
            <div class="flex_text_box margin_top_10">
              <div class="text_1">实收费用：</div>
              <div class="text_2">{{details_data.modify_money}}元</div>
            </div>
              <div class="flex_text_box">
                  <div class="text_1">预计计费开始时间：</div>
                  <div class="text_2">{{details_data.service_start_time}}</div>
              </div>
              <div class="flex_text_box margin_top_10">
                  <div class="text_1">预计计费结束时间：</div>
                  <div class="text_2">{{details_data.service_end_time}}</div>
              </div>
            <div class="flex_text_box margin_top_10" v-if="details_data.now_ammeter-details_data.last_ammeter > 0">
              <div class="text_1">使用电量：</div>
              <div class="text_2">{{details_data.now_ammeter-details_data.last_ammeter}}</div>
            </div>
            <div class="flex_text_box">
              <div class="text_1">违约天数：</div>
              <div class="text_2">{{details_data.late_payment_day}}</div>
            </div>
            <div class="flex_text_box margin_top_10">
              <div class="text_1">违约金收取比例（每天）：</div>
              <div class="text_2">{{details_data.late_fee_rate}}</div>
            </div>
            <div class="flex_text_box">
              <div class="text_1">违约金费用：</div>
              <div class="text_2">{{details_data.late_payment_money}}</div>
            </div>
            <div class="flex_text_box margin_top_10">
              <div class="text_1">收费标准生效时间：</div>
              <div class="text_2">{{details_data.charge_valid_time_txt}}</div>
            </div>
            <div class="flex_text_box">
              <div class="text_1">预缴周期：</div>
              <div class="text_2">{{details_data.service_month_num?details_data.service_month_num:'无'}}</div>
            </div>
            <div class="flex_text_box margin_top_10">
              <div class="text_1">预缴优惠：</div>
              <div class="text_2">{{details_data.diy_content?details_data.diy_content:'无'}}</div>
            </div>
              <div class="flex_text_box">
                  <div class="text_1">计费模式：</div>
                  <div class="text_2">{{details_data.fees_type_txt?details_data.fees_type_txt:'无'}}</div>
              </div>
              <div class="flex_text_box margin_top_10">
                  <div class="text_1">账单生成周期设置：</div>
                  <div class="text_2">{{details_data.bill_create_set_txt?details_data.bill_create_set_txt:'无'}}</div>
              </div>
              <div class="flex_text_box">
                  <div class="text_1">账单欠费模式：</div>
                  <div class="text_2">{{details_data.bill_arrears_set_txt?details_data.bill_arrears_set_txt:'无'}}</div>
              </div>
              <div class="flex_text_box margin_top_10">
                  <div class="text_1">生成账单模式：</div>
                  <div class="text_2">{{details_data.bill_type_txt?details_data.bill_type_txt:'无'}}</div>
              </div>
            <div class="flex_text_box">
              <div class="text_1">预缴费用：</div>
              <div class="text_2">{{details_data.prepare_money?details_data.prepare_money:'无'}}</div>
            </div>
            <!-- 以下后端暂无字段 -->
            <div class="flex_text_box margin_top_10">
              <div class="text_1">账单生成时间：</div>
              <div class="text_2">{{details_data.add_time_txt}}</div>
            </div>
            <div class="flex_text_box margin_top_10">
              <div class="text_1">合计欠费：</div>
              <div class="text_2">{{details_data.all_fee}}元</div>
            </div>
          </div>
          <div class="order_apply_list" v-if="currentIndex == 1" style="margin: 30px 0px 20px 35px;">
              <div>
                  <p><strong>申请详情</strong> </p>
                  <p><strong>申请人：</strong> {{apply_check_info.apply_name}}</p>
                  <p><strong>申请时间：</strong> {{apply_check_info.add_time_str}}</p>
                  <p><strong>作废原因：</strong> {{apply_check_info.apply_reason}}</p>
              </div>
                  <a-timeline>
                    <a-timeline-item v-for="(item,index) in dataCheckDetail" :color="item.color_v">
                      <p><strong>审批人：</strong> {{item.pname}}</p>
                      <p><strong>审核状态：</strong> {{item.status_str}}</p>
                      <p><strong>审核时间：</strong> {{item.apply_time_str}}</p>
                      <p><strong>审核说明：</strong> {{item.bak}}</p>
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
              <a-timeline-item v-for="(item,index) in dataCheckDetail" :color="item.color_v" :key="index">
                <p><strong>审批人：</strong> {{ item.pname }}</p>
                <p><strong>审核状态：</strong> {{ item.status_str }}</p>
                <p><strong>审核时间：</strong> {{ item.apply_time_str }}</p>
                <p><strong>审核说明：</strong> {{ item.bak }}</p>
              </a-timeline-item>
            </a-timeline>
          </div>
        </a-modal>
               
        <a-modal :title="checkTitle" :width="700" :visible="checkVisible" :maskClosable="false" :confirmLoading="confirmLoading"
                @ok="checkHandleSubmit" @cancel="checkHandleCancel">
          <a-spin :spinning="confirmLoading" :height="800">
            <a-form >
              <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                <a-col :span="20">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="check_post.status">
                      <a-radio :value="1" name="status">
                        审核通过
                      </a-radio>
                      <a-radio :value="2"  name="status">
                        审核不通过
                      </a-radio>
                    </a-radio-group>
                </a-col>
                <a-col :span="6">
                </a-col>
              </a-form-item>
              <a-form-item label="审核说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-col :span="20">
                  <a-textarea
                    ref="textareax"
                    style="width: 250px;height:120px;"
                    placeholder="请输入审核说明"
                    v-model="check_post.bak"/>
                </a-col>
                <a-col :span="6">
                </a-col>
              </a-form-item>
            </a-form>
          </a-spin>
          <div class="rule_detail" style=" margin-top:10px ;">
              <a-descriptions title="申请作废信息" :column="4"  >
                  <a-descriptions-item v-for="(item1,index1) in retrunDetail" :span="2"  :label="item1.title" :key="index1">
                      {{item1.value}}
                  </a-descriptions-item>
              </a-descriptions>
          </div>
        </a-modal>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village'
    import Rem from '../../../../../utils/rem.js';
    import Vue from 'vue';
    Rem.getrem();
    const columns = [{
            title: '标准名称',
            dataIndex: 'charge_name',
            key: 'charge_name',
        },
        {
            title: '标准生效时间',
            dataIndex: 'charge_valid_time_txt',
            key: 'charge_valid_time_txt',
        },
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '所属收费科目',
            dataIndex: 'charge_number_name',
            key: 'charge_number_name',
        },
        {
            title: '应收费用',
            dataIndex: 'total_money',
            key: 'total_money',
        },
        {
            title: '预计计费开始时间',
            dataIndex: 'service_start_time_txt',
            key: 'service_start_time_txt',
        },
        {
            title: '预计计费结束时间',
            dataIndex: 'service_end_time_txt',
            key: 'service_end_time_txt',
        },
        {
            title: '上次度数',
            dataIndex: 'last_ammeter',
            key: 'last_ammeter',
        },
        {
            title: '本次度数',
            dataIndex: 'now_ammeter',
            key: 'now_ammeter',
        },
        {
            title: '审核状态',
            dataIndex: 'check_status_str',
            key: 'check_status_str',
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    export default {
        name: 'receivableModal',
        props: {
            // width: {
            //   type: String,
            //   default: 535 / 192 * 1 + ''
            // },
        },
        data() {
            return {
                title: '应收帐单',
                labelCol: {
                  xs: {
                    span: 24
                  },
                  sm: {
                    span: 7
                  }
                },
                wrapperCol: {
                  xs: {
                    span: 24
                  },
                  sm: {
                    span: 13
                  }
                },
                visible: false,
                text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
                activeKey: ['0'],
                activeKeys: ['0'],
                expandIconPosition: 'left',
                loading: false,
                columns,
                year: '',
                room_id: '',
                position_id: '',
                key_id: '',
                type: '',
                OrderData: [],
                yearindex: '',
                monthindex: '',
                month: '',
                spinning: false,
                firstLoad: false,
                visible_invalid:false,
                invalidReasons:'',
                order_id :0,
                confirmLoading:false,
                lastIndex: 1,
                lastChildIndex: 1,
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { keyword: '',key_val:'name',key_val1:'paytime',garage_id:'0',pay_type:'0',project_id:'0', page: 1 },
                page: 1,
                widthDrawer: 1300,
                lastinfo: {},
                visible_details:false,
                currentIndex:0,
                apply_check_info:{},
                dataCheckDetail:[],
                show_check_detail:false,
                details_data:[],
                checkVisible:false,
                retrunDetail:[],
                checkTitle: '作废审核',
                checkTitleTip: '申请作废信息',
                tip: '作废订单',
                check_order_record:{},
                check_post:{
                  order_id:0,
                  xtype: 'order_discard',
                  bak: '',
                  status: 1,
                },
                role_discard:0,
            }
        },
        created() {
            if(window.screen.width < 1400){
                this.widthDrawer = 900
            }else if(window.screen.width < 1600){
                this.widthDrawer = 1250
            }
        },
        methods: {
            onClose() {
                this.visible = false
                setTimeout(() => {
                    this.form = this.$form.createForm(this)
                }, 500)
                
                this.OrderData = []
                this.yearindex = ''
                this.monthindex = ''
                this.year = ''
                this.month = ''
                console.log("OrderData-----3",this.OrderData)
            },
            async changeyear(index) {
                console.log("key", index)
                this.yearindex = index
                this.OrderData[this.yearindex].active = !this.OrderData[this.yearindex].active
                this.year = this.OrderData[this.yearindex].number;
                let res = await this.getOrderStatisticsByYears()
                this.OrderData[this.yearindex].childerList = res.list
                for(let i in res.list){
                    this.OrderData[this.yearindex].childerList[i].active = false
                }
                
                console.log("OrderData-----1",this.OrderData)
                this.$forceUpdate()
            },
            changemonth(index,idx) {
                console.log("key--1", index,idx)
                this.yearindex = index
                this.monthindex = idx
                console.log("OrderData----2",this.OrderData)
                this.OrderData[this.yearindex].childerList[this.monthindex].active = !this.OrderData[this.yearindex].childerList[this.monthindex].active
                this.month = this.OrderData[this.yearindex].childerList[this.monthindex].month;
                console.log("month",this.month)
                this.receivableOrderInfo()
                this.$forceUpdate()
            },
            getOrderStatisticsByYears() {
                return new Promise(resolve=>{
                   this.spinning = true
                   this.request(villageApi.getOrderStatisticsByYears, {
                       key_id: this.key_id,
                       year: this.year,
                       type: this.type,
                   }).then((res) => {
                       resolve(res)
                       // if (this.yearindex) {
                       //     this.OrderData[this.yearindex].childerList = new Array();
                       //     this.OrderData[this.yearindex].childerList = res.list
                       //     if(this.firstLoad){
                       //         this.yearindex = 0
                       //         this.month = res.list[0].month;
                       //         this.receivableOrderInfo()
                       //         this.firstLoad = false
                       //     }
                       // } else {
                       //     this.OrderData = res.list;
                       //     this.OrderData[0].childerList = new Array();
                       // }
                       this.spinning = false
                   }) 
                })
            },
            // 详情点击未交列表
            showpopup_detailsList(record) {
                this.visible_details = true;
               if(record.check_apply_id>0){
                   this.show_check_detail=true;
               }else{
                   this.show_check_detail=false;
               }
                this.getNeedPayOrderInfo(record)
                this.getCheckauthDetail(record)
            },
            getCheckauthDetail(record){
                this.loading = true;
                this.request(villageApi.getCheckauthDetail,{order_id:record.order_id,check_apply_id:record.check_apply_id,xtype:'order_discard',page:1})
                    .then((res) => {
                        this.dataCheckDetail = res.list
                        this.loading = false
                        this.apply_check_info=res.apply_info
                    })
            },
            changeXTab(index, xtype = 'order_discard'){
                this.currentIndex = index
                if(this.currentIndex==0){
                    
                } else {
                    //this.getCheckauthDetail()
                }
            },
            handle2Cancel(e){
                this.visible_details = false;
                this.order_id = 0;
                this.currentIndex=0;
            },
            getNeedPayOrderInfo(record){
                this.request(villageApi.getPayOrderInfo, {
                  order_id: record.order_id,
                }).then(res => {
                  if (res) {
                    this.details_data = res;
                  }
                });
            },
            needCheckOrder(record_tmp){
                this.checkVisible=true;
                this.check_order_record=record_tmp;
                let apply_info=[];
                // 申请修改订单金额信息
                if (record_tmp.order_apply_info && record_tmp.order_apply_info.orderApplyType == 'modify_money_check') {
                  apply_info.push({ title: '申请时间', value: record_tmp.order_apply_info.opt_time_str })
                  apply_info.push({ title: '订单金额', value: record_tmp.order_apply_info.modify_money + '元' })
                  apply_info.push({ title: '修改金额', value: record_tmp.order_apply_info.money + '元' })
                  apply_info.push({ title: '修改原因', value: record_tmp.order_apply_info.modify_reason })
                  this.checkTitle = '订单修改金额审核';
                  this.checkTitleTip = '订单修改金额申请信息';
                  this.tip = '订单修改金额';
                  this.check_post.xtype = 'modify_money_check';
                } else {
                  apply_info.push({ title: '申请时间', value: record_tmp.order_apply_info.opt_time_str })
                  apply_info.push({ title: '作废账单金额', value: record_tmp.order_apply_info.total_money + '元' })
                  apply_info.push({ title: '作废原因', value: record_tmp.order_apply_info.discard_reason })
                  this.checkTitle = '作废审核';
                  this.checkTitleTip = '作废申请信息';
                  this.tip = '作废订单';
                  this.check_post.xtype = 'order_discard';
                }
                this.retrunDetail=apply_info;
            },
            checkHandleCancel(){
                this.checkVisible=false;
                this.currentIndex=0;
                this.check_order_record={};
                this.retrunDetail=[];
            },
            checkHandleSubmit(){
                this.check_post.order_id=this.check_order_record.order_id
                  let titleStr='作废审核确认';
                  let contentStr='您确认审核 通过 作废申请吗？';
                   if(this.check_post.status==2){
                      contentStr='您确认审核 不通过 作废申请吗？';
                   }
                var _this=this;
                this.$confirm({
                  title: titleStr,
                  content: contentStr,
                  onOk() {
                      _this.request(villageApi.verifyCheckauthApply, _this.check_post)
                        .then((res) => {
                          console.log('res', res)
                          _this.$message.success('操作成功')
                          _this.checkVisible = false
                          _this.confirmLoading = false
                          _this.receivableOrderInfo()
                        })
                  },
                  onCancel() {},
                });
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.page = page;
                this.pagination.pageSize = pageSize
                this.receivableOrderInfo()
                console.log('onTableChange==>', page, pageSize)
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                  this.pagination.current = e.current;
                    this.page = e.current;
                    this.receivableOrderInfo()
                }
            },
            receivableOrderInfo() {
                this.loading = true
                this.request(villageApi.receivableOrderInfo, {
                    source: 1,
                    page:this.page,
                    limit:this.pagination.pageSize,
                    key_id: this.key_id,
                    month: this.month,
                    type: this.type,
                }).then((res) => {
                    this.pagination.total = res.count ? res.count : 0
                    this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    this.OrderData[this.yearindex].childerList[this.monthindex].childerList = res.list
                    this.role_discard=res.role_discard!=undefined ? res.role_discard:1;
                    console.log("this.OrderData",this.OrderData,res.list)
                    this.loading = false
                })
            },
            async info(room_id, position_id,item) {
                console.log("测试传递的id", room_id, position_id)
                this.room_id = room_id;
                this.position_id = position_id;
                this.order_id = 0;
                this.lastinfo = item
                if (position_id > 0) {
                    this.type = 'position';
                    this.key_id = position_id;
                } else {
                    this.type = 'room';
                    this.key_id = room_id;
                }
                // this.getOrderStatisticsByYears();
                let res = await this.getOrderStatisticsByYears()
                console.log("OrderData-----5",this.OrderData,res)
                this.OrderData = res.list;
                for(let i in res.list){
                    this.OrderData[i].childerList = new Array();
                    this.OrderData[i].active = false
                }
                console.log("OrderData-----4",this.OrderData)
                this.visible = true;
            },
            invalidShow(order_id){
                this.visible_invalid = true;
                this.order_id = order_id;
            },
            confirm_invalid() {
                if (this.invalidReasons == '') {
                    this.$message.warning('请填写作废原因');
                    return
                }
                this.discardOrder(this.order_id)
            },
            // 作废账单
            discardOrder(order_id) {
                this.request(villageApi.discardOrder, {
                    discard_reason: this.invalidReasons,
                    order_id: this.order_id,
                }).then(res => {
                    console.log('+++++++Single', res);
                    if (res) {
                        this.$message.success('操作成功');
                        this.invalidReasons = '';
                        this.order_id = 0;
                        this.visible_invalid = false;
                        this.receivableOrderInfo()
                    }
                });
            },
            handleCancel1 () {
                this.visible_invalid = false;
            },
            handleClick(event) {
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation();
            },
        },
    }
</script>

<style lang="less" scoped>
    @rem: 192; //定义页面尺寸
    .flex_text_box {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .margin_top_10 {
      margin-top: 10px;
    }
    .text_1 {
      flex-shrink: 0;
    }
    // 横向居中
    .flex_row_center {
    	display: flex;
    	flex-direction: row;
    	align-items: center;
    }
    .flex_row_center_color{
        background-color: #efefef;
    }
    // 竖向
    .flex_column {
    	display: flex;
    	flex-direction: column;
    }
    .top_title {
        width: 25%;
        color: #000;
        font-weight: 600;
        margin-bottom: 15px;
    }
    .fix_top_title {
        width: 35%;
    }
    .top_title_color {
        color: #686868;;
    }
    .father_box {
        width: 100%;
        height: 100%;
        border: 1px solid #d9d9d9;;
        background-color: #fafafa;
        .top_box {
            width: 100%;
            height: 46px;
            justify-content: space-between;
            cursor: pointer;
            position: relative;
            .right_icon {
                font-size: 20px;
                font-weight: 600;
                margin: 0 20px;
            }
            .title {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(0, 0, 0, 0.85);
                font-weight: bold;
            }
            .text_1 {
                color: rgba(0, 0, 0, 0.85);
                margin-right: 20px;
            }
        }
        .childer_box {
            border: 0px solid #d9d9d9;
            border-top:  1px solid #d9d9d9;
            background-color: #FFFFFF;
            .right_icon {
                font-size: 20px;
                font-weight: 600;
                margin: 0 20px;
                margin-left: 30px;
            }
            .title_1 {
                position: absolute;
                left: 55px;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 400;
            }
        }
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
</style>
