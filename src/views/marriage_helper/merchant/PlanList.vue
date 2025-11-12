<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-row style="width: 100%;height:68px;border-bottom: 1px solid #f1f1f1;background-color: white;line-height: 68px;padding-left: 10px;">
                <a-col :span="19">对准新人的婚事从筹备到婚礼与设计划事项,并可对计划事项增加辅助图文链接</a-col>
                <a-col :span="5">
                    <a-row :gutter="4">
                        <a-col :span="12">
                            <a-input v-model="plan_title" aria-placeholder="输入计划名称"/>
                        </a-col>
                        <a-col :span="12">
                            <a-button type="primary" @click="findPlan">查询</a-button>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <a-layout style="padding: 0 20px; background: #fff">
                <a-layout-sider>
                    <template v-if="sortList.length">
                        <div class="cat-list scroll_content br-f1">
                            <drag-box
                                    v-if="sortList.length"
                                    :list="sortList"
                                    :select="queryParam.cat_id"
                                    @handleChange="handleDragDataChange"
                            />
                        </div>
                        <div class="add-new-cat">
                            <span class="add-sort"
                                  @click="$refs.editToolModal.add('')">{{ L('新建分类') }}</span>
                        </div>
                    </template>
                    <template v-else-if="sortList.length == 0 && !sortLoading">
                        <div class="cat-list scroll_content br-f1">
                            <div class="text-center cr-99 mt-10">{{ L('暂无分类') }}</div>
                        </div>
                        <div class="add-new-cat text-center" :style="'bottom:100px'">
                            <span class="add-sort"
                                  @click="$refs.editToolModal.add('')">{{ L('新建分类') }}</span>
                        </div>
                    </template>
                </a-layout-sider>
                <a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                    <div class="table-operations">
                        <a-row align="top" style="padding: 0px;width: 100%;">
                            <a-col :span="2" class="text-center">
                                <a-button type="primary" @click="$refs.addChildModal.add(queryParam.cat_id)">
                                    +新建计划
                                </a-button>
                            </a-col>
                            <a-col :span="2" class="text-right">
                                <a-button type="default"
                                          @click="editAllCategory()">
                                    修改分类
                                </a-button>
                            </a-col>
                            <a-col :span="2" class="text-left">
                                <a-button type="default" @click="delAllChild">
                                    删除
                                </a-button>
                            </a-col>
                            <a-col :span="18" class="text-center">
                            </a-col>
                        </a-row>
                    </div>
                    <a-table :columns="columns"
                             :data-source="data"
                             :pagination="pagination"
                             :row-selection="{ selectedRows: selectedRows, onChange: onSelectChange }"
                             :locale="{
                                         emptyText:'暂无计划,创建分类后才能添加计划'
                    }"
                             @change="handleTableChange">
                    <span slot="plan_title" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="link_txt" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="link" slot-scope="text, record">
                            <a v-if="record.link" :href="record.link" target="_blank">
                                  查看
                            </a>
                            <span v-else>
                                无
                            </span>
                        </span>

                        <span slot="add_time" slot-scope="text">
                                {{text}}
                            </span>
                        <span slot="action" slot-scope="text, record">
                                <a class="label-sm blue"
                                   @click="$refs.addChildModal.edit(record.plan_id)">编辑</a>
                                <a
                                        class="btn label-sm blue"
                                        style="margin-left: 10px"
                                        @click="childDel(record.plan_id)"
                                >删除</a
                                >
                            </span>

                        <span v-if="data.length==0">
                            没有数据
                        </span>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <add-plan-category ref="editToolModal" @handleUpdate="handleUpdate"></add-plan-category>
        <edit-plan ref="addChildModal" @handleUpdate="handleUpdate"></edit-plan>
        <edit-all-plan-by-category ref="editPlanCategoryModal" @handleUpdate="handleUpdate"></edit-all-plan-by-category>
    </div>
</template>

<script>
    import marriageHelperCommentApi from '@/api/marriage_helper/platform'
    import DragBox from '@/components/DragBox/DragBox'
    import ARow from "ant-design-vue/es/grid/Row";
    import ALayoutSider from "ant-design-vue/es/layout/Sider";
    import ACol from "ant-design-vue/es/grid/Col";
    import AddPlanCategory from "./addPlanCategory";
    import EditAllPlanByCategory from "./EditAllPlanByCategory";
    import EditPlan from "./EditPlan";

    const selectedRows = []
    const sortList = []
    const columns = [
        {
            title: '计划名称',
            dataIndex: 'plan_title',
            scopedSlots: {customRender: 'plan_title'},
        },
        {
            title: '链接文案',
            dataIndex: 'link_txt',
            scopedSlots: {customRender: 'link_txt'},
        },
        {
            title: '链接地址',
            dataIndex: 'link',
            scopedSlots: {customRender: 'link'},
        },
        {
            title: '最后操作时间',
            dataIndex: 'add_time',
            scopedSlots: {customRender: 'add_time'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "PlanList",
        components: {
            EditPlan,
            EditAllPlanByCategory,
            AddPlanCategory,
            ACol,
            ALayoutSider,
            ARow,
            DragBox,
        },
        data() {
            return {
                sortList,
                sortLoading: false,
                selectedRows,
                data: [],
                columns,
                plan_title: "",
                // 查询参数
                queryParam: {
                    cat_id: 0,
                },
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageSizeChange,
                    showTotal: (total) => `共 ${total} 条记录`,
                },
            }
        },
        watch: {
            $route: {
                handler() {
                    this.getSortList()
                },
            },
        },
        mounted() {
            this.getSortList()
        },
        methods: {
            editAllCategory() {
                if (this.selectedRows.length > 0) {
                    this.$refs.editPlanCategoryModal.edit(this.queryParam.cat_id, this.selectedRows)
                } else {
                    this.$message.error('请选选择计划，再进行修改分类！')
                }
            },
            delAllChild() {
                if (this.selectedRows.length) {
                    this.$confirm({
                        title: '是否删除?',
                        centered: true,
                        onOk: () => {
                            this.request(marriageHelperCommentApi.delPlan, {plan_id: this.selectedRows}).then((res) => {
                                this.$message.success('删除成功！')
                                this.getChildList1()
                            })
                        },
                        onCancel() {
                        },
                    })
                } else {
                    this.$message.error(this.L('请选择删除项！'))
                }
            },
            getSortList() {
                this.sortLoading = true
                this.sortList = []
                this.request(marriageHelperCommentApi.planCategoryList, {}).then((res) => {
                    this.sortLoading = false
                    if (res.length) {
                        this.sortList = res
                        this.getChildList(res[0].id)
                    } else {
                        this.data = []
                    }
                })
            },
            // 获得商品列表
            getChildList(id) {
                this.selectedRows = []
                this.queryParam.cat_id = id
                this.request(marriageHelperCommentApi.childPlanList, this.queryParam).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            getChildList1() {
                this.data = []
                this.request(marriageHelperCommentApi.childPlanList, this.queryParam).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            // 左侧分类拖拽
            handleDragDataChange(val) {
                if (val.type == 'drag') {
                    // 拖拽
                    this.request(marriageHelperCommentApi.changePlanSort, {sort_list: val.data}).then((res) => {
                        this.getSortList()
                        this.$message.success(this.L('排序成功！'))
                    })
                } else if (val.type == 'edit') {
                    // 编辑
                    this.$refs.editToolModal.edit(val.data.id)
                } else if (val.type == 'click') {
                    // 点击
                    this.plan_title = ""
                    this.queryParam.cat_id = val.data.id
                    this.getChildList(this.queryParam.cat_id)
                }
            },
            // 添加编辑删除回调
            handleUpdate() {
                this.getSortList()
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getChildList1()
                }
            },
            //保存排序
            handleSortChange(e, val, record) {
                this.request(marriageHelperCommentApi.childChangeSort, {
                    sort: val,
                    cat_id: record.cat_id
                }).then((res) => {
                    this.queryParam['page'] = 1
                    this.getChildList1()
                })
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getChildList1()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getChildList1()
            },
            // 设置为删除
            childDel(id) {
                this.$confirm({
                    title: '你确定删除此计划吗?',
                    centered: true,
                    onOk: () => {
                        this.request(marriageHelperCommentApi.delPlan, {plan_id: id}).then((res) => {
                            this.$message.success('删除成功！')
                            this.getChildList1()
                        })
                    },
                    onCancel() {
                    },
                })
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRows = [];
                if (selectedRows.length) {
                    selectedRows.map((item) => {
                        this.selectedRows.push(item.plan_id)
                    })
                }
            },
            findPlan() {
                this.request(marriageHelperCommentApi.childPlanList, {plan_title: this.plan_title}).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.$set(this.pagination, 'total', res.count)
                })
            }
        }
    }
</script>

<style scoped>
    .detail-content >>> .ant-drawer-body {
        padding: 0;
    }

    .add-sort {
        color: #1890ff;
        border: 1px solid #1890ff;
        border-radius: 12px;
        padding: 10px 28px;
        background-color: #1890ff21;
        cursor: pointer;
    }

    #components-layout-demo-basic {
        text-align: left;
        background: #ffffff;
        height: 100%;
    }

    #components-layout-demo-basic .ant-layout {
        height: 100%;
    }

    #components-layout-demo-basic .ant-layout-header,
    #components-layout-demo-basic .ant-layout-footer {
        background: #ffffff;
        color: #fff;
        height: 80px;
    }

    #components-layout-demo-basic .ant-layout-sider {
        background: #ffffff;
        color: #fff;
    }

    #components-layout-demo-basic .ant-layout-content {
        background: #ffffff;
        color: #fff;
        min-height: 120px;
        line-height: 120px;
        padding-left: 20px;
    }

    #components-layout-demo-basic > .ant-layout {
        margin-bottom: 48px;
    }

    #components-layout-demo-basic > .ant-layout:last-child {
        margin: 0;
    }

    #components-layout-demo-basic .add-goods {
        margin: 0 20px;
    }

    #components-layout-demo-basic >>> .ant-btn-group {
        line-height: 80px;
    }

    #components-layout-demo-basic .edit-content {
        float: right;
        /* margin-right: 60px; */
    }

    #components-layout-demo-basic >>> .ant-tabs {
        display: inline-block;
    }

    #components-layout-demo-basic >>> .ant-layout-content {
        line-height: 70px;
    }

    .ant-pro-page-header-wrap-children-content,
    .ant-pro-page-header-wrap-children-content >>> .ant-tabs {
        width: 100%;
    }

    .message-suggestions-list-box {
        position: relative;
    }

    .search-input {
        position: absolute;
        right: 0;
        bottom: 36px;
    }

    .right-c {
        display: flex;
    }

    .goods-image {
        width: 48px;
        margin-right: 5px;
        height: 48px;
        border-radius: 4px;
    }

    .img-wrap {
        position: relative;
    }

    .yxj {
        position: absolute;
        top: 0;
        left: 0;
        width: 48px;
        height: 48px;
        line-height: 48px;
        font-size: 12px;
        text-align: center;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
    }

    .cat-list {
        position: absolute;
        width: 100%;
        left: 0;
        top: 20px;
        bottom: 90px;
        overflow-y: scroll;
    }

    .add-new-cat {
        position: absolute;
        text-align: center;
        width: 100%;
        left: 0;
        height: 50px;
        bottom: 50px;
    }
</style>