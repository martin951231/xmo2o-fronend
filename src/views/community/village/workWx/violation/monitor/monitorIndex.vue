<template>
  <div id="components-layout-demo-basic1" class="engine-index-box">
    <a-layout style="background: #fff;margin-top: 10px">
      <span class="content-p2">
                <p>1、当敏感词被不启用时，曾经所触发的内容依然在列表中可见。</p>
                <p>2、显示历史上开启会话存档的企业成员。若曾经设置过某员工违规提醒，现在对该员工关闭、不再开启会话存档或是该员工离职，那么其历史触发敏感词的监控内容，依然在列表中可见。</p>
                <p>3、显示历史上设置过违规提醒的群聊。如曾经设置过某群聊违规提醒，现在该群聊不再设置，那么其历史触发敏感词的监控内容，依然在列表中可见。</p>
            </span>
      <a-layout-content v-if="treeData && treeData.length>0">
        <div class="card-container1">
          <a-tabs type="card" style="width: 100%" @change="switchType">
            <a-tab-pane key="1" tab="敏感词监控">
              <div style="margin: 10px;width: 1200px;height: 40px;">
                <a-button v-model="queryParam.user"  @click="$refs.chooseEnterpriseStaffModal.choose('send_type')">
                  <span v-if="send_type_choose_staff != ''">已选择{{send_type_choose_staff.length}}名成员，0个部门</span>
                  <span v-else>选择部门成员</span>
                </a-button>
                <a-button style="margin-left: 5px;" v-model="queryParam.group" @click="$refs.chooseGroupChatModal.add()">
                  <span v-if="group_chat!=''">已选择{{group_chat.length}}个群聊</span>
                  <span v-else>选择群聊</span>
                  </a-button>
                <label style="margin-left: 5px;">发送时间：</label>
                <a-range-picker v-model="queryParam.time"/>
                <a-button type="primary" @click="query()" class="add-goods">查询</a-button>
              </div>
              <div style="margin-left: 10px;margin-top: 15px;margin-bottom: 15px">
                <span>共有  <span style="color: #0a8ddf">{{count1}}</span>  条违规内容</span>
              </div>
              <a-list :grid="{ gutter: 16, column: 1 }" :data-source="monitorList" :pagination="paginations" style="width: 90%">
                <a-list-item slot="renderItem" slot-scope="item, index" itemLayout="vertical">
                  <a-card :title="item.title" style="position: relative;margin-left: 10px;" >
                    <a-list-item-meta  >
                      <a style="padding-top: 5px;" slot="title">{{ item.from_name }}</a>
                      <a-avatar style="width: 40px;height: 40px"
                        slot="avatar"
                        :src="item.avatar"
                      />
                    </a-list-item-meta>
                    <div style="margin-left: 57px;">  祝你生活<span style="color: #0a8ddf">愉快</span></div>
                    <div class="time_style">{{item.time}}</div>
                  </a-card>

                </a-list-item>

              </a-list>
              <choose-enterprise-staff ref="chooseEnterpriseStaffModal" @change="change_enterprise_staff"/>
              <choose-group-chat ref="chooseGroupChatModal" @change="change_group_chat"/>
            </a-tab-pane>
            <a-tab-pane key="2" tab="敏感词词库">
              <div style="margin: 13px;width: 1200px;height: 40px;">
                <a-input-group compact style="width: 270px;float: left">
                  <label style="margin-top: 5px;">敏感词：</label>
                  <a-input style="width: 200px;" v-model="queryParams.title" placeholder="可输入敏感词名称"/>
                </a-input-group>
                <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
                <a-button type="primary" class="add-goods" @click="batchDel()">批量删除</a-button>
              </div>
              <div class="board-content" style="margin-left: 5px;">
                <a-button type="primary" class="add-goods" @click="$refs.createModal.add()">添加
                </a-button>
              </div>
              <div style="margin-left: 10px;margin-top: 15px;">
                <span>共有  <span style="color: #0a8ddf">{{count}}</span>  个敏感词</span>
              </div>
              <a-table
                style="margin: 10px"
                :columns="columns_txt"
                :data-source="contentList1"
                @change="tableChange"
                rowKey="id"
                :row-selection="rowSelection"
                :pagination="pagination"
                :loading="loading"
              >
                <span slot="status" slot-scope="text, record">
                  <div> <a-switch checked-children="开" un-checked-children="关"
                                  @change="onSwitchChange($event,record.id)"
                                  :checked="text==1 ? true : false"/></div>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-popconfirm
                      class="ant-dropdown-link"
                      title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="delContent(record.id)"
                      @cancel="cancel"
                    >
                      <a href="#">删除</a>
                    </a-popconfirm>
                </span>
                <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }}</template>
              </a-table>
              <momitor-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout-content>
      <a-layout-content v-else>
        <div style="width: 98%;">
          <div style="text-align: center;margin-top:15%">
            <img :src="imgUrl">
            <p style="color: #0a0a0a;font-size: 16px">您还没有添加任何数据</p>
            <p style="color: #626262;margin-top:-50px;font-size: 14px">您需要添加分类，再添加资产</p>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
  const treeData = [
    {
      title: 'parent 1',
      key: '0-0-1',
      children: [
        {title: 'leaf', key: '0-1-1', 'id': 1},
        {title: 'leaf', key: '0-1-2', 'id': 2},
      ],
    },
    {
      title: 'parent 2',
      key: '0-0-2',
      children: [
        {title: 'leaf', key: '0-2-1'},
        {title: 'leaf', key: '0-2-2'},
      ],
    },
  ];
  import villageApi from '@/api/community/village'
  import chooseEnterpriseStaff from '../choiceBranch'
  import chooseGroupChat from '../chioceGroupChat'
  import {getSystemName} from '@/utils/util'
  import 'viewerjs/dist/viewer.css'
  import momitorInfo from './monitorInfo'

  const statusMap = {
    1: {
      status: 'green',//success
      text: '正常'
    },
    2: {
      status: '#108ee9',//processing
      text: '领用'
    },
  }

  const data = []
  const sortList = []
  let id = 0;
  export default {
    name: 'monitorIndex',
    components: {
      momitorInfo,
      chooseEnterpriseStaff,
      chooseGroupChat,
    },
    data() {
      this.cacheData = data.map((item) => ({
        ...item,
      }))
      return {
        id: 1,
        // 查询参数
        queryParam: {
          user: '0',
          group: '',
          time:'',
        },
        queryParams: {
          id: '0',
          title: '',
        },
        // 表头
        columns_txt: [
          {
            title: '敏感词名称',
            dataIndex: 'name',
            key: 'name',
            width: '12%',
          },
          {
            title: '员工触发次数',
            dataIndex: 'trigger_worker_num',
            key: 'trigger_worker_num',
            width: '12%',
          },
          {
            title: '业主触发次数',
            dataIndex: 'trigger_user_num',
            key: 'trigger_user_num',
            width: '12%',
          },

          {
            title: '添加时间',
            dataIndex: 'time',
            key: 'time',
            width: '15%',
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            scopedSlots: {
              customRender: 'status',
            },
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '15%',
            scopedSlots: {
              customRender: 'action',
            },
          },
        ],
        data,
        sortList,
        selectedRowKeys: [],
        contentList: [],
        monitorList:[],
        contentList1: [],
        send_type_choose_staff :[], //企业成员选择成员
        enterprise_staff:[],
        group_chat:[],
        type: 0,
        clientHeight: 0,
        loading: false,
        sortLoading: false,
        treeData,
        count: 0,
        count1:0,
        dateFormat:'YYYY-MM-DD',
        pagination: {pageSize: 10, total: 10},
        search: {page: 1},
        page: 1,
        imgUrl: require("@/assets/images/blank.png"),
        id_arr: [],
        paginations: {pageSize: 10, total: 10},
        searchs: {page: 1},
        pages: 1,
        loadings: false,
        clientHeights: 0,
        id_arr_c: [],
        tokenName: '',
        sysName: ''

      }
    },
    created() {
    },
    activated(){
      this.getMonitorList();
    },
    mounted() {
      this.clientHeight = window.document.body.clientHeight
      window.onresize = () => {
        this.clientHeight = window.document.body.clientHeight
      }
      let sysName = getSystemName(location.hash);
      if (sysName) {
        this.tokenName = sysName + '_access_token';
        this.sysName = sysName;
      } else {
        this.sysName = 'village';
      }
    },
    computed: {
      // 表格选择操作
      rowSelection() {
        return {
          onChange: this.onSelectChange,
        }
      },
    },
    methods: {
      // 表格选择操作
      onSelectChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.id_arr = selectedRows;
        console.log('id', this.id_arr)
      },
      onSwitchChange(e, id) {
        console.log('checked', e)
        let status = e == true ? 1 : 2;
        let param = {
          'id': id,
          'status': status
        }
        if (this.tokenName) {
          param['tokenName'] = this.tokenName;
        }
        this.request(villageApi.editSensitiveStatus, param).then((res) => {
          if (res) {
            this.$message.success('操作成功');
            this.getContentList()
          } else {
            this.$message.error('操作失败');
          }
        })
      },
      handleOks() {
        this.getContentList();
      },
      switchType(activeKey) {
        console.log('activeKey', activeKey - 1);
        this.type = activeKey - 1;
        this.queryParam.title = '';
        this.count = 0;
        this.getMonitorList();
        this.getContentList();


      },
      tableChange(e) {
        if (e.current && e.current > 0) {
          this.page = e.current;
          this.getContentList()
        }
      },
      //批量删除
      batchDel() {
        console.log('id_arr', this.id_arr);
        if (this.id_arr.length > 0) {
          var _this = this;
          this.$confirm({
            title: '提示',
            content: '您确定要删除吗？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
              let param = {
                'id': _this.id_arr
              };
              if (_this.tokenName) {
                param['tokenName'] = _this.tokenName;
              }
              _this.request(villageApi.delSensitive, param).then((res) => {
                if (res) {
                  _this.$message.success('操作成功');
                  _this.getContentList()
                } else {
                  _this.$message.error('操作失败');
                }
              })
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        } else {
          this.$confirm({
            title: '提示',
            content: '请选择要删除的内容',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }
      },
      // 获得列表
      getContentList(changeTab = true) {
        this.loading = true;
        this.queryParams['page'] = this.page;
        this.queryParams['type'] = this.type;
        if (this.tokenName) {
          this.queryParams['tokenName'] = this.tokenName;
        }
        this.request(villageApi.getSensitiveList, this.queryParams).then((res) => {
          this.contentList1 = res.list;
          console.log(res.list);
          if (changeTab) {
            this.tabColumn = res.tabs
          }
          if (res.list && res.list.length > 0) {
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10

          }
          if (res.title_number) {
            this.total_sum_number = res.title_number;
          } else {
            this.total_sum_number = this.total_sum_numbers;
          }
          this.count = res.count;
          this.loading = false
        })
      },
      // 获得列表
      getMonitorList(changeTab = true) {
        this.loading = true;
        this.queryParam['page'] = this.page;
        this.queryParam['type'] = this.type;
        this.queryParam['user_arr'] = this.send_type_choose_staff;
        this.queryParam['group_arr'] = this.group_chat;

        console.log('queryParam',this.queryParam)
        if (this.tokenName) {
          this.queryParam['tokenName'] = this.tokenName;
        }
        this.request(villageApi.getMonitorList, this.queryParam).then((res) => {
          this.monitorList = res.list;
          console.log(res.list);
          if (changeTab) {
            this.tabColumn = res.tabs
          }
          if (res.list && res.list.length > 0) {
            this.paginations.total = res.count ? res.count : 0
            this.paginations.pageSize = res.total_limit ? res.total_limit : 10

          }
          this.count1=res.count
          this.loading = false
        })
      },
      cancel() {
      },
      change_enterprise_staff(val){
        this.enterprise_staff = val;
        this.send_type_choose_staff = val;
      },
      change_group_chat(val){
        this.group_chat = val;
        console.log('group_chat',this.group_chat)
      },
      querys() {
        console.log('search', this.queryParam);
        this.getContentList()
      },
      delContent(id) {
        let param = {
          'id': id
        };
        if (this.tokenName) {
          param['tokenName'] = this.tokenName;
        }
        this.request(villageApi.delSensitive, param).then((res) => {
          if (res) {
            this.$message.success('操作成功');
            this.getContentList()
          } else {
            this.$message.error('操作失败');
          }
        })
      },
      query() {
        console.log('search', this.queryParam);
        this.getMonitorList()
      },
    }
    ,
  }
</script>
<style>
  .title-item {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
    white-space: normal;
  }

  .line {
    border-right: 1px solid #ddd;
    height: 98%;
    margin-top: 10px;
    margin-left: 10px;
  }

  #components-layout-demo-basic1 {
    text-align: left;
    background: #ffffff;
    height: 100%;
  }

  /*  #components-layout-demo-basic1 .ant-layout {
      height: 100%;
    }*/

  #components-layout-demo-basic1 .ant-layout-header,
  #components-layout-demo-basic1 .ant-layout-footer {
    background: #ffffff;
    color: #fff;
    height: 80px;
  }

  #components-layout-demo-basic1 .ant-layout-sider {
    background: #ffffff;
    color: #fff;
  }

  #components-layout-demo-basic1 .ant-layout-content {
    background: #ffffff;
    color: #fff;
    min-height: 120px;
    line-height: 120px;
    /* padding-left: 20px;*/
  }

  #components-layout-demo-basic1 > .ant-layout {
    margin-bottom: 48px;
  }

  #components-layout-demo-basic1 > .ant-layout:last-child {
    margin: 0;
  }

  #components-layout-demo-basic1 .add-goods {
    margin: 0 5px;
  }

  #components-layout-demo-basic1 >>> .ant-btn-group {
    line-height: 80px;
  }

  #components-layout-demo-basic1 .edit-content {
    float: right;
    /* margin-right: 60px; */
  }

  #components-layout-demo-basic1 >>> .ant-tabs {
    display: inline-block;
  }

  #components-layout-demo-basic1 >>> .ant-layout-content {
    /*line-height: 70px;*/
  }

  .ant-pro-page-header-wrap-children-content,
  .ant-pro-page-header-wrap-children-content >>> .ant-tabs {
    width: 100%;
  }

  .ant-popover-inner-content {
    padding: 12px 12px 1px !important;
  }

  .content-p2 {
    background-color: #DFEAF6;
    padding: 5px;
    font-weight: bold;
  }

  .ant-tabs-nav-wrap {
    background: #FAFAFA;
    height: 98%;
    border-right: 1px solid #eee;
  }

  .card-container1 {
    margin-top: 10px;
    /* padding: 5px;*/
  }

  .card-container1 > .ant-tabs-card > .ant-tabs-content {
    height: 100%;
    margin-top: -16px;
  }

  .card-container1 > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    /*background: #fff;*/
    /*width: 1260px;*/
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }

  .card-container1 > .ant-tabs-card > .ant-tabs-bar {
    border-color: #eee;
  }

  .card-container1 > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent;
    /*background: transparent;*/
    margin-right: auto;
    width: 100px;
    text-align: center;
  }

  .card-container1 > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
    border-color: #eee;
    /*background: #fff;*/
  }

  .content_text-text {
    width: 100px;
    height: 80px;
    line-height: 25px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    cursor: pointer;
  }
  .time_style {
    position: absolute;
    top: 20px;
    right: 10px;
    font-size: 16px;
  }
  .ant-card-body {
    padding: 1px;
    zoom: 1;
    padding-left: 6px;
    padding-top: 16px;
    padding-bottom: 10px;
  }
</style>
