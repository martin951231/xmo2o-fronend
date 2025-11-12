<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" @ok="handleSubmit" :confirm-loading="confirmLoading"
        @cancel="handleSubCancel">
        <a-form-model ref="ruleForm" :model="groupForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_black">
                <a-form-model-item label="关联功能" prop="cat_function">
                    <a-select show-search placeholder="请选择" :filter-option="filterOption"
                        @change="(value)=>handleSelectChange(value, 'cat_function')"  :value="groupForm.cat_function">
                        <a-select-option :value="item.key" v-for="(item,index) in labelFunction">
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="分组名称" prop="cat_name">
                    <a-input v-model="groupForm.cat_name" placeholder="请输入分组名称"></a-input>
                </a-form-model-item>
            </div>
        </a-form-model>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            modelTitle: {
                type: String,
                default: ''
            },
            cat_type: {
                type: String,
                default: ''
            },
            cat_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            cat_id: {
                immediate: true,
                handler (val) {
                    if(this.cat_type=='edit'){
                        this.getCatInfo()
                    }
                }
            }
        },
        
        mounted(){
            this.getLabelFunction()
        },
        
        
        data() {
            return {
                confirmLoading: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                groupForm: {cat_function: ''},
                rules: {
                    cat_function: [{ required: true, message: '请选择关联功能', trigger: 'blur' },],
                    cat_name: [{ required: true, message: '请输入分组名称', trigger: 'blur' },]
                },
                labelFunction: []
            }
        },

        methods: {
            clearForm(){
                this.groupForm = {cat_function: ''}
            },
            
            getLabelFunction(){
                let that = this
                that.request(villageApi.getLabelFunction, {}).then((res) => {
                    that.labelFunction = res
                })
            },
            
            getCatInfo(){
                let that = this
                if(that.cat_id){
                    that.request(villageApi.getLabelCatInfo, {cat_id: that.cat_id}).then((res) => {
                        that.groupForm = res
                        that.groupForm.cat_id = res.id
                    })
                }
            },
            
            getLabelCatList(){
                let that = this
                that.request(villageApi.getLabelCatList, {}).then((res) => {
                    that.cateList = res
                })
            },
            
            handleSubmit(e) {
                let that = this
                that.confirmLoading = true;
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.groupForm.cat_id = that.cat_id
                        let url = villageApi.addLabelCat
                        if(that.cat_type == 'edit'){
                            url = villageApi.editLabelCat
                        }
                        that.request(url, that.groupForm).then((res) => {
                            if(that.cat_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            that.$emit('closeGroup', true)
                            that.clearForm()
                            that.confirmLoading = false;
                        }).catch(e=>{
                            that.confirmLoading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        that.confirmLoading = false;
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.confirmLoading = false;
                this.$emit('closeGroup', false)
                this.clearForm()
            },
            
            handleSelectChange(value, type) {
                this.groupForm[type] = value
                this.$forceUpdate()
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            }
        },
    }
</script>

<style lang="less" scoped>
    .form_title{
        font-size: 14px;
        font-weight: bold;
    }
    
    .form_line{
        height: 0.5px;
        width: 100%;
        background-color: #eeeeee;
        margin: 10px 0;
    }
    
    .generation_rules{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 5px;
    }
    
    .footer_button{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        // position: fixed;
        // bottom: 100;
        // right: 20;
        // z-index: 999;
    }
    
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>
