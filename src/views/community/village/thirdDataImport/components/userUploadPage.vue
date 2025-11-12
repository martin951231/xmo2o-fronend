<template>
    <div class="user-upload-page-box">
        <div v-if="!isImporting">
            <div class="third-user-upload-page">
                <h4>上传 <b>业主信息</b> Excel 文件</h4>
                <p>您要从何处导入数据，请选择导入的 Excel 文件</p>
               <p>
                    注意事项：<br/>
                    1、导入成功后的信息，如果要修改信息不要变动关键字和房号。<br/>
                    2、如果有导出错误会立马自动下载对应错误信息excel表。<br/>
                </p>
                <div style="display: flex; width: 50%;">
                    <div class="label" style="width: 82px; text-align:left;">Excel文件</div>
                    <a-upload-dragger style="height: 150px;width: calc(100% - 82px); margin-left: 10px;" name="file" :multiple="false" :action="uploadUrl" :beforeUpload="beforeUploadExcel"
                        :file-list="fileList" :showUploadList="true" :headers="headers" @change="handleUploadChange"
                        :data="{upload_dir: 'thirdUser', system_type: 'village', type: 'thirdUserInfo'}">
                        <a-icon :type="uploadLoading?'loading':'upload'" /> 拖拽或点击上传 Excel 文件
                    </a-upload-dragger>
                </div>
            </div>
            <div style="width: calc(50% + 82px);text-align: center;margin-top: 60px;">
                <a-button type="primary" icon="upload" size="large" :loading="imporLoading"  @click="startImport">开始导入</a-button>
            </div>
        </div>
        
        <div class="progress_content" style="width: 100%; height: 450px; display: flex; align-items: center; justify-content:center; flex-direction: column;" v-if="isImporting">
            <a-progress type="circle" :stroke-color="{'0%': '#108ee9','100%': '#87d068',}" :percent="percentVal"/>
            <div class="importing" style="margin-top: 15px;">
                正在导入，剩余{{surplusVal}}行记录待导入，成功<span style="color: #68C472;">{{successVal}}</span>行。。。
            </div>
            <div class="desc" style="margin-top: 15px; color: #999999; font-size: 14px;">
                正在等待导入，稍候
            </div>
        </div>
    </div>
    
</template>

<script>
    import Vue from 'vue'
    import villageNew from "@/api/community/village/villageNewApi";
    import { getSystemName } from '@/utils/util';

    export default {
        name: 'thirdUserUploadPage',
        data () {
            return {
                uploadLoading : false,
                imporLoading  : false,
                isImporting   : false,
                interval      : null,
                pathUrl       : '',
                fileList      : [],
                percentVal    : 0,
                successVal    : 0,
                surplusVal    : 0,
                firstLoading  : true,
                headers       : {},
                uploadUrl     : '',
                tokenName     : '',
                sysName       : '',
                orderGroupId  : '',
            }
        },
        activated() {
            this.clearData()
        },
        mounted () {
            this.clearData()
        },
        methods: {
            clearData() {
                if (!this.firstLoading) {
                    return false
                }
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.firstLoading  = false
                this.uploadLoading = false
                this.imporLoading  = false
                this.isImporting   = false
                this.interval      = null
                this.pathUrl       = ''
                this.fileList      = []
                this.percentVal    = 0
                this.successVal    = 0
                this.surplusVal    = 0
                this.headers       = {
                    authorization: 'authorization-text',
                    ticket: Vue.ls.get(this.tokenName)
                }
                this.uploadUrl = '/v20/public/index.php/' + villageNew.thirdVillageUploadFile
            },
            beforeUploadExcel(info) {
                const fileType = info.name.split('.').pop();
                if (fileType != 'xlsx' && fileType != 'xls') {
                    this.uploadLoading = false
                    this.$message.warn(`上传文件格式非Excel`);
                    return false;
                }
            },
            handleUploadChange(info) {
                this.uploadLoading = true
                if (info.file.status === "removed") {
                    this.uploadLoading = false
                    this.fileList      = []
                    this.pathUrl       = ''
                    this.$message.warn(`删除上传文件 ${info.file.name} 成功。`);
                } else if (info.file) {
                    this.fileList      = [info.file]
                }
                if (info.file.status === 'done') {
                    this.pathUrl       = info.file.response.data
                    this.uploadLoading = false
                    if(info.file.response.status == 1000){
                        this.$message.success(`${info.file.name} 文件上传成功。`);
                    } else{
                        this.$message.error(info.file.response.msg);
                    }
                } else if (info.file.status === 'error') {
                    this.uploadLoading = false
                    this.$message.error(`${info.file.name} 文件上传失败。`);
                }
            },
            startImport(){
                if (!this.pathUrl) {
                    this.$message.error(`请先上传文件。`);
                    return false
                }
                this.imporLoading = true
                let that = this;
                this.request(villageNew.thirdStartUserImport, {
                    'inputFileName': this.pathUrl
                }).then((res) => {
                    console.log('1111111---',res)
                    that.orderGroupId = res.orderGroupId
                    that.imporLoading = false
                    that.$message.success('提交成功，准备导入，调整画面为进度条画面！')
                    that.isImporting = true
                    that.successVal  = 0;
                    that.surplusVal  = 0
                    that.percentVal  = 0;
                    that.interval = setInterval(()=> {
                        that.refreshProgress()
                    }, 2000)
                }).catch(e => {
                    that.imporLoading = false
                })
            },
            refreshProgress(){
                let that = this;
                this.request(villageNew.thirdRefreshProcess, {
                    type         : 'thirdUserInfo',
                    orderGroupId : this.orderGroupId,
                }).then((res) => {
                    that.percentVal = res.process
                    if (res.success) {
                        that.successVal = res.success
                    }
                    if (res.surplus) {
                        that.surplusVal = res.surplus
                    }
                    if (res.excelInfo) {
                        window.open(res.excelInfo);
                    }
                    if (res.process >= 100) {
                        setTimeout(function () {
                            that.$message.success('导入完成！')
                            that.imporLoading = false
                            that.orderGroupId = '';
                            that.clearTimer()
                        }, 800)
                    }
                }).catch(e => {
                    console.log('e',e)
                    that.imporLoading = false
                    that.clearTimer()
                })
            },
            clearTimer(){
                this.isImporting = false
                clearInterval(this.interval)
                this.interval = null
            }
        }
    }
</script>

