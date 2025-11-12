<template>
    <a-modal :title="title" :width="850" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">类型</span>
                    <a-select
                            style="width: 300px"
                            placeholder="请选择类型"
                            v-decorator="['type',{ initialValue: post.type,rules: [{ required: true, message: L('请选择类型！') }] }]"
                    >
                        <a-select-option
                                v-for="item in care_type"
                                :key="item.key">
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                </a-form-item>


                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">数量</span>
                    <a-input-number
                            :min="1"
                            :max="999999999"
                            style="width: 175px"
                            placeholder="请输入数量"
                            v-decorator="['num',{ initialValue: post.num,rules: [{ required: true, message: L('请输入完成数量！') }] }]"
                    />
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col" style="float: left">备注</span>
                    <a-textarea
                            :maxLength="200"
                            style="width: 300px"
                            placeholder="请输入备注内容"
                            v-decorator="['remarks',{ initialValue: post.remarks }]"
                            :rows="4"
                    />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
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
                    type:undefined,
                    num:'',
                    remarks:'',
                },
                care_type:[]
            }
        },
        mounted() {},
        methods: {

            //获取类型
            getCareType(){
                this.request(streetCommunityApi.getCommunityCareType).then((res) => {
                    this.care_type = res
                }).catch((error) => {})
            },

            //添加
            add() {
                this.title = '添加';
                this.visible = true;
                this.post = {
                    id:0,
                    type:undefined,
                    num:'',
                    remarks:'',
                };
                this.getCareType();
            },
            //编辑
            edit(id) {
                this.title = '编辑ID：'+id;
                this.post.id = id;
                this.getCareType();
                this.getEditInfo();
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
                        let url=streetCommunityApi.communityCareAdd;
                        if(this.post.id > 0){
                            url=streetCommunityApi.communityCareSub;
                        }
                        values.complete_time=this.post.complete_time;
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
                this.request(streetCommunityApi.communityCareOne, {id: this.post.id}).then((res) => {
                    this.post=res;
                    this.confirmLoading = false;
                    this.visible = true;
                    console.log('rrrrr',this.post)
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