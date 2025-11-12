<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <label style="margin-top: 5px;">分类名称：</label><a-input style="width: 70%" v-model="search.cat_name"/>
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
        <span slot="meeting" slot-scope="text, record">
          <router-link :to="{ name:'MatterList',params:{cat_id:record.cat_id}}" style="color: #1890ff;">查看</router-link>
        </span>
        <span slot="cat_status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.cat_id)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteConfirm(record.cat_id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <classify-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import classifyInfo from './MatterClassifyInfo.vue'
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
        name: 'MatterClassifyList',
        components: {
            classifyInfo
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
            };
        },
        mounted(){
            this.getClassifyList()
        },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '事项分类',
                        dataIndex: 'cat_name',
                        key: 'cat_name',
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'create_time',
                        key: 'create_time',
                    },
                    {
                        title: '事项列表',
                        dataIndex: '',
                        key: 'meeting',
                        scopedSlots: {
                            customRender: 'meeting'
                        }
                    },
                    {
                        title: '排序',
                        dataIndex: 'cat_sort',
                        key: 'cat_sort',
                    },
                    {
                        title: '状态',
                        dataIndex: 'cat_status',
                        key: 'cat_status',
                        scopedSlots: { customRender: 'cat_status' },
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
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        created() {},
        methods: {
            callback(key) {
                console.log(key);
            },
            getClassifyList() {
                this.search['page'] = this.page;
                this.request(streetCommunityApi.getMatterCategoryList, this.search)
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
                    this.getClassifyList()
                }
            },
            cancel() {

            },
            handleOks() {
                this.getClassifyList();
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.getClassifyList()
            },
            // 进行重置
            resetList() {
                console.log('search', this.search);
                console.log('search_data', this.search_data);
                this.search = { 'key_val': 'cat_name', value: '', status: '', date: [], page: 1 }
                this.search_data = [];
                this.getClassifyList()
            },
            deleteConfirm(id){
                this.request(streetCommunityApi.delCategory,{'cat_id':id})
                    .then((res) => {
                        this.getClassifyList()
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