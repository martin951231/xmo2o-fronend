<template>
    <!-- 滚动公告 -->
    <div class="laba_box">
        <img class="laba" src="../images/icon_horn.png" alt="" v-if="newsList.length!=0">
        <div class="marquee-inner-wrapper">
            <div class="first-marquee">
                <span>
                    <li @click="navigateToD(item)" v-for="(item, index) in newsList">{{item.title}}</li>
                </span>
            </div>
        </div>
    </div>
    <!-- 滚动公告END -->
</template>

<script>
    export default {
        props: {
            swap_community_id: {
                type: Number,
                default: ()=>{return 0;}
            }
        },
        data(){
            return{
                newsList: [{
                  name: "张三1",
                  title:"信息公告：2020年10月14限公司成立，我行用信金额111111元"
                },{
                  name: "张三2",
                  title:"信息公告：2020年9月30大幅度发大发的，我行用信金额222222元"
                },{
                  name: "张三3",
                  title:"信息公告：2020年12月有限公司成立，我行用信金额333333元"
                },{
                  name: "张三4",
                  title:"信息公告：2020年8月31有限公司成立，我行用信金额444444元"
                }]
            }
        },
        mounted(){
            this.$nextTick(()=>{
                console.log(document.getElementById('#scroll_con'))
            })
        },
        methods: {
            navigateToD(item) {
                console.log(item)
            }
        },
    }
</script>

<style lang="less" scoped>
    .laba_box {
        align-items: center;
        display: flex;
        flex-direction: row;
        .marquee-inner-wrapper {
            width: calc(100vw/2 - 50px);
            overflow: hidden;
            height: 40px;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 40px;
            margin: 0 auto;
            white-space: nowrap;
            position: relative;
            margin-left: 15px;
        }

        .marquee-inner-wrapper span {
            background-color: #eeeeee;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
        }

        .first-marquee {
            -webkit-animation: 26s first-marquee linear infinite normal;
            animation: 26s first-marquee linear infinite normal;
            cursor: pointer;

            span {
                width: 100%;
                display: flex;
                align-items: center;
                background-color: #eeeeee;
                z-index: 999;
                overflow: visible;
                transform: translateY(20px);

                li {
                    list-style: none;
                    margin-left: 45px;

                    &:nth-child(1) {
                        margin-left: 0;
                    }
                }
            }
        }

        @keyframes first-marquee {
            0% {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }

            100% {
                -webkit-transform: translate3d(-100%, 0, 0);
                transform: translate3d(-100%, 0, 0);
                display: none;
            }
        }
    }
</style>
