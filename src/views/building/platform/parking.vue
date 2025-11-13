<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-table style="background: #ffffff;margin-top: 20px" :columns="columns" rowKey="id" :data-source="dataList">
            <span slot="icon" slot-scope="text,item">
                <img :src="item.icon" alt="" style="height: 45px" />
            </span>
            <!-- 操作栏 -->
            <span slot="operate" slot-scope="text,item">
                <a @click="setCouponConfig(item)">{{ L('设置') }}</a>
            </span>
        </a-table>

        <!-- 设置 -->
        <a-modal :title="modalTitle" width="45%" v-model="modalVisible" @ok="submitModal">
            <a-table :columns="benefitColumns" rowKey="id" :data-source="listItem.benefits"
                :row-selection="rowBenefitSelection" v-if="listItem">
                <span slot="icon" slot-scope="text,item">
                    <img :src="item.icon" alt="" style="height: 45px" />
                </span>
                <!-- 操作栏 -->
                <span slot="coupon_name" slot-scope="text,item">
                    <span class="mr-20">
                        {{ item.coupon_name }}
                        <a-tooltip placement="top" v-if="item.coupon_valid_msg">
                            <template slot="title">
                                <span>{{item.coupon_valid_msg}}</span>
                            </template>
                            <a-icon type="exclamation-circle" style="color: red;"/>
                        </a-tooltip>
                    </span>

                    <a v-if="item.type == 2" @click="select(item)">{{ L('选择') }}</a>
                </span>
            </a-table>
        </a-modal>

        <!-- 优惠券列表 -->
        <a-modal :title="L('优惠券列表')" width="45%" v-model="couponListVisible" @ok="couponOk">
            <a-table :columns="couponColumns" rowKey="coupon_id" :data-source="couponList"
                :row-selection="rowSelection">
                <span slot="coupon_type" slot-scope="text,item">
                    <span v-if="item.coupon_type == 1">{{ L('时长类型') }}</span>
                    <span v-else-if="item.coupon_type == 2">{{ L('金额类型') }}</span>
                    <span v-else-if="item.coupon_type == 3">{{ L('优惠百分比类型') }}</span>
                </span>
            </a-table>
        </a-modal>
    </div>
</template>

<script>
import buildingPlatformApi from '@/api/building/index'

export default {
    components: {},
    data() {
        return {
            modalTitle: '停车优惠设置',
            modalVisible: false,
            mall_id: 0,
            dataList: [], // 列表
            columns: [
                {
                    title: this.L('ID'),
                    dataIndex: 'id',
                },
                {
                    title: this.L('等级名称'),
                    dataIndex: 'lname'
                },
                {
                    title: this.L('等级级别'),
                    dataIndex: 'level'
                },
                {
                    title: this.L('icon'),
                    dataIndex: 'icon',
                    scopedSlots: {
                        customRender: 'icon',
                    },
                },
                {
                    title: this.L('会员权益'),
                    dataIndex: 'parking_config_txt',
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'operate',
                    scopedSlots: {
                        customRender: 'operate',
                    },
                },
            ],
            benefitColumns: [
                {
                    title: this.L('权益名称'),
                    dataIndex: 'title',
                },
                {
                    title: this.L('图标'),
                    dataIndex: 'icon',
                    scopedSlots: {
                        customRender: 'icon',
                    },
                },
                {
                    title: this.L('说明'),
                    dataIndex: 'description',
                },
                {
                    title: this.L('优惠券名称'),
                    dataIndex: 'coupon_name',
                    scopedSlots: {
                        customRender: 'coupon_name',
                    },
                },
            ],
            listItem: {},
            couponListVisible: false,
            couponColumns: [
                {
                    title: this.L('停车场名称'),
                    dataIndex: 'park_name',
                },
                {
                    title: this.L('优惠券名称'),
                    dataIndex: 'coupon_name',
                },
                {
                    title: this.L('优惠券类型'),
                    dataIndex: 'coupon_type',
                    scopedSlots: {
                        customRender: 'coupon_type',
                    },
                },
                {
                    title: this.L('优惠券面额'),
                    dataIndex: 'coupon_quota',
                },
                {
                    title: this.L('单张售价'),
                    dataIndex: 'coupon_buy_price',
                },
            ],
            couponList: [],
            selectedRowKeys: [],
            benefitSelectedRowKeys: [],
            benefitItem: {},
            benefits: {},
        }
    },
    mounted() {
        let loginMallId = sessionStorage.getItem("login_mall_id");
        if (typeof loginMallId != 'undefined' && loginMallId > 0) {
            this.mall_id = loginMallId;
            this.getLists();
        } else {
            this.$message.error(this.L('商场获取失败'));
            return;
        }
    },
    computed: {
        // 权益选择操作
        rowBenefitSelection() {
            return {
                selectedRowKeys: this.benefitSelectedRowKeys,
                onChange: this.onBenefitChange,
            }
        },
        // 优惠券选择操作
        rowSelection() {
            return {
                type: 'radio',
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onRowChange,
            }
        },
    },
    methods: {
        // 数据列表
        getLists() {
            let queryParams = {
                mall_id: this.mall_id
            }
            this.request(buildingPlatformApi.getUserLevels, queryParams).then((res) => {
                this.dataList = res
            })
        },

        //获取优惠券列表
        getBuildingSystemCoupon() {
            this.request('/building/platform.ShoppingMall/getBuildingSystemCoupon', { mall_id: this.mall_id }).then((res) => {
                this.couponList = res.coupon_list
            })
        },

        setCouponConfig(item) {
            this.listItem = JSON.parse(JSON.stringify(item));
            this.benefits = {}
            this.benefitSelectedRowKeys = []
            if (item.benefits) {
                item.benefits.forEach((item) => {
                    if (item.is_checked) {
                        this.benefitSelectedRowKeys.push(item.id)
                        if (item.coupon_id) {
                            this.benefits[item.id] = item.coupon_id
                        }
                    }
                })
            }
            this.modalTitle = item.lname + '编辑会员权益';
            this.modalVisible = true;
            this.getBuildingSystemCoupon();
        },
        select(item) {
            this.benefitItem = item
            if (this.benefits[item.id]) {
                this.selectedRowKeys = [this.benefits[item.id]]
            } else {
                this.selectedRowKeys = []
            }
            this.couponListVisible = true;
        },
        onBenefitChange(selectedRowKeys) {
            this.benefitSelectedRowKeys = selectedRowKeys
        },
        //优惠券单选
        onRowChange(selectedRowKeys) {
            this.benefits[this.benefitItem.id] = selectedRowKeys[0];
            this.selectedRowKeys = selectedRowKeys
        },
        couponOk() {
            if (this.selectedRowKeys.length == 0) {
                this.$message.error('请选择优惠券');
                return;
            }
            const index = this.listItem.benefits.findIndex(v=>v.id == this.benefitItem.id)
            if(index > -1){
                const couponListitem = this.couponList.find((v) => v.coupon_id == this.selectedRowKeys[0])
                if(couponListitem){
                    this.listItem.benefits[index].coupon_name = couponListitem.coupon_name
                    if(couponListitem.coupon_name != this.listItem.benefits[index].coupon_name){
                        this.listItem.benefits[index].coupon_valid_msg = ''
                    }
                }
            }
            this.couponListVisible = false;
        },
        submitModal() {
            if (this.benefitSelectedRowKeys.length == 0) {
                this.$message.error('请选择权益');
                return;
            }
            let postParams = {
                mall_id: this.mall_id,
                level: this.listItem.level,
                benefits: [],
            }
            this.benefitSelectedRowKeys.forEach((item) => {
                let couponListitem = this.couponList.find((v) => v.coupon_id == this.benefits[item])
                const benefits = this.listItem.benefits.find(v=>v.id == item)
                if(benefits && benefits.coupon_data && benefits.coupon_data.coupon_id == this.benefits[item]){
                    couponListitem = benefits.coupon_data
                    // console.log('回显一致');
                }
                if (this.benefits[item]) {
                    postParams.benefits.push({
                        id: item,
                        coupon_id: this.benefits[item],
                        coupon_name: couponListitem ? couponListitem.coupon_name : '',
                        merchant_id: couponListitem ? couponListitem.merchant_id : 0,
                        coupon_data: couponListitem ? couponListitem : '',
                    })
                } else {
                    postParams.benefits.push({
                        id: item,
                        coupon_id: 0,
                        coupon_name: '',
                        coupon_data: '',
                    })
                }
            })
            this.request(buildingPlatformApi.saveParkingDiscount, postParams).then((res) => {
                this.$message.success('保存成功！')
                this.getLists()
                this.modalVisible = false;
            })
        },
    },
}
</script>