<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <label style="margin-top: 5px;">事项名称：</label><a-input style="width: 70%" v-model="search.title"/>
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
        <a-button type="primary" icon="plus" @click="$refs.createModal.add(cat_id)">新建</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.matter_id,cat_id)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteConfirm(record.matter_id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <matter-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import MatterInfo from './MatterInfo.vue'
    const statusMap = {
        0: {
            status: 'default',
            text: '禁止'
        },
        1: {
            status: 'success',
            text: '开启'
        }
    }
    export default {
        name: 'MatterList',
        components: {
            MatterInfo
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
                cat_id:'',
                loadPost: false,
            };
        },
        mounted(){
            this.cat_id = this.$route.params.cat_id;
            if(!this.cat_id)
            {
                this.cat_id = sessionStorage.getItem('matter_cat_id');
            }else{
                sessionStorage.setItem('matter_cat_id', this.cat_id);
            }
            this.getMatter()
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
                        title: '事项名称',
                        dataIndex: 'title',
                        key: 'title',
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'add_time',
                        key: 'add_time',
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
        activated(){
            this.cat_id = this.$route.params.cat_id;
            if(!this.cat_id)
            {
                this.cat_id = sessionStorage.getItem('matter_cat_id');
            }else{
                sessionStorage.setItem('matter_cat_id', this.cat_id);
            }
            this.getMatter();
        },
        methods: {
            callback(key) {
                console.log(key);
            },
            getMatter() {
                if (this.loadPost) {
                    return false;
                }
                this.loadPost = true;
                this.search['page'] = this.page;
                this.search['cat_id'] = this.cat_id;
                this.request(streetCommunityApi.getMatterList, this.search)
                    .then((res) => {
                        this.loadPost = false;
                        console.log('res', res);
                        this.list = res.list;
                        this.cat_id = res.cat_id;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getMatter()
                }
            },
            cancel() {

            },
            handleOks() {
                this.getMatter();
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.getMatter()
            },
            // 进行重置
            resetList() {
                console.log('search', this.search);
                console.log('search_data', this.search_data);
                this.search = { 'key_val': 'title', value: '', status: '', date: [], page: 1 }
                this.search_data = [];
                this.getMatter()
            },
            deleteConfirm(id){
                this.request(streetCommunityApi.delMatter,{'matter_id':id})
                    .then((res) => {
                        this.getMatter()
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