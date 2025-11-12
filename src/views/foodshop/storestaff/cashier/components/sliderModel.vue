<template>
  <div class="accessoryDish_wrapper">
    <div class="selected_name" v-if="pageSelect">
      <div class="keytips">{{ L('已选') }}：</div>
      <div class="selected_info">{{ pageSelect ? pageSelect.slice(0, -1) : L('无') }}</div>
    </div>
    <div class="accessory_slider_container">
      <div class="accessory_slider_content">
        <swiper ref="mySwiper" :options="swiperOptions" class="accessoryDetails_list">
          <swiper-slide class="accessory_items" v-for="(items, index) in showList" :key="index">
            <!-- 必选菜 -->
            <div class="choose" v-if="items.is_choose && items.is_choose == 1">{{ L('必选菜') }}</div>
            <div class="corner_marker" v-if="(items.has_format || items.has_spec) && items.counts > 0">
              {{ items.counts }}
            </div>
            <div class="dish_pic"><img :src="items.product_image" alt="" /></div>
            <div class="center_dish_info">
              <div class="dish_name">{{ items.product_name }}</div>
              <div class="dish_price">
                <span>{{ L('￥') }}</span>
                {{ items.product_price }}
              </div>
            </div>
            <div class="bottom_operation">
              <div class="sale_out" v-if="items.stock_num < 1 && items.stock_num != -1">{{ L('已售完') }}</div>
              <div style="width: 100%; height: 100%" v-else>
                <div class="open_model" v-if="items.has_format || items.has_spec" @click="showspec_model(index)">
                  <div class="btn_view">{{ L('选规格') }}</div>
                </div>
                <div class="num_operation" v-else>
                  <div class="reduce_btn" v-if="items.counts > 0" @click="reducenum(index)">
                    <img src="@/assets/storestaff/re.png" alt="" />
                  </div>
                  <div class="num" v-if="items.counts > 0">{{ items.counts }}</div>
                  <div class="add_btn" @click="addnum(items)">
                    <img src="@/assets/storestaff/ad.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>

      <a-modal
        v-model="spec_model"
        :footer="null"
        :centered="true"
        :title="null"
        width="28%"
        :maskClosable="false"
        :destroyOnClose="true"
        :closable="false"
        :bodyStyle="{ padding: 0 }"
      >
        <div class="alert_wrapper">
          <div class="accessory_container" v-if="modelInfo">
            <div class="accessory_title">
              <div class="titleText">{{ modelInfo.product_name }}</div>
              <div class="closeicon" @click="cfmadd()">
                <img src="@/assets/storestaff/close.png" alt="" />
              </div>
            </div>
            <div class="spec_content">
              <div class="spec_slider_content">
                <div class="spec_slider_list">
                  <div style="width: 100%">
                    <div class="spec_items" v-for="(item, indx) in modelInfo.spec_list" :key="indx">
                      <div class="spec_titletext">{{ item.name }}</div>
                      <div class="spec_value_list">
                        <div
                          class="spec_value_itm"
                          v-for="(itm, idx) in item.list"
                          :key="idx"
                          :class="itm.ischeck ? 'spec_value_itm_active' : ''"
                          @click="selectspec(indx, idx)"
                        >
                          {{ itm.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="spec_items" v-for="(items, index) in modelInfo.properties_list" :key="index">
                    <div class="spec_titletext">{{ items.name }}</div>
                    <div class="spec_value_list">
                      <div
                        class="spec_value_itm"
                        v-for="(itm, idx) in items.lists"
                        :key="idx"
                        :class="itm.ischeck ? 'spec_value_itm_active' : ''"
                        @click="selectpro(index, idx)"
                      >
                        {{ itm.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="checkedspec_yet_container">
              <div class="title_tips">{{ L('已选规格') }}：</div>
              <div class="checked_info">{{ has_select ? has_select.slice(0, -1) : L('无') }}</div>
            </div>
            <div class="price_count_info">
              <div class="left_price" v-if="nowpriceinfo.price">
                <div class="price_text">{{ L('总计') }}</div>
                <div class="totall_price">
                  <span>{{ L('￥') }}</span>
                  {{ nowpriceinfo.price }}
                </div>
                <!-- <s v-if="nowpriceinfo.old_price">￥{{ nowpriceinfo.old_price }}</s> -->
              </div>
              <div class="left_price" v-else>
                <div class="price_text">{{ L('总计') }}</div>
                <div class="totall_price">
                  <span>{{ L('￥') }}</span>
                  {{ modelInfo.product_price }}
                </div>
                <!-- <s v-if="modelInfo.old_price">￥{{ modelInfo.old_price }}</s> -->
              </div>
              <div class="right_btn" v-if="nowpriceinfo.counts > 0">
                <div class="reduce_btn" @click="reducecount()" v-if="nowpriceinfo.counts > 0">
                  <img src="@/assets/storestaff/re.png" alt="" />
                </div>
                <div class="spec_num" v-if="nowpriceinfo.counts > 0">{{ nowpriceinfo.counts }}</div>
                <div class="add_btn" @click="addcount()">
                  <img src="@/assets/storestaff/ad.png" alt="" />
                </div>
              </div>
              <div class="addcartbtn" @click="addcount()" v-else>
                <div class="cartbtn">
                  <div>{{ L('加入购物车') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
export default {
  props: {
    modelList: Object,
    is_package_goods: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      // 轮播配置
      swiperOptions: {
        slidesPerView: 5,
        spaceBetween: 20,
        freeMode: true,
        freeModeMomentumBounce: false,
      },
      showList: [],
      spec_model: false,
      modelInfo: {},
      nowpriceinfo: {},
      nowspec: '',
      nowformat: '',
      pageSelect: '',
      nowSpecStatus: 1, //1，有规格，2，有属性，3，全都有
      has_select: '', //已选规格
    }
  },
  watch: {
    showList(nval, oval) {
      console.log(nval)
      this.pageSelect = ''
      nval.forEach((items) => {
        if (!items.has_format && !items.has_spec) {
          if (items.counts > 0) {
            this.pageSelect += items.product_name + ' x' + items.counts + '、'
          }
        }

        if (items.has_spec && !items.has_format) {
          if (items.counts > 0) {
            items.allSelect.forEach((itm) => {
              if (itm.counts > 0) {
                if (itm.has_select.substr(itm.has_select.length - 1, 1) == '、') {
                  itm.has_select = itm.has_select.substring(0, itm.has_select.length - 1)
                }
                this.pageSelect += items.product_name + '(' + itm.has_select + ')' + ' x' + itm.counts + '、'
              }
            })
          }
        }

        if (!items.has_spec && items.has_format) {
          if (items.counts > 0) {
            items.allSelect[0].formatList.forEach((itm) => {
              if (itm.counts > 0) {
                if (itm.has_select.substr(itm.has_select.length - 1, 1) == '、') {
                  itm.has_select = itm.has_select.substring(0, itm.has_select.length - 1)
                }
                this.pageSelect +=
                  items.product_name + (itm.has_select ? '(' + itm.has_select + ')' : '') + ' x' + itm.counts + '、'
              }
            })
          }
        }

        if (items.has_spec && items.has_format) {
          if (items.counts > 0) {
            items.allSelect.forEach((itm) => {
              if (itm.counts > 0) {
                if (itm.has_select.substr(itm.has_select.length - 1, 1) == '、') {
                  itm.has_select = itm.has_select.substring(0, itm.has_select.length - 1)
                }
                this.pageSelect += items.product_name + '(' + itm.has_select + ')' + ' x' + itm.counts + '、'
                if (itm.formatList.length > 0) {
                  itm.formatList.forEach((it) => {
                    if (it.counts > 0) {
                      if (it.has_select.substr(it.has_select.length - 1, 1) == '、') {
                        it.has_select = it.has_select.substring(0, it.has_select.length - 1)
                      }
                      this.pageSelect += items.product_name + '(' + it.has_select + ')' + ' x' + it.counts + '、'
                    }
                  })
                }
              } else {
                if (itm.formatList.length > 0) {
                  itm.formatList.forEach((it) => {
                    if (it.counts > 0) {
                      if (it.has_select.substr(it.has_select.length - 1, 1) == '、') {
                        it.has_select = it.has_select.substring(0, it.has_select.length - 1)
                      }
                      this.pageSelect += items.product_name + '(' + it.has_select + ')' + ' x' + it.counts + '、'
                    }
                  })
                }
              }
            })
          }
        }
      })

      console.log(this.pageSelect)
    },
    nowspec(nval, oval) {
      if (nval.substr(nval.length - 1, 1) == '_') {
        this.nowspec = nval.substring(0, nval.length - 1)
      }
    },
    nowformat(nval, oval) {
      if (nval.substr(nval.length - 1, 1) == '_') {
        this.nowformat = nval.substring(0, nval.length - 1)
      }
    },
  },
  created() {
    console.log(this.modelList, 'modelList')
    this.showList = this.modelList.goods
    this.initData()
  },
  methods: {
    // 初始化数组
    initData() {
      this.showList.forEach((items, index) => {
        // 套餐必选菜
        if (this.is_package_goods && items.is_choose && items.is_choose == 1) {
          items.counts = 1
        } else {
          items.counts = 0
        }

        items.allSelect = []
      })
    },

    //增加附属菜数量
    addnum(info) {
      var modelNum = 0
      this.showList.forEach((items) => {
        if (items.counts) {
          modelNum += items.counts
        }
      })

      console.log(info, 'info')

      if (this.is_package_goods) {
        if (modelNum < this.modelList.maxnum) {
          this.showList.forEach((items, index) => {
            if (info.product_id == items.product_id) {
              if (items.counts < items.stock_num || items.stock_num == -1) {
                items.counts++
              } else {
                this.$message.warning(this.L('库存不够了~'))
              }
            }
            this.$set(this.showList, index, items)
          })
          this.$nextTick(() => {
            this.$emit('uploadinfo')
          })
        } else {
          this.$message.error(this.L('X1最多只能选择X2份', { X1: this.modelList.name, X2: this.modelList.maxnum }))
        }
      } else {
        console.log(info.counts > 1 ? 0 : info.mini_num, 'addnum')
        let mini_num = info.mini_num > 0?info.mini_num - 1:info.mini_num
        if (modelNum + (info.counts > 0 ? 0 : mini_num) < this.modelList.maxnum) {
          this.showList.forEach((items, index) => {
            if (info.product_id == items.product_id) {
              if (items.counts < items.stock_num || items.stock_num == -1) {
                if (items.counts < items.max_num || items.max_num == 0) {
                  if (items.counts == 0 && items.mini_num != 0) {
                    items.counts += items.mini_num
                  } else {
                    items.counts++
                  }
                } else {
                  this.$message.warning(this.L('该商品已经达到购买上限了~'))
                }
              } else {
                this.$message.warning(this.L('库存不够了~'))
              }
            }
            this.$set(this.showList, index, items)
          })
          this.$nextTick(() => {
            this.$emit('uploadinfo')
          })
        } else {
          this.$message.error(this.L('X1最多只能选择X2份', { X1: this.modelList.name, X2: this.modelList.maxnum }))
        }
      }
    },

    // 减少附属菜数量
    reducenum(idx) {
      this.showList.forEach((items, index) => {
        if (idx == index) {
          if (items.counts == items.mini_num) {
            items.counts -= items.mini_num
          } else {
            // 套餐必选菜最小数量1
            if (this.is_package_goods && items.is_choose && items.is_choose == 1 && items.counts == 1) {
              items.counts = 1
            } else {
              items.counts--
            }
          }
        }
        this.$set(this.showList, index, items)
      })
      this.$nextTick(() => {
        this.$emit('uploadinfo')
      })
    },

    // 点击选规格弹框
    showspec_model(idx) {
      this.showList.forEach((items, index) => {
        if (idx == index) {
          this.modelInfo = JSON.parse(JSON.stringify(items))
          // 初始化弹框数据
          this.modelInit()
          this.spec_model = true
        }
        this.$set(this.showList, index, items)
      })
    },

    // 初始化弹框数据
    modelInit() {
      console.log(this.modelInfo)
      // 只有规格
      if (this.modelInfo.has_spec && !this.modelInfo.has_format) {
        this.nowSpecStatus = 1
        this.modelInfo.spec_list.map((a, b) => {
          a.list.map((c, d) => {
            c.ischeck = false
            if (d == 0) {
              c.ischeck = true
              this.has_select += c.name + '、'
              this.nowspec = this.nowspec + c.id_ + '_'
            }
          })
        })

        this.$nextTick(() => {
          var states = this.modelInfo.allSelect.some((items) => {
            return items.specId == this.nowspec
          })
          if (states) {
            this.modelInfo.allSelect.forEach((items, index) => {
              if (items.specId == this.nowspec) {
                this.nowpriceinfo = JSON.parse(JSON.stringify(items))
              }
            })
          } else {
            this.nowpriceinfo = JSON.parse(JSON.stringify(this.modelInfo.list[this.nowspec]))
          }
          console.log('只有规格')
        })
      }

      // 只有属性
      if (!this.modelInfo.has_spec && this.modelInfo.has_format) {
        this.nowSpecStatus = 2
        this.modelInfo.properties_list.forEach((a, b) => {
          a.lists = []
          if (a.num == 1) {
            a.val.forEach((c, d) => {
              var obj = {}
              obj.ischeck = false
              obj.name = c
              obj.id = d
              obj.list_id = a.id_
              if (d == 0) {
                obj.ischeck = true
                ;(this.has_select += c + '、'), (this.nowformat = this.nowformat + a.id_ + '_' + obj.id + '_')
              }
              a.lists.push(obj)
            })
          } else {
            a.val.forEach((c, d) => {
              var obj = {}
              obj.ischeck = false
              obj.name = c
              obj.id = d
              obj.list_id = a.id_
              a.lists.push(obj)
            })
          }
        })

        this.$nextTick(() => {
          var formatinfo = JSON.parse(JSON.stringify(this.modelInfo))
          formatinfo.formatList = []
          if (this.modelInfo.allSelect.length > 0) {
          } else {
            this.modelInfo.allSelect.push(formatinfo)
          }
          // this.modelInfo.a
          var states = this.modelInfo.allSelect[0].formatList.some((items) => {
            return items.specId == this.nowformat
          })

          if (states) {
            this.modelInfo.allSelect[0].formatList.forEach((items, index) => {
              if (items.specId == this.nowformat) {
                this.nowpriceinfo = JSON.parse(JSON.stringify(items))
              }
            })
          } else {
            this.nowpriceinfo.counts = 0
            this.nowpriceinfo.stock_num = this.modelInfo.stock_num
            this.nowpriceinfo.mini_num = this.modelInfo.mini_num
            this.nowpriceinfo.max_num = this.modelInfo.max_num
          }
          console.log('只有属性')
        })
      }

      // 既有属性，也有规格
      if (this.modelInfo.has_format && this.modelInfo.has_spec) {
        this.nowSpecStatus = 3
        this.modelInfo.spec_list.map((a, b) => {
          a.list.map((c, d) => {
            c.ischeck = false
            if (d == 0) {
              ;(this.has_select += c.name + '、'), (c.ischeck = true)
              this.nowspec = this.nowspec + c.id_ + '_'
            }
          })
        })

        this.modelInfo.properties_list.forEach((a, b) => {
          a.lists = []
          a.val.forEach((c, d) => {
            var obj = {}
            obj.ischeck = false
            obj.name = c
            obj.id = d
            obj.list_id = a.id_
            a.lists.push(obj)
          })
        })

        this.$nextTick(() => {
          var states = this.modelInfo.allSelect.some((items) => {
            return items.specId == this.nowspec
          })

          if (states) {
            console.log(111)
            this.modelInfo.allSelect.forEach((items, index) => {
              if (items.specId == this.nowspec) {
                this.nowpriceinfo = JSON.parse(JSON.stringify(items))
                this.updataformat()
              }
            })

            this.$nextTick(() => {
              console.log(this.nowformat)
              var statesTwo = this.nowpriceinfo.formatList.some((items) => {
                return items.specId == this.nowformat
              })

              if (statesTwo) {
                this.nowpriceinfo.formatList.forEach((items, index) => {
                  if (items.specId == this.nowformat) {
                    this.nowpriceinfo = items
                  }
                })
              }
            })
          } else {
            this.nowpriceinfo = JSON.parse(JSON.stringify(this.modelInfo.list[this.nowspec]))
            this.nowpriceinfo.formatList = []
            this.updataformat()
          }
        })
      }

      setTimeout(() => {
        console.log(this.nowpriceinfo)
      }, 500)
    },

    // 选规格
    selectspec(a, b) {
      this.nowspec = ''
      this.nowformat = ''
      this.has_select = ''
      this.modelInfo.spec_list.forEach((item, index) => {
        if (a == index) {
          item.list.forEach((it, id) => {
            if (b == id) {
              it.ischeck = true
            } else {
              it.ischeck = false
            }
          })
          this.$set(this.modelInfo.spec_list, index, item)
        }
      })

      // 规格点击获取spec拼值
      this.$nextTick(() => {
        this.getnowspecFnc('spec')
      })
    },

    // 切换属性
    selectpro(a, b) {
      this.has_select = ''
      if (this.nowSpecStatus == 3) {
        this.modelInfo.properties_list.forEach((item, index) => {
          if (a == index) {
            this.nowpriceinfo.properties.forEach((x, y) => {
              if (x.id_ == item.id_) {
                if (x.num == 1) {
                  // 单属性必选点击
                  item.lists.forEach((it, id) => {
                    if (b == id) {
                      it.ischeck = true
                    } else {
                      it.ischeck = false
                    }
                  })
                } else if (x.num > 1) {
                  var checknum = item.lists.filter((itm) => {
                    return itm.ischeck
                  })
                  item.lists.forEach((it, id) => {
                    if (b == id) {
                      if (it.ischeck) {
                        it.ischeck = false
                      } else {
                        if (checknum.length < x.num) {
                          it.ischeck = true
                        } else {
                          this.$message.error(this.L('该属性最多可选X1个!', { X1: checknum.length }))
                        }
                      }
                    }
                  })
                } else {
                  item.lists.forEach((it, id) => {
                    if (b == id) {
                      it.ischeck = !it.ischeck
                    }
                  })
                }
                this.$set(this.modelInfo.properties_list, index, item)
              }
            })
          }
        })
      } else {
        this.modelInfo.properties_list.forEach((item, index) => {
          if (a == index) {
            if (item.num == 1) {
              // 单属性必选点击
              item.lists.forEach((it, id) => {
                if (b == id) {
                  it.ischeck = true
                } else {
                  it.ischeck = false
                }
              })
            } else if (item.num > 1) {
              var checknum = item.lists.filter((itm) => {
                return itm.ischeck
              })
              item.lists.forEach((it, id) => {
                if (b == id) {
                  if (it.ischeck) {
                    it.ischeck = false
                  } else {
                    if (checknum.length < item.num) {
                      it.ischeck = true
                    }
                  }
                }
              })
            } else {
              item.lists.forEach((it, id) => {
                if (b == id) {
                  it.ischeck = !it.ischeck
                }
              })
            }
            this.$set(this.modelInfo.properties_list, index, item)
          }
        })
      }

      // 属性点击获取spec拼值
      this.getnowspecFnc()
    },

    // 点击获取当前的规格属性拼值
    getnowspecFnc(type) {
      if (this.nowSpecStatus == 1) {
        // 单规格点击
        this.onlySpecchange()
      }

      if (this.nowSpecStatus == 2) {
        this.onlyFormatchange()
      }

      if (this.nowSpecStatus == 3) {
        this.nowspec = ''
        this.nowformat = ''
        this.bothHas(type)
      }
    },

    // 单规格点击
    onlySpecchange() {
      this.modelInfo.spec_list.forEach((a, b) => {
        a.list.forEach((c, d) => {
          if (c.ischeck) {
            this.has_select += c.name + '、'
            this.nowspec = this.nowspec + c.id_ + '_'
          }
        })
      })

      this.$nextTick(() => {
        var states = this.modelInfo.allSelect.some((items) => {
          return items.specId == this.nowspec
        })

        if (states) {
          this.modelInfo.allSelect.forEach((items, index) => {
            if (items.specId == this.nowspec) {
              this.nowpriceinfo = JSON.parse(JSON.stringify(items))
            }
          })
        } else {
          this.nowpriceinfo = JSON.parse(JSON.stringify(this.modelInfo.list[this.nowspec]))
        }
      })
    },

    // 单属性点击
    onlyFormatchange() {
      this.nowformat = ''
      this.nowspec = ''
      this.modelInfo.properties_list.forEach((a, b) => {
        a.lists.forEach((c, d) => {
          if (c.ischeck) {
            this.has_select += c.name + '、'
            this.nowformat = this.nowformat + a.id_ + '_' + c.id + '_'
          }
        })
      })

      this.$nextTick(() => {
        var states = this.modelInfo.allSelect[0].formatList.some((items) => {
          return items.specId == this.nowformat
        })

        if (states) {
          this.modelInfo.allSelect[0].formatList.forEach((items, index) => {
            if (items.specId == this.nowformat) {
              this.nowpriceinfo = JSON.parse(JSON.stringify(items))
            }
          })
        } else {
          this.nowpriceinfo.counts = 0
          this.nowpriceinfo.stock_num = this.modelInfo.stock_num
          this.nowpriceinfo.mini_num = this.modelInfo.mini_num
          this.nowpriceinfo.max_num = this.modelInfo.max_num
        }
      })
    },

    // 既有规格也有属性
    bothHas(type) {
      this.modelInfo.spec_list.forEach((a, b) => {
        a.list.forEach((c, d) => {
          if (c.ischeck) {
            this.has_select += c.name + '、'
            this.nowspec = this.nowspec + c.id_ + '_'
          }
        })
      })

      this.modelInfo.properties_list.forEach((itt, idd) => {
        itt.lists.forEach((c, d) => {
          if (c.ischeck) {
            this.has_select += c.name + '、'
            this.nowformat = this.nowformat + itt.id_ + '_' + c.id + '_'
          }
        })
      })

      this.$nextTick(() => {
        var states = this.modelInfo.allSelect.some((items) => {
          return items.specId == this.nowspec
        })

        if (states) {
          this.modelInfo.allSelect.forEach((items, index) => {
            if (items.specId == this.nowspec) {
              this.nowpriceinfo = JSON.parse(JSON.stringify(items))
              if (type == 'spec') {
                this.updataformat()
              }
            }
          })

          this.$nextTick(() => {
            if (this.nowformat) {
              var statesTwo = this.nowpriceinfo.formatList.some((items) => {
                return items.specId == this.nowformat
              })

              if (statesTwo) {
                if (this.nowformat) {
                  this.nowpriceinfo.formatList.forEach((items, index) => {
                    if (items.specId == this.nowformat) {
                      this.nowpriceinfo = items
                    }
                  })
                }
              } else {
                this.nowpriceinfo.counts = 0
              }
            }
          })
        } else {
          this.nowpriceinfo = JSON.parse(JSON.stringify(this.modelInfo.list[this.nowspec]))
          this.nowpriceinfo.formatList = []
          if (type == 'spec') {
            this.updataformat()
          }
        }
      })
    },

    //更新属性内容
    updataformat() {
      console.log(this.nowpriceinfo)
      this.nowformat = ''
      this.modelInfo.properties_list.forEach((m, n) => {
        this.nowpriceinfo.properties.forEach((o, p) => {
          if (o.id_ == m.id_) {
            if (o.num == 1) {
              m.lists.forEach((c, d) => {
                if (d == 0) {
                  c.ischeck = true
                  this.has_select += c.name + '、'
                  this.nowformat = this.nowformat + m.id_ + '_' + c.id + '_'
                } else {
                  c.ischeck = false
                }
              })
            } else {
              m.lists.forEach((c, d) => {
                c.ischeck = false
                // this.nowformat = '';
              })
            }
          }
        })
        this.$set(this.modelInfo.properties_list, n, m)
      })
    },

    // 数量加一
    addcount() {
      console.log('addcount')
      var modelNum = 0
      this.showList.forEach((items) => {
        if (items.counts) {
          modelNum += items.counts
        }
      })
      if (modelNum < this.modelList.maxnum) {
        if (this.nowSpecStatus == 1) {
          this.specaddfood()
        }

        if (this.nowSpecStatus == 2) {
          this.formataddfood()
        }

        if (this.nowSpecStatus == 3) {
          this.alladdfood()
        }
      } else {
        this.$message.error(this.L('X1最多只能选择X2份', { X1: this.modelList.name, X2: this.modelList.maxnum }))
      }
    },

    // 只有规格加菜
    specaddfood() {
      var storageSpec = ''
      this.modelInfo.spec_list.forEach((a, b) => {
        a.list.forEach((c, d) => {
          if (c.ischeck) {
            storageSpec = storageSpec + c.id_ + '_'
          }
        })
      })

      this.$nextTick(() => {
        if (storageSpec.substr(storageSpec.length - 1, 1) == '_') {
          storageSpec = storageSpec.substring(0, storageSpec.length - 1)
        }

        var states = this.modelInfo.allSelect.some((items) => {
          return items.specId == storageSpec
        })
        if (states) {
          this.modelInfo.allSelect.forEach((items, index) => {
            if (items.specId == storageSpec) {
              console.log('曾经有的属性')
              this.nowpriceinfo = JSON.parse(JSON.stringify(items))
            }
          })
        } else {
          var obj = JSON.parse(JSON.stringify(this.nowpriceinfo))
          obj.specId = storageSpec
          obj.has_select = this.has_select
          obj.counts = 0
          this.modelInfo.allSelect.push(obj)
        }

        this.nowspec = storageSpec

        var nownum = 0

        this.modelInfo.allSelect.forEach((item) => {
          nownum += item.counts
        })

        if (this.modelInfo.stock_num > nownum || this.modelInfo.stock_num == -1) {
          if (this.modelInfo.max_num > nownum || this.modelInfo.max_num == 0) {
            this.modelInfo.allSelect.forEach((items, index) => {
              if (items.specId == this.nowspec) {
                if (items.max_num > items.counts || items.max_num == 0) {
                  items.counts++
                  this.nowpriceinfo = JSON.parse(JSON.stringify(items))
                  this.uploadFoodList()
                } else {
                  this.$message.warning(this.L('该规格商品已到达购买上限了哦~'))
                }
              }
            })
            this.$forceUpdate()
          } else {
            this.$message.warning(this.L('该商品已到达购买上限了哦~'))
          }
        } else {
          this.$message.warning(this.L('库存不够了~'))
        }
      })
    },

    // 只有属性加菜
    formataddfood() {
      var storageSpec = ''
      var selectformat = []
      // 自己建个集合吧-
      this.modelInfo.properties_list.forEach((a, b) => {
        var protypeList = []
        a.lists.forEach((c, d) => {
          if (c.ischeck) {
            var proObj = {}
            proObj.list_id = a.id_
            proObj.id = c.id
            proObj.name = c.name
            protypeList.push(proObj)
            storageSpec = storageSpec + a.id_ + '_' + c.id + '_'
          }
        })
        selectformat.push(protypeList)
      })

      this.$nextTick(() => {
        if (storageSpec.substr(storageSpec.length - 1, 1) == '_') {
          storageSpec = storageSpec.substring(0, storageSpec.length - 1)
        }
        var states = this.modelInfo.allSelect[0].formatList.some((items) => {
          return items.specId == storageSpec
        })

        if (states) {
          this.modelInfo.allSelect[0].formatList.forEach((items, index) => {
            if (items.specId == storageSpec) {
              console.log('曾经有的属性')
              this.nowpriceinfo = JSON.parse(JSON.stringify(items))
            }
          })
        } else {
          var obj = JSON.parse(JSON.stringify(this.nowpriceinfo))
          obj.specId = storageSpec
          obj.selectformat = selectformat
          obj.has_select = this.has_select
          this.modelInfo.allSelect[0].formatList.push(obj)
        }

        this.nowformat = storageSpec

        var nownum = 0

        this.modelInfo.allSelect[0].formatList.forEach((item) => {
          nownum += item.counts
        })

        if (this.modelInfo.stock_num > nownum || this.modelInfo.stock_num == -1) {
          if (this.modelInfo.max_num > nownum || this.modelInfo.max_num == 0) {
            this.modelInfo.allSelect[0].formatList.forEach((items, index) => {
              if (items.specId == this.nowformat) {
                items.counts++
                this.nowpriceinfo = JSON.parse(JSON.stringify(items))
                this.uploadFoodList()
              }
            })
            this.$forceUpdate()
          } else {
            this.$message.warning(this.L('已到达购买上限了哦~'))
          }
        } else {
          this.$message.warning(this.L('库存不够了~'))
        }
      })
    },

    // 加菜规格属性啥都有
    alladdfood() {
      var storageSpec = ''
      var storageFormat = ''
      var selectformat = []
      var hasSelect = ''
      this.modelInfo.spec_list.forEach((a, b) => {
        a.list.forEach((c, d) => {
          if (c.ischeck) {
            hasSelect = hasSelect + c.name + '、'
            storageSpec = storageSpec + c.id_ + '_'
          }
        })
      })

      this.modelInfo.properties_list.forEach((a, b) => {
        var protypeList = []
        a.lists.forEach((c, d) => {
          if (c.ischeck) {
            hasSelect = hasSelect + c.name + '、'
            var proObj = {}
            proObj.list_id = a.id_
            proObj.id = c.id
            proObj.name = c.name
            protypeList.push(proObj)
            storageFormat = storageFormat + a.id_ + '_' + c.id + '_'
          }
        })
        selectformat.push(protypeList)
      })

      this.$nextTick(() => {
        if (storageSpec.substr(storageSpec.length - 1, 1) == '_') {
          storageSpec = storageSpec.substring(0, storageSpec.length - 1)
        }

        if (storageFormat.substr(storageFormat.length - 1, 1) == '_') {
          storageFormat = storageFormat.substring(0, storageFormat.length - 1)
        }

        var states = this.modelInfo.allSelect.some((items) => {
          return items.specId == storageSpec
        })

        if (states) {
          this.modelInfo.allSelect.forEach((items, index) => {
            if (items.specId == storageSpec) {
              if (storageFormat) {
                var forstate = items.formatList.some((itms) => {
                  return itms.specId == storageFormat
                })

                if (forstate) {
                  items.formatList.forEach((itm, idx) => {
                    if (storageFormat == itm.specId) {
                      itm.has_select = hasSelect
                      this.nowpriceinfo = JSON.parse(JSON.stringify(itm))
                    }
                  })
                } else {
                  console.log('当前状态,规格有值,但是规格下的属性没有选,在这里pushu新的属性对象')
                  var obj = JSON.parse(JSON.stringify(items))
                  obj.counts = 0
                  obj.has_select = hasSelect
                  obj.selectformat = selectformat
                  obj.specId = storageFormat
                  items.formatList.push(obj)
                }
              } else {
              }
            }
          })
        } else {
          var obj = JSON.parse(JSON.stringify(this.nowpriceinfo))
          obj.specId = storageSpec
          obj.has_select = hasSelect
          obj.selectformat = selectformat
          obj.counts = 0
          this.modelInfo.allSelect.push(obj)
          this.$nextTick(() => {
            if (storageFormat) {
              this.modelInfo.allSelect.forEach((items, index) => {
                if (items.specId == storageSpec) {
                  var obj = JSON.parse(JSON.stringify(items))
                  obj.counts = 0
                  obj.has_select = hasSelect
                  obj.specId = storageFormat
                  items.formatList.push(obj)
                }
              })
            } else {
            }
          })
        }

        this.$nextTick(() => {
          var countsnum = 0
          var soncounts = 0
          this.modelInfo.allSelect.forEach((items, index) => {
            countsnum += items.counts
            if (items.formatList.length > 0) {
              items.formatList.forEach((itm, idx) => {
                countsnum = countsnum + itm.counts
              })
            }
          })

          if (this.modelInfo.stock_num > countsnum || this.modelInfo.stock_num == -1) {
            if (this.modelInfo.max_num > countsnum || this.modelInfo.max_num == 0) {
              this.modelInfo.allSelect.forEach((items, index) => {
                if (items.specId == storageSpec) {
                  if (items.formatList.length > 0) {
                    soncounts += items.counts
                    items.formatList.forEach((itm, idx) => {
                      soncounts = soncounts + itm.counts
                    })
                    if (items.stock_num > soncounts || items.stock_num == -1) {
                      if (items.max_num > soncounts || items.max_num == 0) {
                        if (storageFormat) {
                          items.formatList.forEach((itm, idx) => {
                            if (itm.specId == storageFormat) {
                              itm.counts++
                              this.nowpriceinfo = itm
                              this.uploadFoodList()
                            }
                          })
                        } else {
                          items.counts++
                          this.nowpriceinfo = items
                          this.uploadFoodList()
                        }
                      } else {
                        this.$message.warning(this.L('该规格商品已到达购买上限了哦~'))
                      }
                    } else {
                      this.$message.warning(this.L('该规格商品库存不够了~'))
                    }
                  } else {
                    if (items.stock_num > items.counts || items.stock_num == -1) {
                      if (items.max_num > items.counts || items.max_num == 0) {
                        items.counts++
                        this.nowpriceinfo = items
                        this.uploadFoodList()
                      } else {
                        this.$message.warning(this.L('该规格商品已到达购买上限了哦~'))
                      }
                    } else {
                      this.$message.warning(this.L('该规格商品库存不够了~'))
                    }
                  }
                }
              })
            } else {
              this.$message.warning(this.L('该商品已到达购买上限了哦~'))
            }
          } else {
            this.$message.warning(this.L('该商品库存不够了~'))
          }
        })
      })
    },

    // 附属菜减数量
    reducecount() {
      var storageSpec = ''
      // has_spec是否有规格，规格必选，默认1
      if (this.nowspec != '') {
        this.modelInfo.allSelect.forEach((items, index) => {
          if (items.specId == this.nowspec) {
            if (this.nowformat != '') {
              items.formatList.forEach((itm, idx) => {
                if (itm.specId == this.nowformat) {
                  itm.counts--
                  this.nowpriceinfo = itm
                  this.uploadFoodList()
                }
              })
            } else {
              items.counts--
              this.nowpriceinfo = items
              this.uploadFoodList()
            }
          }
        })
      } else {
        this.modelInfo.allSelect[0].formatList.forEach((itm, idx) => {
          if (itm.specId == this.nowformat) {
            itm.counts--
            this.nowpriceinfo = itm
            this.uploadFoodList()
          }
        })
      }
    },

    // 关闭弹框加保存数据
    cfmadd() {
      console.log(this.modelInfo)
      this.nowspec = ''
      this.nowformat = ''
      this.has_select = ''
      this.nowpriceinfo = {}
      this.spec_model = false
      this.uploadFoodList()
      // this.modelInfo='';
    },

    uploadFoodList() {
      this.modelInfo.counts = 0
      if (this.modelInfo.allSelect.length > 0) {
        this.modelInfo.allSelect.forEach((items, index) => {
          this.modelInfo.counts += items.counts
          if (items.formatList) {
            items.formatList.forEach((itm, idx) => {
              this.modelInfo.counts += itm.counts
            })
          }
        })
      }
      this.showList.forEach((items, index) => {
        if (this.modelInfo.product_id == items.product_id) {
          items = this.modelInfo
        }
        this.$set(this.showList, index, items)
      })
      this.$emit('saveInfo', this.showList)
    },
  },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.accessoryDish_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .selected_name {
    width: 100%;
    display: flex;
    align-items: flex-start;
    font-size: 24 / @rem * 1rem;
    font-weight: bold;
    color: #19c6b6;
    margin-bottom: 20 / @rem * 1rem;
    .keytips {
      white-space: nowrap;
    }
  }
}
.accessory_slider_container {
  width: 100%;
  height: 275 / @rem * 1rem;
  position: relative;
  .accessory_slider_content {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    /deep/ .swiper-container {
      overflow: inherit;
    }
    .accessoryDetails_list {
      width: 100%;
      height: 100%;
      margin-left: 1px;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      .accessory_items {
        width: 185 / @rem * 1rem;
        height: 235 / @rem * 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10 / @rem * 1rem;
        border: solid 1px #e6e6e6;
        // margin-right: 20 / @rem * 1rem;
        position: relative;
        .choose {
          padding: 0 8 / @rem * 1rem;
          min-width: 32 / @rem * 1rem;
          height: 32 / @rem * 1rem;
          position: absolute;
          background: #ff3434;
          border-radius: 10px;
          z-index: 10;
          top: -12 / @rem * 1rem;
          right: -12 / @rem * 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 14 / @rem * 1rem;
        }
        .corner_marker {
          width: 32 / @rem * 1rem;
          height: 32 / @rem * 1rem;
          line-height: 32 / @rem * 1rem;
          text-align: center;
          border-radius: 50%;
          overflow: hidden;
          position: absolute;
          background-color: #fe9c00;
          top: -16 / @rem * 1rem;
          right: -16 / @rem * 1rem;
          font-size: 18 / @rem * 1rem;
          color: #ffffff;
          z-index: 5;
        }
        .dish_pic {
          width: 185 / @rem * 1rem;
          height: 115 / @rem * 1rem;
          border-radius: 10 / @rem * 1rem 10 / @rem * 1rem 0px 0px;
          box-sizing: border-box;
          overflow: hidden;
          display: flex;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .center_dish_info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 70 / @rem * 1rem;
          padding: 0 15 / @rem * 1rem;
          .dish_name {
            width: 100%;
            font-size: 20 / @rem * 1rem;
            font-weight: 500;
            color: #343434;
            margin-bottom: 5 / @rem * 1rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .dish_price {
            width: 100%;
            font-size: 16 / @rem * 1rem;
            font-weight: bold;
            color: #ff3434;
          }
        }

        .bottom_operation {
          width: 100%;
          height: 50 / @rem * 1rem;
          border-radius: 0px 0px 10 / @rem * 1rem 10 / @rem * 1rem;
          background-color: #f9f9f9;
          border-top: solid 1 / @rem * 1rem #e6e6e6;
          display: flex;
          align-items: center;
          justify-content: center;
          .open_model {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .btn_view {
              width: 60 / @rem * 1rem;
              height: 30 / @rem * 1rem;
              font-size: 16 / @rem * 1rem;
              text-align: center;
              line-height: 30 / @rem * 1rem;
              white-space: nowrap;
              color: #ffffff;
              background-color: #18c6b6;
              border-radius: 8 / @rem * 1rem;
            }
          }
          .num_operation {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .num {
              font-size: 22 / @rem * 1rem;
              font-weight: bold;
              margin: 0 15 / @rem * 1rem;
              color: #343434;
            }
            .add_btn {
              width: 30 / @rem * 1rem;
              height: 30 / @rem * 1rem;
              display: flex;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .reduce_btn {
              width: 30 / @rem * 1rem;
              height: 30 / @rem * 1rem;
              display: flex;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .sale_out {
            font-size: 16 / @rem * 1rem;
            font-weight: 500;
            color: #666666;
          }
        }
      }
    }
  }
}
.accessory_slider_container::-webkit-scrollbar {
  height: 0;
}

.alert_wrapper {
  user-select: none;
  .accessory_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 0 28 / @rem * 1rem;
    .accessory_title {
      width: 100%;
      border-bottom: 1 / @rem * 1rem solid #f1f1f1;
      padding: 25 / @rem * 1rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .titleText {
        font-size: 24 / @rem * 1rem;
        font-weight: bold;
        color: #333333;
      }
      .closeicon {
        width: 25 / @rem * 1rem;
        height: 25 / @rem * 1rem;
        display: flex;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .spec_content {
      width: 100%;
      height: 400 / @rem * 1rem;
      display: flex;
      overflow-x: hidden;
      overflow-y: scroll;
      position: relative;
      .spec_slider_content {
        position: absolute;
        width: 100%;
        padding-bottom: 10 / @rem * 1rem;
        .spec_slider_list {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .spec_items {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .spec_titletext {
              width: 100%;
              padding: 25 / @rem * 1rem 0;
              font-size: 20 / @rem * 1rem;
              font-weight: 500;
              color: #666666;
            }
            .spec_value_list {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              .spec_value_itm {
                width: 120 / @rem * 1rem;
                height: 45 / @rem * 1rem;
                border: 1 / @rem * 1rem solid #e2e2e2;
                border-radius: 6 / @rem * 1rem;
                box-sizing: border-box;
                text-align: center;
                line-height: 45 / @rem * 1rem;
                margin-right: 15 / @rem * 1rem;
                margin-bottom: 10 / @rem * 1rem;
                font-size: 20 / @rem * 1rem;
                font-weight: 500;
                color: #666666;
              }
              .spec_value_itm_active {
                border: solid 1 / @rem * 1rem #18c6b6;
                color: #18c6b6;
                background-color: #e7f9f8;
              }
            }
          }
        }
      }
    }
    .spec_content::-webkit-scrollbar {
      width: 0;
    }

    .checkedspec_yet_container {
      width: 100%;
      padding: 20 / @rem * 1rem;
      background-color: #f1f1f1;
      border-radius: 6 / @rem * 1rem;
      .title_tips {
        font-size: 20 / @rem * 1rem;
        font-weight: 500;
        color: #999999;
      }
      .checked_info {
        display: flex;
        flex-wrap: wrap;
        font-size: 20 / @rem * 1rem;
        font-weight: 500;
        color: #333333;
        margin-top: 10 / @rem * 1rem;
      }
    }

    .price_count_info {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 30 / @rem * 1rem 0 35 / @rem * 1rem 0;
      .left_price {
        display: flex;
        align-items: center;
        .price_text {
          line-height: 30 / @rem * 1rem;
          font-size: 24 / @rem * 1rem;
          font-weight: bold;
          color: #333333;
        }
        .totall_price {
          line-height: 45 / @rem * 1rem;
          font-size: 30 / @rem * 1rem;
          font-weight: bold;
          color: #ff3333;
        }
        s {
          font-size: 22 / @rem * 1rem;
          font-weight: 500;
        }
      }
      .right_btn {
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        .spec_num {
          width: 60 / @rem * 1rem;
          text-align: center;
          font-size: 22 / @rem * 1rem;
          font-weight: bold;
          color: #343434;
        }
        .add_btn {
          width: 30 / @rem * 1rem;
          height: 30 / @rem * 1rem;
          display: flex;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .reduce_btn {
          width: 30 / @rem * 1rem;
          height: 30 / @rem * 1rem;
          display: flex;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .addcartbtn {
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        .cartbtn {
          width: 100%;
          height: 40 / @rem * 1rem;
          border-radius: 20 / @rem * 1rem;
          background-color: #18c6b6;
          text-align: center;
          color: #ffffff;
          font-size: 20 / @rem * 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .bottom_btn_wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 30 / @rem * 1rem;
      .ccl_btn {
        width: 210 / @rem * 1rem;
        height: 68 / @rem * 1rem;
        background-color: #e7e7e7;
        border-radius: 10 / @rem * 1rem;
        font-size: 26 / @rem * 1rem;
        font-weight: bold;
        color: #666666;
        text-align: center;
        line-height: 68 / @rem * 1rem;
        margin-right: 30 / @rem * 1rem;
        cursor: pointer;
      }
      .cfm_btn {
        width: 210 / @rem * 1rem;
        height: 68 / @rem * 1rem;
        background-color: #18c6b6;
        border-radius: 10 / @rem * 1rem;
        font-size: 26 / @rem * 1rem;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        line-height: 68 / @rem * 1rem;
        cursor: pointer;
      }
    }
  }
}
</style>
