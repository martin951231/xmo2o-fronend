<template>
    <div class="buy_record">
        <div class="header_search">
            <div class="search_item">
                <a-select show-search placeholder="请选择搜索条件" style="width: 120px" :filter-option="filterOption"
                    @change="handleSelectChange" :value="pageInfo.param">
                    <a-select-option v-for="(item,index) in typeList" :value="item.key">
                        {{item.value}}
                    </a-select-option>
                </a-select>
                <a-input style="width:200px;" placeholder="请输入搜索条件" v-model="pageInfo.title" />
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
        
        <div class="table_content">
            <a-table :columns="columns" 
            :row-key="record=>record.m_id" :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="recordList">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle">
                    <a-icon type="smile-o" /> Name
                </span>
                <span slot="tags" slot-scope="tags">
                    <a-tag v-for="tag in tags" :key="tag"
                        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
                        {{ tag.toUpperCase() }}
                    </a-tag>
                </span>
            </a-table>
        </div>
    </div>
</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '优惠券名称',
            dataIndex: 'c_title',
            key: 'c_title',
            width: 200
        },
        {
            title: '购买店铺',
            dataIndex: 'm_name',
            key: 'm_name',
        },
        {
            title: '购买数量',
            dataIndex: 'buy_num',
            key: 'buy_num',
        },
        {
            title: '应收金额',
            dataIndex: 'receivable_money',
            key: 'receivable_money',
        },
        {
            title: '实收金额',
            dataIndex: 'paid_money',
            key: 'paid_money',
        },
        {
            title: '支付时间',
            dataIndex: 'add_time',
            key: 'add_time',
        },
    ];

    export default {
        data() {
            return {
                columns,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    param: '',
                    date: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                typeList: [{key: 'm_name', value: '店铺名称'}, {key: 'c_title', value: '优惠券名称'}],
                tableLoadding: false,
                recordList: [],
                frequency: false,
                clearTime: true
            }
        },
        
        mounted(){
            this.getRecordList()
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
                this.getRecordList()
            },
            clearThis(){
                this.clearTime = false
                let timeout = setTimeout(()=>{
                    this.clearTime = true
                    clearTimeout(timeout)
                }, 10) 
                this.pageInfo = {
                    page: 1,
                    title: '',
                    param: '',
                    current: 1,
                    pageSize: 20,
                    total: 0,
                    date: ''
                }
                this.getRecordList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getRecordList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getRecordList()
                console.log('onTableChange==>', page, pageSize)
            },
            getRecordList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getPayCouponsList, that.pageInfo).then((res) => {
                    that.recordList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            ondateChange(date, dateString) {
                this.pageInfo.date = dateString
                console.log(date, dateString);
            },
            
            handleSelectChange(value) {
                this.pageInfo.param = value
                this.$forceUpdate()
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
        },
    }
</script>

<style lang="less" scoped>
    .buy_record {
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
