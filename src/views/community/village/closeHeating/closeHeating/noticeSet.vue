<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="30">
                  <span class="box_width label_col ant-form-item-required" style="width: 140px !important;">账单催缴设置</span>
                  <a-radio-group name="is_repeat" v-model="data.is_notice">
                      <a-radio :value="1">
                          开启
                      </a-radio>
                      <a-radio :value="0">
                          关闭
                      </a-radio>
                  </a-radio-group>
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="30">
                  <span class="box_width label_col"></span>
                  账单生成 <a-input-number :min="0" :max="9999" placeholder="请输入" :precision="0" v-model="data.notice_date"
                                       style="width:100px;" /> 天后，用户未缴费发送通知提醒
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" class="cont_box">
              <a-col :span="40">
                  <span class="box_width label_col ant-form-item-required">工作人员提醒</span>
                  工作人员给并联用户拆除管路，需要在 <a-date-picker
                  :value="date_moment(data.work_time, dateFormat)"
                  @change="onChange" /> 前完成上报管路拆除信息
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
        <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <span class="box_width label_col">已经绑定的标准</span>
               <a-select  style="width: 600px" mode="multiple" option-label-prop="label" placeholder="请至少选择一个收费标准" @change="selectRuleIds" v-model="rule_ids">
                 <a-select-option :value="item.id" v-for="(item,index) in rule_list" :key="index+1" :label="item.charge_name">
                   {{ item.charge_name}}
                  </a-select-option>
               </a-select>
             <div style="margin-left: 135px;">最多能绑定5个。用户在申请停暖时，展示用户停暖后应缴费用</div>
         </a-form-item>
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="30">
                <span class="box_width label_col">停暖时间范围</span>
                <a-range-picker @change="dateOnChange" :allowClear="true" format="MM月DD日" v-model="stopDateRange" style="width: 260px"></a-range-picker>
              </a-col>
              <a-col :span="6"></a-col>
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
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import moment from 'moment';

  export default {
    components: { VueUeditorWrap },
    data () {
      return {
        title: '账单提醒设置',
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
          stopDateRange: ['2024-10-15', '2025-03-15'],
          data:{},
          rule_list:[],
          rule_ids:[],
          myConfig: {
              enableAutoSave: false,
              autoSyncData: false,
              // 编辑器不自动被内容撑高
              autoHeightEnabled: false,
              // 初始容器高度
              initialFrameHeight: 240,
              // 初始容器宽度
              initialFrameWidth: '100%',
              // 上传文件接口
              serverUrl: '/v20/public/static/UEditor/php/controller.php',
              // UEditor 文件存放位置
              UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
              toolbars: [
                  [
                      'source', //源代码
                      '|',
                      'fontfamily',//字体
                      'fontsize',//字号
                      '|',
                      'forecolor', //字体颜色
                      'backcolor', //背景色
                      'bold', //加粗
                      'italic',//斜体
                      'underline',//下划线
                      'removeformat',//清除格式
                      '|',
                      'justifyleft',//居左对齐
                      'justifycenter',//居中对齐
                      'justifyright',//居右对齐
                      'insertorderedlist', //有序列表
                      'insertunorderedlist',//无序列表
                      '|',
                      'emotion',//表情
                      'simpleupload',//单图上传
                      'fullscreen', //全屏
                  ]
              ],
          },

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
        // 日期切换，重新赋值
        dateOnChange(date, dateString) {
            console.log('date', date)
            console.log('dateString', dateString)
            if (dateString[0] && dateString[1]) {
                this.data.stop_heating_start = dateString[0];
                this.data.stop_heating_end = dateString[1];
            } else {
                this.data.stop_heating_start = '10月15日';
                this.data.stop_heating_end = '03月15日';
            }
        },
        set() {
            let that = this
            that.rule_ids=[];
            that.request(villageApi.getCloseHeatingProtocol,{'xtype':'notice'}).then((res) => {
                that.data = res
                if(res.ruleData!=undefined){
                    that.rule_list=res.ruleData.list;
                }
                if(res.rule_id!=undefined && res.rule_id){
                    that.rule_ids=res.rule_id;
                }
                this.visible = true;
                if (res.stopDateRange) {
                    this.stopDateRange = res.stopDateRange
                }
            })
        },
        onChange(date, dateString){
            this.data.work_time = dateString;
            console.log(date, dateString);
        },
      selectRuleIds(value){
          console.log('ruleIds',value)
          if(this.rule_ids.length>=5) {
              this.rule_ids.splice(5, 1)
          }
          console.log('ruleIds_splice',this.rule_ids)
      },
      handleSubmit () {
          const {
              form: {
                  validateFields
              }
          } = this;
          validateFields((errors, values) => {
              if (!errors) {
                  console.log(values)
                  const indexParams = { ...values }
                  indexParams.is_notice = this.data.is_notice
                  indexParams.work_time = this.data.work_time
                  indexParams.notice_date = this.data.notice_date
                  indexParams.rule_id = this.rule_ids
                  indexParams.xtype = 'notice'
                  if (this.data.stop_heating_start && this.data.stop_heating_end) {
                      indexParams.stop_heating_start = this.data.stop_heating_start
                      indexParams.stop_heating_end = this.data.stop_heating_end
                  } else {
                      indexParams.stop_heating_start = '10月15日'
                      indexParams.stop_heating_end = '03月15日'
                  }
                  let that = this
                  that.request(villageApi.setOrderNotice,indexParams).then((res) => {
                      this.$message.success('修改成功')
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
        this.print_type=0;
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
        width: 110px !important;
    }
    /deep/ .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }

    /deep/ .ant-input-number{
        width: 100px !important;
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