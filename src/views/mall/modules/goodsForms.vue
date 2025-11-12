<template>
    <div v-if="hasFormsGoodsList.length" class="mt-20">
        <h2 class="fs-18 mb-10">{{L('留言信息')}}</h2>
        <div class="mt-10" v-for="(item, index) in hasFormsGoodsList" :key="item.goods_id">
            <div class="fs-14 fw-bold cr-black text-wrap">{{index + 1}}.{{item.goods_name}}</div>
            <div>
                <div v-for="(formItem, formIndex) in item.forms" :key="formIndex" class="flex justify-between">
                    <span class="text-nowrap">{{formItem.title}}：</span>
                    <div class="flex-1 text-wrap">
                        <span v-if="formItem.type == 'text'" class="text-wrap">{{ formItem.val }}</span>
                        <BeautifulImage v-if="formItem.type == 'image' && formItem.val" :src="formItem.val" width="50px" height="50px" :visible="true"></BeautifulImage>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage.vue'
export default {
    props: {
        orderInfo: {
            type: Object,
            default: () => {
                return {}
            },
        },
    },
    components: {
        BeautifulImage
    },
    data() {
        return {}
    },
    computed: {
        hasFormsGoodsList() {
            if (!this.orderInfo) return []
            const { children = [] } = this.orderInfo
            if (!children.length) return []
            let hasFormsChildren = children.filter((item) => item.forms)
            if (!hasFormsChildren.length) return []
            hasFormsChildren = hasFormsChildren.map((item) => {
                item.forms = JSON.parse(item.forms)
                return item
            })
            return hasFormsChildren
        },
    },
}
</script>

<style scoped></style>
