<template>
    <a-modal :title="title" :width="1200" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form">
                <a-form-item label="新闻标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <span class="f2206">{{detail.title}}</span>
                    </a-col>

                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="新闻封面图" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-row>
                            <div>
                                <img v-if="imageUrl" :src="imageUrl" class="imgname" alt="img" />
                            </div>
                        </a-row>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="发布内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="40">
                        <div v-html="detail.content"></div>
                    </a-col>
                </a-form-item>
                <a-form-item label="是否热门" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <span v-if="detail.is_hot == 1" class="f2206">是</span>
                        <span v-if="detail.is_hot == 2" class="f2206">否</span>
                    </a-col>
                </a-form-item>
                <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <span v-if="detail.status == 1" class="f2206">是</span>
                        <span v-if="detail.status == 2" class="f2206">否</span>
                    </a-col>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        data() {
            return {
                title: '新建',
                labelCol: {
                    xs: {
                        span: 20
                    },
                    sm: {
                        span: 4
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
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                detail: {
                    meeting_id: 0,
                    title: '',
                    content:'',
                    status: 1,
                    is_hot: 1,
                    cat_id: 0,
                    area_id: 0,
                    title_img: '',
                },
                meeting_id:0,
                imageUrl: '',
                img:'',
                cat_id:0,
                isClear: false,
                loading:false,
            }
        },
        components: {
        },
        mounted() {
        },
        methods: {
            edit(build_id,cat_id,title) {
                this.title = '查看【'+title+'】'
                this.visible = true
                this.cat_id = cat_id
                this.build_id = build_id
                this.getEditInfo()
                console.log(this.title)
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.cat_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getPartyBuildInfo, {
                    build_id: this.build_id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            build_id: 0,
                            title: '',
                            content:'',
                            status: 0,
                            is_hot: 0,
                            cat_id: 0,
                            area_id: 0,
                            title_img: '',
                        };
                        this.checkedKeys=[];
                        if (typeof(res)=='object') {
                            this.detail = res
                            this.cat_id = res.cat_id;
                            this.build_id = res.build_id;
                            this.imageUrl = res.title_img;
                            this.img = res.title_img;
                        }
                        console.log('detail',this.detail)
                    })
            },
        },
    }
</script>
<style lang="less" scoped>
    /deep/ .f2206{
        font-weight: bold !important;
    }

    .ant-form-item label {
        width: 50px;
    }
    .tip-txt {
        margin-left:4px;font-size: 12px;
    }
    .add-box-tip {
        text-align: -webkit-center;
        padding: 0 6px;
        margin-left: 8px;
        border-radius: 15px;
        border: none;
    }
    .imgname{
        width: 100px;
    }

</style>