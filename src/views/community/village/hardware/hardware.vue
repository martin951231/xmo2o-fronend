<template>
  <div class="container">
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
    <div class="head_bg_img"></div>
    <div class="head_box">
      <div class="title">硬件运维大数据</div>
      <div class="time">{{timeData}}</div>
    </div>
    <div class="content_box">
      <div class="left_box">
        <BlockBox class="box_1" title="门禁设备状态">
          <swiper v-if="true" ref="mySwiper" :options="swiperOptions_a" @click-slide="handleClickSlide"
            @slide-change-transition-start="slideChangeTransitionStart" :aoto-updata="true" class="details_list">
            <div class="swiper-pagination" slot="pagination"></div>
            <swiper-slide class="swiper_slide_1" v-for="(items, index) in Number(pageIndex_1) + Number(1)" :key="index">
              <div class="echarts_box_1">
                <div class="top_echarts_box">
                  <div @click.stop="goDevice(1)" :id="'maina' + index" class="echarts_1"></div>
                  <div @click.stop="goDevice(2)" :id="'mainb' + index" class="echarts_1"></div>
                  <div @click.stop="goDevice(3)" :id="'mainc' + index" class="echarts_1"></div>
                </div>
                <div class="bottom_echarts_box">
                  <div :id="'maind' + index" class="echarts_2"></div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </BlockBox>
        <BlockBox class="box_2" title="开门方式统计">
          <swiper v-if="true" ref="mySwiper_a" @slide-change-transition-start="slideChangeTransitionStart_b"
            :aoto-updata="true" :options="swiperOptions_a" class="details_list">
            <div class="swiper-pagination" slot="pagination"></div>
            <swiper-slide class="swiper_slide_1" v-for="(items, indexs) in Number(pageIndex_3) + Number(1)"
              :key="indexs">
              <div class="echarts_box_1">
                <div class="top_echarts_box">
                  <div class="tab_bar">
                    <div class="tab_name" @click="tab_current(index,item.key)"
                      :style="index==num?'background-color: rgba(1, 171, 255, 1);':''" v-for="(item,index) in open_door"
                      :key="index">
                      {{item.value}}
                    </div>
                  </div>
                </div>
                <a-spin :spinning="spinning">
                  <div class="bottom_echarts_box">
                    <div class="item_bar" v-for="(item,index) in msg2_list" v-if="msg2_list.length > 0">
                      <div class="box_name">{{item.village_name}}</div>
                      <div class="bar_box">
                        <div class="bar" :style="'width:' + item.ratio + ';background:'+ item.background"></div>
                      </div>
                      <div class="bar_value">{{item.total_num}}</div>
                    </div>
                    <NoData v-if="msg2_list.length == 0"></NoData>
                    <div class="all_num">总次数：{{open_total_num}}</div>
                  </div>
                </a-spin>
              </div>
            </swiper-slide>
          </swiper>
        </BlockBox>
      </div>
      <div class="center_box">
        <BlockBox class="box_3" :title="$store.getters.config.house_name+'充电桩消费统计'">
          <swiper v-if="true" ref="mySwiper" @slide-change-transition-start="slideChangeTransitionStart_a"
            :aoto-updata="true" :options="swiperOptions_a" class="details_list">
            <swiper-slide class="swiper_slide_1" v-for="(items, index) in Number(pageIndex_2) + Number(1)" :key="index">
              <div class="echarts_box_1">
                <div :id="'maine'+ index" class="echarts_3"></div>
              </div>
              <!-- <div class="echarts_box_1" :style="isshow?'display: none;':''">
                <div id="main5" class="echarts_3"></div>
              </div> -->
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
          <img slot="custom" @click="switchShow" class="echarts_switch"
            src="../../../../assets/communityimg/hardware_switch.png">
        </BlockBox>
        <BlockBox class="box_4" title="人脸门禁实时记录">
          <div class="echarts_box_1">
            <div v-if="true">
              <div class="center_box_2" v-if="msg5_list.length > 1">
                <div class="table-scroll" id="table_1">
                  <div class="table-flex_body" v-for="(item,index) in msg5_list">
                    <div class="text_6" v-for="(items,indexs) in item">
                      <img v-if="items.type == 1" :src="items.title"
                        @click="previewImage(items.title)"
                        style="width: 30px;height: 30px;display: inline-block;" alt="">
                      <div :title="items.title" class="table_title" v-if="items.type == 0">
                        {{items.title?items.title:'暂无数据'}}
                      </div>
                    </div>
                    <!-- <div v-if="items.type == 0" class="text_6" v-for="(items,indexs) in item">{{items.title?items.title:'暂无数据'}}</div> -->
                  </div>
                </div>
              </div>
            </div>
            <NoData v-if="msg5_list.length < 1"></NoData>
          </div>
        </BlockBox>
      </div>
      <div class="right_box">
        <BlockBox class="box_5" title="充电桩消费总金额统计">
          <div class="echarts_box_1">
            <div class="top_echarts_box">
              <div @click="goDevice(4)" id="main6" class="echarts_1"></div>
              <div @click="goDevice(5)" id="main7" class="echarts_1"></div>
              <div @click="goDevice(6)" id="main8" class="echarts_1"></div>
            </div>
            <div class="bottom_echarts_box">
              <div class="item_bar">
                <div class="box_name">累计消费金额</div>
                <div class="bar_box">
                  <div class="bar" :style="'width:'+cumulative_ratio"></div>
                </div>
                <div class="bar_value">{{cumulative_price}}</div>
              </div>
              <div class="item_bar">
                <div class="box_name">今日消费金额</div>
                <div class="bar_box">
                  <div class="bar" :style="'width:'+ today_ratio"></div>
                </div>
                <div class="bar_value">{{today_price}}</div>
              </div>
              <div class="item_bar">
                <div class="box_name">昨日消费金额</div>
                <div class="bar_box">
                  <div class="bar" :style="'width:'+ yesterday_ratio"></div>
                </div>
                <div class="bar_value">{{yesterday_price}}</div>
              </div>
            </div>
          </div>
        </BlockBox>
        <BlockBox class="box_6" title="报警信息">
          <div class="echarts_box_1">
            <div class="mini_box_1" v-if="msg6_list.length > 1">
              <div class="table-right">
                <div class="table-scroll_right" id="table_2">
                  <div class="table-flex_body_right" v-for="(item,index) in msg6_list" :key="index">
                    <div class="text_1" :title="items.title" @mouseenter="enters($event,items.title,index)"
                      @mouseleave="leaver()" v-for="(items,indexs) in item" :key="indexs">{{items.title}}</div>
                  </div>
                </div>
              </div>
              <div class="dian"></div>
              <div class="dian_1"></div>
              <div class="dian_2"></div>
              <div class="dian_3"></div>
            </div>
            <NoData v-else></NoData>
          </div>
        </BlockBox>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts' //引入echarts 
  import 'echarts-liquidfill/src/liquidFill.js';
  import BlockBox from './components/Blockbox.vue'
  import NoData from './components/NoData.vue'
  import BigImg from './components/BigImg.vue'
  import {
    Swiper,
    SwiperSlide,
  } from 'vue-awesome-swiper'
  import 'swiper/swiper-bundle.css'
  import Swiper2, {
    Navigation,
    Pagination
  } from 'swiper';
  Swiper2.use([Navigation, Pagination]);
  import configVillageApi from '@/api/community/village/index'
  import path from '@/router/router-path.js'
  import Vue from 'vue'
  import Rem from '../../../../utils/rem.js'
  Rem.getrem()
  var timer = null
  export default {
    props: {},
    components: {
      BlockBox,
      Swiper,
      SwiperSlide,
      NoData,
      BigImg
    },
    computed: {
      swiper_a() {
        return this.$refs.mySwiper_a.$swiper
      }
    },
    data() {
      return {
        currentindex: 0,
        spinning: false,
        num: 0,
        isshow: true,
        refresh: 0,
        // 轮播配置
        swiperOptions_a: {
          slidesPerView: 1,
          spaceBetween: 20,
          freeMode: false,
          freeModeMomentumBounce: false,
          pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
          },
          paginationClickable: true,
          // loop: true
        },
        // 轮播配置
        swiperOptions: {
          slidesPerView: 1,
          spaceBetween: 20,
          freeMode: false,
          freeModeMomentumBounce: false,
          pagination: {
            el: '.swiper-pagination',
          },
          paginationClickable: true,
          // loop: true
        },
        cumulative_ratio: '',
        cumulative_price: '',
        today_ratio: '',
        today_price: '',
        yesterday_ratio: '',
        yesterday_price: '',
        open_total_num: '',
        msg1: {},
        msg2_list: [],
        msg5: {},
        msg5_list: [],
        msg6: {},
        msg6_list: [], // 报警信息列表
        open_door: [], // 门禁设备列表
        msg3_list: [], // 门禁设备列表
        pageIndex_1: 1,
        pageIndex_2: 1,
        pageIndex_3: 1,
        msg4_list: [], // 门禁设备列表
        copyPageIndex_2: 0,
        copyPageIndex_3: 0,
        type: 1,
        currentPage: 1,
        loading: 1,
        isStop: 0,
        pageCount: 0,
        currentPage_a: 1,
        pageCount_a: 0,
        current_time: 0,
        timeData: '',
        firstLoad: true,
        firstLoad_a: true,
        device_total_num: 0,
        device_total_ratio: 0,
        device_online_num: 0,
        device_online_ratio: 0,
        device_offline_num: 0,
        device_offline_ratio: 0,
        charging_total_num: 0,
        charging_total_ratio: 0,
        charging_total_num: 0,
        charging_total_ratio: 0,
        charging_offline_num: 0,
        charging_offline_ratio: 0,
        showImg:false,
        imgSrc: ''
      }
    },
    created() {

    },
    destroyed() {
      clearInterval(timer)
    },
    mounted() {
      this.firstLoad = true
      this.firstLoad_a = true
      this.gethardwareIndex()
      this.getOpenDoorLog()
      this.getWarningLog()
      this.getOpenDoorStatistics(0)
      this.getFaceDeviceStatistics(0)
      this.getPileEquipmentStatistics(0)
      // this.myEcharts5()
    },
    methods: {
      goDevice(type) {
        let routeUrl = this.$router.resolve({
             path: path.DeviceInfoIndex,
             query: {type:type}
         });
         window.open(routeUrl.href, '_blank');
      },
      bindScroll(ref) {
        let _this = this;
        let div = ref;
        div.addEventListener('scroll', function() {
          // 判断是否滚动到底部
          if (_this.hasMore() && _this.getScrollTop(ref) + _this.getHeight(ref) > (_this.getScrollHeight(ref) -
              20) && _this
            .loading == 1 && _this.isStop == 0) {
            // 如果开关打开则加载数据
            if (_this.hasMore()) { //还有数据
              _this.currentPage++;
              _this.loading = 0;
              _this.getOpenDoorLog()
              console.log("加载的数据", _this.currentPage)
            }
          }
        });
      },
      bindScroll_a(ref) {
        let _this = this;
        let div = ref;
        div.addEventListener('scroll', function() {
          // 判断是否滚动到底部
          if (_this.hasMore_a() && _this.getScrollTop(ref) + _this.getHeight(ref) > (_this.getScrollHeight(ref) -
              20) && _this
            .loading == 1 && _this.isStop == 0) {
            // 如果开关打开则加载数据
            if (_this.hasMore_a()) { //还有数据
              _this.currentPage_a++;
              _this.loading = 0;
              _this.getWarningLog()
              console.log("加载的数据", _this.currentPage)
            }
          }
        });
      },
      hasMore() {
        return this.currentPage < (this.pageCount + 1);
      },
      hasMore_a() {
        return this.currentPage_a < (this.pageCount_a + 1);
      },
      loadFinish() {
        this.loading = 1;
      },
      resetPagination() {
        this.currentPage = 0;
        document.getElementById(this.divId).scrollTop = 0;
      },
      getScrollTop(ref) {
        let div = document.getElementById(this.divId);
        if (!this.divId) {
          div = ref
        }
        return div.scrollTop;
      },
      getScrollHeight(ref) {
        let div = document.getElementById(this.divId);
        if (!this.divId) {
          div = ref
        }
        return div.scrollHeight;
      },
      getHeight(ref) {
        let div = document.getElementById(this.divId);
        if (!this.divId) {
          div = ref
        }
        return div.clientHeight;
      },
      handleClickSlide(index) { 
        console.log('第一个滑动swiperClick slide!', index);
      },
      slideChangeTransitionStart(index) {
        console.log('第一个滑动swiperClick slide!', index);

        this.getFaceDeviceStatistics(index.activeIndex)
      },
      slideChangeTransitionStart_a(index) {
        console.log('第er个滑动swiperClick slide!', index);
        this.copyPageIndex_2 = index.activeIndex
        this.getPileEquipmentStatistics(index.activeIndex)
      },
      slideChangeTransitionStart_b(index) {
        console.log('第三个滑动swiperClick slide!', index);
        this.copyPageIndex_3 = index.activeIndex
        this.getOpenDoorStatistics(index.activeIndex)
      },
      //数据统计1
      gethardwareIndex() {
        this.request(configVillageApi.hardwareIndex).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.$nextTick(() => {
              this.msg1 = res;
              this.cumulative_ratio = res.charging_device.cumulative.ratio;
              this.cumulative_price = res.charging_device.cumulative.price;
              this.today_ratio = res.charging_device.today.ratio;
              this.today_price = res.charging_device.today.price;
              this.yesterday_ratio = res.charging_device.yesterday.ratio;
              this.yesterday_price = res.charging_device.yesterday.price;
              this.open_door = res.open_door
              this.current_time = res.current_time
              
              this.device_total_num = res.face_device.device_total.total.num
              this.device_total_ratio = res.face_device.device_total.total.ratio
              this.device_online_num = res.face_device.device_total.online.num
              this.device_online_ratio = res.face_device.device_total.online.ratio
              this.device_offline_num = res.face_device.device_total.offline.num
              this.device_offline_ratio = res.face_device.device_total.offline.ratio
              
              this.charging_total_num = res.charging_device.device_total.total.num
              this.charging_total_ratio = res.charging_device.device_total.total.ratio
              this.charging_online_num = res.charging_device.device_total.online.num
              this.charging_online_ratio = res.charging_device.device_total.online.ratio
              this.charging_offline_num = res.charging_device.device_total.offline.num
              this.charging_offline_ratio = res.charging_device.device_total.offline.ratio
              clearInterval(timer)
              timer = setInterval(() => {
                this.current_time++
                this.timeData = this.formatDate()
                console.log('时间多少了', this.timeData)
              }, 1000)
              this.myEcharts(0)
              this.myEcharts1(0)
              this.myEcharts2(0)
              this.myEcharts4(0)
              this.myEcharts6()
              this.myEcharts7()
              this.myEcharts8()
              this.$forceUpdate()
            })
            console.log("草的鸡儿哈极速对决撒娇this.msg", this.msg1)

          }
        });
      },
      // 门禁设备状态
      getFaceDeviceStatistics(index) {
        this.pageIndex_1 = Number(index) + Number(1)
        this.request(configVillageApi.getFaceDeviceStatistics, {
          page: this.pageIndex_1,
          limit: 6,
        }).then(res => {
          console.log('+++++++', res)
          if (res && res.list.length > 0) {
            setTimeout(() => {
              this.$nextTick(() => {
                this.msg3_list = res.list;
                this.myEcharts(index)
                this.myEcharts1(index)
                this.myEcharts2(index)
                this.myEcharts3(index)
              })
              console.log("循环的索引", this.pageIndex_1)
            }, 500)
          } else {
            if (index == 0) {
              this.pageIndex_1 = Number(this.pageIndex_1) - Number(1)
            } else {
              this.pageIndex_1 = Number(index) - Number(1)
            }
            // this.$message.success('暂无更多数据！');
          }
        });
      },
      // 门禁设备状态
      getPileEquipmentStatistics(index) {
        this.pageIndex_2 = Number(index) + Number(1)
        this.request(configVillageApi.getPileEquipmentStatistics, {
          page: this.pageIndex_2,
          limit: 6,
        }).then(res => {
          console.log('+++++++', res)
          if (res && res.list.length > 0) {
            setTimeout(() => {
              this.$nextTick(() => {
                this.msg4_list = res.list;
                this.myEcharts4(index)
              })
              console.log("循环的索引---->", this.pageIndex_2)
            }, 500)
          } else {
            if (index == 0) {
              this.pageIndex_2 = Number(this.pageIndex_2) - Number(1)
            } else {
              this.pageIndex_2 = Number(index) - Number(1)
            }
            this.copyPageIndex_2 = Number(this.copyPageIndex_2) - Number(1)
            // this.$message.success('暂无更多数据！');
          }
        });
      },
      // 人脸门禁实时记录
      getOpenDoorLog() {
        this.request(configVillageApi.getOpenDoorLog, {
          page: this.currentPage,
          limit: 10,
        }).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.$nextTick(() => {
              this.msg5 = res;
              // this.msg5_list = res.list
              this.pageCount = res.page_count
              if (this.currentPage <= this.pageCount) {
                this.msg5_list = this.msg5_list.concat(res.list)
                if (this.firstLoad) {
                  setTimeout(()=>{
                    let div = document.getElementById('table_1');
                    this.bindScroll(div)
                  },3000)
                  this.firstLoad = false
                }
                this.loadFinish()
                console.log("人脸识别的数据", this.msg5_list)
              } else {
                // this.$message.success('暂无更多数据！');
              }
              this.$forceUpdate()
            })
            console.log("this.msg5", this.msg5)
          }
        });
      },
      // 开门方式统计
      getOpenDoorStatistics(index) {
        this.pageIndex_3 = Number(index) + Number(1)
        this.spinning = true
        this.request(configVillageApi.getOpenDoorStatistics, {
          type: this.type,
          page: this.pageIndex_3,
          limit: 6,
        }).then(res => {
          console.log('+++++++', res)
          this.spinning = false
          if (res && res.list.length > 0) {
            this.$nextTick(() => {
              this.msg2_list = res.list;
            })

            console.log("this.msg2_list", this.msg2_list)
          } else {
            if (index == 0) {
              this.pageIndex_3 = Number(this.pageIndex_3) - Number(1)
            } else {
              this.pageIndex_3 = Number(index)
            }
            this.msg2_list = res.list;
            this.copyPageIndex_3 = Number(this.copyPageIndex_3) - Number(1)
            // this.$message.success('暂无更多数据！');
          }
          this.open_total_num = res.total_num
        });
      },
      // 报警信息
      getWarningLog() {
        this.request(configVillageApi.getWarningLog, {
          page: this.currentPage_a,
          limit: 10,
        }).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.$nextTick(() => {
              this.msg6 = res;
              this.pageCount_a = res.page_count
              if (this.currentPage_a <= this.pageCount_a) {
                this.msg6_list = this.msg6_list.concat(res.list)
                if (this.firstLoad_a) {
                  setTimeout(()=>{
                    let div_a = document.getElementById('table_2');
                    this.bindScroll_a(div_a)
                  },3000)
                  this.firstLoad_a = false
                }
                this.loadFinish()
                console.log("报警信息的数据", this.msg6_list)
              } else {
                // this.$message.success('暂无更多数据！');
              }
              this.$forceUpdate()
            })
            console.log("this.msg6", this.msg6)
          }
        });
      },
      // 按钮切换
      switchShow() {
        this.isshow = !this.isshow
        console.log('看看显示不', this.isshow)
        this.myEcharts4(this.copyPageIndex_2)
        // if(this.isshow){

        //   console.log('看看显示不---》1',this.isshow)
        // }else{
        //   this.myEcharts5()
        //   console.log('看看显示不----》2',this.isshow)
        // }
      },
      tab_current(index, type) {
        console.log('你好呀', index)
        this.num = index
        this.type = type
        this.swiper_a.slideTo(0, 1000, true)
        this.getOpenDoorStatistics(0)
      },
      // 鼠标移入触发事件
      enters(e, title, index) {
        console.log('++++++++++++++++++', e, e.clientX, index)
        if (index) {
          this.showPopup = true
          this.topH = e.clientY - 50
          this.leftH = e.clientX
          this.text = title
          console.log('++++++++++++++++++', e.clientX, index)
        }
      },
      // 鼠标移出
      leaver(e) {
        this.showPopup = false
      },
      myEcharts(index) {
        // 基于准备好的dom，初始化echarts实例
        let echarts_id = 'maina' + index
        console.log('id是多少呀', echarts_id)
        const myChart = this.$echarts.init(document.getElementById(echarts_id));
        let total = this.device_total_num
        let ratio = this.device_total_ratio
        console.log('你好远', total)
        let data = 499; //数值大小
        let max = 500; //满刻度大小
        let option = {
          // backgroundColor: '#050038',
          // width: 120,
          // height: 120,
          title: {
            text: '总设备',
            bottom: 0,
            left: '28%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 12,
              color: '#ffffff',
            },
          },
          series: [{
              type: 'liquidFill',
              radius: '60%',
              center: ['50%', '50%'],
              data: [ratio], // data个数代表波浪数
              backgroundStyle: {
                borderWidth: 1,
                color: 'rgb(255,0,255,0.1)',
              },
              // 修改波浪颜色
              color: ['rgba(24, 197, 254, 1)'], //所有波浪一个颜色
              // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
              label: {
                normal: {
                  formatter: (total).toFixed(0) + '',
                  textStyle: {
                    fontSize: 12,
                    color: 'rgba(43, 250, 255, 1)'
                  },
                },
              },
              outline: {
                show: false,
              },
            },
            {
              type: "pie",
              center: ["50%", "50%"],
              radius: ["75%", "80%"],
              hoverAnimation: false,
              data: [{
                name: "",
                value: data,
                label: {
                  show: true,
                  position: "center",
                  color: "rgba(0,0,0,0)",
                  fontSize: 12,
                  fontWeight: "bold",
                  formatter: function(o) {
                    return data
                  }
                },
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(84, 224, 254, 1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(8, 9, 255, 1)',
                    },
                  ]),
                },
              }, { //画剩余的刻度圆环
                name: "",
                value: max - data,
                label: {
                  show: false
                },
                itemStyle: {
                  color: 'RGBA(28, 84, 147, 1)',
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                }
              }]
            },
            {
              type: 'pie',
              center: ['50%', '52%'],
              radius: ['78%', '80%'],
              hoverAnimation: false,
              data: [{
                  name: '',
                  value: 0,
                  label: {
                    show: true,
                    position: 'center',
                    color: 'rgba(0,0,0,0)',
                    fontSize: 12,
                    fontWeight: 'bold',
                    formatter: function(o) {
                      return data;
                    },
                  },
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5089FE',
                      },
                      {
                        offset: 1,
                        color: '#52C5FF',
                      },
                    ]),
                  },
                },
                {
                  //画中间的图标
                  name: '',
                  value: 0,
                  label: {
                    position: 'inside',
                    backgroundColor: "#52C5FF",
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    padding: 5,
                  },
                },
                {
                  //画剩余的刻度圆环
                  name: '',
                  value: max - data,
                  label: {
                    show: false,
                  },
                  itemStyle: {
                    color: 'rgba(0,0,0,0)',
                  },
                },
              ],
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      myEcharts1(index) {
        // 基于准备好的dom，初始化echarts实例
        let echarts_id = 'mainb' + index
        console.log('id是多少呀', echarts_id)
        const myChart_1 = this.$echarts.init(document.getElementById(echarts_id));
        let bili = 500 / this.device_total_num
        let online = this.device_online_num
        let ratio = this.device_online_ratio
        let data = online * bili; //数值大小
        let max = 500; //满刻度大小
        let option = {
          // backgroundColor: '#050038',
          // width: 120,
          // height: 120,
          title: {
            text: '在线设备',
            bottom: 0,
            left: '28%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 12,
              color: '#ffffff',
            },
          },
          series: [{
              type: 'liquidFill',
              radius: '60%',
              center: ['50%', '50%'],
              data: [ratio], // data个数代表波浪数
              backgroundStyle: {
                borderWidth: 1,
                color: 'rgb(255,0,255,0.1)',
              },
              // 修改波浪颜色
              color: ['rgba(24, 197, 254, 1)'], //所有波浪一个颜色
              // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
              label: {
                normal: {
                  formatter: (online).toFixed(0) + '',
                  textStyle: {
                    fontSize: 12,
                    color: 'rgba(43, 250, 255, 1)'
                  },
                },
              },
              outline: {
                show: false,
              },
            },
            {
              type: "pie",
              center: ["50%", "50%"],
              radius: ["75%", "80%"],
              hoverAnimation: false,
              data: [{
                name: "",
                value: data,
                label: {
                  show: true,
                  position: "center",
                  color: "rgba(0,0,0,0)",
                  fontSize: 12,
                  fontWeight: "bold",
                  formatter: function(o) {
                    return data
                  }
                },
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(84, 224, 254, 1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(8, 9, 255, 1)',
                    },
                  ]),
                },
              }, { //画剩余的刻度圆环
                name: "",
                value: max - data,
                label: {
                  show: false
                },
                itemStyle: {
                  color: 'RGBA(28, 84, 147, 1)',
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                }
              }]
            },
            {
              type: 'pie',
              center: ['50%', '52%'],
              radius: ['78%', '80%'],
              hoverAnimation: false,
              data: [{
                  name: '',
                  value: 0,
                  label: {
                    show: true,
                    position: 'center',
                    color: 'rgba(0,0,0,0)',
                    fontSize: 12,
                    fontWeight: 'bold',
                    formatter: function(o) {
                      return data;
                    },
                  },
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5089FE',
                      },
                      {
                        offset: 1,
                        color: '#52C5FF',
                      },
                    ]),
                  },
                },
                {
                  //画中间的图标
                  name: '',
                  value: 0,
                  label: {
                    position: 'inside',
                    backgroundColor: "#52C5FF",
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    padding: 5,
                  },
                },
                {
                  //画剩余的刻度圆环
                  name: '',
                  value: max - data,
                  label: {
                    show: false,
                  },
                  itemStyle: {
                    color: 'rgba(0,0,0,0)',
                  },
                },
              ],
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart_1.setOption(option);
      },
      myEcharts2(index) {
        // 基于准备好的dom，初始化echarts实例
        let echarts_id = 'mainc' + index
        console.log('id是多少呀', echarts_id)
        const myChart_2 = this.$echarts.init(document.getElementById(echarts_id));
        let bili = 500 / this.device_total_num
        let offline = this.device_offline_num
        let ratio = this.device_offline_ratio
        let data = offline * bili; //数值大小
        let max = 500; //满刻度大小
        let option = {
          // backgroundColor: '#050038',
          // width: 120,
          // height: 120,
          title: {
            text: '离线设备',
            bottom: 0,
            left: '28%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 12,
              color: '#ffffff',
            },
          },
          series: [{
              type: 'liquidFill',
              radius: '60%',
              center: ['50%', '50%'],
              data: [ratio], // data个数代表波浪数
              backgroundStyle: {
                borderWidth: 1,
                color: 'rgb(255,0,255,0.1)',
              },
              // 修改波浪颜色
              color: ['rgba(24, 197, 254, 1)'], //所有波浪一个颜色
              // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
              label: {
                normal: {
                  formatter: (offline).toFixed(0) + '',
                  textStyle: {
                    fontSize: 12,
                    color: 'rgba(43, 250, 255, 1)'
                  },
                },
              },
              outline: {
                show: false,
              },
            },
            {
              type: "pie",
              center: ["50%", "50%"],
              radius: ["75%", "80%"],
              hoverAnimation: false,
              data: [{
                name: "",
                value: data,
                label: {
                  show: true,
                  position: "center",
                  color: "rgba(0,0,0,0)",
                  fontSize: 12,
                  fontWeight: "bold",
                  formatter: function(o) {
                    return data
                  }
                },
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(84, 224, 254, 1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(8, 9, 255, 1)',
                    },
                  ]),
                },
              }, { //画剩余的刻度圆环
                name: "",
                value: max - data,
                label: {
                  show: false
                },
                itemStyle: {
                  color: 'RGBA(28, 84, 147, 1)',
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                }
              }]
            },
            {
              type: 'pie',
              center: ['50%', '52%'],
              radius: ['78%', '80%'],
              hoverAnimation: false,
              data: [{
                  name: '',
                  value: 0,
                  label: {
                    show: true,
                    position: 'center',
                    color: 'rgba(0,0,0,0)',
                    fontSize: 12,
                    fontWeight: 'bold',
                    formatter: function(o) {
                      return data;
                    },
                  },
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5089FE',
                      },
                      {
                        offset: 1,
                        color: '#52C5FF',
                      },
                    ]),
                  },
                },
                {
                  //画中间的图标
                  name: '',
                  value: 0,
                  label: {
                    position: 'inside',
                    backgroundColor: "#52C5FF",
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    padding: 5,
                  },
                },
                {
                  //画剩余的刻度圆环
                  name: '',
                  value: max - data,
                  label: {
                    show: false,
                  },
                  itemStyle: {
                    color: 'rgba(0,0,0,0)',
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  }
                },
              ],
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart_2.setOption(option);
      },
      myEcharts3(index) {
        // 基于准备好的dom，初始化echarts实例 
        let echarts_id = 'maind' + index
        console.log('id是多少呀', echarts_id)
        const myChart_3 = this.$echarts.init(document.getElementById(echarts_id));
        let villagename_list = this.msg3_list.map(item => {
          return item.village_name
        })
        let online_num_list = this.msg3_list.map(item => {
          return item.online_num
        })
        let offline_num_list = this.msg3_list.map(item => {
          return item.offline_num
        })
        const option = {
          // tooltip: {
          //   trigger: 'axis',
          //   axisPointer: {
          //     type: 'shadow'
          //   }
          // },
          barWidth: 30,
          legend: {
            icon: 'rect',
            itemHeight: 5,
            itemWidth: 5,
            right: '10%',
            top: '1%',
            textStyle: {
              color: 'rgba(202, 242, 245, 1)',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: villagename_list,
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 150, 255, 0.7)',
              },
              formatter: function(value) {
                let valueTxt = '';
                if (value.length > 4) {
                  valueTxt = value.substring(0, 4) + '...';
                } else {
                  valueTxt = value;
                }
                return valueTxt;
              }
            },
            axisTick: {
              show: false, //隐藏刻度线
            },
            axisLine: {
              show: false,
              lineStyle: {
                type: 'dotted',
                color: '#fff', //坐标线的颜色
                width: '1' //坐标线的宽度
              }
            },

          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 150, 255, 0.7)',
              },
            },
            axisTick: {
              show: false, //隐藏刻度线
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(151,151,151,0.5)',
                type: 'dashed'
              }
            }
          }],
          series: [{
              name: '在线',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: online_num_list,
              label: {
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return ' ';
                  }
                },
                show: true,
                position: 'inside',
                fontSize: 12,
              },
              itemStyle: {
                color: 'rgba(1, 171, 255, 1)'
              }
            },
            {
              name: '离线',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: offline_num_list,
              label: {
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return ' ';
                  }
                },
                show: true,
                position: 'inside',
                fontSize: 12,
              },
              itemStyle: {
                color: 'rgba(249, 109, 101, 1)'
              }
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart_3.setOption(option);
      },
      myEcharts4(index) {
        // 基于准备好的dom，初始化echarts实例
        let echarts_id = 'maine' + index
        console.log('id是多少呀----4', echarts_id)
        const myChart_4 = this.$echarts.init(document.getElementById(echarts_id));
        let villagename_list = this.msg4_list.map(item => {
          return item.village_name
        })
        let total_price_list = this.msg4_list.map(item => {
          return item.total_price
        })
        let today_price_list = this.msg4_list.map(item => {
          return item.today_price
        })
        let yesterday_price_list = this.msg4_list.map(item => {
          return item.yesterday_price
        })
        let type = this.msg1.pile_device.map(item => {
          return item.title
        })

        let datalist = [{
            name: type[0],
            type: 'bar',
            barWidth: 24,
            barGap: '40%',
            data: today_price_list,
            itemStyle: {
              normal: {
                color: 'rgba(49, 88, 255, 1)',
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  offset: [0, 0],
                  textStyle: { //数值样式
                    color: 'rgba(255, 255, 255, 1)',
                    fontSize: 12,
                    zIndex: 999,
                  }
                }
              }
            }
          },
          {
            name: type[1],
            type: 'bar',
            barWidth: 24,
            barGap: '40%',
            data: yesterday_price_list,
            itemStyle: {
              normal: {
                color: 'rgba(0, 191, 126, 1)',
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  offset: [0, 0],
                  textStyle: { //数值样式
                    color: 'rgba(255, 255, 255, 1)',
                    fontSize: 12,
                    zIndex: 999,
                  }
                }
              }
            }
          },
          {
            name: type[2],
            type: 'bar',
            barWidth: 24,
            barGap: '40%',
            data: total_price_list,
            itemStyle: {
              normal: {
                color: 'rgba(255, 204, 0, 1)',
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  offset: [0, 0],
                  textStyle: { //数值样式
                    color: 'rgba(255, 255, 255, 1)',
                    fontSize: 12,
                    zIndex: 999,
                  }
                }
              }
            }
          }
        ]
        let datalist_a = [{
            name: type[0],
            type: 'line',
            smooth: true,
            barWidth: 24,
            barGap: '40%',
            data: today_price_list,
            itemStyle: {
              normal: {
                color: 'rgba(49, 88, 255, 1)',
                label: {
                  show: false, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'rgba(255, 255, 255, 1)',
                    fontSize: 12
                  }
                }
              }
            }
          },
          {
            name: type[1],
            type: 'line',
            smooth: true,
            barWidth: 24,
            barGap: '40%',
            data: yesterday_price_list,
            itemStyle: {
              normal: {
                color: 'rgba(0, 191, 126, 1)',
                label: {
                  show: false, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'rgba(255, 255, 255, 1)',
                    fontSize: 12
                  }
                }
              }
            }
          },
          {
            name: type[2],
            type: 'line',
            smooth: true,
            barWidth: 24,
            barGap: '40%',
            data: total_price_list,
            itemStyle: {
              normal: {
                color: 'rgba(255, 204, 0, 1)',
                label: {
                  show: false, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'rgba(255, 255, 255, 1)',
                    fontSize: 12
                  }
                }
              }
            }
          }
        ]
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          barWidth: 10,
          legend: {
            top: '2%',
            left: '2%',
            data: type,
            icon: 'rect',
            itemHeight: 5,
            itemWidth: 5,
            textStyle: {
              color: 'rgba(202, 242, 245, 1)',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 150, 255, 0.7)',
              },
            },
            axisTick: {
              show: false, //隐藏刻度线
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(151,151,151,0.5)',
                type: 'dashed'
              }
            }
          },
          xAxis: {
            type: 'category',
            data: villagename_list,
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 150, 255, 0.7)',
              },
              formatter: function(value) {
                let valueTxt = '';
                if (value.length > 6) {
                  valueTxt = value.substring(0, 4) + '...';
                } else {
                  valueTxt = value;
                }
                return valueTxt;
              }
            },
            axisTick: {
              show: false, //隐藏刻度线
            },
            axisLine: {
              show: false,
              lineStyle: {
                type: 'dotted',
                color: '#fff', //坐标线的颜色
                width: '1' //坐标线的宽度
              }
            },
          },
          series: datalist,
        };
        let option_1 = {
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow'
            }
          },
          barWidth: 10,
          legend: {
            top: '2%',
            left: '2%',
            data: type,
            icon: 'rect',
            itemHeight: 5,
            itemWidth: 5,
            textStyle: {
              color: 'rgba(202, 242, 245, 1)',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 150, 255, 0.7)',
              },
            },
            axisTick: {
              show: false, //隐藏刻度线
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(151,151,151,0.5)',
                type: 'dashed'
              }
            }
          },
          xAxis: {
            type: 'category',
            data: villagename_list,
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 150, 255, 0.7)',
              },
            },
            axisTick: {
              show: false, //隐藏刻度线
            },
            axisLine: {
              show: false,
              lineStyle: {
                type: 'dotted',
                color: '#fff', //坐标线的颜色
                width: '1' //坐标线的宽度
              }
            },
          },
          series: datalist_a
        };
        // 使用刚指定的配置项和数据显示图表。
        if (this.isshow) {
          myChart_4.setOption(option);
          console.log('看看显示不---》1', this.isshow)
        } else {
          myChart_4.setOption(option_1);
          console.log('看看显示不----》2', this.isshow)
        }

      },
      myEcharts6() {
        // 基于准备好的dom，初始化echarts实例
        const myChart_6 = this.$echarts.init(document.getElementById('main6'));
        let total = this.charging_total_num
        let ratio = this.charging_total_ratio
        let data = 499; //数值大小
        let max = 500; //满刻度大小
        let option = {
          // backgroundColor: '#050038',
          // width: 120,
          // height: 120,
          title: {
            text: '总设备',
            bottom: 0,
            left: '28%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 12,
              color: '#ffffff',
            },
          },
          series: [{
              type: 'liquidFill',
              radius: '60%',
              center: ['50%', '50%'],
              data: [ratio], // data个数代表波浪数
              backgroundStyle: {
                borderWidth: 1,
                color: 'rgb(255,0,255,0.1)',
              },
              // 修改波浪颜色
              color: ['rgba(24, 197, 254, 1)'], //所有波浪一个颜色
              // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
              label: {
                normal: {
                  formatter: (total).toFixed(0) + '',
                  textStyle: {
                    fontSize: 12,
                    color: 'rgba(43, 250, 255, 1)'
                  },
                },
              },
              outline: {
                show: false,
              },
            },
            {
              type: "pie",
              center: ["50%", "50%"],
              radius: ["75%", "80%"],
              hoverAnimation: false,
              data: [{
                name: "",
                value: data,
                label: {
                  show: true,
                  position: "center",
                  color: "rgba(0,0,0,0)",
                  fontSize: 12,
                  fontWeight: "bold",
                  formatter: function(o) {
                    return data
                  }
                },
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(84, 224, 254, 1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(8, 9, 255, 1)',
                    },
                  ]),
                },
              }, { //画剩余的刻度圆环
                name: "",
                value: max - data,
                label: {
                  show: false
                },
                itemStyle: {
                  color: 'RGBA(28, 84, 147, 1)',
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                }
              }]
            },
            {
              type: 'pie',
              center: ['50%', '52%'],
              radius: ['78%', '80%'],
              hoverAnimation: false,
              data: [{
                  name: '',
                  value: 0,
                  label: {
                    show: true,
                    position: 'center',
                    color: 'rgba(0,0,0,0)',
                    fontSize: 12,
                    fontWeight: 'bold',
                    formatter: function(o) {
                      return data;
                    },
                  },
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5089FE',
                      },
                      {
                        offset: 1,
                        color: '#52C5FF',
                      },
                    ]),
                  },
                },
                {
                  //画中间的图标
                  name: '',
                  value: 0,
                  label: {
                    position: 'inside',
                    backgroundColor: "#52C5FF",
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    padding: 5,
                  },
                },
                {
                  //画剩余的刻度圆环
                  name: '',
                  value: max - data,
                  label: {
                    show: false,
                  },
                  itemStyle: {
                    color: 'rgba(0,0,0,0)',
                  },
                },
              ],
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart_6.setOption(option);
      },
      myEcharts7() {
        // 基于准备好的dom，初始化echarts实例
        const myChart_7 = this.$echarts.init(document.getElementById('main7'));
        let bili = 500 / this.charging_total_num
        console.log("看看数据是多少", this.charging_total_num)
        let online = this.charging_online_num
        let ratio = this.charging_online_ratio
        let data = online * bili; //数值大小
        let max = 500; //满刻度大小
        let option = {
          // backgroundColor: '#050038',
          // width: 120,
          // height: 120,
          title: {
            text: '在线设备',
            bottom: 0,
            left: '28%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 12,
              color: '#ffffff',
            },
          },
          series: [{
              type: 'liquidFill',
              radius: '60%',
              center: ['50%', '50%'],
              data: [ratio], // data个数代表波浪数
              backgroundStyle: {
                borderWidth: 1,
                color: 'rgb(255,0,255,0.1)',
              },
              // 修改波浪颜色
              color: ['rgba(24, 197, 254, 1)'], //所有波浪一个颜色
              // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
              label: {
                normal: {
                  formatter: (online).toFixed(0) + '',
                  textStyle: {
                    fontSize: 12,
                    color: 'rgba(43, 250, 255, 1)'
                  },
                },
              },
              outline: {
                show: false,
              },
            },
            {
              type: "pie",
              center: ["50%", "50%"],
              radius: ["75%", "80%"],
              hoverAnimation: false,
              data: [{
                name: "",
                value: data,
                label: {
                  show: true,
                  position: "center",
                  color: "rgba(0,0,0,0)",
                  fontSize: 12,
                  fontWeight: "bold",
                  formatter: function(o) {
                    return data
                  }
                },
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(84, 224, 254, 1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(8, 9, 255, 1)',
                    },
                  ]),
                },
              }, { //画剩余的刻度圆环
                name: "",
                value: max - data,
                label: {
                  show: false
                },
                itemStyle: {
                  color: 'RGBA(28, 84, 147, 1)',
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                }
              }]
            },
            {
              type: 'pie',
              center: ['50%', '52%'],
              radius: ['78%', '80%'],
              hoverAnimation: false,
              data: [{
                  name: '',
                  value: 0,
                  label: {
                    show: true,
                    position: 'center',
                    color: 'rgba(0,0,0,0)',
                    fontSize: 12,
                    fontWeight: 'bold',
                    formatter: function(o) {
                      return data;
                    },
                  },
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5089FE',
                      },
                      {
                        offset: 1,
                        color: '#52C5FF',
                      },
                    ]),
                  },
                },
                {
                  //画中间的图标
                  name: '',
                  value: 0,
                  label: {
                    position: 'inside',
                    backgroundColor: "#52C5FF",
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    padding: 5,
                  },
                },
                {
                  //画剩余的刻度圆环
                  name: '',
                  value: max - data,
                  label: {
                    show: false,
                  },
                  itemStyle: {
                    color: 'rgba(0,0,0,0)',
                  },
                },
              ],
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart_7.setOption(option);
      },
      myEcharts8() {
        // 基于准备好的dom，初始化echarts实例
        const myChart_8 = this.$echarts.init(document.getElementById('main8'));
        let bili = 500 / this.charging_total_num
        let offline = this.charging_offline_num
        let ratio = this.charging_offline_ratio
        let data = offline * bili; //数值大小
        let max = 500; //满刻度大小
        let option = {
          // backgroundColor: '#050038',
          // width: 120,
          // height: 120,
          title: {
            text: '离线设备',
            bottom: 0,
            left: '28%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 12,
              color: '#ffffff',
            },
          },
          series: [{
              type: 'liquidFill',
              radius: '60%',
              center: ['50%', '50%'],
              data: [ratio], // data个数代表波浪数
              backgroundStyle: {
                borderWidth: 1,
                color: 'rgb(255,0,255,0.1)',
              },
              // 修改波浪颜色
              color: ['rgba(24, 197, 254, 1)'], //所有波浪一个颜色
              // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
              label: {
                normal: {
                  formatter: (offline).toFixed(0) + '',
                  textStyle: {
                    fontSize: 12,
                    color: 'rgba(43, 250, 255, 1)'
                  },
                },
              },
              outline: {
                show: false,
              },
            },
            {
              type: "pie",
              center: ["50%", "50%"],
              radius: ["75%", "80%"],
              hoverAnimation: false,
              data: [{
                name: "",
                value: data,
                label: {
                  show: true,
                  position: "center",
                  color: "rgba(0,0,0,0)",
                  fontSize: 12,
                  fontWeight: "bold",
                  formatter: function(o) {
                    return data
                  }
                },
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(84, 224, 254, 1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(8, 9, 255, 1)',
                    },
                  ]),
                },
              }, { //画剩余的刻度圆环
                name: "",
                value: max - data,
                label: {
                  show: false
                },
                itemStyle: {
                  color: 'RGBA(28, 84, 147, 1)',
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                }
              }]
            },
            {
              type: 'pie',
              center: ['50%', '52%'],
              radius: ['78%', '80%'],
              hoverAnimation: false,
              data: [{
                  name: '',
                  value: 0,
                  label: {
                    show: true,
                    position: 'center',
                    color: 'rgba(0,0,0,0)',
                    fontSize: 12,
                    fontWeight: 'bold',
                    formatter: function(o) {
                      return data;
                    },
                  },
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5089FE',
                      },
                      {
                        offset: 1,
                        color: '#52C5FF',
                      },
                    ]),
                  },
                },
                {
                  //画中间的图标
                  name: '',
                  value: 0,
                  label: {
                    position: 'inside',
                    backgroundColor: "#52C5FF",
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    padding: 5,
                  },
                },
                {
                  //画剩余的刻度圆环
                  name: '',
                  value: max - data,
                  label: {
                    show: false,
                  },
                  itemStyle: {
                    color: 'rgba(0,0,0,0)',
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  }
                },
              ],
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart_8.setOption(option);
      },
      formatDate() {
        var g = this.current_time * 1000; //定义一个时间戳变量
        var now = new Date(g); //创建一个指定的日期对象
        console.log('sdsadsad', this.current_time);
        var year = now.getFullYear(); //取得4位数的年份
        var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
        var date = now.getDate(); //返回日期月份中的天数（1到31）
        var hour = now.getHours(); //返回日期中的小时数（0到23）
        var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
        var second = now.getSeconds(); //返回日期中的秒数（0到59）
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        return year + "-" + month + "-" + date + " " + hour + ":" + minute;
      },
      previewImage(src){
          this.showImg = true
          this.imgSrc = src
      },
      
      viewImg(){
          this.showImg = false
      }
    },
  }
</script>

<style lang="less" scoped>
  @rem: 192; //定义页面尺寸

  .container {
    width: 100%;
    height: 100%;
    // min-height: 100vh;
    display: flex;
    background-color: #2e2e2e;
    box-sizing: border-box;
    background-image: url(../../../../assets/communityimg/hardware_bigbg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    flex-direction: column;

    .head_bg_img {
      width: 1920/@rem * 1rem;
      height: 220/@rem * 1rem;
      background-image: url(../../../../assets/communityimg/hardware_head.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .head_box {
      width: 100%;
      height: 84/@rem * 1rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .title {
        font-size: 40/@rem * 1rem;
        font-family: FZQingKeBenYueSongS-R-GB;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 84/@rem * 1rem;
        text-shadow: 0/@rem * 1rem 5/@rem * 1rem 5/@rem * 1rem rgba(0, 21, 112, 0.75);
        background: linear-gradient(0deg, #0091F6 0%, #96F6FA 71.044921875%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-57%, -42%);
      }

      .time {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 50/@rem * 1rem;
        font-size: 20/@rem * 1rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #00CEEC;
        line-height: 84/@rem * 1rem;
      }
    }

    .block {
      width: 100%;
      height: 84/@rem * 1rem;
    }

    .content_box {
      width: 1880/@rem * 1rem;
      height: 90%;
      padding: 20/@rem * 1rem 20/@rem * 1rem 0 20/@rem * 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;

      .left_box {
        flex: 1;
        height: 100%;

        .box_1 {
          width: 100%;
          height: 50% !important;

          .details_list {
            width: 100%;
            height: 100%;

            .swiper_slide_1 {
              width: 100%;
              height: 100%;
              padding-bottom: 28.1%;
              background-size: cover;
              background-position: center center;
              background-repeat: no-repeat;

              /* Center slide text vertically */
              display: -webkit-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              display: flex;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              -webkit-justify-content: center;
              justify-content: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              -webkit-align-items: center;
              align-items: center;

              .echarts_box_1 {
                width: 100%;
                height: 100%;
                margin-top: 18%;

                .top_echarts_box {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-around;

                  .echarts_1 {
                    width: 110/@rem * 1rem;
                    height: 140/@rem * 1rem;
                  }
                }

                .bottom_echarts_box {
                  width: 100%;

                  .echarts_2 {
                    width: 100%;
                    height: 200/@rem * 1rem;
                  }
                }
              }
            }

            /deep/ .swiper-pagination-bullet {

              background: #0096FF;
            }

            /deep/ .swiper-pagination-bullet-active {
              width: 14/@rem * 1rem;
              height: 8/@rem * 1rem;
              background: #0096FF;
              border-radius: 4/@rem * 1rem;
            }

            /deep/ .swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
              left: 88% !important;
              -webkit-transform: translateX(-50%);
              transform: translateX(-50%);
              white-space: nowrap;
            }
          }
        }

        .box_2 {
          width: 100%;
          height: 47% !important;
          margin-top: 3%;

          .details_list {
            width: 100%;
            height: 100%;

            .swiper_slide_1 {
              width: 100%;
              height: 100%;
              padding-bottom: 28.1%;
              background-size: cover;
              background-position: center center;
              background-repeat: no-repeat;

              /* Center slide text vertically */
              display: -webkit-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              display: flex;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              -webkit-justify-content: center;
              justify-content: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              -webkit-align-items: center;
              align-items: center;

              .echarts_box_1 {
                width: 100%;
                height: 100%;
                margin-top: 18%;
                display: flex;
                flex-direction: column;

                .top_echarts_box {
                  width: 100%;
                  height: 10%;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  margin-top: 3%;

                  .tab_bar {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    border: 1/@rem * 1rem solid #01ABFF;
                    border-radius: 17/@rem * 1rem;
                    overflow: hidden;

                    .tab_name {
                      width: 120/@rem * 1rem;
                      height: 33/@rem * 1rem;
                      border-right: 1/@rem * 1rem solid #01ABFF;
                      font-size: 14/@rem * 1rem;
                      font-family: PingFang SC;
                      font-weight: 500;
                      color: #FFFFFF;
                      line-height: 33/@rem * 1rem;
                      text-align: center;
                      cursor: pointer;
                    }
                  }
                }

                .bottom_echarts_box {
                  width: 100%;
                  height: 80%;
                  margin-left: 25/@rem * 1rem;
                  margin-top: 10%;
                  display: flex;
                  flex-direction: column;
                  position: relative;

                  .item_bar {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-top: 12/@rem * 1rem;

                    .box_name {
                      width: 84/@rem * 1rem;
                      font-size: 14/@rem * 1rem;
                      font-family: PingFang SC;
                      font-weight: 500;
                      color: rgba(2, 147, 246, 1);
                      line-height: 14/@rem * 1rem;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      text-align: center;
                    }

                    .bar_box {
                      width: 320/@rem * 1rem;
                      height: 16/@rem * 1rem;
                      background: RGBA(11, 54, 123, 0.5);
                      margin-left: 12/@rem * 1rem;

                      .bar {
                        width: 20%;
                        height: 16/@rem * 1rem;
                        background: linear-gradient(-81deg, #1DD5E6, #46AEF7);
                      }
                    }

                    .bar_value {
                      font-size: 16/@rem * 1rem;
                      font-family: PingFang SC;
                      font-weight: 400;
                      color: #FFFFFF;
                      margin-left: 13/@rem * 1rem;
                    }
                  }

                  .all_num {
                    position: absolute;
                    right: 40/@rem * 1rem;
                    top: -30/@rem * 1rem;
                    font-size: 16/@rem * 1rem;
                    font-family: PingFang SC;
                    font-weight: bold;
                    color: #0096FF;
                  }
                }
              }
            }

            .swiper-pagination {
              .swiper-pagination-bullet-active {
                background-color: #F29B76;
              }
            }
          }
        }
      }

      .center_box {
        width: 766/@rem * 1rem;
        height: 100%;
        margin: 0 20/@rem * 1rem;

        .box_3 {
          width: 100% !important;
          height: 50% !important;
          position: relative;

          .details_list {
            width: 100%;
            height: 100%;

            .swiper_slide_1 {
              width: 100%;
              height: 100%;
              padding-bottom: 28.1%;
              background-size: cover;
              background-position: center center;
              background-repeat: no-repeat;

              /* Center slide text vertically */
              display: -webkit-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              display: flex;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              -webkit-justify-content: center;
              justify-content: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              -webkit-align-items: center;
              align-items: center;

              .echarts_box_1 {
                width: 100%;
                height: 100%;
                margin-top: 18%;

                .echarts_3 {
                  width: 100%;
                  height: 350/@rem * 1rem;
                }

              }
            }
          }

          /deep/ .swiper-pagination-fraction,
          .swiper-pagination-custom,
          .swiper-container-horizontal>.swiper-pagination-bullets {
            top: 10/@rem * 1rem;
            left: 339/@rem * 1rem;
            width: 100%;
            pointer-events: none;
          }
        }

        .echarts_switch {
          position: absolute;
          right: 40/@rem * 1rem;
          top: 60/@rem * 1rem;
          cursor: pointer;
          z-index: 999;
        }

        .box_4 {
          width: 100% !important;
          height: 47% !important;
          margin-top: 2.1%;

          .echarts_box_1 {
            width: 100%;
            height: 100%;
            margin-top: 6%;

            .center_box_2 {
              width: 97%;
              height: 83%;
              border: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
              margin: 10/@rem * 1rem;
              position: relative;

              .table-scroll {
                width: 100%;
                height: 285/@rem * 1rem;
                overflow-y: scroll;
                margin-top: 3.5%;

                .table-flex_body {
                  width: 100%;
                  display: flex;
                  flex-direction: row;

                  .text_6 {
                    width: 100%;
                    max-width: 92/@rem * 1rem;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12/@rem * 1rem;
                    padding: 5/@rem * 1rem;
                    color: rgba(0, 202, 255, 1);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    border-right: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
                    border-bottom: 1/@rem * 1rem solid rgba(19, 60, 123, 1);

                    .table_title {
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      cursor: default;
                    }
                  }

                  .text_6:first-of-type {
                    width: 100%;
                    text-align: center;
                    color: rgba(0, 202, 255, 1);
                    border-right: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
                    border-bottom: 1/@rem * 1rem solid rgba(19, 60, 123, 1);
                  }
                }

                .table-flex_body:first-of-type {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  background-color: rgba(0, 150, 255, 0.3);
                  position: absolute;
                  margin-top: -28/@rem * 1rem;

                  .text_6 {
                    width: 100%;
                    text-align: center;
                    font-size: 12/@rem * 1rem;
                    padding: 5/@rem * 1rem;
                    color: rgba(171, 186, 228, 1);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    border-right: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                    border-bottom: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                  }
                }
              }
            }
          }
        }
      }

      .right_box {
        flex: 1;
        height: 100%;

        .box_5 {
          width: 100%;
          height: 50% !important;

          .echarts_box_1 {
            width: 100%;
            height: 100%;
            margin-top: 3%;

            .top_echarts_box {
              width: 100%;
              height: 50%;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;

              .echarts_1 {
                width: 110/@rem * 1rem;
                height: 140/@rem * 1rem;
              }
            }

            .bottom_echarts_box {
              width: 100%;
              height: 40%;
              margin-left: 25/@rem * 1rem;
              margin-top: 2%;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;

              .item_bar {
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;

                .box_name {
                  font-size: 14/@rem * 1rem;
                  font-family: PingFang SC;
                  font-weight: 500;
                  color: #31ABE3;
                  line-height: 14/@rem * 1rem;
                }

                .bar_box {
                  width: 300/@rem * 1rem;
                  height: 16/@rem * 1rem;
                  background: RGBA(11, 54, 123, 0.5);
                  border-radius: 8/@rem * 1rem;
                  margin-left: 12/@rem * 1rem;

                  .bar {
                    width: 20%;
                    height: 16/@rem * 1rem;
                    background: linear-gradient(-81deg, #1DD5E6, #46AEF7);
                    border-radius: 8/@rem * 1rem;
                  }
                }

                .bar_value {
                  font-size: 16/@rem * 1rem;
                  font-family: PingFang SC;
                  font-weight: 400;
                  color: #FFFFFF;
                  margin-left: 13/@rem * 1rem;
                }
              }
            }
          }
        }

        .box_6 {
          width: 100% !important;
          height: 47% !important;
          margin-top: 3%;

          .echarts_box_1 {
            width: 95%;
            height: 83%;
            margin-top: 12%;

            .mini_box_1 {
              width: 100%;
              height: 88%;
              position: relative;

              .table-right {
                width: 100%;
                height: 100%;
                border: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                position: relative;

                .table-scroll_right {
                  width: 100%;
                  height: 100%;
                  overflow-y: scroll;
                  margin-top: 4.4%;

                  .table-flex_body_right {
                    width: 98%;
                    display: flex;
                    flex-direction: row;
                    background-color: rgba(0, 150, 255, 0.1);
                    margin: 8/@rem * 1rem 0/@rem * 1rem;

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12/@rem * 1rem;
                      padding: 5/@rem * 1rem 0;
                      color: rgba(0, 202, 255, 1);
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      border-right: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                      border-bottom: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                      cursor: default;
                    }

                    .text_1:first-of-type {
                      width: 100%;
                      text-align: center;
                      font-size: 12/@rem * 1rem;
                      padding: 5/@rem * 1rem 0;
                      color: rgba(0, 202, 255, 1);
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                    }
                  }

                  .table-flex_body_right:first-of-type {
                    width: 97%;
                    display: flex;
                    flex-direction: row;
                    background-color: rgba(0, 150, 255, 0);
                    position: absolute;
                    margin-top: -28/@rem * 1rem;
                    border-top: 1/@rem * 1rem solid rgba(0, 174, 255, 0.3);
                    border-bottom: 1/@rem * 1rem solid rgba(0, 174, 255, 0.3);

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12/@rem * 1rem;
                      padding: 2/@rem * 1rem 0;
                      margin: 2/@rem * 1rem 0;
                      background-color: rgba(0, 150, 255, 0.3);
                      color: rgba(201, 229, 255, 1);
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                    }
                  }

                  .table-flex_body_right:first-of-type:hover {
                    width: 97%;
                    display: flex;
                    flex-direction: row;
                    background-color: rgba(0, 150, 255, 0);
                    position: absolute;
                    margin-top: -28/@rem * 1rem;
                    border-top: 1/@rem * 1rem solid rgba(0, 174, 255, 0.3);
                    border-bottom: 1/@rem * 1rem solid rgba(0, 174, 255, 0.3);

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12/@rem * 1rem;
                      padding: 2/@rem * 1rem 0;
                      margin: 2/@rem * 1rem 0;
                      background-color: rgba(0, 150, 255, 1);
                      color: rgba(201, 229, 255, 1);
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                    }
                  }

                  .table-flex_body_right:hover {
                    background-color: rgba(49, 88, 255, 0.65);

                    .text_1 {
                      // color: rgba(0, 0, 0, 1);
                    }
                  }
                }
              }

              .dian {
                width: 2/@rem * 1rem;
                height: 2/@rem * 1rem;
                border-radius: 50%;
                background-color: RGBA(2, 135, 217, 1);
                position: absolute;
                top: -10%;
                left: -1%;
              }

              .dian_1 {
                width: 2/@rem * 1rem;
                height: 2/@rem * 1rem;
                border-radius: 50%;
                background-color: RGBA(2, 135, 217, 1);
                position: absolute;
                top: -10%;
                right: 2%;
              }

              .dian_2 {
                width: 2/@rem * 1rem;
                height: 2/@rem * 1rem;
                border-radius: 50%;
                background-color: RGBA(2, 135, 217, 1);
                position: absolute;
                top: 0%;
                left: -1%;
              }

              .dian_3 {
                width: 2/@rem * 1rem;
                height: 2/@rem * 1rem;
                border-radius: 50%;
                background-color: RGBA(2, 135, 217, 1);
                position: absolute;
                top: 0%;
                right: 2%;
              }
            }

            .tip_text_box {
              width: 95%;
              height: 67%;
              margin: 15/@rem * 1rem 15/@rem * 1rem 15/@rem * 1rem 18/@rem * 1rem;
              padding-right: 10/@rem * 1rem;
              overflow-y: scroll;
              display: flex;
              justify-content: center;
              align-items: center;

              .tip_text {
                font-size: 14/@rem * 1rem;
                color: #0056af;
              }
            }
          }
        }
      }
    }

    /deep/ .swiper-pagination-bullet {
      background: #0096FF;
    }

    /deep/ .swiper-pagination-bullet-active {
      width: 14/@rem * 1rem;
      height: 8/@rem * 1rem;
      background: #0096FF;
      border-radius: 4/@rem * 1rem;
    }

    /deep/ .swiper-pagination-fraction,
    .swiper-pagination-custom,
    .swiper-container-horizontal>.swiper-pagination-bullets {
      top: 10/@rem * 1rem;
      left: 222/@rem * 1rem;
      width: 100%;
      pointer-events: none;
    }

    /deep/ .swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
      left: 88% !important;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      white-space: nowrap;
    }

    /deep/ .ant-spin-blur {
      opacity: 0;
    }

    ::-webkit-scrollbar {
      width: 3/@rem * 1rem;
      height: 16/@rem * 1rem;
      background-color: rgba(0, 62, 142, 0.3);
      right: 5/@rem * 1rem;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2/@rem * 1rem rgba(0, 0, 0, 0.3);
      border-radius: 10/@rem * 1rem;
      background-color: rgba(0, 62, 142, 0.3);
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10/@rem * 1rem;
      -webkit-box-shadow: inset 0 0 6/@rem * 1rem rgba(0, 0, 0, .3);
      background-color: rgba(0, 72, 165, 1);
    }
  }
</style>
