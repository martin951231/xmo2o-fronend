<template>
    <a-modal :title="title" :width="1100" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <div class="message-suggestions-list-box">
            <div class="search-box">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="10" >
                        <a-input-group compact>
                            <p style="margin-top: 5px;">预约编号：</p>
                            <a-input style="width: 60%" v-model="search.record_number" placeholder="请输入" />
                        </a-input-group>
                    </a-col>
                    <a-col :md="6" :sm="24" style="padding-right:1px !important;">
                        <a-input-group compact>
                            <p style="margin-top: 5px;">姓名：</p>
                            <a-input style="width: 60%" v-model="search.name" placeholder="请输入" />
                        </a-input-group>
                    </a-col>
                    <a-col :md="6" :sm="24" style="padding-right:1px !important;">
                        <a-input-group compact>
                            <p style="margin-top: 5px;">审核状态：</p>
                            <a-select style="width: 170px" placeholder="请选择状态" v-model="search.status">
                                <a-select-option :value="item.key" v-for="(item,index) in status_arr" :key="index">
                                    {{item.value}}
                                </a-select-option>
                            </a-select>
                        </a-input-group>
                    </a-col>
                    <a-col :md="5" :sm="24">
                        <a-button type="primary" icon="search" @click="searchList()" style="margin-right: 20px !important;">查询</a-button>
                        <a-button  @click="resetList()">重置</a-button>
                    </a-col>
                </a-row>
                <a-button type="primary" @click="$refs.setPopupModel.edit(activity_id)" style="margin-bottom: 10px !important;">
                    预约设置
                </a-button>
            </div>
            <a-table
                    :columns="columns"
                    :data-source="data"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change='table_change'
                    :loading="loading"
            >
                <span slot="action" slot-scope="text, record">
                    <a  @click="$refs.PopupModel.edit(record.id)" v-if="record.status == 0" style="color: red">审核</a>
                    <a  @click="$refs.PopupModel.edit(record.id)" v-else >查看</a>
                    <!--<a-popconfirm-->
                            <!--class="ant-dropdown-link"-->
                            <!--title="确认删除?"-->
                            <!--ok-text="是"-->
                            <!--cancel-text="否"-->
                            <!--@confirm="deleteConfirm(record.id)"-->
                            <!--@cancel="delCancel"-->
                            <!--style="margin-left: 20px"-->
                    <!--&gt;-->
                        <!--<a href="#">删除</a>-->
                    <!--</a-popconfirm>-->
            </span>
            </a-table>
            <recordInfo ref="PopupModel" @ok="addRecord"/>
            <activitySet ref="setPopupModel" @ok="addSet"/>
        </div>
    </a-modal>
</template>
<style>
</style>
<script>
    import villageApi from '@/api/community/village'
    import recordInfo from './recordInfo'
    import activitySet from './activitySet'
    const columns = [
        { title: '预约编号',  dataIndex: 'record_number', key: 'record_number'},
        { title: '姓名',  dataIndex: 'name', key: 'name'},
        { title: '联系电话',  dataIndex: 'phone', key: 'phone'},
        { title: '预约日期',  dataIndex: 'appoint_time', key: 'appoint_time'},
        { title: '预约时间',  dataIndex: 'times', key: 'times'},
        { title: '审核状态',  dataIndex: 'status_msg', key: 'status_msg'},
        { title: '操作', dataIndex: 'operation', key: 'operation',width: '16%', scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'recordList',
        filters: {

        },
        components:{
            recordInfo,
            activitySet
        },
        data() {
            return {
                reply_content: '',
                pagination: {current:1, pageSize: 10, total:10 },
                search: { record_number: '', name:'',status:undefined,page: 1,activity_id:0 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                title:'',
                confirmLoading:false,
                activity_id:0,
                status_arr:[{"key":1,"value":"未审核"},{"key":2,"value":"审核通过"},{"key":3,"value":"审核不通过"},{"key":4,"value":"取消预约"}],
            };
        },
        methods: {
            // 获取列表信息
            getList(activity_id,t=1) {
                let _this=this;
                _this.title='活动场馆预约列表';
                _this.loading = true;
                if(t == 2){
                    _this.search['record_number'] = '';
                    _this.search['name'] = '';
                    _this.search['status'] = undefined;
                    _this.$set(_this.pagination, 'current', 1);
                }
                _this.activity_id=activity_id;
                _this.search['page'] = _this.pagination.current;
                _this.search['activity_id']=activity_id;
                this.request(villageApi.venueRecordList, this.search)
                    .then((res) => {
                        _this.pagination.total = res.count ? res.count : 0
                        _this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        _this.data = res.list;
                        _this.loading = false;
                        _this.oldVersion = res.oldVersion;
                        _this.visible=true;
                    })
            },

            handleCancel() {
                this.visible = false;
                setTimeout(() => {
                    this.id = '0';
                    this.form = this.$form.createForm(this)
                }, 500)
            },

            //查看记录
            addRecord(val){
                this.getList(this.activity_id);
            },

            //预约设置
            addSet(val){
                this.getList(this.activity_id);
            },

            //取消删除
            delCancel() {

            },
            //删除
            deleteConfirm(id){
                this.request(villageApi.venueClassifyDel,{'id':id})
                    .then((res) => {
                        this.getList(this.activity_id);
                        this.$message.success('删除成功')
                    })
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.$set(this.pagination, 'current', e.current)
                    this.getList(this.activity_id)
                }
            },

            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.$set(this.pagination, 'current', 1)
                this.getList(this.activity_id)
            },
            // 进行重置
            resetList() {
                this.$set(this.pagination, 'current', 1)
                this.search = { record_number: '', name:'',status:undefined,page: 1,activity_id:0 };
                this.getList(this.activity_id)
            }


        }
    };
</script>