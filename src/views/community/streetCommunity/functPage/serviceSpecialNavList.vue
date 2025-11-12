<template>
    <div class="message-suggestions-list-box">
        <a-card :bordered="false">
            <div class="search-box" style="margin-bottom: 15px;">
                <a-row :gutter="48">
                    <a-col :md="4" :sm="24">
                        <a-input-group compact>
                            <a-input v-model="search.nav_name" placeholder="请输入名称" />
                        </a-input-group>
                    </a-col>
                    <a-col :md="2" :sm="24" style="width: 210px;margin-left: 20px;">
                        <a-button type="primary" icon="search" @click="searchList()" style="margin-right: 15px;"> 查 询 </a-button>
                    </a-col>
                    
                    <a-col :md="2" :sm="24" >
                        <a-button class="add_but" type="primary" icon="plus"
                            @click="$refs.creatAddModal.addBottNavigations()">添加数据</a-button>
                    </a-col>
                    
                </a-row>

            </div>
            <a-table :columns="columns" :data-source="navData" :pagination="pagination" :row-key="record=>record.id"
                @change="tableChange">
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.creatAddModal.editBottNavigation(record.id)">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm class="ant-dropdown-link" title="是否确认删除此条数据?" ok-text=" 是 " cancel-text=" 否 "
                        @confirm="deleteConfirm(record.id)" @cancel="cancel">
                        <a href="#">删除</a>
                    </a-popconfirm>
                </span>
                <span slot="xstatus" slot-scope="text,record">
                    <span v-if="record.xstatus*1 ==1" style="color: green;">已开启</span>
                    <span v-if="record.xstatus*1 ==0" style="color: red;">已关闭</span>
                </span>
                <span slot="img_url" slot-scope="text,record">
                    <img :src="record.img_url" :width="180" @click="previewImg(record.img_url)"
                        style="cursor:pointer;" />
                </span>
            </a-table>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
        </a-card>
        <add-bott-navigation :height='800' :width="1200" ref="creatAddModal" @ok="handleOk" />
    </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import addBottNavigation from './addBottNavigation.vue';
    const columns = [{
            title: '名称',
            dataIndex: 'nav_name',
            key: 'nav_name',
            width: 220,
        },
        {
            title: '图片',
            key: 'img_url',
            dataIndex: 'img_url',
            width: 250,
            scopedSlots: {
                customRender: 'img_url'
            },
        },
        {
            title: '权限说明',
            key: 'level_show_str',
            dataIndex: 'level_show_str',
            width: 120,
        },
        {
            title: '排序',
            key: 'xsort',
            dataIndex: 'xsort',
            width: 120,

        },
        {
            title: '状态',
            key: 'xstatus',
            dataIndex: 'xstatus',
            scopedSlots: {
                customRender: 'xstatus'
            },
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
        name: 'serviceSpecialNavList',
        components: {
            addBottNavigation
        },
        data() {
            return {
                confirmLoading: false,
                navData: [],
                pagination: {
                    pageSize: 10,
                    total: 10
                },
                search: {
                    page: 1,
                    nav_name:'',
                },
                page: 1,
                columns,
                previewVisible: false,
                previewImage: '',
            }
        },
        filters: {

        },
        mounted() {
            this.serviceNavLists();
        },
        computed: {

        },
        methods: {

            serviceNavLists() {
                this.previewVisible = false;
                this.previewImage = '';
                this.search['page'] = this.page;
                let _this = this
                this.request(streetCommunityApi.getStreetServiceNavList, this.search)
                    .then((res) => {
                        this.navData = res.list;
                        this.pagination.total = res.count ? res.count : 0;
                        this.pagination.pageSize = res.page_size ? res.page_size : 10
                    })
            },
            tableChange(e) {
                if (e.current && e.current > 0) {
                    this.page = e.current;
                    this.serviceNavLists()
                }
            },
            handleOk() {
                this.serviceNavLists()
            },
            searchList(){
                 this.page=1;
                 this.serviceNavLists()
            },
            deleteConfirm(id) {
                this.request(streetCommunityApi.delStreetServiceNav, {
                        'idd': id
                    })
                    .then((res) => {
                        this.serviceNavLists()
                        this.$message.success('删除成功')
                    }).catch((error) => {
                        this.confirmLoading = false
                    })
            },
            cancel() {

            },
            previewImg(img_url) {
                this.previewImage = img_url;
                this.previewVisible = true;
            },
            handlePreviewCancel() {
                this.previewVisible = false;
                this.previewImage = '';
            }
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