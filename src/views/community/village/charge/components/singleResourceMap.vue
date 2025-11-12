<template>
    <div class="workshop_canvas" ref="canvas_con" @click="rightClick" v-if="coverImg">
        <img class="back_image" :src="coverImg" />
        <canvas class="my_canvas" id="myCanvas" :width="canvasProp.width" :height="canvasProp.height"></canvas>
        <div v-if="showMenu" class="menu_con" :style="{left: menuPosition.left, top: menuPosition.top}">
            <span class="single_name" @click.stop="showSingleInfo">{{singleName}}</span>
        </div>
        <!-- <PopupBox ref="PopupBox" :title="houseInfo.single_title" :isShowBottom="false">
            <div class="popup_content">
                <div class="popup_flex_box">
                    <div class="popup_flex_1" v-for="(item,index) in houseInfo.list">
                        <p class="title">{{item.key}}：</p>
                        <p class="text_1">{{item.value}}</p>
                    </div>
                </div>
                <div @click="openHouseInfo" class="goinfo">详细信息</div>
            </div>
        </PopupBox> -->
    </div>
</template>

<script>
    import configVillageApi from '@/api/community/village/index.js';
    import streetVillageApi from '@/api/community/streetCommunity/index.js';
    import PopupBox from '../../../components/cockpit/PopupBox.vue';
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
                menuPosition: {
                    left: '',
                    top: ''
                },
                showMenu: false,
                pageParams: {},
                singleName: '',
                showSingle: false,
                single_id: '',
                houseInfo: {},
            }
        },
        
        components: {
            PopupBox
        },
        
        mounted() {
            let that = this
            that.$nextTick(()=>{
                let domWidth = that.$refs.canvas_con.clientWidth // 宽
                let domHeight = that.$refs.canvas_con.clientHeight // 高
                let canvasLeft = that.$refs.canvas_con.getBoundingClientRect().left
                let canvasTop = that.$refs.canvas_con.getBoundingClientRect().top
                that.canvasProp.width = domWidth
                that.canvasProp.height = domHeight
                that.pageParams.floor_photo_coordinate = {
                    left: canvasLeft,
                    top: canvasTop
                }
                that.pageParams.floor_photo_size = {
                    width: domWidth,
                    height: domHeight
                }
                console.log("that.pageParams===>", that.pageParams)
                that.getAreaList()
            })
        },
        methods: {
            openHouseInfo(){
                this.$emit('openHouseInfo', this.single_id)
            },
            
            getBuildingInfo() {
                let that = this
                that.request(configVillageApi.getBuildingInfo, {
                    single_id: that.single_id
                }, 'post').then((res) => {
                    that.houseInfo = res
                    that.$refs.PopupBox.open()
                })
            },
            
            showSingleInfo(){
                this.showSingle = true
                this.$emit('openHouseInfo', this.single_id)
                // this.getBuildingInfo()
            },
            
            getAreaList(){
                let that = this
                that.request(streetVillageApi.getSingleAreaCoordinate, that.pageParams, 'post').then((res) => {
                    that.singleArr = res.list || []
                    that.coverImg = res.src
                    that.reset()
                })
            },

            drawBack(arr, back_color, color = '') {
                let that = this
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext("2d");
                ctx.beginPath();
                arr.map((v, i) => {
                    if (i == 0) {
                        ctx.moveTo(v.x-that.pageParams.floor_photo_coordinate.left, v.y-that.pageParams.floor_photo_coordinate.top);
                    } else {
                        ctx.lineTo(v.x-that.pageParams.floor_photo_coordinate.left, v.y-that.pageParams.floor_photo_coordinate.top);
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
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
            },

            drawLine(start, end) {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext("2d");
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#FF0000";
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
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
                        let back_color = "RGBA(177, 6, 29, .3)"
                        if(single.single_id){
                            back_color = "RGBA(0, 255, 255, .3)"
                        }
                        that.drawBack(single.pointArr, back_color, '#fff')
                    })
                })
            },

            rightClick($el) {
                let that = this
                that.menuPosition.left = $el.x - that.pageParams.floor_photo_coordinate.left - 49 + 'px'
                that.menuPosition.top = $el.y - that.pageParams.floor_photo_coordinate.top - 86 + 'px'
                let point = {x: $el.x, y: $el.y}
                that.showMenu = false
                that.singleArr.map((v, i)=>{
                    if(that.calculationExtremum(v.pointArr, point)){
                        that.area_id = v.area_id
                        if(v.single_id){
                            that.singleName = v.single_name || v.single_id
                            that.single_id = v.single_id
                            that.showMenu = true
                        }
                    }
                })
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
                
            }
        }
    }
</script>

<style lang="less" scoped>
    .workshop_canvas {
        width: 100%;
        height: 100%;
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

        .menu_con {
            width: 98px;
            height: 87px;
            background-image: url(../../../../../assets/communityimg/cockpit_icon_2.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            z-index: 99;
            cursor: pointer;
            .single_name {
                font-size: 15px;
                width: 100%;
                height: 52px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        
        .popup_content {
            width: 100%;
            padding: 30px 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
        
            .popup_flex_box {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: wrap;
        
                .popup_flex_1 {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    width: 50%;
        
                    .title {
                        font-size: 20px;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #3AF4FF;
                        line-height: 60px;
                    }
        
                    .text_1 {
                        font-size: 20px;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 60px;
                    }
                }
            }
        
            .goinfo {
                width: 100px;
                height: 40px;
                background: #20B7FC;
                border-radius: 4px;
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 40px;
                text-align: center;
                cursor: pointer;
            }
        }
    }
</style>
