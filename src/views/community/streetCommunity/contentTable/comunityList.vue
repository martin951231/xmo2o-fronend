<template>
  <div class="message-suggestions-list-box">
    <div class="search-box">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
               <span>社区名称</span> <a-input style="width: 70%" v-model="search.comunityName"/>
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
      <span slot="is_open_str" slot-scope="text, record">
        <span v-if="record.is_open==1" style="color:green;">{{record.is_open_str}}</span>
        <span v-if="record.is_open==0" style="color:red;">{{record.is_open_str}}</span>
      </span>
      <span slot="access_str" slot-scope="text, record">
        <a-button type="link" v-if="record.access_url!=''" style="color:green;" @click="goJump(record.access_url)">{{record.access_str}}</a-button>
        <span  style="color:red;" v-else >{{record.access_str}}</span>
      </span> 
        
        <span slot="action" slot-scope="text, record">
                <a @click="look(record)">查看</a> 
       </span>
 
        
    </a-table>
     <a-drawer
      title="查看"
      :width="720"
      :visible="visible"
      :maskClosable='true'
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark class="message_box">
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                社区名称：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.area_name}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                所属区域：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.area_info_str}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                地址：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.detail_address}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                联系电话：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.phone}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                状态：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.is_open_str}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="detail.logo">
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                logo：
            </a-col>
             <a-col :md="20" :sm="24">
              <a-card :bordered='false'>
                <a-card-grid style="width:33%;text-align:center;padding:3px;border:none;box-shadow:none;">
                  <img :src="detail.logo" width="100%">
                </a-card-grid>
              </a-card>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >

      </div>
    </a-drawer>
  </div>
</template>
<script>
import configStreetCommunityApi from '@/api/community/streetCommunity'
import streetCommunityApi from "@/api/community/streetCommunity";

const columns = [
  { title: '社区名称',  dataIndex: 'area_name', key: 'area_name'},
  { title: '社区办公地址', dataIndex: 'detail_address', key: 'detail_address'},
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  { title: '访问', dataIndex: 'access_str', key: 'access_str', scopedSlots: { customRender: 'access_str' }},
  { 
    title: '状态', 
    dataIndex: 'is_open_str', 
    key: 'is_open_str' ,
    scopedSlots: { customRender: 'is_open_str' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [];

export default {
  name: 'streetComunityList',
  data() {
    return {
      reply_content: '',
      pagination: { pageSize: 10, total:10 },
      search_data: [],
      search: { comunityName:'', page: 1 },
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
    this.getStreetComunityList()
  },
  methods: {
    // 获取列表信息
    getStreetComunityList() {
      if (this.loadPost) {
         return false;
      }
      this.loadPost = true;
      this.search['page'] = this.page;
      let _this = this
      this.request(configStreetCommunityApi.getStreetComunityList, this.search)
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
        this.getStreetComunityList()
      }
    },
    goJump(access_url){
        window.opener=null;
        window.close();
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
      this.getStreetComunityList()
    },
    // 进行重置
    resetList() {
      this.search = { comunityName:'', page: 1 }
      this.search_data = [];
      this.getStreetComunityList()
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