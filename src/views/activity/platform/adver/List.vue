<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-form layout="inline">
            <a-form-item :label="L('筛选')">
                <a-input v-model="query.keyword" placeholder="请输入广告名称" style="width: 200px" />
            </a-form-item>
            <a-form-item :label="L('跨城市展示')">
                <a-select style="width: 120px" v-model="query.is_common">
                    <a-select-option value="-1">全部</a-select-option>
                    <a-select-option value="1">通用</a-select-option>
                    <a-select-option value="0">指定城市</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="L('状态')">
                <a-select style="width: 120px" v-model="query.status">
                    <a-select-option value="-1">全部</a-select-option>
                    <a-select-option value="1">开启</a-select-option>
                    <a-select-option value="0">关闭</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item :label="L('活动时间')">
                <a-range-picker
                    style="width: 75%; font-size: 10px"
                    :ranges="{
                        今日: [moment(), moment()],
                        近7天: [moment().subtract('days', 6), moment()],
                        近15天: [moment().subtract('days', 14), moment()],
                        近30天: [moment().subtract('days', 29), moment()],
                    }"
                    :value="time"
                    format="YYYY-MM-DD"
                    @change="onDateRangeChange"
                />
            </a-form-item>

            <a-form-item>
                <a-button icon="search" style="margin-left: -60px" @click="getList">
                    {{ L('搜索') }}
                </a-button>
                <a-button icon="plus" type="primary" style="margin-left: 15px" @click="edit()">{{
                    L('新建广告')
                }}</a-button>
            </a-form-item>
        </a-form>
        <br />
        <a-tag color="orange"
            ><a-icon
                type="notification"
            />&nbsp;&nbsp;当配置多个活动同时生效时，系统以最新配置（ID最大）的活动展示给用户。</a-tag
        >

        <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="mt-20">
            <span slot="is_common" slot-scope="text, record">
                <span v-if="record.is_common == 1">通用</span>
                <span v-else class="cr-primary pointer" @click="pointCity(record.id)">指定城市</span>
            </span>

            <span slot="status" slot-scope="text, record">
                <a-switch
                    :checked-children="L('开启')"
                    :un-checked-children="L('关闭')"
                    :checked="record.status == 1 ? true : false"
                    @change="onModelStatusChange($event, record)"
                />
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="cr-primary pointer" @click="del(record)">{{ L('删除') }}</span
                ><a-divider type="vertical" />
                <span class="cr-primary pointer" @click="edit(record)">{{ L('编辑') }}</span>
            </span>
        </a-table>

        <EditAdver ref="EditAdver" @updateList="getList()"></EditAdver>

        <area-tree ref="adverAreaSetModal"></area-tree>
    </div>
</template>

<script>
import moment from 'moment'
import activityPlatformApi from '@/api/activity/platform'
import EditAdver from './modules/EditAdver.vue'
import AreaTree from './modules/AreaTree.vue'

export default {
    components: {
        EditAdver,
        AreaTree,
    },
    data() {
        return {
            list: [],
            columns: [
                {
                    title: this.L('ID'),
                    dataIndex: 'id',
                },
                {
                    title: this.L('弹窗名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('活动时间'),
                    dataIndex: 'active_time',
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('跨城市展示'),
                    dataIndex: 'is_common',
                    scopedSlots: { customRender: 'is_common' },
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
            query: {
                keyword: '',
                is_common: '-1',
                status: '-1',
                begin_time: '',
                end_time: '',
            },
            time: [],
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
        moment,
        // 时间选择
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.time = [date[0], date[1]]
            this.$set(this.query, 'begin_time', dateString[0])
            this.$set(this.query, 'end_time', dateString[1])
        },
        pointCity(id) {
            this.$refs.adverAreaSetModal.show(id)
        },
        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }

            let postParams = { ...params, ...this.query }
            this.request(activityPlatformApi.AdverGetList, postParams).then((res) => {
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
            this.$refs.EditAdver.showModal(record)
        },
        // 删除
        del(record) {
            this.$confirm({
                title: this.L('是否确定删除?'),
                centered: true,
                onOk: () => {
                    let param = {
                        id: record.id,
                    }
                    this.request(activityPlatformApi.AdverDel, param).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.getList()
                    })
                },
            })
        },
        // 状态
        onModelStatusChange(e, record) {
            this.request(activityPlatformApi.AdverChangeStatus, {
                id: record.id,
                status: e ? 1 : 0,
            }).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.getList()
            })
        },
    },
}
</script>

<style scoped></style>
