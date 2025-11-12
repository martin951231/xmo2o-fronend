<template>
    <div v-if="formDataDecorate">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div class="content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <div class="fs-16 fw-bold">{{ L('添加瓷片') }}</div>
                <div class="group-menu-wrap mt-20" v-for="(item, index) in formDataDecorate.list" :key="index">
                    <a-icon
                        type="close-circle"
                        v-show="formDataDecorate.list.length > 2"
                        class="delIcon"
                        @click="delOpt(index)"
                    />
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
                            >
                                <a-input :placeholder="L('请输入标题')" v-model="item.title"></a-input>
                            </a-form-model-item>
                            <a-form-model-item :label="L('副标题')">
                                <a-input :placeholder="L('请输入副标题')" v-model="item.sub_title"></a-input>
                            </a-form-model-item>
                        </div>
                    </div>
                    <!-- 添加链接 -->
                    <div class="mt-20">
                        <!-- 添加链接 -->
                        <a-form-model-item :label="L('链接')">
                            <div class="flex">
                                <a-input
                                    v-model="item.link_url"
                                    type="textarea"
                                    autoSize
                                    style="resize: none"
                                ></a-input>
                                <a-button class="ml-5" @click="getLinkUrl(item, index)">{{ L('链接库选择') }}</a-button>
                            </div>
                        </a-form-model-item>
                    </div>
                    <div>
                        <a-form-model-item
                            :label="L('角标')"
                            :labelCol="{
                                span: 3,
                            }"
                            :wrapperCol="{
                                span: 21
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
                            <a-input style="width: 100px" v-model="item.badge_val"></a-input>
                        </a-form-model-item>
                    </div>
                </div>
                <!-- 添加按钮 -->
                <div class="mt-20 mb-20" v-if="formDataDecorate.list.length < 5">
                    <a-button block @click="addOpt()"> <a-icon type="plus" />{{ L('添加瓷片区') }}</a-button>
                </div>
                <a-form-model-item :label="L('瓷片样式')">
                    <div class="flex align-center justify-between">
                        <span>{{ getLabel(styleTypeOptions, formDataDecorate.style_type) }}</span>
                        <div>
                            <a-radio-group
                                v-model="formDataDecorate.style_type"
                                button-style="solid"
                                @change="radioChange($event, 'style_type')"
                            >
                                <a-radio-button v-for="item in styleTypeOptions" :key="item.value" :value="item.value">
                                    <IconFont :type="item.icon" class="itemIcon" />
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>

        <choose-image ref="chooseImage" :max="1" :upload_dir="'/decorate/images'" type="image" @callback="callback" />
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import ChooseImage from '@/components/ChooseImage/ChooseImage'
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
                title: '瓷片区',
                desc: '最少需添加2个，最多可添加至5个瓷片区',
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
            styleTypeOptions: [
                {
                    value: '1',
                    label: this.L('投影'),
                    icon: 'iconcatCustomPageShadow',
                },
                {
                    value: '2',
                    label: this.L('描边'),
                    icon: 'iconcatCustomPageBorder',
                },
            ],
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
    computed: {
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
    },
    mounted() {
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                this.$set(this.formDataDecorate, k, this.formContent[k])
            }
        }
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
            if (list.length == 5) {
                this.$message.error(this.L('最多添加至5个瓷片区'))
                return
            }
            list.push({
                title: '',
                sub_title: '',
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
            console.log('curIndex', curIndex)
            console.log('list', list)
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
        // 功能链接配置
        getLinkUrl(currentItem, currentIndex) {
            this.$LinkBases({
                source: this.$store.state.customPage.sourceInfo.source, // 必填
                type: 'h5', // 必填
                source_id: this.$store.state.customPage.sourceInfo.source_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    this.$nextTick(() => {
                        //链接库动态赋值
                        let list = this.formDataDecorate.list || []
                        let current = list[currentIndex]
                        this.$set(current, 'link_url', res.url)
                        this.$set(list, currentIndex, current)
                        this.$set(this.formDataDecorate, 'list', list)
                    })
                },
            })
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