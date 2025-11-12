<!-- 热点新闻 -->
<template>
    <div id="charts_container_10" v-if="dataList.length > 0">
        <div class="banner" @click="navigateTo">
            <div class="item">
                <img :src="dataList[currentIndex].img">
            </div>
            <div class="desc">
                {{dataList[currentIndex].title}}
            </div>
            <div class="page" v-if="dataList.length > 1">
                <ul>
                    <!-- <li @click="gotoPage(prevIndex)">&lt;</li> -->
                    <li v-for="(item,index) in dataList" @click.stop="gotoPage(index)"
                        :class="{'current':currentIndex == index}"></li>
                    <!-- <li @click="gotoPage(nextIndex)">&gt;</li> -->
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import houseCityApi from '@/api/system/community/house';
    export default {
        props: {
            addressParams: {
                type: Object,
                default: ()=>{return {}}
            }
        },
        data() {
            return {
                dataList: [],
                currentIndex: 0, //默认显示图片
                timer: null ,//定时器
                url: ''
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
        watch: {
            addressParams: {
                handler(val){
                    if(val.city_area_id!=undefined && val.city_area_id>=0){
                        console.log('val.city_area_id===>', val.city_area_id)
                        this.getData()
                    }
                },
                immediate: true
            }
        },
        /*
        mounted() {
            this.getData()
        },
        */
        methods: {
            getData(){
                let self = this
                self.request(houseCityApi.getPartyNewsStatistics, this.addressParams).then((res) => {
                    self.dataList = res.list
                    self.url = res.url
                    self.runInv()
                })
            },
            gotoPage(index) {
                this.currentIndex = index;
            },
            runInv() {
                this.timer = setInterval(() => {
                    this.gotoPage(this.nextIndex)
                }, 3000)
            },
            navigateTo(){
                if(this.url){
                    window.open(this.url)
                }
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
            max-height: calc((100vh - 90px - 6px)/3 - 72px);
            width: 94%;
            margin: 0 auto;
            position: relative;
            cursor: pointer;
            overflow: hidden;
        }
        .banner img {
            height: calc((100vh - 90px - 6px)/3 - 72px);
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
