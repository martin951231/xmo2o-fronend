<template>
    <div class="message-suggestions-box-1">
        <div class="search-box">
            <a-row :gutter="24">
                <!-- <a-col :md="8" :sm="24" class="padding-tp10" style="width: 250px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">姓名：</label> <a-input style="width: 150px" placeholder="请输入姓名" v-model="search.name"/>
                    </a-input-group>
                </a-col> -->
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 250px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">指纹锁编号：</label> <a-input style="width: 150px" placeholder="请输入指纹锁编号" v-model="search.device_sn"/>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 250px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">指纹锁名称：</label> <a-input style="width: 150px" placeholder="请输入指纹锁名称" v-model="search.device_name"/>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 250px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">时间筛选：</label> 
                        <a-range-picker @change="dateOnChange" :allowClear="true" v-model="search.dateData" style="width: 150px">
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" >
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                    <a-divider type="vertical"/>
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>
            </a-row>

        </div>
       
        <a-table
            :columns="columns"
            :data-source="data"
            class="components-table-demo-nested"
            :pagination="pagination"
            @change='table_change'
            :loading="loading"  >
        </a-table>
        
        
    </div>

</template>
<script>
    import villageDeviceApi from '@/api/community/village/device'
    const columns = [
        { title: '姓名',         dataIndex: 'name',          key: 'name'},
        { title: '手机号',       dataIndex: 'phone',         key: 'phone'},
        { title: '指纹锁编号SN', dataIndex: 'device_sn',      key: 'device_sn'},
        { title: '指纹锁名称',   dataIndex: 'log_name',       key: 'log_name'},
        { title: '所在位置',     dataIndex: 'address_txt',    key: 'address_txt'},
        { title: '操作状态',     dataIndex: 'log_status_txt', key: 'log_status_txt'},
        { title: '开门时间',     dataIndex: 'log_time_txt',   key: 'log_time_txt'},
    ];
    const data = [];
    export default {
        name: 'fingerprintOpenRecordList',
        data() {
            return {
                pagination: { pageSize: 10, total:10 ,current:1},
                search: {device_sn:'',device_name:'',page: 1, date: ''},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
            };
        },
        mounted () {
            this.getList();
            this.getType();
        },
        methods: {
            dateOnChange (date, dateString) {
                this.search.date = dateString
                console.log('search', this.search)
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageDeviceApi.fingerprintGetHouseUserlog, this.search)
                    .then((res) => {
                        this.pagination.total    = res.count ? res.count : 0
                        this.pagination.pageSize = res.pageSize ? res.pageSize : 20
                        this.data                = res.list
                        this.loading             = false
                    })
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                if (e.current && e.current>0) {
                    this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList();
                }
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.page=1;
                let val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                console.log('searchList');
                this.table_change(val);
            },
            // 进行重置
            resetList() {
                this.search = {camera_sn:'',camera_name:'',page: 1 , date: ''};
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        margin-top: 10px;
        background-color: white;
    }
    .message-suggestions-box-1 .search-box {
        padding: 0 20px 0;
    }
    .message-suggestions-box-1 .add-box {
        padding: 10px 10px 10px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
        padding-top: 15px;
        padding-bottom: 20px;
    }

    /deep/ .but-box{
        width: 365px !important;padding-left: 0 !important;
    }

</style>