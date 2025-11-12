<template>
    <a-modal :title="title" :width="850" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="status1">
                    <span class="box_width label_col ant-form-item-required">任务类型</span>
                    <a-select
                            style="width: 300px"
                            :disabled="(post.id > 0 ? true :false)"
                            placeholder="请选择任务类型"
                            @change="handleChange"
                            v-decorator="['type',{ initialValue: post.type,rules: [{ required: true, message: L('请选择任务类型！') }] }]"
                    >
                        <a-select-option
                                v-for="item in type_all"
                                :key="item.key">
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">任务名称</span>
                    <a-input
                            :maxLength="30"
                            style="width: 400px"
                            placeholder="请输入任务名称"
                            v-decorator="['title',{ initialValue: post.title,rules: [{ required: true, message: L('请输入任务名称！') }] }]"
                    />
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">完成时间</span>
                    <a-date-picker
                            v-if="post.complete_time"
                            :format="dateFormat"
                            placeholder="报名截止时间"
                            :value="date_moment(post.complete_time, dateFormat)"
                            @change="onChange"
                            :allowClear="false"
                    >
                    </a-date-picker>
                    <a-date-picker
                            v-else
                            :format="dateFormat"
                            placeholder="报名截止时间"
                            @change="onChange"
                            :allowClear="false"
                    >
                    </a-date-picker>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required">完成数量</span>
                    <a-input-number
                            :min="1"
                            :max="999999999"
                            style="width: 175px"
                            placeholder="请输入完成数量"
                            v-decorator="['complete_num',{ initialValue: post.complete_num,rules: [{ required: true, message: L('请输入完成数量！') }] }]"
                    />
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required" style="float: left">任务内容</span>
                    <a-textarea
                            :maxLength="200"
                            style="width: 300px"
                            placeholder="请输入任务内容"
                            v-decorator="['content',{ initialValue: post.content,rules: [{ required: true, message: L('请输入任务内容！') }] }]"
                            :rows="4"
                    />
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="status2">
                    <span class="box_width label_col ant-form-item-required" style="float: left;">选择分配：</span>
                    <a-col :span="14" v-if="treeStatus">
                        <a-tree
                                :tree-data="treeData"
                                :default-expand-all="defaultExpandAll"
                                v-model="post.wid_all"
                                checkable
                        />
                    </a-col>
                    <a-col :span="14" v-else>
                        <a-select
                                mode="multiple"
                                option-label-prop="label"
                                style="width: 300px"
                                placeholder="请选择人员"
                                v-model="post.wid_all"
                                @change="catIdChange"
                        >
                            <a-select-option v-for="item in treeData"  :key="item.id" :label="item.title">
                                {{item.title}}
                            </a-select-option>
                        </a-select>
                    </a-col>
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
                treeData:[],
                selectedKeys: [],
                defaultExpandAll: true,
                dateFormat: 'YYYY-MM-DD',
                type_all:[],
                treeStatus:true,
                status1:false,
                status2:false,
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
            //添加
            add() {
                this.title = '添加任务';
                this.visible = true;
                this.status2=false;
                this.post = {
                    id:0,
                    task_type:undefined,
                    title:'',
                    complete_time:'',
                    complete_num:'',
                    content:'',
                    wid_all:[]
                };
                this.getType(this.post.id);
            },
            //编辑
            edit(title,id) {
                this.title = '编辑【'+title+'】';
                this.post.id = id;
                this.status2=false;
                this.getEditInfo();
            },
            //获取任务类型
            getType(id){
                let that=this;
                this.request(streetCommunityApi.getTaskReleaseType).then((res) => {
                    that.type_all = res.list;
                    that.status1 = res.typeStatus;
                    if(!that.status1){
                        that.getTissue(that.post.id,0);
                    }
                })
            },
            //任务类型触发
            handleChange(val){
                this.post.wid_all=[];
                this.getTissue(this.post.id,val);
            },
            //获取组织数据
            getTissue(id,type){
                let that=this;
                that.status2=true;
                this.request(streetCommunityApi.getTaskReleaseTissueNav,{type:type}).then((res) => {
                    that.treeStatus=res.typeStatus;
                    that.treeData = res.list;
                    that.defaultExpandAll = true;
                })
            },
            // 截止日期切换，重新赋值
            onChange(date, dateString) {
                console.log('date', date)
                console.log('dateString', dateString)
                this.post.complete_time = dateString;
                //   this.detail.date = dateString;
            },
            //提交
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this;
                let that=this;
                that.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        let url=streetCommunityApi.taskReleaseAdd;
                        if(this.post.id > 0){
                            url=streetCommunityApi.taskReleaseSub;
                        }
                        values.complete_time=that.post.complete_time;
                        values.wid_all=that.post.wid_all;
                        values.id=that.post.id;
                        this.request(url, values).then((res) => {
                            if (that.post.id>0) {
                                that.$message.success('编辑成功')
                            } else {
                                that.$message.success('添加成功')
                            }
                            setTimeout(() => {
                                that.form = that.$form.createForm(that)
                                that.visible = false;
                                that.confirmLoading = false;
                                that.$emit('ok')
                            }, 1500)
                        }).catch((error)=>{
                            that.confirmLoading = false
                        })
                    } else {
                        that.confirmLoading = false
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
                let that=this;
                that.confirmLoading = true;
                this.request(streetCommunityApi.getTaskReleaseOne, {id: that.post.id}).then((res) => {
                    that.visible = true;
                    that.post=res;
                    that.getType(that.post.id);
                    that.getTissue(that.post.id,that.post.type);
                    that.confirmLoading = false;
                }).catch((error)=>{
                    that.confirmLoading = false
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