<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">

        <a-card :bordered="false">
            <!--搜索栏-->
            <a-form layout="inline">
                <a-row :gutter="24">
                    <a-col>
                        <a-form-item label="品牌精选别称设置">
                            <a-input-group compact>
                                <a-input style="width: 235px" allow-clear v-model="couponMainBrandAlias" />
                            </a-input-group>

                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="saveConfig()" style="margin-right: 15px">保存</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" style="margin-top: 20px;margin-bottom: 20px">
                    <a-col>
                        <a-form-item label="券名称">
                            <a-input-group compact>
                                <a-input style="width: 235px" allow-clear v-model="queryParam.keyword" />
                            </a-input-group>

                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">查询</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>


            <a-button type="primary" @click="$refs.createModal.add()"  style="margin: 15px 20px 15px auto">添加券</a-button>
            <a-button class="icon_btn" @click="delete_brand_coupon()">删除</a-button>


            <a-table :columns="columns" :data-source="searchHotList" :pagination="pagination" @change="tableChange"   rowKey="id"  :row-selection="{ selectedRowKeys: selectedRowKeys,onChange: onSelectChange }">
                <template v-for="col in ['sort']" :slot="col" slot-scope="text, record, index">
                    <div :key="col">
                        <template>
                            {{ text }}
                        </template>
                    </div>
                </template>


                <span slot="action" slot-scope="text, record">
          <a-popconfirm class="ant-dropdown-link" title="确认删除?" ok-text="是" cancel-text="否" @confirm="deleteConfirm(record.id)"
                        @cancel="cancel">
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
            </a-table>
            <create-brand-selection-coupon ref="createModal" @ok="handleOk" />
        </a-card>
    </div>

</template>

<style type="text/css">
    .icon_btn {
        margin-right: 1rem;
        border-color: #1890ff;
        color: #1890ff;
    }
    .del_center{
        top:35%
    }
</style>

<script>
    import moment from 'moment'
    import couponPlatformApi from '@/api/coupon/platform';
    import CreateBrandSelectionCoupon from '../modules/CreateBrandSelectionCoupon.vue'
    const hotMap = {
        0: {
            status: 'default',
            text: '否'
        },
        1: {
            status: 'error',
            text: '是'
        }
    }
    const searchHotList = [];
    export default {
        name: 'SearchHotList',
        components: {
            CreateBrandSelectionCoupon
        },
        data() {
            this.cacheData = searchHotList.map(item => ({ ...item }));
            return {
                couponMainBrandAlias:'',
                sortedInfo: null,
                searchHotList,
                queryParam:{
                    page:1,
                    pageSize:10,
                    keyword:'',
                },
                pagination: {
                    pageSize: 10,
                    total: 10,
                    'show-total': total => `共 ${total} 条记录`,
                    'show-size-changer':true,
                    'show-quick-jumper':true
                },
                editingKey: '',
                selectedRowKeys: [],  //选中的行
            }
        },
        filters: {
            statusFilter (type) {
                return hotMap[type].text
            },
            statusTypeFilter (type) {
                return hotMap[type].status
            }
        },
        created() {},
        computed: {
            columns() {
                let {
                    sortedInfo,
                    filteredInfo
                } = this;
                sortedInfo = sortedInfo || {};
                filteredInfo = filteredInfo || {};
                const columns = [
                    {
                        title: '券名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '券类型',
                        dataIndex: 'coupon_type_name',
                    },
                    {
                        title: '使用类型',
                        dataIndex: 'cate_name',
                    },
                    {
                        title: '优惠金额',
                        dataIndex: 'discount',
                    },
                    {
                        title: '门槛条件金额',
                        dataIndex: 'order_money',
                    },
                    {
                        title: '上架有效期',
                        dataIndex: 'expire_date',
                    },
                    {
                        title: '库存',
                        dataIndex: 'stock_str',
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        scopedSlots: {
                            customRender: 'action'
                        }
                    }
                ];
                return columns;
            },
        },
        mounted() {
            this.getSearchHotList();
        },
        methods: {
            delete_brand_coupon() {
                if (this.selectedRowKeys.length < 1) {
                    this.$message.success('请选择一条记录')
                } else {
                    var that = this;
                    that.$confirm({
                        title: '确认删除选中记录？',
                        content: '',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                            that.request(couponPlatformApi.delBrandCoupon, {
                                'ids': that.selectedRowKeys
                            }).then((res) => {
                                that.getSearchHotList()
                                that.$message.success('删除成功')
                            })
                        },
                        onCancel() {
                        },
                    });
                }
            },
            onSelectChange(selectedRowKeys) {
                console.log(selectedRowKeys)
                this.selectedRowKeys = selectedRowKeys;
            },
            getSearchHotList() {
                this.getConfig();
                this.request(couponPlatformApi.getBrandSelectCoupon,this.queryParam)
                    .then((res) => {
                        console.log('res', res)
                        this.searchHotList = res.list
                        this.pagination.total = res.total
                    })
            },

            getConfig(){
                this.request(couponPlatformApi.getConfig,{str:'coupon_main_brand_select_alias'})
                    .then((res) => {
                        this.couponMainBrandAlias = res.coupon_main_brand_select_alias;
                    })
            },
            saveConfig(){
                if(this.couponMainBrandAlias == ''){
                    this.$message.success('品牌精选别称不能设置为空')
                }else{
                    var data = {coupon_main_brand_select_alias: this.couponMainBrandAlias};
                    this.request(couponPlatformApi.saveConfig, {'data':data})
                        .then((res) => {
                            this.$message.success('设置成功')
                            this.getConfig();
                        })
                }
            },
            searchBtn() {
                this.page = 1
                this.pagination.current = this.page
                this.getSearchHotList()
            },
            add() {

            },
            handleOk() {
                this.getSearchHotList()
            },
            deleteConfirm(id) {
                this.request(couponPlatformApi.delBrandCoupon, {
                    'ids': [id]
                })
                    .then((res) => {
                        this.getSearchHotList()
                        this.$message.success('删除成功')

                    })
            },
            cancel() {

            },// 表格中变动  这里只针对页面页数切换
            tableChange(e, filters, sorter) {
                // this.filteredInfo = filters;
                // this.sortedInfo = sorter;

                this.queryParam['pageSize'] = e.pageSize;
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current;
                    this.getSearchHotList()
                }
            },
            handleChange(value, key, column) {
                const newData = [...this.searchHotList];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target[column] = value;
                    this.searchHotList = newData;
                }
            },
            //编辑排序
            edit(key) {
                const newData = [...this.searchHotList];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = key;
                if (target) {
                    target.editable = true;
                    this.searchHotList = newData;
                }
            },
            //保存排序
            save(key) {
                const newData = [...this.searchHotList];
                const newCacheData = [...this.cacheData];
                const target = newData.filter(item => key === item.key)[0];
                const targetCache = newCacheData.filter(item => key === item.key)[0];
                if (target) {
                    delete target.editable;
                    this.searchHotList = newData;
                    // Object.assign(targetCache, target);
                    Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                    this.cacheData = newCacheData;
                }
                console.log(target);
                this.request(couponPlatformApi.saveWordsSort, {id:target.id,sort:target.sort})
                    .then((res) => {
                        this.getSearchHotList()
                    })
                this.editingKey = '';
            },
            //取消排序
            cancel(key) {
                const newData = [...this.searchHotList];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = '';
                if (target) {
                    Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.searchHotList = newData;
                }
                this.getSearchHotList()
            },
        }
    }
</script>

<style lang="less" scoped>
    .table-operator {
        margin-bottom: 24px;
    }
</style>
