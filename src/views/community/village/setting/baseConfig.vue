<template>
    <div class="base_config">
        <a-tabs :default-active-key="currentIndex" :tab-position="mode" @change="callback">
            <a-tab-pane v-for="(tabItem, index) in tabList" :key="index" :tab="`${tabItem.title}`">
                <component v-if="currentIndex == index" :is="tabItem.id"></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import basiceSet from "@/views/community/components/villageConfig/basiceSet";
    import functionSet from "@/views/community/components/villageConfig/functionSet";
    import bindWx from "@/views/community/components/villageConfig/bindWx";
    import orderReviewSet from "@/views/community/components/villageConfig/orderReviewSet";
    import uploadImgSet from "@/views/community/components/villageConfig/uploadImgSet";
    import accessControlSet from "@/views/community/components/villageConfig/accessControlSet";
    import villageInfoSet from "@/views/community/components/villageConfig/villageInfoSet";
    import {
        ref,
        reactive
    } from '@vue/composition-api';
    import store from "@/store";
    export default {
        name: "baseConfig",
        components: {
            basiceSet,
            functionSet,
            bindWx,
            orderReviewSet,
            uploadImgSet,
            accessControlSet,
            villageInfoSet
        },
        setup() {
            const mode = ref('left')
            let currentIndex = ref(1)
            const tabList = ref([{
                    id: "villageInfoSet",
                    title: store.getters.config.house_name+"建筑信息",
                    status: true
                },
                {
                    id: "basiceSet",
                    title: store.getters.config.house_name+"基础信息",
                    status: true
                },
                {
                    id: "functionSet",
                    title: store.getters.config.house_name+"功能配置",
                    status: true
                },
                {
                    id: "bindWx",
                    title: "绑定微信号",
                    status: true
                },
                {
                    id: "accessControlSet",
                    title: "智能门禁配置",
                    status: true
                },
                {
                    id: "uploadImgSet",
                    title: "上传图片配置",
                    status: true
                },
                {
                    id: "orderReviewSet",
                    title: "订单退款(作废)审核设置",
                    status: true
                },
            ])

            const callback = (val) => {
                currentIndex.value = val
            };

            return {
                mode,
                tabList,
                callback,
                currentIndex
            }
        }
    }
</script>
<style lang="less" scoped>
    .base_config {
        width: 100%;
        margin-top: 10px;
        padding: 20px 0;
        background-color: #fff;
    }
</style>
