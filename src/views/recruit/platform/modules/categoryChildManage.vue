<template>
    <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-row>
                <a-col :span="4">
                    <a-button type="primary" @click="addCategory">新增</a-button>
                </a-col>
            </a-row>
            <a-row style="padding-top: 10px;">
                <template v-for="(item, index) in inp_cat">
                    <a-row :key="index" style="padding-top: 15px;">
                        <a-col :span="20">
                            <a-input type="hidden" v-model="item.cat_id"></a-input>
                            <a-input placeholder="限10个字" v-model="item.cat_title"/>
                        </a-col>
                        <a-col :span="4" style="padding-left: 15px;line-height: 30px;">
                            <a-icon type="delete" @click="removeDomain(item)"/>
                        </a-col>
                    </a-row>
                </template>
            </a-row>
        </a-spin>

        <template slot="footer">
            <a-button key="back" @click="handleCancel">{{ L('取消') }}</a-button>
            <a-button key="submit" type="primary" @click="handleSubmit">{{ L('确定') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import recruitPlatformApi from '@/api/recruit/platform/index'

    export default {
        name: "categoryChildManage",
        components: {ACol, ARow},
        data() {
            return {
                title: '下属职位类别管理',
                visible: false,
                confirmLoading: false,
                inp_cat: [],
                cat_fid: "",
                labelCol: {
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 7,
                    },
                },
                wrapperCol: {
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 13,
                    },
                },
            }
        },
        methods: {
            add(cat_fid) {
                this.inp_cat = []
                this.cat_fid = cat_fid
                this.visible = true
                this.request(recruitPlatformApi.getChildCategory, {
                    cat_fid: cat_fid,
                }).then((res) => {
                    if (res) {
                        this.inp_cat = res
                    }
                })
            },
            changeSelect(val) {
                this.detail.new_id = val
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.confirmLoading = true
                if (this.inp_cat.length > 0) {
                    let param = {
                        cat_arr: this.inp_cat,
                        cat_fid: this.cat_fid
                    }
                    this.request(recruitPlatformApi.updateChildCategory, param)
                        .then((res) => {
                            this.$message.success(this.L('编辑成功'))
                            this.visible = false
                            this.confirmLoading = false
                            // 调用父页面方法
                            // this.$emit('handleUpdate', {})
                            // setTimeout(() => {
                            //     this.visible = false
                            //     this.confirmLoading = false
                            //     this.$emit('ok', '')
                            // }, 1500)
                        })
                        .catch((error) => {
                            this.confirmLoading = false
                        })
                } else {
                    this.confirmLoading = false
                    this.$message.success(this.L('请填写内容再提交'))
                }
            },
            addCategory() {
                let param = {
                    cat_id: "",
                    cat_title: "",
                }
                this.inp_cat.push(param)
            },
            removeDomain(item) {
                let index = this.inp_cat.indexOf(item);
                if (index !== -1) {
                    this.inp_cat.splice(index, 1);
                }
            },
        }
    }
</script>

<style scoped>

</style>