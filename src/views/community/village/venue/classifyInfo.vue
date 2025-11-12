<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">

                <!--活动场馆类型-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">活动场馆类型</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                                placeholder="请输入类型名称"
                                v-decorator="['title',{ initialValue: post.title,rules: [{ required: true, message: L('请输入类型名称！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--排序-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">排序</span>
                        <a-input-number
                                :min="0" :max="999999999"
                                placeholder="请输入"
                                v-decorator="['sort',{ initialValue: post.sort }]"
                        /> 值越大，越靠前显示。
                    </a-col>
                    <a-col :span="6"></a-col>
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
                title: '新建',
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
                    sort:0,
                },
            }
        },
        mounted() {
        },
        methods: {

            add() {
                this.title = '添加活动场馆类型';
                this.visible = true;
                this.post = {
                    id:0,
                    title:'',
                    sort:0,
                };

            },
            edit(id) {
                this.title = '编辑预缴周期';
                this.post.id = id;
                this.imgUrl='';
                this.getEditInfo();
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true;

                validateFields((errors, values) => {
                    if (!errors) {
                        let url=villageApi.venueClassifyAdd;
                        if(this.post.id > 0){
                            url=villageApi.venueClassifySub;
                        }
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
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.post.id = 0;
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.confirmLoading = true;
                this.request(villageApi.venueClassifyEdit, {
                    id: this.post.id
                })
                    .then((res) => {
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

</style>