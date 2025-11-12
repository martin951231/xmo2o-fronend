<template>
    <div id="components-layout-demo-basic">
        <a-modal v-model="visible_staff" title="编辑导航分类" :footer="null" @cancel="hidelModel()">
            <a-form v-bind="{ labelCol: { span: 7 }, wrapperCol: { span: 16 }, }" @submit="handleSubmit">
                <a-form-item label="推荐标题" :required="true">
                    <a-row>
                        <a-col :span="14">
                            <a-input
                                    placeholder="请输推荐标题"
                                    v-model="formData.title">
                            </a-input>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="副标题">
                    <a-row>
                        <a-col :span="14">
                            <a-input
                                    placeholder="请输副标题"
                                    v-model="formData.description">
                            </a-input>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="导航内容" :wrapper-col="{ span: 17}">
                    <a-row>
                        <a-col :span="24">
                            <a-radio-group v-model="formData.type" @change="typeChange">
                                <a-radio :value="1">
                                    子分类店铺
                                </a-radio>
                                <a-radio :value="2">
                                    种草话题
                                </a-radio>
                            </a-radio-group>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="店铺分类" :wrapper-col="{ span: 17}" v-if="formData.type==1">
                    <a-row>
                        <a-col :span="13">
                            <a-tree-select
                                :value="formData.ids"
                                style="width: 100%;"
                                :dropdownStyle="{height:'200px'}"
                                :tree-data="cat_sel"
                                tree-checkable
                                search-placeholder="全部"
                                :replaceFields ="{ title: 'cat_name', value: 'cat_id', key:'key', children: 'children' }"
                                    @change="handleChange"
                            />
                            <!-- <a-select
                                    mode="multiple"
                                    placeholder="全部"
                                    :value="formData.ids"
                                    style="width: 100%"
                                    @change="handleChange"
                            >
                                <a-select-option v-for="item in cat_sel" :key="item" :value="item.cat_id">
                                    {{ item.cat_name }}
                                </a-select-option>
                            </a-select> -->
                        </a-col>
                        <a-col :span="9" class="text-right">
                            不选择则为全部
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="选择话题" :wrapper-col="{ span: 17}" v-if="formData.type==2">
                    <a-row>
                        <a-col :span="13">
                            <a-select
                                    mode="multiple"
                                    placeholder="全部"
                                    :value="formData.ids"
                                    style="width: 100%"
                                    @change="handleChange"
                            >
                                <a-select-option v-for="item in huati" :key="item" :value="item.cat_id">
                                    {{ item.cat_name }}
                                </a-select-option>
                            </a-select>
                        </a-col>
                        <a-col :span="9" class="text-right">
                            不选择则为全部
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="话题展示规则" :required="true" v-if="formData.type==2">
                    <a-select v-model="formData.show_sort_type">
                        <a-select-option :value="1">
                            按动态点赞数
                        </a-select-option>
                        <a-select-option :value="2">
                            按动态浏览量
                        </a-select-option>
                        <a-select-option :value="3">
                            按动态评论数
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="店铺展示规则" :required="true" v-if="formData.type==1">
                    <a-select v-model="formData.show_sort_type">
                        <a-select-option :value="1">
                            按销量
                        </a-select-option>
                        <a-select-option :value="2">
                            按距离
                        </a-select-option>
                        <a-select-option :value="3">
                            按评分
                        </a-select-option>
                        <a-select-option :value="4">
                            按店铺上架时间排序
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="内容展示样式" v-if="formData.type==1">
                    <a-select v-model="formData.show_type">
                        <a-select-option :value="2">
                            列表样式一
                        </a-select-option>
                        <a-select-option :value="1">
                            列表样式二
                        </a-select-option>
                        <a-select-option :value="3">
                            瀑布流
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="排序">
                    <a-row>
                        <a-col :span="6">
                            <a-input
                                    v-model="formData.sort">
                            </a-input>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 20, offset: 6 }">
                    <a-row type="flex" justify="center" align="top">
                        <a-col :span="4" class="text-left">
                            <a-button type="default" @click="hidelModel()">
                                取消
                            </a-button>
                        </a-col>
                        <a-col :span="6" class="text-center">
                            <a-button type="primary" html-type="submit">
                                确定
                            </a-button>
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import DiypageFeedApi from '@/api/common/platform/diypage'

    export default {
        name: "DiypageFeedCategoryEdit",
        props: {
            category_id: {
                type: [String, Number],
                default: '0',
            },
            cat_id: {
                type: [String, Number],
                default: '0',
            },
        },
        data() {
            return {
                visible_staff: true,
                spinning: false,
                size: 'default',
                queryParam: {
                    cat_id: this.cat_id,
                    category_id: "",
                },
                huati: [],
                cat_sel: [],
                formData: {//表单数据
                    cat_id: this.cat_id,
                    title: "",
                    description: "",
                    type: 1,
                    ids: [],
                    show_sort_type: 1,
                    show_type: 1,
                    sort: 0,
                }
            }
        },
        mounted() {
            this.queryParam.cat_id = this.cat_id
            this.queryParam.category_id = this.category_id
            this.formData.cat_id = this.cat_id
            this.getLists()
        },
        activated() {
            this.queryParam.cat_id = this.cat_id
            this.queryParam.category_id = this.category_id
            this.formData.cat_id = this.cat_id
            this.getLists()
        },
        created() {
            this.queryParam.cat_id = this.cat_id
            this.queryParam.category_id = this.category_id
            this.formData.cat_id = this.cat_id
        },
        methods: {
            handleChange(selectedItems) {
                console.log(selectedItems, "selectedItems");
                this.formData.ids = selectedItems
                console.log(this.formData.ids, "this.formData.ids===this.formData.ids");
            },
            typeChange(){
                 this.formData.ids = []
            },
            popupScroll() {
                console.log('popupScroll');
            },
            getLists() {
                this.request(DiypageFeedApi.diypageFeedCategoryEdit, this.queryParam).then((res) => {
                    if (this.queryParam.category_id > 0) {
                        this.formData = res
                    }
                    this.cat_sel = res.cat_sel
                    this.huati = res.huati
                })
            },
            handleSubmit() {
                this.request(DiypageFeedApi.diypageFeedCategorySave, this.formData).then((res) => {
                    if (res) {
                        this.$message.success('保存成功！')
                        //this.visible_staff = false
                        let param = {
                            id: 1
                        }
                        this.$emit("changeEditModel", param)
                    }
                })
            },
            hidelModel() {
                let param = {
                    id: 0
                }
                //this.visible_staff = false
                this.$emit("changeEditModel", param)
            }
        },
    }
</script>

<style scoped>

</style>