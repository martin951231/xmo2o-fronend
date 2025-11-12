<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout>
                <a-layout-content
                        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                    <a-table :columns="columns"
                             :data-source="data"
                             :pagination="pagination"
                             @change="handleTableChange">
                            <span slot="use_limit" slot-scope="text">
                                <span class="height-30" v-if="text==0">
                                    仅外卖
                                </span>
                                <span class="height-30" v-else-if="text ==1">
                                    仅餐饮
                                </span>
                                <span class="height-30" v-else-if="text ==2">
                                    全部
                                </span>
                                <span v-else class="height-30">
                                    商城
                                </span>
                            </span>

                        <span slot="type" slot-scope="text">
                            <span class="height-30" v-if="text==0">
                                    新单
                                </span>
                                <span class="height-30" v-else-if="text ==1">
                                    满减
                                </span>
                                <span class="height-30" v-else-if="text ==2">
                                    配送
                                </span>
                        </span>

                        <span slot="full_money" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="reduce_money" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="is_share" slot-scope="text">
                                <span class="height-30" v-if="text ==0">
                                    不同享
                                </span>
                                <span v-else class="height-30">
                                    同享
                                </span>
                        </span>

                        <span slot="status" slot-scope="text">
                                <span class="height-30" v-if="text ==0">
                                    停用
                                </span>
                                <span v-else class="height-30">
                                    启用
                                </span>
                        </span>

                        <span slot="action" slot-scope="text,record">
                                <a class="label-sm blue" @click="discountEdit(record.id)"> 修改</a>
                                <a class="btn label-sm blue" style="margin-left: 10px;"
                                   @click="discountDel(record.id)">删除</a>
                        </span>
                        <template slot="title" slot-scope="currentPageData">
                            <a-row type="flex" justify="left" align="top">
                                <a-col :span="8" style="font-size:1.5rem">
                                    店铺优惠 <span style="font-size: 1rem;">(有效活跃整场活动气氛,吸引顾客下单购买)</span>
                                </a-col>
                                <a-col :span="15" class="text-right" style="text-align:right">
                                    <a-button type="primary" @click="discountAdd()">
                                        新增活动
                                    </a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-spin>

        <a-modal v-model="visible_staff" title="活动信息维护" :footer="null">
            <a-form v-bind="{ labelCol: { span: 7 }, wrapperCol: { span: 14 }, }" @submit="handleSubmit">
                <a-form-item label="适用业务">
                    <a-select v-model="formData.use_limit">
                        <a-select-option :value="0">
                            仅外卖
                        </a-select-option>
                        <a-select-option :value="1">
                            仅餐饮
                        </a-select-option>
                        <a-select-option :value="2">
                            全部
                        </a-select-option>
                        <a-select-option :value="3">
                            商城
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="优惠类型">
                    <a-select v-model="formData.type">
                        <a-select-option :value="0">
                            新单
                        </a-select-option>
                        <a-select-option :value="1">
                            满减
                        </a-select-option>
                        <!-- <a-select-option :value="2">
                            配送
                        </a-select-option> -->
                    </a-select>
                </a-form-item>

                <a-form-item label="优惠条件">
                    <a-input
                            v-decorator="[
                          'name',
                          { rules: [{ required: true, message: '请输入满足条件的金额' }] },
                        ]"
                            placeholder="请输入满足条件的金额"
                            v-model="formData.full_money"
                    >
                    </a-input>
                </a-form-item>

                <a-form-item label="优惠金额">
                    <a-input
                            v-decorator="[
                          'name',
                          { rules: [{ required: true, message: '请输入可优惠金额' }] },
                        ]"
                            placeholder="请输入可优惠金额"
                            v-model="formData.reduce_money"
                    >
                    </a-input>
                </a-form-item>

                <a-form-item label="同享规则">
                    <a-radio-group v-decorator="['radio-group']" v-model="formData.is_share">
                        <a-row>
                            <a-radio :value="1">
                                与限时优惠、店铺/分类折扣、会员优惠同享
                            </a-radio>
                        </a-row>
                        <a-row :style="{color:'red'}">
                            同享，则所有店铺优惠用户均可享用
                        </a-row>
                        <a-row>
                            <a-radio :value="0">
                                与限时优惠、店铺/分类折扣、会员优惠不同享
                            </a-radio>
                        </a-row>
                        <a-row :style="{color:'red'}">
                            不同享，则满减优惠（含新单，满减）用户不能享用，
                            其他店铺优惠（含限时优惠、店铺/分类折扣、会员优惠）正常享用
                        </a-row>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="使用状态">
                    <a-radio-group v-decorator="['radio-group']" v-model="formData.status">
                        <a-radio :value="0">
                            停用
                        </a-radio>
                        <a-radio :value="1">
                            启用
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 20, offset: 6 }">
                    <a-row type="flex" justify="center" align="top">
                        <a-col :span="4" class="text-left">
                            <a-button type="default" @click="hidelModel()">
                                取消
                            </a-button>
                        </a-col>
                        <a-col :span="6" class="text-center">
                            <a-button type="primary" html-type="submit">
                                保存
                            </a-button>
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import mallMerchantApi from '@/api/merchant/store'
    import ARow from "ant-design-vue/es/grid/Row";

    const columns = [
        {
            title: '序号',
            dataIndex: 'id'
        },
        {
            title: '适用业务',
            dataIndex: 'use_limit',
            scopedSlots: {customRender: 'use_limit'},
        },
        {
            title: '类别',
            dataIndex: 'type',
            scopedSlots: {customRender: 'type'},
        },
        {
            title: '满足金额',
            dataIndex: 'full_money',
            scopedSlots: {customRender: 'full_money'},
        },
        {
            title: '优惠金额',
            dataIndex: 'reduce_money',
            scopedSlots: {customRender: 'reduce_money'},
        },
        {
            title: '是否与限时优惠、店铺/分类折扣、会员优惠同享',
            dataIndex: 'is_share',
            scopedSlots: {customRender: 'is_share'},
        },
        {
            title: '使用状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        components: {ARow},
        data() {
            return {
                spinning: false,
                data: [],
                visible_staff: false,
                store_id: '',
                site_url: '',
                pagination: {},
                queryParam: {
                    page: 1,
                    store_id: "",
                },
                formData: {
                    id: '',
                    use_limit: 0,
                    type: 0,
                    full_money: 0,
                    reduce_money: 0,
                    is_share: 0,
                    status: 0,
                    store_id: '',
                },
                columns,
            };
        },
        watch: {
            $route(val) {
                if (val.path == '/merchant/store.merchant/StoreDiscount') {
                    this.store_id =val.query.store_id
                    this.formData.store_id =val.query.store_id
                    this.getLists()
                }
            }
        },
        mounted() {
            this.store_id = this.$route.query.store_id
            this.formData.store_id = this.$route.query.store_id
            this.getLists()
        },
        methods: {
            getLists() {
                // Object.assign(this.$data, this.$options.data.call(this))
                this.queryParam['page'] = 1
                this.queryParam['store_id'] = this.store_id
                this.data = []
                this.request(mallMerchantApi.storeDiscount, this.queryParam).then((res) => {
                    this.site_url = res.site_url
                    this.data = res.list
                    this.pagination.total = res.count
                    this.queryParam['page'] += 1
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getLists()
                }
            },
            handleSubmit(e) {
                e.preventDefault()
                this.request(mallMerchantApi.discountAdd, this.formData).then((res) => {
                    this.getLists()
                    this.visible_staff = false
                    this.formData.id = ""
                })
            },
            hidelModel() {//隐藏店员编辑框
                this.visible_staff = false
            },
            discountEdit(id) {//修改店员信息
                let param = {
                    'id': id,
                    'store_id': this.store_id
                }
                this.request(mallMerchantApi.discountMsg, param).then((res) => {
                    this.formData.id = res.list.id
                    this.formData.use_limit = res.list.use_limit
                    this.formData.type = res.list.type
                    this.formData.full_money = res.list.full_money
                    this.formData.reduce_money = res.list.reduce_money
                    this.formData.is_share = res.list.is_share
                    this.formData.status = res.list.status
                    this.formData.store_id = res.list.store_id

                    this.visible_staff = true
                })
            },
            discountDel(id) {//店员删除
                this.$confirm({
                    title: '是否确定删除该优惠?',
                    centered: true,
                    onOk: () => {
                        let param = {
                            'id': id,
                            'store_id': this.store_id
                        }
                        this.request(mallMerchantApi.discountDel, param).then((res) => {
                            this.getLists()
                            this.$message.success('操作成功！')
                        })
                    },
                    onCancel() {
                    },
                })
            },
            discountAdd() {
                this.formData.id = ''
                this.formData.use_limit = 0
                this.formData.type = 0
                this.formData.full_money = 0
                this.formData.reduce_money = 0
                this.formData.is_share = 0
                this.formData.status = 0

                this.visible_staff = true
            }
        },
    };
</script>

<style scoped>
    th.column-money,
    td.column-money {
        text-align: right !important;
    }

    .label-sm {
        color: green;
    }

    .label-sm.blue {
        color: #1890ff !important;
    }
</style>