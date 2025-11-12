<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">

            <a-table :columns="columns" :data-source="list"
                     :pagination="pagination"
                     rowKey="id"
                     @change="tableChange">

               <span slot="trigger_type" slot-scope="text, record">
                  <a-tag  v-if="record.trigger_type == 'inster'" :color="'green'"  >
                    新增
                  </a-tag>
                    <a-tag  v-if="record.trigger_type == 'update'" :color="'geekblue'"  >
                    更新
                  </a-tag>
                    <a-tag  v-if="record.trigger_type == 'delete'" :color="'volcano'"  >
                    删除
                  </a-tag>
               </span>

                <span slot="action" slot-scope="text, record">
                  <a @click="detail(record.id)">变更详细</a>
                </span>

            </a-table>
            <login-log-detail  :log_fid="log_fid"   :visible="drawerVisible" @closeDrawer="closeDrawer"/>

        </a-card>

    </div>
</template>
<script>
import configVillageApi from "@/api/community/village"

import loginLogDetail from "@/views/community/village/villageLog/loginLogDetail";

const columns = [
    {
        title: '操作时间',
        dataIndex: 'add_time',
        key: 'add_time',

    },{
        title: '操作账号',
        dataIndex: 'account',
        key: 'account',

    },{
        title: '账号名称',
        dataIndex: 'realname',
        key: 'realname',

    },{
        title: '登录IP',
        dataIndex: 'ip',
        key: 'ip',

    },{
        title: '登录来源',
        dataIndex: 'country',
        key: 'country'
    },
    {
        title: '登录方式',
        dataIndex: 'login_type',
        key: 'login_type'
    },
    {
        title: '操作系统',
        dataIndex: 'os',
        key: 'os'
    }, {
        title: '操作系统版本',
        dataIndex: 'os_version',
        key: 'os_version',
    }, {
        title: '浏览器',
        dataIndex: 'browser_name',
        key: 'browser_name'
    },, {
        title: '浏览器版本',
        dataIndex: 'browser_version',
        key: 'browser_version'
    },
    {
        title: '操作',
        key: 'action',
        dataIndex: '',
        scopedSlots: {
            customRender: 'action'
        }
    },
];
export default {
    name: 'villageSettingLog',
    components: {
        loginLogDetail,
    },
    data() {
        return {
            list: [],
            drawerVisible: false,
            sortedInfo: null,
            pagination: {
                current:1,
                pageSize: 20,
                total:20,
                showSizeChanger: false, // 显示可改变每页数量
                pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                showTotal: total => `共 ${total} 条`, // 显示总数
                onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
            },
            search: {page: 1},
            page: 1,
            search_data: [],
            id: 0,
            columns,
            log_fid:0
        };
    },
    mounted() {
        this.getLogDataList()
    },
    created() {
    },
    methods: {
        
        getLogDataList() {
            this.page = this.pagination.current;
            this.request(configVillageApi.villageLoginLogApi, {'page': this.page,'parent_id':0})
                .then((res) => {
                    console.log('res', res);
                    this.list = res.list;
                    this.pagination.total = res.count ? res.count : 0
                    this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                })
        },
        tableChange(e) {
            if (e.current && e.current > 0) {
                this.pagination.current = e.current;
                this.getLogDataList()
            }
        },
        onTableChange(page,pageSize){
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            // this.getLogDataList()

        },
        cancel() {

        },
        handleOks() {
            // window.location.reload();
        },
        closeCharge(){
            this.showCharge = false
        },
        detail(id){
            this.drawerVisible = true
            this.log_fid = id
        },
        closeDrawer(flag){
            this.log_fid = 0
            this.drawerVisible = false
        },

    },
};
</script>
<style scoped>


</style>