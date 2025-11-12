<template>
  <div class="message-suggestions-list-box">
    <div class="search-box">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
              <a-row type="flex" justify="center" align="middle">
                <a-col style="text-align: center;">
                  志愿者姓名：
                </a-col>
                <a-col >
                  <a-input v-model="search.join_name" placeholder="请输入志愿者姓名"/>
                </a-col>
              </a-row>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-row type="flex" justify="center" align="middle">
              <a-col  style="text-align: center;">
                联系方式：
              </a-col>
              <a-col :span="18">
                <a-input v-model="search.join_phone" placeholder="请输入联系方式"/>
              </a-col>
            </a-row>
          </a-col>

            <a-col :md="5" :sm="24">
                <a-row type="flex" justify="center" align="middle">
                    <a-col style="text-align: center;">
                        审核状态：
                    </a-col>
                    <a-select placeholder="请选择审核状态" style="width: 60%"  v-model="search.status">
                        <a-select-option value="1">全部</a-select-option>
                        <a-select-option value="2">待审核</a-select-option>
                        <a-select-option value="3">审核通过</a-select-option>
                        <a-select-option value="4">审核拒绝</a-select-option>
                    </a-select>
                </a-row>
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
      :loading="loadPost"
    >
      <span slot="join_status" slot-scope="text, record">
        <a-badge :status="record.join_status | statusFilter" :text="text" />
      </span>

        <span slot="join_examine" slot-scope="text, record">
        <a-badge :status="record.join_examine | examineFilter" :text="record.join_examine_txt" />
      </span>
      
      <span slot="action" slot-scope="text, record">
        <!--<a @click="lookEdit(record)">编辑</a>-->
         <a  @click="$refs.createModal.edit(record.join_name,record.join_id,record.activity_id)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delInfo(record)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="visible" title="查看编辑">
      <a-form :form="form">
        <a-form-item>
            <a-row align="middle">
              <a-col :span="5" class="modal_box_title">
                <span style="color: #F5242E;">*</span>
                报名姓名
              </a-col>
              <a-col :span="19">
                  <a-input
                    v-decorator="[
                      `join_name`,
                      {
                      initialValue: detail.join_name,
                        rules: [
                          {
                            required: true,
                            message: '请填写报名者姓名!',
                          },
                        ],
                      },
                    ]"
                    placeholder="请填写报名者姓名"
                  />
              </a-col>
            </a-row>
        </a-form-item>
        <a-form-item>
          <a-row align="middle">
            <a-col :span="5" class="modal_box_title">
              <span style="color: #F5242E;">*</span>
              报名手机号
            </a-col>
            <a-col :span="19">
                <a-input
                  v-decorator="[
                    `join_phone`,
                    {
                    initialValue: detail.join_phone,
                      rules: [
                        {
                          required: true,
                          message: '请填写报名手机号!',
                        },
                      ],
                    },
                  ]"
                  placeholder="请填写报名手机号"
                />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row align="middle">
            <a-col :span="5" class="modal_box_title">
              <span v-if="detail.active_is_need == 1" style="color: #F5242E;">*</span>
              报名身份证
            </a-col>
            <a-col :span="19">
                <a-input
                  v-decorator="[
                    `join_id_card`,
                    {
                      initialValue: detail.join_id_card,
                    },
                  ]"
                  placeholder="请填写报名身份证"
                />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row align="middle">
            <a-col :span="5" class="modal_box_title">
              所属活动
            </a-col>
            <a-col :span="19">
               {{detail.active_name}}
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row align="middle">
             <a-col :md="5" class="modal_box_title">
                备注
            </a-col>
             <a-col :md="19">
              <a-textarea v-decorator="[
                    `join_remark`,
                    {
                      initialValue: detail.join_remark,
                    },
                  ]"
                placeholder="请输入备注内容"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row align="middle">
            <a-col :span="5" class="modal_box_title">
              <span style="color: #F5242E;">*</span>
              报名状态
            </a-col>
            <a-col :span="19">
               <a-radio-group name="join_status" v-model="detail.join_status">
                <a-radio :value="1">
                  开启
                </a-radio>
                <a-radio :value="2">
                  关闭
                </a-radio>
              </a-radio-group>
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
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          取消
        </a-button>
        <a-button type="primary" @click="onSubmitSave">
          确认
        </a-button>
      </div>
    </a-modal>
    <signVolunteerInfo ref="createModal" @ok="handleOks" />
  </div>
</template>
<script>
  import configStreetCommunityApi from '@/api/community/streetCommunity'
  import signVolunteerInfo from './signVolunteerInfo'
const columns = [
  { title: '姓名',  dataIndex: 'join_name', key: 'join_name'},
  { title: '联系电话', dataIndex: 'join_phone', key: 'join_phone' },
  { title: '身份证明', dataIndex: 'join_id_card', key: 'join_id_card' },
  { title: '报名时间', dataIndex: 'join_add_time_txt', key: 'join_add_time_txt'},
    {
        title: '审核状态',
        dataIndex: 'join_examine',
        key: 'join_examine' ,
        scopedSlots: { customRender: 'join_examine' }
    },
  { 
    title: '报名状态', 
    dataIndex: 'join_status_txt', 
    key: 'join_status_txt' ,
    scopedSlots: { customRender: 'join_status' }
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
  name: 'signVolunteerActivitiesList',
  components: {
    signVolunteerInfo
  },
  filters: {
    statusFilter (type) {
      var statusMap = [
        'error',
        'success',
        'error',
      ]
      return statusMap[type]
    },
      examineFilter (type) {
          var statusMap = [
              'warning',
              'success',
              'error',
          ]
          return statusMap[type]
      }, 
  },
  data() {
    return {
      reply_content: '',
      pagination: { pageSize: 10, total:10 },
      search_data: [],
      search: { join_name: '', join_phone: '', page: 1 ,status:undefined},
      form: this.$form.createForm(this),
      visible: false,
      data,
      columns,
      page: 1,
      detail: {
        'join_name': '',
        'join_phone': '',
        'join_id_card': '',
        'join_remark': '',
        'join_status': 1,
        'activity_id': 1,
          'active_name':'',
          'active_is_need':0,
      },
      join_id:0,
      loadPost: false,
    };
  },
  mounted(){
    console.log('router',  1)
    console.log('router',  this.$route.query.activity_id)
    var activity_id = this.$route.query.activity_id
    if (activity_id) {
      this.search.activity_id = activity_id
    }
    this.getActiveJoinList()
  },
  activated () {
    console.log('router',  1)
    console.log('router',  this.$route.query.activity_id)
    var activity_id = this.$route.query.activity_id
    if (activity_id) {
      this.search.activity_id = activity_id
    }
    this.getActiveJoinList()
  },
  methods: {

    handleOks() {
      this.getActiveJoinList();
    },

    // 获取列表信息
    getActiveJoinList() {
      if (this.loadPost) {
        return false;
      }
      this.loadPost = true;
      this.search['page'] = this.page;
      this.request(configStreetCommunityApi.getActiveJoinList, this.search)
        .then((res) => {
          this.loadPost = false;
          console.log('res',res)
          this.pagination.total = res.count ? res.count : 0
          this.data = res.list
      })
    },
    // 获取详情
    getMessageSuggestionsDetail(suggestions_id) {
      this.request(configStreetCommunityApi.messageSuggestionsDetail, { suggestions_id: suggestions_id})
        .then((res) => {
          console.log('res',res)
          this.detail = res.info
      })
    },
    // 回复留言建议
    saveMessageSuggestionsReplyInfo() {
      this.request(configStreetCommunityApi.saveMessageSuggestionsReplyInfo, { 'suggestions_id': this.detail.suggestions_id, 'reply_content': this.reply_content})
        .then((res) => {
          console.log('res',res)
          this.visible = false
          this.reply_content = '';
          this.$notification.success({
            message: '回复成功'
          })
          this.getMessageSuggestionsList()
      })
    },
    // 保存
    onSubmitSave() {
      this.handleSubmit();
    },
      handleSubmit() {
          const {
              form: {
                  validateFields
              }
          } = this
          this.confirmLoading = true
          validateFields((errors, values) => {
              if (!errors) {
                  console.log('rerererere',values);
                  values.join_id =this.join_id;
                  values.join_status =this.detail.join_status;
                  this.request(configStreetCommunityApi.subActiveJoin, values)
                      .then((res) => {
                          this.$message.success('编辑成功')
                          this.getActiveJoinList();
                          setTimeout(() => {
                              this.form = this.$form.createForm(this)
                              this.visible = false
                              this.confirmLoading = false
                              this.$emit('ok', values)
                          }, 1500)

                      })
                      .catch((error)=>{
                          this.confirmLoading = false
                      })

                  console.log('values', values)

              } else {
                  this.confirmLoading = false
              }
          })
      },
    // 查看详情  触发右侧抽屉弹出
    lookEdit(e) {
      console.log('e', e)
      this.visible = true
        this.detail = e;
      this.join_id = e.join_id;
      this.active_is_need = e.active_is_need;
      // this.getMessageSuggestionsDetail(e.suggestions_id)
    },
    // 删除
    delInfo(e) {
      let _this = this;
        this.$confirm({
          title: '你确定要删除该报名信息?',
          content: '该报名信息一旦删除不可恢复',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.request(configStreetCommunityApi.delActivityJoin, { activity_id: e.activity_id,join_id:e.join_id})
                    .then((res) => {
                      _this.$message.success('删除成功！');
                      _this.getActiveJoinList()
                    })
          },
          onCancel() {
            console.log('Cancel');
          },
      });
    },
    // 表格中变动  这里只针对页面页数切换
    table_change(e) {
      console.log('e', e)
      if (e.current && e.current>0) {
        this.page = e.current;
        this.getActiveJoinList()
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
      this.getActiveJoinList()
    },
    // 进行重置
    resetList() {
      console.log('search', this.search);
      console.log('search_data', this.search_data);
      this.search.join_name='';
      this.search.join_phone='';
        this.search.status=undefined
      this.search.page=1;
      // this.search = { join_name: '', join_phone: '', page: 1 }
      this.search_data = [];
      this.getActiveJoinList()
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
    padding: 20px 20px 0;
  }
  .message-suggestions-list-box .add-box {
    padding: 20px 20px 0;
  }
  .message-suggestions-list-box .components-table-demo-nested {
    padding: 20px;
  }
  .message-suggestions-list-box .modal_box_title {
    color: #000;
  }
  .message-suggestions-list-box .modal_box_title span{
    color: #F5242E !important;
  }
</style>