<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">权限方案名称</span>
                    <a-input
                            :maxLength="30"
                            style="width: 300px"
                            placeholder="请输入权限方案名称"
                            v-decorator="['title',{ initialValue: post.title,rules: [{ required: true, message: L('请输入权限方案名称！') }] }]"
                    />
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">分组名称</span>
                    <a-select
                            show-search
                            option-filter-prop="children"
                            style="width: 300px"
                            placeholder="请选择分组名称"
                            v-decorator="['group_id',{ initialValue: post.group_id,rules: [{ required: true, message: L('请选择分组名称！') }] }]"
                    >
                        <a-select-option
                                v-for="item in group_list"
                                :key="item.id">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required" style="float: left;">选择人员：</span>
                    <a-col :span="14">
                        <a-tree
                                :tree-data="treeData"
                                :default-expand-all="defaultExpandAll"
                                :defaultExpandedKeys="[treeData[0].key]"
                                v-model="post.wid_all"
                                checkable
                        />
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col float_l">备注</span>
                    <a-textarea
                            :maxLength="100"
                            style="width: 300px"
                            placeholder="请输入备注"
                            v-decorator="['remarks', { initialValue: post.remarks}]"
                            :rows="4"
                    />
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import villageApi from '@/api/community/village';
    export default {
        components: {
        },
        data() {
            return {
                title: '',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible: false,
                post:{
                    id:0,
                    title:'',
                    remarks:'',
                    wid_all:[]
                },
                group_list:[],
                treeData:[],
                expandedKeys: [],
                autoExpandParent: true,
                selectedKeys: [],
                defaultExpandAll: true,
            }
        },
        mounted() {
        },
        methods: {
            //添加
            add() {
                this.title = '添加权限方案组';
                this.visible = true;
                this.post = {
                    id:0,
                    title:'',
                    remarks:'',
                    group_id:undefined,
                    wid_all:[]
                };
                this.getGroupAll();
                this.getTissue(this.post.id);
            },
            //编辑
            edit(title,id) {
                this.title = '编辑【'+title+'】';
                this.post.id = id;
                this.getGroupAll();
                this.getTissue(id);

            },
            //获取分组数据
            getGroupAll(){
                this.request(villageApi.houseProgrammeGroupAll).then((res) => {
                    this.group_list = res
                }).catch((error) => {})
            },
            //获取人员数据
            getTissue(id){
                this.request(villageApi.houseProgrammeTissueNav).then((res) => {
                    this.treeData = res;
                    this.defaultExpandAll = false; //默认只展开第一级
                    if(id > 0){
                        this.getEditInfo();
                    }
                }).catch((error) => {})
            },
            //提交
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        let url=villageApi.houseProgrammeProgrammeAdd;
                        if(this.post.id > 0){
                            url=villageApi.houseProgrammeProgrammeSub;
                        }
                        values.wid_all=this.post.wid_all;
                        values.id=this.post.id;
                        this.request(url, values)
                            .then((res) => {
                                if (this.post.id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    console.log(123)
                                    this.$emit('ok')
                                }, 1500)
                                console.log(345)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            //取消
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.post.id = 0;
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            //获取数据
            getEditInfo() {
                this.confirmLoading = true;
                this.request(villageApi.houseProgrammeProgrammeQuery, {id: this.post.id}).then((res) => {
                    this.post=res;
                    this.confirmLoading = false;
                    this.visible = true;
                })
            },
        },
    }
</script>
<style lang="less" scoped>
    /deep/ .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .box_width{
        display: inline-block;
        width: 97px !important;
    }
    /deep/ .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .ant-input-number{
        width: 300px !important;
        display: inline-block;
    }

    /deep/ .float_l{
        float: left;
    }

</style>