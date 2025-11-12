<template>
    <a-modal
        :title="title"
        width="60%"
        :bodyStyle="bodyStyle"
        :visible="visible"
        @cancel="visible = false"
        footer=""
        :destroyOnClose="true"
        :dialogStyle="dialogStyle"
    >
        <div>
            <a-button type="primary" class="mb-10" @click="getAddModel">{{ L('新建') }}</a-button>
            <a-table :columns="columns" :data-source="list" rowKey="id">
                <span slot="pic" slot-scope="text, record">
                    <img width="70px" height="30px" style="object-fit: contain;" :src="record.pic" />
                </span>
                <span slot="status" slot-scope="text">
                    <a-badge v-if="text == 0" status="error" :text="L('关闭')" />
                    <a-badge v-if="text == 1" status="success" :text="L('开启')" />
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="edit(record)">{{ L('编辑') }}</a>
                    <a-divider type="vertical" />
                    <a-popconfirm
                        :title="L('确认删除？')"
                        :ok-text="L('确定')"
                        :cancel-text="L('取消')"
                        @confirm="del(record)"
                    >
                        <a>{{ L('删除') }}</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <a-modal
                :visible="addVisible"
                width="60%"
                @cancel="addVisible = false"
                :closable="false"
                :destroyOnClose="true"
                @ok="handleSubmit"
                :dialogStyle="dialogStyle"
            >
                <div style="overflow-y: scroll; height: 600px">
                    <a-form-model :model="form" v-bind="formItemLayout" ref="ruleForm" :rules="rules">
                        <a-form-model-item :label="L('名称')" prop="name">
                            <a-input :placeholder="L('请输入')" v-model="form.name" />
                        </a-form-model-item>
                        <a-form-model-item :label="L('通用广告')">
                            <a-switch
                                :checked-children="L('通用')"
                                :un-checked-children="L('不通用')"
                                v-model="form.is_currency"
                                :defaultChecked="true"
                            />
                        </a-form-model-item>
                        <a-form-model-item v-if="form.is_currency == false" :label="L('所在区域')" prop="area">
                            <a-cascader
                                v-model="form.area"
                                :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"
                                :options="areaList"
                                :placeholder="L('请选择所在区域')"
                            />
                        </a-form-model-item>
                        <a-form-model-item :label="L('图片')" extra="">
                            <div class="clearfix">
                                <div>
                                    <a-upload
                                        list-type="picture-card"
                                        name="reply_pic"
                                        :data="{ upload_dir: upload_dir[type] }"
                                        :fileList="fileList"
                                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                        @change="handleUploadChange"
                                        @preview="handleUploadPreview"
                                    >
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">{{ L('选择图片') }}</div>
                                    </a-upload>
                                    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                                        <img alt="example" style="width: 100%" :src="previewImage" />
                                    </a-modal>
                                </div>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item :label="L('链接地址')" prop="url">
                            <div class="flex align-center">
                                <a-input v-model="form.url" :placeholder="L('请填写跳转链接')" class="flex-1 mr-10" />
                                <a class="ant-form-text" @click="setLinkBases"> {{ L('从功能库选择') }} </a>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item :label="L('小程序中想要打开')">
                            <a-select v-model="form.wxapp_open_type">
                                <a-select-option :value="1"> {{ L('打开其他小程序') }} </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item :label="L('打开其他小程序')" v-if="form.wxapp_open_type == 1">
                            <a-select v-model="form.wxapp_id" :placeholder="L('选择小程序')">
                                <a-select-option :value="item.appid" v-for="(item, index) in wxapp_list" :key="index">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item :label="L('小程序页面')" v-if="form.wxapp_open_type == 1">
                            <div class="flex align-center">
                                <a-input
                                    :placeholder="L('请输入小程序页面路径')"
                                    v-model="form.wxapp_page"
                                    class="flex-1"
                                />
                                <a-tooltip trigger="hover">
                                    <template slot="title">
                                        {{
                                            L(
                                                '即打开另一个小程序时进入的页面路径，如果为空则打开首页；另一个小程序的页面路径请联系该小程序的技术人员询要；目前仅支持用户在平台小程序首页和外卖首页中打开其他小程序。'
                                            )
                                        }}
                                    </template>
                                    <a-icon class="ml-10" type="question-circle" />
                                </a-tooltip>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item :label="L('排序')">
                            <a-input-number v-model="form.sort" :min="0" />
                            <span class="ant-form-text"> {{ L('值越大越靠前') }} </span>
                        </a-form-model-item>
                        <a-form-model-item :label="L('状态')">
                            <a-switch
                                v-model="form.status"
                                :defaultChecked="true"
                                :checked-children="L('开启')"
                                :un-checked-children="L('关闭')"
                            />
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </a-modal>
        </div>
    </a-modal>
</template>
  
<script>
import appointPlatformApi from '@/api/appoint/platform'
export default {
    data() {
        return {
            visible: false,
            addVisible: false,
            // 208 = modal top 50 + modal header 55 + modal footer 53 + 50
            bodyStyle: {
                maxHeight: document.body.clientHeight - 208 + 'px',
                overflowY: 'auto',
            },
            dialogStyle: {
                top: '50px'
            },
            // banner = 轮播图 || nav = 导航装修
            type: '',
            upload_dir: {
                banner: '/adver',
                nav: '/slider'
            },
            title: '',
            columns: [
                {
                    title: this.L('排序'),
                    dataIndex: 'sort',
                    width: 60,
                },
                {
                    title: this.L('名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('城市'),
                    dataIndex: 'area_name',
                    width: 100,
                },
                {
                    title: this.L('图片'),
                    dataIndex: 'pic',
                    scopedSlots: { customRender: 'pic' },
                },
                {
                    title: this.L('操作时间'),
                    dataIndex: 'last_time',
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    width: 120,
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            list: [],
            areaList: [],
            form: {
                id: '',
                name: '',
                // 是否通用广告
                is_currency: true,
                // 区域
                area: [],
                // 图片
                pic: '',
                // 链接地址
                url: '',
                // 是否打开小程序
                wxapp_open_type: undefined,
                // 小程序
                wxapp_id: '',
                // 小程序页面
                wxapp_page: '',
                // 排序
                sort: 0,
                // 状态
                status: true,
            },
            previewVisible: false,
            previewImage: '',
            wxapp_list: [],
            fileList: [],
            formItemLayout: {
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
            },
            rules: {
                name: [{ required: true, message: this.L('请填写名称') }],
                area: [{ required: true, message: this.L('请选择区域') }],
                url: [{ required: true, message: this.L('请填写链接地址') }],
            },
        }
    },
    methods: {
        showModal(type, title) {
            this.type = type
            this.title = title
            this.getList()
            this.visible = true
        },
        // 列表
        getList() {
            let api = {
                banner: appointPlatformApi.appointAdvertisementList,
                nav: appointPlatformApi.appointSliderList,
            }
            this.request(api[this.type], {}).then((res) => {
                this.list = res.data || []
            })
        },
        getWxappList() {
            this.request(appointPlatformApi.wxAppletList).then((res) => {
                this.wxapp_list = res || []
            })
        },
        // 新建
        getAddModel() {
            this.form = {
                id: '',
                name: '',
                is_currency: true,
                area: [],
                pic: '',
                url: '',
                wxapp_open_type: undefined,
                wxapp_id: '',
                wxapp_page: '',
                sort: 0,
                status: true,
            }
            this.fileList = []
            this.getAllArea()
            this.getWxappList()
            this.addVisible = true
        },
        // 删除
        del(record) {
            let api = {
                banner: appointPlatformApi.appointAdvertisementDel,
                nav: appointPlatformApi.appointSliderDel,
            }

            let params = {}
            if (this.type == 'banner') {
                params = {
                    adver_id: record.id,
                }
            } else {
                params = {
                    slider_id: record.id,
                }
            }

            this.request(api[this.type], params).then((res) => {
                this.$message.success(this.L('操作成功'))
                this.getList()
            })
        },
        // 编辑
        edit(record) {
            this.getAllArea()
            this.getWxappList()

            let api = {
                banner: appointPlatformApi.appointAdvertisementDetail,
                nav: appointPlatformApi.appointSliderDetail,
            }
            let params = {}
            if (this.type == 'banner') {
                params = {
                    adver_id: record.id,
                }
            } else {
                params = {
                    slider_id: record.id,
                }
            }

            this.request(api[this.type], params).then((res) => {
                this.form = {
                    id: res.id || '',
                    name: res.name || '',
                    is_currency: res.city_id?false:true,
                    area: res.province_id || res.city_id?[res.province_id,res.city_id]:[],
                    pic: res.pic || '',
                    url: res.url || '',
                    wxapp_open_type: res.wxapp_open_type || undefined,
                    wxapp_id: res.wxapp_id || '',
                    wxapp_page: res.wxapp_page || '',
                    sort: res.sort || 0,
                    status: res.status == 1,
                }
                if (res.pic) {
                    this.fileList = [
                        {
                            uid: 'pic_logo',
                            name: 'pic_logo_1',
                            status: 'done',
                            url: res.pic,
                        },
                    ]
                }
                this.addVisible = true
            })
        },
        //获取地区信息 只需要省市两级
        getAllArea() {
            let params = {
                index_name: 'area_id',
                text_name: 'area_name',
            }
            this.request(appointPlatformApi.getAllArea, params).then((res) => {
                if (res && res.length) {
                    res = res.filter((item) => {
                        if (item.children && item.children.length) {
                            item.children = item.children.map((sItem) => {
                                if (sItem.children) {
                                    this.$delete(sItem, 'children')
                                }
                                return sItem
                            })
                        } else {
                            item.disabled = true
                        }
                        return item
                    })
                }
                this.areaList = res || []
            })
        },
        // 提交
        handleSubmit(e) {
            e.preventDefault()
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let params = {
                        ...this.form,
                        status: this.form.status ? 1 : 0,
                        province_id: this.form.area[0] ? this.form.area[0] : '',
                        city_id: this.form.area[1] ? this.form.area[1] : '',
                    }
                    if(this.form.is_currency) {
                        params['city_id'] = 0
                        params['province_id'] = 0
                    }
                    this.$delete(params, 'area')
                    this.$delete(params, 'is_currency')
                    if (this.type == 'banner') {
                        params['adver_id'] = this.form.id
                    }
                    if (this.type == 'nav') {
                        params['slider_id'] = this.form.id
                    }
                    let api = {
                        banner: appointPlatformApi.appointAdvertisementAddOrEdit,
                        nav: appointPlatformApi.appointSliderAddOrEdit,
                    }
                    this.request(api[this.type], params).then((res) => {
                        this.$message.success(this.L('操作成功'))
                        this.getList()
                        this.addVisible = false
                    })
                } else {
                    return false
                }
            })
        },
        // 图片
        handleUploadChange({ fileList }) {
            this.fileList = fileList
            if (fileList.length > 0) {
                let len = fileList.length - 1
                if (this.fileList[len].status == 'done') {
                    let url = this.fileList[len].response.data
                    this.$set(this.form, 'pic', url)
                    if (fileList.length > 1) {
                        this.fileList.splice(0, len)
                    }

                    this.fileList[0].uid = `pic_logo`
                    this.fileList[0].name = `pic_logo_1`
                    this.fileList[0].status = 'done'
                    this.fileList[0].url = url
                }
            } else {
                this.$set(this.form, 'pic', '')
            }
        },
        // 图片预览
        async handleUploadPreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // 链接
        setLinkBases() {
            this.$LinkBases({
                source: 'platform', // 必填
                type: 'h5', // 必填
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    this.$nextTick(() => {
                        this.$set(this.form, 'url', res.url)
                    })
                },
            })
        },
    },
}
</script>

<style scoped>
.ant-modal-body {
    padding: 24px 0 24px 24px !important;
}
</style>