<template>
    <a-modal v-model="visible" @ok="handleOk" @cancel="handleClose" :width="width" :maskClosable="false" :destroyOnClose="true" :confirmLoading="saveLoading" centered wrapClassName="modalRefLayer-01">
        <template #title>
            {{ '楼层2D平面图' }}
            <space>
                <a-button size="small" type="link" style="margin-left: 8px" @click.stop="showInstructions">{{ L('操作说明') }}</a-button>
                <a-button size="small" type="link" @click.stop="changeImage">{{ L('设置背景图') }}</a-button>
            </space>
        </template>
        <a-spin :spinning="spinning" :tip="L('加载背景图中...')">
            <div class="content">
                <div class="draw-content" ref="containerWrapRef">
                    <!--  画布   -->
                    <canvas class="canvas-container"></canvas>
                    <!--  遮罩层   -->
                    <div class="container-mask" ref="containerMaskRef"></div>
                    <!--   绑定房间   -->
                    <div class="bind-wrap" ref="bindWrapRef" v-if="bindRoomVisible">
                        <div style="display: flex; align-items: center">
                            <a-select v-model="currentBindRoom" style="width: 150px;" size="small" :placeholder="L('请绑定房间')" :allowClear="true">
                                <a-select-option v-for="(item) in roomList" :key="item.id" :value="item.id">{{ item.room_number }}</a-select-option>
                            </a-select>
                            <a-button type="primary" size="small" style="margin-left: 5px" @click="bindRoomSave">{{L('确定')}}</a-button>
                        </div>
                    </div>
                </div>
                <!--  操作区域  -->
                <div class="draw-operate">
                    <a-row type="flex" justify="space-between">
                        <space>
                            <template v-if="canvasInstance && canvasInstance.readonly">
                                <a-button size="small" type="primary" v-if="!isBindMode" @click.stop="startDraw()">{{ L('开始绘制') }}</a-button>
                                <a-button size="small" type="primary" @click.stop="handleBindMode()">{{isBindMode ? L('退出绑定房间') : L('绑定房间')}}</a-button>
                            </template>
                            <template v-else>
                                <a-button
                                    v-for="(item,index) in shapeCreateList"
                                    :key="index"
                                    size="small"
                                    :type="shapeCreateIndex === index ? 'primary': ''"
                                    @click.stop="shapeCreate(item.type,item.markersType,item.markersValue,index)"
                                    :style="{'background':item.background,'border-color':item.background}"
                                >{{ item.label }}</a-button>
                            </template>
                        </space>
                        <space v-if="canvasInstance && !canvasInstance.readonly">
                            <a-button size="small" type="primary" @click="canvasFitZoom">{{ L('还原绘制区域大小') }}</a-button>
                            <a-button size="small" type="primary" @click.stop="shapeCreate(0)" style="background: #19be6b;border-color: #19be6b">{{ L('完成绘制/拖动') }}</a-button>
                            <a-button size="small" type="danger" @click.stop="closeDraw()">{{ L('退出绘制') }}</a-button>
                        </space>
                    </a-row>
                </div>
            </div>
        </a-spin>
        <a-modal v-model="instructionsVisible" :title="L('操作说明')" :footer="null" centered @cancel="instructionsVisible = false">
            <p>{{ L('1.创建多边形：鼠标左键单击添加点，双击闭合完成创建，Esc退出创建，Backspace退一步删除选择点。') }}</p>
            <p>{{ L('2. 拖动：按住鼠标右键拖动画布。') }}</p>
            <p>{{ L('3. 缩放：鼠标滚轮缩放画布。') }}</p>
            <p>{{ L('4. 删除：选中形状，Backspace删除。') }}</p>
        </a-modal>
        <a-modal v-model="uploadBgVisible" :title="L('设置背景图')" :okText="L('保存')" centered @cancel="uploadBgVisible = false" @ok="handleUploadBgSuccess">
            <a-form-model-item :help="L('不上传图片保存后会使用默认背景图')" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    accept="image/*"
                    list-type="picture-card"
                    :file-list="drawPolyBgList"
                    name="reply_pic"
                    :data="{ upload_dir: 'building/floorManage' }"
                    @preview="handlePreviewImg"
                    @change="handleUploadImg($event, 'drawPolyBgList', 'drawPolyBg')"
                >
                    <div v-if="drawPolyBgList.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </div>
                </a-upload>
            </a-form-model-item>
        </a-modal>
    </a-modal>
</template>

<script>
import CanvasSelect from 'canvas-select'
import { cloneDeep, isEmpty } from 'lodash'
import { Space } from 'ant-design-vue'
const BgImg = '/static/images/common/two_dimensional_bg.png'
import { colorRgb, imgUploadHandle, imgUploadFileListHandle, getBase64, guid } from '@/utils/util'
export default {
    props: {
        //弹框宽度
        width: {
            type: [Number, String],
            default: 1064,
        },
        saveRequest: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        CanvasSelect,
        Space,
    },
    data() {
        return {
            visible: false,
            canvasInstance: null, // 画布实例
            instructionsVisible: false, // 操作指南弹窗
            uploadBgVisible: false, // 上传背景图弹窗
            currentBindRoom: 0, //当前绑定的房间
            saveLoading: false, //保存loading
            isBindMode: false, //标记模式
            containerMaskRef: null, //遮罩层
            bindRoomVisible: false, //是否显示绑定房间弹窗
            drawPolyData: [], //绘制图形数据
            defaultOptions: [], // 默认的配置
            drawPolyBg: '',
            drawPolyBgList: [],
            drawOptions: {}, //绘制时额外带的参数
            shapeCreateList: [
                {
                    label: this.L('创建矩形'),
                    type: 1,
                },
                {
                    label: this.L('创建多边形'),
                    type: 2,
                },
                {
                    label: this.L('创建卫生间'),
                    type: 3,
                    markersValue: 'toilet',
                    markersType: 'publicFacilities',
                },
                {
                    label: this.L('创建服务台'),
                    type: 3,
                    markersValue: 'helpDesk',
                    markersType: 'publicFacilities',
                },
                {
                    label: this.L('创建手扶电梯'),
                    type: 3,
                    markersValue: 'escalators',
                    markersType: 'publicFacilities',
                },
                {
                    label: this.L('创建升降电梯'),
                    type: 3,
                    markersValue: 'elevators',
                    markersType: 'publicFacilities',
                },
                {
                    label: this.L('创建紧急出口'),
                    type: 3,
                    markersValue: 'emergencyExit',
                    markersType: 'publicFacilities',
                },
            ],
            shapeCreateIndex: -1, //选中创建的索引
            roomList: [],
            editInfo: {
                coorList: [],
            },
            spinning: false,
        }
    },
    created() {},
    methods: {
        open(roomList = [], editInfo = {}) {
            this.roomList = roomList
            this.editInfo = editInfo
            this.visible = true
            this.initVisible()
        },
        handleClose() {
            this.visible = false
            this.saveLoading = false
            this.initVisible()
        },
        //打开或者关闭弹窗初始化
        initVisible() {
            this.shapeCreateIndex = -1
            if (this.visible) {
                // 初始化（房间信息（颜色名称等））
                let editArr = cloneDeep(this.editInfo?.coorList || [])
                this.drawPolyBgList = []
                this.drawPolyBg = this.editInfo?.bg_img || ''
                editArr.forEach((v) => {
                    if (v.bindRoomId) {
                        v = this.setCurrentRoomStyle(v, v.bindRoomId)
                    }
                })
                this.defaultOptions = editArr
                this.$nextTick(() => {
                    //移除模态框的 tabindex 属性，解决键盘事件捕获问题
                    document.getElementsByClassName('modalRefLayer-01')[0].removeAttribute('tabindex')
                    this.initCanvasInstance()
                })
            } else {
                this.defaultOptions = []
                this.drawPolyBg = ''
                if (this.canvasInstance) {
                    this.canvasInstance.createType = 0
                    this.canvasInstance.destroy()
                    this.canvasInstance = null
                }
                this.drawPolyData = []
                this.bindRoomVisible = false
                this.currentDrawPoly = {}
                this.currentBindRoom = undefined
                this.isBindMode = false
                this.saveLoading = false
            }
        },
        initCanvasInstance() {
            this.spinning = true
            this.canvasInstance = new CanvasSelect('.canvas-container', this.drawPolyBg || BgImg)
            // 加载数据
            this.canvasInstance.setData(this.defaultOptions)
            // 0 不创建(默认)，1创建矩形，2创建多边形，3点标注，4折线标注，5圆形标注
            this.canvasInstance.fillStyle = 'rgba(255, 255, 255)'
            this.canvasInstance.strokeStyle = '#2681f3'

            this.canvasInstance.createType = 0
            this.canvasInstance.ctrlRadius = 3
            this.canvasInstance.scrollZoom = true
            this.canvasInstance.activeFillStyle = '#d3e3fd'
            this.canvasInstance.activeStrokeStyle = '#2681f3'
            this.canvasInstance.readonly = true
            this.canvasInstance.labelFont = '14px sans-serif'
            this.canvasInstance.labelFillStyle = '#2681f3'
            this.canvasInstance.textFillStyle = '#ffffff'

            this.canvasInstance.on('select', (info) => {
                console.log('select', info)
                // 可对选中对参数info进行修改
                // 修改标签：info.label="hello"
                // 单个形状修改填充颜色：info.fillStyle="#0f0"
                // 然后调用instance.update()更新视图
                if (this.isBindMode) {
                    // 只读情况下并且不是标记点类型可以绑定房间
                    if (info && info.markersType != 'publicFacilities') {
                        this.drawPolyData.forEach((poly) => {
                            if (poly.uuid == info.uuid) {
                                this.currentDrawPoly = info
                                //默认标注类型房间
                                this.currentBindRoom = this.currentDrawPoly?.bindRoomId || undefined
                                poly.active = true
                                poly.fillStyle = 'rgba(41, 150, 255, 0.5)'
                                poly.strokeStyle = '#fff'
                            } else {
                                poly.active = false
                                poly.fillStyle = poly.roomFillColor || '#fff'
                                poly.strokeStyle = poly.roomLineColor || '#2681f3'
                            }
                        })
                        this.showBindRoom()
                    } else {
                        this.hideBindRoom()
                    }
                }
            })
            this.canvasInstance.on('add', (result) => {
                //展示圆点标注文本
                if (result.type == 3 && this.drawOptions.markersType == 'publicFacilities') {
                    result.label = this.drawOptions.label
                    result.markersType = this.drawOptions.markersType
                    result.markersValue = this.drawOptions.markersValue
                    result.iconWidth = 20
                    result.iconHeight = 20
                }
            })
            this.canvasInstance.on('updated', (result) => {
                this.drawPolyData = [...result]
                this.drawPolyData.sort((a, b) => a.index - b.index)
            })
            this.canvasInstance.on('load', (result) => {
                // console.log(result, '图片加载完成')
                this.spinning = false
            })
            // 删除
            this.canvasInstance.on('delete', (info) => {
                console.log('delete', info)
            })
        },
        //设置房间名称
        setCurrentRoomStyle(info = {}, roomId) {
            let roomInfo = roomId ? this.roomList.find((v) => v.id == roomId) : undefined
            if (roomId && roomInfo) {
                info.bindRoomId = roomInfo.id
                info.bindRoomInfo = roomInfo
                let bindColor = roomInfo?.roomColor
                if (bindColor) {
                    let roomFillColor = colorRgb(bindColor, 0.9)
                    info.strokeStyle = '#fff'
                    info.roomLineColor = '#fff'
                    info.fillStyle = roomFillColor
                    info.roomFillColor = roomFillColor
                }
                info.label = roomInfo?JSON.stringify(roomInfo.room_number): ''
                info.labelFont = '14px sans-serif'
                info.room_name = info.label
            } else {
                info.label = ''
                info.strokeStyle = '#2681f3'
                info.fillStyle = '#fff'
                delete info.bindRoomId
                delete info.bindRoomInfo
                delete info.roomLineColor
                delete info.roomFillColor
            }

            return info
        },
        //提交保存
        handleOk() {
            let data = cloneDeep(this.drawPolyData)
            data = data.map((v) => {
                delete v.bindRoomInfo
                delete v.strokeStyle
                delete v.roomLineColor
                delete v.fillStyle
                delete v.roomFillColor
                delete v.labelFont
                v.active = false
                return v
            })
            let params = {
                coorList: data,
                bg_img: this.drawPolyBg || BgImg,
            }
            if (this.saveRequest) {
                // 请求接口保存
                this.saveLoading = true
                this.request('', {
                    two_dimensional: params,
                }).then((res) => {
                    this.saveLoading = false
                    this.visible = false
                    this.$emit('handleOK')
                })
            } else {
                this.$emit('handleOK', params)
            }
        },
        //打开设置背景图
        changeImage() {
            this.uploadBgVisible = true
        },
        //打开操作指南弹窗
        showInstructions() {
            this.instructionsVisible = true
        },
        // 开始绘制
        startDraw() {
            //开启画布
            this.canvasInstance.lock = false
            this.canvasInstance.readonly = false
            this.canvasInstance.createType = 0
            //遮罩层鼠标事件关闭，放开canvas鼠标事件
            this.$refs.containerMaskRef.style.pointerEvents = 'none'
            this.canvasInstance.scrollZoom = true
        },
        //结束绘制
        closeDraw() {
            this.shapeCreateIndex = -1
            this.canvasInstance.readonly = true
            //画布大小复原
            this.canvasInstance.fitZoom()
            //锁定画布
            this.canvasInstance.lock = true
            //遮罩层鼠标事件开启，屏蔽canvas鼠标事件
            this.$refs.containerMaskRef.style.pointerEvents = 'all'
            this.hideBindRoom()
        },
        //还原区域大小
        canvasFitZoom() {
            this.canvasInstance.fitZoom()
        },
        shapeCreate(type, markersType, markersValue, index = null) {
            if (index != null) {
                this.shapeCreateIndex = index
            }
            if (type == 0) {
                this.shapeCreateIndex = -1
            }
            const textObj = {
                toilet: this.L('卫生间'),
                helpDesk: this.L('服务台'),
                escalators: this.L('手扶电梯'),
                elevators: this.L('升降电梯'),
                emergencyExit: this.L('紧急出口'),
            }
            this.drawOptions = {}
            if (markersType == 'publicFacilities') {
                this.drawOptions.label = textObj[markersValue]
                this.drawOptions.markersType = markersType
                this.drawOptions.markersValue = markersValue
            }
            this.canvasInstance.createType = type
        },
        handleBindMode() {
            this.isBindMode = !this.isBindMode
            if (this.isBindMode) {
                // 开始标记
                //开启画布
                this.canvasInstance.lock = false
                //遮罩层鼠标事件关闭，放开canvas鼠标事件
                this.$refs.containerMaskRef.style.pointerEvents = 'none'
                // 禁止画布缩放
                this.canvasInstance.scrollZoom = false
            } else {
                // 退出标记
                //画布大小复原
                this.canvasInstance.fitZoom()
                //锁定画布
                this.canvasInstance.lock = true
                //遮罩层鼠标事件开启，屏蔽canvas鼠标事件
                this.$refs.containerMaskRef.style.pointerEvents = 'all'
                this.hideBindRoom()
            }
        },
        showBindRoom() {
            let centerX = this.canvasInstance.mouse[0]
            let centerY = this.canvasInstance.mouse[1]
            let transform = 'translate(-50%, -50%)'
            let picTopRight = [
                this.canvasInstance.originX + this.canvasInstance.IMAGE_WIDTH,
                this.canvasInstance.IMAGE_HEIGHT,
            ]
            if (centerX + 280 >= picTopRight[0]) {
                if (centerY < 240) {
                    //如果点击位置离右上角太近，移动到鼠标左下方显示
                    transform = 'translate(-100%, 0)'
                } else {
                    //如果点击位置离右下角太近，移动到鼠标左上方显示
                    transform = 'translate(-100%, -100%)'
                }
            }
            this.bindRoomVisible = true
            this.$nextTick(() => {
                this.$refs.bindWrapRef.style.top = `${centerY}px`
                this.$refs.bindWrapRef.style.left = `${centerX}px`
                this.$refs.bindWrapRef.style.transform = transform
            })
        },
        hideBindRoom() {
            this.bindRoomVisible = false
            this.currentBindRoom = undefined
            this.currentDrawPoly = {}
            this.drawPolyData.forEach((poly) => {
                poly.active = false
                poly.fillStyle = poly.roomFillColor || '#fff'
                poly.strokeStyle = poly.roomLineColor || '#2681f3'
            })
            this.canvasInstance.update()
        },
        bindRoomSave() {
            this.currentDrawPoly = this.setCurrentRoomStyle(this.currentDrawPoly, this.currentBindRoom)
            this.hideBindRoom()
        },
        handleUploadBgSuccess() {
            let flag = false
            this.drawPolyBgList.forEach((v) => {
                if (v.response && v.status == 'done') {
                    flag = true
                    this.drawPolyBg = v.response.data || v.response.fileUrl
                }
            })
            if (!flag) {
                this.drawPolyBg = ''
            }
            if (this.canvasInstance) {
                this.spinning = true
                this.canvasInstance.setImage(this.drawPolyBg || BgImg)
            } else {
                this.canvasInstance = new CanvasSelect('.canvas-container', this.drawPolyBg || BgImg)
            }
            this.uploadBgVisible = false
        },
        // 上传图片
        handleUploadImg(info, fileListName, type) {
            const { fileList = [], resultData = {} } = imgUploadHandle(info)
            if (type == 'drawPolyBg') {
            } else {
                this.form[type] = resultData.fileUrl || ''
            }
            this[fileListName] = fileList
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            window.open(file.url || file.preview)
        },
        parseRatio(number, decimal = 2) {
            return (Math.floor(number * 100) / 100).toFixed(decimal)
        },
    },
}
</script>

<style lang="less" scoped>
.content {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
}
.draw-content {
    height: 666px;
    width: 1000px;
    position: relative;
    flex: 1;
    margin: 0 auto;
}

.container-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9;
}
.canvas-container {
    background-color: #eee;
    width: 100% !important;
    height: 100% !important;
}
.draw-operate {
    margin-top: 16px;
}
.bind-wrap {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, -50%);
}
</style>