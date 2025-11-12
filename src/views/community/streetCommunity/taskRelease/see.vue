<template>
    <a-modal :title="title" :width="850" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col">任务名称</span>
                    <a-input
                            :maxLength="30"
                            :disabled="true"
                            style="width: 400px"
                            placeholder="请输入任务名称"
                            v-decorator="['title',{ initialValue: post.title,rules: [{ required: true, message: L('请输入任务名称！') }] }]"
                    />
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col">完成时间</span>
                    <a-date-picker
                            :disabled="true"
                            :format="dateFormat"
                            placeholder="报名截止时间"
                            :value="date_moment(post.complete_time, dateFormat)"
                            @change="onChange"
                            :allowClear="false"
                    >
                    </a-date-picker>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ">完成数量</span>
                    <a-input-number
                            :disabled="true"
                            :min="1"
                            :max="999999999"
                            style="width: 175px"
                            placeholder="请输入完成数量"
                            v-decorator="['complete_num',{ initialValue: post.complete_num,rules: [{ required: true, message: L('请输入完成数量！') }] }]"
                    />
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col" style="float: left">任务内容</span>
                    <a-textarea
                            :disabled="true"
                            :maxLength="200"
                            style="width: 300px"
                            placeholder="请输入任务内容"
                            v-decorator="['content',{ initialValue: post.content,rules: [{ required: true, message: L('请输入任务内容！') }] }]"
                            :rows="4"
                    />
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import moment from 'moment';
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
                    title:'',
                    complete_time:'',
                    complete_num:'',
                    content:'',
                    wid_all:[]
                },
                selectedKeys: [],
                defaultExpandAll: true,
                dateFormat: 'YYYY-MM-DD',
            }
        },
        mounted() {},
        methods: {
            moment,
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return ''
                }
                return moment(time, dateFormat);
            },

            catIdChange(value){
                this.post.wid_all=value;
            },
            //编辑
            edit(title,id) {
                this.title = '查看【'+title+'】';
                this.post.id = id;
                this.getEditInfo();
            },
            //任务类型触发
            handleChange(val){
                this.post.wid_all=[];
            },
            // 截止日期切换，重新赋值
            onChange(date, dateString) {
                console.log('date', date)
                console.log('dateString', dateString)
                this.post.complete_time = dateString;
                //   this.detail.date = dateString;
            },
            //获取数据
            getEditInfo() {
                let that=this;
                that.confirmLoading = true;
                this.request(streetCommunityApi.getTaskReleaseOne, {id: that.post.id}).then((res) => {
                    that.visible = true;
                    that.post=res;
                    that.confirmLoading = false;
                }).catch((error)=>{
                    that.confirmLoading = false
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