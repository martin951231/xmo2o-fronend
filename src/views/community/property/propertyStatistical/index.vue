<template>
  <div class="flex flex-column container">
    <Header :title="title" :projectItem="propertyItem"></Header>
    <DataInsightDrawer :context="insightContext" :request-headers="insightRequestHeaders" :api-base="insightApiBase" />
    <InsightAnalysis :context="insightContext" :request-headers="insightRequestHeaders" :api-base="insightApiBase" />
    <InsightRisks :context="insightContext" :request-headers="insightRequestHeaders" :api-base="insightApiBase" />

    <div class="flex flex-1 chart-box">
      <div class="flex flex-column chart-item-left">
        <ChartPanel class="flex-1" title="项目人员情况">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`项目人员情况`"
            />
          </template>
          <div class="panel-content-wrap">
            <OrgChart
              ref="orgChartRef"
              label-direction="vertical"
              :orgData="myOrgData"
              :theme="myOrgTheme"
            />
            <PanelLoading :visible="loadingMap.orgChart" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="工单情况统计">
          <InsightAnalysis chart-id="workorder_status" :context="{ property_id: insightContext.property_id, ...insightDates(workOrderCurrentDateRange) }" :request-headers="insightRequestHeaders" :api-base="insightApiBase" />
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`工单情况统计`"
              :dateRange="workOrderCurrentDateRange"
              @changeDateRange="handleWorkOrderDateRangeChange"
            />
          </template>
          <div class="panel-content-wrap">
            <StackedRateChart
              ref="workOrderSituationChartRef"
              chart-title=""
              :containerHeight="`100%`"
              :chart-data="workOrderSituationChartData"
              :field-map="{ xAxis: 'village_name' }"
              :y-axis-list="workOrderSituationYAxisList"
              :series-list="workOrderSituationSeriesList"
            />
            <PanelLoading :visible="loadingMap.workOrderSituation" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="工单响应">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`工单响应`"
              :dateRange="workOrderRespondCurrentDateRange"
              @changeDateRange="handleWorkOrderRespondDateRangeChange"
            />
          </template>
          <div class="panel-content-wrap">
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
            <PanelLoading :visible="loadingMap.workOrderRespond" />
          </div>
        </ChartPanel>
      </div>

      <div class="flex flex-column chart-item-center">
        <ChartPanel class="flex-1" title="项目基础情况">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`项目基础情况(已交/已售/总量)`"
            />
          </template>
          <div class="panel-content-wrap">
            <CyberTable
              :columns="projectBaseTableColumns"
              :data="projectBaseTableData"
              :scrollSpeed="20"
            />
            <PanelLoading :visible="loadingMap.projectBase" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="收入情况">
          <InsightAnalysis chart-id="revenue" :context="{ property_id: insightContext.property_id, ...insightDates(renevueCurrentDateRange) }" :request-headers="insightRequestHeaders" :api-base="insightApiBase" />
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`收入情况`"
              :dateRange="renevueCurrentDateRange"
              @changeDateRange="handleRenevueDateRangeChange"
            />
          </template>
          <div class="panel-content-wrap">
            <StackedRateChart
              ref="renevueChartRef"
              chart-title=""
              :containerHeight="`100%`"
              :chart-data="renevueChartData"
              :field-map="{ xAxis: 'village_name' }"
              :y-axis-list="renevueYAxisList"
              :series-list="renevueSeriesList"
              :showCategoryTotal="true"
              :categoryTotalFields="['paid_amound_total', 'remaining_paid_amound_total']"
            />
            <PanelLoading :visible="loadingMap.renevue" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="支出情况">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`支出情况`"
              :dateRange="expenseCurrentDate"
              @changeDateRange="handleExpenseDateRangeChange"
            />
          </template>
          <div class="panel-content-wrap">
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
            <PanelLoading :visible="loadingMap.expense" />
          </div>
        </ChartPanel>
      </div>

      <div class="flex flex-column chart-item-right">
        <ChartPanel class="flex-1" title="用户使用情况(月)">
          <InsightAnalysis chart-id="custom_express" :context="{ property_id: insightContext.property_id, ...insightDates({}) }" :request-headers="insightRequestHeaders" :api-base="insightApiBase" />
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`用户使用情况(月)`"
            />
          </template>
          <div class="panel-content-wrap">
            <LineChart
              ref="propertyCustomChartRef"
              chart-width="100%"
              chart-height="100%"
              :chart-data="customChartData"
              chart-title=""
              :color-list="customColorList"
              :show-data-zoom="false"
              unit="次"
              :custom-line-y-axis-list="customLineYAxisList"
            />
            <PanelLoading :visible="loadingMap.customChart" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="巡检情况">
          <InsightAnalysis chart-id="inspection" :context="{ property_id: insightContext.property_id, ...insightDates(inspectionCurrentDateRange) }" :request-headers="insightRequestHeaders" :api-base="insightApiBase" />
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`巡检情况`"
              :dateRange="inspectionCurrentDateRange"
              @changeDateRange="handleInspectionDateRangeChange"
            />
          </template>
          <div class="panel-content-wrap">
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
            <PanelLoading :visible="loadingMap.inspection" />
          </div>
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
          <div class="panel-content-wrap">
            <StackedRateChart
              ref="allUtilitiesChartRef"
              chart-title=""
              :containerHeight="`100%`"
              :chart-data="allUtilitiesData"
              :field-map="{ xAxis: 'month' }"
              :y-axis-list="allUtilitiesYAxisList"
              :series-list="allUtilitiesSeriesList"
            />
            <PanelLoading :visible="loadingMap.utilities" />
          </div>
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
import InsightRisks from './datainsight/InsightRisks.vue'
import InsightAnalysis from './datainsight/InsightAnalysis.vue'
import DataInsightDrawer from './datainsight/DataInsightDrawer.vue'
import Header from '@/views/community/components/chart/Header'
import DynamicChartModal from '@/views/community/components/chart/DynamicChartModal.vue'
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
import PanelLoading from '@/views/community/components/chart/PanelLoading.vue'

export default {
  name: 'index',
  inject: { dataInsightHeaders: { default: null }, dataInsightApiBase: { default: '' } },
  components: {
    InsightRisks,
    InsightAnalysis,
    DataInsightDrawer,
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
    ChartPanel,
    PanelLoading
  },
  data: function () {
    return {
      title: '物业驾驶舱',
      insightPeriod: null,
      length: 6,
      projectItem: [
        { label: '项目占地面积', value: [0], unit: '万平方米' },
        { label: '装修中/已装/未装', value: [0], unit: '' },
        { label: '入住率/出租率', value: [0], unit: '%' },
        { label: '非机动车数量/充电桩', value: [0], unit: '' },
        { label: '新能源车辆/燃油车辆', value: [0], unit: '辆' },
        { label: '地面充电桩/车库充电桩', value: [0], unit: '个' }
      ],
      propertyItem: [
        { label: '入住城市', value: [4], unit: '个' },
        { label: '项目数量', value: [7], unit: '个' },
        { label: '项目占地面积', value: [884800], unit: '㎡' },
        { label: '住宅/商业', value: [7120, 252], unit: '户' },
        { label: '员工', value: [156], unit: '人' }
      ],
      propertyBaseData: {},
      loadingMap: {
        orgChart: false,
        workOrderSituation: false,
        workOrderRespond: false,
        projectBase: false,
        renevue: false,
        expense: false,
        customChart: false,
        inspection: false,
        utilities: false,
        propertyBase: false
      },
      myOrgTheme: {
        primary: '#36CFC9',
        secondary: '#722ED1',
        font: '#fff'
      },
      myOrgData: {},
      allUtilitiesData: [],
      allUtilitiesYAxisList: [
        { key: 'y1', name: '', unit: '元', color: '#7cb3ff' }
      ],
      allUtilitiesSeriesList: [],
      workOrderCurrentDateRange: {},
      workOrderSituationChartData: [],
      rateChartData: [],
      workOrderSituationYAxisList: [
        { key: 'y1', name: '', unit: '个', color: '#7cb3ff' }
      ],
      workOrderSituationSeriesList: [],
      renevueCurrentDateRange: {},
      renevueChartData: [],
      renevueYAxisList: [
        { key: 'y1', name: '', unit: '万元', color: '#7cb3ff' },
        { key: 'y2', name: '', unit: '%', color: '#7cb3ff' }
      ],
      renevueSeriesList: [
        // {
        //   key: 's1',
        //   name: '应收金额',
        //   type: 'bar',
        //   yAxisKey: 'y1',
        //   field: 'amound_total',
        //   stack: 'stack1',
        //   color: '#00ff99'
        // },
        {
          key: 's2',
          name: '实收金额',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'paid_amound_total',
          stack: 'stack2',
          color: '#6699ff'
        },
        {
          key: 's3',
          name: '未收金额',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'remaining_paid_amound_total',
          stack: 'stack2',
          color: '#00ffd9'
        },
        {
          key: 's4',
          name: '收缴率',
          type: 'line',
          yAxisKey: 'y2',
          field: 'paid_amound_rate',
          stack: 'stack4',
          color: '#ff6699'
        }
      ],
      yAxisList: [
        { key: 'y1', name: '户数', unit: '户', color: '#7cb3ff' },
        { key: 'y2', name: '金额', unit: '万元', color: '#00ffea' },
        { key: 'y3', name: '收缴率', unit: '%', color: '#40f0ff' }
      ],
      seriesList: [
        {
          key: 's1',
          name: '收缴户数',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'paid_account_num',
          stack: 'stack1',
          color: '#00ff99'
        },
        {
          key: 's2',
          name: '剩余户数',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'remaining_paid_account_num',
          stack: 'stack1',
          color: '#ff6699'
        },
        {
          key: 's3',
          name: '收缴金额',
          type: 'bar',
          yAxisKey: 'y2',
          field: 'paid_amound_str',
          stack: 'stack2',
          color: '#6699ff'
        },
        {
          key: 's4',
          name: '剩余金额',
          type: 'bar',
          yAxisKey: 'y2',
          field: 'remaining_paid_amound_num_str',
          stack: 'stack2',
          color: '#00ffd9'
        },
        {
          key: 's5',
          name: '户数收缴率',
          type: 'bar',
          yAxisKey: 'y3',
          field: 'paid_account_rate',
          stack: 'stack3',
          color: '#00e5ff',
          labelPos: 'top'
        },
        {
          key: 's6',
          name: '金额收缴率',
          type: 'bar',
          yAxisKey: 'y3',
          field: 'paid_amound_rate',
          stack: 'stack3',
          color: '#00FF9D',
          lineType: 'dashed'
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
      customLineYAxisList: [
        {
          name:'报事报修',
          key: 'repairAxis',
          unit: '次',
          position: 'left'
        },
        {
          name:'代取快递',
          key: 'expressAxis',
          unit: '次',
          position: 'right'
        }
      ],
      customColorList: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#00ff99' },
            { offset: 1, color: '#00cc66' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#ff6699' },
            { offset: 1, color: '#cc3366' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#6699ff' },
            { offset: 1, color: '#3366cc' }
          ]
        }
      ],
      workOrderRespondCurrentDateRange: {},
      workOrderRespondData: {},
      workOrderColorList: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#4056f4' },
            { offset: 1, color: '#253599' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#00ffd9' },
            { offset: 1, color: '#0099cc' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#00e5ff' },
            { offset: 1, color: '#008fb3' }
          ]
        }
      ],
      inspectionCurrentDateRange: {},
      inspectionChartData: [],
      inspectionyAxisList: [
        { key: 'y1', name: '异常情况', unit: '个', color: '#7cb3ff' },
        { key: 'y2', name: '完成/覆盖率', unit: '%', color: '#00ffea', max: 100 },
        { key: 'y3', name: '异常次数', unit: '次', color: '#2d71ff' }
      ],
      inspectionList: [
        {
          key: 's1',
          name: '异常情况',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'abnormal_amount',
          color: '#00CFFA'
        },
        {
          key: 's2',
          name: '异常次数',
          type: 'bar',
          yAxisKey: 'y3',
          field: 'abnormal_repeat_amount',
          color: '#7B2CBF'
        },
        {
          key: 's3',
          name: '完成率',
          type: 'line',
          yAxisKey: 'y2',
          field: 'complete_rate',
          color: '#00FF9D',
          labelPos: 'top',
          showLabel: true
        },
        {
          key: 's4',
          name: '覆盖率',
          type: 'line',
          yAxisKey: 'y2',
          field: 'override_rate',
          color: '#FF66C4',
          lineType: 'dashed',
          symbol: 'diamond',
          labelPos: 'bottom',
          showLabel: true
        }
      ],
      baseCurrentDateRange: {},
      projectBaseTableColumns: [
        { label: '项目', prop: 'project_name', width: '25%', align: 'center' },
        { label: '住宅', prop: 'resident', width: '25%', align: 'center' },
        { label: '商铺', prop: 'store', width: '25%', align: 'center' },
        { label: '车位', prop: 'parking_space', width: '25%', align: 'center' }
      ],
      projectBaseTableData: [],
      expenseCurrentDate: '',
      expenseTableColumns: [
        { label: '项目', prop: 'project_name', width: '20%', align: 'center' },
        { label: '当年预算', prop: 'totalBudget', width: '20%', align: 'center' },
        { label: '当月支出', prop: 'currentMonthTotalExpend', width: '20%', align: 'center' },
        { label: '年累计支出', prop: 'currentYearTotalExpend', width: '20%', align: 'center' },
        { label: '年累计支出环比', prop: 'yearGrowth', width: '20%', align: 'center' }
      ],
      expenseTableData: [],
      complaintRateData: [],
      originTableData: [],
      currentSort: { prop: '', order: '' },
      energyRateChartData: [
        { name: '1 月', property_use: 150.8, monitor_use: 20, light_use: 800, garade_use: 200, park_land_use: 75.98, business_use: 80 },
        { name: '2 月', property_use: 150.8, monitor_use: 20, light_use: 800, garade_use: 200, park_land_use: 75.98, business_use: 80 },
        { name: '3 月', property_use: 150.8, monitor_use: 20, light_use: 800, garade_use: 200, park_land_use: 75.98, business_use: 80 }
      ],
      energyyAxisList: [
        { key: 'y1', name: '用电量', unit: '度', color: '#7cb3ff' }
      ],
      energySeriesList: [],
      categoryList: [],
      monthList: [],
      heatMapMaxSize: 6,
      heatData: [],
      currentCharTitleType: '电',
      modalVisible: false,
      modalType: '',
      modalTitle: '',
      currentHeatmapProps: {},
      currentTableProps: {},
      metricOptions: [
        { key: 'complete_rate', label: '完成率', unit: '%' },
        { key: 'override_rate', label: '覆盖率', unit: '%' },
        { key: 'abnormal_amount', label: '异常情况', unit: '次' },
        { key: 'abnormal_repeat_amount', label: '重复异常点位', unit: '个' }
      ]
    }
  },
  watch: {},
  computed: {
    insightContext () {
      const context = { ...this.insightDates(this.insightPeriod || this.renevueCurrentDateRange) }
      if (this.propertyBaseData.property_id) context.property_id = Number(this.propertyBaseData.property_id)
      // This property-level dashboard has no selected village. Clarify through /resume.
      return context
    },
    insightApiBase () { return this.dataInsightApiBase || process.env.VUE_APP_DATAINSIGHT_API_BASE || '/api/v1/datainsight' }
  },
  mounted() {
    this.originTableData = [...this.projectBaseTableData]
    this.getInitInfo()
  },
  methods: {
    async insightRequestHeaders () {
      if (typeof this.dataInsightHeaders !== 'function') throw new Error('数据分析暂不可用：尚未接入 P3 登录身份')
      return this.dataInsightHeaders()
    },
    insightDates (params = {}) {
      const dates = {}
      for (const key of ['start_date', 'end_date']) {
        const value = params[key]
        if (/^\d{4}-\d{2}-\d{2}$/.test(value || '')) dates[key] = value
        else if (/^\d{4}-\d{2}$/.test(value || '')) {
          const [year, month] = value.split('-').map(Number)
          if (month >= 1 && month <= 12) dates[key] = value + '-' + (key === 'start_date' ? '01' : String(new Date(year, month, 0).getDate()))
        }
      }
      return dates
    },
    setPanelLoading(key, status) {
      if (Object.prototype.hasOwnProperty.call(this.loadingMap, key)) {
        this.$set(this.loadingMap, key, status)
      }
    },

    getInitInfo() {
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

    getPropertyBaseData() {
      this.setPanelLoading('propertyBase', true)
      this.request(statisticalApi.getPropertyBaseData, {})
        .then((res) => {
          this.propertyBaseData = res
          this.title = res.property_name
          this.propertyItem = [
            { label: '入住城市', value: [res.settle_city], unit: '个' },
            { label: '项目数量', value: [res.village_num], unit: '个' },
            { label: '项目占地面积', value: [res.area], unit: '' },
            { label: '住宅/商业', value: [`${res.resident_num}户`, `${res.store_num}户`], unit: '' },
            { label: '员工', value: [0], unit: '个' }
          ]
        })
        .catch((err) => {
          console.error('获取物业基础数据失败：', err)
        })
        .finally(() => {
          this.setPanelLoading('propertyBase', false)
        })
    },

    getPropertyAllProjectBaseData() {
      this.setPanelLoading('projectBase', true)
      this.request(statisticalApi.getPropertyAllProjectBaseData, {})
        .then((res) => {
          this.projectBaseTableData = res || []
        })
        .catch((err) => {
          console.error('获取项目基础情况失败：', err)
          this.projectBaseTableData = []
        })
        .finally(() => {
          this.setPanelLoading('projectBase', false)
        })
    },

    getPropertyOrgList() {
      this.setPanelLoading('orgChart', true)
      this.request(statisticalApi.getPropertyOrgList, {})
        .then((res) => {
          this.myOrgData = res.orgData || {}
          setTimeout(() => {
            this.propertyItem = [
              { label: '入住城市', value: [this.propertyBaseData.settle_city || 0], unit: '个' },
              { label: '项目数量', value: [this.propertyBaseData.village_num || 0], unit: '个' },
              { label: '项目占地面积', value: [this.propertyBaseData.area || 0], unit: '' },
              {
                label: '客户：住宅/商业',
                value: [
                  `${this.propertyBaseData.resident_num || 0}户`,
                  `${this.propertyBaseData.store_num || 0}户`
                ],
                unit: ''
              },
              { label: '员工', value: [res.total_user_num || 0], unit: '个' }
            ]
            this.$refs.orgChartRef && this.$refs.orgChartRef.renderChart && this.$refs.orgChartRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取组织架构失败：', err)
          this.myOrgData = {}
        })
        .finally(() => {
          this.setPanelLoading('orgChart', false)
        })
    },

    convertToTenThousand(num, decimalDigits = 4, withUnit = false) {
      try {
        const numFloat = parseFloat(num)
        if (isNaN(numFloat)) {
          throw new Error('输入不是有效数字')
        }
        const result = numFloat / 10000
        const fixedResult = Number(result.toFixed(decimalDigits))
        return withUnit ? `${fixedResult}万` : fixedResult
      } catch (error) {
        console.error('转换失败：', error.message)
        return null
      }
    },

    getPropertyCustomChartData() {
      this.setPanelLoading('customChart', true)
      this.request(statisticalApi.getPropertyCustomChartData, {})
        .then((res) => {
          this.customChartData = res.data || {}
          setTimeout(() => {
            this.$refs.propertyCustomChartRef &&
            this.$refs.propertyCustomChartRef.renderChart &&
            this.$refs.propertyCustomChartRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取用户使用情况失败：', err)
          this.customChartData = {}
        })
        .finally(() => {
          this.setPanelLoading('customChart', false)
        })
    },

    getPropertyWorkOrderSituationData(params = { start_date: '', end_date: '' }) {
      this.setPanelLoading('workOrderSituation', true)
      this.request(statisticalApi.getPropertyWorkOrderSituationData, params)
        .then((res) => {
          this.workOrderSituationChartData = (res.data && res.data.workOrderSituationChartData) || []
          this.workOrderSituationSeriesList = (res.data && res.data.workOrderSituationSeriesList) || []
          this.workOrderCurrentDateRange = res.dateRange || {}
          setTimeout(() => {
            this.$refs.workOrderSituationChartRef &&
            this.$refs.workOrderSituationChartRef.renderChart &&
            this.$refs.workOrderSituationChartRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取工单情况统计失败：', err)
          this.workOrderSituationChartData = []
          this.workOrderSituationSeriesList = []
        })
        .finally(() => {
          this.setPanelLoading('workOrderSituation', false)
        })
    },

    getRevenueData(params = { start_date: '', end_date: '' }) {
      this.setPanelLoading('renevue', true)
      this.request(statisticalApi.getRevenueData, params)
        .then((res) => {
          this.renevueChartData = res.data || []
          this.renevueCurrentDateRange = res.dateRange || {}
          setTimeout(() => {
            this.$refs.renevueChartRef &&
            this.$refs.renevueChartRef.renderChart &&
            this.$refs.renevueChartRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取收入情况失败：', err)
          this.renevueChartData = []
        })
        .finally(() => {
          this.setPanelLoading('renevue', false)
        })
    },

    getAllWorkOrderResponseData(params = { start_date: '', end_date: '' }) {
      this.setPanelLoading('workOrderRespond', true)
      this.request(statisticalApi.getAllWorkOrderResponseData, params)
        .then((res) => {
          this.workOrderRespondData = res.data || {}
          this.workOrderRespondCurrentDateRange = res.dateRange || {}
          setTimeout(() => {
            this.$refs.workOrderResponseRef &&
            this.$refs.workOrderResponseRef.renderChart &&
            this.$refs.workOrderResponseRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取工单响应失败：', err)
          this.workOrderRespondData = {}
        })
        .finally(() => {
          this.setPanelLoading('workOrderRespond', false)
        })
    },

    getInspectionChartData(params = { start_date: '', end_date: '' }) {
      this.setPanelLoading('inspection', true)
      this.request(statisticalApi.getInspectionChartData, params)
        .then((res) => {
          this.inspectionChartData = res.data || []
          this.inspectionCurrentDateRange = res.dateRange || {}
          setTimeout(() => {
            this.$refs.inspectionChartRef &&
            this.$refs.inspectionChartRef.renderChart &&
            this.$refs.inspectionChartRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取巡检情况失败：', err)
          this.inspectionChartData = []
        })
        .finally(() => {
          this.setPanelLoading('inspection', false)
        })
    },

    getExpenseTableData(params = { month: '' }) {
      this.setPanelLoading('expense', true)
      this.request(statisticalApi.getExpenseTableData, { month: params.month })
        .then((res) => {
          this.expenseTableData = res.data || []
          this.expenseCurrentDate = res.month || ''
        })
        .catch((err) => {
          console.error('获取支出情况失败：', err)
          this.expenseTableData = []
          this.expenseCurrentDate = ''
        })
        .finally(() => {
          this.setPanelLoading('expense', false)
        })
    },

    changeCharTitleTypeHandle(event) {
      this.currentCharTitleType = event.checkedType
      this.getAllUtilitiesData()
    },

    getAllUtilitiesData() {
      this.setPanelLoading('utilities', true)
      this.request(statisticalApi.getAllUtilitiesData, {
        currentCharTitleType: this.currentCharTitleType
      })
        .then((res) => {
          this.allUtilitiesData = res.chartData || []
          this.allUtilitiesSeriesList = res.seriesList || []

          this.$nextTick(() => {
            this.$refs.allUtilitiesChartRef &&
            this.$refs.allUtilitiesChartRef.forceRefreshChart &&
            this.$refs.allUtilitiesChartRef.forceRefreshChart()
          })
        })
        .catch((err) => {
          console.error('获取能耗数据失败：', err)
          this.allUtilitiesData = []
          this.allUtilitiesSeriesList = []
        })
        .finally(() => {
          this.setPanelLoading('utilities', false)
        })
    },

    handleWorkOrderDateRangeChange(params) {
      this.insightPeriod = { ...params }
      this.getPropertyWorkOrderSituationData(params)
    },

    handleRenevueDateRangeChange(params) {
      this.insightPeriod = { ...params }
      this.getRevenueData(params)
    },

    handleInspectionDateRangeChange(params) {
      this.insightPeriod = { ...params }
      this.getInspectionChartData(params)
    },

    handleWorkOrderRespondDateRangeChange(params) {
      this.insightPeriod = { ...params }
      this.getAllWorkOrderResponseData(params)
    },

    handleExpenseDateRangeChange(params) {
      this.insightPeriod = { start_date: params, end_date: params }
      this.getExpenseTableData({ month: params })
    }
  }
}
</script>

<style scoped lang="less">
@import "./css/index.less";

/* 根节点rem适配：修复2rem/1.5rem在不同设备的尺寸偏差，必须加 */
html {
  font-size: 62.5%;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

body {
  font-size: 1.4rem;
}

.panel-content-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>