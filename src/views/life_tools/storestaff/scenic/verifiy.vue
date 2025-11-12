<template>
  <div class="page">
    <div class="top">
      <!-- <a class="top_left" @click="onReturn"> <img src="./static/xitongfanhui.png" alt="">返回以点菜单 </a>
            <a class="top_right"><img src="./static/shuaxin.png" alt=""></a> -->
    </div>
    <div class="container">
      <div class="cancel">
        <img class="cancel_img" src="./static/scan_code.png" alt="">
        <p class="cancel_text">请对准扫描机进行核销</p>
        <!-- style="background: #ffffff; width: 0; height: 0;opacity: 0;" -->
        <!-- <a-input type="text" placeholder="请扫描序列号" @input="onCancelFocus" ref="codeInput" v-model="form.code" /> -->
        <input
          class="input_a"
          type="text"
          v-focus.noKeyboard
          placeholder="请扫描序列号"
          ref="input_cancel"
          :allowClear="true"
          @click="onAutoFocus"
          @input="onCancelFocus"
          @blur="onAutoBlur"
          v-model="form.code" />
      </div>

      <div class="action">
        <a-button type="primary" @click="cancelCode">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script>
    import lifeToolsStorestaffApi from '@/api/life_tools/storestaff/index'
    export default {
        name: 'OrderManage',
        data () {
            return {
                timer: null, // 定时器
                timerOut: null,
                visibleCancel: true, // 扫描弹窗
                visibleCoupon: false, // 序列号输入弹窗
                visibleIntegral: false, // 积分支付核销
                confirmLoading: false,
                coupon_integral: '',
                input_code: '',
                input_score: '',
                input_remark: '',
                focusIntegral: '', // 判断焦点
                form: {
                    code: ''
                },
                input_cancel_code: ''
            }
        },
        created () {},
        mounted () {
            this.$refs.codeInput.focus()
        },
        watch: {
            'form.code': {
                handler (newval, oldval) {
                    // console.log(newval, oldval, '----------打印值-----------')
                    // const _this = this
                    // if (newval !== oldval && newval !== '' && this.form.code) {
                    //   _this.timer = setInterval(() => {
                    //     console.log(newval, oldval, _this.timer)
                    //     // _this.cancelCode()
                    //     if (_this.timer) {
                    //       clearInterval(_this.timer)
                    //       _this.timer = null
                    //     }
                    //   }, 1000)
                    // }
                }
            }
        },
        methods: {

            // 聚焦获取数据
            onCancelFocus () {
                if (this.form.code.length >= 12 ) {
                    this.$refs.input_cancel.blur()
                    this.cancelCode()
                }
            },

            // 监听是否有焦点
            onAutoFocus () {
                console.log(12312313)
                this.$refs.input_cancel.setAttribute('readonly', 'readonly')
                if (this.timer) {
                            clearTimeout(this.timer)
                            this.timer = null
                        }
                this.timer = setTimeout(() => {
                this.$refs.input_cancel.removeAttribute('readonly')
                }, 200)
            },

            onAutoBlur () {
                if (this.visibleCancel) {
                console.log('----------12312----------')
                this.$nextTick(() => {
                    this.$refs.input_cancel.focus()
                    this.onAutoFocus()
                })
                }
            },

            // 核销接口
            cancelCode () {
                const params = this.form

                this.form = {
                    code: ''
                }
                if (this.timerOut) {
                    clearTimeout(this.timerOut)
                    this.timerOut = null
                }
                this.timerOut = setTimeout(() => {
                    this.form.code = ''
                })
                this.request(lifeToolsStorestaffApi.scenicVerification, params).then((res) => {
                    this.$message.success('核销成功')

                    this.form = {
                        code: ''
                    }
                })

                if (this.visibleCancel) {
                    this.$nextTick(() => {
                        this.$refs.input_cancel.focus()
                        this.$refs.input_cancel.setAttribute('readonly', 'readonly')
                        if (this.timer) {
                            clearTimeout(this.timer)
                            this.timer = null
                        }
                        this.timer = setTimeout(() => {
                        this.$refs.input_cancel.removeAttribute('readonly')
                        }, 200)
                    })
                }
            },

            // 点击返回
            onReturn () {
                this.$router.go(-1) // 返回上一层
            },
            clearTimer () {
                if (this.timer) {
                    clearTimeout(this.timer)
                    this.timer = null
                }
                if (this.timerOut) {
                    clearTimeout(this.timerOut)
                    this.timerOut = null
                }
            }

        },
        beforeDestroy () {
            this.clearTimer()
        }
    }
</script>

<style lang="less" scoped>
    .page {
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
    }

    .top {
        /* width: 100%; */
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px 30px;
        margin-bottom: 10%;
    }

    .top_left {
        font-size: 10px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ABABA1;
        line-height: 30px;

        img {
            width: 15px;
            height: 15px;
        }
    }

    .top_right {
        img {
            width: 35px;
            height: 35px;
        }
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .center_click {
        width: 190px;
        height: 140px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 50px;
    }

    .center_img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .center_text {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #FFFFFF;
    }

    .cancel_img {
        width: 160px;
        height: 79px;
        // margin-bottom: 30px;
        margin: 0 auto;

        img {
            width: 160px;
            height: 79px;
        }
    }

    .cancel_text {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #161616;
        line-height: 30px;
        text-align: center;
    }

    .container {
        width: 420px;
        height: 300px;
        margin: 0 auto;
        padding-top: 20px;
        background-color: #ffffff;
    }

    .action {
        text-align: right;
        width: 100%;
        height: 50px;
        border-top: 1px solid #eeeeee;
        margin-top: 20px;
        padding: 8px 20px 0 0;
    }

    .cancel {
        width: 249px;
        height: 210px;
        background: #FFFFFF;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: 0 auto;

        .cancel_img {
            width: 160px;
            height: 79px;
            margin-bottom: 15px;
        }

        .cancel_text {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #161616;
            line-height: 26px;
        }

        .cancel_btn {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 100%;

            .btn {
                width: 190px;
                height: 60px;
                background: #18C6B6;
                border-radius: 30px;
                font-size: 26px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 52px;
                border-color: #18C6B6;
            }
        }
    }

    .serial_input {
        margin-bottom: 10px;
    }

    .input_a{
      width: 300px;
      border: 1px solid #a9a7a7;
      transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
      border-radius: 2px;
    }
    .input_a:focus{
      border-color: #66afe9 !important;
      outline: 0;
      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0,.075, 0 0 8px rgba(102, 175, 233, 0.6));
      -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0,.075, 0 0 8px rgba(102, 175, 233, 0.6));
      box-shadow: inset 0 1px 1px rgba(0, 0, 0,.075, 0 0 8px rgba(102, 175, 233, 0.6));
    }
</style>
