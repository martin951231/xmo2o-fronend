<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-row style="width: 100%;height:68px;border-bottom: 1px solid #f1f1f1;background-color: white;line-height: 68px;padding-left: 10px;">
                <a-col :span="19"></a-col>
                <a-col :span="5">
                    <a-row :gutter="4">
                        <a-col :span="12">
                            <a-input v-model="queryParam.cat_title" placeholder="输入检索关键字"/>
                        </a-col>
                        <a-col :span="12">
                            <a-button type="primary" @click="findCategory">查询</a-button>
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
                                    +新建类别
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
                                         emptyText:'暂无职位类别，创建分类后才能添加'
                    }"
                             @change="handleTableChange">
                    <span slot="cat_title" slot-scope="text">
                                {{text}}
                    </span>
                        <template slot="sort" slot-scope="text,record">
                            <a-input-number
                                    :default-value="text?text:0"
                                    :precision="0"
                                    :min="0"
                                    class="sort-input"
                                    v-model="record.sort"
                                    @blur="handleSortChange($event,text,record)"/>
                        </template>
                        <span slot="cat_id" slot-scope="text, record">
                            <a target="_blank" @click="$refs.editChildManageModal.add(record.cat_id)">
                                  管理
                            </a>
                        </span>

                        <span slot="add_time" slot-scope="text">
                                {{text}}
                            </span>
                        <span slot="action" slot-scope="text, record">
                                <a class="label-sm blue"
                                   @click="$refs.addChildModal.edit(record.cat_id)">编辑</a>
                                <a
                                        class="btn label-sm blue"
                                        style="margin-left: 10px"
                                        @click="childDel(record.cat_id)"
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
        <edit-tool ref="editToolModal" @handleUpdate="handleUpdate"></edit-tool>
        <add-child ref="addChildModal" @handleUpdate="handleUpdate"></add-child>
        <change-category ref="editChangeCategoryModal" @handleUpdate="handleUpdate"></change-category>
        <category-child-manage ref="editChildManageModal"></category-child-manage>
    </div>
</template>

<script>
    import recruitPlatformApi from '@/api/recruit/platform/index'
    import DragBox from '@/components/DragBox/DragBox'
    import ARow from "ant-design-vue/es/grid/Row";
    import ALayoutSider from "ant-design-vue/es/layout/Sider";
    import ACol from "ant-design-vue/es/grid/Col";
    import AddChild from "./modules/addChild";
    import EditTool from "./modules/EditTool";
    import ChangeCategory from "./modules/changeCategory";
    import CategoryChildManage from "./modules/categoryChildManage";

    const selectedRows = []
    const sortList = []
    const columns = [
        {
            title: '职位类别',
            dataIndex: 'cat_title',
            scopedSlots: {customRender: 'cat_title'},
        },
        {
            title: '排序',
            dataIndex: 'sort',
            scopedSlots: {customRender: 'sort'},
        },
        {
            title: '下属企业类别',
            dataIndex: 'cat_id',
            scopedSlots: {customRender: 'cat_id'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "RecruitJobCategory",
        components: {
            CategoryChildManage,
            ChangeCategory,
            EditTool,
            AddChild,
            ACol,
            ALayoutSider,
            ARow,
            DragBox,
        },
        data() {
            return {
                cat_title: "",
                data: [],
                columns,
                sortList,
                sortLoading: false,
                selectedRows,
                queryParam: {
                    page: 1,
                    pageSize: 10,
                    cat_id: 0,
                    cat_title: "",
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
                    this.getRecruitJobCategoryList()
                },
            },
        },
        mounted() {
            this.getRecruitJobCategoryList()
        },
        methods: {
            getRecruitJobCategoryList() {
                this.sortLoading = true
                this.sortList = []
                this.request(recruitPlatformApi.categoryList, {}).then((res) => {
                    this.sortLoading = false
                    if (res.length) {
                        this.sortList = res
                        this.getChildList(res[0].id)
                    } else {
                        this.data = []
                    }
                })
            },
            // 获得子列表
            getChildList(id) {
                this.selectedRows = []
                this.queryParam.page = 1
                this.queryParam.pageSize = 10
                this.queryParam.cat_id = id
                this.request(recruitPlatformApi.childList, this.queryParam).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            // 获得子列表
            getChildList1() {
                this.request(recruitPlatformApi.childList, this.queryParam).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            findCategory() {
                this.request(recruitPlatformApi.childList, this.queryParam).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            // 添加编辑删除回调
            handleUpdate() {
                this.getRecruitJobCategoryList()
            },
            // 左侧分类拖拽
            handleDragDataChange(val) {
                if (val.type == 'drag') {
                    // 拖拽
                    this.request(recruitPlatformApi.changeSort, {sort_list: val.data}).then((res) => {
                        this.getRecruitJobCategoryList()
                        this.$message.success(this.L('排序成功！'))
                    })
                } else if (val.type == 'edit') {
                    // 编辑
                    this.$refs.editToolModal.edit(val.data.id)
                } else if (val.type == 'click') {
                    // 点击
                    this.queryParam.cat_id = val.data.id
                    this.getChildList(this.queryParam.cat_id)
                }
            },
            //保存排序
            handleSortChange(e, val, record) {
                this.request(recruitPlatformApi.childChangeSort, {
                    sort: val,
                    cat_id: record.cat_id
                }).then((res) => {
                    this.queryParam['page'] = 1
                    this.getChildList1()
                })
            },
            // 设置为删除
            childDel(id) {
                this.$confirm({
                    title: '你确定删除此分类吗?',
                    centered: true,
                    onOk: () => {
                        this.request(recruitPlatformApi.delCategory, {cat_id: id}).then((res) => {
                            this.$message.success('删除成功！')
                            this.getRecruitJobCategoryList()
                        })
                    },
                    onCancel() {
                    },
                })
            },
            editAllCategory() {
                if (this.selectedRows.length > 0) {
                    this.$refs.editChangeCategoryModal.edit(this.queryParam.cat_id, this.selectedRows)
                } else {
                    this.$message.error('请选选择职位类别，再修改分类！')
                }
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRows = [];
                if (selectedRows.length) {
                    selectedRows.map((item) => {
                        this.selectedRows.push(item.cat_id)
                    })
                }
            },
            delAllChild() {
                if (this.selectedRows.length) {
                    this.$confirm({
                        title: '是否删除?',
                        centered: true,
                        onOk: () => {
                            this.request(recruitPlatformApi.delCategorys, {cat_ids: this.selectedRows}).then((res) => {
                                this.$message.success('删除成功！')
                                this.getRecruitJobCategoryList()
                            })
                        },
                        onCancel() {
                        },
                    })
                } else {
                    this.$message.error(this.L('请选择删除项！'))
                }
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    //this.getRecruitJobCategoryList()
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.queryParam.page = page
                this.$set(this.pagination, 'current', page)
                this.getChildList1()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getChildList1()
            },
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