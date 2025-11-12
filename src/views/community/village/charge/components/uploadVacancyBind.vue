<template>
    <a-modal :title="'导入'+modalTitle" :width="1000" :visible="visible" :maskClosable="false"
        :footer="isImporting || currentKey==2 ?null:undefined" @cancel="handleCancel">
        <a-tabs :default-active-key="1" v-model="currentKey" @change="tabChange">
            <a-tab-pane :key="1" tab="导入操作">
                <div class="step_one" v-show="!isImporting">
                    <h4>步骤一：上传 Excel 文件</h4>
                    <p style="color:red;">请先下载 {{modalTitle}}模板，数据内容请严格Excel模板格式填写，请保证所有单元格都是文本格式，表格一二行内容请不要改动</p>
                    <p>您要从何处导入数据，请选择导入的 Excel 文件</p>
                    <div style="display: flex; width: 80%;">
                        <div class="label" style="width: 82px; text-align:left;">Excel文件</div>
                        <a-upload-dragger style="height: 100px;width: calc(100% - 82px); margin-left: 10px;" name="file"
                            :multiple="true" :action="uploadUrl" :beforeUpload="beforeUploadExcel"
                            :showUploadList="false" :headers="headers" @change="handleUploadChange"
                            :data="{upload_dir: 'building', system_type: 'village', type: uploadType, tokenName: tokenStr}">
                            <a-icon :type="uploadLoading?'loading':'upload'" />
                            {{uploadFileName?uploadFileName:'拖拽或点击上传 Excel 文件'}}
                        </a-upload-dragger>
                    </div>
                    <div v-if="fileList.length>0" class="select_list"
                        style="display: flex;align-items: center;height: 50px;">
                        <div class="label" style="width: 82px; text-align:left;">选择Sheet表</div>
                        <a-select :default-value="0" style="width: 120px; margin-left: 10px;"
                            @change="handleSelectChange">
                            <a-select-option v-for="(item, index) in fileList" :key="index" :value="index">
                                {{item.worksheetName}}
                            </a-select-option>
                        </a-select>
                        <div style="color: red;margin-left: 10px;">
                            总数据量：{{selectObj.totalRows ? (selectObj.totalRows - 1):0}} 条</div>
                    </div>

                    <div v-if="fileList.length>0 && replaceFieldSelect.length > 0" class="select_list"
                        style="display: flex;align-items: center;height: 50px;">
                        <div class="label" style="width: 90px; text-align:left;">数据重复时</div>
                        <a-radio-group name="radioGroup" v-model="isSkip">
                            <a-radio v-for="(item, index) in replaceFieldSelect"
                                :value="item.key">{{item.value}}</a-radio>
                        </a-radio-group>
                        <div style="margin-left: 10px; display: flex;align-items: center;"
                            v-if="isSkip == 'cover' && replaceFieldSelect[1] && replaceFieldSelect[1].children.length>0">
                            <a-select style="width: 120px; margin: 0 10px;" :value="selectreplaceFie"
                                @change="handleReplaceChange">
                                <a-select-option :value="item.option"
                                    v-for="(item, index) in replaceFieldSelect[1].children"
                                    :key="index">{{item.title}}</a-select-option>
                            </a-select>
                            <div style="color: red;">{{selectTips}}</div>
                        </div>
                    </div>
                    <h5>导入步骤：</h5>
                    <p> 第一步：上传存储有{{modalTitle}}的资料 Excel 文件；【您可以直接上传 Excel 文件或者下载模板：<a-button type="link"
                            @click="downloadExcel">
                            {{modalTitle}}模板下载</a-button>】 </p>
                    <p> 第二步：开始导入</p>

                </div>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="导入日志" >
                <importRecord v-if="currentKey == 2" :type="uploadType" :yw_common_id ="rule_id" />
            </a-tab-pane>
        </a-tabs>
        <template slot="footer" v-if="!isImporting">
            <div class="footer_con"
                style="display: flex;justify-content: space-between;align-items: center;width: 100%;">
                <div v-if="firstStep" class="left"> </div>
                <div v-if="!firstStep" class="left">
                    请注意系统列与Excel列的类型要匹配
                </div>
                <div class="right">
                    <a-button type="primary" @click="startImport" style="margin-left: 10px;">开始导入</a-button>
                    <a-button type="default" @click="handleCancel" style="margin-left: 10px;">取消</a-button>
                </div>
            </div>
        </template>

        <div class="progress_content"
            style="width: 100%; height: 450px; display: flex; align-items: center; justify-content:center; flex-direction: column;"
            v-if="isImporting && currentKey!=2">
            <a-progress type="circle" :stroke-color="{'0%': '#108ee9','100%': '#87d068',}" :percent="percentVal" />
            <div class="importing" style="margin-top: 15px;">
                总行数 <span style="font-size: larger">{{ readRowTotal }}</span>，正在导入，剩余<span
                    style="font-size: larger">{{readRowTotal - (successInsterTotal +errorTotal) }} </span>
                条记录待导入，成功<span style="color: #68C472;font-size: larger">{{successInsterTotal}}</span>条,失败<span
                    style="color: red;font-size: larger"> {{ errorTotal }} </span>条
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
    import {
        getTokenName,
        getCookie,
        setCookie,
        getSystemName
    } from '../../../../../utils/util.js';
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
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            uploadType: {
                type: [String, Number],
                default: 'standardVacancyBind'
            },
            rule_id: {
                type: [String, Number],
                default: 0
            }
        },

        components: {
            importRecord
        },

        setup(props, context) {
            const modalTitle = ref('')
            if (props.uploadType == 'standardVacancyBind') {
                modalTitle.value = '标准绑定【房间】数据'
            }else if(props.uploadType == 'standardPositionBind'){
                modalTitle.value = '标准绑定【车位】数据'
            }
            let isSkip = ref('skip')
            let selectreplaceFie = ref('')
            let interval = ref(null)
            let isImporting = ref(false)
            
            let currentIndex = ref(0)
            const labelList = [{
                name: '系统列'
            }, {
                name: 'Excel列'
            }]
            const uploadUrl = ref('/v20/public/index.php/community/common.ImportExcel/villageUploadFile')
            const fileList = ref([])
            let uploadLoading = ref(false)
            let firstStep = ref(true)
            let refreshSelect = ref(false)
            let selectWorkSheetIndex = ref(0) //选择的 sheet 索引
            let uploadFileName = ref('')
            let tokenStr = ref('')
            let sysName = getSystemName(location.hash)
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
                if (interval.value) {
                    clearInterval(interval.value)
                    interval.value = null
                }
                isImporting.value=false;
                currentKey.value=1;
                context.emit('exit')
            }

            const preStep = () => {
                firstStep.value = true
            }

            const relationship = ref([])

            const handleExcelChange = (value, type) => {
                if (value == 'root' || value == undefined) {
                    relationship.value.map((v, i) => {
                        if (v.key == type) {
                            relationship.value.splice(i, 1)
                        }
                    })
                    return
                }
                let flag = true
                relationship.value.map((v, i) => {
                    if (v.key == type) {
                        v.value = value
                        flag = false
                    }
                })
                if (flag) {
                    relationship.value.push({
                        key: type,
                        value,
                    })
                }
            }

            const nextStep = () => {
                if (selectObj.totalRows && selectObj.totalRows == 0) {
                    Vue.prototype.$message.warn('请完善上传信息')
                    return
                }
                if (!worksheetName.value) {
                    Vue.prototype.$message.warn('请先上传Excel文件')
                    return
                }
                if (!pathUrl.value) {
                    Vue.prototype.$message.warn('请先上传Excel文件')
                    return
                }
                firstStep.value = false
                getSelectList()
            }


            let selectTips = ref('导入数据已存在时，覆盖已存在数据相应字段数据值')
            const handleReplaceChange = (value) => {
                selectreplaceFie.value = value
                replaceFieldSelect.value[1].children.map(v => {
                    if (v.option == value) {
                        selectTips.value = v.msg ? v.msg : '导入数据已存在时，覆盖已存在数据相应字段数据值'
                    }
                })
                getCurrentInstance()
            }

            const startImport = () => {
                let num = sourceMapFields.value.filter(v => v.val.isMust).length
                let count = 0
                sourceMapFields.value.map(item => {
                    relationship.value.map(v => {
                        if (item.val.isMust && v.key == item.val.field) {
                            count++
                        }
                    })
                })
                if (count != num) {
                    Vue.prototype.$message.warn('有必填项未选')
                    return
                }
                Vue.prototype.request('/community/common.ImportExcel/startImport', {
                    tokenName: tokenStr.value,
                    type: props.uploadType,
                    relationship: relationship.value,
                    inputFileName: pathUrl.value.path,
                    worksheetName: worksheetName.value,
                    find_type: isSkip.value,
                    find_value: selectreplaceFie.value,
                    selectWorkSheetIndex: selectWorkSheetIndex.value,
                    rule_id: props.rule_id,
                }).then((res) => {
                    Vue.prototype.$message.success('提交成功，准备导入！')
                    isImporting.value = true
                    interval.value = setInterval(() => {
                        refreshProgress()
                    }, 1000)

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
                    if (info.file.response.status == 1000) {
                        uploadFileName.value = info.file.response.data.file_name
                        uploadExcelFile(pathUrl.value)
                    } else {
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

            const getSelectList = () => {
                Vue.prototype.request('/community/common.ImportExcel/startBindExcelCol', {
                    tokenName: tokenStr.value,
                    type: props.uploadType,
                    inputFileName: pathUrl.value.path,
                    worksheetName: worksheetName.value,
                    selectWorkSheetIndex: selectWorkSheetIndex.value
                }).then((res) => {
                    excelCloumns.value = res.excelCloumns
                    // excelCloumns.value.unshift({key: 'root', val: "空白项"})
                    sourceMapFields.value = res.sourceMapFields
                    relationship.value = []
                    res.sourceMapFields.map(v => {
                        if (v.selected) {
                            let value = res.excelCloumns.filter(item => item.val == v.key)[
                                0].key
                            relationship.value.push({
                                key: v.val.field,
                                value,
                            })
                        }
                    })
                    refreshSelect.value = false
                    nextTick(() => {
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
                    tokenName: tokenStr.value
                }).then((res) => {
                    fileList.value = res.worksheet
                    selectObj.value = res.worksheet[0]
                    worksheetName.value = res.worksheet[0].worksheetName
                    replaceFieldSelect.value = res.replaceFieldSelect
                    if (replaceFieldSelect.value, length > 0) {
                        isSkip.value = replaceFieldSelect.value[0].key
                    }
                    selectreplaceFie.value = res.replaceFieldSelect[1].children[0].option
                    selectTips.value = res.replaceFieldSelect[1].children[0].msg ? res
                        .replaceFieldSelect[1].children[0].msg : '导入数据已存在时，覆盖已存在数据相应字段数据值'
                    getCurrentInstance()
                }).catch(e => {})
            }

            let percentVal = ref(0)
            let readRowTotal = ref(0) //总共有数据行数
            let successInsterTotal = ref(0) //总共插入表成功条数
            let errorTotal = ref(0) //总共插入表失败条数
            //刷新进度条
            const refreshProgress = () => {
                Vue.prototype.request('/community/common.ImportExcel/refreshProcess', {
                    tokenName: tokenStr.value,
                    type: props.uploadType
                }).then((res) => {
                    if (res.process) {
                        isImporting.value = true
                        percentVal.value = res.process
                        readRowTotal.value = res.processInfo.readRowTotal
                        successInsterTotal.value = res.processInfo.successInsterTotal
                        errorTotal.value = res.processInfo.errorTotal
                        if (res.process >= 100) {
                            Vue.prototype.$message.success(`导入执行完毕！`);
                            if (props.uploadType == props.uploadType) {
                                context.emit('exit')
                            }
                            clearTimer()
                        }
                    }
                }).catch(e => {
                    clearTimer()
                })
            }

            const clearTimer = () => {
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

            const goBack = () => {
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
            const getModalUrl = () => {
                Vue.prototype.request('/community/common.ImportExcel/getImportTemplateUrl', {
                    tokenName: tokenStr.value,
                    type: props.uploadType
                }).then((res) => {
                    modalUrl.value = res.url
                })
            }
            
            watch(()=>props.visible, val=>{
                if(val){
                    console.log('props.uploadType', props.uploadType)
                    if (props.uploadType == 'standardVacancyBind') {
                        modalTitle.value = '标准绑定【房间】数据'
                    }else if(props.uploadType == 'standardPositionBind'){
                        modalTitle.value = '标准绑定【车位】数据'
                    }
                    isImporting.value=false;
                    currentKey.value=1;
                    getModalUrl()
                }
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
    /deep/ .ant-select-dropdown-menu-item {
        height: 32px !important;
    }

    /deep/ .ant-modal-body {
        padding: 0 12px !important;
    }
</style>