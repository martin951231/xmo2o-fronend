<template>
  <div>
    <div class="items_content">
      <div class="mainCourse_info">
        <div class="foodname_count">
          <div class="foode_name">
            <div class="name">
              {{ goods.name }}
            </div>
            <span v-if="goods.is_package_goods && pageType == 'order'" class="verific_num">{{
              goods.verific_num && goods.verific_num != 0 ? L('已核销X1份', { X1: goods.verific_num }) : L('待核销')
            }}</span>
          </div>
          <div class="count">x{{ goods.num }}</div>
        </div>
        <div class="food_totalprice">{{ L('￥') }}{{ goods.total_price }}</div>
      </div>
      <div class="only_straff" v-if="goods.is_staff">
        <span>{{ L('由店员下单') }}</span>
      </div>
      <div class="isMust" v-if="goods.is_must">
        <span>{{ L('必点') }}</span>
      </div>
      <div class="spec_info">{{ goods.spec }}</div>
      <div class="accessory_dish" v-if="goods.spec_sub">
        <div class="accessory_tips">
          <span>
            {{ goods.is_package_goods ? L('菜品') : L('附') }}
          </span>
        </div>
        <div class="accessory_dish_info">{{ goods.spec_sub }}</div>
      </div>
    </div>
    <div class="return_img" v-if="refund_goods">
      <img src="../../../../../assets/storestaff/return_dishes.png" alt="" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    goods: {
      type: [String, Object],
      default: '',
    },
    refund_goods: {
      type: Boolean,
      default: false,
    },
    pageType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.items_content {
  width: 100%;
  border-bottom: dashed 1px #eaeaea;
  box-sizing: border-box;
  padding: 30 / @rem * 1rem 0;
  .mainCourse_info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .foodname_count {
      display: flex;
      align-items: center;
      .foode_name {
        width: 320 / @rem * 1rem;
        display: flex;
        align-items: center;
        .name {
          max-width: 240 / @rem * 1rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          box-sizing: border-box;
          font-weight: bold;
          font-size: 24 / @rem * 1rem;
          color: #333333;
        }
        .verific_num {
          padding: 0 6px;
          margin: 0 6px;
          white-space: nowrap;
          color: #ffae00;
          border: 1px solid #ffae00;
          height: 30 / @rem * 1rem;
          font-size: 14 / @rem * 1rem;
          text-align: center;
          border-radius: 15 / @rem * 1rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
        }
      }
      .count {
        font-size: 24 / @rem * 1rem;
        color: #999999;
      }
    }
    .food_totalprice {
      font-size: 24 / @rem * 1rem;
      font-weight: bold;
      color: rgba(102, 102, 102, 1);
    }
  }
  .only_straff {
    width: 80 / @rem * 1rem;
    height: 27 / @rem * 1rem;
    border: 2 / @rem * 1rem solid #91a9bc;
    border-radius: 14 / @rem * 1rem;
    margin-right: 5 / @rem * 1rem;
    position: relative;
    span {
      position: absolute;
      width: 200%;
      height: 200%;
      white-space: nowrap;
      text-align: center;
      top: -50%;
      left: -50%;
      font-size: 28 / @rem * 1rem;
      font-weight: bold;
      color: #91a9bc;
      transform: scale(0.5);
    }
  }
  .spec_info {
    width: 100%;
    font-size: 22 / @rem * 1rem;
    font-weight: 500;
    color: #666666;
    line-height: 22 / @rem * 1rem;
    margin-top: 10 / @rem * 1rem;
  }
  .isMust {
    width: 48 / @rem * 1rem;
    height: 24 / @rem * 1rem;
    background: #ffa40d;
    border-radius: 4 / @rem * 1rem;
    position: relative;
    span {
      position: absolute;
      width: 200%;
      height: 200%;
      top: -50%;
      left: -50%;
      font-size: 36 / @rem * 1rem;
      text-align: center;
      line-height: 48 / @rem * 1rem;
      color: rgba(255, 255, 255, 1);
      transform: scale(0.5);
    }
  }
  .accessory_dish {
    width: 100%;
    display: flex;
    margin-top: 15 / @rem * 1rem;
    align-items: flex-start;
    .accessory_tips {
      padding: 0 4px;
      font-size: 18 / @rem * 1rem;
      line-height: 24 / @rem * 1rem;
      background: #00ccb4;
      color: rgba(255, 255, 255, 1);
      border-radius: 4 / @rem * 1rem;
      box-sizing: border-box;
      white-space: nowrap;
    }
    .accessory_dish_info {
      width: 100%;
      font-size: 18 / @rem * 1rem;
      line-height: 22 / @rem * 1rem;
      color: rgba(102, 102, 102, 1);
      margin-left: 10 / @rem * 1rem;
    }
  }
}
.return_img {
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  right: 0;
  img {
    width: 80 / @rem * 1rem;
    height: 80 / @rem * 1rem;
    margin-right: 70 / @rem * 1rem;
  }
}
</style>
