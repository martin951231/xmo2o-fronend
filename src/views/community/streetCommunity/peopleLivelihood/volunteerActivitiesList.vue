<template>
  <div class="message-suggestions-list-box">
    <div class="search-box">
        <a-input-group compact>
        <!--                <a-select style="width: 30%" default-value="active_name"  v-model="search.key_val">-->
        <!--                  <a-select-option value="active_name">-->
        <!--                    活动名称-->
        <!--                  </a-select-option>-->
        <!--                </a-select>-->
            <p style="margin-top: 5px;">活动名称: </p>
            <input type="hidden" v-model="search.key_val">
            <a-input style="width: 200px; margin-left: 5px;" v-model="search.value"/>
            <a-button style="margin-left: 10px;" type="primary" icon="search" @click="searchList()">
              查询
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetList()">重置</a-button>
        </a-input-group>
    </div>
    <div class="add-box">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-button type="primary" icon="plus"   @click="$refs.createModal.add()">
              新建
            </a-button>
          </a-col>
        </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="data" 
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'
      :loading="loadPost"
    >
      <span slot="status" slot-scope="text, record">
        <a-badge :status="record.status | statusFilter" :text="text" />
      </span>
      
      <span slot="action" slot-scope="text, record">
        <a
                @click="$refs.createModal.edit(record.activity_id)"

        >编辑</a>
        <a-divider type="vertical" />
        <a @click="sign_list(record)">预约活动列表</a>
        <a-divider type="vertical" />
        <a @click="delInfo(record)">删除</a>
      </span>
    </a-table>
      <addVolunteerActivitiesInfo ref="createModal" @ok="handleOks" />
  </div>
</template>
<script>
import configStreetCommunityApi from '@/api/community/streetCommunity'
import addVolunteerActivitiesInfo from './activitiesInfo'
const columns = [
  { title: '标题',  dataIndex: 'active_name', key: 'active_name'},
  { title: '总名额/剩余名额', dataIndex: 'num_txt', key: 'num_txt' },
  { title: '活动时间', dataIndex: 'start_end_time_txt', key: 'start_end_time_txt'},
  { 
    title: '状态', 
    dataIndex: 'status_txt', 
    key: 'status_txt' ,
    scopedSlots: { customRender: 'status' }
  },
  { title: '排序', dataIndex: 'sort', key: 'sort'},
  { title: '添加时间', dataIndex: 'add_time_txt', key: 'add_time_txt'},
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [];


export default {
  name: 'volunteerActivitiesList',
    components: {
        addVolunteerActivitiesInfo
    },
  filters: {
    statusFilter (type) {
      var statusMap = [
        'error',
        'success',
      ]
      return statusMap[type]
    }
  },
  data() {
    return {
      reply_content: '',
      pagination: { pageSize: 10, total:10 },
      search_data: [],
      search: { key_val: 'active_name', value: '', page: 1 },
      form: this.$form.createForm(this),
      visible: false,
      data,
      columns,
      page: 1,
      loadPost: false,
    };
  },
  mounted(){
      this.getVolunteerActivityList()
  },
  activated () {
    this.getVolunteerActivityList()
  },
  methods: {
    // 获取列表信息
    getVolunteerActivityList() {
      if (this.loadPost) {
        return false;
      }
      this.loadPost = true;
      this.search['page'] = this.page;
      this.request(configStreetCommunityApi.volunteerActivityList, this.search)
        .then((res) => {
          this.loadPost = false;
          console.log('res',res)
          this.pagination.total = res.count ? res.count : 0
          this.data = res.list
      })
    },
      handleOks() {
          this.getVolunteerActivityList();
      },
    // 添加活动
    addActive() {
        console.log('添加活动',1)
        var pathInfo = this.getRouterPath('addVolunteerActivitiesInfo')
        console.log('addActive', pathInfo)
        this.$router.push({ path: pathInfo ,query: { activity_id: 0,aa:'add'}})
    },
    // 删除
    delInfo(record) {
        let _this = this
        this.$confirm({
          title: '你确定要删除该活动信息?',
          content: '该活动一旦删除不可恢复，且相关报名信息将失效',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.request(configStreetCommunityApi.delVolunteerActivity, { activity_id: record.activity_id })
              .then((res) => {
                _this.$message.success('删除成功！');
                _this.getVolunteerActivityList()
            })
          },
          onCancel() {
            console.log('Cancel');
          },
      });
    },
    // 跳转报名列表
    sign_list(record) {
        var pathInfo = this.getRouterPath('signVolunteerActivitiesList')
        console.log('pathInfo', pathInfo)
        this.$router.push({ path: pathInfo, query: { activity_id: record.activity_id } })
    },
    // 查看编辑详情  触发跳转
    lookEdit(record) {
      console.log('record', record)
      var pathInfo = this.getRouterPath('addVolunteerActivitiesInfo')
      console.log('lookEdit', pathInfo)
      this.$router.push({ path: pathInfo, query: { activity_id: record.activity_id } })
    },
    // 表格中变动  这里只针对页面页数切换
    table_change(e) {
      console.log('e', e)
      if (e.current && e.current>0) {
        this.page = e.current;
        this.getVolunteerActivityList()
      }
    },
    // 日期切换，重新赋值
    dateOnChange(date, dateString) {
      this.search.date = dateString;
      console.log('search', this.search);
    },
    // 进行搜索
    searchList() {
      console.log('search', this.search);
      this.getVolunteerActivityList()
    },
    // 进行重置
    resetList() {
      console.log('search', this.search);
      console.log('search_data', this.search_data);
      this.search = { key_val: 'active_name', value: '', page: 1 }
      this.search_data = [];
      this.getVolunteerActivityList()
    }
  }
};
</script>

<style lang="less" scoped>
  .message-suggestions-list-box {
    margin: 30px 20px;
    background-color: white;
  }
  .message-suggestions-list-box .search-box {
    display: flex;
    padding: 20px 20px 0;
  }
  .message-suggestions-list-box .add-box {
    padding: 20px 20px 0;
  }
  .message-suggestions-list-box .components-table-demo-nested {
    padding: 20px;
  }
  .message-suggestions-list-box .message_box {
    padding: 20px;
  }
</style>