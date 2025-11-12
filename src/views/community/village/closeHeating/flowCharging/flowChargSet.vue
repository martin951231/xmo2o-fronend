<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="40">
                  <span class="box_width label_col">优惠百分比</span>
                  <a-input-number :min="0" :max="100" placeholder="优惠百分比" :precision="2" v-model="data.order_yh_per"  /> % （0到100间数字，0表示和100表示没有优惠）
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" class="cont_box">
              <a-col :span="40">
                  <span class="box_width label_col">单价（每吉焦）：</span>
                  <a-input-number :min="0" :max="999999" placeholder="请输入一个数字" :precision="2" v-model="data.unit_price_base"  /> （0表示未设置）
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
        <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <span class="box_width label_col ant-form-item-required">申请流量计费时间范围</span>
                  <span>
                    <a-date-picker
                      v-model="data.apply_start_day" 
                      @change="serviceStartTimeChange"
                      format="MM-DD"
                      placeholder="请选择开始时间"
                    /> ~
                     <a-date-picker
                      v-model="data.apply_end_day" 
                      @change="serviceEndTimeChange"
                      format="MM-DD"
                      placeholder="请选择结束时间"
                    />
                  </span>
         </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<style >
  .imgname {
    width: 100px;
  }
</style>
<script>
  import villageApi from '@/api/community/village'

  import moment from 'moment';

  export default {
    components: {  },
    data () {
      return {
        title: '流量计费设置',
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
          dateFormat: 'YYYY-MM-DD',
          data:{order_yh_per:0,unit_price_base:0,apply_start_day:'',apply_end_day:''},
      }
    },
      mounted() {
      },
    methods: {
        moment,
        // 处理时间
        date_moment(time, dateFormat) {
            if (!time) {
                return ''
            }
            return moment(time, dateFormat);
        },
        set() {
            let that = this
            that.request(villageApi.getFlowChargingProtocol,{'xtype':'flowCharg'}).then((res) => {
                that.data = res
                this.visible = true;
            })
        },
        // 日期切换，重新赋值
            serviceStartTimeChange(date,dateString){
                this.data.apply_start_day=dateString;
            },
            serviceEndTimeChange(date,dateString){
                this.data.apply_end_day=dateString;
            },

      handleSubmit () {
          const {
              form: {
                  validateFields
              }
          } = this;
          validateFields((errors, values) => {
              if (!errors) {
                  const indexParams = { ...values }
                  indexParams.order_yh_per = this.data.order_yh_per
                  indexParams.unit_price_base = this.data.unit_price_base
                  indexParams.apply_start_day = this.data.apply_start_day
                  indexParams.apply_end_day = this.data.apply_end_day
                  indexParams.xtype = 'flowCharg'
                  let that = this
                  that.request('/community/village_api.Heating/flowChargSet',indexParams).then((res) => {
                      this.$message.success('操作成功')
                      setTimeout(() => {
                        this.form = this.$form.createForm(this)
                        this.visible = false;
                        this.confirmLoading = false;
                      }, 1000)
                  })
              } else {
                  // this.confirmLoading = false
              }
          })
      },
      handleCancel () {
        this.visible = false
        setTimeout(() => {
          this.form = this.$form.createForm(this)
        }, 500)
      }
    }
  }
</script>

<style lang="less" scoped>

    /deep/ .cont_box .ant-form-item-control{
        line-height: 25px !important;
    }

    /deep/ .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
        margin-bottom: 10px !important;
    }
    /deep/ .box_width{
        display: inline-block;
        width: 150px;
    }
    /deep/ .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }

    /deep/ .ant-input-number{
        width: 150px !important;
        display: inline-block;
    }
    /deep/ .adress_box{
        padding: 5px;color: white;background: #87B87F;margin-left: 5px;border-radius:5px;cursor: pointer
    }
    /deep/ .times_but{
        font-size: 24px;font-weight: bold;cursor: pointer;display: inline-block;
    }
    /deep/ .el-date-editor{
        margin-right: 5px !important;
    }
    /deep/ .time_box{
        display: inline-block;
        margin-bottom: 5px !important;
    }
    /deep/ .set_time{
        display: inline-block;margin-left: 30px !important;
    }
    /deep/ .time_right{
        display: inline-block;width: 80% !important;margin-left: 1px !important;position: relative;
    }
    /deep/ .ant-upload-list{
        margin-bottom: 0 !important;
    }

</style>