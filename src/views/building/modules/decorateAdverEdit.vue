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
            <div v-if="cat_key == 'footer_navigate'">
                <a-form-model-item label="未选中图片" :extra="picExtra[cat_key]">
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="fileList"
                        name="reply_pic"
                        :data="{ upload_dir: 'shopping_mall/pictures' }"
                        @preview="handlePreviewImg"
                        @change="handleUploadImg($event, 'fileList', 'pic')"
                        :disabled="disabled"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>                
                <a-form-model-item label="选中图片" :extra="picExtra[cat_key]">
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="focusFileList"
                        name="reply_pic"
                        :data="{ upload_dir: 'shopping_mall/pictures' }"
                        @preview="handlePreviewImg"
                        @change="handleUploadImg($event, 'focusFileList', 'focus_pic')"
                        :disabled="disabled"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>

            </div>
            <div v-else>
                <a-form-model-item label="图片" :extra="picExtra[cat_key]">
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="fileList"
                        name="reply_pic"
                        :data="{ upload_dir: 'shopping_mall/pictures' }"
                        @preview="handlePreviewImg"
                        @change="handleUploadImg($event, 'fileList', 'pic')"
                        :disabled="disabled"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
            </div>

             <a-form-model-item label="推荐方式" v-if="cat_key=='adver'">
                <a-select v-model="form.recommend_type" style="width: 150px;"> 
                    <a-select-option :value="1"> 置顶 </a-select-option>
                    <a-select-option :value="2"> 穿插商品 </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="链接地址" prop="url">
                <a-input
                    placeholder="请输入链接地址"
                    v-model="form.url"
                    allowClear
                    :disabled="disabled"
                    style="width: 80%"
                />
                <a-button type="link" @click="setLinkBases" :disabled="disabled"> 从功能库选择 </a-button>
            </a-form-model-item>
            <a-form-model-item label="小程序中想要打开">
                <a-select v-model="form.wxapp_open_type" placeholder="请选择" :disabled="disabled">
                    <a-select-option :value="1"> 打开其他小程序 </a-select-option>
                    <!-- <a-select-option :value="2"> 打开其他APP </a-select-option> -->
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="打开其他小程序">
                <a-select v-model="form.wxapp_id" placeholder="请选择小程序" allowClear :disabled="disabled">
                    <a-select-option :value="item.appid" :key="item.appid" v-for="item in wxappList">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="小程序页面">
                <a-input
                    v-model="form.wxapp_page"
                    placeholder="请输入小程序页面路径"
                    allowClear
                    style="width: 96%"
                    :disabled="disabled"
                />
                <a-tooltip trigger="hover">
                    <template slot="title">
                        {{ appWxappPageTips }}
                    </template>
                    <a-icon class="ml-10 pointer" type="question-circle" />
                </a-tooltip>
            </a-form-model-item>
            <a-divider>打开其他APP</a-divider>
            <a-form-model-item label="APP中想要打开">
                <a-select v-model="form.app_open_type" :disabled="disabled" allowClear placeholder="请选择">
                    <a-select-option :value="1"> 打开其他小程序 </a-select-option>
                    <a-select-option :value="2"> 打开其他APP </a-select-option>
                </a-select>
            </a-form-model-item>
            <div v-if="form.app_open_type == 2">
                <a-form-model-item label="选择苹果APP">
                    <a-select placeholder="选择苹果APP" v-model="form.ios_app_name" allowClear :disabled="disabled">
                        <a-select-option :value="item.url_scheme" v-for="item in appList" :key="item.url_scheme">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="苹果APP下载地址">
                    <a-input v-model="form.ios_app_url" placeholder="请输入苹果APP下载地址" :disabled="disabled" />
                </a-form-model-item>
                <a-form-model-item label="安卓APP包名">
                    <a-input v-model="form.android_app_name" placeholder="请输入安卓APP包名" :disabled="disabled" />
                </a-form-model-item>
                <a-form-model-item label="安卓APP下载地址">
                    <a-input v-model="form.android_app_url" placeholder="请输入安卓APP下载地址" :disabled="disabled" />
                </a-form-model-item>
            </div>
            <div v-if="form.app_open_type == 1">
                <a-form-model-item label="打开其他小程序">
                    <a-select v-model="form.app_wxapp_id" placeholder="请选择小程序" :disabled="disabled">
                        <a-select-option :value="item.appid" v-for="item in wxappList" :key="item.appid">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="小程序页面">
                    <a-input
                        v-model="form.app_wxapp_page"
                        placeholder="请输入小程序页面路径"
                        style="width: 96%"
                        :disabled="disabled"
                    />
                    <a-tooltip trigger="hover">
                        <template slot="title">
                            {{ appWxappPageTips }}
                        </template>
                        <a-icon class="ml-10 pointer" type="question-circle" />
                    </a-tooltip>
                </a-form-model-item>
            </div>
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
import buildingPlatformApi from '@/api/building/index'
const formData = {
    id: '',
    name: '',
    pic: '',
    focus_pic:'',
    url: '',
    wxapp_open_type: 1,
    wxapp_id: undefined,
    wxapp_page: '',
    app_open_type: 1,
    ios_app_name: undefined,
    ios_app_url: '',
    android_app_name: '',
    android_app_url: '',
    app_wxapp_id: undefined,
    app_wxapp_page: '',
    sort: 0,
    status: true,
    recommend_type:2
}
export default {
    name: 'decorateAdverEdit',
    data() {
        return {
            mall_id: 0,
            visible: false,
            appWxappPageTips: this.L(
                '即打开另一个小程序时进入的页面路径，如果为空则打开首页；另一个小程序的页面路径请联系该小程序的技术人员询要；目前仅支持用户在平台小程序首页和外卖首页中打开其他小程序。'
            ),
            form: { ...formData },
            cat_key: '',
            areaList: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            fileList: [],
            focusFileList: [],
            // 图片预览
            previewVisible: false,
            previewImage: '',
            wxappList: [],
            appList: [],
            disabled: false,
            rules: {
                name: [{ required: true, message: '请输入名称' }],
                url: [{ required: true, message: '请填写链接地址' }],
            },
            picExtra: {
                banner: '建议尺寸 748 * 428',
                navigate: '建议尺寸 64 * 64',
                footer_navigate: '建议尺寸 50 * 50',
                adver: '建议尺寸 340 * 370',
                full_banner: '建议尺寸 750 * 1476',
            },
        }
    },
    created() {

    },
    methods: {
        editOne(id = '', disabled = false, cat_key = '',mall_id = '') {
            this.disabled = disabled
            this.visible = true
            this.cat_key = cat_key
            this.mall_id = mall_id
            this.request(buildingPlatformApi.getAdver, { id: id }).then((res) => {
                this.wxappList = res.wxapp_list || []
                this.appList = res.app_list || []
                if (res && res.now_adver && res.now_adver.pic) {
                    this.fileList = [
                        {
                            uid: '-1',
                            name: '当前图片',
                            status: 'done',
                            url: res.now_adver.raw_pic,
                        },
                    ]
                }
                if (res && res.now_adver && res.now_adver.focus_pic) {
                    this.focusFileList = [
                        {
                            uid: '-1',
                            name: '当前图片',
                            status: 'done',
                            url: res.now_adver.raw_focus_pic,
                        },
                    ]
                }
                if (id && res.now_adver) {
                    res.now_adver.currency = res.now_adver.currency == 1 ? true : false
                    res.now_adver.status = res.now_adver.status == 1 ? true : false
                    res.now_adver.wxapp_id = res.now_adver.wxapp_id ? res.now_adver.wxapp_id : undefined
                    res.now_adver.ios_app_name = res.now_adver.ios_app_name ? res.now_adver.ios_app_name : undefined
                    res.now_adver.app_wxapp_id = res.now_adver.app_wxapp_id ? res.now_adver.app_wxapp_id : undefined
                    for (let k in this.form) {
                        if(k == 'pic'){
                            this.form[k] = res.now_adver['raw_pic']
                        }else if(k == 'focus_pic'){
                            this.form[k] = res.now_adver['raw_focus_pic']
                        }else{
                            this.form[k] = res.now_adver[k]
                        }
                    }
                }
            })
        },
        handleCancle() {
            this.visible = false
            this.fileList = []
            this.form = {
                ...formData,
            }
        },
        handleOk() {
            this.$refs.form.validate((valid, obj) => {
                if (valid) {
                    if (!this.form.url.trim()) {
                        this.$message.error('请填写链接地址')
                        return
                    }
                    let params = {
                        ...this.form,
                        status: this.form.status ? 1 : 0,
                        wxapp_id: this.form.wxapp_id || '',
                        ios_app_name: this.form.ios_app_name || '',
                        app_wxapp_id: this.form.app_wxapp_id || '',
                        cat_key: this.cat_key,
                        mall_id: this.mall_id,
                    }
                    this.request(buildingPlatformApi.saveAdver, params).then((res) => {
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
                this[filedList] = fileList
            } else {
                this.$set(this.form, fieldForm, '')
                this[filedList] = []
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
