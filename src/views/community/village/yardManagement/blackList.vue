<template>
    <div class="black_list">
        <div class="header_search">
            <a-collapse accordion>
                <a-collapse-panel key="1" header="操作说明">
                    被加入黑名单的用户，任何情况下，无法进入停车场，如需取消黑名单，操作移除黑名单
                </a-collapse-panel>
            </a-collapse>
        </div>
        
        <div class="search_item" style="margin-left: 20px;">
            <label class="label_title">车牌号：</label>
            <a-input style="width: 200px;" placeholder="请输入车牌号" v-model="pageInfo.car_number" />
            <label class="label_title" style="margin-left: 20px;">车主姓名：</label>
            <a-input style="width: 200px;" placeholder="请输入车主姓名" v-model="pageInfo.user_name" />
            <a-button type="primary" style="margin-left: 10px;" @click="queryThis()">查询</a-button>
            <a-button style="margin-left: 10px;" @click="clearThis()">清空</a-button>
        </div>
        
        <div class="header_search" style="padding-top: 0; margin-top: 10px;">
            <a-button type="primary" @click="addThis" v-if="role_addblack==1">添加</a-button>
        </div>
        
        <div class="table_content">
            <a-table :columns="columns" 
                :row-key="record=>record.id" :pagination="pageInfo" :loading="tableLoadding"
                @change="handleTableChange" :data-source="blackList">
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="editThis(record)" v-if="role_editblack==1">编辑</a>
                    <a-divider type="vertical" v-if="role_editblack==1 && role_delblack==1" />
                    <a-popconfirm v-if="role_delblack==1" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <black-model :black_id="black_id" :black_type="black_type" :visible="blackVisible" :modelTitle="modelTitle" @closeBlack="closeBlack"/>
        </div>
    </div>
</template>

<script>
    import blackModel from './components/blackModel.vue';
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '车牌号码',
            dataIndex: 'car_number',
            key: 'car_number',
        },
        {
            title: '车主姓名',
            dataIndex: 'user_name',
            key: 'user_name',
            width: 200
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '添加时间',
            dataIndex: 'addTime',
            key: 'addTime',
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
                parklotName: '',
                columns,
                blackVisible: false,
                modelTitle: '',
                pageInfo: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    page:1,
                    car_number: '',
                    user_name: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                blackList: [],
                black_type: 'add',
                black_id: '',
                role_addblack:0,
                role_delblack:0,
                role_editblack:0,
            }
        },
        
        components: {
            blackModel
        },
        
        mounted(){
            this.getBlackList()
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
                this.getBlackList()
            },
            
            clearThis(){
                this.pageInfo = {
                    car_number: '',
                    user_name: '',
                    current: 1,
                    page: 1,
                    pageSize: 20,
                    total: 0
                }
                this.getBlackList()
            },
            
            editThis(record){
                this.black_type = 'edit'
                this.modelTitle = '编辑黑名单'
                this.blackVisible = true
                this.black_id = record.id + ''
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getBlackList()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getBlackList()
            },
            
            getBlackList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getBlackCar, that.pageInfo).then((res) => {
                    that.blackList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                    if (res.role_addblack != undefined) {
                        this.role_addblack=res.role_addblack;
                        this.role_delblack=res.role_delblack;
                        this.role_editblack=res.role_editblack;
                    } else {
                        this.role_addblack=1;
                        this.role_delblack=1;
                        this.role_editblack=1;
                    }
                    
                })
            },
            
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.delBlackCar, {black_id: record.id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.getBlackList()
                })
            },
            
            delCancel() {

            },

            closeBlack(flag){
                this.black_id = ''
                this.blackVisible = false
                if(flag){
                    this.getBlackList()
                }
            },
            
            addThis(){
                this.black_type = 'add'
                this.modelTitle = '添加黑名单'
                this.blackVisible = true
            }
        },
    }
</script>

<style lang="less" scoped>
    .black_list {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            // display: flex;

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
