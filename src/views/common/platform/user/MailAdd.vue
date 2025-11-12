<template>
    <a-layout>
        <a-layout-content
                :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }"
        >
            <a-tabs default-active-key="1">
                <a-tab-pane key="1" tab="推送内容设置">
                    <a-form v-bind="{ labelCol: { span: 2 }, wrapperCol: { span: 5 }, }" @submit="handleSubmit">
                        <a-row>
                            <a-col class="label-font-size text-center" :span="2">
                                <a-button type="default" @click="returnBack()">
                                    <a-icon type="left"/>
                                </a-button>
                            </a-col>
                        </a-row>
                        <br>
                        <a-row>
                            <a-col class="label-font-size text-right" :span="2">
                                基本信息
                            </a-col>
                        </a-row>
                        <br>
                        <a-form-item label="所属分类" required="true">
                            <a-select v-model="formData.category_type">
                                <a-select-option
                                        v-for="(item,index) in cat_sel"
                                        :value="item.cat_id"
                                        :key="index">
                                    {{item.cat_name}}
                                </a-select-option>
                                <a-select-option :value="mall">
                                    商城
                                </a-select-option>
                                <a-select-option :value="maidan">
                                    买单
                                </a-select-option>
                                <a-select-option :value="group">
                                    团购
                                </a-select-option>
                                <a-select-option :value="foodshop">
                                    外卖
                                </a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="渠道展示" :wrapper-col="{ span: 10}">
                            <a-row>
                                <a-col :span="24">
                                    <a-radio-group v-model="formData.type">
                                        <a-radio :value="0">
                                            全部
                                        </a-radio>
                                        <a-radio :value="1">
                                            仅手机系统推送
                                        </a-radio>
                                        <a-radio :value="2">
                                            仅消息中心推送
                                        </a-radio>
                                    </a-radio-group>
                                </a-col>
                            </a-row>
                        </a-form-item>

                        <a-form-item label="推送人群">
                            <a-row>
                                <a-col :span="24">
                                    <a-radio-group v-model="formData.users">
                                        <a-radio :value="0">
                                            全部
                                        </a-radio>
                                        <a-radio :value="1">
                                            指定人群
                                        </a-radio>
                                    </a-radio-group>
                                </a-col>
                            </a-row>
                            <template v-if="formData.users">
                                <a-row>
                                    <a-col :span="24">
                                        <a-col :span="3">
                                            <a-checkbox @change="onChange" :checked="formData.user.area_sel">
                                            </a-checkbox>
                                        </a-col>
                                        <a-col :span="5">地区:</a-col>
                                        <a-col :span="16">
                                            <a-cascader :options="options" placeholder="选择"
                                                        :value="formData.user.sel_areas"
                                                        @change="onChangeArea"/>
                                        </a-col>
                                    </a-col>
                                </a-row>

                                <a-row>
                                    <a-col :span="24">
                                        <a-col :span="3">
                                            <a-checkbox @change="onChange1" :checked="formData.user.level_sel">
                                            </a-checkbox>
                                        </a-col>
                                        <a-col :span="5">用户等级:</a-col>
                                        <a-col :span="16">
                                            <a-select v-model="formData.user.level">
                                                <a-select-option
                                                        v-for="(item,index) in level_sel"
                                                        :value="item.id"
                                                        :key="index">
                                                    {{item.lname}}
                                                </a-select-option>
                                            </a-select>
                                        </a-col>
                                    </a-col>
                                </a-row>

                                <a-row>
                                    <a-col :span="24">
                                        <a-col :span="3">
                                            <a-checkbox @change="onChange2" :checked="formData.user.label_sel">
                                            </a-checkbox>
                                        </a-col>
                                        <a-col :span="5">用户标签:</a-col>
                                        <a-col :span="16">
                                            <a-select
                                                    mode="multiple"
                                                    placeholder="请选择用户标签"
                                                    :value="formData.user.label"
                                                    style="width: 100%"
                                                    @change="handleChange"
                                            >
                                                <a-select-option v-for="item in label_sel" :key="item" :value="item.id">
                                                    {{ item.name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-col>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-form-item>
                        <template v-if="formData.type!=2">
                            <a-form-item label="推送端口" :wrapper-col="{ span: 17}">
                                <a-row>
                                    <a-col :span="24">
                                        <a-radio-group v-model="formData.send_port">
                                            <a-radio :value="0">
                                                全部
                                            </a-radio>
                                            <a-radio :value="1">
                                                公众号
                                            </a-radio>
                                            <a-radio :value="2">
                                                App
                                            </a-radio>
                                        </a-radio-group>
                                    </a-col>
                                </a-row>
                            </a-form-item>
                        </template>
                        <a-form-item label="定时推送" :wrapper-col="{ span: 16}">
                            <a-row>
                                <a-col :span="1" class="text-center">
                                    <a-checkbox @change="onChange3" :checked="is_set_send_time"
                                                v-model="is_set_send_time">
                                    </a-checkbox>
                                </a-col>
                                <a-col :span="2" class="text-left">
                                    选择推送时间
                                </a-col>
                                <template v-if="is_set_send_time">
                                    <a-col :span="4">
                                        <a-date-picker
                                                format="YYYY-MM-DD"
                                                :disabled-date="disabledStartDate"
                                                placeholder="请选择日期"
                                                @change="onDateStartChange"
                                                :getCalendarContainer="triggerNode => {
                                          return triggerNode.parentNode}"
                                        />
                                    </a-col>
                                    <a-col :span="4">
                                        <a-time-picker
                                                format="HH:mm"
                                                placeholder="选择时间"
                                                @change="onChangeTime"
                                        />
                                    </a-col>
                                </template>
                                <a-col :span="24" class="font-color">勾选后可设置预约推送时间;否则点击发布按钮立即发布成功</a-col>
                            </a-row>

                        </a-form-item>
                        <a-row>
                            <a-col class="label-font-size text-right" :span="2">
                                内容信息
                            </a-col>
                        </a-row>
                        <br>
                        <a-form-item label="主标题:" :wrapper-col="{ span: 7}" required="true">
                            <a-row>
                                <a-col :span="18">
                                    <a-input
                                            placeholder="请输入消息标题"
                                            v-model="formData.title">
                                    </a-input>
                                </a-col>
                                <a-col :span="4" class="text-left font-color">
                                    1-15个字符
                                </a-col>
                            </a-row>
                        </a-form-item>

                        <a-form-item label="描述" :wrapper-col="{ span: 7}">
                            <a-row>
                                <a-col :span="18">
                                    <a-input
                                            placeholder="请输入消息描述"
                                            v-model="formData.desc">
                                    </a-input>
                                </a-col>
                                <a-col :span="4" class="text-left font-color">
                                    1-50个字符
                                </a-col>
                            </a-row>
                        </a-form-item>

                        <a-form-item label="标题图片">
                            <a-row>
                                <a-input hidden v-model="formData.img"></a-input>
                                <template>
                                    <div class="clearfix">
                                        <a-upload
                                                :action="action"
                                                :name="uploadName"
                                                :data="{ upload_dir: upload_dir}"
                                                list-type="picture-card"
                                                :file-list="fileList1"
                                                @preview="handlePreview1"
                                                @change="handleChange1"
                                        >
                                            <a-icon type="plus"/>
                                            <div class="ant-upload-text">
                                                上传图片
                                            </div>
                                        </a-upload>
                                        <a-modal :visible="previewVisible1" :footer="null"
                                                 @cancel="handleCancel1">
                                            <img alt="example" style="width: 100%" :src="previewImage"/>
                                        </a-modal>
                                    </div>
                                </template>
                            </a-row>
                        </a-form-item>

                        <a-form-item label="信息链接类型:">
                            <a-row>
                                <a-col :span="24">
                                    <a-radio-group v-model="formData.content_type" @change="contentChange">
                                        <a-radio :value="0">
                                            富文本
                                        </a-radio>
                                        <a-radio :value="1">
                                            自定义链接
                                        </a-radio>
                                    </a-radio-group>
                                </a-col>
                            </a-row>
                        </a-form-item>
                        <template v-if="formData.content_type">
                            <a-form-item label="自定义链接" :wrapper-col="{ span: 8}">
                                <a-row>
                                    <a-col :span="10">
                                        <div class="flex">
                                            <a-input
                                                    style="max-height: 100px; overflow-y: auto; resize: none"
                                                    v-model="formData.content"
                                                    :placeholder="L('功能库选择')"
                                                    autoSize
                                            />
                                        </div>
                                    </a-col>
                                    <a-col :span="5">
                                        <a class="ml-20" @click="getLinkUrl()">{{ L('从功能库选择') }}</a>
                                    </a-col>
                                </a-row>
                            </a-form-item>
                        </template>
                        <template v-else>
                            <a-form-item label="富文本" :wrapper-col="{ span: 20}">
                                <a-row>
                                    <a-col :span="13">
                                        <div class="flex">
                                            <rich-text :info.sync="formData.content"/>
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-form-item>
                        </template>
                        <a-form-item :wrapper-col="{ span: 20, offset: 6 }">
                            <a-row type="flex" justify="center" align="top">
                                <a-col :span="4" class="text-left">

                                </a-col>
                                <a-col :span="6" class="text-center">

                                </a-col>
                                <a-col :span="6">
                                    <a-button type="primary" class="button-big" html-type="submit">
                                        提交
                                    </a-button>
                                </a-col>
                            </a-row>
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
            </a-tabs>
        </a-layout-content>
    </a-layout>
</template>

<script>
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import mailPlatformApi from '@/api/common/platform/user'
    import moment from 'moment'
    import TemplateEdit from "../../../mall/merchant/TemplateEdit";
    import RichText from '@/components/RichText/RichText'

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }

    export default {
        name: "MailAdd",
        components: {TemplateEdit, ACol, ARow, RichText},
        props: {
            mail_id: {
                type: [String, Number],
                default: '0',
            },
            // 存放路径
            upload_dir: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                mall: "1-2",
                maidan: "1-3",
                group: "1-4",
                foodshop: "1-5",
                visible_staff: true,
                open2: false,
                cat_sel: [],
                options: [],
                level_sel: [],
                label_sel: [],
                fileList1: [],
                is_set_send_time: false,
                previewVisible1: false,
                set_send_time_min: "00:00:00",
                previewImage: '',
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
                queryParam: {
                    id: this.mail_id,
                },
                formData: {//表单数据
                    category_type: '',
                    category_id: 0,
                    type: 0,
                    users: 0,
                    send_port: 0,
                    set_send_time_date: 0,
                    set_send_time_min: "00:00:00",
                    title: "",
                    desc: "",
                    img: "",
                    content_type: 0,
                    content: "",
                    user: {
                        area_sel: false,
                        sel_areas: [],
                        level_sel: false,
                        level: "",
                        label_sel: false,
                        label: []
                    },
                },
                rules: {
                    category_type: [{required: true, message: '请选择所属分类', trigger: ['blur', 'change']}]
                },
            }
        },
        activated() {
            this.queryParam.id = this.mail_id
            this.getLists()
        },
        created() {
            this.queryParam.id = this.mail_id
            this.getLists()
        },
        methods: {
            moment,
            handleChange(selectedItems) {
                this.formData.user.label = selectedItems
            },
            onChangeArea(value) {
                this.formData.province_id = value[0]
                this.formData.city_id = value[1]
                this.formData.user.sel_areas = [value[0], value[1]]
            },
            onChange(e) {
                this.formData.user.area_sel = e.target.checked
            },
            onChange1(e) {
                this.formData.user.level_sel = e.target.checked
            },
            onChange2(e) {
                this.formData.user.label_sel = e.target.checked
            },
            onChange3(e) {
                this.is_set_send_time = e.target.checked
                if (!e.target.checked) {
                    this.$set(this.formData, 'set_send_time_date', "")
                }
            },
            getLists() {
                this.request(mailPlatformApi.mailEdit, this.queryParam).then((res) => {
                    this.fileList1 = []
                    this.cat_sel = res.cat_sel
                    this.options = res.options
                    this.level_sel = res.level_sel
                    this.label_sel = res.label_sel
                })
            },
            disabledStartDate(current) {

            },
            onDateStartChange(end_time_moment, end_time) {
                this.$set(this.formData, 'set_send_time_date', end_time)
            },
            handleClose() {
                this.open2 = false
            },
            async handlePreview1(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                }
                this.previewImage = file.url || file.preview
                this.previewVisible1 = true
            },
            handleChange1({fileList}) {
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    this.fileList1 = fileList
                    if (this.fileList1[len].status == 'done') {
                        this.formData.img = this.fileList1[len].response.data
                        this.fileList1[0].uid = 'logo_2'
                        this.fileList1[0].name = 'logo_2'
                        this.fileList1[0].status = 'done'
                        this.fileList1[0].url = this.fileList1[len].response.data
                        if (fileList.length > 1) {
                            this.fileList1.splice(0, len)
                        }
                    }
                }
            },
            handleCancel1() {
                this.previewVisible1 = false
            },
            // 功能链接配置
            getLinkUrl() {
                this.$LinkBases({
                    source: 'platform', // 必填
                    type: 'h5', // 必填
                    source_id: '',
                    // 确定按钮
                    handleOkBtn: (res) => {
                        // 点击按钮事件
                        console.log('handleOk', res)
                        this.$nextTick(() => {
                            //链接库动态赋值
                            this.$set(this.formData, 'content', res.url)
                        })
                    },
                })
            },
            returnBack() {
                this.$emit("getShow", {})
            },
            handleSubmit(e) {
                e.preventDefault();
                this.request(mailPlatformApi.addData, this.formData).then((res) => {
                    this.$message.success("新增成功");
                    this.$emit("getShow", {})
                })
            },
            onChangeTime(time, string) {
                this.formData.set_send_time_min = string
                this.$set(this.formData, 'set_send_time_min', string)
            },
            contentChange() {
                this.formData.content = ""
            }
        }
    }
</script>

<style scoped>
    .label-font-size {
        font-size: 16px;
        font-weight: bold;
    }

    .font-color {
        color: lightgrey
    }

    .button-big {
        width: 140px;
        height: 50px;
        border-radius: 15px;
        font-size: 22px;
    }
</style>