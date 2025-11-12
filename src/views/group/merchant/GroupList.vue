<template>
    <!-- 团购商品列表 -->
    <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
        <template>
            <div class="mb-10">
                <a-form layout="inline">
                    <div class="flex search-content">
                  
                        <div class="right flex">
                            <div>
                                <a-form-item label="商品类型:">
                                    <a-select v-model="queryParam.group_cate" style="width: 120px" placeholder="商品类型">
                                        <a-select-option value="">全部</a-select-option>
                                        <a-select-option value="normal">团购商品</a-select-option>
                                        <a-select-option value="booking_appoint">场次预约</a-select-option>
                                        <a-select-option value="cashing">代金券</a-select-option>
                                        <a-select-option value="course_appoint">课程预约</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item label="运行状态:">
                                    <a-select v-model="queryParam.is_running" style="width: 120px" placeholder="运行状态">
                                        <a-select-option value="-1">
                                            全部
                                        </a-select-option>
                                        <a-select-option value="1">
                                            进行中
                                        </a-select-option>
                                        <a-select-option value="0">
                                            已结束
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item label="团购状态:">
                                    <a-select v-model="queryParam.status" style="width: 120px" placeholder="团购状态">
                                        <a-select-option value="-1">
                                            全部
                                        </a-select-option>
                                        <a-select-option value="1">
                                            开启
                                        </a-select-option>
                                        <a-select-option value="0">
                                            关闭
                                        </a-select-option>
                                        <a-select-option value="2">
                                            审核中
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-input
                                            v-model="queryParam.keyword"
                                            placeholder="输入商品名称/标题"
                                            style="width: 200px"
                                    />
                                </a-form-item>
                            </div>
                            <div>
                                <a-button icon="search" @click="searchBtn()" style="margin-right: 15px">
                                    查询
                                </a-button>
                                <a-button type="primary" icon="plus" @click="addGoods()">
                                    添加商品
                                </a-button>
                            </div>
                        </div>
                    </div>
                </a-form>
            </div>

        </template>
        <a-card :bordered="false" class="card-wrap">
            <div class="message-suggestions-list-box">

                <a-table
                        :columns="columns"
                        :data-source="data"
                        class="components-table-demo-nested"
                        :pagination="pagination"
                        rowKey="group_id"
                        :loading="loading"
                >
          <span slot="status_str" slot-scope="text, record">
            <a-badge :status="record.status==1 ? 'success' : 'default'" :text="text"/>
          </span>
                    <span slot="is_running_str" slot-scope="text, record">
            <a-badge :status="record.is_running==1 ? 'success' : 'default'" :text="text"/>
          </span>
                    <span slot="begin_time" slot-scope="text, record">
            <div>开始时间：{{record.begin_time}}</div>
            <div>结束时间：{{record.end_time}}</div>
            <div v-if="record.effective_type == 0">有效期：{{record.deadline_time}}</div>
            <div v-if="record.effective_type != 0">领取后{{record.deadline_time}}天内有效</div>
          </span>
                    <span slot="sale_count" slot-scope="text, record">
            <div>售出：{{record.sale_count}}</div>
            <div>商品总数：{{record.count_num == -1 || record.count_num == 0 ? '无限制' : record.count_num}}</div>
            <div>虚拟：{{record.virtual_num}}</div>
          </span>
          <span slot="detail_url" slot-scope="text">
            <a v-if="text !== ''" @click="$refs.SeeH5QrcodeModal.showModal(text)" class="ant-btn-link pointer">查看二维码</a>
            <a v-else class="ant-btn-link pointer">--</a>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="edit(record.group_cate,record.group_id)">编辑</a>
            <a-divider type="vertical"/>
            <a :href="replyUrl+record.group_id" target="_blank">评论列表</a>
            <a-divider type="vertical"/>
            <router-link :to="{ path: '/merchant/merchant.group/orderList?group_id='+record.group_id }" slot="groupOrderList">
              <a>订单列表</a>
            </router-link>
            <a-divider v-if="record.group_cate == 'normal'" type="vertical"/>
            <a v-if="record.group_cate == 'normal'" @click="selectStore(record.group_id)" class="ant-btn-link pointer">设置推荐</a>
          </span>
                </a-table>

            </div>
            <select-group-cate ref='selectGoupCate'/>
            <see-h5-qrcode ref="SeeH5QrcodeModal"/>
            <choose-store-by-group :visible.sync="selectStoreVisible" :storeIdArr="storeIds" :groupId="groupId"
                                   @submit="onStoreSelect"/>
        </a-card>
    </div>
</template>

<script>
    import groupMerchantApi from '@/api/group/merchant'
    import SelectGroupCate from '../modules/SelectGroupCate.vue';
    import ChooseStoreByGroup from '../modules/ChooseStoreByGroup.vue';
    import SeeH5Qrcode from '@/views/common/qrcode/SeeH5Qrcode.vue'

    const data = []

    export default {
        name: 'OrderList',
        components: {
            SelectGroupCate,
            SeeH5Qrcode,
            ChooseStoreByGroup
        },
        data() {
            this.cacheData = data.map((item) => ({...item}))
            return {
                form: this.$form.createForm(this),
                mdl: {},
                selectStoreVisible: false,
                loading: true,
                id: 1,
                search_data: [],
                // 查询参数
                queryParam: {
                    status: '-1',
                    is_running: '-1',
                    group_cate: ''
                },
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    showSizeChanger: true,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageSizeChange,
                    showTotal: (total) => `共 ${total} 条记录`,
                },
                // 表头
                columns: [
                    {
                        title: 'ID',
                        width: 80,
                        dataIndex: 'group_id',
                    },
                    {
                        title: '类型',
                        width: 90,
                        dataIndex: 'group_cate_name',
                    },
                    {
                        title: '名称',
                        width: 150,
                        dataIndex: 's_name',
                    },
                    {
                        title: '价格',
                        width: 70,
                        dataIndex: 'price',
                    },
                    {
                        title: '销售概况',
                        width: 120,
                        dataIndex: 'sale_count',
                        scopedSlots: {
                            customRender: 'sale_count',
                        },
                    },
                    {
                        title: '时间',
                        width: 200,
                        dataIndex: 'begin_time',
                        scopedSlots: {
                            customRender: 'begin_time',
                        },
                    },
                    {
                        title: '查看数',
                        width: 80,
                        dataIndex: 'hits',
                    },
                    {
                        title: '评论数',
                        width: 80,
                        dataIndex: 'reply_count',
                    },
                    {
                        title: '二维码',
                        width: 110,
                        dataIndex: 'detail_url',
                        scopedSlots: {
                            customRender: 'detail_url',
                        },
                    },
                    {
                        title: '运行状态',
                        width: 100,
                        dataIndex: 'is_running_str',
                        scopedSlots: {
                            customRender: 'is_running_str',
                        },
                    },
                    {
                        title: '团购状态',
                        width: 100,
                        dataIndex: 'status_str',
                        scopedSlots: {
                            customRender: 'status_str',
                        },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: 250,
                        scopedSlots: {
                            customRender: 'action',
                        },
                    },
                ],
                data,
                groupId: 0,
                storeIds: [],
                replyUrl: '/merchant.php?c=Message&a=group_reply&group_id='
            }
        },

        watch: {
            $route() {
                this.queryParam = {
                    status: '-1',
                    is_running: '-1',
                    group_cate: '',
                    keyword: ''
                }
                this.initList()
            },
        },
        mounted() {
            this.initList()
        },
        methods: {
            // 点击查询按钮
            searchBtn() {
                this.page = 1
                this.pagination.current = this.page
                this.getGoodsList()
            },

            // 获取列表信息
            initList() {
                this.getGoodsList()
            },
            // 获取列表信息
            getGoodsList() {
                this.queryParam['page'] = this.page
                this.loading = true
                if (groupMerchantApi.getGoodsList) {
                    this.request(groupMerchantApi.getGoodsList, this.queryParam).then((res) => {
                        this.loading = false
                        this.data = res.list
                        this.pagination.total = res.total
                    })
                }
            },
            addGoods() {
                this.$refs.selectGoupCate.open()
            },
            // 编辑商品
            edit(groupCate, groupId) {
                switch (groupCate) {
                    case 'normal': // 团购商品
                        this.$router.push({
                            path: '/merchant/merchant.group/goodsEdit', query: {
                                group_id: groupId
                            }
                        })
                        break;
                    case 'booking_appoint': // 场次预约
                        this.$router.push({
                            path: '/merchant/merchant.group/bookingAppoint', query: {
                                group_id: groupId
                            }
                        })
                        break;
                    case 'cashing':// 代金券
                        this.$router.push({
                            path: '/merchant/merchant.group/goodsCashingEdit', query: {
                                group_id: groupId
                            }
                        })
                        break;
                    case 'course_appoint':// 课程预约
                        this.$router.push({
                            path: '/merchant/merchant.group/courseAppoint', query: {
                                group_id: groupId
                            }
                        })
                        break;
                }
            },
            // 表格中变动  这里只针对页面页数切换
            tableChange(e) {
                this.queryParam['pageSize'] = e.pageSize
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current
                    this.page = e.current
                    this.getGoodsList()
                }
            },
            // 点击设置推荐店铺
            selectStore(groupId) {
                this.groupId = groupId
                this.getStoreRecommend(groupId)
            },
            // 选择店铺后的回调
            onStoreSelect(info) {
                this.selectStoreVisible = false
                const {storeIds} = info

                // 设置推荐店铺
                this.setStoreRecommend(this.groupId, storeIds)
                this.storeIds = storeIds

            },
            // 设置推荐店铺
            setStoreRecommend(groupId, storeIdArr) {
                let param = {
                    group_id: groupId,
                    store_id_arr: storeIdArr,
                }
                this.request(groupMerchantApi.setStoreRecommend, param).then((res) => {
                    this.$message.success(this.L('设置成功'))
                })
            },
            // 设置推荐店铺
            getStoreRecommend(groupId) {
                let param = {
                    group_id: groupId,
                }
                this.request(groupMerchantApi.getStoreRecommend, param).then((res) => {
                    this.storeIds = res
                    this.selectStoreVisible = true
                })
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.page = page;
                this.$set(this.pagination, 'current', page)
                this.getGoodsList()
            },
            onPageSizeChange(page, pageSize) {
                this.page = 1;
                this.$set(this.pagination, 'current', 1)
                this.$set(this.pagination, 'pageSize', pageSize)
                this.$set(this.queryParam, 'pageSize', pageSize)
                this.queryParam['pageSize'] = pageSize
                this.getGoodsList()
            },
        },
    }
</script>

<style scoped>
    .detail-content >>> .ant-drawer-body {
        padding: 0;
    }

    .ant-table td {
        white-space: nowrap;
    }

    .goods-title {
        font-size: 20px;
        margin-right: 10px;
    }

    .search-content {
        justify-content: space-between;
        align-items: center;
    }

    .search-content .right {
        align-items: center;
    }

    .card-wrap.ant-card {
        overflow-x:auto;
    }
</style>
