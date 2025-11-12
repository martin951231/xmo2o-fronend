<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin: 10px auto">
        <a-card :bordered="false">
            <div class="mb-10">
                <a-form layout="inline">
                    <div class="flex search-content">
                        <div class="right flex">
                            <div>
                                <a-form-item>
                                    <a-select v-model="queryParam.ask_type" style="width: 120px" placeholder="问答类型">
                                        <a-select-option value="0">
                                            全部
                                        </a-select-option>
                                        <a-select-option value="1">
                                            问题
                                        </a-select-option>
                                        <a-select-option value="2">
                                            回答
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-select
                                            show-search
                                            v-model="queryParam.mer_id"
                                            placeholder="全部商家"
                                            style="width: 200px"
                                            :default-active-first-option="false"
                                            :show-arrow="false"
                                            :filter-option="false"
                                            :not-found-content="null"
                                            @search="handleSearch"
                                            @change="handleChange"
                                    >
                                        <a-select-option value="0">全部商家</a-select-option>
                                        <a-select-option v-for="d in mer_data" :key="d.mer_id">
                                            {{ d.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-input-search
                                            v-model="queryParam.keyword"
                                            placeholder="输入检索关键词"
                                            style="width: 200px"
                                    />
                                </a-form-item>
                            </div>
                            <div>
                                <a-button type="primary" @click="searchBtn()" style="margin-right: 15px">查询</a-button>
                            </div>
                        </div>
                    </div>
                </a-form>
            </div>

            <div class="message-suggestions-list-box">

                <a-table
                        :columns="columns"
                        :data-source="data"
                        class="components-table-demo-nested"
                        :pagination="pagination"
                        @change="tableChange"
                        rowKey="id"
                >
                  <span slot="fid" slot-scope="text, record">
                       <span v-if="record.fid == 0">问题</span>
                       <span v-else>回答</span>
                  </span>
                    <span slot="id" slot-scope="text, record">
                       <a @click="$refs.askDetailModal.detail(record.fid > 0?record.fid:record.id,'platform')">查看</a>
                  </span>

                    <span slot="action" slot-scope="text, record">
                        <a @click="deleteAsk(record.id,record.fid)">
                          删除
                        </a>
                    </span>

                </a-table>
            </div>

            <ask-detail ref="askDetailModal"/>
        </a-card>
    </div>
</template>

<script>
    import qaApi from '@/api/qa'
    import AskDetail from "../modules/askDetail";

    const data = []

    export default {
        name: 'allAskLists',
        components: {
            AskDetail,
        },
        data() {
            this.cacheData = data.map((item) => ({...item}))
            return {
                form: this.$form.createForm(this),
                mer_data: [],
                search_data: [],
                search_mer_keyword:undefined,
                // 查询参数
                queryParam: {
                    ask_type: '0',
                    mer_id: '0',
                    keyword: '',
                    page_size: 10
                },
                pagination: {
                    current: 1,
                    page_size: 10,
                    total: 10,
                    'show-total': (total) => `共 ${total} 条记录`,
                },
                // 表头
                columns: [
                    {
                        title: '问答类型',
                        width: 10,
                        dataIndex: 'fid',
                        scopedSlots: {
                            customRender: 'fid'
                        }
                    },
                    {
                        title: '问答内容',
                        width: 200,
                        dataIndex: 'content'
                    },
                    {
                        title: '完整回答',
                        width: 10,
                        dataIndex: 'id',
                        scopedSlots: {
                            customRender: 'id'
                        }
                    },
                    {
                        title: '时间',
                        width: 10,
                        dataIndex: 'create_date'
                    },
                    {
                        title: '商家名称',
                        width: 20,
                        dataIndex: 'mer_name'
                    },
                    {
                        title: '店铺名称',
                        width: 20,
                        dataIndex: 'store_name'
                    },
                    {
                        title: '用户名',
                        width: 20,
                        dataIndex: 'nickname'
                    },
                    {
                        title: '用户电话',
                        width: 20,
                        dataIndex: 'phone'
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: 10,
                        scopedSlots: {
                            customRender: 'action'
                        }
                    },
                ],
                data
            }
        },

        watch: {
            $route() {
                this.initList()
            },
        },
        mounted() {
            this.initList()
        },
        methods: {
            handleSearch(value) {
                this.request(qaApi.searchMerchant, {keyword: value}).then((res) => {
                    this.mer_data = res;
                })
            },
            handleChange(value) {
                console.log('change',value)
                this.queryParam['mer_id'] = value;
            },
            deleteAsk(id, fid) {
                var title = '';
                var content = '';
                if (fid == 0) {
                    title = '您确定要删除这条问题吗？';
                    content = '连同这条问题下所有的回答将会一起删除';
                } else {
                    title = '您确定要删除这条回答吗？';
                }
                var that = this;
                this.$confirm({
                    title: title,
                    content: content,
                    okText: '确定',
                    okType: 'primary',
                    cancelText: '取消',
                    onOk() {
                        that.request(qaApi.delete, {id: id}).then((res) => {
                            that.$message.success(that.L('删除成功'))
                            that.getLists();
                        })
                    },
                    onCancel() {
                    },
                });
            },
            // 点击查询按钮
            searchBtn() {
                this.page = 1
                this.pagination.current = this.page
                this.getLists()
            },

            // 获取列表信息
            initList() {
                this.getLists()
            },

            // 获取列表信息
            getLists() {
                this.queryParam['page'] = this.page
                this.request(qaApi.getAll, this.queryParam).then((res) => {
                    this.data = res.list
                    this.pagination.total = res.total
                })
            },
            // 表格中变动  这里只针对页面页数切换
            tableChange(e) {
                this.queryParam['page_size'] = e.pageSize
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current
                    this.page = e.current
                    this.getLists()
                }
            },
        },
    }
</script>

<style scoped>
    .detail-content >>> .ant-drawer-body {
        padding: 0;
    }

    .ant-table td {
        white-space: nowrap;
    }

    .goods-title {
        font-size: 20px;
        margin-right: 10px;
    }

    .search-content {
        justify-content: space-between;
        align-items: center;
    }

    .search-content .right {
        align-items: center;
    }
</style>
