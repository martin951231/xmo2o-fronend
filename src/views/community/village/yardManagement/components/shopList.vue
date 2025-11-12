<template>
    <div class="shop_list">
        <div class="header_search">
            <div class="search_item">
                <label class="label_title">店铺名称：</label>
                <a-input style="width:200px;" placeholder="请输入搜索条件" v-model="pageInfo.m_name" />
            </div>
            
            <div class="search_item" style="margin-left: 20px;" v-if="clearTime">
                <label class="label_title">日期：</label>
                <a-range-picker @change="ondateChange" />
            </div>
            
            <div class="search_item" style="margin-left: 10px;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;"  @click="clearThis()">清空</a-button>
            </div>
        </div>
        
        <div class="header_search" style="padding-top: 0;">
            <a-button type="primary" @click="addThis" v-if="role_addstore==1">添加店铺</a-button>
        </div>
        
        <div class="table_content">
            <a-table :columns="columns" 
            :row-key="record=>record.m_id" :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="shopList">
                <span slot="ercode" slot-scope="text, record">
                    <a @click="lookErcode(record)">查看二维码</a>
                </span>
                <span slot="add_time" slot-scope="text, record">
                    <span>{{record.add_time*1000 | dateFormat}}</span>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="editThis(record)" v-if="role_editstore==1">编辑</a>
                    <a-divider type="vertical" v-if="role_managecoupon==1" />
                    <a @click="lookCoupon(record)" v-if="role_managecoupon==1">优惠券管理</a>
                    <a-divider type="vertical" v-if="role_delstore==1" />
                    <a-popconfirm v-if="role_delstore==1" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <shop-model :shop_id="shop_id" :shop_type="shop_type" :visible="shopVisible" :modelTitle="modelTitle" @closeShop="closeShop"/>
            <choose-coupon :m_id="mm_id" :visible="couponVisible" :modelTitle="modelTitle" :can_send_coupon="can_send_coupon" @closeCoupon="closeCoupon"/>
        </div>
        
        <a-modal title="查看二维码" :width="500" :visible="erCodeVisible"
            @cancel="handleCodeCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img style="width: 150px; height: 150px;" :src="ercodeUrl">
            </div>
        </a-modal>
    </div>
</template>

<script>
    import shopModel from './shopModel.vue';
    import chooseCoupon from './chooseCoupon.vue';
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '店铺名称',
            dataIndex: 'm_name',
            key: 'm_name',
        },
        {
            title: '店铺管理二维码',
            key: 'ercode',
            scopedSlots: {
                customRender: 'ercode'
            },
        },
        {
            title: '添加时间',
            key: 'add_time',
            scopedSlots: {
                customRender: 'add_time'
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 120
        },
        {
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
                columns,
                shopVisible: false,
                modelTitle: '',
                couponVisible: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    date: '',
                    m_name: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                shop_type: 'add',
                shop_id: '',
                shopList: [],
                frequency: false,
                erCodeVisible: false,
                ercodeUrl: '',
                mm_id: '',
                clearTime: true,
                role_addstore:0,
                role_delstore:0,
                role_editstore:0,
                role_managecoupon:0,
                can_send_coupon:0,
            }
        },
        
        filters: {
            dateFormat: function(dateStr) {
                var dt = new Date(dateStr)
                var y = dt.getFullYear()
                var m = (dt.getMonth() + 1).toString().padStart(2,'0')
                var d = dt.getDate().toString().padStart(2,'0')
                var hh = dt.getHours()
                var mm = dt.getMinutes().toString().padStart(2,'0')
                var ss = dt.getSeconds().toString().padStart(2,'0')
                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
            }
        },
        
        components: {
            shopModel,
            chooseCoupon
        },
        
        mounted(){
            this.getShopList()
        },

        methods: {
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
                this.getShopList()
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
                    pageSize: 20,
                    total: 0,
                    date: '',
                    m_name: ''
                }
                this.getShopList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getShopList()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getShopList()
            },
            
            getShopList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getParkShopList, that.pageInfo).then((res) => {
                    that.shopList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                    if(res.role_addstore != undefined){
                        this.role_addstore=res.role_addstore ;
                        this.role_delstore=res.role_delstore ;
                        this.role_editstore=res.role_editstore ;
                        this.role_managecoupon=res.role_managecoupon ;
                    }else{
                      this.role_addstore=1;
                      this.role_delstore=1;
                      this.role_editstore=1;
                      this.role_managecoupon=1;  
                    }
                    if(res.can_send_coupon != undefined){
                        this.can_send_coupon=res.can_send_coupon;
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
                this.shop_id = record.m_id+''
                this.modelTitle = '编辑店铺'
                this.shop_type = 'edit'
                this.shopVisible = true
            },
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.del_park_shop, {m_id:record.m_id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.getShopList()
                })
            },
            
            delCancel() {

            },

            closeShop(flag){
                this.shop_id = ''
                this.shopVisible = false
                if(flag){
                    this.getShopList()
                }
            },
            
            addThis(){
                this.shop_type = 'add'
                this.modelTitle = '添加店铺'
                this.shopVisible = true
            },
            
            lookCoupon(record){
                this.mm_id = record.m_id+''
                this.couponVisible = true
            },
            
            closeCoupon(){
                this.mm_id = ''
                this.couponVisible = false
            },
            
            lookErcode(record){
                let that = this
                that.request(villageApi.getQrcodeShop, {m_id: record.m_id}).then((res) => {
                    that.ercodeUrl = res.qrcode
                    that.erCodeVisible = true
                })
            },
            handleCodeCancel(){
                this.ercodeUrl = ''
                this.erCodeVisible = false
            }
        },
    }
</script>

<style lang="less" scoped>
    .shop_list {
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
