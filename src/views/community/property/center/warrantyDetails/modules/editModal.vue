<template>
    <a-drawer :title="warranty_id?'编辑':'添加'" :width="420" :visible="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
        <a-form-model :model="warrantyForm" layout="vertical" ref="ruleForm" :rules="rules">
            <a-form-model-item label="类别名称" prop="category_name">
                <a-input placeholder="请输入" v-model="warrantyForm.category_name"/>
            </a-form-model-item>
            <a-form-model-item label="所属类别" prop="fid">
                <a-select style="width: 100%;" v-model="warrantyForm.fid" placeholder="请选择">
                    <a-select-option :key="-1" :value="0">无上级类别</a-select-option>
                    <a-select-option v-for="(item, index) in cateList" :key="index" :value="item.id">{{item.category_name}}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="备注" prop="remark">
                <a-textarea placeholder="请输入" style="height: 100px; resize: none" v-model="warrantyForm.remark" />
            </a-form-model-item>
        </a-form-model>
        <div :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
        }">
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
                取消
            </a-button>
            <a-button :loading="confirmLoading" type="primary" @click="handleOk">
                确定
            </a-button>
        </div>
    </a-drawer>
</template>

<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            warranty_id: {
                type: Number,
                default: 0
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.getCateList()
                    }
                    
                    if(val && this.warranty_id){
                        this.getDetail()
                    }
                }
            }
        },
        
        data() {
            return {
                confirmLoading: false,
                warrantyForm: {
                    id: 0,
                    category_name: '',
                    fid: undefined,
                    remark: ''
                },
                cateList: [],
                rules: {
                    category_name: [
                        { required: true, message: '请输入' },
                    ],
                    fid: [
                        { required: true, message: '请选择', trigger: 'change' },
                    ],
                    remark: [
                        { required: false, message: '请输入' },
                    ],
                },
            };
        },
        methods: {
            getCateList(fid=0){
                let that = this
                that.request('/community/property_api.workorder.CommunityQuality/getCommunityQualityList', {fid,}).then(res=>{
                    if(fid == 0) {
                        that.cateList = res.list
                    }
                })
            },
            
            getDetail(){
                let that = this
                that.request('/community/property_api.workorder.CommunityQuality/getCommunityQualityDetail', {id:that.warranty_id}).then(res=>{
                    that.warrantyForm = res.detail
                })
            },
            
            onClose(){
                this.$emit('close')
                this.clearForm()
            },
            
            clearForm(){
                this.warrantyForm = {
                    id: 0,
                    category_name: '',
                    fid: undefined,
                    remark: ''
                }
                this.$refs.ruleForm.resetFields();
                this.cateList = []
            },
            
            handleOk(){
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.confirmLoading = true
                        that.request('/community/property_api.workorder.CommunityQuality/addCommunityQuality', that.warrantyForm).then(res=>{
                            if(that.warranty_id){
                                that.$message.success('编辑成功')
                            } else {
                                that.$message.success('添加成功')
                            }
                            that.confirmLoading = false
                            that.$emit('close', true)
                            that.clearForm()
                        }).catch(err=>{
                            that.confirmLoading = false
                        })
                    }
                });
            }
        },
    };
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>