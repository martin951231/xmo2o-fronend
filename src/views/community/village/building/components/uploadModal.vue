<template>
    <a-modal :title="$store.getters.config.single_name+'导入向导'" :width="1000" :visible="visible" :maskClosable="false" :footer="isImporting?null:undefined"
        @cancel="handleCancel">
        <a-tabs :default-active-key="1" @change="tabChange">
            <a-tab-pane :key="1" tab="导入操作">
                <div class="step_one" v-show="firstStep && !isImporting">
                    <h4>步骤一：上传 Excel 文件</h4>
                    <p>您要从何处导入数据，请选择导入的 Excel 文件</p>
                    <div style="display: flex; width: 80%;">
                        <div class="label" style="width: 82px; text-align:left;">Excel文件</div>
                        <a-upload-dragger style="height: 100px;width: calc(100% - 82px); margin-left: 10px;" name="file" :multiple="true" :action="uploadUrl" :beforeUpload="beforeUploadExcel"
                            :showUploadList="false" :headers="headers" @change="handleUploadChange"
                            :data="{upload_dir: 'building', system_type: 'village', type: 'building'}">
                            <a-icon :type="uploadLoading?'loading':'upload'" /> 拖拽或点击上传 Excel 文件
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
                    
                    <div v-if="fileList.length > 0" class="select_list" style="display: flex;align-items: center;height: 50px;">
                        <div class="label" style="width: 90px; text-align:left;">数据重复时</div>
                        <a-radio-group name="radioGroup" v-model="isSkip">
                            <a-radio :value="0">跳过</a-radio>
                            <a-radio :value="1">覆盖</a-radio>
                        </a-radio-group>
                        <div style="margin-left: 10px; display: flex;align-items: center;" v-if="isSkip == 1">
                            <div>当</div>
                            <a-select style="width: 120px; margin: 0 10px;" :value="selectreplaceFie" @change="handleReplaceChange">
                                <a-select-option :value="item.option" v-for="(item, index) in replaceFieldSelect" :key="index">{{item.title}}</a-select-option>
                            </a-select>
                            <div>导入数据已存在时，覆盖已存在数据相应字段数据值</div>
                        </div>
                    </div>
                    <h5>导入步骤：</h5>
                    <p> 第一步：上传存储有{{$store.getters.config.single_name}}的资料 Excel 文件；【您可以直接上传 Excel 文件或者下载模板：<a-button type="link" @click="downloadExcel">
                            模板下载</a-button>】 </p>
                    <p> 第二步：设置 Excel 里的列与系统中的列的对应关系</p>
                    <p> 第三步：开始导入</p>
                </div>
                <div class="step_two" v-if="!firstStep && !isImporting">
                    <div class="top_desc" style="display: flex;align-items: center; height: 30px;">
                        <h4>步骤二：【企业客户创建对应关系】建立系统列与Excel列的对应关系</h4>
                        <p style="margin-left: 10px;margin-top: 7px;">建立系统列与Excel列的对应关系</p>
                    </div>
                    <div class="line" style="width: 100%;height: 1px;border: 0;background-color: #999999;margin: 10px 0;"></div>
                    <div class="list">
                        <div class="title">
                            <span>楼层信息</span><span style="margin-left: 10px;color: red;">*号为必填项</span>
                        </div>
                        <div class="top_label" style="width: 100%; height: 30px; display: flex;justify-content: space-between margin-top: 10px;">
                            <div class="left_label" style="width: 50%;display: flex;background-color: #dddddd;border: 1px solid #999999;">
                                <div style="width: 50%;display: flex;align-items: center;justify-content: center;" v-for="(item, index) in labelList" :key="index">{{item.name}}</div>
                            </div>
                            <div class="right_label" style="width: 50%;display: flex;background-color: #dddddd;border: 1px solid #999999;">
                                <div style="width: 50%;display: flex;align-items: center;justify-content: center;" v-for="(item, index) in labelList" :key="index">{{item.name}}</div>
                            </div>
                        </div>
                        <div class="select_con" style="width: 100%;display: flex;flex-wrap: wrap;">
                            <div class="select_list" v-for="(select_item, select_index) in sourceMapFields" :key="select_index" style="width: 50%; display:flex;align-items: center;justify-content: space-around;">
                                <div class="left_label" style="width: 50%; display: flex; align-items: center; justify-content: center;">{{select_item.key}}<span style="color: red; margin-left: 5px;" v-if="select_item.val.isMust">*</span>：</div>
                                <div class="right_select" style="width: 50%; display: flex; align-items: center; justify-content: center;">
                                    <a-select v-if="refreshSelect" :default-value="select_item.selected ? select_item.key : ''" style="width: 200px; margin-left: 10px;margin-top: 10px;" @change="(value)=>handleExcelChange(value, select_item.val.field)">
                                        <a-select-option v-for="(item, index) in excelCloumns" :key="index" :value="item.key" style="height: 32px;">
                                            {{item.val}}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="导入日志">
                导入日志
            </a-tab-pane>
        </a-tabs>
        <template slot="footer" v-if="!isImporting">
            <div class="footer_con" style="display: flex;justify-content: space-between;align-items: center;width: 100%;">
                <div v-if="firstStep" class="left"> </div>
                <div v-if="!firstStep" class="left">
                    请注意系统列与Excel列的类型要匹配
                </div>
                <div class="right">
                    <a-button v-if="!firstStep" type="default" @click="preStep">上一步</a-button>
                    <a-button v-if="firstStep" type="primary" @click="nextStep" style="margin-left: 10px;">下一步</a-button>
                    <a-button v-if="!firstStep" type="primary" @click="startImport" style="margin-left: 10px;">开始导入</a-button>
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
                正在等待导入，你可以关闭本窗口，稍后再来查看 <a-button v-if="percentVal == 100" type="link" @click="goBack">重新导入</a-button>
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
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            upload_type: {
                type: [String, Number],
                default: 0
            }
        },

        setup(props, context) {
            let isSkip = ref(0)
            let selectreplaceFie = ref('')
            let interval = ref(null)
            let isImporting = ref(false)
            let currentIndex = ref(0)
            const labelList = [{name: '系统列'}, {name: 'Excel列'}]
            const uploadUrl = ref('/v20/public/index.php/community/village_api.Building/villageUploadFile')
            const fileList = ref([])
            let uploadLoading = ref(false)
            let firstStep = ref(true)
            let refreshSelect = ref(false)
            let selectWorkSheetIndex = ref(0) //选择的 sheet 索引
            
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
            
            const relationship = ref([])
            
            const handleExcelChange = (value, type) =>{
                if(value == 'root'){
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
            
            const handleReplaceChange = (value) => {
                selectreplaceFie.value = value
                getCurrentInstance()
            }
            
            const startImport = () =>{
                let num = sourceMapFields.value.filter(v=> v.val.isMust).length
                let count = 0
                sourceMapFields.value.map(item=>{
                    relationship.value.map(v=>{
                        if(item.val.isMust && v.key == item.val.field){
                            count ++
                        }
                    })
                })
                if(count != num){
                    Vue.prototype.$message.warn('有必填项未选')
                    return
                }
                Vue.prototype.request('/community/village_api.Building/startImport', {
                    relationship: relationship.value,
                    inputFileName: pathUrl.value,
                    worksheetName: worksheetName.value,
                    isRepeated: isSkip.value,
                    replaceField: selectreplaceFie.value,
                    selectWorkSheetIndex:selectWorkSheetIndex.value
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
                    pathUrl.value = info.file.response.data
                    uploadLoading.value = false
                    if(info.file.response.status == 1000){
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
                Vue.prototype.request('/community/village_api.Building/startBindExcelCol', {
                    inputFileName: pathUrl.value,
                    worksheetName: worksheetName.value,
                    selectWorkSheetIndex:selectWorkSheetIndex.value
                }).then((res) => {
                    console.log('startBindExcelCol res---------->' , res)
                    excelCloumns.value = res.excelCloumns
                    excelCloumns.value.unshift({key: 'root', val: ""})
                    sourceMapFields.value = res.sourceMapFields
                    relationship.value = []
                    res.sourceMapFields.map(v=>{
                        if(v.selected){
                            let value = res.excelCloumns.filter(item=>item.val == v.key)[0].key
                            console.log('value-->',value)
                            relationship.value.push({key: v.val.field, value,})
                        }
                    })
                    console.log('sourceMapFields.value-->',sourceMapFields.value)
                    console.log('relationship.value-->',relationship.value)
                    refreshSelect.value = false
                    nextTick(()=>{
                        refreshSelect.value = true
                    })
                    getCurrentInstance()
                }).catch(e => {})
            }
            
            let replaceFieldSelect = ref([])
            const uploadExcelFile = (url) => {
                Vue.prototype.request('/community/village_api.Building/importForExcel', {
                    inputFileName: url
                }).then((res) => {
                    fileList.value = res.worksheet
                    selectObj.value = res.worksheet[0]
                    worksheetName.value = res.worksheet[0].worksheetName
                    replaceFieldSelect.value = res.replaceFieldSelect
                    selectreplaceFie.value = res.replaceFieldSelect[0].option
                    console.log('importForExcel ------>',res, replaceFieldSelect.value, selectreplaceFie.value)
                    getCurrentInstance()
                }).catch(e => {})
            }
            
            let percentVal   = ref(0)
            let readRowTotal = ref(0)//总共有数据行数
            let successInsterTotal = ref(0)//总共插入表成功条数
            let errorTotal         = ref(0)//总共插入表失败条数
            //刷新进度条
            const refreshProgress = () => {
                Vue.prototype.request('/community/village_api.Building/refreshProcess', {
                    type: 'building'
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
            }

            const downloadExcel = () => {

            }
            
            const goBack = ()=>{
                firstStep.value = true
                isImporting.value = false
            }
            
            let currentKey = ref(1)
            const tabChange = (key) => {
                currentKey.value = key
            }

            watch(() => props.visible, (val) => {

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
                currentKey
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ .ant-select-dropdown-menu-item{
        height: 32px !important;
    }
</style>
