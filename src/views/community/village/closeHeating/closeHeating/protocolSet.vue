<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="30">
                  <span class="box_width label_col ant-form-item-required" style="width: 140px !important;">停暖协议展示</span>
                  <a-radio-group name="is_repeat" v-model="data.is_open">
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
                  <span class="box_width label_col ant-form-item-required">协议标题</span>
                  <a-input
                      :maxLength="100"
                      style="width: 300px"
                      placeholder="请填写协议标题"
                      v-decorator="['title',{ initialValue: data.title,rules: [{ required: true, message: L('请填写协议标题！') }] }]"
                  />
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" class="cont_box">
              <a-col :span="40">
                  <span class="box_width label_col ant-form-item-required">协议内容</span>
                  <vue-ueditor-wrap v-model="data.content" :config="myConfig"></vue-ueditor-wrap>
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
<!--        <a-form-item label="选择打印模板" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <a-col :span="18">-->
<!--            <a-select  style="width: 300px" placeholder="请选择打印模板" v-model="template_id">-->
<!--              <a-select-option :value="item.template_id" v-for="(item,index) in template_list" :key="index">-->
<!--                {{ item.title }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </a-col>-->
<!--        </a-form-item>-->
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

  export default {
    components: { VueUeditorWrap },
    data () {
      return {
        title: '停暖协议',
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
          data:[],
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
    mounted () {
    },
    methods: {
        set() {
            let that = this
            that.request(villageApi.getCloseHeatingProtocol).then((res) => {
                that.data = res
                this.visible = true;
            })
        },

      handleSubmit () {
        // if (!this.template_id) {
          // this.$message.error('选择打印模板')
          // return false
        // }
          const {
              form: {
                  validateFields
              }
          } = this;
          validateFields((errors, values) => {
              if (!errors) {
                  console.log(values)
                  const indexParams = { ...values }
                  indexParams.is_open = this.data.is_open
                  indexParams.content = this.data.content
                  let that = this
                  that.request(villageApi.editCloseHeatingProtocol,indexParams).then((res) => {
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
        // if(this.set_type > 0){
        //   this.confirmLoading = true;
        //   this.request(villageApi.editSetPrint, {template_id:this.template_id,print_type:this.print_type}).then((res) => {
        //             this.$message.success('编辑成功')
        //             setTimeout(() => {
        //               this.form = this.$form.createForm(this)
        //               this.visible = false;
        //               this.print_type=0;
        //               this.confirmLoading = false;
        //               this.$emit('ok',{type:this.source_type,template_id:this.template_id})
        //             }, 1000)
        //           }).catch((error)=>{ })
        // }
        // else{
        //   this.$refs.PrintModel.add(this.order_id,this.template_id,this.pigcms_id,this.choice_ids);
        // }
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
        width: 97px !important;
    }
    /deep/ .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .ant-select{
        width: 300px !important;
    }
    /deep/ .ant-input-number{
        width: 300px !important;
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