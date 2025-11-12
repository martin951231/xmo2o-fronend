<template>
  <div class="change_diners_wrapper" v-if="info">
    <div class="title_container">{{ L('更改就餐人数') }}</div>
    <div class="bottom_container">
      <div class="table_info">
        <div class="texttips">{{ L('操作台号') }}：</div>
        <div class="infovalue">{{ info.table_info.table_name }}</div>
      </div>
      <div class="dinersnum_operation">
        <div class="texttips">{{ L('就餐人数') }}：</div>
        <div class="rightbtn_container">
          <div class="reduce_box" @click="reduceNum()">
            <img src="../../../../../assets/storestaff/re.png" alt="" />
          </div>
          <div class="numbox">
            <div class="centerbox">{{ info.order.book_num }}</div>
          </div>
          <div class="add_box" @click="addNum()"><img src="../../../../../assets/storestaff/ad.png" alt="" /></div>
        </div>
      </div>
      <div class="btn_container">
        <div class="ccl_btn" @click="closemodel()">{{ L('取消') }}</div>
        <div class="cfm_btn" @click="confirmChange()">{{ L('确认') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableInfo: Object,
  },
  data() {
    return {
      info: '',
    //   最小就餐人数 优化可以减少就餐人数
      minBookNum: 1
    }
  },
  created() {
    // 当前的就餐人数 this.tableInfo
    this.info = JSON.parse(JSON.stringify(this.tableInfo))
  },
  methods: {
    closemodel() {
      this.$emit('closemodel')
    },
    reduceNum() {
        let minBookNum = this.minBookNum || this.tableInfo.order.book_num
      if (this.info.order.book_num > minBookNum) {
        this.info.order.book_num--
      }
    },
    addNum() {
      if (this.info.order.book_num < 255) {
        this.info.order.book_num++
      }
    },
    confirmChange() {
      this.request('/foodshop/storestaff.order/changePeopleNum', {
        order_id: this.$store.state.storestaff.nowOrderId,
        number: this.info.order.book_num,
      }).then((res) => {
        if (res.msg == this.L('修改成功')) {
          this.$emit('changedinersNum', this.info)
          this.closemodel()
        } else {
          alert(res.msg)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.change_diners_wrapper {
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
    font-size: 32 / @rem * 1rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: #222222;
    line-height: 100 / @rem * 1rem;
    text-align: center;
  }
  .bottom_container {
    width: 100%;
    background-color: #ffffff;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 29 / @rem * 1rem;
    .table_info {
      width: 100%;
      height: 80 / @rem * 1rem;
      display: flex;
      align-items: center;
      border-bottom: 1 / @rem * 1rem solid #ededed;
      .texttips {
        font-size: 22 / @rem * 1rem;
        font-weight: 500;
        color: #666666;
      }
      .infovalue {
        font-size: 22 / @rem * 1rem;
        font-weight: 500;
        color: #666666;
      }
    }
    .dinersnum_operation {
      font-size: 24 / @rem * 1rem;
      font-weight: 500;
      color: #666666;
      display: flex;
      align-items: center;
      margin-top: 25 / @rem * 1rem;
      .rightbtn_container {
        display: flex;
        align-items: center;
        .reduce_box {
          cursor: pointer;
          width: 40 / @rem * 1rem;
          height: 40 / @rem * 1rem;
          display: flex;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .numbox {
          width: 185 / @rem * 1rem;
          height: 46 / @rem * 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border-radius: 23 / @rem * 1rem;
          border: solid 2 / @rem * 1rem #ebebeb;
          margin: 0 8 / @rem * 1rem;
          .centerbox {
            text-align: center;
            font-size: 22 / @rem * 1rem;
            font-weight: bold;
            color: #333333;
          }
        }

        .add_box {
          cursor: pointer;
          width: 40 / @rem * 1rem;
          height: 40 / @rem * 1rem;
          display: flex;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .btn_container {
      width: 100%;
      height: 140 / @rem * 1rem;
      margin-top: 90 / @rem * 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .ccl_btn {
        width: 166 / @rem * 1rem;
        height: 60 / @rem * 1rem;
        background-color: #dddddd;
        border-radius: 10 / @rem * 1rem;
        line-height: 60 / @rem * 1rem;
        text-align: center;
        font-size: 24 / @rem * 1rem;
        font-weight: bold;
        color: #666666;
        cursor: pointer;
      }
      .cfm_btn {
        width: 166 / @rem * 1rem;
        height: 60 / @rem * 1rem;
        background-color: #00cbb3;
        border-radius: 10 / @rem * 1rem;
        line-height: 60 / @rem * 1rem;
        text-align: center;
        font-size: 24 / @rem * 1rem;
        font-weight: bold;
        color: #ffffff;
        cursor: pointer;
        margin-left: 15 / @rem * 1rem;
      }
    }
  }
}
</style>
