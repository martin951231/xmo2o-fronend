<template>
  <a-modal :title="title" :width="700" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
        <a-form-item label="退款模式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select v-if="order_type=='deposit_new'" placeholder="请选择支付方式" style="width: 177px" default-value="0" v-model="post.refund_type" :disabled="is_show" @change="handleChange"	>
              <a-select-option :value="0">请选择</a-select-option>
              <a-select-option :value="2">退还押金抵扣费用</a-select-option>
              <a-select-option :value="1">原路退款</a-select-option>
            </a-select>
            <a-select v-else placeholder="请选择支付方式" style="width: 177px" default-value="0" v-model="post.refund_type" :disabled="is_show" @change="handleChange"	>
              <a-select-option :value="0">请选择</a-select-option>
              <a-select-option :value="2" v-if="is_can_create_order>0">退款且还原账单</a-select-option>
              <a-select-option :value="1">仅退款，不还原账单</a-select-option>
            </a-select>
          </a-col>
        </a-form-item>
        <a-form-item label="退款金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="10">
            <a-input
              style="width: 180px"
              placeholder="请输入退款金额"
              v-model="post.refund_money" :disabled="is_input"/>
          </a-col>
          <a-col :span="12">
              <span v-if="is_stored_type_car_order>0">储值车现有余额：{{stored_balance}} 元</span>
          </a-col>
          <a-col :span="12" v-if="offline_pay_money>0">
              <span>线下支付金额：{{offline_pay_money}} 元</span><span v-if="refund_offline_money>0" style="color: #000;font-weight: bold;">（已退）</span>
          </a-col>
        </a-form-item>
        <!--
        <a-form-item label="线下退款金额" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="pay_type_way==9 && offline_pay_money>0 ">
          <a-col :span="10">
            <a-input
              style="width: 180px"
              placeholder="请输入线下退款金额"
              v-model="post.offline_pay_money" :disabled="is_input"/>
          </a-col>
        </a-form-item>
        -->
        <a-form-item label="退款说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-textarea
              ref="textareax"
              style="width: 180px"
              placeholder="请输入退款说明"
              v-model="post.refund_reason"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
    <div class="refund_type_desc">
    <a-descriptions v-if="order_type=='deposit_new'" title="退款模式说明"  :column="2" :bordered="true">
        <a-descriptions-item :span="2"  label="原路退款" >将当前已缴账单的费用进行退款变更账单状态且将对应产生的服务时间进行退回还原；</a-descriptions-item>
        <a-descriptions-item :span="2" label="退还押金抵扣费用" >只是将已缴的费用对应进行退款操作并变更账单状态，所收费用不退费，生成押金抵扣券,可用于在缴费时进行抵扣。</a-descriptions-item>
    </a-descriptions>
    <a-descriptions v-else title="退款模式说明"  :column="2" :bordered="true">
        <a-descriptions-item :span="2"  label="退款且还原账单" >将当前已缴账单的费用进行退款变更账单状态且将对应产生的服务时间进行退回还原，自动生成一个相同的未缴账单；</a-descriptions-item>
        <a-descriptions-item :span="2" label="仅退款，不还原账单" >只是将已缴的费用对应进行退款并变更账单状态，关联变更信息不做任何还原操作；主要应用于线上支付，例如：价格波动导致差价，退还差价，新版停车费，但是服务不变；</a-descriptions-item>
    </a-descriptions>
    </div>
    <div class="rule_detail" style=" margin-top:10px ;">
        <a-descriptions title="基本信息" :column="4"  >
            <a-descriptions-item v-for="(item1,index1) in retrunDetail" :span="2"  :label="item1.title" >
                {{item1.value}}
            </a-descriptions-item>
        </a-descriptions>
    </div>
  </a-modal>
</template>
<style>
  .imgname {
    width: 100px;
  }
  .refund_type_desc table{font-weight: bold;}
  .refund_type_desc  .ant-descriptions-item-colon,.refund_type_desc .ant-descriptions-item-content{padding: 8px 20px;}
</style>
<script>
  import villageApi from '@/api/community/village';
  import configHouseMeterApi from "@/api/community/houseMeter";

  export default {
    components: {},
    data() {
      return {
        title: '退款',
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 5
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 18
          }
        },
        confirmLoading: false,
        is_show:false,
        is_input:false,
        form: this.$form.createForm(this),
        visible: false,
        order_id: 0,
        pay_money:0,
        pay_type_way:0,
        retrunDetail:[],
        post: {
          id: 0,
          refund_money: '',
          refund_type: 0,
          refund_reason: '',
          offline_pay_money:0,
        },
        order_type: '',
        order_info:{},
        is_can_create_order:0,
        stored_balance:0,
        is_stored_type_car_order:0,
        offline_pay_money:0,
        refund_offline_money:0,
      }
    },
    mounted() {
    },
    methods: {
      add(order_id,pay_money,pay_type_way,dataObj, order_type='',orecord) {
        console.log('order_type====>', order_type)
        this.is_input=false
        this.order_type = order_type;
        this.$forceUpdate()
        this.title = '退款';
        if(orecord!=undefined && orecord && orecord.offline_pay_money){
            this.offline_pay_money=orecord.offline_pay_money*1;
            this.offline_pay_money=this.offline_pay_money.toFixed(2)
        }
        if(this.offline_pay_money>0){
            pay_money=pay_money-this.offline_pay_money;
            pay_money=pay_money>0 ? pay_money.toFixed(2):0;
        }
        this.retrunDetail=dataObj;
        this.post = {
          order_id:0,
          id: 0,
          refund_money: pay_money,
          refund_type: 0,
          refund_reason: '',
          offline_pay_money:this.offline_pay_money,
        };
        this.order_id = order_id;
        this.pay_money = pay_money;
        if(pay_type_way!=undefined){
            this.pay_type_way=pay_type_way;
        }
        if(this.pay_type_way==2){
           // this.is_input=true
        }
        this.getRefundType();
        this.visible = true;
      },
      handleChange(value) {
        this.is_input=false
        if (value==2){
          this.post.refund_money=this.pay_money
          this.is_input=true
        }
        /* 去掉线下退款不可改金额判断
        if(this.pay_type_way==2){
            this.post.refund_money=this.pay_money
            this.is_input=true
        }
        */
      },
      getRefundType(){
        this.request(villageApi.getRefundtype, {order_id:this.order_id})
          .then((res) => {
              this.is_show=false
              this.is_can_create_order=0;
              this.stored_balance=0;
              this.order_info={};
              if(res.is_can_create_order!=undefined){
                  this.is_can_create_order=res.is_can_create_order;
              }else{
                  this.is_can_create_order=1;
              }
              if(res.refund_money!=undefined && res.refund_money>0){
                  this.post.refund_money=this.pay_money-res.refund_money;
                  if(this.post.refund_money<=0){
                      this.post.refund_money=0;
                  }
                  this.post.refund_money=this.post.refund_money.toFixed(2);
              }
              if(res.refund_offline_money!=undefined){
                  this.refund_offline_money=res.refund_offline_money;
              }
              this.is_stored_type_car_order=0;
              if(res.order_info!=undefined){
                  this.order_info=res.order_info
                  if(this.order_info.car_type=='stored_type'){
                      this.is_stored_type_car_order=1;
                      this.stored_balance=this.order_info.stored_balance!=undefined && this.order_info.stored_balance ? this.order_info.stored_balance:0;
                      this.stored_balance=this.stored_balance.toFixed(2);
                      this.post.refund_money=this.stored_balance;
                      this.title='储值车【'+this.order_info.car_number+'】订单退款'
                      if(this.stored_balance==0 || this.stored_balance=='0'){
                          this.is_input=true
                      }
                  }else if(this.order_info.car_type=='temporary_type' && this.order_info.car_number){
                       this.title='临时停车【'+this.order_info.car_number+'】订单退款'
                  }else if(this.order_info.car_type=='month_type' && this.order_info.car_number){
                       this.title='月租车【'+this.order_info.car_number+'】订单退款'
                  }
              }
              if(res.refund_type!=undefined && res.refund_type==2){
                  this.post.refund_type=2
              }else if(res.refund_type!=undefined){
                  this.post.refund_type=1
              }
              if(res.refund_type!=undefined){
                 this.is_show=true
              }

          })
      },
      handleSubmit() {
        this.post.order_id=this.order_id
        if(this.post.refund_type<1 ){
            this.$message.warning('请选择退款模式！');
            return false;
        }
        console.log('post==>',this.post);
        this.post.refund_money=this.post.refund_money*1;
        this.post.refund_money=this.post.refund_money.toFixed(2);
        if (!(this.post.refund_money>0)){
            this.$message.warning('退款金额必须大于0！');
            return false;
        }
        if(this.order_info && this.order_info.car_type!=undefined && this.order_info.car_type=='stored_type'){
            if(this.post.refund_money>this.stored_balance){
                this.$message.warning('储值车退款金额不能大于储值车现有余额');
                return false;
            }
        }
        if(this.pay_type_way==2 && this.post.refund_reason.length<1){
            this.$refs.textareax.focus(); 
            this.$message.warning('线下支付的订单，退款时请写上退款原因！');
            return false;
        }
      let contentStr='';
      let titleStr='';
      if(this.post.refund_type==1){
          titleStr='退款确认（仅退款，不还原账单）';
          contentStr="只是将已缴的费用对应进行退款并变更账单状态，关联变更信息不做任何还原操作；主要应用于线上支付，例如：价格波动导致差价，退还差价，新版停车费，但是服务不变；";
      }else if(this.post.refund_type==2){
          titleStr='退款确认（退款且还原账单）';
          contentStr="将当前已缴账单的费用进行退款变更账单状态且将对应产生的服务时间进行退回还原，自动生成一个相同的未缴账单；";
      }
      var _this=this;
      this.$confirm({
        title: titleStr,
        content: contentStr,
        onOk() {
            _this.request(villageApi.addRefundInfo, _this.post)
              .then((res) => {
                console.log('res', res)
                _this.$message.success('操作成功')
                setTimeout(() => {
                  _this.form = _this.$form.createForm(_this)
                  _this.visible = false
                  _this.confirmLoading = false
                  _this.is_show = false
                  _this.is_input = false
                  _this.$emit('ok')
                }, 1500)

              })
        },
        onCancel() {},
      });

      },
      handleCancel() {
        this.visible = false
        setTimeout(() => {
          this.post.id = 0;
          this.form = this.$form.createForm(this)
        }, 500)
      },
    },
  }
</script>