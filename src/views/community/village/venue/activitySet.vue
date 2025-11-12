<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">

                <!--是否开启自动审核-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">是否开启自动审核</span>
                        <a-select
                                v-model="post.is_examine"
                        >
                            <a-select-option
                                    v-for="item in examine_arr"
                                    :key="item.key">
                                {{item.value}}
                            </a-select-option>
                        </a-select>
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
                    is_examine:'',
                },
                examine_arr:[{"key":1,"value":"否"},{"key":2,"value":"是"}],
            }
        },
        mounted() {
        },
        methods: {

            edit(id) {
                this.title = '预约设置';
                this.visible = true;
                this.is_disabled=false;
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
                        let url=villageApi.venueActivitySubSet;
                        this.request(url, this.post)
                            .then((res) => {
                                this.$message.success('操作成功')
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
                this.request(villageApi.venueActivityGetSet, {
                    id: this.post.id
                })
                    .then((res) => {
                        this.post=res;
                        this.confirmLoading = false;
                    })
            },
        },
    }
</script>
<style lang="less" scoped>
    /deep/ .ant-col-30 textarea{
        width: 75% !important;
    }
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
        width: 140px !important;
    }
    /deep/ .ant-select{
        width: 20% !important;
    }
    /deep/ .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
</style>