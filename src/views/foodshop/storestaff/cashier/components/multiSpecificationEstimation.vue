<template>
  <div class="body_cashier_container">
    <div class="details_container">
      <div class="title_bar">
        <div class="title_text">{{ L('请选择某个规格来进行估清') }}</div>
      </div>
      <a-spin :spinning="loadingdata" :indicator="indicator" size="large" style="height: 75%" class="changecolor" />
      <div class="details_content">
        <div class="slider_content">
          <div class="food_details_info">
            <!--     附属菜名称     -->
            <div class="foodname">
              <div class="left_name">{{ pageinfo.product_name }}</div>
              <div class="right_price">
                <span>{{ L('库存:')}}</span>
                {{ is_show? pageinfo.stock_num == -1 ? L('不限') : pageinfo.stock_num :nowpriceinfo.stock_num == -1 ? L('不限') : nowpriceinfo.stock_num }}
              </div>
            </div>
            <!--     属性规格       -->
            <div class="food_spec_container">
              <div class="food_spec_list">
                <div style="width: 100%">
                  <div class="foodspec_items" style="align-items: center">
                    <div class="left_spec_keyname">{{ L('是否沽清全部') }}：</div>
                    <div class="specList">
                      <a-switch
                        :disabled="pageinfo.spec_stock_type == 1?true:false"
                        @change="switchChange"
                        :checked-children="L('是')"
                        :un-checked-children="L('否')"
                        default-checked
                      />
                      <span style="color:red;margin-left: 10px" v-if="pageinfo.spec_stock_type == 1">继承库存商品只能全部估清所有规格库存</span>
                    </div>
                  </div>
                  <template v-if="!is_show">
                    <div class="foodspec_items" v-for="(item, indx) in pageinfo.spec_list" :key="indx">
                      <div class="left_spec_keyname">{{ item.name }}：</div>
                      <div class="specList">
                        <div
                          class="spec_items"
                          v-for="(itm, id) in item.list"
                          :key="id"
                          :class="itm.ischeck ? 'spec_items_active' : ''"
                          @click="selectspec(indx, id)"
                        >
                          {{ itm.name }}
                        </div>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- <div class="foodspec_items" v-for="(items, index) in pageinfo.properties_list" :key="index">
                  <div class="left_spec_keyname">{{ items.name }}：</div>
                  <div class="specList">
                    <div
                      class="spec_items"
                      v-for="(itm, idx) in items.lists"
                      :key="idx"
                      :class="itm.ischeck ? 'spec_items_active' : ''"
                      @click="selectpro(index, idx)"
                    >
                      {{ itm.name }}
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_bar">
        <div class="cancel_btn" @click="cancelfnc">{{ L('取消') }}</div>
        <div class="confirm_btn" @click="addConfirm">{{ confirm_btn_title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      animateshow: false, //动画类名
      productId: '', //商品id、
      loadingdata: true, //加载动画开关
      indicator: <a-icon type="loading-3-quarters" font-size="30px" spin />,

      pageinfo: '',
      nowpriceinfo: {},
      nowspec: '',
      nowformat: '',
      nowSpecStatus: 1, //1，有规格，2，有属性，3，全都有
      uniqueness_number: '',
      productParam: [],
      allGoodsList: [],
      otherpage: '',
      is_show: true,
      confirm_btn_title: this.L('估清'),
    }
  },
  props: {
    multiSpecificationInfo: {
      type: Object,
      default() {
        return null
      },
    },
  },
  watch: {
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
    this.getfoodDetails()
  },
  methods: {
    setConfirmBtnTitle() {
      if (!this.is_show && this.nowpriceinfo && this.nowpriceinfo.stock_num == '0') {
        this.confirm_btn_title = this.L('置满')
      } else {
        this.confirm_btn_title = this.L('估清')
      }
    },
    switchChange(e) {
      this.is_show = e
      this.setConfirmBtnTitle();
    },
    //估清
    addConfirm() {
      let info = {
        nowspec: this.nowspec,
        nowpriceinfo: this.nowpriceinfo,
        is_show: this.is_show, //是否为全部
      }
      this.$emit('multiSpecificationEstimation', info)
    },
    //取消
    cancelfnc() {
      this.$emit('cancelValuation')
    },
    // 获取商品详情
    getfoodDetails(e) {
      // type 1 普通商品 2 套餐商品
      this.request('/foodshop/storestaff.goods/goodsDetail', {
        product_id: this.multiSpecificationInfo.product_id,
        type: this.multiSpecificationInfo.goodsType || 1,
      }).then((res) => {
        this.loadingdata = false
        this.pageinfo = JSON.parse(JSON.stringify(res))
        this.pageinfo.allSelect = []
        // this.$forceUpdate()
        // // 规格属性处理
        this.initList()
      })
    },
    // 规格属性处理
    initList() {
      if (this.pageinfo.subsidiary_piece.length > 0) {
        this.pageinfo.subsidiary_piece.map((items) => {
          items.has_select = ''
        })
      }
      // 只有规格的商品

      if (!this.pageinfo.has_spec && !this.pageinfo.has_format) {
        this.nowpriceinfo = this.pageinfo
        this.nowpriceinfo.price = this.nowpriceinfo.product_price
      }

      if (this.pageinfo.has_spec && !this.pageinfo.has_format) {
        this.nowSpecStatus = 1
        this.initdataSpec()
      }

      // 只有属性的商品
      if (!this.pageinfo.has_spec && this.pageinfo.has_format) {
        this.nowSpecStatus = 2
        this.initdataFormat()
      }

      // 属性和规格都有的商品
      if (this.pageinfo.has_spec && this.pageinfo.has_format) {
        this.nowSpecStatus = 3
        this.initdataBoth()
      }
    },

    // 单规格商品初始化
    initdataSpec() {
      // 只有规格的商品进来了
      this.pageinfo.spec_list.map((a, b) => {
        a.list.map((c, d) => {
          c.ischeck = false
          if (d == 0) {
            c.ischeck = true
            this.nowspec = this.nowspec + c.id_ + '_'
          }
        })
      })

      this.$nextTick(() => {
        console.log(this.nowspec)
        this.nowpriceinfo = JSON.parse(JSON.stringify(this.pageinfo.list[this.nowspec]))
        this.setConfirmBtnTitle();
      })
    },

    // 单属性商品初始化
    initdataFormat() {
    //   只有属性的商品进来了
      this.pageinfo.properties_list.forEach((a, b) => {
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
              this.nowformat = this.nowformat + a.id_ + '_' + obj.id + '_'
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
        this.nowpriceinfo = JSON.parse(JSON.stringify(this.pageinfo))
        this.nowpriceinfo.counts = 0
        this.nowpriceinfo.price = this.nowpriceinfo.product_price
      })
    },

    // 规格和属性都有的商品初始化
    initdataBoth() {
    //   规格和属性都有的商品进来了
      this.pageinfo.spec_list.map((a, b) => {
        a.list.map((c, d) => {
          c.ischeck = false
          if (d == 0) {
            c.ischeck = true
            this.nowspec = this.nowspec + c.id_ + '_'
          }
        })
      })

      this.pageinfo.properties_list.forEach((a, b) => {
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
        this.nowpriceinfo = JSON.parse(JSON.stringify(this.pageinfo.list[this.nowspec]))
        this.setConfirmBtnTitle();
        this.updataformat()
        // this.nowpriceinfo.formatList = [];
        console.log(this.pageinfo)
      })
    },

    //更新属性内容
    updataformat() {
      this.pageinfo.properties_list.forEach((m, n) => {
        this.nowpriceinfo.properties.forEach((o, p) => {
          if (o.id_ == m.id_) {
            if (o.num == 1) {
              m.lists.forEach((c, d) => {
                if (d == 0) {
                  c.ischeck = true
                  this.nowformat = this.nowformat + m.id_ + '_' + c.id + '_'
                } else {
                  c.ischeck = false
                }
              })
            } else {
              m.lists.forEach((c, d) => {
                c.ischeck = false
                this.nowformat = ''
              })
            }
          }
        })
        this.$set(this.pageinfo.properties_list, n, m)
      })
    },

    getselectInfo(e) {
      console.log(this.pageinfo.subsidiary_piece)
    },

    // 切换规格
    selectspec(a, b) {
      this.nowspec = ''
      this.nowformat = ''
      this.pageinfo.spec_list.forEach((item, index) => {
        if (a == index) {
          item.list.forEach((it, id) => {
            if (b == id) {
              it.ischeck = true
            } else {
              it.ischeck = false
            }
          })
          this.$set(this.pageinfo.spec_list, index, item)
        }
      })

      // 规格点击获取spec拼值
      this.$nextTick(() => {
        this.getnowspecFnc('spec')
      })
    },

    // 点击获取当前的规格属性拼值
    getnowspecFnc(type) {
      if (this.nowSpecStatus == 1) {
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

    onlySpecchange() {
      this.pageinfo.spec_list.forEach((a, b) => {
        a.list.forEach((c, d) => {
          if (c.ischeck) {
            this.nowspec = this.nowspec + c.id_ + '_'
          }
        })
      })

      this.$nextTick(() => {
        this.nowpriceinfo = JSON.parse(JSON.stringify(this.pageinfo.list[this.nowspec]))
        //有规格点击触发事件
        this.setConfirmBtnTitle();
        this.$emit('selectpro', this.nowpriceinfo)
      })
    },

    onlyFormatchange() {
      this.nowformat = ''
      this.nowspec = ''
      this.pageinfo.properties_list.forEach((a, b) => {
        a.lists.forEach((c, d) => {
          if (c.ischeck) {
            this.nowformat = this.nowformat + a.id_ + '_' + c.id + '_'
          }
        })
      })
    },

    // 既有规格也有属性
    bothHas(type) {
      this.pageinfo.spec_list.forEach((a, b) => {
        a.list.forEach((c, d) => {
          if (c.ischeck) {
            this.nowspec = this.nowspec + c.id_ + '_'
          }
        })
      })

      this.pageinfo.properties_list.forEach((itt, idd) => {
        itt.lists.forEach((c, d) => {
          if (c.ischeck) {
            this.nowformat = this.nowformat + itt.id_ + '_' + c.id + '_'
          }
        })
      })

      this.$nextTick(() => {
        this.nowpriceinfo = JSON.parse(JSON.stringify(this.pageinfo.list[this.nowspec]))
        this.nowpriceinfo.formatList = []
        //既有属性和规格点击触发事件
        this.setConfirmBtnTitle();
        this.$emit('selectpro', this.nowpriceinfo)
        if (type == 'spec') {
          this.updataformat()
        }
      })
    },

    // 切换属性
    selectpro(a, b) {
      if (this.nowSpecStatus == 3) {
        this.pageinfo.properties_list.forEach((item, index) => {
          if (a == index) {
            console.log(a)
            this.nowpriceinfo.properties.forEach((x, y) => {
              if (x.id_ == item.id_) {
                if (x.num == 1) {
                  console.log(x)
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
                          this.$message.error(this.L('该属性最多可选X1个', { X1: checknum.length }) + '!')
                        }
                      }
                    }
                  })
                } else {
                  item.lists.forEach((it, id) => {
                    if (b == id) {
                      it.ischeck = !it.ischeck
                    }
                    console.log(111)
                  })
                }
                this.$set(this.pageinfo.properties_list, index, item)
              }
            })
          }
        })
      } else {
        this.pageinfo.properties_list.forEach((item, index) => {
          console.log(a)
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
              console.log(checknum)
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
            this.$set(this.pageinfo.properties_list, index, item)
          }
        })
      }
      // 属性点击获取spec拼值
      this.getnowspecFnc()
    },

    // 获取当前的唯一标识
    getuniqueness() {
      this.uniqueness_number = this.productId + '_'
      // 添加主菜唯一标识的信息
      if (this.pageinfo.spec_list && this.pageinfo.spec_list.length) {
        this.pageinfo.spec_list.forEach((items, index) => {
          items.list.forEach((itm, idx) => {
            if (itm.ischeck) {
              var mainSpecObj = {}
              mainSpecObj.type = 'spec'
              mainSpecObj.name = itm.name
              mainSpecObj.spec_id = items.id_
              mainSpecObj.id = itm.id_
              this.uniqueness_number += items.id_ + '_' + itm.id_ + '_'
              this.productParam.push(mainSpecObj)
            }
          })
        })
      }

      if (this.pageinfo.properties_list && this.pageinfo.properties_list.length) {
        this.pageinfo.properties_list.forEach((items, index) => {
          var mainpropertiesObj = {}
          mainpropertiesObj.type = 'properties'
          mainpropertiesObj.data = []
          items.lists.forEach((itm, idx) => {
            if (itm.ischeck) {
              var sonObj = {}
              sonObj.id = itm.id
              sonObj.list_id = items.id_
              sonObj.name = itm.name
              this.uniqueness_number += items.id_ + '_' + itm.id + '_'
              mainpropertiesObj.data.push(sonObj)
            }
          })
          this.productParam.push(mainpropertiesObj)
        })
      }

      // 附属菜拼接
      if (this.pageinfo.subsidiary_piece && this.pageinfo.subsidiary_piece.length) {
        this.pageinfo.subsidiary_piece.forEach((items, index) => {
          items.goods.forEach((itm, idx) => {
            if (itm.counts > 0) {
              // 没有规格属性的商品
              if (!itm.has_spec && !itm.has_format) {
                this.uniqueness_number += itm.product_id + '_'
                this.uniqueness_number += itm.counts + '_'
              }

              // 只有规格的商品
              if (itm.has_spec && !itm.has_format) {
                itm.allSelect.forEach((it, id) => {
                  if (it.counts > 0) {
                    this.uniqueness_number += itm.product_id + '_'
                    it.spec.forEach((a, b) => {
                      this.uniqueness_number += a.spec_val_sid + '_' + a.spec_val_id + '_'
                    })
                    this.uniqueness_number += it.counts + '_'
                  }
                })
              }

              // 只有属性的商品
              if (!itm.has_spec && itm.has_format) {
                itm.allSelect.forEach((it, id) => {
                  if (it.formatList.length > 0) {
                    it.formatList.forEach((c, d) => {
                      if (c.counts > 0) {
                        this.uniqueness_number += itm.product_id + '_'
                        if (c.specId) {
                          this.uniqueness_number += c.specId + '_' + c.counts + '_'
                        } else {
                          this.uniqueness_number += c.counts + '_'
                        }
                      }
                    })
                  }
                })
              }

              // 规格属性全都有的附属菜
              if (itm.has_spec && itm.has_format) {
                itm.allSelect.forEach((it, id) => {
                  if (it.counts > 0) {
                    this.uniqueness_number += itm.product_id + '_'
                    it.spec.forEach((a, b) => {
                      this.uniqueness_number += a.spec_val_sid + '_' + a.spec_val_id + '_'
                    })
                    this.uniqueness_number += it.counts + '_'
                  }
                  if (it.formatList.length > 0) {
                    it.formatList.forEach((c, d) => {
                      if (c.counts > 0) {
                        this.uniqueness_number += itm.product_id + '_'
                        c.spec.forEach((x, y) => {
                          this.uniqueness_number += x.spec_val_sid + '_' + x.spec_val_id + '_'
                        })
                        this.uniqueness_number += c.specId + '_' + c.counts + '_'
                      }
                    })
                  }
                })
              }
            }
          })
        })
      }
    },

    // product值获取
    getproductParam() {
      if (this.pageinfo.subsidiary_piece && this.pageinfo.subsidiary_piece.length) {
        this.pageinfo.subsidiary_piece.forEach((items, index) => {
          items.goods.forEach((itm, idx) => {
            if (itm.counts > 0) {
              if (!itm.has_spec && !itm.has_format) {
                // 什么都没有的菜品
                var subsidiaryObj = {}
                // 套餐
                if (this.pageinfo.is_package_goods) {
                  subsidiaryObj.package_id = this.pageinfo.product_id
                }
                subsidiaryObj.productId = itm.product_id
                subsidiaryObj.productName = itm.product_name
                subsidiaryObj.productPrice = itm.product_price
                subsidiaryObj.count = itm.counts
                subsidiaryObj.host_goods_id = this.pageinfo.is_subsidiary_goods ? this.pageinfo.product_id : ''
                subsidiaryObj.uniqueness_number = this.uniqueness_number
                subsidiaryObj.productParam = []
                this.allGoodsList.push(subsidiaryObj)
              }

              if (itm.has_spec && !itm.has_format) {
                // 只有规格的商品
                itm.allSelect.forEach((a, b) => {
                  if (a.counts > 0) {
                    let subsidiaryObj = {}
                    subsidiaryObj.productId = itm.product_id
                    subsidiaryObj.productName = itm.product_name
                    subsidiaryObj.productPrice = a.price
                    subsidiaryObj.count = a.counts
                    subsidiaryObj.host_goods_id = this.pageinfo.product_id
                    subsidiaryObj.uniqueness_number = this.uniqueness_number
                    subsidiaryObj.productParam = []
                    a.spec.forEach((specitem, specindex) => {
                      let specObj = {}
                      specObj.type = 'spec'
                      specObj.name = specitem.spec_val_name
                      specObj.spec_id = specitem.spec_val_sid
                      specObj.id = specitem.spec_val_id
                      subsidiaryObj.productParam.push(specObj)
                      console.log(subsidiaryObj)
                    })
                    this.allGoodsList.push(subsidiaryObj)
                  }
                })
              }

              if (!itm.has_spec && itm.has_format) {
                // 只有属性的商品
                itm.allSelect.forEach((a, b) => {
                  if (a.formatList) {
                    a.formatList.forEach((formatitem, formatindex) => {
                      if (formatitem.counts > 0) {
                        let subsidiaryObj = {}
                        subsidiaryObj.productId = itm.product_id
                        subsidiaryObj.productName = itm.product_name
                        subsidiaryObj.productPrice = itm.product_price
                        subsidiaryObj.count = formatitem.counts
                        subsidiaryObj.host_goods_id = this.pageinfo.product_id
                        subsidiaryObj.uniqueness_number = this.uniqueness_number
                        subsidiaryObj.productParam = []
                        if (formatitem.counts > 0) {
                          if (formatitem.selectformat) {
                            formatitem.selectformat.forEach((proitem, proindex) => {
                              let proObj = {}
                              proObj.type = 'properties'
                              proObj.data = []
                              proitem.forEach((pro) => {
                                let selectproObj = {}
                                selectproObj.id = pro.id
                                selectproObj.list_id = pro.list_id
                                selectproObj.name = pro.name
                                proObj.data.push(selectproObj)
                              })
                              subsidiaryObj.productParam.push(proObj)
                            })
                          }
                        }
                        this.allGoodsList.push(subsidiaryObj)
                      }
                    })
                  }
                })
              }

              // 什么都有的商品
              if (itm.has_spec && itm.has_format) {
                // 啥都有的附属菜
                itm.allSelect.forEach((it, id) => {
                  if (it.counts > 0) {
                    let subsidiaryObj = {}
                    subsidiaryObj.productName = itm.product_name
                    subsidiaryObj.productId = itm.product_id
                    subsidiaryObj.productPrice = it.price
                    subsidiaryObj.count = it.counts
                    subsidiaryObj.host_goods_id = this.pageinfo.product_id
                    subsidiaryObj.uniqueness_number = this.uniqueness_number
                    subsidiaryObj.productParam = []
                    it.spec.forEach((specitem, specindex) => {
                      let specObj = {}
                      specObj.type = 'spec'
                      specObj.name = specitem.spec_val_name
                      specObj.spec_id = specitem.spec_val_sid
                      specObj.id = specitem.spec_val_id
                      subsidiaryObj.productParam.push(specObj)
                      console.log(subsidiaryObj)
                    })
                    this.allGoodsList.push(subsidiaryObj)
                  }

                  if (it.formatList) {
                    it.formatList.forEach((a, b) => {
                      if (a.counts > 0) {
                        let subsidiaryObj = {}
                        subsidiaryObj.productId = itm.product_id
                        subsidiaryObj.productName = itm.product_name
                        subsidiaryObj.productPrice = a.price
                        subsidiaryObj.count = a.counts
                        subsidiaryObj.host_goods_id = this.pageinfo.product_id
                        subsidiaryObj.uniqueness_number = this.uniqueness_number
                        subsidiaryObj.productParam = []
                        a.spec.forEach((specitem, specindex) => {
                          let specObj = {}
                          specObj.type = 'spec'
                          specObj.name = specitem.spec_val_name
                          specObj.spec_id = specitem.spec_val_sid
                          specObj.id = specitem.spec_val_id
                          subsidiaryObj.productParam.push(specObj)
                          console.log(subsidiaryObj)
                        })

                        if (a.selectformat) {
                          a.selectformat.forEach((proitem, proindex) => {
                            if (proitem) {
                              let proObj = {}
                              proObj.type = 'properties'
                              proObj.data = []
                              proitem.forEach((pro) => {
                                let selectproObj = {}
                                selectproObj.id = pro.id
                                selectproObj.list_id = pro.list_id
                                selectproObj.name = pro.name
                                proObj.data.push(selectproObj)
                              })
                              subsidiaryObj.productParam.push(proObj)
                            }
                          })
                        }
                        this.allGoodsList.push(subsidiaryObj)
                      }
                    })
                  }
                })
              }
            }
          })
        })
      }
    },

    saveInfo(e) {
      this.pageinfo.subsidiary_piece.forEach((items, index) => {
        if (items.id_sp == e.id_sp) {
          items = e
          this.$set(this.pageinfo.subsidiary_piece, index, items)
        }
      })
    },

    // 添加刷新动画
    addanimate() {
      this.loadingdata = true
      this.pageinfo = ''
      this.nowspec = ''
      this.nowformat = ''
      this.getfoodDetails()
      this.animateshow = true
      setTimeout(() => {
        this.animateshow = false
      }, 500)
    },
  },
}
</script>

<style lang="less" scoped>
.ant-switch-checked {
  background: #18c6b6 !important;
}
@rem: 192; //定义页面尺寸
.body_cashier_container {
  width: 100%;
  height: 86%;
  display: flex;
  overflow: hidden;
  .details_container {
    width: 100%;
    height: 100%;
    background-color: #faf8f6;
    border-radius: 10 / @rem * 1rem;
    box-sizing: border-box;
    overflow: hidden;
    .title_bar {
      width: 100%;
      height: 9%;
      background-color: #ffffff;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 0 30 / @rem * 1rem;
      .title_text {
        font-size: 24 / @rem * 1rem;
        font-weight: 500;
        color: #666666;
      }
    }

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

    .details_content {
      width: 100%;
      height: 78%;
      box-sizing: border-box;
      user-select: none;
      .slider_content {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: scroll;
        position: relative;
        -webkit-overflow-scrolling: touch;
        .food_details_info {
          width: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          align-items: center;
          padding: 0 44 / @rem * 1rem;
          .foodname {
            width: 100%;
            height: 110 / @rem * 1rem;
            border-bottom: dashed 1px #e2e2e2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left_name {
              font-size: 36 / @rem * 1rem;
              font-weight: bold;
              letter-spacing: 0px;
              color: #222222;
            }
            .right_price {
              font-size: 30 / @rem * 1rem;
              font-weight: bold;
              color: #222;
              span {
                font-size: 30 / @rem * 1rem;
                line-height: 36 / @rem * 1rem;
              }
            }
          }

          .food_spec_container {
            width: 100%;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            margin-top: 30 / @rem * 1rem;
            .food_spec_list {
              width: 100%;
              display: flex;
              align-items: center;
              flex-direction: column;
              .foodspec_items {
                width: 100%;
                display: flex;
                align-items: flex-start;
                margin-bottom: 25 / @rem * 1rem;
                .left_spec_keyname {
                  line-height: 45 / @rem * 1rem;
                  font-size: 22 / @rem * 1rem;
                  font-weight: 500;
                  color: #666666;
                  white-space: nowrap;
                }
                .specList {
                  display: flex;
                  flex-wrap: wrap;
                  .spec_items {
                    padding: 0 8px;
                    min-width: 120 / @rem * 1rem;
                    height: 45 / @rem * 1rem;
                    border-radius: 6 / @rem * 1rem;
                    border: solid 1 / @rem * 1rem #e2e2e2;
                    font-size: 20 / @rem * 1rem;
                    font-weight: 500;
                    line-height: 45 / @rem * 1rem;
                    color: #666666;
                    text-align: center;
                    margin-right: 20 / @rem * 1rem;
                    margin-bottom: 15 / @rem * 1rem;
                    box-sizing: border-box;
                  }
                  .spec_items_active {
                    background-color: #18c6b6;
                    border: solid 1 / @rem * 1rem #18c6b6;
                    color: #ffffff;
                  }
                }
              }
            }
          }

          .accessory_dish_container {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            margin-top: 10 / @rem * 1rem #18c6b6;
            .accessory_dish_list {
              width: 100%;
              display: flex;
              flex-direction: column;
              .accessoryDish_items {
                width: 100%;
                display: flex;
                flex-direction: column;
                .accessoryList_name {
                  font-size: 24 / @rem * 1rem;
                  font-weight: bold;
                  color: #222222;
                  margin-bottom: 10 / @rem * 1rem;
                  .package_maxnum {
                    margin-left: 10px;
                    color: #19c6b6;
                  }
                }
              }
            }
          }
        }
      }

      .slider_content::-webkit-scrollbar {
        width: 0;
      }
    }

    .bottom_bar {
      width: 100%;
      height: 13%;
      background-color: #ffffff;
      border-top: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      .cancel_btn {
        width: 230 / @rem * 1rem;
        height: 75 / @rem * 1rem;
        background-color: #e7e7e7;
        border-radius: 10 / @rem * 1rem;
        text-align: center;
        line-height: 75 / @rem * 1rem;
        font-size: 30 / @rem * 1rem;
        font-weight: bold;
        color: #666666;
        margin-right: 45 / @rem * 1rem;
        cursor: pointer;
      }
      .confirm_btn {
        width: 230 / @rem * 1rem;
        height: 75 / @rem * 1rem;
        background-color: #18c6b6;
        border-radius: 10 / @rem * 1rem;
        text-align: center;
        line-height: 75 / @rem * 1rem;
        font-size: 30 / @rem * 1rem;
        font-weight: bold;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
}
</style>