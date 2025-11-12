<template>
    <div class="message-suggestions-list-box userList" >
        <div class="content-p1" >
            <div style="margin-bottom: 10px">
                <a-collapse accordion>
                    <a-collapse-panel key="1" header="操作说明">
                        <span style="font-weight:500 ">
                            1、展示的是当前{{$store.getters.config.house_name}}手机号唯一的业主 <br>
                            2、不同手机号业主对应的余额、关联{{$store.getters.config.room_name}}数、关联车位数  <br>
                            例如： 张三在平台注册了一个账号，手机号是 18312345678， 并且在该{{$store.getters.config.house_name}}1号楼和5号楼都是户主，对于{{$store.getters.config.house_name}}而言他仅仅是一个业主，只是拥有了多套房产（或车位），所以这里不会显示两条张三的信息。而且这个住户的余额就是张三在这个平台上的总余额 。 如果张三分别用两个手机号（18312345678、18387654321）注册了平台用户且分别绑定了该{{$store.getters.config.house_name}}的两个不同的{{$store.getters.config.room_name}}，那么这里就会显示两个张三的余额信息
                        </span>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        </div>
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">住户姓名：</p>
                        <a-input style="width: 70%" v-model="search.name" placeholder="请输入住户姓名"/>
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="24">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">手机号：</p>
                        <a-input style="width: 70%" v-model="search.phone" placeholder="请输入手机号"/>
                    </a-input-group>
                </a-col>
                <a-col :md="2" :sm="24">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="2" :sm="24">
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>
            </a-row>
        </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                :loading="loading"
        >

            <span slot="action" slot-scope="text, record">
                <a class="but_1" @click="$refs.balanceModel.add(record.pigcms_id)">增加/减少</a>
                <a class="but_1" @click="$refs.balanceListModel.List(record.uid)">余额记录</a>
                <a class="but_1" @click="$refs.orderListModel.List(record.uid)">消费记录</a>
            </span>
        </a-table>
        <balanceInfo ref="balanceModel" @ok="balanceInfo"/>
        <balanceList ref="balanceListModel" @ok="balanceListInfo"/>
        <orderList ref="orderListModel" @ok="orderInfo"/>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village';
    import balanceInfo from './balanceInfo_old';
    import balanceList from './balanceList_old';
    import orderList from './orderList_old';
    import { Collapse } from 'ant-design-vue';
	import store from '@/store';
    const columns = [
        { title: '住户姓名',  dataIndex: 'name', key: 'name'},
        { title: '手机号', dataIndex: 'phone', key: 'phone' },
        { title: '余额', dataIndex: 'now_money', key: 'now_money' },
        { title: '关联'+store.getters.config.room_name+'数', dataIndex: 'room_num', key: 'room_num' },
        { title: '关联车位数', dataIndex: 'position_num', key: 'position_num' },
        {title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' },},
    ];
    const data = [];
    export default {
        name: 'storageUserList_old',
        filters: {

        },
        components:{
            balanceInfo,
            balanceList,
            orderList,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data() {
            return {
                reply_content: '',
                pagination: {
                    current:1, 
                    pageSize: 10, 
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { name: '', phone: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                oldVersion: '',
            };
        },
        activated () {
            this.getList()
        },
        methods: {
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.pagination.current;
                this.search['limit'] = this.pagination.pageSize;
                this.request(villageApi.storageUserList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0;
                        this.data = res.list;
                        this.loading = false;
                        this.oldVersion = res.oldVersion
                    })
            },
            // 操作余额
            balanceInfo(val) {
                this.getList();
            },

            //余额记录
            balanceListInfo(){
                this.getList();
            },
            //消费记录
            orderInfo(val){
                this.getList();
            },

            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.pagination.current = 1
                this.pagination.pageSize = 10
                this.getList();
            },
            // 进行重置
            resetList() {
                this.search = {  name: '',phone: '', page: 1 };
                this.pagination.current = 1
                this.pagination.pageSize = 10
                this.getList();
            }
        }
    };
</script>
<style lang="less" scoped>

    /deep/ .but_1{
        margin-right: 10px;display: inline-block;
    }
    .content-p1{
        color: #52A5FF;font-weight: bold;padding: 10px 10px 0 10px;
    }
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 5px 20px 0;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    /deep/ .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    /deep/ .lbsf{
       float: right;margin-right: 24px;
    }
</style>