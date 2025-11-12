<template>
    <div class="message-suggestions-list-box">
        <div class="search-box" style="padding-bottom: 20px;">
            <a-row>
                <a-col :md="6" :sm="24" class="suggestions_col">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">分类名称：</label>
                        <a-input style="width: 250px" placeholder="请输入分类名称" v-model="search.keyword" />
                    </a-input-group>
                </a-col>
                <a-col :md="7" :sm="24" class="suggestions_col">
                    <label style="margin-top: 5px;">时间筛选：</label>
                    <a-range-picker @change="dateOnChange" :allowClear="true" style="width: 300px;">
                        <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                </a-col>
                <a-col :md="2" :sm="24" class="suggestions_col_btn">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
            </a-row>
        </div>
        <a-row>
            <a-col style="margin-bottom: 18px;">
                <a-button type="primary" @click="addCategory" v-if="role_addcategory==1">新建分类</a-button>
                <a-button type="default" style="margin-left: 20px;margin-right: 20px;" @click="$refs.uploadMaterialModal.uploadXfile(1)" v-if="role_addcategory==1" >导入文字素材</a-button>
                <a-button type="danger" @click="delCategoryMany()" v-if="role_delcategory==1" >批量删除</a-button>
            </a-col>
        </a-row>
        <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
            @change='table_change' :loading="loading" :row-key="record => record.cate_id" :row-selection="rowSelection">
            <span slot="manageaction" slot-scope="text, record,index">
                <a-button type="default" @click="$refs.materialModel.xList(record,1)" v-if="role_managecategory==1" > 管 理 </a-button>
            </span>
            <span slot="action" slot-scope="text, record,index">
                <a @click="editCategory(record)" v-if="role_editcategory==1" > 编辑 </a>
                <a-divider type="vertical" v-if="role_delcategory==1 && role_editcategory==1" />
                <a-popconfirm title="您确定将此条分类数据删除吗？" ok-text="确定" cancel-text="取消" @confirm="delCategory(record,0)" v-if="role_delcategory==1" >
                    <a href="#"> 删 除 </a>
                </a-popconfirm>
            </span>
        </a-table>

        <a-modal :title="titleCategory" :width="600" :visible="visibleCategory" :maskClosable="false"
            :confirmLoading="confirmLoading" @ok="handleCategorySubmit" @cancel="handleCategoryCancel">
            <a-spin :spinning="confirmLoading" :height="500">
                <a-form :form="form">
                    <a-form-item label="分类名称" required>
                        <a-input placeholder="请输入分类名称，最多20个字" :maxLength="20" v-model.trim="categoryname"
                            style="width: 300px" />
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-modal>
     <material-list-page :height='800' :width="1200" ref="materialModel" @ok="handleOk"/>
     <upload-hotword-material :height='500' :width="400" ref="uploadMaterialModal" @ok="handleOk"/>
    </div>
</template>

<script>
    import villageApi from '@/api/community/village'
    import materialListPage from './materialList.vue';
    import uploadHotwordMaterial from './uploadMaterial.vue';
    import { Collapse } from 'ant-design-vue';
    const columns = [{
            title: '分类名称',
            dataIndex: 'categoryname',
            key: 'categoryname',
            width: 310
        },
        {
            title: '更新时间',
            dataIndex: 'update_time_str',
            key: 'update_time_str',
            width: 200
        },
        {
            title: '回复文字管理',
            dataIndex: 'cate_id',
            key: 'cate_id',
            align: 'center',
            scopedSlots: {
                customRender: 'manageaction'
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            align: 'center',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];

    const data = [];
    export default {
        name: 'hotWordManageListText',
        filters: {

        },
        props: {
            params: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        watch: {
            params: {
                immediate: true,
                handler(val) {
                    console.log("val===>", val)
                    this.getList()
                }

            }
        },
        components: {
            materialListPage,
            uploadHotwordMaterial,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                    xs: {
                        span: 10
                    },
                    sm: {
                        span: 3
                    }
                },
                pagination: {
                    pageSize: 10,
                    total: 10,
                    current: 1
                },
                search: {
                    keyword: ''
                },
                form: this.$form.createForm(this),
                loading: false,
                data,
                columns,
                page: 1,
                confirmLoading: false,
                titleCategory: '新建分类',
                visibleCategory: false,
                categoryname: '',
                cate_id: 0,
                selectedRowKeys: [],
                role_addcategory:0,
                role_editcategory:0,
                role_delcategory:0,
                role_managecategory:0,
            };
        },
        activated() {

        },
        computed: {
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRowKeys', selectedRowKeys);
                        this.selectedRowKeys = selectedRowKeys;
                    },
                    onSelect: (record, selected, selectedRows, nativeEvent) => {
                        //console.log('record,',record,'selected',selected);
                    },
                }
            }
        },
        methods: {
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search.page = this.page;
                this.search.xtype = 1;
                this.request(villageApi.getHouseHotWordMaterialCategoryLists, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.role_addcategory= res.role_addcategory;
                        this.role_editcategory= res.role_editcategory;
                        this.role_delcategory= res.role_delcategory;
                        this.role_managecategory= res.role_managecategory;
                        this.loading = false
                    })
            },
            handleOk() {
                this.getList();
            },
            delCategory(record) {
                let postArr = {
                    cate_ids: record.cate_id,
                    village_id: record.village_id,
                    xtype:1
                };
                this.request(villageApi.deleteHouseHotWordMaterialCategory, postArr)
                    .then((res) => {
                        this.$message.success('删除成功')
                        setTimeout(() => {
                            this.confirmLoading = false
                            this.getList();
                        }, 1000)
                    })
            },
            delCategoryMany() {
                if(this.selectedRowKeys.length<1){
                   this.$message.error('请至少选择一项要删除的数据！')
                   return false;
                }
                console.log('cate_ids',this.selectedRowKeys);
                let _this = this;
                let postArr = {
                    cate_ids: this.selectedRowKeys.join(','),
                    xtype:1
                };
                this.$confirm({
                    title: '确认删除',
                    content: '您确认要删除您选中的这些数据吗',
                    onOk() {
                        _this.request(villageApi.deleteHouseHotWordMaterialCategory, postArr)
                            .then((res) => {
                                _this.$message.success('删除成功')
                                setTimeout(() => {
                                    _this.confirmLoading = false
                                    _this.getList()
                                }, 1000)
                            })
                    },
                    onCancel() {},
                });
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList()
                }
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.page = 1;
                let val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                console.log('searchList')
                this.table_change(val)
            },
            // 进行重置
            resetList() {
                this.search = {
                    keyword: '',
                    page: 1
                };
                this.page = 1;
                this.getList()
            },
            handleCategorySubmit() {
                if (this.categoryname.length < 1) {
                    this.$message.error('分类名称不能为空！')
                    return false;
                }
                let postArr = {};
                postArr.categoryname = this.categoryname;
                postArr.cate_id = this.cate_id;
                postArr.xtype = 1;
                this.confirmLoading = true;
                this.request(villageApi.saveMaterialCategoryData, postArr).then((res) => {
                    this.confirmLoading = false;
                    if(res.is_have_err!=undefined && res.is_have_err==1){
                        this.$message.error(res.errmsg)
                        return false;
                    }
                    if (this.cate_id > 0) {
                        this.$message.success('编辑成功！')
                    } else {
                        this.$message.success('添加成功！')
                    }
                    this.handleCategoryCancel();
                    this.getList();
                })
            },
            handleCategoryCancel() {
                this.categoryname = '';
                this.cate_id = 0;
                this.visibleCategory = false;
                this.confirmLoading = false;
            },
            addCategory() {
                this.titleCategory = '新建分类';
                this.cate_id = 0;
                this.visibleCategory = true;
            },
            editCategory(record) {
                this.cate_id = record.cate_id;
                this.categoryname = record.categoryname;
                this.titleCategory = '编辑分类';
                this.visibleCategory = true;
            },
        }
    };
</script>

<style lang="less" scoped>
    /deep/ .ant-form-item-control-wrapper {
        display: inline-block;
    }
</style>
