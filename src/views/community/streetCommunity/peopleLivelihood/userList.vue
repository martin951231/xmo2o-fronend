<template>
    <div class="message-suggestions-list-box">
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="3" :sm="24" v-if="is_display">
                    <a-select
                            show-search
                            option-filter-prop="children"
                            style="width: 100%"
                            placeholder="请选择社区"
                            @change="communityChange"
                            v-model="search.community_id"
                    >
                        <a-select-option :value="item.id" v-for="(item,index) in community_list" :key="index">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="3" :sm="24">
                    <a-select
                            show-search
                            option-filter-prop="children"
                            style="width: 100%"
                            :placeholder="'请选择'+$store.getters.config.house_name"
                            @change="villageChange"
                            v-model="search.village_id"
                    >
                        <a-select-option :value="item.id" v-for="(item,index) in village_list" :key="index">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </a-col>

                <a-col :md="3" :sm="24">
                    <a-select
                            show-search
                            option-filter-prop="children"
                            style="width: 100%"
                            :placeholder="'请选择'+$store.getters.config.single_name"
                            @change="singleChange"
                            v-model="search.single_id"
                    >
                        <a-select-option :value="item.id" v-for="(item,index) in single_list" :key="index">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </a-col>

                <a-col :md="3" :sm="24">
                    <a-input-group compact>
                        <a-input  v-model="search.name" placeholder="请输入姓名"/>
                    </a-input-group>
                </a-col>
                <a-col :md="3" :sm="24">
                    <a-input-group compact>
                        <a-input  v-model="search.phone" placeholder="请输入手机号"/>
                    </a-input-group>
                </a-col>
                <a-col :md="3" :sm="24">
                    <a-input-group compact>
                        <a-input  v-model="search.id_card" placeholder="请输入身份证号"/>
                    </a-input-group>
                </a-col>

                <a-col :md="2" :sm="24" style="width: 210px;margin-left: 20px;padding: 0 !important;">
                    <a-button type="primary" icon="search" @click="searchList()" style="margin-right: 15px">查询</a-button>
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>
            </a-row>
        </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
        >
              <span slot="tags" slot-scope="text, record" >
                <a-tag  color="#FCBE79" style="margin-bottom: 5px"> {{record.user_identity}} </a-tag>
            </span>
            <span slot="action" slot-scope="text, record">
                <a @click="$refs.editPopupModel.add(record)">编辑</a> 
            </span>
        </a-table>
        <userInfo ref="editPopupModel" @ok="edit_user" />
    </div>
</template>
<script>
    import configStreetCommunityApi from '@/api/community/streetCommunity';
	import store from '@/store';
    import userInfo from './userInfo';
    const columns = [
        { title: '姓名',  dataIndex: 'name', key: 'name'},
        { title: '社区',  dataIndex: 'area_name', key: 'area_name'},
        { title: store.getters.config.house_name,  dataIndex: 'village_name', key: 'village_name'},
        { title: store.getters.config.single_name,  dataIndex: 'single_name', key: 'single_name'},
        { title: store.getters.config.floor_name, dataIndex: 'floor_name', key: 'floor_name'},
        { title: '楼层', dataIndex: 'layer_name', key: 'layer_name' },
        { title: '门牌号', dataIndex: 'room_name', key: 'room_name' },
        { title: '手机号', dataIndex: 'phone', key: 'phone' },
        { title: '身份证号', dataIndex: 'id_card', key: 'id_card' },
        { title: '身份', dataIndex: 'user_identity', key: 'user_identity',scopedSlots: { customRender: 'tags' } },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            scopedSlots: { customRender: 'action' },
        },
    ];
    const data = [];
    export default {
        name: 'userList',
        filters: {},
        components:{
            userInfo,
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
                search: { community_id: undefined, village_id: undefined,  single_id: undefined, name: '', phone: '', id_card: '', page: 1 },
                form: this.$form.createForm(this),
                loading: false,
                data,
                columns,
                community_list:[],
                village_list:[],
                single_list:[],
                url: '',
                is_display:true,
            };
        },
        mounted () {
            this.getList(1);
            this.get_community();
        },
        methods: {
            // 获取列表信息
            getList(t=0) {
                let _this = this;
                if(t ==1){
                    _this.$set(_this.pagination, 'current',1);
                }
                _this.search['page'] = _this.pagination.current;
                _this.search['limit'] = _this.pagination.pageSize;
                _this.loading = true;
                this.request(configStreetCommunityApi.getStreetCommunityUserList, _this.search)
                    .then((res) => {
                        _this.pagination.total = res.count ? res.count : 0;
                        _this.data = res.list;
                        _this.loading = false;
                    })
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },
            //社区数据
            get_community(){
                this.request(configStreetCommunityApi.getStreetCommunityAll,{})
                    .then((res) => {
                        if(res.area_id > 0){
                            this.is_display=false;
                            this.search.community_id=res.area_id;
                            this.communityChange(res.area_id);
                        }
                        this.community_list = res.list
                    });
            },
            //社区联动
            communityChange(value) {
                if(value > 0) {
                    this.request(configStreetCommunityApi.getStreetVillageAll,{area_id:value,'tokenName':'community_access_token'})
                        .then((res) => {
                            this.village_list = res
                   });
                    this.search.village_id=undefined;
                }
            },
            //小区联动
            villageChange(value) {
                if(value > 0) {
                    this.request(configStreetCommunityApi.getStreetSingleAll,{village_id:value})
                        .then((res) => {
                            this.single_list = res
                        });
                    this.search.single_id=undefined;
                }
            },
            //楼栋联动
            singleChange(value){
                console.log(`singleChange ${value}`);
            },

            // 编辑回调
            edit_user(val) {},


            //删除
            del(e) {
                this.$message.warning('请到'+store.getters.config.house_name+'平台去删除数据!');
            },
            // 进行搜索
            searchList() {
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.search = { community_id: undefined, village_id:undefined,single_id:undefined, name: '', phone: '', id_card: '', page: 1 };
                this.village_list=[];
                this.single_list=[];
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
                this.get_community();
            }
        }
    };
</script>

<style lang="less" scoped>

    /deep/ .ant-col-md-3{
        padding-right: 0 !important;
    }

    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
</style>