<template>
  <div class="change_seats_wrapper">
    <div class="title_container" v-if="showTitle">{{ L('更换桌台') }}</div>
    <div class="content_subject">
      <div class="leftcolumns_wrapper">
        <div class="abs_container">
          <div class="listcontent">
            <div
              class="table_type_items"
              v-for="(items, index) in table_type_list"
              :key="index"
              :class="leftcurrent == index ? 'table_type_items_active' : ''"
              @click="gettableList(items.id, index)"
            >
              <div class="typename">{{ items.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="rightcolumns_wrapper">
        <div class="slide_tableList_wrapper">
          <div class="tableList_abs_container" v-if="table_list">
            <div class="table_list">
              <div
                class="table_card_items"
                v-for="(items, index) in table_list"
                :key="index"
                v-if="items.id != nowtableId"
              >
                <div class="card_container card_container_dinging" v-if="items.status == 2" @click="selecttable(items)">
                  <div class="topcontent">
                    <div class="tableinfo">
                      <div class="tablenumber">{{ items.name }}</div>
                      <div class="people_info">{{ items.dining_count }}/{{ items.max_people }}</div>
                    </div>
                    <div class="order_count">{{ L('X1个订单', { X1: items.order_count }) }}</div>
                  </div>
                  <div class="status_text">{{ items.status_str }}</div>
                </div>
                <div class="card_container card_container_order" v-if="items.status == 3" @click="selecttable(items)">
                  <div class="topcontent">
                    <div class="tableinfo">
                      <div class="tablenumber">{{ items.name }}</div>
                      <div class="people_info">{{ items.dining_count }}/{{ items.max_people }}</div>
                    </div>
                    <div class="order_count">{{ L('X1个订单', { X1: items.order_count }) }}</div>
                  </div>
                  <div class="status_text">{{ items.status_str }}</div>
                </div>
                <div class="card_container card_container_empty" v-if="items.status == 1" @click="selecttable(items)">
                  <div class="topcontent">
                    <div class="tableinfo">
                      <div class="tablenumber">{{ items.name }}</div>
                      <div class="people_info">{{ items.dining_count }}/{{ items.max_people }}</div>
                    </div>
                    <div class="addicon"><img src="../../../../../assets/storestaff/emptytable.png" alt="" /></div>
                  </div>
                </div>
                <div class="card_container card_container_clean" v-if="items.status == 4" @click="selecttable(items)">
                  <div class="topcontent">
                    <div class="tableinfo">
                      <div class="tablenumber">{{ items.name }}</div>
                      <div class="people_info">{{ items.dining_count }}/{{ items.max_people }}</div>
                    </div>
                    <div class="order_count">{{ L('X1个订单', { X1: items.order_count }) }}</div>
                  </div>
                  <div class="status_text">{{ items.status_str }}</div>
                </div>

                <div class="selectedborder_box" v-show="rightcurrent == items.id">
                  <div class="border_content">
                    <div class="pink_check"><img src="../../../../../assets/storestaff/pinkcheck.png" alt="" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="notableTips" v-else>
            <div>{{ L('暂无对应桌台') }}</div>
          </div>
        </div>
        <div class="bottombtn_container" v-if="showTitle">
          <div class="ccl_btn" @click="closemodel()">{{ L('取消') }}</div>
          <div class="cfm_btn" @click="changeSeat()">{{ L('确定') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    showTitle: {
      type: Boolean,
      default: true,
    },
    orderId: Number,
    nowtableId: Number,
  },
  data() {
    return {
      leftcurrent: '',
      rightcurrent: '',

      share_table_type: '', //是否是拼桌模式

      // 桌台分类名称
      table_type_list: [],

      // 桌台列表
      table_list: [],
    }
  },
  created() {
    this.share_table_type = Vue.ls.get('storestaff_page_info').share_table_type
    this.gettableTypeList()
  },
  methods: {
    // 获取桌台分类和桌台规格信息
    gettableTypeList() {
      this.request('/foodshop/storestaff.foodshopStore/tableTypeList').then((res) => {
        var statusObj = res.tab_count
        this.table_type_list = res.table_type_list
        if (this.table_type_list) {
          this.gettableList(this.table_type_list[0].id)
        }
      })
    },

    gettableList(id, idx) {
      if (idx) {
        this.leftcurrent = idx
      } else {
        this.leftcurrent = 0
      }
      this.request('/foodshop/storestaff.foodshopStore/tableList', {
        order_status: this.share_table_type == 2 ? 0 : 1,
        table_id: id,
      }).then((res) => {
        this.table_list = res.table_list
      })
    },

    selecttable(info) {
      this.rightcurrent = info.id
      if (!this.showTitle) {
        this.$emit('changeSeat', { tableId: info.id })
      }
    },

    closemodel() {
      this.$emit('closemodel')
    },

    changeSeat() {
      if (this.rightcurrent != '') {
        this.request('/foodshop/storestaff.order/chanegeTable', {
          order_id: this.orderId,
          table_id: this.rightcurrent,
        }).then((res) => {
          this.$bus.$emit('changeSeats', this.rightcurrent)
          this.$emit('uploadfnc')
          this.closemodel()
        })
      } else {
        this.$message.error(this.L('您还未选中桌台！'))
      }
    },
  },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.change_seats_wrapper {
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
    border-bottom: 1 / @rem * 1rem solid #ededed;
  }
  .content_subject {
    width: 100%;
    height: 700 / @rem * 1rem;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: #f0f0f0;
    .leftcolumns_wrapper {
      width: 16%;
      height: 100%;
      background-color: #ffffff;
      overflow-x: hidden;
      overflow-y: scroll;
      position: relative;
      .abs_container {
        width: 100%;
        height: 100%;
        .listcontent {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .table_type_items {
            cursor: pointer;
            width: 100%;
            height: 90 / @rem * 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1 / @rem * 1rem solid #ededed;
            .typename {
              font-size: 26 / @rem * 1rem;
              font-weight: 500;
              color: #666666;
            }
          }
          .table_type_items_active {
            background: #00cbb3;
            .typename {
              color: #ffffff;
            }
          }
        }
      }
    }

    .leftcolumns_wrapper::-webkit-scrollbar {
      width: 0;
    }

    .rightcolumns_wrapper {
      width: 84%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .slide_tableList_wrapper {
        width: 100%;
        height: 610 / @rem * 1rem;
        display: flex;
        justify-content: center;
        overflow-x: hidden;
        overflow-y: scroll;
        position: relative;
        .tableList_abs_container {
          position: absolute;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 12 / @rem * 1rem;
          .table_list {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            padding-top: 20 / @rem * 1rem;
            .table_card_items {
              width: 25%;
              height: 165 / @rem * 1rem;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              margin: 20 / @rem * 1rem 0;
              .card_container {
                width: 195 / @rem * 1rem;
                height: 170 / @rem * 1rem;
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
                  height: 115 / @rem * 1rem;
                  background-color: #25b7aa;
                  display: flex;
                  flex-direction: column;
                  .tableinfo {
                    width: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    padding: 0 22 / @rem * 1rem;
                    margin-top: 23 / @rem * 1rem;
                    .tablenumber {
                      width: 70%;
                      font-size: 26 / @rem * 1rem;
                      line-height: 40 / @rem * 1rem;
                      font-weight: bold;
                      color: #ffffff;
                      white-space: nowrap;
                      overflow: hidden;
                    }
                    .people_info {
                      line-height: 30 / @rem * 1rem;
                      font-size: 22 / @rem * 1rem;
                      color: #ffffff;
                    }
                  }
                  .order_count {
                    font-size: 20 / @rem * 1rem;
                    width: 100%;
                    color: #ffffff;
                    padding: 0 20 / @rem * 1rem;
                    margin-top: 15 / @rem * 1rem;
                  }
                }
                .status_text {
                  width: 100%;
                  height: 55 / @rem * 1rem;
                  text-align: center;
                  line-height: 60 / @rem * 1rem;
                  font-size: 28 / @rem * 1rem;
                  color: #25b7aa;
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
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                .border_content {
                  width: 210 / @rem * 1rem;
                  height: 185 / @rem * 1rem;
                  border: 4 / @rem * 1rem solid #fd5392;
                  border-radius: 10 / @rem * 1rem;
                  position: relative;
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
        .notableTips {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .slide_tableList_wrapper::-webkit-scrollbar {
        width: 0;
      }
      .bottombtn_container {
        width: 100%;
        height: 90 / @rem * 1rem;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        padding: 0 24 / @rem * 1rem;
        .ccl_btn {
          cursor: pointer;
          width: 166 / @rem * 1rem;
          height: 60 / @rem * 1rem;
          background: #dedede;
          border-radius: 10 / @rem * 1rem;
          text-align: center;
          line-height: 60 / @rem * 1rem;
          font-size: 24 / @rem * 1rem;
          font-weight: bold;
          color: #666666;
          margin-right: 20 / @rem * 1rem;
        }
        .cfm_btn {
          cursor: pointer;
          width: 166 / @rem * 1rem;
          height: 60 / @rem * 1rem;
          background: #00cbb3;
          border-radius: 10 / @rem * 1rem;
          text-align: center;
          line-height: 60 / @rem * 1rem;
          font-size: 24 / @rem * 1rem;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
