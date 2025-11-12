<template>
  <div class="page mt-20 ml-10 mr-10 mb-20">
    <a-page-header
        class="page-header"
        title="分类列表"
    />
    <groupCategoryTableList 
        :refresh="refresh"
        :cat_id="cat_id"
        :type="'category'"></groupCategoryTableList>
  </div>
</template>

<script>
import GroupPlatformApi from '@/api/group/platform'
import groupCategoryTableList from '../modules/GroupCategoryTableList.vue'
export default {
    components: { groupCategoryTableList },
    data() {
        return {
            cat_id: 0, // 0：主分类列表 其它：子分类列表
            refresh: false
        }
    },
    mounted() {
    },
    activated() {
        this.refresh = true
    },
    deactivated() {
        this.refresh = false
    },
    methods: {
    },
}
</script>

<style scoped>
.page {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    background: #ffffff;
}

.page-header.ant-page-header >>> .ant-page-header-heading-title {
    font-size: 18px!important;
    color: #333333;
}
</style>
