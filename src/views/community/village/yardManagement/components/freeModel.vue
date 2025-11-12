<template>
    <a-modal :title="modelTitle" :width="1000" :visible="visible" @ok="handleSubmit" :confirm-loading="confirmLoading"
        @cancel="handleSubCancel">
        <a-alert style="margin-bottom: 20px;" message="添加免费车时，车牌开头包含、车牌结尾包含、完整车牌任意填写一项即可保存成功，如果都填写，会依次查询车辆信息支持免费进出" type="info" show-icon />
        <a-form-model ref="ruleForm" :model="freeForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_black">
                <a-form-model-item label="车牌类型" prop="park_type">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                        @change="(value) => handleSelectChange(value, 'park_type')" :value="freeForm.park_type">
                        <a-select-option v-for="(item,index) in parkTypeList" :value="item.park_type*1">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="车牌开头包含" prop="first_name">
                    <a-input v-model="freeForm.first_name" placeholder="请输入车牌开头包含"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="车牌结尾包含" prop="last_name">
                    <a-input v-model="freeForm.last_name" placeholder="请输入车牌结尾包含"></a-input>
                </a-form-model-item>
                
                <a-form-model-item label="完整车牌" prop="free_park" v-if="is_show_car_number">
                    <a-input v-model="freeForm.free_park" placeholder="请输入完整车牌"></a-input>
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
            free_type: {
                type: String,
                default: ''
            },
            free_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            free_id: {
                immediate: true,
                handler (val) {
                    if(this.free_type=='edit'){
                        this.getFreeInfo()
                    }
                }
            },
            visible: {
                immediate: true,
                handler (val) {

                }
            }
        },
        
        data() {
            return {
                confirmLoading: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                freeForm: {park_type: undefined},
                rules: {
                    park_type: [{ required: true, message: '请选择车牌类型', trigger: 'blur' },]
                },
                parkTypeList: [],
                is_show_car_number:true
            }
        },
        
        mounted(){
          this.getParkType()
        },

        methods: {
            clearForm(){
                this.freeForm = {park_type:undefined}
            },


            checkFree(){
                let that = this
                /*
                that.request(villageApi.checkFreeCar1121).then((res) => {
                   that.is_show_car_number=res.status
                })
                */
            },
            getFreeInfo(){
                let that = this;
                if(that.free_id){
                    that.request(villageApi.getFreeCarInfo, {free_id: that.free_id}).then((res) => {
                        that.freeForm = res
                        that.freeForm.free_id = res.id
                    })
                }
            },
            
            getParkType(){
                let that = this
                that.request(villageApi.getParkType, {}).then((res) => {
                    for(let item in res){
                        that.parkTypeList.push({
                            park_type: item,
                            label: res[item]
                        })
                    }
                })
            },
            
            handleSubmit(e) {
                this.confirmLoading = true;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        if(!that.freeForm.first_name && !that.freeForm.last_name && !that.freeForm.free_park){
                            that.$message.warning('开头、结尾、完整车牌至少填写一个！')
                            that.confirmLoading = false;
                            return
                        }
                        
                        let url = villageApi.addFreeCar
                        if(this.free_type == 'edit'){
                            url = villageApi.editFreeCar
                        }
                        that.request(url, that.freeForm).then((res) => {
                            if(this.free_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            this.$emit('closeFree', true)
                            this.clearForm()
                            this.confirmLoading = false;
                        }).catch(e=>{
                            this.confirmLoading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        this.confirmLoading = false;
                        return false;
                    }
                });
            },
            
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.confirmLoading = false;
                this.$emit('closeFree', false)
                this.clearForm()
            },
            
            handleSelectChange(value, type) {
                this.freeForm[type] = value
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
