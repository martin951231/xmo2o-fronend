<template>
    <div class="bg-ff ml-10 mt-20 mb-20 mr-10 pl-10 pr-10 pt-10 pb-10">
        <a-tabs default-active-key="complaintList" @change="callback">
            <a-tab-pane key="complaintList" :tab="L('投诉列表')">
                <a-row>
                    <a-col :span="6">
                        <span>{{ L('关键词') }}：</span><a-input style="width: 300px;" :placeholder="L('请输入标题/内容/昵称/手机号')" v-model="search_content" :allowClear="true"/>
                    </a-col>
                    <a-col :span="4">
                        <span>{{ L('业务') }}：</span>
                        <a-cascader v-model="searchTypeValue" :fieldNames="{label: 'value', value: 'key', children: 'children'}" :options="searchTypeOptions" :placeholder="L('请选择')" @change="searchTypeChange"/>
                    </a-col>
                    <a-button type="primary" @click="onSearch">搜索</a-button>
                </a-row>

                <a-row class="mt-20">
                    <a-tabs :activeKey="tabActive" @change="tabChange">
                        <a-tab-pane :key="item.key" :tab="L(item.title)" v-for="item in tabList">
                            <a-table :columns="columns" :data-source="list" :pagination="pagination" rowKey="id">
                                <span slot="body" slot-scope="text, record">
                                    <a-tooltip>
                                        <template slot="title">
                                            {{ record.body }}
                                        </template>
                                        <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 200px;">{{ record.body }}</div>
                                    </a-tooltip>
                                </span>
                                <span slot="status_action" slot-scope="text, record">
                                    <a-switch checked-children="已采纳" un-checked-children="待采纳" :checked="record.status == 0 ? false : true" @change="statusChange($event, record)" />
                                </span>
                                <span slot="action" slot-scope="text, record">
                                    <a class="label-sm blue" @click="detail(record)">查看</a>&nbsp;&nbsp;|&nbsp;&nbsp;
                                    <a-popconfirm
                                        title="删除后无法恢复，是否确定?"
                                        @confirm="() => del(record.id)"
                                    >
                                    <a class="label-sm" style="color: red;">删除</a>
                                    </a-popconfirm>
                                </span>
                            </a-table>
                        </a-tab-pane>
                    </a-tabs>
                </a-row>
                <a-drawer
                    :title="L('投诉详情')"
                    placement="right"
                    width="40%"
                    :visible="modalVisible"
                    @close="modalVisible = false"
                    >
                    <a-descriptions :title="L('用户')" :column="2">
                        <a-descriptions-item :label="L('昵称')">{{ detailInfo.nickname || '-' }}</a-descriptions-item>
                        <a-descriptions-item :label="L('手机号')">{{ detailInfo.phone || '-' }}</a-descriptions-item>
                    </a-descriptions>
                    <a-divider />
                    <a-descriptions :title="L('投诉建议')" :column="2">
                        <a-descriptions-item :label="L('商家/店铺')">{{ detailInfo.company || '-' }}</a-descriptions-item>
                        <a-descriptions-item :label="L('投诉类型')">{{ detailInfo.other_type || '-' }}</a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions :column="1">
                        <a-descriptions-item :label="L('发布时间')">{{ detailInfo.create_time || '-' }}</a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions :column="1" layout="vertical">
                        <a-descriptions-item :label="L('图片')" v-if="detailInfo.img_arr && detailInfo.img_arr.length">
                            <img alt="图片" v-for="(item, index) in detailInfo.img_arr" :key="index" :src="item" class="img" @click="previewOpt(item)" />
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions :column="1">
                        <a-descriptions-item :label="L('内容')">{{ detailInfo.body || '-' }}</a-descriptions-item>
                    </a-descriptions>
                </a-drawer>
            </a-tab-pane>
            <a-tab-pane key="complaintConfig" :tab="L('投诉场景配置')">
                <complaint-scenario-config ref="complaintScenarioConfig" />
            </a-tab-pane>
        </a-tabs>

        <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false" width="30%">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import mailPlatformApi from '@/api/common/platform/user'
import ComplaintScenarioConfig from './components/ComplaintScenarioConfig'
export default {
    data() {
        return {
            search_content: '',
            search_type: '',
            type_second: '',
            searchTypeValue: [],
            searchTypeOptions: [],
            tabActive: '-1',
            tabList: [
                {
                    key: '-1',
                    title: '全部',
                },
                {
                    key: '1',
                    title: '采纳',
                },
                {
                    key: '0',
                    title: '待采纳',
                },
            ],
            columns: [
                {
                    title: '用户/手机号',
                    dataIndex: 'user_name',
                    width:200,
                    scopedSlots: { customRender: 'user_name' },
                },
                {
                    title: '投诉场景',
                    dataIndex: 'type',
                    width:200,
                    scopedSlots: { customRender: 'type' },
                },
                {
                    title: '投诉类型',
                    dataIndex: 'other_type',
                    width:200,
                    scopedSlots: { customRender: 'other_type' },
                },
                {
                    title: '商家/店铺',
                    dataIndex: 'company',
                    width:200,
                    scopedSlots: { customRender: 'company' },
                },
                {
                    title: '内容',
                    dataIndex: 'body',
                    width:200,
                    scopedSlots: { customRender: 'body' },
                },
                {
                    title: '是否采纳',
                    dataIndex: 'status_action',
                    width:200,
                    scopedSlots: { customRender: 'status_action' },
                },
                {
                    title: '发布时间',
                    dataIndex: 'create_time',
                    width:200,
                    scopedSlots: { customRender: 'create_time' },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width:200,
                    scopedSlots: { customRender: 'action' },
                },
            ],
            list: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            modalVisible: false,
            previewVisible: false,
            previewImage: '',
            // 详情
            detailInfo: '',
        }
    },
    components: {
        ComplaintScenarioConfig,
    },
    mounted() {
        this.getTypeList()
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        // 获取业务类型
        getTypeList() {
            this.request(mailPlatformApi.getComplaintTypeList, {}).then((res) => {
                this.searchTypeOptions = res || []
            })
        },
        // 搜索
        onSearch() {
            this.getList(true)
        },
        tabChange(e) {
            if (e == this.tabActive) return
            this.tabActive = e
            this.$set(this.pagination, 'current', 1)
            this.getList(true)
        },
        // 获取列表
        getList(update = false) {
            if (update) {
                this.$set(this.pagination, 'current', 1)
            }
            let params = {
                status: this.tabActive,
                type: this.search_type,
                keywords: this.search_content,
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
                type_second: this.type_second,
            }
            this.request(mailPlatformApi.getComplaintList, params).then((res) => {
                this.list = res.data || []
                this.pagination.total = res.total || 0
            })
        },
        // 业务类型选择
        searchTypeChange(e) {
            this.search_type = e[0]?e[0]:''
            this.type_second = e[1]?e[1]:''
            //this.getList(true)
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
        // 查看详情
        detail(record = '') {
            this.detailInfo = record
            this.modalVisible = true
        },
        // 删除
        del(id) {
            let params = {
                id,
            }
            this.request(mailPlatformApi.deleteComplaint, params).then((res) => {
                this.$message.success('删除成功', 1, () => {
                    if (this.list.length < 2 && this.pagination.current != 1) {
                        this.$set(this.pagination, 'current', this.pagination.current - 1)
                    }
                    this.getList(true)
                })
            })
        },
        // 图片预览
        previewOpt(item) {
            this.previewImage = item
            this.previewVisible = true
        },
        // 采纳 0-待采纳，1-采纳
        statusChange(e, record) {
            let params = {
                id: record.id,
                status: e ? 1 : 0,
            }
            this.request(mailPlatformApi.changeComplaintStatus, params).then((res) => {
                let index = this.list.findIndex((item) => item.id == record.id)
                this.$set(this.list[index], 'status', params.status)
            })
        },
        callback(e) {
            if (e == 'complaintConfig') {
                this.$refs.complaintScenarioConfig && this.$refs.complaintScenarioConfig.getList()
            } else {
                this.search_type = '';
                this.type_second = '';
                this.searchTypeValue = [];
                this.getTypeList()
                this.getList()
            }
        },
    },
}
</script>

<style scoped>
.img {
    margin: 0 10px 10px 0;
    width: 120px;
    height: 120px;
}
</style>
