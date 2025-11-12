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

          <a-col :md="4" :sm="15">
            <a-input-group compact>
              <label style="margin-top: 5px;">党员状态：</label>
              <a-select placeholder="请选择" v-model="search.party_status" style="width: 120px;">
                <a-select-option value="" >请选择</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <!--<a-select-option value="2">转出</a-select-option>-->
                <!--<a-select-option value="3">失联</a-select-option>-->
                <a-select-option value="4">死亡</a-select-option>
                <a-select-option value="5">退党</a-select-option>
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
      <party-member :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
      <party-member-room-info :height='800' :width="1200" ref="roomInfoModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import partyMember from './PartyMemberInfo.vue'
    import partyMemberRoomInfo from './PartyMemberRoomInfo.vue'
    export default {
        name: 'PartyMemberVillageList',
        components: {
            partyMember,
          partyMemberRoomInfo
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
                search: { name:'', phone:'',party_branch_type:'' ,party_status:'',page: 1 },
                page: 1,
                loadPost: false,
              loading: false,
              party_branch_type:[],
            };
        },
        mounted(){
            this.getPartyMembers()
            this.getPartyBranchType()
        },
        computed:{
            columns() {

                const columns = [
                    {
                        title: '姓名',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '性别',
                        dataIndex: 'sex',
                        key: 'sex',
                    },
                    {
                        title: '联系方式',
                        dataIndex: 'phone',
                        key: 'phone',
                    },
                    {
                        title: '身份证号',
                        dataIndex: 'id_card',
                        key: 'id_card',
                    },
                    {
                        title: '住宅数',
                        dataIndex: 'room_num',
                        key: 'room_num',
                      scopedSlots: {
                        customRender: 'room_num'
                      }
                    },
                    
                    {
                        title: '所属党支部',
                        dataIndex: 'party_name',
                        key: 'party_name',
                    },
                    {
                        title: '状态',
                        dataIndex: 'party_status',
                        key: 'party_status',
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

        methods: {
            callback(key) {
                console.log(key);
            },
            getPartyMembers() {
                if (this.loadPost) {
                  return false;
                }
                this.loading = true;
                this.loadPost = true;
                this.search['page'] = this.page;
                this.search['limit'] = this.pagination.pageSize;
                this.request(streetCommunityApi.getPartyMember, this.search)
                    .then((res) => {
                      this.loading = false;
                        this.loadPost = false;
                      this.loading = false;
                        console.log('res', res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            onTableChange(page,pageSize){
                this.page = page;
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getPartyMembers()
                console.log('onTableChange==>', page, pageSize)
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getPartyMembers()
                }
            },
            handleOks() {
                this.getPartyMembers();
            },
            // 进行搜索
            searchList() {
                this.getPartyMembers()
            },
            // 进行重置
            resetList() {
                this.search = { name:'', phone:'',party_branch_type:'' ,party_status:'', page: 1 }
                this.getPartyMembers()
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