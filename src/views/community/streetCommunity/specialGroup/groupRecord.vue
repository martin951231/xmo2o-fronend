<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add(type,bind_id)">新建</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createInfoModal.edit(record.id)">查看</a>
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
          <a-divider type="vertical" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <add-record :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
      <look-info :height='800' :width="1200" ref="createInfoModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import AddRecord from './addRecord.vue'
    import lookInfo from './lookInfo.vue'
    export default {
        name:'groupRecord',
        components: {AddRecord,lookInfo},
        data() {
            return {
                list:[],
                visible: false,
                confirmLoading: false,
                sortedInfo:null,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                type:'',
                bind_id:'',
            };
        },
        mounted(){
            this.type = this.$route.params.type;
            this.bind_id = this.$route.params.bind_id;
            if(!this.type)
            {
                this.type = sessionStorage.getItem('type');
                this.bind_id = sessionStorage.getItem('bind_id');
            }else{
                sessionStorage.setItem('type', this.type);
                sessionStorage.setItem('bind_id', this.bind_id);
            }
            this.getGroupsList()
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
                        dataIndex: 'title',
                        key: 'title',
                    },
                    {
                        title: '跟踪记录',
                        dataIndex: 'content',
                        key: 'content',
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'add_time',
                        key: 'add_time',
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
            getGroupsList() {
                this.search['type'] = this.type;
                this.search['bind_id'] = this.bind_id;
                this.request(streetCommunityApi.getSpecialGroupsRecordList, this.search)
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
                    this.getGroupsList()
                }
            },
            cancel() {

            },
            handleOks() {
                this.getGroupsList();
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.getGroupsList()
            },
            // 进行重置
            resetList() {
                this.getGroupsList()
            },
            deleteConfirm(id){
                this.request(streetCommunityApi.delSpecialGroupsRecord,{'id':id})
                    .then((res) => {
                        this.getGroupsList()
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