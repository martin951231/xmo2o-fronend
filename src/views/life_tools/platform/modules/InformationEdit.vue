<template>
    <a-modal :title="title" :width="1000" :height="300" :visible="visible" @cancel="closeWindow" :footer="null">
        <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" @submit="handleSubmit">
            <a-form-item label="资讯标题">
                <a-input field-names="title"
                    v-decorator="['title', { initialValue: detail.title,rules: [{ required: true, message: '请输入标题!' }] }]"
                    placeholder="请输入标题" />
            </a-form-item>

            <a-row style="margin: 20px 0;">
                <a-col :span="3" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span>
                        <span style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif;line-height: 35px;">*</span>图片:</span>
                </a-col>
                <a-col :span="15">
                    <a-upload action="/v20/public/index.php/common/common.UploadFile/uploadPictures" name="reply_pic"
                        list-type="picture-card" :data="updateData" :file-list="fileList" @preview="handlePreview"
                        @change="upLoadChange">
                        <div v-if="fileList.length < 8">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                                上传图片
                            </div>
                        </div>
                    </a-upload>
                    <div>建议尺寸：316 * 90</div>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                </a-col>
            </a-row>

            <a-form-item label="绑定景区" v-if="detail.type == 'scenic'">
                <a-select v-model="detail.tools_id" placeholder="请选择景区">
                    <a-select-option v-for="item in tools_list" :key="item.tools_id">
                        {{item.title}}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="显示时长">
                <a-select v-decorator="[
                  'show_type',
                  { initialValue: detail.show_type,rules: [{ required: true, message: '请选择显示时长' }] },
                ]" placeholder="请选择显示时长" @change="handleSelectChange">
                    <a-select-option key="1" v-for="item in show_type_select" :key="item.key">
                        {{item.value}}
                    </a-select-option>

                </a-select>

            </a-form-item>


            <a-form-item v-if="detail.show_type == 2" label="选择显示日期">
                <a-range-picker @change="selectDataChange" v-decorator="[
                  'start_time',
                  { initialValue: selectDate,rules: [{ required: true, message: '请选择显示日期' }] },
                ]" :format="'YYYY-MM-DD'" />

            </a-form-item>


            <a-row>
                <a-col :span="3" style="text-align: right;padding-right: 10px;color: rgba(0, 0, 0, 0.85);">
                    <span>资讯内容: </span>
                </a-col>
                <a-col :span="20">
                    <vue-ueditor-wrap v-model="detail.content" :config="ueConfig"></vue-ueditor-wrap>
                </a-col>
            </a-row>



            <a-form-item :wrapper-col="{ span: 12, offset: 3 }" style="margin-top: 20px;">
                <a-button type="primary" html-type="submit">
                    提交
                </a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script>
    import lifeToolsPlatformApi from "@/api/life_tools/platform";
    import moment from 'moment';
    import VueUeditorWrap from 'vue-ueditor-wrap'
    export default {
        name: 'InformationEdit',
        components: {
            VueUeditorWrap
        },
        data() {
            return {
                title: "添加资讯",
                //是否显示弹窗
                visible: false,
                selectDate: null,
                formLayout: 'horizontal',
                form: this.$form.createForm(this, {
                    name: 'coordinated'
                }),
                fileList: [],
                tools_list: [],
                previewVisible: false,
                previewImage: '',
                updateData: {
                    "upload_dir": "merchant/life_tools/tools"
                },
                detail: {
                    pigcms_id: 0,
                    title: '',
                    show_type: 0,
                    tools_id: 0,
                    start_time: '',
                    end_time: '',
                    content: '',
                    type: 'sports',
                    images: ''
                },
                ueConfig: {
                    enableAutoSave: false,
                    autoSyncData: false,
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 350,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口
                    serverUrl: '/v20/public/static/UEditor/php/controller.php',
                    // UEditor 文件存放位置
                    UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
                },
                show_type_select: [{
                        key: 1,
                        value: '永久显示'
                    },
                    {
                        key: 2,
                        value: '时间段'
                    },
                ],
                dateFormat: 'YYYY-MM-DD',
            }
        },
        methods: {
            moment,
            //关闭窗口
            closeWindow() {
                this.visible = false
            },
            resetForm() {
                this.form.resetFields();
                this.detail.pigcms_id = 0;
                this.detail.title = '';
                this.detail.images = '';
                this.fileList = [];
                this.detail.show_type = 1;
                this.detail.start_time = 0;
                this.detail.end_time = 0;
                this.detail.content = '';
                this.detail.tools_id = 0;
            },
            addEditInformation(id = 0, type = 'sports') {
                this.selectDate = null;
                // this.form.resetFields();
                this.resetForm()
                if (id) {
                    this.request(lifeToolsPlatformApi.getInformationDetail, {
                        pigcms_id: id
                    }).then((res) => {
                        this.title = '编辑资讯'
                        this.detail.pigcms_id = res.pigcms_id;
                        this.detail.title = res.title;
                        this.detail.show_type = res.show_type;
                        this.detail.start_time = res.start_time_text;
                        this.detail.end_time = res.end_time_text;
                        this.detail.content = res.content_html;
                        this.detail.type = res.type;
                        this.detail.tools_id = res.tools_id;

                        if (res.show_type == 2) {
                            this.selectDate = [moment(res.start_time_text, this.dateFormat), moment(res
                                .end_time_text, this
                                .dateFormat)];
                        }
                        this.detail.images = res.images;
                        let imageList = [];
                        if (res.images_arr.length > 0) {
                            for (const i in res.images_arr) {
                                imageList.push({
                                    uid: i + 1,
                                    name: 'image.png',
                                    status: 'done',
                                    url: res.images_arr[i].url,
                                    data: res.images_arr[i].data
                                });
                            }
                        }
                        this.fileList = imageList;

                    })

                } else {
                    this.title = '添加资讯'
                    this.detail.type = type;
                }
                this.getAllScenic();
                this.visible = true

            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.detail.title = values.title;
                        if (!this.detail.content) {
                            this.$message.error('请输入内容！');
                            return false;
                        }
                        this.request(lifeToolsPlatformApi.addEditInformation, this.detail).then((res) => {
                            this.$message.success(this.L('操作成功！'))
                            this.visible = false
                            this.$emit('loadRefresh');
                        })
                    }
                });
            },
            handleSelectChange(val) {
                this.detail.show_type = val
            },
            selectDataChange(dates, dateStrings) {
                this.detail.start_time = dateStrings[0]
                this.detail.end_time = dateStrings[1]
            },

            handleCancel() {
                this.previewVisible = false;
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            upLoadChange({
                fileList
            }) {

                if (fileList.length) {
                    // fileList = fileList.slice(-1) 
                    this.detail.images = '';

                    fileList = fileList.map((file) => {
                        if (file.response) {
                            this.detail.images += file.response.data + ','
                        } else if (file.data) {
                            this.detail.images += file.data + ','
                        }
                        return file
                    })

                    this.fileList = fileList

                } else {
                    this.fileList = []
                }
                console.log(this.detail.images)
            },

            getAllScenic() {
                this.request(lifeToolsPlatformApi.getAllScenic, {}).then((res) => {
                    this.tools_list = res
                })
            }

        }
    }
</script>
