<template>
    <div class="message-suggestions-box-1">
        <div class="add-box">
            <a-row >
                <a-col :md="8" :sm="24">
                    <a-button type="primary" @click="$refs.batchSynBuildUnitRooms.add()">
                        批量新增{{$store.getters.config.single_name}}{{$store.getters.config.floor_name}}房屋
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
                <a  @click="$refs.bindDahuaYuiRuiData.bind(record)">绑定{{record.orgTypeTxt}}</a>
                <a-divider type="vertical" v-if="record.isSyn"/>
                <a  @click="openUnitList(record)" v-if="record.isSyn">{{record.orgName}}{{$store.getters.config.floor_name}}列表</a>
            </span>

        </a-table>
        <batch-syn-build-unit-rooms ref="batchSynBuildUnitRooms" @ok="getList"/>
        <bind-da-hua-yui-rui-data ref="bindDahuaYuiRuiData" @ok="getList"/>
        
    </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    import batchSynBuildUnitRooms from './batchSynBuildUnitRooms';
    import bindDaHuaYuiRuiData from './bindDaHuaYuiRuiData';
	import store from '@/store';
    const columns = [
        { title: store.getters.config.single_name+'序号', dataIndex: 'buildingNumber', key: 'buildingNumber'},
        { title: '名称', dataIndex: 'orgName', key: 'orgName'},
        { title: store.getters.config.floor_name+'数量', dataIndex: 'unitNum', key: 'unitNum'},
        { title: store.getters.config.floor_name+'楼层数', dataIndex: 'floorNum', key: 'floorNum'},
        { title: '楼层房屋数', dataIndex: 'houseNum', key: 'houseNum'},
        { title: '房屋总数', dataIndex: 'totalHouseNum', key: 'totalHouseNum'},
        { title: '同步匹配', dataIndex: 'sysModel', key: 'sysModel'},
        { title: '匹配对象', dataIndex: 'sysModelName', key: 'sysModelName'},
        { title: '操作', key: 'action', width: '300px',dataIndex: '', scopedSlots: {customRender: 'action'}},
    ];
    const data = [];
    
    export default {
        name: 'daHuaYunRuiSynData',
        components:{
            batchSynBuildUnitRooms,
            bindDaHuaYuiRuiData,
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
            };
        },
        mounted () {
            this.getList();
        },
        methods: {
            openUnitList(record) {
                console.log('path-record', record, record.orgCode)
                this.$router.push({path: '/village/village.device/daHuaYunRuiSynUnitsData', query: { orgCode:record.orgCode, parent_bind_id:record.bind_id } })
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getDHBuidingUnitRoomList, this.search)
                    .then((res) => {
                        console.log('大华',res)
                        this.pagination.total    = res.totalRows ? res.totalRows : 0
                        this.pagination.pageSize = res.pageSize  ? res.pageSize : 20
                        this.data = res.pageData
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