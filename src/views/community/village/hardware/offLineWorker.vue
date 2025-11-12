<template>
  <a-modal :title="title" :width="800" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">

      <a-form :form="form">
        <a-form-item label="选择工作人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col>
            <a-select placeholder="请选择工作人员" style="width: 300px" :default-value="defaultvalue"  @change="handleChange"	 :show-search="true" option-filter-prop="children">
              <a-select-option value="0">请选择</a-select-option>
              <a-select-option  v-for="(item,index) in workers" :value="item.wid" :key="item.wid" :title="item.name" >{{item.name}}</a-select-option>
            </a-select>
          </a-col>
        </a-form-item>
      </a-form>
   
    <div class="refund_type_desc" style="margin-left: 30px;">
        <span>已选择的工作人员：</span><span class="have_selected" v-for="(item,index) in tags"> {{item.name}}  <a-icon type="close" @click="delSelect(item,index)" style="color:#ff0000;"/> </span>
    </div>
  </a-modal>
  
</template>
<style>
  .imgname {
    width: 100px;
  }
  .refund_type_desc table{font-weight: bold;}
  .refund_type_desc  .ant-descriptions-item-colon,.refund_type_desc .ant-descriptions-item-content{padding: 8px 20px;}
 .have_selected { border: 1px solid #eee; border-radius: 5px;padding: 2px 5px;background-color: #f1f1f1;margin-right: 10px;margin-bottom: 10px;
    display: inline-block;}
</style>
<script>
  import villageApi from '@/api/community/village';
  import configHouseMeterApi from "@/api/community/houseMeter";

  export default {
    components: {},
    data() {
      return {
        title: '通知人员添加修改',
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
        workers:[],
        tags:[],
        defaultvalue:"0"
      }
    },
    mounted() {
    },
    methods: {
      add() {
        this.title = '通知人员添加修改';
        this.getWorkeList();
        this.visible=true;
      },
      handleChange(value,option) {
        console.log('value',value)
        let tagTem={};
        
        if(value=='' || value==0 || value=='0'){
            
        }else{
            tagTem.wid=value
            this.workers.forEach((item,ii)=>{
                if(item.wid==value){
                    tagTem=item
                }
            });
            let ispick=false;
            this.tags.forEach((tag,jj)=>{
                if(tag.wid==value){
                    ispick=true;
                }
            });
            if(!ispick){
                this.tags.push(tagTem);
            }
            console.log('tags',this.tags);
        }   
      },
      delSelect(item,index){
          console.log('index',index);
              this.tags.splice(index,1);
               console.log('deltags',this.tags);
      },
      getWorkeList(){
        this.request(villageApi.getNoticeWorkers, {})
          .then((res) => {
              this.workers=res.workers
              this.tags=res.tags
          })
      },
      handleSubmit() {
          //this.confirmLoading=true;
            this.request(villageApi.saveNoticeWorkers, {tags:this.tags})
              .then((res) => {
                this.$message.success('操作成功')
                setTimeout(() => {
                  this.form = this.$form.createForm(this)
                  this.visible = false
                  this.confirmLoading = false
                  this.$emit('ok')
                }, 1500)

              })
      },
      handleCancel() {
        this.visible = false
        this.tags=[]
        setTimeout(() => {
          this.form = this.$form.createForm(this)
        }, 500)
      },
    },
  }
</script>