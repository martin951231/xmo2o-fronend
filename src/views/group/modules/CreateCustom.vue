<template>
    <div>
        <a-modal :title="title" :width="840" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
            <div style="margin:0px 0px 40px 0px;">
                <h3>商品管理规则</h3>
                <div>1.店铺展示按距离默认展示，可手动进行商品排序，且手动排序的店铺展示的优先级最高</div>
                <div>2.商品类型即团购商品所有类型，在所有类型中，可进行多选</div>
            </div>
            <a-spin :spinning="confirmLoading">
                <a-form :form="form">
                    <a-form-item label="推荐标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input v-decorator="['title', {initialValue:detail.title,rules: [{required: true, message: '请输入推荐标题'},{ max: 4, message: '字数限制为4个字', trigger: 'blur' }]}]" />
                    </a-form-item>
                    <a-form-item label="副标题" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="group_activity_recommendations == 0">
                        <a-input v-decorator="['sub_title', {initialValue:detail.sub_title,rules: [{required: true, message: '请输入副标题'},{ max: 4, message: '字数限制为4个字', trigger: 'blur' }]}]" />
                    </a-form-item>
                    <a-form-item label="上传图标" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="group_activity_recommendations == 1">
                        <a-upload
                            v-decorator="['img', {initialValue:detail.img,rules: [{required: true, message: '请上传图标'}]}]"
                            action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                            accept="image/*"
                            list-type="picture-card"
                            :file-list="fileList"
                            name="reply_pic"
                            :data="{ upload_dir: 'group/nav' }"
                            @preview="handlePreviewImg"
                            @change="handleUploadImg"
                        >
                            <div v-if="fileList.length < 1">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">{{ L('上传') }}</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                    <a-form-item label="团购类型" :labelCol="labelCol" :wrapperCol="wrapperCol" help="不选择则为全部">
                        <a-tree-select
                            :value="formData.ids"
                            style="width: 100%;"
                            :dropdownStyle="{height:'200px'}"
                            :tree-data="cat_sel"
                            search-placeholder="全部"
                            :replaceFields="{ title: 'cat_name', value: 'cat_id', key:'key', disabled:true, children: 'children' }"
                            @change="handleChange"
                        />
                    </a-form-item>
                    <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" help="值越大越靠前">
                        <a-input-number v-decorator="['sort',{initialValue:detail.sort}]" :min="0" />
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-modal>
        <a-modal v-model="previewVisible" :footer="null" :title="L('查看图片')">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import GroupPlatformApi from '@/api/group/platform'
import { imgUploadHandle, imgUploadFileListHandle, getBase64 } from '@/utils/util.js'
export default {
    props: {
        category_id: {
            type: [String, Number],
            default: '0',
        },
        cat_id_t: {
            type: [String, Number],
            default: '0',
        },
        group_activity_recommendations: {
            type: [String, Number],
            default: '0',
        },
    },
    data() {
        return {
            size: 'default',
            title: '新建店铺活动推荐',
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
            visible: false,
            confirmLoading: false,
            form: this.$form.createForm(this),
            dataList: [],
            type: '0',
            showMethod: [],
            detail: {
                custom_id: 0,
                title: '',
                sub_title: '',
                sort: '',
                type: '',
                img: '',
            },
            cat_id: '',
            cat_type: '',
            custom_id: 0,
            queryParam: {
                cat_id: this.cat_id_t,
                category_id: '',
            },
            cat_sel: [],
            formData: {
                //表单数据
                cat_id: this.cat_id_t,
                title: '',
                description: '',
                type: 1,
                ids: 0,
                show_sort_type: 1,
                show_type: 1,
                sort: 0,
            },
            previewImage: '',
            previewVisible: false,
            fileList: [],
        }
    },
    mounted() {},
    methods: {
        handleChange(selectedItems) {
            console.log(selectedItems, 'selectedItems')
            this.formData.ids = selectedItems
            console.log(this.formData.ids, 'this.formData.ids===this.formData.ids')
        },
        getLists() {
            this.request(GroupPlatformApi.getGroupCategoryList, {
                group_activity_recommendations: this.group_activity_recommendations,
            }).then((res) => {
                this.cat_sel = res.list
            })
        },
        // 获取团购类型
        add(id) {
            this.visible = true
            if (id == 0) {
                this.title = this.group_activity_recommendations == 0 ? '新建店铺活动推荐' : '新建商品活动推荐'
            } else {
                this.title = '新建团购分类展示'
            }
            this.cat_type = id
            this.custom_id = 0
            this.queryParam.cat_id = this.cat_id
            this.queryParam.category_id = this.category_id
            this.formData.cat_id = 0
            this.getLists()
            this.detail = {
                custom_id: 0,
                title: '',
                sub_title: '',
                sort: '',
                type: [],
                img: '',
            }
            this.fileList = []
        },
        edit(custom_id, cat_id) {
            this.fileList = []
            this.visible = true
            this.cat_type = cat_id
            this.custom_id = custom_id
            this.getEditInfo()
            this.queryParam.cat_id = this.cat_id
            this.queryParam.category_id = this.category_id
            this.formData.cat_id = this.cat_id
            this.getLists()
            if (this.custom_id > 0) {
                if (cat_id == 0) {
                    this.title = this.group_activity_recommendations == 0 ? '编辑店铺活动推荐' : '编辑商品活动推荐'
                } else {
                    this.title = '编辑团购分类展示'
                }
            } else {
                if (cat_id == 0) {
                    this.title = this.group_activity_recommendations == 0 ? '新建店铺活动推荐' : '新建商品活动推荐'
                } else {
                    this.title = '新建团购分类展示'
                }
            }
        },
        handleTypeChange(value) {
            console.log(`Selected: ${value}`)
        },
        handleSubmit() {
            const {
                form: { validateFields },
            } = this
            this.confirmLoading = true
            validateFields((errors, values) => {
                console.log(values)
                if (!errors) {
                    values.custom_id = this.custom_id
                    values.cat_id = this.cat_type
                    values.type = this.formData.ids
                    values.img = this.formData.img
                    values.group_activity_recommendations = this.group_activity_recommendations
                    this.request(GroupPlatformApi.addRenovationCustom, values)
                        .then((res) => {
                            if (this.custom_id > 0) {
                                this.$message.success('编辑成功')
                            } else {
                                this.$message.success('添加成功')
                            }
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.visible = false
                                this.confirmLoading = false
                                let param = {}
                                if (this.cat_type == 0) {
                                    param['title'] = '活动推荐'
                                } else {
                                    param['title'] = '团购分类展示'
                                }
                                param['cat_id'] = this.cat_type
                                this.fileList = []
                                this.$emit('loaddata', param)
                            }, 1500)
                        })
                        .catch((error) => {
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
                this.id = '0'
                this.fid = '0'
                this.form = this.$form.createForm(this)
            }, 500)
        },
        getEditInfo() {
            this.request(GroupPlatformApi.getRenovationCustomInfo, {
                custom_id: this.custom_id,
                group_activity_recommendations: this.group_activity_recommendations,
            }).then((res) => {
                this.showMethod = res.showMethod
                this.detail = {
                    title: '',
                    sub_title: '',
                    sort: '',
                }
                if (typeof res.detail == 'object') {
                    this.detail = res.detail
                    this.formData.ids = res.detail.type
                    if (this.detail.img) {
                        this.fileList = this.detail.img ? imgUploadFileListHandle([this.detail.img], 'img') : []
                        this.formData.img = this.detail.img
                    }
                }
                console.log('detail', this.detail)
            })
        },
        change(e) {
            this.detail.fid = e
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // 上传图片
        handleUploadImg(info) {
            const { fileList = [], resultData = {} } = imgUploadHandle(info)
            this.formData.img = resultData.fileUrl || ''
            this.fileList = fileList
        },
    },
}
</script>