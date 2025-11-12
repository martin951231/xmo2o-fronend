<template>
    <a-drawer width="600" :visible="visible" :title="contractId?'编辑合同':'添加合同'" @close="onClose">
        <a-form-model ref="ruleForm" :model="contractForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="refrashForm">
            <a-form-model-item label="合同编号" prop="contract_number">
                <a-input v-model="contractForm.contract_number" placeholder="请输入"/>
            </a-form-model-item>
            <a-form-model-item label="合同名称" prop="contract_name">
                <a-input v-model="contractForm.contract_name" placeholder="请输入"/>
            </a-form-model-item>
            <a-form-model-item label="合同类型" prop="classify_id">
                <a-select v-model="contractForm.classify_id" placeholder="请选择">
                    <a-select-option :value="item.value" v-for="(item, index) in classifyList" :key="index">
                        {{item.label}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="合同时间" prop="contract_time">
                <a-range-picker style="width: 100%;" v-if="contractForm.contract_start_time && contractForm.contract_end_time" :value="[moment(contractForm.contract_start_time, 'YYYY-MM-DD'), 
                    moment(contractForm.contract_end_time, 'YYYY-MM-DD',)]" @change="handleDateChange" />
                <a-range-picker style="width: 100%;" v-else @change="handleDateChange" /> 
            </a-form-model-item>
            <a-form-model-item label="合同内容" prop="contract_content">
                <a-textarea placeholder="请输入" style="height: 120px;" v-model="contractForm.contract_content" />
            </a-form-model-item>
            <a-form-model-item label="附件" prop="contract_appendix" v-if="visible" :extra="'支持word、PDF、JPG、png附件上传，上传附件数不超过'+uploadMax+'个'">
                <a-button :disabled="true" v-if="uploadLoading"> <a-icon type="upload" /> 上传中... </a-button>
                <a-upload
                    v-show="!uploadLoading"
                    @change="handleUploadChange"
                    :showUploadList="false"
                    :action="action"
                    :remove="removeThis"
                    :fileList="fileList">
                    <a-button v-if="uploadShowList.length<uploadMax"> <a-icon type="upload" /> 上传 </a-button>
                </a-upload>
                <div class="upload_list">
                    <div class="upload_item" v-for="(item, index) in uploadShowList">
                        <div class="left_file" @click="goUrl(item)">{{item.file_name}}</div>
                        <div class="right_delete" @click="deleteFile(index)"><a-icon type="delete" /></div>
                    </div>
                </div>
            </a-form-model-item>
           <!-- <a-form-model-item label="小区" prop="village_id">
                <a-select showSearch v-model="contractForm.village_id" placeholder="请选择" @change="(value)=>handleSelectChange(value, 'village_id')">
                    <a-select-option :value="item.village_name + '-' +item.village_id" v-for="(item, index) in villageList" :key="index">
                        {{item.village_name}}
                    </a-select-option>
                </a-select>
            </a-form-model-item> -->
            
            <a-form-model-item label="工作人员" prop="work_id">
                <a-select v-model="contractForm.work_id" placeholder="请选择" @change="(value)=>handleSelectChange(value, 'work_id')">
                    <a-select-option :value="item.value" v-for="(item, index) in workList" :key="index">
                        {{item.label}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            
            <a-form-model-item label="联系电话" prop="phone">
                <a-input v-model="contractForm.phone" placeholder="请输入"/>
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
            <a-button type="primary" @click="onConfirm">
                提交
            </a-button>
        </div>
    </a-drawer>
</template>

<script>
    import moment from 'moment';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            contractId: {
                type: [String, Number],
                default: ''
            }
        },
        watch: {
            visible: {
                handler(val){
                    if(val){
                        // this.getVillageList()
                        this.getWorkList()
                        this.getClassifyList()
                        this.getformConfig()
                    }
                    if(this.contractId){
                        this.getDetail(this.contractId)
                    }
                }
            }
        },
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
                uploadMax: 0,
                action: '/v20/public/index.php/common/common.UploadFile/uploadContractAppendix',
                fileList: [],
                contractForm: {
                    contract_number: '',
                    contract_name: '',
                    classify_id: undefined,
                    contract_start_time: '',
                    contract_end_time: '',
                    contract_content: '',
                    village_id: undefined,
                    work_id: undefined,
                    phone: '',
                    contract_time: [],
                    contract_appendix: [],
                },
                rules: {},
                villageList: [],
                workList: [],
                classifyList: [],
                refrashForm: true,
                uploadShowList: [],
                uploadLoading: false
            }
        },

        methods: {
            moment,
            onConfirm() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let params = {}
                        Object.assign(params, this.contractForm)
                        if(this.contractId){
                            params.id = this.contractId
                        }
                        this.request('/community/village_api.contract.Index/setContractInfo', params).then(res=>{
                            if(this.contractId){
                                this.$message.success('编辑成功！')
                            }else {
                                this.$message.success('添加成功！')
                            }
                            this.$emit('close', true)
                        })
                    }
                });
            },
            
            clearForm(){
                this.contractForm = {
                    contract_number: '',
                    contract_name: '',
                    classify_id: undefined,
                    contract_start_time: '',
                    contract_end_time: '',
                    contract_content: '',
                    village_id: undefined,
                    work_id: undefined,
                    phone: '',
                    contract_time: [],
                    contract_appendix: [],
                }
                this.fileList = []
                this.uploadShowList = []
                this.uploadLoading = false
            },

            onClose() {
                this.$emit('close')
                this.clearForm()
                this.$refs.ruleForm.resetFields();
            },
            
            handleDateChange(date, dateString){
                this.contractForm.contract_start_time = dateString[0]
                this.contractForm.contract_end_time = dateString[1]
                this.contractForm.contract_time = dateString
            },
            
            getWorkList(id){
                this.request('/community/village_api.workorder.CommunityQuality/getWorkList', {}).then(res=>{
                    this.workList = res.work_list
                })
            },
            
            getVillageList(){
                this.request('/community/platform.RepairWorkOrder/getVillageList').then(res=>{
                    this.villageList = res.list
                })
            },
            
            getClassifyList() {
                this.request('/community/platform.contract.Index/getClassifyList').then(res => {
                    this.classifyList = res.selectList
                })
            },
            
            getDetail(id){
                this.request('/community/village_api.contract.Index/getContractInfo', {id, }).then(res=>{
                    for(let key in this.contractForm){
                        if(res.result[key]){
                            this.contractForm[key] = res.result[key]
                        }
                    }
                    if(res.result.village_id){
                        this.getWorkList(res.result.village_id)
                    }
                    this.contractForm['contract_start_time'] = res.result['contract_start_time_text']
                    this.contractForm['contract_end_time'] = res.result['contract_end_time_text']
                    this.contractForm['contract_time'] = [res.result['contract_start_time_text'], res.result['contract_end_time_text']]
                    let index = this.villageList.findIndex(v=>v.village_id == res.result.village_id)
                    if(index != -1){
                        let village_name = this.villageList[index].village_name
                        let village_id = this.villageList[index].village_id
                        this.contractForm['village_id'] = village_name +'-' +village_id
                    }
                    this.uploadShowList = res.result.appendix
                })
            },
            handleUploadChange({ file, fileList }){
                this.fileList = fileList
                this.uploadLoading = true
                if(file.status == 'done'){
                    this.contractForm.contract_appendix.push({
                        imageId: file.response.data.imageId
                    })
                    this.uploadShowList.push(file.response.data)
                    this.uploadLoading = false
                }
            },
            deleteFile(index){
                this.contractForm.contract_appendix.splice(index, 1)
                this.uploadShowList.splice(index, 1)
            },
            
            removeThis(file){
                this.contractForm.contract_appendix = []
                this.uploadShowList = []
                let timeout = setTimeout(()=>{
                    this.fileList.map((v, i)=>{
                        if(v.status == 'done'){
                            this.contractForm.contract_appendix.push({
                                imageId: v.response.data.imageId
                            })
                            this.uploadShowList.push(v.response.data)
                        }
                    })
                    clearTimeout(timeout)
                }, 100)
            },
            
            handleSelectChange(value, type){
                if(type == 'village_id'){
                    this.workList = []
                    this.contractForm.work_id = undefined
                    let village_id = value.split('-')[1]
                    this.getWorkList(village_id)
                } else if(type == 'work_id') {
                    this.contractForm.work_id = value
                    let index = this.workList.findIndex(v=>v.value == value)
                    if(index != -1){
                        if(this.workList[index].phone){
                            this.contractForm.phone = this.workList[index].phone
                        }
                    }
                    this.$forceUpdate()
                }
            },
            
            goUrl(item){
                window.open(item.path)
            },
            
            getformConfig(){
                this.request('/community/village_api.contract.Index/getAddUpdateContractConfig', {}).then(res=> {
                    this.uploadMax = res.result.config.appendixMax
                    if(this.contractId){
                        for(let key in res.result.config.editRequire){
                            if(res.result.config.editRequire[key] == 1){
                                this.rules[key] = [{ required: true, message: '必填', trigger: 'change' }]
                            } else {
                                this.rules[key] = [{ required: false, message: '必填', trigger: 'change' }]
                            }
                        }
                        if(res.result.config.editRequire['contract_start_time'] && res.result.config.editRequire['contract_end_time']){
                            this.rules['contract_time'] = [{ required: true, message: '必填', trigger: 'change' }]
                        } else {
                            this.rules['contract_time'] = [{ required: false, message: '必填', trigger: 'change' }]
                        }
                    } else {
                        for(let key in res.result.config.addRequire){
                            if(res.result.config.addRequire[key] == 1){
                                this.rules[key] = [{ required: true, message: '必填', trigger: 'change' }]
                            } else {
                                this.rules[key] = [{ required: false, message: '必填', trigger: 'change' }]
                            }
                        }
                        if(res.result.config.addRequire['contract_start_time'] && res.result.config.addRequire['contract_end_time']){
                            this.rules['contract_time'] = [{ required: true, message: '必填', trigger: 'change' }]
                        } else {
                            this.rules['contract_time'] = [{ required: false, message: '必填', trigger: 'change' }]
                        }
                    }
                    this.refrashForm = false
                    this.$nextTick(()=>{
                        this.refrashForm = true
                    })
                })
            } 
        }
    }
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
    
    .upload_list{
        .upload_item{
            display: flex;
            width: 460px;
            align-items: center;
            justify-content: space-between;
            margin-top: 3px;
            cursor: pointer;
            .left_file{
                color: #18f;
            }
            .right_delete{
                color: red;
            }
        }
    }
</style>