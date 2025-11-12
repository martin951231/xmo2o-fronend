<template>
  <div class="packages-room-buy-box">
    <div class="buy-box" v-if="type==1">
        <div class="buy-parent">
            <div class="buy-divs" id="buy-pics">
                <div class="buy-room-package" v-for="(item,index) in roomList" :key="index" @mousedown="handlemouse"
                    @mouseleve="leave"
                    @click="clickDoSome(index)"
                >
                    <div class="buy-room-box" :class="{ 'active': item.pitch_type == 1 }" @click="choose_room_data($event,index,item.room_id)">
                        <div class="buy-room-title"><h1>{{item.room_title}}</h1></div>
                        <div class="buy-room-price">￥{{item.room_price}}/年</div>
                        <div class="buy-room-num-tip">{{$store.getters.config.room_name}}数：{{item.room_count}}</div>
                        <div class="buy-room-num">
                            <a-row type="flex">
                            <a-col :span="10">
                                购买数量：
                            </a-col>
                            <a-col :span="14">
                                <a-row type="flex">
                                    <a-col :span="5">
                                        <img v-if="item.room_num && item.room_num>1" src="../../../../assets/images/minus.png?t=02" @click="munus_period(index)"/>
                                        <img v-else src="../../../../assets/images/minus_no.png?t=02" />
                                    </a-col>
                                    <a-col :span="1">
                                    </a-col>
                                    <a-col :span="10">
                                    <a-input style="width:100%;text-align: center;"  size="small" :value="item.room_num"/>
                                    </a-col>
                                    <a-col :span="1">
                                    </a-col>
                                    <a-col :span="5">
                                        <img src="../../../../assets/images/plus.png?t=02" @click="plus_period(index)"/>
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


    <div class="pay-info-box">
        <div class="pay-btn">
            <a-button type="primary" @click="goPay()">立即购买</a-button>
        </div>
    </div>
  </div>
</template>


<script>
    import packageApi from '@/api/community/property/packages';
	import store from '@/store';
    const package_columns = [
    { title: '套餐标题',  dataIndex: 'package_title', key: 'package_title_detail'},
    { title: '所含'+store.getters.config.room_name, dataIndex: 'room_num', key: 'room_num' },
    { title: '价格（元/年）', dataIndex: 'package_price', key: 'package_price' },
    { title: '续费周期', dataIndex: 'package_end_period', key: 'package_end_period'},
    { title: '总价', dataIndex: 'total_money', key: 'total_money'},
    ];
    const package_columns2 = [
    { title: '套餐标题',  dataIndex: 'package_title', key: 'package_title_detail'},
    { title: '所含'+store.getters.config.room_name, dataIndex: 'room_num', key: 'room_num' },
    { title: '价格（元/年）', dataIndex: 'package_price', key: 'package_price' },
    { title: '总价', dataIndex: 'total_money', key: 'total_money'},
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
                package_columns2,
                title: '套餐续费',
                confirmLoading: false,
                buy_periods: 1,
                type: 1,
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
                loadPost: false,
            }
        },
        activated() {
            this.getPackageRoom();
        },
        mounted() {
            this.getPackageRoom();
        },
        methods: {
            getPackageRoom() {
                if (this.loadPost) {
                    return false;
                }
                this.loadPost = true;
                this.request(packageApi.propertyGetRoomList)
                    .then((res) => {
                        this.loadPost = false;
                        console.log('res', res)
                        if (res.list) { 
                            this.roomList = res.list
                            for(var i in res.list) {
                                if (res.list[i]) {
                                    res.list[i]['room_num'] = 1
                                }
                            }
                        }
                        this.choose_room = [];
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
                this.confirmLoading = true
                var param = {}
                var room = [];
                var roomList = JSON.parse(JSON.stringify(this.roomList));
                var choose_room = JSON.parse(JSON.stringify(this.choose_room));
                console.log('roomList', roomList);
                console.log('choose_room', choose_room);
                var room_single = {};
                for(var i in roomList) {
                    if (roomList[i] && roomList[i]['room_num'] > 0  && choose_room[i] > 0) {
                        room_single = {};
                        room_single['room_id'] = roomList[i]['room_id'];
                        room_single['room_num'] = roomList[i]['room_num'];
                        room.push(room_single);
                    }
                }
                param['room'] = room;
                var  len = room.length;
                console.log('propertyCreateOrder-len', len)
                console.log('propertyCreateOrder-param', param)
                var  len = room.length;
                console.log('propertyCreateOrder-len', len)
                console.log('propertyCreateOrder-param', param)
                if (len>0) {
                    var pathInfo = this.getRouterPath('property_packages_single_buy_order')
                    console.log('pathInfo',pathInfo)
                    this.confirmLoading = false;
                    this.$router.push({ path: pathInfo, query: { room: JSON.stringify(room) } })
                } else {
                    this.confirmLoading = false;
                    this.$message.warning('请至少选择一个'+store.getters.config.room_name+'套餐');
                    return false;
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
            goPay() {
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
                    }
                    this.compute_type = 1;
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
      /* margin-top: 10px; */
      margin: 10px;
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

  .buy-room-box {
    background-color: #f7f9fe;    
    padding: 35px 10px 0 10px;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .buy-room-box.active {
    background-color: #f0f4fe;
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
  .buy-room-num {
    font-weight:400;
    color: #111;
  }
  .buy-room-num img {
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
  .buy-room-box .choose_icon {
    background-image: url(../../../../assets/images/no_check.png?t=02);
    background-size: cover;
  }
  .buy-room-box.active .choose_icon {
    background-image: url(../../../../assets/images/checked.png?t=02);
    background-size: cover;
  }

  .pay-info-box {
      margin-top: 290px;
  }
  .pay-info-box1 {
      margin-top: 20px;
  }
  .pay-info-box .packages-end-time {
      font-size: 16px;
      color: red;
  }
  .pay-info-box1 .packages-end-time {
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