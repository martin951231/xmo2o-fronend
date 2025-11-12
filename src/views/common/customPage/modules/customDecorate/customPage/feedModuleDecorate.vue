<template>
    <div>
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div v-if="formDataDecorate" class="content">
            <div class="flex justify-between align-center">
                <div class="flex flex-column">
                    <span class="fs-16 cr-black">
                        {{ L('分类导航列表') }}
                    </span>
                    <span class="cr-66">
                        {{ L('管理频道分类列表信息') }}
                    </span>
                </div>
                <div>
                    <a-button type="primary" @click="setOpt()">设置</a-button>
                </div>
            </div>
        </div>
        <div v-if="visibleModal">
            <diypageFeedCategory
                :cat_id="cat_id"
                @handleOk="handleOk"
                @handleCancel="visibleModal = false"
            ></diypageFeedCategory>
        </div>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import customPageApi from '@/api/common/platform/customPage'
import diypageFeedCategory from '@/views/common/platform/diypageFeed/DiypageFeedCategory'
export default {
    components: {
        componentDesc,
        diypageFeedCategory,
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
                title: '店铺feed流配置',
                desc: '店铺流列表模块为分类页面为固定模块',
            },
            formDataDecorate: '',
            cat_id: '0',
            visibleModal: false,
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
        // 获得feed流导航分类列表
        getOpt() {
            let params = {
                cat_id: this.cat_id,
            }
            this.request(customPageApi.getFeedCategoryList, params).then((res) => {
                this.$set(this.formDataDecorate, 'list', res.list || [])
                this.visibleModal = false
            })
        },
        // 设置
        setOpt() {
            this.cat_id = this.sourceInfo.source_id || '0'
            this.visibleModal = true
        },
        handleOk() {
            this.visibleModal = false
            this.getOpt()
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
</style>