<template>

    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

        <a-row style="margin-top:10px;">
            <a-col :span="24">

                <a-input-group compact>
                    <label style="line-height: 30px;margin-left: 15px;">搜索：</label>
                    <a-select :value="queryParams.search_by" @change="selectSearchBy" style="width: 100px;">
                        <a-select-option v-for="(item, index) in searchBy" :key="item.key">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                    <a-input style="width: 220px" :placeholder="'请输入'+searchByMap[queryParams.search_by]"
                        :value="queryParams.keywords" @change="keywordsChange" />

                    <label style="line-height: 30px;margin-left: 15px;">选择日期：</label>
                    <a-range-picker @change="selectDate" />
                    
                    <label style="line-height: 30px;margin-left: 15px;">核销状态：</label>
                    <a-select v-model="queryParams.verify_type"style="width: 100px;">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">未核销</a-select-option>
                        <a-select-option :value="2">已核销</a-select-option>
                    </a-select>
                    <a-button type="primary" @click="searchBtn" style="width: 80px;margin-left: 10px;">搜索</a-button>

                </a-input-group>
            </a-col>
        </a-row>


        <a-row style="margin-top:15px;">

            <a-table style="background: #ffffff" :columns="columns" rowKey="id" :data-source="dataList"
                @change="changePage" :pagination="pagination">

 
                <span slot="time" slot-scope="text,item">
                    {{item.appoint.start_time_text}} ~ {{item.appoint.end_time_text}}
                </span>

            </a-table>

        </a-row>
    </div>
</template>

<script>
    import lifeToolsStorestaffApi from '@/api/life_tools/storestaff/index'
    export default {
        data() {
            return {
                queryParams: {
                    search_by: 1,
                    keywords: '',
                    start_date: '',
                    end_date: '',
                    page_size: 10,
                    verify_type: 0
                },
                searchBy: [{
                        key: 1,
                        value: '订单号'
                    },
                    {
                        key: 2,
                        value: '活动名称'
                    }
                ],
                searchByMap: {
                    '1': '订单号',
                    '2': '活动名称'
                },
                store_id: 0, 
                dataList: [],
                isAllCheck: false,
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                columns: [{
                        title: this.L('订单号'),
                        dataIndex: 'order.pigcms_id'
                    },
                    {
                        title: this.L('活动名称'),
                        dataIndex: 'appoint.title'
                    },
                    {
                        title: this.L('报名费'),
                        dataIndex: 'order.price'
                    },
                    {
                        title: this.L('活动时间'),
                        dataIndex: 'time',
                        key: 'time',
                        scopedSlots: {
                            customRender: 'time'
                        },
                    },
                    {
                        title: this.L('真实姓名'),
                        dataIndex: 'order.name'
                    },
                    {
                        title: this.L('手机号'),
                        dataIndex: 'order.phone'
                    },
                    {
                        title: this.L('备注'),
                        dataIndex: 'order.remark'
                    },
                    {
                        title: this.L('核销时间'),
                        dataIndex: 'add_time_text'
                    }
                ],
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.queryParams.page_size = this.pagination.pageSize
                this.queryParams.page = this.pagination.current;
                this.request(lifeToolsStorestaffApi.verifyList, this.queryParams).then((res) => {
                    console.log(res.data)
                    this.pagination.total = res.total
                    this.dataList = res.data

                });
            },
            keywordsChange(e) {
                this.queryParams.keywords = e.target.value
            },

            selectSearchBy(val) {
                this.queryParams.search_by = val
            },
            searchBtn() {
                this.getData()
            },
            selectDate(value, dateString) {
                this.queryParams.start_date = dateString[0]
                this.queryParams.end_date = dateString[1]
            },
            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getData();
            },
            onSearch(val) {
                this.queryParam.keywords = val
            },
            searchByChange(val) {
                this.queryParam.search_by = val
            }
        },
    }
</script>

<style>
</style>
