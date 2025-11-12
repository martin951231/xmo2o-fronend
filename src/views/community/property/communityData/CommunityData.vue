<template>
  <div class="bg-box">
    <!-- top -->
    <div class="top-box">
      <img :src="msg7.property_logo" alt class="logo-img" />
      <div class="title">{{property_name}}</div>
    </div>
    <!-- top_menu -->
    <div class="top_menu">
      <div class="list_item" v-for="(item,index) in msg1">
        <img :src="item.logo" alt="">
        <div class="left_item_1">
          <div class="text_1">{{item.title}}</div>
          <div class="text_2">{{item.value}}</div>
        </div>
      </div>
    </div>
    <!-- container -->
    <div class="container">
      <div class="flex_1">
        <div class="flex_left_1">
          <div class="left_box_1">
            <img src="../../../../assets/image/border_1.png" class="border_1" alt="">
            <img src="../../../../assets/image/border_2.png" class="border_2" alt="">
            <img src="../../../../assets/image/border_3.png" class="border_3" alt="">
            <img src="../../../../assets/image/border_4.png" class="border_4" alt="">
            <div class="top_title_box">
              <img src="../../../../assets/image/left_icon.png" alt="">
              <div class="mini_title">今日人流量</div>
              <img src="../../../../assets/image/right_icon.png" alt="">
            </div>
            <div class="mini_box_1">
              <div class="mini_box1">
                <img src="../../../../assets/image/user_1.png" style="margin-top: 8px;" alt="">
                <div class="text_3">业主</div>
                <div class="text_4">{{msg3.people_flow?msg3.people_flow:'0'}}
                  <p>人</p>
                </div>
              </div>
              <div class="mini_box1">
                <img src="../../../../assets/image/user_2.png" style="margin-top: 8px;" alt="">
                <div class="text_3">访客</div>
                <div class="text_4">{{msg3.visitor_flow?msg3.visitor_flow:'0'}}
                  <p>人</p>
                </div>
              </div>
            </div>
          </div>
          <div class="left_box_2">
            <img src="../../../../assets/image/border_1.png" class="border_1" alt="">
            <img src="../../../../assets/image/border_2.png" class="border_2" alt="">
            <img src="../../../../assets/image/border_3.png" class="border_3" alt="">
            <img src="../../../../assets/image/border_4.png" class="border_4" alt="">
            <div class="top_title_box">
              <img src="../../../../assets/image/left_icon.png" alt="">
              <div class="mini_title">今日车流量</div>
              <img src="../../../../assets/image/right_icon.png" alt="">
            </div>
            <div class="yuanhuan"></div>
            <div class="yuanhuan_1"></div>
            <div class="yuanhuan_2"></div>
            <div id="main" class="my_echarts"></div>
            <div class="mini_box_2">
              <div class="list_item_1">
                <div class="text_5">月租车</div>
                <div class="text_6">{{this.msg8.month_parking_car_count}}</div>
              </div>
              <div class="list_item_1">
                <div class="text_5" style="color: rgba(249, 109, 101, 1);">储值车</div>
                <div class="text_6" style="color: rgba(249, 109, 101, 1);">{{this.msg8.store_parking_car_count}}</div>
              </div>
              <div class="list_item_1">
                <div class="text_5" style="color: rgba(161, 118, 255, 1);">临时车</div>
                <div class="text_6" style="color: rgba(161, 118, 255, 1);">{{this.msg8.temporary_parking_car_count}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex_left_2">
          <img src="../../../../assets/image/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/image/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/image/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/image/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/image/left_icon.png" alt="">
            <div class="mini_title">车场数据</div>
            <img src="../../../../assets/image/right_icon.png" alt="">
          </div>
          <div id="main1" class="my_echarts_1"></div>
          <div class="mini_box_3">
            <div class="mini_box2">
              <div class="top_box_1">
                <div class="text_7">总车位</div>
                <div class="text_8">{{msg4.positionCount}}</div>
              </div>
              <div class="top_box_2">
                <div class="text_7">今日临停收费：<p class="text_p">￥{{msg4.temporaryMoney}}</p>
                </div>
                <div class="text_7">本月累计收费：<p class="text_p">￥{{msg4.parkCount}}</p>
                </div>
              </div>
            </div>
            <div class="mini_box3">
              <div class="list_item">
                <div class="text_9">业主车位</div>
                <div class="text_10">{{msg4.ownerBindCount}}</div>
              </div>
              <div class="list_item">
                <div class="text_9">临时车位</div>
                <div class="text_10">{{msg4.temporaryCount}}</div>
              </div>
              <div class="list_item">
                <div class="text_9">已用车位</div>
                <div class="text_10">{{msg4.usedCount}}</div>
              </div>
              <div class="list_item">
                <div class="text_9">剩余车位</div>
                <div class="text_10">{{msg4.remain}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex_left_3">
          <img src="../../../../assets/image/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/image/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/image/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/image/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/image/left_icon.png" alt="">
            <div class="mini_title">收费统计</div>
            <img src="../../../../assets/image/right_icon.png" alt="">
          </div>
          <div id="main2" class="my_echarts_2"></div>
        </div>
      </div>
      <div class="flex_2">
        <div class="map">
          <baidu-map :center="center" :zoom="zoom" @ready="handler" class="BMap" style="width: 100%;height: 100%;">
            <!-- <bm-marker v-for="(item,index) in msg10.list" :position="'{lng:'+item.lng+',lat:'+ item.lat +'}'" :dragging="false"
              animation="BMAP_ANIMATION_BOUNCE" :icon="{url: 'http://shequ-demo.fastwhale.com.cn/static/image/map-icon-data.png', size: {width: 300, height: 157}}"></bm-marker> -->
          </baidu-map>
          <img src="../../../../assets/image/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/image/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/image/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/image/border_4.png" class="border_4" alt="">
        </div>
        <div class="flex_center_2">
          <img src="../../../../assets/image/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/image/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/image/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/image/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/image/left_icon.png" alt="">
            <div class="mini_title">各城市人流量</div>
            <img src="../../../../assets/image/right_icon.png" alt="">
          </div>
          <div class="my_echarts_box">
            <div id="main3" class="my_echarts_3" :style="{height:barHeight+'rem'}"></div>
          </div>

        </div>
      </div>
      <div class="flex_3">
        <div class="flex_right_1">
          <img src="../../../../assets/image/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/image/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/image/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/image/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/image/left_icon.png" alt="">
            <div class="mini_title">设备管理</div>
            <img src="../../../../assets/image/right_icon.png" alt="">
          </div>
          <div class="right_box_2">
            <div class="mini_box_6">
              <div class="mini_box5">
                <div id="main5" style="width: 100%;height:100%;"></div>
              </div>
              <div class="mini_box5">
                <div id="main6" style="width: 100%;height:100%;"></div>
              </div>
              <div class="mini_box5">
                <div id="main7" style="width: 100%;height:100%;"></div>
              </div>
            </div>
            <div class="mini_box_7" v-if="!msg6_nodata">
              <div class="table-right">
                <div class="table-scroll_right">
                  <div class="table-flex_body_right" v-for="(item,index) in msg6.list">
                    <div class="text_7" v-for="(items,indexs) in item">{{items.title}}</div>
                  </div>
                </div>
              </div>
              <div class="dian"></div>
              <div class="dian_1"></div>
              <div class="dian_2"></div>
              <div class="dian_3"></div>
            </div>
            <div class="tip_text_box" v-if="msg6_nodata">
              <div class="tip_text">暂无人脸门禁开门记录</div>
            </div>
          </div>
          <div class="right_box_3">设备总数 {{msg6.device_total}}</div>
        </div>
        <div class="flex_right_2">
          <img src="../../../../assets/image/border_1.png" class="border_1" alt="">
          <img src="../../../../assets/image/border_2.png" class="border_2" alt="">
          <img src="../../../../assets/image/border_3.png" class="border_3" alt="">
          <img src="../../../../assets/image/border_4.png" class="border_4" alt="">
          <div class="top_title_box">
            <img src="../../../../assets/image/left_icon.png" alt="">
            <div class="mini_title">工单处理数据</div>
            <img src="../../../../assets/image/right_icon.png" alt="">
          </div>
          <div class="my_echarts_box_1">
            <div id="main4" class="my_echarts_4" :style="{height:barHeight+'rem'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Rem from '../../../../utils/rem.js';
  import echarts from 'echarts' //引入echarts
  import 'echarts-liquidfill/src/liquidFill.js';
  import CommunityDataApi from '@/api/community/communitydata'
  Rem.getrem();
  export default {
    // name: '大数据',
    data() {
      return {
        columns: [],
        msg1: {},
        msg2: {},
        msg3: {},
        msg4: {},
        msg5: {},
        msg6: {},
        msg6_nodata: false,
        msg7: {},
        msg8: {},
        msg9: {},
        msg9_nodata: false,
        msg10: {},
        msg11: {},
        center: {
          lng: 0,
          lat: 0
        },
        zoom: 20,
        points: [],
        markerPoint: {},
        property_name: '',
        property_logo: '',
        num: -1,
        barHeight: '',
      }
    },
    mounted() {
      this.getInfo1()
      this.getInfo2()
      this.getInfo3()
      this.getInfo4()
      this.getInfo5()
      this.getInfo6()
      this.getInfo7()
      this.getInfo8()
      setInterval(() => {
        this.getInfo1()
        this.getInfo2()
        this.getInfo3()
        this.getInfo4()
        this.getInfo5()
        this.getInfo6()
        this.getInfo7()
        this.getInfo8()
      }, 1800000)
    },
    methods: {
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
      //物业可视化大数据顶部数据统计1
      getInfo1() {
        this.request(CommunityDataApi.topIndex).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg1 = res;
            console.log("this.msg", this.msg1)
          }
        });
      },
      //工单处理数据 各城市人流量2
      getInfo2() {
        this.request(CommunityDataApi.workOrder).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg2 = res;
            console.log("this.msg", this.msg2)

            this.myEcharts3()
            this.myEcharts4()
          }
        });
      },
      //今日人流量3
      getInfo3() {
        this.request(CommunityDataApi.peopleFlow).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg3 = res;
            console.log("this.msg", this.msg3)
          }
        });
      },
      //车场数据4
      getInfo4() {
        this.request(CommunityDataApi.carStatistics).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg4 = res;
            console.log("this.msg", this.msg4)
            this.myEcharts1()
          }
        });
      },
      //收费统计5
      getInfo5() {
        this.request(CommunityDataApi.chargeStatistics).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg5 = res;
            console.log("this.msg5", this.msg5)
            this.myEcharts2()
          }
        });
      },
      //设备管理6
      getInfo6() {
        this.request(CommunityDataApi.deviceStatistics).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.msg6 = res;
            if (this.msg6.list.length == 0) {
              this.msg6_nodata = true;
            }
            this.myEcharts5()
            console.log("this.msg", this.msg6)
          }
        });
      },
      //开门地图定位10
      getInfo10() {
        this.request(datastatisticsApi.openDoorLocation).then(res => {
          console.log('+++++++', res)
          if (res) {
            console.log('res+++++++++++++++++', res)
            this.msg10 = res;
            this.center['lng'] = this.msg10.info.long
            this.center['lat'] = this.msg10.info.lat
          }
        });
      },
      //标题
      getInfo7() {
        this.request(CommunityDataApi.getConfig).then(res => {
          console.log('+++++++', res)
          if (res) {
            console.log('res+++++++++++++++++', res)
            this.msg7 = res;
            this.center['lng'] = this.msg7.long
            this.center['lat'] = this.msg7.lat
            this.property_name = this.msg7.property_name
            this.property_logo = this.msg7.property_logo
            document.title = this.property_name + "-可视化大数据";
          }
        });
      },
      // 今日车流量
      getInfo8() {
        this.request(CommunityDataApi.carFlow).then(res => {
          console.log('+++++++', res)
          if (res) {
            console.log('res11111111111111', res)
            this.msg8 = res;
            this.myEcharts()
          }
        });
      },
      myEcharts() {
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(document.getElementById('main'));
        console.log("this.msg8", this.msg8)
        const option = {
          backgroundColor: 'rgba(255,255,255,0)',
          title: {
            show: false,
            text: 'Pie',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '车辆数:<br/>{b} : {c} ({d}%)'
          },
          legend: {
            show: false,
            orient: 'vertical',
            left: 20,
            top: 20,
            data: ['月租车', '储值车', '临时车'],
            textStyle: {
              color: '#fff'
            }
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            // width: 120,
            // height: 120,
            radius: '55%',
            center: ['47.5%', '35%'],
            data: [{
                value: this.msg8.month_parking_car_count,
                name: this.msg8.month_parking_car_count_rate + '%'
              },
              {
                value: this.msg8.store_parking_car_count,
                name: this.msg8.store_parking_car_count_rate + '%'
              },
              {
                value: this.msg8.temporary_parking_car_count,
                name: this.msg8.temporary_parking_car_count_rate + '%'
              }
            ],
            roseType: 'radius',
            label: {
              color: '#fff'
            },
            labelLine: {
              lineStyle: {
                color: '#888'
              }
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ['#A176FF', '#F96D65', '#3CD5B3'];
                  return colorList[params.dataIndex % colorList.length];
                }
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      myEcharts1() {
        // 基于准备好的dom，初始化echarts实例
        const myChart1 = this.$echarts.init(document.getElementById('main1'));
        console.log("this.msg4", this.msg4)
        let gradient = new echarts.graphic.LinearGradient(
          0, 1, 1, 0, [{
              offset: 0,
              color: "rgba(85, 226, 254, 1)",
            },
            {
              offset: 1,
              color: "rgba(7, 7, 255, 1)",
            }
          ]
        );
        const option = {
          // backgroundColor: '#050038',
          title: {
            text: '',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 25,
              color: 'rgb(97, 142, 205)'
            }
          },
          series: [{
              type: 'liquidFill',
              radius: '45%',
              color: ['rgba(130, 77, 225, 0.6)', 'rgba(24, 197, 254, 0.6)', 'rgba(66, 11, 255, 0.6)'], //水波
              center: ['17%', '50%'],
              data: [0.6, 0.5, 0.4], // data个数代表波浪数
              backgroundStyle: {
                borderWidth: 1,
                color: 'rgb(255,0,255,0.1)'
              },
              label: {
                normal: {
                  formatter: this.msg4.proportion,
                  textStyle: {
                    fontSize: 16,
                    color: 'rgba(0, 250, 168, 1)'
                  }
                }
              },
              outline: {
                show: false,
              }
            },
            {
              "type": "pie",
              "center": ["17%", "50%"],
              "radius": ["50%", "52%"],
              "hoverAnimation": false,
              "data": [{
                  "name": "",
                  "value": 500,
                  labelLine: {
                    show: false
                  },
                  itemStyle: {
                    color: gradient
                  },
                  emphasis: {
                    labelLine: {
                      show: false
                    },
                    itemStyle: {
                      color: gradient
                    },
                  }
                },
                { //画中间的图标
                  "name": "",
                  "value": 4,
                  labelLine: {
                    show: false
                  },
                  itemStyle: {
                    color: '#ffffff',
                    "normal": {
                      "color": "rgba(85, 226, 254, 1)",
                      "borderColor": "rgba(85, 226, 254, 1)",
                      "borderWidth": 6,
                      // borderRadius: '100%'
                    },
                  },
                  label: {

                    borderRadius: '100%'
                  },
                  emphasis: {
                    labelLine: {
                      show: false
                    },
                    itemStyle: {
                      color: '#5886f0'
                    },
                  }

                },
                { // 解决圆点过大后续部分显示明显的问题
                  "name": "",
                  "value": 4,
                  labelLine: {
                    show: false
                  },
                  itemStyle: {
                    color: '#5886f0'
                  },
                  emphasis: {
                    labelLine: {
                      show: false
                    },
                    itemStyle: {
                      color: '#5886f0'
                    },
                  }
                },
                { //画剩余的刻度圆环
                  "name": "",
                  "value": 88,
                  itemStyle: {
                    color: '#050038'
                  },
                  "label": {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  emphasis: {
                    labelLine: {
                      show: false
                    },
                    itemStyle: {
                      color: 'rgba(255,255,255,0)'
                    },
                  }
                }
              ]
            }

          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option);
      },
      myEcharts2() {
        // 基于准备好的dom，初始化echarts实例
        const myChart2 = this.$echarts.init(document.getElementById('main2'));
        console.log("this.msg1", this.msg1)
        var date_list = this.msg5.list.map(item => {
          return item.time
        })
        // let name = ['物业收入', '停车费收入', '其他收入']
        //物业费
        let data_1 = this.msg5.list.map(item => {
          return item.property_price
        })
        //停车费
        let data_2 = this.msg5.list.map(item => {
          return item.parking_price
        })
        //其他收入
        let data_3 = this.msg5.list.map(item => {
          return item.custom_price
        })

        let name = this.msg5.type.map(item => {
          return item.name
        })
        console.log(name)
        const option = {
          // backgroundColor: '#fff',
          color: ['rgba(249, 109, 101, 1)', 'rgba(49, 88, 255, 1)', 'rgba(249, 109, 101, 1)'],
          title: {
            show: false,
            //text:'月销气量分析',
            textStyle: {
              align: 'center',
              color: 'rgba(202, 242, 245, 1)',
              fontSize: 20,
            },
            top: '3%',
            left: '6%',
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            icon: 'rect',
            width: 180,
            itemWidth: 10,
            itemHeight: 3,
            itemGap: 13,
            data: name,
            right: '4%',
            top: '5%',
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },
          grid: {
            top: '30%',
            left: '2%',
            right: '5%',
            bottom: '1%',
            height: '60%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: date_list,
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLine: {
              lineStyle: {
                color: "#212D79"
              }
            },
            axisTick: {
              show: false
            },
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: '#ccc',
              }
            }
          },
          yAxis: {
            type: 'value',
            //min:300,
            // max:350,
            // name: '万m³',
            splitLine: {
              lineStyle: {
                type: 'solid',
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#212D79"
              },
            },
            axisTick: {
              show: false
            },
            nameTextStyle: {
              color: "#333"
            },
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: '#ccc',
              }
            },
            splitArea: {
              show: false
            }
          },
          series: [{
              name:  name[0],
              type: 'line',
              symbol: 'circle',
              symbolSize: 10,
              data: data_1,
              color: "rgba(249, 109, 101, 1)",
              lineStyle: {
                normal: {
                  width: 5,
                  color: {
                    type: 'linear',

                    colorStops: [{
                      offset: 0,
                      color: 'rgba(249, 109, 101, 1)' // 0% 处的颜色
                    }, {
                      offset: 0.4,
                      color: 'rgba(249, 109, 101, 1)' // 100% 处的颜色
                    }, {
                      offset: 1,
                      color: 'rgba(249, 109, 101, 1)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  },
                  //                  shadowColor: '#056C98',
                  //                  shadowBlur: 10,
                  //                  shadowOffsetY: 13
                }
              },
              itemStyle: {
                normal: {
                  borderWidth: 3,
                  shadowColor: 'rgba(72,216,191, 0.3)',
                  shadowBlur: 100,
                  borderColor: "#fff"
                }
              },
              smooth: false
            },
            {
              name: name[1],
              type: 'line',
              symbol: 'circle',
              symbolSize: 10,
              data: data_2,
              color: "rgba(49, 88, 255, 1)",
              lineStyle: {
                normal: {
                  width: 5,
                  color: {
                    type: 'linear',
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(49, 88, 255, 1)' // 0% 处的颜色
                    }, {
                      offset: 0.4,
                      color: 'rgba(49, 88, 255, 1)' // 100% 处的颜色
                    }, {
                      offset: 1,
                      color: 'rgba(49, 88, 255, 1)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  },
                  //                  shadowColor: '#056C98',
                  //                  shadowBlur: 10,
                  //                  shadowOffsetY: 13
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(49, 88, 255, 1)',
                  borderWidth: 3,
                  shadowColor: 'rgba(72,216,191, 0.3)',
                  shadowBlur: 100,
                  borderColor: "#fff"
                }
              },
              smooth: false
            },
            {
              name: name[2],
              type: 'line',
              symbol: 'circle',
              symbolSize: 10,
              data: data_3,
              color: "rgba(73, 240, 255, 1)",
              lineStyle: {
                normal: {
                  width: 5,
                  color: {
                    type: 'linear',
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(73, 240, 255, 1)' // 0% 处的颜色
                    }, {
                      offset: 0.4,
                      color: 'rgba(73, 240, 255, 1)' // 100% 处的颜色
                    }, {
                      offset: 1,
                      color: 'rgba(73, 240, 255, 1)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  },
                  //                  shadowColor: '#056C98',
                  //                  shadowBlur: 10,
                  //                  shadowOffsetY: 13
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(73, 240, 255, 1)',
                  borderWidth: 3,
                  /*shadowColor: 'rgba(72,216,191, 0.3)',
                   shadowBlur: 100,*/
                  borderColor: "#fff"
                }
              },
              smooth: false
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart2.setOption(option);
      },
      myEcharts5() {
        // 基于准备好的dom，初始化echarts实例
        const myChart5 = this.$echarts.init(document.getElementById('main5'));
        const myChart6 = this.$echarts.init(document.getElementById('main6'));
        const myChart7 = this.$echarts.init(document.getElementById('main7'));
        var dataArr = this.msg6.ratio.normal;
        var dataArr1 = this.msg6.ratio.fault;
        var dataArr2 = this.msg6.ratio.off;
        let gradient = new echarts.graphic.LinearGradient(
          0, 1, 1, 0, [{
              offset: 0,
              color: "rgba(7, 7, 255, 1)",
            },
            {
              offset: 1,
              color: "rgba(85, 226, 254, 1)",
            }
          ]
        );
        var colorSet = {
          color: gradient
        };
        const option = {
          // backgroundColor: "#000",
          xAxis: {
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          yAxis: {
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            }
          },

          series: [
            // 内圆
            {
              type: 'pie',
              radius: ['0', '15%'],
              center: ['50%', '50%'],
              z: 4,
              hoverAnimation: false,
              data: [{
                name: '积分',
                value: dataArr,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(23,161,255,0)'
                    }, {
                      offset: 1,
                      color: 'rgba(17,90,233,0)'
                    }])
                  }

                },
                label: {
                  normal: {
                    color: 'rgb(0,250,168)',
                    align: 'center',
                    fontSize: 25,
                    formatter: function(params) {
                      return dataArr + "%";
                    },
                    position: 'center',
                    show: true
                  }
                },
                labelLine: {
                  show: false
                }
              }],
            }, {
              name: "内部进度条",
              type: "gauge",
              center: ['50%', '50%'],
              radius: '90%',

              splitNumber: 10,
              axisLine: {
                lineStyle: {
                  color: [
                    [dataArr / 100, colorSet.color],
                    [1, "RGBA(38, 39, 149, 1)"]
                  ],
                  width: 14
                }
              },
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,

              },
              splitLine: {
                show: false,
              },
              itemStyle: {
                show: false,
              },
              detail: {
                show: false,
              },
              label: {
                show: false
              },
              title: { //标题
                show: false,
              },
              data: [{
                name: "title",
                value: dataArr,
              }],
              pointer: {
                show: false,
              },
            },
            // 刻度
            {
              type: "gauge",
              radius: "26%",
              startAngle: 220,
              endAngle: -40,
              z: 2,
              axisTick: {
                show: false,
                lineStyle: {
                  color: '#6B9DD7',
                  width: 1
                },
                length: -8
              }, //刻度样式
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#6B9DD7',
                  width: 1
                },
                length: -8
              }, //分隔线样式
              axisLabel: {
                color: 'rgba(255,255,255,0)',
                fontSize: 12,
              }, //刻度节点文字颜色
              pointer: {
                show: false
              },
              axisLine: {
                show: false
              },
              label: {
                show: false
              },
              //仪表盘详情，用于显示数据。
              detail: {
                show: true,
                offsetCenter: ['5%', '280%'],
                color: 'rgba(0, 202, 255, 1)',
                backgroundColor: 'rgba(8, 9, 126, 0.49)',
                borderRadius: 13,
                borderColor: 'rgba(27, 31, 255, 1)',
                borderWidth: 1,
                borderStyle: 'solid',
                formatter: function(params) {
                  return '正常百分比'
                },
                textStyle: {
                  fontSize: 12,

                }
              }
            },
          ]
        }
        const option1 = {
          // backgroundColor: "#000",
          xAxis: {
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          yAxis: {
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            }
          },

          series: [
            // 内圆
            {
              type: 'pie',
              radius: ['0', '15%'],
              center: ['50%', '50%'],
              z: 4,
              hoverAnimation: false,
              data: [{
                name: '积分',
                value: dataArr1,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(23,161,255,0)'
                    }, {
                      offset: 1,
                      color: 'rgba(17,90,233,0) '
                    }])
                  }

                },
                label: {
                  normal: {
                    color: 'rgb(0,250,168)',
                    align: 'center',
                    fontSize: 25,
                    formatter: function(params) {
                      return dataArr1 + "%";
                    },
                    position: 'center',
                    show: true
                  }
                },
                labelLine: {
                  show: false
                }
              }],
            }, {
              name: "内部进度条",
              type: "gauge",
              center: ['50%', '50%'],
              radius: '90%',

              splitNumber: 10,
              axisLine: {
                lineStyle: {
                  color: [
                    [dataArr1 / 100, colorSet.color],
                    [1, "RGBA(38, 39, 149, 1)"]
                  ],
                  width: 14
                }
              },
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,

              },
              splitLine: {
                show: false,
              },
              itemStyle: {
                show: false,
              },
              detail: {
                show: false,
              },
              label: {
                show: false
              },
              title: { //标题
                show: false,
              },
              data: [{
                name: "title",
                value: dataArr1,
              }],
              pointer: {
                show: false,
              },
            },
            // 刻度
            {
              type: "gauge",
              radius: "26%",
              startAngle: 220,
              endAngle: -40,
              z: 2,
              axisTick: {
                show: false,
                lineStyle: {
                  color: '#6B9DD7',
                  width: 1
                },
                length: -8
              }, //刻度样式
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#6B9DD7',
                  width: 1
                },
                length: -8
              }, //分隔线样式
              axisLabel: {
                color: 'rgba(255,255,255,0)',
                fontSize: 12,
              }, //刻度节点文字颜色
              pointer: {
                show: false
              },
              axisLine: {
                show: false
              },
              label: {
                show: false
              },
              //仪表盘详情，用于显示数据。
              detail: {
                show: true,
                offsetCenter: ['5%', '280%'],
                color: 'rgba(0, 202, 255, 1)',
                backgroundColor: 'rgba(8, 9, 126, 0.19)',
                borderRadius: 13,
                borderColor: 'rgba(27, 31, 255, 1)',
                borderWidth: 1,
                borderStyle: 'solid',
                formatter: function(params) {
                  return '故障百分比'
                },
                textStyle: {
                  fontSize: 12,

                }
              }
            },
          ]
        }
        const option2 = {
          // backgroundColor: "#000",
          xAxis: {
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          yAxis: {
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            }
          },

          series: [
            // 内圆
            {
              type: 'pie',
              radius: ['0', '15%'],
              center: ['50%', '50%'],
              z: 4,
              hoverAnimation: false,
              data: [{
                name: '积分',
                value: dataArr2,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(23,161,255,0)'
                    }, {
                      offset: 1,
                      color: 'rgba(17,90,233,0) '
                    }])
                  }

                },
                label: {
                  normal: {
                    color: 'rgb(0,250,168)',
                    align: 'center',
                    fontSize: 25,
                    formatter: function(params) {
                      return dataArr2 + "%";
                    },
                    position: 'center',
                    show: true
                  }
                },
                labelLine: {
                  show: false
                }
              }],
            }, {
              name: "内部进度条",
              type: "gauge",
              center: ['50%', '50%'],
              radius: '90%',

              splitNumber: 10,
              axisLine: {
                lineStyle: {
                  color: [
                    [dataArr2 / 100, colorSet.color],
                    [1, "RGBA(38, 39, 149, 1)"]
                  ],
                  width: 14
                }
              },
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,

              },
              splitLine: {
                show: false,
              },
              itemStyle: {
                show: false,
              },
              detail: {
                show: false,
              },
              label: {
                show: false
              },
              title: { //标题
                show: false,
              },
              data: [{
                name: "title",
                value: dataArr2,
              }],
              pointer: {
                show: false,
              },
            },
            // 刻度
            {
              type: "gauge",
              radius: "26%",
              startAngle: 220,
              endAngle: -40,
              z: 2,
              axisTick: {
                show: false,
                lineStyle: {
                  color: '#6B9DD7',
                  width: 1
                },
                length: -8
              }, //刻度样式
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#6B9DD7',
                  width: 1
                },
                length: -8
              }, //分隔线样式
              axisLabel: {
                color: 'rgba(255,255,255,0)',
                fontSize: 12,
              }, //刻度节点文字颜色
              pointer: {
                show: false
              },
              axisLine: {
                show: false
              },
              label: {
                show: false
              },
              //仪表盘详情，用于显示数据。
              detail: {
                show: true,
                offsetCenter: ['5%', '280%'],
                color: 'rgba(0, 202, 255, 1)',
                backgroundColor: 'rgba(8, 9, 126, 0.49)',
                borderRadius: 13,
                borderColor: 'rgba(27, 31, 255, 1)',
                borderWidth: 1,
                borderStyle: 'solid',
                formatter: function(params) {
                  return '离线百分比'
                },
                textStyle: {
                  fontSize: 12,

                }
              }
            },
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart5.setOption(option);
        myChart6.setOption(option1);
        myChart7.setOption(option2);
      },
      myEcharts3() {
        // 基于准备好的dom，初始化echarts实例

        echarts.dispose(document.getElementById('main3'));
        const myChart3 = this.$echarts.init(document.getElementById('main3'));
        console.log("this.msg1", this.msg1)
        //区域
        let title = this.msg2.person.map(item => {
          return item.title
        })
        //业主
        let owner_count = this.msg2.person.map(item => {
          return item.owner_count
        })
        //租客
        let tenant_count = this.msg2.person.map(item => {
          return item.tenant_count
        })
        //服务人员
        let service_count = this.msg2.person.map(item => {
          return item.service_count
        })
        //访客
        let visitor_count = this.msg2.person.map(item => {
          return item.visitor_count
        })
        const option = {
          barWidth: 16,
          color: ["rgba(249, 109, 101, 1)", "rgba(255, 180, 74, 1)", "rgba(49, 88, 255, 1)", "rgba(0, 191, 126, 1)"],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            confine: true
          },
          legend: {
            data: ['业主', '租客', '服务人员', '访客'],
            icon: 'rect',
            width: 300,
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 13,
            right: '2%',
            top: 0,
            textStyle: {
              fontSize: 12,
              color: 'rgba(202, 242, 245, 1)'
            }
          },
          grid: {
            top: 20,
            left: '3%',
            right: '2%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: {
            show: false,
            type: 'value',
          },
          yAxis: {
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                fontSize: 14,
                color: 'rgba(2, 147, 246, 1)',
              }
            },
            data: title
          },
          series: [{
              name: '业主',
              type: 'bar',
              stack: '总量',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(15, 50, 112, 1)'
              },
              label: {
                show: true,
                position: 'insideRight',
                normal: {
                  show: true,
                  formatter: function(params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return '';
                    }
                  }
                }
              },
              data: owner_count
            },
            {
              name: '租客',
              type: 'bar',
              stack: '总量',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(15, 50, 112, 1)'
              },
              label: {
                show: true,
                position: 'insideRight',
                normal: {
                  show: true,
                  formatter: function(params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return '';
                    }
                  }
                }
              },
              data: tenant_count
            },
            {
              name: '服务人员',
              type: 'bar',
              stack: '总量',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(15, 50, 112, 1)'
              },
              label: {
                show: true,
                position: 'insideRight',
                normal: {
                  show: true,
                  formatter: function(params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return '';
                    }
                  }
                }
              },
              data: service_count
            },
            {
              name: '访客',
              type: 'bar',
              stack: '总量',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(15, 50, 112, 1)'
              },
              label: {
                show: true,
                position: 'insideRight',
                normal: {
                  show: true,
                  formatter: function(params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return '';
                    }
                  }
                }
              },
              data: visitor_count
            },
          ]
        };
        this.barHeight = 7;
        this.barHeight = option.yAxis.data.length > 5 ? (option.yAxis.data.length / 5) * this.barHeight : "7";

        myChart3.getDom().style.height = this.barHeight * 25 + "px";
        myChart3.getDom().childNodes[0].style.height = this.barHeight * 25 + "px";
        myChart3.resize();
        // 使用刚指定的配置项和数据显示图表。
        myChart3.setOption(option);
      },
      myEcharts4() {
        // 基于准备好的dom，初始化echarts实例

        echarts.dispose(document.getElementById('main4'));
        const myChart4 = this.$echarts.init(document.getElementById('main4'));
        console.log("this.msg1", this.msg1)
        var weatherIcons = {
          Sunny: '/v20/public/static/bigdata/icon_1.png',
        };
        //区域
        let title_1 = this.msg2.worker.map(item => {
          return item.title
        })
        //待处理
        let untreated_count = this.msg2.worker.map(item => {
          return item.untreated_count
        })
        //处理中
        let processing_count = this.msg2.worker.map(item => {
          return item.processing_count
        })
        //已处理
        let processed_count = this.msg2.worker.map(item => {
          return item.processed_count
        })
        var seriesLabel = {
          normal: {
            show: true,
            textBorderColor: '#333',
            textBorderWidth: 2
          }
        }

        const option = {
          barWidth: 8,
          barGap: 0.5,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          label: {
            show: true,
            position: 'right', // 位置
            color: 'rgba(14, 230, 251, 1)',
            fontSize: 12,
            fontWeight: 'bold', // 加粗
            distance: 5 // 距离
          }, // 柱子上方的数值
          color: ["rgba(49, 88, 255, 1)", "rgba(0, 191, 126, 1)", "rgba(234, 165, 81, 1)"],
          legend: {
            data: ['待处理', '处理中', '已处理'],
            icon: 'rect',
            width: 150,
            itemWidth: 12,
            itemHeight: 6,
            borderRadius: 2,
            itemGap: 13,
            right: '2%',
            top: 0,
            textStyle: {
              fontSize: 12,
              color: 'rgba(202, 242, 245, 1)'
            }
          },
          grid: {
            top: 60,
            left: '7%',
            right: '2%',
            bottom: '0%',
            containLabel: true
          },
          toolbox: {
            show: false,
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            show: false,
            type: 'value',
            name: 'Days',
            axisLine: {
              show: false,
            },
          },
          yAxis: {
            type: 'category',
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            max: title_1.length - 1,
            data: title_1,
            axisLabel: {
              formatter: function(value) {
                return '{value|' + value + '}\{Sunny|' + '' + '}';
              },
              margin: 10,
              rich: {
                value: {
                  lineHeight: 30,
                  fontSize: 14,
                  color: 'rgba(2, 147, 246, 1)',
                  align: 'right',
                  padding: [0, 15, 0, 0]
                },
                Sunny: {
                  width: 9,
                  height: 35,
                  align: 'center',
                  backgroundColor: {
                    image: weatherIcons.Sunny
                  }
                }
              }
            }
          },
          series: [{
              name: '待处理',
              type: 'bar',
              data: untreated_count,
              label: seriesLabel,
            },
            {
              name: '处理中',
              type: 'bar',
              label: seriesLabel,
              data: processing_count,
            },
            {
              name: '已处理',
              type: 'bar',
              label: seriesLabel,
              data: processed_count,
            }
          ]
        };
        this.barHeight = 7;
        this.barHeight = option.yAxis.data.length > 4 ? (option.yAxis.data.length / 4) * this.barHeight : "7";

        myChart4.getDom().style.height = this.barHeight * 35 + "px";
        myChart4.getDom().childNodes[0].style.height = this.barHeight * 35 + "px";
        myChart4.resize();
        // 使用刚指定的配置项和数据显示图表。
        myChart4.setOption(option);
      },
    },
  }
</script>

<style lang="less" scoped>
  @rem: 192; //定义页面尺寸
  .bg-box {
    background-image: url(../../../../assets/image/newbg.png);
    width: 100%;
    height: 100%;
    background-size: cover;
    color: #666;
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
    font-size: 14/@rem * 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20/@rem * 1rem;
    color: #747b8b;
    font-size: 16/@rem * 1rem;
    overflow: hidden;
  }

  //公用css
  .font_20 {
    font-size: 20/@rem * 1rem !important;
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
    background-image: url(../../../../assets/image/rgba_bg.png);
    height: 43/@rem * 1rem;
    background-size: 249/@rem * 1rem 100%;
    background-position: center;
    background-repeat: no-repeat;

    .mini_title {
      font-size: 20/@rem * 1rem;
      font-weight: 700;
      font-stretch: normal;
      line-height: 43/@rem * 1rem;
      letter-spacing: 0/@rem * 1rem;
      color: #31abe3;
      margin: 0/@rem * 1rem 5/@rem * 1rem;
    }
  }

  //公用css end
  .top-box {
    width: 100%;
    height: 57/@rem * 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: -14/@rem * 1rem;

    .logo-img {
      width: 32/@rem * 1rem;
      height: 32/@rem * 1rem;
      display: inline-block;
    }

    .title {
      font-size: 30/@rem * 1rem;
      font-weight: 700;
      font-stretch: normal;
      line-height: 57/@rem * 1rem;
      letter-spacing: 0/@rem * 1rem;
      color: #ffffff;
      margin-left: 8/@rem * 1rem;
    }
  }

  .top_menu {
    width: 100%;
    height: 21%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-image: url(../../../../assets/image/top_new.png);
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    margin-top: 0.5%;

    .list_item {
      display: flex;
      flex-direction: row;
      align-items: center;

      .left_item_1 {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        margin-left: 19/@rem * 1rem;

        .text_1 {
          font-size: 18/@rem * 1rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #8FDDFF;
          line-height: 24/@rem * 1rem;
        }

        .text_2 {
          font-size: 40/@rem * 1rem;
          font-family: Arial;
          font-weight: bold;
          color: #94F5FF;
          line-height: 24/@rem * 1rem;
          margin-top: 10/@rem * 1rem;
        }
      }
    }
  }

  .container {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 82/@rem * 1rem);
    padding-top: 5/@rem * 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .flex_1 {
      flex: 1;
      height: 100%;
      padding-right: 5/@rem * 1rem;

      .flex_left_1 {
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        overflow: hidden;

        .left_box_1 {
          width: 54%;
          height: 100%;
          background-image: url(../../../../assets/image/banner_2.png);
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;

          .mini_box_1 {
            height: 84%;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;

            .mini_box1 {
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-evenly;

              .text_3 {
                font-size: 20/@rem * 1rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #0084FF;
                line-height: 20/@rem * 1rem;
              }

              .text_4 {
                font-size: 26/@rem * 1rem;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #00FAA8;
                line-height: 26/@rem * 1rem;
                display: flex;
                flex-direction: row;
                align-items: baseline;

                p {
                  font-size: 14/@rem * 1rem;

                }
              }
            }
          }
        }

        .left_box_2 {
          width: 44%;
          height: 100%;
          background-image: url(../../../../assets/image/banner_2.png);
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;

          .my_echarts {
            width: 100%;
            height: 82%;
            position: absolute;
            top: 16%;
            left: 0;
          }

          .mini_box_2 {
            width: 98%;
            height: 79/@rem * 1rem;
            background-image: url(../../../../assets/image/mini_bg_1.png);
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            flex-direction: row;
            align-items: center;
            position: absolute;
            bottom: 11/@rem * 1rem;
            left: 1%;

            .list_item_1 {
              width: 33.3%;
              height: 60%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              border-right: 1/@rem * 1rem dashed rgba(1, 180, 255, 0.37);

              .text_5 {
                font-size: 14/@rem * 1rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #3CD5B3;
                opacity: 0.8;
              }

              .text_6 {
                font-size: 18/@rem * 1rem;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #3CD5B3;
              }
            }

            .list_item_1:last-of-type {
              border-right: 0/@rem * 1rem dashed #42A4FF;
            }
          }

          .yuanhuan {
            width: 155/@rem * 1rem;
            height: 155/@rem * 1rem;
            border: 2/@rem * 1rem solid rgba(18, 85, 152, 1);
            border-radius: 50%;
            position: absolute;
            top: 16%;
            left: 20%;
            pointer-events: none;
            opacity: 1;
            -webkit-animation: warn1 3s ease-out;
            -moz-animation: warn1 3s ease-out;
            animation: warn1 3s ease-out;
            -webkit-animation-iteration-count: infinite;
            -moz-animation-iteration-count: infinite;
            animation-iteration-count: infinite;
          }

          .yuanhuan_1 {
            width: 145/@rem * 1rem;
            height: 145/@rem * 1rem;
            border: 2/@rem * 1rem solid rgba(18, 85, 152, 0.7);
            border-radius: 50%;
            position: absolute;
            top: 17.6%;
            left: 21.7%;
            pointer-events: none;
            opacity: 1;
            -webkit-animation: warn1 3s ease-out;
            -moz-animation: warn1 3s ease-out;
            animation: warn1 3s ease-out;
            -webkit-animation-iteration-count: infinite;
            -moz-animation-iteration-count: infinite;
            animation-iteration-count: infinite;
          }

          .yuanhuan_2 {
            width: 135/@rem * 1rem;
            height: 135/@rem * 1rem;
            border: 2/@rem * 1rem solid rgba(18, 85, 152, 0.5);
            border-radius: 50%;
            position: absolute;
            top: 19.6%;
            left: 23.3%;
            pointer-events: none;
            opacity: 1;
            -webkit-animation: warn1 3s ease-out;
            -moz-animation: warn1 3s ease-out;
            animation: warn1 3s ease-out;
            -webkit-animation-iteration-count: infinite;
            -moz-animation-iteration-count: infinite;
            animation-iteration-count: infinite;
          }
        }
      }

      .flex_left_2 {
        width: 100%;
        height: 28%;
        margin-top: 2%;
        position: relative;
        background-image: url(../../../../assets/image/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;

        .my_echarts_1 {
          width: 100%;
          height: 160%;
          position: absolute;
          top: -27%;
          left: 0%;
        }

        .mini_box_3 {
          width: 57%;
          height: 70%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          position: absolute;
          top: 25%;
          right: 8%;

          .mini_box2 {
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .top_box_1 {
              .text_7 {
                font-size: 18/@rem * 1rem;
                font-family: PingFang SC;
                font-weight: bold;
                color: #00CAFF;
                line-height: 20/@rem * 1rem;
              }

              .text_8 {
                font-size: 32/@rem * 1rem;
                font-family: Arial;
                font-weight: bold;
                color: #00FAA8;
                line-height: 50/@rem * 1rem;
              }
            }

            .top_box_2 {
              .text_7 {
                font-size: 14/@rem * 1rem;
                font-family: PingFang SC;
                font-weight: bold;
                color: #00CAFF;
                line-height: 25/@rem * 1rem;
                display: flex;
                flex-direction: row;

                .text_p {
                  margin: 0;
                  font-size: 16/@rem * 1rem;
                  font-family: Arial;
                  font-weight: bold;
                  color: #0EF9B3;
                  line-height: 25/@rem * 1rem;
                }
              }
            }
          }

          .mini_box3 {
            width: 50%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .list_item {
              width: 50%;
              height: 50%;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: center;

              .text_9 {
                font-size: 14/@rem * 1rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #26BEFE;
                line-height: 14/@rem * 1rem;
              }

              .text_10 {
                font-size: 22/@rem * 1rem;
                font-family: Arial;
                font-weight: bold;
                color: #0EF9B3;
                line-height: 22/@rem * 1rem;
              }
            }
          }
        }
      }

      .flex_left_3 {
        width: 100%;
        height: 28%;
        margin-top: 2%;
        background-image: url(../../../../assets/image/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;

        .my_echarts_2 {
          width: 100%;
          height: 100%;
          position: absolute !important;
          top: 0;
          left: 0;
        }
      }
    }

    .flex_2 {
      width: 30%;
      height: 100%;

      .map {
        height: 58%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: relative;
      }

      .flex_center_2 {
        width: 100%;
        height: 40%;
        margin-top: 2%;
        position: relative;
        background-image: url(../../../../assets/image/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        .top_title_box {
          background-size: 284/@rem * 1rem 100%;
        }

        .my_echarts_box {
          width: 98%;
          height: 74%;
          overflow-y: scroll;
          // position: relative;
          position: absolute;
          top: 19%;
          left: 0;

          .my_echarts_3 {
            width: 100%;
            height: 100%;
          }
        }

        .my_echarts_box::-webkit-scrollbar {
          width: 6/@rem * 1rem;
          height: 16/@rem * 1rem;
          background-color: rgba(0, 62, 142, 0.3);
          right: 5/@rem * 1rem;
        }

        /*定义滚动条轨道 内阴影+圆角*/
        .my_echarts_box::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 2/@rem * 1rem rgba(0, 0, 0, 0.3);
          border-radius: 10/@rem * 1rem;
          background-color: rgba(0, 62, 142, 0.3);
        }

        /*定义滑块 内阴影+圆角*/
        .my_echarts_box::-webkit-scrollbar-thumb {
          border-radius: 10/@rem * 1rem;
          -webkit-box-shadow: inset 0 0 6/@rem * 1rem rgba(0, 0, 0, .3);
          background-color: rgba(0, 150, 255, 0.8);
        }
      }

    }

    .flex_3 {
      flex: 1;
      height: 100%;
      padding-left: 5/@rem * 1rem;

      .flex_right_1 {
        width: 100%;
        height: 54%;
        position: relative;
        background-image: url(../../../../assets/image/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        .right_box_2 {
          width: 100%;
          height: 91%;

          .mini_box_6 {
            width: 100%;
            height: 45%;
            display: flex;
            flex-direction: row;

            .mini_box5 {
              width: 100%;
              height: 100%;
            }
          }

          .mini_box_7 {
            width: 100%;
            height: 55%;
            position: relative;

            .table-right {
              width: 98%;
              height: 89%;
              border: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
              margin: 8/@rem * 1rem;
              position: relative;
              overflow: hidden;

              .table-scroll_right {
                width: 100%;
                height: 82%;
                overflow-y: scroll;
                margin-top: 4.4%;

                .table-flex_body_right {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  background-color: rgba(0, 150, 255, 0.1);
                  margin: 3/@rem * 1rem 0;

                  .text_7 {
                    width: 100%;
                    text-align: center;
                    font-size: 12/@rem * 1rem;
                    padding: 5/@rem * 1rem 0;
                    color: rgba(0, 255, 186, 1);
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    border-right: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                    border-bottom: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                  }

                  .text_7:first-of-type {
                    width: 100%;
                    text-align: center;
                    font-size: 12/@rem * 1rem;
                    padding: 5/@rem * 1rem 0;
                    color: rgba(255, 255, 255, 1);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  }
                }

                .table-flex_body_right:first-of-type {
                  width: 99.6%;
                  display: flex;
                  flex-direction: row;
                  background-color: rgba(0, 150, 255, 0);
                  position: absolute;
                  margin-top: -28/@rem * 1rem;
                  border-top: 1/@rem * 1rem solid rgba(0, 174, 255, 0.3);
                  border-bottom: 1/@rem * 1rem solid rgba(0, 174, 255, 0.3);

                  .text_7 {
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
                  width: 99.6%;
                  display: flex;
                  flex-direction: row;
                  background-color: rgba(0, 150, 255, 0);
                  position: absolute;
                  margin-top: -28/@rem * 1rem;
                  border-top: 1/@rem * 1rem solid rgba(0, 174, 255, 0.3);
                  border-bottom: 1/@rem * 1rem solid rgba(0, 174, 255, 0.3);

                  .text_7 {
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

                .table-flex_body_right:hover {
                  background-color: rgba(240, 171, 51, 1);

                  .text_7 {
                    color: rgba(0, 0, 0, 1);
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
              top: 0;
              left: 0.5%;
            }

            .dian_1 {
              width: 2/@rem * 1rem;
              height: 2/@rem * 1rem;
              border-radius: 50%;
              background-color: RGBA(2, 135, 217, 1);
              position: absolute;
              top: 0;
              right: 0.5%;
            }

            .dian_2 {
              width: 2/@rem * 1rem;
              height: 2/@rem * 1rem;
              border-radius: 50%;
              background-color: RGBA(2, 135, 217, 1);
              position: absolute;
              top: 14%;
              left: 0.5%;
            }

            .dian_3 {
              width: 2/@rem * 1rem;
              height: 2/@rem * 1rem;
              border-radius: 50%;
              background-color: RGBA(2, 135, 217, 1);
              position: absolute;
              top: 14%;
              right: 0.5%;
            }
          }

          .tip_text_box {
            width: 96%;
            height: 43%;
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

        .right_box_3 {
          width: 223/@rem * 1rem;
          height: 27/@rem * 1rem;
          font-size: 14/@rem * 1rem;
          font-weight: 700;
          font-stretch: normal;
          line-height: 27/@rem * 1rem;
          text-align: center;
          letter-spacing: 0/@rem * 1rem;
          color: rgba(49, 171, 227, 1);
          background-image: url(../../../../assets/image/bg_1.png);
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          position: absolute;
          top: 11/@rem * 1rem;
          right: -3%;
        }
      }

      .flex_right_2 {
        width: 100%;
        height: 43.8%;
        margin-top: 2%;
        position: relative;
        background-image: url(../../../../assets/image/banner_2.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        .top_title_box {
          background-size: 284/@rem * 1rem 100%;
        }

        .my_echarts_box_1 {
          width: 98%;
          height: 79%;
          overflow-y: scroll;
          // position: relative;
          position: absolute;
          top: 15%;
          left: 0;

          .my_echarts_4 {
            width: 100%;
            height: 100%;
          }
        }

        .my_echarts_box_1::-webkit-scrollbar {
          width: 6/@rem * 1rem;
          height: 16/@rem * 1rem;
          background-color: rgba(0, 62, 142, 0.3);
          right: 5/@rem * 1rem;
        }

        /*定义滚动条轨道 内阴影+圆角*/
        .my_echarts_box_1::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 2/@rem * 1rem rgba(0, 0, 0, 0.3);
          border-radius: 10/@rem * 1rem;
          background-color: rgba(0, 62, 142, 0.3);
        }

        /*定义滑块 内阴影+圆角*/
        .my_echarts_box_1::-webkit-scrollbar-thumb {
          border-radius: 10/@rem * 1rem;
          -webkit-box-shadow: inset 0 0 6/@rem * 1rem rgba(0, 0, 0, .3);
          background-color: rgba(0, 150, 255, 0.8);
        }
      }

    }
  }

  ::-webkit-scrollbar {
    width: 6/@rem * 1rem;
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
