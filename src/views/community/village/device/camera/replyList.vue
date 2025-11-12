<template>
    <div class="message-suggestions-box-1">
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 240px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">设备编号：</label> 
                        <a-input style="width: 140px" placeholder="请输入设备编号" v-model="search.camera_sn"/>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 240px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">设备名称：</label> 
                        <a-input style="width: 140px" placeholder="请输入设备名称" v-model="search.camera_name"/>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 210px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">申请人：</label> 
                        <a-input style="width: 110px" placeholder="请输入申请人" v-model="search.name"/>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 210px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">手机号：</label>
                         
                         <a-input style="width: 110px" placeholder="请输入手机号" v-model="search.phone"/>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" style="padding-left: 1px; padding-right: 1px;width: 210px;">
                    <label style="margin-top: 5px;">申请状态：</label>
                    <a-select default-value="0" style="width: 117px" placeholder="请选择状态" v-model="search.reply_status">
                        <a-select-option value="0">
                            全部
                        </a-select-option>
                        <a-select-option value="1">
                            申请中
                        </a-select-option>
                        <a-select-option value="2">
                            审核通过
                        </a-select-option>
                        <a-select-option value="3">
                            审核拒绝
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 250px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">时间筛选：</label>
                        <a-range-picker @change="dateOnChange" :allowClear="true" v-model="search.dateData" style="width: 150px">
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                    </a-input-group>
                </a-col>
                <a-col :md="2" :sm="24" class="padding-tp10" style="padding-left: 0px;padding-right: 1px;width: 90px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
            </a-row>

        </div>
        <!-- <div class="add-box">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-button type="primary" @click="$refs.addCamera.add()">
                        添加视频监控设备
                    </a-button>
                </a-col>
            </a-row>
        </div> -->
        <a-table
            :columns="columns"
            :data-source="data"
            class="components-table-demo-nested"
            :pagination="pagination"
            @change='table_change'
            :loading="loading"  >
          <span slot="cameraName" slot-scope="text, record" class="pointer">
            <a-tooltip placement="rightTop">
                <template #title>
                <span>设备编号：{{ record.camera_sn }}</span>
                </template>
                {{ record.camera_name }}
            </a-tooltip>
          </span>
          <span slot="action" slot-scope="text, record">
            <a  @click="$refs.replayChek.edit(record.id)" v-if="record.reply_status==1">审核</a>
            <a  @click="$refs.replayChek.edit(record.id,1)" v-else>查看</a>
          </span>
        </a-table>
      <replay-chek ref="replayChek" @ok="getList"/>
    </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    const columns = [
        { title: '设备名', dataIndex: '', key: 'cameraName', scopedSlots: {customRender: 'cameraName'}},
        { title: '申请人', dataIndex: 'name', key: 'name'},
        {title: '手机号', dataIndex: 'phone', key: 'phone'},
        { title: '关系',  dataIndex: 'relation', key: 'relation'},
        { title: '地址',  dataIndex: 'address', key: 'address'},
        { title: '添加时间',  dataIndex: 'add_time_txt', key: 'add_time_txt'},
        { title: '申请开始时间',  dataIndex: 'start_time_txt', key: 'start_time_txt'},
        { title: '申请结束时间',  dataIndex: 'end_time_txt', key: 'end_time_txt'},
        { title: '申请理由',  dataIndex: 'reply_reason', key: 'reply_reason'},
        { title: '审核时间',  dataIndex: 'reply_time_txt', key: 'reply_time_txt'},
        { title: '状态',  dataIndex: 'reply_status_txt', key: 'reply_status_txt'},
        { title: '操作', key: 'action', dataIndex: '', scopedSlots: {customRender: 'action'}},
    ];
    const data = [];
    import replayChek from './replayChek';
    export default {
        name: 'replyList',
        filters: {

        },
        components:{
            replayChek,
        },
        data() {
            return {
                pagination: { pageSize: 10, total:10 ,current:1},
                search: {camera_sn:'',camera_name:'',page: 1 },
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
                this.request(villageApi.getReplyList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
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
        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-box-1 .search-box {
        padding: 20px 20px 0;
        border: 1px solid #e4dfdf;
    }
    .message-suggestions-box-1 .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-box-1 .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-box-1 .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
        padding-top: 15px;
        padding-bottom: 20px;
    }
</style>