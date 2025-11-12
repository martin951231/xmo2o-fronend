<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

    <a-tabs default-active-key="0" @change="changeTabs">
      <a-tab-pane key="0" tab="商城首页游览量统计">
      </a-tab-pane>
      <a-tab-pane key="1" tab="商城商品游览量统计">
      </a-tab-pane>
    </a-tabs>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="4" >
        <div class="percentage_style">
          <p class="percentage_style_title">
            商城累计点击率
          </p>
          <div class="percentage_style_content">
            <p class="percentage_style_num">{{ mallBrowseDetail.total }}</p>
            <div class="percentage_style_rate" >
              <p class="rate_title">周同比</p>
              <div class="rate_icon" v-if="iconShowWeek>0"><a-icon type="caret-up" :style="{ color:'#52c41a', fontSize: '20px' }" /></div>
              <div class="rate_icon" v-else><a-icon type="caret-down" :style="{ color:'#f5222d', fontSize: '20px' }" /></div>
              <p class="rate_num">{{ mallBrowseDetail.week_year_last }}</p>
            </div>
          </div>
        </div>
        <div class="percentage_style">
          <p class="percentage_style_title">
            本周游览量
          </p>
          <div class="percentage_style_content">
            <p class="percentage_style_num">{{ mallBrowseDetail.week }}</p>
            <div class="percentage_style_rate" >
              <p class="rate_title">周环比</p>
              <div class="rate_icon" v-if="iconShowYear>0"><a-icon type="caret-up" :style="{ color:'#52c41a', fontSize: '20px' }" /></div>
              <div class="rate_icon" v-else><a-icon type="caret-down" :style="{ color:'#f5222d', fontSize: '20px' }" /></div>
              <p class="rate_num">{{ mallBrowseDetail.week_last }}</p>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :sm="24" :md="12" :xl="20" >
        <div style="display: flex; justify-content:space-between; align-items: center;">
          <div style="font-size: 14px; font-weight: 700;">近一新版商城点击率</div>
          <div>
            <a-row>
              <a-col :span="3">
                <p class="not_choice" :class="time_type==0?'in_choice':''" @click="onChoiceDate(0)">今日</p>
              </a-col>
              <a-col :span="3">
                <p class="not_choice" :class="time_type==1?'in_choice':''" @click="onChoiceDate(1)">本周</p>
              </a-col>
              <a-col :span="3">
                <p class="not_choice" :class="time_type==2?'in_choice':''" @click="onChoiceDate(2)">本月</p>
              </a-col>
              <a-col :span="3">
                <p class="not_choice" :class="time_type==3?'in_choice':''" @click="onChoiceDate(3)">全年</p>
              </a-col>
              <a-col :span="8">
                <a-range-picker @change="onChangePicekr" @click="onChoiceDate(4)" />
              </a-col>
              <a-col :span="3" :offset="1">
                <a-dropdown>
                  <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item key="0">
                      按日导出
                    </a-menu-item>
                    <a-menu-item key="1">
                      按月导出
                    </a-menu-item>
                    <a-menu-item key="2">
                      按年导出
                    </a-menu-item>
                  </a-menu>
                  <a-button type="primary"> 导出 </a-button>
                </a-dropdown>
              </a-col>
            </a-row>
          </div>
        </div>
        <div>
          <bar v-if="chartsMoney.length" :data="chartsMoney" title="订单量排行" style="max-width: 100%" />
        </div>

      </a-col>
    </a-row>

    <!-- 搜索条件 -->
    <a-row type="flex" justify="space-between">
      <a-col>
      </a-col>
      <a-col>
        <a-button type="primary" @click="onGoodsExport"> 导出 </a-button>
      </a-col>
    </a-row>
    <!--  -->
    <section class="mt-20">
      <a-row type="flex" justify="space-between">
        <!-- 分类 -->
        <a-col :span="3">
          <a-menu
            mode="inline"
            :open-keys="defaultOpenSort"
            :selected-keys="defaultSort"
            @select="onSortSelect"
            @openChange="onOpenChange"
            style="height: 100%"
            class="scroll_content"
          >
            <!-- 一级菜单（但是有多级菜单） -->
            <template v-for="menu of sortList">
              <a-sub-menu v-if="menu.children && menu.children.length" :key="menu.cat_id">
                <span slot="title">
                  <span>{{ menu.cat_name }}</span>
                </span>
                <template v-if="menu.children && menu.children.length">
                  <template v-for="sMenu of menu.children">
                    <!-- 三级菜单-->
                    <template v-if="sMenu.children && sMenu.children.length">
                      <a-sub-menu :key="sMenu.cat_id" :title="sMenu.cat_name">
                        <a-menu-item v-for="tMenu of sMenu.children" :key="tMenu.cat_id">{{
                          tMenu.cat_name
                        }}
                        </a-menu-item>
                      </a-sub-menu>
                    </template>
                    <!-- 二级菜单 -->
                    <template v-else>
                      <a-menu-item :key="sMenu.cat_id">{{ sMenu.cat_name }}</a-menu-item>
                    </template>
                  </template>
                </template>
              </a-sub-menu>
              <!-- 只有一级菜单 -->
              <a-menu-item v-else :key="menu.cat_id">{{ menu.cat_name }}</a-menu-item>
            </template>
          </a-menu>
        </a-col>
        <!-- 数据表 -->
        <a-col :span="21">
          <template v-if="!findShow">
            <a-table
              :columns="columnsGoods"
              :data-source="goodsList"
              :pagination="false"
              :row-selection="{ selectedRowKeys: goodsSelectedRowKeys, onChange: ongoodsSelectChange }"
              rowKey="goods_id"
              @change="handleTableChange"
            >
              <!-- 商品名称 -->
              <template slot="goods_name" slot-scope="text, record">
                <div class="flex align-center">
                  <img class="size-45" :src="record.image"/>
                  <div class="flex flex-direction justify-between">
                    <span class="flex-1 ml-10">{{ text }} </span>
                    <div class="ml-10" v-if="joinActivityOpt(record.join_activity)">
                      <a-tag color="red">
                        {{ joinActivityOpt(record.join_activity) }}
                      </a-tag>
                    </div>
                  </div>
                </div>
              </template>
              <!-- 售价 -->
              <template slot="price" slot-scope="text, record">
                <span v-if="record.goods_type == 'spu'">￥{{ record.price }}</span>
                <span v-else>￥{{ record.min_price }} - ￥{{ record.max_price }}</span>
              </template>
              <!-- 库存 -->
              <template slot="stock_num" slot-scope="text">
                <span>{{ Number(text) < 0 ? '无限量' : text }}</span>
              </template>
              <template slot="browse_num_time" slot-scope="text, record">
                <span>{{ text }}</span>
              </template>

            </a-table>
            <a-row class="mt-20" type="flex" justify="space-between" align="middle">
              <a-col :span="10" class="ml-20">
              </a-col>
              <a-col :span="13" style="text-align: right;">
                <a-pagination
                  :current="searchForm.page"
                  :pageSize="searchForm.pageSize"
                  :total="total"
                  show-size-changer
                  show-quick-jumper
                  :show-total="total => `共 ${total} 条记录`"
                  @change="onPageChange"
                  @showSizeChange="onPageSizeChange"/>
              </a-col>
            </a-row>
          </template>

        </a-col>
      </a-row>
    </section>
    <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm"/>
  </div>
</template>
<script>
    import mallPlatformApi from '@/api/mall/platform/index'
    import ExportAdd from '@/views/common/export/ExportAdd.vue'
    import { Bar } from '@/components'

    const scorePercentVaild = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请设置消费积分'))
        } else if (value) {
            let reg = ''
            if (value.indexOf('%') != -1) {
                reg = /^([1-9][0-9]?|100)%$/
            } else {
                reg = /^[+]{0,1}(\d+)$/
            }
            if (!reg.test(value)) {
                callback(new Error('请设置正确的消费积分数据格式'))
            } else {
                callback()
            }
        } else {
            callback()
        }
    }
    export default {
        name: 'MallGoods',
        components: { ExportAdd, Bar },
        data () {
            return {
                start_time: '', // 日期开始时间
                end_time: '', // 日期结束时间
                time_type: 0, // 日期的选择
                search_type: 0, // tabs的选择
                // 图表的数据
                mallBrowseDetail: '', // 统计数据
                chartsMoney: [],
                browse: 1, // 	根据浏览量排序（1-倒序，2-正序）
                browse_today: 1, 	// 根据今日浏览量排序（1-倒序，2-正序）
                searchForm: {
                    merList: [],
                    storeList: [],
                    keyword: '',
                    page: 1,
                    pageSize: 10,
                    cat_id: '',
                    keyword1: ''
                },
                tab_list: [], // 查询到的数据
                findShow: false,
                exportUrl: mallPlatformApi.exportGoods,
                merchantType: 1, // 1 全部商家 2部分商家
                storeType: 1, // 1 全部店铺 2部分店铺
                merchantOptions: [
                    {
                        label: '全部商家',
                        value: 1
                    },
                    {
                        label: '部分商家',
                        value: 2
                    }
                ],
                storeOptions: [
                    {
                        label: '全部店铺',
                        value: 1
                    },
                    {
                        label: '部分店铺',
                        value: 2
                    }
                ],
                modalType: '', // 弹框类型 1商家 2店铺 3设置积分 4设置佣金 5上架 6下架 7商品编辑提示
                modalVisible: false,
                modalSearchForm: {
                    search: '',
                    type: '',
                    page: 0, // 0 返回所有，不分页
                    pageSize: 10
                },
                columns: [
                    {
                        dataIndex: 'name',
                        slots: { title: 'name' },
                        align: 'center'
                    }
                ],
                modalTableData: [],
                modalSelectedRowKeys: [],
                goodsList: [],
                sortList: [],
                defaultOpenSort: [],
                defaultSort: [],
                catId: '', // 分类id
                columnsGoods: [
                    {
                        title: '商品名称',
                        dataIndex: 'goods_name',
                        scopedSlots: { customRender: 'goods_name' },
                        width: '140px'
                    },
                     {
                        title: '商家名称',
                        dataIndex: 'mer_name',
                        width: '100px'
                    },
                    {
                        title: '店铺名称',
                        dataIndex: 'store_name'
                    },
                    {
                        title: '售价',
                        dataIndex: 'price',
                        scopedSlots: { customRender: 'price' },
                        width: '80px'
                    },
                    {
                        title: '虚拟销量',
                        dataIndex: 'virtual_sales',
                        align: 'center'
                    },
                    {
                        title: '实际销量',
                        dataIndex: 'sale_num',
                        align: 'center'
                    },
                    {
                        title: '当前库存',
                        dataIndex: 'stock_num',
                        scopedSlots: { customRender: 'stock_num' },
                        align: 'center'
                    },
                    {
                        title: '浏览量',
                        dataIndex: 'browse_num_time',
                        width: '100px',
                        align: 'center',
                        sorter: true,
                        scopedSlots: { customRender: 'browse_num_time' }
                    },
                    {
                        title: '今日流量',
                        dataIndex: 'browse_num_today',
                        width: '130px',
                        align: 'center',
                        sorter: (a, b) => a.browse_num_today - b.browse_num_today
                    }
                ],
                activityOptions: [
                    {
                        label: '砍价',
                        value: 'bargain'
                    },
                    {
                        label: '拼团',
                        value: 'group'
                    },
                    {
                        label: '限时',
                        value: 'limited'
                    },
                    {
                        label: '预售',
                        value: 'prepare'
                    },
                    {
                        label: '周期购',
                        value: 'periodic'
                    },
                    {
                        label: 'N元N件',
                        value: 'reached'
                    },
                    {
                        label: '满包邮',
                        value: 'shipping'
                    },
                    {
                        label: '满赠',
                        value: 'give'
                    },
                    {
                        label: '满减',
                        value: 'minus'
                    },
                    {
                        label: '满折',
                        value: 'discount'
                    }
                ],
                goodsSelectedRowKeys: [],
                total: null,
                currentGoods: '',
                rules: {
                    score_percent: [{ require: true, validator: scorePercentVaild, trigger: ['blur', 'change'] }]
                },
                // 设置积分
                setIntegralFormData: {
                    // 设置积分
                    goods_id: '',
                    min_price: '',
                    score_percent: '',
                    score_max: ''
                },
                // 设置虚拟销量
                setVirtualFormData: {
                    // 设置积分
                    goods_id: '',
                    sales: 0,
                    virtual_set: 0,
                    disabled_set: true
                },
                isIntegral: 1, // 1跳过 2设置
                integralOptions: [
                    {
                        label: '跳过',
                        value: 1
                    },
                    {
                        label: '设置',
                        value: 2
                    }
                ],
                // 设置佣金
                commissionOptions: [
                    {
                        prop: 'spread_rate',
                        help: '填写 0-100正整数，0代表不设置，微信中分享有效，佣金计算是以商品实付款为基准。',
                        label: '第一级用户分享佣金比例'
                    },
                    {
                        prop: 'sub_spread_rate',
                        help: '填写 0-100正整数，0代表不设置，微信中分享有效，佣金计算是以商品实付款为基准。',
                        label: '第二级用户分享佣金比例'
                    },
                    {
                        prop: 'third_spread_rate',
                        help: '填写 0-100正整数，0代表不设置，微信中分享有效，佣金计算是以商品实付款为基准。',
                        label: '第三级用户分享佣金比例'
                    }
                ],
                commissionFormData: {
                    goods_id: '',
                    spread_rate: 0,
                    sub_spread_rate: 0,
                    third_spread_rate: 0
                },
                merInfo: ''
            }
        },
        computed: {
            iconShowWeek () {
                var num = 0
                if (this.mallBrowseDetail.week_last) {
                    var basic = this.mallBrowseDetail.week_last.substring(0, this.mallBrowseDetail.week_last.length - 1)
                    num = Number(basic)
                } else {
                    num = 0
                }
                return num
            },
            iconShowYear () {
                var num = 0
                if (this.mallBrowseDetail.week_year_last) {
                    var basic = this.mallBrowseDetail.week_year_last.substring(0, this.mallBrowseDetail.week_year_last.length - 1)
                    num = Number(basic)
                } else {
                    num = 0
                }
                return num
            }
        },
        created () {
            this.goodsCategoryList()
            this.getMallBrowseDetail()
        },
        methods: {
            changeTabs (key) {
                console.log(key)
                this.search_type = key
                this.getMallBrowseDetail()
            },

            // 点击时间
            onChoiceDate (value) {
                this.time_type = value
                if (value != 4) {
                    this.getMallBrowseDetail()
                }
            },

            // 选择日期
            onChangePicekr (date, dateString) {
                this.time_type = 4
                this.start_time = dateString[0]
                this.end_time = dateString[1]
                this.getMallBrowseDetail()
            },

            // table标签方法
            handleTableChange (pagination, filters, sorter) {
                if (sorter.order == 'ascend') {
                    if (sorter.columnKey == 'browse_num_time') {
                        this.browse = 1
                    } else if (sorter.columnKey == 'browse_num_today') {
                        this.browse_today = 1
                    }
                } else if (sorter.order == 'descend') {
                    if (sorter.columnKey == 'browse_num_time') {
                        this.browse = 2
                    } else if (sorter.columnKey == 'browse_num_today') {
                        this.browse_today = 2
                    }
                } else {
                    if (sorter.columnKey == 'browse_num_time') {
                        this.browse = 0
                    } else if (sorter.columnKey == 'browse_num_today') {
                        this.browse_today = 0
                    }
                }
                this.getGoodsList()
            },

            // 部分商家 || 部分店铺
            searchRadioOpt (value, modalType) {
                this.modalType = modalType
                if (this.modalType == 1) {
                    this.merchantType = value
                } else if (this.modalType == 2) {
                    this.storeType = value
                }
                if (value == 2) {
                    this.modalVisible = true

                    if (this.modalType == 1 && this.searchForm.merList && this.searchForm.merList.length) {
                        this.modalSelectedRowKeys = this.searchForm.merList
                    }

                    if (this.modalType == 2 && this.searchForm.storeList && this.searchForm.storeList.length) {
                        this.modalSelectedRowKeys = this.searchForm.storeList
                    }
                }
                if (value == 1) {
                    this.modalSelectedRowKeys = []
                    if (modalType == 1) {
                        this.$set(this.searchForm, 'merList', [])
                    } else {
                        this.$set(this.searchForm, 'storeList', [])
                    }
                }
                this.getMerOrStoreList()
            },
            // 获取店铺或商家列表
            getMerOrStoreList () {
                this.modalTableData = []
                this.$set(this.modalSearchForm, 'type', this.modalType)
                this.request(mallPlatformApi.getMerOrStoreList, this.modalSearchForm).then((data) => {
                    this.modalTableData = data.list || []
                })
            },
            // 查询
            getGoodsList () {
                this.findShow = false
                this.searchForm.keyword1 = ''
                this.searchForm.browse = this.browse
                this.searchForm.browse_today = this.browse_today
                this.goodsList = this.$options.data().goodsList
                this.$set(this.searchForm, 'cat_id', this.catId)
                this.request(mallPlatformApi.getGoodsList, this.searchForm).then((data) => {
                    this.goodsList = data.list || []
                    this.total = data.count
                    this.goodsSelectedRowKeys = []
                })
            },
            getGoodsListByName () {
                this.findShow = true
                this.defaultOpenSort = []
                this.defaultSort = []
                this.total = 0
                this.$set(this.searchForm, 'cat_id', this.catId)
                this.request(mallPlatformApi.getGoodsListByName, this.searchForm).then((data) => {
                    this.tab_list = data.tab_list || []
                    this.total = data.count
                    this.goodsSelectedRowKeys = []
                })
            },
            // 商品参与的活动
            joinActivityOpt (val) {
                let text = ''
                if (val) {
                    text = this.activityOptions.filter((item) => item.value == val)[0] || ''
                }
                return text ? text['label'] : ''
            },

            // 获取商城首页或者商品商品的统计数据
            getMallBrowseDetail () {
                const params = {
                    search_type: this.search_type,
                    time_type: this.time_type,
                    start_time: this.start_time,
                    end_time: this.end_time
                }
                this.request(mallPlatformApi.getMallBrowse, params)
                    .then((res) => {
                        this.mallBrowseDetail = res
                        let list = res.list || ''
                        let chartsMoney = []
                        if(list && Object.keys(list).length) {
                            for(let k in list) {
                                chartsMoney.push({
                                    x: k,
                                    y: list[k]
                                })
                            }
                        }
                        this.chartsMoney = chartsMoney
                    })
            },

            // 获取分类列表
            goodsCategoryList () {
                this.searchForm.keyword1 = ''
                this.defaultSort = []
                this.defaultOpenSort = []
                this.request(mallPlatformApi.goodsCategoryList, this.searchForm)
                    .then((res) => {
                        const data = res.list || []
                        if (data && data.length) {
                            // 设置默认选中
                            const item = data[0]
                            let cat_id = ''
                            if (item.children && item.children.length) {
                                this.defaultOpenSort.push(item.cat_id)
                                const item2 = item.children[0]
                                if (item2.children && item2.children.length) {
                                    this.defaultOpenSort.push(item2.cat_id)
                                    const item3 = item2.children[0]
                                    cat_id = item3.cat_id
                                    this.defaultSort.push(item3.cat_id)
                                } else {
                                    cat_id = item2.cat_id
                                    this.defaultSort.push(item2.cat_id)
                                }
                            } else {
                                cat_id = item.cat_id
                                this.defaultSort.push(item.cat_id)
                            }
                            this.sortList = data
                            this.catId = cat_id
                            this.getGoodsList()
                        }
                    })
                    .catch((err) => {
                        this.getGoodsList()
                    })
            },
            onSortSelect (e) {
                const { item, key, selectedKeys } = e
                this.catId = key
                this.defaultSort = [key]
                this.goodsSelectedRowKeys = []
                this.$set(this.searchForm, 'page', 1)
                this.getGoodsList()
            },
            onOpenChange (openKeys) {
                const latestOpenKey = openKeys.find((key) => this.defaultOpenSort.indexOf(key) === -1)
                if (this.defaultOpenSort.indexOf(latestOpenKey) === -1) {
                    this.defaultOpenSort = openKeys
                } else {
                    this.defaultOpenSort = latestOpenKey ? [latestOpenKey] : []
                }
            },

            // 页码变化
            onPageChange (page, pageSize) {
                this.$set(this.searchForm, 'page', page)
                this.getGoodsList()
            },
            // pageSize变化
            onPageSizeChange (page, pageSize) {
                this.$set(this.searchForm, 'pageSize', pageSize)
                this.getGoodsList()
            },
            // 商品列表多选
            ongoodsSelectChange (selectedRowKeys) {
                this.goodsSelectedRowKeys = selectedRowKeys
            },

            // 商品和商城首页浏览量汇总导出
            handleMenuClick (value) {
                const params = {
                    search_type: this.search_type,
                    time_type: this.time_type,
                    start_time: this.start_time,
                    end_time: this.end_time,
                    export_type: value.key
                }
                this.request(mallPlatformApi.exportBrowseTotalExport, params).then((res) => {
                    var downloadPath = res.file_url
                    var downloadLink = document.createElement('a')
                    downloadLink.style.display = 'none' // 使其隐藏
                    downloadLink.href = downloadPath
                    downloadLink.download = ''
                    downloadLink.click()
                    downloadLink.remove()
                })
            },

            onGoodsExport () {
                const params = {
                    browse: this.browse,
                    browse_today: this.browse_today,
                    start_time: this.start_time,
                    end_time: this.end_time
                }
                this.request(mallPlatformApi.MallBrowseExport, params).then((res) => {
                    var downloadPath = res.file_url
                    var downloadLink = document.createElement('a')
                    downloadLink.style.display = 'none' // 使其隐藏
                    downloadLink.href = downloadPath
                    downloadLink.download = ''
                    downloadLink.click()
                    downloadLink.remove()
                })
            }
        }
    }
</script>
<style scoped>
    .keyword {
        width: 300px;
    }

    .link-btn.ant-btn {
        padding: 0 4px;
    }

    .flex-direction {
        flex-direction: column;
    }

    .switch-btn.ant-switch {
        min-width: 56px;
    }

    .sort-input {
        max-width: 70px;
    }

    .commission-input {
        width: 320px;
    }

    .percentage_style{

    }
    .percentage_style_title{
        color: rgb(192, 191, 191);
    }
    .percentage_style_content{
        display: flex;
        align-items:center;
        justify-content: space-between;
    }
    .percentage_style_num{
        font-weight: 700;
        font-size: 20px;
    }
    .percentage_style_rate{
        display: flex;
        align-items:center;
    }
    .rate_title{
        font-size: 14px;
        color: rgb(164, 162, 162);
    }
    .rate_icon{
        margin:0 6px 12px 50px;
    }
    .rate_num{
        font-size: 14px;
    }

    .not_choice{
        text-align: center;
        border-radius: 3px;
        padding: 4px 0;
    }
    .in_choice{
        background-color:#40a9ff;
        color: #ffffff;
    }
</style>
