<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        <a-row :gutter="48">
          <a-col :md="6" :sm="2">
            <a-input-group compact>
              <label style="margin-top: 5px;">党支部名称：</label><a-input style="width: 70%" v-model="search.name"/>
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
      <div class="table-operator" v-if="area_type!=1">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.id)" v-if="area_type!=1">编辑</a>
          <a @click="$refs.createModal.look(record.id)" v-if="area_type==1">查看</a>

             <a-popconfirm
                     v-if="area_type!=1"
                     class="ant-dropdown-link"
                     title="确认删除?(操作后可能不能恢复！)"
                     ok-text="是"
                     cancel-text="否"
                     @confirm="deleteConfirm(record.id)"
                     @cancel="delCancel"
             > | <a href="#">删除</a></a-popconfirm>

        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <add-party-work :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import addPartyWork from './addPartyWork.vue'
    export default {
        name: 'PartyWorkList',
        components: {
            addPartyWork
        },
        data() {
            return {
                list:[],
                visible: false,
                confirmLoading: false,
                sortedInfo:null,
                pagination: {current:1, pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                area_type: 1,
            };
        },
        mounted(){
            this.getPartyBranch()
        },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '党支部名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                  {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                  },
                  {
                    title: '地址',
                    dataIndex: 'adress',
                    key: 'adress',
                  },
                    {
                        title: '添加时间',
                        dataIndex: 'create_time',
                        key: 'create_time',
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
            getPartyBranch() {
              this.search['page'] = this.pagination.current;
                this.request(streetCommunityApi.getPartyBranch, this.search)
                    .then((res) => {
                        console.log('res', res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.area_type = res.area_type
                    })
            },
            tableChange(e) {
              let _this=this;
              if (e.current && e.current>0) {
                _this.pagination.current = e.current;
                _this.getPartyBranch()
              }
            },
            handleOks() {
                this.getPartyBranch();
            },
            // 进行搜索
            searchList() {
              this.tableChange({
                current: 1,
                pageSize: 10,
                total: 10
              });
            },
            // 进行重置
            resetList() {
                console.log('search', this.search);
                console.log('search_data', this.search_data);
                this.search = { 'key_val': 'name', value: '', status: '', date: [], page: 1 }
                this.search_data = [];
              this.tableChange({
                current: 1,
                pageSize: 10,
                total: 10
              });
            },
          //删除
          deleteConfirm(id){
            this.request(streetCommunityApi.delPartyBranch,{'id':id}).then((res) => {
              this.getPartyBranch();
              this.$message.success('删除成功')
            })
          },
          //取消删除
          delCancel() {

          },
        },
    };
</script>
<style>
  .table-operator{
    margin-bottom: 10px;
  }
</style>