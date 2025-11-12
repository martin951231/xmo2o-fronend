<template>
   <a-modal
        :title="L('中奖记录')"
        v-model="visible"
        @ok="handleOk"
        destroyOnClose
        width="70%"
        :centered="true"
        @cancel="handleCancel"
        :bodyStyle="{
            maxHeight: '766px',
            overflowY: 'auto',
        }"
        :footer="null"
    >
        <a-form-model layout="inline" :model="formData" @submit="getList($event, true)" @submit.native.prevent>
            <a-form-model-item>
                <a-input-group compact>
                    <a-select v-model="formData.search_type" style="width: 8vw" :options="searchTypeOptions">
                    </a-select>
                    <a-input style="width: 15vw" v-model="formData.keywords" :placeholder="L('请输入')" allowClear>
                    </a-input>
                </a-input-group>
            </a-form-model-item>
            <a-form-model-item :label="L('选择日期')">
                <a-range-picker
                    style="width: 15vw"
                    :ranges="{
                        今日: [moment(), moment()],
                        近7天: [moment().subtract('days', 6), moment()],
                        近30天: [moment().subtract('days', 29), moment()],
                    }"
                    :value="formData.time"
                    format="YYYY-MM-DD HH:mm"
                    @change="onDateRangeChange"
                    allowClear
                    :show-time="{ format: 'HH:mm' }"
                />
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" html-type="submit">
                    {{ L('查询') }}
                </a-button>
                <a-button type="primary" class="ml-10" @click="$refs.ExportAddModal.exports()">
                    {{ L('导出') }}
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="mt-20">
        </a-table>

        <export-add
            ref="ExportAddModal"
            exportUrl="/roundabout/platform.Activity/exportUserList"
            :queryParam="{
                start_time: formData.start_time,
                end_time: formData.end_time,
                keywords: formData.keywords,
                search_type: formData.search_type,
                id: formData.id
            }"
        />

        </a-modal>
</template>

<script>
import activityPlatformApi from '@/api/activity/platform'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
import moment from 'moment'
export default {
    components: {
        ExportAdd
    },
    data() {
        return {
            visible: false,
            searchTypeOptions: [
                {
                    label: this.L('昵称'),
                    value: 1,
                },
                {
                    label: this.L('手机号'),
                    value: 2,
                },
            ],
            list: [],
            columns: [
                {
                    title: this.L('中奖日期'),
                    dataIndex: 'add_time',
                },
                {
                    title: this.L('昵称'),
                    dataIndex: 'nickname',
                },
                {
                    title: this.L('手机号'),
                    dataIndex: 'phone',
                },
                {
                    title: this.L('奖品'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('奖品类型'),
                    dataIndex: 'type_name',
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
            formData: {
                search_type: 1,
                keywords: '',
                time: [],
                start_time: '',
                end_time: '',
            },
        }
    },
    methods: {
        moment,
        showModal(record = '') {
            this.visible = true
            this.formData = {
                ...this.formData,
                id: record.id
            }
            this.getList('',true)
        },
        getList(e, refresh = false) {
            if (refresh && this.pagination.current != 1) {
                this.pagination.current = 1
            }

            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                search_type: this.formData.search_type,
                keywords: this.formData.keywords,
                start_time: this.formData.start_time,
                end_time: this.formData.end_time,
                id: this.formData.id
            }
            this.request(activityPlatformApi.turntableLotteryGetUserList, params).then((res) => {
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
        // 时间选择
        onDateRangeChange(date, dateString) {
            this.$set(this.formData, 'time', [date[0], date[1]])
            this.$set(this.formData, 'start_time', dateString[0])
            this.$set(this.formData, 'end_time', dateString[1])
        },
        handleOk() {
            this.handleCancel()
        },
        handleCancel() {
            this.visible = false
            this.modalTitle = ''
            Object.assign(this.$data, this.$options.data.call(this))
        },
    },
}
</script>

<style scoped></style>
