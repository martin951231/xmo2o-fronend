<template>
  <a-modal :title="title" :width="700" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
        <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
          <a-col :span="20">
              <a-radio-group name="radioGroup" :default-value="1" v-model="post.status">
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
              v-model="post.bak"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
    <div class="rule_detail" style=" margin-top:10px ;">
        <a-descriptions :title="apply_title" :column="4"  >
            <a-descriptions-item v-for="(item1,index1) in retrunDetail" :span="item1.xspan ? item1.xspan:2"  :label="item1.title" :key="index1">
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

  export default {
    components: {},
    data() {
      return {
        title: '退款审核',
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        visible: false,
        order_id: 0,
        apply_title:'申请退款信息',
        retrunDetail:[],
        order_apply_info:{},
        post: {
          order_id:0,
          xtype: 'order_refund',
          bak: '',
          status: 1,
          check_apply_id:0,
        },
      }
    },
    mounted() {
    },
    methods: {
      add(order_id,order_apply_info,xtype) {
        this.title = '退款审核';
        this.visible = true;
        this.post = {
          order_id:order_id,
          xtype: xtype,
          bak: '',
          status: 1,
          check_apply_id:0,
        };
        if(xtype=='order_discard'){
            this.title = '作废审核';
            this.apply_title= '申请作废信息';
        }
        if(xtype=='modify_money_check'){
            this.title = '修改金额审核';
            this.apply_title= '申请修改金额信息';
        }else if(xtype=='order_servicetime_check'){
            this.title = '房间修改计费时间审核';
            this.apply_title= '申请修改计费时间信息';
        }
        this.order_apply_info=order_apply_info;
        this.order_id = order_id;
        let apply_info=[];
        if(order_apply_info && xtype=='order_refund'){
            apply_info.push({title:'申请时间',value:order_apply_info.opt_time_str});
            let refund_type_str='';
            if(order_apply_info.refund_type==1){
                refund_type_str='仅退款，不还原账单';
            }else if(order_apply_info.refund_type==2){
                refund_type_str='退款且还原账单';
            }
            apply_info.push({title:'退款模式',value:refund_type_str});
            apply_info.push({title:'申请退款金额',value:order_apply_info.refund_money+'元'});
            apply_info.push({title:'退款原因',value:order_apply_info.refund_reason});
        }else if(order_apply_info && xtype=='order_discard'){
            apply_info.push({title:'申请时间',value:order_apply_info.opt_time_str});
            apply_info.push({title:'作废账单金额',value:order_apply_info.total_money+'元'});
            apply_info.push({title:'作废原因',value:order_apply_info.discard_reason});
        }else if(order_apply_info && xtype=='modify_money_check'){
            apply_info.push({ title: '申请时间', value: order_apply_info.opt_time_str })
            apply_info.push({ title: '订单金额', value: order_apply_info.modify_money + '元' })
            apply_info.push({ title: '修改金额', value: order_apply_info.money + '元' })
            apply_info.push({ title: '修改原因', value: order_apply_info.modify_reason })
        }else if(order_apply_info && xtype=='order_servicetime_check'){
            this.post.check_apply_id=order_apply_info.id;
            apply_info.push({ title: '申请时间', value: order_apply_info.add_time_str })
            apply_info.push({ title: '申请房间', value: order_apply_info.room_address })
            apply_info.push({ title: '申请收费类别', value: order_apply_info.charge_type_name })
            apply_info.push({ title: '申请收费项目', value: order_apply_info.project_name })
            apply_info.push({ title: '当前计费时间', xspan:4,value: order_apply_info.currentServiceTime })
            apply_info.push({ title: '申请修改计费时间', xspan:4,value: order_apply_info.service_start_time_str+' 至 '+ order_apply_info.service_end_time_str })
            apply_info.push({ title: '申请原因', xspan:4, value: order_apply_info.apply_reason })
        }
        this.retrunDetail=apply_info;
      },
      handleSubmit() {
        this.post.order_id=this.order_id
        let contentStr='您确认审核 通过 退款申请吗？';
        if(this.post.status==2){
            contentStr='您确认审核 不通过 退款申请吗？';
        }
        let titleStr='退款审核确认';
        if(this.post.xtype=='order_discard'){
            titleStr='作废审核确认';
             contentStr='您确认审核 通过 作废申请吗？';
            if(this.post.status==2){
                contentStr='您确认审核 不通过 作废申请吗？';
            }
        }else if(this.post.xtype=='modify_money_check'){
            titleStr='订单修改金额审核确认';
             contentStr='您确认审核 通过 订单修改金额申请吗？';
            if(this.post.status==2){
                contentStr='您确认审核 不通过 订单修改金额申请吗？';
            }
        }else if(this.post.xtype=='order_servicetime_check'){
            titleStr = '房间修改计费时间审核确认';
            contentStr='您确认审核 通过 房间修改项目【'+this.order_apply_info.project_name+'】计费时间申请吗？';
            if(this.post.status==2){
                contentStr='您确认审核 不通过 房间修改项目【'+this.order_apply_info.project_name+'】计费时间申请吗？';
            }
        }
      var _this=this;
      this.$confirm({
        title: titleStr,
        content: contentStr,
        onOk() {
            _this.request(villageApi.verifyCheckauthApply, _this.post)
              .then((res) => {
                console.log('res', res)
                _this.$message.success('操作成功')
                setTimeout(() => {
                  _this.form = _this.$form.createForm(_this)
                  _this.visible = false
                  _this.confirmLoading = false
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
          this.form = this.$form.createForm(this)
        }, 500)
      },
    },
  }
</script>