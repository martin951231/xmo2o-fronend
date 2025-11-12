<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" :confirm-loading="confirmLoading" @ok="handleSubmit"
        @cancel="handleSubCancel">
        <a-form-model ref="ruleForm" :model="spaceForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <upload-image :id="uid" :visible="faceSpaceVisible" :modelTitle="modelTitle2" />
        </a-form-model>
    </a-modal>

</template>

<script>
    import villageApi from '@/api/community/village';
    import moment from 'moment';
    import uploadImage from '../uploadImage.vue';
    export default {
        props: {
            position_id: {
                type: String,
                default: ''
            },
            children_type:{
                type: [String, Number],
                default: 0
            },
            visible: {
                type: Boolean,
                default: false
            },
            modelTitle: {
                type: String,
                default: ''
            },
            space_type: {
                type: String,
                default: 'add'
            },
            uid:{
                type: [String, Number],
                default: 0
            },
        },
        
        watch:{
            position_id: {
                immediate: true,
                handler (val) {
                    if(this.space_type=='edit'){
                        this.getSpaceInfo()
                    }
                }
            },
        },
        components: {
            uploadImage,
        },
        
        mounted(){
            this.getGarageList()
        },
        
        data() {
            return {
                confirmLoading: false,
                children_type_show: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                spaceForm: {garage_id: '',children_type:1},
                rules: {
                    garage_id: [{ required: true, message: '请选择车场', trigger: 'blur' }],
                    position_num: [{ required: true, message: '请输入车位号', trigger: 'blur' }]
                },
                garageList: [],
                dateFormat: 'YYYY/MM/DD',
                disabled:false,
                searchVal: '',
                searchUserList: [],
                faceSpaceVisible: true,
                modelTitle2: '',
            }
        },

        methods: {
            moment,
            getSpaceInfo(){
                let that = this
                if(this.position_id){
                    that.request(villageApi.getPositionInfo, {position_id: this.position_id}).then((res) => {
                        that.spaceForm = res
                        if (that.spaceForm.children_type==2){
                            that.disabled=true
                        }else{
                            that.disabled=false
                        }
                    })
                }
            },
            getGarageList(){
                let that = this
                that.request(villageApi.getGarageList, {}).then((res) => {
                    that.garageList = res.list
                })
            },
            clearForm(){
                this.spaceForm = {garage_id: '',children_type:1}
                this.searchVal = ''
            },
            handleSubmit(e) {
                this.confirmLoading = true;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        let url = villageApi.addParkPosition
                        if(this.space_type == 'edit'){
                            url = villageApi.editParkPosition
                        }
                        that.request(url, that.spaceForm).then((res) => {
                            if(this.space_type == 'edit'){
                                that.$message.success('编辑成功！')
                            } else{
                                that.$message.success('添加成功！')
                            }
                            this.$emit('closeSpace', true)
                            this.clearForm()
                            this.confirmLoading = false;
                        }).catch(e=>{
                            this.confirmLoading = false;
                        })
                    } else {
                        this.confirmLoading = false;
                        return false;
                    }
                });
            },
            handleSubCancel(e) {
                this.$refs.ruleForm.resetFields();
                this.confirmLoading = false;
                this.$emit('closeSpace', false)
                this.clearForm()
            },
            
            handleSelectChange(value, type) {
                this.spaceForm[type] = value
                if(type=='pigcms_id'){
                    this.searchUserList.map(v=>{
                        if(v.pigcms_id == value){
                            this.searchVal = v.name
                            this.searchUserList = []
                            console.log("v.pigcms_id=====>", v.pigcms_id)
                        }
                    })
                }
                this.$forceUpdate()
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            ondateChange(value, dateString){
                this.spaceForm.end_time = dateString
            },
            
            searchUser(){
                let that = this
                if(this.searchVal){
                    that.request(villageApi.getParkUserInfo, {value: this.searchVal}).then((res) => {
                        that.searchUserList = res
                    })
                } else {
                    that.searchUserList = []
                    that.spaceForm.pigcms_id = ''
                }
                
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
