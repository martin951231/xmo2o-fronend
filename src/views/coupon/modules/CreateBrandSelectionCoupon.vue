<template>
    <a-modal :title="title" :width="1000" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <template slot="footer">
            <a-button key="back" @click="handleCancel">取消</a-button>
        </template>
        <div>
            <a-tabs default-active-key="system" @change="callback">
                <a-tab-pane key="system" tab="平台优惠券">
                    <!--搜索栏-->
                    <a-form layout="inline" style="margin-bottom: 10px">
                        <a-row :gutter="24">
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
                    <a-spin :spinning="confirmLoading">
                        <a-table :columns="columns" :data-source="searchHotList" :pagination="pagination" @change="tableChange" rowKey="id" >
                            <template v-for="col in ['sort']" :slot="col" slot-scope="text, record, index">
                                <div :key="col">
                                    <template>
                                        {{ text }}
                                    </template>
                                </div>
                            </template>
                            <span slot="action" slot-scope="text, record">
                              <a @click="select_this(record)" v-if="record.is_choose == 0">选中</a>
                              <a style="color: #777777" @click="unselect_this(record)" v-if="record.is_choose == 1">取消</a>
                            </span>
                        </a-table>
                    </a-spin>
                </a-tab-pane>
                <a-tab-pane key="merchant" tab="商家优惠券" force-render>
                    <!--搜索栏-->
                    <a-form layout="inline" style="margin-bottom: 10px">
                        <a-row :gutter="24">
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
                    <a-spin :spinning="confirmLoading">
                        <a-table :columns="columns" :data-source="searchHotList" :pagination="pagination" @change="tableChange" rowKey="id" >
                            <template v-for="col in ['sort']" :slot="col" slot-scope="text, record, index">
                                <div :key="col">
                                    <template>
                                        {{ text }}
                                    </template>
                                </div>
                            </template>
                            <span slot="action" slot-scope="text, record">
                              <a @click="select_this(record)" v-if="record.is_choose == 0">选中</a>
                              <a style="color: #777777" @click="unselect_this(record)" v-if="record.is_choose == 1">取消</a>
                            </span>
                        </a-table>
                    </a-spin>
                </a-tab-pane>
            </a-tabs>
        </div>
    </a-modal>
</template>




<script>
  import couponPlatformApi from '@/api/coupon/platform';
  const searchHotList = [];
  export default {
    data() {
      return {
        title: '选择优惠券',
        searchHotList,
        queryParam:{
                    page:1,
                    pageSize:10,
                    keyword:'',
                    coupon_type:'system'
                },
                pagination: {
                    current: 1,
                    pageSize: 8,
                    total: 8,
                    'show-total': total => `共 ${total} 条记录`,
                },
        editingKey: '',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        detail: {
          id: 0,
          name: '',
          sort: 0,
          is_hot:'0'
        },
        id: '0',
      }
    },
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
        searchBtn() {
            this.page = 1
            this.pagination.current = this.page
            this.getSearchHotList()
        },
        callback(key) {
            this.queryParam.coupon_type = key;
            this.queryParam.page = 1;
            this.queryParam.keyword = '';
            this.pagination.current = 1;


            this.getSearchHotList();
        },
        select_this(record){
            console.log(record)
            record.is_choose=1;
            this.request(couponPlatformApi.addBrandCoupon,{coupon_id:record.coupon_id,coupon_type:record.coupon_type})
                .then((res) => {
                    this.$message.success('选中成功')
                })
        },
        unselect_this(record){
            console.log(record)
            record.is_choose=0;
            this.request(couponPlatformApi.delBrandCoupon,{coupon_id:record.coupon_id,coupon_type:record.coupon_type})
                .then((res) => {
                    this.$message.success('取消成功')
                })
        },
        getSearchHotList() {
            this.request(couponPlatformApi.chooseBrandSelectCoupon,this.queryParam)
                .then((res) => {
                    console.log('res', res)
                    this.searchHotList = res.list
                    this.pagination.total = res.total
                })
        },
        tableChange(e, filters, sorter) {
            // this.filteredInfo = filters;
            // this.sortedInfo = sorter;

            this.queryParam['pageSize'] = e.pageSize;
            if (e.current && e.current > 0) {
                this.queryParam['page'] = e.current;
                this.pagination.current = e.current
                this.getSearchHotList()
            }
        },
        handleCancel() {
            this.visible = false
            this.id = '0'
            this.form = this.$form.createForm(this)
            this.$emit('ok', {})
        },
      add() {
        this.visible = true
        this.id = '0'
        this.detail = {
          id: 0,
          name: '',
          sort: 0,
          is_hot:'0'
        }
      },
    },
  }
</script>
