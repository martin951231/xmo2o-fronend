<template>
  <div class="page">
    <a-page-header
        class="page-header"
        title="子分类"
    />
    <groupCategoryTableList 
        ref="groupCategoryTableList"
        :cat_id="$route.query.cat_fid"
        :refresh="refresh"
        @showModal="showModal"
        :type="'subCategory'"></groupCategoryTableList>

    <a-modal
        :title="cat_id == 0?'添加子分类':'编辑子分类'"
        :visible="visible"
        @ok="handleOk"
        @cancel="handleCancel"
        width="50%"
        :bodyStyle="{
            maxHeight: '600px',
            overflowY: 'auto'
        }"
        :destroyOnClose="true"
        >
        <groupCategoryEditForm 
            ref="groupCategoryEditForm"
            :type="'subCategory'"
            :cat_id="cat_id"
            :cat_fid="cat_fid"
            :group_content_switch="group_content_switch"
            @updateList="updateList"></groupCategoryEditForm>
    </a-modal>
    
  </div>
</template>

<script>
import GroupPlatformApi from '@/api/group/platform'
import groupCategoryTableList from '../modules/GroupCategoryTableList.vue'
import groupCategoryEditForm from '../modules/GroupCategoryEditForm.vue'
export default {
    components: { groupCategoryTableList,groupCategoryEditForm },
    data() {
        return {
            cat_id: 0, // 0：主分类列表 其它：子分类列表
            cat_fid: this.$route.query.cat_fid || 0, // 0：主分类列表 其它：子分类列表
            visible: false,
            refresh: false,
            group_content_switch: 0, // 编辑器数量&&编辑器标题 显隐 1：显示这两栏信息，0不显示
        }
    },
    mounted() {
    },
    activated() {
        this.refresh = true
        this.configGroupCategoryOpt()
    },
    deactivated() {
        this.refresh = false
    },
    methods: {
        // 编辑器数量和 编辑器标题两栏根据网站基本信息接口 
        // group_content_switch字段 1：显示这两栏信息，0不显示
        configGroupCategoryOpt() {
            this.request(GroupPlatformApi.configGroupCategory, null).then((res) => {
                this.group_content_switch = res && res.group_content_switch?res.group_content_switch:0
            })
        },
        showModal(res) {
            this.visible = res.visible || false
            this.cat_id = res.cat_id || 0
            this.cat_fid = res.cat_fid || 0
        },
        handleOk() {
            this.$refs.groupCategoryEditForm.submitOpt()
        },
        handleCancel() {
            this.visible = false
        },
        updateList() {
            this.$refs.groupCategoryTableList.getList()
            this.visible = false
        }
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
