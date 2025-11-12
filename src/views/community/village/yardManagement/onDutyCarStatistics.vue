<template>
    <div class="free_car">
        <div class="header_search" style="display: flex; padding-top: 0">
            <div class="search_item">
                <label class="label_title">时间筛选: </label>
                <a-range-picker @change="onChange" />
            </div>

            <div class="search_item" style="margin-left: 20px">
                <label class="label_title">工作人员: </label>
                <a-select
                    show-search
                    placeholder="请选择工作人员"
                    style="width: 200px"
                    v-model="searchForm.wid"
                >
                    <a-select-option v-for="(item, index) in parkTypeList" :value="item.wid">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </div>

            <div class="search_item" style="margin-left: 10px">
                <a-button type="primary" @click="queryThis()">查询</a-button>
            </div>
        </div>

        <div style="margin: 0 0 20px 20px">
            <a-checkbox-group v-model="value" name="checkboxgroup" :options="options" @change="changeTable" />
        </div>

        <div class="table_content">
            <a-table
                :columns="dynamicColumns"
                :data-source="TableData"
                bordered
                size="middle"
                :pagination="pagination"
                @change="handleTableChange"
            />
        </div>
    </div>
</template>

<script>
import villageApi from '@/api/community/village'
const columns = [
    {
        title: '工作人员',
        dataIndex: 'user_name',
        key: 'user_name',
        width: 300,
        fixed: 'left',
        align: 'center',
    },
    {
        title: '实收金额',
        align: 'center',
        children: [
            {
                title: '现金收入',
                dataIndex: 'cash_money',
                key: 'cash_money',
                align: 'center',
            },
            {
                title: '临时车收入',
                dataIndex: 'online_money',
                key: 'online_money',
                align: 'center',
            },
            {
                title: '储值余额扣款',
                dataIndex: 'stored_money',
                key: 'stored_money',
                align: 'center',
            },
            {
                title: '合计',
                dataIndex: 'total_money',
                key: 'total_money',
                align: 'center',
            },
        ],
    },
    {
        title: '免费放行',
        dataIndex: 'free_num',
        key: 'free_num',
        width: 200,
        fixed: 'right',
        align: 'center',
    },
]

export default {
    data() {
        return {
            columns,
            modelTitle: '',
            tableLoadding: false,
            searchForm: {
                start_time: '',
                end_time: '',
                wid: '',
            },
            options: [
                { label: '现金收入', value: 'cash_money' },
                { label: '临时车收入', value: 'online_money' },
                { label: '储值余额扣款', value: 'stored_money' },
                { label: '免费放行', value: 'free_num' },
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showTotal: (total) => this.L(`共 X1 条记录`, { X1: total }),
            },
            value: ['cash_money', 'online_money', 'stored_money', 'free_num'],
            TableData: [],
            frequency: false,
            parkTypeList: [],
        }
    },

    components: {

    },

    mounted() {
        this.getParkType()
        this.getFreeList()
    },

    computed: {
        dynamicColumns() {
            return this.columns
                .map((column) => {
                    if (column.children) {
                        const filteredChildren = column.children.filter(
                            (child) => this.value.includes(child.dataIndex) || child.dataIndex === 'total_money'
                        )
                        if (filteredChildren.length > 0) {
                            return {
                                ...column,
                                children: filteredChildren,
                            }
                        }
                        return null // 当没有子列时返回 null
                    }
                    return column
                })
                .filter((column) => {
                    if (column && column.dataIndex === 'free_num') {
                        return this.value.includes('free_num')
                    }
                    return column !== null
                })
        },
    },

    methods: {
        queryThis() {
            this.frequency = true
            let timeout = setTimeout(() => {
                this.frequency = false
                clearTimeout(timeout)
            }, 3000)
            this.pagination.page = 1
            this.getFreeList()
        },

        handleTableChange(pagenation, filters, sorter) {
            this.pagination.current = pagenation.current
            this.pagination.page = pagenation.current
            this.getFreeList()
        },

        getFreeList() {
            let that = this
            that.tableLoadding = true
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                ...that.searchForm,
            }
            that.request('/community/village_api.Parking/getSentryWatchList', params).then((res) => {
                that.TableData = res.list
                that.pagination.total = res.count
            })
        },

        getParkType() {
            let that = this
            that.request('/community/village_api.HouseWorker/getSentryWatchWorkerList').then((res) => {
                this.parkTypeList = res.list
            })
        },
        onChange(date, dateString) {
            this.searchForm.start_time=dateString[0];
            this.searchForm.end_time=dateString[1];
            console.log(date, dateString, '对后期我去hi带回去无i和')
        },

        changeTable(data) {
            console.log(this.value, '当前选中的项')
        },
    },
}
</script>

<style lang="less" scoped>
.free_car {
    width: 98%;
    background-color: #ffffff;
    padding: 20px;
    margin: 10px;

    .header_search {
        width: 100%;
        padding: 20px;
        background-color: #ffffff;
        // display: flex;

        .search_item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .operation_btn {
            margin-left: 20px;
        }
    }

    .table_content {
        padding: 0 20px;
        margin: 10px 0;
    }

    .label_title {
        margin-right: 20px;
    }
}
</style>
