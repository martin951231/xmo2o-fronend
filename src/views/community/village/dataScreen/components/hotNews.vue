<!-- 热点新闻 -->
<template>
    <div id="charts_container_10">
        <div class="banner">
            <div class="item">
                <img :src="dataList[currentIndex].url">
            </div>
            <div class="desc">
                {{dataList[currentIndex].desc}}
            </div>
            <div class="page" v-if="dataList.length > 1">
                <ul>
                    <!-- <li @click="gotoPage(prevIndex)">&lt;</li> -->
                    <li v-for="(item,index) in dataList" @click="gotoPage(index)"
                        :class="{'current':currentIndex == index}"></li>
                    <!-- <li @click="gotoPage(nextIndex)">&gt;</li> -->
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataList: [{url: "https://i1.mifile.cn/a4/xmad_15535933141925_ulkYv.jpg", desc: '床前明月光，疑是地上霜'},
                {url: "https://i1.mifile.cn/a4/xmad_15532384207972_iJXSx.jpg", desc: '举头望明月，低头思故乡'},
                {url: "https://i1.mifile.cn/a4/xmad_15517939170939_oiXCK.jpg", desc: '鹅鹅鹅，曲项向天歌'}],
                currentIndex: 0, //默认显示图片
                timer: null //定时器
            }
        },

        computed: {
            //上一张
            prevIndex() {
                if (this.currentIndex == 0) {
                    return this.dataList.length - 1;
                } else {
                    return this.currentIndex - 1;
                }
            },
            //下一张
            nextIndex() {
                if (this.currentIndex == this.dataList.length - 1) {
                    return 0;
                } else {
                    return this.currentIndex + 1;
                }
            }
        },

        mounted() {
            this.runInv()
        },

        methods: {
            gotoPage(index) {
                this.currentIndex = index;
            },
            runInv() {
                this.timer = setInterval(() => {
                    this.gotoPage(this.nextIndex)
                }, 3000)
            }
        }
    }
</script>

<style lang="less" scoped>
    * {
        margin: 0;
        padding: 0;
    }
    #charts_container_10 {
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
        display: flex;
        align-items: center;
        justify-content: center;
        ul{
            margin-right: 20px;
        }
        ul li {
            list-style: none;
            float: left;
            width: 8px;
            height: 8px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            cursor: pointer;
            background-color: RGBA(0, 255, 255, 1);
            margin: 15px 8px 15px 0;
        }
        .banner {
            width: 100%;
            margin: 0 auto;
            position: relative;
            cursor: pointer;
        }
        .banner img {
            width: 100%;
            display: block;
        }
        
        .banner .desc{
            position: absolute;
            left: 10px;
            bottom: 8px;
            width: 80%;
            color: rgba(255,255,255,1);
            z-index: 99;
        }
        
        .banner .page {
            background: rgba(0,0,0,.5);
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
        }
        .banner .page ul {
            float: right;
        }
        .current {
            background-color: RGBA(10, 112, 119, 1);
        }
    }
</style>
