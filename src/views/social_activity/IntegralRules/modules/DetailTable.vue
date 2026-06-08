<template>
    <div class="detail-table-container">
        <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" row-key="id" class="main-table">
            <template slot="score_text" slot-scope="text, record">
                <span class="score-text" :style="{ color: record.score_color || '#333' }">{{ text }}</span>
            </template>
        </a-table>
    </div>
</template>

<script>
export default {
    name: 'DetailTable',
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
    }
}
</script>

<style lang="less" scoped>
.detail-table-container {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: hidden;

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
            
            li {
                margin: 0 2px;
                
                &.ant-pagination-item-active {
                    background: #1890FF;
                    border-color: #1890FF;
                    
                    a {
                        color: #fff;
                    }
                }
            }
        }
    }

    .point-text {
        color: #52c41a;
        font-weight: 600;
    }
}
</style>
