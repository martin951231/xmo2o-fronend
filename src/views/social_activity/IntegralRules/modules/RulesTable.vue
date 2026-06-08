<template>
    <div class="content-container">
        <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" row-key="id"
            class="main-table">
            <template slot="status" slot-scope="text">
                <span :class="text === '正常' ? 'status-normal' : 'status-forbidden'">{{ text }}</span>
            </template>
            <template slot="action" slot-scope="record">
                <div class="action-buttons">
                    <a v-saction:rules_edit  href="#"  class="action-btn edit-btn" @click="handleEdit(record)">编辑</a>
                    <a v-saction:rules_delete  href="#"  class="action-btn delete-btn" @click="handleDelete(record)">删除</a>
                </div>
            </template>
        </a-table>
    </div>
</template>

<script>
export default {
    name: 'RulesTable',
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        dataSource: {
            type: Array,
            default: () => []
        },
        pagination: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        handleEdit(record) {
            this.$emit('edit', record)
        },
        handleDelete(record) {
            this.$emit('delete', record)
        }
    }
}
</script>

<style lang="less" scoped>
.content-container {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: hidden;
}

.main-table {
    :deep(.ant-table-thead) {
        background: #f5f5f5;

        th {
            background: #f5f5f5;
            color: #666;
            font-weight: 500;
            font-size: 13px;
            border-bottom: 1px solid #e8e8e8;
        }
    }

    :deep(.ant-table-tbody) {
        tr {
            border-bottom: 1px solid #e8e8e8;

            &:hover {
                background: #fafafa;
            }
        }

        td {
            font-size: 13px;
            color: #333;
            padding: 12px 16px;
        }
    }

    :deep(.ant-pagination) {
        padding: 12px 16px;
        border-top: 1px solid #e8e8e8;
        text-align: right;
    }
}

.action-buttons {
    display: flex;
    gap: 12px;

    .action-btn {
        font-size: 13px;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .edit-btn {
        color: #1890FF;
    }

    .delete-btn {
        color: #ff4d4f;
    }
}

.status-normal {
    color: #52c41a;
}

.status-forbidden {
    color: #ff4d4f;
}
</style>