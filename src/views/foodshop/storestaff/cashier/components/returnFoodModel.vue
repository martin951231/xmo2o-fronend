<template>
  <div class="computer_model">
    <div class="title_content">
      <div class="border_box">
        <div class="titletext">{{ L('退菜') }} - {{ goodsInfo.name }}</div>
        <div class="closeicon" @click="closemodel()">
          <img src="../../../../../assets/storestaff/close.png" alt="" />
        </div>
      </div>
    </div>
    <div class="return_num_container">
      <div class="content_text">{{ L('选择数量') }}:</div>
      <div class="number_content">
        <div class="fontbox" :class="returnCounts > 1 ? 'hlstyle' : ''" @click="reducefnc()">
          <a-icon type="minus" />
        </div>
        <div class="returnCounts">
          <div class="numbox">{{ returnCounts }}</div>
        </div>
        <div class="fontbox" :class="returnCounts < goodsInfo.num ? 'hlstyle' : ''" @click="addfnc()">
          <a-icon type="plus" />
        </div>
      </div>
    </div>

    <!-- <div class="return_reason_container">
      <div class="content_text">退菜原因:</div>
      <div class="input_content">
        <div class="fontbox"><div class="iconfont">&#xe609;</div></div>
        <input type="text" v-model="returnReason" placeholder="自定义" />
      </div>
    </div> -->

    <div class="bottom_container">
      <div class="return_btn" @click="returnDishs()">{{ L('确定退菜') }}</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    goodsInfo: Object,
  },
  data() {
    return {
      numbervalueList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0'], //输入键盘
      returnCounts: 1, //退菜数量
      returnReason: '', //退菜原因
      shakePoof: true,
    }
  },
  created() {
  },
  methods: {
    closemodel() {
      this.$emit('closemodel')
    },

    // 减数量
    reducefnc() {
      if (this.returnCounts > 1) {
        this.returnCounts--
      }
    },

    // 加数量
    addfnc() {
      let num = this.goodsInfo.num
      // 套餐退菜，可退数量 = 购买数量 - 已核销的数量， 已核销的套餐不允许退
      if (this.goodsInfo.is_package_goods && this.goodsInfo.isRefundPackageGoods) {
        num = Number(this.goodsInfo.num) - Number(this.goodsInfo.verific_num)
      }
      if (this.returnCounts < num) {
        this.returnCounts++
      }
    },

    returnDishs() {
      if (this.shakePoof) {
        this.shakePoof = false
        const key = 'returnfood'
        this.$message.loading({ content: this.L('退菜中') + '...', duration: 0, key })
        this.request('/foodshop/storestaff.order/refundGoods', {
          order_id: this.$store.state.storestaff.nowOrderId,
          id: this.goodsInfo.id,
          num: this.returnCounts,
          note: this.returnReason,
        })
          .then((res) => {
            this.shakePoof = true
            if (res.msg == this.L('退菜成功')) {
              this.$message.success({ content: res.msg, key })
              this.$emit('returnSuccess')
            }
          })
          .catch(() => {
            this.$message.destroy()
          })
      }
    },
  },
}
</script>

<style scoped lang="less">
@rem: 192; //定义页面尺寸
.computer_model {
  width: 100%;
  height: 70%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  .title_content {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20 / @rem * 1rem;
    .border_box {
      width: 100;
      height: 100 / @rem * 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 10 / @rem * 1rem;
      border-bottom: 1px solid #ededed;
      .closeicon {
        width: 26 / @rem * 1rem;
        height: 26 / @rem * 1rem;
        display: flex;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .titletext {
        width: 100%;
        font-size: 28 / @rem * 1rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ff6434;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
  .return_num_container {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 120 / @rem * 1rem;
    padding: 0 30 / @rem * 1rem;
    font-size: 22 / @rem * 1rem;
    color: #666666;
    .content_text {
      font-weight: 500;
      font-size: 24 / @rem * 1rem;
      color: #666666;
    }
    .number_content {
      display: flex;
      align-items: center;
      background-color: #ffffff;
      margin-left: 10 / @rem * 1rem;
      .fontbox {
        width: 60 / @rem * 1rem;
        height: 60 / @rem * 1rem;
        box-sizing: border-box;
        border: 1 / @rem * 1rem solid #ebebeb;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #00ccb4;
      }
      .hlstyle {
        background-color: #ebfefc;
      }
      .returnCounts {
        width: 140 / @rem * 1rem;
        height: 60 / @rem * 1rem;
        box-sizing: border-box;
        border-top: 1 / @rem * 1rem solid #ebebeb;
        border-bottom: 1 / @rem * 1rem solid #ebebeb;
        display: flex;
        align-items: center;
        justify-content: center;
        .numbox {
          font-size: 20 / @rem * 1rem;
          font-weight: bold;
          color: #343434;
        }
      }
    }
  }

  .return_reason_container {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 30 / @rem * 1rem;
    margin-top: 20 / @rem * 1rem;
    .content_text {
      white-space: nowrap;
      font-size: 24 / @rem * 1rem;
      font-weight: 500;
      color: #666666;
      margin-bottom: 15 / @rem * 1rem;
    }
    .input_content {
      height: 70 / @rem * 1rem;
      margin-left: 10 / @rem * 1rem;
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 2 / @rem * 1rem solid #ebebeb;
      border-radius: 10 / @rem * 1rem;
      box-sizing: border-box;
      padding: 0 25 / @rem * 1rem;
      .fontbox {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20 / @rem * 1rem;
        .iconfont {
          font-size: 24 / @rem * 1rem;
          color: #9a9a9a;
          font-weight: 900;
        }
      }
      input {
        height: 100%;
        outline: none;
        border: none;
        background: none;
        font-size: 24 / @rem * 1rem;
        font-weight: 500;
        color: #9a9a9a;
      }
    }
  }

  .bottom_container {
    width: 100%;
    box-sizing: border-box;
    padding: 0 50 / @rem * 1rem;
    margin-top: 40 / @rem * 1rem;
    margin-bottom: 40 / @rem * 1rem;
    .return_btn {
      cursor: pointer;
      width: 100%;
      height: 70 / @rem * 1rem;
      line-height: 70 / @rem * 1rem;
      font-size: 24 / @rem * 1rem;
      font-weight: bold;
      color: #ffffff;
      border-radius: 10 / @rem * 1rem;
      background: #ff6434;
      text-align: center;
    }
  }
}
</style>
