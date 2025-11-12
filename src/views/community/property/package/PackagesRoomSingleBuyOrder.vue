<template>
  <div class="packages-room-buy-box">
        <div class="header-box">
            <a-table
            :columns="package_columns"
                :data-source="roomList"
                :pagination="false"
                >

                <span slot="pay_period" slot-scope="text, record">
                    <a-row type="flex">
                    <a-col :span="10">
                        <a-row type="flex">
                            <a-col :span="5">
                                <div style="width: 100%;text-align: center;">
                                    <img v-if="text && text>1" src="../../../../assets/images/minus.png?t=02" @click="munus_period(record)"/>
                                    <img v-else src="../../../../assets/images/minus_no.png?t=02" />
                                </div>
                            </a-col>
                            <a-col :span="2">
                            </a-col>
                            <a-col :span="10">
                            <a-input style="width:100%;text-align: center;" size="small" :value="text"/>
                            </a-col>
                            <a-col :span="2">
                            </a-col>
                            <a-col :span="5">
                                <div style="width: 100%;text-align: center;">
                                    <img src="../../../../assets/images/plus.png?t=02" @click="plus_period(record)"/>
                                </div>
                            </a-col>
                        </a-row>
                    </a-col>
                    </a-row>
                </span>

            </a-table>
        </div>

        <div class="pay-info-box-order">
            <div class="packages-end-time">
                您的功能套餐将于{{room_info.room_end_time}}到期，所以您购买的{{$store.getters.config.room_name}}套餐时间为{{room_info.room_end_day}}天
            </div>
            <div class="total-money-info">
                订单总额：<span class="money-tip">￥{{room_info.total_money}}</span>
            </div>

            
            <div class="pay-btn">
                <a-button type="primary" @click="goPay()">去付款</a-button>
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
    const package_columns = [
    { title: '套餐标题',  dataIndex: 'room_title', key: 'room_title'},
    { title: '所含'+store.getters.config.room_name, dataIndex: 'room_count', key: 'room_count' },
    { title: '价格（元/年）', dataIndex: 'room_price', key: 'room_price' },
    { title: '购买数量', dataIndex: 'pay_period', key: 'pay_period', scopedSlots: { customRender: 'pay_period' }},
    { title: '总价（元）', dataIndex: 'pay_money', key: 'pay_money'},
    ];
    export default {
        name: 'PackagesRoomBuy',
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
                roomList: [],
                package_info: {},
                package_columns,
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
                room_info: '',
                pay_qrcode: '',
                visible: false,
                is_loop: false,
                loadPost: false,
            }
        },
        activated() {
            var  query = this.$route.query
            this.room = JSON.parse(query.room)
            console.log('query', query)
            console.log('room', this.room)
            this.getBuyRoom();
        },
        mounted() {
            var  query = this.$route.query
            this.room = JSON.parse(query.room)
            console.log('query', query)
            console.log('room', this.room)
            this.getBuyRoom();
        },
        methods: {
            getBuyRoom() {
                if (this.loadPost) {
                    return false;
                }
                this.loadPost = true;
                var param = {};
                param['room'] = this.room;
                this.request(packageApi.propertyGetBuyRoom, param)
                    .then((res) => {
                        this.loadPost = false;
                        console.log('res', res)
                        this.room_info = res;
                        if (res.roomList) { 
                            this.roomList = res.roomList
                        }
                    })
            },
            getBuyRoomTotal() {
                var param = {}
                var room_single = {}
                var room = [];
                var roomList = JSON.parse(JSON.stringify(this.roomList));
                for(var i in roomList) {
                    if (roomList[i] && roomList[i]['pay_period'] > 0) {
                        room_single = {};
                        room_single['room_id'] = roomList[i]['room_id'];
                        room_single['room_num'] = roomList[i]['pay_period'];
                        room.push(room_single);
                    }
                }
                param['room'] = room;
                this.request(packageApi.propertyGetBuyRoom, param)
                    .then((res) => {
                        console.log('res', res)
                        this.room_info = res;
                        if (res.roomList) { 
                            this.roomList = res.roomList
                        }
                    })
            },
            handleSubmit() {
                // if (this.confirmLoading) {
                //     return false;
                // }
                this.confirmLoading = true
                var param = {}
                var room = [];
                var roomList = JSON.parse(JSON.stringify(this.roomList));
                console.log('roomList', roomList);
                var room_single = {};
                for(var i in roomList) {
                    if (roomList[i] && roomList[i]['pay_period'] > 0) {
                        room_single = {};
                        room_single['room_id'] = roomList[i]['room_id'];
                        room_single['room_num'] = roomList[i]['pay_period'];
                        room.push(room_single);
                    }
                }
                param['room'] = room;
                var  len = room.length;
                console.log('propertyCreateOrder-len', len)
                console.log('propertyCreateOrder-param', param)
                if (len>0) {
                    this.request(packageApi.propertyCreateRoomOrder, param)
                        .then((res) => {
                            console.log('propertyCreateOrder', res)
                            this.order_info = res;
                            this.confirmLoading = false;
                            if (res.order_id>0) {
                                this.getCreateQrCode(res.order_id);
                            }
                        })
                } else {
                    this.confirmLoading = false;
                    this.order_info.total_money = this.package_info.total_money
                }
            },
            handlemouse(e) {
                let startTime, endTime;

                let child = document.getElementsByClassName('buy-parent')[0];
                let parent = document.getElementsByClassName('buy-divs')[0];
                let box = document.getElementsByClassName('buy-box')[0];
                // 使用this.$refs.name获取dom元素,可能会获取到vue组件,他不支持获取元素的宽高以及监听鼠标事件
                let widthDiffer = parent.offsetWidth - child.offsetWidth;
                if (widthDiffer > 0) {
                    //如果grand真实宽度比parent宽度长,那么就不用滑动了,直接返回
                    this.isClick = true;
                    return
                }
                console.log(parent);
                console.log('buy-child',child.offsetWidth);
                console.log('buy-parent',parent.offsetWidth);
                console.log('buy-box',box.offsetWidth);
                if(box.offsetWidth > child.offsetWidth){
                    return
                }
                startTime = new Date().getTime();//获取事件开始时间
                let disx = e.clientX - child.offsetLeft;
                this.isDrag = true;//设置开始拖拽
                parent.onmousemove = (e) => {
                    if (this.isDrag) {//拖拽中
                        let mouseX = e.clientX; // 鼠标点击的位置
                        let x = mouseX - disx;
                        child.style.left = x + 'px'//设置parent的位置
                    }
                }
                parent.onmouseup = (e) => {
                    endTime = new Date().getTime();
                    let timeDiffer = endTime - startTime;//获取抬起时间
                    this.isDrag = false;
                    if (timeDiffer < 150) {
                        //时间间隔小于150,那么就判断为单击事件,这里时间间隔可自由设置
                        this.isClick = true;
                    } else {
                        this.isClick = false;
                    }
                }

            },
            /**
             * @breif 监听鼠标移出横向菜单栏
             * ***/
            leave() {
                this.isDrag = false;
            },
            clickDoSome(index) {
                if (this.isClick) {
                    //dosome
                    console.log('是否在单击', 1)
                }
            },
            getCreateQrCode(package_order_id) {
                var param = {};
                param['order_id'] = package_order_id;
                this.request(packageApi.propertyRoomCreateQrCode, param)
                    .then((res) => {
                        console.log('getCreateQrCode', res)
                        if (res.qrcode) {
                            this.pay_qrcode = res.qrcode;
                            this.visible = true;
                            this.is_loop = true;
                            this.setTimeoutPayInfo(package_order_id);
                        }
                    })
            },
            setTimeoutPayInfo(package_order_id) {
                setTimeout(() => {
                    this.getQueryOrderPayStatus(package_order_id);
                }, 5000)
            },
            getQueryOrderPayStatus(package_order_id) {
                var param = {};
                param['order_id'] = package_order_id;
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
                            this.setTimeoutPayInfo(package_order_id);
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
                this.handleSubmit();
            },
            munus_period(record) {
              this.isClickChoose = false;
              var roomList = JSON.parse(JSON.stringify(this.roomList));
              console.log('munus_period+', record)
              for(var i in roomList) {
                if (roomList[i] && record['room_id']==roomList[i]['room_id'] && roomList[i]['pay_period'] > 1) {
                    roomList[i]['pay_period'] = roomList[i]['pay_period'] - 1;
                }
              }
              this.roomList = roomList;
              console.log('munus_period-roomList', roomList);
              this.$forceUpdate;
              this.getBuyRoomTotal();
              setTimeout(() => {
                this.isClickChoose = true;
               }, 500)
            },
            plus_period(record) {
              this.isClickChoose = false;
              var roomList = JSON.parse(JSON.stringify(this.roomList));
              console.log('plus_period-', record)
              for(var i in roomList) {
                if (roomList[i] && record['room_id']==roomList[i]['room_id']) {
                    roomList[i]['pay_period'] = roomList[i]['pay_period'] + 1;
                }
              }
              this.roomList = roomList;
              console.log('plus_period-roomList', roomList);
              this.$forceUpdate;
              this.getBuyRoomTotal();
              setTimeout(() => {
                this.isClickChoose = true;
               }, 500)
            },
        }

    }

</script>

<style>

  .packages-room-buy-box {
      padding: 15px;
      background-color: white;
      margin-top: 10px;
  }

  .buy-parent {
    position: absolute;
    white-space: nowrap;
  }
  
  .buy-box {
    text-align: center;
    margin-top: 5px;
    /*border: 1px solid #eee;*/
    height: 98%;
    width: 98%;
    font-weight: bold;
    /*box-shadow: 0 0 3px 1px #eee;*/
    white-space: nowrap;
    position:relative;
  }

  .buy-divs{
    display: flex;
    height: 380px;
    white-space: nowrap;/*文本不会换行，文本会在在同一行上继续*/
    flex-wrap: nowrap;
    position:relative;
    overflow: hidden;
  }
  .buy-box::-webkit-scrollbar{
    display: none;
  }

  .buy-room-package h1,h2,h4{
    font-weight:bold;
  }

  .buy-room-package {
    color: #000;
    max-height: calc(100% - 120px);
    width: 200px;
    min-width: 200px;
    margin-right: 15px;
    display: inline-block;/*行内块元素*/
  }

  .buy-room-title {
      margin-bottom: 15px;
  }
  .buy-room-price {
    font-size: 24px;
    font-weight:bold;
    margin-bottom: 15px;
  }
  .buy-room-num-tip {
    font-weight:400;
    color: #333;
    margin-bottom: 15px;
  }
  .header-box {
    font-weight:400;
    color: #111;
  }
  .header-box img {
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

  .pay-info-box-order {
      margin-top: 20px;
  }
  .pay-info-box-order .packages-end-time {
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