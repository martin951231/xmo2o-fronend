<template>
    <!-- 主页装修 -->
    <div class="bg-ff homePage">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>
        <div class="content">
            <div class="subTitle">
                {{L('选择一个页面作为X1主页',{X1:sourceInfo.source == 'store'?'店铺':'商家'})}}
            </div>
            <div 
                class="selectPage flex align-center justify-between"
                v-if="formData">
                <span>{{formData.page_title || L('微页面')}}</span>
                <span>
                    <a-button type="link" @click="decorateOpt()">{{L('装修')}}</a-button>
                    <a-button type="link" @click="indexSetOpt()">{{L('更换')}}</a-button>
                </span>
            </div>
            <div v-else class="mt-20">
                <a-button type="primary" @click="tabChangeOpt()">{{L('选择')}}</a-button>
            </div>
        </div>

        <!-- 微页面弹框 -->
        <selectCustomPage ref="selectCustomPage" @getIndexPageOpt="getIndexPageOpt"></selectCustomPage>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import selectCustomPage from '@/views/common/customPage/modules/customPage/selectCustomPage'
import customPageApi from '@/api/common/platform/customPage'

// 主页装修
export default {
    components: {
        componentDesc,
        selectCustomPage
    },
    data() {
        return {
            desc: '',
            descStore:{
                title: '店铺主页设置',
                desc: '主页是用户看到店铺的第一印象，你可以用店铺装修中的组件自由组合，搭建个性化的店铺主页。'
            },
            descMerchant: {
                title: '商家主页设置',
                desc: '主页是用户看到商家的第一印象，你可以用商家装修中的组件自由组合，搭建个性化的商家主页。'
            },
            formData: ''
        }
    },
    computed: {
        // 来源source source_id
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        }
    },
    mounted() {
        if (this.sourceInfo.source == 'store') {
            this.desc = this.descStore
        } else {
            this.desc = this.descMerchant
        }
        this.getIndexPageOpt()
    },
    methods: {
        // 获取主页装修
        getIndexPageOpt(res = '') {
            let params = {
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                from: 2,
                id: res && res.current && res.current.id?res.current.id:''
            }

            this.request(customPageApi.getIndexPage, params).then(res => {
                if (res && JSON.stringify(res) != '[]' && JSON.stringify(res) != '{}') {
                    this.formData = {
                        page_title: res.page_title || '',
                        id: res.id || ''
                    }
                }
            })
        },
        // 装修 携带页面id
        decorateOpt() {
            this.$router.push({
                path: this.$store.state.customPage[`${this.sourceInfo.source}CustomPage`],
                query: {
                    source: this.sourceInfo.source,
                    source_id: this.sourceInfo.source_id,
                    pageId: this.formData.id
                }
            })
            
            this.$store.dispatch('updatePageInfo', '')
            this.$store.dispatch('updateComponentId','customPageIndex')
        },
        // 更换 打开微页面列表
        indexSetOpt() {
            this.$refs.selectCustomPage.openModal({
                id: this.formData.id,
                sourceInfo: this.sourceInfo
            })
        },
        // 选择
        tabChangeOpt() {
            this.$store.dispatch('updateActiveKey','2')
        }
    }
}
</script>

<style scoped>
.content {
    padding: 26px 20px;
}
.subTitle {  
    font-size: 14px;
    font-weight: 400;
    color: #323233;
}
.selectPage {
    margin-top: 20px;
    padding: 0 14px;
    height: 36px;
    background: #EDF4FF;
    border-radius: 4px;
    box-sizing: border-box;
}
.selectPage >>> .ant-btn {
    padding: 0 0 0 14px;
    font-size: 14px;
}
</style>
