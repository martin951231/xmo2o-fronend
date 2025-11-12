<template>
    <div class="coupon_list">
        <div class="header_search">
            <div class="search_item">
                <label class="label_title">优惠券名称：</label>
                <a-input style="width:200px;" placeholder="请输入优惠券名称" v-model="pageInfo.c_title" />
            </div>
            
            <div class="search_item" style="margin-left: 20px;" v-if="clearTime">
                <label class="label_title">日期：</label>
                <a-range-picker @change="ondateChange" />
            </div>
            
            <div class="search_item" style="margin-left: 10px;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis()">清空</a-button>
            </div>
        </div>
        
        <div class="header_search" style="padding-top: 0;">
            <a-button type="primary" @click="addThis" v-if="role_addcoupon==1">添加优惠券</a-button>
        </div>
        
        <div class="table_content">
            <a-table :columns="columns" 
            :row-key="record=>record.c_id" :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="couponList">
                <template slot="status" slot-scope="text, record">
                    <a-switch checked-children="开启" un-checked-children="禁用" :checked="record.status==0 || record.status=='0' ? true:false" @change="(value)=>switchChange(value, record)" />
                </template>
                <span slot="action" slot-scope="text, record">
                    <a @click="editThis(record)" v-if="role_editcoupon==1" >编辑</a>
                    <a-divider type="vertical" v-if="role_delcoupon==1" />
                    <a-popconfirm v-if="role_delcoupon==1" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <coupon-add :coupon_type="coupon_type" :coupon_id="coupon_id" :visible="couponaddVisible" :modelTitle="modelTitle" @closeCouponAdd="closeCouponAdd"/>
        </div>
    </div>
</template>

<script>
    import couponAdd from './couponAdd.vue';
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '优惠券名称',
            dataIndex: 'c_title',
            key: 'c_title',
            width: 200
        },{
            title: '优惠券所属停车场',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },{
            title: '单价',
            dataIndex: 'c_price',
            key: 'c_price',
        },{
            title: '免费停车金额',
            dataIndex: 'c_free_price',
            key: 'c_free_price',
        },{
            title: '添加时间',
            dataIndex: 'add_time',
            key: 'add_time',
        },{
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 120
        },{
            title: '状态',
            dataIndex: 'status_txt',
            key: 'status_txt',
            scopedSlots: {
                customRender: 'status'
            },
        },{
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];
    export default {
        data() {
            return {
                parklotName: '',
                columns,
                modelTitle: '',
                couponaddVisible: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    date: '',
                    c_title: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                coupon_type: 'add',
                coupon_id: '',
                couponList: [],
                frequency: false,
                clearTime: true,
                role_addcoupon: 0,
                role_delcoupon: 0,
                role_editcoupon: 0,
            }
        },
        
        components: {
            couponAdd
        },
        
        mounted(){
            this.getcouponList()
        },

        methods: {
            switchChange(value, record){
                let that = this
                let id=record.c_id
                let status = value?0:1
                that.request('/community/village_api.Parking/editCouponStatus', {id, status}).then((res) => {
                    this.getcouponList()
                    this.$message.success('修改成功！')
                }).catch(e => {
                    this.getcouponList()
                })

            },
            queryThis(){
                if(this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(()=>{
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page = 1
                this.getcouponList()
            },
            clearThis(){
                this.clearTime = false
                let timeout = setTimeout(()=>{
                    this.clearTime = true
                    clearTimeout(timeout)
                }, 10) 
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    pageSize: this.pageInfo.pageSize,
                    total: 0,
                    date: '',
                    c_title: ''
                }
                this.getcouponList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getcouponList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getcouponList()
                console.log('onTableChange==>', page, pageSize)
            },
            getcouponList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getParkCouponsList, that.pageInfo).then((res) => {
                    that.couponList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                    if (res.role_addcoupon != undefined) {
                        this.role_addcoupon = res.role_addcoupon;
                        this.role_delcoupon = res.role_delcoupon;
                        this.role_editcoupon = res.role_editcoupon;
                    } else {
                        this.role_addcoupon = 1;
                        this.role_delcoupon = 1;
                        this.role_editcoupon = 1;
                    }
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            ondateChange(date, dateString) {
                this.pageInfo.date = dateString
                console.log(date, dateString);
            },
            editThis(record){
                this.coupon_id = record.c_id+''
                this.coupon_type = 'edit'
                this.modelTitle = '编辑优惠券'
                this.couponaddVisible = true
            },
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.del_park_coupons, {c_id: record.c_id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.getcouponList()
                })
            },
            
            delCancel() {

            },
            
            addThis(){
                this.coupon_type = 'add'
                this.modelTitle = '添加优惠券'
                this.couponaddVisible = true
            },
            
            closeCouponAdd(flag){
                this.coupon_id = ''
                this.couponaddVisible = false
                if(flag){
                    this.getcouponList()
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .coupon_list {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
            
            .operation_btn{
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
    
</style>
