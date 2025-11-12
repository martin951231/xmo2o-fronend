<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout-content
                    :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                <div class="table-operations">
                    <a-row align="top" style="padding: 0px;width: 100%;background-color: #f5f5f5">
                        <a-col :span="11" class="text-left" style="font-size:20px;line-height:30px;padding-left: 20px;">
                            评论管理
                        </a-col>
                        <a-col :span="5"></a-col>
                        <a-col :span="3" class="text-center">
                            <a-form-item>
                                <a-select @change="handleStatusChange" style="width: 150px;" placeholder="发布状态">
                                    <a-select-option v-for="item in status_list" :key="item.id" :value="item.id">{{
                                        item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :span="3" class="text-center">
                            <a-form-item>
                                <a-input placeholder="输入关键字" v-model="formData.comment"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="2" class="text-center">
                            <a-form-item>
                                <a-button type="default" @click="commentFind()">
                                    查询
                                </a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
                <a-table :columns="columns"
                         :data-source="data"
                         :pagination="pagination"
                         @change="handleTableChange">
                        <span slot="content" slot-scope="text">
                            {{text}}
                        </span>
                    <span slot="nickname" slot-scope="text">
                                {{text}}
                    </span>
                    <span slot="phone" slot-scope="text">
                                {{text}}
                    </span>
                    <span slot="name" slot-scope="text,record">
                        <a @click="showNote(record.article_id)">{{text}}</a>
                    </span>
                    <span slot="add_time" slot-scope="text">
                                {{text}}
                    </span>
                    <span slot="status" slot-scope="text">
                        <span class="height-30" v-if="text ==0">
                                    待审核
                        </span>
                        <span class="height-30" v-if="text ==1">
                                    发布中
                        </span>
                        <span class="height-30" v-if="text ==2">
                                    未发布
                        </span>
                    </span>
                    <span slot="action" slot-scope="text,record">
                        <div v-if="record.status==0">
                           <a-row>
<!--                               <a-col :span="8">-->
                                    <a class="label-sm blue" @click="editStatus(record.reply_id,1)"> 发布</a>
<!--                               </a-col>-->
                               <a-divider type="vertical" />
<!--                               <a-col :span="16">-->
                                    <a class="label-sm blue" @click="editStatus(record.reply_id,2)"> 不予发布</a>
<!--                               </a-col>-->
                           </a-row>
                        </div>
                        <div v-if="record.status==1">
                            <a-row>
                              <a class="label-sm blue" @click="editStatus(record.reply_id,2)"> 不予发布</a>
                           </a-row>
                        </div>
                        <div v-if="record.status==2">
                            <a-row>
<!--                               <a-col :span="8">-->
                                    <a class="label-sm blue" @click="editStatus(record.reply_id,1)"> 发布</a>
<!--                               </a-col>-->
                           </a-row>
                        </div>
                    </span>
                    <!--                    <template slot="title" slot-scope="currentPageData" style="padding: 0px;">-->
                    <!--                        -->
                    <!--                    </template>-->
                </a-table>
                <a-modal v-model="visible_note" width="1000px" title="详情" :footer="null" class="text-left">
                    <a-row>
                        <a-col :span="24">
                            {{article.name}}
                        </a-col>
                    </a-row>
                    <a-row v-if="article.images">
                        <template v-for="(item,index) of article.images">
                            <a-col :span="8" class="text-center">
                                <img :src="item" width="300" height="200">
                            </a-col>
                        </template>
                    </a-row>
                    <a-row>
                        <a-col :span="24">
                            {{article.content}}
                        </a-col>
                    </a-row>
                </a-modal>
            </a-layout-content>
        </a-spin>
    </div>
</template>

<script>
    import ARow from "ant-design-vue/es/grid/Row";
    import growGrassCommentApi from '@/api/grow_grass/platform'
    import ACol from "ant-design-vue/es/grid/Col";

    const columns = [
        {
            title: '评论内容',
            dataIndex: 'content',
            scopedSlots: {customRender: 'content'},
            width: "300px"
        },
        {
            title: '用户名',
            dataIndex: 'nickname',
            scopedSlots: {customRender: 'nickname'},
        },
        {
            title: '用户电话',
            dataIndex: 'phone',
            scopedSlots: {customRender: 'phone'},
        },
        {
            title: '发布内容',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
            width: "200px"
        },
        {
            title: '评论时间',
            dataIndex: 'add_time',
            scopedSlots: {customRender: 'add_time'},
            align: 'center'
        },
        {
            title: '发布状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];

    export default {
        name: "CommentManageList",
        components: {ACol, ARow},
        activated() {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.$set(this.pagination, 'total', 0)
            this.getCommentList1()
        },
        created() {
            this.getCommentList1()
        },
        data() {
            return {
                visible_note: false,
                columns,
                spinning: false,
                data: [],
                status_list: [
                    {id: 0, name: "待审核"},
                    {id: 1, name: "发布中"},
                    {id: 2, name: "未发布"},
                ],
                pagination: {
                    page: 1,
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => this.onPageChange(page, pageSize),
                    onShowSizeChange: (page, pageSize) => this.onPageSizeChange(page, pageSize),
                    showTotal: (total) => `共 ${total} 条评论`,
                },
                formData: {
                    status: "",
                    comment: ""
                },
                article: {
                    name: "",
                    images: [],
                    content: "",
                }
            }
        },
        methods: {
            getCommentList1() {
                if (this.pagination.total > 0) {
                    if (Math.ceil(this.pagination.total / this.pagination.pageSize) < this.pagination.page) {
                        this.pagination.current = 1
                        this.pagination.page = 1
                    }
                }
                this.request(growGrassCommentApi.getCommentList, {
                    page: this.pagination.page,
                    pageSize: this.pagination.pageSize
                }).then((res) => {
                    this.data = res.list
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.getCommentList1()
                }
            },
            editStatus(id, status) {
                this.$confirm({
                    title: '是否确定修改该状态?',
                    centered: true,
                    onOk: () => {
                        this.request(growGrassCommentApi.updateGrowGrassArticleReply, {
                            reply_id: id,
                            status: status
                        }).then((res) => {
                            this.getCommentList1()
                            this.$message.success('操作成功！')
                        })
                    },
                    onCancel() {
                    },
                })
            },
            showNote(article_id) {
                this.visible_note = true
                this.request(growGrassCommentApi.getArticle, {article_id: article_id}).then((res) => {
                    this.article = res
                })
            },
            handleStatusChange(val) {
                this.formData.status = val
            },
            commentFind() {
                this.request(growGrassCommentApi.getCommentList, this.formData).then((res) => {
                    this.data = res.list
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'page', page)
                this.$set(this.pagination, 'current', page)
                this.getCommentList1()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getCommentList1()
            },
        }
    }
</script>

<style scoped>
    .ant-table-title {
        position: relative;
        top: 1px;
        /* padding: 16px 0; */
        border-radius: 2px 2px 0 0;
    }
</style>