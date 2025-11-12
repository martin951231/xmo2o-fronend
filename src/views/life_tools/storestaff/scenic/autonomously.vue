<template>
  <div class="page">
    <!-- <div id="printDom" >
      <div>
        <p>日期：2022-04-01</p>
        <div style="width: 30px; height: 30px;">
          <img style="width: 30px; height: 30px;" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp03%2F1Z921104Z92S8-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652493513&t=2ffd8ddf510aedaaf8f19566aeaba58f" alt="">
        </div>
      </div>
    </div> -->
    <a-row type="flex" justify="space-around" align="top" class="row">
      <a-col :span="8" class="col col_first">
        <div class="input_search">
          <a-input placeholder="门票名称" class="search_input" v-model="keyWords" allowClear @pressEnter="pressEnter" >
            <a-icon slot="prefix" type="search" style="color: #B8B8B8" />
          </a-input>
          <a-button class="search_btn" type="primary" @click="onSearch">搜索</a-button>
        </div>
        <a-form :label-col="{xs: { span: 24 },sm: { span: 3 }}" :wrapper-col="{xs: { span: 24 },sm: { span: 16 }}" style="padding-top:15px;">
          <a-form-item label="游玩日期：">
            <a-date-picker @change="onChange" :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" :allowClear="false" inputReadOnly :disabledDate="disabledDate" />
          </a-form-item>
        </a-form>

        <!-- 景区分类 -->
        <template>
          <div class="choice" >
            <div style="margin-right: 10px;">
              <a-button shape="circle" icon="left" @click="slidetoright" size="small" />
            </div>
            <div class="center_slider_container" id="slidercontent" ref="slidercontent">
              <div class="sliderList_content">
                <div
                  :class="tools_id==item.tools_id?'choice_content_select choice_content':'choice_content'"
                  v-for="item in scenicTypeList"
                  :key="item.tools_id"
                  @click="onChoiceType(item)"
                >{{ item.title }}</div>
              </div>
            </div>

            <div style="margin-left: 10px;">
              <a-button shape="circle" icon="right" @click="slidetoleft" size="small" />
            </div>
          </div>
        </template>

        <!-- 门票列表 -->
        <template>
          <div class="ticket">
            <div
              v-for="(item, index) in ticketList"
              :key="index"
              :class="item.stock_num==0?'ticket_dispaly_noselect':index === ticketIndex?'ticket_dispaly_select':'ticket_dispaly'"
              @click="onSelectTicket(item, index)"
            >
              <p class="title">{{ item.tools_title }} <span class="badge" v-if="item.stock_num!=0&&index === ticketIndex">{{ dataTable[0].num }}</span></p>
              <div class="type_price">
                <p class="type">{{ item.ticket_title }}</p>
                <p class="price"><span class="price_symbol">￥</span><span class="price_num">{{ item.price }}</span></p>
              </div>
              <div class="stock_limitation">
                <div class="stock_num">库存：{{ item.stock_num==-1?'无限库存':item.stock_num }}</div>
              </div>
            </div>
            <template >
              <a-pagination
                v-if="ticketList.length"
                v-model="page.current"
                @change="onPaginationChange"
                :defaultPageSize="4"
                :total="page.total"
                show-less-items
                style="margin-top: 10px; display: flex; justify-content:flex-end;"
              />
            </template>
          </div>
        </template>
      </a-col>

      <a-col :span="15" class="col col_second">
        <!-- 列表 -->
        <div class="table_data">
          <template>
            <a-table :columns="columns" :data-source="dataTable" :pagination="false">
              <div slot="num" slot-scope="text, record">
                <div class="add_num">
                  <a-button shape="circle" icon="minus" size="small" @click="onMinus(text, record)" :disabled="text==1?true:false"/>
                  <p class="person_num">{{ text }}</p>
                  <a-button shape="circle" icon="plus" size="small" @click="onAdd(text, record)" :disabled="text==ticketList[ticketIndex].stock_num || ticketList[ticketIndex].stock_num == 0?true:false" />
                </div>
              </div>
            </a-table>
          </template>
        </div>

        <!-- 支付 -->
        <div class="pay">
          <a-form :label-col="{xs: { span: 24 },sm: { span: 5 }}" :wrapper-col="{xs: { span: 24 },sm: { span: 16 }}" style="padding-top:15px;" labelAlign="left">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="游玩日期：" >
                  <a-date-picker @change="onChange" :value="moment(choiceMoment, 'YYYY-MM-DD')" :allowClear="false" disabled />
                </a-form-item>
              </a-col>

            </a-row>

            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="姓名：">
                  <a-input placeholder="请输入姓名" v-model="form.name" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="手机号：" >
                  <a-input placeholder="请输入手机号" v-model="form.phone" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <!-- 支付方式 -->
          <a-row :gutter="24">
            <a-col :span="7">
              <div :class="nowpayMethod == 'online'?'online_btnstyle':'btnstyle'">
                <div class="online_btn" @click="onPayType('online')">
                  <a-icon type="wechat" />
                  线上支付
                </div>
              </div>
            </a-col>
            <a-col :span="7">
              <div :class="nowpayMethod == 'offline'?'offline_btnstyle':'btnstyle'">
                <div class="offline_btn" @click="onPayType('offline')" >
                  <a-icon type="transaction" />
                  现金支付
                </div>
              </div>

            </a-col>
          </a-row>
          <div style="border: 1px solid #E8E8E8; margin: 50px 0;"></div>

          <!-- 支付按钮 -->
          <a-row :gutter="24">
            <a-col :span="12">
              <p class="order_total_money">
                <span>订单总金额：</span>
                <span class="money">￥{{ totalPrice&&totalPrice.total_price?totalPrice.total_price:'0.00' }}</span>
              </p>
            </a-col>
            <a-col :span="12">
              <a-button type="primary" size="large" style="width: 200px; height: 50px; border-radius: 7px;" @click="confrimPay">
                提交订单
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

    <!-- 支付方式弹框 -->
    <a-modal
      v-model="payMethodshow"
      wrapClassName="borderradius"
      :footer="null"
      :title="null"
      :centered="true"
      :width="nowpayMethod == 'offline' ? '30%' : '38%'"
      :maskClosable="false"
      :closable="false"
      :destroyOnClose="true"
      :bodyStyle="{ padding: 0 }"
    >
      <div class="alert_wrapper">
        <payModel
          :modelInfo="pageInfo"
          :vipMoney="vipMoney"
          :paymodeInfo="nowpayMethod"
          @comfirmOrder="comfirmPayOrder"
          @closemodel="closemodelfnc()"
        ></payModel>
      </div>
    </a-modal>

    <a-modal
      title="二维码打印"
      :visible="visibleCode"
      :closable="false"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <div class=""> 是否打印二维码 </div>
      <template slot="footer">
        <a-button type="primary" v-print="'#printer'" @click.stop="onconfirmCode">打印二维码</a-button>
        <a-button type="primary" @click.stop="onCloseCode">关闭</a-button>
      </template>
    </a-modal>
    <!-- <div class="main_body" id="printer">
      <div v-for="(item, index) in paySuccessDetail" :key="index" style="margin-bottom: 30px;">
        <p style="margin-bottom: 10px;">日期：{{ choiceMoment }}</p>
        <p>使用时间：{{ item.start_time }}</p>
        <div style="display: flex; align-items: center;">
          <div style="width:20px;line-height:16px; margin-right: 5px; font-size: 12px;">
            过期则不可使用
          </div>
          <img style="width: 110px; height: 110px;" :src="item.pay_code_img" alt="">
        </div>
      </div>
    </div> -->

    <div class="main_body" id="printer">
      <div style="margin-bottom: 5px;" v-for="(item, index) in paySuccessDetail" :key="index">
        <p style="margin-bottom: 10px; font-size: 14px; margin-left:15px;">日期：{{ choiceMoment }}</p>
        <p style="margin-bottom: 2px; font-size: 14px; margin-left: 35px;">使用时间：{{ item.start_time }}</p>
        <div style="display: flex; align-items: center;">
          <div style="width:20px;line-height:20px; margin-right: 0px; font-size: 14px;">
            过期不可使用
          </div>
          <img style="width: 160px; height: 160px;" :src="item.pay_code_img" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lifeToolsStorestaffApi from '@/api/life_tools/storestaff/index'
import moment from 'moment'
import TWEEN from '@tweenjs/tween.js'
import payModel from './modules/payModel.vue' // 支付方式弹框

  const columns = [
    {
      title: '景区名称',
      dataIndex: 'title',
      key: 'title',
			width: '10%'
    },
    {
      title: '门票',
      dataIndex: 'ticket',
      key: 'ticket',
			width: '10%'
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
			width: '10%'
    },
    {
      title: '人数',
      dataIndex: 'num',
      key: 'num',
			width: '10%',
      scopedSlots: { customRender: 'num' }
    }
  ]
  export default {
    name: 'OrderManage',
    components: {
      payModel
    },
    data () {
      return {
        visibleCode: false, // 打印二维码弹窗
				scenicTypeList: [{
          title: '全部',
          tools_id: ''
        }], // 门票分类列表
				tools_id: '', // 门票默认选中第一个值
				keyWords: '', // 输入门票名称
				choiceMoment: '', // 时间选择
				page: { // 分页
					current: 1,
					total: 0
				},
        form: { // 姓名手机号填写
          name: '',
          phone: ''
        },
        numTween: 0, // 滑动的距离
        leftscroll: 0, // 左边的距离

        dataTable: [], // 动态数据
        columns, // 第一行列表
        totalPrice: '', // 获取总金额
        pageInfo: '', // 打开model需要的数据
        vipMoney: 0.00, // 需要的总金额

        changemoneyShow: false, // 修改金额弹框开关

        payMethodshow: false, // 支付弹框
        nowpayMethod: '', // 当前支付的方式 offline - 线下支付   online - 线上支付

				// 门票列表
        ticketList: [],
        ticketIndex: -1, // 选中的门票index
        paySuccessDetail: [] // 支付成功的详情
      }
    },
    watch: {
      numTween (nval, oval) {
        new TWEEN.Tween({
          number: oval
        })
          .to(
            {
              number: nval
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
        function animate () {
          if (TWEEN.update()) {
            requestAnimationFrame(animate)
          }
        }
        animate()
      }
    },
		mounted () {
			this.getScenicType() // 获取景区分类
		},
    methods: {
      disabledDate (current) {
        console.log(current, '12312312312313')
        return current && current < moment().subtract(1, 'days') // 当天之前的不可选，不包括当天
        // return current && current < moment().endOf(‘day');当天之前的不可选，包括当天
       },
			// 获取景区分类
			getScenicType () {
				this.request(lifeToolsStorestaffApi.getScenic, {}).then((res) => {
					console.log(res, '-------门票分类----------')
          this.scenicTypeList = [{
            title: '全部',
            tools_id: ''
          }]
					res.map(value => {
            this.scenicTypeList.push(value)
          })
					// 默认选中第一个值
					if (this.scenicTypeList.length) {
						this.tools_id = this.scenicTypeList[0].tools_id
					} else {
						this.tools_id = ''
					}
					// 默认选择今天时间
					this.choiceMoment = moment().format('YYYY-MM-DD')
					this.getTicketList() // 获取门票列表
				})
			},

			// 获取门票列表
			getTicketList () {
				const params = {
					keywords: this.keyWords,
					select_date: this.choiceMoment,
					tools_id: this.tools_id,
					page: this.page.current,
					page_size: 4
				}
				this.request(lifeToolsStorestaffApi.getTicket, params).then((res) => {
					console.log(res, '-------门票列表----------')
					this.ticketList = res.list
					this.page.total = res.total
				})
			},

      slidetoleft () {
      if (this.numTween > -1) {
        this.numTween += 400
      } else {
        this.numTween = 0
      }
    },
    slidetoright () {
      if (this.numTween > -1) {
        this.numTween -= 400
      } else {
        this.numTween = 0
      }
    },

			// 选择景区分类
			onChoiceType (item) {
				this.tools_id = item.tools_id
				this.ticketIndex = -1 // 取消选中的门票
				this.dataTable = [] // 清空列表的数据
				this.getTicketList()
			},

			// 默认选择当前时间
			moment,
			getCurrentData () {
				return new Date().toLocaleDateString()
			},

      // 获取时间
      onChange (date, dateString) {
				// 选择的时间
				this.choiceMoment = dateString
				this.getTicketList()
      },

			// 点击搜索
			onSearch () {
				this.getTicketList()
			},
			// 回车搜索
			pressEnter () {
				this.getTicketList()
			},

      // 点击门票
      onSelectTicket (item, index) {
				if (item.stock_num == 0) {
					this.ticketIndex = -1
					this.dataTable = [] // 清空列表的数据
					this.$message.warning('暂无门票')
					return false
				}
        if (this.ticketIndex === index) {
          this.ticketIndex = -1
					this.dataTable = [] // 清空列表的数据
        } else {
          this.ticketIndex = index
          // table添加数据
          this.dataTable = []
          this.dataTable.push({
              key: item.ticket_id,
              title: item.tools_title,
              ticket: item.ticket_title,
              price: item.price,
              num: 1
          })
          this.getTotalPrice()
        }
      },

      // 获取总金额
      getTotalPrice () {
        const params = {
          ticket_id: this.ticketList[this.ticketIndex].ticket_id,
          num: this.dataTable[0].num,
          select_id: this.ticketList[this.ticketIndex].pigcms_id
        }
        this.request(lifeToolsStorestaffApi.confirmPrice, params).then((res) => {
					console.log(res, '-------门票总金额----------')
          this.totalPrice = res
				})
      },
			// 点击分页
			onPaginationChange (page, pageSize) {
				this.page.current = page
				this.getTicketList()
			},

      // 增加人数
      onAdd (text, record) {
        console.log(text, record, this.ticketList[this.ticketIndex].stock_num)

        this.dataTable.map((value, index) => {
          if (value.key === record.key) {
            console.log(value)
            this.dataTable[index].num = text + 1
          }
        })
        this.getTotalPrice()
      },
      // 减少人数
      onMinus (text, record) {
        console.log(text, record)
        if (text <= 1) {
          return false
        } else {
          this.dataTable.map((value, index) => {
            if (value.key === record.key) {
              this.dataTable[index].num = text - 1
            }
          })
        }
        this.getTotalPrice()
      },

      // 选择支付类型
      onPayType (type) {
        this.nowpayMethod = type
      },

      // 点击提交订单
      confrimPay () {
        // 判断是否选择了门票
        if (this.ticketIndex === -1) {
          this.$message.warning('请选择门票~')
          return false
        }
        // 判断是否填写了姓名
        if (!this.form.name) {
          this.$message.warning('请填写姓名~')
          return false
        }
        // 判断是否填写了手机号
        if (!this.form.phone) {
          this.$message.warning('请填写手机号~')
          return false
        }
        if (!this.nowpayMethod) {
          this.$message.warning('请选择支付方式~')
          return false
        }
        this.getsaveOrde()
      },

      // 获取订单提交
      getsaveOrde () {
        const params = {
          ticket_id: this.totalPrice.ticket_id,
          num: this.totalPrice.num,
          select_id: this.ticketList[this.ticketIndex].pigcms_id,
          name: this.form.name,
          phone: this.form.phone,
          pay_price: this.totalPrice.total_price
        }
        this.request(lifeToolsStorestaffApi.saveOrde, params).then((res) => {
					console.log(res, '--------------订单提交确认--------------------')
          this.pageInfo = { ...this.totalPrice, ...res }
          console.log(this.pageInfo, this.vipMoney, '----------this.pageInfo---------------')
          this.payMethodshow = true
				})
      },

      // 确认付款
      comfirmPayOrder (info) {
        console.log(info, this.pageInfo, '-----------确认付款----------')
        const params = {
          order_id: this.pageInfo.order_id,
          pay_type: this.nowpayMethod,
          pay_code: info.authCode,
          get_price: info.getPrice,
          give_change: info.giveChange
        }
        this.request(lifeToolsStorestaffApi.goPay, params).then((res) => {
					console.log(res, '--------------支付接口--------------------')
          this.$message.success('支付成功')
          this.payMethodshow = false // 关闭弹窗
          this.visibleCode = true
          this.paySuccessDetail = res
          // 清除所有数据
          // 门票列表
          this.ticketList = []
          this.ticketIndex = -1
				  this.keyWords = '' // 输入门票名称
          this.page = { // 分页
            current: 1,
            total: 0
          }
          this.form = { // 姓名手机号填写
            name: '',
            phone: ''
          }

          this.dataTable = [] // table数据
          this.totalPrice = '' // 获取总金额
          this.vipMoney = 0.00 // 需要的总金额
          this.getTicketList() // 获取门票列表
				})
      },
      closemodelfnc () {
        // 关闭弹框
      // this.vipinfoShow = false
      this.payMethodshow = false
      // this.changemoneyShow = false
      },

      // 打印二维码弹窗
      onconfirmCode () {
        this.visibleCode = false
      },
      onCloseCode () {
        this.visibleCode = false
      }

    }
  }
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.page{
  min-height: 100% !important;
  max-height: 200% !important;
  box-sizing: border-box;
  background: #07090a;
}
.row{
  padding: 0;
  padding-top: 20/ @rem * 1rem;
  padding-bottom: 20/ @rem * 1rem;
  height: 100%;
  .col{
    height: 100%;
    border-radius: 5 / @rem * 1rem;
    background: #ffffff;
  }
}

.col_first{
  // padding: 37px 24px;
  padding-top: 37 / @rem * 1rem;
  padding-bottom: 37 / @rem * 1rem;
  padding-left: 24 / @rem * 1rem;
  padding-right: 24 / @rem * 1rem;
}
.input_search{
  display: flex;
  align-items: center;
  .search_input{
    background:rgba(46, 46, 46, 0.07)
  }
  .search_btn{
    margin-left: 31 / @rem * 1rem;
  }
}

// 选择区域
.choice{
  display: flex;
  align-items: center;
  // flex-wrap: wrap;
  .center_slider_container{
    position: relative;
    height: 100%;
    width: 100%;
    overflow: scroll;
    overflow-y: hidden;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch;
    .sliderList_content {
      height: 35 / @rem * 1rem;
      user-select: none;
      transition: all 0.5s linear;
      display: flex;
      white-space: nowrap;
      align-items: center;
    }
  }
  .choice_content{
    height: 100%;
    margin-right: 10 / @rem * 1rem;
    // padding: 4px 14px;
    padding-top: 4 / @rem * 1rem;
    padding-bottom: 4 / @rem * 1rem;
    padding-left: 14 / @rem * 1rem;
    padding-right: 14 / @rem * 1rem;
    font-size: 14 / @rem * 1rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: #B8B8B8;
    border-radius: 5 / @rem * 1rem;
    border: 1px solid #B8B8B8;
  }
  .choice_content_select{
    background: #1A86F9;
    margin-right: 20 / @rem * 1rem;
    // padding: 4px 14px;
    padding-top: 4 / @rem * 1rem;
    padding-bottom: 4 / @rem * 1rem;
    padding-left: 14 / @rem * 1rem;
    padding-right: 14 / @rem * 1rem;
    font-size: 14 / @rem * 1rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    border-radius: 5 / @rem * 1rem;
    border: 1px solid #1A86F9;
  }
}

// 门票
.ticket{
  margin-top: 20 / @rem * 1rem;
  overflow: auto;
  height: 80%;

  .ticket_dispaly{
    // padding: 14px 15px;
    padding-top: 14 / @rem * 1rem;
    padding-bottom: 14 / @rem * 1rem;
    padding-left: 15 / @rem * 1rem;
    padding-right: 15 / @rem * 1rem;
    background: #EFF1F4;
    border:1px solid #EFF1F4;
    border-radius: 5 / @rem * 1rem;
    margin-top: 10 / @rem * 1rem;
  }
  .ticket_dispaly_select{
    // padding: 14px 15px;
    padding-top: 14 / @rem * 1rem;
    padding-bottom: 14 / @rem * 1rem;
    padding-left: 15 / @rem * 1rem;
    padding-right: 15 / @rem * 1rem;
    background: #DBECFE;
    border:1px solid #1A86F9;
    border-radius: 5 / @rem * 1rem;
    margin-top: 10 / @rem * 1rem;
  }
	.title{
    font-size: 20 / @rem * 1rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: #1C1C1C;
    margin-bottom: 0px;
    .badge{
      font-size: 7 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 800;
      color: #FFFFFF;
      // padding: 2px 6px;
      padding-top: 2 / @rem * 1rem;
      padding-bottom: 2 / @rem * 1rem;
      padding-left: 6 / @rem * 1rem;
      padding-right: 6 / @rem * 1rem;
      background: red;
      border-radius: 14 / @rem * 1rem;
      align-items: center;
    }
  }
  .type_price{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .type{
      font-size: 14 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #1D87F9;
    }
    .price{
      font-size: 13 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FF4D32;
      .price_num {
        font-size: 20 / @rem * 1rem;
        font-weight: 800;
      }
    }
  }
	.stock_limitation{
    display: flex;
    align-items: center;
    .stock_num{
      margin-right: 40 / @rem * 1rem;
      font-size: 13 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
    }
    .limitation_pay{
      font-size: 13 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
    }
  }
	.ticket_dispaly_noselect{
		// padding: 14px 15px;
    padding-top: 14 / @rem * 1rem;
    padding-bottom: 14 / @rem * 1rem;
    padding-left: 15 / @rem * 1rem;
    padding-right: 15 / @rem * 1rem;
    background: #f9f8f8;
    border:1px solid #f9f8f8;
    border-radius: 5 / @rem * 1rem;
    margin-top: 10 / @rem * 1rem;
		.title{
    font-size: 20 / @rem * 1rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: #b9b8b8;
    margin-bottom: 0 / @rem * 1rem;
  }
  .type_price{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .type{
      font-size: 14 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #b9b8b8;
    }
    .price{
      font-size: 13 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #b9b8b8;
      .price_num {
        font-size: 20 / @rem * 1rem;
        font-weight: 800;
      }
    }
		.stock_limitation{
    display: flex;
    align-items: center;
    .stock_num{
      margin-right: 40 / @rem * 1rem;
      font-size: 13 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #b9b8b8;
    }
    .limitation_pay{
      font-size: 13 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #b9b8b8;
    }
  }
  }
	}
}

// 列表的样式
.col_second{
  // padding: 20px;
  padding-top: 20 / @rem * 1rem;
  padding-bottom: 20 / @rem * 1rem;
  padding-left: 20 / @rem * 1rem;
  padding-right: 20 / @rem * 1rem;
}
.table_data{
  box-shadow: 0px 0px 13px 0px rgba(194, 194, 194, 0.35);
  border-radius: 10 / @rem * 1rem;
  height: 49%;
  .add_num{
    display: flex;
    align-items: center;
    .person_num{
      // padding: 0px 5px;
      padding-left: 5 / @rem * 1rem;
      padding-right: 5 / @rem * 1rem;
      margin-bottom: 0;
    }
  }
}

// 支付
.pay{
  margin-top: 10 / @rem * 1rem;
  box-shadow: 0px 0px 13px 0px rgba(194, 194, 194, 0.35);
  border-radius: 10 / @rem * 1rem;
  // padding: 20px 25px 35px 20px;
  padding-top: 20 / @rem * 1rem;
    padding-bottom: 35 / @rem * 1rem;
    padding-left: 20 / @rem * 1rem;
    padding-right: 25 / @rem * 1rem;

  .order_total_money{
    font-size: 20 / @rem * 1rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    .money{
      font-size: 26 / @rem * 1rem;
      font-family: PingFang SC;
      font-weight: 800;
      color: #FF4D32;
    }
  }
  .online_btnstyle{
    border: 4px solid #53BE76;
    border-radius: 10 / @rem * 1rem;
  }
  .btnstyle {
    border: 4px solid #ffffff;
    border-radius: 10 / @rem * 1rem;
  }
  .online_btn{
    line-height: 50 / @rem * 1rem;
      text-align: center;
      height: 50 / @rem * 1rem;
      font-size: 18 / @rem * 1rem;
      background: #57D57A;
      color: #ffffff;
      border-radius: 5 / @rem * 1rem;
      margin: 6 / @rem * 1rem;
  }
  .offline_btnstyle{
    border: 4px solid #FCA96B;
    border-radius: 10 / @rem * 1rem;
  }
  .offline_btn{
    line-height: 50 / @rem * 1rem;
    text-align: center;
    height: 50 / @rem * 1rem;
    font-size: 18 / @rem * 1rem;
    background: #FCA96B;
    color: #ffffff;
    border-radius: 5 / @rem * 1rem;
    margin: 6 / @rem * 1rem;
  }
}

@media print {
.no-print {
    display: none;
  }
}

.main_body{
  position: absolute;
  z-index: -1;
  height:0;
  // width: 0px;
  top: 0;
  left: 0;
  margin-left: 36%;
  display: flex;
  // width: 100%;
}

</style>
