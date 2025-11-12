<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <a-select style="width: 30%" default-value="phone" v-model="search.select_option">
                <a-select-option value="phone">
                  手机号
                </a-select-option>
                <a-select-option value="name">
                  姓名
                </a-select-option>
              </a-select>
              <a-input style="width: 70%" v-model="search.con"/>
            </a-input-group>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <label style="margin-top: 5px;">重点人群类型：</label>
              <a-select placeholder="请选择重点人群类型" style="width: 180px;" v-model="search.type_name">
                <a-select-option value="1">服刑人员</a-select-option>
                <a-select-option value="2">非法组织</a-select-option>
                <a-select-option value="3">上访人员</a-select-option>
              </a-select>
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
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="group_record" slot-scope="text, record">
<!--          <router-link :to="{ path:'/community/streetCommunity/ThreeLessons/MeetingList' }" style="color: #1890ff;">进入会议列表</router-link>-->
          <router-link :to="{ name:'groupRecord',params:{bind_id:record.id,type:3}}" style="color: #1890ff;">查看记录</router-link>
        </span>
        <a slot="action" slot-scope="text, record" @click="look(record.bind_id)">查看</a>
      </a-table>
      <a-drawer
        title="查看"
        :width="720"
        :visible="visible"
        :maskClosable='false'
        :body-style="{ paddingBottom: '80px' }"
        @close="onClose"
      >
        <h2>
          基本信息
        </h2>
        <a-row :gutter="24">
          <a-col :md="4" :sm="24">
            姓名：
          </a-col>
          <a-col :md="20" :sm="24" v-if="detail.name == ''">
            无
          </a-col>
          <a-col :md="20" :sm="24" v-else>
            {{detail.name}}
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="4" :sm="24">
            联系方式：
          </a-col>
          <a-col :md="20" :sm="24" v-if="detail.phone == ''">
            无
          </a-col>
          <a-col :md="20" :sm="24" v-else>
            {{detail.phone}}
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="4" :sm="24">
            身份证号：
          </a-col>
          <a-col :md="20" :sm="24" v-if="detail.cardid == 0">
            无
          </a-col>
          <a-col :md="20" :sm="24" v-else>
            {{detail.cardid}}
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="4" :sm="24">
            地址：
          </a-col>
          <a-col :md="20" :sm="24" v-if="detail.address == 0">
            无
          </a-col>
          <a-col :md="20" :sm="24" v-else>
            {{detail.address}}
          </a-col>
        </a-row>
        <br><br>
        <h2>
          用户资料
        </h2>

        <a-row :gutter="24" v-for="(item,index) in detail.authentication_field">
          <a-col :md="4" :sm="24">
            {{item.title}}
          </a-col>
          <a-col :md="20" :sm="24" v-if="item.value == 0">
            无
          </a-col>
          <a-col :md="20" :sm="24" v-else>
            {{item.value}}
          </a-col>
        </a-row>


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
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    //import categoryInfo from './CategoryInfo.vue'
    export default {
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
                search: { page: 1,select_option:'phone' },
                page: 1,
                detail:{},
            };
        },
        mounted(){
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
                        title: '人员名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '人员联系方式',
                        dataIndex: 'phone',
                        key: 'phone',
                    },
                    {
                        title: '住址',
                        dataIndex: 'address',
                        key: 'address',
                    },
                    {
                        title: '所属特殊人员类型',
                        dataIndex: 'user_focus_groups_txt',
                        key: 'user_focus_groups_txt',
                    },
                    {
                        title: '跟踪记录',
                        dataIndex: '',
                        key: 'group_record',
                        scopedSlots: {
                            customRender: 'group_record'
                        }
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
                this.search['page'] = this.page;
                this.search['limit'] = this.pagination.pageSize;
                this.search['type'] = 3;
                this.request(streetCommunityApi.userVulnerableGroupsLists, this.search)
                    .then((res) => {
                        console.log('res', res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            // 右侧弹出抽屉关闭
            onClose() {
                this.visible = false;
            },
            getGroupDetail(id){
                let _this = this;
                this.request(streetCommunityApi.getGroupDetail, { pigcms_id: id})
                    .then((res) => {
                        console.log('res',res)
                        _this.detail = res
                    })
            },
            // 查看详情  触发右侧抽屉弹出
            look(e) {
                this.visible = true
                this.getGroupDetail(e)
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.page = page
                this.getGroupsList()
                console.log('onTableChange==>', page, pageSize)
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
                console.log('search', this.search);
                console.log('search_data', this.search_data);
                this.search = {'select_option': 'phone', value: '', status: '', date: [], page: 1 }
                this.search_data = [];
                this.getGroupsList()
            },
        },
    };
</script>
<style>
  .table-operator{
    margin-bottom: 10px;
  }
</style>