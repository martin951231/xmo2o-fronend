<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
        <template>
            <div class="mb-10">
                <a-form layout="inline" >
                    <div class="flex search-content">
                        <div class="right flex">
                            <div>
                                <a-form-item label="店铺名称">
                                    <a-select v-model="queryParam.store_id" style="width: 200px"  placeholder="全部店铺">
                                        <a-select-option value="0">全部店铺</a-select-option>
                                        <a-select-option v-for="d in store_data" :key="d.store_id">
                                            {{ d.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item label="首页展示">
                                    <a-select v-model="queryParam.index_show" style="width: 120px" placeholder="是否首页展示">
                                        <a-select-option value="-1">
                                            全部
                                        </a-select-option>
                                        <a-select-option value="1">
                                            是
                                        </a-select-option>
                                        <a-select-option value="0">
                                            否
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item >
                                    <a-input-search
                                            v-model="queryParam.keyword"
                                            placeholder="输入检索关键词"
                                            style="width: 200px"
                                    />
                                </a-form-item>
                            </div>
                            <div>
                                <a-button @click="searchBtn()" style="margin-right: 15px">查询</a-button>
                                <a-button type="primary" @click="$refs.addLabelModal.add_label()">设置标签</a-button>
                            </div>
                        </div>
                    </div>
                </a-form>
            </div>

        </template>
        <a-card :bordered="false">
            <div class="message-suggestions-list-box">

                <a-table
                        :columns="columns"
                        :data-source="data"
                        class="components-table-demo-nested"
                        :pagination="pagination"
                        @change="tableChange"
                        rowKey="id"
                        :loading="loading"
                >
          <span slot="index_show" slot-scope="text, record">
               <span v-if="text == 1">是</span>
               <span v-else>否</span>
          </span>
          <span slot="reply_count" slot-scope="text, record">
               <a @click="$refs.askDetailModal.detail(record.fid > 0?record.fid:record.id)">{{text}}</a>
          </span>

          <span slot="action" slot-scope="text, record">
            <a @click="$refs.addLabelToAskModal.add_label(record.id,record.label_id)">关联标签</a>
            <a-divider type="vertical" />
            <a v-if="record.index_show == 1" @click="setIndexShow(record.id,0)">取消首页展示</a>
            <a v-else @click="setIndexShow(record.id,1)">展示到首页</a>
          </span>

          </a-table>
          </div>

          <add-label ref="addLabelModal" @refreshLists="initList"/>
          <add-label-to-ask ref="addLabelToAskModal" @refreshLists="initList"/>
          <ask-detail ref="askDetailModal"/>
        </a-card>
    </div>
</template>

<script>
    import qaApi from '@/api/qa'
    import AddLabel from "../modules/addLabel";
    import AddLabelToAsk from "../modules/addLabelToAsk";
    import AskDetail from "../modules/askDetail";
    const data = []

    export default {
        name: 'askLists',
        components: {
            AskDetail,
            AddLabelToAsk,
            AddLabel
        },
        data() {
            this.cacheData = data.map((item) => ({ ...item }))
            return {
                form: this.$form.createForm(this),
                mdl: {},
                selectStoreVisible: false,
                loading: true,
                id: 1,
                store_data:[],
                search_data: [],
                // 查询参数
                queryParam: {
                    index_show: '-1',
                    store_id: '0',
                    keyword: '',
                    page_size:10
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
                        title: '问题',
                        width: 200,
                        dataIndex: 'content'
                    },
                    {
                        title: '回答数',
                        width: 10,
                        dataIndex: 'reply_count',
                        scopedSlots: {
                            customRender: 'reply_count'
                        }
                    },
                    {
                        title: '查看数',
                        width: 10,
                        dataIndex: 'view_count'
                    },
                    {
                        title: '提问时间',
                        width: 10,
                        dataIndex: 'create_date'
                    },
                    {
                        title: '店铺名称',
                        width: 20,
                        dataIndex: 'store_name'
                    },
                    {
                        title: '关联标签',
                        width: 10,
                        dataIndex: 'label_name'
                    },
                    {
                        title: '是否首页展示',
                        width: 10,
                        dataIndex: 'index_show',
                        scopedSlots: {
                            customRender: 'index_show'
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: 100,
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
            //设置展示到首页
            setIndexShow(id,indexShow){
                this.request(qaApi.setIndexShow, {id:id,index_show:indexShow}).then((res) => {
                    this.$message.success(this.L('设置成功'))
                    this.getLists();
                })
            },
            // 点击查询按钮
            searchBtn() {
                this.page = 1
                this.pagination.current = this.page
                this.getLists()
            },

            // 获取列表信息
            initList() {
                this.getStoreLists();
                this.getLists()
            },

            //获取店铺列表
            getStoreLists(){
                this.request(qaApi.storeLists, this.queryParam).then((res) => {
                   this.store_data = res;
                })
            },

            // 获取列表信息
            getLists() {
                this.queryParam['page'] = this.page
                this.loading = true
                this.request(qaApi.askLists, this.queryParam).then((res) => {
                    this.loading = false
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
    .goods-title{
        font-size: 20px;
        margin-right: 10px;
    }
    .search-content{
        justify-content:space-between;align-items: center;
    }
    .search-content .right {
        align-items: center;
    }
</style>
