<template>
  <div class="packages-room-buy-box-order">
        <div class="header-box">
            <a-table
            :columns="package_columns2"
                :data-source="package_data"
                :pagination="false"
                >
            </a-table>
        </div>


        <div class="buy-box-order">
            <div class="buy-parent-order">
                <div class="buy-divs-order" id="buy-pics">
                    <div class="buy-room-package-order" v-for="(item,index) in roomList" :key="index"
                    >
                        <div class="buy-room-box-order" :class="{ 'active': item.pitch_type == 1 }" :id="'box-'+index" @click="choose_room_data($event,index,item.room_id)">
                            <div class="buy-room-title-order"><h1>{{item.room_title}}</h1></div>
                            <div class="buy-room-price-order">￥{{item.room_price}}/年</div>
                            <div class="buy-room-num-tip-order">{{$store.getters.config.room_name}}数：{{item.room_count}}</div>
                            <div class="buy-room-num-order">
                                <a-row type="flex">
                                <a-col :span="10">
                                    购买数量：
                                </a-col>
                                <a-col :span="14">
                                    <a-row type="flex">
                                        <a-col :span="5">
                                        <div style="width: 100%;text-align: center;">
                                            <img v-if="item.room_num && item.room_num>1" src="../../../../assets/images/minus.png?t=02" @click="munus_period(index)"/>
                                            <img v-else src="../../../../assets/images/minus_no.png?t=02" />
                                        </div>
                                        </a-col>
                                        <a-col :span="1">
                                        </a-col>
                                        <a-col :span="10">
                                        <a-input style="width:100%;text-align: center;" size="small" :value="item.room_num"/>
                                        </a-col>
                                        <a-col :span="1">
                                        </a-col>
                                        <a-col :span="5">
                                            <div style="width: 100%;text-align: center;">
                                                <img src="../../../../assets/images/plus.png?t=02" @click="plus_period(index)"/>
                                            </div>
                                        </a-col>
                                    </a-row>
                                </a-col>
                                </a-row>
                            </div>

                            <div class="choose_icon">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="pay-info-box-order">
            <div class="packages-end-time" style="margin-left: 20px;">
                预计到期时间：{{package_info.package_end_time}}
            </div>
            <div style="display: flex; align-items: center; margin-right: 100px;">
                <div class="total-money-info">
                    订单总额：<span class="money-tip">￥{{total_money}}</span>
                </div>
                <div class="pay-btn">
                    <a-button type="primary" @click="goPay()">去付款</a-button>
                </div>
            </div>
        </div>

          <a-modal
            title="请进行扫码支付"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            @onCancel="handleCancel"
            :maskClosable='false'
            >
            <div style="width: 100%;text-align: center;">
            <img :src="pay_qrcode">
            </div>
          </a-modal>
  </div>
</template>


<script>
    import packageApi from '@/api/community/property/packages';
	import store from '@/store';
    const package_columns2 = [
        {
            title: '套餐标题',
            dataIndex: 'package_title',
            key: 'package_title',
        },
        {
            title: '所含'+store.getters.config.room_name+'数',
            dataIndex: 'room_num',
            key: 'room_num',
        },
        {
            title: '价格（元/年）',
            key: 'package_price',
            dataIndex: 'package_price',
        },
        {
            title: '订购时间',
            key: 'pay_time',
            dataIndex: 'pay_time',
        },
        {
            title: '订购周期（年）',
            key: 'package_period',
            dataIndex: 'package_period',
        },
        {
            title: '订购总费用（元）',
            key: 'order_money',
            dataIndex: 'order_money',
        },
        {
            title: '套餐到期时间',
            key: 'package_end_time',
            dataIndex: 'package_end_time',
        },
    ];
    export default {
        name: 'PackagesRoomOrderBuy',
        data () {
            return {
                package_data:[
                    {
                        'package_title': '套餐一',
                        'room_num': '100',
                        'package_price': '100',
                        'num': '1',
                        'total_money': '100',
                    }
                ],
                total_money:0,
                roomList: [],
                package_info: {},
                package_columns2,
                title: '套餐续费',
                confirmLoading: false,
                buy_periods: 1,
                type: 1,
                form: this.$form.createForm(this),
                isDrag:false,//是否在拖拽
                isClick:false,//是否是单击
                package_id: 0,
                order_id: 0,
                choose_room: [],
                isClickChoose: true,
                pay_type: '',
                compute_type: 1, // 1 只计算价格 不生产订单
                order_info: {},
                pay_type_info: [],
                pay_qrcode: '',
                visible: false,
                is_loop: false,
                pay_room_total_num:0,
                loadPost: false,
            }
        },
        activated() {
            var  query = this.$route.query
            this.package_id = query.package_id
            this.buy_periods = query.package_num
            this.type = query.type
            this.order_id = query.order_id
            console.log('query', query)
            this.getPackageRoom();
        },
        mounted() {
            var  query = this.$route.query
            this.package_id = query.package_id
            this.buy_periods = query.package_num
            this.type = query.type
            this.order_id = query.order_id
            console.log('query', query)
            this.getPackageRoom();
        },
        methods: {
            getPackageRoom() {
                if (this.loadPost) {
                    return false;
                }
                this.loadPost = true;
                let param = {};
                let _this = this;
                this.request(packageApi.propertyGetPackageRoomList)
                    .then((res) => {
                        this.loadPost = false;
                        console.log('res', res)
                        if (res.package) {
                            this.package_data = [];
                            this.package_data.push(res.package);
                            this.package_info = res.package;
                        }
                        if (res.room_list) { 
                            this.roomList = res.room_list
                            for(var i in res.room_list) {
                                if (res.room_list[i]) {
                                    res.room_list[i]['room_num'] = 1
                                }
                            }
                        }
                        this.choose_room = [];
                        console.log('roomList', this.roomList)
                    })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.buy_periods = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            handleSubmit() {
                if (this.confirmLoading) {
                    return false;
                }
                console.log('dddddddd',this.roomList);
                this.confirmLoading = true
                var param2 = {}
                param2['roomList'] = this.roomList
                this.request(packageApi.propertyCreateRoomOrderNew, param2)
                    .then((res) => {
                        console.log('propertyCreateOrder', res)
                        this.order_info = res;
                        this.confirmLoading = false;
                        if (res.package_room_order_id>0) {
                            this.getCreateQrCode(res.package_room_order_id);
                        }
                    })
            },
            getCreateQrCode(package_room_order_id) {
                var param = {};
                param['order_id'] = package_room_order_id;
                this.request(packageApi.propertyCreateRoomQrCode, param)
                    .then((res) => {
                        console.log('getCreateQrCode', res)
                        if (res.qrcode) {
                            this.pay_qrcode = res.qrcode;
                            this.visible = true;
                            this.is_loop = true;
                            this.setTimeoutPayInfo(package_room_order_id);
                        }
                    })
            },
            setTimeoutPayInfo(package_room_order_id) {
                setTimeout(() => {
                    this.getQueryOrderPayStatus(package_room_order_id);
                }, 5000)
            },
            getQueryOrderPayStatus(package_room_order_id) {
                var param = {};
                param['order_id'] = package_room_order_id;
                this.request(packageApi.propertyRoomQueryOrderPayStatus, param)
                    .then((res) => {
                        console.log('getQueryOrderPayStatus', res);
                        if (res.status>0) {
                            this.$notification.success({
                                message: '支付成功！',
                            })
                            setTimeout(() => {
                                this.visible = false;
                            }, 1000)
                        } else if(this.is_loop) {
                            this.setTimeoutPayInfo(package_room_order_id);
                        }
                    })
            },
            handleOk(e) {
                this.visible = false;
                this.is_loop = false;
            },
            handleCancel(e) {
                console.log('Clicked cancel button');
                this.visible = false;
                this.is_loop = false;
            },
            goPay() {
                this.compute_type = 2;
                this.handleSubmit();
            },
            choose_room_data(event,index,room_id) {
                var roomValue = this.roomList[index];
                console.log('roomValue', roomValue);
                if (this.isClickChoose) {

                    if(1 == roomValue['pitch_type'])
                    {
                        roomValue['pitch_type'] = 0
                        this.choose_room[index] = 0;
                        this.$set(this.roomList,index,roomValue);
                    }else{
                        roomValue['pitch_type'] = 1
                        this.choose_room[index] = room_id;
                        this.$set(this.roomList,index,roomValue);
                        console.log('roomList111',this.roomList)
                    }
                    this.compute_type = 1;
                    this.propertygetRoomOrderPrice();
                } else {
                    console.log('其他点击事件')
                }
            },
            munus_period(index) {
              this.isClickChoose = false;
              var roomList = JSON.parse(JSON.stringify(this.roomList));
              var num = roomList[index]['room_num'] ? roomList[index]['room_num'] : 0;
              if (num<=1) {
                roomList[index]['room_num'] = 0;
              } else {
                roomList[index]['room_num'] = num - 1;
              }
              this.roomList = roomList;
              console.log('munus_period+', this.roomList)
              this.$forceUpdate;
              this.compute_type = 1;
              this.propertygetRoomOrderPrice();
              setTimeout(() => {
                this.isClickChoose = true;
               }, 500)
            },
            plus_period(index) {
              this.isClickChoose = false;
              var roomList = JSON.parse(JSON.stringify(this.roomList));
              var num = roomList[index]['room_num'] ? roomList[index]['room_num'] : 0;
              var buy_periods = num + 1;
              roomList[index]['room_num'] = buy_periods;
              this.roomList = roomList;
              console.log('plus_period-', this.roomList)
              this.$forceUpdate;
              this.compute_type = 1;
              this.propertygetRoomOrderPrice();
              setTimeout(() => {
                this.isClickChoose = true;
               }, 500)
            },
            propertygetRoomOrderPrice(){
                let param1 = {}
                param1['room_list'] = this.roomList
                this.request(packageApi.propertygetRoomOrderPrice, param1)
                    .then((res) => {
                        console.log('propertyCreateOrder', res)
                        this.order_info = res;
                        this.confirmLoading = false;
                       this.total_money=res.total_money;
                    })
            },
        }

    }

</script>

<style>
   .packages-room-buy-box-order {
        /* padding: 15px; */
        width: 100%;
        background-color: white;
        margin-top: 10px;
    }
  
    .buy-parent-order {
      position: absolute;
      white-space: nowrap;
      background-color: #ffffff;
      /* padding-bottom: 20px; */
      padding: 0 15px 100px 15px;
    }
    
    .buy-box-order {
      text-align: center;
      margin-top: 5px;
      /*border: 1px solid #eee;*/
      /* height: 98%; */
      /* width: 98%; */
      font-weight: bold;
      /*box-shadow: 0 0 3px 1px #eee;*/
      white-space: nowrap;
      position:relative;
    }
  
    .buy-divs-order{
      display: flex;
      /* height: 380px; */
      flex-wrap: wrap;
      background-color: #ffffff;
      /* position:relative; */
      /* overflow: hidden; */
    }
    .buy-box-order::-webkit-scrollbar{
      display: none;
    }
  
    .buy-room-package-order h1,h2,h4{
      font-weight:bold;
    }
  
    .buy-room-package-order {
      color: #000;
      /* max-height: calc(100% - 120px); */
      height: 270px;
      width: 200px;
      min-width: 200px;
      margin-right: 15px;
      margin-top: 15px;
      display: inline-block;/*行内块元素*/
    }
  
    .buy-room-box-order {
      background-color: #f7f9fe;
      padding: 35px 10px 0 10px;
      height: 100%;
      width: 100%;
      position: relative;
    }
  
    .buy-room-box-order.active {
      /* background-color: #f0f4fe; */
      background-color: #f9f2f2;
    }
    .buy-room-title-order {
        margin-bottom: 15px;
    }
    .buy-room-price-order {
      font-size: 24px;
      font-weight:bold;
      margin-bottom: 15px;
    }
    .buy-room-num-tip-order {
      font-weight:400;
      color: #333;
      margin-bottom: 15px;
    }
    .buy-room-num-order {
      font-weight:400;
      color: #111;
    }
    .buy-room-num-order img {
        width: 23px;
        height: 23px;
        box-shadow:-1px 0 1px #eee, /*左边阴影*/  
                 1px 0 1px #eee, /*右边阴影*/  
                 0 -1px 1px #eee, /*顶部阴影*/  
                 0 1px 1px #eee; /*底边阴影*/  
    }
    .choose_icon {
      width: 40px;
      height: 40px; 
      font-size: 25px;
      color: white;
      padding: 15px 0 0 26px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
    .buy-room-box-order .choose_icon {
      background-image: url(../../../../assets/images/no_check.png?t=02);
      background-size: cover;
    }
    .buy-room-box-order.active .choose_icon {
      background-image: url(../../../../assets/images/checked.png?t=02);
      background-size: cover;
    }
  
    .pay-info-box-order {
        /* margin-top: 290px; */
        top: 92%;
        width: 86%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: fixed;
        z-index: 999;
        background-color: #ffffff;
        padding: 5px;
    }
    .pay-info-box-order1 {
        width: 90%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        z-index: 999;
    }
    .pay-info-box-order .packages-end-time {
        font-size: 16px;
        color: red;
    }
    .pay-info-box-order1 .packages-end-time {
        font-size: 16px;
        color: red;
    }
    .total-money-info {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        padding: 10px;
        text-align: right;
    }
    .total-money-info .money-tip {
        font-size: 18px;
        font-weight: 600;
        color: red;
    }
    .pay-type-choose-box {
      color: #000;
      padding: 20px;
      background-color: #f0f4fe;
    }
    .pay-type-choose-box .pay-type-tip {
        margin-bottom: 10px;
    }
    .pay-btn {
      padding: 20px;
        text-align: right;
    }
</style>