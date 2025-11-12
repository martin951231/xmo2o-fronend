<template>
    <div class="parking_lot">
        <div class="header_search" style="display: block">
            <a-collapse accordion>
                <a-collapse-panel key="1" header="操作说明">
                    目前支持设备类型：A3、海康内部应用、A7、A185、大华<br />
                </a-collapse-panel>
            </a-collapse>
        </div>
        <div class="header_search">
            <div class="search_item">
                <label class="label_title" style="width: 60px;">姓名：</label>
                <a-input placeholder="请输入姓名" v-model="pageInfo.name" />
            </div>
            <div class="search_item">
                <label class="label_title" style="width: 80px;margin-left: 10px;">手机号：</label>
                <a-input placeholder="请输入手机号" v-model="pageInfo.phone" />
            </div>

            <div class="search_item" style="margin-left: 10px;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;" @click="resetThis()">清空</a-button>
                <a-button style="margin-left: 10px;"  type="primary" @click="syncCheck()" :disabled="checkOpd()" v-if="role_sync==1">+ 批量同步</a-button>
                <a-button style="margin-left: 10px;"  type="primary" @click="bind()" :disabled="checkOpd()"  v-if="role_sync_all==1">+ 批量绑定设备</a-button>
            </div>
        </div>
        <div class="table_content">
            <a-table
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps }"
                :columns="column" 
                :data-source="faceList" 
                :row-key="record=>record.pigcms_id" 
                :pagination="pageInfo" 
                :loading="tableLoadding"
                     @change="handleTableChange">
              <span slot="face_img_reason" slot-scope="text, record">
<!--                  <label class="simple-title text-els">{{text ? text : '--'}}</label>-->
                <a-tooltip v-if="record.face_img_reason" placement="right" :title="record.face_img_reason" :get-popup-container="getPopupContainer">
                  <label class="simple-title text-els">{{text ? text : '--'}}</label>
                </a-tooltip>
                  <label v-else class="simple-title text-els">{{text ? text : '--'}}</label>
              </span>
              <span slot="common_str" slot-scope="text">
<!--                <a-tooltip placement="top" :title="text">-->
                  <label class="simple-title text-els">{{text ? text : '--'}}</label>
<!--                </a-tooltip>-->
              </span>
                <a-tag  slot="is_month_access" slot-scope="text, record" :color="record.is_month_access==1?'green':'orange'" >
                    {{ record.is_month_access==1?'是':'否' }}
                </a-tag>
                <a-tag  slot="is_month_charge" slot-scope="text, record"  :color="record.is_month_charge==1?'green':'orange'" >
                    {{ record.is_month_charge==1?'是':'否' }}
                </a-tag>
                <span slot="img_url" slot-scope="text, record">
                    <div style="display: flex; align-items: center;height: 93px;">
                      <beautiful-image
                          v-if="record.img_url"
                          :src="record.img_url"
                          width="60px"
                          height="60px"
                          visible
                          hover
                          radius="6px"
                          modalWidth="25%"
                      />
                    </div>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="bindOne(record)" v-if="role_add_face==1" :disabled="(record.img_url ? false : true)" >绑定设备</a>
                    <a @click="addFace(record)" v-if="role_add_face==1" style="margin-left: 10px" >上传人脸</a>
                    <a @click="showLog(record)" v-if="role_show_log==1" style="margin-left: 10px" :disabled="(record.img_url ? false : true)">下发记录</a>
                </span>
            </a-table>
            <space-model :pigcms_id="pigcms_id" :visibleCommon="faceSpaceVisible" :modelTitle="modelTitle" @closeSpace="closeFaceSpace" />
            <device-model :all="all" :checkId="checkId" :visible="deviceSpaceVisible" :modelTitle="modelTitle" @closeSpace="closeDeviceSpace" />
            <sync-log-model :pigcms_id="pigcms_id" :visible="syncLogSpaceVisible" :modelTitle="modelTitle" @closeSpace="closeSyncLogSpace" />
        </div>
    </div>
</template>

<script>

    import villageApi from '@/api/community/village';
    import BeautifulImage from '@/components/BeautifulImage/BeautifulImage';
    import spaceModel from './components/spaceModel.vue';
    import deviceModel from './components/deviceModel.vue';
    import syncLogModel from './components/syncLogModel.vue';
    const columns = [
        {
            title: '物业编号',
            dataIndex: 'usernum',
            key: 'usernum',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '手机号',
            key: 'phone',
            dataIndex: 'phone',
            scopedSlots: {
                customRender: 'common_str'
            },
        },
        {
            title: '住址',
            key: 'address',
            dataIndex: 'address',
        },
        {
            title: '身份',
            key: 'bind_type',
            dataIndex: 'bind_type',
        },
        {
            title: '人脸上传',
            key: 'img_url',
            dataIndex: 'img_url',
            scopedSlots: {
                customRender: 'img_url'
            },
        },
        {
            title: '最后上传人脸时间',
            key: 'add_time',
            dataIndex: 'add_time',
            scopedSlots: {
                customRender: 'common_str'
            },
        },
        {
            title: '最后同步人脸时间',
            key: 'add_face_time',
            dataIndex: 'add_face_time',
            scopedSlots: {
                customRender: 'common_str'
            },
        },
        {
            title: '备注',
            key: 'face_img_reason_short',
            dataIndex: 'face_img_reason_short',
            scopedSlots: {
                customRender: 'face_img_reason'
            },
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
            width: 230
        },
    ];

    export default {
        data() {
            return {
                columns,
                column:columns,
                tableLoadding: false,
                drawerVisible: false,
                manageVisible: false,
                tempManageVisible:false,
                passVisible: false,
                park_sys_type:'',
                pageInfo: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    page:1,
                    name: '',
                    phone: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                faceList: [],
                drawer_type: 'add',
                garage_id: '',
                frequency: false,
                role_add_face:0,
                role_show_log: 0,
                role_sync: 0,
                role_sync_all: 0,
                selectedRowKeys: [],
                faceSpaceVisible: false,
                deviceSpaceVisible: false,
                syncLogSpaceVisible: false,
                all:0,
                checkId:0,
                pigcms_id:0,
                modelTitle: '',
            }
        },

        components: {
            BeautifulImage,
            spaceModel,
            deviceModel,
            syncLogModel,
        },

        mounted(){
            this.getList()
        },

        methods: {
            getList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getFaceList, that.pageInfo).then((res) => {
                    that.faceList = res.data
                    that.tableLoadding = false;
                    that.role_add_face = res.role_add_face;
                    that.role_show_log = res.role_show_log;
                    that.role_sync = res.role_sync;
                    that.role_sync_all = res.role_sync_all;
                    that.pageInfo.total = res.total
                    that.pageInfo.current = res.current_page
                    that.pageInfo.pageSize = res.per_page
                }).catch(e=>{that.tableLoadding = false})
            },
            queryThis(){
                if(this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(()=>{
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page = 1
                this.getList()
            },

            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            resetThis(){
                this.pageInfo = {
                    current: 1,
                    page: 1,
                    name: '',
                    phone: '',
                    pageSize: this.pageInfo.pageSize,
                    total: 0
                }
                this.selectedRowKeys = [];
                this.getList()
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },
            getCheckboxProps(record) {
                return {
                    props: {
                        disabled: record.img_url === '', // Column configuration not to be checked
                    },
                }
            },
            checkOpd(){
                if(this.selectedRowKeys.length>0 && this.tableLoadding == false){
                    return false;
                }else{
                    return true;
                }
            },
            bind(){//批量绑定默认设备
                this.$confirm({
                    title: '是否批量绑定勾选的用户人脸至其默认设备?',
                    centered: true,
                    onOk: () => {
                        this.tableLoadding = true;
                        this.request(villageApi.bindFaceDevices, {'pigcms_ids':this.selectedRowKeys}).then((res) => {
                            if(res){
                                this.tableLoadding = false;
                                this.selectedRowKeys = [];
                                this.$message.success('操作成功！')
                            }else{
                                this.$message.error('操作失败！')
                            }
                        }).catch(e=>{this.tableLoadding = false})
                    },
                })
            },
            bindOne(record){//单个用户绑定设备
                this.modelTitle = '绑定设备'
                this.deviceSpaceVisible = true;
                this.checkId = record.pigcms_id;
                console.log(this);
            },
            addFace(record){
                this.modelTitle = '上传人脸'
                this.faceSpaceVisible = true
                this.pigcms_id = record.pigcms_id
            },
            closeFaceSpace(flag) {
                this.pigcms_id = ''
                this.faceSpaceVisible = false
                if (flag) {
                    this.getList()
                }
            },
            closeDeviceSpace(flag) {
                this.all = 0;
                this.checkId = 0
                this.deviceSpaceVisible = false
                if (flag) {
                    this.getList()
                }
            },
            closeSyncLogSpace(flag) {
                this.pigcms_id = ''
                this.syncLogSpaceVisible = false
                if (flag) {
                    this.getList()
                }
            },
            showLog(record){
                this.modelTitle = '下发记录'
                this.syncLogSpaceVisible=true;
                this.pigcms_id = record.pigcms_id
                // that.request(villageApi.getFaceLog, {}).then((res) => {
                //     that.faceList = res.data
                //     that.tableLoadding = false;
                //     that.role_add_face = res.role_add_face;
                //     that.role_show_log = res.role_show_log;
                //     that.role_sync = res.role_sync;
                //     that.role_sync_all = res.role_sync_all;
                //     that.pageInfo.total = res.total
                // }).catch(e=>{that.tableLoadding = false})
            },
            syncCheck(all){//批量同步绑定设备
                this.$confirm({
                    title: '是否批量同步勾选的用户人脸?',
                    centered: true,
                    onOk: () => {
                        this.tableLoadding = true;
                        this.request(villageApi.syncFace, {'pigcms_ids':this.selectedRowKeys}).then((res) => {
                            if(res){
                                this.tableLoadding = false;
                                this.selectedRowKeys = [];
                                this.$message.success('操作成功！')
                            }else{
                                this.$message.error('操作失败！')
                            }
                        }).catch(e=>{this.tableLoadding = false})
                    },
                })
            },
            getPopupContainer(trigger) {
                return trigger.parentElement;
            },
        },
    }
</script>

<style lang="less" scoped>
    .parking_lot {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
</style>
