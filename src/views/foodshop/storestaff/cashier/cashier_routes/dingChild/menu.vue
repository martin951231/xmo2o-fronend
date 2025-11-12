<template>
  <div class="menu_wrapper">
    <div class="header_info_container">
      <div class="header_left_content">
        <div class="header_title">{{ L('菜单') }}</div>
      </div>
      <!-- 刷新 -->
      <div class="refresh_box" :class="animateshow ? 'rotatecls' : ''" @click="addanimate()">
        <a-icon type="reload" class="iconfont" />
      </div>
    </div>

    <div class="body_cashier_container">
      <!--         菜品分类         -->
      <div class="tablesize_container">
        <div class="switchbox" :class="!foodnavshow ? 'hiddenbox' : ''">
          <div class="leftslidericon">
            <div class="iconfont circlebox" @click="slidetoright()">
              <img src="../../../../../../assets/storestaff/lefts.png" alt="" />
            </div>
          </div>
          <div class="center_slider_container" id="slidercontent" ref="slidercontent">
            <!-- <div class="sliderList_content" ref="sliderbox" :style="'transform:translateX(' + leftscroll + 'px)'" @mousewheel="changeslidernum"> -->
            <div class="sliderList_content" ref="sliderbox" @mousewheel="changeslidernum">
              <div
                class="table_items"
                v-for="(items, index) in foodMenu"
                :key="index"
                :class="tableCurrent == index ? 'table_items_active' : ''"
                @click="screenFoodtype(index)"
              >
                <div class="items_content">
                  <div class="table_name" style="position: relative">
                    <span>{{ items.cat_name }}</span>
                    <span class="table_count" style="position: absolute" v-if="items.counts > 0">{{
                      items.counts
                    }}</span>
                  </div>
                  <div class="bottomborder"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="rightslidericon">
            <div class="iconfont circlebox" @click="slidetoleft()">
              <img src="../../../../../../assets/storestaff/rights.png" alt="" />
            </div>
          </div>
        </div>

        <!-- 搜索菜品 -->
        <div class="search_content" :class="foodnavshow ? '' : 'searching_box'">
          <div class="searchiconbox" @click="searchFood()">
            <img src="../../../../../../assets/storestaff/search.png" alt="" />
          </div>
          <input
            v-if="!foodnavshow"
            onkeyup="this.value=this.value.replace(/\s+/g,'')"
            ref="selfinput"
            class="self_input"
            v-model="searchText"
            type="text"
            :placeholder="L('请输入菜品名称')"
            @input="keyWordsearch()"
          />
          <div class="forkiconbox" v-if="!foodnavshow" @click="forkclk()">
            <img src="../../../../../../assets/storestaff/fork.png" alt="" />
          </div>
        </div>
      </div>
      <!--   菜单列表    -->
      <a-spin :spinning="loadingdata" :indicator="indicator" size="large" style="height: 75%" class="changecolor" />
      <div v-if="!loadingdata" class="tableList_wrapper">
        <template v-if="!isSearchText">
          <div class="table_list_sliderbox">
            <template v-for="(items, indexs) in goods_list">
              <goodsItem
                :goods="items"
                :key="indexs"
                :ORDER_ID="ORDER_ID"
                @watchmenu="foodClick"
                :otherpage="otherpage"
              ></goodsItem>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="table_list_sliderbox flex-direction" v-if="goods_list.length">
            <div class="goods_list_wrap">
              <div class="goods_list_title">{{ L('菜品') }}</div>
              <div class="goods_list">
                <template v-for="(items, indexs) in goods_list">
                  <goodsItem
                    v-if="!items.is_package_goods"
                    :goods="items"
                    :key="indexs"
                    :ORDER_ID="ORDER_ID"
                    @watchmenu="foodClick"
                    :otherpage="otherpage"
                  ></goodsItem>
                </template>
              </div>
            </div>
            <div class="goods_list_wrap">
              <div class="goods_list_title">{{ L('套餐') }}</div>
              <div class="goods_list">
                <template v-for="items in goods_list">
                  <goodsItem
                    v-if="items.is_package_goods"
                    :goods="items"
                    :key="items.product_id"
                    :ORDER_ID="ORDER_ID"
                    @watchmenu="foodClick"
                    :otherpage="otherpage"
                  ></goodsItem>
                </template>
              </div>
            </div>
          </div>
        </template>
        <div class="emptyTips" v-if="!goods_list">
          <div>{{ L('暂无菜品') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TWEEN from '@tweenjs/tween.js'
import Computer from '../../components/computer.vue' //开台
import selectOrder from '../../components/tableOrder_select.vue' //选择订单
import goodsItem from '../../components/goodsItem.vue'
export default {
  name: 'foodMenu',
  components: {
    Computer,
    selectOrder,
    goodsItem,
  },
  data() {
    return {
      ORDER_ID: '', //订单id
      animateshow: false, //动画类名
      loadingdata: true, //加载动画开关
      indicator: <a-icon type="loading-3-quarters" font-size="30px" spin />,

      tableCurrent: 0, //筛选桌台尺寸
      listenopen: false, //滑动相关

      foodnavshow: true, //控制菜单导航栏展示

      goods_list: '', //菜单数据
      foodMenu: '', // 本页数据

      slideshake: true,
      numTween: 0,
      leftscroll: 0,

      // 页面元素尺寸信息
      slidercontentwidth: '',
      sliderwidth: '',

      searchText: '', // 搜索框文字
      otherpage: '',
      isSearchText: false,
    }
  },
  watch: {
    numTween(nval, oval) {
      new TWEEN.Tween({
        number: oval,
      })
        .to(
          {
            number: nval,
          },
          100
        )
        .onUpdate((tween) => {
          this.leftscroll = tween.number.toFixed(0)
          document.getElementById('slidercontent').scrollLeft = this.leftscroll
          if (this.leftscroll - document.getElementById('slidercontent').scrollLeft > 150) {
            this.numTween = document.getElementById('slidercontent').scrollLeft
          }
        })
        .start()
      function animate() {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    },
  },
  created() {
    this.$emit('uploadLeft', { id: this.$route.query.orderId, type: 1 })
    this.ORDER_ID = this.$route.query.orderId || ''

    if (Number(this.$route.query.otherpage) == 0) {
      var showreturn = false
      this.$bus.$emit('changecurrent', this.$route.query.otherpage)
      this.otherpage = this.$route.query.otherpage
      if (this.$route.query.formState == 'addfood') {
        this.otherpage = this.$route.query.otherpage
        showreturn = true
      }

      this.$emit('titleState', {
        showstate: 'hide',
        operation: 'changeLeftone',
        formpage: this.$route.query.otherpage,
        titleText: showreturn,
      })

      this.$nextTick(() => {
        this.$emit('backfromState', this.$route.query.otherpage)
      })
    } else {
      this.otherpage = ''
      if (this.$route.query.formState == 'addfood') {
        this.$emit('titleState', { showstate: 'show', operation: 'changeLefttwo', titleText: true })
      } else {
        this.$emit('titleState', { showstate: 'show', operation: 'changeLeftone' })
      }
    }

    this.getAllfood() // 获取所有菜品信息
  },
  mounted() {
    setTimeout(() => {
      this.sliderwidth = window.getComputedStyle(this.$refs.sliderbox).width.replace('px', '')
      this.slidercontentwidth = window.getComputedStyle(this.$refs.slidercontent).width.replace('px', '')
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to.name.indexOf('foodDetails') > -1) {
      this.$store.commit('setKeepAlive', ['foodMenu'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  },
  methods: {
    uplaodMenufc(data) {
      //data.goods_list 是左侧购物车商品
      if (data.goods_list.length > 0) {
        if (this.foodMenu && this.foodMenu.length) {
          //右侧菜单列表
          this.foodMenu.forEach((x, y) => {
            x.counts = 0
            //菜单下的商品列表
            x.goods_list.forEach((m, n) => {
              m.counts = 0
              data.goods_list.forEach((items) => {
                //如果购物车和右侧菜单都不是套餐
                if(!m.is_package_goods && !items.is_package_goods && m.product_id == items.goods_id){
                  m.counts += items.num
                }
                //如果购物车和右侧菜单都是套餐并且套餐id一致
                if(m.is_package_goods && items.is_package_goods && m.product_id == items.package_id){
                  //循环菜单下套餐的组合列表
                  m.subsidiary_piece.forEach(subsidiary=>{
                    //循环套餐组合下的商品列表
                    subsidiary.goods.forEach(goods=>{
                      //查询到商品就加1
                      const goodsId = items.sub_list.find(sub=>sub.goods_id == goods.product_id)
                      if(goodsId){
                        m.counts += items.num
                      }
                    })
                  })
                }
              })
              if (m.counts > 0) {
                x.counts += m.counts
              }
            })
            this.$set(this.foodMenu, y, x)
          })
        }

      } else {
        if (this.foodMenu && this.foodMenu.length) {
          this.foodMenu.forEach((x, y) => {
            x.counts = 0
            x.goods_list.forEach((m, n) => {
              m.counts = 0
            })
            this.$set(this.foodMenu, y, x)
          })
        }
      }
      if(this.searchText && this.goods_list && this.goods_list.length) {
        // 搜索后添加商品更新数量
        this.goods_list.forEach((item,index) => {
            item.counts = 0
            if(data.goods_list.length) {
                let findArr = data.goods_list.filter(goodsItem => goodsItem.goods_id == item.product_id)
                if(findArr.length) {
                    let nums = findArr.reduce(function(prev, cur) {
                            return cur.num + prev;
                        }, 0);
                    item.counts = item.counts + nums
                }
            } 
            this.$set(this.goods_list[index],'counts',item.counts)
            this.$forceUpdate()
        })
        this.goods_list = JSON.parse(JSON.stringify(this.goods_list))
        } else {
            this.screenFoodtype(this.tableCurrent)
        }
    },
    // 获取桌台分类和桌台规格信息
    getAllfood() {
      this.loadingdata = true
      this.request('/foodshop/storestaff.goods/goodsListTree').then((res) => {
        this.loadingdata = false
        if (res.length > 0) {
          this.foodMenu = res
          this.screenFoodtype(this.tableCurrent)
          this.getShopcartInfo()
        } else {
          this.foodMenu = ''
        }
      })
    },

    // 搜索按钮操作相关
    searchFood() {
      this.foodnavshow = false
      this.$nextTick(() => {
        this.$refs.selfinput.focus()
      })
      this.goods_list = []
    },

    // 关键词搜索
    keyWordsearch() {
      if (this.searchText) {
        this.isSearchText = true
        this.request('/foodshop/storestaff.goods/goodsListTree', {
          keyword: this.searchText,
        }).then((res) => {
          this.loadingdata = true
          this.loadingdata = false
          this.goods_list = res
          this.getShopcartInfo()
        })
      }
    },

    forkclk() {
      this.searchText = ''
      this.foodnavshow = true
      this.isSearchText = false
      this.getAllfood()
    },

    screenFoodtype(idx) {
      this.tableCurrent = idx
      if (this.foodMenu && this.foodMenu.length) {
        this.foodMenu.forEach((items, index) => {
          if (index == idx) {
            if (items.goods_list && items.goods_list.length) {
              this.goods_list = []
              items.goods_list.forEach((goods_item, goods_index) => {
                this.$nextTick(() => {
                  this.$set(this.goods_list, goods_index, goods_item)
                  this.$set(this.goods_list[goods_index], 'counts', goods_item.counts)
                  this.$forceUpdate()
                })
              })
            }
          }
        })
      }
    },

    foodClick(checkObj) {
      this.$emit('foodClick', checkObj)
    },

    // 获取购物车信息
    getShopcartInfo() {
      this.request('/foodshop/storestaff.order/cartDetail', { order_id: this.$store.state.storestaff.nowOrderId }).then(
        (res) => {
          this.uplaodMenufc(res)
        }
      )
    },

    // 添加刷新动画
    addanimate() {
      this.searchText = ''
      this.isSearchText = false
      this.foodnavshow = true
      this.getAllfood()
      this.animateshow = true
      setTimeout(() => {
        this.animateshow = false
      }, 500)
    },

    // 滑动开始
    canlisten() {
      this.listenopen = true
    },

    changeslidernum(e) {
      if (this.slideshake) {
        this.slideshake = false
        if (this.numTween > -1) {
          if (e.deltaY > 0) {
            this.numTween += 150
          } else {
            this.numTween -= 150
          }
        } else {
          this.numTween = 0
        }
        this.slideshake = true
      }
    },
    slidetoleft() {
      if (this.numTween > -1) {
        this.numTween += 150
      } else {
        this.numTween = 0
      }
    },
    slidetoright() {
      if (this.numTween > -1) {
        this.numTween -= 150
      } else {
        this.numTween = 0
      }
    },
  },
}
</script>

<style scoped lang="less">
@rem: 192; //定义页面尺寸
.menu_wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .header_info_container {
    width: 100%;
    height: 12%;
    display: flex;
    justify-content: space-between;
    .header_left_content {
      display: flex;
      align-items: flex-end;
      .header_title {
        font-size: 30 / @rem * 1rem;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 20 / @rem * 1rem;
      }
    }
    .refresh_box {
      margin-top: 20 / @rem * 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 66 / @rem * 1rem;
      height: 66 / @rem * 1rem;
      border: solid 4 / @rem * 1rem #ffffff;
      border-radius: 50%;
      opacity: 0.7;
      .iconfont {
        text-align: center;
        font-size: 36 / @rem * 1rem;
        color: #ffffff;
        box-sizing: border-box;
        line-height: 1;
        cursor: pointer;
      }
    }
  }
  .body_cashier_container {
    width: 100%;
    height: 86%;
    display: flex;
    flex-direction: column;
    align-content: center;
    box-sizing: border-box;
    .changecolor {
      display: flex;
      align-items: center;
      justify-content: center;
      /deep/svg {
        color: #9f9f9f;
      }
      /deep/.ant-spin-container {
        height: 100%;
      }
    }
    .tablesize_container {
      width: 100%;
      height: 70 / @rem * 1rem;
      border-radius: 6px;
      display: flex;
      padding: 0 20 / @rem * 1rem;
      box-sizing: border-box;
      background-color: rgba(65, 65, 65, 0.8);
      align-items: center;
      overflow: hidden;
      .switchbox {
        display: flex;
        height: 100%;
        width: 100%;
        .leftslidericon {
          width: 75 / @rem * 1rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          // background-image:linear-gradient(to right, rgba(65, 65, 65, 0), rgba(65, 65, 65, 0));
          cursor: pointer;
          .circlebox {
            width: 24 / @rem * 1rem;
            height: 24 / @rem * 1rem;
            box-sizing: border-box;
            background-color: rgba(256, 256, 256, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .rightslidericon {
          width: 75 / @rem * 1rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .circlebox {
            width: 24 / @rem * 1rem;
            height: 24 / @rem * 1rem;
            box-sizing: border-box;
            background-color: rgba(256, 256, 256, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .center_slider_container {
          position: relative;
          height: 100%;
          width: 100%;
          overflow-x: scroll;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          .sliderList_content {
            height: 70 / @rem * 1rem;
            top: 0;
            left: 0;
            z-index: 10;
            user-select: none;
            position: absolute;
            transition: all 0.5s linear;
            display: flex;
            white-space: nowrap;
            align-items: center;
            .table_items {
              display: inline-block;
              height: 100%;
              margin: 0 30 / @rem * 1rem;
              .items_content {
                display: flex;
                height: 100%;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                cursor: pointer;
                .table_name {
                  width: 100%;
                  font-size: 26 / @rem * 1rem;
                  color: #b9b9b9;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  .pos_el {
                    display: block;
                  }
                  .table_count {
                    width: 60 / @rem * 1rem;
                    height: 40 / @rem * 1rem;
                    background-color: #ff3333;
                    border-radius: 10px 10px 10px 2px;
                    right: -45 / @rem * 1rem;
                    top: -15 / @rem * 1rem;
                    font-size: 32 / @rem * 1rem;
                    color: #ffffff;
                    text-align: center;
                    line-height: 40 / @rem * 1rem;
                    transform: scale(0.5);
                  }
                }
                .bottomborder {
                  width: 56 / @rem * 1rem;
                  height: 5 / @rem * 1rem;
                  background-color: transparent;
                  border-radius: 3 / @rem * 1rem;
                  margin-top: 15 / @rem * 1rem;
                }
              }
            }
            .table_items_active {
              .items_content {
                .table_name {
                  color: #ffffff;
                }
                .bottomborder {
                  background-color: #ffffff;
                }
              }
            }
          }
        }
      }

      .hiddenbox {
        opacity: 0;
        pointer-events: none;
      }

      .search_content {
        display: flex;
        align-items: center;
        margin-left: 12 / @rem * 1rem;
        height: 48 / @rem * 1rem;
        border: 0px;
        .searchiconbox {
          width: 28 / @rem * 1rem;
          height: 28 / @rem * 1rem;
          display: flex;
          margin-right: 10 / @rem * 1rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .forkiconbox {
          width: 20 / @rem * 1rem;
          height: 20 / @rem * 1rem;
          display: flex;
          margin-left: 10 / @rem * 1rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .self_input {
          background-color: transparent;
          border: none; //去除边框
          outline: none; //可以去除点击input时的border
          font-size: 24 / @rem * 1rem;
          font-weight: bold;
          width: 180 / @rem * 1rem;
          color: #ffffff;
        }
      }

      .searching_box {
        width: 330 / @rem * 1rem;
        border: 2 / @rem * 1rem solid #ffac00;
        border-radius: 40 / @rem * 1rem;
        animation: stretching 0.2s 1 linear;
        box-sizing: border-box;
        padding: 0 15 / @rem * 1rem;
      }

      @keyframes stretching {
        0% {
          width: 30 / @rem * 1rem;
          border: 2 / @rem * 1rem solid #ffac00;
          border-radius: 0;
        }

        100% {
          width: 310 / @rem * 1rem;
          border: 2 / @rem * 1rem solid #ffac00;
          border-radius: 20 / @rem * 1rem;
        }
      }
    }
    .center_slider_container::-webkit-scrollbar {
      height: 0px;
    }

    .tableList_wrapper {
      width: 100%;
      height: calc(100% - 70 / @rem * 1rem);
      display: flex;
      position: relative;
      overflow-y: scroll;
      overflow-x: hidden;
      user-select: none;
      .emptyTips {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          padding-bottom: 60 / @rem * 1rem;
          font-size: 30 / @rem * 1rem;
          font-weight: 500;
          color: #ffffff;
        }
      }
      .table_list_sliderbox {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        .goods_list_wrap {
          width: 100%;
          .goods_list_title {
            padding: 15 / @rem * 1rem;
            font-size: 26 / @rem * 1rem;
            font-weight: bold;
            color: #ffffff;
          }
          .goods_list {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
          }
        }
      }
    }

    .tableList_wrapper::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>
