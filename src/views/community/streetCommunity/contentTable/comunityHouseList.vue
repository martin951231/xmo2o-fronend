<template>
  <div class="message-suggestions-list-box">
    <div class="search-box">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
               <span>小区名称</span> <a-input style="width: 70%" v-model="search.houseName"/>
          </a-col>
          <a-col :md="2" :sm="24">
            <a-button type="primary" icon="search" @click="searchList()">
              查询
            </a-button>
          </a-col>
          <a-col :md="2" :sm="24">
            <a-button  @click="resetList()">重置</a-button>
          </a-col>
        </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="data" 
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'
    >
      <span slot="status_str" slot-scope="text, record">
        <span v-if="record.status==1" style="color:green;">{{record.status_str}}</span>
        <span  style="color:red;" v-else>{{record.status_str}}</span>
      </span>  
      
      <span slot="access_str" slot-scope="text, record">
        <a-button type="link" v-if="record.access_url!=''" style="color:green;" @click="goJump(record.access_url)">{{record.access_str}}</a-button>
        <span  style="color:red;" v-else >{{record.access_str}}</span>
      </span> 
      
    </a-table>

  </div>
</template>
<script>
import configStreetCommunityApi from '@/api/community/streetCommunity'
import streetCommunityApi from "@/api/community/streetCommunity";

const columns = [
  { title: '小区名称',  dataIndex: 'village_name', key: 'village_name'},
  { title: '物业名称', dataIndex: 'property_name', key: 'property_name' },
  { title: '小区地址', dataIndex: 'village_address', key: 'village_address'},
  { title: '访问', dataIndex: 'access_str', key: 'access_str', scopedSlots: { customRender: 'access_str' }},
  { title: '最后登录时间', dataIndex: 'last_time_str', key: 'last_time_str'},
  
  { 
    title: '状态', 
    dataIndex: 'status_str', 
    key: 'status_str' ,
    scopedSlots: { customRender: 'status_str' }
  },
];

const data = [];

export default {
  name: 'streetComunityHouseList',
  data() {
    return {
      reply_content: '',
      pagination: { pageSize: 10, total:10 },
      search_data: [],
      search: { houseName:'', page: 1 },
      form: this.$form.createForm(this),
      visible: false,
      data,
      columns,
      page: 1,
      detail: {},
      loadPost: false,
    };
  },
  mounted () {
    this.getStreetComunityHouseList()
  },
  methods: {
    // 获取列表信息
    getStreetComunityHouseList() {
      if (this.loadPost) {
         return false;
      }
      this.loadPost = true;
      this.search['page'] = this.page;
      let _this = this
      this.request(configStreetCommunityApi.getStreetComunityHouseList, this.search)
        .then((res) => {
          this.loadPost = false;
          _this.pagination.total = res.count ? res.count : 0
          _this.pagination.pageSize = res.pageSize ? res.pageSize : 10
          _this.data = res.list
      }).catch((error) => {
            this.loadPost = false;
         });
    },

    // 查看详情  触发右侧抽屉弹出
    look(info) {
      this.detail=info
      this.visible = true
    
    },
    // 表格中变动  这里只针对页面页数切换
    table_change(e) {
      console.log('e', e)
      if (e.current && e.current>0) {
        this.page = e.current;
        this.getStreetComunityHouseList()
      }
    },
    goJump(access_url){
        window.open(access_url,'_blank')
    },

    // 右侧弹出抽屉关闭
    onClose() {
      this.visible = false;
    },
    // 日期切换，重新赋值
    dateOnChange(date, dateString) {
      this.search.date = dateString;
      console.log('search', this.search);
    },
    // 进行搜索
    searchList() {
      console.log('search', this.search);
      this.getStreetComunityHouseList()
    },
    // 进行重置
    resetList() {
      this.search = { houseName:'', page: 1 }
      this.search_data = [];
      this.getStreetComunityHouseList()
    },
  }
};
</script>

<style lang="less" scoped>
  .message-suggestions-list-box {
    margin: 30px 20px;
    background-color: white;
  }
  .message-suggestions-list-box .search-box {
    padding: 20px 20px 0;
  }
  .message-suggestions-list-box .components-table-demo-nested {
    padding: 20px;
  }
  .message-suggestions-list-box .message_box {
    padding: 20px;
  }
</style>