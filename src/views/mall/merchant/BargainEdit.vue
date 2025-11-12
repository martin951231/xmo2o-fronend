<template>
    <div class="mt-10 mb-20 mh-full">
        <a-form-model
            v-bind="{
                labelCol: { span: 4 },
                wrapperCol: { span: 10 },
            }"
            :model="formData"
            :rules="rules"
            ref="form"
            >
            <a-card style="margin-top: 10px" title="基本信息" :bordered="false">
              <a-form-model-item label="活动商品" prop="goods_info">
                <a-button @click="addProduct()" type="primary"> 添加商品 </a-button>
              </a-form-model-item>
              <a-form-model-item :wrapper-col="{ span: 20, offset: 4 }">
                <a-table
                  v-show="goodsList.length"
                  :columns="columns"
                  :data-source="goodsList"
                  rowKey="goods_id"
                  class="mt-20"
                  :childrenColumnName="'sku_info'"
                  :defaultExpandAllRows="true"
                  :scroll="{ x: false }"
                >
                        <span slot="name" slot-scope="text, record">
                            <a-avatar shape="square" :size="64" :src="record.image" />
                            <span class="ml-10 name">{{ text }}</span>
                        </span>
                  <span slot="skuStr" slot-scope="text,record">
                            <span v-if="record.sku_info && record.sku_info.goods_type=='sku'">
                                多规格
                            </span>
                            <span v-else>
                                {{text?text:'----'}}
                            </span>
                        </span>
                  <span slot="actStockNumTitle">
                            活动库存
                            <a-tooltip trigger="“hover">
                                <template slot="title">设置每个sku的活动库存</template>
                                <a-icon class="ml-10" type="question-circle" />
                            </a-tooltip>
                        </span>
                  <span slot="actStockNum" slot-scope="text,record">
                            <span v-if="record.sku_info && record.sku_info.length">
                                ----
                            </span>
                            <span v-else>
                                <a-form-item style="margin: -5px 0" prop="act_stock_num">
                                    <!-- -1不限库存 -->
                                    <a-input-number
                                      v-if="record.stock_num == -1"
                                      :min="-1"
                                      v-model="record.act_stock_num"
                                      @change="handleChange(record.act_stock_num, record, 'act_stock_num')"
                                    />
                                    <a-input-number
                                      v-else
                                      :min="0"
                                      :max="record.stock_num - 0"
                                      v-model="record.act_stock_num"
                                      @change="handleChange(record.act_stock_num, record, 'act_stock_num')"
                                    />
                                </a-form-item>
                            </span>
                        </span>
                  <span slot="price" slot-scope="text,record" class="cr-red">
                            <span v-if="record.sku_info && record.sku_info.goods_type=='sku'">
                               ￥{{ record.min_price }} ~ ￥{{ record.max_price }}
                            </span>
                            <span v-else>
                                ￥{{ text }}
                            </span>
                        </span>
                  <span slot="actPriceTitle">
                            活动价
                            <a-tooltip trigger="“hover">
                                <template slot="title">设置每个商品的活动价</template>
                                <a-icon class="ml-10" type="question-circle" />
                            </a-tooltip>
                        </span>
                  <span slot="actPrice" slot-scope="text,record">
                            <span v-if="record.sku_info && record.sku_info.length">
                                ----
                            </span>
                            <span v-else>
                                <a-form-item style="margin: -5px 0" prop="act_price">
                                    <a-input-number 
                                      :disabled = disabled_status
                                      :min="0"
                                      :max="record.price - 0"
                                      v-model="record.act_price"
                                      @change="handleChange(record.act_price, record, 'act_price')"
                                    />
                                </a-form-item>
                            </span>
                        </span>
                  <span slot="action" slot-scope="text,record">
                            <a class="ml-10 inline-block" @click="removeGoods(record)">删除</a>
                        </span>
                </a-table>
                </a-form-model-item>
<!--                <a-form-model-item label="活动时间" prop="time">-->
<!--                    <a-range-picker-->
<!--                        :disabled="formData.status == 2 || formData.status == 1 ? true : false"-->
<!--                        :ranges="{-->
<!--                            今日: [moment(), moment()],-->
<!--                            近7天: [moment(), moment().add(7, 'days')],-->
<!--                            近15天: [moment(), moment().add(15, 'days')],-->
<!--                            近30天: [moment(), moment().add(30, 'days')],-->
<!--                        }"-->
<!--                        :show-time="{ format: 'HH:mm' }"-->
<!--                        :value="formData.time"-->
<!--                        format="YYYY-MM-DD HH:mm"-->
<!--                        @change="onDateRangeChange"-->
<!--                        style="width: 100%"-->
<!--                    />-->
<!--                </a-form-model-item>-->
              <a-form-model-item label="活动时间" required>
                <a-form-model-item :style="{ display: 'inline-block' }" prop="start_time" ref="startTime" :autoLink="false">
                  <a-date-picker
                    :disabled="formData.status == 2 || formData.status == 1 ? true : false"
                    v-model="start_time"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    :disabled-date="disabledStartDate"
                    placeholder="请选择活动开始时间"
                    @change="onDateStartChange"
                    :getCalendarContainer="
              triggerNode => {
                  return triggerNode.parentNode
              }
          "
                  />
                </a-form-model-item>
                <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
            -
          </span>
                <a-form-model-item prop="end_time" :style="{ display: 'inline-block' }" ref="endTime" :autoLink="false">
                  <a-date-picker
                    :disabled="formData.status == 2 ? true : false"
                    v-model="end_time"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    :disabled-date="disabledEndDate"
                    placeholder="请选择活动结束时间"
                    @change="onDateEndChange"
                    :getCalendarContainer="
              triggerNode => {
                  return triggerNode.parentNode
              }
          "
                  />
                </a-form-model-item>
              </a-form-model-item>
              <a-form-model-item label="砍价有效时间" prop="affect_time" help="有效时间不能小于4小时">
                <a-input-number
                  style="width: 180px;"
                  :min="4"
                  v-model="formData.affect_time"
                  placeholder="" />（小时）
              </a-form-model-item>
              <a-form-model-item label="首刀砍价最小比例" prop="bar_first_per_min" help="请填写1-90之间正整数">
                <a-input-number
                  style="width: 80px;"
                  :min="1"
                  :max="90"
                  v-model="formData.bar_first_per_min"
                  placeholder="" /> %
              </a-form-model-item>
              <a-form-model-item label="首刀砍价最大比例" prop="bar_first_per_max" help="请填写1-90之间正整数">
                <a-input-number
                  style="width: 80px;"
                  :min="1"
                  :max="90"
                  v-model="formData.bar_first_per_max"
                  placeholder="" /> %
              </a-form-model-item>
              <a-form-model-item label="帮砍人数" prop="help_bargain_people_num" help="当帮砍人数到达设置人数，商品将砍到底价，请填写2-2000之间正整数">
                <a-input-number
                  style="width: 180px;"
                  :min="2"
                  :max="2000"
                  v-model="formData.help_bargain_people_num"
                  placeholder=""/>
              </a-form-model-item>
              <a-form-model-item label="砍价过程中能否支付">
                <a-switch checked-children="开" un-checked-children="关" v-model="formData.bargain_can_pay" />
              </a-form-model-item>
              <a-form-model-item label="每人帮砍次数设置">
                    <a-radio-group v-model="formData.help_bargain_times">
                        <a-radio :value="1"> 每人总共只可帮砍1次 </a-radio>
                        <a-radio :value="2"> 每人每天可帮砍1次 </a-radio>
                    </a-radio-group>
              </a-form-model-item>
            </a-card>
            <a-card style="margin-top: 10px" title="优惠信息" :bordered="false">
                <a-form-model-item label="优惠是否同享" prop="is_discount_share">
                    <a-radio-group v-model="formData.is_discount_share">
                        <a-radio :value="1"> 是 </a-radio>
                        <a-radio :value="2"> 否 </a-radio>
                    </a-radio-group>
                    <div v-if="formData.is_discount_share == 1">
                        <a-checkbox-group v-model="formData.share_discount">
                        <a-checkbox value="1"> 商家会员卡 </a-checkbox>
                        <a-checkbox value="2"> 商家优惠券 </a-checkbox>
                        </a-checkbox-group>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="限购" prop="buy_limit" help="0代表不限购，请输入0~999正整数">
                    <span class="mr-10">每人最多可参与</span>
                    <a-input-number :min="0" :max="999" v-model="formData.buy_limit" />
                    <span class="ml-10">次</span>
                </a-form-model-item>
            </a-card>

            <!-- 失效不显示保存 -->
            <a-form-model-item
                :wrapper-col="{ span: 16, offset: 2 }"
                v-if="formData.status != 2">
                <div class="mt-20 mb-20">
                    <a-button type="primary" @click="saveData()"> 保存 </a-button>
                </div>
            </a-form-model-item>
        </a-form-model>
        <!-- group  shipping type="radio"-->
        <select-goods
            ref="selectGoods"
            :storeId="store_id"
            source="bargain"
            type="radio"
            :startTime="formData.start_time"
            :endTime="formData.end_time"
            @submit="selecrGoodsSubmit"
            :selectedList="goodsList"
            />
    </div>
</template>
<script>
import mallMerchantApi from '@/api/mall/merchant/index'
import moment from 'moment'
import SelectGoods from './modules/SelectGoods'
import { watchMixin } from '@/utils/mixin'
export default {
    name: 'BragainEdit',
    mixins: [watchMixin],
    components: { SelectGoods },
    data() {
        return {
            disabled_status: false,
            store_id: '', // 店铺id
            id: '', // 活动id
            // 表单数据
            formData: {
                time: [],
                start_time: '', // 活动开始时间
                end_time: '', // 活动结束时间
                affect_time: '', // 砍价有效时间
                bar_first_per_min: '', // 首刀最小比例
                bar_first_per_max: '', // 首刀最大比例
                help_bargain_people_num: '', // 帮砍人数
                is_discount_share: 1, // 是否优惠同享 1开启 2关闭
                share_discount: [],
                buy_limit: 0, // 每人最多可参与次数
                goods_info: '',
                bargain_can_pay: false,//砍价过程中能否支付
                help_bargain_times: 1,//1-每人总共只可帮砍1次,2-每人每天可帮砍1次
            },
            // simulate_group_radio: 1, // 1 所有未拼成的团 2 机器人参与人数大于等于几人的团
            // all_machine_into_time: '', // 所有未拼成的团介入成团时间
            // machine_into_time: '', // 机器人参与人数大于等于几人的团介入成团时间
            // 表单校验规则
            rules: {
                // time: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
                start_time: [{ required: true, message: '请选择活动开始时间', trigger: ['blur', 'change'] }],
                end_time: [{ required: true, message: '请选择活动结束时间', trigger: ['blur', 'change'] }],
                help_bargain_people_num: [{ required: true, message: '请输入帮砍人数', trigger: 'blur' }],
                bar_first_per_min: [{required: true, message: '请输入首刀最小比例', trigger: 'blur' }],
                bar_first_per_max: [{required: true, message: '请输入首刀最大比例', trigger: 'blur' }],
                is_discount_share: [{ required: true, message: '请选择优惠是否同享', trigger: 'blur' }],
                affect_time: [{ required: true, message: '请选择砍价有效时间', trigger: 'blur' }],
                act_stock_num: [{ required: true, message: '请输入商品活动库存', trigger: 'blur' }],
                act_price: [{ required: true, message: '请输入商品活动价', trigger: 'blur' }],
                buy_limit:[{ required: true, message: '请输入每人最多可参与次数请输入每人最多可参与次数', trigger: 'blur' }],
            },
            columns: [
                {
                    title: '商品信息',
                    dataIndex: 'name',
                    scopedSlots: { customRender: 'name' },
                },
                {
                    title: '规格',
                    dataIndex: 'sku_str',
                    scopedSlots: { customRender: 'skuStr' },
                },
                {
                    title: '当前库存',
                    dataIndex: 'stock_num',
                    scopedSlots: { customRender: 'stockNum' },
                },
                {
                    dataIndex: 'act_stock_num',
                    key: 'act_stock_num',
                    slots: { title: 'actStockNumTitle' },
                    scopedSlots: { customRender: 'actStockNum' },
                },
                {
                    title: '原价格',
                    dataIndex: 'price',
                    scopedSlots: { customRender: 'price' },
                },
                {
                    dataIndex: 'act_price',
                    key: 'act_price',
                    slots: { title: 'actPriceTitle' },
                    scopedSlots: { customRender: 'actPrice' },
                },
                {
                    title: '操作',
                    dataIndex: 'goods_id',
                    width: '100px',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            goodsList: [],
            act_price: '', // 批量设置活动价
            act_stock_num: '', // 批量设置活动库存
            affect_time: {
                // day: '',
                hours: '',
                // minutes: ''
            },
            all_noGroup_time: { // 所有未拼成的团
                hours: '',
                minutes: ''
            },
            simulate_group_time: { // 参团人数大于的团
                hours: '',
                minutes: ''
            },
            act_price_visible: false, // 批量设置活动价弹框显隐
            act_stock_num_visible: false, // 批量设置活动库存弹框显隐
            start_time: null,
            end_time: null
        }
    },
    watch: {
		'$route.path' (val) {
		  if (val == '/merchant/merchant.mall/editBargain') {
		    this.id = ''
		    this.resetForm()
		  }
		},
        '$route.query.store_id'(val) {
            if (val) {
                this.store_id = val
                this.resetForm()
            }
        },
        '$route.query.id'(val) {
            this.$nextTick(() => {
                if (this.activatedFlag) {
                    if (val) {
                        this.id = val
                        this.resetForm()
                        this.getFormData()
                    } else {
                        this.id = ''
                        this.resetForm()
                    }
                } else {
                    this.id = ''
                    this.resetForm()
                }
            })
        }
    },
    created() {
        this.store_id = this.$route.query.store_id
        this.resetForm()
        if (this.$route.query.id) {
            this.id = this.$route.query.id
            this.getFormData()
        }
    },
    methods: {
        moment,
        // 表单信息
        getFormData() {
            this.request(mallMerchantApi.getBargainInfo, { id: this.id }).then((res) => {
                console.log(res)
                // res.time = [moment(res.start_time), moment(res.end_time)]
              this.start_time = moment(res.start_time)
              this.end_time = moment(res.end_time)
                if (res.is_discount_share == 1) {
                    res.share_discount = []
                    if (res.discount_card == 1) {
                        res.share_discount.push('1')
                    }
                    if (res.discount_coupon == 1) {
                        res.share_discount.push('2')
                    }
                }
                // 砍价有效时间
                if (res.affect_time) {
                    this.affect_time = this.timeStamp(res.affect_time)
                }

                // // 模拟参团是否开启
                // if (res.is_open_group && res.is_open_group == 1) {
                //     res.is_open_group = true
                // } else {
                //     res.is_open_group = false
                // }

                // // 模拟参团介入时间
                // if (res.simulate_group_num && res.simulate_group_num != 0) {
                //     this.simulate_group_time = this.timeStamp(res.machine_into_time)
                //     this.machine_into_time = res.machine_into_time
                // } else {
                //     this.all_noGroup_time =  this.timeStamp(res.machine_into_time)
                //     this.all_machine_into_time = res.machine_into_time
                // }

                // console.log(this.all_machine_into_time,'this.all_machine_into_time')

                this.$set(this, 'formData', res)
                this.formData.bargain_can_pay = res.bargain_can_pay == 1?true:false
                this.formData.help_bargain_times = res.help_bargain_times
                this.disabled_status = res.is_began==1 ? true : false;
                let goodsList = res.goods_info || []
                this.goodsList = goodsList.length?goodsList.map((item) => {
                    item.type = 'bargain'
                    if (item.sku_info && item.sku_info.length) {
                        item.sku_info.forEach((item_sku) => {
                            item_sku.name = item.name
                            item_sku.image = item.image
                            if (!item_sku.act_stock_num) {
                                item_sku.act_stock_num = 0
                            }
                            if (!item_sku.act_price) {
                                item_sku.act_price = 0
                            }
                        })
                    }
                    if (item.sku_info && !item.sku_info.length) {
                        item.act_stock_num = 0
                        item.act_price = 0
                        item.sku_info = ''
                    }
                    return item
                }):[]
            })
        },
        // 时间转化
        timeStamp( second_time ){
            let time = parseInt(second_time);
            let day, hours, minutes;
            if( parseInt(second_time )> 60){
                let second = parseInt(second_time) % 60;
                let minutes = parseInt(second_time / 60);
                if( minutes > 60 ){
                    minutes = parseInt(second_time / 60) % 60;
                    hours = parseInt( parseInt(second_time / 60) /60 );
                    if( hours > 24 ){
                        hours = parseInt( parseInt(second_time / 60) /60 ) % 24;
                        day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                    }
                }
            }
            return {
                day,
                hours,
                minutes
            };
        },
        // // 监听日期选择变化
        // onDateRangeChange(date, dateString) {
        //     // 更新表单数据
        //     this.$set(this.formData, 'time', [date[0], date[1]])
        //     this.$set(this.formData, 'start_time', dateString[0])
        //     this.$set(this.formData, 'end_time', dateString[1])
        // },
      disabledStartDate(current) {
        if (!this.$route.query.id) {
          return current && current < moment().subtract(1, 'days')
        } else {
          return false
        }
      },
      disabledEndDate(endValue) {
        const startValue = this.start_time
        if(!startValue){
          return endValue && endValue < moment().subtract(1, 'days')
        }else{
          return startValue.valueOf() >= endValue.valueOf()
        }
      },
      onDateStartChange(start_time_moment, start_time) {
        this.$set(this.formData, 'start_time', start_time)
        this.$refs.startTime.onFieldChange()
      },
      onDateEndChange(end_time_moment, end_time) {
        const startValue = moment(this.formData.start_time).valueOf()
        const endValue = moment(end_time).valueOf()
        if (endValue < startValue) {
          this.$message.error('活动结束时间必须大于活动开始时间！')
          return
        }
        this.$set(this.formData, 'end_time', end_time)
        this.$refs.endTime.onFieldChange()
      },
        // // 添加商品
        // addProduct() {
        //     if (!this.formData.time.length) {
        //         this.$message.error('请先选择活动的开始时间和结束时间！')
        //         return
        //     }
        //     this.$refs.selectGoods.openDialog()
        // },
      // 添加商品
      addProduct() {
        let { activeTime, message } = this.activeTimeCheck()
        if (!activeTime && message) {
          this.$message.error(message)
          return
        }
        this.$refs.selectGoods.openDialog()
      },
      // 活动时间校验
      activeTimeCheck() {
        let activeTime = true,
          message = ''
        if (!this.start_time && !this.end_time) {
          message = '请先选择活动的开始时间和结束时间！'
          activeTime = false
        } else if (!this.start_time) {
          message = '请先选择活动的开始时间！'
          activeTime = false
        } else if (!this.end_time) {
          message = '请先选择活动的结束时间！'
          activeTime = false
        }
        return {
          activeTime,
          message
        }
      },
        // 选择商品回调
        selecrGoodsSubmit(e) {
            console.log(e,'e-----selecrGoodsSubmit-----选择商品回调')
            e.goods = e.goods.map((item) => {
                item.type = 'bargain'
                if (item.sku_info && item.sku_info.length) {
                    item.sku_info.forEach((item_sku) => {
                        item_sku.goods_id = item.goods_id + '_' + item_sku.sku_id
                        item_sku.name = item.name
                        item_sku.image = item.image
                        if (!item_sku.act_stock_num) {
                            item_sku.act_stock_num = 0
                        }
                        if (!item_sku.act_price) {
                            item_sku.act_price = 0
                        }
                    })
                }
                if (item.sku_info && !item.sku_info.length) {
                    item.act_stock_num = 0
                    item.act_price = 0
                    item.sku_info = ''
                }
                return item
            })
            this.goodsList = e.goods
            this.$set(this.formData, 'goods_info', this.goodsList.length?this.goodsList[0]:'')
            console.log(this.goodsList,'this.goodsList')
        },
        // 删除商品
        removeGoods(record) {
            if (record.sku_id) {
                this.goodsList.forEach(item => {
                    if (item.sku_info && item.sku_info.length) {
                        item.sku_info.forEach((sku_item,sku_index) => {
                            if (sku_item.sku_id == record.sku_id) {
                                item.sku_info.splice(sku_index, 1)
                            }
                        })
                    }
                })
            } else {
                if (record.goods_id) {
                    for (var i = 0; i < this.goodsList.length; i++) {
                        if (this.goodsList[i].goods_id === record.goods_id) {
                            this.goodsList.splice(i, 1)
                        }
                    }
                }
            }

        },
        resetForm() {
            this.formData = this.$options.data().formData
            this.affect_time = this.$options.data().affect_time
            this.start_time = this.$options.data().start_time
            this.end_time = this.$options.data().end_time
            // this.all_noGroup_time = this.$options.data().all_noGroup_time
            // this.simulate_group_time = this.$options.data().simulate_group_time
            this.goodsList = []
            this.$forceUpdate()
        },
        // 活动价 || 活动库存设置
        handleChange(text,record,type) {
            this.goodsList = this.goodsList.map(item => {
                if (!record.sku_info) {
                    if (record.goods_id == item.goods_id) {
                        item[type] = text
                    }
                } else {
                    if (record.sku_id == item.sku_id) {
                        item[type] = text
                    }
                }
                return item
            })
        },
        // 批量设置拼团价 || 活动库存
        batchSet(e, type) {
            let min_price = 0
            this.goodsList.forEach(item => {
                if (!item.sku_info) {
                    min_price = item.price
                } else if (item.sku_info && item.sku_info.length) {
                    min_price = item.min_price
                }
            })

            if (type == 'act_price' && (Number(this.act_price) > Number(min_price))) {
                this.$message.error('活动价不能大于原价格')
                return
            } else {
                this.act_price_visible = false
                this.act_stock_num_visible = false
            }

            let stock_num = 0
            this.goodsList.forEach(item => {
                if (!item.sku_info) {
                    stock_num = item.stock_num
                } else if (item.sku_info && item.sku_info.length) {
                    stock_num = Math.min(...(item.sku_info.map(item => item.stock_num)))
                }
            })

            if (type == 'act_stock_num' && (Number(this.act_stock_num) > Number(stock_num))) {
                this.$message.error('活动库存不能大于当前库存')
                return
            } else {
                this.act_price_visible = false
                this.act_stock_num_visible = false
            }

            this.goodsList = this.goodsList.map(item => {
                if (!item.sku_info) {
                    item[type] = this[type]
                } else if (item.sku_info && item.sku_info.length) {
                    item.sku_info = item.sku_info.map(sku_item => {
                        if (type == 'act_price') {
                            sku_item.act_price = this.act_price
                        }
                        if (type == 'act_stock_num') {
                            sku_item.act_stock_num = this.act_stock_num
                        }
                        return sku_item
                    })
                }
                return item
            })
        },
        // 砍价有效时间
        affectTimeChange(e,type) {
            this.$set(this.affect_time, type, e)
            // 拼团有效时间校验
            let {day = 0,hours = 0,minutes = 0} = this.affect_time
            let affect_time = Number(day) * 24 * 60 * 60 + Number(hours) * 60 + Number(minutes) * 60
            this.$set(this.formData, 'affect_time', affect_time)
        },
        // // 模拟参团时间
        // machineIntoTime(e,type,radio) {
        //     if (radio == 1) {
        //         this.$set(this.all_noGroup_time, type, e)
        //         this.all_machine_into_time = Number(this.all_noGroup_time.hours) * 60  * 60 + Number(this.all_noGroup_time.minutes) * 60
        //         this.$set(this.formData, 'all_machine_into_time', this.all_machine_into_time)
        //     } else {
        //         this.$set(this.simulate_group_time, type, e)
        //         this.machine_into_time = Number(this.simulate_group_time.hours) * 60 * 60 + Number(this.simulate_group_time.minutes) * 60
        //         this.$set(this.formData, 'machine_into_time', this.machine_into_time)
        //     }
        // },
        // // 模拟参团change
        // openGroupChange() {
        //     if (!this.formData.is_open_group) {
        //         this.all_noGroup_time = this.$options.data().all_noGroup_time
        //         this.simulate_group_time = this.$options.data().simulate_group_time
        //         this.all_machine_into_time = this.$options.data().all_machine_into_time
        //         this.machine_into_time = this.$options.data().machine_into_time
        //     }
        // },
        //// 模拟参团校验
        // machineIntoCheck() {
        //     this.$refs.form.clearValidate()
        //     let val = this.simulate_group_radio
        //     console.log(this.all_machine_into_time,'this.all_machine_into_time---1')
        //     console.log(val,'simulate_group_radio')
        //     if (this.formData.is_open_group) {
        //         if (val == 1) {
        //             // 所有未拼成的团
        //             if (this.rules.simulate_group_num) {
        //                 this.$delete(this.rules,'simulate_group_num')
        //             }
        //             if (this.rules.machine_into_time) {
        //                 this.$delete(this.rules,'machine_into_time')
        //             }
        //             if (!this.all_machine_into_time) {
        //                 let rules = [
        //                     { required: true, message: '请选择模拟参团介入时间', trigger: 'blur' }
        //                 ]
        //                 this.$set(this.rules, 'all_machine_into_time',rules)
        //             }
        //         } else {
        //             // 部分参团
        //             if (this.rules.all_machine_into_time) {
        //                 this.$delete(this.rules,'all_machine_into_time')
        //             }
        //             if (!this.formData.simulate_group_num) {
        //                 let rulesNum = [
        //                     { required: true, message: '请输入模拟参团团数', trigger: 'blur' }
        //                 ]
        //                 this.$set(this.rules, 'simulate_group_num',rulesNum)
        //             }
        //             if (!this.formData.machine_into_time) {
        //                 let rules = [
        //                     { required: true, message: '请选择模拟参团介入时间', trigger: 'blur' }
        //                 ]
        //                 this.$set(this.rules, 'machine_into_time',rules)
        //             }
        //         }
        //     }
        // },
        // 提交表单
        saveData() {
            // this.machineIntoCheck()
            console.log(this.all_machine_into_time , 'all_machine_into_time ')
            console.log(this.formData,'this.formData')
            this.$refs.form.validate((valid) => {
                if (valid) {
                    console.log(this.goodsList,'this.goodsList')
                    let formData = this.formData
                    // 优惠同享校验
                    if (formData.is_discount_share == 1 && formData.share_discount.length == 0) {
                        this.$message.error('请选择优惠同享类型')
                        return
                    }
                    if (this.goodsList.length == 0) {
                        this.$message.error('请选择活动商品')
                        return
                    }
                    for (var i = 0; i < this.goodsList.length; i++) {
                        for (var j=0;j<this.goodsList[i].sku_info.length;j++) {
                            if(this.goodsList[i].sku_info[j].act_stock_num==0){
                                this.$message.error('活动库存不能为0')
                                return
                            }
                        }
                    }
                    // 活动库存校验
                    let actStockNumCheck = JSON.parse(JSON.stringify(this.goodsList)).filter(item => {
                        if (!item.sku_info || (item.sku_info && !item.sku_info.length)) {
                            if (item.act_stock_num && Number(item.act_stock_num) > Number(item.stock_num) && item.stock_num != -1) {
                                return item
                            }
                        } else if (item.sku_info && item.sku_info.length) {
                            item.sku_info = item.sku_info.filter(sku_item => {
                                if (sku_item.act_stock_num && Number(sku_item.act_stock_num) > Number(sku_item.stock_num) && sku_item.stock_num != -1) {
                                    return sku_item
                                }
                            })
                            if (item.sku_info.length) {
                                return item
                            }
                        }
                    }) || []
                    if (actStockNumCheck.length) {
                        this.$message.error('商品活动库存不能大于当前库存')
                        return
                    }

                    // 活动价校验
                    let actPricecheck = JSON.parse(JSON.stringify(this.goodsList)).filter(item => {
                        if (!item.sku_info || (item.sku_info && !item.sku_info.length)) {
                            if ((item.act_price == null || item.act_price == undefined || item.act_price == '') && item.act_price != 0) {
                                return item
                            }
                        } else if (item.sku_info && item.sku_info.length) {
                            item.sku_info = item.sku_info.filter(sku_item => {
                                if ((sku_item.act_price == null || sku_item.act_price == undefined || sku_item.act_price == '') && sku_item.act_price != 0) {
                                    return sku_item
                                }
                            })
                            if (item.sku_info.length) {
                                return item
                            }
                        }
                    }) || []
                    if (actPricecheck.length) {
                        this.$message.error('请设置商品的活动价')
                        return
                    }

                    // // 团长价校验
                    // if (formData.team_discount_price && this.goodsList.length) {
                    //     let sku_info = this.goodsList[0].sku_info || []
                    //     if (sku_info.length) {
                    //         let act_price = Math.min(...(sku_info.map(item => item.act_price - 0)))
                    //         if (Number(formData.team_discount_price) > Number(act_price)) {
                    //             this.$message.error('团长价不能大于拼团价')
                    //             return
                    //         }
                    //     } else {
                    //         if (Number(formData.team_discount_price) > Number(this.goodsList[0].act_price)) {
                    //             this.$message.error('团长价不能大于拼团价')
                    //             return
                    //         }
                    //     }
                    // }

                    if (formData.is_discount_share == 1) {
                        formData.discount_card = 0
                        formData.discount_coupon = 0
                        formData.share_discount.forEach((item) => {
                            if (item == 1) {
                                formData.discount_card = 1
                            } else if (item == 2) {
                                formData.discount_coupon = 1
                            }
                        })
                    }
                    formData.store_id = this.store_id
                    if (this.id) {
                        formData.id = this.id
                    }
                    if (this.goodsList.length || formData.goods_info) {
                        formData.goods_info = this.goodsList.length?this.goodsList[0]:''
                    }

                    let params = {
                        id: this.id,
                        store_id: this.store_id,
                        start_time: formData.start_time,
                        end_time: formData.end_time,
                        affect_time: formData.affect_time,
                        help_bargain_people_num: formData.help_bargain_people_num,
                        bar_first_per_min: formData.bar_first_per_min,
                        bar_first_per_max: formData.bar_first_per_max,
                        buy_limit: formData.buy_limit,
                        is_discount_share: formData.is_discount_share,
                        discount_card: formData.discount_card,
                        discount_coupon: formData.discount_coupon,
                        goods_info: formData.goods_info,
                        bargain_can_pay: formData.bargain_can_pay,
                        help_bargain_times: formData.help_bargain_times,
                    }

                    console.log(params,'params')
                    this.request(mallMerchantApi.bargainAdd, params).then((res) => {
                        this.resetForm()
                        if (this.id) {
                            this.getFormData()
                        }
                        this.$message.success('提交成功！');
                        this.$router.push({ path: '/merchant/merchant.mall/bargainList', query: { store_id: this.store_id } })
                        sessionStorage.setItem('bargainEdit', 1)
                    })
                } else {
                    console.log('error submit!!', this.formData)
                    return false
                }
            })
        },
    },
}
</script>
<style scoped>
.name {
    display: inline-block;
    max-width: 200px;
    white-space: wrap;
    word-break: break-all;
}
.simulate-group-num.ant-form-item {
    margin-bottom: 0;
}
</style>