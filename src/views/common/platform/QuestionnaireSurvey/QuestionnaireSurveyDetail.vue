<template>
    <div class="frame-box">
        <!-- 头部区域 -->
        <div class="header flex justify-between align-center">
            <div class="left flex-1 flex align-center">
                <div class="back flex justify-center align-center" @click="$router.go(-1)">
                    <a-icon type="left" />
                </div>
                <span class="ml-20">{{formData.title || ''}}</span>
            </div>
            <div class="center">
                <a-tabs v-model="activeKey" @change="tabsCallback" v-if="actionType != 'signup'">
                    <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.tab"></a-tab-pane>
                </a-tabs>
            </div>
            <div class="right flex-1 flex" style="justify-content: end;margin-bottom: 15px">
                <a-button @click="viewClick">
                    <a-icon type="eye" />
                    {{L('预览')}}
                </a-button>
                <template v-if="formData.status == 2 || !id">
                    <a-button class="ml-10" type="primary" @click="submit" :disabled="formData.questions.length == 0">
                        <a-icon type="save" />
                        {{L('保存草稿箱')}}
                    </a-button>
                    <a-button class="ml-10" type="primary" @click="saveClick" :disabled="formData.questions.length == 0">
                        <IconFont type="iconfabu" />
                        {{L('发布')}}
                    </a-button>
                </template>
            </div>
        </div>
        <!-- 内容区域 -->
        <div class="content flex-1">
            <CustomDraggableForm ref="customDraggableForm" v-show="activeKey == 1" @changeFormEvent="changeFormEvent" :actionType="actionType"/>
            <CustomDraggableFormStting ref="customDraggableFormStting" v-show="activeKey == 2 && actionType != 'signup'" />
            <CustomDraggableFormStatistics ref="customDraggableFormStatistics" :form_id="id" :tokenName="tokenName" v-show="activeKey == 3 && actionType != 'signup'" />
        </div>
        <div class="loading-box" :class="{'show': spinLoading}">
            <div class="mb-20 fs-18">{{loadingTip}}</div>
            <a-spin>
                <a-icon slot="indicator" type="loading" style="font-size: 40px" spin />
            </a-spin>
        </div>
    </div>
</template>

<script>
import IconFont from '@/utils/icon'
import CustomDraggableForm from './components/CustomDraggableForm/index'
import CustomDraggableFormStting from './components/CustomDraggableFormStting/CustomDraggableFormStting'
import CustomDraggableFormStatistics from './components/CustomDraggableFormStatistics/CustomDraggableFormStatistics'
import questionnaireSurveyApi from '@/api/common/platform/questionnaireSurvey'
import { getSystemName } from '@/utils/util'
export default {
    components: { IconFont, CustomDraggableForm, CustomDraggableFormStting, CustomDraggableFormStatistics },
    data() {
        return {
            id: 0,
            back: 0,
            tabList: [
                {
                    key: 1,
                    tab: this.L('设计问卷'),
                },
                {
                    key: 2,
                    tab: this.L('问卷设置'),
                },
                {
                    key: 3,
                    tab: this.L('数据统计'),
                },
            ],
            activeKey: 1,
            formData: {
                questions: [],
            },
            loadingTip: this.L('加载中...'),
            spinLoading: false,
            tokenName: '',
            actionType: '',
        }
    },
    created() {
        this.id = this.$route.query.id
        this.back = this.$route.query.back
        this.activeKey = this.$route.query.tabValue || 1
        this.activeKey = this.activeKey * 1
        this.actionType = this.$route.query.actionType || ''
        if(this.actionType == 'signup'){
            document.title = this.L('报名表单详情')
        }
        let sysName = getSystemName(location.hash);
        this.tokenName = sysName;
        if (this.id) {
            this.getSurveyDetail()
        } else {
            this.tabList = [
                {
                    key: 1,
                    tab: this.L('设计问卷'),
                },
                {
                    key: 2,
                    tab: this.L('问卷设置'),
                },
            ]
        }
    },
    methods: {
        getSurveyDetail() {
            this.spinLoading = true
            this.request(questionnaireSurveyApi.getSurveyDetail, {
                form_id: this.id,
                tokenName: this.tokenName + '_access_token',
            })
                .then((res) => {
                    this.spinLoading = false
                    this.formData = {
                        ...res,
                        formHeaderImage: res.theme_config.formHeaderImage,
                        footerContent: res.theme_config.footerContent,
                    }
                    this.formData.questions = this.formData.questions.map((item) => {
                        if (item.type == 'radio') {
                            item.value = ''
                        }
                        if (item.type == 'checkbox') {
                            item.value = []
                        }
                        return item
                    })
                    this.$refs.customDraggableForm?.setFormData(this.formData)
                    this.$refs.customDraggableFormStting?.setFormData(this.formData)
                    this.$refs.customDraggableFormStatistics?.setFormData(this.formData)
                })
                .catch((err) => {
                    this.loading = false
                })
        },
        tabsCallback() {},
        //预览
        viewClick() {
            this.$refs.customDraggableForm?.showViewComponent(true)
        },
        changeFormEvent(data) {
            this.formData = data
        },
        getParams(status = 2) {
            let formData = this.$refs.customDraggableForm?.getFormData()
            let formDataStting = this.$refs.customDraggableFormStting?.getFormData()
            this.formData = {
                ...formData,
                theme_config: {
                    formHeaderImage: formData.formHeaderImage,
                    footerContent: formData.footerContent,
                },
                status,
                ...formDataStting,
                form_id: this.id,
                tokenName: this.tokenName + '_access_token',
                type: this.actionType,
            }
            return this.formData
        },
        //保存为草稿箱
        submit() {
            this.request(questionnaireSurveyApi.saveSurvey, this.getParams()).then((res) => {
                this.$message.success(this.L('保存成功'))
                setTimeout(() => {
                    this.$router.go(-1)
                }, 300)
            })
        },
        //发布
        saveClick() {
            this.request(questionnaireSurveyApi.saveSurvey, this.getParams(1)).then((res) => {
                this.$message.success(this.L('发布成功'))
                setTimeout(() => {
                    this.$router.go(-1)
                }, 300)
            })
        },
    },
}
</script>

<style lang="less" scoped>
@main-border-radius: 8px;
.frame-box {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .header {
        background-color: #fff;
        padding: 15px 20px 0 20px;
        box-shadow: 0 2px 4px rgba(49, 70, 102, 0.1);
        position: sticky;
        top: 0;
        z-index: 10;
        .left {
            margin-bottom: 15px;
            .back {
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                color: #000;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                transition: all 0.15s;
                &:hover {
                    background-color: #ebf3ff;
                    color: #0d55ff;
                }
            }
        }
    }
    .content {
        overflow: hidden;
        overflow-y: auto;
        /* 让滚动条更细、颜色更突出 */
        ::-webkit-scrollbar {
            width: 4px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            // background: #f0f0f0;
        }
        ::-webkit-scrollbar-thumb {
            background: #cccccc;
            border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #83888f;
        }
    }
}
::v-deep .ant-tabs {
    .ant-tabs-bar {
        border: none;
        margin-bottom: 0;
    }
    .ant-tabs-ink-bar {
        height: 3px;
    }
}
textarea,
.ant-input,
.ant-btn {
    border-radius: @main-border-radius;
}
.loading-box {
    position: fixed;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #314666;
    transition: all 0.35s;
    opacity: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -99;
    &.show {
        opacity: 1;
        z-index: 9999;
    }
}
</style>