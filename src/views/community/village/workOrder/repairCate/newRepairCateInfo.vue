<template>
    <a-modal  :title="title" :width="700" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" style="padding-left: 35px;">
                <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-col :span="10">
                        <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">类目名称:</span>
                    </a-col>
                    <a-col :span="14">
                        <a-input placeholder="请输入类目名称(6字以内)" v-model="group.name"  :disabled="disabled"/>
                    </a-col>
                </a-form-item>
                <a-form-item   :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-col :span="10">
                        <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">背景色:</span>
                    </a-col>
                    <a-col :span="11">
                        <a-input placeholder="请输入背景色"  v-model="group.color"  :disabled="true"/>
                    </a-col>
                    <a-col :span="1">
                    </a-col>
                    <a-col :span="2">
                        <colorPicker v-model="color" v-on:change="headleChangeColor" ></colorPicker>
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_grab_order">
                    <a-col :span="10">
                        <span style="float: left;margin-left: 35px;margin-right: 10px;">关联部门:</span>
                    </a-col>
                    <a-col :span="14">
                        <a-tree
                                :tree-data="treeData"
                                :default-expand-all="defaultExpandAll"
                                :defaultExpandedKeys="[treeData[0].key]"
                                v-model="group.group_id_all"
                                checkable
                        />
                    </a-col>
                </a-form-item>

                <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-col :span="10">
                        <span class="ant-form-item-required" style="float: left;margin-left: 35px;margin-right: 10px;">状态:</span>
                    </a-col>
                    <a-col :span="14">
                        <a-radio-group v-model="group.status">
                            <a-radio :value="1">
                                开启
                            </a-radio>
                            <a-radio :value="2" >
                                关闭
                            </a-radio>
                        </a-radio-group>
                    </a-col>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import configVillageApi from "@/api/community/village"
    import vcolorpicker from 'vcolorpicker'
    import Vue from 'vue'
    Vue.use(vcolorpicker)
    export default {
        data() {
            return {
                title: '添加',
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
                disabled:false,
                value: null,
                color: '#d5b6b6',
                defaultColor:'#d5b6b6',
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                group: {
                    id: 0,
                    name:'',
                    color: '#d5b6b6',
                    status:1,
                    group_id_all:[]
                },
                id:0,
                treeData:[],
                defaultExpandAll: true,
                is_grab_order:false,
                selectKey:[]
            }
        },
        methods: {

            add() {
                this.title = '添加'
                this.visible = true
                this.disabled=false
                this.group= {
                    id: 0,
                    name:'',
                    color: '#d5b6b6',
                    status:1,
                    type:1,
                    group_id_all:[]
                };
                this.selectKey=[];
                this.getTissue(this.group.id);
            },
            edit(id) {
                this.visible = true
                this.id = id;
                this.group.group_id_all=[];
                this.selectKey=[];
                this.getTissue(id);
                if (this.id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '添加'
                }
            },
            getRepairCateInfo(){
                this.request(configVillageApi.newRepairCateEdit, {
                    id: this.id,
                    type:1
                }).then((res) => {
                    this.group.id = res.id;
                    this.group.status = res.status;
                    this.group.name=res.cate_name;
                    this.group.color=res.color;
                    this.group.group_id_all=res.group_id_all;

                    /*if(res.group_id_all.length > 0){
                        this.group.group_id_all=res.group_id_all;
                    }else{
                        this.group.group_id_all=this.selectKey;
                    }*/
                    this.color=res.color
                    if (res.flag==1){
                        this.disabled=true
                    }else{
                        this.disabled=false
                    }

                })
            },
            headleChangeColor(value){
                console.log('color',value)
                this.group.color=value
            },
            handleSubmit() {
                this.confirmLoading = true
                this.group.id= this.id;
                if(this.group.name.length>6){
                    this.$message.error('请保持类目名称6个字以内！')
                    this.confirmLoading = false
                    return false;
                }
                let url=configVillageApi.newRepairCateAdd;
                if(this.group.id > 0){
                    url=configVillageApi.newRepairCateEdit;
                }
                this.request(url, this.group)
                    .then((res) => {
                        if (this.group.id > 0 ) {
                            this.$message.success('编辑成功')
                        } else {
                            this.$message.success('添加成功')
                        }
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.visible = false
                            this.confirmLoading = false
                            this.$emit('ok')
                        }, 1500)
                    })
                    .catch((error)=>{
                        this.confirmLoading = false
                    })

            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },

            //获取部门数据
            getTissue(id){
                this.request(configVillageApi.newRepairTissueNav).then((res) => {
                    this.is_grab_order=res.status;
                    this.treeData = res.list.data;
                    if(res.list.key){
                        if(id == 0){
                            this.group.group_id_all=res.list.key;
                        }
                        this.selectKey=res.list.key;
                    }
                    this.defaultExpandAll = false; //默认只展开第一级
                    if(id > 0){
                        this.getRepairCateInfo()
                    }
                }).catch((error) => {})
            },
        },
    }
</script>
<style scoped>
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

</style>
<style type="text/css">
    .m-colorPicker .open{width: 220px !important;z-index: 100;}
</style>