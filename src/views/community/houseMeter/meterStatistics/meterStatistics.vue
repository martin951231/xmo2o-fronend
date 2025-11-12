<template>
  <div class="bg-box">
    <!-- top -->
    <div class="top-box">
      <img src="../../../../assets/meterimg/logo.png" alt class="logo-img" />
    </div>
    <!-- top_menu -->
    <div class="top_menu">
      <div class="list_item" v-for="(item,index) in msg1">
        <img :src="item.logo" alt="">
        <div class="left_item_1">
          <div class="text_1">{{item.value}}</div>
          <div class="text_2">{{item.title}}</div>
        </div>
      </div>
    </div>
    <!-- container -->
    <div class="container">
      <div class="flex_1">
        <div class="flex_top_1">
          <img src="../../../../assets/meterimg/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/meterimg/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/meterimg/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/meterimg/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/meterimg/left_icon.png" alt="">
            <div class="mini_title">设备告警管理</div>
            <img src="../../../../assets/meterimg/right_icon.png" alt="">
          </div>
          <div class="top_box_1">
            <div class="mini_box_1" v-if="msg2 && msg2[0]">
              <div class="table-right">
                <div class="table-scroll_right">
                  <div class="table-flex_body_right" v-for="(item,index) in msg2">
                    <div class="text_1" @mouseenter="enters($event,items.title,index)" @mouseleave="leaver()"
                      v-for="(items,indexs) in item">{{items.title}}</div>
                  </div>
                </div>
              </div>
              <div class="dian"></div>
              <div class="dian_1"></div>
              <div class="dian_2"></div>
              <div class="dian_3"></div>
            </div>
            <div class="tip_text_box" v-else>
              <div class="tip_text">暂无记录</div>
            </div>
          </div>
        </div>
        <div class="flex_top_2">
          <baidu-map :center="center" :zoom="zoom" @ready="handler" @click="selectcity" :scroll-wheel-zoom="true"
            class="BMap" style="width: 98%;height: 96%;">
            <bm-boundary :name="propcity" fillColor="#2681f3" :strokeWeight="2" strokeColor="blue"></bm-boundary>
            <bm-marker :position="center" :dragging="false" @click="infoWindowOpens" animation="BMAP_ANIMATION_BOUNCE"
              :icon="{url: require('../../../../assets/meterimg/Group.png'), size: {width: 72, height: 66}}">
            </bm-marker>
            <bm-overlay :position="centerPopup" pane="labelPane" v-if="showmap" :class="{sample: true, active}"
              @draw="draw" @mouseover.native="active = true" @mouseleave.native="active = false">
              <div class="map_box">
                <div class="item_box">
                  <div class="text_1" v-if="$store.getters.config">入住{{$store.getters.config.house_name}}</div>
                  <div class="text_2">{{mapinfo.village_count}}</div>
                </div>
                <div class="line"></div>
                <div class="item_box">
                  <div class="text_1">总房屋数</div>
                  <div class="text_2">{{mapinfo.room_count}}</div>
                </div>
                <div class="line"></div>
                <div class="item_box">
                  <div class="text_1">设备总数</div>
                  <div class="text_2">{{mapinfo.ele_count}}</div>
                </div>
                <div class="line"></div>
                <div class="item_box">
                  <div class="text_1">设备告警总数</div>
                  <div class="text_2">{{mapinfo.ele_warn_count}}</div>
                </div>
              </div>
            </bm-overlay>
          </baidu-map>
          <img src="../../../../assets/meterimg/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/meterimg/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/meterimg/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/meterimg/border_4.png" class="border_4" alt="">
        </div>
        <div class="flex_top_3">
          <img src="../../../../assets/meterimg/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/meterimg/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/meterimg/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/meterimg/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/meterimg/left_icon.png" alt="">
            <div class="mini_title">设备耗电分析</div>
            <img src="../../../../assets/meterimg/right_icon.png" alt="">
          </div>
          <div id="main1" class="my_echarts_1"></div>
          <div class="top_box_2">
            <div class="mini_box_1" v-if="true">
              <div class="table-right">
                <div class="table-scroll_right">
                  <div class="table-flex_body_right" v-for="(item,index) in msg3.village_power">
                    <div class="text_1" @mouseenter="enters($event,items.title,index)" @mouseleave="leaver()"
                      v-for="(items,indexs) in item">{{items.title}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tip_text_box" v-if="msg6_nodata">
              <div class="tip_text">暂无记录</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex_2">
        <div class="flex_top_4">
          <img src="../../../../assets/meterimg/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/meterimg/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/meterimg/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/meterimg/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/meterimg/left_icon.png" alt="">
            <div class="mini_title">报修工单统计</div>
            <img src="../../../../assets/meterimg/right_icon.png" alt="">
          </div>
          <div class="flex_row_1">
            <div class="top_box_3" v-if="false">
              <div class="flex_box_1">
                <div class="item_box">
                  <div class="text_1">工单总数</div>
                  <div class="text_2">17604</div>
                </div>
                <div class="line"></div>
                <div class="item_box">
                  <div class="text_1">工单总数</div>
                  <div class="text_2">17604</div>
                </div>
                <div class="line"></div>
                <div class="item_box">
                  <div class="text_1">工单总数</div>
                  <div class="text_2">17604</div>
                </div>
              </div>
              <div class="flex_box_2">
                <div id="main2" class="my_echarts_2"></div>
                <div id="main3" class="my_echarts_3"></div>
              </div>
            </div>
            <div class="tip_text_box" v-else>
              <div class="tip_text">暂无记录</div>
            </div>
            <div class="line_1"></div>
            <div class="top_box_4">
              <div class="mini_box_1" v-if="msg6 && msg6.list && msg6.list[0]">
                <div class="table-right">
                  <div class="table-scroll_right">
                    <div class="table-flex_body_right" v-for="(item,index) in msg6.list">
                      <div class="text_1" @mouseenter="enters($event,items.title,index)" @mouseleave="leaver()"
                        v-for="(items,indexs) in item">{{items.title}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tip_text_box" v-else>
                <div class="tip_text">暂无记录</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex_top_5">
          <img src="../../../../assets/meterimg/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/meterimg/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/meterimg/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/meterimg/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/meterimg/left_icon.png" alt="">
            <div class="mini_title">设备管理</div>
            <img src="../../../../assets/meterimg/right_icon.png" alt="">
          </div>
          <div class="top_box_5">
            <div class="title">
              <div class="text_1">设备总数</div>
              <div class="text_2">{{msg4.ele_count}}</div>
            </div>
            <div class="flex_box_3">
              <div id="main4" class="my_echarts_4"></div>
              <div id="main5" class="my_echarts_4"></div>
              <div id="main6" class="my_echarts_4"></div>
            </div>
            <div class="flex_box_4">
              <div class="mini_box_1" v-if="true">
                <div class="table-right">
                  <div class="table-scroll_right">
                    <div class="table-flex_body_right" v-for="(item,index) in msg4.list">
                      <div class="text_1" @mouseenter="enters($event,items.title,index)" @mouseleave="leaver()"
                        v-for="(items,indexs) in item">{{items.title}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tip_text_box" v-if="msg6_nodata">
                <div class="tip_text">暂无记录</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex_top_6">
          <img src="../../../../assets/meterimg/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/meterimg/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/meterimg/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/meterimg/border_4.png" class="border_4" alt="">
          <div class="top_title_box" style="background-size: 370px; 100%;">
            <img src="../../../../assets/meterimg/left_icon.png" alt="">
            <div class="mini_title">设备耗电费用分析</div>
            <img src="../../../../assets/meterimg/right_icon.png" alt="">
          </div>
          <div id="main7" class="my_echarts_7"></div>
          <div class="top_box_6">
            <div class="mini_box_1" v-if="true">
              <div class="table-right">
                <div class="table-scroll_right">
                  <div class="table-flex_body_right" v-for="(item,index) in msg5.village_power">
                    <div class="text_1" @mouseenter="enters($event,items.title,index)" @mouseleave="leaver()"
                      v-for="(items,indexs) in item">{{items.title}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tip_text_box" v-if="msg6_nodata">
              <div class="tip_text">暂无记录</div>
            </div>
          </div>
          <div class="circular"></div>
        </div>
      </div>
    </div>
    <div class="popup_box" v-if="showPopup" :style="'top:'+ topH + 'px;left:'+ leftH + 'px;'">
      {{text}}
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts' //引入echarts
  import configHouseMeterApi from '@/api/community/houseMeter/index'
  export default {
    // name: '大数据',
    data() {
      return {
        columns: [],
        msg1: {},
        msg2: [],
        msg3: {},
        msg4: {},
        msg5: {},
        msg6: {},
        msg6_nodata: false,
        mapinfo:{},
        center: {
          lng: 117.283042,
          lat: 31.86119
        },
        centerPopup: {
          lng: 117.283042,
          lat: 31.86119
        },
        zoom: 8,
        points: [],
        markerPoint: {},
        property_name: '',
        property_logo: '',
        num: -1,
        barHeight: '',
        text: '',
        topH: 0,
        leftH: 0,
        showPopup: false,
        active: false,
        showmap: true,
        propprovince: '', //省
        propcity: '', //市
        propcounty: '', //县
        propaddress: '', //详细地址
        longitude: 117.283042,// 记录点击经度
        latitude: 31.86119, // 记录点击纬度
        firstload:true,
      }
    },
    mounted() {
      this.firstload = true
      this.getMapInfo()
      this.getInfo1()
      this.getInfo2()
      this.getInfo3()
      this.getInfo4()
      this.getInfo5()
      this.myEcharts2()
      this.myEcharts3()
    },
    methods: {
      draw({
        el,
        BMap,
        map
      }) {
        const pixel = map.pointToOverlayPixel(new BMap.Point(this.longitude, this.latitude))
        el.style.left = pixel.x - 190 + 'px'
        el.style.top = pixel.y - 120 + 'px'
        this.centerPopup.lng = this.longitude; //自定义覆盖中心点
        this.centerPopup.lat = this.longitude; //自定义覆盖中心点
      },
      // 地图单击选择城市
      selectcity(e) {
        console.log(e)
        let _this = this;
        // _this.showmap = true
        _this.longitude = e.point.lng; //经度
        _this.latitude = e.point.lat; //维度
        _this.center.lng = _this.longitude; //中心点
        _this.center.lat = _this.latitude; //中心点
        _this.centerPopup.lng = _this.longitude; //自定义覆盖中心点
        _this.centerPopup.lat = _this.latitude; //自定义覆盖中心点
        let geocoder = new BMap.Geocoder(); //创建地址解析器的实例
        geocoder.getLocation(e.point, function(rs) {
          console.log(rs)
          _this.propprovince = rs.addressComponents.province //省
          _this.propcity = rs.addressComponents.city //市
          _this.propcounty = rs.addressComponents.district //县
          _this.propaddress = rs.addressComponents.address //详细地址
           _this.getMapInfo(_this.propcity)
        });

      },
      // 地图自定义点的单击事件
      infoWindowOpens() {

      },
      // 鼠标移入触发事件
      enters(e, title, index) {
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
      getConfig() {
        const config = this.$store.getters.config
        if (config) {
          this.config = config
          this.village_logo = this.config.system_admin_logo
          console.log("this.config", this.config)
        } else {
          setTimeout(() => {
            this.getConfig()
          }, 300)
        }
      },
      handler({
        BMap,
        map
      }) {
        // console.log(BMap, map)
        // this.getInfo10()
        // console.log('--------------', this.msg10)
        // this.center['lng'] = this.msg10.info.long
        // this.center['lat'] = this.msg10.info.lat
        // this.markerPoint['lng'] = this.msg10.info.long
        // this.markerPoint['lat'] = this.msg10.info.lat
        // this.zoom = 15
      },
      goUrl(url) {
        if (url == '') {
          return false
        }
        window.open(url)
      },
      //地图数据
      getMapInfo(propcity) {
        let propcity_name = ''
        if(propcity){
          propcity_name = propcity.replace("市","");
        }
        this.request(configHouseMeterApi.getTongjiCountByCity,{city:propcity_name}).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.mapinfo = res.info;
            if(this.firstload){
              this.center.lng = res.position.lng; //中心点
              this.center.lat = res.position.lat; //中心点
              this.propcity = res.position.name //市
              this.longitude = res.position.lng; //经度
              this.latitude = res.position.lat; //维度
              this.center.lng = res.position.lng; //中心点
              this.center.lat = res.position.lat; //中心点
              this.centerPopup.lng = res.position.lng; //自定义覆盖中心点
              this.centerPopup.lat = res.position.lat; //自定义覆盖中心点
              this.firstload = false
            }
            console.log("this.mapinfo", this.mapinfo)
          }
        });
      },
      //物业可视化大数据顶部数据统计1
      getInfo1() {
        this.request(configHouseMeterApi.getTongjiCount).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg1 = res;
            console.log("this.msg", this.msg1)
          }
        });
      },
      //设备告警管理
      getInfo2() {
        this.request(configHouseMeterApi.getEleWarnList).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg2 = res;
            console.log("this.msg2", this.msg2)
          }
        });
      },
      //设备耗电分析
      getInfo3() {
        this.request(configHouseMeterApi.powerConsumptionAnalysis).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg3 = res;
            console.log("this.msg3", this.msg3)
            this.myEcharts1()
          }
        });
      },
      //设备管理
      getInfo4() {
        this.request(configHouseMeterApi.deviceManage).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg4 = res;
            console.log("this.msg4", this.msg4)
            this.myEcharts4()
            this.myEcharts5()
            this.myEcharts6()
          }
        });
      },
      //设备耗电费用分析
      getInfo5() {
        this.request(configHouseMeterApi.powerConsumptionFeeAnalysis).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg5 = res;
            console.log("this.msg5", this.msg5)
            this.myEcharts7()
          }
        });
      },
      myEcharts1() {
        // 基于准备好的dom，初始化echarts实例
        const myChart1 = this.$echarts.init(document.getElementById('main1'));
        let dataArr = this.msg3.top_village_power.map(item => {
          return {
            name: item.village_name,
            value: item.sum
          }
        })
        let total = this.msg3.sum_power; //合计总数
        if (total === 0) { //当值为0时 不显示 改为字符串可显示
          total = "0"
        }

        let colorsArr = this.msg3.color
        const option = {
          title: [{
            text: '合计',
            x: '50%',
            y: '30%',
            textStyle: {
              color: 'rgba(1, 185, 236, 1)',
              fontSize: 16
            },
            subtext: total,
            subtextStyle: {
              color: 'rgba(19, 241, 253, 1)',
              fontSize: 24,
              fontWeight: 'bold'
            }

          }, ],
          tooltip: {
            trigger: 'item',
            borderColor: 'rgba(255,255,255,.3)',
            backgroundColor: 'rgba(13,5,30,.6)',
            borderWidth: 1,
            padding: 5,
            formatter: function(parms) { //hover显示内容
              var str = parms.marker + "" + parms.data.name + "</br>" +
                "数量：" + parms.data.value + "</br>" +
                "占比：" + parms.percent + "%";
              return str;
            },
            textStyle: {
              fontSize: 14
            }
          },
          legend: {
            orient: 'horizontal', //纵向图例
            right: 'right',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'rect',
            top: '65%',
            left: '50%',
            height: 100,
            width: 150,
            itemGap: 10, //图例item间距
            textStyle: {
              color: 'rgba(43, 128, 255, 1)',
              fontSize: 14
            },
            data: dataArr,
          },
          series: [{
            type: 'pie',
            center: ['20%', '68%'],
            radius: ['40%', '60%'],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 2,
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorsArr[params.dataIndex]
                }
              }
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{d}%',
              fontSize: 10,
            },
            labelLine: {
              normal: {
                length: 5,
                length2: 8,
                lineStyle: {
                  width: 1
                }
              }
            },
            data: dataArr
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option);
      },
      myEcharts2() {
        // 基于准备好的dom，初始化echarts实例
        const myChart2 = this.$echarts.init(document.getElementById('main2'));
        const option = {

          title: [{
            text: '好评率',
            x: 'center',
            top: '38%',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '100',
            }
          }, {
            text: '75%',
            x: 'center',
            top: '55%',
            textStyle: {
              fontSize: '20',
              color: 'rgba(43, 250, 255, 1)',
              fontFamily: 'DINAlternate',
              foontWeight: '100',
            },
          }],
          polar: {
            radius: ['56%', '72%'],
            center: ['50%', '50%'],
          },
          angleAxis: {
            max: 100,
            show: false,
          },
          radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          series: [{
            name: '',
            type: 'bar',
            roundCap: true,
            barWidth: 90,
            showBackground: true,
            backgroundStyle: {
              color: 'RGBA(0, 73, 112, 1)',
            },
            data: [60],
            coordinateSystem: 'polar',

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(0, 210, 255, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(240, 255, 0, 1)',
                  },
                ]),
              },
            },
          }, ],

        };
        // 使用刚指定的配置项和数据显示图表。
        myChart2.setOption(option);
      },
      myEcharts3() {
        // 基于准备好的dom，初始化echarts实例
        const myChart3 = this.$echarts.init(document.getElementById('main3'));

        const option = {
          xAxis: {
            data: ['处理中', '待处理', '已处理'],
            axisLine: {
              show: false,
              lineStyle: {
                color: '#3d5269'
              }
            },
            axisTick: { //y轴刻度线
              "show": false
            },
            axisLabel: {
              color: 'rgba(49, 171, 227, 1)',
              fontSize: 12
            }
          },
          grid: {
            height: '45%'
          },
          yAxis: {
            show: false,
          },
          series: [{
            type: 'bar',
            barWidth: 12,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'RGBA(3, 169, 225, 1)'
                }, {
                  offset: 1,
                  color: 'RGBA(29, 103, 210, 1)'
                }], false)
              }
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold',
                color: '#04a7e1',
                position: 'top',
              }
            },
            data: [5, 6, 7]
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart3.setOption(option);
      },
      myEcharts4() {
        // 基于准备好的dom，初始化echarts实例
        const myChart4 = this.$echarts.init(document.getElementById('main4'));
        const option = {

          title: [{
            text: '在线',
            x: 'center',
            top: '86%',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '100',
            }
          }, {
            text: this.msg4.online_rate,
            x: 'center',
            top: 'center',
            textStyle: {
              fontSize: 15,
              color: 'rgba(43, 250, 255, 1)',
              foontWeight: 'normal',
            },
          }],
          polar: {
            radius: ['56%', '72%'],
            center: ['50%', '45%'],
          },
          angleAxis: {
            max: 100,
            show: false,
          },
          radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          series: [{
            name: '',
            type: 'bar',
            roundCap: true,
            barWidth: 90,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(0, 73, 112, 1)',
            },
            data: [parseInt(this.msg4.online_rate)],
            coordinateSystem: 'polar',

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(0, 210, 255, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(240, 255, 0, 1)',
                  },
                ]),
              },
            },
          }, ],

        };
        // 使用刚指定的配置项和数据显示图表。
        myChart4.setOption(option);
      },
      myEcharts5() {
        // 基于准备好的dom，初始化echarts实例
        const myChart5 = this.$echarts.init(document.getElementById('main5'));
        const option = {

          title: [{
            text: '故障',
            x: 'center',
            top: '86%',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '100',
            }
          }, {
            text: this.msg4.fault_rate,
            x: 'center',
            top: 'center',
            textStyle: {
              fontSize: 15,
              color: 'rgba(43, 250, 255, 1)',
              foontWeight: 'normal',
            },
          }],
          polar: {
            radius: ['56%', '72%'],
            center: ['50%', '45%'],
          },
          angleAxis: {
            max: 100,
            show: false,
          },
          radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          series: [{
            name: '',
            type: 'bar',
            roundCap: true,
            barWidth: 90,
            showBackground: true,
            backgroundStyle: {
              color: 'RGBA(0, 73, 112, 1)',
            },
            data: [parseInt(this.msg4.fault_rate)],
            coordinateSystem: 'polar',

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(0, 210, 255, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(240, 255, 0, 1)',
                  },
                ]),
              },
            },
          }, ],

        };
        // 使用刚指定的配置项和数据显示图表。
        myChart5.setOption(option);
      },
      myEcharts6() {
        // 基于准备好的dom，初始化echarts实例
        const myChart6 = this.$echarts.init(document.getElementById('main6'));
        const option = {

          title: [{
            text: '离线',
            x: 'center',
            top: '86%',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '100',
            }
          }, {
            text: this.msg4.offline_rate,
            x: 'center',
            top: 'center',
            textStyle: {
              fontSize: 15,
              color: 'rgba(43, 250, 255, 1)',
              foontWeight: 'normal',
            },
          }],
          polar: {
            radius: ['56%', '72%'],
            center: ['50%', '45%'],
          },
          angleAxis: {
            max: 100,
            show: false,
          },
          radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          series: [{
            name: '',
            type: 'bar',
            roundCap: true,
            barWidth: 90,
            showBackground: true,
            backgroundStyle: {
              color: 'RGBA(0, 73, 112, 1)',
            },
            data: [parseInt(this.msg4.offline_rate)],
            coordinateSystem: 'polar',

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(0, 210, 255, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(240, 255, 0, 1)',
                  },
                ]),
              },
            },
          }, ],

        };
        // 使用刚指定的配置项和数据显示图表。
        myChart6.setOption(option);
      },
      myEcharts7() {
        // 基于准备好的dom，初始化echarts实例
        const myChart7 = this.$echarts.init(document.getElementById('main7'));
        let dataArr = this.msg5.top_village_power.map(item => {
          return {
            name: item.village_name,
            value: item.village_fee
          }
        })
        let total = this.msg5.sum_power; //合计总数
        if (total === 0) { //当值为0时 不显示 改为字符串可显示
          total = "0"
        }

        let colorsArr = this.msg5.color
        const option = {
          title: [{
            text: '合计',
            x: '50%',
            y: '48%',
            textStyle: {
              color: 'rgba(1, 185, 236, 1)',
              fontSize: 16
            }
          }, {
            text: total,
            x: '58%',
            y: '46%',
            textStyle: {
              color: 'rgba(19, 241, 253, 1)',
              fontSize: 24,
              fontWeight: 'bold'
            }
          }],
          tooltip: {
            trigger: 'item',
            borderColor: 'rgba(255,255,255,.3)',
            backgroundColor: 'rgba(13,5,30,.6)',
            borderWidth: 1,
            padding: 5,
            formatter: function(parms) { //hover显示内容
              var str = parms.marker + "" + parms.data.name + "</br>" +
                "数量：" + parms.data.value + "</br>" +
                "占比：" + parms.percent + "%";
              return str;
            },
            textStyle: {
              fontSize: 14
            }
          },
          legend: {
            orient: 'horizontal', //纵向图例
            right: 'right',
            itemWidth: 3,
            itemHeight: 10,
            borderRadius: 5,
            icon: 'rect',
            top: '65%',
            left: '50%',
            height: 100,
            width: 150,
            itemGap: 10, //图例item间距
            textStyle: {
              color: 'rgba(43, 128, 255, 1)',
              fontSize: 14
            },
            data: dataArr,
          },
          series: [{
            type: 'pie',
            center: ['20%', '68%'],
            radius: ['40%', '60%'],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 2,
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorsArr[params.dataIndex]
                }
              }
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{d}%',
              fontSize: 10,
            },
            labelLine: {
              normal: {
                length: 5,
                length2: 8,
                lineStyle: {
                  width: 1
                }
              }
            },
            data: dataArr
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart7.setOption(option);
      },
    },
  }
</script>

<style lang="less" scoped>
  .bg-box {
    background-image: url(../../../../assets/meterimg/newbg.png);
    width: 100%;
    height: 100%;
    background-size: cover;
    color: #666;
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
    font-size: 14px;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px;
    color: #747b8b;
    font-size: 16px;
    overflow: hidden;
  }

  //公用css
  .font_20 {
    font-size: 20px !important;
    color: rgba(19, 241, 253, 1) !important;
    font-weight: 700 !important;
  }

  .border_1 {
    position: absolute;
    top: 0;
    left: 0;
  }

  .border_2 {
    position: absolute;
    top: 0;
    right: 0;
  }

  .border_3 {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .border_4 {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .top_title_box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-image: url(../../../../assets/meterimg/rgba_bg.png);
    height: 43px;
    background-size: 370px 100%;
    background-position: center;
    background-repeat: no-repeat;

    .mini_title {
      font-size: 20px;
      font-weight: 700;
      font-stretch: normal;
      line-height: 43px;
      letter-spacing: 0px;
      color: #0096FF;
      margin: 0px 5px;
      background: linear-gradient(92deg, #0072FF 0%, #00EAFF 48.8525390625%, #01AAFF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .popup_box {
    position: fixed;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    padding: 5px;
    color: white;
    z-index: 9999;
  }

  //公用css end
  .top-box {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: -0.5%;

    .logo-img {}
  }

  .top_menu {
    width: 100%;
    height: 15.5%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-image: url(../../../../assets/meterimg/top_new.png);
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    margin-top: 1.5%;

    .list_item {
      display: flex;
      flex-direction: row;
      align-items: center;

      .left_item_1 {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-left: 13px;

        .text_1 {
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #00FFFF;
          line-height: 28px;
        }

        .text_2 {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #91BAC5;
          line-height: 16px;
          margin-top: 10px;
        }
      }
    }
  }

  .container {
    width: 100%;
    height: 75.5%;
    max-height: calc(100vh - 82px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1%;

    .flex_1 {
      flex: 1;
      height: 48%;
      display: flex;
      flex-direction: row;

      .flex_top_1 {
        width: 30.3%;
        height: 100%;
        position: relative;
        background-image: url(../../../../assets/meterimg/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        .top_box_1 {
          width: 95%;
          height: 67%;
          margin-top: 48px;
          margin-left: 18px;

          .mini_box_1 {
            width: 100%;
            height: 100%;
            position: relative;

            .table-right {
              width: 100%;
              height: 100%;
              border: 0px solid rgba(19, 60, 123, 1);
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
                  margin: 8px 0px;

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    color: rgba(0, 255, 186, 1);
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    border-right: 0px solid rgba(19, 60, 123, 1);
                    border-bottom: 0px solid rgba(19, 60, 123, 1);
                    cursor: default;
                  }

                  .text_1:first-of-type {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    color: rgba(255, 255, 255, 1);
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
                  margin-top: -28px;
                  border-top: 1px solid rgba(0, 174, 255, 0.3);
                  border-bottom: 1px solid rgba(0, 174, 255, 0.3);

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 2px 0;
                    margin: 2px 0;
                    background-color: rgba(0, 150, 255, 1);
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
                  margin-top: -28px;
                  border-top: 1px solid rgba(0, 174, 255, 0.3);
                  border-bottom: 1px solid rgba(0, 174, 255, 0.3);

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 2px 0;
                    margin: 2px 0;
                    background-color: rgba(0, 150, 255, 1);
                    color: rgba(201, 229, 255, 1);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  }
                }

                .table-flex_body_right:hover {
                  background-color: rgba(240, 171, 51, 1);

                  .text_1 {
                    color: rgba(0, 0, 0, 1);
                  }
                }
              }
            }

            .dian {
              width: 2px;
              height: 2px;
              border-radius: 50%;
              background-color: RGBA(2, 135, 217, 1);
              position: absolute;
              top: -13%;
              left: -1%;
            }

            .dian_1 {
              width: 2px;
              height: 2px;
              border-radius: 50%;
              background-color: RGBA(2, 135, 217, 1);
              position: absolute;
              top: -13%;
              right: 2%;
            }

            .dian_2 {
              width: 2px;
              height: 2px;
              border-radius: 50%;
              background-color: RGBA(2, 135, 217, 1);
              position: absolute;
              top: 0%;
              left: -1%;
            }

            .dian_3 {
              width: 2px;
              height: 2px;
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
            margin: 15px 15px 15px 18px;
            padding-right: 10px;
            overflow-y: scroll;
            display: flex;
            justify-content: center;
            align-items: center;

            .tip_text {
              font-size: 14px;
              color: #0056af;
            }
          }
        }
      }

      .flex_top_2 {
        width: 38.8%;
        height: 100%;
        margin-left: 1%;
        position: relative;
        background-image: url(../../../../assets/meterimg/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;

        .map {
          height: 99%;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          position: relative;
        }
      }

      .flex_top_3 {
        width: 28.7%;
        height: 100%;
        margin-left: 1%;
        position: relative;
        background-image: url(../../../../assets/meterimg/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        .my_echarts_1 {
          width: 100%;
          height: 60%;
          position: absolute;
          top: 0%;
          left: 0%;
        }

        .top_box_2 {
          width: 95%;
          height: 30%;
          position: absolute;
          top: 65%;
          left: 18px;

          .mini_box_1 {
            width: 100%;
            height: 80%;
            position: relative;

            .table-right {
              width: 100%;
              height: 100%;
              border: 0px solid rgba(19, 60, 123, 1);
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
                  background-color: rgba(38, 147, 174, 0.3);
                  margin: 8px 0px;

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    color: rgba(174, 207, 218, 1);
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    border-right: 0px solid rgba(19, 60, 123, 1);
                    border-bottom: 0px solid rgba(19, 60, 123, 1);
                    cursor: default;
                  }

                  .text_1:first-of-type {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    color: rgba(174, 207, 218, 1);
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
                  background-color: rgba(33, 99, 129, 0.7);
                  position: absolute;
                  margin-top: -28px;

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    background-color: rgba(0, 150, 255, 0.3);
                    color: #58AEDB;
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
                  background-color: rgba(33, 99, 129, 0.7);
                  position: absolute;
                  margin-top: -28px;

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    background-color: rgba(0, 150, 255, 0.3);
                    color: #58AEDB;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  }
                }

                .table-flex_body_right:hover {
                  background-color: rgba(240, 171, 51, 1);

                  .text_1 {
                    color: rgba(0, 0, 0, 1);
                  }
                }
              }
            }
          }

          .tip_text_box {
            width: 95%;
            height: 30%;
            margin: 15px 15px 15px 18px;
            padding-right: 10px;
            overflow-y: scroll;
            display: flex;
            justify-content: center;
            align-items: center;

            .tip_text {
              font-size: 14px;
              color: #0056af;
            }
          }
        }
      }
    }

    .flex_2 {
      flex: 1;
      height: 50%;
      margin-top: 1%;
      display: flex;
      flex-direction: row;

      .flex_top_4 {
        width: 46.2%;
        height: 100%;
        position: relative;
        background-image: url(../../../../assets/meterimg/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        .flex_row_1 {
          width: 100%;
          height: 87%;
          display: flex;
          flex-direction: row;
          align-items: center;

          .top_box_3 {
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .flex_box_1 {
              width: 90%;
              height: 30%;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px dashed rgba(66, 164, 255, 0.3);

              .item_box {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .text_1 {
                  font-size: 14px;
                  font-family: PingFang SC;
                  font-weight: 500;
                  color: #01B9EC;
                }

                .text_2 {
                  font-size: 22px;
                  font-family: PingFang SC;
                  font-weight: 500;
                  color: #13F1FD;
                }
              }

              .line {
                width: 1px;
                height: 39px;
                border: 1px dashed #42A4FF;
                background: linear-gradient(0deg, #0336FF, #01B4FF);
                opacity: 0.37;
              }

              .item_box:first-of-type {
                margin-bottom: 13px;

                .text_1 {
                  font-size: 18px;
                }

                .text_2 {
                  font-size: 30px;
                }
              }
            }

            .flex_box_2 {
              width: 100%;
              height: 70%;
              display: flex;
              flex-direction: row;

              .my_echarts_2 {
                width: 45%;
                height: 100%;
              }

              .my_echarts_3 {
                width: 55%;
                height: 100%;
              }
            }
          }
          .tip_text_box {
            width: 50%;
            height: 87%;
            margin: 15px 15px 15px 18px;
            padding-right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
          
            .tip_text {
              font-size: 14px;
              color: #0056af;
            }
          }
          .line_1 {
            width: 1px;
            height: 90%;
            background: #0F18AD;
            border-radius: 1px;
          }

          .top_box_4 {
            width: 50%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .mini_box_1 {
              width: 90%;
              height: 80%;
              position: relative;

              .table-right {
                width: 100%;
                height: 95%;
                border: 0px solid rgba(19, 60, 123, 1);
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
                    background-color: rgba(38, 147, 174, 0.3);
                    margin: 8px 0px;

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12px;
                      padding: 5px 0;
                      color: rgba(174, 207, 218, 1);
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      border-right: 0px solid rgba(19, 60, 123, 1);
                      border-bottom: 0px solid rgba(19, 60, 123, 1);
                      cursor: default;
                    }

                    .text_1:first-of-type {
                      width: 100%;
                      text-align: center;
                      font-size: 12px;
                      padding: 5px 0;
                      color: rgba(174, 207, 218, 1);
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
                    background-color: rgba(33, 99, 129, 0.7);
                    position: absolute;
                    margin-top: -28px;

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12px;
                      padding: 5px 0;
                      background-color: rgba(0, 150, 255, 0.3);
                      color: #58AEDB;
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
                    background-color: rgba(33, 99, 129, 0.7);
                    position: absolute;
                    margin-top: -28px;

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12px;
                      padding: 5px 0;
                      background-color: rgba(0, 150, 255, 0.3);
                      color: #58AEDB;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                    }
                  }

                  .table-flex_body_right:hover {
                    background-color: rgba(240, 171, 51, 1);

                    .text_1 {
                      color: rgba(0, 0, 0, 1);
                    }
                  }
                }
              }
            }

            .tip_text_box {
              width: 90%;
              height: 80%;
              margin: 15px 15px 15px 18px;
              padding-right: 10px;
              overflow-y: scroll;
              display: flex;
              justify-content: center;
              align-items: center;

              .tip_text {
                font-size: 14px;
                color: #0056af;
              }
            }
          }
        }
      }

      .flex_top_5 {
        width: 27.1%;
        height: 100%;
        margin-left: 1%;
        position: relative;
        background-image: url(../../../../assets/meterimg/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        .top_box_5 {
          width: 100%;
          height: 87%;
          display: flex;
          flex-direction: column;
          align-items: center;

          .title {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-left: 23px;
            padding-top: 18px;

            .text_1 {
              font-size: 18px;
              font-family: PingFang SC;
              font-weight: bold;
              color: #01B9EC;
              line-height: 18px;
            }

            .text_2 {
              font-size: 26px;
              font-family: PingFang SC;
              font-weight: bold;
              color: #13F1FD;
              line-height: 18px;
              margin-left: 10px;
            }
          }

          .flex_box_3 {
            width: 100%;
            height: 52%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .my_echarts_4 {
              width: 33.3%;
              height: 100%;
            }
          }

          .flex_box_4 {
            width: 100%;
            height: 40%;
            display: flex;
            justify-content: center;
            align-items: center;

            .mini_box_1 {
              width: 90%;
              height: 60%;
              position: relative;

              .table-right {
                width: 100%;
                height: 95%;
                border: 0px solid rgba(19, 60, 123, 1);
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
                    background-color: rgba(38, 147, 174, 0.3);
                    margin: 8px 0px;

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12px;
                      padding: 5px 0;
                      color: rgba(174, 207, 218, 1);
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      border-right: 0px solid rgba(19, 60, 123, 1);
                      border-bottom: 0px solid rgba(19, 60, 123, 1);
                      cursor: default;
                    }

                    .text_1:first-of-type {
                      width: 100%;
                      text-align: center;
                      font-size: 12px;
                      padding: 5px 0;
                      color: rgba(174, 207, 218, 1);
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
                    background-color: rgba(33, 99, 129, 0.7);
                    position: absolute;
                    margin-top: -28px;

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12px;
                      padding: 5px 0;
                      background-color: rgba(0, 150, 255, 0.3);
                      color: #58AEDB;
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
                    background-color: rgba(33, 99, 129, 0.7);
                    position: absolute;
                    margin-top: -28px;

                    .text_1 {
                      width: 100%;
                      text-align: center;
                      font-size: 12px;
                      padding: 5px 0;
                      background-color: rgba(0, 150, 255, 0.3);
                      color: #58AEDB;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                    }
                  }

                  .table-flex_body_right:hover {
                    background-color: rgba(240, 171, 51, 1);

                    .text_1 {
                      color: rgba(0, 0, 0, 1);
                    }
                  }
                }
              }
            }

            .tip_text_box {
              width: 90%;
              height: 60%;
              margin: 15px 15px 15px 18px;
              padding-right: 10px;
              overflow-y: scroll;
              display: flex;
              justify-content: center;
              align-items: center;

              .tip_text {
                font-size: 14px;
                color: #0056af;
              }
            }
          }
        }
      }

      .flex_top_6 {
        width: 24.4%;
        height: 100%;
        margin-left: 1%;
        position: relative;
        background-image: url(../../../../assets/meterimg/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        .my_echarts_7 {
          width: 100%;
          height: 60%;
          position: absolute;
          top: 0%;
          left: 0%;
          z-index: 999;
        }

        .top_box_6 {
          width: 95%;
          height: 30%;
          position: absolute;
          top: 72%;
          left: 18px;

          .mini_box_1 {
            width: 100%;
            height: 68%;
            position: relative;

            .table-right {
              width: 100%;
              height: 100%;
              border: 0px solid rgba(19, 60, 123, 1);
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
                  background-color: rgba(38, 147, 174, 0.3);
                  margin: 8px 0px;

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    color: rgba(174, 207, 218, 1);
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    border-right: 0px solid rgba(19, 60, 123, 1);
                    border-bottom: 0px solid rgba(19, 60, 123, 1);
                    cursor: default;
                  }

                  .text_1:first-of-type {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    color: rgba(174, 207, 218, 1);
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
                  background-color: rgba(33, 99, 129, 0.7);
                  position: absolute;
                  margin-top: -28px;

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    background-color: rgba(0, 150, 255, 0.3);
                    color: #58AEDB;
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
                  background-color: rgba(33, 99, 129, 0.7);
                  position: absolute;
                  margin-top: -28px;

                  .text_1 {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    padding: 5px 0;
                    background-color: rgba(0, 150, 255, 0.3);
                    color: #58AEDB;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  }
                }

                .table-flex_body_right:hover {
                  background-color: rgba(240, 171, 51, 1);

                  .text_1 {
                    color: rgba(0, 0, 0, 1);
                  }
                }
              }
            }
          }

          .tip_text_box {
            width: 100%;
            height: 68%;
            margin: 15px 15px 15px 18px;
            padding-right: 10px;
            overflow-y: scroll;
            display: flex;
            justify-content: center;
            align-items: center;

            .tip_text {
              font-size: 14px;
              color: #0056af;
            }
          }
        }

        .circular {
          width: 140px;
          height: 140px;
          border: 2px solid #31ABE3;
          opacity: 0.28;
          border-radius: 50%;
          position: absolute;
          top: 64.1px;
          left: 21.7px;
          z-index: 1;
        }
      }
    }
  }

  .sample {
    position: absolute;

    .map_box {
      width: 382px;
      height: 63px;
      background: #006CFF;
      opacity: 0.7;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;

      .item_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .text_1 {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }

        .text_2 {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }
      }

      .line {
        width: 1px;
        height: 39px;
        border: 1px dashed #42A4FF;
        background: linear-gradient(0deg, #0336FF, #01B4FF);
        opacity: 0.37;
      }
    }
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 16px;
    background-color: rgba(0, 62, 142, 0.3);
    right: 5px;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: rgba(0, 62, 142, 0.3);
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: rgba(0, 150, 255, 0.8);
  }

  @keyframes warn1 {
    0% {
      transform: scale(0.95);
      -webkit-transform: scale(0.95);
      opacity: 0.8;
    }

    25% {
      transform: scale(0.97);
      -webkit-transform: scale(0.97);
      opacity: 0.9;
    }

    50% {
      transform: scale(1);
      -webkit-transform: scale(1);
      opacity: 1;
    }

    75% {
      transform: scale(0.97);
      -webkit-transform: scale(0.97);
      opacity: 0.9;
    }

    100% {
      transform: scale(0.95);
      -webkit-transform: scale(0.95);
      opacity: 0.8;
    }
  }
</style>
