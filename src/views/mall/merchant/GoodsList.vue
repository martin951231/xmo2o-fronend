/**
* 商品列表
* @author zhengyali
* @date 2020-10-27
*/
<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- 内容区 -->
        <section class="mt-20">
            <a-tabs v-model="currentTab" @change="onTabChange" :animated="false">
                <div slot="tabBarExtraContent" class="w-450 search-order">
                    <a-input-search
                    style="width: 250px"
                        placeholder="请输入商品名称"
                        allow-clear
                        enter-button
                        @search="handleSearchSubmit"
                    />
                    <div class="status">
              <p>状态:</p>
              <a-select style="width: 120px" :default-value="'-1'" @change="handleChangeFlag">
                <a-select-option :value="item.value" v-for="item in flagList" :key="item.id">{{item.label}}</a-select-option>
              </a-select>
            </div>
                    <!--          &lt;!&ndash; 搜索栏 &ndash;&gt;-->
                    <!--          <a-form-model layout="inline" :model="searchForm" @submit="handleSearchSubmit" @submit.native.prevent>-->
                    <!--            <a-form-model-item label="商品名称">-->
                    <!--              <a-input v-model="searchForm.keywords" placeholder="请输入商品名称" />-->
                    <!--            </a-form-model-item>-->
                    <!--            <a-form-model-item>-->
                    <!--              <a-button type="primary" html-type="submit"> 查询</a-button>-->
                    <!--              <a-button class="ml-20" @click="resetForm"> 重置</a-button>-->
                    <!--            </a-form-model-item>-->
                    <!--          </a-form-model>-->
                    <!--          <a-input-search placeholder="请输入订单号、手机号、桌号、昵称" allow-clear enter-button @search="onSearch" />-->
                </div>
                <a-tab-pane :key="tab.key" :tab="tab.value" v-for="tab of tabList">
                    <div class="flex mt-10" key="has-data">
                        <div class="left">
                            <!-- @openChange="onOpenChange" :selectable="false"
                @select="onSelect"  :open-keys="[defaultSort]" :selectedKeys="[defaultSort]":bodyStyle="{maxHeight:'60vh',overflowY:'auto'}"-->
                            <a-menu
                                v-if="sortList.length > 0"
                                mode="inline"
                                :open-keys="defaultOpenSort"
                                :selected-keys="defaultSort"
                                @select="onSortSelect"
                                @openChange="onOpenChange"
                                style="max-height: 100vh;overflow-y: auto"
                                class="scroll_content"
                            >
                                <!-- 一级菜单（但是有多级菜单） -->
                                <template v-for="menu of sortList">
                                    <a-sub-menu v-if="menu.children && menu.children.length" :key="menu.id">
                                        <span slot="title">
                                            <span>{{ menu.name }}</span>
                                        </span>
                                        <template v-if="menu.children && menu.children.length">
                                            <template v-for="sMenu of menu.children">
                                                <!-- 三级菜单-->
                                                <template v-if="sMenu.children && sMenu.children.length">
                                                    <a-sub-menu :key="sMenu.id" :title="sMenu.name">
                                                        <a-menu-item v-for="tMenu of sMenu.children" :key="tMenu.id">{{
                                                            tMenu.name
                                                        }}</a-menu-item>
                                                    </a-sub-menu>
                                                </template>
                                                <!-- 二级菜单 -->
                                                <template v-else>
                                                    <a-menu-item :key="sMenu.id">{{ sMenu.name }}</a-menu-item>
                                                </template>
                                            </template>
                                        </template>
                                    </a-sub-menu>
                                    <!-- 只有一级菜单 -->
                                    <a-menu-item v-else :key="menu.id">{{ menu.name }}</a-menu-item>
                                </template>
                            </a-menu>
                            <div v-else class="no-data" key="no-data">暂无数据</div>
                        </div>
                        <!-- 操作栏 -->

                        <div class="right">
                            <a-button @click="editGoodsSort()" type="primary" class="mr-20" style="float: left">
                                分类管理</a-button
                            >
                            <a-button type="primary" class="mr-20" style="float: left" @click="openArea()" v-if="system_config.open_mall_order_area == 1">
                                修改展示区域</a-button
                            >
                            <div style="margin-bottom: 10px; float: right">
                                <a-button-group>
                                    <!-- <a-button @click="virtualSales()"> 设置虚拟销量</a-button> -->
                                    <a-button @click="batchSet()"> 批量设置</a-button>
                                    <a-button @click="changeGoodsStatus(true)"> 批量上架</a-button>
                                    <a-button @click="changeGoodsStatus(false)"> 批量下架</a-button>
                                    <a-button @click="removeGoods()"> 删除</a-button>
                                </a-button-group>

                                <a-button @click="editGoods()" type="primary" style="margin-left: 20px" class="mr-20">
                                    新建商品</a-button
                                >
                                <a-button type="primary" class="mr-20" @click="getExport"> 导出商品</a-button>
                                <a-button type="default" class="mr-20" @click="clickbathAddGoods">
                                    批量新建商品</a-button
                                >
                            </div>
                            <a-modal v-model="virtual_visible" title="设置虚拟销量" @ok="setVirtualSales" width="300px">
                              <a-input-number
                                :min="0"
                                style="width: 100px;"
                                v-model="virtual_sales"
                              />
                            </a-modal>
                            <div style="height: 50px">
                                <span style="margin-left: 8px"></span>
                            </div>
                            <a-table
                                :columns="columns"
                                :row-selection="rowSelection"
                                rowKey="goods_id"
                                :data-source="goodsList"
                                bordered
                                :pagination="pagination"
                                :scroll="{ x: 1800 }"
                            >
                                <template slot="name" slot-scope="text, record">
                                    <div class="flex align-center">
                                        <img class="size-45" :src="record.image" />
                                        <span class="flex-1 ml-10">
                                            <a-tag color="#f50" v-if="record.brand_name">
                                                {{ record.brand_name }}
                                            </a-tag>
                                            {{ text }} </span>
                                    </div>
                                </template>
                                <template slot="price" slot-scope="text, record, index">
                                    <div v-if="record.goods_type == 'spu'">
                                        <template v-if="record.price_editable">
                                            <a-input-number
                                                :formatter="
                                                    (value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                "
                                                :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
                                                :default-value="text"
                                                :min="0"
                                                @change="handlePriceChange"
                                            />
                                            <span
                                                class="ml-10 cr-primary pointer inline-block"
                                                @click="changeGoodsPrice(index, 'confirm')"
                                                >确定</span
                                            >
                                            <span
                                                class="ml-10 cr-primary pointer inline-block"
                                                @click="changeGoodsPrice(index, 'cancel')"
                                                >取消</span
                                            >
                                        </template>
                                        <template v-else>
                                            <span>￥{{ text }}</span>
                                            <span
                                                class="ml-10 cr-primary pointer inline-block"
                                                @click="changeGoodsPrice(index, 'change')"
                                                >修改</span
                                            >
                                        </template>
                                    </div>
                                    <div v-else-if="record.goods_type == 'sku'">
                                        <span>￥{{ record.min_price }}</span> ~
                                        <span>￥{{ record.max_price }}</span>
                                        <span
                                            class="ml-10 cr-primary pointer inline-block"
                                            @click="changeGoodsPrice(index, 'model')"
                                            >修改</span
                                        >
                                    </div>
                                </template>
                                <template slot="stock_num" slot-scope="text, record">
                                    <template v-if="record.stock_num == -1">
                                        <span>无限量</span>
                                    </template>
                                    <template v-else>
                                        <span>{{ record.stock_num }} </span>
                                    </template>
                                </template>
                                <template slot="qrcode" slot-scope="text">
                                    <span class="pointer cr-primary" @click="checkQrcode(text)">二维码</span>
                                    <!-- <img :src="text" style="wdith: 80px; height: 80px" /> -->
                                </template>

                                <!-- 状态 -->
                                <template slot="audit_status" slot-scope="index, item">
                                    <span v-if="item.audit_status == 0" style="color: #faad14">{{ item.audit_status_text }}</span>
                                    <span v-else-if="item.audit_status == 1" style="color: #52c41a">{{ item.audit_status_text }}</span>
                                    <span v-else-if="item.audit_status == 2" style="color: #f5222d">{{ item.audit_status_text }}</span>
                                </template>
                                <template slot="audit_msg" slot-scope="audit_msg">
                                    <!-- 备注 -->
                                    <span>{{ audit_msg ? audit_msg : '无' }}</span>
                                </template>

                                <template slot="status" slot-scope="text, record">
                                    <a-switch
                                        checked-children="上架"
                                        un-checked-children="下架"
                                        :default-checked="text == 1 ? true : false"
                                        @change="setGoodsStatus(record.goods_id, $event)"
                                    />
                                </template>
                                <template slot="sort_store" slot-scope="text, record, index">
                                    <template>
                                        <a-input-number
                                            :default-value="text"
                                            :precision="0"
                                            :min="0"
                                            v-model="record.sort_store"
                                            @blur="saveSortChange(record)"
                                        />
                                    </template>
                                </template>
                                <template slot="action" slot-scope="text, record">
                                    <a @click="editGoods(text)">编辑</a><a-divider type="vertical" />
                                    <a @click="removeGoods(text)">删除</a><a-divider type="vertical" />
                                    <a-dropdown>
                                        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                                            {{ L('更多') }}  <a-icon type="down" />
                                        </a>
                                        <a-menu slot="overlay">
                                        <a-menu-item>
                                            <a @click="virtualSales(record)">虚拟销量</a>
                                        </a-menu-item>
                                        <a-menu-item v-if="system_config.open_mall_order_area == 1">
                                            <a @click="exportViewArea(record)">导出展示区域</a>
                                        </a-menu-item>
                                        </a-menu>
                                    </a-dropdown>
                                </template>
                            </a-table>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </section>
        <a-modal v-model="visible" :title="modelTitle" centered @ok="handleOk" class="w-400">
            <div style="max-height: 500px; overflow-y: scroll">
                <div class="flex align-center mb-20 fw-bold">
                    <div class="w-200">规格</div>
                    <div class="flex-1">价格</div>
                </div>
                <div class="flex align-center mt-10" v-for="(item, index) of skuInfo" :key="item.sku_id">
                    <div class="w-200">{{ item.sku_str || '--' }}</div>
                    <div class="flex-1">
                        <a-input-number
                            style="width: 95%"
                            :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
                            :default-value="item.price"
                            :min="0"
                            @change="(val) => changeSkuGoodsPrice(val, index)"
                        />
                    </div>
                </div>
            </div>
        </a-modal>
        <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="{ store_id: store_id }" />
        <a-modal v-model="qrcodeVisible" title="详情二维码" centered :footer="null">
            <img class="qrcode-img" :src="qrcodeImg" />
        </a-modal>
        <select-shop-goods
            :visible.sync="selectGoodsVisible"
            :storeId="store_id"
            source="mall_goods"
            :type="goodsSelectType"
            @onSubmit="onGoodsSelect"
        />
        <goods-area-set ref="goodsAreaSet"></goods-area-set>

        <!-- 批量操作 -->
        <a-modal v-model="batchOperateVisible" title="批量操作" centered @ok="batchHandleSubmit()" :bodyStyle="{height: '300px'}">
            <a-tabs v-model="tabIndex" tab-position="left">
                <a-tab-pane key="sort" tab="商品分类">
                    <a-form-item label="请选择分类" style="height: 280px;">
                        <a-cascader
                                v-model="batchSort"
                                style="width: 80%;"
                                :field-names="{ label: 'name', value: 'id', children: 'children' }"
                                :options="storeSortList"
                                placeholder="请选择商品分类"
                            />
                    </a-form-item>
                </a-tab-pane>
                <a-tab-pane key="brand" tab="所属品牌">
                    <a-form-item label="品牌"  help="请正确选择，若未找到品牌，请联系平台新增品牌或者不选择品牌。">
                        <a-select
                            style="width: 80%;"
                            show-search
                            v-model="batchBrandId"
                            placeholder="请选择品牌"
                            option-filter-prop="children"
                            :filter-option="filterBrand"
                            :options="brandList"
                        />
                        
                    </a-form-item>
                </a-tab-pane>
                <a-tab-pane key="virtaul_sales" tab="虚拟销量">
                    <a-form-item label="请设置虚拟销量">
                        <a-input-number :min="0" v-model="virtual_sales" />
                    </a-form-item>
                </a-tab-pane>
            </a-tabs>
        </a-modal>
    </div>
</template>
<script>
import DragBox from '@/components/DragBox/DragBox'
import mallMerchantApi from '@/api/mall/merchant'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
import SelectShopGoods from '@/components/SelectShopGoods/SelectShopGoods'
import GoodsAreaSet from './modules/GoodsAreaSet'

export default {
    name: 'MallGoodsList',
    components: { DragBox, ExportAdd, SelectShopGoods,GoodsAreaSet },
    data() {
        return {
            batchOperateVisible:false,  //批量操作弹窗
            tabIndex:'sort',  //sort批量修改分类、brand批量修改品牌、virtaul_sales批量修改虚拟销量
            batchSort:[],  //批量修改分类数据
            batchBrandId:'', //批量修改品牌id
            brandList:[], //品牌列表
            storeSortList: [], //商品分类数据

            store_id: '', // 店铺id
            sort_type: 1, // 0=展示全部分类 1=只展示显示商品的分类
            exportUrl: mallMerchantApi.exportGoods,
            searchForm: {
                keywords: '', // 商品名称
            },
            //   tab栏: 1=全部，2=售卖中，3=库存不足，4=已下架
            tabList: [
                {
                    key: '1',
                    title: '全部商品（12）',
                },
                {
                    key: '2',
                    title: '服饰',
                },
            ],
            currentTab: '',
            //   分类列表
            sortList: [],
            defaultOpenSort: [],
            defaultSort: [],
            sortId: '',
            // 商品列表
            goodsList: [],
            columns: [
                {
                    title: '商品名称',
                    dataIndex: 'name',
                    scopedSlots: { customRender: 'name' },
                    fixed: 'left',
                    width: 200,

                },{
                    title: '浏览量',
                    dataIndex: 'browse_num',
                },
                {
                    title: '售价',
                    dataIndex: 'price',
                    scopedSlots: { customRender: 'price' },
                    width: 180,
                },
                {
                    title: '当前库存',
                    dataIndex: 'stock_num',
                    scopedSlots: { customRender: 'stock_num' },
                },
                {
                    title: '今日销量',
                    dataIndex: 'today_sale_number',
                },
                {
                  title: '虚拟销量',
                  dataIndex: 'virtual_sales',
                },
                {
                    title: '实际销量',
                    dataIndex: 'all_sale_number',
                },
                {
                    title: '详情',
                    dataIndex: 'qrcode',
                    scopedSlots: { customRender: 'qrcode' },
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('审核状态'),
                    dataIndex: 'audit_status',
                    key: 'audit_status',
                    scopedSlots: {
                        customRender: 'audit_status'
                    }
                },
                {
                    title: this.L('备注'),
                    dataIndex: 'audit_msg',
                    key: 'audit_msg',
                    scopedSlots: {
                        customRender: 'audit_msg'
                    }
                },
                {
                    title: '排序',
                    dataIndex: 'sort_store',
                    scopedSlots: { customRender: 'sort_store' },
                },
                {
                    title: '提交时间',
                    dataIndex: 'update_time',
                },
                {
                    title: '操作',
                    dataIndex: 'goods_id',
                    fixed: 'right',
                    width: 175,
                    scopedSlots: { customRender: 'action' },
                },
            ],
            selectedRowKeys: [],
            selectedRows: [],
            selectedIds: [],
            sortValue: 0,
            virtual_sales: 0,
            // 弹框
            visible: false,
            virtual_visible: false,
            selectGoodsVisible: false,
            goodsSelectType: 'checkbox',
            modelTitle: '修改价格',
            // modelType: ''
            changedPrice: 0,
            skuInfo: [],
            goodsId: '',
            set_type: 0,
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: (page, pageSize) => this.onPageChange(page, pageSize),
                onShowSizeChange: (page, pageSize) => this.onPageSizeChange(page, pageSize),
                showTotal: (total) => `共 ${total} 个商品`,
            },
            noData: false,
            qrcodeVisible: false,
            qrcodeImg: '',
            flagList: [
                {
                    id: 0,
                    value: '-1',
                    label: '全部状态'
                },
                {
                    id: 1,
                    value: '0',
                    label: '待审核'
                },
                {
                    id: 2,
                    value: '1',
                    label: '审核成功'
                },
                {
                    id: 3,
                    value: '2',
                    label: '审核失败'
                },
            ],
            system_config: {}
        }
    },
    computed: {
        rowSelection() {
            return {
                fixed:true,
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys
                },
                getCheckboxProps: (record) => ({
                    // props: {
                    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    //   name: record.name,
                    // },
                }),
            }
        },
    },
    watch: {
        '$route.query.store_id'(val) {
            if (val) {
                this.store_id = val
                this.getTabList()
            }
        },
    },
    created() {
        this.system_config = this.$getCache('system_config')
        this.store_id = this.$route.query.store_id
        // 监听localStorage的变化
        window.addEventListener('storage', this.handleStorageChange);
        this.getTabList()
    },
    activated() {
        //   添加活动后更新订单列表
        let goodsEdit = sessionStorage.getItem('goodsEdit') || ''
        if (goodsEdit && goodsEdit == 1) {
            this.store_id = this.$route.query.store_id
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getDataList({ store_id: this.store_id, sort_id: this.sortId })
            sessionStorage.removeItem('goodsEdit')
        }
    },
    beforeDestroy() {
        // 组件销毁时移除事件监听
        window.removeEventListener('storage', this.handleStorageChange);
    },
    methods: {
        // 状态选择框事件
    handleChangeFlag (e) {
      this.pagination.current = 1
      if (e == -1) {
        this.getDataList()
      }else{
          this.getDataList(e)
      }
      
    },
        handleSearchSubmit(value) {
            this.searchForm.keywords = value
            this.getTabList()
        },
        openArea() {
            if (this.selectedRowKeys.length > 0) {
                this.$refs.goodsAreaSet.show(this.selectedRowKeys, this.store_id, this.set_type, this.staffTicket)
            } else {
                this.$message.warn('请选择商品再选择区域展示')
            }
        },
        // 获取tab
        getTabList(isShelf = false) {
            this.request(mallMerchantApi.getGoodsStatus, {
                store_id: this.store_id,
                keyword: this.searchForm.keywords,
            }).then((data) => {
                if (data) {
                    this.tabList = data
                    if (!this.currentTab && data.length) {
                        this.currentTab = data[0].key
                    }
                    if (this.searchForm.keywords || isShelf) {
                        this.getDataList()
                    } else {
                        this.getSortList()
                    }
                }
            })
        },
        // 获取分类列表
        getSortList() {
            this.defaultSort = []
            this.defaultOpenSort = []
            if (!this.searchForm.keywords && this.currentTab == 1) {
                this.sort_type = 0
            } else {
                this.sort_type = 1
            }
            this.request(mallMerchantApi.getGoodsSort, { store_id: this.store_id, type: this.sort_type }).then(
                (res) => {
                    let data = res.list
                    if (data && data.length) {
                        this.noData = false
                        // 设置默认选中
                        const item = data[0]
                        if (item.children && item.children.length) {
                            this.defaultOpenSort.push(item.id)
                            const item2 = item.children[0]
                            if (item2.children && item2.children.length) {
                                this.defaultOpenSort.push(item2.id)
                                const item3 = item2.children[0]
                                this.sortId = item3.id
                                this.defaultSort.push(item3.id)
                            } else {
                                this.sortId = item2.id
                                this.defaultSort.push(item2.id)
                            }
                        } else {
                            this.sortId = item.id
                            this.defaultSort.push(item.id)
                        }
                        this.sortList = data
                        this.getDataList()
                    } else {
                        this.selectedRowKeys = []
                        this.goodsList = []
                        this.noData = true
                    }
                }
            )
        },
        onSortSelect(e) {
            const { item, key, selectedKeys } = e
            this.sortId = key
            this.defaultSort = [key]
            this.$set(this, 'searchForm', { keywords: '' })
            this.$set(this.pagination, 'current', 1)
            this.getDataList()
        },
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find((key) => this.defaultOpenSort.indexOf(key) === -1)
            if (this.defaultOpenSort.indexOf(latestOpenKey) === -1) {
                this.defaultOpenSort = openKeys
            } else {
                this.defaultOpenSort = latestOpenKey ? [latestOpenKey] : []
            }
        },
        // 获取商品列表
        getDataList(e) {
            this.selectedRowKeys = []
            this.goodsList = []
            let params = {
                store_id: this.store_id,
                search_type: this.currentTab,
            }
            if (this.sortId) {
                params.sort_id = this.sortId
            }
            if (this.searchForm.keywords) {
                this.defaultOpenSort = []
                this.defaultSort = []
                params.keyword = this.searchForm.keywords
                delete params.sort_id
            }
            if(e){
                params.audit_status = e
            }
            params.page = this.pagination.current
            params.pageSize = this.pagination.pageSize
            this.request(mallMerchantApi.getGoodsList, params).then((data) => {
                if (data.list) {
                    if (data.list) {
                        this.goodsList = data.list.map((item) => {
                            item.sort_editable = false
                            item.price_editable = false
                            return item
                        })
                    } else {
                        this.goodsList = []
                    }
                }
                this.$set(this.pagination, 'total', data.total)
            })
        },
        // 切换tab
        onTabChange(val) {
            this.getSortList()
        },
        // 分类管理
        editGoodsSort() {
            let query = { store_id: this.store_id }
            this.$router.push({ path: '/merchant/merchant.mall/GoodsSortList', query })
        },
        // 添加商品
        editGoods(id) {
            let query = { store_id: this.store_id }
            if (id) {
                this.request(mallMerchantApi.deleteJudge, { goods_ids: [id] }).then((data) => {
                    if (data[0]) {
                        this.$message.warn('该商品正在参加活动，请先将活动失效再来编辑')
                        return
                    } else {
                        query.goods_id = id
                        this.$router.push({ path: '/merchant/merchant.mall/editGoods', query })
                    }
                })
            } else {
                this.$router.push({ path: '/merchant/merchant.mall/editGoods', query })
            }
        },
        // 删除商品
        removeGoods(id) {
            let goods_ids = []
            if (id) {
                goods_ids.push(id)
            } else {
                if (this.selectedRowKeys.length) {
                    goods_ids = this.selectedRowKeys
                } else {
                    this.$message.warning('请选择商品')
                    return
                }
            }
            this.$confirm({
                title: '确认要删除选中商品吗?',
                centered: true,
                onOk: () => {
                    this.request(mallMerchantApi.removeGoods, { goods_ids }).then((data) => {
                        if (data !== true) {
                            if (id) {
                                this.$message.warn('该商品正在参加活动，请先将活动失效再来删除')
                            } else {
                                this.$message.warn('存在' + data + '个商品正在参加活动，请先将活动失效再来删除')
                            }
                        } else {
                            this.$message.success('删除成功')
                        }
                        this.getDataList()
                    })
                },
                onCancel() {},
            })
        },
        // 设置上下架
        setGoodsStatus(id, status) {
            this.selectedIds = [id]
            this.setGoodsStatusRequest(status, 1)
        },
        changeGoodsStatus(type) {
            if (this.selectedRowKeys.length) {
                this.selectedIds = this.selectedRowKeys
                this.setGoodsStatusRequest(type)
            } else {
                this.$message.warning('请选择商品')
            }
        },

        virtualSales(record) {//批量设置虚拟销量
          if (record) {
            if (record.virtual_set === 1) {
              this.$message.warning('该商品虚拟销量只能平台设置，商家不可进行设置')
            } else {
              this.selectedRowKeys = [record.goods_id]
              this.virtual_sales = record.virtual_sales;
              this.virtual_visible = true;
            }
          } else {
            this.virtual_visible = true;
          }
        },
        setVirtualSales() {//批量设置虚拟销量
          if (this.selectedRowKeys.length) {
            this.selectedIds = this.selectedRowKeys
            this.request(mallMerchantApi.setVirtualSales, { goods_ids: this.selectedIds, sales: this.virtual_sales }).then((data) => {
                if (data !== true) {
                  if (this.selectedRowKeys.length === 1) {
                    this.$message.warn('该商品虚拟销量只能平台设置，商家不可进行设置')
                  } else {
                    this.$message.warn('存在' + data + '个商品虚拟销量只能平台设置，商家不可进行设置')
                  }
                } else {
                  this.$message.success('设置成功')
                }
              this.virtual_visible = false
              this.batchOperateVisible = false;
              this.getTabList(true)
            })
          } else {
            this.$message.warning('请选择商品')
            this.virtual_visible = false
          }
        },

        // type : true=上架 false=下架
        //is_single 1=单个商品操作 0=批量操作
        setGoodsStatusRequest(type, is_single) {
            const status = type ? 1 : 0
            this.request(mallMerchantApi.changeGoodsStatus, { goods_ids: this.selectedIds, status }).then((data) => {
                if (!type) {
                    if (data !== true) {
                        if (is_single) {
                            this.$message.warn('该商品正在参加活动，请先将活动失效再来下架')
                        } else {
                            this.$message.warn('存在' + data + '个商品正在参加活动，请先将活动失效再来下架')
                        }
                    } else {
                        this.$message.success('修改成功')
                    }
                } else {
                    this.$message.success('修改成功')
                }
                this.getTabList(true)
            })
        },
        //修改排序
        changeGoodsSort(index, type) {
            let item = this.goodsList[index]
            if (type == 'change' || type == 'cancel') {
                item.sort_editable = !item.sort_editable
                this.$set(this.goodsList, index, item)
            } else {
                item.sort_editable = false
                this.request(mallMerchantApi.changeGoodsSort, { goods_id: item.goods_id, sort: this.sortValue }).then(
                    (data) => {
                        this.$message.success('修改成功！')
                        this.getDataList()
                    }
                )
            }
        },
        handleSortChange(val) {
            this.sortValue = val
        },
        saveSortChange(record){
            this.request(mallMerchantApi.changeGoodsSort, { goods_id: record.goods_id, sort: record.sort_store }).then(
                (data) => {
                    this.getDataList()
                }
            )
        },
        // 修改价格
        changeGoodsPrice(index, type) {
            let item = this.goodsList[index]
            this.request(mallMerchantApi.deleteJudge, { goods_ids: [item.goods_id] }).then((data) => {
                if (data[0]) {
                    this.$message.warn('该商品正在参加活动，请先将活动失效再来修改价格')
                    return
                } else {
                    if (type == 'change' || type == 'cancel') {
                        item.price_editable = !item.price_editable
                        this.$set(this.goodsList, index, item)
                    } else if (type == 'confirm') {
                        item.price_editable = false
                        this.updateGoodsPrice({ goods_id: item.goods_id, type: 'spu', price: this.changedPrice })
                    } else {
                        this.goodsId = item.goods_id
                        this.request(mallMerchantApi.getGoodsSkuPrice, { goods_id: item.goods_id }).then((data) => {
                            this.skuInfo = data
                            this.visible = true
                        })
                    }
                }
            })
        },
        handlePriceChange(val) {
            this.changedPrice = val
        },
        updateGoodsPrice(data) {
            this.request(mallMerchantApi.changeGoodsPrice, data).then((data) => {
                this.$message.success('修改成功！')
                this.getDataList()
            })
        },
        changeSkuGoodsPrice(val, index) {
            let item = this.skuInfo[index]
            item.price = val
            this.$set(this.skuInfo, index, item)
        },
        // 弹框确认
        handleOk() {
            this.visible = false
            this.updateGoodsPrice({ goods_id: this.goodsId, sku_info: this.skuInfo, type: 'sku' })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getDataList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getDataList()
        },
        // 重置表单
        resetForm() {
            this.$set(this, 'searchForm', { keywords: '' })
            this.$set(this.pagination, 'current', 1)
            this.getTabList()
        },
        getExport() {
            if (this.goodsList.length) {
                this.$refs.ExportAddModal.exports()
            } else {
                this.$message.warn('当前没有可以导出的内容')
            }
        },
        checkQrcode(url) {
            this.qrcodeImg = url
            this.qrcodeVisible = true
        },
        // 批量添加商品
        clickbathAddGoods() {
            if (this.sortList.length == 0) {
                this.$message.error('请先添加分类')
                return false
            }
            this.selectGoodsVisible = true
        },
        // 批量添加商品
        bathAddGoods(goodsIds) {
            const param = {
                goods_id: goodsIds,
                store_id: this.store_id,
                sort_id: this.sortId,
            }
            this.request(mallMerchantApi.goodsBatch, param).then((res) => {
                this.$message.success(res.msg)
                this.selectedRowKeys = []
                this.getSortList()
                this.getGoodsList()
            })
        },
        // 选择商品回调
        onGoodsSelect(e) {
            this.selectGoodsVisible = false
            if (e.ids) {
                // 批量新增商品
                this.bathAddGoods(e.ids)
            }
        },
        handleStorageChange(event) {
            // 当localStorage发生变化时触发的处理函数
            if (event.key === 'pro__system_config') {
                // 处理localStorage变化的逻辑
                this.system_config = this.$getCache('system_config')
            }
        },
        exportViewArea(record){
            //导出商品展示区域 
            console.log(record);
            this.request(mallMerchantApi.exportViewArea, { goods_id: record.goods_id,goods_name:record.name }).then((data) => {
                window.open(data.url);
            })
        },
        batchSet(){
            if (this.selectedRowKeys.length < 1) {
                this.$message.warning('请选择商品');
                return false;
            }
            this.batchOperateVisible = true;
            this.batchSort = [];
            this.virtual_sales = 0;
            this.batchBrandId = '';
            this.getStoreSort();
            this.getBrandList();
        },
        // 获取商品分类
        getStoreSort() {
            this.request(mallMerchantApi.getStoreSort, { store_id: this.store_id, type: 0 }).then((res) => {
                this.storeSortList = res.list
            })
        },
        //获取品牌列表
        getBrandList(){
            this.request(mallMerchantApi.getBrandsList).then((data) => {
                this.brandList = data;
            })
        },
        //品牌筛选
        filterBrand(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        //批量设置虚拟销量
        setStoreSort() {
          if (this.selectedRowKeys.length) {
            this.selectedIds = this.selectedRowKeys
            let params = {
                goods_ids: this.selectedIds
            };
            this.batchSort.forEach((item, index) => {
                if (index == 0) {
                    params.sort_first = item
                } else if (index == 1) {
                    params.sort_second = item
                } else {
                    params.sort_third = item
                }
            })
            params.sort_id = this.batchSort[this.batchSort.length -1];
            this.request(mallMerchantApi.setStoreGoodsSort, params).then((data) => {
                this.$message.success('设置成功')
                this.batchOperateVisible = false;
                this.getTabList(true)
            })
          } else {
                this.$message.warning('请选择商品')
          }
        },

        //批量设置品牌
        setBrand() {
          if (this.selectedRowKeys.length) {
            if(!this.batchBrandId){
                this.$message.warning('请选择品牌');
                return false;
            }

            this.selectedIds = this.selectedRowKeys
            let params = {
                goods_ids: this.selectedIds,
                brand_id: this.batchBrandId
            };
            this.request(mallMerchantApi.setGoodsBrand, params).then((data) => {
                this.$message.success('设置成功')
                this.batchOperateVisible = false;
                this.getTabList(true)
            })
          } else {
                this.$message.warning('请选择商品')
          }
        },
        //批量操作提交
        batchHandleSubmit(){
            if(this.tabIndex == 'sort'){
                //批量修改店铺分类
                this.setStoreSort();

            }else if(this.tabIndex == 'brand'){
                //批量修改品牌
                this.setBrand();

            }else if(this.tabIndex == 'virtaul_sales'){
                //批量修改虚拟销量
                this.setVirtualSales();
            }else{
                this.$message.error('请选择批量操作类型');
                return false;
            }
        }
    },
}
</script>
<style lang="less" scoped>
.left {
    width: 180px;
    min-height: calc(~'100vh - 350px');
    // border-right: 1px solid #f1f1f1;
}

.right {
    flex: 1;
    min-height: calc(~'100vh - 350px');
    margin-left: 10px;
    overflow-x: auto;
}

.qrcode-img {
    width: 400px;
    height: 400px;
    margin-left: 50%;
    transform: translateX(-200px);
}
.search-order{
    display: flex;
    align-items: center;
}
.search-order /deep/ .ant-input-group-addon {
    padding: 0;
    border: 0;
}
.status {
  display: inline-flex;
  align-items: center;
    margin-left: 8px;
  p {
    margin-bottom: 0;
    margin-right: 10px;
  }
}
</style>
