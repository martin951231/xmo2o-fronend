<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-row style="width: 100%;height:68px;border-bottom: 1px solid #f1f1f1;background-color: white;line-height: 68px;padding-left: 10px;">

                <a-col :span="24">
                    <a-col :span="2" class="text-right" style="padding-right: 20px;">
                        <a-select style="width: 120px" placeholder="商家" @change="handleMerchantChange">
                            <a-select-option v-for="item in searchForm.merlist" :key="item.mer_id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="2" class="text-right" style="padding-right: 20px;">
                        <a-cascader
                                v-model="queryParam.cates"
                                :field-names="{ label: 'cat_title', value: 'cat_id', children: 'sons' }"
                                :options="searchForm.cates"
                                placeholder="职位类别"
                        />
                    </a-col>

                    <a-col :span="2" class="text-right" style="padding-right: 20px;">
                        <a-select style="width: 120px" placeholder="学历" @change="handleEducationChange">
                            <a-select-option v-for="item in searchForm.education" :key="item.education_id">
                                {{ item.education }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="2" class="text-right" style="padding-right: 20px;">
                        <a-select style="width: 120px" placeholder="工作经验" @change="handleJobAgeChange">
                            <a-select-option v-for="item in searchForm.job_age" :key="item.job_age_id">
                                {{ item.job_age }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="2" class="text-right" style="padding-right: 20px;">
                        <a-select style="width: 120px" placeholder="状态" @change="handleStatusChange">
                            <a-select-option :value="-1">
                                全部
                            </a-select-option>
                            <a-select-option :value="1">
                                已上线
                            </a-select-option>
                            <a-select-option :value="0">
                                已下线
                            </a-select-option>
                        </a-select>
                    </a-col>

                    <a-col :span="3" style="padding-right: 20px;">
                        <a-input v-model="queryParam.keywords" placeholder="输入检索关键字"/>
                    </a-col>
                    <a-col :span="2">
                        <a-button type="primary" @click="getJobListFind">查询</a-button>
                    </a-col>
                </a-col>
            </a-row>
            <a-layout style="padding: 0 20px; background: #fff">
                <a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                    <a-table :columns="columns"
                             :data-source="data"
                             :pagination="pagination"
                             @change="handleTableChange">
                        <span slot="job_name" slot-scope="text, record">
                          <a @click="$refs.jobDetailModel.getEditInfo(record.job_id)">{{text}}</a>
                          </span>
                        <router-link
                                :to="{ path: '/recruit/platform/TalentManagementList', query: { job_id: record.job_id } }"
                                slot="deliveries_nums"
                                slot-scope="text, record"
                                v-if="text"
                        >
                            <a class="label-sm-1 blue">{{text}}</a>
                        </router-link>
                        <span slot="deliveries_nums" v-else>
                            无
                          </span>
                        <span slot="action" slot-scope="text, record">
                            <a v-if="record.is_recom == 1" target="_blank" @click="recomIt(record.job_id,0)">
                                  取消推荐
                            </a>
                            <a v-else @click="recomIt(record.job_id,1)">
                                设为推荐
                            </a>
                            <a @click="delIt(record.job_id)">
                                删除
                            </a>
                            </span>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <job-detail ref="jobDetailModel" @handleUpdate="handleUpdate"></job-detail>
    </div>
</template>

<script>
    import recruitPlatformApi from '@/api/recruit/platform/index'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import JobDetail from "./modules/jobDetail";


    const columns = [
        {
            title: '职位名称',
            dataIndex: 'job_name',
            scopedSlots: {customRender: 'job_name'},
        },
        {
            title: '职位类别',
            dataIndex: 'job_cate',
            scopedSlots: {customRender: 'job_cate'},
        },
        {
            title: '学历',
            dataIndex: 'education',
            scopedSlots: {customRender: 'education'},
            align: "center"
        },
        {
            title: '工作经验',
            dataIndex: 'job_age',
            scopedSlots: {customRender: 'job_age'},
            align: "center"
        },
        {
            title: '年龄要求',
            dataIndex: 'age',
            scopedSlots: {customRender: 'age'},
            align: "center"
        },
        {
            title: '月薪',
            dataIndex: 'wages',
            scopedSlots: {customRender: 'wages'},
            align: "center"
        },
        {
            title: '招聘人数',
            dataIndex: 'recruit_nums',
            scopedSlots: {customRender: 'recruit_nums'},
            align: "center"
        },
        {
            title: '投递人数',
            dataIndex: 'deliveries_nums',
            scopedSlots: {customRender: 'deliveries_nums'},
            align: "center"
        },
        {
            title: '状态',
            dataIndex: 'status_txt',
            scopedSlots: {customRender: 'status_txt'},
            align: "center"
        },
        {
            title: '时间',
            dataIndex: 'time',
            scopedSlots: {customRender: 'time'},
            align: "center"
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "JobList",
        components: {
            ACol,
            ARow,
            JobDetail,
        },
        data() {
            return {
                columns,
                data: [],
                searchForm: {
                    education: [],
                    cates: [],
                    hrlist: [],
                    job_age: [
                        {
                            job_age_id: '',
                            job_age: '全部经验'
                        },
                        {
                            job_age_id: '0',
                            job_age: '经验不限'
                        },
                        {
                            job_age_id: '-1',
                            job_age: '应届毕业生'
                        },
                        {
                            job_age_id: '1,2',
                            job_age: '1~2年'
                        },
                        {
                            job_age_id: '3,5',
                            job_age: '3~5年'
                        },
                        {
                            job_age_id: '6,10',
                            job_age: '6~10年'
                        },
                        {
                            job_age_id: '10,100',
                            job_age: '10年以上'
                        },
                    ],
                },
                queryParam: {
                    page: 1,
                    pageSize: 10,
                    education: -1,
                    job_age: '',
                    status: -1,
                    keywords: '',
                    cates: '',
                    mer_id: 0,
                },
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
            }
        },
        watch: {
            $route: {
                handler() {
                    this.getJobList()
                },
            },
        },
        mounted() {
            this.getJobSearch()
            this.getJobList()
        },
        methods: {
            getJobSearch() {
                this.request(recruitPlatformApi.getJobSearch).then((res) => {
                    this.searchForm.education = res.education
                    this.searchForm.cates = res.cates
                    this.searchForm.hrlist = res.hrlist
                    this.searchForm.merlist = res.merlist
                })
            },
            getJobList() {
                this.request(recruitPlatformApi.getJobList, this.queryParam).then((res) => {
                    this.data = res.list
                    this.pagination.total = res.count
                })
            },
            getJobListFind(){
                this.request(recruitPlatformApi.getJobList, this.queryParam).then((res) => {
                    this.$set(this.pagination, 'current', 1)
                    this.queryParam.page = 1
                    this.data = res.list
                    this.pagination.total = res.count
                })
            },
            handleMerchantChange(val) {
                this.queryParam.mer_id = val
            },
            handleStatusChange(val) {
                this.queryParam.status = val
            },
            handleEducationChange(val) {
                this.queryParam.education = val
            },
            handleJobAgeChange(val) {
                this.queryParam.job_age = val
            },
            recomIt(job_id, val) {
                this.$confirm({
                    title: '是否确定执行该操作?',
                    centered: true,
                    onOk: () => {
                        this.request(recruitPlatformApi.updateJob, {
                            status: val,
                            job_id: job_id
                        }).then((res) => {
                            this.$message.success('操作成功！')
                            this.queryParam = {
                                page: 1,
                                pageSize: 10,
                            }
                            this.getJobList()
                        })
                    },
                    onCancel() {
                    },
                })

            },
            delIt(job_id) {
                this.$confirm({
                    title: '是否确定删除该职位?',
                    centered: true,
                    onOk: () => {
                        this.request(recruitPlatformApi.delJob, {
                            job_id: job_id
                        }).then((res) => {
                            this.queryParam = {
                                page: 1,
                                pageSize: 10,
                            }
                            this.getJobList()
                        })
                    },
                    onCancel() {
                    },
                })

            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    //this.getJobList()
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.queryParam.page = page
                this.$set(this.pagination, 'current', page)
                //this.getJobList()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
               // this.getJobList()
            },
        }
    }
</script>

<style scoped>

</style>