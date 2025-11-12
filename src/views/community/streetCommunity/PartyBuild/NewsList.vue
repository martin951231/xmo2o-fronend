<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <label style="margin-top: 5px;">新闻标题：</label><a-input style="width: 70%" v-model="search.title"/>
            </a-input-group>
          </a-col>
          <a-col :md="2" :sm="1" style="margin-top: 5px;">
            发布时间：
          </a-col>
          <a-col :md="6" :sm="1" style="margin-left: -55px">
            <a-range-picker @change="dateOnChange" :allowClear='true'  v-model="search_data">
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
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
          <a @click="$refs.seeModal.edit(record.build_id,record.cat_id,record.title)">查看</a>
           <a-divider type="vertical" />
          <a @click="$refs.createModal.edit(record.build_id)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteConfirm(record.build_id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
            <!--<a-divider v-if="!record.is_notice" type="vertical" />
            <a v-if="!record.is_notice" @click="weChatNotice(record.build_id)">微信群发通知</a>-->

            <a-divider type="vertical" />
<!--           <router-link :to="{ path:'/community/streetCommunity/ThreeLessons/CommentsList' }" style="color: #1890ff;">评论列表</router-link>-->
           <router-link :to="{ name:'ReplyList',params:{build_id:record.build_id}}" style="color: #1890ff;">评论列表</router-link>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>

      </a-table>
      <news-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
      <news-see :height='800' :width="1200" ref="seeModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import NewsInfo from './NewsInfo.vue'
    import NewsSee from './NewsSee.vue'
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
        name: 'NewsList',
        components: {
            NewsInfo,
          NewsSee
        },
        data() {
            return {
                list:[],
                visible: false,
                confirmLoading: false,
                sortedInfo:null,
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
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
                this.cat_id = sessionStorage.getItem('lesson_cat_id');
            }else{
                sessionStorage.setItem('lesson_cat_id', this.cat_id);
            }
            console.log('idddddd',this.cat_id);
            this.getPartyBuild()
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
                        title: '新闻标题',
                        dataIndex: 'title',
                        key: 'title',
                    },
                    {
                        title: '发布时间',
                        dataIndex: 'add_time',
                        key: 'add_time',
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
                this.cat_id = sessionStorage.getItem('lesson_cat_id');
            }else{
                sessionStorage.setItem('lesson_cat_id', this.cat_id);
            }
            console.log('idddddd',this.cat_id);
            this.getPartyBuild();
        },
        methods: {
            callback(key) {
                console.log(key);
            },
            getPartyBuild() {
                if (this.loadPost) {
                    return false;
                }
                this.loadPost = true;
                this.search['page'] = this.pagination.current;
                this.search['limit'] = this.pagination.pageSize;
                this.search['cat_id'] = this.cat_id;
                this.request(streetCommunityApi.getPartyBuildList, this.search)
                    .then((res) => {
                        this.loadPost = false;
                        console.log('res', res);
                        this.list = res.list;
                        this.cat_id = res.cat_id;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getPartyBuild()
                console.log('onTableChange==>', page, pageSize)
            },
            tableChange(e) {
              let _this=this;
              if (e.current && e.current>0) {
                _this.pagination.current = e.current;
                _this.getPartyBuild()
              }
            },
            cancel() {

            },
            handleOks() {
                this.getPartyBuild();
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.tableChange({
                  current: 1,
                  pageSize: 10,
                  total: 10
                })
            },
            // 进行重置
            resetList() {
                console.log('search', this.search);
                console.log('search_data', this.search_data);
                this.search = { 'key_val': 'title', value: '', status: '', date: [], page: 1 }
                this.search_data = [];
                this.tableChange({
                  current: 1,
                  pageSize: 10,
                  total: 10
                })
            },
            deleteConfirm(id){
                this.request(streetCommunityApi.delPartyBuild,{'build_id':id})
                    .then((res) => {
                        this.tableChange({
                          current: 1,
                          pageSize: 10,
                          total: 10
                        })
                        this.$message.success('删除成功')
                    })
            },
            weChatNotice(id)
            {
                this.request(streetCommunityApi.partyWeChatNotice,{'id':id})
                    .then((res) => {
                        this.tableChange({
                          current: 1,
                          pageSize: 10,
                          total: 10
                        })
                        this.$message.success('已发送')
                    })
            }

        },
    };
</script>
<style>
  .table-operator{
    margin-bottom: 10px;
  }
</style>