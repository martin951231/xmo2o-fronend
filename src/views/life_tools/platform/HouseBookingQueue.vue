<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-tabs v-model="tabsKey" @change="onTabsChange">
            <a-tab-pane :key="0" tab="排卡活动列表">
                <a-form-model layout="inline" :model="searchForm">
                    <a-form-model-item>
                        <a-button type="primary" @click="addActivity">{{L('新建活动')}}</a-button>
                    </a-form-model-item>
                </a-form-model>
                <br />
                <a-table :columns="columns" :data-source="datalist" row-key="id" :pagination="pagination">
                    <template slot="user" slot-scope="text, record">
                        <a @click="toBankCardUserList(record)">{{L('认购排卡用户')}}</a>
                    </template>
                    <template slot="action" slot-scope="text, record">
                        <a class="mr-10" @click="editList(record)">编辑</a>
                        <a style="color:red" @click="delList(record)">删除</a>
                    </template>
                </a-table>
            </a-tab-pane>
        </a-tabs>
        <a-modal :maskClosable="false" :title="modalTitle" v-model="modalVisible" :confirm-loading="confirmLoading" @ok="modalHandleOk" width="700px" destroyOnClose>
            <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules" ref="ruleForm">
                <a-form-model-item :label="L('活动名称')" prop="name">
                    <a-input v-model="form.name" :placeholder="L('请输入')" class="form-input" />
                </a-form-model-item>
                <a-form-model-item :label="L('起止日期')" prop="start_time">
                    <a-range-picker
                        :value="[form.start_time?moment(form.start_time):null, form.end_time?moment(form.end_time):null]"
                        @change="onDatePickerChange"
                        format="YYYY-MM-DD HH:mm"
                        :show-time="{format: 'HH:mm'}"
                    />
                </a-form-model-item>
                <a-form-model-item :label="L('选择参与楼盘')" prop="house_ids">
                    <a-select mode="multiple" :placeholder="L('请选择')" v-model="form.house_ids" class="form-input">
                        <a-select-option v-for="item in houseList" :key="item.houses_id" :value="item.houses_id">{{ item.title }}</a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import lifePlatformApi from '@/api/life_tools/platform/index'
import moment from 'moment'
export default {
    name: 'HouseBookingQueue',
    data() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            datalist: [],
            columns: [
                {
                    title: this.L('新建活动'),
                    dataIndex: 'name',
                    scopedSlots: { customRender: 'name' },
                },
                {
                    title: this.L('参与楼盘'),
                    dataIndex: 'house_name',
                    scopedSlots: { customRender: 'house_name' },
                },
                {
                    title: '活动时间',
                    dataIndex: 'time_txt',
                },
                {
                    title: '排卡用户',
                    dataIndex: 'user',
                    scopedSlots: { customRender: 'user' },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            //搜索框表单
            searchForm: {
                keyword: '',
                goods_type: 'mall',
                search_type: 1,
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
            modalTitle: '',
            modalVisible: false,
            confirmLoading: false,
            form: {
                name: '',
                start_time: '',
                end_time: '',
                house_ids: [],
            },
            rules: {
                name: [{ required: true, message: this.L('请输入活动名称'), trigger: 'blur' }],
                start_time: [{ required: true, message: this.L('请选择起止日期'), trigger: 'blur' }],
                house_ids: [{ required: true, message: this.L('请选择楼盘'), trigger: 'blur' }],
            },
            houseList: [],
            formType: 'add',
        }
    },
    created() {
        this.getDataList(false)
        this.getHouseList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        moment,
        //新建活动
        addActivity() {
            this.modalTitle = this.L('新建活动')
            this.formType = 'add'
            this.confirmLoading = false
            this.modalVisible = true
            this.resetForm()
        },
        editList(item) {
            this.formType = 'edit'
            this.modalTitle = this.L('编辑活动')
            this.getHouseList(item.id);
            this.modalVisible = true
            this.form = JSON.parse(JSON.stringify(item))
            this.form.house_ids = this.form.house_ids.map((v) => {
                return Number(v)
            })
        },
        //获取楼盘列表
        getHouseList(id = 0) {
            this.request(lifePlatformApi.houseCardGetHouseList, { id }).then((res) => {
                this.houseList = res
            })
        },
        delList(item) {
            this.$confirm({
                title: '是否确定删除?',
                centered: true,
                onOk: () => {
                    this.request(lifePlatformApi.houseCardDel, { id: item.id }).then((res) => {
                        this.getDataList()
                    })
                },
            })
        },
        // 获取table数据
        getDataList(is_search) {
            let params = {}
            if (is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            params.pageSize = this.pagination.pageSize
            this.request(lifePlatformApi.houseCardGetList, params).then((res) => {
                this.datalist = res.data
                this.$set(this.pagination, 'total', res.total)
                if (this.pagination.current > 1 && res.data.length == 0) {
                    this.getDataList(true)
                }
            })
        },
        onTabsChange(e) {
            this.onSearch()
        },
        onSearch() {
            this.getDataList(true)
        },
        onDatePickerChange(date, dateString) {
            this.form.start_time = dateString[0]
            this.form.end_time = dateString[1]
        },
        //弹窗确定事件
        modalHandleOk() {
            console.log(this.form)
            let url = ''
            if (this.formType == 'add') {
                url = lifePlatformApi.houseCardAdd
            } else if (this.formType == 'edit') {
                url = lifePlatformApi.houseCardEdit
            }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    this.request(url, this.form)
                        .then((res) => {
                            this.confirmLoading = false
                            this.modalVisible = false
                            this.$message.success(this.L(this.formType == 'add' ? '添加成功' : '编辑成功'))
                            this.getDataList()
                        })
                        .catch((err) => {
                            this.confirmLoading = false
                        })
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.$nextTick(() => {
                this.$refs.ruleForm.resetFields()
                this.form = {
                    name: '',
                    start_time: '',
                    end_time: '',
                    house_ids: [],
                }
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.onSearch()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.onSearch()
        },
        //去认购用户页面
        toBankCardUserList(item){
            this.$router.push({
                path: `/life_tools/platform/modules/HouseBankCardUserList`,
                query: {
                    id: item.id
                },
            })
        },
    },
}
</script>

<style scoped>
.form-input {
    width: 350px;
}
</style>