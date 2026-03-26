<template>
  <div class="flex flex-column container">
    <Header :title="title" :projectItem="propertyItem"></Header>

    <div class="flex flex-1 chart-box">
      <div class="flex flex-column chart-item-left">
        <ChartPanel class="flex-1" title="项目人员情况">
          <OrgChart
            ref="orgChartRef"
            :orgData="myOrgData"
            :theme="myOrgTheme"
            labelDirection="vertical"
          />
        </ChartPanel>

        <ChartPanel class="flex-1" title="工单情况统计">
          <StackedRateChart
            ref="workOrderSituationChartRef"
            chart-title=""
            :containerHeight="`100%`"
            :chart-data="workOrderSituationChartData"
            :field-map="{ xAxis: 'village_name' }"
            :y-axis-list="workOrderSituationYAxisList"
            :series-list="workOrderSituationSeriesList"
          />
        </ChartPanel>

        <ChartPanel class="flex-1" title="工单响应">
          <LineChart
            ref="workOrderResponseRef"
            chart-width="100%"
            chart-height="100%"
            :chart-data="workOrderRespondData"
            chart-title=""
            :color-list="workOrderColorList"
            :show-data-zoom="false"
            unit="时"
          />
        </ChartPanel>
      </div>

      <div class="flex flex-column chart-item-center">
        <ChartPanel class="flex-1" title="项目基础情况">
          <CyberTable
            :columns="projectBaseTableColumns"
            :data="projectBaseTableData"
            :scrollSpeed="20"
          />
        </ChartPanel>

        <ChartPanel class="flex-1" title="收入情况">
          <StackedRateChart
            ref="renevueChartRef"
            chart-title=""
            :containerHeight="`100%`"
            :chart-data="renevueChartData"
            :field-map="{ xAxis: 'village_name' }"
            :y-axis-list="renevueYAxisList"
            :series-list="renevueSeriesList"
          />
        </ChartPanel>

        <ChartPanel class="flex-1" title="支出情况">
          <CyberTable
            :show-more="false"
            :columns="expenseTableColumns"
            :data="expenseTableData"
            :scrollSpeed="20"
            :ratioConfig="{
              enable: true,
              columns: ['yearGrowth']
            }"
          />
        </ChartPanel>
      </div>

      <div class="flex flex-column chart-item-right">
        <ChartPanel class="flex-1" title="用户使用情况(月)">
          <LineChart
            ref="propertyCustomChartRef"
            chart-width="100%"
            chart-height="100%"
            :chart-data="customChartData"
            chart-title=""
            :color-list="customColorList"
            :show-data-zoom="false"
            unit="次"
          />
        </ChartPanel>

        <ChartPanel class="flex-1" title="巡检情况">
          <RoseChart
            ref="inspectionChartRef"
            :chart-data="inspectionChartData"
            :field-map="{ name: 'village_name' }"
            :metric-options="metricOptions"
            default-metric-key="completionRate"
            chart-title=""
            :show-title="false"
            :show-legend="false"
            :show-tooltip="true"
            container-width="100%"
            container-height="100%"
          />
        </ChartPanel>

        <ChartPanel class="flex-1" title="能耗统计情况">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`能耗统计情况`"
              :changeType="['水','电']"
              :currentType="currentCharTitleType"
              @changeTypeHandle="changeCharTitleTypeHandle"
            />
          </template>
          <StackedRateChart
            ref="allUtilitiesChartRef"
            chart-title=""
            :containerHeight="`100%`"
            :chart-data="allUtilitiesData"
            :field-map="{ xAxis: 'month' }"
            :y-axis-list="allUtilitiesYAxisList"
            :series-list="allUtilitiesSeriesList"
          />
        </ChartPanel>
      </div>
    </div>

    <template>
      <div class="demo-page">
        <DynamicChartModal
          :visible="modalVisible"
          :type="modalType"
          :title="modalTitle"
          :heatmap-props="currentHeatmapProps"
          :table-props="currentTableProps"
        />
      </div>
    </template>
  </div>
</template>
<script>
import statisticalApi from '@/api/community/statistical'
import Header from '@/views/community/components/chart/Header';
import DynamicChartModal from '@/views/community/components/chart/DynamicChartModal.vue';
import StackedRateChart from '@/views/community/components/chart/StackedRateChart.vue'
import PieChart from '@/views/community/components/chart/PieChart.vue'
import OrgChart from '@/views/community/components/chart/OrgChart.vue'
import LineChart from '@/views/community/components/chart/LineChart.vue'
import BarChart from '@/views/community/components/chart/BarChart.vue'
import CyberTable from '@/views/community/components/chart/CyberTable.vue'
import CharTitle from '@/views/community/components/chart/charTitle.vue'
import EnergyHeatmap from '@/views/community/components/chart/EnergyHeatmap.vue'
import SunburstChart from '@/views/community/components/chart/SunburstChart.vue'
import RoseChart from '@/views/community/components/chart/RoseChart.vue'
import ChartPanel from '@/views/community/components/chart/ChartPanel.vue'

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
    DynamicChartModal,
    RoseChart,
    ChartPanel
  },
  data: function () {
    return {
      title: '物业驾驶舱',
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
      propertyBaseData:{},//项目基础数据
      //组织架构颜色配置
      myOrgTheme: {
        primary: '#36CFC9',
        secondary: '#722ED1',
        font: '#fff'
      },
      //组织架构数据
      myOrgData: {},
      //能耗统计情况
      allUtilitiesData:[],
      allUtilitiesYAxisList:[
        { key: 'y1', name: '', unit: '元', color: '#7cb3ff' },
      ],
      allUtilitiesSeriesList:[],
      //工单情况统计
      workOrderSituationChartData: [],
      rateChartData:[],
      workOrderSituationYAxisList:[
        { key: 'y1', name: '', unit: '个', color: '#7cb3ff' },
      ],
      workOrderSituationSeriesList:[],
      //收入情况
      renevueChartData:[],
      renevueYAxisList:[
        { key: 'y1', name: '', unit: '万元', color: '#7cb3ff' },
        { key: 'y2', name: '', unit: '%', color: '#7cb3ff' },
      ],
      renevueSeriesList:[
        // 第一组堆叠柱 - 关联y1（户数）
        {
          key: 's1', name: '应收金额', type: 'bar',
          yAxisKey: 'y1', field: 'amound_total',
          stack: 'stack1', color: '#00ff99'
        },
        {
          key: 's2', name: '实收金额', type: 'bar',
          yAxisKey: 'y1', field: 'paid_amound_total',
          stack: 'stack2', color: '#6699ff'
        },
        // 第二组堆叠柱 - 关联y2（金额）
        {
          key: 's3', name: '未收金额', type: 'bar',
          yAxisKey: 'y1', field: 'remaining_paid_amound_total',
          stack: 'stack3', color: '#00ffd9'
        },
        {
          key: 's4', name: '收缴率', type: 'line',
          yAxisKey: 'y2', field: 'paid_amound_rate',
          stack: 'stack4', color: '#ff6699'
        },
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
      workOrderRespondData: {},
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
      projectBaseTableColumns:[
        { label: '序号', prop: 'id', width: '12%', align: 'center' },
        { label: '项目', prop: 'project_name', width: '22%', align: 'center' },
        { label: '住宅', prop: 'resident', width: '22%', align: 'center' },
        { label: '商铺', prop: 'store', width: '22%', align: 'center' },
        { label: '车位', prop: 'parking_space', width: '22%', align: 'center' },
      ],
      projectBaseTableData:[],
      expenseTableColumns:[
        { label: '序号', prop: 'project_id', width: '10%', align: 'center' },
        { label: '项目', prop: 'project_name', width: '20%', align: 'center' },
        { label: '当年预算', prop: 'totalBudget', width: '15%', align: 'center' },
        { label: '当月支出', prop: 'currentMonthTotalExpend', width: '15%', align: 'center' },
        { label: '年累计支出', prop: 'currentYearTotalExpend', width: '20%', align: 'center' },
        { label: '年累计支出环比', prop: 'yearGrowth', width: '20%', align: 'center' },
      ],
      expenseTableData:[],
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
      heatMapMaxSize: 6,
      heatData: [],
      currentCharTitleType: '电',//项目能耗趋势图默认选中类型
      modalVisible: false,
      modalType: '', // heatmap/table
      modalTitle: '',
      // 热力图参数（不同场景切换）
      currentHeatmapProps: {},
      // 表格参数
      currentTableProps: {},
      // 巡检情况右侧按钮
      metricOptions: [
        { key: 'complete_rate', label: '完成率', unit: '%' },
        { key: 'override_rate', label: '覆盖率', unit: '%' },
        { key: 'abnormal_amount', label: '异常情况', unit: '次' },
        { key: 'abnormal_repeat_amount', label: '重复异常点位', unit: '个' }
      ],
    }
  },
  watch: {},
  computed: {},
  mounted() {
    this.originTableData = [...this.projectBaseTableData]
    this.getInitInfo();
  },
  methods: {
    getInitInfo(){
      // this.getConfig()
      this.getPropertyBaseData()
      this.getPropertyOrgList()
      this.getPropertyAllProjectBaseData()
      this.getPropertyCustomChartData()
      this.getPropertyWorkOrderSituationData()
      this.getRevenueData()
      this.getAllWorkOrderResponseData()
      this.getInspectionChartData()
      this.getExpenseTableData()
      this.getAllUtilitiesData()
    },
    // getConfig() {
    //   const config = this.$store.getters.config
    //   if (config) {
    //     this.config = config
    //     if (!this.village_logo && this.config.system_admin_logo) {
    //       this.village_logo = this.config.system_admin_logo
    //     }
    //     console.log('this.config', this.config)
    //     console.log('this.village_logo', this.village_logo)
    //   } else {
    //     setTimeout(() => {
    //       this.getConfig()
    //     }, 300)
    //   }
    // },
    getPropertyBaseData(){
      let this_ = this
      this.request(statisticalApi.getPropertyBaseData, {}).then((res) => {
        this.propertyBaseData = res
        this.propertyItem = [
          {label:'入住城市',value: [res.settle_city],unit:'个'},
          {label:'项目数量',value: [res.village_num],unit:'个'},
          {label:'项目占地面积',value: [res.area],unit:''},
          {label:'客户：住宅/商业',value: [`${res.resident_num}户`,`${res.store_num}户`],unit:''},
          {label:'员工',value: [0],unit:'个'},
        ]
      });
    },
    //获取项目基础情况
    getPropertyAllProjectBaseData(){
      let this_ = this
      this.request(statisticalApi.getPropertyAllProjectBaseData, {}).then((res) => {
        this.projectBaseTableData = res
      });
    },
    //获取组织架构
    getPropertyOrgList(){
      let this_ = this
      this.request(statisticalApi.getPropertyOrgList, {}).then((res) => {
        this_.myOrgData = res.orgData
        setTimeout(()=>{
          this.propertyItem = [
            {label:'入住城市',value: [this.propertyBaseData.settle_city],unit:'个'},
            {label:'项目数量',value: [this.propertyBaseData.village_num],unit:'个'},
            {label:'项目占地面积',value: [this.propertyBaseData.area],unit:''},
            {label:'客户：住宅/商业',value: [`${this.propertyBaseData.resident_num}户`,`${this.propertyBaseData.store_num}户`],unit:''},
            {label:'员工',value: [res.total_user_num],unit:'个'},
          ]
          this_.$refs.orgChartRef.renderChart();
        },100)
      });
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
    //获取用户使用报修,快递代取人数
    getPropertyCustomChartData(){
      let this_ = this
      this.request(statisticalApi.getPropertyCustomChartData, {}).then((res) => {
        this_.customChartData = res.data
        setTimeout(()=>{
          this_.$refs.propertyCustomChartRef.renderChart();
        },100)
      });
    },
    //获取工单情况统计
    getPropertyWorkOrderSituationData(){
      let this_ = this
      this.request(statisticalApi.getPropertyWorkOrderSituationData, {}).then((res) => {
        console.log( res )
        this_.workOrderSituationChartData = res.data.workOrderSituationChartData
        this_.workOrderSituationSeriesList = res.data.workOrderSituationSeriesList
        setTimeout(()=>{
          this_.$refs.workOrderSituationChartRef.renderChart();
        },100)
      });
    },
    //获取工单情况统计
    getRevenueData(){
      let this_ = this
      this.request(statisticalApi.getRevenueData, {}).then((res) => {
        this.renevueChartData = res.data
        setTimeout(()=>{
          this_.$refs.renevueChartRef.renderChart();
        },100)
      });
    },
    //获取工单响应时间
    getAllWorkOrderResponseData(){
      let this_ = this
      this.request(statisticalApi.getAllWorkOrderResponseData, {}).then((res) => {
        // this.renevueChartData = res.data
        this.workOrderRespondData = res
        setTimeout(()=>{
          this_.$refs.workOrderResponseRef.renderChart();
        },100)
      });
    },
    //获取巡检情况
    getInspectionChartData(){
      let this_ = this
      this.request(statisticalApi.getInspectionChartData, {}).then((res) => {
        this.inspectionChartData = res
        setTimeout(()=>{
          this_.$refs.inspectionChartRef.renderChart();
        },100)
      });
    },
    //获取支出情况
    getExpenseTableData(){
      let this_ = this
      this.request(statisticalApi.getExpenseTableData, {}).then((res) => {
        this.expenseTableData = res
      })
    },
    changeCharTitleTypeHandle(event){
      this.currentCharTitleType = event.checkedType;
      this.getAllUtilitiesData()
    },
    //获取能耗统计
    getAllUtilitiesData() {
      this.request(statisticalApi.getAllUtilitiesData, {
        currentCharTitleType: this.currentCharTitleType,
      }).then((res) => {
        this.allUtilitiesData = res.chartData || []
        this.allUtilitiesSeriesList = res.seriesList || []

        this.$nextTick(() => {
          this.$refs.allUtilitiesChartRef?.forceRefreshChart?.()
        })
      }).catch(err => {
        console.error('获取能耗数据失败：', err)
        this.allUtilitiesData = []
        this.allUtilitiesSeriesList = []
      })
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