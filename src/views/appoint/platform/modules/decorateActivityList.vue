<template>
    <a-modal
        :title="title"
        width="60%"
        :bodyStyle="bodyStyle"
        :visible="visible"
        @cancel="visible = false"
        footer=""
        :destroyOnClose="true"
    >
        <a-table :columns="columns" :data-source="list" rowKey="id">
            <span slot="show_time_type" slot-scope="text, record">
                {{ record.show_time_type == 1 ? L('永久显示') : record.start_show_time + '-' + record.end_show_time }}
            </span>
            <span slot="action" slot-scope="text, record">
                <a-switch
                    :checked-children="L('开')"
                    :un-checked-children="L('关')"
                    :checked="appointIndexActivity == record.id ? true : false"
                    @change="switchChange($event, 'appointIndexActivity', record)"
                />
            </span>
        </a-table>
    </a-modal>
</template>

<script>
import appointPlatformApi from '@/api/appoint/platform'
export default {
    data() {
        return {
            title: '',
            visible: false,
            // 208 = modal top 50 + modal header 55 + modal footer 53 + 50
            bodyStyle: {
                maxHeight: document.body.clientHeight - 208 + 'px',
                overflowY: 'auto',
            },
            columns: [
                {
                    title: this.L('活动名称'),
                    dataIndex: 'title',
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('活动时间'),
                    dataIndex: 'show_time_type',
                    scopedSlots: { customRender: 'show_time_type' },
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
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
            list: [],
            appointIndexActivity: '',
        }
    },
    methods: {
        showModal(title = '活动页', appointIndexActivity = '') {
            this.appointIndexActivity = appointIndexActivity
            this.title = title
            this.getList()
            this.visible = true
        },
        // 列表
        getList() {
            let params = {
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
            }
            this.request(appointPlatformApi.appointActivityList, params).then((res) => {
                this.list = res.data || []
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
        switchChange(e, field, record) {
            this.appointIndexActivity = e ? record.id : ''
            this.$emit('appointIndexActivitySet', this.appointIndexActivity)
        },
    },
}
</script>

<style scoped>
.ant-modal-body {
    padding: 24px 0 24px 24px !important;
}
</style>
