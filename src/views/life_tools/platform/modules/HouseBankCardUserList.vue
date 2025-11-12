<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-tabs v-model="tabsKey" @change="onTabsChange">
            <a-tab-pane :key="0" tab="认购排卡用户">
                <a-form-model layout="inline" :model="searchForm">
                    <a-form-model-item>
                        <a-select v-model="searchForm.search_type" style="width: 120px">
                            <a-select-option :value="1">{{L('昵称')}}</a-select-option>
                            <a-select-option :value="2">{{L('手机号')}}</a-select-option>
                        </a-select>
                        <a-input-search style="width: 250px" :placeholder="L('请输入 ')" enter-button @search="onSearch" v-model="searchForm.keywords" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('选择认购房间')">
                        <a-cascader v-model="houseData" style="width: 280px" :options="houseList" :placeholder="L('请选择')" @change="cascaderOnChange" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('认购日期')">
                        <a-range-picker @change="onDatePickerChange" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button type="primary" class="ml-10" @click="importTable">{{L('导出')}}</a-button>
                    </a-form-model-item>
                </a-form-model>
                <br />
                <a-table :columns="columns" :data-source="tableData" row-key="id" :pagination="pagination">
                    <span slot="status_txt" slot-scope="text,record">
                        <a-tag color="orange" v-if="record.status == 0">{{record.status_txt}}</a-tag>
                        <a-tag color="green" v-if="record.status == 1">{{record.status_txt}}</a-tag>
                        <a-tag color="red" v-if="record.status == 2">{{record.status_txt}}</a-tag>
                    </span>
                    <!-- 操作栏 -->
                    <span slot="action" slot-scope="text,record">
                        <div v-if="record.status == 0">
                            <a class="inline-block" @click="subscribeClick(record,'confirm')">{{ L('确认认购') }}</a>
                            <a class="inline-block ml-10" style="color: red" @click="subscribeClick(record,'cancel')">{{ L('放弃') }}</a>
                        </div>
                        <div v-else-if="record.status > 0 && record.status!=1">
                            <a class="inline-block" @click="subscribeClick(record,'again')">{{ L('重新认购') }}</a>
                        </div>
                    </span>
                </a-table>
            </a-tab-pane>
        </a-tabs>
        <a-modal :title="modalTitle" v-model="visible" :confirm-loading="confirmLoading" @ok="handleOk" destroyOnClose>
            <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item :label="L('卡密')" prop="carmi">
                    <a-input v-model="form.carmi" :placeholder="L('请输入卡密')" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import lifePlatformApi from '@/api/life_tools/platform/index'
export default {
    name: 'SaleBuildingList',
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            //搜索框表单
            searchForm: {
                aid: '', //活动id
                keywords: '', //关键词
                search_type: 1, //1-名称，2-手机号
                start_date: '', //开始时间
                end_time: '', //结束时间
                h_id: '', //楼盘id
                b_id: '', //楼栋id
                u_id: '', //单元id
                f_id: '', //楼层id
                r_id: '', //房间id
            },
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            tabsKey: 0,
            tableData: [],
            columns: [
                {
                    title: this.L('昵称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('手机号'),
                    dataIndex: 'phone',
                },
                {
                    title: this.L('认购位次'),
                    dataIndex: 'rank_txt',
                },
                {
                    title: this.L('认购信息'),
                    dataIndex: 'book_info',
                },
                {
                    title: this.L('认购时间'),
                    dataIndex: 'add_time',
                },
                {
                    title: this.L('认购状态'),
                    dataIndex: 'status_txt',
                    scopedSlots: {
                        customRender: 'status_txt',
                    },
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            houseList: [],
            houseData: [],
            modalTitle: '',
            visible: false,
            confirmLoading: false,
            houseParams: null,
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                carmi: '',
            },
            rules: {
                carmi: [{ required: true, message: this.L('卡密为必填项'), trigger: 'blur' }],
            },
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    created() {
        this.searchForm.aid = this.$route.query.id
        this.getHouseDetail()
    },
    methods: {
        // 获取table数据
        getDataList(is_search = false) {
            let params = this.searchForm
            if (is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            params.pageSize = this.pagination.pageSize
            this.request(lifePlatformApi.houseGetCardUser, params).then((res) => {
                this.tableData = res.data
                this.pagination.total = res.total
            })
        },
        getHouseDetail() {
            this.houseData = []
            this.request(lifePlatformApi.houseGetHouseDetail, { aid: this.searchForm.aid }).then((res) => {
                this.houseList = res
                if (res[0]) {
                    this.houseData.push(res[0].value)
                    this.searchForm.h_id = res[0].value
                }
                this.onSearch()
            })
        },
        onTabsChange(e) {
            this.onSearch()
        },
        onSearch() {
            this.getDataList(true)
        },
        onDatePickerChange(date, dateString) {
            this.form.start_date = dateString[0]
            this.form.end_time = dateString[1]
            this.onSearch()
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getDataList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getDataList()
        },
        //确认认购
        subscribeClick(item, type) {
            this.houseItem = item
            let params = {
                id: item.id,
                type: 0, //1-认购，2-重新认购，3-放弃
                trip: '',
            }
            if (type == 'confirm') {
                params.type = 1
                params.trip = this.L('认购')
            } else if (type == 'again') {
                params.type = 2
                params.trip = this.L('重新认购')
            } else if (type == 'cancel') {
                params.type = 3
                params.trip = this.L('是否放弃认购？')
                this.$confirm({
                    title: this.L('提示'),
                    content: `${params.trip}`,
                    onOk: () => {
                        this.request(lifePlatformApi.houseCardUserChangeStatus, params).then((res) => {
                            this.$message.success(this.L('操作成功'))
                            this.getDataList()
                        })
                    },
                })
                return
            }
            this.houseParams = params
            this.modalTitle = params.trip
            this.form.carmi = '';
            this.visible = true
        },
        //导出表格
        importTable() {
            this.request(lifePlatformApi.houseExportCardUser, this.searchForm).then((res) => {
                let url = res.file_url
                if (url) {
                    window.open(url)
                }
            })
        },
        //选择认购房间
        cascaderOnChange(e) {
            this.searchForm.h_id = e[0]
            this.searchForm.b_id = e[1]
            this.searchForm.u_id = e[2]
            this.searchForm.f_id = e[3]
            this.searchForm.r_id = e[4]
            this.onSearch()
        },
        handleOk() {
            let params = this.houseParams
            params.carmi = this.form.carmi;
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    this.request(lifePlatformApi.houseCardUserChangeStatus, params)
                        .then((res) => {
                            this.$message.success(this.L('操作成功'))
                            this.visible = false;
                            this.initConfirmLoading()
                            this.getDataList()
                        })
                        .catch((err) => {
                            this.initConfirmLoading()
                        })
                } else {
                    return false
                }
            })
        },
        initConfirmLoading(time = 300){
            setTimeout(()=>{
                this.confirmLoading = false
            },time)
        },
    },
}
</script>

<style scoped>
</style>