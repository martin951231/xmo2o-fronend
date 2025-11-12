<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col
                ><a-button type="primary" @click="edit()">{{ L('新建活动') }}</a-button>
                <a-button @click="del()" class="ml-20" :disabled="selectedRowKeys.length < 1">{{ L('删除') }}</a-button></a-col
            >
        </a-row>
        <a-table
            :columns="columns"
            rowKey="id"
            :data-source="list"
            :pagination="pagination"
            class="mt-20"
            :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onSelect: onSelect,
                onSelectAll: onSelectAll
            }"
        >
            <span slot="status" slot-scope="text, record">
                <a-switch
                    :checked-children="L('开启')"
                    :un-checked-children="L('关闭')"
                    :checked="record.status == 1 ? true : false"
                    @change="onModelStatusChange($event, record)"
                />
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="cr-primary pointer mr-10" @click="winLotteryRecord(record)">{{ L('中奖记录') }}</span> <a-divider type="vertical" />
                <span class="cr-primary pointer mr-10" @click="del(record)">{{ L('删除') }}</span> <a-divider type="vertical" />
                <span class="cr-primary pointer" @click="edit(record)">{{ L('编辑') }}</span>
            </span>
        </a-table>

        <EditActivity ref="EditActivity" @updateList="getList()"></EditActivity>
        <WinTheLotteryRecord ref="WinTheLotteryRecord"></WinTheLotteryRecord>
    </div>
</template>

<script>
import activityPlatformApi from '@/api/activity/platform'
import EditActivity from './modules/EditActivity.vue'
import WinTheLotteryRecord from './modules/WinTheLotteryRecord.vue'
export default {
    components: {
        EditActivity,
        WinTheLotteryRecord,
    },
    data() {
        return {
            list: [],
            columns: [
                {
                    title: this.L('活动名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('活动时间'),
                    dataIndex: 'active_date',
                },
                {
                    title: this.L('活动链接'),
                    dataIndex: 'active_url',
                    customCell: () => {
                        return {class: 'text-wrap'}
                    }
                },
                {
                    title: this.L('参与人数'),
                    dataIndex: 'join_people',
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('操作'),
                    scopedSlots: { customRender: 'action' },
                },
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L(`共 X1 条记录`, { X1: total }),
            },
            selectedRowKeys: [],
        }
    },
    mounted() {
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(activityPlatformApi.turntableLotteryGetList, params).then((res) => {
                this.list = res.data || []
                if (!this.list.length && this.pagination.current > 1) {
                    this.pagination.current = this.pagination.current - 1
                    this.getList()
                }
                this.pagination.total = res.total || 0
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        // 编辑
        edit(record = '') {
            this.$refs.EditActivity.showModal(record)
        },
        // 删除
        del(record) {
            this.$confirm({
                title: this.L('是否确定删除?'),
                centered: true,
                onOk: () => {
                    let param = {
                        id: record.id ? [record.id] : this.selectedRowKeys,
                    }
                    this.request(activityPlatformApi.turntableLotteryDelActivity, param).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        if (this.selectedRowKeys.length) {
                            this.selectedRowKeys = []
                        }
                        this.getList()
                    })
                },
            })
        },
        // 状态
        onModelStatusChange(e, record) {
            this.request(activityPlatformApi.turntableLotteryChangeStatus, {
                id: record.id,
                status: e ? 1 : 0,
            }).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.getList()
            })
        },
        // 中奖列表
        winLotteryRecord(record) {
            this.$refs.WinTheLotteryRecord.showModal(record)
        },
        onSelect(record, selected, selectedRows, nativeEvent) {
            if (selected) {
                this.selectedRowKeys.push(record.id)
            } else {
                if (this.selectedRowKeys.length) {
                    let index = this.selectedRowKeys.findIndex(item => item == record.id) 
                    index != -1 && this.$delete(this.selectedRowKeys,index)
                }
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            let ids = changeRows.map(item => item.id)
            if (selected) {
               this.selectedRowKeys = this.selectedRowKeys.concat(ids)
            } else {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids).filter(item => !ids.includes(item))
            }
        }
    },
}
</script>

<style scoped></style>
