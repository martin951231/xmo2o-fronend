<template>
    <div class="message-suggestions-box-1">
        <div class="add-box">
            <a-row >
                <a-col :md="8" :sm="24">
                    <a-button type="primary" @click="$refs.addDeviceAuth.add(device_id)">
                        添加权限
                    </a-button>
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
            <span slot="action" slot-scope="text, record">
                <a-popconfirm
                    style="margin-left: 10px"
                    class="ant-dropdown-link"
                    title="确认删除?"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="deleteDeviceAuth(record)"
                >
                    <a style="color:red;">删除</a>
                </a-popconfirm>
            </span>

        </a-table>
        <add-device-auth ref="addDeviceAuth" @ok="getList"/>
        
    </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    const columns = [
        { title: '绑定对象', dataIndex: 'allTypeTxt', key: 'allTypeTxt'},
        { title: '绑定对象具体信息', dataIndex: 'authObjectTxt', key: 'authObjectTxt'},
        { title: '设备', dataIndex: 'deviceName', key: 'deviceName'},
        { title: '绑定时间', dataIndex: 'addTimeTxt', key: 'addTimeTxt'},
        { title: '更新时间', dataIndex: 'updateTimeTxt', key: 'updateTimeTxt'},
        { title: '操作', key: 'action', width: '300px',dataIndex: '', scopedSlots: {customRender: 'action'}},
    ];
    const data = [];
    import addDeviceAuth from './addDeviceAuth';
    
    export default {
        name: 'daHuaYunRuiSynData',
        components:{
            addDeviceAuth,
        },
        data() {
            return {
                pagination: { pageSize: 20, total:10 ,current:1},
                search: {camera_sn:'',camera_name:'',page: 1 ,device_type:undefined},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
                device_id: 0,
            };
        },
        activated () {
            this.device_id = this.$route.query.device_id
            this.getList();
        },
        mounted () {
            this.device_id = this.$route.query.device_id
            this.getList();
        },
        methods: {
            deleteDeviceAuth(record) {
                console.log('deleteDeviceAuth', record)
                let delParam = {};
                delParam['device_id'] = this.device_id;
                delParam['auth_id']   = record.auth_id;
                this.request(villageApi.dhDelDeviceAuth, delParam)
                    .then((res) => {
                        console.log('大华',res)
                        this.$message.success('操作成功')
                        this.getList();
                    })
            },
            // 获取列表信息
            getList() {
                if (this.loading) {
                    return false;
                }
                this.loading = true;
                this.search['page']      = this.page;
                this.search['device_id'] = this.device_id;
                this.request(villageApi.dhDeviceBindAuthList, this.search)
                    .then((res) => {
                        console.log('大华',res)
                        this.pagination.count    = res.count ? res.count : 0
                        this.pagination.pageSize = res.limit ? res.limit : 20
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