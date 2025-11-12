<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-layout style="padding: 0 20px; background: #fff;">
                <a-layout-sider style="min-width: 300px;">
                    <div :style="'margin:10px 5px 5px -3px'">
                        <a-input style="width: 180px;height: 28px" placeholder="搜索编号/姓名/手机号"
                            v-model="queryParam.keywords" />
                        <a-button type="primary" class="add-goods ant-btn btn_an" @click="search_all()">搜索</a-button>
                        <a-button class="add-goods ant-btn btn_an" @click="resetList()">重置</a-button>
                    </div>
                    <template>
                        <div class="left_tree">
                            <a-tree :treeData="treeData" :default-expand-all="defaultExpandAll"
                                :selected-keys="[default_selected]" @select="onSelect"
                                :defaultExpandedKeys="[default_selected]" v-if="default_selected">
                                <template slot="edit_out" slot-scope="item">
                                    <div class="tree_name_content">
                                        <span class="node-title tree_name" id="title-item">
                                            <img v-if="item.type*1 == 1" src="https://hf.pigcms.com/static/images/village_icon_press.png" class="icon_press">
                                            <img v-if="item.type*1 == 2" src="https://hf.pigcms.com/static/images/property_icon_press.png" class="icon_press">
                                            <!-- <img src="https://hf.pigcms.com/static/images/street_icon_press.png" class="icon_press"> -->
                                            <a-tooltip placement="topLeft" :title="item.title">
                                                {{ item.title }}
                                            </a-tooltip>
                                        </span>
                                        <div class="right_operation">
                                            <span class="icon-wrap" v-if="item.is_del*1==1">
                                                <a @click="delAlert(item.id)">
                                                    <a-icon type="close" />
                                                </a>
                                            </span>
                                            <span class="icon-wrap" style="margin-left: 10px;" v-if="item.is_edit*1==1 || (role_type*1==1 && item.type==0 && item.village_id>0)">
                                                <a @click="$refs.createModal.edit(item.id,item.title,role_type,item.type,item.village_id)">
                                                    <a-icon type="form" />
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </template>
                                <template slot="no_edit" slot-scope="item">
                                    <span class="node-title tree_name" id="title-item">
                                        <img v-if="item.type*1 == 1" src="https://hf.pigcms.com/static/images/village_icon_press.png" class="icon_press">
                                        <img v-if="item.type*1 == 2" src="https://hf.pigcms.com/static/images/property_icon_press.png" class="icon_press">
                                        <a-tooltip placement="topLeft" :title="item.title">
                                            {{ item.title }}
                                        </a-tooltip>
                                    </span>
                                </template>
                            </a-tree>
                        </div>
                    </template>
                </a-layout-sider>
                <div class="line"></div>
                <a-layout-content v-if="treeData && treeData.length>0 && workerList">
                    <div style="margin-top: 10px;width: 100%;height: 40px;">
                        <a-input-group style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                            <label
                                style="width: 360px; margin-top: 5px;font-size: 20px;font-weight:bold; display: flex; align-items: center; justify-content: flex-start;">
                                <span class="table_title">{{selectTitle}}</span>
                                （共{{pagination.total}}人）
                                
                                <!-- <span style="font-size: 20px;font-weight:bold; transform: translateX(30px);">
                                    {{tokenName == 'village_access_token'?'【小区组织架构】': tokenName == 'property_access_token'? '【物业组织架构】': '【街道组织架构】'}}
                                </span> -->
                            </label>
                            <label>
                                <a-button  v-if="house_worker_to_property>0" type="primary" @click="synHouseWorkerToProperty()" style="margin-left: -450px;">
                                    将老数据迁移到物业管理员列表
                                </a-button>
                            </label>
                            <label>
                                <a-button v-if="synchronizationBtn.status*1 == 1" type="primary" @click="synchronizationWx" style="display: flex;
                                align-items: center; justify-content: center;">
                                    <img :src="synchronizationBtn.icon" style="width: 20px; height: 17px; margin-right: 5px;">
                                    工作人员同步到企业微信
                                </a-button>
                            </label>
                        </a-input-group>
                    </div>
                    <hr style="color: #eeeeee; height: 0.5px;" />
                    <div class="board-content" style="margin-top: 5px">
                        <a-button type="primary" class="add-goods"
                            @click="$refs.createModal.add(queryParam.group_id,selectTitle)" v-if="is_org">添加子组织
                        </a-button>
                        <a-button v-if="is_user && new_organization_worker!=1" type="primary" class="add-goods"
                            @click="$refs.createUserModel.addMember(queryParam.group_id, selectTitle,role_type,write_iccard,write_iccard_exe_url)">添加人员</a-button>
                            
                            <a-button v-if="is_user && new_organization_worker==1" type="primary" class="add-goods"
                                @click="$refs.addSelectOrgnizeWorker.selectPropertyWorker(queryParam.group_id,selectTitle)">添加人员</a-button>
                                
                        <a-button type="danger" class="add-goods" @click="delete_all()" v-if="is_del">批量删除</a-button>
                    </div>
                    <a-table v-if="workerList" :row-selection="is_del?rowSelection:null" :columns="columns"
                        :rowKey="record=>record.wid" :data-source="workerList" @change="tableChange"
                        :pagination="pagination" :scroll="{ y: this.clientHeight - 230, x: 1200 }" :loading="loading">
                        <span slot="action" slot-scope="text, record">
                            <a v-if="data_see" @click="$refs.createUserModel.editMember(record.wid, queryParam.group_id, 1, selectTitle,role_type,write_iccard,write_iccard_exe_url)">查看</a>
                            <a-divider v-if="data_see && data_edit" type="vertical" />
                            <a v-if="data_edit" @click="$refs.createUserModel.editMember(record.wid, queryParam.group_id, 2, selectTitle,role_type,write_iccard,write_iccard_exe_url)">编辑</a>
                            <a-divider v-if="data_edit && data_del" type="vertical" />
                            <a-popconfirm v-if="data_del" class="ant-dropdown-link" title="确认删除?" ok-text="是" cancel-text="否"
                                @confirm="deleteConfirm(record.wid, record.group_id,record.department_id)" @cancel="cancel" style="color: red;">
                                <a href="#">删除</a>
                            </a-popconfirm>
                        </span>
                        <span slot="name"  slot-scope="name, record">
                            <div>{{record.name}}</div>
                            <span  v-for="(item,index) in record.name_type" :key="index">
                                <a-tag class="name_label_0516" :color="item.color" :title="item.title"> {{item.value}} </a-tag>
                            </span>
                        </span>
                        <span class="scroll_style" slot="tags" slot-scope="tags" style="display: inline-block; overflow: hidden; white-space: nowrap;text-overflow:ellipsis; width: 170px;">
                            <a-tooltip placement="topLeft" style="display: inline-block; overflow: hidden; white-space: nowrap;text-overflow:ellipsis;width: 170px;">
                                <template slot="title">
                                    <span v-for="(item, index) in tags" :key="index"> {{'【'+item+'】'}} {{index!=tags.length-1?'、':''}}</span>
                                </template>
                                <a-tag v-for="tags in tags" color="#FCBE79" style="margin-bottom: 5px; cursor: pointer;"> {{tags}} </a-tag>
                            </a-tooltip>
                        </span>
                    </a-table>
                </a-layout-content>
                <a-layout-content v-else>
                    <div style="width: 98%;">
                        <div style="text-align: center;margin-top:15%">
                            <img :src="imgUrl">
                            <p style="color: #0a0a0a;font-size: 16px">您还没有添加任何数据</p>
                            <p style="color: #626262;margin-top:-50px;font-size: 14px">您需要添加分类，再添加资产</p>
                        </div>
                        <div style="text-align: center;margin-top:-30px">
                            <a-button type="primary" class="add-goods" @click="$refs.createModal.add()">立即添加</a-button>
                        </div>
                    </div>
                </a-layout-content>
            </a-layout>
            <child-info :height='800' :width="1200" ref="createModal" @ok="handleLeftOks" />
            <member-info :height='800' :width="1200" ref="createUserModel" @ok="handleRightOks" />
            
            <add-orgnize-worker :height='800' :width="1200" ref="addSelectOrgnizeWorker" @ok="handleRightOks" />
        </a-layout>
    </div>
</template>

<script>
    const treeData = [];
    import commonApi from '@/api/community/common'
    import DragBox from '@/components/DragBox/DragBox'
    import moment from 'moment';
    import propertyApi from '@/api/community/property/packages';
    import childInfo from './childInfo.vue'
    import memberInfo from './memberInfo.vue'
    import addOrgnizeWorker from './addOrgnizeWorker.vue'
    import {
        getSystemName
    } from '@/utils/util'

    const data = []
    const sortList = []
    let assets_id = 0;
    export default {
        name: 'frameworkList',
        components: {
            DragBox,
            childInfo,
            memberInfo,
            addOrgnizeWorker
        },
        data() {
            this.cacheData = data.map((item) => ({
                ...item,
            }))
            return {
                is_org: false,
                is_user: false,
                is_del: false,
                data_see: false,
                data_edit: false,
                data_del: false,
                id: 0,
                // 查询参数
                queryParam: {
                    assets_id: '0',
                    num: '',
                    status: '0',
                    time: '',
                    keywords: '',
                    group_id: '0'
                },
                // 表头
                columns: [{
                    title: '编号',
                    dataIndex: 'job_number',
                    key: 'job_number',
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',

                    scopedSlots: { customRender: 'name' }
                },
                {
                    title: '手机号码',
                    dataIndex: 'phone',
                    key: 'phone',

                },
                {
                    title: '组织名称',
                    dataIndex: 'group_name',
                    key: 'group_name'
                },
                {
                    title: '性别',
                    dataIndex: 'gender',
                    key: 'gender'
                },
                {
                    title: '标签',
                    dataIndex: 'label',
                    key: 'label',
                    width: 200,
                    scopedSlots: { customRender: 'tags' }
                },
                {
                    title: '可否开门',
                    dataIndex: 'open_door',
                    key: 'open_door',

                },
                {
                    title: '操作',
                    fixed: 'right',
                    key: 'action',
                    dataIndex: '',
                    width: 180,
                    scopedSlots: {
                        customRender: 'action'
                    }
                }],
                data,
                sortList,
                workerList: [],
                type: '',
                defaultExpandAll: true,
                clientHeight: 0,
                loading: false,
                sortLoading: false,
                treeData,
                treeDataKey: {},
                assets_id: 0,
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10
                },
                search: {
                    page: 1,
                    keywords: ''
                },
                page: 1,
                dateFormat: 'YYYY/MM/DD',
                start_time: '',
                end_time: '',
                workers_id_arr: [],
                imgUrl: require("@/assets/images/blank.png"),
                default_selected: '',
                autoExpandParent: true,
                selectTitle: '',
                tokenName: '',
                sysName: '',
                role_type:0,  //1物业 2小区
                synchronizationBtn: {} ,//同步按钮信息
                write_iccard:0,
                write_iccard_exe_url:'',
                new_organization_worker:0,
                house_worker_to_property:0,
            }
        },
        watch: {
            $route: {
                handler() {
                    this.queryParam.store_id = this.$route.query.store_id
                    this.queryParam.sort_id = 0
                    this.getGroupList()
                },
                deep: true,
            },
        },
        created() {},
        mounted() {
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
            this.clientHeight = window.document.body.clientHeight
            window.onresize = () => {
                this.clientHeight = window.document.body.clientHeight
            }
            this.getGroupList()
        },
        computed: {
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRows: ', selectedRows);
                        if (selectedRows != []) {
                            this.workers_id_arr = selectedRows;
                        }
                    },
                    getCheckboxProps: record => ({
                        props: {
                            //disabled: record.is_exist === 1, // Column configuration not to be checked
                        },
                    }),
                };
            },
        },
        methods: {
            moment,
            //获取左侧 组织架构数据
            getGroupList() {
                this.sortLoading = true
                this.sortList = []
                this.house_worker_to_property=0;
                this.new_organization_worker=0;
                this.request(propertyApi.frameworkTissueNav, {
                    tokenName: this.tokenName
                }).then((res) => {
                    this.sortLoading = false;
                    this.treeData = res.menu_list;
                    this.treeDataKey = res.menu_list[0]
                    if(res.role_type!=undefined){
                        this.role_type=res.role_type;
                    }
                    if(res.write_iccard!=undefined){
                        this.write_iccard=res.write_iccard;
                    }
                    if(res.write_iccard_exe_url!=undefined && res.write_iccard_exe_url){
                        this.write_iccard_exe_url=res.write_iccard_exe_url;
                    }
                    if(res.new_organization_worker!=undefined && res.new_organization_worker){
                        this.new_organization_worker=res.new_organization_worker*1;
                    }
                    if(res.house_worker_to_property!=undefined && res.house_worker_to_property){
                        this.house_worker_to_property=res.house_worker_to_property*1;
                    }
                    if (res) {
                        if (this.treeData.length > 0) {
                            this.default_selected = this.treeData[0].key;
                        }
                        this.synchronizationBtn = res.button
                        this.queryParam.group_id = res.menu_list.length > 0 ? res.menu_list[0].id : 0;
                        this.selectTitle = res.menu_list.length > 0 ? res.menu_list[0].title : '--';
                        this.defaultExpandAll = true; //默认只展开第一级
                        this.getworkerList();
                    }
                })
            },
            // 获取右侧 用户或账号数据
            getworkerList(changeTab = true) {
                this.loading = true;
                this.queryParam['page'] = this.pagination.current;
                this.queryParam['tokenName'] = this.tokenName;
                this.request(propertyApi.frameworkTissueUser, this.queryParam).then((res) => {
                    this.workerList = res.list;
                    this.is_org = res.button.is_org
                    this.is_user = res.button.is_user
                    this.is_del = res.button.is_del
                    
                    this.data_see = res.button.data_see
                    this.data_edit = res.button.data_edit
                    this.data_del = res.button.data_del
                    if(res.role_type!=undefined){
                        this.role_type=res.role_type;
                    }
                    if (changeTab) {
                        this.tabColumn = res.tabs
                    }
                    if (res.list && res.list.length > 0) {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    } else {
                        this.pagination.total = 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    }
                    this.loading = false;
                })
            },
            //左侧栏点击事件
            onSelect(selectedKeys, info) {
                console.log('345435', selectedKeys, info, this);
                info.node.onExpand()
                if (selectedKeys[0]) {
                    let new_arr = selectedKeys[0].split('-');
                    this.selectTitle = new_arr[new_arr.length - 2];
                    this.queryParam.id = new_arr[new_arr.length - 1];
                    this.id = this.queryParam.id;
                    this.queryParam.group_id = this.queryParam.id;
                    this.default_selected = selectedKeys[0];
                    this.queryParam.keywords = '';
                    this.getworkerList();
                }
            },
            //分页
            tableChange(e) {
                let _this = this;
                if (e.current && e.current > 0) {
                    _this.pagination.current = e.current;
                    _this.getworkerList()
                }
            },
            //搜索
            search_all() {
                if (this.queryParam.keywords == '') {
                    this.$message.warn('请输入搜索内容')
                } else {
                    this.tableChange({
                        current: 1,
                        pageSize: 10,
                        total: 10
                    });
                }
            },
            // 进行重置
            resetList() {
                this.queryParam.keywords = '';
                this.queryParam.num = '';
                this.queryParam.status = '';
                this.queryParam.time = '';
                this.start_time = '';
                this.end_time = '';
                this.tableChange({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            //回调触发左侧数据重载
            handleLeftOks() {
                this.getGroupList();
            },
            handleRightOks(){
                this.getworkerList();
            },
            //删除左侧组织
            delAlert(id) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除该组织吗？（会联动删除下级组织和人员数据）',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        _this.delClassifyNav(id);
                    },
                    onCancel() {},
                });
            },
            //删除左侧组织 --方法
            delClassifyNav(id) {
                this.loading = true;
                this.request(propertyApi.frameworkOrganizationDel, {
                    id: id,
                    tokenName: this.tokenName
                }).then((res) => {
                    this.loading = false;
                    if (res) {
                        this.$message.success('操作成功');
                        this.getGroupList();
                    } else {
                        this.$message.error('操作失败');
                    }
                })
            },

            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info);
            },
            onChange(date, dateString) {
                this.start_time = dateString[0];
                this.end_time = dateString[1];
                this.queryParam.time = dateString;
            },

            cancel() {},
            querys() {
                console.log('search', this.queryParam);
                this.getworkerList()
            },

            //删除工作人员
            deleteConfirm(wid, group_id,department_id) {
                this.loading = true;
                this.request(commonApi.workerDel, {
                    wid: [wid],
                    group_id: group_id,
                    department_id:department_id,
                    tokenName: this.tokenName
                }).then(res=>{
                    this.loading = false;
                    if(res.error){
                        this.$message.success(res.msg)
                        if(this.workers_id_arr != ''){
                            let index = this.workers_id_arr.findIndex(v=>v.wid*1 == wid*1)
                            if(index!=-1){
                                this.workers_id_arr.splice(index, 1)
                            }
                        }
                        this.getworkerList()
                    } else{
                        this.$message.error(res.msg)
                    }
                }).catch((error)=>{
                    this.loading = false;
                })
            },
            //批量删除工作人员
            delete_all() {
                let that = this
                if (this.workers_id_arr == '') {
                    this.$message.warn('请选择删除的数据');
                    return false;
                } else {
                    let wids = []
                    let names = ''
                    let group_id = this.queryParam.group_id
                    this.workers_id_arr.map((v, i)=>{
                        wids.push(v.wid)
                        if(i<this.workers_id_arr.length-1){
                            names+=v.name + '、'
                        } else{
                            names+=v.name
                        }
                    })
                    
                    this.$confirm({
                        title: '提示',
                        content: '确定要删除【'+names+'】这些数据吗？',
                        onOk() {
                            that.loading = true;
                            that.request(commonApi.workerDel, {
                                wid: wids,
                                group_id: group_id,
                                tokenName: that.tokenName
                            }).then(res=>{
                                that.loading = false;
                                if(res.error){
                                    that.$message.success(res.msg)
                                    that.workers_id_arr = ''
                                    that.getworkerList()
                                } else{
                                    that.$message.error(res.msg)
                                }
                                
                            })
                        },
                        onCancel() {},
                    });
                }
            },

            synHouseWorkerToProperty(){
                let that = this
                that.$confirm({
                    title: '请确认将本小区所有老工作人员数据迁移到物业后台的人员数据列表？',
                    content: '请确认后将会把本小区的所有老工作人员数据迁移到物业后台的人员数据列表，便于统一管理。老数据迁移后会和物业后台的人员数据关联上，这里将不可以再更改姓名，手机号码，账号，密码等基本信息！',
                    onOk() {
                        that.loading = true;
                        that.request(commonApi.synHouseWorkerToProperty, {
                            tokenName: that.tokenName
                        }).then((res) => {
                            that.loading = false;
                            that.house_worker_to_property=0;
                            let tips_msg='操作成功！';
                            if (res.err_msg){
                                tips_msg=res.err_msg;
                            }
                            if(res.err_code*1>0){
                                that.$message.error(tips_msg)
                            } else{
                                that.$message.success(tips_msg)
                            }
                        }).catch((error) => {
                            that.loading = false
                        })
                    },
                    onCancel() {},
                });
            },
            //同步企业微信
            synchronizationWx(){
                let that = this
                that.$confirm({
                    title: '提示',
                    content: '确定同步企业微信数据吗？',
                    onOk() {
                        that.loading = true;
                        that.request(commonApi.organizationSynQw, {
                            tokenName: that.tokenName
                        }).then((res) => {
                            that.loading = false;
                            if(res.error){
                                that.$message.success(res.msg)
                            } else{
                                that.$message.error(res.msg)
                            }
                        })
                    },
                    onCancel() {},
                });
            }
        },
    }
</script>
<style scoped>
    .name_label_0516{
        margin-bottom: 5px !important;margin-top: 5px !important;
    }
    #title-item {
        /* max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
        white-space: normal; */
    }

    .line {
        border-right: 1px solid #ddd;
        height: 98%;
        margin-top: 10px;
        margin-left: 10px;
    }

    .board-content {
        margin-top: 40px;
    }

    .detail-content>>>.ant-drawer-body {
        padding: 0;
    }

    .add-sort {
        color: #1890ff;
        border: 1px solid #1890ff;
        border-radius: 12px;
        padding: 2px 18px;
        background-color: #1890ff21;
        cursor: pointer;
    }

    #components-layout-demo-basic {
        text-align: left;
        background: #ffffff;
        margin-top: 10px;
        /* height: 100%; */
    }

    #components-layout-demo-basic .ant-layout {
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

    #components-layout-demo-basic>.ant-layout {
        /* margin-bottom: 48px; */
    }

    #components-layout-demo-basic>.ant-layout:last-child {
        margin: 0;
    }

    #components-layout-demo-basic .add-goods {
        margin: 0 10px;
    }

    #components-layout-demo-basic>>>.ant-btn-group {
        line-height: 80px;
    }

    #components-layout-demo-basic .edit-content {
        float: right;
        /* margin-right: 60px; */
    }

    #components-layout-demo-basic>>>.ant-tabs {
        display: inline-block;
    }

    #components-layout-demo-basic>>>.ant-layout-content {
        line-height: 70px;
    }

    .ant-pro-page-header-wrap-children-content,
    .ant-pro-page-header-wrap-children-content>>>.ant-tabs {
        width: 100%;
    }

    .message-suggestions-list-box {
        position: relative;
    }

    .search-input {
        position: absolute;
        right: 0;
        bottom: 36px;
    }

    .right-c {
        display: flex;
    }

    .goods-image {
        width: 48px;
        margin-right: 5px;
        height: 48px;
        border-radius: 4px;
    }

    .img-wrap {
        position: relative;
    }

    .yxj {
        position: absolute;
        top: 0;
        left: 0;
        width: 48px;
        height: 48px;
        line-height: 48px;
        font-size: 12px;
        text-align: center;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
    }

    .cat-list {
        position: absolute;
        width: 100%;
        left: 0;
        top: 20px;
        bottom: 90px;
        overflow-y: scroll;
    }

    .add-new-cat {
        position: absolute;
        text-align: center;
        width: 100%;
        left: 0;
        height: 50px;
    }

    .btn_an {
        height: 28px !important;
        padding: 0 5px !important;
        margin: 0 0 0 5px !important;
    }

    .left_tree {
        width: 100%;
        height: 85vh;
        overflow-y: scroll;
        /* overflow-x: hidden; */
        padding-bottom: 10px;
        transform: translateX(-10px);
    }

    .left_tree::-webkit-scrollbar-track-piece {
        background-color: #f8f8f8;
    }

    .left_tree::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }
    
    .scroll_style::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }
    
    .scroll_style::-webkit-scrollbar-thumb {
        background-color: #dddddd;
        background-clip: padding-box;
        min-height: 28px;
    }
    
    .scroll_style::-webkit-scrollbar-thumb:hover {
        background-color: #bbb;
    }

    .left_tree::-webkit-scrollbar-thumb {
        background-color: #dddddd;
        background-clip: padding-box;
        min-height: 28px;
    }

    .left_tree::-webkit-scrollbar-thumb:hover {
        background-color: #bbb;
    }

    .tree_name_content {
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .tree_name {
        width: 150px;
        display: inline-block;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .right_operation {
        display: flex;
    }
    
    .table_title{
        max-width: 150px;
        display: inline-block;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .icon_press{
        width: 16px;
        height: 16px;
        margin-bottom: 3px;
    }
</style>
