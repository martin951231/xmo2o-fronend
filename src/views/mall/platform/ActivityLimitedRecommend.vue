<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div>
            <a-tabs :activeKey="activeKey" @change="actChange">
                <a-tab-pane key="getLimitedRecommendList" tab="秒杀活动"></a-tab-pane>
                <a-tab-pane key="getGroupRecommendList" tab="拼团活动"></a-tab-pane>
                <a-tab-pane key="getBargainRecommendList" tab="砍价活动"></a-tab-pane>
            </a-tabs>
        </div>
        <!-- 搜索条件 -->
        <a-form-model layout="inline" :model="searchForm" @submit="getActList" @submit.native.prevent>
            <a-row type="flex" justify="space-between">
                <a-col>
                    <a-form-model-item label="商品名称">
                        <a-input v-model="searchForm.keywords" placeholder="请输入商品名称" class="keywords"
                                 style="width: 200px"/>
                    </a-form-model-item>
                </a-col>
                <a-col>
                    <a-form-model-item label="推荐状态">
                        <a-select
                                v-model="searchForm.isRecommend"
                                placeholder="请选择推荐状态"
                                style="width: 150px"
                                @change="isRecommendChange"
                        >
                            <a-select-option value="1"> 已推荐至首页</a-select-option>
                            <a-select-option value="2"> 未推荐至首页</a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>
                <a-col>
                    <a-form-model-item label="选择商家">
                        <a-radio
                                @click="searchRadioOpt(item.value, '1')"
                                v-for="item in merchantOptions"
                                :key="item.value"
                                :checked="item.value == merchantType ? true : false"
                        >
                            {{ item.label }}
                        </a-radio>
                    </a-form-model-item>
                    <a-form-model-item label="选择店铺">
                        <a-radio
                                @click="searchRadioOpt(item.value, '2')"
                                v-for="item in storeOptions"
                                :key="item.value"
                                :checked="item.value == storeType ? true : false"
                        >
                            {{ item.label }}
                        </a-radio>
                    </a-form-model-item>
                </a-col>

                <a-col>
                    <a-form-model-item label="活动时间">
                        <a-range-picker
                                :value="searchForm.time"
                                v-model="searchForm.time"
                                format="YYYY-MM-DD"
                                @change="onDateRangeChange"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col>
                    <a-form-model-item>
                        <a-button type="primary" html-type="submit"> 查询</a-button>
                        <a-button class="ml-20" @click="resetForm"> 重置</a-button>
                        <!--            <a-button type="primary" class="ml-40" @click="exportGoods"> 导出商品 </a-button>-->
                        <a-button type="primary" @click="showModal(record)" style="margin-left: 20px">轮播图列表</a-button>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>

        <!--  -->
        <section class="mt-20">
            <a-row type="flex" justify="space-between">
                <!-- 数据表 -->
                <a-col :span="24">
                    <a-table
                            :columns="columnsList"
                            :data-source="goodsList"
                            :pagination="false"
                            :row-selection="
              searchForm.isRecommend == 1
                ? null
                : { selectedRowKeys: goodsSelectedRowKeys, onChange: ongoodsSelectChange }
            "
                            rowKey="act_goods_id"
                    >
                        <!-- 商品名称 -->
                        <template slot="goods_name" slot-scope="text, record">
                            <div class="flex align-center">
                                <img class="size-45" :src="record.image"/>
                                <div class="flex flex-direction justify-between">
                                    <span class="flex-1 ml-10">{{ text }} </span>
                                </div>
                            </div>
                        </template>
                        <!-- 售价 -->
                        <template slot="time" slot-scope="text, record">
                            <span>{{ record.start_time }}-{{ record.end_time }}</span>
                        </template>
                        <!-- 售价 -->
                        <template slot="price" slot-scope="text, record">
                            <span v-if="record.goods_type == 'spu'">￥{{ record.price }}</span>
                            <span v-else>￥{{ record.min_price }} - ￥{{ record.max_price }}</span>
                        </template>
                        <!-- 活动价 -->
                        <template slot="act_price" slot-scope="text, record">
                            <span v-if="record.goods_type == 'spu'">￥{{ record.act_price }}</span>
                            <span v-else>￥{{ record.min_act_price }} - ￥{{ record.max_act_price }}</span>
                        </template>
                        <!--活动状态-->
                        <template slot="status" slot-scope="text, record">
                            <span v-if="record.status == 0">未开始</span>
                            <span v-if="record.status == 1">进行中</span>
                            <span v-if="record.status == 2">已失效</span>
                        </template>
                        <!-- 排序 -->
                        <template slot="sort" slot-scope="text, record">
                            <a-input-number
                                    :default-value="text ? text : 0"
                                    :precision="0"
                                    :min="0"
                                    v-model="record.sort"
                                    @blur="handleSortChange($event, text, record)"
                            />
                        </template>
                        <!-- 推荐时间段 -->
                        <template slot="recommend_time" slot-scope="text, record">
                            <span>{{ record.recommend_start_time }}-{{ record.recommend_end_time }}</span>
                        </template>
                        <!-- 实收金额 -->
                        <template slot="real_money" slot-scope="text, record">
                            <span>￥{{ record.real_money }}</span>
                        </template>
                        <!-- 操作 -->
                        <template slot="action" slot-scope="text, record">
                            <a @click="$refs.createModal.edit(record, activeKey, 1)">首页推荐设置</a>
                            <a-button
                                    v-if="searchForm.isRecommend == 1"
                                    type="link"
                                    class="link-btn"
                                    @click="btnOpt(record, 'setFirst')"
                            >
                                |{{ record.is_first == 1 ? '取消置顶' : '置顶' }}
                            </a-button>
                        </template>
                    </a-table>
                    <a-row class="mt-20" type="flex" justify="space-between" align="middle">
                        <a-col :span="10" class="ml-20">
              <span v-if="searchForm.isRecommend == 2">
                <a-checkbox
                        @change="allCheck"
                        :checked="goodsSelectedRowKeys.length == goodsList.length && goodsList.length ? true : false"
                        :disabled="!goodsList.length ? true : false"
                >当页全选</a-checkbox
                >
                <span>已选 {{ goodsSelectedRowKeys.length }}</span>
                <a-button
                        class="ml-10"
                        type="primary"
                        :disabled="!goodsSelectedRowKeys.length ? true : false"
                        @click="batchRec(goodsSelectedRowKeys, activeKey)"
                >批量推荐至首页</a-button
                >
              </span>
                        </a-col>
                        <a-col :span="12" style="text-align: right">
                            <a-pagination
                                    :current="searchForm.page"
                                    :pageSize="searchForm.pageSize"
                                    :total="total"
                                    show-size-changer
                                    show-quick-jumper
                                    :show-total="(total) => `共 ${total} 条记录`"
                                    @change="onPageChange"
                                    @showSizeChange="onPageSizeChange"
                            />
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </section>
        <set-recommend ref="createModal" @updateList="isRecommendChange" @ok="handleOk"/>

        <!-- 设置轮播弹窗 -->
        <template>
            <div>
                <a-modal v-model="swipperVisible" title="添加轮播图" @ok="handleOk" :width="700" :footer="null">
                    <template>
                        <a-button size="small" @click="showAddModal('add')" style="margin-bottom: 8px">添加轮播</a-button>
                        <a-table class="lunbo-list" :columns="column" :data-source="bannerData" :rowKey="bannerData.id">
                            <!-- 插入图片 -->
                            <template slot="image" slot-scope="text, record">
                                <img :src="record.image"
                                     style="width: 20rem; height: 7.5rem; border: 1px solid #cccccc"/>
                                <div>
                                    <span>链接：</span><span>{{ record.url }}</span>
                                </div>
                            </template>
                            <!-- 排序 -->
                            <template slot="sort" slot-scope="text, record">
                                <a-tag slot="id" style="width: 3.125rem; text-align: center">{{ text }}</a-tag>
                            </template>
                            <template slot-scope="text, record" slot="editAndMore">
                                <a-button class="editOrMore" @click="showAddModal('edit', record)">编辑</a-button>
                                <a-button class="editOrMore" @click="showSwipperConfirm(record)"
                                          style="margin-left: 8px"
                                >删除
                                </a-button
                                >
                            </template>
                        </a-table>
                    </template>
                </a-modal>
            </div>
        </template>
        <!-- /设置轮播弹窗 -->
        <!-- 添加轮播图弹窗 -->
        <template>
            <div>
                <a-modal
                        v-model="bannerVisible"
                        :title="swiperTypeIsAdd ? '添加轮播图' : '编辑轮播图'"
                        @ok="handleYesOk"
                        cancelText="关闭"
                        okText="添加"
                        okType="primary"
                        :width="800"
                >
                    <template>
                        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
                                @submit="handleSubmit">
                            <a-form-item label="轮播图片" help="建议尺寸640 * 240">
                                <!-- 调用图片 -->
                                <choose-image
                                        ref="chooseImage"
                                        :name="uploadName"
                                        :max="max"
                                        :upload_dir="upload_dir"
                                        :type="uploadType"
                                        @callback="callBack"
                                />
                                <!-- /调用图片 -->
                                <a-button style="width: 200px" @click="chooseImage">添加轮播图片</a-button>
                                <img
                                        v-for="(items, index) in imageList"
                                        :key="index"
                                        :src="items"
                                        style="width: 20rem; height: 7.5rem; border: 1px solid #cccccc"
                                />
                            </a-form-item>
                            <a-form-item label="排序" help="数字越大，排序越靠前">
                                <a-input-number placeholder="" style="width: 100px" v-model="img_sort"/>
                            </a-form-item>
                            <a-form-item label="链接地址">
                                <a-input placeholder="请填写链接地址" style="width: 200px" v-model="swipper_url"/>
                                <a-button @click="choosePower">功能库</a-button>
                            </a-form-item>
                        </a-form>
                    </template>
                </a-modal>
            </div>
        </template>
        <!-- /添加轮播图弹窗 -->

        <!-- 弹框 -->
        <a-modal
                v-model="modalVisible"
                :title="modalTitle"
                centered
                :maskClosable="false"
                :width="600"
                @ok="handleOk"
                @cancel="handleCancel"
        >
            <!-- 选择商家 || 店铺 -->
            <template v-if="modalType == 1 || modalType == 2">
                <a-form-model layout="inline" :model="modalSearchForm" :label-col="{ span: 2 }"
                              :wrapper-col="{ span: 22 }">
                    <a-form-model-item label="搜索" :labelAlign="'left'" style="width: 100%">
                        <a-input-search
                                @search="getMerOrStoreList"
                                enter-button
                                :placeholder="modalType == 1 ? '请输入商家名称' : '请输入店铺名称'"
                        />
                    </a-form-model-item>
                </a-form-model>
                <a-table
                        :row-selection="{ selectedRowKeys: modalSelectedRowKeys, onChange: onModalSelectChange }"
                        :columns="columns"
                        :scroll="{ y: 400 }"
                        :data-source="modalTableData"
                        :pagination="pagination"
                        :row-key="modalType == 1 ? 'mer_id' : 'store_id'"
                        class="mt-20"
                >
                    <template slot="name">
                        <span>{{ modalType == 1 ? '商家名称' : '店铺名称' }}</span>
                    </template>
                </a-table>
            </template>
        </a-modal>
    </div>
</template>


<script>
    import mallPlatformApi from '@/api/mall/platform/index'
    import {getCookie, setCookie} from '@/utils/util'
    import SetRecommend from './SetRecommend.vue'
    import ChooseImage from '@/components/ChooseImage/ChooseImage'

    const column = [
        {
            title: '轮播图',
            dataIndex: 'image',
            key: 'image',
            width: '20%',
            scopedSlots: {customRender: 'image'},
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
            scopedSlots: {customRender: 'sort'},
        },{
            title: '浏览量',
            dataIndex: 'click_number',
            key: 'click_number'
        },
        {
            title: '操作',
            key: 'editAndMore',
            dataIndex: 'editAndMore',
            scopedSlots: {customRender: 'editAndMore'},
        },
    ]
    export default {
        name: 'ActivityLimitedRecommend',
        components: {
            SetRecommend,
            ChooseImage,
        },
        data() {
            return {
                activeKey: 'getLimitedRecommendList',
                swipperVisible: false,
                column,
                bannerData: [],
                swiperTypeIsAdd: false, // 轮播图是否是新增或者编辑弹框
                bannerVisible: false,
                form: this.$form.createForm(this, {name: 'coordinated'}),
                uploadName: 'goods_img', //上传后回传回来的标识
                max: 1, // 最多上传 goods_img 5 , goods_video 1,
                upload_dir: '/mall/goods/images', // 上传图片、视频的路径
                uploadType: 'image',
                imageList: [],
                swipper_url: '',
                img_sort: 0,
                searchForm: {
                    merList: [],
                    storeList: [],
                    keywords: '',
                    page: 1,
                    pageSize: 10,
                    isRecommend: '2',
                    time: [],
                    start_time: '', // 活动开始时间
                    end_time: '', // 活动结束时间
                },
                merchantType: 1, // 1 全部商家 2部分商家
                storeType: 1, // 1 全部店铺 2部分店铺
                merchantOptions: [
                    {
                        label: '全部商家',
                        value: 1,
                    },
                    {
                        label: '部分商家',
                        value: 2,
                    },
                ],
                storeOptions: [
                    {
                        label: '全部店铺',
                        value: 1,
                    },
                    {
                        label: '部分店铺',
                        value: 2,
                    },
                ],
                modalType: '', // 弹框类型 1商家 2店铺
                modalVisible: false,
                modalSearchForm: {
                    search: '',
                    type: '',
                },

                modalTableData: [],
                modalSelectedRowKeys: [],
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    onChange: this.onModalPageChange,
                    onShowSizeChange: this.onModalPageSizeChange,
                    showTotal: (total) => `共 ${total} 条`,
                },
                columns: [
                    {
                        dataIndex: 'name',
                        slots: {title: 'name'},
                        align: 'center',
                    },
                ],
                goodsList: [],
                sortList: [],
                defaultOpenSort: [],
                defaultSort: [],
                catId: '', // 分类id
                columnsList: [],
                columnsGoods: [
                    {
                        title: '商品名称',
                        dataIndex: 'goods_name',
                        scopedSlots: {customRender: 'goods_name'},
                        width: 200,
                    },
                    {
                        title: '商家名称',
                        dataIndex: 'mer_name',
                        width: 120,
                        align:'center',
                    },
                    {
                        title: '店铺名称',
                        dataIndex: 'store_name',
                        width: 120,
                        align:'center',
                    },
                    {
                        title: '活动时间',
                        dataIndex: 'time',
                        width: 180,
                        scopedSlots: {customRender: 'time'},
                    },
                    {
                        title: '活动状态',
                        dataIndex: 'status',
                        width: 100,
                        scopedSlots: {customRender: 'status'},
                    },
                    {
                        title: '原价',
                        dataIndex: 'price',
                        scopedSlots: {customRender: 'price'},
                        width: 100,
                    },
                    {
                        title: '活动价',
                        dataIndex: 'act_price',
                        scopedSlots: {customRender: 'act_price'},
                        width: 100,
                    },
                    {
                        title: '实收金额',
                        dataIndex: 'real_money',
                        width: 100,
                        scopedSlots: {customRender: 'real_money'},
                    },
                    // {
                    //   title: '总销量',
                    //   dataIndex: 'sale_num'
                    // },
                    // {
                    //   title: '当前库存',
                    //   dataIndex: 'stock_num',
                    //   scopedSlots: { customRender: 'stock_num' }
                    // },
                    {
                        // 已推荐时显示
                        title: '排序',
                        dataIndex: 'sort',
                        width: 150,
                        scopedSlots: {customRender: 'sort'},
                    },
                    {
                        // 已推荐时显示
                        title: '推荐时间段',
                        dataIndex: 'recommend_time',
                        scopedSlots: {customRender: 'recommend_time'},
                        width: 180,
                    },
                    {
                        title: '操作',
                        dataIndex: 'goods_id',
                        width: 250,
                        align:'center',
                        scopedSlots: {customRender: 'action'},
                    },
                ],
                goodsSelectedRowKeys: [],
                total: 0,
                currentGoods: '',
                rules: {
                    // score_percent: [
                    //   { require: true, validator: scorePercentVaild, trigger: 'blur' }
                    // ]
                },
                commissionFormData: {
                    goods_id: '',
                    spread_rate: 0,
                    sub_spread_rate: 0,
                    third_spread_rate: 0,
                },
                merInfo: '',
            }
        },
        computed: {
            modalTitle() {
                let title = ''
                if (this.modalType == 1) {
                    title = '选择商家'
                } else if (this.modalType == 2) {
                    title = '选择店铺'
                } else if (this.modalType == 3) {
                    title = '设置积分'
                } else if (this.modalType == 4) {
                    title = '设置佣金'
                } else if (this.modalType == 7) {
                    title = '提示'
                }
                return title
            },
        },
        created() {
            this.isRecommendChange()
            this.getActList()
        },
        methods: {
            // 活动列表
            getActList() {
                this.request(mallPlatformApi[this.activeKey], this.searchForm).then((data) => {
                    this.goodsList = data.list || []
                    this.total = data.count
                })
            },
            //监听日期选择变化
            onDateRangeChange(date, dateString) {
                console.log(date, 'date')
                // 更新搜索框表单数据
                this.$set(this.searchForm, 'time', [date[0], date[1]])
                this.$set(this.searchForm, 'start_time', dateString[0])
                this.$set(this.searchForm, 'end_time', dateString[1])
            },
            // 活动tab切换
            actChange(activeKey) {
                this.activeKey = activeKey
                this.resetForm()
                this.getActList()
            },
            // 部分商家 || 部分店铺
            searchRadioOpt(value, modalType) {
                this.modalType = modalType
                if (this.modalType == 1) {
                    this.merchantType = value
                } else if (this.modalType == 2) {
                    this.storeType = value
                }
                if (value == 2) {
                    this.modalVisible = true
                } else if (value == 1) {
                    this.searchForm.merList = []
                    this.searchForm.storeList = []
                }
                this.getMerOrStoreList()
            },
            // 是否已推荐change
            isRecommendChange() {
                this.columnsList = this.columnsGoods.filter((item) => {
                    if (this.searchForm.isRecommend == 2) {
                        if (item.dataIndex != 'sort' && item.dataIndex != 'recommend_time') {
                            return item
                        }
                    } else {
                        return item
                    }
                })
                if (this.searchForm.isRecommend == 2) {
                    this.goodsSelectedRowKeys = []
                }
                // this.searchForm.page = 1
                // this.searchForm.pageSize = 10
                this.getActList()
                // 查询列表
                // this.getMerOrStoreList();
            },
            // 获取店铺或商家列表
            getMerOrStoreList(e) {
                this.modalTableData = []
                if (e) {
                    this.searchForm.keywords = e
                    this.$set(this.pagination, 'current', 1)
                } else {
                    e = this.searchForm.keywords
                }
                this.$set(this.modalSearchForm, 'type', this.modalType)
                this.$set(this.modalSearchForm, 'search', e)
                this.$set(this.modalSearchForm, 'page', this.pagination.current)
                this.modalSearchForm.pageSize = this.pagination.pageSize
                this.request(mallPlatformApi.getMerOrStoreList, this.modalSearchForm).then((data) => {
                    this.modalTableData = data.list || []
                    this.pagination.total = data.count
                })
            },
            // 页码变化
            onModalPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getMerOrStoreList()
            },
            onModalPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getMerOrStoreList()
            },
            // 弹框表格多选
            onModalSelectChange(selectedRowKeys) {
                this.modalSelectedRowKeys = selectedRowKeys
            },
            // 商品参与的活动
            joinActivityOpt(val) {
                let text = ''
                if (val) {
                    text = this.activityOptions.filter((item) => item.value == val)[0] || ''
                }
                return text ? text['label'] : ''
            },
            // 获取分类列表
            goodsCategoryList() {
                this.defaultSort = []
                this.defaultOpenSort = []
                this.request(mallPlatformApi.goodsCategoryList, this.searchForm).then((data) => {
                    this.sortList = data.list || []
                })
            },
            onSortSelect(e) {
                const {item, key, selectedKeys} = e
                this.catId = key
                this.defaultSort = [key]
                console.log('--------------catId', this.catId)
                this.goodsSelectedRowKeys = []
                this.getActList()
            },
            onOpenChange(openKeys) {
                const latestOpenKey = openKeys.find((key) => this.defaultOpenSort.indexOf(key) === -1)
                if (this.defaultOpenSort.indexOf(latestOpenKey) === -1) {
                    this.defaultOpenSort = openKeys
                } else {
                    this.defaultOpenSort = latestOpenKey ? [latestOpenKey] : []
                }
            },
            // 重置
            resetForm() {
                this.$set(this, 'searchForm', {
                    merList: [],
                    storeList: [],
                    keywords: '',
                    page: 1,
                    pageSize: 10,
                    isRecommend: '2',
                    time: [],
                    start_time: '', // 活动开始时间
                    end_time: '', // 活动结束时间
                })
                this.merchantType = 1 // 1 全部商家 2部分商家
                this.storeType = 1 // 1 全部店铺 2部分店铺
                this.getActList()
                this.goodsSelectedRowKeys = []
            },
            // 排序
            handleSortChange(e, val, record) {
                let params = {
                    activity_id: record.id,
                    goods_id: record.act_goods_id,
                    sort: val,
                }

                let api = ''
                if (this.activeKey == 'getLimitedRecommendList') {
                    api = 'setSortLimited'
                } else if (this.activeKey == 'getBargainRecommendList') {
                    api = 'setSortBargain'
                } else if (this.activeKey == 'getGroupRecommendList') {
                    api = 'setSortGroup'
                }
                this.request(mallPlatformApi[api], params).then((data) => {
                    this.getActList()
                })
            },
            // 按钮操作
            btnOpt(record, type, modalType = '', singleGoods = true) {
                this.currentGoods = record

                if (type == 'setFirst') {
                    this.setFirstOpt(record)
                    return
                }
            },
            // 确认编辑商品
            editGoods(isSetTicket = false) {
                this.modalVisible = false
                this.modalType = ''
                let url = location.href.substring(0, location.href.indexOf('#'))
                // 商家登陆token信息
                if (isSetTicket) {
                    setCookie('merchant_access_token', this.merInfo.ticket, null)
                }
                window.open(
                    `${url}#/merchant/merchant.mall/editGoods?store_id=${this.currentGoods.store_id}&goods_id=${this.currentGoods.goods_id}`
                )
            },
            // 设置置顶
            setFirstOpt(record) {
                let params = {
                    activity_id: record.id,
                    act_id: record.act_id,
                    goods_id: record.act_goods_id,
                    is_first: record.is_first == 1 ? 0 : 1,
                }

                let api = ''
                if (this.activeKey == 'getLimitedRecommendList') {
                    api = 'setFirstLimited'
                } else if (this.activeKey == 'getBargainRecommendList') {
                    api = 'setFirstBargain'
                } else if (this.activeKey == 'getGroupRecommendList') {
                    api = 'setFirstGroup'
                }
                if (api) {
                    this.request(mallPlatformApi[api], params).then((data) => {
                        this.$message.success('设置成功！')
                        this.modalType = ''
                        this.getActList()
                    })
                }
            },
            // 弹框确认
            handleOk() {
                if (this.modalType == 1) {
                    this.$set(this.searchForm, 'merList', this.modalSelectedRowKeys)
                } else if (this.modalType == 2) {
                    this.$set(this.searchForm, 'storeList', this.modalSelectedRowKeys)
                }

                // 选择商家 || 店铺
                if (this.modalType == 1 || this.modalType == 2) {
                    this.modalVisible = false
                    this.modalSelectedRowKeys = []
                    this.modalTableData = []
                }
            },
            // 弹框取消
            handleCancel() {
                let formData = ''
                if (this.modalType == 3) {
                    formData = 'scoreForm'
                }
                if (this.modalType == 4) {
                    formData = 'commissionForm'
                }
                if (formData) {
                    this.$refs[formData].clearValidate()
                }

                if (this.currentGoods) {
                    this.currentGoods = ''
                }
                if (this.merInfo) {
                    this.merInfo = ''
                }
                this.modalType = ''
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.searchForm, 'page', page)
                this.getActList()
            },
            // pageSize变化
            onPageSizeChange(page, pageSize) {
                this.$set(this.searchForm, 'pageSize', pageSize)
                this.getActList()
            },
            // 商品列表多选
            ongoodsSelectChange(selectedRowKeys) {
                console.log(selectedRowKeys,"selectedRowKeys==selectedRowKeys===selectedRowKeys")
                this.goodsSelectedRowKeys = selectedRowKeys
            },
            // 当页全选
            allCheck(e) {
                if (e.target.checked) {
                    this.goodsSelectedRowKeys = this.goodsList.map((item) => item.id)
                } else {
                    this.goodsSelectedRowKeys = []
                }
            },
            batchRec(select, activeKey) {
                let sList = []
                this.goodsList.forEach((item1) => {
                    select.forEach((item2) => {
                        if (item2 == item1['act_goods_id']) {
                            sList.push(item1)
                        }
                    })
                })
                this.$refs.createModal.edit(sList, activeKey, 2)
            },
            // 设置轮播图
            showModal(record) {
                this.swipperVisible = true
                let act_type = ''
                if (this.activeKey == 'getLimitedRecommendList') {
                    act_type = 1
                } else if (this.activeKey == 'getBargainRecommendList') {
                    act_type = 2
                } else if (this.activeKey == 'getGroupRecommendList') {
                    act_type = 3
                }
                this.refreshBannerList(record, act_type)
            },
            // 轮播图bannerList
            refreshBannerList(record, type) {
                // console.log(record, type);
                this.cur_record = record
                this.cur_type = type
                this.request(mallPlatformApi.bannerList, {
                    act_type: type, //1 秒杀 2砍价 3拼团
                }).then((res) => {
                    this.bannerData = res
                    // console.log(res)
                })
            },
            // 添加或者编辑轮播图
            showAddModal(type, record) {
                if (type == 'add') {
                    this.swiperTypeIsAdd = true
                    this.swipper_url = ''
                    this.img_sort = 0
                    this.imageList = []
                    this.cur_swiper_record = ''
                } else {
                    this.cur_swiper_record = record
                    this.swiperTypeIsAdd = false
                    this.imageList = record.image.split()
                    this.swipper_url = record.url
                    this.img_sort = record.sort
                }
                console.log(this.cur_record, this.cur_swiper_record)
                this.bannerVisible = true
            },
            // 轮播图弹框新增或者编辑
            handleYesOk(e) {
                const {
                    form: {validateFields},
                } = this
                if (!this.imageList[0]) {
                    this.$message.error('请添加轮播图片')
                    return
                }
                validateFields((errors, values) => {
                    if (!errors) {
                        console.log('Received values of form: ', values, this.cur_record)
                        let act_type = ''
                        if (this.activeKey == 'getLimitedRecommendList') {
                            act_type = 1
                        } else if (this.activeKey == 'getBargainRecommendList') {
                            act_type = 2
                        } else if (this.activeKey == 'getGroupRecommendList') {
                            act_type = 3
                        }
                        this.request(mallPlatformApi.addOrEditBanner, {
                            id: this.cur_swiper_record && this.cur_swiper_record.id ? this.cur_swiper_record.id : '',
                            act_type: act_type,
                            image: this.imageList[0],
                            url: this.swipper_url,
                            sort: this.img_sort,
                        }).then((res) => {
                            console.log(res)
                            this.bannerVisible = false
                            this.refreshBannerList(this.cur_record, this.cur_type)
                        })
                    }
                })
            },
            //轮播删除
            showSwipperConfirm(record) {
                console.log(record)
                let act_type = ''
                if (this.activeKey == 'getLimitedRecommendList') {
                    act_type = 1
                } else if (this.activeKey == 'getBargainRecommendList') {
                    act_type = 2
                } else if (this.activeKey == 'getGroupRecommendList') {
                    act_type = 3
                }
                this.$confirm({
                    title: '你确定要删除吗?',
                    onOk: () => {
                        this.request(mallPlatformApi.delBanner, {id: record.id, act_type: act_type}).then((res) => {
                            console.log(res)
                            this.refreshBannerList(this.cur_record, this.cur_type)
                        })
                    },
                    onCancel() {
                        console.log('Cancel')
                    },
                    class: 'test',
                })
            },
            handleSubmit(e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values)
                    }
                })
            },
            // 添加图片
            uploadCallback(e) {
                const {max} = this
                const {name} = e
                let list = this.formData.goods_img.concat(e.list)
                this.$set(this.formData, name, list.slice(-max))
            },
            // 点击+ 添加轮播图片
            chooseImage() {
                this.$refs.chooseImage.openDialog()
            },
            callBack(val) {
                // console.log(val)
                this.imageList = val.list
            },
            // 从功能库选择
            choosePower() {
                this.$LinkBases({
                    // visible: true,
                    source: 'platform', // 必填
                    type: 'h5', // 必填
                    // 确定按钮
                    handleOkBtn: (res) => {
                        // 点击按钮事件
                        console.log('handleOk', res)
                        this.swipper_url = res.url
                        this.$nextTick(() => {
                            //链接库动态赋值
                            this.form.setFieldsValue({
                                url: this.url,
                            })
                        })
                    },
                    // handleCancelBtn: () => {
                    //   console.log('handleCancel')
                    // }
                })
            },
        },
    }
</script>
<style scoped>
    .keywords {
        width: 300px;
    }

    .link-btn.ant-btn {
        padding: 0 4px;
    }

    .flex-direction {
        flex-direction: column;
    }

    .lunbo-list {
        height: 400px;
        border-right: 1px solid #eeeeee;
        overflow-y: scroll;
    }
</style>