<template>
    <div class="mt-10 mb-10 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div class="pointer" @click="back()" v-if="$route.query.id">
            <a-icon type="arrow-left" class="mr-10" />{{ L('活动列表') }}
        </div>
        <a-tabs v-model="activeKey" @change="tabsChange">
            <a-tab-pane key="1" :tab="L('中奖列表')">
                <a-row type="flex" justify="space-between">
                    <a-col flex="1">
                        <a-form-model
                            layout="inline"
                            ref="formData"
                            :model="searchForm"
                            @submit="getList"
                            @submit.native.prevent
                        >
                            <a-form-item :label="L('筛选')">
                                <a-select
                                    style="width: 6vw"
                                    :placeholder="L('请选择')"
                                    v-model="searchForm.search_type"
                                >
                                    <a-select-option v-for="item in searchTypeOptions" :key="item.value">
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                                <a-input
                                    style="width: 23vw"
                                    :placeholder="L('请输入')"
                                    v-model="searchForm.keywords"
                                    allowClear
                                />
                            </a-form-item>
                            <a-form-item :label="L('选择日期')">
                                <a-range-picker
                                    style="width: 100%"
                                    :ranges="{
                                        今日: [moment(), moment()],
                                        近7天: [moment().subtract(6, 'days'), moment()],
                                        近30天: [moment().subtract(29, 'days'), moment()],
                                    }"
                                    :value="searchForm.time"
                                    format="YYYY-MM-DD HH:mm"
                                    @change="onDateRangeChange"
                                    allowClear
                                    :show-time="{ format: 'HH:mm' }"
                                />
                            </a-form-item>
                            <a-form-model-item>
                                <a-button type="primary" html-type="submit"> 查询</a-button>
                                <a-button class="ml-20" @click="resetForm"> 重置</a-button>
                            </a-form-model-item>
                        </a-form-model>
                    </a-col>
                    <a-col
                        ><a-button type="primary" @click="$refs.ExportAddModal.exports()">{{
                            L('导出')
                        }}</a-button></a-col
                    >
                </a-row>
                <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="mt-20">
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="L('兑奖列表')">
                <CashPrizeList></CashPrizeList>
            </a-tab-pane>
        </a-tabs>
        <export-add
            ref="ExportAddModal"
            exportUrl="/flipping_event/platform.FlippingEventAwardsLog/exportAwardLogList"
            :queryParam="{
                keywords: searchForm.keywords,
                start_time: searchForm.start_time,
                end_time: searchForm.end_time,
                search_type: searchForm.search_type,
            }"
        />
    </div>
</template>

<script>
import activityPlatformApi from '@/api/activity/platform'
import moment from 'moment'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
import CashPrizeList from './modules/CashPrizeList.vue'
export default {
    name: 'ActivityMahjongCardWinPrizeList',
    components: {
        ExportAdd,
        CashPrizeList,
    },
    data() {
        return {
            activeKey: '1',
            searchTypeOptions: [
                {
                    label: this.L('昵称'),
                    value: 'username',
                },
                {
                    label: this.L('手机号'),
                    value: 'phone',
                },
                {
                    label: this.L('奖品'),
                    value: 'awardsname',
                },
            ],
            searchForm: {
                keywords: '',
                search_type: 'username',
                time: [],
                start_time: '',
                end_time: '',
            },
            list: [],
            columns: [
                {
                    title: this.L('中奖日期'),
                    dataIndex: 'create_time',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('昵称'),
                    dataIndex: 'nickname',
                },
                {
                    title: this.L('手机号'),
                    dataIndex: 'phone',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('奖品'),
                    dataIndex: 'awards_title',
                },
                {
                    title: this.L('奖品类型'),
                    dataIndex: 'awards_txt',
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
        moment,
        // 时间选择
        onDateRangeChange(date, dateString) {
            this.$set(this.searchForm, 'time', [date[0], date[1]])
            this.$set(this.searchForm, 'start_time', dateString[0])
            this.$set(this.searchForm, 'end_time', dateString[1])
        },
        back() {
            let length = window.history.length
            if (length == 1) {
                this.$router.replace({
                    path: '/platform/activity.platform/mahjongCard/list',
                })
            } else {
                this.$router.go(-1)
                this.$router.replace({
                    path: '/platform/activity.platform/mahjongCard/list',
                })
            }
        },
        tabsChange(e) {
            this.activeKey = e
        },
        getList(refresh = false) {
            if(refresh && this.pagination.current != 1) {
                this.pagination.current = 1
            }
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                keywords: this.searchForm.keywords,
                start_time: this.searchForm.start_time,
                end_time: this.searchForm.end_time,
                search_type: this.searchForm.search_type,
                id: this.$route.query.id || ''
            }
            this.request(activityPlatformApi.mahjongCardAwardLogList, params).then((res) => {
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
                search_type: 'username',
                time: [],
                start_time: '',
                end_time: '',
            }
            this.getList(true)
        },
    },
}
</script>

<style scoped></style>
