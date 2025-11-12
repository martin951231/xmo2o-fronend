<template>
    <div class="workshop_canvas" ref="canvas_con" @click="selectPoint" @contextmenu.prevent="rightClick" v-if="coverImg">
        <div class="draw_btn" @click.stop="startDraw" :class="pointArr.length==0?'':'grey'">{{isDraw?'保存':'绘制'}}</div>
        <div class="reset_btn" @click.stop="reset" v-if="isDraw"
            :class="pointArr.length == 0?'grey':''">撤销</div>
        <div class="draw_desc">
            <a-popover title="操作说明" placement="topRight">
                <a-button type="primary">
                    查看提示信息
                </a-button>
                <template slot="content">
                    <span class="desc_content">
                        在“{{$store.getters.config.house_name}}楼盘底图”点击上传图片，选择想要上传的图片、并确定保存，上传成功后，在“绘制区域”对上传的“{{$store.getters.config.house_name}}楼盘底图”可以绘制{{$store.getters.config.single_name}}区域，绘制{{$store.getters.config.single_name}}范围功能
                    </span>
                    <span class="desc_content">
                        点击绘制按钮开启绘制功能，在{{$store.getters.config.house_name}}楼盘底图绘制{{$store.getters.config.single_name}}的范围，绘制成功后进行保存（需要多点连接绘制成面），对绘制好的{{$store.getters.config.single_name}}点击鼠标右键，展示编辑、删除按钮，点击编辑弹窗显示{{$store.getters.config.house_name}}的所有{{$store.getters.config.single_name}}名称，对绘制的{{$store.getters.config.single_name}}跟{{$store.getters.config.single_name}}名称进行绑定操作，绑定成功后，{{$store.getters.config.single_name}}变更为已绑定状态颜色；点击删除按钮，对绘制的{{$store.getters.config.ssingle_name}}进行删除操作，删除后需要重新进行绘制。
                    </span>
                </template>
              
            </a-popover>
        </div>
        <img class="back_image" :src="coverImg" />
        <canvas class="my_canvas" id="myCanvas" :width="canvasProp.width" :height="canvasProp.height"></canvas>

        <div v-if="showMenu" class="menu_con" :style="{left: menuPosition.left, top: menuPosition.top}">
            <div class="menu_item" v-for="(item, index) in menu_list" :key="index" @click="menuClick(item)">
                <component :style="{color: item.color}" is="aIcon" :type="item.icon_type" />
                <div class="menu_name" :style="{color: item.color}">{{item.name}}</div>
            </div>
        </div>
        
        <a-modal
              :title="'绑定'+$store.getters.config.single_name"
              :visible="visible"
              @ok="handleOk"
              @cancel="handleCancel"
            >
            <div class="select_container">
                选择{{$store.getters.config.single_name}}：
                <a-select :value="single_id" :disabled="haveDefaultSingle" style="width: 200px" @change="handleChange" :placeholder="'请选择'+$store.getters.config.single_name" v-if="visible">
                  <a-select-option :value="item.id" v-for="(item,index) in singleList">
                    {{item.single_name}}
                  </a-select-option>
                </a-select>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import configVillageApi from '@/api/community/village/index.js';
    import streetVillageApi from '@/api/community/streetCommunity/index.js';
	import store from '@/store';
    export default {
        data() {
            return {
                canvasProp: {
                    width: 0,
                    height: 0
                },
                coverImg: 'https://hf.pigcms.com/static/wxapp/images/builds_back_img_white.png',
                pointArr: [],
                singleArr: [],
                isDraw: false,
                menu_list: [{
                    name: '删除',
                    color: 'red',
                    icon_type: 'delete'
                }, {
                    name: '编辑',
                    color: '#409EFF',
                    icon_type: 'edit'
                }],
                menuPosition: {
                    left: '',
                    top: ''
                },
                showMenu: false,
                currentIndex: -1,
                single_id: -1,
                visible: false,
                singleList: [],
                pageParams: {},
                haveDefaultSingle: false,
                hasBind: false
            }
        },
        created() {
            if(this.$route.query&&this.$route.query.single_id*1>0){
                this.single_id = this.$route.query.single_id*1
                this.haveDefaultSingle = true
            } else{
                this.single_id = ''
                this.haveDefaultSingle = false
            }
            this.getSingleList()
            this.getVillageArea()
        },
        mounted() {
            let that = this
            that.$nextTick(() => {
                let domWidth = that.$refs.canvas_con.clientWidth // 宽
                let domHeight = that.$refs.canvas_con.clientHeight // 高
                that.canvasProp.width = domWidth
                that.canvasProp.height = domHeight
                that.pageParams.floor_photo_coordinate = {
                    top: 0,
                    left: 0
                }
                that.pageParams.floor_photo_size = {
                    width: domWidth,
                    height: domHeight
                }
                that.getAreaList()
            })
        },
        methods: {
            getVillageArea() {
                let that = this
                that.request(configVillageApi.getVillageArea, {}, 'post').then((res) => {
                    that.coverImg = res.village_floor
                })
            },
            
            getSingleList() {
                let that = this
                that.request(configVillageApi.getSingleList, {}, 'post').then((res) => {
                    that.singleList = res
                })
            },
            
            getAreaList(){
                let that = this
                that.request(streetVillageApi.getAreaCoordinate, that.pageParams, 'post').then((res) => {
                    that.singleArr = res || []
                    that.reset()
                })
            },
            
            handleChange(val) {
              this.single_id = val
            },
            
            selectPoint($el) {
                let that = this
                if (!that.isDraw) {
                    that.showMenu = false
                    return
                }
                
                if(that.haveDefaultSingle && that.singleArr.length==1){
                    that.$message.warn('指定'+store.getters.config.single_name+'只能绑定一处区域')
                    return
                }

                let x = $el.x
                let y = $el.y
                let obj = {
                    x,
                    y
                }
                
                that.pointArr.push(obj)
                if (that.pointArr.length > 1) {
                    let start = that.pointArr[that.pointArr.length - 1]
                    let end = that.pointArr[that.pointArr.length - 2]
                    that.drawLine(start, end)
                }
                that.drawPoint(x, y)
                if (that.checkNum(that.pointArr[0].x, obj.x) && that.checkNum(that.pointArr[0].y, obj.y) && that.pointArr.length>3) {
                    that.pointArr.push(obj)
                    let start = that.pointArr[that.pointArr.length - 1]
                    let end = that.pointArr[that.pointArr.length - 2]
                    that.drawLine(start, end)
                    that.singleArr.push({pointArr: that.pointArr})
                    that.drawPoint(x, y)
                    that.reset()
                    that.pointArr = []
                }
            },

            drawBack(arr, back_color, color = '') {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext("2d");
                ctx.beginPath();
                arr.map((v, i) => {
                    if (i == 0) {
                        ctx.moveTo(v.x, v.y);
                    } else {
                        ctx.lineTo(v.x, v.y);
                    }
                })
                ctx.closePath();
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.fillStyle = back_color; //填充颜色
                ctx.fill(); //填充
            },

            drawPoint(x, y) {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext("2d");
                ctx.fillStyle = "RGBA(177, 6, 29, 1)";
                ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
            },

            drawLine(start, end) {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext("2d");
                ctx.lineWidth = 1;
                ctx.strokeStyle = "RGBA(177, 6, 29, 1)";
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            },

            startDraw() {
                let that = this
                if(that.pointArr.length > 0){
                    that.$message.warn('区域未绘制完成不能保存')
                    return
                }
                if(that.singleArr.length == 0 && that.isDraw){
                    that.$message.warn('至少绘制一个'+store.getters.config.single_name)
                    return
                }
                if(that.isDraw){
                    that.$confirm({
                        title: '提示',
                        content: '确定保存当前配置吗？',
                        onOk() {
                            that.pageParams.singleArr = that.singleArr
                            that.request(streetVillageApi.addCoordinatefloor, that.pageParams, 'post').then((res) => {
                                that.$message.success('保存成功！')
                                that.getAreaList()
                                that.isDraw = false
                            })
                        },
                        onCancel() {},
                    });
                } else{
                    that.isDraw = true
                }
            },
            // 检测最后一个点是否在第一个点位范围内
            checkNum(startNum, endNum) {
                let Maxnum = startNum + 8
                let Minnum = startNum - 8
                if (endNum > Minnum && endNum < Maxnum) {
                    return true
                }
            },

            clearCanvas() {
                let canvas = document.getElementById('myCanvas');
                canvas.width = this.canvasProp.width
                canvas.height = this.canvasProp.height
            },

            reset() {
                let that = this
                that.clearCanvas()
                that.pointArr = []
                if (that.singleArr.length == 0) {
                    return
                }
                that.$nextTick(() => {
                    that.singleArr.map((single, index) => {
                        single.pointArr.map((v, i) => {
                            that.drawPoint(v.x, v.y)
                            if (i != 0) {
                                that.drawLine(single.pointArr[i - 1], single.pointArr[i])
                            }
                        })
                        let back_color = "RGBA(177, 6, 29, .3)"
                        if(single.single_id){
                            back_color = "RGBA(0, 255, 255, .3)"
                        }
                        that.drawBack(single.pointArr, back_color)
                    })
                })
            },

            rightClick($el) {
                let that = this
                if (!that.isDraw) {
                    that.menuPosition.left = $el.x + 'px'
                    that.menuPosition.top = $el.y + 'px'
                    let point = {x: $el.x, y: $el.y}
                    that.showMenu = false
                    that.singleArr.map((v, i)=>{
                        if(that.calculationExtremum(v.pointArr, point)){
                            that.showMenu = true
                            that.currentIndex = i
                            that.area_id = v.area_id
                            if(v.single_id){
                                that.hasBind = true
                            } else {
                                that.hasBind = false
                            }
                            if(!that.haveDefaultSingle){
                                that.single_id = v.single_id || ''
                            }
                        }
                    })
                }
            },

            calculate(arr, p){
                let count = arr.length;
                let result = false;
                for (let i = 0, j = count - 1; i < count; i++) {
                    let p1 = arr[i];
                    let p2 = arr[j];
                    if ((p1.x < p.x && p2.x >= p.x) || (p2.x < p.x && p1.x >= p.x)) {
                        if ((p.x - p1.x) / (p2.x - p1.x) * (p2.y - p1.y) + p1.y < p.y) {
                            result = !result;
                        }
                    }
                    j = i;
                }
                return result;
            },

            calculationExtremum(pointArr, point) {
                let that = this
                let flag = true
                let xArr = []
                let yArr = []
                pointArr.map(v => {
                    xArr.push(v.x)
                    yArr.push(v.y)
                })
                let xMin = Math.min(...xArr);
                let xMax = Math.max(...xArr);
                let yMin = Math.min(...yArr);
                let yMax = Math.max(...yArr);
                if (point.x < xMin || point.x > xMax || point.y < yMin || point.y > yMax) {
                    flag = false
                }
                if (flag) {
                    flag = that.calculate(pointArr, point)
                }
                return flag
            },

            menuClick(item) {
                let that = this
                if(item.name == '删除'){
                    that.singleArr.splice(that.currentIndex, 1)
                    that.request(streetVillageApi.delArea, {area_id: that.area_id}, 'post').then((res) => {
                        that.$message.success('删除成功！')
                        that.getAreaList()
                        that.isDraw = false
                    })
                    that.showMenu = false
                } else if(item.name == '编辑'){
                    if(that.hasBind){
                        that.$message.warn('该区域已绑定'+store.getters.config.single_name)
                    } else{
                        that.visible = true
                    }
                }
            },
            
            handleOk(){
                let that = this
                if(!that.single_id){
                    that.$message.warn('请选择一个'+store.getters.config.single_name)
                    return
                }
                let params = {
                    single_id: that.single_id,
                    area_id: that.area_id
                }
                that.request(streetVillageApi.addAreaSingle, params, 'post').then((res) => {
                    that.getSingleList()
                    that.getAreaList()
                    that.visible = false
                    that.$message.success('绑定成功！')
                })
            },
            
            handleCancel(){
                this.visible = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .workshop_canvas {
        width: 100vw;
        height: 100vh;
        cursor: pointer;
        position: relative;

        .back_image {
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .my_canvas {
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .draw_btn {
            left: 20px;
            top: 20px;
            position: absolute;
            width: 100px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #409EFF;
            padding: 3px 10px;
            color: #ffffff;
            border-radius: 10px;
            cursor: pointer;
            z-index: 99;
        }

        .reset_btn {
            position: absolute;
            width: 100px;
            height: 30px;
            left: 150px;
            top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #409EFF;
            padding: 3px 10px;
            color: #ffffff;
            border-radius: 10px;
            cursor: pointer;
            z-index: 99;
        }

        .grey {
            background-color: #999999;
        }
        
        .select_container{
            display: flex;
        }

        .menu_con {
            position: absolute;
            border-radius: 5px;
            background-color: rgba(255, 255, 255, .7);

            .menu_item {
                padding: 5px 15px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                border-bottom: 0.5px solid #999999;

                &:nth-last-child(1) {
                    border: 0;
                }

                .menu_name {
                    font-size: 16px;
                    margin-left: 5px;
                }

                &:hover {
                    background-color: RGBA(0, 255, 255, .3);
                    border-radius: 5px;
                }
            }
        }
        
        .draw_desc{
            position: absolute;
            display: flex;
            flex-direction: column;
            right: 10px;
            top: 20px;
            z-index: 999;
            .desc_title{
                color: #ffffff;
            }
            
            .desc_content{
                color: #ffffff;
            }
        }
    }
</style>
