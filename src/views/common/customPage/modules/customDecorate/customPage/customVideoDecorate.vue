<template>
    <div v-if="formDataDecorate" class="mallGoodsDecorateWrap">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>
        <div>
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <div class="content mt-20">
                    <!-- 视频 -->
                    <a-form-model-item :label="L('视频')">
                        <a-row>
                            <a-col class="text-right">
                                <a-radio-group
                                    v-model="formDataDecorate.video_type_val"
                                    :defaultValue="1"
                                    @change="switchVideoTab($event)"
                                >
                                    <a-radio value="1">{{ L('选择视频') }}</a-radio>
                                    <a-radio value="2">{{ L('粘贴视频地址') }}</a-radio>
                                </a-radio-group>
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                    <!-- 添加视频按钮 -->
                    <div class="add-video-rap mb-20">
                        <div v-if="formDataDecorate.video_type_val == '1'" class="flex flex-wrap">
                            <div>
                                <div class="mb-20 mt-10 fs-14">
                                    {{ L('建议视频宽高比16:9，大小10MB以内') }}
                                </div>
                                <div
                                    class="
                                        add-video-btn add-video-over
                                        flex
                                        justify-center
                                        align-center
                                        pointer
                                        cr-primary
                                    "
                                    v-if="formDataDecorate.choose_video_list && formDataDecorate.choose_video_list[1]"
                                    style="position: relative"
                                >
                                    <img :src="formDataDecorate.choose_video_list[1]" alt="" />
                                    <a-icon
                                        type="close-circle"
                                        class="delIcon"
                                        key="close-circle"
                                        @click="delCurVideo"
                                    />
                                    <a-icon type="play-circle" key="play-circle" class="playCircleIcon" />
                                </div>

                                <div v-else>
                                    <div
                                        class="add-video-btn flex justify-center align-center pointer cr-primary"
                                        @click="addVideo"
                                    >
                                        <a-icon type="plus" />
                                    </div>

                                    <div class="cr-red mt-10">
                                        {{ L('请添加视频') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 粘贴视频地址 -->
                        <div v-else>
                            <div class="mt-10">
                                <a-input
                                    :placeholder="L('请填写视频地址')"
                                    v-model="formDataDecorate.paste_video_url"
                                ></a-input>
                                <div class="cr-red mt-10" v-show="!formDataDecorate.paste_video_url">
                                    {{ L('请填写视频地址') }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 视频 end -->

                    <!-- 封面图 -->
                    <a-form-model-item :label="L('封面图')">
                        <!-- 选择粘贴视频时不显示 -->
                        <a-row v-if="formDataDecorate.video_type_val == '1'">
                            <a-col class="text-right">
                                <a-radio-group
                                    v-model="formDataDecorate.surface_type_val"
                                    @change="switchSurfaceTab($event)"
                                >
                                    <a-radio value="1">{{ L('原视频封面图') }}</a-radio>
                                    <a-radio value="2">{{ L('自定义封面图') }}</a-radio>
                                </a-radio-group>
                            </a-col>
                        </a-row>
                    </a-form-model-item>

                    <!-- 添加封面图按钮 -->
                    <div
                        class="add-video-rap mb-20"
                        v-if="formDataDecorate.surface_type_val == '2' || formDataDecorate.video_type_val == '2'"
                    >
                        <div class="flex flex-wrap">
                            <div @click="addSurface">
                                <div class="mb-20 mt-10 fs-14">
                                    {{ L('建议图片宽高比16:9') }}
                                </div>
                                <div
                                    class="add-video-btn flex justify-center align-center pointer cr-primary"
                                    v-if="
                                        formDataDecorate.choose_surface_list && formDataDecorate.choose_surface_list[0]
                                    "
                                    style="position: relative"
                                >
                                    <img :src="formDataDecorate.choose_surface_list[0]" alt="" />
                                    <div>
                                        <span class="img-update">{{ L('更换图片') }}</span>
                                    </div>
                                </div>

                                <div v-else>
                                    <div class="add-video-btn flex justify-center align-center pointer cr-primary">
                                        <a-icon type="plus" />
                                    </div>

                                    <div class="cr-red mt-10">
                                        {{ L('请添加封面') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 封面图 end -->
                </div>
            </a-form-model>
        </div>
        <!-- 选择添加视频 组件-->
        <template>
            <choose-image
                ref="addVideo"
                :max="1"
                :upload_dir="'/decorate/videos'"
                type="video"
                @callback="uploadVideoCallback"
            />
        </template>
        <!-- 选择添加视频封面图 组件 -->
        <template>
            <choose-image
                ref="addSurface"
                :max="1"
                :upload_dir="'/decorate/images'"
                type="image"
                @callback="uploadSurfaceCallback"
            />
        </template>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import ChooseImage from '@/components/ChooseImage/ChooseImage'
import IconFont from '@/utils/icon'
export default {
    components: {
        componentDesc,
        IconFont,
        ChooseImage,
    },
    props: {
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            desc: {
                title: this.L('视频'),
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
        }
    },
    computed: {},
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
    },
    methods: {
        // 点击添加视频图标 添加视频弹窗
        addVideo() {
            this.$refs.addVideo.openDialog()
        },
        // 选取视频成功后的回调
        uploadVideoCallback(info) {
            let chooseVideoList = info.list
            this.$set(this.formDataDecorate, 'choose_video_list', chooseVideoList)
        },
        // 切换选择视频 粘贴视频地址
        switchVideoTab(e) {
            this.$set(this.formDataDecorate, 'video_type_val', e.target.value)
            this.formDataDecorate.surface_type_val = '2'
        },

        // 删除装修页面已选择的视频
        delCurVideo() {
            this.formDataDecorate.choose_video_list = null
        },
        // 切换原视频封面-自定义封面
        switchSurfaceTab(e) {
            this.$set(this.formDataDecorate, 'surface_type_val', e.target.value)
        },
        // 点击添加视频封面图标 添加视频封面弹窗
        addSurface() {
            this.$refs.addSurface.openDialog()
        },
        // 选取封面成功后的回调
        uploadSurfaceCallback(info) {
            let chooseSurfaceList = info.list
            this.$set(this.formDataDecorate, 'choose_surface_list', chooseSurfaceList)
        },
    },
}
</script>

<style scoped>
.content {
    padding: 0 24px;
    width: 100%;
    box-sizing: border-box;
}
.padding-24 {
    padding: 24px;
}
.add-video-rap {
    padding: 10px;
    background: #f7f8fa;
}
.add-video-btn {
    margin: 0 10px 10px 0;
    width: 60px;
    height: 60px;
    box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
    background: #ffffff;
}
.add-video-btn img {
    width: 90%;
    height: 90%;
}
.delIcon {
    display: none;
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
.add-video-over:hover.add-video-over .delIcon {
    display: block;
}
.playCircleIcon {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    font-size: 24px;
    transform: translate(18px, 18px);
    color: #ffffff;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    z-index: 2;
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
    margin: 0 3px;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.4);
}
.content >>> .ant-form-item {
    margin-bottom: 10px;
}
</style>
