<template>
  <div class="set-print-template-box">
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
    <div style="width: 100%;text-align: center">
      <a-button type="primary" @click="handleSubmit">{{btn_text}}</a-button>
    </div>
    <print-page ref="PrintModel"/>
  </div>
</template>
<style >
  .imgname {
    width: 100px;
  }
  .set-print-template-box {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }
</style>
<script>
  import villageApi from '@/api/community/village'
  import printPage from '@/views/community/village/materiel/printPage'

  export default {
    components: { printPage },
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
        print_type:2, //0-已缴费账单模板设置 1-待缴费账单设置 2-物料模板
        btn_text:'保存',
        choiceStrings: '',
        printTempLateType: 'materiel',
      }
    },
    mounted () {
      let batch = this.$route.query.batch
      let choiceStrings = this.$route.query.choiceStrings
      if (choiceStrings) {
        choiceStrings = choiceStrings.trim().replace(/(^,)|(,$)/g, '');
        let choice_ids = choiceStrings.split(",");
        console.log('this.choice_ids', choice_ids)
        if (batch == 1) {
          this.batchPrint(choice_ids)
        }
      } else {
        this.add(0, 0, 2, 2)
      }
    },
    methods: {
      add(order_id,pigcms_id,type=1,print_type=2) {
        this.source_type=0;
        if(print_type!=undefined && print_type){
            this.print_type=print_type;
        }else{
            this.print_type=2;
        }
        if(type == 0){
          this.title = '选择打印模板';
          this.is_set=false;
          this.set_msg='';
          this.btn_text = '打印';
        } else {
          this.is_set=true;
          this.title = '设置打印模板';
          this.btn_text = '保存';
          this.set_msg='1、设置打印模板后，联动物料出库批量打印。<br/>2、设置打印模板后，<span style="color: #1890ff">物料出库管理</span>列表点击<span style="color: #1890ff">批量打印</span>按钮直接打印';
        }
        if(this.print_type==2){
            this.title = '设置物料出库打印模板';
            this.set_msg='1、设置<span style="color: #1583e3">物料</span>出库打印模板后，设置后此模板用于<span style="color: #1583e3">物料出库</span>的账单打印<br />2、最多可选10个出库信息打印';
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
      batchPrint(ids){
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
        this.print_type=2;
        this.printTempLateType = 'materiel';
        that.getTemplate();
      },
      getTemplate () {
        let that=this;
        this.request(villageApi.getTemplate, {print_type:this.print_type})
          .then((res) => {
            that.template_list=res.list;
            if(res && res.template_id > 0){
              that.template_id=res.template_id;
              console.log('111111111111this.set_type', that.set_type)
              if(!that.set_type){
                console.log('111111111111this.choice_ids', that.choice_ids)
                that.$refs.PrintModel.add(0,that.template_id,0,that.choice_ids,that.printTempLateType);
              }
            }
          })
      },
      handleSubmit () {
        if(this.set_type > 0){
          this.confirmLoading = true;
          this.request(villageApi.editSetPrint, {template_id:this.template_id,print_type:this.print_type}).then((res) => {
            this.$message.success('设置打印模板')
            setTimeout(() => {
              this.confirmLoading = false;
              let index = parent.layer.getFrameIndex(window.name);
              parent.layer.close(index);
            }, 1500)
          }).catch((error)=>{ })
        } else {
          if (!this.template_id) {
            this.$message.error('选择打印模板')
            return false
          }
          this.$refs.PrintModel.add(this.order_id,this.template_id,this.pigcms_id,this.choice_ids,this.printTempLateType);
        }
      }
    }
  }
</script>
