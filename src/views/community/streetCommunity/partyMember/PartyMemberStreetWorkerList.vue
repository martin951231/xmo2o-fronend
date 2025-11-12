<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box party_m" style="margin-bottom: 30px;">
        <a-row :gutter="48">
          <a-col :md="5" :sm="2">
            <a-input-group compact>
              <label style="margin-top: 5px;">姓名：</label><a-input style="width: 50%" v-model="search.name"/>
            </a-input-group>
          </a-col>
          <a-col :md="5" :sm="2">
            <a-input-group compact>
              <label style="margin-top: 5px;">手机号码：</label><a-input style="width: 50%" v-model="search.phone"/>
            </a-input-group>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-input-group compact>
              <label style="margin-top: 5px;">所属党支部：</label>
              <a-select
                      show-search
                      option-filter-prop="children"
                      placeholder="请选择"
                      v-model="search.party_branch_type"
                      style="width: 70%;"
              >
                <a-select-option :value="item.id" v-for="(item,index) in party_branch_type" :key="index">
                  {{item.name}}
                </a-select-option>
              </a-select>
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
      <a-table :columns="columns" :data-source="list" :loading="loading"
               :pagination="pagination">
         <span slot="room_num" slot-scope="text, record">
          <a @click="$refs.roomInfoModal.getList(record)"> {{ record.room_num }}</a>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.id,record.party_bind_user_id)">编辑</a>
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>

    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        name: 'PartyMemberStreetWorkerList',
        components: {

        },
        data() {
            return {
                list:[],
                visible: false,
                confirmLoading: false,
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { page: 1,'xtype':'workerMemberParty',name:'', phone:'',party_branch_type:''},
                page: 1,
                loadPost: false,
              loading: false,
              party_branch_type:[],
            };
        },
        mounted(){
          this.getPartyStreetWorkerList()
          this.getPartyBranchType()
        },
        computed:{
            columns() {
                const columns = [
                    {
                        title: '姓名',
                        dataIndex: 'work_name',
                        key: 'work_name',
                    },
                    {
                        title: '联系方式',
                        dataIndex: 'work_phone',
                        key: 'work_phone',
                    },
                    {
                        title: '身份证号',
                        dataIndex: 'work_id_card',
                        key: 'work_id_card',
                    },
                    {
                        title: '所属党支部',
                        dataIndex: 'party_name',
                        key: 'party_name',
                    },
                    {
                        title: '入党时间',
                        dataIndex: 'join_party_time_txt',
                        key: 'join_party_time_txt',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status_txt',
                        key: 'status_txt',
                    },
                ];
                return columns;
            },
        },
        created() {
            
        },
        methods: {
            callback(key) {
                console.log(key);
            },
            getPartyStreetWorkerList() {
                if (this.loadPost) {
                  return false;
                }
              this.loading = true;
                this.loadPost = true;
                this.search['page'] = this.page;
                this.search['limit'] = this.pagination.pageSize;
                this.search['xtype']= 'workerMemberParty';
                this.request(streetCommunityApi.getPartyMember, this.search)
                    .then((res) => {
                      this.loading = false;
                        this.loadPost = false;
                        this.loading = false;
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            onTableChange(page,pageSize){
                this.page = page;
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getPartyStreetWorkerList()
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getPartyStreetWorkerList()
                }
            },
            handleOks() {
                this.getPartyStreetWorkerList();
            },
            // 进行搜索
            searchList() {
                this.getPartyStreetWorkerList()
            },
            // 进行重置
            resetList() {
                this.search = { name:'', phone:'',party_branch_type:'' , page: 1 }
                this.getPartyStreetWorkerList()
            },

          //获取类型
          getPartyBranchType(){
            this.request(streetCommunityApi.getPartyBranchAll).then((res) => {
              this.party_branch_type=res;
            })
          },
        },
    };
</script>
<style lang="less" scoped>

  /deep/ .party_m .ant-row .ant-col-md-5 {
    padding-right: 0px !important;
  }

</style>
<style>
  .table-operator{
    margin-bottom: 10px;
  }
</style>