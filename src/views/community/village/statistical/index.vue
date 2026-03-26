<template>
  <div class="flex flex-column container">
    <div class="header-wrap">
      <Header :title="title" :projectItem="projectItem"></Header>
      <PanelLoading :visible="loadingMap.header" />
    </div>

    <div class="flex flex-1 chart-box">
      <div class="flex flex-column chart-item-left">
        <ChartPanel class="flex-1" title="项目组织架构">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`项目组织架构`"
            />
          </template>
          <div class="panel-content-wrap">
            <OrgChart
              label-direction="vertical"
              ref="orgChartRef"
              :orgData="myOrgData"
              :theme="myOrgTheme"
            />
            <PanelLoading :visible="loadingMap.orgChart" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="项目基础数据">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`项目基础数据`"
            />
          </template>
          <div class="panel-content-wrap">
            <PieChart
              :pie-config="{
                isRing: false,
                doubleRadius: ['0%', '60%'],
                leftCenter: ['30%', '50%'],
                rightCenter: ['70%', '50%']
              }"
              :chartData="baseChartData"
              :filterButtons="{ show: true }"
              :fieldMap="{ name: 'village_name' }"
              :metricOptions="[
                { key: 'resident', label: '住宅', unit: '套' },
                { key: 'store', label: '商铺', unit: '套' },
                { key: 'parking', label: '车位', unit: '套' }
              ]"
              :doubleRingColorList="{
                left: ['#61e19b', '#ee7ca2'],
                right: ['#61e19b', '#ee7ca2']
              }"
              defaultMetricKey="completionRate"
              :doubleRing="true"
              :doubleRingFields="{
                left: [
                  { key: 'yijiao', name: '已交' },
                  { key: 'weijiao', name: '未交' }
                ],
                right: [
                  { key: 'yishou', name: '已售' },
                  { key: 'weishou', name: '未售' }
                ]
              }"
              centerValueSuffix=""
              :doubleRingLabel="{
                left: {
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: 600
                },
                right: {
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: 600
                }
              }"
            />
            <PanelLoading :visible="loadingMap.baseChart" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="项目巡检情况">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`项目巡检情况`"
              :dateRange="inspectionCurrentDateRange"
              @changeDateRange="handleInspectionDateRangeChange"
            />
          </template>
          <div class="panel-content-wrap">
            <StackedRateChart
              ref="inspectionChartRef"
              chart-title=""
              :containerHeight="`100%`"
              :chart-data="inspectionChartData"
              :field-map="{ xAxis: 'name' }"
              :y-axis-list="inspectionyAxisList"
              :series-list="inspectionList"
            />
            <PanelLoading :visible="loadingMap.inspection" />
          </div>
        </ChartPanel>
      </div>

      <div class="flex flex-column chart-item-center">
        <ChartPanel class="flex-1" title="项目周期性费用情况">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`项目周期性费用情况`"
              :dateRange="cycleCurrentDateRange"
              @changeDateRange="handleCycleDateRangeChange"
            />
          </template>
          <div class="panel-content-wrap">
            <Cyber2Table
              fillEmptySpace="true"
              :title="tableConfig.title"
              :summary="tableConfig.summary"
              :header-rows="tableConfig.headerRows"
              :columns="tableConfig.columns"
              :data="tableConfig.data"
              :show-more="false"
            />
            <PanelLoading :visible="loadingMap.cycleTable" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="项目支出情况">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`项目支出情况`"
              :dateRange="expendCurrentDateRange"
              @changeDateRange="handleExpendDateRangeChange"
            />
          </template>
          <div class="panel-content-wrap">
            <PieChart
              ref="expendRef"
              :chart-data="expendData"
              :center-text="centerText"
              :pie-config="{ isRing: true, radius: ['68%', '70%'] }"
            />
            <PanelLoading :visible="loadingMap.expend" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1 chart-panel-has-actions">
          <template #title>
            <charTitle
              :show-more="true"
              :title-name="`项目能耗趋势`"
              :currentType="currentCharTitleType"
              @changeTypeHandle="changeCharTitleTypeHandle"
              @viewMore="openHeatmapModal('utilities')"
            />
          </template>
          <div class="panel-content-wrap">
            <StackedRateChart
              ref="chartUtilitiesRef"
              chart-title=""
              :containerHeight="`100%`"
              :chart-data="utilitiesChartData"
              :field-map="{ xAxis: 'month' }"
              :y-axis-list="utilitiesyAxisList"
              :series-list="utilitiesSeriesList"
            />
            <PanelLoading :visible="loadingMap.utilities" />
          </div>
        </ChartPanel>
      </div>

      <div class="flex flex-column chart-item-right">
        <ChartPanel class="flex-1" title="用户使用情况">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`用户使用情况`"
            />
          </template>
          <div class="panel-content-wrap">
            <LineChart
              ref="customChartRef"
              chart-width="100%"
              chart-height="100%"
              unit="次"
              :chart-data="customChartData"
              chart-title=""
              :color-list="customColorList"
              :show-data-zoom="false"
              :custom-line-y-axis-list="customLineYAxisList"
            />
            <PanelLoading :visible="loadingMap.customChart" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="工单响应时间">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`工单响应时间`"
            />
          </template>
          <div class="panel-content-wrap">
            <LineChart
              ref="workOrderResponseRef"
              chart-width="100%"
              chart-height="100%"
              unit="时"
              :chart-data="workOrderData"
              chart-title=""
              :color-list="workOrderColorList"
              :show-data-zoom="false"
            />
            <PanelLoading :visible="loadingMap.workOrderResponse" />
          </div>
        </ChartPanel>

        <ChartPanel class="flex-1" title="工单列表">
          <template #title>
            <charTitle
              :show-more="false"
              :title-name="`工单列表`"
            />
          </template>
          <div class="panel-content-wrap">
            <CyberTable
              :columns="complaintTableColumns"
              :data="complaintTableData"
              :scrollSpeed="20"
              :current-sort="currentSort"
              @sort-change="handleSortChange"
              @viewMore="handleViewMore"
            />
            <PanelLoading :visible="loadingMap.complaintTable" />
          </div>
        </ChartPanel>
      </div>
    </div>

    <template>
      <div class="demo-page">
        <DynamicChartModal
          :heat-map-max-size="heatMapMaxSize"
          :visible="modalVisible"
          :type="modalType"
          :title="modalTitle"
          :heatmap-props="currentHeatmapProps"
          :table-props="currentTableProps"
          @close="closeModal"
          @confirm="handleConfirm"
          @table-event="handleTableEvent"
        />
      </div>
    </template>
  </div>
</template>

<script>
import statisticalApi from '@/api/community/statistical'
import Header from '@/views/community/components/chart/Header'
import DynamicChartModal from '@/views/community/components/chart/DynamicChartModal.vue'
import StackedRateChart from '@/views/community/components/chart/StackedRateChart.vue'
import PieChart from '@/views/community/components/chart/PieChart.vue'
import OrgChart from '@/views/community/components/chart/OrgChart.vue'
import LineChart from '@/views/community/components/chart/LineChart.vue'
import BarChart from '@/views/community/components/chart/BarChart.vue'
import CyberTable from '@/views/community/components/chart/CyberTable.vue'
import Cyber2Table from '@/views/community/components/chart/Cyber2Table.vue'
import CharTitle from '@/views/community/components/chart/charTitle.vue'
import EnergyHeatmap from '@/views/community/components/chart/EnergyHeatmap.vue'
import SunburstChart from '@/views/community/components/chart/SunburstChart.vue'
import ChartPanel from '@/views/community/components/chart/ChartPanel.vue'
import PanelLoading from '@/views/community/components/chart/PanelLoading.vue'

export default {
  name: 'Index',
  components: {
    EnergyHeatmap,
    CharTitle,
    CyberTable,
    Cyber2Table,
    BarChart,
    LineChart,
    OrgChart,
    StackedRateChart,
    MultiDimensionChart: StackedRateChart,
    PieChart,
    SunburstChart,
    Header,
    DynamicChartModal,
    ChartPanel,
    PanelLoading
  },
  data: function () {
    return {
      title: '项目驾驶舱',
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
        { label: '客户：住宅/商业', value: [7120, 252], unit: '户' },
        { label: '员工', value: [156], unit: '人' }
      ],

      loadingMap: {
        header: false,
        orgChart: false,
        baseChart: false,
        inspection: false,
        cycleTable: false,
        expend: false,
        utilities: false,
        customChart: false,
        workOrderResponse: false,
        complaintTable: false
      },

      myOrgTheme: {
        primary: '#36CFC9',
        secondary: '#722ED1',
        font: '#fff'
      },
      myOrgData: {},
      tableConfig: {},
      baseChartData: [],
      cycleCurrentDateRange: {},
      rateChartData: [],
      baseyAxisList: [
        { key: 'y1', name: '', unit: '户', color: '#7cb3ff' }
      ],
      utilitiesChartData: [],
      utilitiesyAxisList: [
        { key: 'y1', name: '水费', unit: '元', color: '#7cb3ff' },
        { key: 'y2', name: '电费', unit: '元', color: '#7cb3ff' }
      ],
      utilitiesSeriesList: [
        {
          key: 's1',
          name: '水费',
          type: 'line',
          yAxisKey: 'y1',
          field: 'shuifei',
          stack: 'stack1',
          color: '#00ff99'
        },
        {
          key: 's2',
          name: '电费',
          type: 'line',
          yAxisKey: 'y2',
          field: 'dianfei',
          stack: 'stack2',
          color: '#ff6699'
        }
      ],
      baseSeriesList: [
        {
          key: 's1',
          name: '已售',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'yishou',
          stack: 'stack1',
          color: '#00ff99'
        },
        {
          key: 's2',
          name: '未售',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'weishou',
          stack: 'stack1',
          color: '#ff6699'
        },
        {
          key: 's3',
          name: '已交',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'yijiao',
          stack: 'stack2',
          color: '#6699ff'
        },
        {
          key: 's4',
          name: '未交',
          type: 'bar',
          yAxisKey: 'y1',
          field: 'weijiao',
          stack: 'stack2',
          color: '#00ffd9'
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
      expendCurrentDateRange: [],
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
          name: '报事报修',
          key: 'repairAxis',
          unit: '次',
          position: 'left'
        },
        {
          name: '代取快递',
          key: 'expressAxis',
          unit: '次',
          position: 'right'
        }
      ],
      customLineSeriesAxisMap: {
        报事报修: 'repairAxis',
        代取快递: 'expressAxis'
      },
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
      workOrderData: {},
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
        { key: 'y1', name: '异常情况/异常次数', unit: '个', color: '#7cb3ff' },
        { key: 'y2', name: '完成/覆盖率', unit: '%', color: '#00ffea', max: 100 },
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
          yAxisKey: 'y1',
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
      complaintTableColumns: [
        { label: '类型', prop: 'event_type', width: '15%', align: 'center' },
        { label: '上报日期', prop: 'add_time', width: '20%', align: 'center' },
        { label: '内容摘要', prop: 'order_content', width: '35%', align: 'center' },
        { label: '状态', prop: 'event_status_txt', width: '15%', align: 'center' },
        { label: '责任人', prop: 'name', width: '15%', align: 'center' }
      ],
      complaintTableData: [],
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
      currentTableProps: {}
    }
  },
  watch: {},
  computed: {},
  mounted () {
    this.originTableData = [...this.complaintTableData]
    this.getConfig()
    this.getProjectInfo()
    this.getInitInfo()
  },
  methods: {
    setPanelLoading (key, status) {
      if (Object.prototype.hasOwnProperty.call(this.loadingMap, key)) {
        this.$set(this.loadingMap, key, status)
      }
    },

    getConfig () {
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

    getProjectInfo () {
      this.setPanelLoading('header', true)
      this.request(statisticalApi.config)
        .then((res) => {
          console.log('+++++++', res)
          if (res) {
            const pInfo = res.project_info
            this.projectItem = [
              { label: '项目占地面积', value: [this.convertToTenThousand(pInfo.plot_area, 2)], unit: '万平方米' },
              { label: '装修中/已装/未装', value: [pInfo.decoration_num, pInfo.decorated_num, pInfo.undecorate_num], unit: '' },
              { label: '入住率/出租率', value: [`${pInfo.occupancy_rate}%`, `${pInfo.rental_rate}%`], unit: '' },
              { label: '非机动车数量/充电桩', value: [`${pInfo.non_motor_num}辆`, `${pInfo.charger_num}个`], unit: '' },
              { label: '新能源车辆/燃油车辆', value: [pInfo.new_energy_num, pInfo.fuel_num], unit: '辆' },
              { label: '地面充电桩/车库充电桩', value: [pInfo.ground_charger_num, pInfo.garage_charger_num], unit: '个' }
            ]
            this.title = res.village_info.village_name + '驾驶舱'
          }
        })
        .catch((err) => {
          console.error('获取标题信息失败：', err)
        })
        .finally(() => {
          this.setPanelLoading('header', false)
        })
    },

    convertToTenThousand (num, decimalDigits = 4, withUnit = false) {
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

    handleSortChange ({ prop, order }) {
      if (this.currentSort.prop === prop && this.currentSort.order === order) {
        this.complaintTableData = [...this.originTableData]
        this.currentSort = { prop: '', order: '' }
        return
      }

      this.currentSort = { prop, order }
      const sortData = [...this.complaintTableData]

      sortData.sort((a, b) => {
        const valA = prop === 'time' ? Number(a[prop].replace('h', '')) : a[prop]
        const valB = prop === 'time' ? Number(b[prop].replace('h', '')) : b[prop]

        if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
          return order === 'asc' ? valA - valB : valB - valA
        } else {
          return order === 'asc'
            ? String(valA).localeCompare(String(valB), 'zh-CN')
            : String(valB).localeCompare(String(valA), 'zh-CN')
        }
      })

      this.complaintTableData = sortData
    },

    handleViewMore () {
      const url = '/community/village/workOrder/orderTongji/orderTongji'
      window.open(url, '__blank')
      // this.openTableModal('complaint')
    },

    changeCharTitleTypeHandle (event) {
      this.currentCharTitleType = event.checkedType
      this.getUtilitiesData()
    },

    getInitInfo () {
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

    getMyOrgList () {
      this.setPanelLoading('orgChart', true)
      this.request(statisticalApi.getMyOrgList, {})
        .then((res) => {
          this.myOrgData = res.myOrgData || {}
          setTimeout(() => {
            this.$refs.orgChartRef &&
            this.$refs.orgChartRef.renderChart &&
            this.$refs.orgChartRef.renderChart()
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

    getProjectBaseData () {
      this.setPanelLoading('baseChart', true)
      this.request(statisticalApi.getProjectBaseData, {})
        .then((res) => {
          this.baseChartData = res.chartList || []
        })
        .catch((err) => {
          console.error('获取项目基础数据失败：', err)
          this.baseChartData = []
        })
        .finally(() => {
          this.setPanelLoading('baseChart', false)
        })
    },

    getProjectInspectionData (params = { start_date: '', end_date: '' }) {
      this.setPanelLoading('inspection', true)
      this.request(statisticalApi.getProjectInspectionData, params)
        .then((res) => {
          this.inspectionChartData = res.chart_list || []
          this.inspectionCurrentDateRange = res.dateRange || {}
          setTimeout(() => {
            this.$refs.inspectionChartRef &&
            this.$refs.inspectionChartRef.renderChart &&
            this.$refs.inspectionChartRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取项目巡检数据失败：', err)
          this.inspectionChartData = []
          this.inspectionCurrentDateRange = {}
        })
        .finally(() => {
          this.setPanelLoading('inspection', false)
        })
    },

    getCustomChartData () {
      this.setPanelLoading('customChart', true)
      this.request(statisticalApi.getCustomChartData, {})
        .then((res) => {
          this.customChartData = res.data || {}
          setTimeout(() => {
            this.$refs.customChartRef &&
            this.$refs.customChartRef.renderChart &&
            this.$refs.customChartRef.renderChart()
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

    getWorkOrderResponseData () {
      this.setPanelLoading('workOrderResponse', true)
      this.request(statisticalApi.getWorkOrderResponseData, {})
        .then((res) => {
          this.workOrderData = res.data || {}
          setTimeout(() => {
            this.$refs.workOrderResponseRef &&
            this.$refs.workOrderResponseRef.renderChart &&
            this.$refs.workOrderResponseRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取工单响应时间失败：', err)
          this.workOrderData = {}
        })
        .finally(() => {
          this.setPanelLoading('workOrderResponse', false)
        })
    },

    getComplaintTableData () {
      this.setPanelLoading('complaintTable', true)
      this.request(statisticalApi.getComplaintTableData, {})
        .then((res) => {
          this.complaintTableData = res.data || []
          this.originTableData = [...this.complaintTableData]
          this.complaintRateData = {
            complain_growth_rate: res.complain_growth_rate,
            current_month_completed_rate: res.current_month_completed_rate
          }
        })
        .catch((err) => {
          console.error('获取投诉建议情况失败：', err)
          this.complaintTableData = []
          this.originTableData = []
        })
        .finally(() => {
          this.setPanelLoading('complaintTable', false)
        })
    },

    getUtilitiesData () {
      this.setPanelLoading('utilities', true)
      this.request(statisticalApi.getUtilitiesData, {
        type: this.currentCharTitleType
      })
        .then((res) => {
          this.categoryList = res.categoryList || []
          this.monthList = res.monthList || []
          this.heatData = res.heatData || []
          this.utilitiesChartData = res.utilitiesChartData || []

          setTimeout(() => {
            this.$refs.chartUtilitiesRef &&
            this.$refs.chartUtilitiesRef.renderChart &&
            this.$refs.chartUtilitiesRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取项目能耗数据失败：', err)
          this.categoryList = []
          this.monthList = []
          this.heatData = []
          this.utilitiesChartData = []
        })
        .finally(() => {
          this.setPanelLoading('utilities', false)
        })
    },

    getExpendData (params = { start_date: '', end_date: '' }) {
      this.setPanelLoading('expend', true)
      this.request(statisticalApi.getExpendData, params)
        .then((res) => {
          this.expendData = res.data || []
          this.expendCurrentDateRange = res.dateRange || {}
          this.centerText.text = [
            { name: '总预算', value: (res.count && res.count.total_budget) || 0 },
            { name: '总支出', value: (res.count && res.count.total_expend) || 0 }
          ]

          setTimeout(() => {
            this.$refs.expendRef &&
            this.$refs.expendRef.renderChart &&
            this.$refs.expendRef.renderChart()
          }, 100)
        })
        .catch((err) => {
          console.error('获取项目支出情况失败：', err)
          this.expendData = []
          this.expendCurrentDateRange = {}
          this.centerText.text = [
            { name: '总预算', value: 0 },
            { name: '总支出', value: 0 }
          ]
        })
        .finally(() => {
          this.setPanelLoading('expend', false)
        })
    },

    getChargeStatus (params = { start_date: '', end_date: '' }) {
      this.setPanelLoading('cycleTable', true)
      this.request(statisticalApi.getChargeStatusData, params)
        .then((res) => {
          this.tableConfig = res || {}
          this.cycleCurrentDateRange = res.dateRange || {}
        })
        .catch((err) => {
          console.error('获取费用缴纳情况失败：', err)
          this.tableConfig = {}
          this.cycleCurrentDateRange = {}
        })
        .finally(() => {
          this.setPanelLoading('cycleTable', false)
        })
    },

    openHeatmapModal (scene) {
      this.modalType = 'heatmap'
      this.modalVisible = true

      if (scene === 'utilities') {
        this.modalTitle = '水电费数据热力图'
        this.currentHeatmapProps = {
          heatData: this.heatData,
          'x-axis-data': this.monthList,
          'y-axis-data': this.categoryList,
          unit: '元',
          scale: 0.8,
          'max-size': 99
        }
      }
    },

    openTableModal (type) {
      this.modalType = 'table'
      this.modalVisible = true
      if (type === 'complaint') {
        this.modalTitle = '投诉数据详情'
        this.currentTableProps = {
          columns: this.complaintTableColumns,
          data: this.complaintTableData,
          'current-sort': this.currentSort,
          scrollSpeed: 20
        }
      }
    },

    closeModal () {
      this.modalVisible = false
      this.modalType = ''
      this.currentHeatmapProps = {}
      this.currentTableProps = {}
    },

    handleConfirm () {
      console.log('弹窗确认')
      this.closeModal()
    },

    handleTableEvent ({ eventName, eventData }) {
      switch (eventName) {
        case 'sort-change':
          console.log('表格排序变化：', eventData)
          break
        case 'viewMore':
          console.log('表格查看更多：', eventData)
          break
      }
    },

    handleCycleDateRangeChange (params) {
      this.getChargeStatus(params)
    },

    handleExpendDateRangeChange (params) {
      this.getExpendData(params)
    },

    handleInspectionDateRangeChange (params) {
      this.getProjectInspectionData(params)
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

.header-wrap {
  position: relative;
}

.panel-content-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>
