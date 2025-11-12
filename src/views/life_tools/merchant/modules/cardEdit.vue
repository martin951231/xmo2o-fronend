<template>
    <div>
        <a-modal
            :visible="visible"
            :title="title"
            width="60%"
            @cancel="handleCancel"
            @ok="handleOk"
            :bodyStyle="{
                maxHeight: '600px',
                overflowY: 'auto',
            }"
            :destroyOnClose="true"
        >
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="选择次卡类型" required>
                    <a-select
                        :disabled="this.isEdit"
                        v-model="formData.type"
                        :options="cardTypeOPtions"
                        style="width: 100%"
                        @change="cardTypeChange"
                    >
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="次卡名称" required>
                    <a-input v-model="formData.title" />
                </a-form-model-item>
                <a-form-model-item label="原价" required>
                    <a-input type="number" v-model="formData.old_price" />
                </a-form-model-item>
                <a-form-model-item label="现价" required>
                    <a-input type="number" v-model="formData.price" />
                </a-form-model-item>
                <a-form-model-item label="图片" required>
                    <a-upload
                        name="reply_pic"
                        list-type="picture"
                        :show-upload-list="false"
                        :data="{ upload_dir: '' }"
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        @change="handleUploadChange"
                    >
                        <img v-if="image" style="width: 120px; height: 120px" :src="image" alt="image" />
                        <div v-else>
                            <a-icon v-if="loading === true" :type="'loading'" />
                            <a-button> <a-icon type="upload" /> 上传 </a-button>
                        </div>
                    </a-upload>
                    <br /><font style="color: red">推荐尺寸：718px * 312px</font>
                </a-form-model-item>
                <a-form-model-item label="购买后有效期" required>
                    <a-select :disabled="this.isEdit" v-model="formData.term_type" style="width: 100px">
                        <a-select-option :value="1">天</a-select-option>
                        <a-select-option :value="2">月</a-select-option>
                        <a-select-option :value="3">年</a-select-option>
                    </a-select>
                    <a-input
                        :disabled="this.isEdit"
                        type="number"
                        style="width: 150px; margin-left: 10px"
                        v-model="formData.term_num"
                    />
                </a-form-model-item>
                <a-form-model-item label="绑定景区" v-if="formData.type == 'scenic'">
                    <a-select
                        :disabled="this.isEdit"
                        mode="multiple"
                        v-model="formData.scenic_ids"
                        :options="scenicList"
                    >
                    </a-select>
                </a-form-model-item>
                <blockquote v-if="formData.type == 'sports'">
                    <a-form-model-item label="绑定体育馆">
                        <a-select
                            :disabled="this.isEdit"
                            mode="multiple"
                            v-model="formData.stadium_ids"
                            :options="stadiumList"
                        >
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="绑定体育课程">
                        <a-select
                            :disabled="this.isEdit"
                            mode="multiple"
                            v-model="formData.course_ids"
                            :options="courseList"
                        >
                        </a-select>
                    </a-form-model-item>
                </blockquote>

                <a-form-model-item label="总次数">
                    <a-input type="number" :disabled="this.isEdit" v-model="formData.num" />
                </a-form-model-item>
                <a-form-model-item label="每日核销次数">
                    <a-input type="number" v-model="formData.day_num" />
                    -1表示不限制
                </a-form-model-item>
                <a-form-model-item label="同一个用户购买次数">
                    <a-input type="number" v-model="formData.user_num" />
                </a-form-model-item>
                <a-form-model-item label="购买须知">
                    <a-textarea
                        v-model="formData.description"
                        placeholder="请输入购买须知"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>
<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
import moment from 'moment'

function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: String,
        detail: Object,
        toolsList: Array,
        isEdit: Boolean,
    },
    data() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 10 },
            loading: false,
            image: '',
            // 次卡类型
            cardTypeOPtions: [],
            // 体育馆列表
            stadiumList: [],
            // 体育课程列表
            courseList: [],
            // 景区列表
            scenicList: [],
            formData: {
                type: '',
                title: '',
                old_price: '',
                price: '',
                term_type: 1,
                term_num: '',
                scenic_ids: [],
                stadium_ids: [],
                course_ids: [],
                num: '',
                day_num: '',
                user_num: '',
                description: '',
            },
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.initFormData()
            }
        },
    },
    mounted() {
        this.initFormData()
    },
    methods: {
        moment,
        initFormData() {
            this.getList()
            if (this.detail && Object.keys(this.detail).length) {
                this.formData = {
                    ...this.detail,
                }
            } else {
                this.formData = {
                    type: '',
                    title: '',
                    old_price: '',
                    price: '',
                    term_type: 1,
                    term_num: '',
                    scenic_ids: [],
                    stadium_ids: [],
                    course_ids: [],
                    num: '',
                    day_num: '',
                    user_num: '',
                    description: '',
                }
            }

            this.image = this.detail ? this.detail.image : ''
        },
        handleOk() {
            if (this.formData.title == '' || this.formData.title == undefined) {
                this.$message.error('次卡名称必填')
                return false
            }
            if (this.formData.old_price == '' || this.formData.old_price == undefined) {
                this.$message.error('原价必填')
                return false
            }
            if (this.formData.price == '' || this.formData.price == undefined) {
                this.$message.error('现价必填')
                return false
            }
            if (this.formData.image == '' || this.formData.image == undefined) {
                this.$message.error('图片必填')
                return false
            }
            if (this.formData.term_num == '' || this.formData.term_num == 0 || this.formData.term_num == undefined) {
                this.$message.error('有效期必须大于0')
                return false
            }
            if (this.formData.num == '' || this.formData.num == 0 || this.formData.num == undefined) {
                this.$message.error('总次数必须大于0')
                return false
            }
            if (this.formData.day_num == '' || this.formData.day_num == 0 || this.formData.num == undefined) {
                this.$message.error('每日核销次数不能等于0')
                return false
            }
            if (this.formData.user_num == '' || this.formData.user_num == 0 || this.formData.user_num == undefined) {
                this.$message.error('同一个用户购买次数必须大于0')
                return false
            }
            if (this.formData.day_num - 0 > this.formData.num - 0) {
                this.$message.error('每日核销次数不能大于总次数')
                return false
            }
            this.request(lifeToolsMerchantApi.AddOrEditToolsCard, this.formData).then((res) => {
                this.$message.success('操作成功!', 1, () => {
                    this.$emit('handleCancel')
                    this.$emit('getDataList', false)
                })
            })
        },
        handleCancel() {
            this.$emit('handleCancel')
        },
        // 上传图片
        handleUploadChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true
                return
            }
            if (info.file.status === 'done') {
                if (info.file.response.status === 1000) {
                    let imageUrl = info.file.response.data
                    this.$set(this.formData, 'image', imageUrl)
                    getBase64(info.file.originFileObj, (imageUrl) => {
                        this.image = imageUrl
                        this.loading = false
                    })
                }
            }
        },
        // 次卡类型change
        cardTypeChange(e) {
            this.$set(this.formData, 'type', e)
        },
        // 获取景区列表、体育馆列表、体育课程列表
        getList() {
            this.request(lifeToolsMerchantApi.getAddEditCardMerchantInfo).then((res) => {
                const { is_sports = 0, is_scenic = 0, scenic_list = [], stadium_list = [], course_list = [] } = res
                let cardTypeOPtions = []
                if (is_scenic == 1) {
                    cardTypeOPtions.push({
                        value: 'scenic',
                        label: '景区',
                    })
                }
                if (is_sports == 1) {
                    cardTypeOPtions.push({
                        value: 'sports',
                        label: '体育',
                    })
                }
                this.cardTypeOPtions = cardTypeOPtions
                if (!this.detail || (this.detail && !this.detail.type)) {
                    this.formData.type = this.cardTypeOPtions.length ? this.cardTypeOPtions[0]['value'] : ''
                }

                this.scenicList = scenic_list.map((item) => {
                    return {
                        value: item.tools_id,
                        label: item.title,
                    }
                })
                this.stadiumList = stadium_list.map((item) => {
                    return {
                        value: item.tools_id,
                        label: item.title,
                    }
                })
                this.courseList = course_list.map((item) => {
                    return {
                        value: item.tools_id,
                        label: item.title,
                    }
                })
            })
        },
    },
}
</script>