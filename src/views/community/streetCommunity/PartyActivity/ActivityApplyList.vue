<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <label style="margin-top: 5px;">志愿者姓名：</label><a-input style="width: 70%" v-model="search.user_name"/>
            </a-input-group>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <label style="margin-top: 5px;">联系方式：</label><a-input style="width: 70%" v-model="search.user_phone"/>
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
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.id)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteConfirm(record.id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <span slot="join_status" slot-scope="text, record">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <apply-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import applyInfo from './ActivityApplyInfo.vue'
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
        name: 'ActivityApplyList',
        components: {
            applyInfo
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
                activity_id:0,
                loadPost: false,
            };
        },
        mounted(){
            this.activity_id = this.$route.params.id;
            if(!this.activity_id)
            {
                this.activity_id = sessionStorage.getItem('party_activity_id');
            }else{
                sessionStorage.setItem('party_activity_id', this.activity_id);
            }
            console.log('idddddd',this.$route.params);
            this.getApply()
        },
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        activated(){
            this.activity_id = this.$route.params.id;
            if(!this.activity_id)
            {
                this.activity_id = sessionStorage.getItem('party_activity_id');
            }else{
                sessionStorage.setItem('party_activity_id', this.activity_id);
            }
            console.log('idddddd',this.$route.params);
            this.getApply();
        },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '姓名',
                        dataIndex: 'user_name',
                        key: 'user_name',
                    },
                    {
                        title: '联系方式',
                        dataIndex: 'user_phone',
                        key: 'user_phone',
                    },
                    {
                        title: '身份证号',
                        dataIndex: 'id_card',
                        key: 'id_card',
                    },
                    {
                        title: '报名时间',
                        dataIndex: 'add_time',
                        key: 'add_time',
                    },
                    {
                        title: '状态',
                        dataIndex: '',
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
            getApply() {
                if (this.loadPost) {
                    return false;
                }
                this.loadPost = true;
                this.search['page'] = this.page;
                this.search['party_activity_id'] = this.activity_id;
                console.log('search',this.search);
                this.request(streetCommunityApi.getApplyList, this.search)
                    .then((res) => {
                        this.loadPost = false;
                        console.log('res', res);
                        this.list = res.list;
                        this.activity_id = res.party_activity_id;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getApply()
                }
            },
            cancel() {

            },
            handleOks() {
                this.getApply();
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.getApply()
            },
            // 进行重置
            resetList() {
                console.log('search', this.search);
                console.log('search_data', this.search_data);
                this.search = { 'key_val': 'user_name', value: '', status: '', date: [], page: 1 }
                this.search_data = [];
                this.getApply()
            },
            deleteConfirm(id){
                this.request(streetCommunityApi.delApply,{'id':id})
                    .then((res) => {
                        this.getApply()
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