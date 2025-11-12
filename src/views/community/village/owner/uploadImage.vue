<template>
    <div class="face_upload">
        <div class="top_tips" style="width: 100%;">
            <div>1、请上传1张脸部轮廓清晰的照片，确保为本人照片，否则影响开门</div>
            <div>2、人脸上传成功后可点击下方同步人脸按钮同步至门禁设备中</div>
            <div>3、建议尺寸：{{options.autoCropWidth}}x{{options.autoCropHeight}}</div>
        </div>
        <div class="upload_con">
            <div class="images_list">
                <div class="img_con" v-for="(item, index) in imageList" :key="index">
                    <img preview="1" :src="item.imgPath" alt="">
                    <div class="delete_btn" @click="deleteImage(index)">x</div>
                </div>
            </div>
            <div class="right_operate">
                <a-upload v-if="imageList.length < 1" :show-upload-list="false"
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures" :before-upload="beforeUpload"
                    @change="handleChange">
                    <a-button><a-icon type="upload"/>从本地文件选择</a-button>
                </a-upload>
                <a-button v-if="imageList.length < 1" class="dele_btn" size="small" type="primary" @click="cameraModal">打开摄像头</a-button>
                <a-button v-if="imageList.length == 1" :style="{backgroundColor: isSynchronize?'#999999':''}" class="dele_btn"  type="primary" @click="synchronizeFace">{{isSynchronize?'同步中...':'同步人脸'}}</a-button>
            </div>
        </div>
        
        <div class="top_tips" style="width: 100%; margin-top: 20px;">
            <div :style="{color:faceInfo.face_img_status == 1?'green':'red'}" v-if="faceInfo.face_img_status_txt">{{faceInfo.face_img_status_txt}}</div>
            <div v-if="faceInfo.face_img_reason">{{faceInfo.face_img_reason}}</div>
        </div>

        <a-modal style="z-index: 999;" title="修改头像" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" :width="598"
            :footer="null" @cancel="cancelHandel">
            <a-row>
                <a-col :xs="24" :md="24" :style="{height: '550px'}">
                    <vue-cropper ref="cropper" :img="options.img" :info="true" :autoCrop="options.autoCrop"
                        :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight"
                        :fixedBox="options.fixedBox" @realTime="realTime">
                    </vue-cropper>
                </a-col>
                <!-- <a-col :xs="24" :md="12" :style="{height: '413px'}">
                    <div class="avatar-upload-preview" :style="{height: options.autoCropHeight, width: options.autoCropWidth}">
                        <img :src="previews.url" :style="previews.img"/>
                    </div>
                </a-col> -->
            </a-row>
            <a-row style="margin-top: 10px;">
                <a-col :lg="{span: 1, offset: 2}" :md="2">
                    <a-button icon="plus" @click="changeScale(1)" />
                </a-col>
                <a-col :lg="{span: 1, offset: 1}" :md="2">
                    <a-button icon="minus" @click="changeScale(-1)" />
                </a-col>
                <a-col :lg="{span: 1, offset: 1}" :md="2">
                    <a-button icon="undo" @click="rotateLeft" />
                </a-col>
                <a-col :lg="{span: 1, offset: 1}" :md="2">
                    <a-button icon="redo" @click="rotateRight" />
                </a-col>
                <a-col :lg="{span: 2, offset: 6}" :md="2">
                    <a-button type="primary" @click="finish('blob')">保存</a-button>
                </a-col>
            </a-row>
        </a-modal>

        <a-modal title="摄像头【请先点击‘拍照’在提交】" :visible="cameraVisible" :maskClosable="false" :width="600"
            :footer="null" @cancel="cancelPhotoHandel">
            <div>
                <div class="box">
                    <video id="videoCamera" v-show="!imgSrc" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
                    <canvas id="canvasCamera" v-show="imgSrc" class="canvas" :width="videoWidth" :height="videoHeight"></canvas>
                </div>
                <div>
                    <a-button @click="photographBtn" icon="el-icon-camera" size="small">拍照</a-button>
                    <a-button v-if="os" @click="openCamera" icon="el-icon-video-camera" size="small">打开摄像头</a-button>
                    <a-button v-else @click="stopCamera" icon="el-icon-switch-button" size="small">关闭摄像头</a-button>
                    <a-button @click="resetBtn" icon="el-icon-refresh" size="small">重置</a-button>
                    <a-button @click="submitBtn" icon="el-icon-circle-close" size="small">提交</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        data() {
            return {
                visible: false,
                id: null,
                confirmLoading: false,
                fileList: [],
                uploading: false,
                options: {
                    img: '',
                    autoCrop: true,
                    autoCropWidth: 295,
                    autoCropHeight: 413,
                    fixedBox: true
                },
                previews: {},
                previewVisible: false,
                previewImage: '',
                loading: false,
                imageUrl: '',
                os: false, //控制摄像头开关
                thisVideo: null,
                thisContext: null,
                thisCancas: null,
                imgSrc: '',
                videoWidth: 550,
                videoHeight: 550,
                imageList: [],
                cameraVisible: false,
                uid: '',
                faceInfo: {},
                faceList: [],
                isSynchronize: false
            }
        },
        created() {
            this.uid = this.$route.query.id
            if(this.$route.query.width && this.$route.query.height){
                this.options.autoCropWidth = this.$route.query.width
                this.options.autoCropHeight = this.$route.query.height
            }
            this.getCapFaceInfo()
        },
        methods: {
            getCapFaceInfo(){
                this.request('/community/village_api.FaceDevice/capFaceInfo', {pigcms_id: this.uid}).then(res => {
                    this.faceInfo = res.faceInfo
                    this.faceList = res.list
                    this.imageList = []
                    if(res.list.length>0){
                        res.list.map(v=>{
                            this.imageList.push({imgPath: v.img_url})
                        })
                    }
                })
            },
            
            uploadFaceImage(){
                if(this.imageList.length == 0){
                    this.$message.warn('请先选择上传的图片')
                    return
                }
                this.request('/community/village_api.FaceDevice/uploadFaceImg', {pigcms_id: this.uid, imageBase64: this.imageList[0].imgPath}).then(res => {
                    this.$message.success('图片上传成功！')
                }).catch(err=>{
                    this.$message.error(err.msg)
                })
            },
            
            synchronizeFace(){
                if(this.isSynchronize){
                    this.$message.warn('正在同步中，请稍等')
                    return
                }
                this.isSynchronize = true
                this.request('/community/village_api.FaceDevice/synToDeviceUserImg', {pigcms_id: this.uid}).then(res => {
                    this.isSynchronize = false
                    this.$message.success(res.msg)
                    this.getCapFaceInfo()
                }).catch(err=>{
                    this.isSynchronize = false
                    this.$message.error(err.msg)
                })
            },
            close() {
                this.id = null
                this.visible = false
                this.options.img = ''
            },
            cancelHandel() {
                this.close()
            },
            changeScale(num) {
                num = num || 1
                this.$refs.cropper.changeScale(num)
            },
            rotateLeft() {
                this.$refs.cropper.rotateLeft()
            },
            rotateRight() {
                this.$refs.cropper.rotateRight()
            },
            finish(type) {
                const _this = this
                const formData = new FormData()
                if (type === 'blob') {
                    // this.$refs.cropper.getCropBlob((data) => {
                    //     const img = window.URL.createObjectURL(data)
                    //     this.modelSrc = img
                    //     formData.append('file', data, this.fileName)
                    //     this.$http.post('https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, {
                    //         contentType: false,
                    //         processData: false,
                    //         headers: {
                    //             'Content-Type': 'application/x-www-form-urlencoded'
                    //         }
                    //     }).then((response) => {
                    //         _this.$message.success('上传成功')
                    //         _this.$emit('ok', response.url)
                    //         _this.visible = false
                    //     })
                    // })
                    this.$refs.cropper.getCropData((data) => {
                        this.imageUrl = data
                        this.imageList.push({imgPath: data})
                        this.visible = false
                        this.options.img = ''
                        this.uploadFaceImage()
                        this.$previewRefresh();
                    })
                }
            },
            realTime(data) {
                this.previews = data
            },

            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.options.img = imageUrl
                        this.visible = true
                        this.loading = false;
                    });
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },

            //原生摄像头
            submitBtn() {
                if(!this.imgSrc){
                    this.$message.warn('请先点击【拍照】后，在进行提交')
                    return
                }
                this.options.img = this.imgSrc
                this.visible = true
                this.cameraVisible = false
                this.$nextTick(()=>{
                    this.imgSrc = ''
                })
            },
            // 调用摄像头权限
            openCamera() {
                //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
                this.$nextTick(() => {
                    const _this = this;
                    this.os = false; //切换成关闭摄像头
                    this.thisCancas = document.getElementById('canvasCamera');
                    this.thisContext = this.thisCancas.getContext('2d');
                    this.thisVideo = document.getElementById('videoCamera');
                    // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
                    if (navigator.mediaDevices === undefined) {
                        navigator.mediaDevices = {}
                    }
                    // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                    if (navigator.mediaDevices.getUserMedia === undefined) {
                        navigator.mediaDevices.getUserMedia = function(constraints) {
                            // 首先获取现存的getUserMedia(如果存在)
                            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
                                navigator.getUserMedia;
                            // 保持接口一致
                            if (!getUserMedia) {
                                return Promise.reject(new Error(
                                    'getUserMedia is not implemented in this browser'))
                            }
                            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                            return new Promise(function(resolve, reject) {
                                getUserMedia.call(navigator, constraints, resolve, reject)
                            })
                        }
                    }
                    const constraints = {
                        audio: false,
                        video: {
                            width: _this.videoWidth,
                            height: _this.videoHeight,
                            transform: 'scaleX(-1)'
                        }
                    };
                    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
                        // 旧的浏览器可能没有srcObject
                        if ('srcObject' in _this.thisVideo) {
                            _this.thisVideo.srcObject = stream
                        } else {
                            // 避免在新的浏览器中使用它，因为它正在被弃用。
                            _this.thisVideo.src = window.URL.createObjectURL(stream)
                        }
                        _this.thisVideo.onloadedmetadata = function(e) {
                            _this.thisVideo.play()
                        }
                    }).catch(err => {
                        this.$message.error('没有开启摄像头权限或浏览器版本不兼容');
                    });
                });
            },
            //拍照按钮
            photographBtn() {
                this.thisContext.drawImage(this.thisVideo, 0, 0, this.videoWidth, this.videoHeight);
                this.imgSrc = this.thisCancas.toDataURL('image/png');
            },
            //清空画布
            clearCanvas(id) {
                let c = document.getElementById(id);
                let cxt = c.getContext("2d");
                cxt.clearRect(0, 0, c.width, c.height);
            },
            //重置画布
            resetBtn() {
                this.imgSrc = "";
                this.clearCanvas('canvasCamera');
            },
            //关闭摄像头
            stopCamera() {
                if (this.thisVideo && this.thisVideo !== null) {
                    this.thisVideo.srcObject.getTracks()[0].stop();
                    this.os = true; //切换成打开摄像头
                }
            },
            cancelPhotoHandel(){
                this.cameraVisible = false
                this.imgSrc = ''
            },
            deleteImage(index){
                this.faceInfo = {}
                this.imageList.splice(index, 1)
            },
            cameraModal(){
                this.cameraVisible = true
                this.options.img = ''
                this.openCamera();
            }
        }
    }
</script>

<style lang="less" scoped>
    .face_upload {
        padding: 20px;

        .upload_con {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 10px;
            .images_list{
                display: flex;
                .img_con{
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 5px;
                    position: relative;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                    .delete_btn{
                        position: absolute;
                        right: 3px;
                        top: 3px;
                        width: 20px;
                        height: 20px;
                        background-color: red;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #ffffff;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 17px;
                    }
                }
            }
            
            .right_operate {
                margin-left: 20px;
                display: flex;
                flex-direction: column;

                .preview_btn {}

                .dele_btn {
                    margin-top: 12px;
                }
            }
        }
    }

    .avatar-upload-preview {
        position: absolute;
        top: 50%;
        transform: translate(50%, -50%);
        width: 295px;
        height: 413px;
        box-shadow: 0 0 4px #ccc;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }

    .avatar-uploader>.ant-upload {
        width: 108px;
        height: 108px;
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>
