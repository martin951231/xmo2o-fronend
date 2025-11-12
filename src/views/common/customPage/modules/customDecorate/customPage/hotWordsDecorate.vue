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
                <div class="ant-form-item-label fs-16 cr-black">
                    {{ L('热搜词列表') }}
                </div>
                <div class="flex align-center justify-between mb-20">
                    <span class="ant-form-explain">{{ L('用于热搜关键词管理') }}</span>
                    <a-button type="primary" @click="setOpt()">{{ L('设置') }}</a-button>
                </div>
                <a-form-model-item :label="L('热搜标题')">
                    <div class="flex align-center justify-between">
                        <span>{{ L('勾选代表展示 热搜 标题') }}</span>
                        <a-checkbox :checked="formDataDecorate.is_show_title == 1 ? true : false" @change="isChange">
                        </a-checkbox>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>
        <a-modal
            :title="L('热搜词列表')"
            :visible="visible"
            :destroyOnClose="true"
            :width="'60%'"
            :cancelText="L('取消')"
            :okText="L('确定')"
            :bodyStyle="{
                maxHeight: '700px',
                overflowY: 'auto'
            }"
            @ok="getOpt"
            @cancel="visible = false"
        >
        <HotWordsList :sourceInfo="sourceInfo"></HotWordsList>
        </a-modal>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import customPageApi from '@/api/common/platform/customPage'
import HotWordsList from '@/views/common/platform/hotwords/HotWordsList'
export default {
    components: {
        componentDesc,
        HotWordsList
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
                title: '热搜关键词',
                desc: '设置推荐热搜关键词后，对应热搜词即可展示在频道页头部',
            },
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
            formDataDecorate: '',
            visible: false,
        }
    },
    watch: {
        formContent: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.formDataDecorate = {}
                    for (let k in newVal) {
                        this.$set(this.formDataDecorate, k, newVal[k])
                    }
                } else {
                    this.formDataDecorate = ''
                }
            },
        },
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
        isChange(e) {
            this.$set(this.formDataDecorate, 'is_show_title', e.target.checked ? '1' : '2')
        },
        // 获得热搜词列表
        getOpt() {
            let params = {
                source: this.sourceInfo.source || '',
                source_id: this.sourceInfo.source_id || '',
            }
            this.request(customPageApi.getSearchHotList, params).then((res) => {
                this.$set(this.formDataDecorate, 'list', res.list || [])
                this.visible = false
            })
        },
        // 设置
        setOpt() {
            this.visible = true
        }
    },
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}
</style>