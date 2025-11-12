<template>
    <div class="equipPoint">
        <div class="tip">
            <div class="tip_one">
                1、点击“绘制设备定位”按钮 前，状态为查看绘制，查看所有的绘制成功的设备点位数据，在查看页面支持绑定设备信息
            </div>
            <div class="tip_two">
                2、点击“编辑设备定位”按钮，进入编辑设备点位页面，支持对设备的位置调整、调整后绑定设备数据不变；支持在编辑设备定位页面，删除定位数据，删除定位后，绑定的设备信息也删除。添加绘制设备定位页面，不显示删除按钮，只在编辑设备定位页面，显示删除按钮。一个设备点位只能绑定一个设备信息。
            </div>
        </div>

        <div class="btn_list">
            <div class="draw_point" :class="canDraw ? 'gray': null" @click="drawPoint">绘制设备点位</div>
            <div class="edit_point" :class="canDraw ? 'gray': null" @click="editPoint">编辑设备点位</div>
            <div class="clear_point" v-show="canDraw && pointArr.length>0" @click="delCur">清除</div>
            <div class="confirm_point" v-show="canDraw && pointArr.length>0" @click="savePoint">确定</div>
            <div class="delete_point" v-show="showEditbtn" @click="delPoint">删除</div>
            <div class="confirm_point" v-show="showEditbtn" @click="choosePoint" :class="choosePointStatus?'gray':null">
                {{!choosePointStatus?'选替换点':'取消选点'}}</div>
            <div class="confirm_point" v-show="choosePointStatus && editArr.length>0" @click="editThis">确定替换</div>
            <div class="cancel_edit" v-show="canEdit" @click="cancelEdit">退出编辑</div>
        </div>

        <div class="draw_canvas" ref="canvas_con" @click="selectPoint">
            <img class="back_image" :src="coverImg"
                :style="{width:canvasProp.width, height: canvasProp.height}" />
            <canvas class="my_canvas" id="myCanvas" :width="canvasProp.width" :height="canvasProp.height"></canvas>
        </div>

        <a-modal :title="dialogTitle" :visible="visible" @cancel="handleCancel">
            <a-form-model :model="equipPointForm" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="选择设备">
                    <a-select show-search v-model="equipPointForm.device_name" placeholder="请选择一个设备"
                        option-filter-prop="children" style="width: 200px" :filter-option="filterOption"
                        @change="selectChange">
                        <a-select-option :value="item.id" v-for="(item,index) in deviceList" :key="index">
                            {{item.device_name}}
                        </a-select-option>
                    </a-select>
                    <a-button style="margin-left: 10px;"
                    type="primary"
                    :disabled="buttonLoading" 
                    :loading="buttonLoading" 
                    @click="synchronization">
                    {{buttonLoading?'同步中':'一键同步'}}</a-button>
                </a-form-model-item>
                
                <a-form-model-item label="设备Id" v-if="equipPointForm.new_id">
                    <a-input v-model="equipPointForm.new_id" disabled />
                </a-form-model-item>

                <a-form-model-item label="设备Id" v-else>
                    <a-input v-model="equipPointForm.device_id" disabled />
                </a-form-model-item>

                <a-form-model-item label="设备类型">
                    <a-input v-model="equipPointForm.device_type" disabled />
                </a-form-model-item>

                <a-form-model-item label="横坐标">
                    <a-input v-model="equipPointForm.coordinateX" disabled />
                </a-form-model-item>

                <a-form-model-item label="纵坐标">
                    <a-input v-model="equipPointForm.coordinateY" disabled />
                </a-form-model-item>
                
                <a-form-model-item label="选择图标方式">
                    <a-radio-group name="radioGroup" v-model="iconType" @change="chooseUploadType">
                        <a-radio :value="1">手动上传</a-radio>
                        <a-radio :value="2">使用默认图标</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                
                <a-form-model-item v-if="iconType == 1" label="设备图标" extra="建议使用20x20的图标">
                    <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
                        :action="uploadUrl" :before-upload="beforeUpload" @change="handleChange">
                        <img style="width: 20px; height: 20px;" v-if="imageUrl" :src="imageUrl" alt="avatar" />
                        <div v-else>
                            <a-icon :type="loading ? 'loading' : 'plus'" />
                            <div class="ant-upload-text">
                                Upload
                            </div>
                        </div>
                    </a-upload>
                </a-form-model-item>
                
                <a-form-model-item v-if="iconType == 2" label="默认图标">
                    <div class="icon_con">
                        <div class="icon_item" v-for="(item, index) in defaultIcon" @click="chooseDefaultIcon(item, index)">
                            <div class="icon_item_con">
                                <img :src="item.url" :class="currentIndex == index?'active':''">
                                <span class="icon_title" :style="{color:currentIndex == index?'#409EFF':''}">{{item.name}}</span>
                            </div>
                        </div>
                    </div>
                </a-form-model-item>
            </a-form-model>
            <template slot="footer">
                <a-button type="default" @click="handleCancel">取消</a-button>
                <a-button type="primary" @click="handleOk">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    import configVillageApi from '@/api/community/village/index.js';
    import Rem from '../../../../utils/rem.js';
    import Vue from 'vue';
    export default {
        name: "equipPoint",
        data() {
            return {
                uploadUrl: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                pointArr: [],
                canvasProp: {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0
                },
                canDraw: false,
                canEdit: false,
                visible: false,
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                equipPointForm: {
                    id: '',
                    new_id: '',
                    device_id: '',
                    device_name: '',
                    device_type: '',
                    coordinateX: '',
                    coordinateY: '',
                    img: ''
                },
                pointType: 3,
                deviceList: [],
                coverImg: '',
                coordinate_list: [
                    //  {
                    //     id: 1,
                    //     village_id: 50,
                    //     device_name: "测试充电桩6",
                    //     device_id: 90,
                    //     device_no: "d5734dec-97c0dcc4",
                    //     device_type: "A1",
                    //     device_family: 6,
                    //     coordinate: [766.453125, 327.84375],
                    //     img: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F2105211120031355-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642757635&t=ba22d80539deb11861b2ecc18703718a",
                    //     status: 1,
                    //     add_time: 1637029345
                    // },{
                    //     id: 2,
                    //     village_id: 50,
                    //     device_name: "测试充电桩7",
                    //     device_id: 20,
                    //     device_no: "d5734dec-97c0dcc4",
                    //     device_type: "A2",
                    //     device_family: 6,
                    //     coordinate: [287.453125, 341.84375],
                    //     img: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F052420110515%2F200524110515-11-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642757618&t=20bd1ecd513b9647449a29d057bcac50",
                    //     status: 1,
                    //     add_time: 1637029345
                    // }
                ],
                loading: false,
                imageUrl: '',
                dialogTitle: '',
                equipimgUrl: '',
                delPointarr: [],
                showEditbtn: false,
                choosePointStatus: false,
                editArr: [],
                device_id: null,
                has_device_id: null,
                buttonLoading: false,
                iconType: 1,
                currentIndex: -1,
                defaultIcon: [{url:'https://hf.pigcms.com/static/village_icon/car.png', name: '停车'},
                        {url:'https://hf.pigcms.com/static/village_icon/jiankong.png', name: '监控'},
                        {url:'https://hf.pigcms.com/static/village_icon/renlian.png', name: '人脸'},
                        {url:'https://hf.pigcms.com/static/village_icon/wuxian.png', name: '无线'}]
            }
        },

        created() {
            let that = this
            if(that.$route.query.type){
                that.pointType = that.$route.query.type
            }
            this.$nextTick(() => {
                let domWidth = that.$refs.canvas_con.clientWidth // 宽
                let domHeight = that.$refs.canvas_con.clientHeight // 高
                let canvasLeft = that.$refs.canvas_con.getBoundingClientRect().left
                let canvasTop = that.$refs.canvas_con.getBoundingClientRect().top
                that.canvasProp.width = domWidth - 10 + 'px'
                that.canvasProp.height = domHeight - 10 + 'px'
                that.canvasProp.top = canvasTop
                that.canvasProp.left = canvasLeft
            })
            this.getVillageAreaPic()
            this.getDeviceList()
        },

        methods: {
            // 一键同步
            synchronization(){
                this.buttonLoading = true
                this.request(configVillageApi.getAockpit, {}, 'post').then((res) => {
                    this.buttonLoading = false
                    this.$message.success("同步成功！")
                }).catch(e=>{
                    this.$message.success("同步成功！")
                })
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            chooseDefaultIcon(item, index){
                if(this.currentIndex == index){
                    console.log('重复')
                } else{
                    this.currentIndex = index
                    this.imageUrl = item.url
                    this.equipPointForm.img = item.url
                }
            },
            
            chooseUploadType(){
                // this.currentIndex = -1
            },
            
            getVillageAreaPic() {
                this.request(configVillageApi.getAngeleyeImg, {
                    type: this.pointType
                }, 'post').then((res) => {
                    this.equipimgUrl = res.village_info.url
                    this.coordinate_list = res.coordinate_list
                    if(this.pointType == 1){
                        this.coverImg = res.village_info.village_photo1
                    } else if(this.pointType == 2){
                        this.coverImg = res.village_info.village_photo2
                    } else if(this.pointType == 3){
                        this.coverImg = res.village_info.village_photo3
                        // this.coverImg = 'https://hf.pigcms.com/static/wxapp/images/building_back.png'
                    } else if(this.pointType == 4){
                        this.coverImg = res.village_info.village_photo4
                    }
                    this.initDevicePoint()
                })
            },

            uploadImg(info) {
                if (info.file.status !== 'uploading') {}
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },

            choosePoint() {
                this.choosePointStatus = !this.choosePointStatus
                if (!this.choosePointStatus && this.editArr.length > 0) {
                    let cxt = document.getElementById("myCanvas").getContext("2d");
                    cxt.clearRect(this.editArr[0].x - 11, this.editArr[0].y - 11, 22, 22);
                    this.editArr = []
                }
            },

            initDevicePoint() {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext('2d');
                // ctx.fillStyle = "#409EFF";
                this.coordinate_list.map(v => {
                    if (v.coordinate) {
                        let img = new Image()
                        if (v.img) {
                            img.src = v.img
                        } else {
                            img.src = "https://hf.pigcms.com/static/wxapp/equipPoint/equip_point1.png"
                        }
                        if (v.img * 1 == 0) {
                            img.src = "https://hf.pigcms.com/static/wxapp/equipPoint/equip_point2.png"
                        }
                        img.onload = () => {
                            let pat = ctx.createPattern(img, 'no-repeat');
                            ctx.fillStyle = pat;
                            console.log(v.coordinate[0]-10, v.coordinate[1]-10)
                            // ctx.fillRect(v.coordinate[0]-10, v.coordinate[1]-10, 20, 20);
                            ctx.drawImage(img, v.coordinate[0] - 10, v.coordinate[1] - 10, 20, 20);
                        }
                    }
                })
            },

            judgeDistance(obj) {
                let flag = false
                this.coordinate_list.map(v => {
                    if (v.coordinate) {
                        let x1 = obj.x - 10,
                            x2 = obj.x + 10
                        let y1 = obj.y - 10,
                            y2 = obj.y + 10
                        if (x1 > v.coordinate[0] - 11 && x1 < v.coordinate[0] + 11 && y1 > v.coordinate[1] -
                            11 && y1 < v.coordinate[1] + 11) {
                            flag = true
                            console.log("覆盖=============>1");
                        } else if (x1 > v.coordinate[0] - 11 && x1 < v.coordinate[0] + 11 && y2 > v.coordinate[
                                1] - 11 && y2 < v.coordinate[1] + 11) {
                            flag = true
                            console.log("覆盖=============>2");
                        } else if (x2 > v.coordinate[0] - 11 && x2 < v.coordinate[0] + 11 && y1 > v.coordinate[
                                1] - 11 && y1 < v.coordinate[1] + 11) {
                            flag = true
                            console.log("覆盖=============>3");
                        } else if (x2 > v.coordinate[0] - 11 && x2 < v.coordinate[0] + 11 && y2 > v.coordinate[
                                1] - 11 && y2 < v.coordinate[1] + 11) {
                            flag = true
                            console.log("覆盖=============>4");
                        } else {
                            console.log("未覆盖=======>");
                        }
                    }
                })
                return flag
            },

            selectPoint($el) {
                //添加设备点位
                if (this.canDraw && !this.canEdit && !this.choosePointStatus) {
                    let obj = {}
                    obj.x = $el.clientX - this.canvasProp.left - 5
                    obj.y = $el.clientY - this.canvasProp.top - 5
                    let flag = this.judgeDistance(obj)
                    if (flag && this.pointArr.length == 0) {
                        this.$message.warning('设备点位不可相互覆盖!');
                        return
                    }
                    this.pointArr.push(obj)
                    if (this.pointArr.length <= 1) {
                        this.startDraw(obj)
                    } else {}
                }

                //编辑设备点
                // if(this.canEdit && this.pointArr.length>0){
                //   let pointX = $el.x - this.canvasProp.left
                //   let pointY = $el.y - this.canvasProp.top
                //   if(this.pointArr[0].x-25<pointX && pointX<this.pointArr[0].x+25  && pointY>this.pointArr[0].y-25 && pointY<this.pointArr[0].y+25){
                //     // console.log("在选中的点之内=====================>", pointX, pointY, this.pointArr[0].x, this.pointArr[0].y)
                //     this.equipPointForm.coordinateX = this.pointArr[0].x
                //     this.equipPointForm.coordinateY = this.pointArr[0].y
                //     this.dialogTitle = "添加设备点位"
                //     this.visible = true
                //   } else{
                //     // console.log("在选中的点之外=====================>", pointX, pointY, this.pointArr[0].x, this.pointArr[0].y)
                //   }
                // }

                //选中要绑定设备的点位进行设备绑定
                if (!this.canDraw && !this.canEdit && !this.choosePointStatus) {
                    let pointX = $el.x - this.canvasProp.left - 5
                    let pointY = $el.y - this.canvasProp.top - 5
                    this.coordinate_list.map(v => {
                        if (v.coordinate) {
                            let distanceX = v.coordinate[0]
                            let distanceY = v.coordinate[1]
                            if (distanceX - 10 < pointX && pointX < distanceX + 10 && distanceY - 10 < pointY &&
                                pointY < distanceY + 10) {
                                console.log("this.equipPointForm===>", v)
                                this.equipPointForm.coordinateX = v.coordinate[0]
                                this.equipPointForm.coordinateY = v.coordinate[1]
                                this.equipPointForm.id = v.id
                                if(v.device_id){
                                    this.equipPointForm.device_id = v.device_id
                                }
                                this.equipPointForm.device_name = v.device_name
                                this.equipPointForm.device_type = v.device_type
                                this.equipPointForm.img = v.img
                                this.imageUrl = v.img
                                this.dialogTitle = "编辑设备点位"
                                this.visible = true
                            }
                        }
                    })
                }

                //选择编辑点位
                if (this.canEdit && !this.choosePointStatus) {
                    let pointX = $el.x - this.canvasProp.left - 5
                    let pointY = $el.y - this.canvasProp.top - 5
                    let flag = false
                    this.coordinate_list.map(v => {
                        if (v.coordinate) {
                            let distanceX = v.coordinate[0]
                            let distanceY = v.coordinate[1]
                            if (distanceX - 10 < pointX && pointX < distanceX + 10 && distanceY - 10 < pointY &&
                                pointY < distanceY + 10) {
                                flag = true
                                this.delPointarr = [distanceX, distanceY]
                                this.device_id = v.id
                                this.has_device_id = v.device_id
                                this.clearCanvas()
                                this.getVillageAreaPic()
                                let timeout = setTimeout(() => {
                                    let canvas = document.getElementById('myCanvas');
                                    let ctx = canvas.getContext('2d');
                                    let img = new Image();
                                    img.src = "https://hf.pigcms.com/static/wxapp/equipPoint/select_point.png"
                                    img.onload = () => {
                                        let pat = ctx.createPattern(img, 'no-repeat');
                                        ctx.fillStyle = pat;
                                        // ctx.fillRect(distanceX-8, distanceY-8, 16, 16);
                                        ctx.drawImage(img, distanceX - 8, distanceY - 8, 16, 16);
                                    }
                                    this.showEditbtn = true
                                    clearTimeout(timeout)
                                }, 500)
                            }
                        }
                    })
                    if (!flag && this.delPointarr.length == 0) {
                        this.$message.warning("请先点击选中一个设备点位！");
                    }
                }
                
                //选择替换点位
                if (this.choosePointStatus) {
                    let obj = {}
                    obj.x = $el.clientX - this.canvasProp.left - 5
                    obj.y = $el.clientY - this.canvasProp.top - 5
                    let flag = this.judgeDistance(obj)
                    if (flag && this.editArr.length == 0) {
                        this.$message.warning('所选点位不可与已选点位相互覆盖!');
                        return
                    }
                    this.editArr.push(obj)
                    if (this.editArr.length <= 1) {
                        this.editDraw(obj)
                    } else {}
                }
            },
            
            cancelEdit() {
                this.clearCanvas()
                this.getVillageAreaPic()
                this.canDraw = false
                this.canEdit = false
                this.showEditbtn = false
                this.choosePointStatus = false
                this.delPointarr = []
                this.device_id = null
                this.has_device_id = null
                if (this.editArr.length > 0) {
                    let cxt = document.getElementById("myCanvas").getContext("2d");
                    cxt.clearRect(this.editArr[0].x - 11, this.editArr[0].y - 11, 22, 22);
                    this.editArr = []
                }
            },

            startDraw(obj) {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext('2d');
                let img = new Image();
                img.src = 'https://hf.pigcms.com/static/wxapp/equipPoint/equip_point1.png';
                img.crossOrigin = "Anonymous";
                img.onload = function() {
                    let pat = ctx.createPattern(img, 'no-repeat');
                    ctx.fillStyle = pat;
                    // ctx.fillRect(obj.x-10, obj.y-10, 20, 20);
                    ctx.drawImage(img, obj.x - 10, obj.y - 10, 20, 20);
                };
            },

            editDraw(obj) {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext('2d');
                let img = new Image();
                img.src = 'https://hf.pigcms.com/static/wxapp/equipPoint/equip_point2.png';
                img.crossOrigin = "Anonymous";
                img.onload = function() {
                    let pat = ctx.createPattern(img, 'no-repeat');
                    ctx.fillStyle = pat;
                    // ctx.fillRect(obj.x-10, obj.y-10, 20, 20);
                    ctx.drawImage(img, obj.x - 10, obj.y - 10, 20, 20);
                };
            },

            clearForm() {
                this.equipPointForm = {
                    id: '',
                    new_id: '',
                    device_id: '',
                    device_name: '',
                    device_type: '',
                    coordinateX: '',
                    coordinateY: '',
                    img: ''
                }
                this.loading = false
                this.imageUrl = ''
                this.iconType = 1
                this.currentIndex = -1
            },

            getDeviceList() {
                this.request(configVillageApi.getDeviceList, {
                    type: this.pointType
                }, 'post').then((res) => {
                    this.deviceList = res.list
                })
            },

            savePoint() {
                if (this.pointArr.length > 0) {
                    let params = {
                        coordinate: [this.pointArr[0].x, this.pointArr[0].y],
                        type: this.pointType
                    }
                    this.request(configVillageApi.addCoordinate, params, 'post').then((res) => {
                        this.clearCanvas()
                        this.getVillageAreaPic()
                        this.$message.success("添加成功！")
                        this.canDraw = false
                        this.pointArr = []
                    })
                } else {
                    this.$message.warning('请先选择点位!');
                }
            },

            delPoint() {
                if (this.choosePointStatus) {
                    this.$message.warning("请先取消选点！")
                    return
                }
                let that = this
                that.$confirm({
                    title: '提示',
                    content: '确定要删除此设备点吗？',
                    onOk() {
                        let params = {
                            coordinate: that.delPointarr,
                            type: that.pointType
                        }
                        that.request(configVillageApi.delCoordinate, params, 'post').then((res) => {
                            that.clearCanvas()
                            that.getVillageAreaPic()
                            let cxt = document.getElementById("myCanvas").getContext("2d");
                            cxt.clearRect(that.delPointarr[0] - 11, that.delPointarr[1] - 11, 22, 22);
                            that.canDraw = false
                            that.canEdit = false
                            that.showEditbtn = false
                            that.device_id = null
                            that.delPointarr = []
                            that.$message.success("删除成功！")
                        })
                    },
                    onCancel() {},
                });
            },

            drawPoint() {
                if (this.canDraw) return
                this.canDraw = true
            },

            editPoint() {
                if (this.canDraw) return
                this.canDraw = true
                this.canEdit = true
            },

            editThis() {
                if (this.has_device_id && this.device_id) {
                    let params = {
                        device_id: this.device_id,
                        coordinate: [this.editArr[0].x, this.editArr[0].y],
                        type: this.pointType
                    }
                    this.request(configVillageApi.editCoordinate, params, 'post').then((res) => {
                        this.clearCanvas()
                        this.cancelEdit()
                        this.$message.success("替换成功！")
                        this.canDraw = false
                        this.editArr = []
                        this.device_id = null
                        this.has_device_id = null
                    })
                } else {
                    this.$message.warning("当前选中点未绑定设备！")
                    // let params = {
                    //   coordinate: that.delPointarr
                    // }
                    // that.request(configVillageApi.delCoordinate, params, 'post').then((res) => {
                    //   let cxt=document.getElementById("myCanvas").getContext("2d");
                    //   cxt.clearRect(that.delPointarr[0] - 11, that.delPointarr[1] - 11, 22, 22);
                    //   that.canDraw = false
                    //   that.canEdit = false
                    //   that.showEditbtn = false
                    //   that.device_id = null
                    //   that.delPointarr = []
                    //   that.$message.success("删除成功！")
                    // })
                }
            },

            resetCanvas() {
                if (this.pointArr.length == 0) return
                let cxt = document.getElementById("myCanvas").getContext("2d");
                cxt.clearRect(this.pointArr[0].x - 11, this.pointArr[0].y - 11, 22, 22);
                this.pointArr = []
            },

            delCur() {
                this.canDraw = false
                this.canEdit = false
                this.resetCanvas()
            },

            showModal() {
                this.visible = true;
            },
            handleOk(e) {
                if (!this.equipPointForm.device_id && !this.equipPointForm.new_id) {
                    this.$message.warning('请先选择一个设备!');
                    return
                }
                this.visible = false;
                console.log('submit!', this.equipPointForm);
                this.bindDevice()
            },
            
            clearCanvas(){
                let c = document.getElementById("myCanvas");
                let cxt = c.getContext("2d");
                cxt.clearRect(0, 0, 1000, 1000);
            },

            bindDevice() {
                this.equipPointForm.type = this.pointType
                this.request(configVillageApi.addDeviceCoordinate, this.equipPointForm, 'post').then((res) => {
                    this.clearForm()
                    this.clearCanvas()
                    this.getVillageAreaPic()
                    this.$message.success('绑定成功!');
                })
            },

            handleCancel(e) {
                this.clearForm()
                this.visible = false;
            },
            selectChange(value) {
                this.deviceList.map(v => {
                    if (v.id == value) {
                        this.equipPointForm.device_name = v.device_name
                        this.equipPointForm.device_type = v.device_type
                        this.equipPointForm.new_id = v.id
                    }
                })
            },

            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }

                if (info.file.status === 'error') {
                    this.$message.error('上传失败!');
                    this.loading = false;
                    return;
                }

                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.imageUrl = imageUrl;
                        this.equipPointForm.img = imageUrl
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
        }
    }
</script>

<style lang="less" scoped>
    @rem: 192;

    .equipPoint {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        flex-direction: column;

        .tip {
            width: 55%;
            padding: 120/@rem * 1rem;
            font-size: 32/@rem * 1rem;
            background-color: rgba(#364f6b, .9);
            border-radius: 50/@rem * 1rem;
            margin-top: 30px;
            color: #ffffff;

            .tip_one {}

            .tip_two {
                margin-top: 30/@rem * 1rem;
            }
        }

        .btn_list {
            width: 55%;
            padding: 120/@rem * 1rem 0;
            margin-top: 20px;
            display: flex;

            .draw_point {
                background-color: #409EFF;
                padding: 100/@rem * 1rem;
                color: #ffffff;
                border-radius: 50/@rem * 1rem;
                cursor: pointer;
            }

            .edit_point {
                background-color: #409EFF;
                padding: 100/@rem * 1rem;
                color: #ffffff;
                border-radius: 50/@rem * 1rem;
                margin-left: 300/@rem * 1rem;
                cursor: pointer;
            }

            .clear_point {
                background-color: #FFFFFF;
                padding: 75/@rem * 1rem 100/@rem * 1rem;
                color: #666666;
                border-radius: 50/@rem * 1rem;
                border: 1/@rem * 1rem solid #eee;
                margin-left: 300/@rem * 1rem;
                cursor: pointer;
            }

            .delete_point {
                background-color: #F56C6C;
                padding: 100/@rem * 1rem;
                color: #ffffff;
                border-radius: 50/@rem * 1rem;
                margin-left: 300/@rem * 1rem;
                cursor: pointer;
            }

            .confirm_point {
                background-color: #409EFF;
                padding: 100/@rem * 1rem;
                color: #ffffff;
                border-radius: 50/@rem * 1rem;
                margin-left: 300/@rem * 1rem;
                cursor: pointer;
            }

            .cancel_edit {
                background-color: #909399;
                padding: 100/@rem * 1rem;
                color: #ffffff;
                border-radius: 50/@rem * 1rem;
                margin-left: 300/@rem * 1rem;
                cursor: pointer;
            }

            .gray {
                background-color: #999999;
            }
        }

        .draw_canvas {
            position: absolute;
            width: 55%;
            height: 73vh;
            border-radius: 10/@rem * 1rem;
            transform: translateY(202px);
            border: 1/@rem * 1rem solid #409EFF;
            display: flex;
            align-items: center;
            justify-content: center;

            .back_image {
                position: absolute;
            }

            .my_canvas {
                position: absolute;
            }
        }
    }
    .icon_con{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        transform: translateX(-10px);
        .icon_item{
            cursor: pointer;
            width: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
            margin-top: 5px;
            .icon_item_con{
                width: 48px;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                align-content: flex-start;
                .icon_title{
                    font-size: 12px;
                    color: #dddddd;
                    transform: translateY(-5px);
                }
                img{
                    flex-shrink: 0;
                    width: 48px;
                    height: 48px;
                    border: 2px solid #eeeeee;
                    border-radius: 5px;
                    overflow: hidden;
                }
                .active{
                    border: 2px solid #409EFF;
                }
            }
        }
    }
</style>
