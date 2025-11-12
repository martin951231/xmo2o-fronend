<template>
    <div>
        <!-- :key="customIndex" -->
        <component
            v-if="component && formContent"
            :is="component"
            :formContent="formContent"
            :type="componentId"
            @updatePageInfo="updatePageInfo"
        ></component>
    </div>
</template>

<script>
import enterStoreDecorate from '@/views/common/customPage/modules/customDecorate/customPage/enterStoreDecorate'
import couponDecorate from '@/views/common/customPage/modules/customDecorate/customPage/couponDecorate'
import marketingActivitiesDecorate from '@/views/common/customPage/modules/customDecorate/customPage/marketingActivitiesDecorate'
import mallActivitiesDecorate from '@/views/common/customPage/modules/customDecorate/customPage/mallActivitiesDecorate'
import mallGoodsSearchDecorate from '@/views/common/customPage/modules/customDecorate/customPage/mallGoodsSearchDecorate'
import magicSquareDecorate from '@/views/common/customPage/modules/customDecorate/customPage/magicSquareDecorate'
import mallGoodsDecorate from '@/views/common/customPage/modules/customDecorate/customPage/mallGoodsDecorate'
import shopModulesDecorate from '@/views/common/customPage/modules/customDecorate/customPage/shopModulesDecorate'
import titleTextDecorate from '@/views/common/customPage/modules/customDecorate/customPage/titleTextDecorate'
import richTextDecorate from '@/views/common/customPage/modules/customDecorate/customPage/richTextDecorate'
import textNavDecorate from '@/views/common/customPage/modules/customDecorate/customPage/textNavDecorate'
import helpLineDecorate from '@/views/common/customPage/modules/customDecorate/customPage/helpLineDecorate'
import helpBlankDecorate from '@/views/common/customPage/modules/customDecorate/customPage/helpBlankDecorate'
import imgAdverDecorate from '@/views/common/customPage/modules/customDecorate/customPage/imgAdverDecorate'
import picNavDecorate from '@/views/common/customPage/modules/customDecorate/customPage/picNavDecorate'
import customVideoDecorate from '@/views/common/customPage/modules/customDecorate/customPage/customVideoDecorate'
import customModuleDecorate from '@/views/common/customPage/modules/customDecorate/customPage/customModuleDecorate'
import onlineServiceDecorate from '@/views/common/customPage/modules/customDecorate/customPage/onlineServiceDecorate'
import noticeDecorate from '@/views/common/customPage/modules/customDecorate/customPage/noticeDecorate'
import contactStoreDecorate from '@/views/common/customPage/modules/customDecorate/customPage/contactStoreDecorate'
import storeMapDecorate from '@/views/common/customPage/modules/customDecorate/customPage/storeMapDecorate'
import storeHeaderDecorate from '@/views/common/customPage/modules/customDecorate/customPage/storeHeaderDecorate'
import categoryHeaderDecorate from '@/views/common/customPage/modules/customDecorate/customPage/categoryHeaderDecorate'
import hotWordsDecorate from '@/views/common/customPage/modules/customDecorate/customPage/hotWordsDecorate'
import swiperNavDecorate from '@/views/common/customPage/modules/customDecorate/customPage/swiperNavDecorate'
import porcelainAreaDecorate from '@/views/common/customPage/modules/customDecorate/customPage/porcelainAreaDecorate'
import swiperPicDecorate from '@/views/common/customPage/modules/customDecorate/customPage/swiperPicDecorate'
import feedModuleDecorate from '@/views/common/customPage/modules/customDecorate/customPage/feedModuleDecorate'
import freeModuleDecorate from '@/views/common/customPage/modules/customDecorate/customPage/freeModuleDecorate'
import appointGoodsSearchDecorate from '@/views/common/customPage/modules/customDecorate/customPage/appointGoodsSearchDecorate.vue'
import appointGoodsDecorate from '@/views/common/customPage/modules/customDecorate/customPage/appointGoodsDecorate.vue'
// 装修组件
const components = {
    enterStore: enterStoreDecorate,
    coupon: couponDecorate,
    marketingActivities: marketingActivitiesDecorate,
    mallLimited: mallActivitiesDecorate,
    mallBargain: mallActivitiesDecorate,
    mallGroup: mallActivitiesDecorate,
    mallPeriod: mallActivitiesDecorate,
    mallGoodsSearch: mallGoodsSearchDecorate,
    shopGoodsSearch: mallGoodsSearchDecorate,
    magicSquare: magicSquareDecorate,
    mallGoods: mallGoodsDecorate,
    shopModules: shopModulesDecorate,
    shopGoods: mallGoodsDecorate,
    titleText: titleTextDecorate,
    richText: richTextDecorate,
    textNav: textNavDecorate,
    helpLine: helpLineDecorate,
    helpBlank: helpBlankDecorate,
    imgAdver: imgAdverDecorate,
    picNav: picNavDecorate,
    customVideo: customVideoDecorate,
    customModule: customModuleDecorate,
    onlineService: onlineServiceDecorate,
    notice: noticeDecorate,
    contactStore: contactStoreDecorate,
    storeMap: storeMapDecorate,
    storeHeader: storeHeaderDecorate,
    categoryHeader: categoryHeaderDecorate,
    hotWords: hotWordsDecorate,
    swiperNav: swiperNavDecorate,
    porcelainArea: porcelainAreaDecorate,
    swiperPic: swiperPicDecorate,
    feedModule: feedModuleDecorate,
    freeModule: freeModuleDecorate,
    appointGoodsSearch: appointGoodsSearchDecorate,
    appointGoods: appointGoodsDecorate
}
export default {
    data() {
        return {
            component: '',
            formContent: '',
        }
    },
    computed: {
        componentId() {
            this.component = components[this.$store.state.customPage.componentId] || ''
            return this.$store.state.customPage.componentId
        },
        pageInfo() {
            return this.$store.state.customPage.pageInfo
        },
        customIndex() {
            return this.$store.state.customPage.customIndex
        },
        subCustomIndex() {
            return this.$store.state.customPage.subCustomIndex
        },
    },
    watch: {
        // 监听组件id,切换组件
        componentId: {
            deep: true,
            handler(val) {
                // console.log(val,'val')
                this.component = components[val] || ''
            },
        },
        customIndex: {
            deep: true,
            handler(newVal, oldVal) {
                this.getCustomInfo()
            },
        },
        subCustomIndex: {
            deep: true,
            handler(newVal, oldVal) {
                this.getCustomInfo()
            },
        },
        pageInfo: {
            immediate: true,
            handler(newVal, oldVal) {
                if (!this.formContent) {
                    this.getCustomInfo()
                }
            },
        },
    },
    mounted() {
        this.getCustomInfo()
    },
    methods: {
        // 获取当前选中组件的字段信息
        getCustomInfo() {
            let customIndex = this.customIndex
            let pageInfo = this.pageInfo
            if (pageInfo) {
                let custom = pageInfo.custom ? JSON.parse(JSON.stringify(pageInfo.custom)) : []
                if (custom.length && customIndex != -1) {
                    this.formContent = ''
                    this.$nextTick(() => {
                        let content =
                            custom[customIndex] && custom[customIndex].content
                                ? JSON.parse(JSON.stringify(custom[customIndex].content))
                                : ''

                        if (this.subCustomIndex != -1 && content && content.list && content.list.length) {
                            content = content.list[this.subCustomIndex].content
                        }
                        // console.log('content', content)
                        if (content && JSON.stringify(content) != '{}' && JSON.stringify(content) != '[]') {
                            this.formContent = {}
                            for (let k in content) {
                                this.$set(this.formContent, k, content[k])
                            }
                            this.$forceUpdate()
                        } else {
                            if (JSON.stringify(content) == '{}' || JSON.stringify(content) == '[]') {
                                this.formContent = content
                            } else {
                                this.formContent = ''
                            }
                        }
                    })
                } else {
                    this.formContent = ''
                }
            } else {
                this.formContent = ''
            }

            // console.log(this.formContent,'this.formContent')
        },
        // 更新页面信息
        updatePageInfo(res) {
            if (this.pageInfo) {
                let pageInfo = this.pageInfo
                let custom = pageInfo.custom ? JSON.parse(JSON.stringify(pageInfo.custom)) : []
                let { customIndex = -1, subCustomIndex = -1 } = this.$store.state.customPage
                if (custom.length && customIndex != -1) {
                    custom = custom.map((item, index) => {
                        if (item.type == 'freeModule' && index == customIndex && subCustomIndex != -1) {
                            item.content.list[subCustomIndex]['content'] = res ? JSON.parse(JSON.stringify(res)) : ''
                        } else {
                            if (index == customIndex) {
                                item.content = res ? JSON.parse(JSON.stringify(res)) : ''
                            }
                        }

                        return item
                    })
                    this.$set(pageInfo, 'custom', custom)
                    this.$store.dispatch('updatePageInfo', pageInfo)
                }
            }
        },
    },
}
</script>

<style scoped></style>
