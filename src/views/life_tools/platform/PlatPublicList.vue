<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- 头部导航栏区域 -->
        <a-tabs
            :tabBarStyle="{ background: '#fff' }"
            size="large"
            tab-position="top"
            @change="selectClassify"
            :default-active-key="navIndex"
        >
            <a-tab-pane v-for="item in tabList" :key="item.key">
<!--            <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.tab">-->
                <span slot="tab">{{item.tab}} <a-badge :count="item.not_audit_num" /></span>
                <a-row style="margin-top: 20px; margin-bottom: 20px">
                    <a-col :span="20">
                        <a-select
                            v-if="types == 'sports'"
                            :default-value="queryParams.tools_type"
                            v-model="queryParams.tools_type"
                            style="width: 120px"
                            @change="onSearch"
                        >
                            <a-select-option :value="'sports'"> 全部 </a-select-option>
                            <a-select-option value="course"> 课程 </a-select-option>
                            <a-select-option value="stadium"> 体育馆 </a-select-option>
                        </a-select>
                        <a-input-search
                            placeholder="搜索标题/描述/电话/地址/标签"
                            v-model="queryParams.keywords"
                            style="width: 300px"
                            @search="onSearch"
                        />
                        <div class="status">
                            <p>状态:</p>
                            <a-select style="width: 120px" :default-value="'-1'" @change="handleChangeFlag">
                                <a-select-option value="-1"> 全部 </a-select-option>
                                <a-select-option value="0"> 待审核 </a-select-option>
                                <a-select-option value="1"> 审核成功 </a-select-option>
                                <a-select-option value="2"> 审核失败 </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :span="1">
                        <a-button type="primary" @click="quickAudit">{{ L('快速审核') }}</a-button>
                    </a-col>
                </a-row>
                <!-- 表格列表区域开始 -->
                <a-table
                    style="background: #ffffff"
                    :columns="columns"
                    :rowKey="navIndex == 0 ? 'tools_id' : 'ticket_id'"
                    :data-source="dataList"
                    @change="changePage"
                    :pagination="pagination"
                    :rowSelection="{
                        onChange: onSelectChange,
                        selectedRowKeys: selectedRowKeys,
                    }"
                >
                    <!-- 类型 -->
                    <span slot="type" slot-scope="text">
                        {{ typeMap[text] }}
                    </span>
                    <!-- 价格 -->
                    <span slot="money" slot-scope="text"> ￥{{ text }} </span>
                    <!-- 体育馆/课程 -->
                    <template slot="tools_title" slot-scope="index, item">
                        <span :title="item.tools_title + '(' + item.tools_audit_status_text + ')'">{{
                            item.tools_title
                        }}</span
                        >(
                        <span
                            :title="item.tools_title + '(' + item.tools_audit_status_text + ')'"
                            v-if="item.tools_audit_status == 0"
                            style="color: #faad14"
                            >{{ item.tools_audit_status_text }}</span
                        >
                        <span
                            :title="item.tools_title + '(' + item.tools_audit_status_text + ')'"
                            v-else-if="item.tools_audit_status == 1"
                            style="color: #52c41a"
                            >{{ item.tools_audit_status_text }}</span
                        >
                        <span
                            :title="item.tools_title + '(' + item.tools_audit_status_text + ')'"
                            v-else-if="item.tools_audit_status == 2"
                            style="color: #f5222d"
                            >{{ item.tools_audit_status_text }}</span
                        >)
                    </template>
                    <!-- 状态 -->
                    <span slot="audit_status" slot-scope="index, item">
                        <span v-if="item.audit_status == 0" style="color: #faad14">{{ item.audit_status_text }}</span>
                        <span v-else-if="item.audit_status == 1" style="color: #52c41a">{{
                            item.audit_status_text
                        }}</span>
                        <span v-else-if="item.audit_status == 2" style="color: #f5222d">{{
                            item.audit_status_text
                        }}</span>
                    </span>
                    <!-- 提交时间以及审核时间 -->
                    <span slot="add_audit_time" slot-scope="index, item">{{
                        navIndex == 0
                            ? item.add_audit_time
                                ? item.add_audit_time
                                : '无'
                            : item.audit_time
                            ? item.audit_time
                            : '无'
                    }}</span>
                    <!-- 备注 -->
                    <span slot="audit_msg" slot-scope="audit_msg" :title="audit_msg">{{
                        audit_msg ? audit_msg : '无'
                    }}</span>
                    <!-- 操作 -->
                    <a slot="operation" slot-scope="index, item" @click="examine(item)">{{
                        item.audit_status == 0 ? '审核' : '重新审核'
                    }}</a>
                </a-table>
            </a-tab-pane>
        </a-tabs>

        <!-- 审核信息 -->
        <a-modal
            destroyOnClose
            :title="L('快速审核')"
            width="46%"
            centered
            :visible="visible"
            @ok="handleOk"
            @cancel="
                () => {
                    visible = false
                }
            "
            okText="提交"
        >
            <div style="padding: 0 40px">
                <div class="info">
                    <span>{{ L('是否审核通过：') }}</span>
                    <a-radio-group :options="plainOptions" :default-value="value1" @change="onExamineChange" />
                </div>

                <div class="info">
                    <span>{{ L('驳回原因：') }}</span>
                    <a-textarea
                        placeholder="请输入驳回原因"
                        v-model="examineParams.audit_msg"
                        :auto-size="{ minRows: 3, maxRows: 6 }"
                    />
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
import lifeToolsPlatformApi from '@/api/life_tools/platform'
import mallPlatformApi from '@/api/mall/platform/index'
import {_updateMenu} from "@/utils/util";
export default {
    components: {},

    data() {
        return {
            // tab标签栏
            tabList: [
                {
                    key: 0,
                    tab: this.L('体育审核'),
                    not_audit_num: 0,
                },
                {
                    key: 1,
                    tab: this.L('门票审核'),
                    not_audit_num: 0,
                },
            ],
            navIndex: 0,
            dataList: [],
            visible: false,
            value1: '',
            plainOptions: [
                {
                    value: '1',
                    label: this.L('同意'),
                },
                {
                    value: '2',
                    label: this.L('驳回'),
                },
            ],
            selectedRowKeys: [],
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            queryParams: {
                page_size: 0,
                page: 1,
                keywords: '',
                type: '',
            },
            // 审核提交参数
            examineParams: {
                tools_ids: [],
                audit_msg: '',
                audit_status: '',
            },
            colorMap: ['green', 'cyan', 'blue', 'purple', 'pink', 'red', 'orange'],
            typeMap: {
                stadium: '体育馆',
                course: '课程',
            },
            columns: [
                {
                    title: this.L('标题'),
                    dataIndex: 'title',
                    ellipsis: true,
                    width: 150,
                },
                {},
                {
                    title: this.L('商家'),
                    dataIndex: 'merchant_name',
                    ellipsis: true,
                    width: 150,
                },
                {
                    title: this.L('类型'),
                    dataIndex: 'type',
                    key: 'type',
                    scopedSlots: {
                        customRender: 'type',
                    },
                },

                {
                    title: this.L('联系电话'),
                    dataIndex: 'phone',
                    ellipsis: true,
                    width: 130,
                },

                {
                    title: this.L('金额'),
                    dataIndex: 'money',
                    key: 'money',
                    scopedSlots: {
                        customRender: 'money',
                    },
                },
                {
                    title: this.L('提交时间'),
                    dataIndex: 'add_audit_time',
                    key: 'add_audit_time',
                    scopedSlots: {
                        customRender: 'add_audit_time',
                    },
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'audit_status',
                    key: 'audit_status',
                    scopedSlots: {
                        customRender: 'audit_status',
                    },
                },
                {
                    title: this.L('备注'),
                    dataIndex: 'audit_msg',
                    key: 'audit_msg',
                    ellipsis: true,
                    scopedSlots: {
                        customRender: 'audit_msg',
                    },
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'operation',
                    key: 'operation',
                    scopedSlots: {
                        customRender: 'operation',
                    },
                },
            ],
            // 请求接口路径
            paramsUrl: '',
            types: '',
        }
    },
    created() {
        // 根据路由参数判断用哪个接口
        // if (this.$route.path.slice(this.$route.path.indexOf('=') + 1) == 'sports') {
        this.paramsUrl = lifeToolsPlatformApi.lifeToolsAuditList
        this.types = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
        // }
        this.getNotAuditNum();
        this.getLifeToolsList()
        //更新左侧菜单
        _updateMenu(this.$route.path,this)
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    mounted() {},
    methods: {
        // 头部大标签页选中事件
        selectClassify(e) {
            this.navIndex = e
            if (e == 0) {
                this.paramsUrl = lifeToolsPlatformApi.lifeToolsAuditList
            } else {
                this.paramsUrl = lifeToolsPlatformApi.getAuditTicketList
            }
            delete this.queryParams.audit_status
            this.queryParams.keywords = ''
            this.pagination.current = 1
            this.selectedRowKeys = []
            this.dataList = []
            this.getLifeToolsList()
            // 体育列表
            if (this.$route.path.slice(this.$route.path.indexOf('=') + 1) == 'sports') {
                // 切换时插入表格所需数据
                if (this.navIndex == 1) {
                    this.columns[1] = {
                        title: this.L('体育馆/课程'),
                        dataIndex: 'tools_title',
                        key: 'tools_title',
                        ellipsis: true,
                        width: 200,
                        scopedSlots: {
                            customRender: 'tools_title',
                        },
                    }
                } else {
                    this.columns[1] = {}
                }
            } else if (this.$route.path.slice(this.$route.path.indexOf('=') + 1) == 'scenic') {
                if (this.navIndex == 1) {
                    this.columns[1] = {
                        title: this.L('景区'),
                        dataIndex: 'tools_title',
                        key: 'tools_title',
                        width: 200,
                        scopedSlots: {
                            customRender: 'tools_title',
                        },
                    }
                } else {
                    this.columns[1] = {}
                }
            }
        },
        // 状态选择框事件
        handleChangeFlag(e) {
            this.pagination.current = 1
            this.queryParams.audit_status = e
            if (e == -1) {
                delete this.queryParams.audit_status
            }
            this.getLifeToolsList()
        },
        // 表格选中事件
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        // 审核
        examine(item) {
            let params = {
                mer_id: item.mer_id,
            } 
            //进行伪登录
            this.request(mallPlatformApi.loginMerchant, params).then((res) => {
                if (this.queryParams.tools_type === 'scenic') {
                    if (this.navIndex == 0) {
                        this.$router.push({
                            path: '/life_tools/platform.scenic/auditDetail',
                            query: { tools_id: item.tools_id, disabled: 1, tools_type :this.queryParams.tools_type},
                        })
                    } else {
                        this.$router.push({
                            path: '/life_tools/platform.scenic/ticketAudit',
                            query: { tools_id: item.tools_id, id: item.ticket_id, disabled: 1 , tools_type :this.queryParams.tools_type},
                        })
                    }
                } else {
                    if (this.navIndex == 0) {
                        this.$router.push({
                            path: '/life_tools/platform.LifeToolsSports/audit',
                            query: { tools_id: item.tools_id, disabled: 1, tools_type :this.queryParams.tools_type },
                        })
                    } else {
                        this.$router.push({
                            path: '/life_tools/platform.LifeToolsSports/TicketAudit',
                            query: { tools_id: item.tools_id,id: item.ticket_id, disabled: 1, tools_type :this.queryParams.tools_type },
                        })
                    }
                }
                console.log(this.queryParams.tools_type)
            })
        },
        // 快速审核
        quickAudit() {
            if (this.selectedRowKeys.length == 0) {
                this.$message.warning(this.L('请选择至少一条或者多条列表再审核'))
                return
            }
            this.visible = true
            this.examineParams.audit_msg = ''
            this.examineParams.audit_status = ''
            this.examineParams.tools_ids = this.selectedRowKeys
        },
        // 审核接口
        examineParamsSubmit() {
            let url = ''
            if (this.navIndex == 0) {
                url = lifeToolsPlatformApi.lifeToolsAudit
            } else {
                url = lifeToolsPlatformApi.auditTicket
                this.examineParams.ticket_ids = this.selectedRowKeys
            }
            this.request(url, this.examineParams).then((res) => {
                this.$message.success(this.L('操作成功'))
                this.selectedRowKeys = []
                this.visible = false
                this.getNotAuditNum();
                this.getLifeToolsList()
                //更新左侧菜单
                _updateMenu(this.$route.path,this)
            })
        },

        // 审核确定按钮
        handleOk() {
            if (this.examineParams.audit_status == '') {
                this.$message.warning(this.L('请选择是否审核通过单选框'))
                return
            }
            if (this.examineParams.audit_status == 2 && this.examineParams.audit_msg == '') {
                this.$message.warning(this.L('请填写驳回原因'))
                return
            }
            this.examineParamsSubmit()
        },
        // 选择通过或不通过
        onExamineChange(e) {
            this.examineParams.audit_status = e.target.value
        },
        getLifeToolsList() {
            if (this.queryParams.tools_type == 'scenic') {
                this.columns[6].title = '标签'
                this.$set(this.columns, 6, this.columns[6])
                this.typeMap = {
                    scenic: '景区',
                }
            }
            this.queryParams.page_size = this.pagination.pageSize
            this.queryParams.page = this.pagination.current
            this.request(this.paramsUrl, this.queryParams).then((res) => {
                this.dataList = res.data
                this.pagination.total = res.total
            })
        },
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getLifeToolsList()
        },
        onSearch(text) {
            this.pagination.current = 1
            this.getLifeToolsList()
        },
        getNotAuditNum(){
            if (this.$route.path.indexOf('type') != -1) {
                this.queryParams.tools_type = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
                //查询未审核数量
                this.request(lifeToolsPlatformApi.getNotAuditNum, {tools_type:this.queryParams.tools_type}).then((res) => {
                    if (this.queryParams.tools_type == 'sports') {
                        this.tabList = [
                            {
                                key: 0,
                                tab: this.L('体育审核'),
                                not_audit_num: res.not_audit_num_tools,
                            },
                            {
                                key: 1,
                                tab: this.L('门票审核'),
                                not_audit_num: res.not_audit_num_ticket,
                            },
                        ]
                    } else {
                        this.tabList = [
                            {
                                key: 0,
                                tab: this.L('景区审核'),
                                not_audit_num: res.not_audit_num_tools,
                            },
                            {
                                key: 1,
                                tab: this.L('门票审核'),
                                not_audit_num: res.not_audit_num_ticket,
                            },
                        ]
                    }
                })
            }
        },
    },
}
</script>
<style lang="less" scoped>
.status {
    margin-left: 4%;
    display: inline-flex;
    align-items: center;
    p {
        margin-bottom: 0;
        margin-right: 10px;
    }
}
.info {
    display: flex;
    margin-bottom: 24px;
    span:first-child {
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 8px;
    }
    .ant-input {
        width: 50%;
    }
}
</style>
