<template>
    <!-- 个人中心装修 -->
    <div class="bg-ff homePage">
        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" :labelAlign="'left'">
            <a-card :title="L('头部配置')" :bordered="false">
                <a-form-model-item :label="L('头部风格')">
                    <a-radio-group v-model="formData.head_style" @change="headStyleChange">
                        <a-radio v-for="(item, index) in headStyleOptions" :key="index" :value="item.value">{{
                            item.label
                        }}</a-radio>
                    </a-radio-group>
                    <!-- 系统风格 -->
                    <div class="flex align-center flex-wrap" v-if="formData.head_style && formData.head_style == '1'">
                        <span
                            v-for="item in headStyleColorOptions"
                            :key="item"
                            :style="[{ background: item }]"
                            class="headColorItem pointer"
                            :class="formData.head_style_value == item ? 'active' : ''"
                            @click="formData.head_style_value = item"
                        ></span>
                    </div>
                    <!-- 自定义风格 -->
                    <div v-if="formData.head_style && formData.head_style == '2'">
                        <a-upload
                            name="reply_pic"
                            :action="$store.state.customPage.uploadAction"
                            :data="uploadData"
                            @change="handleUploadChange($event, 'headStyleFileList')"
                            :file-list="headStyleFileList"
                        >
                            <a-button> <a-icon type="upload" /> {{ L('上传图片') }} </a-button>
                        </a-upload>
                        <div class="desc">{{ L('建议尺寸：750px * 600px，小于300k') }}</div>
                        <div class="desc">
                            {{ '（' + L('图片重要信息尽量靠上，未配置会员卡时底部将被截取') + '）' }}
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('字体颜色')">
                    <a-radio-group v-model="formData.font_color">
                        <a-radio v-for="(item, index) in fontColorOptions" :key="index" :value="item.value">{{
                            item.label
                        }}</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item
                    :label="L('会员模块')"
                    :help="L('模块隐藏：未开通会员不展示开卡提醒；领卡后不展示会员卡折扣')"
                >
                    <a-radio-group v-model="formData.vip_display">
                        <a-radio v-for="(item, index) in vipDisplayOptions" :key="index" :value="item.value">{{
                            item.label
                        }}</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-card>
            <a-card :title="L('会员储值')" :bordered="false">
                <a-form-model-item label="">
                    <a-checkbox
                        @change="vipStoredChange"
                        :checked="
                            formData.vip_stored_value_display && formData.vip_stored_value_display == '1' ? true : false
                        "
                    >
                        {{ L('会员储值') }}
                    </a-checkbox>
                </a-form-model-item>
                <a-form-model-item
                    :label="L('副标题')"
                    v-if="formData.vip_stored_value_display && formData.vip_stored_value_display == '1'"
                >
                    <a-input v-model="formData.vip_store_value_subname" :placeholder="L('请输入')"> </a-input>
                </a-form-model-item>
            </a-card>
            <a-card :title="L('广告位配置')" :bordered="false">
                <span slot="extra">{{ L('最多可上传3张') }}</span>
                <div class="adverWrap">
                    <div v-if="formData.adver && formData.adver.length">
                        <div
                            v-for="(item, index) in formData.adver"
                            :key="index"
                            @click="adverEdit(item, index)"
                            @mouseenter="adverHover(index)"
                            @mouseleave="adverLeave()"
                            class="adverItem pointer"
                        >
                            <div class="adverImgWrap">
                                <img :src="item.image_url" alt="" />
                            </div>

                            <a-icon
                                type="close-circle"
                                class="closeIcon"
                                v-if="currentAdverIndex === index"
                                @click.stop="adverDel(index)"
                            />
                        </div>
                    </div>
                    <div class="mt-20 mb-20" v-if="formData.adver && formData.adver.length < 3">
                        <a-button block @click="adverAdd()"> <a-icon type="plus" />{{ L('添加广告位') }} </a-button>
                    </div>
                </div>
            </a-card>
            <a-card :title="L('活动中心')" :bordered="false">
                <span slot="extra">{{ L('长按可拖动调整顺序') }}</span>
                <draggable v-model="menuList.activity" @change="draggableChange('activity')">
                    <transition-group>
                        <div
                            v-for="(item, index) in menuList.activity"
                            :key="index"
                            class="flex align-center justify-between mb-10 move"
                        >
                            <a-checkbox :checked="item.checked" @change="menuChange($event, index, 'activity')">
                                {{ item.name }}</a-checkbox
                            >
                            <div class="pointer">
                                <a href="javascript:void(0);" @click="menuEdit(item, index, 'activity')">
                                    <a-icon type="edit"
                                /></a>
                                <a href="javascript:void(0);" @click="menuDel(index, 'activity')">
                                    <a-icon class="ml-10" type="delete" v-if="!item.type"
                                /></a>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
                <div class="mt-20 mb-20">
                    <a-button block @click="menuAdd('activity')"> <a-icon type="plus" />{{ L('添加菜单') }} </a-button>
                </div>
            </a-card>
            <a-card :title="L('业务配置')" :bordered="false">
                <span slot="extra">{{ L('长按可拖动调整顺序') }}</span>
                <draggable v-model="menuList.business" @change="draggableChange('business')">
                    <transition-group>
                        <div
                            v-for="(item, index) in menuList.business"
                            :key="index"
                            class="flex align-center justify-between mb-10 move"
                        >
                            <a-checkbox :checked="item.checked" @change="menuChange($event, index, 'business')">
                                {{ item.name }}</a-checkbox
                            >
                            <div class="pointer">
                                <a href="javascript:void(0);" @click="menuEdit(item, index, 'business')">
                                    <a-icon type="edit"
                                /></a>
                                <a href="javascript:void(0);" @click="menuDel(index, 'business')">
                                    <a-icon class="ml-10" type="delete" v-if="!item.type"
                                /></a>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
                <div class="mt-20 mb-20">
                    <a-button block @click="menuAdd('business')"> <a-icon type="plus" />{{ L('添加菜单') }} </a-button>
                </div>
            </a-card>
        </a-form-model>

        <a-modal
            :title="modalTitle"
            :visible="visible"
            :destroyOnClose="true"
            :width="'50%'"
            :cancelText="L('取消')"
            :okText="L('确定')"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-form-model
                :model="subFormData"
                :label-col="labelColModal"
                :wrapper-col="wrapperColModal"
                :labelAlign="'left'"
            >
                <!-- 广告位 -->
                <div v-if="modalType == 'adver'">
                    <a-form-model-item
                        :label="L('图片展示')"
                        :help="L('建议尺寸：720px*210px，大小不超过1M')"
                        :rules="{
                            required: true,
                        }"
                    >
                        <a-upload
                            name="reply_pic"
                            :action="$store.state.customPage.uploadAction"
                            :showUploadList="false"
                            :data="uploadData"
                            @change="handleUploadChange($event, 'adverFileList')"
                            :disabled="loading"
                            class="upload-loading"
                        >
                            <div class="adverItemImgWrap pointer" v-if="subFormData.image_url">
                                <img :src="subFormData.image_url" alt="" class="adverItemImg" />
                            </div>
                            <div v-else class="emptyAdver flex align-center justify-center mb-10 pointer">
                                <a-icon type="plus" />
                            </div>
                            <div v-if="loading" class="loading">
                                <a-icon type="loading" class="mr-20" />
                                <div class="ant-upload-text">{{ L('上传中') }}</div>
                            </div>
                        </a-upload>
                    </a-form-model-item>
                </div>
                <!-- 活动中心 || 业务配置-->
                <div v-if="modalType == 'activity' || modalType == 'business'">
                    <a-form-model-item
                        :label="L('菜单名称')"
                        :rules="{
                            required: true,
                        }"
                    >
                        <a-input
                            v-model="subFormData.name"
                            :maxLength="modalType == 'activity' ? 10 : 5"
                            :placeholder="L('请输入')"
                        >
                            <span slot="suffix">
                                {{ subFormData.name.length }}/{{ modalType == 'activity' ? 10 : 5 }}
                            </span>
                        </a-input>
                    </a-form-model-item>
                    <a-form-model-item
                        :label="L('菜单图标')"
                        :rules="{
                            required: true,
                        }"
                    >
                        <a-radio-group v-model="subFormData.icon_type" v-if="current[menuType + 'Type']">
                            <a-radio v-for="(item, index) in iconTypeOptions" :key="index" :value="item.value">{{
                                item.label
                            }}</a-radio>
                        </a-radio-group>
                        <div v-if="subFormData.icon_type == '2'" class="flex">
                            <div class="iconImgWrap mr-20">
                                <img :src="subFormData.icon_url" v-if="subFormData.icon_url" alt="" />
                                <img v-else class="emptyImg" :src="$store.state.customPage.defaultImg" alt="" />
                                <div v-if="loading" class="loading">
                                    <a-icon type="loading" />
                                </div>
                            </div>

                            <a-upload
                                name="reply_pic"
                                :action="$store.state.customPage.uploadAction"
                                :showUploadList="false"
                                :data="uploadData"
                                @change="handleUploadChange($event, 'iconUrl')"
                                :disabled="loading"
                            >
                                <a-button> <a-icon type="upload" /> {{ L('上传图片') }} </a-button>
                                <div class="ant-form-explain pt-10">
                                    {{ L('建议尺寸') }}：{{ modalType == 'activity' ? '25*25' : '20*20' }}
                                </div>
                            </a-upload>
                        </div>
                    </a-form-model-item>
                </div>

                <a-form-model-item
                    :label="L('配置链接')"
                    v-if="!subFormData.type"
                    :rules="{
                        required: true,
                    }"
                >
                    <div class="flex">
                        <a-textarea
                            style="max-height: 100px; overflow-y: auto; resize: none"
                            v-model="subFormData.link_url"
                            :placeholder="L('请输入链接/功能库选择')"
                            autoSize
                        />
                        <a-button class="ml-20" @click="getLinkUrl()">{{ L('从功能库选择') }}</a-button>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import customPageApi from '@/api/common/platform/customPage'
import draggable from 'vuedraggable'
export default {
    components: {
        draggable,
    },
    data() {
        return {
            loading: false,
            emptyData: ['', null, undefined, 'null', 'undefined'],
            isValidate: false, // 校验是否为空
            formData: {
                id: '',
                source: '',
                source_id: '',
                type: '',
                head_style: '1',
                head_style_value: '#000000',
                head_style_img: '',
                font_color: '2',
                vip_display: '1',
                vip_stored_value_display: '1',
                vip_store_value_subname: '',
                adver: [],
                activity: [],
                business: [],
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            labelColModal: { span: 4 },
            wrapperColModal: { span: 18 },
            headStyleOptions: [
                {
                    label: this.L('系统风格'),
                    value: '1',
                },
                {
                    label: this.L('自定义风格'),
                    value: '2',
                },
            ],
            headStyleColorOptions: [
                '#000000',
                '#fa4b28',
                '#c71d2b',
                '#f0f0f0',
                '#ffc406',
                '#fedcdc',
                '#0c92fd',
                '#09c0a2',
            ],
            headStyleFileList: [],
            fontColorOptions: [
                {
                    label: this.L('黑色'),
                    value: '1',
                },
                {
                    label: this.L('白色'),
                    value: '2',
                },
            ],
            vipDisplayOptions: [
                {
                    label: this.L('展示'),
                    value: '1',
                },
                {
                    label: this.L('隐藏'),
                    value: '2',
                },
            ],
            iconTypeOptions: [
                {
                    label: this.L('默认图标'),
                    value: '1',
                },
                {
                    label: this.L('自定义图标'),
                    value: '2',
                },
            ],
            currentAdverIndex: -1, // 当前选中的广告index
            visible: false,
            modalType: '',
            subFormData: {
                // 弹框formData
                image_url: '',
                link_url: '',
                name: '',
                icon_type: '2',
                icon_url: '',
            },
            current: {
                activityIndex: -1, // 当前选择的活动菜单
                activityType: '', // 有值表示默认菜单 空新增菜单
                businessIndex: -1, // 当前选择的业务菜单
                businessType: '', // 有值表示默认菜单 空新增菜单
            },
            menuList: {
                // 活动中心 业务配置默认菜单
                activity: [
                    {
                        name: this.L('领券中心'),
                        icon_type: '1',
                        icon_url: '',
                        checked: true,
                        link_url: '',
                        type: 'coupon', // 有值代表默认菜单，空新增 控制默认图标和配置链接是否可修改
                    },
                ],
                business: [
                    {
                        name: this.L('我的订单'),
                        icon_type: '1',
                        icon_url: '',
                        checked: true,
                        link_url: '',
                        type: 'order',
                    },
                    {
                        name: this.L('商家客服'),
                        icon_type: '1',
                        icon_url: '',
                        checked: true,
                        link_url: '',
                        type: 'customerService', // 有值代表默认菜单，空新增
                    },
                ],
            },
            menuType: '', // activity 活动菜单 business 业务配置菜单
            head_style_img: '',
        }
    },
    computed: {
        // 弹框标题
        modalTitle() {
            let title = ''
            if (this.modalType == 'adver') {
                if (this.currentAdverIndex != -1) {
                    title = this.L('编辑广告图')
                } else {
                    title = this.L('添加广告图')
                }
            } else if (this.modalType == 'activity' || this.modalType == 'business') {
                let index = this.current[this.menuType + 'Index']
                if (index != -1) {
                    title = this.L('编辑菜单')
                } else {
                    title = this.L('添加菜单')
                }
            }
            return title
        },
        // 组件id
        componentId() {
            return this.$store.state.customPage.componentId
        },
        // 来源source source_id
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
        // 图片上传参数
        uploadData() {
            return {
                upload_dir: '/decorate/images',
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                is_decorate: 1,
            }
        },
    },
    watch: {
        formData: {
            deep: true,
            handler(val) {
                this.updatePageInfo()
            },
        },
    },
    mounted() {
        this.getpersonalDec()
    },
    methods: {
        // 获取个人中心装修信息
        getpersonalDec() {
            let params = {
                id: '',
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
            }
            this.request(customPageApi.getpersonalDec, params).then((res) => {
                if (res && JSON.stringify(res) != '[]' && JSON.stringify(res) != '{}') {
                    this.formData = res
                    if (this.formData.head_style_value && this.formData.head_style == 2) {
                        this.head_style_img = this.formData.head_style_value
                    }
                }
                if (this.formData) {
                    this.initFormData()
                }
                // 活动中心 || 业务配置
                this.initMenu()

                this.updatePageInfo()
            })
        },
        initFormData() {
            this.$set(this.formData, 'font_color', this.formData.font_color.toString())
            this.$set(this.formData, 'head_style', this.formData.head_style.toString())
            this.$set(this.formData, 'vip_display', this.formData.vip_display.toString())

            if (this.formData.head_style == '2') {
                this.$set(this.formData, 'head_style_img', this.formData.head_style_value)
            }
        },
        // 更新formData
        updateFormData() {
            let menu = this.menuList[this.menuType] || []
            this.$set(this.formData, this.menuType, menu)
        },
        // 弹框确定
        handleOk() {
            if (this.modalType == 'adver') {
                this.adverSubmit()
            } else if (this.modalType == 'activity' || this.modalType == 'business') {
                // 活动中心
                this.menuSubmit()
            }
            if (!this.isValidate) return
            this.handleCancel()
        },
        // 弹框取消
        handleCancel() {
            this.visible = false
            this.modalType = ''
            this.currentAdverIndex = -1
            this.$set(this.current, 'activityIndex', -1)
            this.$set(this.current, 'activityType', '')
            this.$set(this.current, 'businessIndex', -1)
            this.$set(this.current, 'businessType', '')
            this.menuType = ''
            this.isValidate = false
            this.subFormData = {
                image_url: '',
                link_url: '',
                name: '',
                icon_type: '2',
                icon_url: '',
            }
            // console.log(this.subFormData, 'this.subFormData---handleCancel')
            this.updatePageInfo()
            this.loading = false
        },
        // 更新页面信息
        updatePageInfo() {
            this.$store.dispatch('updatePageInfo', this.formData)
        },
        // 头部风格却换
        headStyleChange(e) {
            if (e.target.value == '1') {
                this.$set(this.formData, 'head_style_value', this.headStyleColorOptions[0])
            }
        },
        // 上传图片
        handleUploadChange(info, type) {
            this.loading = true
            let fileList = [...info.fileList]
            fileList = fileList.slice(-1)
            fileList = fileList.map((file) => {
                if (file.status === 'done' && file.response.status == '1000') {
                    let imageUrl = file.response.data
                    if (type == 'headStyleFileList') {
                        console.log('imageUrl', imageUrl)
                        this.$set(this.formData, 'head_style_img', imageUrl)
                    } else if (type == 'adverFileList') {
                        this.$set(this.subFormData, 'image_url', imageUrl)
                    } else if (type == 'iconUrl') {
                        this.$set(this.subFormData, 'icon_url', imageUrl)
                    }
                    this.loading = false
                }
                return file
            })

            if (type == 'headStyleFileList') {
                if (!fileList.length) {
                    this.$set(this.formData, 'head_style_img', this.head_style_img)
                }
                this[type] = fileList
            }

            if (info.file.status === 'done') {
                this.loading = false
                // console.log('done')
            } else if (info.file.status === 'error') {
                // console.log('error')
                this.$message.error(this.L(`X1上传失败。`, { X1: info.file.name }))
                this.loading = false
            }
        },
        // 会员储值
        vipStoredChange(e) {
            this.$set(this.formData, 'vip_stored_value_display', e.target.checked ? '1' : '0')
        },
        // 广告位配置 添加
        adverAdd() {
            this.currentAdverIndex = -1
            this.$set(this.subFormData, 'image_url', '')
            this.$set(this.subFormData, 'link_url', '')
            this.visible = true
            this.modalType = 'adver'
            this.loading = false
        },
        // 广告位配置 编辑
        adverEdit(item, index) {
            this.currentAdverIndex = index
            this.$set(this.subFormData, 'image_url', item.image_url)
            this.$set(this.subFormData, 'link_url', item.link_url)
            this.visible = true
            this.modalType = 'adver'
            this.loading = false
        },
        // 广告位配置 hover
        adverHover(index) {
            this.currentAdverIndex = index
        },
        // 广告位配置 leave
        adverLeave() {
            if (!this.visible) {
                this.currentAdverIndex = -1
            }
        },
        // 广告位配置 删除
        adverDel(index) {
            let adver = this.formData.adver
            adver.splice(index, 1)
            this.$set(this.formData, 'adver', adver)
            this.currentAdverIndex = -1
        },
        // 广告位配置 确定
        adverSubmit() {
            if (this.emptyData.indexOf(this.subFormData.image_url) != -1) {
                this.$message.error(this.L('请上传广告图片'))
                return
            }
            if (this.emptyData.indexOf(this.subFormData.link_url) != -1) {
                this.$message.error(this.L('请配置广告位链接'))
                return
            }
            let adver = this.formData.adver || []
            let current = {
                image_url: this.subFormData.image_url,
                link_url: this.subFormData.link_url,
            }
            if (!adver.length || this.currentAdverIndex == -1) {
                adver.push(current)
            } else {
                adver = adver.map((item, index) => {
                    if (index == this.currentAdverIndex) {
                        item.image_url = this.subFormData.image_url
                        item.link_url = this.subFormData.link_url
                    }
                    return item
                })
            }
            // console.log(adver,'adver')
            this.$set(this.formData, 'adver', adver)
            this.isValidate = true
        },
        // 活动中心 || 业务配置
        // 菜单勾选
        menuChange(e, current, type) {
            this.menuType = type
            // console.log(e,'e')
            let menu = this.menuList[type] || []
            if (menu.length) {
                this.menuList[type] = this.menuList[type].map((item, index) => {
                    if (index === current) {
                        item.checked = e.target.checked
                    }
                    return item
                })
            }
            this.$set(this.menuList, type, menu)
            this.updateFormData()
        },
        initMenu() {
            let activity = this.formData && this.formData.id ? this.formData.activity : this.menuList['activity']
            this.$set(this.menuList, 'activity', activity)
            this.$set(this.formData, 'activity', activity)

            let business = this.formData && this.formData.id ? this.formData.business : this.menuList['business']
            this.$set(this.menuList, 'business', business)
            this.$set(this.formData, 'business', business)
        },
        // 菜单新增 没有默认图标icon_type = 2
        menuAdd(type) {
            this.visible = true
            this.$set(this.subFormData, 'icon_type', '2')
            this.$set(this.subFormData, 'name', '')
            this.$set(this.subFormData, 'icon_url', '')
            this.$set(this.subFormData, 'link_url', '')
            this.modalType = type
            this.menuType = type
            this.loading = false
        },
        // 菜单编辑
        menuEdit(item, index, type) {
            this.menuType = type
            this.$set(this.current, type + 'Index', index)
            this.$set(this.current, type + 'Type', item.type || '')

            for (let k in item) {
                this.$set(this.subFormData, k, item[k])
            }
            this.visible = true
            this.modalType = type
            this.loading = false
        },
        // 菜单删除
        menuDel(index, type) {
            this.menuType = type
            let menu = this.formData[type]
            menu.splice(index, 1)
            this.$set(this.menuList, type, menu)
            this.$set(this.formData, type, menu)
            this.$set(this.current, type + 'Index', -1)
        },
        // 菜单确定提交
        menuSubmit() {
            if (this.emptyData.indexOf(this.subFormData.name.trim()) != -1) {
                this.$message.error(this.L('请输入菜单名称'))
                return
            }
            if (this.subFormData.icon_type == '2' && this.emptyData.indexOf(this.subFormData.icon_url) != -1) {
                this.$message.error(this.L('请上传菜单图标'))
                return
            }
            if (!this.subFormData.type && this.emptyData.indexOf(this.subFormData.link_url) != -1) {
                this.$message.error(this.L('请配置菜单链接'))
                return
            }

            let menu = this.menuList[this.menuType] || []
            let currentIndex = this.current[this.menuType + 'Index']
            if (!menu.length || currentIndex == -1) {
                menu.push(this.subFormData)
            } else {
                menu = menu.map((item, index) => {
                    if (index == currentIndex) {
                        item = this.subFormData
                    }
                    return item
                })
            }
            if (this.menuList[this.menuType].length) {
                menu = menu.map((item) => {
                    item.checked = item.checked == undefined ? true : item.checked
                    return item
                })
            }
            this.$set(this.menuList, this.menuType, JSON.parse(JSON.stringify(menu)))
            this.updateFormData()
            this.isValidate = true
        },
        // 拖拽
        draggableChange(type) {
            this.menuType = type
            this.updateFormData()
        },
        // 功能链接配置
        getLinkUrl() {
            this.$LinkBases({
                source: this.sourceInfo.source, // 必填
                type: 'h5', // 必填
                source_id: this.sourceInfo.source_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    this.$nextTick(() => {
                        //链接库动态赋值
                        this.$set(this.subFormData, 'link_url', res.url)
                    })
                },
            })
        },
    },
}
</script>

<style scoped>
.move {
    cursor: move;
}
.homePage >>> .ant-card-head {
    background: #f4f4f4;
}
.headColorItem {
    margin: 0 10px 10px 0;
    width: 30px;
    height: 30px;
    border: 2px solid transparent;
}
.headColorItem.active {
    border: 2px solid #64bcfb;
}
.desc {
    font-size: 14px;
    line-height: 22px;
    color: rgba(150, 151, 153, 1);
}
/* 广告位配置 */
.adverWrap {
    width: 100%;
    min-height: 100px;
}
.emptyAdver {
    width: 360px;
    height: 105px;
    border-radius: 10px;
    box-sizing: border-box;
    border: 1px dashed #d9d9d9;
}
.adverItem {
    position: relative;
    margin-bottom: 20px;
    height: 105px;
    border-radius: 10px;
    box-sizing: border-box;
}
.adverImgWrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 10px;
}
.adverImgWrap img {
    width: 100%;
    height: 100%;
}
.adverItem .closeIcon {
    font-size: 20px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    color: #cccccc;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    background: #ffffff;
    border-radius: 50%;
}
.adverItemImgWrap {
    width: 360px;
    height: 105px;
    line-height: 105px;
    text-align: center;
    border-radius: 10px;
    box-sizing: border-box;
    overflow: hidden;
}
.adverItemImg {
    width: 100%;
    height: 100%;
}
.iconImgWrap {
    position: relative;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    box-sizing: border-box;
}
.iconImgWrap img {
    width: 100%;
    height: 100%;
}

.emptyImg {
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
}

textarea::-webkit-scrollbar {
    width: 5px; /*滚动条宽度*/
    height: 5px; /*滚动条高度*/
}

/*定义滚动条轨道 内阴影+圆角*/
textarea::-webkit-scrollbar-track {
    border-radius: 10px; /*滚动条的背景区域的圆角*/
    background-color: transparent; /*滚动条的背景颜色*/
}

/*定义滑块 内阴影+圆角*/
textarea::-webkit-scrollbar-thumb {
    border-radius: 10px; /*滚动条的圆角*/
    background-color: rgba(0, 0, 0, 0.15); /*滚动条的背景颜色*/
}
.upload-loading >>> .ant-upload-select {
    position: relative;
}
.loading {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
}
</style>
