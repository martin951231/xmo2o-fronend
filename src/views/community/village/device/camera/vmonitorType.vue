<template>
    <a-drawer title="视频监控类型" :width="1000" :visible="visible" :maskClosable="false" @close="handleCancel"
        placement="right">
        <p><a style="margin-left: 50px;" class="ant-btn ant-btn-primary" @click=addItem()> 添 加 </a></p>
        <div class="message-suggestions-list-box" style="margin-top: 5px;">
            <a-table :columns="columns" :data-source="data" class="components-table-demo-nested"
                :pagination="pagination" @change='table_change' :loading="loading" :row-key="record => record.id">
                <span slot="status_slot" slot-scope="text, record,index">
                    <span v-if="record.status==1" style="color: green;">已开启</span>
                    <span v-else-if ="record.status==0" style="color: red;">已关闭</span>
                </span>
                <span slot="action" slot-scope="text, record,index">
                    <a @click="editItem(record)">编辑</a>
                    <span v-if="record.xtype<1" >
                        <a-divider type="vertical" />
                        <a @click="delItem(record)">删除</a>
                    </span>
                </span>
            </a-table>
            <a-modal :width="500" :title="addtitle" :visible="visible_edit" :maskClosable=false
                :confirm-loading="confirmLoading" @cancel="handle2Cancel" @ok="handleSubmit">
                <a-form :form="form">
                    <a-form-item label="类型名称" :labelCol="labelCol" :required="true">
                        <a-col :span="18">
                            <a-input style="width: 250px" placeholder="15字符以内" autocomplete="off" name="vname"
                                :max-length='15' type="text" v-model="post.vname" />
                        </a-col>
                    </a-form-item>
                    <a-form-item label="排序值" :labelCol="labelCol">
                        <a-col :span="18">
                            <a-input-number style="width: 210px" placeholder="不填则默认为0,越大越靠前" name="xsort"
                                autocomplete="off" :min="0" v-model="post.xsort" />
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>
                    <a-form-item label="状态" :labelCol="labelCol" :required="true">
                        <a-col :span="18">
                            <a-radio-group v-model="post.status" :disabled="is_disabled">
                                <a-radio :value='1'>开启</a-radio>
                                <a-radio :value='0'>关闭</a-radio>
                            </a-radio-group>
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                </a-form>
            </a-modal>
        </div>
    </a-drawer>
</template>
<script>
    import villageApi from '@/api/community/village'
    import {
        Collapse
    } from 'ant-design-vue';

    const columns = [{
            title: '类型名称',
            dataIndex: 'vname',
            key: 'vname'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: {
                customRender: 'status_slot'
            }
        },
        {
            title: '排序值',
            dataIndex: 'xsort',
            key: 'xsort'
        },
        {
            title: '最后编辑时间',
            dataIndex: 'updatetime_str',
            key: 'updatetime_str'
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            width: 150,
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];

    const data = [];
    export default {
        name: 'videoMonitorTypeList',
        filters: {

        },
        components: {
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
                        span: 5
                    }
                },
                pagination: {
                    pageSize: 10,
                    total: 10,
                    current: 1
                },
                search: {
                    keyword: '',
                    key_val: 'name',
                    key_val1: 'paytime',
                    page: 1
                },
                form: this.$form.createForm(this),
                visible: false,
                visible_edit: false,
                loading: false,
                data,
                columns,
                page: 1,
                confirmLoading: false,
                editRecord: {},
                post: {
                    vname: '',
                    xsort: '',
                    status: 1,
                },
                idd: 0,
                addtitle: "添加",
                is_disabled:false,
            };
        },
        activated() {

        },
        methods: {
            listpage() {
                this.visible = true;
                this.idd = 0;
                this.visible_edit = false;
                this.getList()
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getVmonitorTypeList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                    })
            },
            handleSubmit() {
                if (!this.post.vname || this.post.vname.length < 1) {
                    this.$message.error('请填写类型名称!');
                    return false;
                }
                if (this.post.vname.length > 15) {
                    this.$message.error('请保持填写的类型名称在15个字符以内!');
                    return false;
                }
                this.post.id = this.idd;
                this.confirmLoading = true;
                this.request(villageApi.addVmonitorType, this.post)
                    .then((res) => {
                        this.confirmLoading = false
                        this.$message.success('保存成功!');
                        setTimeout(() => {
                            this.visible_edit = false;
                            this.idd = 0;
                            this.editRecord = {};
                            this.post = {
                                vname: '',
                                xsort: '',
                                status: 1,
                            };
                            this.getList()
                            this.$emit('ok');
                        }, 1000)

                    }).catch(error => {
                        this.confirmLoading = false
                    })

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
            handleCancel() {
                this.visible = false;
                this.idd = 0;
                this.editRecord = {};
                this.post = {
                    vname: '',
                    xsort: '',
                    status: 1,
                };
            },
            handle2Cancel() {
                this.visible_edit = false;
                this.idd = 0;
                this.editRecord = {};
                this.post = {
                    vname: '',
                    xsort: '',
                    status: 1,
                };
                this.is_disabled=false;
            },
            addItem() {
                this.visible_edit = true;
                this.editRecord = {};
                this.idd = 0;
                this.post = {
                    vname: '',
                    xsort: '',
                    status: 1,
                };
                this.is_disabled=false;
            },
            editItem(record) {
                this.visible_edit = true;
                this.editRecord = record;
                this.idd = record.id;
                this.post.vname = record.vname;
                this.post.xsort = record.xsort;
                this.post.status = record.status*1;
                if(record.xtype>0){
                    this.is_disabled=true;
                }
            },
            delItem(record) {
                let that = this
                let xcontent='你确定要删除【'+record.vname+'】这条数据吗？';
                if(record.relation_count>0){
                    xcontent='【'+record.vname+'】已经关联了'+record.relation_count+'条数据，您确定删除？';
                }
                that.$confirm({
                    title: '操作提示',
                    cancelText: '取消',
                    okText: "确认删除",
                    content: xcontent,
                    onOk() {
                        that.request(villageApi.delVmonitorType, {
                            idd: record.id
                        }).then((res) => {
                            that.$message.success('操作成功！')
                        }).catch(e => {
                            that.$message.error('操作失败！')
                        })
                        that.getList()
                    },
                    onCancel() {},
                });
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
                    pageSize: 20,
                    total: 20
                }
                this.table_change(val)
            },
            // 进行重置
            resetList() {
                this.search = {
                    keyword: '',
                    page: 1
                };
                this.getList()
            }

        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }

    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
        border: 1px solid #e4dfdf;
    }

    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }

    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }

    .message-suggestions-list-box .message_box {
        padding: 20px;
    }

    .lbsf {
        float: right;
        margin-right: 24px;
    }

    .padding-tp10 {
        padding-top: 15px;
        padding-bottom: 15px;
    }
</style>
