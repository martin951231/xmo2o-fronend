<template>
    <div class="enter-store-wrap flex justify-between align-center bg-ff">
        <div class="flex align-center store-name no-wrap">
            <img class="store-name-img" src="@/assets/customPage/enterStoreIcon.png" alt="" />
            <span class="flex-1 no-wrap">{{ storeName || L('小猪O2O店铺') }}</span>
        </div>
        <div class="flex align-center store-enter no-wrap flex-1 justify-end">
            <span class="flex-1 no-wrap text-right">{{ content.txt }}</span>
            <a-icon class="store-enter-icon" type="right" />
        </div>
    </div>
</template>

<script>
import customPageApi from '@/api/common/platform/customPage'
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            source: this.$route.query.source || '',
            storeName: '',
        }
    },
    computed: {
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
    },
    mounted() {
        // 如果来源是店铺时，默认定位到当前店铺地址
        if (this.source && this.source == 'store') {
            this.getStoreInfo()
        }
    },
    methods: {
        // 获取店铺信息
        getStoreInfo() {
            let params = {
                source_id: this.sourceInfo.source_id,
            }
            this.request(customPageApi.getMerchantStoreMsg, params).then((res) => {
                this.storeName = res.store.name || ''
            })
        },
    },
}
</script>

<style scoped>
.enter-store-wrap {
    padding: 0 8px;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
}
.store-name {
    padding-right: 6px;
    width: 70%;
    color: #000000;
}
.store-name-img {
    margin: 0 6px 0 12px;
}
.store-enter {
    color: #969799;
}
.store-enter-icon {
    margin-left: 10px;
    font-size: 7px;
}
</style>