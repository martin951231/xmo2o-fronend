<template>
    <a-modal :title="'导入'+modalTitle" :width="1100" :visible="visible" :maskClosable="false" :footer="isImporting?null:undefined"
        @cancel="handleCancel">
        <a-tabs :default-active-key="1" @change="tabChange">
            <a-tab-pane :key="1" tab="导入操作">
                <div class="step_one" v-show="!isImporting">
                    <h4>步骤一：上传 Excel 文件</h4>
                    <p>您要从何处导入数据，请选择导入的 Excel 文件</p>
                    <div style="display: flex; width: 80%;">
                        <div class="label" style="width: 82px; text-align:left;">Excel文件</div>
                        <a-upload-dragger ref="upload_file_ref" style="height: 100px;width: calc(100% - 82px); margin-left: 10px;" name="file" :multiple="true" :action="uploadUrl" :beforeUpload="beforeUploadExcel"
                            :showUploadList="false" :headers="headers" @change="handleUploadChange"
                            :data="{upload_dir: 'building', system_type: 'village', type: uploadType, tokenName: tokenStr}">
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
                    <p> 第一步：上传存储有{{modalTitle}}的资料 Excel 文件；【您可以直接上传 Excel 文件或者下载模板：<a-button type="link" @click="downloadExcel">
                            {{modalTitle}}模板下载</a-button>】 </p>
                    <p> 第二步：设置 Excel 里的列与系统中的列的对应关系</p>
                    <p> 第三步：开始导入</p>

                </div>
            </a-tab-pane>

        </a-tabs>
        <template slot="footer" v-if="!isImporting">
            <div class="footer_con" style="display: flex;justify-content: end;align-items: center;width: 100%;">
                <div class="right">
                    <a-button type="primary" @click="startImport" style="margin-left: 10px;" :loading="isImporting">开始导入</a-button>
                    <a-button type="default" @click="handleCancel" style="margin-left: 10px;">取消</a-button>
                </div>
            </div>
        </template>
        <div v-if="isImporting" style="margin: 32px;">
            <div style="display: flex;align-items: center;flex-direction: column;width: 100%;margin-bottom: 20px;">
                <a-icon style="font-size: 60px;" type="loading" />
                <span>正在导入，请稍后...</span>
            </div>
        </div>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import { getTokenName, getCookie, setCookie, getSystemName } from '../../../../../utils/util.js';
    import importRecord from "./importRecord.vue";
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
    import store from '@/store';
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            upload_type: {
                type: [String, Number],
                default: 0
            },
            uploadType: {
                type: String,
                default: ''
            }
        },

        components: {
            importRecord
        },

        setup(props, context) {
            let modalTitle = ref('')
            if(props.uploadType == 'uploadBuilding'){
                modalTitle.value = store.getters.config.single_name
            }
            if(props.uploadType == 'uploadUnit'){
                modalTitle.value = store.getters.config.floor_name
            }
            if(props.uploadType == 'uploadFloor'){
                modalTitle.value = '楼层'
            }
            if(props.uploadType == 'uploadRoom'){
                modalTitle.value = store.getters.config.room_name
            }
            if(props.uploadType == 'uploadThreeTable'){
                modalTitle.value = '三表'
            }

            let isSkip = ref('skip')
            let selectreplaceFie = ref('')
            let interval = ref(null)
            let isImporting = ref(false)
            let currentIndex = ref(0)
            const labelList = [{name: '系统列'}, {name: 'Excel列'}]
            const uploadUrl = ref('/v20/public/index.php/community/common.ImportExcel/villageUploadFile')
            const fileList = ref([])
            let uploadLoading = ref(false)
            let firstStep = ref(true)
            let refreshSelect = ref(false)
            let selectWorkSheetIndex = ref(0) //选择的 sheet 索引
            let uploadFileName = ref('')
            let tokenStr = ref('')
            let sysName = getSystemName(location.hash)
            const worksheetAllData = ref([])
            const worksheetInvalidData = ref([])
            const upload_file_ref = ref(null)
            tokenStr.value = sysName + '_access_token';
            const beforeUploadExcel = (info) => {
                const fileType = info.name.split('.').pop();
                if (fileType != 'xlsx' && fileType != 'xls') {
                    uploadLoading.value = false
                    Vue.prototype.$message.warn(`上传文件格式非 Excel`);
                    return false;
                }
            }

            const handleCancel = () => {
                if(interval.value){
                    clearInterval(interval.value)
                    interval.value = null
                }
                context.emit('exit', false)
            }

            const preStep =()=>{
                firstStep.value = true
            }

            const relationship = ref([])

            const handleExcelChange = (value, type) =>{
                if(value == 'root' || value == undefined){
                    relationship.value.map((v, i)=> {
                        if(v.key == type){
                            relationship.value.splice(i, 1)
                        }
                    })
                    return
                }
                let flag = true
                relationship.value.map((v, i)=> {
                    if(v.key == type){
                        v.value = value
                        flag = false
                    }
                })
                if(flag){
                    relationship.value.push({key: type, value,})
                }
            }

            const nextStep = ()=>{
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
                firstStep.value = false
                getSelectList()
            }


            let selectTips = ref('导入数据已存在时，覆盖已存在数据相应字段数据值')
            const handleReplaceChange = (value) => {
                selectreplaceFie.value = value
                replaceFieldSelect.value[1].children.map(v=>{
                    if(v.option == value){
                        selectTips.value = v.msg?v.msg:'导入数据已存在时，覆盖已存在数据相应字段数据值'
                    }
                })
                getCurrentInstance()
            }

            const startImport = () =>{
                if( isImporting.value ){
                    return false
                }
                isImporting.value = true
                Vue.prototype.request('/community/common.ImportExcel/importApplicationList', {
                    tokenName: tokenStr.value,
                    type: props.uploadType,
                    relationship: relationship.value,
                    inputFileName: pathUrl.value.path,
                    worksheetName: worksheetName.value,
                    find_type: isSkip.value,
                    find_value: selectreplaceFie.value,
                    selectWorkSheetIndex:selectWorkSheetIndex.value,
                    allData: worksheetAllData.value,
                    invalidData: worksheetInvalidData.value,
                }).then((res) => {
                    Vue.prototype.$message.success('导入成功！')
                    if( res.url ){
                        var downloadPath = res.url
                        var downloadLink = document.createElement('a')
                        downloadLink.style.display = 'none' // 使其隐藏
                        downloadLink.href = downloadPath
                        downloadLink.download = ''
                        downloadLink.click()
                        downloadLink.remove()
                    }
                    isImporting.value = false
                }).catch(e => {
                    isImporting.value = false
                    clearTimer()
                })
            }

            // 获取当前页面token
            var tokenName = getTokenName('/community/common.ImportExcel/villageUploadFile')
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
                    uploadLoading.value = false
                }
                if (info.file.status === 'done') {
                    pathUrl.value = info.file.response.data
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

            const excelCloumns = ref([])
            const sourceMapFields = ref([])

            const getSelectList =()=>{
                Vue.prototype.request('/community/common.ImportExcel/startBindExcelCol', {
                    tokenName: tokenStr.value,
                    type: props.uploadType,
                    inputFileName: pathUrl.value.path,
                    worksheetName: worksheetName.value,
                    selectWorkSheetIndex:selectWorkSheetIndex.value
                }).then((res) => {
                    excelCloumns.value = res.excelCloumns
                    // excelCloumns.value.unshift({key: 'root', val: "空白项"})
                    sourceMapFields.value = res.sourceMapFields
                    relationship.value = []
                    res.sourceMapFields.map(v=>{
                        if(v.selected){
                            let value = res.excelCloumns.filter(item=>item.val == v.key)[0].key
                            relationship.value.push({key: v.val.field, value,})
                        }
                    })
                    refreshSelect.value = false
                    nextTick(()=>{
                        refreshSelect.value = true
                    })
                    getCurrentInstance()
                }).catch(e => {})
            }

            let replaceFieldSelect = ref([])
            const uploadExcelFile = (url) => {
                Vue.prototype.request('/community/common.ImportExcel/importForExcel', {
                    tokenName: tokenStr.value,
                    inputFileName: url.path,
                    type: props.uploadType,
                }).then((res) => {
                    if(res.status == '-1'){
                        upload_file_ref.value.clearFiles()
                        return false
                    }
                    fileList.value = res.worksheet
                    selectObj.value = res.worksheet[0]
                    worksheetName.value = res.worksheet[0].worksheetName
                    worksheetAllData.value = res.allData
                    worksheetInvalidData.value = res.invalidData
                    replaceFieldSelect.value = res.replaceFieldSelect
                    if(replaceFieldSelect.value,length>0){
                        isSkip.value = replaceFieldSelect.value[0].key
                    }
                    selectreplaceFie.value = res.replaceFieldSelect[1].children[0].option
                    selectTips.value = res.replaceFieldSelect[1].children[0].msg?res.replaceFieldSelect[1].children[0].msg:'导入数据已存在时，覆盖导入数据相应字段数据值'
                    getCurrentInstance()
                }).catch(e => {})
            }

            let percentVal = ref(0)
            let readRowTotal = ref(0)//总共有数据行数
            let successInsterTotal = ref(0)//总共插入表成功条数
            let errorTotal = ref(0)//总共插入表失败条数
            //刷新进度条
            const refreshProgress = () => {
                Vue.prototype.request('/community/common.ImportExcel/refreshProcess', {
                    tokenName: tokenStr.value,
                    type: props.uploadType
                }).then((res) => {
                    if (res.process){
                        isImporting.value = true
                        percentVal.value = res.process
                        readRowTotal.value = res.processInfo.readRowTotal
                        successInsterTotal.value = res.processInfo.successInsterTotal
                        errorTotal.value = res.processInfo.errorTotal
                        if (res.process == 100){
                            Vue.prototype.$message.success(`导入执行完毕！`);
                            if(props.uploadType == 'uploadBuilding'){
                                context.emit('exit', 'building')
                            } else if(props.uploadType == 'uploadRoom') {
                                context.emit('exit', 'room')
                            }
                            clearTimer()
                        }
                    }
                }).catch(e => {
                    clearTimer()
                })
            }

            const clearTimer = ()=>{
                clearInterval(interval.value)
                interval.value = null
                pathUrl.value = ''
                worksheetName.value = ''
                replaceFieldSelect.value = []
                uploadFileName.value = ''
                fileList.value = []
            }

            const downloadExcel = () => {
                window.open(modalUrl.value)
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
                replaceFieldSelect.value = []
                isSkip.value = 'skip'
            }
            let currentKey = ref(1)
            const tabChange = (key) => {
                currentKey.value = key
            }
            let modalUrl = ref('')
            const getModalUrl = () =>{
                Vue.prototype.request('/community/common.ImportExcel/getImportTemplateUrl', {
                    tokenName: tokenStr.value,
                    type: props.uploadType
                }).then((res) => {
                    modalUrl.value = res.url
                })
            }
            getModalUrl()
            // watch(() => props.visible, (val) => {
            //     if(val){
            //         percentVal.value = 0
            //         readRowTotal.value = 0
            //         readRowTotal.value = 0
            //         successInsterTotal.value = 0
            //         errorTotal.value = 0
            //         fileList.value = []
            //         pathUrl.value = ''
            //         worksheetName.value = ''
            //         replaceFieldSelect.value = []
            //         uploadFileName.value = ''
            //         modalUrl.value = ''
            //     }
            // })
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
                nextStep,
                firstStep,
                preStep,
                startImport,
                labelList,
                getSelectList,
                pathUrl,
                excelCloumns,
                sourceMapFields,
                handleExcelChange,
                relationship,
                beforeUploadExcel,
                refreshSelect,
                interval,
                refreshProgress,
                isImporting,
                percentVal,
                clearTimer,
                replaceFieldSelect,
                selectreplaceFie,
                isSkip,
                handleReplaceChange,
                readRowTotal,
                successInsterTotal,
                errorTotal,
                goBack,
                tabChange,
                currentKey,
                tokenStr,
                modalTitle,
                uploadFileName,
                modalUrl,
                getModalUrl,
                selectTips
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ .ant-select-dropdown-menu-item{
        height: 32px !important;
    }

    /deep/ .ant-modal-body{
        padding: 0 12px !important;
    }
</style>
