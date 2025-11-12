<template>
    <div>
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div v-if="formDataDecorate" class="content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <a-form-model-item :label="L('频道导航样式')" class="form-model">
                    <div class="flex align-center">
                        <span class="ml-20">{{ getLabel(styleTypeOptions, formDataDecorate.style_type) }}</span>
                        <span class="ml-20">{{
                            formDataDecorate.style_type == '1'
                                ? L('建议尺寸X1 X X2px', { X1: 100, X2: 100 })
                                : L('建议尺寸X1 X X2px', { X1: 48, X2: 48 })
                        }}</span>
                    </div>
                </a-form-model-item>
                <div>
                    <a-radio-group
                        v-model="formDataDecorate.style_type"
                        button-style="solid"
                        @change="radioChange($event, 'style_type')"
                    >
                        <a-radio-button v-for="item in styleTypeOptions" :key="item.value" :value="item.value">
                            <IconFont :type="item.icon" />
                        </a-radio-button>
                    </a-radio-group>
                </div>

                <a-form-model-item :label="L('频道展示行数')" class="mt-20 form-model">
                    <div class="flex align-center">
                        <span class="ml-20">{{ getLabel(showColumnOptions, formDataDecorate.show_column) }}</span>
                    </div>
                </a-form-model-item>
                <div>
                    <a-radio-group v-model="formDataDecorate.show_column" button-style="solid">
                        <a-radio-button v-for="item in showColumnOptions" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </a-radio-button>
                    </a-radio-group>
                </div>

                <div class="group-menu-wrap mt-20" v-for="(item, index) in formDataDecorate.list" :key="index">
                    <a-icon type="close-circle" class="delIcon" @click="delOpt(index)" />
                    <div class="flex">
                        <!-- 添加导航图片 -->
                        <div class="uploadImgWrap" @click="chooseImage(item, index)">
                            <div
                                class="pointer img-wrap"
                                v-if="formDataDecorate.list && formDataDecorate.list[index].image"
                            >
                                <img :src="item.image" alt="" style="width: 100%; height: 100%" />
                                <span class="img-update">{{ L('更换图片') }}</span>
                            </div>
                            <div v-else>
                                <div class="flex align-center justify-center flex-column pointer img-wrap">
                                    <a-icon type="plus" />
                                    <span>{{ L('添加图片') }}</span>
                                </div>
                                <span class="cr-red">{{ L('请选择一张图片') }}</span>
                            </div>
                        </div>
                        <!-- 添加导航标题 -->
                        <div class="flex-1 linkUrl">
                            <a-form-model-item
                                :label="L('标题')"
                                :rules="{
                                    required: true,
                                }"
                                :wrapperCol="{
                                    span: 19,
                                }"
                            >
                                <a-input
                                    :placeholder="L('请输入导航标题')"
                                    v-model="item.title"
                                    :maxLength="4"
                                ></a-input>
                            </a-form-model-item>
                            <!-- 添加链接 -->
                            <a-form-model-item
                                :label="L('链接')"
                                :wrapperCol="{
                                    span: 19,
                                }"
                            >
                                <a-dropdown
                                    :getPopupContainer="
                                        (triggerNode) => {
                                            return triggerNode.parentNode
                                        }
                                    "
                                >
                                    <a-menu slot="overlay" @click="handleMenuClick($event, index)">
                                        <template v-for="link_item in linkUrlOptions">
                                            <a-menu-item v-if="link_item.value != '1'" :key="link_item.value">
                                                {{ link_item.label }}
                                            </a-menu-item>
                                            <a-sub-menu v-else :key="link_item.value" :title="link_item.label">
                                                <a-menu-item
                                                    v-for="(subItem, subIndex) in link_item.children"
                                                    :key="subIndex"
                                                    >{{ subItem.label }}</a-menu-item
                                                >
                                            </a-sub-menu>
                                        </template>
                                    </a-menu>
                                    <a-button
                                        class="text-nowrap text-els flex justify-between align-center"
                                        style="width: 242px"
                                    >
                                        <span class="text-nowrap text-els flex-1 text-left"
                                            >{{
                                                item.link_type == '1'
                                                    ? item.link_url_label
                                                        ? item.link_url_label
                                                        : L('跳转页面方式')
                                                    : item.link_url
                                                    ? item.link_url
                                                    : L('跳转页面方式')
                                            }}
                                        </span>
                                        <a-icon type="down" />
                                    </a-button>
                                </a-dropdown>
                            </a-form-model-item>
                        </div>
                    </div>
                    <div>
                        <a-form-model-item
                            :label="L('角标')"
                            :labelCol="{
                                span: 3,
                            }"
                            :wrapperCol="{
                                span: 21,
                            }"
                        >
                            <div class="flex align-center justify-between">
                                <span>{{ item.show_badge == 1 ? L('显示') : L('不显示') }}</span>
                                <a-checkbox
                                    :checked="item.show_badge == 1 ? true : false"
                                    @change="isChange($event, index)"
                                >
                                </a-checkbox>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item label="" v-if="item.show_badge == 1">
                            <a-input style="width: 100px" v-model="item.badge_val" :maxLength="3"></a-input>
                        </a-form-model-item>
                    </div>
                </div>

                <!-- 添加按钮 -->
                <div class="mt-20 mb-20">
                    <a-button block @click="addOpt()"> <a-icon type="plus" />{{ L('添加导航') }}</a-button>
                </div>
            </a-form-model>
        </div>

        <choose-image ref="chooseImage" :max="1" :upload_dir="'/decorate/images'" type="image" @callback="callback" />

        <a-modal
            :title="L('自定义链接')"
            :visible="visible"
            :destroyOnClose="true"
            :width="'60%'"
            :cancelText="L('取消')"
            :okText="L('确定')"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-row type="flex" justify="space-between" class="mb-20">
                <a-col span="4"> {{ L('链接地址') }}： </a-col>
                <a-col span="20">
                    <a-input v-model="inputLinkUrl" :placeholder="L('请输入')"> </a-input>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import ChooseImage from '@/components/ChooseImage/ChooseImage'
import customPageApi from '@/api/common/platform/customPage'
export default {
    components: {
        componentDesc,
        IconFont,
        ChooseImage,
    },
    props: {
        // 表单数据
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            desc: {
                title: '频道导航栏列表',
            },
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
            formDataDecorate: '',
            styleTypeOptions: [
                {
                    value: '1',
                    label: this.L('大图'),
                    icon: 'iconcatCustomPageBigImg',
                },
                {
                    value: '2',
                    label: this.L('小图'),
                    icon: 'iconcatCustomPageSmallImg',
                },
            ],
            showColumnOptions: [
                {
                    value: '1',
                    label: this.L('X1行轮播', { X1: 1 }),
                    icon: 'iconCustomPageStyleType8',
                },
                {
                    value: '2',
                    label: this.L('X1行轮播', { X1: 2 }),
                    icon: 'iconCustomPageStyleType8',
                },
                {
                    value: '3',
                    label: this.L('X1行轮播', { X1: 3 }),
                    icon: 'iconCustomPageStyleType8',
                },
                {
                    value: '4',
                    label: this.L('X1行轮播', { X1: 4 }),
                    icon: 'iconCustomPageStyleType8',
                },
            ],
            currentIndex: -1,
            linkUrlOptions: [
                {
                    value: '1',
                    label: this.L('绑定子分类店铺数据'),
                    children: [],
                },
                {
                    value: '2',
                    label: this.L('功能库链接'),
                },
                {
                    value: '3',
                    label: this.L('自定义链接'),
                },
            ],
            visible: false,
            inputLinkUrl: '',
        }
    },
    watch: {
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo', val)
            },
        },
    },
    mounted() {
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                this.$set(this.formDataDecorate, k, this.formContent[k])
            }
        }
        this.getMerchantCategoryChildList()
    },
    methods: {
        // 获取label
        getLabel(list = [], value = '') {
            let label = ''
            if (list.length) {
                list.forEach((item) => {
                    if (item.value == value) {
                        label = item.label
                    }
                })
            }
            return label
        },
        // 添加
        addOpt() {
            let list = this.formDataDecorate.list || []
            list.push({
                title: this.L('标题X1', { X1: list.length + 1 }),
                link_url: '',
                image: '',
                show_badge: '1',
                badge_val: '',
            })
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 删除
        delOpt(curIndex) {
            let list = this.formDataDecorate.list || []
            if (list.length) {
                list.splice(curIndex, 1)
            }
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 添加导航图片
        chooseImage(curItem, curIndex) {
            this.currentIndex = curIndex
            this.$refs.chooseImage.openDialog()
        },
        // 选取图片后的回调
        callback(info) {
            let list = info.list
            let imageUrl = list.length ? list[0] : ''
            let listFormDataDecorate = this.formDataDecorate.list || []
            let current = listFormDataDecorate[this.currentIndex]
            this.$set(current, 'image', imageUrl)
            this.$set(listFormDataDecorate, this.currentIndex, current)
            this.$set(this.formDataDecorate, 'list', listFormDataDecorate)
        },
        // 角标显隐
        isChange(e, currentIndex) {
            let list = this.formDataDecorate.list || []
            let current = list[currentIndex]
            this.$set(current, 'show_badge', e.target.checked ? '1' : '2')
            // if (!e.target.checked) {
            //     this.$set(current, 'badge_val', '')
            // }
            this.$set(list, currentIndex, current)
            this.$set(this.formDataDecorate, 'list', list)
        },
        // 获得店铺子分类列表
        getMerchantCategoryChildList() {
            let params = {
                cat_id: this.$store.state.customPage.sourceInfo.source_id,
            }

            this.request(customPageApi.getMerchantCategoryChildList, params).then((res) => {
                let children = res.list || []
                if (children.length) {
                    children.forEach((item) => {
                        item.value = item.cat_url
                        item.label = item.cat_name
                    })
                    this.linkUrlOptions.forEach((item) => {
                        if (item.value == '1') {
                            item.children = item.children.concat(children)
                        }
                    })
                }
            })
        },
        // 功能链接配置
        getLinkUrl() {
            this.$LinkBases({
                source: this.$store.state.customPage.sourceInfo.source, // 必填
                type: 'h5', // 必填
                source_id: this.$store.state.customPage.sourceInfo.source_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    this.$nextTick(() => {
                        //链接库动态赋值
                        let list = this.formDataDecorate.list || []
                        let current = list[this.currentIndex]
                        this.$set(current, 'link_url', res.url)
                        this.$set(list, this.currentIndex, current)
                        this.$set(this.formDataDecorate, 'list', list)
                    })
                },
            })
        },
        // 自定义链接确认
        handleOk() {
            let list = this.formDataDecorate.list || []
            let current = list[this.currentIndex]
            console.log('this.currentIndex', this.currentIndex)
            this.$set(current, 'link_url', this.inputLinkUrl)
            this.$set(list, this.currentIndex, current)
            this.$set(this.formDataDecorate, 'list', list)
            this.handleCancel()
        },
        // 自定义链接取消
        handleCancel() {
            this.visible = false
            this.inputLinkUrl = ''
        },
        handleMenuClick(e, index) {
            this.currentIndex = index
            let link_type = e.keyPath[e.keyPath.length - 1]
            let list = this.formDataDecorate.list || []
            let current = list[this.currentIndex]
            if (link_type == '1') {
                let key = e.key
                let link_url_label = `${this.linkUrlOptions[0].label}/${this.linkUrlOptions[0]['children'][key]['label']}`

                let link_url = `${this.linkUrlOptions[0]['children'][key]['value']}`

                this.$set(current, 'link_url', link_url)
                this.$set(current, 'link_url_label', link_url_label)
            } else if (link_type == '2') {
                this.getLinkUrl()
            } else if (link_type == '3') {
                this.visible = true
            }
            this.$set(current, 'link_type', link_type)
            this.$set(list, this.currentIndex, current)
            this.$set(this.formDataDecorate, 'list', list)
        },
        radioChange(e, filed) {
            this.$set(this.formDataDecorate, filed, e.target.value)
        },
    },
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}
.content >>> .form-model.ant-form-item {
    margin-bottom: 0;
}

.content >>> .mt-20.ant-form-item {
    margin-top: 20px;
}
.group-menu-wrap >>> .ant-form-item {
    margin-bottom: 0;
}
.delIcon {
    display: none;
}
.group-menu-wrap {
    padding: 12px 16px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 12px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
}
.delIcon {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
    font-size: 18px;
    cursor: pointer;
    color: #bbb;
    background: #ffffff;
    border-radius: 50%;
    z-index: 2;
}
.group-menu-wrap:hover.group-menu-wrap .delIcon {
    display: block;
}
.add-nav-wrap >>> .ant-form-item {
    margin-bottom: 10px;
}
.img-wrap {
    margin-right: 10px;
    position: relative;
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
}
.img-update {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.4);
}
</style>