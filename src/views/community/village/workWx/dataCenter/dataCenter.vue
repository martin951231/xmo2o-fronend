<template>
  <div>
    <div class="top">
      <div class="container_box">
        <div class="box_title">
          <span>昨日发起申请数</span>
          <a-tooltip placement="top">
            <template slot="title">
              <span>发起申请数，物业工作人员通过[搜索手机号]、[扫一扫]、[从微信好友中添加]、[从群聊中添加]、[添加共享、分配给我的用户]、[从新的联系人推荐中添加]等渠道主动向好友发起的申请数量</span>
            </template>
            <img src="../../../../../assets/image/tan.png">
          </a-tooltip>
        </div>
        <div class="box_center">
          <span><b>{{detail.apply_friends_num[0]}}</b></span>
        </div>
        <div class="box_bottom">
          <span>比前日</span>
          <img src="../../../../../assets/image/up.png" v-if="detail.apply_friends_num[2]>=0">
          <img src="../../../../../assets/image/down.png" v-else>
          <span>{{detail.apply_friends_num[1]}}</span>
        </div>
      </div>
      <div class="container_box">
        <div class="box_title">
          <span>昨日新增住户数</span>
          <a-tooltip placement="top">
            <template slot="title">
              <span>新增业主数，物业工作人员新添加的业主数量</span>
            </template>
            <img src="../../../../../assets/image/tan.png">
          </a-tooltip>
        </div>
        <div class="box_center">
          <span><b>{{detail.new_house_holds_num[0]}}</b></span>
        </div>
        <div class="box_bottom">
          <span>比前日</span>
          <img src="../../../../../assets/image/up.png" v-if="detail.new_house_holds_num[2]>=0">
          <img src="../../../../../assets/image/down.png" v-else>
          <span>{{detail.new_house_holds_num[1]}}</span>
        </div>
      </div>
      <div class="container_box">
        <div class="box_title">
          <span>昨日新增非住户数</span>
          <a-tooltip placement="top">
            <template slot="title">
              <span>新增非业主数，物业工作人员新添加的客户数量</span>
            </template>
            <img src="../../../../../assets/image/tan.png">
          </a-tooltip>
        </div>
        <div class="box_center">
          <span><b>{{detail.new_non_residents_num[0]}}</b></span>
        </div>
        <div class="box_bottom">
          <span>比前日</span>
          <img src="../../../../../assets/image/up.png" v-if="detail.new_non_residents_num[2]>=0">
          <img src="../../../../../assets/image/down.png" v-else>
          <span>{{detail.new_non_residents_num[1]}}</span>
        </div>
      </div>
      <div class="container_box">
        <div class="box_title">
          <span>昨日拉黑/删除成员人数</span>
          <a-tooltip placement="top">
            <template slot="title">
              <span>删除/拉黑成员的客户数，即将物业工作人员删除或加入黑名单的客户和业主数。</span>
            </template>
            <img src="../../../../../assets/image/tan.png">
          </a-tooltip>
        </div>
        <div class="box_center">
          <span><b>{{detail.block_num[0]}}</b></span>
        </div>
        <div class="box_bottom">
          <span>比前日</span>
          <img src="../../../../../assets/image/up.png" v-if="detail.block_num[2]>=0">
          <img src="../../../../../assets/image/down.png" v-else>
          <span>{{detail.block_num[1]}}</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <a-tabs @change="change">
        <a-tab-pane  key="1" tab="发起申请数">
          <a-button :type="button_type[0]" class="button_select" @click="selected(1)">按周</a-button>
          <a-button :type="button_type[1]" class="button_select" @click="selected(2)">按月</a-button>
          <a-range-picker :default-value="[moment(month[0], dateFormat), moment(month[1], dateFormat)]"
                          :format="dateFormat" @change="onChange" :style="{'display':display}"/>
          <a-button :type="button_type[2]" class="button_select" @click="selected(3)">按年</a-button>
          <a-date-picker mode="year" :format="dateFormat1" :value="yearValue" @panelChange="selectYear" @openChange="status =>onOpenChange(status, 'isOpen')" :open="isOpen" :style="{'display':display_of_year}" />
          <a-button :type="button_type[3]" class="button_select" @click="selected(4)">选择成员</a-button>
          <span style="margin-left: 10px;color: red" v-if="is_show">已选择{{enterprise_staff.length}}个成员</span>
          <!--<img style="margin-left:80%;" src="../../../../../assets/image/down1.png">-->
          <div id="main1" style="width: 90%;height:300px;"></div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="新增住户数">
          <a-button :type="button_type[0]" class="button_select" @click="selected(1)">按周</a-button>
          <a-button :type="button_type[1]" class="button_select" @click="selected(2)">按月</a-button>
          <a-range-picker :default-value="[moment(month[0], dateFormat), moment(month[1], dateFormat)]"
                          :format="dateFormat" @change="onChange" :style="{'display':display}"/>
          <a-button :type="button_type[2]" class="button_select" @click="selected(3)">按年</a-button>
          <a-date-picker mode="year" :format="dateFormat1" :value="yearValue" @panelChange="selectYear"@openChange="status =>onOpenChange(status, 'isOpen2')" :open="isOpen2" :style="{'display':display_of_year}" />
          <a-button :type="button_type[3]" class="button_select" @click="selected(4)">选择成员</a-button>
          <span style="margin-left: 10px;color: red" v-if="is_show">已选择{{enterprise_staff.length}}个成员</span>
          <!--<img style="margin-left:80%;" src="../../../../../assets/image/down1.png">-->
          <div id="main2" style="width: 90%;height:300px;"></div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="新增非住户数">
          <a-button :type="button_type[0]" class="button_select" @click="selected(1)">按周</a-button>
          <a-button :type="button_type[1]" class="button_select" @click="selected(2)">按月</a-button>
          <a-range-picker :default-value="[moment(month[0], dateFormat), moment(month[1], dateFormat)]"
                          :format="dateFormat" @change="onChange" :style="{'display':display}"/>
          <a-button :type="button_type[2]" class="button_select" @click="selected(3)">按年</a-button>
          <a-date-picker mode="year" :format="dateFormat1" :value="yearValue" @panelChange="selectYear" @openChange="status =>onOpenChange(status, 'isOpen3')":open="isOpen3" :style="{'display':display_of_year}" />
          <a-button :type="button_type[3]" class="button_select" @click="selected(4)">选择成员</a-button>
          <span style="margin-left: 10px;color: red" v-if="is_show">已选择{{enterprise_staff.length}}个成员</span>
          <!--<img style="margin-left:80%;" src="../../../../../assets/image/down1.png">-->
          <div id="main3" style="width: 90%;height:300px;"></div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="被删除/拉黑人数">
          <a-button :type="button_type[0]" class="button_select" @click="selected(1)">按周</a-button>
          <a-button :type="button_type[1]" class="button_select" @click="selected(2)">按月</a-button>
          <a-range-picker :default-value="[moment(month[0], dateFormat), moment(month[1], dateFormat)]"
                          :format="dateFormat" @change="onChange" :style="{'display':display}"/>
          <a-button :type="button_type[2]" class="button_select" @click="selected(3)">按年</a-button>
          <a-date-picker mode="year" :format="dateFormat1" :value="yearValue" @panelChange="selectYear"@openChange="status =>onOpenChange(status, 'isOpen4')" :open="isOpen4" :style="{'display':display_of_year}" />
          <a-button :type="button_type[3]" class="button_select" @click="selected(4)">选择成员</a-button>
          <span style="margin-left: 10px;color: red" v-if="is_show">已选择{{enterprise_staff.length}}个成员</span>
          <!--<img style="margin-left:80%;" src="../../../../../assets/image/down1.png">-->
          <div id="main4" style="width: 90%;height:300px;"></div>
        </a-tab-pane>
      </a-tabs>
      <h3>详细数据</h3>
      <a-table :columns="columns" :data-source="data" class="table_list">
      </a-table>
    </div>
    <choose-enterprise-staff ref="chooseEnterpriseStaffModal" @change="change_enterprise_staff"/>
  </div>
</template>

<script>
    import configVillageApi from '@/api/community/village'
    import chooseEnterpriseStaff from '../sendMessage/chooseEnterpriseStaff'
    import { getSystemName } from '@/utils/util'
    import moment from 'moment';
    export default {
        components:{
            chooseEnterpriseStaff
        },
        name: "dataCenter",
        mounted(){
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
            this.get_tongji();
            this.get_data(this.select_type,this.select_name);
        },
        data(){
            return {
                is_show:0,
                button_type:['primary','default','default','default'],
                xAxis_data:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                series_data:[150, 230, 224, 218, 135, 147, 260],
                select_type:'week',
                select_name:'apply_friends_num',
                month:['2021-01','2021-12'],
                dateFormat: 'YYYY-MM-DD',
                dateFormat1: 'YYYY',
                search:{},
                detail:{
                    apply_friends_num:[0,0],
                    new_house_holds_num:[0,0],
                    new_non_residents_num:[0,0],
                    block_num:[0,0],
                },
                display:'none',
                display_of_year:'none',
                tokenName: '',
                sysName: '',
                enterprise_staff:[],
                data:[],
                yearValue: null,
                isOpen: false,
                isOpen2: false,
                isOpen3: false,
                isOpen4: false,
                columns: [
                    {
                        title: '时间',
                        dataIndex: 'time',
                        key: 'time',
                        align:'center',
                    },
                    {
                        title: '发起申请数',
                        dataIndex: 'num',
                        key: 'num',
                        align:'center',
                    },
                ],
            }
        },
        methods:{
            moment,
            get_data(select_type,select_name){
                if(select_type == 'month'){
                    if(this.month == ''){
                        return false;
                    }
                    this.search.month_between = this.month;
                }
                if(select_type == 'year'){
                    if(this.yearValue == ''){
                        return false;
                    }
                    this.search.year = this.yearValue;
                }
                this.search.selected_type = select_type;
                this.search.selected_name = select_name;
                this.search.tokenName = this.tokenName;
                this.search.enterprise_staff = this.enterprise_staff;
                this.request(configVillageApi.DataCenterIndex,
                    this.search
                ).then((res)=>{
                    console.log('sdf',res);
                    this.xAxis_data = res.date_arr;
                    this.series_data = res.sum_arr;
                    if(select_name == 'apply_friends_num')
                        this.myEcharts1();
                    else if(select_name == 'new_house_holds_num')
                        this.myEcharts2();
                    else if(select_name == 'new_non_residents_num')
                        this.myEcharts3();
                    else if(select_name == 'block_num')
                        this.myEcharts4();
                    var data_list = [];
                    res.date_arr.filter((item,i)=>{
                        data_list[i] = {
                            key: i,
                            time: item,
                            num: res.sum_arr[i],
                        };
                    });
                    this.data = data_list;
                    console.log('data',this.data);
                })
            },
            get_tongji(){
                this.request(configVillageApi.DataCenterTongji,{
                    tokenName:this.tokenName,
                }).then((res)=>{
                    this.detail = res;
                })
            },
            change_enterprise_staff(val){
                this.enterprise_staff = val;
                if(this.enterprise_staff.length>0){
                    this.is_show = 1;
                }
                this.get_data(this.select_type,this.select_name);
                console.log(123,this.enterprise_staff)
            },
            myEcharts1() {
                // 基于准备好的dom，初始化echarts实例
                console.log(1);
                const myChart1 = this.$echarts.init(document.getElementById('main1'));
                const option1 = {
                    xAxis: {
                        type: 'category',
                        data: this.xAxis_data
                    },
                    yAxis: {
                        type: 'value'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    series: [{
                        data: this.series_data,
                        type: 'line'
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart1.setOption(option1);
            },
            myEcharts2(){
                console.log(2);
                const myChart2 = this.$echarts.init(document.getElementById('main2'));
                const option2 = {
                    xAxis: {
                        type: 'category',
                        data: this.xAxis_data
                    },
                    yAxis: {
                        type: 'value'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    series: [{
                        data: this.series_data,
                        type: 'line'
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart2.setOption(option2);
            },
            myEcharts3(){
                console.log(3);
                const myChart3 = this.$echarts.init(document.getElementById('main3'));
                const option3 = {
                    xAxis: {
                        type: 'category',
                        data: this.xAxis_data
                    },
                    yAxis: {
                        type: 'value'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    series: [{
                        data: this.series_data,
                        type: 'line'
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart3.setOption(option3);
            },
            myEcharts4(){
                console.log(4);
                const myChart4 = this.$echarts.init(document.getElementById('main4'));
                const option4 = {
                    xAxis: {
                        type: 'category',
                        data: this.xAxis_data
                    },
                    yAxis: {
                        type: 'value'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    series: [{
                        data: this.series_data,
                        type: 'line'
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart4.setOption(option4);
            },
            change(activeKey){
                console.log(activeKey);
                if(activeKey == 1){
                    this.select_name = 'apply_friends_num';
                    this.get_data(this.select_type,this.select_name);
                    this.columns = [
                        {
                            title: '时间',
                            dataIndex: 'time',
                            key: 'time',
                            align:'center',
                        },
                        {
                            title: '发起申请数',
                            dataIndex: 'num',
                            key: 'num',
                            align:'center',
                        },
                    ];
                } else if(activeKey == 2){
                    this.select_name = 'new_house_holds_num';
                    this.get_data(this.select_type,this.select_name);
                    this.columns = [
                        {
                            title: '时间',
                            dataIndex: 'time',
                            key: 'time',
                            align:'center',
                        },
                        {
                            title: '新增住户数',
                            dataIndex: 'num',
                            key: 'num',
                            align:'center',
                        },
                    ];
                } else if(activeKey == 3){
                    this.select_name = 'new_non_residents_num';
                    this.get_data(this.select_type,this.select_name);
                    this.columns = [
                        {
                            title: '时间',
                            dataIndex: 'time',
                            key: 'time',
                            align:'center',
                        },
                        {
                            title: '新增非住户数',
                            dataIndex: 'num',
                            key: 'num',
                            align:'center',
                        },
                    ];
                } else if(activeKey == 4){
                    this.select_name = 'block_num';
                    this.get_data(this.select_type,this.select_name);
                    this.columns = [
                        {
                            title: '时间',
                            dataIndex: 'time',
                            key: 'time',
                            align:'center',
                        },
                        {
                            title: '拉黑成员数',
                            dataIndex: 'num',
                            key: 'num',
                            align:'center',
                        },
                    ];
                }
            },
            onChange(date, dateString) {
                console.log(date, dateString);
                this.month = dateString;
                this.get_data(this.select_type,this.select_name);
            },
            selectYear(date,dateString){
                this.yearValue = date;
                this.isOpen = false;
                this.isOpen2 = false;
                this.isOpen3 = false;
                this.isOpen4 = false;
                this.get_data(this.select_type,this.select_name);
            },
            onOpenChange(status, type) {
                this[type] = status
            },
            selected(i){
                switch (i) {
                    case 1:
                        this.select_type = 'week';
                        this.display = 'none';
                        this.display_of_year = 'none';
                        this.yearValue = null;
                        this.get_data(this.select_type,this.select_name);
                        break;
                    case 2:
                        this.select_type = 'month';
                        this.display = 'inline-block';
                        this.display_of_year = 'none';
                        this.yearValue = null;
                        this.get_data(this.select_type,this.select_name);
                        break;
                    case 3:
                        this.select_type = 'year';
                        this.display = 'none';
                        this.display_of_year = 'inline-block';
                        break;
                    case 4:
                        this.display_of_year = 'none';
                        this.$refs.chooseEnterpriseStaffModal.choose();
                        this.yearValue = null;
                        break;
                    default:
                        this.select_type = 'week';
                        this.yearValue = null;
                        this.display = 'none';
                }
                this.button_type = ['default','default','default','default'];
                this.button_type[i-1] = 'primary';
            },
        }
    }
</script>

<style scoped>
.top{
  height: 160px;
  width: 94%;
  margin-left: 3%;
  margin-top: 25px;
}
  .top .container_box{
    float: left;
    height: 150px;
    width: 20%;
    margin-right: 5%;
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 5px;
  }
  .box_title{
    height: 50px;
    width: 230px;
    margin-left: 15px;
    line-height: 50px;
    position: relative
  }
  .box_title span{
    color: darkgrey;
  }
  .box_title img{
    position: absolute;
    left: 200px;
    top: 17px;
  }
  .box_center{
    height: 50px;
    width: 230px;
    margin-left: 15px;
  }
.box_center span{
  font-size: 27px;
}
  .box_bottom{
    height: 50px;
    width: 230px;
    margin-left: 15px;
    line-height: 50px;
  }
.box_bottom span{
  color: darkgrey;
}
  .box_bottom img{
    margin-left: 5px;
  }
  .bottom{
    width: 94%;
    margin-top: 25px;
    margin-left: 3%;
    background-color: white;
    border-radius: 5px;
  }
  .button_select{
    margin-left: 50px;
    margin-top: 30px;
  }
  h3{
    margin-left: 20px;
  }
  .table_list{
    width: 90%;
    margin-left: 5%;
  }
</style>