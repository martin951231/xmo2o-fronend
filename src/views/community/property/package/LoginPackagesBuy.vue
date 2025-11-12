<template>

  <div class="box">
    <div class="parent">
    <div class="divs" id="pics">
      <div class="package" v-for="(item,index) in packageData" :key="index" @mousedown="handlemouse"
           @mouseleve="leave"
           @click="clickDoSome(index)"
      >
        <div class="package-top">
          <div class="title" :class="{ 'active': item.package_try_end_time }"><h1>{{item.package_title}}</h1></div>
          <div class="explain"><h4>{{item.txt_des}}</h4></div>
          <div class="explain-date" v-if="item.package_try_end_time"><h5>当前套餐将于{{item.package_try_end_time}}过期</h5></div>
        </div>
        <div class="package-centre" v-if="item.content">
          <div v-if="item.content && item.content.property">
            <div ><h3>物业管理后台</h3></div>
            <div class="" v-for="(property,indexp) in item.content.property" :key="indexp">
              <a-row type="flex">
                <a-col :span="4">
                </a-col>
                <a-col :span="10"  style="text-align: left;">
                  <div class="">{{property.name}}</div>
                </a-col>
                <a-col :span="9">
                  <div class="">√</div>
                </a-col>
                <a-col :span="1">
                </a-col>
              </a-row>
            </div>
          </div>
          <br/>
          <div v-if="item.content && item.content.community">
            <div><h3>{{$store.getters.config.house_name}}管理后台</h3></div>
            <div class="" v-for="(community,indexs) in item.content.community" :key="indexs">
              <a-row type="flex">
                <a-col :span="4">
                </a-col>
                <a-col :span="10"  style="text-align: left;">
                  <div class="">{{community.name}}</div>
                </a-col>
                <a-col :span="9">
                  <div class="">√</div>
                </a-col>
                <a-col :span="1">
                </a-col>
              </a-row>
            </div>


          </div>
        </div>
        <div class="package-centre prompt" v-if="!item.content">该套餐仅包括物业基本管理功能</div>
        <div class="package-bottom">
          <div class="fot-money">￥{{item.package_price}}/年</div>
          <div class="footer">包含{{$store.getters.config.room_name}}数：{{item.room_num}}间</div>
          <!-- <div class="footer">试用时间：{{item.package_try_days}}天</div> -->
          <div class="footer buy-num" v-if="item.pitch_type==1 && item.package_end_period>0">
             <a-row type="flex">
              <a-col :span="5">
              </a-col>
              <a-col :span="6">
                续费周期
              </a-col>
              <a-col :span="8">
                  <a-row type="flex">
                    <a-col :span="5">
                        <div style="width: 100%;text-align: center;">
                          <img v-if="buy_periods>1" src="../../../../assets/images/minus.png?t=02" @click="munus_period(index,item.package_end_period)"/>
                          <img v-else src="../../../../assets/images/minus_no.png?t=02" />
                        </div>
                    </a-col>
                    <a-col :span="1">
                    </a-col>
                    <a-col :span="10">
                       <a-input style="width:100%;text-align: center;" size="small" :value="buy_periods"/>
                    </a-col>
                    <a-col :span="1">
                    </a-col>
                    <a-col :span="5">
                        <div style="width: 100%;text-align: center;">
                          <img v-if="buy_periods<item.package_end_period" src="../../../../assets/images/plus.png?t=02" @click="plus_period(index,item.package_end_period)"/>
                          <img v-else src="../../../../assets/images/plus_no.png?t=02"/>
                        </div>
                    </a-col>
                  </a-row>
              </a-col>
              <a-col :span="5">
              </a-col>
            </a-row>
          </div>
          <div class="table-operator">
            <a-button v-if="item.pitch_type==0" class="b-btn ant-btn ant-btn-primary b-btn" disabled>立即使用</a-button>

            <!-- <router-link v-if="item.pitch_type==1 && item.package_end_period>0" class="b-btn ant-btn ant-btn-primary b-btn" type="primary" :to="{ name: 'property_packages_room_order_buy' ,params:{package_id: item.package_id, package_num: buy_periods, type: 1, order_id: item.order_id}}">立即续费</router-link> -->

            <a-button v-if="item.pitch_type==1 && item.package_end_period>0" class="b-btn ant-btn ant-btn-primary b-btn" type="primary" @click="packageRenewal(item, buy_periods, 1)">立即续费</a-button>
            <a-button v-if="item.pitch_type==1 && item.package_end_period<=0" class="b-btn ant-btn ant-btn-primary b-btn" type="primary" disabled>立即续费</a-button>
            <a-button v-if="item.pitch_type==2" class="b-btn ant-btn ant-btn-primary b-btn" type="primary" @click="packageRenewal(item, buy_periods, 2)">立即升级</a-button>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  </div>
</template>
<script>
    import packageApi from '@/api/community/property/packages';

    export default {
        name: 'LoginPackagesBuy',
        data () {
            return {
                packageData:[],
                package_id: '',
                package_title: "",
                package_try_days: 0,
                package_price: "",
                room_num: '',
                status: '',
                sort: '',
                details: "",
                content: {
                    property: [],
                    community: []
                },
                property:[],
                community:[],
                isDrag:false,//是否在拖拽
                isClick:false,//是否是单击
                buy_periods: 1,
                loadPost: false,
            }
        },
        activated () {
            this.packageList();
        },
        mounted() {
            this.packageList();
        },
        methods: {
            packageList() {
                if (this.loadPost) {
                  return false;
                }
                this.loadPost = true;
                console.log('propertyGetOrderPackage', packageApi.propertyGetOrderPackage)
                this.request(packageApi.propertyGetOrderPackage,{'is_overdue':1})
                    .then((res) => {
                        this.loadPost = false;
                        console.log('res', res)
                        this.packageData = res
                    })
            },
            munus_period(index, package_end_period) {
              var num = this.buy_periods ? this.buy_periods : 0;
              if (num<=1) {
                this.buy_periods = 0;
              } else {
                this.buy_periods = num - 1;
              }
            },
            plus_period(index, package_end_period) {
              var num = this.buy_periods ? this.buy_periods : 1;
              var buy_periods = num + 1;
              if (buy_periods>=package_end_period) {
                buy_periods = package_end_period;
              }
              this.buy_periods = buy_periods;
            },
            handleOk() {
                // this.packageTree()
                console.log('确认消息',1)
            },
            packageRenewal(package_data,buy_periods, type) {
                // var pathInfo = this.getRouterPath('propertyLoginPackagesRoomBuy')
                // var pathInfo = '/community/property/package/LoginPackagesRoomBuy';
                var pathInfo = '/property/property/package/LoginPackagesRoomBuy';
                console.log('pathInfo',pathInfo)
                this.$router.push({ path: pathInfo, query: { package_id: package_data.package_id, package_num: buy_periods, type: type, order_id: package_data.order_id } })
            },
            handlemouse(e) {
                let startTime, endTime;

                let child = document.getElementsByClassName('parent')[0];
                let parent = document.getElementsByClassName('divs')[0];
                let box = document.getElementsByClassName('box')[0];
                // 使用this.$refs.name获取dom元素,可能会获取到vue组件,他不支持获取元素的宽高以及监听鼠标事件
                let widthDiffer = parent.offsetWidth - child.offsetWidth;
                if (widthDiffer > 0) {
                    //如果grand真实宽度比parent宽度长,那么就不用滑动了,直接返回
                    this.isClick = true;
                    return
                }
                console.log(parent);
                console.log('child',child.offsetWidth);
                console.log('parent',parent.offsetWidth);
                console.log('box',box.offsetWidth);
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
                }

            },
        }

    }

</script>

<style>
  .parent {
    position: absolute;
    white-space: nowrap;
  }
  .box {
    text-align: center;
    margin: 10px;
    /*border: 1px solid #eee;*/
    height: 98%;
    width: 98%;
    font-weight: bold;
    /*box-shadow: 0 0 3px 1px #eee;*/
    white-space: nowrap;
    position:relative;
  }

  .divs{
    display: flex;
    height: 900px;
    white-space: nowrap;/*文本不会换行，文本会在在同一行上继续*/
    flex-wrap: nowrap;
    position:relative;
    overflow: hidden;
  }
  .box::-webkit-scrollbar{
    display: none;
  }
  h3{
    font-weight:bold;
  }
  .package{
    border: 1px solid #eee;
    background-color: white;
    max-height: calc(100% - 120px);
    width: 350px;
    min-width: 350px;
    margin: 15px;
    display: inline-block;/*行内块元素*/
  }

  .package-top{
    border: 1px solid white;
    width: 100%;
    min-height: 140px;
    /*background: #6eccdf;*/
    /* background-image: linear-gradient(#4e57cd, #7a90f2); */
    background-image: url(../../../../assets/images/package_title.png);
    background-size: cover;
  }
  .package-top h1,h2,h4{
    color: white;
  }
  .package-centre{
    border-bottom: 1px solid #eee;
    width: 100%;
    height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 0;
  }
  .package-centre::-webkit-scrollbar{
      width: 8px;
      height: 16px;
      background-color: #F5F5F5;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  .package-centre::-webkit-scrollbar-track{
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
      background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  .package-centre::-webkit-scrollbar-thumb{
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: #555;
  }



  .package-bottom{
    width: 100%;
    padding: 10px;
  }
  .prompt{
    padding-top: 50px;
  }
  .title{
    text-align:center;
    margin-top: 45px;
  }
  .title.active {
    text-align:center;
    margin-top: 25px;
  }
  .explain{
    margin-top: 10px;
  }
  .explain-date{
    text-align: center;
  }
  .explain-date h5 {
    width: 200px;
    padding: 4px 1px;
    background-color: rgb(255, 255, 255,0.3);
    border-radius: 25px;
    margin-left: 22%;
  }
  .content{
    width: 50%;
    float: left;
    text-align:center;
  }
  .content-right{
    text-align:center;
    width: 50%;
    float: left;
  }
  .fa-book{
    width: 100%;
    height: 20px;
    font-size: 15px;
    margin-top: 5px;
    text-align:center;
  }
  .table-operator {
    margin-bottom: 24px;
    margin-top: 10px;
  }
  .b-btn{
    width: 120px;
    border-radius:6px;
  }
  .fot-money{
    font-size: 20px;margin-top: 10px;
  }
  .footer{
    margin-top: 5px;
  }
  .buy-num img {
      width: 23px;
      height: 23px;
      box-shadow:-1px 0 1px #eee, /*左边阴影*/  
               1px 0 1px #eee, /*右边阴影*/  
               0 -1px 1px #eee, /*顶部阴影*/  
               0 1px 1px #eee; /*底边阴影*/  
  }
</style>