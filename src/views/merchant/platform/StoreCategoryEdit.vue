<template>
    <div id="components-layout-demo-basic">
        <a-modal v-model="visible_staff" :width="920" :title=title :footer="null" @cancel="handleCancel">
            <a-form v-bind="{ labelCol: { span: 7 }, wrapperCol: { span: 16 }, }" @submit="handleSubmit">

            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import merchantPlatformApi from '@/api/merchant/platform/index'

    export default {
        name: "StoreCategoryEdit",
        data() {
            return {
                visible_staff: true,
                queryParam: {
                    cat_id: '',
                },
                title:"添加主分类",
                formData: {//表单数据
                    cat_id: this.$route.query.cat_id,
                    cat_fid: "",
                    cat_name: "",
                    cat_pic: '',
                    cat_url:'',
                    cat_sort: 0,
                    is_hot: 0,
                    cat_status: 1,
                }
            }
        },
        mounted() {
            this.formData.cat_id = this.$route.query.cat_id
            this.getLists()
        },
        activated() {
            this.formData.cat_id = this.$route.query.cat_id
            this.getLists()
        },
        created() {
            this.formData.cat_id = this.$route.query.cat_id
        },
        methods: {
            getLists() {
                this.request(merchantPlatformApi.editStoreCategory, this.queryParam).then((res) => {
                   /* if (this.queryParam.category_id > 0) {
                        this.formData = res
                    }
                    this.cat_sel = res.cat_sel*/
                })
            },
            handleSubmit() {
                this.request(DiypageFeedApi.diypageFeedCategorySave, this.formData).then((res) => {
                    if (res) {
                        this.$message.success('保存成功！')
                        this.visible_staff = false
                        return false
                    }
                })
            },
            handleCancel() {
                this.visible_staff = false
            },
        }
    }
</script>

<style scoped>

</style>