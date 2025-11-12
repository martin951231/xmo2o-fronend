<template>
    <div class="couponVerifiy">
        <img src="./static/couponVerifiy.png" class="header-img" />
        <div class="title">{{L('优惠券核销')}}</div>
        <div class="flex align-center justify-center">
            <div class="search">
                <input :placeholder="L('输入/扫描核销码进行核销')" v-model="keyword" />
                <div class="close" @click="clear" v-show="keyword">
                    <a-icon type="close-circle" />
                </div>
            </div>
            <a-button type="primary" class="search-btn" @click="handleSearchCode">{{L('查询')}}</a-button>
        </div>

        <div class="coupon-list">
            <div class="item" v-if="couponInfo && keyword">
                <div class="left">
                    <img :src="couponInfo.img" alt />
                </div>
                <div class="right flex align-center flex-1">
                    <div class="flex-1">
                        <div class="title">{{couponInfo.coupon_name}}</div>
                        <div class="discount-desc">{{couponInfo.coupon_price_txt}}</div>
                        <div class="time">{{couponInfo.date_txt}}</div>
                    </div>
                    <div class="verifiy" :class="{'disabled':couponInfo.status == 1}" @click="verifiy">{{couponInfo.status_txt}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import couponStaffApi from '@/api/coupon/storestaff'
import SCAN from '@/utils/scan.js'
import Rem from '@/utils/rem.js'
Rem.getrem()
export default {
    data() {
        return {
            shanshu_custom: 0, //定制 www.esstc.cn浙江云尚商业管理发展有限公司
            system_config: {},
            keyword: '',
            scan: '',
            couponInfo: '',
        }
    },
    created() {
        this.scan = new SCAN(this, 200) // 实例化SCAN类， 200是扫码枪有效输入间隔毫秒
    },
    beforeDestroy() {
        this.$bus.$off('scanCode')
        this.scan.stop()
    },
    mounted() {
        this.$bus.$on('scanCode', (code) => {
            // scanCode 是SCAN类中出发的事件名， code是扫码枪扫描的值
            code = code.trim() // 扫码枪扫描的值去空格
            if (!code) return
            this.keyword = code // 赋值给页面上的变量，方便其他函数操作，也可直接拿到值进行操作
            this.handleSearchCode() // 定义一个函数，用于扫描的值后进行相关操作，也可直接进行操作
        })

        this.scan.start() // 开始监听扫码枪扫码
    },
    methods: {
        clear() {
            this.keyword = ''
        },
        handleSearchCode() {
            if (!this.keyword) return
            this.couponInfo = null
            this.request(couponStaffApi.getCodeInfo, { code: this.keyword }).then((res) => {
                if (res.coupon_name) {
                    this.couponInfo = res
                }
            })
        },
        verifiy() {
            if (this.couponInfo && this.couponInfo.status == 0) {
                this.$confirm({
                    title: this.L('确定核销吗？'),
                    centered: true,
                    onOk: () => {
                        this.request(couponStaffApi.verifyCoupon, {
                            code: this.couponInfo.code,
                            type: this.couponInfo.type,
                        }).then((res) => {
                            this.$message.success(this.L('核销成功'))
                            this.handleSearchCode();
                        })
                    },
                })
            }
        },
    },
}
</script>

<style lang="less" scoped>
@rem: 192 * 1rem; //定义页面尺寸
.couponVerifiy {
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    padding: 20 / @rem;
    text-align: center;
    padding-top: 60 / @rem;
    .header-img {
        width: 170 / @rem;
        height: 172 / @rem;
        margin-bottom: 10 / @rem;
    }
    .title {
        font-weight: bold;
        font-size: 30 / @rem;
        color: #333333;
        margin-bottom: 50 / @rem;
    }
    .search {
        width: 900 / @rem;
        height: 58 / @rem;
        position: relative;
        input {
            width: 100%;
            height: 58 / @rem;
            box-sizing: border-box;
            background: #ffffff;
            border-radius: 29 / @rem;
            border: 1px solid #1f94ff;
            padding: 0 20 / @rem;
            padding-right: 120 / @rem;
            font-size: 18 / @rem;
        }
        .close {
            top: 50%;
            transform: translateY(-50%);
            position: absolute;
            right: 80 / @rem;
            font-size: 24 / @rem;
            cursor: pointer;
        }
        input:focus {
            outline: none; /* 去除默认的蓝色外边框 */
        }
    }
    .search-btn {
        width: 143 / @rem;
        height: 58 / @rem;
        border-radius: 29 / @rem;
        margin-left: -60 / @rem;
        font-size: 24 / @rem;
    }
    .coupon-list {
        width: 980 / @rem;
        margin: 40 / @rem auto;
        .item {
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 10 / @rem;
            padding: 20 / @rem;
            .left {
                margin-right: 25 / @rem;
                img {
                    width: 120 / @rem;
                    height: 120 / @rem;
                    background: #b6b6b6;
                    border-radius: 10 / @rem;
                }
            }
            .right {
                text-align: left;
                .title {
                    font-weight: bold;
                    font-size: 24 / @rem;
                    color: #333333;
                    margin-bottom: 5 / @rem;
                }
                .discount-desc {
                    font-weight: 500;
                    font-size: 20 / @rem;
                    color: #fe2d1f;
                    margin-bottom: 5 / @rem;
                }
                .time {
                    font-weight: 500;
                    font-size: 20 / @rem;
                    color: #666666;
                }
                .verifiy {
                    width: 130 / @rem;
                    height: 100 / @rem;
                    line-height: 100 / @rem;
                    text-align: center;
                    background: #188efb;
                    border-radius: 10 / @rem;
                    color: #fff;
                    font-size: 22 / @rem;
                    cursor: pointer;
                }
                .disabled {
                    background: #cccccc;
                }
            }
        }
    }
}
</style>