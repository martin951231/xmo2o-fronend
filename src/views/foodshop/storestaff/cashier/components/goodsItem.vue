<template>
  <div v-if="goods" class="table_card_items" :class="goods.is_package_goods ? 'package_goods_item' : 'goods_item'">
    <div class="card_container" v-if="!goods.is_package_goods">
      <div class="topbadge" v-if="goods.counts > 0">
        <div>{{ goods.counts }}</div>
      </div>
      <div class="topcontent" @click="checkmenuFood(goods)">
        <img class="goods-image" style="object-fit: fill;" :src="goods.product_image" />
        <div class="content">
          <div class="tableinfo">
            <div class="tablenumber">
              {{ goods.product_abbreviation ? goods.product_abbreviation : goods.product_name }}
            </div>
          </div>
          <div class="food_price">
            <div class="left" style="flex: 1;">{{ L('￥') }}{{ goods.product_price }} <span v-if="(goods.has_format || goods.has_spec) && isClear">起</span> </div>
            <div class="status_text">
              <div class="acs_food_tips" v-if="goods.is_subsidiary_goods">
                <span>{{ L('附') }}</span>
              </div>
              <div class="acs_food_tips" v-if="goods.only_staff">
                <span>{{ L('店') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
       <!--  || ((goods.has_format) && isClear) -->
      <div
        class="card_shadow"
        v-if="
          (goods.stock_num < goods.mini_num && goods.stock_num != -1) ||
          goods.is_sell_out
        "
      ></div>
      <div
        class="shortSale_tips"
        v-if="(goods.stock_num < goods.mini_num && goods.stock_num != -1) || goods.is_sell_out"
      >
        <img src="@/assets/storestaff/shortSale.png" alt="" />
      </div>
    </div>
    <!-- 套餐 -->
    <div v-else class="card_container package_goods_container" @click="checkmenuFood(goods)">
      <div class="topbadge" v-if="goods.counts > 0">
        <div>{{ goods.counts }}</div>
      </div>
      <div class="package_name_price">
        <span class="package_name">{{ goods.product_name }}</span>
        <span class="package_price">￥{{ goods.product_price }}</span>
      </div>
      <div class="subsidiary_piece" v-if="goods.subsidiary_piece && goods.subsidiary_piece.length">
        <template v-for="(subsidiary_item, subsidiary_index) in goods.subsidiary_piece">
          <div
            :key="subsidiary_index"
            v-if="subsidiary_item.goods && subsidiary_item.goods.length && subsidiary_index < 3"
            class="subsidiary_piece_wrap"
          >
            <span class="subsidiary_piece_name">
              {{ subsidiary_item.name }}
            </span>
            <div class="subsidiary_goods_wrap">
              <span
                v-for="(subsidiary_goods_item, subsidiary_goods_index) in subsidiary_item.goods"
                :key="subsidiary_goods_index"
                class="subsidiary_goods"
              >
                {{ subsidiary_goods_item.product_name }}
              </span>
            </div>
          </div>
        </template>
      </div>
      <div class="card_shadow" v-if="isClear"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goods: {
      type: [String, Object],
      default: '',
    },
    ORDER_ID: {
      type: [String, Number],
      default: '',
    },
    isClear: {
      // 是否是估清
      type: Boolean,
      default: false,
    },
    otherpage: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    // 单个菜品点击
    checkmenuFood(info) {
      if (this.isClear) {
        this.$emit('checkmenuFood', info)
      } else {
        // info.has_spec 去掉是否为多规格字段
        if (info.has_format || info.has_spec || info.is_subsidiary_goods || info.is_package_goods) {
          this.$router.push({
            name: 'foodDetails',
            query: {
              orderId: this.ORDER_ID,
              productId: info.product_id,
              otherpage: this.otherpage,
              goodsType: info.is_package_goods ? 2 : 1,
            },
          })
        } else {
          this.$store.commit('changenowSelectgooodsNum', '')
          var checkObj = {}
          checkObj.productId = info.product_id
          checkObj.productName = info.product_name
          checkObj.productPrice = info.product_price
          checkObj.count = info.mini_num == 0 ? '1' : info.mini_num
          checkObj.uniqueness_number = info.product_id
          checkObj.productParam = []
          checkObj.host_goods_id = 0
          this.$store.commit('changenowSelectgooodsNum', checkObj.uniqueness_number)
          this.$nextTick(() => {
            this.$emit('watchmenu', checkObj)
          })
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.table_card_items {
  padding: 0 15  / @rem * 1rem;
  width: 25%;
  height: 230 / @rem * 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15 / @rem * 1rem 0;
  box-sizing: border-box;
  .card_container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10 / @rem * 1rem;
    box-sizing: border-box;
    background-color: #ffffff;
    cursor: pointer;
    .topbadge {
      width: 32 / @rem * 1rem;
      height: 32 / @rem * 1rem;
      position: absolute;
      background: #ff3434;
      border-radius: 50%;
      z-index: 10;
      top: -12 / @rem * 1rem;
      right: -12 / @rem * 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        font-size: 16 / @rem * 1rem;
        font-weight: bold;
        color: #ffffff;
      }
    }
    .topcontent {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .content{
        padding: 4 / @rem * 1rem 8 / @rem * 1rem;
      }
      .tableinfo {
        width: 100%;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        .tablenumber {
          width: 100%;
          font-size: 20 / @rem * 1rem;
          font-weight: bold;
          color: #333333;
          overflow: hidden;
          word-break: break-all;
          text-overflow: ellipsis; 
          display: -webkit-box; // 弹性伸缩盒
          -webkit-box-orient: vertical; // 设置伸缩盒子元素排列方式
          -webkit-line-clamp: 1;
          z-index: 3;
        }
      }
      .minCounts {
        height: 30 / @rem * 1rem;
        font-size: 22 / @rem * 1rem;
        width: 100%;
        color: #666666;
      }
      .food_price {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          font-size: 20 / @rem * 1rem;
          color: #666666;
        }
        .only_straff {
          width: 81 / @rem * 1rem;
          height: 27 / @rem * 1rem;
          border: 2 / @rem * 1rem solid #91a9bc;
          border-radius: 14 / @rem * 1rem;
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
      }
    }
    .status_text {
      display: flex;
      align-items: center;
      justify-content: end;
      .acs_food_tips {
        width: 24 / @rem * 1rem;
        height: 24 / @rem * 1rem;
        border: 1 / @rem * 1rem solid #00cbb3;
        box-sizing: border-box;
        border-radius: 4 / @rem * 1rem;
        position: relative;
        background-color: #ffffff;
        margin-left: 4 / @rem * 1rem;
        span {
          display: block;
          font-size: 15 / @rem * 1rem;
          font-weight: 500;
          color: #00cbb3;
          text-align: center;
        }
      }
      .food_fullname {
        width: 130 / @rem * 1rem;
        height: 60 / @rem * 1rem;
        line-height: 60 / @rem * 1rem;
        font-size: 24 / @rem * 1rem;
        margin-left: 10 / @rem * 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .card_shadow {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.2);
      z-index: 5;
    }

    .shortSale_tips {
      position: absolute;
      width: 40 / @rem * 1rem;
      height: 40 / @rem * 1rem;
      border-radius: 50%;
      right: 0;
      top: 0;
      z-index: 1;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.goods_item {
  width: 20%;
  padding: 0 15 / @rem * 1rem;
  box-sizing: border-box;
  .card_container {
    justify-content: space-between;
  }
}
.package_goods_item {
  width: 50%;
  padding: 0 15 / @rem * 1rem;
  box-sizing: border-box;
  .package_goods_container {
    padding: 15 / @rem * 1rem 20 / @rem * 1rem;
    width: 100%;
    box-sizing: border-box;
    .package_name_price {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 26 / @rem * 1rem;
      color: #333333;
      .package_name {
        margin-right: 4px;
        flex: 1;
        font-weight: bold;
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis; 
        display: -webkit-box; // 弹性伸缩盒
        -webkit-box-orient: vertical; // 设置伸缩盒子元素排列方式
        -webkit-line-clamp: 2;
      }
      .package_price {
        white-space: nowrap;
      }
    }
    .subsidiary_piece {
      width: 100%;
      .subsidiary_piece_wrap {
        margin-top: 10 / @rem * 1rem;
        display: flex;
        align-items: center;
        font-size: 22 / @rem * 1rem;
        .subsidiary_piece_name {
          white-space: nowrap;
          color: #000000;
        }
        .subsidiary_goods_wrap {
          flex: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          .subsidiary_goods {
            margin-left: 15 / @rem * 1rem;
          }
        }
      }
    }
  }
}
.goods-image{
  width: 100%;
  height: 160 / @rem * 1rem;
  border-radius: 10 / @rem * 1rem 10 / @rem * 1rem 0 0;
}
</style>
