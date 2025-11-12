<template>
    <div class="message-suggestions-list-box">
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="6" :sm="10" >
                    <a-input-group compact>
                        <p style="margin-top: 5px;">活动场馆名称：</p>
                        <a-input class="input1" v-model="search.title" placeholder="请输入"/>
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="24">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">活动场馆类型：</p>
                        <a-select class="input1"  placeholder="请选择活动场馆类型" v-model="search.classify_id">
                            <a-select-option :value="item.id" v-for="(item,index) in classify_list" :key="index">
                                {{item.title}}
                            </a-select-option>
                        </a-select>
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-right:1px !important;">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">联系人：</p>
                        <a-input class="input1" placeholder="请输入" v-model="search.contacts"/>
                    </a-input-group>
                </a-col>
                <a-col :md="5" :sm="24">
                    <a-button type="primary" icon="search" @click="searchList()" style="margin-right: 20px !important;">查询</a-button>
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>
            </a-row>

        </div>
        <div class="add-box">
            <a-row :gutter="48">
                <a-col :md="5" :sm="24" style="width: 40% !important;">
                    <a-button type="primary" @click="$refs.AddPopupModel.add()" style="margin-right: 20px !important;">添加活动场馆</a-button>
                    <a-button type="primary" @click="$refs.classifyModel.getList(1)">活动场馆类型列表</a-button>
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
            <span slot="status" slot-scope="text, record">
                <div v-if="record.status == 0" style="color: red;">
                    {{record.close_msg}}
                </div>
                <div v-if="record.status == 1" style="color: #1890ff;">开启</div>
            </span>
            <span slot="action" slot-scope="text, record">
                <a  @click="$refs.EditPopupModel.edit(record.id)">编辑</a> |
                <a  @click="$refs.recordModel.getList(record.id,2)">预约记录</a> |

                 <a-popconfirm
                         v-if="record.status == 0"
                         class="ant-dropdown-link"
                         title="是否确定开启活动场馆"
                         ok-text="是"
                         cancel-text="否"
                         @confirm="activityOpen(record.id)"
                         @cancel="delCancel2"
                         style="color: red;"

                 ><a href="#">开启</a></a-popconfirm>


                <a  @click="$refs.closeModel.edit(record.id)" v-if="record.status == 1" style="color: #1890ff;">关闭</a> |
                <a-popconfirm
                        class="ant-dropdown-link"
                        title="确认删除?(操作后可能不能恢复！)"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="deleteConfirm(record.id)"
                        @cancel="delCancel"

                ><a href="#">删除</a></a-popconfirm>
            </span>
        </a-table>
        <activityInfo ref="AddPopupModel" @ok="addActivity" />
        <activityInfo ref="EditPopupModel" @ok="editActivity" />
        <classifyList ref="classifyModel" @change="classifyCallback" />
        <recordList ref="recordModel" @ok="addRecord" />
        <activityClose ref="closeModel" @ok="addRecord" />
    </div>

</template>
<script>
    import villageApi from '@/api/community/village';
    import classifyList from './classifyList';
    import activityInfo from './activityInfo';
    import recordList from './recordList';
    import activityClose from './activityClose';
    const columns = [
        { title: '序号',  dataIndex: 'id', key: 'id'},
        { title: '活动场馆名称',  dataIndex: 'title', key: 'title'},
        { title: '活动场馆类型',  dataIndex: 'classify_name', key: 'classify_name'},
        { title: '办公时间',  dataIndex: 'work_txt', key: 'work_txt'},
        { title: '联系人',  dataIndex: 'contacts', key: 'contacts'},
        { title: '联系电话',  dataIndex: 'phone', key: 'phone'},
        { title: '场馆地址',  dataIndex: 'adress', key: 'adress',width: '12%'},
        { title: '排序',  dataIndex: 'sort', key: 'sort'},
        { title: '场馆状态',  dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }},
        { title: '操作', dataIndex: 'operation', key: 'operation',width: '15%', scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'activityList',
        filters: {

        },
        components:{
            activityInfo,
            classifyList,
            recordList,
            activityClose
        },
        data() {
            return {
                reply_content: '',
                pagination: { current:1,pageSize: 10, total:10 },
                search: { title:'',classify_id:undefined,contacts:'', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                oldVersion: '',
                classify_list:[],
            };
        },
        activated () {
            this.getList(1);
            this.getClassifyList();
        },
        methods: {
            // 获取列表信息
            getList(t=0) {
                this.loading = true;
                if(t ==1){
                    this.$set(this.pagination, 'current',1);
                }
                this.search['page'] = this.pagination.current;
                this.request(villageApi.venueActivityList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list;
                        this.loading = false;
                        this.oldVersion = res.oldVersion;
                    })
            },

            //开启活动
            activityOpen(id){
                this.request(villageApi.venueActivityOpen,{'id':id})
                    .then((res) => {
                        this.getList();
                        this.$message.success('开启成功')
                    })
            },

            getClassifyList(){
                this.request(villageApi.venueClassifyData)
                    .then((res) => {
                        this.classify_list = res
                    })
                    .catch((error) => {
                        this.loading = false
                    })

            },

            // 添加活动
            addActivity(val) {
                this.getList(1);
            },

            //编辑活动
            editActivity(val){
                this.getList();
            },

            //删除
            deleteConfirm(id){
                this.request(villageApi.venueActivityDel,{'id':id})
                    .then((res) => {
                        this.getList(1);
                        this.$message.success('删除成功')
                    })
            },

            //取消删除
            delCancel() {

            },

            //取消开启
            delCancel2() {

            },

            //添加分类回调
            classifyCallback(val){
                this.getClassifyList();
            },
            //预约记录
            addRecord(val){
                this.getList();
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.$set(this.pagination, 'current', e.current)
                    this.getList()
                }
            },

            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.$set(this.pagination, 'current', 1)
                this.getList()
            },
            // 进行重置
            resetList() {
                this.$set(this.pagination, 'current', 1)
                this.search = {  title:'',classify_id:undefined,contacts:'', page: 1 };
                this.getList()
            }
        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }


    /deep/ .input1{
        width: 60% !important;
    }

</style>