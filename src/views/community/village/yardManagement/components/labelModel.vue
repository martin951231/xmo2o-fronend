<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" @ok="handleSubmit" :confirm-loading="confirmLoading"
        @cancel="handleSubCancel">
        
        <a-form-model ref="ruleForm" :model="labelForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_black">
                <a-form-model-item label="分组名称" prop="cat_id">
                    <a-select show-search placeholder="请选择分组名称" :filter-option="filterOption"
                        @change="(value)=>handleSelectChange(value, 'cat_id')" :value="labelForm.cat_id">
                        <a-select-option v-for="(item,index) in cateList" :value="item.cat_id">
                            {{item.cat_name}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
                <a-form-model-item label="标签名称" v-if="label_type=='remove'">
                    <a-input :disabled="true" v-model="select_names_str"></a-input>
                </a-form-model-item>
                
                <a-form-model-item v-else label="标签名称" prop="label_name">
                    <a-input v-model="labelForm.label_name" placeholder="请输入标签名称"></a-input>
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
            label_type: {
                type: String,
                default: 'add'
            },
            label_id: {
                type: String,
                default: ''
            },
            cat_id: {
                type: String,
                default: ''
            },
            select_keys: {
                type: Array,
                default: ()=>{return []}
            },
            select_names: {
                type: Array,
                default: ()=>{return []}
            },
            select_names_str: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            visible: {
                immediate: true,
                handler (val) {
                    if(val){
                        this.getLabelCatList()
                    }
                }
            },
            label_id: {
                immediate: true,
                handler (val) {
                    if(this.label_type=='edit'){
                        this.getLabelInfo()
                    }
                }
            },
            cat_id: {
                immediate: true,
                handler (val) {
                    // this.labelForm.cat_id = val
                }
            }
            // select_names_str: {
            //     immediate: true,
            //     handler (val) {
            //         if(this.label_type == 'remove'){
            //             this.labelForm.label_name = val
            //         }
            //     }
            // }
        },
        
        data() {
            return {
                confirmLoading: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                labelForm: { cat_id: ''},
                rules: {
                    cat_id: [{ required: true, message: '请选择分组', trigger: 'blur' },],
                    label_name: [{ required: true, message: '请输入标签名称', trigger: 'blur' },]
                },
                cateList: []
            }
        },
        
        methods: {
            clearForm(){
                this.labelForm = {cat_id: ''}
            },
            getLabelInfo(){
                let that = this
                if(that.label_id){
                    that.request(villageApi.getLabelInfo, {label_id: that.label_id}).then((res) => {
                        that.labelForm = res
                        that.labelForm.label_id = res.id
                        if(res.cat_id = 99999){
                            that.labelForm.cat_id = '未分组'
                        }
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
                        let url = villageApi.addCarLabel
                        if(that.label_type == 'edit'){
                            if(that.labelForm.cat_id == '未分组'){
                                that.labelForm.cat_id = 99999
                            }
                            url = villageApi.editLabel
                        }
                        if(that.label_type == 'remove'){
                            url = villageApi.moveLabel
                            that.labelForm.label_id = that.select_keys
                        }
                        that.request(url, that.labelForm).then((res) => {
                            if(that.label_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else if(that.label_type == 'add'){
                                that.$message.success('添加成功！')
                            } else if(that.label_type == 'remove'){
                                that.$message.success('移动成功！')
                            }
                            that.$emit('closeLabel', true)
                            that.clearForm()
                            that.confirmLoading = false;
                        }).catch(e=>{
                            that.confirmLoading = false;
                        })
                    } else {
                        that.confirmLoading = false;
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.confirmLoading = false;
                this.$emit('closeLabel')
                if(this.label_type != 'remove'){
                    this.clearForm()
                    this.$refs.ruleForm.resetFields();
                }
            },
            
            handleSelectChange(value, type) {
                this.labelForm[type] = value
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
