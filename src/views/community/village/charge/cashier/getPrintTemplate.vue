<template>
  <a-modal :title="title" :width="500" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <div style="margin-bottom: 20px" v-if="is_set" v-html="set_msg"></div>
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
        <a-form-item label="选择打印模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select  style="width: 300px" placeholder="请选择打印模板" v-model="template_id">
              <a-select-option :value="item.template_id" v-for="(item,index) in template_list" :key="index">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
    <print-order ref="PrintModel"/>
  </a-modal>
</template>
<style >
  .imgname {
    width: 100px;
  }
</style>
<script>
  import villageApi from '@/api/community/village'
  import PrintOrder from '@/views/community/village/charge/cashier/printOrder'

  export default {
    components: { PrintOrder },
    data () {
      return {
        title: '选择打印模板',
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
        template_id:undefined,
        template_list:[],
        pigcms_id:0,
        choice_ids:[],
        is_set:false,
        set_msg:'',
        set_type:0,
        source_type:0,
        print_type:0, //0已缴费账单模板设置 1待缴费账单设置
      }
    },
    mounted () {
    },
    methods: {
      add(order_id,pigcms_id,type=0,print_type) {
        this.source_type=0;
        if(print_type!=undefined && print_type){
            this.print_type=print_type;
        }else{
            this.print_type=0;
        }
        if(type == 0){
          this.title = '选择打印模板';
          this.is_set=false;
          this.set_msg='';
        }
        else{
          this.is_set=true;
          this.title = '设置打印模板';
          if(type == 1){
            this.source_type=1;
            this.set_msg='1、在收银台设置打印模板，收银台支持打印功能。打印功能；不设置打印模板，则不支持。<br/>2、设置打印模板后，在收银台显示已缴账单按钮，进入查看所有已缴账单数据。';
          }else if(type == 2){
            this.set_msg='1、设置打印模板后，联动收银台打印模板功能。<br/>2、设置打印模板后，<span style="color: #1890ff">已缴账单</span>列表点击<span style="color: #1890ff">打印</span>按钮直接打印';
          }
        }
        if(this.print_type==1){
            this.title = '设置待缴账单打印模板';
            this.set_msg='1、设置<span style="color: #1583e3">待缴</span>账单打印模板后，设置后此模板用于<span style="color: #1583e3">未交费</span>的账单打印';
        }else if(this.print_type==3){
            this.title = '设置退款账单打印模板';
            this.set_msg='1、设置<span style="color: #1583e3">退款</span>账单打印模板后，设置后此模板用于<span style="color: #1583e3">已退款</span>的账单打印';
        }
        this.set_type=type;
        this.template_id=undefined;
        this.visible = true;
        this.pigcms_id=pigcms_id;
        this.template_list=[];
        this.order_id = order_id;
        this.choice_ids=[];

        this.getTemplate();
      },

      //批量打印
      batchPrint(ids,print_type=0){
        let that=this;
        if(ids.length < 1){
          that.$message.error('请勾选账单')
          return false
        }
        
        that.title = '选择打印模板';
        that.visible = true;
        that.template_id=undefined;
        that.template_list=[];
        that.order_id = 0;
        that.pigcms_id=0;
        that.choice_ids = ids;
        this.set_type=0;
        this.source_type=0;
        this.print_type=print_type !=undefined ? print_type:0;
        that.getTemplate();
      },
      getTemplate () {
        this.request(villageApi.getTemplate, {print_type:this.print_type})
          .then((res) => {
            this.template_list=res.list;
            if(res && res.template_id > 0){
              this.template_id=res.template_id;
            }
          })
      },
      handleSubmit () {
        /*
        if (!this.template_id) {
          this.$message.error('选择打印模板')
          return false
        }
        */
        if(this.set_type > 0){
          this.confirmLoading = true;
          this.request(villageApi.editSetPrint, {template_id:this.template_id,print_type:this.print_type}).then((res) => {
                    this.$message.success('编辑成功')
                    setTimeout(() => {
                      this.form = this.$form.createForm(this)
                      this.visible = false;
                      this.print_type=0;
                      this.confirmLoading = false;
                      this.$emit('ok',{type:this.source_type,template_id:this.template_id})
                    }, 1000)
                  }).catch((error)=>{ })
        }
        else{
          this.$refs.PrintModel.add(this.order_id,this.template_id,this.pigcms_id,this.choice_ids);
        }
      },
      handleCancel () {
        this.visible = false
        this.print_type=0;
        // setTimeout(() => {
        //   this.post.id = 0;
        //   this.form = this.$form.createForm(this)
        // }, 500)
      }
    }
  }
</script>
