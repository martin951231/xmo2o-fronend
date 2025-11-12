<template>
    <a-modal :title="title" :width="850" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">系列</span>
                    <a-select
                            show-search
                            option-filter-prop="children"
                            style="width: 300px"
                            placeholder="请选择系列"
                            v-decorator="['series_id',{ initialValue: post.series_id,rules: [{ required: true, message: L('请选择系列！') }] }]"
                    >
                        <a-select-option
                                v-for="item in series_all"
                                :key="item.id">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">类型</span>
                    <a-select
                            show-search
                            option-filter-prop="children"
                            style="width: 300px"
                            placeholder="请选择类型"
                            v-decorator="['type_id',{ initialValue: post.type_id,rules: [{ required: true, message: L('请选择类型！') }] }]"
                    >
                        <a-select-option
                                v-for="item in type_all"
                                :key="item.id">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">数量</span>
                    <a-input-number
                            :min="0"
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
                    series_id:undefined,
                    type_id:undefined,
                    num:'',
                    remarks:'',
                },
                series_all:[],
                type_all:[],
            }
        },
        mounted() {},
        methods: {

            //获取类型
            getParamAll(){
                this.request(streetCommunityApi.getEpidemicPreventParamAll).then((res) => {
                    this.series_all = res.series_list;
                    this.type_all = res.type_list
                }).catch((error) => {})
            },
            //添加
            add() {
                this.title = '添加';
                this.visible = true;
                this.post = {
                    id:0,
                    series_id:undefined,
                    type_id:undefined,
                    num:'',
                    remarks:'',
                };
                this.getParamAll();
            },
            //编辑
            edit(id) {
                this.title = '编辑ID：'+id;
                this.post.id = id;
                this.getParamAll();
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
                        let url=streetCommunityApi.epidemicPreventRecordAdd;
                        if(this.post.id > 0){
                            url=streetCommunityApi.epidemicPreventRecordSub;
                        }
                        values.complete_time=this.post.complete_time;
                        values.wid_all=this.post.wid_all;
                        values.id=this.post.id;
                        this.request(url, values).then((res) => {
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
                            }).catch((error)=>{
                                this.confirmLoading = false
                            })

                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleFunc(res){
                console.log('vvvvvv',res,this.series_all,this.type_all)
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
                this.request(streetCommunityApi.epidemicPreventRecordOne, {id: this.post.id}).then((res) => {
                    this.post=res;
                    if(res.type_id == 0){
                        this.post.type_id=undefined;
                    }
                    if(res.series_id == 0){
                        this.post.series_id=undefined;
                    }
                    this.handleFunc(res)
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