<template>
    <a-modal :title="xtitle" :width="1000" :visible="visible" :maskClosable="false" :footer="isImporting || currentKey==2 ?null:undefined"
        @cancel="handleCancel">
        <a-tabs :default-active-key="1" @change="tabChange">
            <a-tab-pane :key="1" tab="导入操作">
                <div class="step_one" v-show="firstStep && !isImporting">
                    <h4>步骤一：选择需要上传【{{order_msg}}账单】所属【收费项目】</h4>
                    <h5><span style="color: #ff4d4f;">注意：</span>1. 仅支持<span style="color: #ff4d4f;">【收费模式：一次性费用】</span>的<span style="color: #ff4d4f;">【收费项目】</span>。</h5>
                    <div>
                        <span class="label_col" style="color:rgba(0, 0, 0, 0.85)">收费科目：</span>
                        <a-select v-model="subjectId" show-search style="width: 282px;margin-left:20px;" @change="handleChargeNumberChange">
                            <a-select-option v-for="(item1, index1) in chargeNumber" :value="item1.id" :key="index1">{{ item1.name }}</a-select-option>
                        </a-select>
                    </div>
                    <div style="padding-top:10px;">
                        <span class="label_col" style="color:rgba(0, 0, 0, 0.85)">收费项目：</span>
                        <a-select v-model="projectId" show-search style="width: 282px;margin-left:20px;" @change="handleChargeProjectChange">
                            <a-select-option v-for="(item2, index2) in chargeProject" :value="item2.id" :key="index2">{{ item2.name }}</a-select-option>
                        </a-select>
                    </div>
                    <div v-if="projectId">
                        <h4>步骤二：上传 Excel 文件</h4>
                        <h5><span style="color: #ff4d4f;">注意：</span>1. 导入的{{order_msg}}账单会归属到所选<span style="color: #ff4d4f;">【收费项目】</span>下，以导入表中<span style="color: #ff4d4f;">[{{uploadType=='billPayExcel' ? '已缴':'欠缴'}}费用名称]</span>为名称的<span style="color: #ff4d4f;">【计费模式：固定费用】</span>的<span style="color: #ff4d4f;">【收费标准】</span>中。</h5>
                        <h5 style="padding-left:35px;">2. 表中相同<span style="color: #ff4d4f;">[{{uploadType=='billPayExcel' ? '已缴':'欠缴'}}费用名称]</span>不同<span style="color: #ff4d4f;">[{{uploadType=='billPayExcel' ? '已缴':'欠缴'}}金额]</span>会生成不同的<span style="color: #ff4d4f;">【收费标准】</span>。</h5>
                        <p>您要从何处导入数据，请选择导入的 Excel 文件</p>
                        <div style="display: flex; width: 80%;">
                            <div class="label" style="width: 82px; text-align:left;">Excel文件</div>
                            <a-upload-dragger style="height: 100px;width: calc(100% - 82px); margin-left: 10px;" name="file" :multiple="true" :action="uploadUrl" :beforeUpload="beforeUploadExcel"
                                :showUploadList="false" :headers="headers" @change="handleUploadChange"
                                :data="{upload_dir: 'billExcel', system_type: 'village', type: uploadType}">
                                <a-icon :type="uploadLoading?'loading':'upload'" /> {{uploadFileName?uploadFileName:'拖拽或点击上传 Excel 文件'}}
                            </a-upload-dragger>
                        </div>
                        <div v-if="fileList.length>0" class="select_list" style="display: flex;align-items: center;height: 50px;">
                            <div class="label" style="width: 82px; text-align:left;">选择Sheet表</div>
                            <a-select :default-value="0" style="width: 120px; margin-left: 10px;" @change="handleSelectChange">
                                <a-select-option v-for="(item, index) in fileList" :key="index" :value="index">
                                    {{item.worksheetName}}
                                </a-select-option>
                            </a-select>
                            <div style="color: red;margin-left: 10px;">总数据量：{{selectObj.totalRows ? (selectObj.totalRows - 1):0}} 条</div>
                        </div>
                        
                        <h5>导入步骤：</h5>
                        <h5>
                            <span style="color: #ff4d4f;">注意：</span>
                            1. 
                            <span style="color: #ff4d4f;">【{{$store.getters.config.single_name}}】</span>、
                            <span style="color: #ff4d4f;">【{{$store.getters.config.room_name}}】</span>、
                            <span style="color: #ff4d4f;">【楼层】</span>、
                            <span style="color: #ff4d4f;">【{{$store.getters.config.room_name}}号】</span>
                            是和对应名称或编号<span style="color: #ff4d4f;">全匹配[就是名称或者编号需要完全一致]</span>定位对应{{$store.getters.config.room_name}}的。</h5>
                        <p> 第一步：上传存储有的资料 Excel 文件；【您可以直接上传 Excel 文件或者下载模板：<a-button type="link" @click="downloadExcel">
                                模板下载</a-button>】 <span style="color: #000000;font-weight: bold;">Excel中的数据请都用<span style="color:red;">文本格式</span>填写，程序对文本格式的数据读取兼容性最好</span></p>
                        <p> 第二步：设置 Excel 里的列与系统中的列的对应关系</p>
                        <p> 第三步：开始导入</p>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="导入日志">
                <importRecord v-if="currentKey == 2" :type="uploadType" />
            </a-tab-pane>
        </a-tabs>
        <template slot="footer" v-if="!isImporting">
            <div class="footer_con" style="display: flex;justify-content: space-between;align-items: center;width: 100%;">
                <div v-if="firstStep" class="left"> </div>
                <div class="right">
                    <a-button type="primary" @click="startImport" style="margin-left: 10px;">开始导入</a-button>
                    <a-button type="default" @click="handleCancel" style="margin-left: 10px;">取消</a-button>
                </div>
            </div>
        </template>
        
        <div class="progress_content" style="width: 100%; height: 450px; display: flex; align-items: center; justify-content:center; flex-direction: column;" v-if="isImporting && currentKey!=2">
            <a-progress type="circle" :stroke-color="{'0%': '#108ee9','100%': '#87d068',}" :percent="percentVal"/>
            <div class="importing" style="margin-top: 15px;">
                总行数 <span style="font-size: larger">{{ readRowTotal }}</span>，正在导入，剩余<span style="font-size: larger">{{readRowTotal - (successInsterTotal +errorTotal) }} </span> 条记录待导入，成功<span style="color: #68C472;font-size: larger">{{successInsterTotal}}</span>条,失败<span style="color: red;font-size: larger"> {{ errorTotal }} </span>条
            </div>
            <div class="desc" style="margin-top: 15px; color: #999999; font-size: 14px;">
                <span v-if="percentVal != 100">提示：正在等待导入，如果关闭本窗口，导入不会中断</span>
                <span v-else>导入完成</span>
                <a-button v-if="percentVal == 100" type="link" @click="goBack">重新导入</a-button>
            </div>
        </div>
        
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import store from 'vuex';
    import { getTokenName, getCookie, setCookie, getSystemName } from '../../../../../utils/util.js';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        nextTick,
        defineComponent,
        getCurrentInstance
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import importRecord from "./importRecord.vue";
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            uploadType: {
                type: String,
                default: 'billExcel'
            }
        },
        
        components: {
            importRecord
        },

        setup(props, context) {
            let isSkip = ref(0)
            let interval = ref(null)
            let isImporting = ref(false)
            let currentIndex = ref(0)
            const uploadUrl = ref('/v20/public/index.php/community/common.BillExcel/billUploadFile')
            const fileList = ref([])
            let uploadLoading = ref(false)
            let firstStep = ref(true)
            let selectWorkSheetIndex = ref(0) //选择的 sheet 索引
            let uploadFileName = ref('')
            let chargeNumber = ref([])
            let subjectId = ref(null)
            let chargeProject = ref([])
            let projectId = ref(null)
            let order_msg= ref('欠费')
            let xtitle= ref('欠费账单导入向导')
            if(props.uploadType=='billPayExcel'){
                xtitle.value='一次性已缴费用导入向导'
                order_msg.value='已缴'
            }
            // 获取科目
            const getChargeNumber = () => {
                Vue.prototype.request('/community/common.BillExcel/getChargeSubject', {tokenName: tokenNameSys.value}).then((res) => {
                    chargeNumber.value = res
                    console.log('getChargeNumber', res)
                }).catch(e => {
                    console.log('getChargeNumber', e)
                })
            }
            // 获取项目
            const getChargeProject = (subject_id) => {
                Vue.prototype.request('/community/common.BillExcel/getChargeProject', {subject_id: subject_id, tokenName: tokenNameSys.value}).then((res) => {
                    chargeProject.value = res
                    console.log('chargeProject', res)
                }).catch(e => {
                    console.log('chargeProject', e)
                })
            }

            const handleChargeNumberChange = (value) => {
                console.log('handleChargeNumberChange', value)
                subjectId.value = value
                projectId.value = null
                getChargeProject(value);
            }

            const handleChargeProjectChange = (value) => {
                console.log('handleChargeProjectChange', value)
                projectId.value = value
            }

            
            const beforeUploadExcel = (info) => {
                const fileType = info.name.split('.').pop();
                if (fileType != 'xlsx' && fileType != 'xls') {
                    uploadLoading.value = false
                    Vue.prototype.$message.warn(`上传文件格式非 Excel`);
                    return false;
                }
            }

            const handleCancel = () => {
                clearTimer()
                context.emit('exit', false)
            }
            
            const preStep =()=>{
                firstStep.value = true
            }
            
        
            const startImport = () =>{
                if(!subjectId.value){
                    Vue.prototype.$message.warn('请选择收费科目')
                    return
                }
                if(!projectId.value){
                    Vue.prototype.$message.warn('请选择收费项目')
                    return
                }
                if(selectObj.totalRows && selectObj.totalRows == 0){
                    Vue.prototype.$message.warn('请完善上传信息')
                    return
                }
                if(!worksheetName.value){
                    Vue.prototype.$message.warn('请先上传Excel文件')
                    return
                }
                if(!pathUrl.value){
                    Vue.prototype.$message.warn('请先上传Excel文件')
                    return
                }
                Vue.prototype.request('/community/common.BillExcel/startImport', {
                    tokenName: tokenNameSys.value,
                    subjectId: subjectId.value,
                    projectId: projectId.value,
                    inputFileName: pathUrl.value,
                    worksheetName: worksheetName.value,
                    selectWorkSheetIndex:selectWorkSheetIndex.value,
                    type:props.uploadType,
                }).then((res) => {
                    Vue.prototype.$message.success('提交成功，准备导入，调整画面为进度条画面！')
                    isImporting.value = true
                    interval.value = setInterval(()=> {
                        refreshProgress()
                    }, 1000)
                }).catch(e => {
                    isImporting.value = false
                    clearTimer()
                })
            }
            
            // 获取当前页面token
            var tokenName = getTokenName('/community/village_api.Building/villageUploadFile')
            let token = Vue.ls.get(tokenName)
            // 获取当前页面token
            
            const headers = reactive({
                authorization: 'authorization-text',
                ticket: token
            })
            
            
            let pathUrl = ref('')
            let worksheetName = ref('')
            const handleUploadChange = (info) => {
                uploadLoading.value = true
                if (info.file.status !== 'uploading') {
                    uploadLoading.value = true
                }
                if (info.file.status === 'done') {
                    console.log('info.file.response.data.path', info.file.response.data.path)
                    pathUrl.value = info.file.response.data.path
                    uploadLoading.value = false
                    if(info.file.response.status == 1000){
                        uploadFileName.value = info.file.response.data.file_name
                        uploadExcelFile(pathUrl.value)
                    } else{
                        Vue.prototype.$message.error(info.file.response.msg);
                    }
                } else if (info.file.status === 'error') {
                    uploadLoading.value = false
                    Vue.prototype.$message.error(`${info.file.name} file upload failed.`);
                }
            }
            
            const selectObj = ref({})
            
            const handleSelectChange = (index) => {
                selectObj.value = fileList.value[index]
                worksheetName.value = fileList.value[index].worksheetName
                selectWorkSheetIndex.value = index
                getCurrentInstance()
            }
            
            
            const uploadExcelFile = (url) => {
                Vue.prototype.request('/community/common.BillExcel/importForExcel', {
                    inputFileName: url,
                    type:props.uploadType,
                    tokenName: tokenNameSys.value
                }).then((res) => {
                    fileList.value = res.worksheet
                    selectObj.value = res.worksheet[0]
                    worksheetName.value = res.worksheet[0].worksheetName
                    console.log('importForExcel ------>',res)
                    getCurrentInstance()
                }).catch(e => {})
            }
            
            let percentVal   = ref(0)
            let readRowTotal = ref(0)//总共有数据行数
            let successInsterTotal = ref(0)//总共插入表成功条数
            let errorTotal         = ref(0)//总共插入表失败条数
            //刷新进度条
            const refreshProgress = () => {
                Vue.prototype.request('/community/common.BillExcel/refreshProcess', {
                    type:props.uploadType,
                    tokenName: tokenNameSys.value
                }).then((res) => {
                    if (res.process){
                        percentVal.value        = res.process
                        readRowTotal.value      = res.processInfo.readRowTotal
                        successInsterTotal.value= res.processInfo.successInsterTotal
                        errorTotal.value        = res.processInfo.errorTotal
                        if (res.process == 100){
                            Vue.prototype.$message.warn(`导入执行完毕！`);
                            clearTimer()
                        }
                    }
                }).catch(e => {
                    clearTimer()
                })
            }
            
            const clearTimer = ()=>{
                // isImporting.value = false
                clearInterval(interval.value)
                interval.value = null
                pathUrl.value = ''
                worksheetName.value = ''
                uploadFileName.value = ''
                fileList.value = []
            }

            const downloadExcel = () => {
                Vue.prototype.request('/community/common.BillExcel/getImportTemplateUrl', {tokenName: tokenNameSys.value,opttype:props.uploadType}).then((res) => {
                    console.log('downloadExcel', res.url)
                    window.open(res.url)
                }).catch(e => {
                    console.log('downloadExcel', e)
                })
            }
            
            const goBack = ()=>{
                fileList.value = []
                firstStep.value = true
                isImporting.value = false
                percentVal.value = 0
                readRowTotal.value = 0
                readRowTotal.value = 0
                successInsterTotal.value = 0
                errorTotal.value = 0
                uploadFileName.value = ''
                pathUrl.value = ''
                worksheetName.value = ''
                clearInterval(interval.value)
                interval.value = null
            }
            
            let currentKey = ref(1)
            const tabChange = (key) => {
                currentKey.value = key
            }
            let sysName = ref(null)
            let tokenNameSys = ref(null)
            watch(() => props.visible, (val) => {
                sysName.value = getSystemName(location.hash);
                if (sysName.value) {
                    tokenNameSys.value = sysName.value + '_access_token';
                } else {
                    sysName.value = 'village';
                }
                chargeNumber.value = []
                chargeProject.value = []
                subjectId.value = null
                isImporting.value=false;
                currentKey.value=1;
                projectId.value = null
                console.log('val', val)
                getChargeNumber()
            }, {
                deep: true
            })

            return {
                handleCancel,
                headers,
                handleUploadChange,
                currentIndex,
                uploadUrl,
                uploadExcelFile,
                downloadExcel,
                fileList,
                uploadLoading,
                selectObj,
                handleSelectChange,
                firstStep,
                preStep,
                startImport,
                pathUrl,
                beforeUploadExcel,
                interval,
                refreshProgress,
                isImporting,
                percentVal,
                clearTimer,
                isSkip,
                readRowTotal,
                successInsterTotal,
                errorTotal,
                uploadFileName,
                goBack,
                tabChange,
                currentKey,
                getChargeNumber,
                handleChargeNumberChange,
                handleChargeProjectChange,
                chargeNumber,
                chargeProject,
                subjectId,
                projectId,
                sysName,
                xtitle,
                order_msg,
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ .ant-select-dropdown-menu-item{
        height: 32px !important;
    }
</style>
