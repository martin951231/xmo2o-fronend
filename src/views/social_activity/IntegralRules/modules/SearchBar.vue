<template>
    <div class="search-container">
        <a-row :gutter="[16, 0]">
            <a-col :span="6">
                <div class="search-item">
                    <label>编辑时间：</label>
                    <a-range-picker v-model="timeRange" format="YYYY-MM-DD" />
                </div>
            </a-col>
            <a-col :span="4">
                <div class="search-item">
                    <label>状态：</label>
                    <a-select v-model="status" placeholder="请选择状态">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">正常</a-select-option>
                        <a-select-option :value="2">禁止</a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col :span="14">
                <div class="button-container">
                    <div class="search-buttons">
                        <a-button type="primary" @click="handleSearch">查询</a-button>
                        <a-button @click="handleReset">重置</a-button>
                    </div>
                    <div v-saction:rules_create  class="action-container">
                        <a-button  type="primary" @click="handleCreate">创建积分规则</a-button>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    name: 'SearchBar',
    props: {
        searchParams: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            timeRange: this.searchParams.timeRange || null,
            status: this.searchParams.status || 0
        }
    },
    methods: {
        handleSearch() {
            this.$emit('search', {
                timeRange: this.timeRange,
                status: this.status
            })
        },
        handleReset() {
            this.timeRange = null
            this.status = 0
            this.$emit('reset', {
                timeRange: null,
                status: 0
            })
        },
        handleCreate() {
            this.$emit('create')
        }
    }
}
</script>

<style lang="less" scoped>
.search-container {
    margin-bottom: 16px;
    padding: 16px;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;

    .search-item {
        display: flex;
        align-items: center;

        label {
            min-width: 70px;
            text-align: right;
            margin-right: 12px;
            font-size: 14px;
            color: #333;
        }
    }

    .search-buttons {
        display: flex;
        gap: 12px;
    }

    .button-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .action-container {
        display: flex;
        justify-content: flex-end;
    }
}
</style>