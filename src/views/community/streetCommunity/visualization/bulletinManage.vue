<template>
    <a-modal :title="title" :width="1350" :footer="null" :visible="visible" :maskClosable="false"
        :confirmLoading="confirmLoading" @cancel="handleCancel">
        <span class="add-banner sel">
            <a @click="">{{title}}-列表</a>
        </span>
        <span class="add-banner">
            <a @click="$refs.createInfoModal.add()">添加公告</a>
        </span>
        <hr />
        <a-card :bordered="false">
            <div class="search-box" style="margin-bottom: 15px;">
                <a-row :gutter="48">
                    <a-col :md="6">
                        <a-input-group compact>
                            <a-input v-model="search.xtitle" placeholder="请输入公告名称" />
                        </a-input-group>
                    </a-col>
                    <a-col :md="4" style="margin-left: 10px;">
                        <a-button type="primary" icon="search" @click="searchList()" style="margin-right: 15px;"> 查 询 </a-button>
                    </a-col>
                </a-row>
            </div>
            
            <a-table :columns="columns" :data-source="InfoList" :pagination="pagination" :row-key="record=>record.id" @change="tableChange">
                <span slot="status_str" slot-scope="text,record">
                    <span v-if="record.status*1 ==1" style="color: green;">已开启</span>
                    <span v-if="record.status*1 ==0" style="color: red;">已关闭</span>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.createInfoModal.edit(record.id)">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm class="ant-dropdown-link" title="确认删除此条数据?" ok-text=" 确 定 " cancel-text=" 取 消 "
                        @confirm="deleteConfirm(record.id)" @cancel="cancel">
                        <a href="#">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </a-card>
        <add-info-content :height='800' :width="1100" ref="createInfoModal" @ok="handleOks" />
    </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import addInfoContent from './addInfoContent.vue';

    const columns = [{
            title: '编号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '公告名称',
            dataIndex: 'xtitle',
            key: 'xtitle',
        },
        {
            title: '状态',
            key: 'status_str',
            dataIndex: 'status_str',
            scopedSlots: {
                customRender: 'status_str'
            },
        },
        {
            title: '浏览量',
            key: 'view_num',
            dataIndex: 'view_num',
        },
        {
            title: '排序',
            key: 'xsort',
            dataIndex: 'xsort',
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
        name: 'bulletinManage',
        components: {
            addInfoContent
        },
        data() {
            return {
                title: '公告管理',
                visible: false,
                confirmLoading: false,
                InfoList: [],
                pagination: {
                    pageSize: 10,
                    total: 10
                },
                search: {
                    page: 1,
                    xtitle:'',
                },
                columns,
                page: 1,
            }
        },
        filters: {

        },
        mounted() {
            this.InfoContentLists();
        },
        computed: {

        },
        methods: {
            slideshowList() {
                this.page = 1;
                this.title = '公告管理'
                this.visible = true;
                this.InfoContentLists();

            },
            searchList(){
                 this.page=1;
                 this.InfoContentLists()
            },
            InfoContentLists() {
                this.search['page'] = this.page;
                let _this = this
                this.request('/community/street_community.Visualization/getStreetInfoContentList', this.search)
                    .then((res) => {
                        console.log('res', res)
                        this.InfoList = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.page_size ? res.page_size : 10
                    })
            },
            tableChange(e) {
                if (e.current && e.current > 0) {
                    this.page = e.current;
                    this.InfoContentLists()
                }
            },
            handleOks() {
                this.InfoContentLists();
            },
            deleteConfirm(idd) {
                this.request('/community/street_community.Visualization/delStreetInfoContent', {
                        'idd': idd
                    })
                    .then((res) => {
                        this.InfoContentLists()
                        this.$message.success('删除成功')
                    })
            },
            cancel() {

            },
            handleCancel() {
                this.visible = false
            },
        },
    }
</script>
<style>
    .ant-form-item label {
        width: 150px;
    }

    .tip-txt {
        margin-left: 4px;
        font-size: 12px;
    }

    .add-box-tip {
        text-align: -webkit-center;
        padding: 0 6px;
        margin-left: 8px;
        border-radius: 15px;
        border: none;
    }

    .add-banner {
        font-size: 15px;
        margin: 13px;
    }

    hr {
        border: 1px solid #eee;
    }

    .sel {
        border-bottom: 2px solid #3283FA;
        padding-bottom: 8px;
    }

    .prompt {
        border: 1px solid #d6e9c6;
        width: 95.5%;
        padding: 15px;
        margin-left: 25px;
        background-color: #dff0d8;
    }
</style>