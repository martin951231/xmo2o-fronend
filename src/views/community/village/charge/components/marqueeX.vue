<template>
    <div class="my-outbox" v-if="sendVal.length>0">
        <div class="left_icon">
            <img class="icon_horn" src="https://hf.pigcms.com/static/wxapp/images/scroll_content_icon2.png">
        </div>
        
        <div class="my-inbox" v-if="false">
            <div class="my-list" v-for="(item,index) in sendVal" :key='index' ref='list' @click="chooseItem(item)">
                <span class="my-uname">{{item.title?item.title:'暂无'}}</span>
            </div>
        </div>
        
        <div class="my-inbox" ref='box' v-else>
            <div class="my-list" v-for="(item,index) in sendVal" :key='index' ref='list' @click="chooseItem(item)">
                <span class="my-uname">{{item.title?item.title:'暂无'}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'my-marquee-left',
        props: {
            sendVal: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                note: {
                    // backgroundImage: "url(" + require("../images/icon_horn.png") + ")",
                    backgroundSize: "20px 20px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "1%  50%"
                },
                // 定时器标识
                nowTime: null,
                // 每一个内容的宽度
                disArr: []
            }
        },
        mounted() {
            // var that = this
            var item = this.$refs.list
            var len = this.sendVal.length
            var arr = []
            var margin = this.getMargin(item[0])
            for (var i = 0; i < len; i++) {
                arr.push(item[i].clientWidth + margin) // 把宽度和 margin 加起来就是每一个元素需要移动的距离
            }
            this.disArr = arr
            this.moveLeft()
        },
        beforeDestroy() {
            // 页面关闭清除定时器
            clearInterval(this.nowTime)
            // 清除定时器标识
            this.nowTime = null
        },
        methods: {
            // 获取margin属性
            getMargin(obj) {
                var marg = window.getComputedStyle(obj, null)['margin-right']
                marg = marg.replace('px', '')
                return Number(marg) // 强制转化成数字
            },
            // 移动的方法
            moveLeft() {
                var that = this
                var outbox = this.$refs.box
                // 初始位置
                var startDis = 0
                this.nowTime = setInterval(function() {
                    startDis -= 0.5
                    // console.log('初始化移动：', startDis)
                    if (Math.abs(startDis) > Math.abs(that.disArr[0])) {
                        // 每次移动完一个元素的距离，就把这个元素的宽度
                        that.disArr.push(that.disArr.shift())
                        that.sendVal.push(that.sendVal.shift())
                        startDis = 0
                    } else {
                    }
                    // 后面换了es6的模板字符串就可以了
                    outbox.style = `transform: translateX(${startDis}px)`
                }, 1000 / 60)
            },
            
            chooseItem(item){
                this.$emit('clickEvent', item)
            }
        }
    }
</script>

<style lang="less" scoped>
    .my-outbox {
        /*color: #D7BC8D;*/
        overflow: hidden;
        color: #FFFFFF;
        height: 35px;
        display: flex;
        /*background: #422b02;*/
        .left_icon{
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999;
            overflow: hidden;
            position: fixed;
            background-color: #ffffff;
            .icon_horn{
                width: 30px;
                height: 30px;
            }
        }
        .my-inbox {
            white-space: nowrap;
            width: 55vw;
            .my-list {
                margin-left: 20px;
                display: inline-block;
                font-size: 14px;
                // height: 20px;
                text-indent: 30px;
                line-height: 30px;
                cursor: pointer;
                .my-uname {
                    /*color: #FF8900;*/
                    width: 100%;
                    color: #FFFFFF;
                }
            }
        }
    }
</style>
