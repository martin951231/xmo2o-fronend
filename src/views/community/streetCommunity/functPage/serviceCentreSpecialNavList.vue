<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">
            <div class="search-box" style="margin-bottom: 10px;">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-input-group compact>
                            <label style="margin-top: 5px;">分类名称：</label><a-input style="width: 80%"
                                v-model="search.cat_name" />
                        </a-input-group>
                    </a-col>
                    <a-col :md="2" :sm="2">
                        <a-button type="primary" icon="search" @click="searchList()">
                            查询
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <div class="table-operator" style="margin-top: 15px;">
                <a-button type="primary" icon="plus" @click="addNewData()">添加数据</a-button>
            </div>
            <a-table :columns="columns" :data-source="list" :pagination="pagination" @change="tableChange" :row-key="record=>record.id" >
                <span slot="navServiceManage" slot-scope="text, record">
                    <a  @click="$refs.navServiceManage.showList(record)">管理</a>
                </span>
                <span slot="xstatus" slot-scope="text,record">
                    <span v-if="record.xstatus*1 ==1" style="color: green;">已开启</span>
                    <span v-if="record.xstatus*1 ==0" style="color: red;">已关闭</span>
                </span>
                <span slot="url_link" slot-scope="text,record">
                        <a @click="viewxLink(record)" > 查 看 </a>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="editNewData(record.id)">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm class="ant-dropdown-link" title="确认删除此条数据?" ok-text="确定" cancel-text="取消"
                        @confirm="deleteConfirm(record.id)" @cancel="cancel">
                        <a href="#">删除</a>
                    </a-popconfirm>
                </span>

            </a-table>

        </a-card>
        <a-modal title="查看链接" :width="600" :visible="view_visible" :footer="null" @cancel="handleViewCancel">
            <div>
                <div style="margin: 20px;">{{url_link}}</div>
            </div>
         </a-modal>
        <a-modal :title="xtitle" :width="700" :visible="xvisible" :maskClosable="false" :confirmLoading="confirmLoading"
            @ok="xhandleSubmit" @cancel="xhandleCancel">
            <a-spin :spinning="confirmLoading" :height="450">
                <a-form>
                    <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                        <a-input v-model="navCatInfo.cat_name" placeholder="请填写分类名称" />
                    </a-form-item>
                    <a-form-item label="权限设置" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-radio-group v-model="navCatInfo.level_show">
                            <a-radio :value="0">全部用户可见</a-radio>
                            <a-radio :value="1">仅党员可见（未登录用户不可见）</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <!--
                    <a-form-item label="分类排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input placeholder="分类排序" />
                    </a-form-item>
                    -->
                    <a-form-item label="分类状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-radio-group v-model="navCatInfo.xstatus">
                            <a-radio :value="1">开启</a-radio>
                            <a-radio :value="0">关闭</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-modal>
    <nav-service-manage ref="navServiceManage" @ok="bindOk" />
    </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import navServiceManage from "./navServiceManage.vue";
    const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '分类名称',
            dataIndex: 'cat_name',
            key: 'cat_name',
            width: 300,
        },
        {
            title: '分类状态',
            dataIndex: 'xstatus',
            key: 'xstatus',
            scopedSlots: {
                customRender: 'xstatus'
            },
        },
        {
            title: '服务管理',
            dataIndex: '',
            key: '',
            scopedSlots: {
                customRender: 'navServiceManage'
            }
        },
        {
            title: '分类链接',
            key: 'url_link',
            dataIndex: 'url_link',
            scopedSlots: {
                customRender: 'url_link'
            }
        },
        {
            title: '权限说明',
            key: 'level_show_str',
            dataIndex: 'level_show_str',
        },
        {
            title: '添加时间',
            key: 'add_time_str',
            dataIndex: 'add_time_str',
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    export default {
        name: 'serviceCentreSpecialNavList',
        components: {
            navServiceManage,
        },
        data() {
            return {
                labelCol: {
                    xs: {
                        span: 10
                    },
                    sm: {
                        span: 5
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 10
                    },
                    sm: {
                        span: 16
                    }
                },
                list: [],
                visible: false,
                confirmLoading: false,
                sortedInfo: null,
                pagination: {
                    pageSize: 10,
                    total: 10
                },
                search: {
                    page: 1,
                    cat_name:'',
                },
                page: 1,
                xtitle: '',
                columns,
                xvisible: false,
                navCatInfo: {
                    'cat_name': '',
                    'level_show': 0,
                    'xstatus': 1,
                },
                idd: 0,
                view_visible:false,
                url_link:'',
            };
        },
        mounted() {
            this.getCategoryList()
        },
        computed: {

        },
        filters: {

        },
        created() {},
        methods: {
            addNewData() {
                this.xtitle = '添加分类';
                this.idd=0;
                this.xvisible = true;
                this.url_link='';
                this.view_visible = false;
            },
            editNewData(cat_id){
                this.xtitle = '编辑分类';
                this.idd=cat_id;
                this.xvisible = true;
                this.confirmLoading = true;
                this.url_link='';
                this.view_visible = false;
                this.request('/community/street_community.StreetNav/getStreetServiceNavCatInfo',{ idd: cat_id }).then((res) => {
                    if (res && res.detail) {
                        this.confirmLoading = false;
                        this.navCatInfo=res.detail;
                    }
                }).catch((error) => {
                        this.confirmLoading = false;
                })
            },
            viewxLink(xrecord){
                this.url_link=xrecord.url_link;
                this.view_visible = true;
            },
            handleViewCancel(){
                this.url_link='';
                this.view_visible = false;
            },
            xhandleSubmit() {
                if (!this.navCatInfo.cat_name) {
                    this.$message.warning('请填分类名称！')
                    return false;
                }
                this.navCatInfo.idd = this.idd;
                this.confirmLoading = true;
                this.request('/community/street_community.StreetNav/addStreetServiceNavCat', this.navCatInfo)
                    .then((res) => {
                        if (this.idd > 0) {
                            this.$message.success('编辑成功')
                        } else {
                            this.$message.success('添加成功')
                        }
                        setTimeout(() => {
                            
                            this.getCategoryList();
                            this.confirmLoading = false;
                            this.xhandleCancel();
                        }, 1500)
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            xhandleCancel() {
                this.navCatInfo = {
                    'cat_name': '',
                    'level_show': 0,
                    'xstatus': 1,
                };
                this.confirmLoading = false;
                this.xvisible = false;
            },
            bindOk(){
                this.getCategoryList();
            },
            getCategoryList() {
                this.search['page'] = this.page;
                this.request('/community/street_community.StreetNav/getStreetServiceNavCatList', this.search)
                    .then((res) => {
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.page_size ? res.page_size : 10
                    }).catch((error) => {

                    })
            },
            tableChange(e) {
                if (e.current && e.current > 0) {
                    this.page = e.current;
                    this.getCategoryList()
                }
            },

            handleOks() {
                this.getCategoryList();
            },
            // 进行搜索
            searchList() {
                this.getCategoryList()
            },
            // 进行重置
            resetList() {
                this.search = {
                    cat_name:'',
                    page: 1,
                }
                this.getCategoryList()
            },
            cancel() {
            
            },
            deleteConfirm(idd) {
                this.request('/community/street_community.StreetNav/delStreetServiceCatNav', {
                        'idd': idd
                    })
                    .then((res) => {
                        this.getCategoryList()
                        this.$message.success('删除成功')
                    })
            },
        },
    };
</script>
<style>
    .table-operator {
        margin-bottom: 10px;
    }
</style>