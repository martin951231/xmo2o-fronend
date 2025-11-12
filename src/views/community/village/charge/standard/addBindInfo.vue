<template>
  <a-modal :title="title" :width="500" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
          <a-form-item label="收费项" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 1px;">
              <a-col :span="18">
                  {{project_name}}
                  <!--<a-input
                      style="width: 180px"
                      placeholder="请输入"
                      v-model="post.date_status" :disabled="true"/>-->
              </a-col>
          </a-form-item>
          <a-form-item label="收费标准" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 1px;">
              <a-col :span="18">
                  {{rule_name}}
                  <!--<a-input
                      style="width: 180px"
                      placeholder="请输入"
                      v-model="post.date_status" :disabled="true"/>-->
              </a-col>
          </a-form-item>
          <a-form-item label="账单生成周期模式" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 8px;">
              <a-col :span="18">
                  {{post.date_status}}
                  <!--<a-input
                      style="width: 180px"
                      placeholder="请输入"
                      v-model="post.date_status" :disabled="true"/>-->
              </a-col>
          </a-form-item>
		<a-form-item  v-if="is_grapefruit_prepaid && this.rule_info.bill_create_set>1" label="账单合并生成" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="默认为是。选择否将结合收费周期值来生成多笔按1个月计费的订单,请谨慎操作!">
		    <a-col :span="18">
			  <a-radio-group name="radioGroup" :default-value="0" v-model="post.per_one_order">
				<a-radio :value="0">是</a-radio>
				<a-radio :value="1">否</a-radio>
			  </a-radio-group>
		    </a-col>
		</a-form-item>  
          <a-form-item  label="收费周期" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="不填默认为1">
              <a-col :span="18">
                  <a-input
                      style="width: 180px"
                      placeholder="请输入收费周期时长"
                      v-model="post.cycle"/>
              </a-col>
          </a-form-item>
        <a-form-item label="账单开始生成时间" :labelCol="labelCol" :wrapperCol="wrapperCol"
                     extra="不填默认下一缴费日生成应收账单">
          <a-col :span="18">
            <a-date-picker
              v-if="is_show1 && post.order_add_time"
              :mode="date_status"
              :format="dateFormat"
              placeholder="请选择时间"
              :value="moment(post.order_add_time, 'YYYY-MM-DD')"
              @change="onChange"
              @panelChange="selectYear">
            </a-date-picker>
            <a-date-picker
              v-if="is_show1 && !post.order_add_time"
              :mode="date_status"
              :format="dateFormat"
              placeholder="请选择时间"
              @change="onChange"
              @panelChange="selectYear">
            </a-date-picker>
          </a-col>
        </a-form-item>
        <a-form-item v-if="is_show" :label="post.unit_gage" :labelCol="labelCol" :wrapperCol="wrapperCol"
                     extra="收费标准计费方式为单价*计量单位时选择的自定义计量单位，需填写自定义计量单位对应的数值">
          <a-col :span="18">
            <a-input
              style="width: 180px"
              placeholder="请输入"
              v-model="post.custom_value"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>
<style>
  .imgname {
    width: 100px;
  }
</style>
<script>
  import villageApi from '@/api/community/village';
  import moment from 'moment';


  export default {
    components: {},
    data() {
      return {
        title: '新建',
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
        dateFormat: 'YYYY-MM',
        confirmLoading: false,
        form: this.$form.createForm(this),
        sensitive_info: [],
        visible: false,
        is_show: true,
        is_show1: true,
        project_name:'',
        rule_name:'',
        post: {
          id: 0,
          type: 1,
          unit_gage: '楼道面积',
          order_add_time: '',
          custom_value: '',
          date_status:'',
          cycle:'',
          per_one_order:0,
            
        },
        dateValue: null,
        date_status: 'month',
        rule_info: [],
        bind_type: 0,
        bind: 0,
        item: [],
        positionId: [],
        pigcms_id: [],
        is_grapefruit_prepaid:0,
      }
    },
    mounted() {
    },
    methods: {
      moment,
      selectYear(date, dateString) {
          console.log('dateString',dateString)
        let d1='';
        if ( this.date_status=='month'){
          d1=moment(date).format(this.dateFormat)+'-01';
        }
        if ( this.date_status=='year'){
          d1=moment(date).format(this.dateFormat)+'-01-01';
        }
        /*
        let d2=this.rule_info.charge_valid_time1;
        if((new Date(d1.replace(/-/g,"/"))) < (new Date(d2.replace(/-/g,"/")))){
          this.$message.error('账单生效时间不能小于收费标准生效时间')
        }
        */
      },
      onChange(date, dateString){
        let d1=dateString;
        let d2=this.rule_info.charge_valid_time1;
        this.post.order_add_time = dateString;
        if((new Date(d1.replace(/-/g,"/"))) < (new Date(d2.replace(/-/g,"/")))){
          this.$message.error('账单生效时间不能小于收费标准生效时间')
        }
      },
      add(bind, rule_info, pigcms_id, positionId) {
        this.post = {
          id: 0,
          type: 1,
          unit_gage: '楼道面积',
          order_add_time: '',
          custom_value: '',
            date_status:'',
            cycle:'',
            per_one_order:0,
        };
        this.getConfigCustomization();
        if (rule_info.unit_gage != null && rule_info.unit_gage != '') {
          this.is_show = true;
          this.post.unit_gage = rule_info.unit_gage;
        } else {
          this.is_show = false;
        }
        this.visible = true;

        this.title = '确定绑定';
        this.confirmLoading=false;
        this.rule_info = rule_info;
        this.pigcms_id = pigcms_id;
        this.positionId = positionId;
        this.rule_name=rule_info.charge_name
        this.project_name=rule_info.project_name
        this.bind = bind;
        console.log('rule_info', rule_info)
          this.date_status = 'date';
          this.dateFormat = 'YYYY-MM-DD';
        if (rule_info.bill_create_set == 1) {
            this.post.date_status='按日生成'
            this.post.per_one_order=0;
        } else if (rule_info.bill_create_set == 2) {
            this.post.date_status='按月生成'
        } else {
            this.post.date_status='按年生成'
        }
      },
	  getConfigCustomization () {
	    this.request(villageApi.getConfigCustomization).then(res => {
	      if (res) {
			if(res.is_grapefruit_prepaid && res.is_grapefruit_prepaid==1){
				this.is_grapefruit_prepaid=res.is_grapefruit_prepaid;
			}else{
				this.is_grapefruit_prepaid=0;
			}
            if(this.is_grapefruit_prepaid==0){
                this.post.per_one_order=0;
            }
	      }
	    })
	  },
      handleSubmit() {
        console.log('this.bind', this.bind)
        const bindData = {}
        bindData.bind_type = this.bind
        bindData.rule_id = this.rule_info.id
        bindData.order_add_time = this.post.order_add_time
        bindData.custom_value = this.post.custom_value
        bindData.cycle = this.post.cycle
        bindData.per_one_order = this.post.per_one_order
        
        if (this.bind == 1) {
          bindData.pigcms_id = this.pigcms_id
          bindData.position_id = this.positionId
          console.log('bindData',bindData)
        } else {
          bindData.pigcms_arr=this.pigcms_id
          console.log('bindData',bindData)
        }
        this.confirmLoading = true;
        this.request(villageApi.addStandardBind, bindData)
          .then((res) => {
            if(res.status==1000 && res.msg){
                this.$message.error(res.msg)
                this.confirmLoading=false;
            }else{
                if (res.err_count) {
                    let message = '绑定失败' + res.err_count +'个';
                    if (res.errMsgStr) {
                        message = message + "【错误："+res.errMsgStr+"】"
                    } else if (res.errMsgArr && res.errMsgArr[0] && res.errMsgArr[0]['msg']) {
                        message = message + "【错误："+res.errMsgArr[0]['msg']+"】"
                    } 
                    this.$message.warning(message)
                    if (res.success_count) {
                        this.$message.warning('绑定成功' + res.success_count +'个')
                        setTimeout(() => {
                          this.form = this.$form.createForm(this)
                          this.visible = false
                          this.confirmLoading = false
                          this.$emit('ok')
                        }, 1500)
                    }else {
                        this.confirmLoading=false;
                    }
                }  else {
                  this.$message.success('绑定成功')
                  setTimeout(() => {
                    this.form = this.$form.createForm(this)
                    this.visible = false
                    this.confirmLoading = false
                    this.$emit('ok')
                  }, 1500)
                }
            }
          })
      },
      handleCancel() {
        this.visible = false
        this.confirmLoading=false;
        setTimeout(() => {
          this.post.id = 0;
          this.form = this.$form.createForm(this)
        }, 500)
      },

    },
  }
</script>