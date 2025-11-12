<template>
  <div class="message-suggestions-list-box">
    <div class="search-box">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
              <a-input-group compact>
                <a-select style="width: 30%" default-value="phone" v-model="search.key_val">
                  <a-select-option value="phone">
                    手机号
                  </a-select-option>
                  <a-select-option value="name">
                    姓名
                  </a-select-option>
                </a-select>
                <a-input style="width: 70%" v-model="search.value"/>
            </a-input-group>
          </a-col>
          <a-col :md="3" :sm="24">
              <a-select placeholder="请选择状态" style="width: 100%"  v-model="search.status">
                <a-select-option value="1">未回复</a-select-option>
                <a-select-option value="2">已回复</a-select-option>
              </a-select>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-range-picker @change="dateOnChange" :allowClear='true'  v-model="search_data">
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
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
      <span slot="status" slot-scope="text, record">
        <a-badge :status="record.status | statusFilter" :text="text" />
      </span>
        <span slot="action" slot-scope="text, record">
                <a @click="look(record)">查看</a> 
                <a-divider type="vertical" />
                <a-popconfirm
                    class="ant-dropdown-link"
                    title="确认删除？删除数据不可恢复！"
                    ok-text="确认删除"
                    cancel-text="取消"
                    @confirm="deleteConfirm(record.suggestions_id)"
                    @cancel="cancel"
                >
              <a href="#" style="color: red;">删除</a>
            </a-popconfirm>
       </span>
 
        
    </a-table>
     <a-drawer
      title="查看"
      :width="720"
      :visible="visible"
      :maskClosable='false'
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark class="message_box">
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                提交人：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.name}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                联系方式：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.phone}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                提交时间：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.add_time_txt}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                提交内容：
            </a-col>
             <a-col :md="20" :sm="24">
                {{detail.content}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="detail.img_arr && detail.img_arr[0]">
          <a-row :gutter="24">
             <a-col :md="4" :sm="24">
                提交图例：
            </a-col>
             <a-col :md="20" :sm="24">
              <a-card :bordered='false'>
                <a-card-grid style="width:33%;text-align:center;padding:3px;border:none;box-shadow:none;" v-for="(item,index) in detail.img_arr" :key="index+1">
                  <img :src="item" width="100%">
                </a-card-grid>
              </a-card>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="detail.reply_content">
             <a-col :md="4" :sm="24">
                回复历史：
            </a-col>
             <a-col :md="20" :sm="24">
              <div v-for="(item,index) in detail.reply_content" :key="index+1">
                <a-row :md="24" :gutter="24">
                  <a-col :md="8" :sm="24">
                      {{item.add_time_txt}}
                  </a-col>
                  <a-col :md="16" :sm="24">
                      {{item.reply_content}}
                  </a-col>
                </a-row>
              </div>
           </a-col>
        </a-form-item>
        <a-form-item v-if="detail.is_edit">
             <a-col :md="4" :sm="24">
                回复：
            </a-col>
             <a-col :md="20" :sm="24">
              <a-textarea
                v-model="reply_content"
                placeholder="请输入回复内容"
              />
            </a-col>
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
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          取消
        </a-button>
        <a-button type="primary" @click="onSubmitSave">
          确认
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import configStreetCommunityApi from '@/api/community/streetCommunity'
import streetCommunityApi from "@/api/community/streetCommunity";

const columns = [
  { title: '提交人',  dataIndex: 'name', key: 'name'},
  { title: '联系方式', dataIndex: 'phone', key: 'phone'},
  { title: '提交内容', dataIndex: 'content', key: 'content' },
  { title: '提交时间', dataIndex: 'add_time_txt', key: 'add_time_txt'},
  { 
    title: '状态', 
    dataIndex: 'status_txt', 
    key: 'status_txt' ,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [];
for (let i = 0; i < 1; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    phone: `1835609356 ${i}`,
    content: `这是第 ${i} 位`,
    add_time_txt: `2020/5/27 10:${i}`,
    add_time_txt: `2020/5/27 10:${i}`,
    status_txt: `正常 ${i}`,
  });
}


export default {
  name: 'messageSuggestionsList',
  filters: {
    statusFilter (type) {
      var statusMap = [
        'error',
        'error',
        'success'
      ]
      console.log('type21-', type)
      console.log('type2-', statusMap[type])
      return statusMap[type]
    }
  },
  data() {
    return {
      reply_content: '',
      pagination: { pageSize: 10, total:10 },
      search_data: [],
      search: { 'key_val': 'phone', value: '', status: undefined, date: [], page: 1 },
      form: this.$form.createForm(this),
      visible: false,
      data,
      columns,
      page: 1,
      detail: {
        'name': '',
        'phone': '',
        'add_time_txt': '',
        'content': '',
        'img_arr': [],
        'reply_content': []
      },
      loadPost: false,
    };
  },
  mounted () {
    this.getMessageSuggestionsList()
  },
  methods: {
    // 获取列表信息
    getMessageSuggestionsList() {
      if (this.loadPost) {
        return false;
      }
      this.loadPost = true;
      this.search['page'] = this.page;
      let _this = this
      this.request(configStreetCommunityApi.messageSuggestionsList, this.search)
        .then((res) => {
          this.loadPost = false;
          console.log('res',res)
          _this.pagination.total = res.count ? res.count : 0
          _this.data = res.list
      })
    },
    // 获取详情
    getMessageSuggestionsDetail(suggestions_id) {
      let _this = this
      this.request(configStreetCommunityApi.messageSuggestionsDetail, { suggestions_id: suggestions_id})
        .then((res) => {
          console.log('res',res)
          _this.detail = res.info
      })
    },
    // 回复留言建议
    saveMessageSuggestionsReplyInfo() {
      let _this = this
      this.request(configStreetCommunityApi.saveMessageSuggestionsReplyInfo, { 'suggestions_id': this.detail.suggestions_id, 'reply_content': this.reply_content})
        .then((res) => {
          console.log('res',res)
          _this.visible = false
          _this.reply_content = ''
          _this.$notification.success({
            message: '回复成功'
          })
          _this.getMessageSuggestionsList()
      })
    },
    // 保存
    onSubmitSave() {
      if (!this.reply_content) {
          this.$notification.error({
            message: '请填写回复内容'
          })
          return false
      }
      this.saveMessageSuggestionsReplyInfo();
    },
    // 查看详情  触发右侧抽屉弹出
    look(e) {
      console.log('e', e)
      this.visible = true
      this.getMessageSuggestionsDetail(e.suggestions_id)
    },
    // 表格中变动  这里只针对页面页数切换
    table_change(e) {
      console.log('e', e)
      if (e.current && e.current>0) {
        this.page = e.current;
        this.getMessageSuggestionsList()
      }
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
      this.getMessageSuggestionsList()
    },
    // 进行重置
    resetList() {
      console.log('search', this.search);
      console.log('search_data', this.search_data);
      this.search = { 'key_val': 'phone', value: '', status: '', date: [], page: 1 }
      this.search_data = [];
      this.getMessageSuggestionsList()
    },
      cancel() {

      },
      deleteConfirm(id){
          this.request(configStreetCommunityApi.deleteMessageSuggestionsReplyInfo,{'suggestions_id':id})
              .then((res) => {
                  this.getMessageSuggestionsList()
                  this.$message.success('删除成功')
              })
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