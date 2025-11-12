<template>
    <div class="ant-pro-page-header-wrap-children-content mt-10">
        <a-card :bordered="false">
            <a-tabs default-active-key="1">
                <a-tab-pane key="1" tab="评论列表">
                    <div class="message-suggestions-list-box">
                        <a-table
                            :columns="columns"
                            :data-source="list"
                            rowKey="pigcms_id"
                            class="components-table-demo-nested"
                            :pagination="pagination"
                            @change="tableChange"
                            style="min-height: 700px"
                        >
                            <span slot="uid" slot-scope="text, record">
                                <div style="display: flex;align-items:center">
                                    <beautiful-image :src="record.avatar" width="50px" height="50px" shape hover visible viewerStyle="2" />
                                    <div class="ml-10">{{record.uid}}</div>
                                </div>
                            </span>
                            <span slot="score" slot-scope="text, record">
                                <a-rate :default-value="record.score" disabled />
                            </span>
                            <span slot="action" slot-scope="text, record">
                                <a @click="viewDetail(record)">查看详情</a>
                            </span>
                        </a-table>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </a-card>
        <a-modal title="评论详情" :visible="visible" @cancel="()=>{visible = false}" :footer="null" width="700px" :destroyOnClose="true">
            <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" v-if="tableItemInfo">
                <a-form-model-item label="订单ID">{{tableItemInfo.order_id}}</a-form-model-item>
                <a-form-model-item label="顾客ID">
                    <div style="display: flex;align-items:center">{{tableItemInfo.uid}}</div>
                </a-form-model-item>
                <a-form-model-item label="订单名称">{{tableItemInfo.order_name}}</a-form-model-item>
                <a-form-model-item label="评论内容">{{tableItemInfo.comment}}</a-form-model-item>
                <a-form-model-item label="评论时间">{{tableItemInfo.add_time}}</a-form-model-item>
                <a-form-model-item label="评论图片">
                    <div  style="display: flex;flex-wrap: wrap;">
                        <beautiful-image v-for="(item,index) in tableItemInfo.pic" :key="index" :src="item" width="28%" height="100px" hover visible viewerStyle="2" class="mr-10 mt-10" />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="评分">
                    <a-rate :default-value="tableItemInfo.score" disabled />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
// import moment from 'moment'
import GroupPlatformApi from '@/api/group/platform'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage'
import moment from 'moment'
export default {
    name: 'GroupCombineList',
    components: { BeautifulImage },
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 },
            // 查询参数
            queryParam: {
                page: 1,
                pageSize: 10,
            },
            pagination: {
                current: 1,
                pageSize: 10,
                total: 10,
                'show-total': (total) => `共 ${total} 条记录`,
                'show-quick-jumper': true,
            },
            // 表头
            columns: [
                {
                    title: '顾客ID',
                    dataIndex: 'uid',
                    scopedSlots: {
                        customRender: 'uid',
                    },
                },
                {
                    title: '订单名称',
                    dataIndex: 'order_name',
                },
                {
                    title: '评论内容',
                    dataIndex: 'comment',
                    width: 300,
                    ellipsis: true,
                },
                {
                    title: '评论时间',
                    dataIndex: 'add_time',
                },
                {
                    title: '评论打分',
                    dataIndex: 'score',
                    scopedSlots: {
                        customRender: 'score',
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            list: [],
            visible: false,
            tableItemInfo: null,
        }
    },
    created() {
        this.queryParam.id = this.$route.query.id
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        moment,
        // 获取列表信息
        getList() {
            this.queryParam['page'] = this.pagination.current
            this.queryParam['pageSize'] = this.pagination.pageSize
            this.request(GroupPlatformApi.getReply, this.queryParam).then((res) => {
                this.list = res.data
                this.pagination.total = res.total
            })
        },
        //查看详情
        viewDetail(item) {
            this.tableItemInfo = null;
            this.request(GroupPlatformApi.getReplyDetail, { id: item.pigcms_id }).then((res) => {
                this.tableItemInfo = res
                this.visible = true
            })
        },
        // 表格中变动  这里只针对页面页数切换
        tableChange(e, filters, sorter) {
            // 分页
            this.pagination['pageSize'] = e.pageSize
            this.pagination['current'] = e.current

            if (e.current && e.current > 0) {
                this.pagination.current = e.current
            }
            this.getList()
        },
    },
}
</script>
<style lang="less" scoped>
.edit-sort {
    display: none;
}
.form-content {
    margin-bottom: 16px;
}
</style>
