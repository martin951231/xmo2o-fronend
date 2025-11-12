<template>
  <div class="payConfirm_alert_wrapper">
    <div class="title_container">
      <div class="leftempty_box"></div>
      <div class="title_font">{{ L('打印') }}</div>
      <div class="closeicon" @click="closemodel()"><img src="../../../../../assets/storestaff/close.png" alt="" /></div>
    </div>
    <div class="alert_content_wrapper">
      <div class="billList_content">
        <div class="bill_items" v-for="(items, index) in billList" :key="index">
          <div class="select_content" @click="selectItems(index)">
            <div class="iconbox" v-if="items.ischeck">
              <img src="../../../../../assets/storestaff/checked.png" alt="" />
            </div>
            <div class="no_select" v-else></div>
          </div>
          <div class="billname" @click="selectItems(index)">{{ items.name }}</div>
        </div>
      </div>
      <div class="selectall_content" @click="changeAall()">
        <div class="iconbox" v-if="selectall"><img src="../../../../../assets/storestaff/checkall.png" alt="" /></div>
        <div class="select_all_border" v-else></div>
        <div class="select_all_text">{{ L('全选') }}</div>
      </div>
    </div>
    <div class="confirm_bar" @click="confirmPrinting()">
      {{ L('确定') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderId: Number,
  },
  data() {
    return {
      selectall: true,
      billList: [
        {
          name: this.L('打印客看单'),
          type: 'customer_account',
          ischeck: true,
        },
        {
          name: this.L('打印后厨单'),
          type: 'menu',
          ischeck: true,
        },
        {
          name: this.L('打印预结单'),
          type: 'pre_account',
          ischeck: true,
        },
        {
          name: this.L('打印结账单'),
          type: 'bill_account',
          ischeck: true,
        },
      ],
    }
  },
  methods: {
    selectItems(idx) {
      this.billList.forEach((items, index) => {
        if (idx == index) {
          items.ischeck = !items.ischeck
          if (items.ischeck) {
            this.selectall = this.billList.every((x) => {
              return x.ischeck
            })
          } else {
            this.selectall = false
          }
        }
      })
    },
    changeAall() {
      this.selectall = !this.selectall
      this.billList.map((items) => {
        if (this.selectall) {
          return (items.ischeck = true)
        } else {
          return (items.ischeck = false)
        }
      })
    },
    confirmPrinting() {
      var typeList = []
      this.billList.forEach((items) => {
        if (items.ischeck) {
          typeList.push(items.type)
        }
      })
      if (typeList.length < 1) {
        this.$message.warning('请选择打印类型！')
      } else {
        this.request('/foodshop/storestaff.print/printOrder', {
          order_id: this.orderId,
          type: typeList,
        }).then((res) => {
          console.log(res)
          this.closemodel()
        })
      }
    },
    closemodel() {
      this.$emit('closemodel')
    },
  },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.payConfirm_alert_wrapper {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  .title_container {
    width: 100%;
    height: 100 / @rem * 1rem;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 40 / @rem * 1rem;
    .title_font {
      font-size: 32 / @rem * 1rem;
      font-weight: bold;
      color: #222222;
    }
    .leftempty_box {
      width: 20 / @rem * 1rem;
      height: 20 / @rem * 1rem;
    }
    .closeicon {
      cursor: pointer;
      width: 20 / @rem * 1rem;
      height: 20 / @rem * 1rem;
      display: flex;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .alert_content_wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 45 / @rem * 1rem;
    box-sizing: border-box;
    .billList_content {
      width: 100%;
      border: 2 / @rem * 1rem solid #f0f0f0;
      margin-top: 30 / @rem * 1rem;
      border-bottom: 0px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      .bill_items {
        width: 100%;
        height: 60 / @rem * 1rem;
        display: flex;
        align-items: center;
        border-bottom: 2 / @rem * 1rem solid #f0f0f0;
        box-sizing: border-box;
        .select_content {
          margin: 0 20 / @rem * 1rem;
          .iconbox {
            width: 28 / @rem * 1rem;
            height: 28 / @rem * 1rem;
            display: flex;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .no_select {
            width: 28 / @rem * 1rem;
            height: 28 / @rem * 1rem;
            border: 2 / @rem * 1rem solid #d8dada;
            border-radius: 50%;
          }
        }
        .billname {
          font-size: 24 / @rem * 1rem;
          font-weight: 500;
          color: #666666;
        }
      }
    }
    .selectall_content {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 30 / @rem * 1rem;
      margin-bottom: 20 / @rem * 1rem;
      .iconbox {
        width: 26 / @rem * 1rem;
        height: 26 / @rem * 1rem;
        display: flex;
        margin: 0 5 / @rem * 1rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .select_all_border {
        width: 26 / @rem * 1rem;
        height: 26 / @rem * 1rem;
        background: #ffffff;
        border: 2 / @rem * 1rem solid #ececec;
        margin: 0 5 / @rem * 1rem;
        border-radius: 4 / @rem * 1rem;
      }
      .select_all_text {
        font-size: 22 / @rem * 1rem;
        font-weight: 500;
        color: #9a9a9a;
      }
    }
  }
  .confirm_bar {
    cursor: pointer;
    width: 100%;
    height: 75 / @rem * 1rem;
    line-height: 75 / @rem * 1rem;
    text-align: center;
    background-color: #00ccb4;
    font-size: 28 / @rem * 1rem;
    font-weight: bold;
    color: #ffffff;
  }
}
</style>
