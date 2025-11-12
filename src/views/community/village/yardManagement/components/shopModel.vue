<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" :confirm-loading="confirmLoading" @ok="handleSubmit"
        @cancel="handleSubCancel">
        <a-form-model ref="ruleForm" :model="shopForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <div class="add_space">
                <a-form-model-item label="是否是合作店铺" prop="type">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="shopForm.type">
                        <a-radio :value="1">是</a-radio>
                        <a-radio :value="2">否</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                
                <a-form-model-item label="店铺名称" prop="bind_m_id" v-if="shopForm.type == 1">
                    <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                        @change="handleSelectChange" :value="shopForm.bind_m_id">
                        <a-select-option v-for="(item,index) in searchshopList" :value="item.store_id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                
                <a-form-model-item label="店铺名称" prop="m_name" v-else>
                    <a-input v-model="shopForm.m_name" placeholder="请输入店铺名称" @change="search_shop"></a-input>
                </a-form-model-item>
                
              <!--  <a-form-model-item v-if="shopForm.type == 2" label="绑定店铺" prop="bind_m_id">
                    <a-input v-model="shopForm.bind_m_id" placeholder="请输入绑定店铺"></a-input>
                </a-form-model-item> -->
                
                <a-form-model-item label="备注" prop="remark">
                    <a-textarea style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入" v-model="shopForm.remark" />
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
            shop_type: {
                type: String,
                default: ''
            },
            shop_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            shop_id: {
                immediate: true,
                handler (val) {
                    if(this.shop_type=='edit'){
                        this.getShopInfo()
                    }
                }
            },
            
            visible: {
                immediate: true,
                handler (val) {
                    if(val) {
                        this.getShopList()
                    }
                }
            }
        },
        
        data() {
            return {
                confirmLoading: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                shopForm: {
                    type: 1,
                    bind_m_id: ''
                },
                rules: {
                    m_name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' },],
                    bind_m_id: [{ required: true, message: '请选择绑定店铺', trigger: 'blur' },],
                },
                searchshopList: []
            }
        },

        methods: {
            clearForm(){
                this.shopForm = {
                    type:1,
                    bind_m_id: ''
                }
            },
            handleSubmit(e) {
                this.confirmLoading = true;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let url = villageApi.add_park_shop
                        if(this.shop_type == 'edit'){
                            url = villageApi.edit_park_shop
                        }
                        that.request(url, that.shopForm).then((res) => {
                            if(this.shop_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            this.$emit('closeShop', true)
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
                this.$emit('closeShop', false)
                this.clearForm()
            },
            
            getShopInfo(){
                let that = this
                if(that.shop_id){
                    that.request(villageApi.getParkShopInfo, {m_id: that.shop_id}).then((res) => {
                        that.shopForm = res
                    })
                }
            },
            
            getShopList(){
                let that = this
                that.request(villageApi.shop_search, {}).then((res) => {
                    that.searchshopList = res
                })
            },
            
            search_shop(){
                let that = this
                if(that.shopForm.m_name && that.shopForm.m_name!='' && that.shopForm.type == 1){
                    that.request(villageApi.shop_search, {m_name: that.shopForm.m_name}).then((res) => {
                        that.searchshopList = res
                    })
                }
                
                if(that.shopForm.m_name==''){
                    that.searchshopList = []
                }
            },
            
            handleSelectChange(value) {
                this.searchshopList.map(v=>{
                    if(v.store_id == value){
                        this.shopForm.m_name = v.name
                    }
                })
                this.shopForm.bind_m_id = value
                this.$forceUpdate()
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
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
