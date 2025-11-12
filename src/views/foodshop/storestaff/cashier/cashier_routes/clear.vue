<template>
  <div class="clear_wrapper">
    <div class="left_wrapper">
      <div class="headertop_content">
        <div class="pagetitle">{{ L('沽清列表') }}</div>
      </div>
      <div class="headerbottom_content">
        <div class="white_info_wrapper">
          <div class="clear_right_content">
            <div class="clear_title">
              <div class="clear_numeinfo">{{ L('已沽清种类') }}：{{ dishscrollList.length }}</div>
              <div class="checkall_btn" v-if="dishscrollList.length > 0" @click="allmakefull()">
                {{ L('全部置满') }}
              </div>
            </div>
            <div class="clear_slider_wrapper">
              <div class="clear_slider_container">
                <div class="leftdishList">
                  <div class="dish_items" v-for="(items, index) in dishscrollList" :key="index">
                    <div class="leftdishname">{{ items.product_name }}</div>
                    <div class="false_btn" @click="makeFull(items)">{{ L('置满') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容主体 -->
    <div class="right_wrapper">
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

        <div class="body_cashier_container" v-if="!multiFlag">
          <!--                                                      菜品分类                                                    -->
          <div class="tablesize_container">
            <div class="switchbox" :class="!foodnavshow ? 'hiddenbox' : ''">
              <div class="leftslidericon">
                <div class="iconfont circlebox" @click="slidetoright()">
                  <img src="../../../../../assets/storestaff/lefts.png" alt="" />
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
                        <!-- <span class="table_count" style="position: absolute;">{{ item }}</span> -->
                      </div>
                      <div class="bottomborder"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rightslidericon">
                <div class="iconfont circlebox" @click="slidetoleft()">
                  <img src="../../../../../assets/storestaff/rights.png" alt="" />
                </div>
              </div>
            </div>

            <!-- 搜索菜品 -->
            <div class="search_content" :class="foodnavshow ? '' : 'searching_box'">
              <div class="searchiconbox" @click="searchFood()">
                <img src="../../../../../assets/storestaff/search.png" alt="" />
              </div>
              <input
                v-if="!foodnavshow"
                ref="selfinput"
                class="self_input"
                v-model="searchText"
                type="text"
                placeholder="请输入菜品名称"
                @input="keyWordsearch()"
              />
              <div class="forkiconbox" v-if="!foodnavshow" @click="forkclk()">
                <img src="../../../../../assets/storestaff/fork.png" alt="" />
              </div>
            </div>
          </div>
          <!--                                                      桌台列表                                                    -->
          <a-spin :spinning="loadingdata" :indicator="indicator" size="large" style="height: 75%" class="changecolor" />
          <div v-if="!loadingdata" class="tableList_wrapper">
            <template v-if="!isSearchText">
              <div class="table_list_sliderbox" v-if="goods_list && goods_list.length">
                <template v-for="(items, indexs) in goods_list">
                  <goodsItem :goods="items" :key="indexs" :isClear="true" @checkmenuFood="checkmenuFood"></goodsItem>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="table_list_sliderbox flex-direction" v-if="goods_list && goods_list.length">
                <div class="goods_list_wrap">
                  <div class="goods_list_title">{{ L('菜品') }}</div>
                  <div class="goods_list">
                    <template v-for="(items, indexs) in goods_list">
                      <goodsItem
                        v-if="!items.is_package_goods"
                        :goods="items"
                        :key="indexs"
                        :isClear="true"
                        @checkmenuFood="checkmenuFood"
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
                        :isClear="true"
                        @checkmenuFood="checkmenuFood"
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
        <multiSpecificationEstimation @selectpro="selectpro" :multiSpecificationInfo="multiSpecificationInfo" @cancelValuation="cancelValuation" @multiSpecificationEstimation="multiSpecificationEstimation" v-if="multiFlag"/>
      </div>
    </div>

    <!-- 警告弹框 -->
    <a-modal
      v-model="warningShow"
      :destroyOnClose="true"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      width="30%"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
    >
      <div class="alert_wrapper">
        <warningModel
          :textTips="!is_specification && multiInfo && multiInfo.nowpriceinfo.stock_num == 0?L('是否确定置满'):L('是否确定沽清') + '？'"
          :modelTitle="!is_specification && multiInfo && multiInfo.nowpriceinfo.stock_num == 0?L('置满'):L('沽清')"
          @comfirmfnc="clearFood"
          @closemodel="closeSelectord"
        ></warningModel>
      </div>
    </a-modal>
  </div>
</template>

<script>
import warningModel from '../components/warningModel.vue' //警告弹框
import TWEEN from '@tweenjs/tween.js'
import goodsItem from '../components/goodsItem.vue'
import multiSpecificationEstimation from '../components/multiSpecificationEstimation.vue'//多规格估清弹出框
export default {
  components: {
    warningModel,
    goodsItem,
    multiSpecificationEstimation
  },
  data() {
    return {
      dishscrollList: [],
      animateshow: false, //动画类名
      loadingdata: true, //加载动画开关
      indicator: <a-icon type="loading-3-quarters" font-size="30px" spin />,

      tableCurrent: 0, //筛选菜品分类
      listenopen: false, //滑动相关

      warningShow: false,

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
      selectFoodId: '',
      isSearchText: false,
      //开启或者关闭过规格估清详情
      multiFlag: false,
      //多规格详情
      multiSpecificationInfo:null,
      //是否为多规格
      is_specification: false,
      //多规格估清数据
      multiInfo: null,
    }
  },
  created() {
    this.$emit('getcurrent', 'clear')
    this.getAllfood() //菜单信息
    this.geteditStockList() //获取沽清列表
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
  mounted() {
    setTimeout(() => {
      this.sliderwidth = window.getComputedStyle(this.$refs.sliderbox).width.replace('px', '')
      this.slidercontentwidth = window.getComputedStyle(this.$refs.slidercontent).width.replace('px', '')
      if (this.foodMenu) {
        this.screenFoodtype(0)
      }
    }, 200)
  },
  methods: {
    //多规格估清确认按钮
    multiSpecificationEstimation(info){
      // console.log(info);
      this.multiInfo = info;
      //是否 为全部沽清
      this.is_specification = info.is_show;
      this.warningShow = true;
    },
    //多规格估清取消按钮
    cancelValuation(){
      this.multiFlag = false;
    },
    //点击规格时触发
    selectpro(info){
      // console.log('点击规格时触发--规格id',info.index);
      // console.log('点击规格时触发--规格库存',info.stock_num);
    },
    // 获取菜单
    getAllfood() {
      this.loadingdata = true
      this.request('/foodshop/storestaff.goods/goodsListTree', { is_clear_stock: 1 }).then((res) => {
        this.loadingdata = false
        if (res.length > 0) {
          this.foodMenu = res
          this.screenFoodtype(this.tableCurrent)
        } else {
          this.foodMenu = ''
        }
      })
    },

    // 左侧沽清列表
    geteditStockList() {
      this.request('/foodshop/storestaff.goods/clearGoodsList').then((res) => {
        this.searchText = ''
        this.foodnavshow = true
        this.dishscrollList = res
      })
    },

    allmakefull() {
      var foodidList = []
      this.dishscrollList.forEach((items) => {
        foodidList.push(items.product_id)
      })
      this.request('/foodshop/storestaff.goods/editStock', {
        goods_id: foodidList,
        type: 1,
      }).then((res) => {
        this.$nextTick(() => {
          this.geteditStockList()
          this.getAllfood()
        })
      })
    },

    // 单个菜品点击
    checkmenuFood(info) {
      // info.has_spec 去掉是否为多规格字段
      if(info.has_spec){
        this.selectFoodId = info.product_id
        this.multiSpecificationInfo = info;
        this.multiFlag = true;
        return
      }
      if ((info.stock_num < 1 && info.stock_num != -1) || info.has_format || info.is_package_goods) {
        return
      } else {
        this.selectFoodId = info.product_id
        this.warningShow = true
      }
    },

    makeFull(item) {
      //获取选中的数据中是否为多规格的商品
      this.request('/foodshop/storestaff.goods/editStock', {
        goods_id: [item.product_id],
        type: 1,
      }).then((res) => {
        this.$nextTick(() => {
          this.geteditStockList()
          this.getAllfood()
        })
      })
    },

    // 弹框取消
    closeSelectord() {
      this.warningShow = false
    },

    // 弹框确定
    clearFood() {
      //为沽清某个多规格执行
      if(!this.is_specification && this.multiFlag){
        this.request('/foodshop/storestaff.goods/editStock', {
        goods_id: [this.selectFoodId],
        index:  this.multiInfo.nowspec,
        type: this.multiInfo && this.multiInfo.nowpriceinfo.stock_num == 0?1:0,
      }).then((res) => {
        this.$nextTick(() => {
          this.geteditStockList()
          this.getAllfood()
          this.multiFlag = false;
        })
      })
      this.warningShow = false
      }else{
        //单规格估清
        this.request('/foodshop/storestaff.goods/editStock', {
        goods_id: [this.selectFoodId],
        type: 0,
      }).then((res) => {
        this.$nextTick(() => {
          this.geteditStockList()
          this.getAllfood()
          this.multiFlag = false;
        })
      })
      this.warningShow = false
      }
      
    },

    // 添加刷新动画
    addanimate() {
      this.animateshow = true
      this.searchText = ''
      this.isSearchText = false
      this.foodnavshow = true
      this.getAllfood()
      setTimeout(() => {
        this.animateshow = false
      }, 500)
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
      this.isSearchText = true
      if (this.searchText != '') {
        this.request('/foodshop/storestaff.goods/goodsListTree', {
          keyword: this.searchText,
          is_clear_stock: 1,
        }).then((res) => {
          this.loadingdata = true
          this.loadingdata = false
          this.goods_list = res
        })
      }
    },

    forkclk() {
      this.searchText = ''
      this.foodnavshow = true
      this.isSearchText = false
      this.getAllfood()
    },

    //桌台点击
    screenFoodtype(idx) {
      this.tableCurrent = idx
      this.foodMenu.forEach((items, index) => {
        if (index == idx) {
          this.goods_list = items.goods_list
        }
      })
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

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.clear_wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  user-select: none;
  .left_wrapper {
    width: 635 / @rem * 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    .headertop_content {
      width: 100%;
      height: 12%;
      padding-left: 20 / @rem * 1rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .pagetitle {
        font-size: 30 / @rem * 1rem;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 20 / @rem * 1rem;
      }
    }
    .headerbottom_content {
      width: 100%;
      height: 86%;
      box-sizing: border-box;
      padding-left: 20 / @rem * 1rem;
      display: flex;
      flex-direction: column;
      .white_info_wrapper {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        border-radius: 10 / @rem * 1rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        .clear_right_content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .clear_title {
            width: 100%;
            height: 11%;
            padding: 0 20 / @rem * 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #ffffff;
            .clear_numeinfo {
              font-size: 28 / @rem * 1rem;
              font-weight: bold;
              color: #343434;
            }
            .checkall_btn {
              width: 120 / @rem * 1rem;
              height: 48 / @rem * 1rem;
              background: #18c6b6;
              font-size: 22 / @rem * 1rem;
              line-height: 48 / @rem * 1rem;
              font-weight: 500;
              text-align: center;
              color: #ffffff;
              border-radius: 6 / @rem * 1rem;
              cursor: pointer;
            }
          }
          .clear_slider_wrapper {
            width: 100%;
            height: 90%;
            overflow-x: hidden;
            overflow-y: scroll;
            position: relative;
            background: #f7f7f7;
            .clear_slider_container {
              width: 100%;
              position: absolute;
              .leftdishList {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0 20 / @rem * 1rem;
                box-sizing: border-box;
                .dish_items {
                  width: 100%;
                  height: 80 / @rem * 1rem;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  overflow: hidden;
                  border-bottom: 1 / @rem * 1rem dashed #eaeaea;
                  .leftdishname {
                    width: 75%;
                    font-size: 24 / @rem * 1rem;
                    font-weight: 500;
                    color: #343434;
                    display: -webkit-box;
                    text-align: left;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                  }
                  .false_btn {
                    font-size: 24 / @rem * 1rem;
                    font-weight: 500;
                    color: #19c6b6;
                    margin-right: 40 / @rem * 1rem;
                    cursor: pointer;
                  }
                }
              }
            }
          }

          .clear_slider_wrapper::-webkit-scrollbar {
            width: 0px;
          }
        }
      }
    }
  }

  .right_wrapper {
    width: calc(100% - 635 / @rem * 1rem);
    height: 100%;
    box-sizing: border-box;
    padding: 0 20 / @rem * 1rem;
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
  }
}
</style>
