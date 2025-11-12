<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <label style="margin-top: 5px;">活动名称：</label><a-input style="width: 70%" v-model="search.name"/>
            </a-input-group>
          </a-col>
          <a-col :md="2" :sm="2">
            <a-button type="primary" icon="search" @click="searchList()">
              查询
            </a-button>
          </a-col>
          <a-col :md="2" :sm="2">
            <a-button  @click="resetList()">重置</a-button>
          </a-col>
        </a-row>
      </div>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.party_activity_id)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteConfirm(record.party_activity_id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
<!--           <router-link :to="{ path:'/community/streetCommunity/partyActivity/ActivityApplyList',params:{id:record.party_activity_id}}" style="color: #1890ff;">{{record.party_activity_id}}报名列表</router-link>-->
           <router-link :to="{ name:'ActivityApplyList',params:{id:record.party_activity_id}}" style="color: #1890ff;">报名列表</router-link>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <activity-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import activityInfo from './PartyActivityInfo.vue'
    const statusMap = {
        1: {
            status: 'success',
            text: '开启'
        },
        2: {
            status: 'default',
            text: '禁止'
        }
    }
    export default {
        name: 'PartyActivityList',
        components: {
            activityInfo
        },
        data() {
            return {
                list:[],
                visible: false,
                confirmLoading: false,
                sortedInfo:null,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                search_data:[],
            };
        },
        mounted(){
            this.getMeeting()
        },
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '标题',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'add_time',
                        key: 'add_time',
                    },
                    {
                        title: '最后修改时间',
                        dataIndex: 'last_time',
                        key: 'last_time',
                    },
                    {
                        title: '总名额/剩余名额',
                        dataIndex: 'num',
                        key: 'num',
                    },
                    {
                        title: '排序',
                        dataIndex: 'sort',
                        key: 'sort',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        key: 'status',
                        scopedSlots: { customRender: 'status' },
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
                return columns;
            },
        },
        created() {},
        methods: {
            callback(key) {
                console.log(key);
            },
            getMeeting() {
                this.search['page'] = this.page;
                this.request(streetCommunityApi.getPartyActivityList, this.search)
                    .then((res) => {
                        console.log('res', res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getMeeting()
                }
            },
            cancel() {

            },
            handleOks() {
                this.getMeeting();
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.getMeeting()
            },
            // 进行重置
            resetList() {
                console.log('search', this.search);
                console.log('search_data', this.search_data);
                this.search = { 'key_val': 'name', value: '', status: '', date: [], page: 1 }
                this.search_data = [];
                this.getMeeting()
            },
            deleteConfirm(id){
                this.request(streetCommunityApi.delPartyActivity,{'id':id})
                    .then((res) => {
                        this.getMeeting()
                        this.$message.success('删除成功')
                    })
            },

        },
    };
</script>
<style>
  .table-operator{
    margin-bottom: 10px;
  }
</style>