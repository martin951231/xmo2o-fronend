<template>
    <a-modal
        :title="modalTitle"
        v-model="visible"
        @ok="handleOk"
        destroyOnClose
        width="50%"
        :centered="true"
        @cancel="handleCancel"
    >
        <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item :label="L('名称')" required>
                <a-input style="width: 40%" :placeholder="L('请输入')" v-model="form.name" allowClear />
            </a-form-model-item>
            <a-form-model-item :label="L('活动日期')" required>
                <a-range-picker
                    style="width: 40%"
                    :ranges="{
                        今日: [moment(), moment()],
                        近7天: [moment().subtract('days', 6), moment()],
                        近30天: [moment().subtract('days', 29), moment()],
                    }"
                    :value="form.time"
                    format="YYYY-MM-DD HH:mm"
                    @change="onDateRangeChange"
                    allowClear
                    :show-time="{ format: 'HH:mm' }"
                />
            </a-form-model-item>

            <a-form-model-item :label="L('跨城市展示')" required :help="L('通用：则不显示城市均展示广告；指定城市：仅在指定城市范围内展示广告，可在列表进行配置')">
                <a-switch v-model="form.is_common" checked-children="通用" un-checked-children="指定城市" default-checked />
            </a-form-model-item>

            <a-form-model-item :label="L('图片')" :help="L('建议尺寸：586X734  支持扩展名：.png，.jpg')">
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    accept="image/*"
                    list-type="picture-card"
                    :file-list="fileList"
                    name="reply_pic"
                    :data="{ upload_dir: 'activity/adver' }"
                    @preview="handlePreviewImg"
                    @change="handleUploadImg($event, 'fileList', 'pic')"
                >
                    <a-icon type="plus" />
                    <div class="ant-upload-text">{{ L('上传') }}</div>
                </a-upload>
            </a-form-model-item>

            <!-- <a-form-model-item :label="L('弹窗位置')" required>
                <a-checkbox-group v-model="form.show_position" style="width: 100%">
                    <a-row type="flex">
                        <a-col :span="4">
                            <a-checkbox value="home"> {{ L('平台首页') }} </a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </a-form-model-item> -->

            <a-form-model-item :label="L('链接地址')">
                <a-input :placeholder="L('请输入')" v-model="form.link_url" allowClear style="width: 80%;"></a-input><a-button type="link" @click="linkUrlHandle()">{{ L('从功能库选择') }}</a-button>
            </a-form-model-item>

        </a-form-model>
        <a-modal :visible="previewVisible" :footer="null" @cancel=";(previewVisible = false), (previewImage = '')">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </a-modal>
</template>

<script>
import activityPlatformApi from '@/api/activity/platform'
import moment from 'moment'

export default {
    data() {
        return {
            visible: false,
            modalTitle: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            form: {
                name: '',
                time: [],
                start_time: '',
                end_time: '',
                pic: '',
                show_position: ['home'],
                link_url: '',
                is_common: 1 //跨城市使用   1：通用   0：指定城市
            },
            fileList: [],
            // 图片预览
            previewVisible: false,
            previewImage: '',
        }
    },
    methods: {
        moment,
        showModal(record = '') {
            this.visible = true
            this.modalTitle = record ? this.L('编辑广告') : this.L('添加广告')
            if (record) {
                // 编辑
                this.getDetail(record)
            }
        },
        // 时间选择
        onDateRangeChange(date, dateString) {
            this.$set(this.form, 'time', [date[0], date[1]])
            this.$set(this.form, 'start_time', dateString[0])
            this.$set(this.form, 'end_time', dateString[1])
        },
        // 详情
        getDetail(record) {
            if (record.pic) {
                this.fileList = [
                    {
                        uid: 'pic',
                        status: 'done',
                        url: record.pic,
                        name: record.pic,
                    },
                ]
            }
            this.form = {
                ...record,
                time: record.start_time && record.end_time ? [moment(record.start_time), moment(record.end_time)] : [],
            }
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
        handleOk() {
            let params = {
                ...this.form,
                link_url: this.form.link_url?this.form.link_url.trim():''
            }
            this.$delete(params, 'time')
            if (!params.name) {
                this.$message.error(this.L('广告名称必填'))
                return
            }
            if (!params.start_time || !params.end_time) {
                this.$message.error(this.L('广告活动日期必填'))
                return
            }
            if (!params.show_position.length) {
                this.$message.error(this.L('弹窗位置必选'))
                return
            }
            
            let api = params.id
                ? activityPlatformApi.AdverEdit
                : activityPlatformApi.AdverAdd
            this.request(api, params).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.$emit('updateList')
                this.handleCancel()
            })
        },
        handleCancel() {
            this.visible = false
            this.modalTitle = ''
            Object.assign(this.$data, this.$options.data.call(this))
        },
        linkUrlHandle() {
            this.$LinkBases({
                source: 'platform',
                type: 'h5', 
                handleOkBtn: res => {
                    // 点击按钮事件
                    this.form.link_url = res.url
                }
            })
        }
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
