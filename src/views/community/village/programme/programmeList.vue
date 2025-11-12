<template>
    <div class="message-suggestions-list-box userList" >
        <div class="content-p1" >
            <div style="margin-bottom: 10px">
                <a-collapse accordion>
                    <a-collapse-panel key="1" header="操作说明">
                        <span style="font-weight:500 ">
                            权限方案，批量管理{{$store.getters.config.house_name}}工作人员的分组，分组可以设置在{{$store.getters.config.house_name}}平台的菜单、功能权限、操作栏按钮权限。
                        </span>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        </div>
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">方案名称：</p>
                        <a-input style="width: 70%" v-model="search.title" placeholder="请输入权限名称"/>
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="24">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">分组名称：</p>

                        <a-select class="input1"  show-search option-filter-prop="children" placeholder="请选择分组名称" v-model="search.group_id">
                            <a-select-option :value="item.id" v-for="(item,index) in group_list" :key="index">
                                {{item.title}}
                            </a-select-option>
                        </a-select>

                    </a-input-group>
                </a-col>

                <a-col :md="2" :sm="24" class="but-box">
                    <a-button type="primary" icon="search" @click="searchList()">查询</a-button>
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>

            </a-row>
        </div>
        <div class="add-box">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-button type="primary" icon="plus" @click="$refs.EditModel.add()">添加</a-button>
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
            <span slot="tags" slot-scope="tags" >
                <a-tag v-for="tags in tags" color="#FCBE79" style="margin-bottom: 5px"> {{tags}} </a-tag>
            </span>
            <span slot="action" slot-scope="text, record">
                <a  @click="$refs.EditModel.edit(record.title,record.id)">编辑</a> |
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
        <programmeInfo ref="EditModel" @ok="info" />
    </div>
</template>
<script>
    import villageApi from '@/api/community/village';
    import programmeInfo from './programmeInfo';
    import { Collapse } from 'ant-design-vue';
    const columns = [
        { title: '方案名称',  dataIndex: 'title', key: 'title',width: '12%',},
        { title: '分组名称', dataIndex: 'group_name', key: 'group_name' , width: '15%', },
        { title: '选择人员', dataIndex: 'worker', key: 'worker',scopedSlots: { customRender: 'tags' },},
        { title: '备注', dataIndex: 'remarks', key: 'remarks', width: '12%', },
        {title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' },width: '10%',},
    ];
    const data = [];
    export default {
        name: 'programmeList',
        filters: {

        },
        components:{
            programmeInfo,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data() {
            return {
                reply_content: '',
                pagination: {current:1, pageSize: 10, total:10 },
                search: { title: '', group_id: undefined, page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                oldVersion: '',
                group_list:[],

            };
        },
        activated () {
            this.getList();
            this.getGroupAll();
        },
        methods: {
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.pagination.current;
                this.request(villageApi.houseProgrammeList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                        this.data = res.list;
                        this.loading = false;
                        this.oldVersion = res.oldVersion
                    })
            },

            //获取分组数据
            getGroupAll(){
                this.request(villageApi.houseProgrammeGroupAll)
                    .then((res) => {
                        this.group_list = res
                    })
                    .catch((error) => {
                        this.loading = false
                    })

            },

            //添加编辑活动
            info(val){
                this.getList();
            },


            //删除
            deleteConfirm(id){
                this.request(villageApi.houseProgrammeProgrammeDel,{'id':id})
                    .then((res) => {
                        this.getList();
                        this.$message.success('删除成功')
                    })
            },

            //取消删除
            delCancel() {

            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.getGroupAll();
                this.search = {  title: '',group_id: undefined, page: 1 };
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
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
        padding: 10px 20px 0;
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

    /deep/ .input1{
        width: 60% !important;
    }
    /deep/ .but-box{
        width: 365px !important;padding-left: 0 !important;
    }
    /deep/ .but-box button{
        margin-right: 20px !important;
    }
</style>