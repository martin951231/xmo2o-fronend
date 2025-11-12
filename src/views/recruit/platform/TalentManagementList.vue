<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-row style="width: 100%;height:68px;border-bottom: 1px solid #f1f1f1;background-color: white;line-height: 68px;padding-left: 20px;">
                <a-col :span="4">
                </a-col>
                <a-col :span="3">
                    <a-select @change="handleEducationChange" placeholder="学历" style="width: 200px">
                        <a-select-option v-for="(edu,key) in education" :key="key" :value="key">{{ edu }}
                        </a-select-option>
                    </a-select>
                </a-col>

                <a-col :span="3">
                    <a-select @change="handleJobAgeChange" placeholder="工作经验" style="width: 200px">
                        <a-select-option v-for="(job,key) in job_age" :key="key" :value="key">{{ job }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="3">
                    <a-select @change="handleSexChange" placeholder="性别" style="width: 200px">
                        <a-select-option :key="0" :value="0">不限性别</a-select-option>
                        <a-select-option :key="1" :value="1">男</a-select-option>
                        <a-select-option :key="2" :value="2">女</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="3">
                    <a-select @change="handleJobChange" placeholder="应聘职位" style="width: 200px">
                        <a-select-option v-for="j in job" :key="j.job_id" :value="j.job_id">{{ j.job_name }}
                        </a-select-option>
                    </a-select>
                </a-col>

                <a-col :span="3">
                    <a-select @change="handleDeliverChange" placeholder="状态" style="width: 200px">
                        <a-select-option v-for="(d,key) in deliver_status" :key="key" :value="key">{{ d }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="3">
                    <a-input v-model="formData.user_name" placeholder="输入检索关键字"></a-input>
                </a-col>
                <a-col :span="2" class="text-center">
                    <a-button type="primary" @click="getDeliverList">{{ L('查询') }}</a-button>
                </a-col>
            </a-row>
            <a-layout style="padding: 0 20px; background: #fff">
                <a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                    <a-table :columns="columns"
                             :data-source="data"
                             :pagination="pagination"
                             :locale="{
                                         emptyText:'暂无记录'
                    }"
                             @change="handleTableChange">
                    <span slot="name" slot-scope="text,record">
                        <a class="label-sm blue"
                           @click="$refs.jobResume.getList(record.id)">{{text}}</a>
                     </span>

                        <span slot="sex" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="education" slot-scope="text">
                            {{text}}
                        </span>

                        <span slot="work_time" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="age" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="job_name" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="status" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="desc" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="update_time" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="action" slot-scope="text, record">
                                <a class="label-sm blue"
                                   @click="$refs.historyList.getList(record.id,record.deliver_id)">历史记录</a>
                            </span>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <history-list ref="historyList"></history-list>
        <job-resume ref="jobResume" @handleList="handleList"></job-resume>
    </div>
</template>

<script>
    import recruitMerchantApi from '@/api/recruit/platform/index'
    import HistoryList from "./modules/historyList";
    import JobResume from "./modules/jobResume";

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '性别',
            dataIndex: 'sex',
            scopedSlots: {customRender: 'sex'},
        },
        {
            title: '学历',
            dataIndex: 'education',
            scopedSlots: {customRender: 'education'},
        },
        {
            title: '工作经验',
            dataIndex: 'work_time',
            scopedSlots: {customRender: 'work_time'},
        },
        {
            title: '年龄',
            dataIndex: 'age',
            scopedSlots: {customRender: 'age'},
        },
        {
            title: '投递职位',
            dataIndex: 'job_name',
            scopedSlots: {customRender: 'job_name'},
        },
        {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '备注',
            dataIndex: 'desc',
            scopedSlots: {customRender: 'desc'},
        },
        {
            title: '入库时间',
            dataIndex: 'update_time',
            scopedSlots: {customRender: 'update_time'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "TalentManagementList",
        components: {JobResume, HistoryList},
        data() {
            return {
                columns,
                data: [],
                job: [],
                education: [],
                job_age: [],
                deliver_status: [],
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
                formData: {
                    page: 1,
                    pageSize: 10,
                    education: "",
                    user_name: "",
                    job_age: '',
                    sex: 0,
                    job_id: "",
                    status: "",
                }
            }
        },
        watch: {
            '$route.query.job_id'(val) {
                if (val) {
                    this.formData.job_id = val
                    this.getDeliverList()
                } else {
                    this.formData.job_id = 0
                }
            },
        },
        mounted() {
            this.formData.job_id = this.$route.query.job_id > 0 ? this.$route.query.job_id : 0
            this.getDeliverList()
        },
        methods: {
            getDeliverList() {
                this.data = []
                this.job = []
                this.education = []
                this.job_age = []
                this.deliver_status = []
                this.request(recruitMerchantApi.getList, this.formData).then((res) => {
                    this.data = res.list.list
                    this.job = res.job
                    this.education = res.education
                    this.job_age = res.job_age
                    this.deliver_status = res.deliver_status
                    this.$set(this.pagination, 'total', res.list.count)
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getDeliverList()
                }
            },
            handleEducationChange(val) {
                this.formData.education = val
            },
            handleJobAgeChange(val) {
                this.formData.job_age = val
            },
            handleSexChange(val) {
                this.formData.sex = val
            },
            handleJobChange(val) {
                this.formData.job_id = val
            },
            handleDeliverChange(val) {
                this.formData.status = val
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.formData.page = page
                this.$set(this.pagination, 'current', page)
                this.getDeliverList()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getDeliverList()
            },
        }
    }
</script>

<style scoped>

</style>