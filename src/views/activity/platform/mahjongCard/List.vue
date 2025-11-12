<template>
    <div class="mt-10 mb-10 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row type="flex" justify="space-between">
            <a-col flex="1">
                <a-form-model
                    layout="inline"
                    ref="formData"
                    :model="searchForm"
                    @submit="getList(true)"
                    @submit.native.prevent
                >
                    <a-form-item :label="L('活动名称')">
                        <a-input
                            style="width: 23vw"
                            :placeholder="L('请输入')"
                            v-model="searchForm.keywords"
                            allowClear
                        />
                    </a-form-item>
                    <a-form-item :label="L('状态')">
                        <a-select style="width: 10vw" :placeholder="L('请选择')" v-model="searchForm.status">
                            <a-select-option v-for="item in statusOptions" :key="item.value">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-model-item>
                        <a-button type="primary" html-type="submit"> 查询</a-button>
                        <a-button class="ml-20" @click="resetForm"> 重置</a-button>
                    </a-form-model-item>
                </a-form-model>
            </a-col>
            <a-col
                ><a-button type="primary" @click="edit()">{{ L('新建') }}</a-button></a-col
            >
        </a-row>
        <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="mt-20">
            <span slot="status" slot-scope="text, record">
                <a-badge :color="record.status == 1 ? 'green' : 'red'" :text="record.status_txt" />
            </span>
            <span slot="active_time" class="text-wrap" slot-scope="text, record"> {{ record.start_time }} - {{ record.end_time }} </span>
            <span slot="cashPrizeUrl" slot-scope="text, record">
                <span class="cr-primary pointer" @click="view(record, 'link_url')">{{ L('查看') }}</span>
            </span>
            <span slot="cashRules" slot-scope="text, record">
                <span class="cr-primary pointer" @click="view(record, 'cashRules')">{{ L('查看') }}</span>
            </span>
            <span slot="winPrize" slot-scope="text, record">
                <span class="cr-primary pointer" @click="view(record, 'winPrize')">{{ L('查看') }}</span>
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="cr-red pointer mr-10" @click="del(record)">{{ L('删除') }}</span>
                <span class="cr-primary pointer" @click="edit(record)">{{ L('编辑') }}</span>
            </span>
        </a-table>
        <QrcodeModal ref="QrcodeModal"></QrcodeModal>
    </div>
</template>

<script>
import activityPlatformApi from '@/api/activity/platform'
import QrcodeModal from '@/components/QrcodeModal/QrcodeModal.vue'
export default {
    name: 'ActivityMahjongCardList',
    components: {
        QrcodeModal,
    },
    data() {
        return {
            statusOptions: [
                {
                    label: this.L('全部'),
                    value: -1,
                },
                {
                    label: this.L('进行中'),
                    value: 1,
                },
                {
                    label: this.L('已关闭'),
                    value: 0,
                },
            ],
            searchForm: {
                keywords: '',
                status: -1,
            },
            list: [],
            columns: [
                {
                    title: this.L('活动名称'),
                    dataIndex: 'title',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status_txt',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('活动时间'),
                    dataIndex: 'active_time',
                    scopedSlots: { customRender: 'active_time' },
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('兑奖中心链接'),
                    scopedSlots: { customRender: 'cashPrizeUrl' },
                    align: 'center',
                },
                {
                    title: this.L('兑换规则'),
                    scopedSlots: { customRender: 'cashRules' },
                    align: 'center',
                },
                {
                    title: this.L('中奖列表'),
                    scopedSlots: { customRender: 'winPrize' },
                    align: 'center',
                },
                {
                    title: this.L('操作'),
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
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
        getList(refresh = false) {
            if(refresh && this.pagination.current != 1) {
                this.pagination.current = 1
            }
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                keywords: this.searchForm.keywords,
                status: this.searchForm.status
            }
            this.request(activityPlatformApi.mahjongCardGetList, params).then((res) => {
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
        // 重置
        resetForm() {
            this.searchForm = {
                keywords: '',
                status: -1,
            }
            this.getList(true)
        },
        // 编辑
        edit(record = '') {
            this.$router.push({
                path: '/platform/activity.platform/mahjongCard/edit',
                query: record
                    ? {
                          id: record.id,
                      }
                    : {},
            })
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
                    this.request(activityPlatformApi.mahjongCardDel, param).then((res) => {
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
        // 查看
        view(record, type) {
            if (type == 'link_url') {
                this.$refs.QrcodeModal.showModal(
                    true,
                    {
                        link_url: record.link_url,
                    },
                    2,
                    this.L('查看链接'),
                    '60%'
                )
                return
            }
            let path =
                type == 'cashRules'
                    ? '/platform/activity.platform/mahjongCard/cashRulesList'
                    : '/platform/activity.platform/mahjongCard/winPrizeList'
            this.$router.push({
                path: path,
                query: {
                    id: record.id,
                },
            })
        },
    },
}
</script>

<style scoped></style>
