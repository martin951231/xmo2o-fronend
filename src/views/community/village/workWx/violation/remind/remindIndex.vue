
<template>
    <div id="components-layout-demo-basic" class="engine-index-box">
        <a-layout>
            <span class="content-p1" v-if="isshow">员工及员工的业主触发敏感词，系统会立即给相应的成员发消息提醒，提醒该员工或是该员工的业主可能出现违规行为，不对群起效，只监控单聊。</span>
            <span class="content-p1" v-if="!isshow">
                <p>业主在业主群的违规提醒。当业主群中，业主触发所设置的违规行为时，群主或是指定成员会立即收到提醒，有效帮助员工管理客户群。</p>
                <p>1、若群主不在可见应用成员范围内，会接收不到提醒通知</p>
                <p>2、若群成员为“外部非联系人”身份时，群主可以看到其违规行为，但不知是谁，用户昵称是“未知”。</p>
            </span>
            <a-layout style="background: #fff">
                <a-layout-content >
                    <div class="card-container">
                        <a-tabs v-if="!channel_code" type="card" style="width: 100%" @change="switchType">
                            <a-tab-pane key="1" tab="员工违规">
                                <div style="margin: 10px;width: 1200px;">
                                    <a-button  v-if="send_type_choose_staff != ''" type="btn" @click="$refs.chooseEnterpriseStaffModal.chooseSearch()" class="add-goods " style="float: left">已选择{{send_type_choose_staff.length}}名成员</a-button>
                                    <a-button  v-else type="btn" @click="$refs.chooseEnterpriseStaffModal.chooseSearch()" class="add-goods " style="float: left">选择部门成员</a-button>
                                    <a-col :md="3" :sm="24" style="display: inline-block !important;">
                                        <a-select placeholder="选择状态" style="width: 100%" label-in-value :default-value ="{key:String(search.send_type)}" @change="handleChangeType">
                                            <a-select-option value="-1" >全部状态</a-select-option>
                                            <a-select-option value="1">开启</a-select-option>
                                            <a-select-option value="0">关闭</a-select-option>
                                        </a-select>
                                    </a-col>
                                    <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
                                    <div class="set_yg">
                                        <a-button type="primary" @click="$refs.violationStaffModal.add()" class="add-goods " style="float: left">设置违规员工</a-button>
                                    </div>
                                </div>
                                <a-col >
                                    <div class="label_" v-for="(item,index) in staff_txt" :key="index">
                                        <a-tag  color="#1890ff" > {{item.value}} </a-tag>
                                    </div>
                                </a-col>
                                <a-table
                                        style="margin: 10px;"
                                        v-if="contentList"
                                        :columns="columns"
                                        :data-source="contentList"
                                        @change="tableChange"
                                        :pagination="pagination"
                                        :loading="loading"
                                >
                                   <span slot="name_" slot-scope="text, record" class="div_">
                                       <div v-if="record.avatar" class="img_"><img :src="record.avatar" /></div>
                                       <div>{{record.name}}</div>
                                    </span>
                                    <span slot="sensitive_tags" slot-scope="tags" >
                                          <a-tag v-for="tags in tags" color="#FCBE79" > {{tags}} </a-tag>
                                    </span>
                                    <span slot="tags" slot-scope="tags">
                                          <a-tag v-for="tag in tags" color="#1890ff" > {{tag}} </a-tag>
                                    </span>
                                    <span slot="status" slot-scope="text, record">
                                      <div v-if="record.status == 0" style="color: red;">关闭</div>
                                      <div v-if="record.status == 1" style="color: #1890ff;">开启</div>
                                    </span>
                                    <span slot="action" slot-scope="text, record">
                                            <a  @click="$refs.violationStaffModal.edit(record.id)">编辑</a>
                                        <!--<a-divider type="vertical" />-->
                                        <!--<a-popconfirm-->
                                        <!--class="ant-dropdown-link"-->
                                        <!--title="确认删除?"-->
                                        <!--ok-text="是"-->
                                        <!--cancel-text="否"-->
                                        <!--@confirm="delAlertC(record.id,1)"-->
                                        <!--@cancel="cancel"-->
                                        <!--v-if="record.type != 4"-->
                                        <!--&gt;-->
                                        <!--<a href="#">删除</a>-->
                                        <!--</a-popconfirm>-->
                                    </span>
                                </a-table>
                            </a-tab-pane>
                            <a-tab-pane key="2" tab="群聊违规">
                                <div style="margin: 10px;width: 1200px;height: 75px;">

                                    <a-button v-if="enterprise_staff != ''" type="btn" @click="$refs.chooseGroupChatModal.add()" class="add-goods " style="float: left">已选择{{enterprise_staff.length}}群聊</a-button>

                                    <a-button v-else type="btn" @click="$refs.chooseGroupChatModal.add()" class="add-goods " style="float: left">选择群聊</a-button>
                                    <a-input-group compact style="width: 180px;float: left">
                                        <a-input style="width: 100%" v-model="queryParam.title" placeholder="请输入规则名称"/>
                                    </a-input-group>
                                    <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
                                    <div class="set_yg">
                                        <a-button type="primary" @click="$refs.violationGroupModal.add()" class="add-goods " style="float: left">设置违规群聊</a-button>
                                    </div>
                                </div>
                                <a-col >
                                    <div class="label_" v-for="(item,index) in group_txt" :key="index">
                                        <a-tag  color="#1890ff" > {{item.value}} </a-tag>
                                    </div>
                                </a-col>
                                <a-table
                                        style="margin: 10px"
                                        v-if="contentList"
                                        :columns="columns_txt"
                                        :data-source="contentList"
                                        @change="tableChange"
                                        :pagination="pagination"
                                        :loading="loading"
                                >
                                    <span slot="groups_tags" slot-scope="tags">
                                          <a-tag v-for="tags in tags"  color="#1890ff" style="margin-bottom: 5px">{{tags}} </a-tag>
                                    </span>
                                    <span slot="action_tags" slot-scope="text, record" >
                                          <a-tag v-for="record in record.action_tags" color="#FCBE79" style="margin-bottom: 5px"> {{record}} </a-tag>
                                        <div>
                                             <a-tag  v-if="record.sensitive_tags !=''" color="#FCBE79" style="margin-bottom: 5px"> {{record.sensitive_tags}} </a-tag>
                                        </div>
                                    </span>
                                    <span slot="remind_info_tags" slot-scope="tags" >
                                          <div v-for="tags in tags"  > {{tags}} </div>
                                    </span>
                                    <span slot="action" slot-scope="text, record">
                                      <a @click="$refs.violationGroupModal.edit(record.id)">编辑</a>
                                      <a-divider type="vertical" />
                                        <a-popconfirm
                                                class="ant-dropdown-link"
                                                title="确认删除?"
                                                ok-text="是"
                                                cancel-text="否"
                                                @confirm="delAlertC(record.id,2)"
                                                @cancel="cancel"
                                        >
                                          <a href="#">删除</a>
                                        </a-popconfirm>
                                    </span>
                                </a-table>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </a-layout-content>
            </a-layout>
            <chooseBranch ref="chooseEnterpriseStaffModal" @change="change_enterprise_staff"/>
            <addStaff ref="violationStaffModal" @ok="add_violation_staff"/>
            <addGroup ref="violationGroupModal" @ok="add_violation_group"/>

            <choose-group-chat ref="chooseGroupChatModal" @change="change_group_chat"/>
        </a-layout>
    </div>
</template>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village'
    import chooseBranch from '../choiceBranch'
    import addStaff from './addStaff'
    import addGroup from './addGroup'
    import chooseGroupChat from '../chioceGroupChat'
    import { getSystemName } from '@/utils/util'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import 'viewerjs/dist/viewer.css'
    Vue.use(Viewer)
    const statusMap = {
        1: {
            status: 'green',//success
            text: '开启'
        },
        0: {
            status: 'red',//processing
            text: '关闭'
        },
    }
    const data = []
    const sortList = []
    export default {
        name: 'remindIndex',
        components: {
            chooseBranch,
            addStaff,
            addGroup,
            chooseGroupChat,
        },
        data() {
            this.cacheData = data.map((item) => ({
                ...item,
            }))
            return {
                form: this.$form.createForm(this),
                id: 1,
                // 查询参数
                queryParam: {
                    gid: '0',
                    title:'',
                },
                queryParams: {
                    gid: '0',
                    title:'',
                },
                // 表头
                columns: [
                    {
                        title: '部门成员',
                        key: 'name',
                        dataIndex: 'name',
                        scopedSlots: { customRender: 'name_' },
                    },
                    {
                        title: '敏感词',
                        key: 'sensitive',
                        dataIndex: 'sensitive',
                        scopedSlots: { customRender: 'sensitive_tags' },
                    },
                    {
                        title: '通知人',
                        key: 'tags',
                        dataIndex: 'tags',
                        scopedSlots: { customRender: 'tags' },
                    },
                    {
                        title: '状态',
                        key: 'status',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                    {
                        title: '操作',
                        key: 'action',
                        dataIndex: 'action',
                        scopedSlots: {
                            customRender: 'action',
                        },
                    },
                ],
                columns_txt: [
                    {
                        title: '规则名称',
                        key: 'rule_name',
                        dataIndex: 'rule_name',
                        width: '12%',
                    },
                    {
                        title: '适合群聊',
                        key: 'groups_tags',
                        dataIndex: 'groups_tags',
                        width: '12%',
                        scopedSlots: { customRender: 'groups_tags' },
                    },
                    {
                        title: '提醒行为',
                        key: 'action_tags',
                        dataIndex: 'action_tags',
                        width: '12%',
                        scopedSlots: { customRender: 'action_tags' },
                    },
                    {
                        title: '通知人',
                        key: 'remind_info',
                        dataIndex: 'remind_info',
                        width: '12%',
                        scopedSlots: { customRender: 'remind_info_tags' },
                    },
                    {
                        title: '添加时间',
                        key: 'add_time',
                        dataIndex: 'add_time',
                        width: '15%',
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        dataIndex: 'action',
                        width: '12%',
                        scopedSlots: {
                            customRender: 'action',
                        },
                    },
                ],
                data,
                sortList,
                contentList: [],
                type: 0,
                clientHeight: 0,
                loading: false,
                sortLoading: false,
                gid:0,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 ,send_type:-1,staff_id:[],group_id:[] },
                page: 1,
                imgUrl:require("@/assets/images/blank.png"),
                id_arr:[],
                first_gid:'',
                default_selected:'',
                autoExpandParent: true,
                expandedKeys:[],
                channel_code:false,
                codeList:[],
                paginations: { pageSize: 10, total:10},
                searchs: { page: 1 },
                pages: 1,
                loadings: false,
                clientHeights: 0,
                id_arr_c:[],
                total_sum_number:'',
                total_sum_numbers:'',
                tokenName: '',
                sysName: '',
                isshow:true,
                isCode:false,
                showMoveCode:false,
                smgHtmlPath:'',
                staff_txt : [],
                group_txt:[],
                send_type_choose_staff :[],
                enterprise_staff :[],
            }
        },
        watch: {
            $route: {
                handler() {
                    this.queryParam.store_id = this.$route.query.store_id
                    this.queryParam.sort_id = 0
                    this.getContentList()
                },
                deep: true,
            },
        },
        created() {
        },
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
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
            this.getContentList()
        },
        computed: {
        },
        methods: {
            moment,
            //选择状态
            handleChangeType(value) {
                this.search.send_type = value.key;
            },
            //选择部门
            change_enterprise_staff(val){
                this.staff_txt=[]
                this.search.staff_id=[];

                this.send_type_choose_staff = val;

                val.filter((item,i)=>{
                    // this.staff_txt.push({
                    //     key:item.split('-')[0],
                    //     value:item.split('-')[1]
                    // })
                    this.search.staff_id[i] = item.split('-')[0];
                });
            },

            //设置违法员工
            add_violation_staff(){
                this.getContentList()
            },

            //设置群聊
            add_violation_group(){
                this.getContentList()
            },
            //选择群聊
            change_group_chat(val){
                this.group_txt=[]
                this.search.group_id=[];
                this.enterprise_staff = val;
                val.filter((item,i)=>{
                    // this.group_txt.push({
                    //     key:item.split('-')[0],
                    //     value:item.split('-')[1]
                    // })
                    this.search.group_id[i] = item.split('-')[0];
                });
            },


            switchType(activeKey){
                if(activeKey == 1){
                    this.isshow = true
                }else{
                    this.isshow = false
                }
                this.type = activeKey-1;
                this.queryParam.title = '';
                this.getContentList();
            },

            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getContentList()
                }
            },
            tableChanges(e) {
                if (e.current && e.current>0) {
                    this.pages = e.current;
                    this.getChannelCodeList()
                }
            },

            // 获得列表
            getContentList(changeTab = true) {
                this.loading = true;
                this.queryParam['page'] = this.page;
                this.queryParam['type'] = this.type;

                this.queryParam['staff_id']= this.search.staff_id;
                this.queryParam['send_type']= this.search.send_type;
                this.queryParam['group_id']= this.search.group_id;

                if (this.tokenName) {
                    this.queryParam['tokenName'] = this.tokenName;
                }
                this.request(villageApi.getViolationRemindList, this.queryParam).then((res) => {
                    this.contentList = res.list;
                    if (changeTab) {
                        this.tabColumn = res.tabs
                    }
                    if(res.list && res.list.length>0) {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10

                    }
                    if(res.title_number){
                        this.total_sum_number = res.title_number;
                    }else{
                        this.total_sum_number =this.total_sum_numbers;
                    }
                    this.loading = false
                })
            },

            //批量删除渠道码
            cancel() {},
            querys() {
                this.getContentList()
            },
            //单个删除数据
            delAlertC(id,t) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除吗？',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        _this.delContent(id,t);
                    },
                    onCancel() {
                    },
                });
            },
            delContent(id,t){
                let param = {
                    'id': id
                };
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                let url=villageApi.delViolationStaff;
                if(t > 1){
                    url=villageApi.delViolationGroup;
                }
                this.request(url, param).then((res) => {
                    if(res)
                    {
                        this.$message.success('操作成功');
                        this.getContentList()
                    }else{
                        this.$message.error('操作失败');
                    }
                })
            }
        },
    }
</script>
<style>
    .div_ div{
        display: inherit;margin-right: 5px;
    }
    .img_ img{
        width: 20%;
    }

    .set_yg{
        padding: 10px 0 30px 0;
    }

    #components-layout-demo-basic {
        text-align: left;
        background: #ffffff;
        height: 100%;
    }

    #components-layout-demo-basic .ant-layout-header,
    #components-layout-demo-basic .ant-layout-footer {
        background: #ffffff;
        color: #fff;
        height: 80px;
    }

    #components-layout-demo-basic .ant-layout-sider {
        background: #ffffff;
        color: #fff;
    }

    #components-layout-demo-basic .ant-layout-content {
        background: #ffffff;
        color: #fff;
        min-height: 120px;
        line-height: 120px;
        padding-left: 20px;
    }

    #components-layout-demo-basic > .ant-layout {
        margin-bottom: 48px;
    }

    #components-layout-demo-basic > .ant-layout:last-child {
        margin: 0;
    }
    #components-layout-demo-basic .add-goods {
        margin: 0 5px;
    }
    #components-layout-demo-basic >>> .ant-btn-group {
        line-height: 80px;
    }
    #components-layout-demo-basic .edit-content {
        float: right;
        /* margin-right: 60px; */
    }
    #components-layout-demo-basic >>> .ant-tabs {
        display: inline-block;
    }
    #components-layout-demo-basic >>> .ant-layout-content {
        /*line-height: 70px;*/
    }
    .ant-pro-page-header-wrap-children-content,
    .ant-pro-page-header-wrap-children-content >>> .ant-tabs {
        width: 100%;
    }
    .ant-popover-inner-content {
        padding: 12px 12px 1px !important;
    }
    .content-p1{
        background-color: #DFEAF6;padding: 10px;font-weight: bold;
    }
    .ant-tabs-nav-wrap{
        background: #FAFAFA;
        height: 98%;
        border-right: 1px solid #eee;
    }
    .card-container {
        margin-top: 10px;
        padding: 5px;
    }
    .card-container > .ant-tabs-card > .ant-tabs-content {
        height: 100%;
        margin-top: -16px;
    }

    .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
        /*background: #fff;*/
        /*width: 1260px;*/
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar {
        border-color: #eee;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
        border-color: transparent;
        /*background: transparent;*/
        margin-right: auto;
        width: 100px;
        text-align: center;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
        border-color: #eee;
        /*background: #fff;*/
    }
    .content_text-text{
        width:100px;
        height:80px;
        line-height:25px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        cursor:pointer;
    }
</style>
