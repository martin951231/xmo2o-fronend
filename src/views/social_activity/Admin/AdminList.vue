<template>
    <div class="organization-management">
        <!-- 顶部标签页 -->
        <div class="tabs-container">
            <div class="tabs-header">
                <div 
                    v-for="tab in tabs" 
                    :key="tab.key"
                    :class="['tab-item', { active: activeTab === tab.key }]"
                    @click="handleTabChange(tab.key)"
                >
                    {{ tab.label }}
                </div>
            </div>
        </div>

        <!-- 账号管理 -->
        <AccountList v-if="activeTab === 'account'" />

        <!-- 权限套餐管理 -->
        <PermissionList v-if="activeTab === 'permission'" />
    </div>
</template>

<script>
import AccountList from './modules/AccountList.vue'
import PermissionList from './modules/PermissionList.vue'

export default {
    name: 'AdminList',
    components: {
        AccountList,
        PermissionList
    },
    data() {
        return {
            activeTab: 'account',
            tabs: [
                { key: 'account', label: '账号' },
                { key: 'permission', label: '权限角色' }
            ]
        }
    },
    methods: {
        handleTabChange(key) {
            this.activeTab = key
        }
    }
}
</script>

<style lang="less" scoped>
.organization-management {
    min-height: calc(100vh);
    background: #f5f5f5;
    padding: 0;
    margin: 10px 0;
    .tabs-container {
        background: #fff;
        border-bottom: 1px solid #e8e8e8;
        padding: 0 24px;
    }

    .tabs-header {
        display: flex;
        gap: 32px;
        padding: 14px 0;
        border-bottom: none;
    }

    .tab-item {
        position: relative;
        padding: 8px 0;
        font-size: 14px;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            color: #1890FF;
        }

        &.active {
            color: #1890FF;
            font-weight: 500;

            &::after {
                content: '';
                position: absolute;
                bottom: -14px;
                left: 0;
                right: 0;
                height: 2px;
                background: #1890FF;
            }
        }
    }
}
</style>