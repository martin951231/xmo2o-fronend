<template>
  <div class="message-suggestions-list-box">
    <a-collapse :activeKey="1">
      <a-collapse-panel key="1" header="注意事项(点击可收起)">
        <a-alert message="" type="info">
          <div slot="description">
            <div><b>【业主/业主群】群发注意事项</b>：</div>
            <div>1.第三方应用需具有“企业客户权限->客户联系->群发消息给客户和客户群”权限。</div>
            <div>2.不会直接发送消息给客户/客户群，需要企微工作人员确认后才会执行发送（企微工作人员的企业微信需要升级到2.7.5及以上版本）。</div>
            <div>3.仅会推送给最后跟客户进行聊天互动的企微工作人员。</div>
            <div>4.每位客户/每个客户群每天可接收1条群发消息。超过接收上限的客户/客户群将无法再收到群发消息。</div>
            <div><b>【企业成员（企微工作人员）】群发注意事项</b>：</div>
            <div>5.推送企业成员需要包含应用可见范围和基础接口权限【购买接口许可-互通账号】。</div>
            <div>6.如果有在管理端对应用设置“在微工作台中始终进入主页”，应用在微信端只能接收到文本消息，并且文本消息的长度限制为20字节，超过20字节会被截断。同时其他消息类型也会转换为文本消息，提示用户到企业微信查看。。</div>
            <div>7.调用建议：大部分企业应用在每小时的0分或30分触发推送消息，容易造成资源挤占，从而投递不够及时，建议尽量避开这两个时间点进行调用。</div>
          </div>
        </a-alert>
      </a-collapse-panel>
    </a-collapse>
    <div class="search-box">
      <a-row :gutter="48">
        <a-col :md="4" :sm="24">
          <label style="margin-top: 5px;">发送类型：</label>
          <a-select placeholder="发送类型" style="width: 55%" label-in-value :default-value ="{key:String(search.send_type)}" @change="handleChangeType">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option value="1">业主</a-select-option>
            <a-select-option value="2">业主群</a-select-option>
            <a-select-option value="3">企业成员</a-select-option>
          </a-select>
        </a-col>
        <a-col :md="4" :sm="24">
          <label style="margin-top: 5px;">发送状态：</label>
          <a-select placeholder="发送状态" default-value="0" style="width: 55%" label-in-value :default-value ="{key:String(search.send_status)}" @change="handleChangeStatus">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option value="1">发送成功</a-select-option>
            <a-select-option value="2">发送中</a-select-option>
            <a-select-option value="3">未发送</a-select-option>
            <a-select-option value="4">发送失败</a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-input-group compact>
            <label style="margin-top: 5px;">群发消息：</label><a-input style="width: 70%" v-model="search.message_name" placeholder="请输入消息名称" />
          </a-input-group>
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
        <!--<a-col :md="2" :sm="24">
          <a-button  @click="resetList()">重置</a-button>
        </a-col>-->
      </a-row>
    </div>
    <div class="table-operator">
      <!--<a-button type="primary" icon="plus" style="margin-top: 20px;margin-left: 20px" @click="$refs.addQywxMessageModel.add()">添加消息</a-button>-->
      <router-link :to="{ path:'/'+sysName+'/'+sysName+'.workWx.sendMessage/addQywxMessage'}" style="color: #1890ff;"><a-button type="primary" icon="plus" style="margin-top: 20px;margin-left: 20px">添加消息</a-button></router-link>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'
    >
      <span slot="action" slot-scope="text, record">
          <a @click="showReordDrawer(record.id,record.message_name)" v-if="record.send_type == 1">群发记录</a>
         <a-divider type="vertical" v-if="record.send_type == 1" />
          <!--<a @click="showDrawer(record.id)">预览内容</a>
        <a-divider type="vertical"/>-->
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="del(record.id)"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
      <span slot="sure" slot-scope="text, record">
        <a-tooltip placement="top">
        <template slot="title">
          <a-tag color="blue" v-for="(value1,index1) in record.worker" :key="index1">
            {{value1.name}}
          </a-tag>
        </template>
        <a-tag color="blue" v-for="(value2,index2) in record.worker" :key="index2" v-if="index2 < 3">
          {{value2.name}}
        </a-tag> 
        <span v-if="record.worker.length > 3">等{{record.worker.length}}位成员</span>
      </a-tooltip>
      </span>
    </a-table>
    <a-drawer
      title="预览内容"
      placement="right"
      :closable="false"
      :visible="visible"
      width="400px"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <div class="left" style="width: 100%;height: 830px;background-color: white;overflow: auto">
        <div class="left_content"  v-for="(item,index) in message_content_arr" :key="index">
          <div class="avatar"><img src="../../../../../assets/image/avatar.png"></div>
          <div class="des" v-if="item.type == 1">{{item.content}}</div>
        </div>
      </div>
    </a-drawer>
    <a-drawer
      :title="ReordDrawerTitle"
      placement="right"
      :closable="true"
      :visible="visible_record"
      width="1000px"
      :maskClosable="false"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <!--<div class="record_top">向【费少春】 、【韦顺】 共计15位客户，发送群发消息</div>-->
      <div class="record_center">
        <div class="center_box">
          <h3 ><strong>已送达</strong></h3>
          <h3>
            {{arrived}}
            <a-tooltip placement="right">
            <template slot="title">
              <span>在预计发送客户中，已收到成员推送的消息（同一客户添加多个员工，只计入1个成员推送）</span>
            </template>
            <img style="margin-left: 5px;margin-top: -2px" src="../../../../../assets/image/more.png">
          </a-tooltip>
          </h3>
        </div>
        <div class="center_box">
          <h3 ><strong>未送达客户</strong></h3>
          <h3>
            {{no_arrived}}
            <a-tooltip placement="right">
              <template slot="title">
                <span>在预计发送客户中，未收到成员推送的消息</span>
              </template>
              <img style="margin-left: 5px;margin-top: -2px" src="../../../../../assets/image/more.png">
            </a-tooltip>
          </h3>
        </div>
        <div class="center_box">
          <h3 ><strong>未知原因导致失败</strong></h3>
          <h3>
            {{unknow_reason}}
            <a-tooltip placement="right">
              <template slot="title">
                <span>客户已经收到其他群发消息导致发送失败等其他原因导致失败</span>
              </template>
              <img style="margin-left: 5px;margin-top: -2px" src="../../../../../assets/image/more.png">
            </a-tooltip>
          </h3>
        </div>
        <div class="center_box">
          <h3 ><strong>因不是好友发送失败</strong></h3>
          <h3>
            {{not_friend}}
            <a-tooltip placement="left">
              <template slot="title">
                <span>成员已被客户删除/拉黑</span>
              </template>
              <img style="margin-left: 5px;margin-top: -2px" src="../../../../../assets/image/more.png">
            </a-tooltip>
          </h3>
        </div>
      </div>
      <div class="record_bottom">
        <a-tabs type="card" @change="callback">
          <a-tab-pane key="1" tab="群发记录">
            <span>共<b style="color: dodgerblue">{{pagination_record.total}}</b>个客户</span>
            <div class="search-box" style="margin-top: 20px;margin-bottom: 20px">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-input-group compact>
                    <label style="margin-top: 5px;">搜索客户：</label><a-input style="width: 60%" v-model="search_record.name" placeholder="请输入要搜索的客户" />
                  </a-input-group>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-input-group compact>
                    <label style="margin-top: 5px;">所属成员：</label><a-input type="button" style="width: 60%" :value="enterprise_staff_txt" @click="$refs.chooseEnterpriseStaffModal.choose()" />
                  </a-input-group>
                </a-col>
                <!--<a-col :md="5" :sm="24">
                  <a-select placeholder="送达状态" style="width: 100%" label-in-value :default-value ="{key:String(search_record.send_type)}" @change="handleChangeType">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">业主</a-select-option>
                    <a-select-option value="2">业主群</a-select-option>
                    <a-select-option value="3">企业成员</a-select-option>
                  </a-select>
                </a-col>-->
                <a-col :md="2" :sm="24">
                  <a-button type="primary" icon="search" @click="searchRecordList()">
                    查询
                  </a-button>
                </a-col>
                <a-col :md="2" :sm="24">
                  <a-button  @click="resetRecordList()">重置</a-button>
                </a-col>
              </a-row>
            </div>
            <a-table
              :columns="columns_message_record"
              :data-source="data_message_record"
              class="components-table-demo-nested"
              :pagination="pagination_record"
              @change='table_change_record'
            >
              <span slot="avatar" slot-scope="text, record">
                <img :src="record.avatar" style="width: 50px;height: 50px">
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="成员确认">
            <span>共<b style="color: dodgerblue">{{pagination_staff.total}}</b>个成员</span>
            <div class="search-box" style="margin-top: 20px;margin-bottom: 20px">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-input-group compact>
                    <label style="margin-top: 5px;">搜索成员：</label><a-input style="width: 60%" v-model="search_staff.name" placeholder="请输入要搜索的成员" />
                  </a-input-group>
                </a-col>
                <!--<a-col :md="5" :sm="24">
                  <a-select placeholder="送达状态" style="width: 100%" label-in-value :default-value ="{key:String(search.send_type)}" @change="handleChangeType">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">业主</a-select-option>
                    <a-select-option value="2">业主群</a-select-option>
                    <a-select-option value="3">企业成员</a-select-option>
                  </a-select>
                </a-col>-->
                <a-col :md="2" :sm="24">
                  <a-button type="primary" icon="search" @click="searchStaffList()">
                    查询
                  </a-button>
                </a-col>
                <a-col :md="2" :sm="24">
                  <a-button @click="resetStaffList()">重置</a-button>
                </a-col>
              </a-row>
            </div>
            <a-table
              :columns="columns_staff_record"
              :data-source="data_staff_record"
              class="components-table-demo-nested"
              :pagination="pagination_staff"
              @change='table_change_staff'
            >
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-drawer>
    <choose-enterprise-staff ref="chooseEnterpriseStaffModal" @change="change_enterprise_staff" />
  </div>
</template>
<script>
    import configVillageApi from '@/api/community/village'
    import chooseEnterpriseStaff from './chooseEnterpriseStaff'
    import { getSystemName } from '@/utils/util'
    const columns = [
        { title: '群发消息',  dataIndex: 'message_name', key: 'message_name',width:200},
        { title: '发送类型', dataIndex: 'send_type_txt', key: 'send_type_txt',width:100},
        { title: '成员确认', dataIndex: 'send_user', key: 'send_user',scopedSlots: { customRender: 'sure' },width:400},
        { title: '发送情况', dataIndex: 'send_res', key: 'send_res'},
        { title: '发送状态', dataIndex: 'send_status_txt', key: 'send_status_txt'},
        { title: '发送时间', dataIndex: 'send_time_txt', key: 'send_time_txt'},
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            scopedSlots: { customRender: 'action' },
        },
    ];
    const columns_message_record = [
        { title: '客户',  dataIndex: 'avatar', key: 'avatar',scopedSlots: { customRender: 'avatar' }},
        { title: '所属成员', dataIndex: 'name', key: 'name'},
        { title: '送达时间', dataIndex: 'send_time', key: 'send_time'},
        { title: '送达状态', dataIndex: 'status', key: 'status'},
    ];
    const columns_staff_record = [
        { title: '成员',  dataIndex: 'name', key: 'name'},
        { title: '预计发送客户', dataIndex: 'send_total_count', key: 'send_total_count'},
        { title: '实际发送客户', dataIndex: 'send_reality_count', key: 'send_reality_count'},
        { title: '排队发送时间', dataIndex: 'send_time', key: 'send_time'},
        { title: '发送状态', dataIndex: 'status', key: 'status'},
    ];
    export default {
        components:{
            chooseEnterpriseStaff
        },
        name: 'messageList',
        inject:['reload'],
        data() {
            return {
                pagination: { pageSize: 10, total:10 },
                pagination_record:{pageSize: 10, total:10},
                pagination_staff:{pageSize: 0, total:0},
                search_data: [],
                search: {send_type:0,send_status:0,page:1,message_name:''},
                search_record:{page:1,name:'',wname:'',send_type:'0'},
                search_staff:{page:1,name:''},
                form: this.$form.createForm(this),
                data:[],
                data_message_record:[],
                enterprise_staff:[],  //已经选择的成员
                enterprise_staff_txt:'选择成员',
                data_staff_record:[],
                visible:false,
                visible_record:false,
                message_content_arr:[],//群发消息内容
                columns,
                columns_message_record,
                columns_staff_record,
                page: 1,
                page_record:1,
                ReordDrawerTitle:'',
                arrived:0,
                no_arrived:0,
                not_friend:0,
                unknow_reason:0,
                tokenName: '',
                sysName: '',
                message_id:0,
            };
        },
        mounted () {
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
            this.getSendMessageList()
        },
        methods: {
            handleChangeType(value) {
                this.search.send_type = value.key;
            },
            handleChangeStatus(value) {
                this.search.send_status = value.key;
            },
            // 获取群发信息列表
            getSendMessageList() {
                this.search['page'] = this.page;
                let _this = this;
                if (this.tokenName) {
                    this.search['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.getSendMessageList, this.search)
                    .then((res) => {
                        console.log('res',res)
                        _this.pagination.total = res.count ? res.count : 0
                        _this.data = res.list
                    })
            },
            del(id){
                let param = {
                    'id': id
                };
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.delSendMessage,param).then((res)=>{
                    this.reload();
                })
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getSendMessageList()
                }
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            // 进行搜索
            searchList() {
                this.getSendMessageList()
            },
            searchRecordList() {
                this.getMessageRecord(this.message_id);
            },
            searchStaffList(){
                //this.search_staff = {page:1,name:''},
                this.search_staff.page = 1;
                this.getStaffConfirm(this.message_id);
            },
            // 进行重置
            resetList() {
                this.search = {send_type:0,send_status:0,page:1,message_name:''};
                this.search_data = [];
                this.getSendMessageList()
            },
            resetRecordList(){
                this.search_record = {page:1,name:'',wname:'',send_type:'',message_id:this.message_id,enterprise_staff:[]};
                this.getMessageRecord(this.message_id);
            },
            resetStaffList(){
                this.search_staff = {page:1,name:''};
                this.getStaffConfirm(this.message_id);
            },
            afterVisibleChange(val) {
                console.log('visible', val);
            },
            showDrawer(id) {
                this.visible = true;
                this.getMessageContent(id);
            },
            getMessageContent(id){
                let param = {
                    'message_id': id
                };
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.getMessageContent,param).then((res)=>{
                    this.message_content_arr = res;
                    console.log(this.message_content_arr)
                })
            },
            getMessageRecord(message_id){
                this.search_record['page'] = this.page_record;
                this.search_record['enterprise_staff'] = this.enterprise_staff;
                if(message_id)
                    this.search_record['message_id'] = message_id;
                let _this = this;
                if (this.tokenName) {
                    this.search_record['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.getMessageRecord, this.search_record)
                    .then((res) => {
                        console.log('res',res)
                        _this.pagination_record.total = res.count ? res.count : 0
                        _this.data_message_record = res.list
                        _this.arrived = res.arrived;
                        _this.no_arrived = res.no_arrived;
                        _this.not_friend = res.not_friend;
                        _this.unknow_reason = res.unknow_reason;
                    })
            },
            getStaffConfirm(message_id){
                this.search_staff.message_id = message_id;
                this.request(configVillageApi.getStaffConfirm,this.search_staff)
                    .then((res)=>{
                        this.data_staff_record = res.list;
                        this.pagination_staff.total = res.count?res.count:0;
                    })
            },
            table_change_record(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.page_record = e.current;
                    this.getMessageRecord(0)
                }
            },
            table_change_staff(e){
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.search_staff.page = e.current;
                    this.getStaffConfirm(this.message_id)
                }
            },
            showReordDrawer(message_id,message_name){
                this.visible_record = true;
                this.ReordDrawerTitle = message_name;
                this.message_id = message_id;
                this.getMessageRecord(message_id);
            },
            onClose() {
                this.visible = false;
                this.visible_record = false;
            },
            callback(key) {
                console.log(key);
                if(key == 2)
                    this.getStaffConfirm(this.message_id);
                if(key == 1)
                    this.getMessageRecord(this.message_id);
            },
            change_enterprise_staff(val){
                this.enterprise_staff = val;
                if(val.length >0){
                    this.enterprise_staff_txt = '已选择'+val.length+'个成员';
                }else{
                    this.enterprise_staff_txt = '选择成员';
                }
            },
        }
    };
</script>

<style lang="less" scoped>
  .message-suggestions-list-box {
    padding: 5px 10px;
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
  .left_content{
    width: 90%;
    margin-left: 3%;
    margin-top: 100px;
    padding-top: 1px;
  }
  .left{
    background-image:url('../../../../../assets/image/wx_bg.png');
    background-size:100% 100%;
    background-repeat: no-repeat;
  }
  .avatar{
    width: 15%;
    float: left;
  }
  .des{
    width: 84%;
    float: right;
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 8px;
  }
  .record_top{
    height: 50px;
    line-height: 50px;
    margin-left: 2%;
  }
  .record_center{
    margin-left: 2%;
    height: 90px;
    width:95%;
    background-color: #E0E0E0	;
  }
  .center_box{
    float: left;
    width: 25%;
    border: 1px solid lightgray;
    height: 90px;
    text-align: center;
    line-height: 43px;
  }
  .record_bottom{
    margin-left: 2%;
    width: 95%;
    margin-top: 20px;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: rgba(240, 240, 240, 1);
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
    border-radius: 10px;
    background-color: rgba(240, 240, 240, .5);
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
    background-color: rgba(240, 240, 240, .5);
  }
</style>