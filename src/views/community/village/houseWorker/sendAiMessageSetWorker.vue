<template>
  <div style="padding-top: 40px;">
      <a-form :form="form">
          <a-form-item label="发送消息Ai类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col>
              <a-select placeholder="请选择发送消息Ai类型" style="width: 300px" v-model="ai_send_type" >
                <a-select-option value="2">AI设别巡检</a-select-option>
                <a-select-option value="1">AI智能巡检</a-select-option>
                <a-select-option value="3">AI设别巡检 和 智能巡检</a-select-option>
              </a-select>
            </a-col>
          </a-form-item>
          
        <a-form-item label="选择工作人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col>
            <a-select placeholder="请选择工作人员" style="width: 430px" :default-value="defaultvalue"  @change="handleChange"	 :show-search="true" option-filter-prop="children">
              <a-select-option value="0">请选择</a-select-option>
              <a-select-option  v-for="(item,index) in workers" :value="item.wid" :key="item.wid" :title="item.name" >{{item.title_str}}</a-select-option>
            </a-select>
          </a-col>
        </a-form-item>

      </a-form>
   
    <div class="refund_type_desc" style="margin-left: 30px;">
        <span>已选择的工作人员：</span><span class="have_selected" v-for="(item,index) in tags"> {{item.name}}  <a-icon type="close" @click="delSelect(item,index)" style="color:#ff0000;"/> </span>
    </div>
    <a-card :bordered="false" style="text-align: center;" >
        <a-button  type="primary" style="margin-top: 20px;margin-right: 15px;" @click="handleSubmit()" :loading="loading">保存设置</a-button>
    </a-card>
  </div>
  
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
  export default {
      name: 'sendAiMessageSetWorker',
    components: {},
    data() {
      return {
        title: '记录提醒人员设置',
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
            span: 13
          }
        },
        loading: false,
        form: this.$form.createForm(this),
        workers:[],
        tags:[],
        defaultvalue:"0",
        ai_send_type:"2",
      }
    },
    mounted() {
        this.getWorkeList();
    },
    methods: {

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
        this.request(villageApi.getRootAiNoticeWorkers, {xtype:'sendRootAiMessage'})
          .then((res) => {
              this.workers=res.workers
              this.tags=res.tags
              this.ai_send_type=res.ai_send_type;
          })
      },
      handleSubmit() {
            this.loading = false
            let postArr={tags:this.tags};
            postArr.ai_send_type=this.ai_send_type;
            postArr.xtype='sendRootAiMessage';
            this.request(villageApi.saveRootAiNoticeWorkers,postArr)
              .then((res) => {
                this.$message.success('操作成功')
                setTimeout(() => {
                  this.loading = false
                }, 1500)
              }).catch((error) => {
					 this.loading = false;
			})
      },
      handleCancel() {
          
      },
    },
  }
</script>