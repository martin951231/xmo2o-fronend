<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="请输入分类名称" v-decorator="['cat_name', {initialValue:cat_name,rules: [{required: true, message: '请输入分类名称！'},{required: true,max:8,message:'最多支持8个汉字！'}]}]"  />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input
              placeholder="不填则默认0"
              v-decorator="['sort', {initialValue:sort}]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="分类状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group v-decorator="['status',{initialValue:status}]">
              <a-radio :value="1">开启</a-radio>
              <a-radio :value="2">关闭</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        data(){
            return {
                title : '添加/编辑',
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
                form: this.$form.createForm(this),
                visible : false,
                confirmLoading : false,
                cat_name:'',
                sort:'',
                status:1,
                cat_id:0,
                is_save:0,
            }
        },
        methods:{
            add(cat_id=0){
                this.title = '添加';
                this.visible = true;
                this.is_save = 0;
                this.cat_id = cat_id;
                this.cat_name = '';
                this.status = 1;
                this.sort = '';
            },
            edit(cat_id){
                this.visible = true;
                this.cat_id = cat_id;
                this.is_save = 0;
            },
            save(cat_id,cat_name,sort,status){
                this.title = '编辑';
                this.visible = true;
                this.is_save = 1;
                this.cat_id = cat_id;
                this.cat_name = cat_name;
                this.sort = sort;
                this.status = status;
            },
            handleSubmit(){
                const {
                    form: {
                        validateFields
                    }
                } = this;
                validateFields((errors, values) => {
                    if(values.cat_name == ''){
                        return false;
                    }
                    if(values.cat_name.length>8){
                        return false;
                    }
                    if(this.is_save == 0){
                        this.request(streetCommunityApi.addEventCategory,{
                            cat_name:values.cat_name,
                            sort:values.sort?values.sort:0,
                            status:values.status,
                            cat_fid:this.cat_id,
                        }).then((res)=>{
                            this.$message.success('添加成功');
                            setTimeout(() => {
                                this.form = this.$form.createForm(this);
                                this.visible = false;
                                this.confirmLoading = false;
                                this.$emit('ok', values)
                            }, 1500)
                        });
                    }else{
                        this.request(streetCommunityApi.editEventCategory,{
                            cat_name:values.cat_name,
                            sort:values.sort?values.sort:0,
                            status:values.status,
                            cat_id:this.cat_id,
                        }).then((res)=>{
                            this.$message.success('修改成功');
                            setTimeout(() => {
                                this.form = this.$form.createForm(this);
                                this.visible = false;
                                this.confirmLoading = false;
                                this.$emit('ok', values)
                            }, 1500)
                        });
                    }
                });
            },
            handleCancel(){
                this.visible = false;
                this.confirmLoading = false;
            },
        }
    }
</script>

<style scoped>

</style>