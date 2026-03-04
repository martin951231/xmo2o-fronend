<template>
  <div class="flex flex-column container">
    <Header :title="title" :projectItem="projectItem"></Header>
    <div class="flex flex-1 chart-box">
      <div class="flex flex-column chart-item-left" >
        <div class="flex-1 chart-item">
          <charTitle :title-name="`项目组织架构`" />
          <OrgChart
            ref="orgChartRef" :orgData="myOrgData" :theme="myOrgTheme"
          />
        </div>
        <div class="flex-1 chart-item">
          <charTitle :title-name="`项目基础数据`" />
          <StackedRateChart
            ref="baseChartRef"
            chart-title=""
            :containerHeight="`100%`"
            :chart-data="baseChartData"
            :field-map="{ xAxis: 'name' }"
            :y-axis-list="baseyAxisList"
            :series-list="baseSeriesList"
          />
<!--          <BarChart-->
<!--            ref="baseChartRef"-->
<!--            :xData="baseChartData.xAxis"-->
<!--            :seriesData="baseChartData.series"-->
<!--            :colorList="[-->
<!--              '#00ff99', '#ff6699', '#6699ff', '#00ffd9', '#00B8FF'-->
<!--            ]"-->
<!--            :barConfig="{ barWidth: 25, isStack: true }"-->
<!--          />-->
        </div>
        <div class="flex-1 chart-item">
          <charTitle :title-name="`项目巡检情况`" />
          <StackedRateChart
            ref="inspectionChartRef"
            chart-title=""
            :containerHeight="`100%`"
            :chart-data="inspectionChartData"
            :field-map="{ xAxis: 'name' }"
            :y-axis-list="inspectionyAxisList"
            :series-list="inspectionList"
          />
        </div>
      </div>
      <div class="flex flex-column chart-item-center" >
        <div class="flex-1 chart-item" >
          <charTitle :title-name="`项目周期性费用情况`" />
          <!-- 1. 收缴率占比堆叠图 -->
          <StackedRateChart
            ref="chartRateRef"
            chart-title=""
            :containerHeight="`100%`"
            :chart-data="rateChartData"
            :field-map="{ xAxis: 'name' }"
            :y-axis-list="yAxisList"
            :series-list="seriesList"
          />
        </div>
        <div class="flex-1 chart-item">
          <charTitle :title-name="`项目支出情况`" />
          <PieChart
            ref="expendRef"
            :chart-data="expendData"
            :center-text="centerText"
            :pie-config="{ isRing: true, radius: ['68%', '70%'] }"
          />

        </div>
        <div class="flex-1 chart-item">
          <charTitle :show-more="false" :title-name="`项目能耗趋势`" :changeType="['水','电']" :currentType="currentCharTitleType" @changeTypeHandle="changeCharTitleTypeHandle" />
          <EnergyHeatmap
            ref="utilitiesRef"
            :heat-data="heatData"
            :x-axis-data="monthList"
            :y-axis-data="categoryList"
            unit="元"
            :scale="0.8"
            :max-size="6"
          />
        </div>
      </div>
      <div class="flex flex-column chart-item-right" >
        <div class="flex-1 chart-item">
          <charTitle :title-name="`用户使用情况`" />
          <LineChart
            ref="customChartRef"
            style=""
            chart-width="100%"
            chart-height="100%"
            :chart-data="customChartData"
            chart-title=""
            :color-list="customColorList"
            :show-data-zoom="false"
          />
        </div>
        <div class="flex-1 chart-item">
          <charTitle :title-name="`工单响应时间`" />
          <LineChart
            ref="workOrderResponseRef"
            style=""
            chart-width="100%"
            chart-height="100%"
            :chart-data="workOrderData"
            chart-title=""
            :color-list="workOrderColorList"
            :show-data-zoom="false"
          />
        </div>
        <div class="flex-1 chart-item">
          <charTitle :title-name="`投诉建议情况`" />
          <CyberTable
            :columns="complaintTableColumns"
            :data="complaintTableData"
            :scrollSpeed="20"
            :current-sort="currentSort"
            @sort-change="handleSortChange"
            @viewMore="handleViewMore"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from './components/Header';
import statisticalApi from '@/api/community/statistical'
import StackedRateChart from '@/views/community/village/statistical/components/StackedRateChart.vue'
import PieChart from '@/views/community/village/statistical/components/PieChart.vue'
import OrgChart from '@/views/community/village/statistical/components/OrgChart.vue'
import LineChart from '@/views/community/village/statistical/components/LineChart.vue'
import BarChart from '@/views/community/village/statistical/components/BarChart.vue'
import CyberTable from '@/views/community/village/statistical/components/CyberTable.vue'
import CharTitle from '@/views/community/village/statistical/components/charTitle.vue'
import EnergyHeatmap from '@/views/community/village/statistical/components/EnergyHeatmap.vue'
import SunburstChart from '@/views/community/village/statistical/components/SunburstChart.vue'
import villageApi from '@/api/community/village'

export default {
  name: 'index',
  components: {
    EnergyHeatmap,
    CharTitle,
    CyberTable,
    BarChart,
    LineChart,
    OrgChart,
    StackedRateChart,
    MultiDimensionChart: StackedRateChart,
    PieChart,
    SunburstChart,
    Header,
  },
  data: function () {
    return {
      title: '项目驾驶舱',
      length: 6,
      projectItem:[
        {label:'项目占地面积',value: [0],unit:'万平方米'},
        {label:'装修中/已装/未装',value: [0],unit:''},
        {label:'入住率/出租率',value: [0],unit:'%'},
        {label:'非机动车数量/充电桩',value: [0],unit:''},
        {label:'新能源车辆/燃油车辆',value: [0],unit:'辆'},
        {label:'地面充电桩/车库充电桩',value: [0],unit:'个'},
      ],
      propertyItem:[
        {label:'入住城市',value: [4],unit:'个'},
        {label:'项目数量',value: [7],unit:'个'},
        {label:'项目占地面积',value: [884800],unit:'㎡'},
        {label:'客户：住宅/商业',value: [7120,252],unit:'户'},
        {label:'员工',value: [156],unit:'人'},
      ],
      //组织架构颜色配置
      myOrgTheme: {
        primary: '#36CFC9',
        secondary: '#722ED1',
        font: '#fff'
      },
      //组织架构数据
      myOrgData: {},
      //项目基础数据
      baseChartData: [],
      rateChartData:[],
      baseyAxisList:[
        { key: 'y1', name: '', unit: '户', color: '#7cb3ff' },
        // { key: 'y2', name: '车位', unit: '户', color: '#00ffea' },
      ],
      baseSeriesList:[
        // 第一组堆叠柱 - 关联y1
        {
          key: 's1', name: '已售', type: 'bar',
          yAxisKey: 'y1', field: 'yishou',
          stack: 'stack1', color: '#00ff99'
        },
        {
          key: 's2', name: '未售', type: 'bar',
          yAxisKey: 'y1', field: 'weishou',
          stack: 'stack1', color: '#ff6699'
        },
        // 第二组堆叠柱 - 关联y2
        {
          key: 's3', name: '已缴', type: 'bar',
          yAxisKey: 'y1', field: 'yijiao',
          stack: 'stack2', color: '#6699ff'
        },
        {
          key: 's4', name: '未缴', type: 'bar',
          yAxisKey: 'y1', field: 'weijiao',
          stack: 'stack2', color: '#00ffd9'
        }
      ],
      yAxisList:[
        { key: 'y1', name: '户数', unit: '户', color: '#7cb3ff' },
        { key: 'y2', name: '金额', unit: '万元', color: '#00ffea' },
        { key: 'y3', name: '收缴率', unit: '%', color: '#40f0ff' }
      ],
      seriesList:[
        // 第一组堆叠柱 - 关联y1（户数）
        {
          key: 's1', name: '收缴户数', type: 'bar',
          yAxisKey: 'y1', field: 'paid_account_num',
          stack: 'stack1', color: '#00ff99'
        },
        {
          key: 's2', name: '剩余户数', type: 'bar',
          yAxisKey: 'y1', field: 'remaining_paid_account_num',
          stack: 'stack1', color: '#ff6699'
        },
        // 第二组堆叠柱 - 关联y2（金额）
        {
          key: 's3', name: '收缴金额', type: 'bar',
          yAxisKey: 'y2', field: 'paid_amound_str',
          stack: 'stack2', color: '#6699ff'
        },
        {
          key: 's4', name: '剩余金额', type: 'bar',
          yAxisKey: 'y2', field: 'remaining_paid_amound_num_str',
          stack: 'stack2', color: '#00ffd9'
        },
        // 两条折线 - 关联y3（收缴率）
        {
          key: 's5', name: '户数收缴率', type: 'bar',
          yAxisKey: 'y3', field: 'paid_account_rate',
          stack: 'stack3',color: '#00e5ff', labelPos: 'top'
        },
        {
          key: 's6', name: '金额收缴率', type: 'bar',
          yAxisKey: 'y3', field: 'paid_amound_rate',
          stack: 'stack3',color: '#00FF9D', lineType: 'dashed',
        }
      ],
      customColor: {
        collectionNum: '#2E86AB',
        remainNum: '#A23B72',
        collectionAmount: '#F18F01',
        remainAmount: '#C73E1D',
        collectionRate: '#6A994E'
      },
      expendData: [],
      customColorConfig: {
        colors: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336'],
        bgColor: '#1E1E1E',
        starStyle: {
          star5: { color: '#4CAF50' },
          star4: { color: '#2196F3' },
          star3: { color: '#FFC107' },
          star2: { color: '#F44336' }
        }
      },
      centerText: {
        show: true,
        text: [],
        fontSize: [16, 28],
        color: ['#FFFFFF', '#FFFFFF'],
        lineHeight: 35,
        fontWeight: [400, 700]
      },
      customChartData: {},
      customColorList: [
        // 你原有配色
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#00ff99' }, { offset: 1, color: '#00cc66' }] },
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#ff6699' }, { offset: 1, color: '#cc3366' }] },
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#6699ff' }, { offset: 1, color: '#3366cc' }] },
      ],
      workOrderData: {},
      workOrderColorList:[
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#4056f4' }, { offset: 1, color: '#253599' }] },
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#00ffd9' }, { offset: 1, color: '#0099cc' }] },
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#00e5ff' }, { offset: 1, color: '#008fb3' }] }
      ],
      inspectionChartData:[],
      inspectionyAxisList:[
        { key: 'y1', name: '异常情况', unit: '个', color: '#7cb3ff' },
        { key: 'y2', name: '完成/覆盖率', unit: '%', color: '#00ffea', max: 100 },
        { key: 'y3', name: '异常次数', unit: '次', color: '#2d71ff' },
      ],
      inspectionList:[
        {
          key: 's1', name: '异常情况', type: 'bar',
          yAxisKey: 'y1', field: 'abnormal_amount',
          color: '#00CFFA'
        },
        {
          key: 's2', name: '异常次数', type: 'bar',
          yAxisKey: 'y3', field: 'abnormal_repeat_amount',
          color: '#7B2CBF'
        },
        {
          key: 's3', name: '完成率', type: 'line',
          yAxisKey: 'y2', field: 'complete_rate',
          color: '#00FF9D', // 自定义亮绿色（折线全特效同步该色）
          labelPos: 'top', showLabel: true
        },
        {
          key: 's4', name: '覆盖率', type: 'line',
          yAxisKey: 'y2', field: 'override_rate',
          color: '#FF66C4', // 自定义亮红色
          lineType: 'dashed',
          symbol: 'diamond', labelPos: 'bottom', showLabel: true
        }
      ],
      complaintTableColumns:[
        { label: '序号', prop: 'id', width: '10%', align: 'center', sortable: true},
        { label: '类型', prop: 'event_type', width: '15%', align: 'center' },
        { label: '内容摘要', prop: 'order_content', width: '30%', align: 'center' },
        { label: '状态', prop: 'event_status_txt', width: '15%', align: 'center' },
        { label: '累计用时', prop: 'accumulate_time', width: '15%', align: 'center', sortable: true },
        { label: '责任人', prop: 'name', width: '15%', align: 'center' },
      ],
      complaintTableData:[],
      complaintRateData:[],
      originTableData: [],
      currentSort: { prop: '', order: '' },
      energyRateChartData:[
        { name: '1 月', property_use: 150.8, monitor_use: 20, light_use: 800, garade_use: 200, park_land_use: 75.98, business_use: 80 },
        { name: '2 月', property_use: 150.8, monitor_use: 20, light_use: 800, garade_use: 200, park_land_use: 75.98, business_use: 80 },
        { name: '3 月', property_use: 150.8, monitor_use: 20, light_use: 800, garade_use: 200, park_land_use: 75.98, business_use: 80 },
      ],
      energyyAxisList:[
        { key: 'y1', name: '用电量', unit: '度', color: '#7cb3ff' },
      ],
      energySeriesList: [],
      // X轴：12个月份
      categoryList: [],
      // Y轴：12个用电分类（按你的业务补充完整）
      monthList: [],
      // 核心数据：12行（分类）×12列（月份）的二维数组，值为对应消费金额（可从接口获取）
      heatData: [],
      currentCharTitleType: '电',//项目能耗趋势图默认选中类型
    }
  },
  watch: {},
  computed: {},
  mounted() {
    this.originTableData = [...this.complaintTableData]
    this.getConfig();
    this.getProjectInfo();
    this.getInitInfo();
  },
  methods: {
    getConfig() {
      const config = this.$store.getters.config
      if (config) {
        this.config = config
        if (!this.village_logo && this.config.system_admin_logo) {
          this.village_logo = this.config.system_admin_logo
        }
        console.log('this.config', this.config)
        console.log('this.village_logo', this.village_logo)
      } else {
        setTimeout(() => {
          this.getConfig()
        }, 300)
      }
    },
    //标题
    getProjectInfo() {
      this.request(statisticalApi.config).then((res) => {
        console.log('+++++++', res)
        if (res) {
          let p_info = res.project_info
          this.projectItem = [
            {label:'项目占地面积',value: [this.convertToTenThousand(p_info.plot_area,2)],unit:'万平方米'},
            {label:'装修中/已装/未装',value: [p_info.decoration_num,p_info.decorated_num,p_info.undecorate_num],unit:''},
            {label:'入住率/出租率',value: [`${p_info.occupancy_rate}%`,`${p_info.rental_rate}%`],unit:''},
            {label:'非机动车数量/充电桩',value: [`${p_info.non_motor_num}辆`,`${p_info.charger_num}个`],unit:''},
            {label:'新能源车辆/燃油车辆',value: [p_info.new_energy_num,p_info.fuel_num],unit:'辆'},
            {label:'地面充电桩/车库充电桩',value: [p_info.ground_charger_num,p_info.garage_charger_num],unit:'个'},
          ]
        }
      })
    },
    convertToTenThousand(num, decimalDigits = 4, withUnit = false) {
      try {
        // 1. 统一转为数字（处理字符串/空值/非数字）
        const numFloat = parseFloat(num);
        if (isNaN(numFloat)) {
          throw new Error("输入不是有效数字");
        }

        // 2. 核心转换：除以10000
        const result = numFloat / 10000;

        // 3. 保留指定小数位（避免浮点精度问题）
        const fixedResult = Number(result.toFixed(decimalDigits));

        // 4. 是否带单位返回
        return withUnit ? `${fixedResult}万` : fixedResult;
      } catch (error) {
        console.error("转换失败：", error.message);
        return null;
      }
    },
    handleSortChange({ prop, order }) {
      // 可选优化：点击已排序的列，恢复原始数据顺序
      if (this.currentSort.prop === prop && this.currentSort.order === order) {
        this.complaintTableData = [...this.originTableData]
        this.currentSort = { prop: '', order: '' }
        return
      }

      // 记录当前排序状态，传给子组件同步图标
      this.currentSort = { prop, order }
      // 深拷贝数据，避免修改原始备份
      let sortData = [...this.complaintTableData]

      // 执行排序：区分数字/字符串/特殊time字段
      sortData.sort((a, b) => {
        // 处理time字段：去掉单位h，转成纯数字排序
        let valA = prop === 'time' ? Number(a[prop].replace('h', '')) : a[prop]
        let valB = prop === 'time' ? Number(b[prop].replace('h', '')) : b[prop]

        // 数字类型排序（id、处理后的time）
        if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
          return order === 'asc' ? valA - valB : valB - valA
        }
        // 字符串/中文字符串排序（type、content、status、person）
        else {
          // localeCompare：中文按拼音排序，兼容所有字符
          return order === 'asc'
            ? valA.localeCompare(valB, 'zh-CN')
            : valB.localeCompare(valA, 'zh-CN')
        }
      })

      // 赋值更新视图，子组件会自动响应数据变化
      this.complaintTableData = sortData
    },
    handleViewMore(){
      console.log( 123 )
    },
    changeCharTitleTypeHandle(event){
      this.currentCharTitleType = event.checkedType;
      this.getUtilitiesData()
    },
    getInitInfo(){
      this.getMyOrgList()
      this.getProjectBaseData()
      this.getProjectInspectionData()
      this.getCustomChartData()
      this.getWorkOrderResponseData()
      this.getComplaintTableData()
      this.getUtilitiesData()
      this.getExpendData()
      this.getChargeStatus()
    },
    //获取组织架构
    getMyOrgList(){
      let this_ = this
      this.request(statisticalApi.getMyOrgList, {}).then((res) => {
        this_.myOrgData = res.myOrgData
        setTimeout(()=>{
          this_.$refs.orgChartRef.renderChart();
        },100)
      });
    },
    //获取项目基础数据
    getProjectBaseData(){
      let this_ = this
      this.request(statisticalApi.getProjectBaseData, {}).then((res) => {
        this_.baseChartData = res.chartList
        setTimeout(()=>{
          this_.$refs.baseChartRef.renderChart();
        },100)
      });
    },
    //获取项目巡检数据
    getProjectInspectionData(){
      let this_ = this
      this.request(statisticalApi.getProjectInspectionData, {}).then((res) => {
        this_.inspectionChartData = res.chart_list
        setTimeout(()=>{
          this_.$refs.inspectionChartRef.renderChart();
        },100)
      });
    },
    //获取用户使用报修,快递代取人数
    getCustomChartData(){
      let this_ = this
      this.request(statisticalApi.getCustomChartData, {}).then((res) => {
        this_.customChartData = res.data
        setTimeout(()=>{
          // this_.$refs.customChartRef.renderChart();
        },100)
      });
    },
    //获取工单响应时间数据
    getWorkOrderResponseData(){
      let this_ = this
      this.request(statisticalApi.getWorkOrderResponseData, {}).then((res) => {
        this_.workOrderData = res.data
        setTimeout(()=>{
          this_.$refs.workOrderResponseRef.renderChart();
        },100)
      });
    },
    //获取投诉建议情况
    getComplaintTableData(){
      let this_ = this
      this.request(statisticalApi.getComplaintTableData, {}).then((res) => {
        this_.complaintTableData = res.data
        this_.complaintRateData = {
          complain_growth_rate: res.complain_growth_rate,
          current_month_completed_rate: res.current_month_completed_rate
        }
      });
    },
    //获取项目能耗数据
    getUtilitiesData(){
      let this_ = this
      this.request(statisticalApi.getUtilitiesData, {
        type: this_.currentCharTitleType,
      }).then((res) => {
        this_.categoryList = res.categoryList
        this_.monthList = res.monthList
        this_.heatData = res.heatData
        setTimeout(()=>{
          this_.$refs.utilitiesRef.renderChart();
        },100)
      });
    },
    //获取项目支出情况
    getExpendData(){
      let this_ = this
      this.request(statisticalApi.getExpendData).then((res) => {
        this_.expendData = res.data
        this.centerText.text = [
          { name:'总预算',value:res.count.total_budget || 0 },
          { name:'总支出',value:res.count.total_expend || 0 },
        ]

        setTimeout(()=>{
          this_.$refs.expendRef.renderChart();
        },100)
      });
    },
    //获取费用缴纳情况
    getChargeStatus(){
      let this_ = this
      this.request(statisticalApi.getChargeStatusData).then((res) => {
        this_.rateChartData = res
        setTimeout(()=>{
          this_.$refs.chartRateRef.renderChart();
        },100)
      });
    }
  },
}
</script>

<style scoped lang="less">
@import "./css/index.less";
/* 根节点rem适配：修复2rem/1.5rem在不同设备的尺寸偏差，必须加 */
html {
  font-size: 62.5%; /* 1rem = 10px，方便计算，不影响现有布局 */
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}
body {
  font-size: 1.4rem; /* 恢复body默认字号，不影响其他元素 */
}
</style>