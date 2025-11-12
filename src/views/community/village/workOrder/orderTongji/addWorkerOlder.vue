<template>
    <a-drawer title="添加工单" placement="right" :closable="false" :visible="workVisible" :body-style="{ paddingBottom: '80px' }" :width="900" @close="onClose">
        <a-form-model ref="ruleForm" :model="workerForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="对应位置" prop="address_id" v-if="workVisible">
                <a-select show-search placeholder="请选择" style="width: 120px" @change="(value)=>housePositionChange1(value, 0)">
                    <a-select-option v-for="(item,idd_a) in housePositionList" :key="item.id" :value="item.id + '-' + idd_a">
                        {{item.name}}
                    </a-select-option>
                </a-select>
                
                <a-select v-if="positionChild1.length!=0" show-search placeholder="请选择" style="width: 120px" @change="(value)=>housePositionChange1(value, 1)">
                    <a-select-option v-for="(item,index) in positionChild1" :key="item.id" :value="item.name">
                        {{item.name}}
                    </a-select-option>
                </a-select>
                
                <a-select v-if="positionChild2.length!=0" show-search placeholder="请选择" style="width: 120px" @change="(value)=>housePositionChange1(value, 2)">
                    <a-select-option v-for="(item,index) in positionChild2" :key="item.id" :value="item.name">
                        {{item.name}}
                    </a-select-option>
                </a-select>
                
                <a-select v-if="positionChild3.length!=0" show-search placeholder="请选择" style="width: 120px" @change="(value)=>housePositionChange1(value, 3)">
                    <a-select-option v-for="(item,index) in positionChild3" :key="item.id" :value="item.name">
                        {{item.name}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            
            <a-form-model-item label="请选择上报人员">
                <a-select show-search placeholder="请输入姓名或手机号搜索"  :default-active-first-option="false" :filter-option="false" :not-found-content="null"
                        @change="saveHandleSelectOpt" @search="handleSearchUser">
                    <a-select-option v-for="(item,index) in searchUserList" :value="item.u_idd">
                                {{item.xname}}
                   </a-select-option>
                 </a-select>
            </a-form-model-item>
            
            <a-form-model-item label="工单类目" prop="cat_fid">
                <a-select @change="(value)=>handleSelectChange(value, 'cat_fid')" :value="workerForm.cat_fid"
                    placeholder="请选择工单类目">
                    <a-select-option v-for="(item,index) in orderCategory" :value="item.category_id">
                        {{item.subject_name}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="工单分类" prop="cat_id">
                <a-select @change="(value)=>handleSelectChange(value, 'cat_id')" :value="workerForm.cat_id"
                    placeholder="请选择工单分类">
                    <a-select-option v-for="(item,index) in orderClassification" :value="item.cat_id">
                        {{item.cate_name}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="标签" prop="label_txt">
               <a-transfer
                    :locale = "{
                       itemUnit: '【已选】', 
                       itemsUnit: '【全部】', 
                       notFoundContent: '列表为空', 
                       searchPlaceholder: '请输入搜索内容' 
                    }"
                    show-search
                    :rowKey="record => record.key"
                    :data-source="labelList"
                    :list-style="{
                        width: '200px',
                        height: '270px',
                    }"
                    :render="renderItem"
                    :show-select-all="true"
                    :target-keys="targetKeys"
                    @change="handleTransferChange">
               </a-transfer>
            </a-form-model-item>

            <a-form-model-item label="补充内容" prop="order_content">
                <a-textarea style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入" v-model="workerForm.order_content" />
            </a-form-model-item>

            <a-form-model-item label="" prop="order_imgs" v-if="workVisible">
                <a-upload
                    style="transform: translateX(140px);"
                    action="/v20/public/index.php/community/village_api.ContentEngine/uploadFile" list-type="picture-card"
                    :file-list="fileList" @preview="handlePreview" @change="(value)=>handleUploadChange(value, 'image')" :before-upload="beforeUpload">
                    <div v-if="fileList.length < 8">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">
                            Upload
                        </div>
                    </div>
                </a-upload>
                
                <div class="desc" style="transform: translateX(140px);">
                    已上传{{fileList.length}}张, 最多可上传8张
                </div>
            </a-form-model-item>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img v-if="previewImage" alt="example" style="width: 100%" :src="previewImage" />
                <video v-else style="width: 100%; height: 100%;" autoplay :src="previewVideo" />
            </a-modal>
            <a-form-model-item label="" prop="videos" v-if="workVisible && videoParams && videoParams.uploadVideoMax">
                <div class="desc" style="transform: translateX(140px);">
                    上传视频
                </div>
                
                <div class="video_list" style="transform: translateX(140px);">
                    <div class="video_item" v-for="(item, index) in videoList" :key="index">
                        <img style="width: 95px; height: 95px; border-radius: 5px;" :src="item.image" />
                        <div class="operate_con">
                            <a-icon @click="previewThisVideo(item)" style="color: #fff;" type="eye" />
                            <a-icon @click="deleteVideo(index)" style="margin-left: 10px; color: #fff;" type="delete" />
                        </div>
                    </div>
                    <a-upload
                        style="margin-top: 6px;"
                        accept="video/mp4" :data="{upload_dir: 'video'}" :file-list="videoFileList" @preview="handlePreview"
                        action="/v20/public/index.php/common/common.UploadFile/uploadVideo" list-type="picture-card" name="video"
                        :showUploadList="false" @change="(value)=>handleUploadChange(value, 'video')" :before-upload="beforeUpload">
                        <div v-if="videoList.length < videoParams.uploadVideoMax">
                            <template v-if="uploadLoading">
                                <a-icon type="loading" />
                            </template>
                            <template v-else>
                                <a-icon type="plus" />
                                <div class="ant-upload-text">
                                    Upload
                                </div>
                            </template>
                        </div>
                    </a-upload>
                </div>
                
                <div class="desc" style="transform: translateX(140px);">
                    已上传{{videoList.length}}个, 最多可上传{{videoParams.uploadVideoMax?videoParams.uploadVideoMax:'8'}}个
                </div>
            </a-form-model-item>
            
            <a-form-model-item label="上门时间" prop="go_time" v-if="workVisible">
                <a-date-picker style="width: 400px;" :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm" @change="onDateChange" />
            </a-form-model-item>
            
            <div v-if="is_lantiancom>0">
                <a-form-model-item label="订单是否已完成">
                    <a-radio-group name="is_complete" v-model="workerForm.is_complete">
                        <a-radio :value="1">是</a-radio>
                        <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="完成时间" v-if="workerForm.is_complete*1>0">
                    <a-date-picker style="width: 400px;" :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm" @change="onDateCompleteChange" /><div>&nbsp;不选择则默认为当前时间</div>
                </a-form-model-item>
                <a-form-item label="请选择处理人员">
                    <a-select  style="width:400px;"   option-label-prop="label" @change="selectOneWorke" v-model="workerForm.wid" >
                      <a-select-option  v-for="(item,index) in allWorkerList" :value="item.wid" :label="item.name">
                        <span style="color:#000000;font-weight: bold;">{{item.name}}</span><span v-if="item.phone">(手机号：{{item.phone}})</span>
                      </a-select-option>
                    </a-select>
                       <div>&nbsp;指派给选择的工作人员处理</div>
                </a-form-item>
            </div>
        </a-form-model>
        <div
            :style="{
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
            <a-button type="primary" @click="onSubmit">
                确定
            </a-button>
        </div>
    </a-drawer>
</template>

<script>
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    import Vue from 'vue';
    import villageApi from "@/api/community/village"
    import {Transfer} from 'ant-design-vue';
    export default {
        props: {
            workVisible: {
                type: Boolean,
                default: false
            },
            videoParams: {
                type: Object,
                default: ()=>{return {}}
            },
            is_lantiancom: {
                type: [Number,Boolean],
                default: 0
            },
            
        },
        components: {
            'a-transfer': Transfer
        },
        data() {
            return {
                workerForm: {address_id: '', cat_id: undefined, cat_fid: undefined, go_time: '', order_imgs: [], videos: [],u_idd:'',is_complete:0,complete_time:'',wid:0},
                labelCol: {
                    span: 4
                },
                wrapperCol: {
                    span: 14
                },
                rules: {
                    cat_fid: [{required: true, message: '请选择工单类目', trigger: 'blur'} ],
                    cat_id: [{required: true, message: '请选择工单类目', trigger: 'blur'} ],
                    order_content: [{required: true, message: '请输入补充内容', trigger: 'blur'} ],
                    address_id: [{required: false, message: '请选择位置', trigger: 'blur'} ],
                    go_time: [{required: false, message: '请选择上门时间', trigger: 'blur'} ],
                },
                previewVisible: false,
                previewImage: '',
                fileList: [],

                options: [],
                targetKeys: [],
                labelList: [],
                
                orderCategory: [],
                orderClassification: [],
                housePositionList: [],
                positionChild1: [],
                positionChild2: [],
                positionChild3: [],
                videoList: [],
                previewVideo: '',
                videoFileList: [],
                uploadLoading: false,
                searchUserList:[],
                allWorkerList:[],
            }
        },
        
        mounted(){
            this.getHousePosition()
            this.getSubject()
            this.getAllWorkerList()
        },

        methods: {
            onSubmit() {
                let that = this
                if(that.videoParams.is_pic_video && that.workerForm.order_imgs.length == 0 && that.workerForm.videos.length == 0){
                    that.$message.warn('图片或视频最少选择一个')
                    return
                }
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.request(villageApi.repairOrderAdd, that.workerForm).then((res) => {
                            that.$message.success('添加成功！')
                            this.clearForm()
                            this.$refs.ruleForm.resetFields();
                            this.$emit("closeWorker", true)
                        })
                    } else {
                        return false;
                    }
                });
            },
            
            resetForm() {
                this.clearForm()
                this.$refs.ruleForm.resetFields();
                this.$emit("closeWorker", false)
            },
            
            onClose() {
                this.clearForm()
                this.$refs.ruleForm.resetFields();
                this.$emit("closeWorker", false)
            },
            
            uniqueKey(arr){
                return Array.from(new Set(arr));
            },

            handleCancel() {
                this.previewVisible = false;
            },
            handleSearchUser(vv){
               if(vv){
                   this.request('/community/village_api.RepairCenter/getUserInfo', {keyV: vv}).then((res) => {
                       this.searchUserList = res.userList;
                   }).catch((error) => {

                 })
               } else {
                   this.searchUserList = []
               }
            },
            saveHandleSelectOpt(value,option){
                this.workerForm.u_idd=value;
            },
            selectOneWorke(value){
                  this.workerForm.wid=value;
            },
            // 获取员工信息
            getAllWorkerList() {
              this.request(villageApi.getAllWorkerList)
                .then((res) => {
                  if (res.list && res.list.length>0){
                      this.allWorkerList=[{"wid": 0,"phone": "","name": "无"},...res.list];
                  }else{
                      this.allWorkerList=[];
                  }
                })
            },
            housePositionChange1(value, type){
                let that = this
                console.log('type=>',type,'value=>',value);
                if(type == 0){
                    that.positionChild1 = []
                    that.positionChild2 = []
                    that.positionChild3 = []
                    that.housePositionList.map((v, i)=>{
                        if(v.id + '-' +i == value && v.type != 'public'){
                            that.workerForm.address_type = v.type
                            that.workerForm.address_id = v.id
                            that.getHousePositionChidren(v.id, v.type, type)
                        } else if(v.id + '-' +i == value && v.type == 'public'){
                            that.workerForm.address_type = v.type
                            that.workerForm.address_id = v.id
                        }
                    })
                } else if(type == 1){
                    that.positionChild2 = []
                    that.positionChild3 = []
                    that.positionChild1.map(v=>{
                        if(v.name == value && v.type != 'public'){
                            that.workerForm.address_type = v.type
                            that.workerForm.address_id = v.id
                            that.getHousePositionChidren(v.id, v.type, type)
                        } else if(v.name == value && v.type == 'public'){
                            that.workerForm.address_type = v.type
                            that.workerForm.address_id = v.id
                        }
                    })
                } else if(type == 2){
                    that.positionChild3 = []
                    that.positionChild2.map(v=>{
                        if(v.name == value && v.type != 'public'){
                            that.workerForm.address_type = v.type
                            that.workerForm.address_id = v.id
                            that.getHousePositionChidren(v.id, v.type, type)
                        } else if(v.name == value && v.type == 'public'){
                            that.workerForm.address_type = v.type
                            that.workerForm.address_id = v.id
                        }
                    })
                } else if(type == 3){
                    that.positionChild3.map(v=>{
                        if(v.name == value){
                            that.workerForm.address_type = v.type
                            that.workerForm.address_id = v.id
                        }
                    })
                }
            },
            
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVideo = ''
                this.previewVisible = true;
            },
            
            previewThisVideo(item){
                this.previewVideo = item.video
                this.previewImage = ''
                this.previewVisible = true
            },
            
            deleteVideo(index){
                this.videoList.splice(index, 1)
                this.videoFileList.splice(index, 1)
            },
            
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type == 'video/mp4';
                if (!isJpgOrPng) {
                    this.$message.error('您只能上传jpeg png格式的图片或者mp4格式的视频!');
                }
                const isLt2M = file.size / 1024 / 1024 < 20;
                if (!isLt2M) {
                    this.$message.error('图片或者视频大小不能超过20MB!');
                }
                return isJpgOrPng && isLt2M;
            },
            
            handleUploadChange({ file, fileList }, type) {
                let that = this
                if(type == 'image'){
                    that.fileList = fileList
                    that.workerForm.order_imgs = []
                    that.fileList.map(v=>{
                        if(v.response && v.response.data && v.response.data.url){
                            that.workerForm.order_imgs.push(v.response.data.url)
                        }
                    })
                } else {
                    if(file.status && file.status == 'uploading'){
                        that.uploadLoading = true
                    }
                    if(file.status && file.status == 'done'){
                        that.uploadLoading = false
                    }
                    that.videoFileList = fileList
                    that.videoList = []
                    that.workerForm.videos = []
                    that.videoFileList.map(v=>{
                        if(v.response && v.response.data && v.response.data.url){
                            that.videoList.push(v.response.data)
                            that.workerForm.videos.push(v.response.data.url)
                        }
                    })
                }
            },

            handleSelectChange(value, type) {
                this.workerForm[type] = value
                this.$forceUpdate()
                if(type == 'cat_fid'){
                    this.workerForm.cat_id = undefined
                    this.getRepairCate(value)
                } else if(type == 'cat_id'){
                    this.labelList = []
                    this.targetKeys = []
                    this.getLabel(value)
                }
            },
            
            renderItem(item) {
                const customLabel = (
                    <span class="custom-item">
                        {item.title}
                    </span>
                );
        
                return {
                    label: customLabel, // for displayed item
                    value: item.title, // for title and filter matching
                };
            },
            
            handleTransferChange(targetKeys, direction, moveKeys) {
                this.targetKeys = targetKeys;
                this.workerForm.label_txt = targetKeys
            },
            
            clearForm(){
                this.positionChild1 = []
                this.positionChild2 = []
                this.positionChild3 = []
                this.labelList = []
                this.workerForm ={address_id: '', cat_id: undefined, cat_fid: undefined, go_time: '', order_imgs: [], videos: [],u_idd:'',is_complete:0,complete_time:'',wid:0};
                this.targetKeys = []
                this.fileList = []
                this.videoList = []
                this.videoFileList = []
            },
            
            getLabelList(){
                let that = this
                that.request(villageApi.getLabelList, {}).then((res) => {
                    that.labelList = []
                    res.list.map(v=>{
                        that.labelList.push({
                            key: v.id+'',
                            title: v.label_name
                        })
                    })
                })
            },
            
            getHousePosition(){
                let that = this
                that.request(villageApi.getHousePosition, {}).then(res => {
                    that.housePositionList = res
                });
            },

            // 子类
            getHousePositionChidren(id, type, flag) {
                let that = this
                that.request(villageApi.getHousePositionChidren, {id, type,}).then(res => {
                    if(flag == 0){
                        that.positionChild1 = res
                    } else if(flag == 1){
                        that.positionChild2 = res
                    } else if(flag == 2){
                        that.positionChild3 = res
                    }
                });
            },
            
            getSubject(){
                this.request(villageApi.getSubjectOrders, {}).then(res => {
                    this.orderCategory = res
                });
            },
            
            getRepairCate(subject_id){
                let that = this
                this.request(villageApi.getRepairCate, {
                    subject_id,
                }).then(res => {
                    that.orderClassification = res
                });
            },
            
            getLabel(cat_id){
                let that = this
                this.request(villageApi.getLabel, {
                    cat_id,
                }).then(res => {
                    res.map(v=>{
                        that.labelList.push({
                            key: v.id+'',
                            title: v.name
                        })
                    })
                });
            },
            
            onDateChange(date, dateString){
                this.workerForm.go_time = dateString
            },
            onDateCompleteChange(date, dateString){
                this.workerForm.complete_time = dateString
            }
        },
    }
</script>

<style lang="less" scoped>
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
    
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
    
    .video_list{
        display: flex;
        align-items: center;
        .video_item{
            flex-shrink: 0;
            width: 105px;
            height: 105px;
            margin-right: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #eee;
            border-radius: 5px;
            position: relative;
            .operate_con{
                display: none;
            }
            &:hover{
                .operate_con{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, .3);
                }
            }
            
        }
    }
    
</style>
