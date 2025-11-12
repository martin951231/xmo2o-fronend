<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="project_info">
                <a-form-item :label="$store.getters.config.single_name+'名称'" :required="true" :labelCol="labelCol"  :wrapperCol="wrapperCol">
                    <a-input
                        :maxLength="100"
                        style="width: 600px"
                        :placeholder="'请输入'+$store.getters.config.single_name+'名称'"
                        v-decorator="['post.buildingNameStrings',{ initialValue: post.buildingNameStrings, rules: [{ required: true, message: L('请输入'+$store.getters.config.single_name+'名称！') }] }]"
                    />
                    <div>&nbsp;支持多个{{$store.getters.config.single_name}}名称；英文逗号 “,” 分隔</div>
                </a-form-item>
                <a-form-item :label="$store.getters.config.single_name+'编号'" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                        :maxLength="100"
                        style="width: 600px"
                        :placeholder="'请输入'+$store.getters.config.single_name+'编号'"
                        v-decorator="['post.buildingNumberStrings',{ initialValue: post.buildingNumberStrings, rules: [{ required: true, message: L('请输入'+$store.getters.config.single_name+'编号！') }] }]"
                    />
                    <div>&nbsp;{{$store.getters.config.single_name}}编号：支持多个{{$store.getters.config.single_name}}编号；英文逗号 “,” 分隔；注意需要和名称 数量相同位置对应一一匹配，范围值[1,999]</div>
                </a-form-item>
                <a-form-item :label="'同'+$store.getters.config.single_name+$store.getters.config.floor_name+'数'" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                        :maxLength="30"
                        style="width: 300px"
                        :placeholder="'请输入同'+$store.getters.config.single_name+$store.getters.config.floor_name+'数'"
                        v-decorator="['post.unitNum',{ initialValue: post.unitNum, rules: [{ required: true, message: L('请输入同'+$store.getters.config.single_name+$store.getters.config.floor_name+'数！') }] }]"
                    />
                    <div>&nbsp;同{{$store.getters.config.single_name}}{{$store.getters.config.floor_name}}数：范围值[1,9]  由于生成不可变动 所以建议以数量多的为准</div>
                </a-form-item>
                <a-form-item :label="'同'+$store.getters.config.floor_name+'楼层数'" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                        :maxLength="30"
                        style="width: 300px"
                        :placeholder="'请输入同'+$store.getters.config.floor_name+'楼层数'"
                        v-decorator="['post.floorNum',{ initialValue: post.floorNum, rules: [{ required: true, message: L('请输入同'+$store.getters.config.floor_name+'楼层数！') }] }]"
                    />
                    <div>&nbsp;同{{$store.getters.config.floor_name}}楼层数：范围值[1,99]  由于生成不可变动 所以建议以数量多的为准</div>
                </a-form-item>
                <a-form-item :label="'同楼层'+$store.getters.config.room_name+'数'" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                        :maxLength="30"
                        style="width: 300px"
                        :placeholder="'请输入同楼层'+$store.getters.config.room_name+'数'"
                        v-decorator="['post.houseNum',{ initialValue: post.houseNum, rules: [{ required: true, message: L('请输入同楼层'+$store.getters.config.room_name+'数！') }] }]"
                    />
                    <div>&nbsp;同楼层{{$store.getters.config.room_name}}数：范围值[1,99]  由于生成不可变动 所以建议以数量多的为准</div>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>
    .imgname{
        width: 100px;
    }

    /deep/ .project_info .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .project_info .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .project_info .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .project_info .ant-upload-picture-card-wrapper{
        width: 15% !important;
    }
</style>
<script>
    import villageApi from '@/api/community/village';
	import store from '@/store';
    export default {
        components: {
        },
        data() {
            return {
                title: '新建',
                labelCol: {
                    span: 4
                },
                wrapperCol: {
                    span: 20
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible: false,
                post:{
                    buildingNameStrings : '', // 支持多个楼栋名称 英文逗号分隔
                    buildingNumberStrings:'', // 支持多个楼栋编号 英文逗号分隔 注意需要和名称 数量相同位置对应一一匹配
                    unitNum:'',  // 同一个楼栋下单元数量  [1,9]  由于生成不可变动 所以建议以数量多的为准
                    floorNum:'',  // 同一个单元下楼层数量  [1,99] 由于生成不可变动 所以建议以数量多的为准
                    houseNum:'',  // 同一个楼层下房间数量  [1,99] 由于生成不可变动 所以建议以数量多的为准
                    auto_syn:'0',  //是否对应自动匹配同步一下
                },
            }
        },
        mounted() {
        },
        methods: {
            add() {
                this.post={
                    buildingNameStrings : '', // 支持多个楼栋名称 英文逗号分隔
                    buildingNumberStrings:'', // 支持多个楼栋编号 英文逗号分隔 注意需要和名称 数量相同位置对应一一匹配
                    unitNum:'',  // 同一个楼栋下单元数量  [1,9]  由于生成不可变动 所以建议以数量多的为准
                    floorNum:'',  // 同一个单元下楼层数量  [1,99] 由于生成不可变动 所以建议以数量多的为准
                    houseNum:'',  // 同一个楼层下房间数量  [1,99] 由于生成不可变动 所以建议以数量多的为准
                    auto_syn:'0',  //是否对应自动匹配同步一下
                };
                this.title = '批量新增'+store.getters.config.single_name+store.getters.config.floor_name+'房屋';
                this.visible = true;
            },
            onChange(e) {
                console.log(`checked = ${e.target.value}`);
                this.post.auto_syn = e.target.value;
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
                        let url = villageApi.setDHBuildingToDeviceCloud;
                        values.post.auto_syn = this.post.auto_syn;
                        console.log('相关数据', values.post)
                        this.request(url, values.post)
                            .then((res) => {
                                this.confirmLoading = false
                                if (res.data.failNum >0 && res.data.failInfo) {
                                    for(var i in res.data.failInfo) {
                                        if (res.data.failInfo[i] && res.data.failInfo[i]['name']) {
                                            this.$notification['warning']({
                                                message: '注意',
                                                duration: 8,
                                                description: res.data.failInfo[i]['name'] + "(" + res.data.failInfo[i]['msg'] + ")"
                                            })
                                        }
                                    }
                                } else {
                                    this.$message.success('绑定成功')
                                    setTimeout(() => {
                                        this.form = this.$form.createForm(this)
                                        this.visible = false
                                        this.confirmLoading = false
                                        this.$emit('ok');
                                    }, 1500)
                                }
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
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>