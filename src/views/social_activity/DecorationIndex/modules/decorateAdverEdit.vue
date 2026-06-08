<template>
    <a-modal
        :title="!form.id ? L('添加') : disabled ? L('查看') : L('编辑')"
        :visible="visible"
        width="60%"
        :bodyStyle="{ maxHeight: '80vh', overflowY: 'auto' }"
        destroyOnClose
        :centered="true"
        @cancel="handleCancle"
    >
        <a-form-model ref="form" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="名称" prop="name">
                <a-input v-model="form.name" placeholder="请输入名称" allowClear :disabled="disabled" />
            </a-form-model-item>
            <a-form-model-item :label="cat_key == 'footer_menu_list' ? '未选中图片' : '图片'" :extra="picExtra[cat_key]">
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    accept="image/*"
                    list-type="picture-card"
                    :file-list="fileList.pic"
                    name="reply_pic"
                    :data="{ upload_dir: 'activity/socialAdver' }"
                    @preview="handlePreviewImg"
                    @change="handleUploadImg($event, 'fileList', 'pic')"
                    :disabled="disabled"
                >
                    <a-icon type="plus" />
                    <div class="ant-upload-text">{{ L('上传') }}</div>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item label="选中图片" v-if="cat_key == 'footer_menu_list'">
                <a-upload
                    accept="image/*"
                    name="reply_pic"
                    list-type="picture-card"
                    :data="{ upload_dir: 'activity/socialAdver' }"
                    :file-list="fileList.select_pic"
                    @preview="handlePreviewImg"
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    @change="(info) => handleUploadImg(info, 'fileList', 'select_pic', true)">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传</div>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item label="链接地址" prop="url" v-if="cat_key != 'top_bg_pic'">
                <a-input
                    placeholder="请输入链接地址"
                    v-model="form.url"
                    allowClear
                    :disabled="disabled"
                    style="width: 80%"
                />
                <a-button type="link" @click="setLinkBases" :disabled="disabled"> 从功能库选择 </a-button>
            </a-form-model-item>
            <a-form-model-item label="排序" extra="值越大越靠前">
                <a-input-number v-model="form.sort" :min="0" :disabled="disabled" />
            </a-form-model-item>
            <a-form-model-item label="状态">
                <a-switch
                    v-model="form.status"
                    checked-children="开启"
                    un-checked-children="关闭"
                    :disabled="disabled"
                />
            </a-form-model-item>
        </a-form-model>
        <template slot="footer">
            <a-button key="back" class="mr-10" @click="handleCancle"> {{ disabled ? '关闭' : '取消' }} </a-button>
            <a-button key="submit" class="mr-10" type="primary" @click="handleOk" v-if="!disabled"> 确定 </a-button>
        </template>
        <a-modal width="50%" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
            <img alt="example" class="mt-20" style="width: 100%" :src="previewImage" />
        </a-modal>
    </a-modal>
</template>
<script>
import socialActivityApi from '@/api/social_activity'
const formData = {
    id: '',
    name: '',
    pic: '',
    select_pic: '',
    url: '',
    sort: 0,
    status: true,
}
export default {
    name: 'decorateAdverEdit',
    data() {
        return {
            visible: false,
            form: { ...formData },
            cat_key: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            fileList: {
              pic: [],
              select_pic: [],
            },
            // 图片预览
            previewVisible: false,
            previewImage: '',
            disabled: false,
            rules: {
                name: [{ required: true, message: '请输入名称' }],
                url: [{ required: true, message: '请填写链接地址' }],
            },
            picExtra: {
                top_bg_pic: '建议尺寸 750*622',
            },
        }
    },
    created() {
        
    },
    methods: {
        editOne(id = '', disabled = false, cat_key = '') {
            this.disabled = disabled
            this.visible = true
            this.cat_key = cat_key
            if(id && id > 0){
                this.request(socialActivityApi.getDecorationAdverDetail, { id: id }).then((res) => {
                    if (res && res.pic) {
                        this.fileList.pic = [
                            {
                                uid: '-1',
                                name: '当前图片',
                                status: 'done',
                                url: res.pic,
                            },
                        ]
                    }
                    if(cat_key == 'footer_menu_list'){
                        if (res && res.select_pic) {
                          this.fileList.select_pic = [
                            {
                              uid: '-1',
                              name: '当前图片',
                              status: 'done',
                              url: res.select_pic,
                            },
                          ]
                        }
                    }
                    if (id && res) {
                        res.status = res.status == 1 ? true : false
                        for (let k in this.form) {
                            this.form[k] = res[k]
                        }
                    }
                })
            }
        },
        handleCancle() {
            this.visible = false
            this.fileList = {
                pic: [],
                select_pic: [],
            }
            this.form = {
                ...formData,
            }
        },
        handleOk() {
            this.$refs.form.validate((valid, obj) => {
                if (valid) {
                    if (!this.form.url.trim() && this.cat_key != 'top_bg_pic') {
                        this.$message.error('请填写链接地址')
                        return
                    }
                    let params = {
                        ...this.form,
                        status: this.form.status ? 1 : 0,
                        cat_key: this.cat_key,
                    }
                    this.request(socialActivityApi.saveDecorationAdver, params).then((res) => {
                        this.$message.success('操作成功')
                        !this.disabled && this.$emit('update')
                        this.handleCancle()
                    })
                } else {
                    if (Object.keys(obj).length) {
                        let errMsg = []
                        for (let k in obj) {
                            if (obj[k] && obj[k].length) {
                                errMsg.push(obj[k])
                            }
                        }
                        if (errMsg.length) {
                            errMsg = errMsg.flat()
                            let msg = errMsg[0].message
                            this.$message.error(msg)
                        }
                    }

                    return false
                }
            })
        },
        setLinkBases() {
            this.$LinkBases({
                source: 'platform', // 必填
                type: 'h5', // 必填
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    this.form.url = res.url
                },
            })
        },
        // 上传图片
        handleUploadImg(info = '', filedList = '', fieldForm = '') {
            let fileList = info && info.fileList ? [...info.fileList] : []
            if (fileList.length) {
                fileList = fileList.splice(-1)
                let imgs = []
                fileList = fileList.map((file) => {
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    }
                    return file
                })
                this.$set(this.form, fieldForm, imgs[0])
                this[filedList][fieldForm] = fileList
            } else {
                this.$set(this.form, fieldForm, '')
                this[filedList][fieldForm] = []
            }
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
    },
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
</script>
