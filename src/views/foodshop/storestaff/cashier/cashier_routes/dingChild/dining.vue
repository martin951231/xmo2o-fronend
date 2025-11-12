<template>
  <div class="dining_wrapper">
    <div class="header_info_container">
      <div class="screenbtn_list">
        <div
          class="screen_options"
          v-for="(items, index) in screenList"
          :key="index"
          :class="(screenCurrent == index ? 'screen_options_active' : '') + (index == 0 ? ' all' : '')"
          @click="switchscreen(index)"
        >
          <div class="iconbox">
            <span class="iconfont" v-if="index == 0"></span>
          </div>
          <div class="options_name" v-html="items.options"></div>
          <div class="people_count" v-html="'(' + items.count + ')'"></div>
        </div>
      </div>

      <!-- 刷新 -->
      <div class="refresh_box" :class="animateshow ? 'rotatecls' : ''" @click="addanimate()">
        <a-icon type="reload" class="iconfont" />
      </div>
    </div>
    <div class="body_cashier_container">
      <!--     桌台规格     -->
      <div class="tablesize_container">
        <div class="leftslidericon">
          <div class="iconfont circlebox" @click="slidetoright()">
            <img src="../../../../../../assets/storestaff/lefts.png" alt="" />
          </div>
        </div>
        <div class="center_slider_container" id="slidercontent" ref="slidercontent">
          <div class="sliderList_content" ref="sliderbox" @mousewheel="changeslidernum">
            <div
              class="table_items"
              v-for="(items, index) in table_type_list"
              :key="index"
              :class="tableCurrent == index ? 'table_items_active' : ''"
              @click="screenTablesize(index)"
            >
              <div class="items_content">
                <div class="table_name" style="position: relative">
                  <span>{{ items.name }}</span>
                  <span class="pos_el" :class="'pos_el_' + index">{{
                    items.people_num ? '(' + items.people_num + ')' : items.people_num
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
      <!--  桌台列表  -->
      <a-spin :spinning="loadingdata" :indicator="indicator" size="large" style="height: 75%" class="changecolor" />
      <div v-if="!loadingdata" class="tableList_wrapper">
       
        <div class="table_list_sliderbox">
            <a-list :grid="{ gutter: tableListGrid, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }" :data-source="table_list" style="width: 100%;padding: 0 20px;box-sizing: border-box;" v-if="table_list && table_list.length">
                <a-list-item slot="renderItem" slot-scope="items, index">
                    <div class="table_card_items">
                        <div
                        class="card_container card_container_dinging"
                        :class="[{
                            'card_container_order':items.status == 3,
                            'card_container_empty': items.status == 1,
                            'card_container_clean': items.status == 4
                        }]"
                        @click="opendining(items.status, items)"
                        >
                        <div class="topcontent">
                            <div class="tableinfo">
                            <div class="tablenumber" :title="items.name">{{ items.name }}</div>
                            <div class="people_info">{{ items.dining_count }}/{{ items.max_people }}</div>
                            </div>
                            <div class="order_count" v-if="items.status != 1">{{ L('X1个订单', { X1: items.order_count }) }}</div>
                            <div class="addicon" v-if="items.status == 1"><img src="../../../../../../assets/storestaff/emptytable.png" alt="" /></div>
                        </div>
                        <div class="status_text" v-if="items.status != 1">{{ items.status_str }}</div>
                        </div>

                        <div class="selectedborder_box" v-show="selectedTableborderCurrent == items.id">
                        <div class="border_content">
                            <div class="pink_check"><img src="../../../../../../assets/storestaff/pinkcheck.png" alt="" /></div>
                        </div>
                        </div>
                    </div>
                </a-list-item>
            </a-list>
        </div>

        <div class="emptyTips" v-if="!table_list || (table_list && !table_list.length)">
          <div>{{ L('暂无桌台') }}</div>
        </div>
      </div>
    </div>

    <!-- 开台输入人数弹框 -->
    <a-modal
      v-model="computerModel_show"
      :footer="null"
      :title="null"
      width="30%"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="true"
    >
      <div class="alert_wrapper"><Computer :tableinfos="checktableInfo" @closemodel="closecomputer"></Computer></div>
    </a-modal>

    <!-- 选择桌台订单弹框 -->
    <a-modal
      v-model="selectOrder_Model_show"
      :footer="null"
      :title="null"
      width="37%"
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="true"
    >
      <div class="alert_wrapper">
        <selectOrder
          :tableinfos="checktableInfo"
          @closemodel="closeSelectord"
          @changeLeftDetails="changeLeftDetails"
          @openNewTable="openNewTable"
        ></selectOrder>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import TWEEN from '@tweenjs/tween.js'
import Computer from '../../components/computer.vue' //开台
import selectOrder from '../../components/tableOrder_select.vue' //选择订单

export default {
  components: {
    Computer,
    selectOrder,
  },
  data() {
    return {
      animateshow: false, //动画类名
      loadingdata: true,
      indicator: <a-icon type="loading-3-quarters" font-size="30px" spin />,

      // 弹框相关
      computerModel_show: false, // 计算机弹框
      selectOrder_Model_show: false, // 多订单弹框

      screenCurrent: 0, //桌台状态索引
      tableCurrent: 0, //桌台类型索引
      clearid: '', //清台的id
      selectedTableborderCurrent: -1, //选中框样式
      checktableInfo: {}, //选中的桌台信息

      // 桌台状态列表
      screenList: [
        {
          options: this.L('全部'),
          count: '',
        },
        {
          options: this.L('空台'),
          count: '',
        },
        {
          options: this.L('就餐中'),
          count: '',
        },
        {
          options: this.L('点餐中'),
          count: '',
        },
        {
          options: this.L('待清台'),
          count: '',
        },
      ],
      // 桌台规格
      table_type_list: [],
      // 桌台列表
      table_list: '',

      slideshake: true, //滚动栏防抖
      numTween: 0,
      leftscroll: 0,

      // 页面元素尺寸信息
      slidercontentwidth: '',
      sliderwidth: '',
    }
  },
  watch: {
    '$store.state.storestaff.nowTableId'(nval, oval) {
      // 有新的订单进来了 新的桌台id nval
      this.selectedTableborderCurrent = nval
    },
    // 自然滚动动优化方法
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
  computed: {
    tableListGrid() {
        var html = document.getElementsByTagName('html')[0]
        var pageWidth = html.getBoundingClientRect().width
        let gutter = (40 / 192) * (pageWidth / 10)
        return gutter.toFixed(2) - 0
    }
  },

  destroyed() {
    this.$bus.$off('uploadtable')
    this.$bus.$off('changeSeats')
  },

  created() {
    // 获取桌台分类和桌台规格信息
    this.gettableTypeList()
    this.$bus.$on('changeSeats', (id) => {
      console.log(id)
      this.gettableTypeList()
      this.selectedTableborderCurrent = id
      // this.$store.commit('changeOrder', res.list[0].order_id);
    })

    this.$bus.$on('uploadtable', (refush) => {
      this.gettableTypeList()
      if (refush) {
      } else {
        this.selectedTableborderCurrent = -1
      }
    })
  },

  mounted() {
    this.$emit('titleState', { showstate: 'hide' })
    this.share_table_type = Vue.ls.get('storestaff_page_info').share_table_type
    // this.share_table_type == 2 ? this.L('拼桌模式') : this.L('不拼桌模式')
    this.selectedTableborderCurrent = this.$store.state.storestaff.nowTableId
    setTimeout(() => {
      this.sliderwidth = window.getComputedStyle(this.$refs.sliderbox).width.replace('px', '')
      this.slidercontentwidth = window.getComputedStyle(this.$refs.slidercontent).width.replace('px', '')
    }, 200)
  },
  methods: {
    // 获取桌台分类和桌台规格信息
    gettableTypeList() {
      this.request('/foodshop/storestaff.foodshopStore/tableTypeList').then((res) => {
        var statusObj = res.tab_count
        this.table_type_list = res.table_type_list
        if (this.table_type_list.length > 0) {
          this.gettableList(this.table_type_list[0].id)
        } else {
          this.loadingdata = false
        }
        this.screenList.forEach((items, index) => {
          if (index == 0) {
            items.count = statusObj.all
          } else if (index == 1) {
            items.count = statusObj.empty
          } else if (index == 2) {
            items.count = statusObj.dining
          } else if (index == 3) {
            items.count = statusObj.order
          } else {
            items.count = statusObj.clear
          }
        })
      })
    },

    // 获取桌台列表
    gettableList(id) {
      this.loadingdata = true
      this.request('/foodshop/storestaff.foodshopStore/tableList', {
        order_status: this.screenCurrent,
        table_id: id,
      }).then((res) => {
        this.loadingdata = false
        this.table_list = res.table_list
      })
    },

    //桌台状态
    switchscreen(idx) {
      if (this.screenCurrent != idx) {
        this.leftscroll = 0
        document.getElementById('slidercontent').scrollLeft = this.leftscroll
        this.screenCurrent = idx
        this.tableCurrent = 0
        if (this.table_type_list.length) {
          this.gettableList(this.table_type_list[0].id)
        }
      }
    },
    screenTablesize(idx) {
      if (this.tableCurrent != idx) {
        this.tableCurrent = idx
        this.gettableList(this.table_type_list[idx].id)
      }
    },

    // 弹框关闭
    closecomputer() {
      this.computerModel_show = false
    },
    closeSelectord() {
      this.selectOrder_Model_show = false
      this.warningShow = false
    },

    //桌台点击
    opendining(state, info) {
      this.checktableInfo = info
      if (state == 1) {
        this.computerModel_show = true
      } else {
        if (this.share_table_type == 2) {
          this.selectOrder_Model_show = true
        } else {
          if (info.order_count > 1) {
            this.selectOrder_Model_show = true
          } else {
            if (state == 4) {
              this.selectedTableborderCurrent = info.id
              this.$store.commit('changeleftState', 4)
              this.changeLeftDetails(this.checktableInfo.id)
              this.getTableOrder(info.id, 2)
            } else if (state == 2) {
              this.selectedTableborderCurrent = info.id
              this.$store.commit('changeleftState', 2)
              this.changeLeftDetails(this.checktableInfo.id)
              this.getTableOrder(info.id, 2)
            } else {
              this.selectedTableborderCurrent = info.id
              this.$store.commit('changeTable', info.id)
              this.changeLeftDetails(this.checktableInfo.id)
              this.getTableOrder(info.id, 3)
            }
          }
        }
      }
    },

    // 选择了就餐中的订单
    changeLeftDetails(id) {
      this.selectedTableborderCurrent = id
      this.$store.commit('changeTable', id)
    },

    // 创建新的订单
    openNewTable(info) {
      console.log(info)
      this.closeSelectord()
      this.checktableInfo = info
      this.computerModel_show = true
    },

    // 获取桌台订单
    getTableOrder(id, state) {
      this.request('/foodshop/storestaff.foodshopStore/tableOrderList', { table_id: id }).then((res) => {
        if (res.list) {
          this.$store.commit('changeOrder', res.list[0].order_id)
          if (state == 3) {
            this.$router.push({ name: 'menu', query: { orderId: res.list[0].order_id } })
          }
        }
      })
    },

    // 添加刷新动画
    addanimate() {
      this.animateshow = true
      this.screenCurrent = 0
      this.tableCurrent = 0
      this.gettableTypeList()
      setTimeout(() => {
        this.animateshow = false
      }, 500)
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
.dining_wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  user-select: none;
  .header_info_container {
    width: 100%;
    height: 12%;
    display: flex;
    justify-content: space-between;
    .screenbtn_list {
      display: flex;
      align-items: center;
      user-select: none;
      .screen_options {
        width: 200 / @rem * 1rem;
        height: 70 / @rem * 1rem;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 34 / @rem * 1rem;
        border: solid 4 / @rem * 1rem #ffa40d;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 22 / @rem * 1rem;
        color: #ffa40d;
        cursor: pointer;
        .options_name {
          height: 100%;
          font-size: 24 / @rem * 1rem;
          font-weight: 500;
          letter-spacing: 0px;
          margin-right: 5 / @rem * 1rem;
          line-height: 62 / @rem * 1rem;
        }
        .people_count {
          height: 100%;
          font-size: 24 / @rem * 1rem;
          line-height: 62 / @rem * 1rem;
          font-weight: 500;
          letter-spacing: 0px;
        }
        .iconbox {
          margin-top: 4 / @rem * 1rem;
          margin-right: 5 / @rem * 1rem;
          .iconfont {
            font-size: 24 / @rem * 1rem;
            font-weight: 500;
            letter-spacing: 0px;
          }
        }
      }
      .all {
        width: 135 / @rem * 1rem;
      }
      .screen_options_active {
        color: #ffffff;
        background-color: #ffa40d;
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
      background-color: rgba(65, 65, 65, 0.8);
      border-radius: 6px;
      display: flex;
      padding: 0 20 / @rem * 1rem;
      box-sizing: border-box;
      .leftslidericon {
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
              justify-content: space-between;
              cursor: pointer;
              .table_name {
                width: 100%;
                font-size: 26 / @rem * 1rem;
                color: #b9b9b9;
                display: flex;
                align-items: center;
                flex: 1;
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
                margin-bottom: 5 / @rem * 1rem;
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
    .center_slider_container::-webkit-scrollbar {
      height: 0px;
    }

    .tableList_wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      position: relative;
      overflow-y: scroll;
      overflow-x: hidden;
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
        .table_card_items {
          width: 100%;
          height: 240 / @rem * 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin: 20 / @rem * 1rem 0;
          .card_container {
            width: 100%;
            height: 240 / @rem * 1rem;
            display: flex;
            align-items: center;
            flex-direction: column;
            border-radius: 10 / @rem * 1rem;
            box-sizing: border-box;
            background-color: #ffffff;
            overflow: hidden;
            cursor: pointer;
            .topcontent {
              width: 100%;
              flex: 1;
              background-color: #25b7aa;
              display: flex;
              flex-direction: column;
              .tableinfo {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 0 22 / @rem * 1rem;
                margin-top: 23 / @rem * 1rem;
                .tablenumber {
                  flex: 1;
                  font-size: 26 / @rem * 1rem;
                  line-height: 38 / @rem * 1rem;
                  font-weight: bold;
                  color: #ffffff;
                  overflow: hidden;
                  word-break: break-all;
                  text-overflow: ellipsis; 
                  display: -webkit-box; // 弹性伸缩盒
                  -webkit-box-orient: vertical; // 设置伸缩盒子元素排列方式
                  -webkit-line-clamp: 3;
                }
                .people_info {
                  margin-left: 10 / @rem * 1rem;
                  line-height: 38 / @rem * 1rem;
                  font-size: 22 / @rem * 1rem;
                  color: #ffffff;
                  white-space: nowrap;
                }
              }
              .order_count {
                font-size: 20 / @rem * 1rem;
                width: 100%;
                color: #ffffff;
                padding: 0 20 / @rem * 1rem;
                margin-top: 5 / @rem * 1rem;
              }
            }
            .status_text {
              width: 100%;
              height: 55 / @rem * 1rem;
              text-align: center;
              line-height: 60 / @rem * 1rem;
              font-size: 28 / @rem * 1rem;
              color: #25b7aa;
              white-space: nowrap;
            }
          }

          .card_container_order {
            .topcontent {
              background-color: #ffa40d;
            }
            .status_text {
              color: #ffa40d;
            }
          }

          .card_container_empty {
            .topcontent {
              width: 100%;
              height: 100%;
              background-color: #67686d;
              .addicon {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 35 / @rem * 1rem;
                img {
                  width: 44 / @rem * 1rem;
                  height: 44 / @rem * 1rem;
                }
              }
            }
          }
          .card_container_clean {
            .topcontent {
              background-color: #cacaca;
              .tableinfo {
                .tablenumber {
                  // color: #c6c6c6;
                }
                .people_info {
                  // color: #c6c6c6;
                }
              }
              .order_count {
                // color: #c6c6c6;
              }
            }
            .status_text {
              color: #8a8a8a;
            }
          }

          .selectedborder_box {
            // width: 215 / @rem * 1rem;
            // height: 190 / @rem * 1rem;
            position: absolute;
            left: -8 / @rem * 1rem;
            right: -8 / @rem * 1rem;;
            top: -8 / @rem * 1rem;;
            bottom: -8 / @rem * 1rem;;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            .border_content {
              width: 100%;
              height: 100%;
              border: 4 / @rem * 1rem solid #fd5392;
              border-radius: 10 / @rem * 1rem;
              position: relative;
              box-sizing: border-box;
              .pink_check {
                position: absolute;
                width: 35 / @rem * 1rem;
                height: 35 / @rem * 1rem;
                top: -12 / @rem * 1rem;
                right: -12 / @rem * 1rem;
                display: flex;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
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
