<template>
  <div class="page">
    <audio
      ref="audio"
      :src="audioVoice"
    ></audio>
    <div class="top">
      <a class="top_left" @click="onReturn"> <img src="./static/xitongfanhui.png" alt="">返回以点菜单 </a>
      <a class="top_right"><img src="./static/shuaxin.png" alt=""></a>
    </div>

    <div class="center">
      <div class="center_click" @click="showModal">
        <img class="center_img" src="./static/coupon.png" alt="">
        <p class="center_text">餐券核销</p>
      </div>
      <div class="center_click" @click="showModalIntegral">
        <img class="center_img" src="./static/integral.png" alt="">
        <p class="center_text">积分支付</p>
      </div>
      <div class="center_click" @click="showFreePay">
        <img class="center_img" src="./static/integral.png" alt="">
        <p class="center_text">自由支付</p>
      </div>
    </div>

    <!-- 餐券核销弹窗 -->
    <a-modal
      title="输入序列号"
      :visible="visibleCancel"
      @ok="handleOkCancel"
      @cancel="handleCancelCancel"
      :closable="false"
      :maskClosable="false"
      okText="手动输入会员号核销"
      :destroyOnClose="true"
    >
    <template slot="footer">
        <a-button key="back" size="large" @click="handleCancelCancel">取消</a-button>
        <a-button type="primary" size="large" @click="switchPayment(1)">自由支付</a-button>
        <a-button key="submit" size="large" type="primary" @click="handleOkCancel">手动输入会员号核销</a-button>
    </template>
      <div class="cancel" v-if="visibleCancel">
        <img class="cancel_img" src="./static/scan_code.png" alt="">
        <p class="cancel_text">请对准扫描机进行核销</p>
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
          disabled
          v-model="form.code" />
        <input
          class="input_a"
          style="position:absolute; bottom: 25px; z-index:-1"
          type="password"
          v-focus.noKeyboard
          placeholder="请扫描序列号"
          ref="input_cancel"
          :allowClear="true"
          @click="onAutoFocus"
          @input="onCancelFocus"
          @blur="onAutoBlur"
          v-model="form.code" />
      </div>
    </a-modal>

    <!-- 手动输入餐券核销弹窗 -->
    <a-modal
      title="输入序列号"
      :visible="visibleCoupon"
      @ok="handleOkCoupon"
      @cancel="handleCancelCpupon"
      :closable="false"
      :maskClosable="false"
      :destroyOnClose="true"
    >
    <template slot="footer">
        <a-button key="back" type="primary" size="large" @click="handleCancelCpupon">取消</a-button>
        <a-button type="primary" size="large" @click.stop="handleOkCoupon">确定</a-button>
    </template>
      <div class="serial_input">
        <a-input
          class="input"
          placeholder="请输入序列号"
          type="text"
          ref="seach_input"
          :allowClear="true"
          v-model="form.code" />
      </div>
    </a-modal>

    <!-- 积分支付核销弹窗 -->
    <a-modal
      title="积分支付核销"
      :visible="visibleIntegral"
      @ok="handleOkIntegral"
      @cancel="handleCanceIntegral"
      :closable="false"
      :allowClear="true"
      :maskClosable="false"
      :destroyOnClose="true"
    >
    <template slot="footer">
        <a-button key="back" type="primary" size="large" @click="handleCanceIntegral">取消</a-button>
        <a-button type="primary" size="large" @click.stop="handleOkIntegral">确定</a-button>
    </template>
      <div class="serial_input">
        <a-input
          class="input"
          placeholder="请输入序列号"
          type="text"
          ref="seach_input"
          :allowClear="true"
          v-model="form.code" />
      </div>
      <div class="serial_input">
        <a-input
          placeholder="请输入核销积分"
          type="text"
          :allowClear="true"
          @focus="focusIntegralScore"
          v-model="form.score" />
      </div>
      <div class="serial_input">
        <a-textarea
          class="input"
          placeholder="备注内容"
          type="text"
          :allowClear="true"
          @focus="focusIntegralRemark"
          v-model="form.remark" />
      </div>
    </a-modal>

    <!-- 自由支付弹窗 -->
    <a-modal
      title="自由支付"
      :visible="visibleFreePay"
      @ok="handleOkFreePay"
      @cancel="handleCanceFreePay"
      :closable="false"
      :allowClear="true"
      :maskClosable="false"
      :destroyOnClose="true"
    >
    <template slot="footer">
        <a-button key="back" size="large" @click="handleCanceFreePay">取消</a-button>
        <a-button type="primary" size="large" @click="switchPayment(3)">餐券核销</a-button>
        <a-button key="submit" size="large" type="primary" @click="handleOkFreePay">确定</a-button>
    </template>
      <div class="serial_input">
        <a-input
          class="input"
          placeholder="请输入核销金额"
          type="number"
          ref="seach_input"
          :allowClear="true"
          v-model="form.money" />
      </div>
      <a-form
        id="components-form-demo-validate-other"
        v-bind="formItemLayout"
      >
        <a-form-item label="扣款方式">
          <a-radio-group name="radioGroup" v-model.number="form.pay_sort">
            <a-radio :value="0">
              先扣积分再余额
            </a-radio>
            <a-radio :value="1">
              先扣余额再积分
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否连续扫码" >
          <a-radio-group name="radioGroup" v-model="formFreePay.scanCode">
            <a-radio :value="0">
              连续
            </a-radio>
            <a-radio :value="1">
              不连续
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 自由支付自动核销弹窗 -->
    <a-modal
      title="输入序列号"
      :visible="visibleFreePayAuto"
      :closable="false"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <div class="cancel">
        <img class="cancel_img" src="./static/scan_code.png" alt="">
        <p class="cancel_text"><span>核销金额：{{ form.money }}</span><span style="padding-left: 50px;">{{ formFreePay.scanCode==0?'连续扫码':'不连续扫码' }}</span></p>
        <p class="cancel_text">请对准扫描机进行核销</p>
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
        <input
          class="input_a"
          style="position:absolute; bottom: 5px; z-index: -1;"
          type="password"
          v-focus.noKeyboard
          placeholder="请扫描序列号"
          ref="input_cancel"
          :allowClear="true"
          @click="onAutoFocus"
          @input="onCancelFocus"
          @blur="onAutoBlur"
          v-model="form.code" />
      </div>
      <template slot="footer">
        <a-button type="primary" size="large" @click="switchPayment(2)">餐券核销</a-button>
        <a-button type="primary" size="large" @click.stop="onInputNumber">手动输入序列号</a-button>
        <a-button type="primary" size="large" @click.stop="onReturnAuto">修改金额</a-button>
        <a-button type="primary" size="large" @click.stop="onCloseAuto">关闭</a-button>
      </template>
    </a-modal>

    <!-- 自由支付手动核销弹窗 -->
    <a-modal
      title="输入序列号"
      :visible="visibleAutoCoupon"
      @ok="handleOkCoupon"
      @cancel="handleCancelCpupon"
      :closable="false"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <template slot="footer">
        <a-button key="back" type="primary" size="large" @click="handleCancelCpupon">取消</a-button>
        <a-button type="primary" size="large" @click.stop="handleOkCoupon">确定</a-button>
      </template>
      <div class="serial_input">
        <a-input
          class="input"
          placeholder="请输入序列号"
          type="text"
          ref="seach_input"
          v-model="form.code" />
      </div>
    </a-modal>
  </div>
</template>

<script>
  import lifeMerchantApi from '@/api/employee/merchant/index'
  export default {
    name: 'OrderManage',
    data () {
      return {
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 15 }
        },
        audioVoice: '',
        timer: null,
        timerOut: null,
        visibleCancel: false, // 扫描弹窗
        visibleCoupon: false, // 序列号输入弹窗
        visibleIntegral: false, // 积分支付核销
        visibleFreePay: false, // 自由支付弹窗
        visibleFreePayAuto: false, // 自由支付核销弹窗
        visibleAutoCoupon: false, // 自由支付手动核销
        card_type: '', // 判断是哪个核销
        confirmLoading: false,
        coupon_integral: '',
        input_code: '',
        input_score: '',
        input_remark: '',
        focusIntegral: '', // 判断焦点
        form: {
          code: '', // 核销码
          score: '', // 积分
          remark: '', // 备注
          card_type: '', // 核销方式 coupon：消费券核销，积分，余额顺序核销；score：积分消费；money：余额消费；auto：自由支付，余额/积分消费，扣除顺序按“pay_sort”字段
          pay_sort: 0, // 支付顺序：0=先积分后余额，1=先余额后积分，card_type=auto（自由支付）时有效，默认为0
          money: '' // 消费金额：消费积分或余额数，card_type=auto（自由支付）时必传，card_type=money（余额消费）时必传
        },
        formFreePay: { // 自由支付配置弹窗
          scanCode: 0 // 是否连续扫码
        }
      }
    },
    beforeDestroy () {
      this.clearTimer() // 清除定时器
    },
    methods: {
      // 点击餐券核销
      showModal () {
        this.visibleCancel = true
        this.card_type = 'coupon'
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
        if (this.visibleFreePayAuto || this.visibleCancel) {
          console.log('----------12312----------')
          this.$nextTick(() => {
            this.$refs.input_cancel.focus()
            this.onAutoFocus()
          })
        }
      },
      // 聚焦获取数据
      onCancelFocus () {
        if (this.form.code.length >= 18 || this.form.code.indexOf('?') !== -1) {
          this.$refs.input_cancel.blur()
          this.cancelCode()
          this.coupon_integral = 'coupon'
        }
      },
      // 自动核销餐券 点击确定跳转手动核销
      handleOkCancel () {
        this.visibleCancel = false
        this.visibleCoupon = true
        this.$nextTick(() => {
          this.$refs.seach_input.focus()
        })
      },
      // 自动核销点击取消
      handleCancelCancel () {
        this.visibleCancel = false
        this.form = {
          code: '', // 核销码
          score: '', // 积分
          remark: '', // 备注
          card_type: '', // 核销方式 coupon：消费券核销，积分，余额顺序核销；score：积分消费；money：余额消费；auto：自由支付，余额/积分消费，扣除顺序按“pay_sort”字段
          pay_sort: 0, // 支付顺序：0=先积分后余额，1=先余额后积分，card_type=auto（自由支付）时有效，默认为0
          money: '' // 消费金额：消费积分或余额数，card_type=auto（自由支付）时必传，card_type=money（余额消费）时必传
        }
      },

      // 点击积分支付核销
      showModalIntegral () {
        this.visibleIntegral = true
        this.coupon_integral = 'integral'
        this.card_type = 'score'
        this.$nextTick(() => {
          this.$refs.seach_input.focus()
        })
      },

      // 点击自由支付
      showFreePay () {
        console.log('点击支付')
        this.visibleFreePay = true
        this.card_type = 'auto'
        this.$nextTick(() => {
          this.$refs.seach_input.focus()
        })
      },

      // 自由支付第一层弹窗确认
      handleOkFreePay () {
        if (!this.form.money) {
          this.$message.warning('请输入核销金额')
          return false
        }
        console.log(this.formFreePay, this.form)
        this.visibleFreePay = false
        this.visibleFreePayAuto = true
      },
      // 自由支付第一层弹窗取消
      handleCanceFreePay () {
        this.visibleFreePay = false
        this.form = {
          code: '', // 核销码
          score: '', // 积分
          remark: '', // 备注
          card_type: '', // 核销方式 coupon：消费券核销，积分，余额顺序核销；score：积分消费；money：余额消费；auto：自由支付，余额/积分消费，扣除顺序按“pay_sort”字段
          pay_sort: 0, // 支付顺序：0=先积分后余额，1=先余额后积分，card_type=auto（自由支付）时有效，默认为0
          money: '' // 消费金额：消费积分或余额数，card_type=auto（自由支付）时必传，card_type=money（余额消费）时必传
        }
        this.formFreePay = { // 自由支付配置弹窗
          scanCode: 0 // 是否连续扫码
        }
      },
      // 自由支付第二层弹窗手动输入序列号
      onInputNumber () {
        this.visibleFreePayAuto = false
        this.visibleAutoCoupon = true
        this.$nextTick(() => {
          this.$refs.seach_input.focus()
        })
      },
      // 自由支付第二层弹窗修改金额
      onReturnAuto () {
        this.visibleFreePayAuto = false
        this.visibleFreePay = true
        this.$nextTick(() => {
          this.$refs.seach_input.focus()
        })
      },
      // 自由支付第二层弹窗关闭
      onCloseAuto () {
        this.visibleFreePayAuto = false
        this.form = {
          code: '', // 核销码
          score: '', // 积分
          remark: '', // 备注
          card_type: '', // 核销方式 coupon：消费券核销，积分，余额顺序核销；score：积分消费；money：余额消费；auto：自由支付，余额/积分消费，扣除顺序按“pay_sort”字段
          pay_sort: 0, // 支付顺序：0=先积分后余额，1=先余额后积分，card_type=auto（自由支付）时有效，默认为0
          money: '' // 消费金额：消费积分或余额数，card_type=auto（自由支付）时必传，card_type=money（余额消费）时必传
        }
      },

      // 核销选择
      handleOk (e) {
        this.confirmLoading = false
        this.visible = false
        if (this.coupon_integral === 'coupon') {
          this.visibleCoupon = true
        } else {
          this.visibleIntegral = true
        }
      },
      // 核销选择取消
      handleCancel (e) {
        console.log('Clicked cancel button')
        this.visible = false
      },

      // 输入序列号的确认
      handleOkCoupon () {
        if (!this.form.code) {
          this.$message.warning('请输入序列号')
          return false
        }
        this.cancelCode() // 调用核销接口
      },
      // 输入序列号的取消
      handleCancelCpupon () {
        this.visibleCoupon = false
        this.visibleAutoCoupon = false
        this.form = {
          code: '', // 核销码
          score: '', // 积分
          remark: '', // 备注
          card_type: '', // 核销方式 coupon：消费券核销，积分，余额顺序核销；score：积分消费；money：余额消费；auto：自由支付，余额/积分消费，扣除顺序按“pay_sort”字段
          pay_sort: 0, // 支付顺序：0=先积分后余额，1=先余额后积分，card_type=auto（自由支付）时有效，默认为0
          money: '' // 消费金额：消费积分或余额数，card_type=auto（自由支付）时必传，card_type=money（余额消费）时必传
        }
      },

      // 输入积分确认
      handleOkIntegral () {
        console.log(this.input_code)
        if (!this.form.code) {
          this.$message.warning('请输入序列号')
          return false
        }
        if (!this.form.score) {
          this.$message.warning('请输入核销的积分')
          return false
        }
        this.cancelCode()
      },
      // 输入积分取消
      handleCanceIntegral () {
        this.visibleIntegral = false
        this.form = {
          code: '', // 核销码
          score: '', // 积分
          remark: '', // 备注
          card_type: '', // 核销方式 coupon：消费券核销，积分，余额顺序核销；score：积分消费；money：余额消费；auto：自由支付，余额/积分消费，扣除顺序按“pay_sort”字段
          pay_sort: 0, // 支付顺序：0=先积分后余额，1=先余额后积分，card_type=auto（自由支付）时有效，默认为0
          money: '' // 消费金额：消费积分或余额数，card_type=auto（自由支付）时必传，card_type=money（余额消费）时必传
        }
      },

      // 核销接口
      cancelCode () {
        var params = this.form
        params.card_type = this.card_type
        console.log(params, this.form, '---------打印params-----------')
        // this.$nextTick(() => {
        //   this.form.code = ''
        //   this.form.score = ''
        //   this.form.remark = ''
        //   if (this.formFreePay.scanCode != 0 && this.visibleFreePayAuto) {
        //     this.visibleFreePayAuto = false
        //     this.visibleFreePay = true
        //   }
        // })
        if (this.timerOut) {
              clearTimeout(this.timerOut)
              this.timerOut = null
            }
        this.timerOut = setTimeout(() => {
          this.form.code = ''
          this.form.score = ''
          this.form.remark = ''
          if (this.formFreePay.scanCode != 0 && this.visibleFreePayAuto) {
            this.visibleFreePayAuto = false
            this.visibleFreePay = true
          }
        })

        this.request(lifeMerchantApi.paymentScan, params).then((res) => {
          console.log(res)
          if (res && res.voice_url) {
              this.audioVoice = res.voice_url
              this.$nextTick(() => {
                this.$refs.audio.play() // 这里使用了audio的原生开始播放事件,同样不加on, 并使用ref获取dom
            })
            } else {
              this.audioVoice = ''
            }
          if (res.status == 1) {
            this.$message.success(res.title)
          } else {
            this.$message.warning(res.title)
          }
          this.form.code = ''
          this.form.score = ''
          this.form.remark = ''
        })
        if (this.visibleFreePayAuto || this.visibleCancel) {
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

      // 获取积分焦点
      focusIntegralScore () {
        console.log('h获取积分焦点')
        this.focusIntegral = 'score'
      },
      // 获取内容焦点
      focusIntegralRemark () {
        this.focusIntegral = 'remark'
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
      },
      // 切换支付
      switchPayment(type){
        //餐卷核销
        if(type == 1){
          this.visibleCancel = false;
          this.visibleFreePay = true;
        }else if(type == 2){
          this.visibleFreePayAuto = false;
          this.visibleCancel = true;
        }
        else if(type == 3){
          //自由支付
          this.visibleCancel = true;
          this.visibleFreePay = false;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .page{
    height: 100vh;
    background: rgba(0, 0, 0,0.5);
  }
  .top{
    /* width: 100%; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 30px;
    margin-bottom: 10%;
  }
  .top_left{
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
  .top_right{
    img {
      width: 35px;
      height: 35px;
    }
  }

  .center{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .center_click{
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
  .center_img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .center_text{
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
  }

  .cancel_img{
      width: 160px;
      height: 79px;
      // margin-bottom: 30px;
      margin: 0 auto;
      img {
        width: 160px;
        height: 79px;
      }
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
    .cancel_text{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #161616;
      line-height: 30px;
      text-align: center;
    }
  .cancel{
    width: 249px;
    height: 210px;
    background: #FFFFFF;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
    position: relative;
    .cancel_img{
      width: 160px;
      height: 79px;
      margin-bottom: 15px;
    }
    .cancel_text{
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

.serial_input{
  margin-bottom: 10px;
}
</style>
