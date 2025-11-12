<template>
  <div class="community-6000c-list ant-pro-page-header-wrap-children-content" style="margin:12px 0 0;">
    <div class="table-operator">
      <a-button type="primary" icon="cloud-download" @click="getSystemCommunities()" :loading="btnLoading">获取6000C社区信息</a-button>
    </div>
    <a-card :bordered="false">
      <a-table :columns="columns" 
               :data-source="list"
               :pagination="pagination"
                ref="table"
               @change="tableChange" >
                    <span slot="action" slot-scope="text, record">
                        <a @click="$refs.createBindVillageModal.add(record.community_id)" v-if="!record.village_id">绑定</a>
                    
                        <a-popconfirm
                            class="ant-dropdown-link"
                            title="确认解除绑定?"
                            ok-text="确认"
                            cancel-text="取消"
                            @confirm="unbindConfirm(record.village_id, record.community_id)"
                            @cancel="cancel"
                            v-if="record.village_id"
                        >
                            <a href="#">解绑</a>
                        </a-popconfirm>

                        <a-divider type="vertical" />

                        <a-popconfirm
                        class="ant-dropdown-link"
                        title="确认删除?"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="deleteConfirm(record.community_id)"
                        @cancel="cancel"
                        >
                            <a href="#">删除</a>
                        </a-popconfirm>
                </span>
      </a-table>
      <create-bind-village ref="createBindVillageModal" @ok="handleOk" :community_id="community_id"/>
    </a-card>
  </div>
</template>
<script>
    import deviceApi from '@/api/system/community/device';
    import createBindVillage from './createBindVillage.vue';
	import store from '@/store';
    const columns = [
        {
            title: '社区名称',
            dataIndex: 'community_name',
            key: 'community_name',
        },
        {
            title: '街道详细地址',
            key: 'address_detail',
            dataIndex: 'address_detail',
        },
        {
            title: '省市区',
            dataIndex: 'community_address',
            key: 'community_address',
        },
        {
            title: '绑定'+store.getters.config.house_name,
            dataIndex: 'bind_txt',
            key: 'bind_txt',
        },
        {
            title: '绑定时间',
            dataIndex: 'bind_time_txt',
            key: 'bind_time_txt',
        },
        {
            title: store.getters.config.single_name+'结构',
            key: 'struct_name',
            dataIndex: 'struct_name',
        },
        {
            title: '社区面积',
            key: 'community_square_meter',
            dataIndex: 'community_square_meter',
        },
        {
            title: '负责人',
            key: 'charge_person_name',
            dataIndex: 'charge_person_name',
        },
        {
            title: '最新获取时间',
            key: 'new_time_txt',
            dataIndex: 'new_time_txt',
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
        name: 'Community6000CList',
        components: {
            createBindVillage
        },
        data() {
            return {
                pagination   : { pageSize: 20, total:10 },
                list         : [],
                community_id :'0',
                search       : { page: 1 },
                page         : 1,
                columns,
                dataLoad     : false,
                btnLoading   : false,
            };
        },
        created() {
            this.getDeviceHikCloudCommunitiesList();
        },
        mounted() {
            this.getDeviceHikCloudCommunitiesList();
        },
        methods: {
            getSystemCommunities() {
                if (this.dataLoad) {
                    return false
                }
                let _this = this
                _this.btnLoading = true;
                _this.dataLoad   = true;
                this.request(deviceApi.getSystemCommunities)
                    .then((res) => {
                        _this.dataLoad = false;
                        console.log('res', res)
                        _this.btnLoading = false;
                    })
            },
            getDeviceHikCloudCommunitiesList() {
                if (this.dataLoad) {
                    return false
                }
                this.search['page'] = this.page;
                let _this = this
                this.dataLoad = true;
                this.request(deviceApi.getDeviceHikCloudCommunitiesList, this.search)
                    .then((res) => {
                        console.log('res', res)
                        _this.list = res.list
                        _this.pagination.total    = res.count    ? res.count    : 0
                        _this.pagination.pageSize = res.pageSize ? res.pageSize : 0
                        this.dataLoad = false;
                        _this.$forceUpdate();
                    })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getDeviceHikCloudCommunitiesList()
                }
            },
            handleOk() {
                this.getDeviceHikCloudCommunitiesList()
            },
            deleteConfirm(community_id) {
                this.request(deviceApi.deleteSystemCommunities,{'community_id':community_id})
                    .then((res) => {
                        this.$message.success('删除成功')
                        this.getDeviceHikCloudCommunitiesList()
                    })
            },
            unbindConfirm(village_id, community_id){
                this.request(deviceApi.unBindHouseToSystemCommunity,{'village_id': village_id, 'community_id':community_id})
                    .then((res) => {
                        this.$message.success('解绑成功')
                        this.getDeviceHikCloudCommunitiesList()
                    })
            },
            add(){

            },
            cancel() {

            },
        }
    };
</script>
<style lang="less" scoped>
  .community-6000c-list .table-operator {
    margin-bottom: 12px;
  }
</style>
<style>
  .ant-popover-content button{
      margin: 0 10px;
  }
</style>