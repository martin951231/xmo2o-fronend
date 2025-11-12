<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-tabs @change="tabsCallback" v-model="tabKey">
            <!-- 头部操作区 -->
            <a-tab-pane key="package" :tab="L('套餐管理')">
                <a-form-model layout="inline">
                    <a-form-model-item>
                        <a-button type="primary" @click="addPackage">{{L('新建套餐')}}</a-button>
                    </a-form-model-item>
                </a-form-model>
                <!-- 列表数据 -->
                <a-table class="mt-10" :columns="packageColumns" :data-source="packageData" rowKey="id" :pagination="packagePagination" @change="onPageChange">
                    <span slot="classify" slot-scope="text,record">
                        <span v-for="(item,index) in record.classify" :key="item.cid">{{item.cat_name}}{{record.classify.length-1 <= index?'':'/'}}</span>
                    </span>
                    <span slot="action" slot-scope="text,record">
                        <a class="ml-10 inline-block" @click="editAct(record)">{{L('编辑')}}</a>
                        <a class="ml-10 inline-block" @click="delAct(record)" style="color: red">{{L('删除')}}</a>
                    </span>
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="statistics" :tab="L('数据统计')">
                <a-form-model layout="inline">
                    <a-form-model-item>
                        <a-select v-model="statisticsParams.search_type" style="width:150px">
                            <a-select-option :value="1">{{L('用户名')}}</a-select-option>
                            <a-select-option :value="2">{{L('手机号')}}</a-select-option>
                            <a-select-option :value="3">{{L('套餐名称')}}</a-select-option>
                        </a-select>
                        <a-input v-model="statisticsParams.keywords" :placeholder="L('请输入')" style="width:200px" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('选择日期')">
                        <a-range-picker @change="onDateChange" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button type="primary" @click="onSearch" class="mr-10">{{L('搜索')}}</a-button>
                        <a-button @click="exportClick">{{L('导出')}}</a-button>
                    </a-form-model-item>
                </a-form-model>
                <!-- 列表数据 -->
                <a-table class="mt-20" :columns="statisticColumns" :data-source="statisticsData" rowKey="id" :pagination="statisticsPagination" @change="onPageChange">
                    <span slot="action" slot-scope="text,record">
                        <a-popover v-model="dateVisible" :title="L('修改有效期')" trigger="click">
                            <div slot="content">
                                <a-row>
                                    <a-date-picker format="YYYY-MM-DD HH:mm" :show-time="{ format: 'HH:mm' }" @change="onValidityDateChange" :disabledDate="disabledDate" :showToday="false" :value="expire_time?moment(expire_time):null" />
                                    <a-button class="ml-10" type="primary" size="small" @click="editDate(record,'confirm')">{{L('确定')}}</a-button>
                                </a-row>
                            </div>
                            <a class="ml-10 inline-block" @click="editDate(record,'open')">{{L('修改有效期')}}</a>
                        </a-popover>
                    </span>
                </a-table>
            </a-tab-pane>
        </a-tabs>
        <a-modal :title="modalTitle" v-model="visible" @ok="handleOk" width="1000px" destroyOnClose>
            <div class="modal-box" v-if="modalType == 'package_add' || modalType== 'package_edit'">
                <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item :label="L('套餐项目名称')" :required="true">
                        <a-input v-model="formData.name" :placeholder="L('请输入')" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('绑定分类')" :required="true">
                        <a-tree
                            v-model="formData.classify"
                            checkable
                            :expanded-keys="expandedKeys"
                            :auto-expand-parent="autoExpandParent"
                            :selected-keys="selectedKeys"
                            :tree-data="classifyCategoryList"
                            @expand="onExpand"
                            @check="onCheck"
                        />
                    </a-form-model-item>
                    <a-form-model-item :label="L('套餐')" :required="true">
                        <a-button type="primary" @click="addPackages">{{L('新建')}}</a-button>
                        <div class="form-box" v-if="formData.packages.length">
                            <div v-for="(item,index) in formData.packages" :key="index" class="form-item">
                                <div class="item">
                                    <div class="title">
                                        {{L('套餐'+(index + 1)+'名称')}}
                                        <a-tooltip placement="top">
                                            <template slot="title">
                                                <span>{{L('用户端购买展示')}}</span>
                                            </template>
                                            <a-icon type="question-circle" />
                                        </a-tooltip>：
                                    </div>
                                    <div>
                                        <a-input v-model="item.name" style="width:150px" />
                                    </div>
                                    <a-button type="danger" @click="deletePackages(item,index)" size="small" class="ml-10">{{'删除'}}</a-button>
                                </div>
                                <div class="item">
                                    <div class="title">{{L('套餐'+(index + 1)+'金额')}}：</div>
                                    <div>
                                        <a-input-number v-model="item.price" :min="0" :step="0.1" style="width:150px" />
                                        <span class="ml-10">{{L('元')}}</span>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="title">{{L('套餐'+(index + 1)+'有效期')}}：</div>
                                    <div>
                                        <a-input-number v-model="item.effective_days" :min="0" style="width:150px" />
                                        <span class="ml-10">{{L('天')}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
    </div>
</template>

<script>
import classifyInfoPlatformApi from '@/api/classify_info/platform/index.js'
import moment from 'moment'
export default {
    name: 'PackageManagement',

    data() {
        return {
            tabKey: 'package',
            packageColumns: [
                { title: this.L('套餐名称'), dataIndex: 'name' },
                { title: this.L('绑定分类'), dataIndex: 'classify', scopedSlots: { customRender: 'classify' } },
                { title: this.L('操作'), dataIndex: 'action', scopedSlots: { customRender: 'action' } },
            ],
            packageData: [],
            packagePagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
                'show-total': (total) => this.L(`共 X1 条记录`, { X1: total }),
                'show-size-changer': true,
            },
            visible: false,
            modalTitle: this.L('新建套餐'),
            modalType: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            formData: {
                name: '',
                classify: [],
                packages: [],
            },
            classifyCategoryList: [],
            expandedKeys: [],
            autoExpandParent: true,
            selectedKeys: [],
            statisticsData: [],
            dateVisible: false,
            statisticsParams: {
                search_type: 1,
                keywords: '',
                start_time: '',
                end_time: '',
            },
            statisticsPagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
                'show-total': (total) => this.L(`共 X1 条记录`, { X1: total }),
                'show-size-changer': true,
            },
            statisticColumns: [
                { title: this.L('用户名'), dataIndex: 'user_nickname' },
                { title: this.L('手机号'), dataIndex: 'user_phone' },
                { title: this.L('购买套餐'), dataIndex: 'name' },
                { title: this.L('套餐金额'), dataIndex: 'price' },
                { title: this.L('有效期'), dataIndex: 'expire_time' },
                { title: this.L('操作'), dataIndex: 'action', scopedSlots: { customRender: 'action' } },
            ],
            tableItem: null,
            expire_time: '',
        }
    },
    created() {
        this.getList()
        this.getClassifyCategory()
    },

    methods: {
        moment,
        //获取套餐列表
        getList() {
            let params = {}
            params.page = this.packagePagination.current
            params.pageSize = this.packagePagination.pageSize
            this.request(classifyInfoPlatformApi.classifyMenuList, params).then((res) => {
                this.packageData = res.data
                this.packagePagination.total = res.total
                if (this.packageData.length == 0 && this.packagePagination.current > 1) {
                    this.packagePagination.current--
                    this.getList()
                }
            })
        },
        //获取分类列表
        getClassifyCategory() {
            this.request(classifyInfoPlatformApi.classifyCategory).then((res) => {
                this.classifyCategoryList = res
            })
        },
        getStatistics(type) {
            let params = {...this.statisticsParams}
            params.page = this.statisticsPagination.current
            params.pageSize = this.statisticsPagination.pageSize
            if(type == 'export'){
                params.export = 1
            }
            this.request(classifyInfoPlatformApi.orderList, params).then((res) => {
                if(type == 'export' && res.url){
                    window.open(res.url)
                    return
                }
                this.statisticsData = res.data
                this.statisticsPagination.total = res.total
            })
        },
        //新建
        addPackage() {
            this.modalTitle = this.L('新建套餐')
            this.modalType = 'package_add'
            this.visible = true
            this.formData = {
                name: '',
                classify: [],
                packages: [],
            }
            this.expandedKeys = []
        },
        //编辑
        editAct(item) {
            this.modalType = 'package_edit'
            this.modalTitle = this.L('编辑套餐')
            this.tableItem = item
            this.formData = {
                name: item.name,
                classify: item.classify_id_arr,
                packages: item.classify_detail_list,
            }
            this.expandedKeys = item.classify.map((v) => v.fcid)
            this.visible = true
        },
        //删除
        delAct(item) {
            this.$confirm({
                title: this.L('确定删除吗?'),
                okText: this.L('确定'),
                okType: 'danger',
                cancelText: this.L('取消'),
                onOk: () => {
                    let params = {
                        menu_id: item.id,
                    }
                    this.request(classifyInfoPlatformApi.delClassifyMenu, params).then((res) => {
                        this.$message.success(this.L('删除成功'))
                        this.getList()
                    })
                },
            })
        },
        //切换导航栏事件
        tabsCallback() {
            if (this.tabKey == 'package') {
                this.getList()
            } else if (this.tabKey == 'statistics') {
                this.getStatistics()
            }
        },
        //弹框确认事件
        handleOk() {
            let url = classifyInfoPlatformApi.saveClassifyMenu
            let params = {
                name: '',
                classify_ids: [],
            }
            params.name = this.formData.name
            params.classify_ids = this.formData.classify.filter((v) => {
                let item = JSON.stringify(v)
                return item.indexOf('-') > -1
            })
            params.classify_detail_list = this.formData.packages

            if (this.modalType == 'package_add') {
            } else if (this.modalType == 'package_edit') {
                params.menu_id = this.tableItem.id
            }
            if (this.formData.name == '') {
                this.$message.warning(this.L('请输入套餐项目名称'))
                return
            }
            if (this.formData.classify.length == 0) {
                this.$message.warning(this.L('请绑定分类'))
                return
            }
            if (this.formData.packages.length == 0) {
                this.$message.warning(this.L('请新建套餐'))
                return
            }
            this.request(url, params).then((res) => {
                this.visible = false
                this.$message.success(this.L(this.modalType == 'package_add' ? '添加成功' : '编辑成功'))
                this.getList()
            })
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onCheck(checkedKeys) {
            this.formData.classify = checkedKeys
        },
        //新建套餐组
        addPackages() {
            let params = {
                name: '',
                effective_days: '',
                price: 0,
            }
            this.formData.packages.push(params)
        },
        //删除套餐
        deletePackages(item, index) {
            this.$delete(this.formData.packages, index)
        },
        //选择日期
        onDateChange(date, dateString) {
            this.statisticsParams.start_time = dateString[0]
            this.statisticsParams.end_time = dateString[1]
        },
        onValidityDateChange(date, dateString) {
            this.expire_time = dateString
        },
        disabledDate(current) {
            return current && current < moment().endOf('day')
        },
        //修改日期
        editDate(item, type) {
            if(type == 'open'){
                this.expire_time = item.expire_time
            }
            if (type == 'confirm') {
                this.dateVisible = false
                let params = {
                    expire_time: this.expire_time,
                    order_id: item.id,
                }
                this.request(classifyInfoPlatformApi.changeExpire, params).then((res) => {
                    this.$message.success(this.L('修改成功'))
                    this.getStatistics()
                })
            }
        },
        //搜索
        onSearch() {
            if (this.tabKey == 'package') {
                this.packagePagination.current = 1
                this.getList()
            } else if (this.tabKey == 'statistics') {
                this.statisticsPagination.current = 1
                this.getStatistics()
            }
        },
        //导出
        exportClick() {
            this.getStatistics('export')
        },
        // 页码变化
        onPageChange(event) {
            if (this.tabKey == 'package') {
                this.packagePagination.current = event.current
                this.packagePagination.pageSize = event.pageSize
            } else if (this.tabKey == 'statistics') {
                this.statisticsPagination.current = event.current
                this.statisticsPagination.pageSize = event.pageSize
            }
            this.onSearch()
        },
    },
}
</script>

<style lang="less" scoped>
.form-box {
    background-color: #f2f2f2;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;

    .form-item {
        margin-bottom: 30px;
        .item {
            display: flex;
            align-items: center;
            .title {
                width: 130px;
                text-align: right;
            }
        }
    }
    .form-item:last-child {
        margin-bottom: 0;
    }
}
.modal-box {
    height: 65vh;
    overflow-y: auto;
}
</style>