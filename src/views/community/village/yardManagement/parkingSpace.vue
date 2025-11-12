<template>
    <div class="parking_space">
        <div class="header_search">
            <div class="search_item">
                <label class="label_title" style="width: 75px;">车位号：</label>
                <a-input placeholder="请输入车位号" v-model="pageInfo.position_num" />
            </div>

            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">车库：</label>
                <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                    @change="handleSelectChange" v-model="pageInfo.garage_id">
                    <a-select-option v-for="(item,index) in garageList" :value="item.garage_id">
                        {{item.garage_num}}
                    </a-select-option>
                </a-select>
            </div>

            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">车位模式：</label>
                <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                    @change="handleSelectChange" v-model="pageInfo.position_pattern">
                    <a-select-option v-for="(item,index) in patternList" :value="item.position_pattern">
                        {{item.name}}
                    </a-select-option>
                </a-select>
            </div>
            <div class="search_item" style="margin-left: 20px;" v-if="children_type==1">
                <label class="label_title">车位类型：</label>
                <a-select show-search placeholder="请选择" style="width: 150px" :filter-option="filterOption"
                    @change="handleSelectChange" v-model="pageInfo.children_type">
                    <a-select-option v-for="(item,index) in childrenPositionList" :value="item.children_type">
                        {{item.name}}
                    </a-select-option>
                </a-select>
            </div>
            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">出售状态：</label>
                <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                          @change="handleSelectChange" v-model="pageInfo.position_car_status">
                    <a-select-option v-for="(item,index) in positionBindStatus" :value="item.position_status">
                        {{item.label}}
                    </a-select-option>
                </a-select>
            </div>
            
            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">车位状态：</label>
                <a-select show-search placeholder="请选择" style="width: 150px" :filter-option="filterOption"
                    @change="handleSelectChange" v-model="pageInfo.position_status">
                    <a-select-option v-for="(item,index) in positionStatus" :value="item.position_status">
                        {{item.label}}
                    </a-select-option>
                </a-select>

                <a-button style="margin-left: 10px;" type="primary" @click="queryThis">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis">清空</a-button>
            </div>

            <div class="search_item">
                <a-button type="primary" @click="addThis" v-if="role_addposition==1">添加车位</a-button>
                <a-upload v-if="role_importposition==1" :showUploadList="false" name="file" :data="uploadData" :multiple="false"
                    action="/v20/public/index.php/community/village_api.Parking/uplodePosition" :headers="headers"
                    @change="handleUploadChange">
                    <a-button type="primary" class="operation_btn">导入车位</a-button>
                </a-upload>
                <a-button v-if="role_importposition==1" type="primary" :loading="exportLoadding2" class="operation_btn" @click="downModel">导出模板
                </a-button>
                <a-button v-if="role_exportposition==1" type="primary" :loading="exportLoadding1" class="operation_btn" @click="downPosition">excel导出
                </a-button>
                <a-button v-if="role_delposition==1" type="danger" class="operation_btn" @click="deleteMany">多项删除</a-button>
                <!-- 移到别处了
                <a-button v-if="jz_wsxdsj_customized==1" type="primary" class="operation_btn" @click="limitFuncSet">限时设置</a-button>
                -->
                
            </div>
        </div>
        <div class="table_content">
            <a-table :columns="children_type==1?columns1:columns" :row-key="record=>record.position_id"
                :pagination="pageInfo" :loading="tableLoadding"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                @change="handleTableChange" :data-source="spaceList">
                
                <a-tag  slot="car_status_txt" slot-scope="text, record" style="width: 50px;height: 25px;text-align: center;" :color="record.is_bind_car<=0?'green':'red'" >
                    {{ record.car_status_txt}}
                </a-tag>
                <a-tag  slot="position_status_txt" slot-scope="text, record" style="width: 50px;height: 25px;text-align: center;" :color="record.position_status==1?'green':'red'" >
                    {{ record.position_status_txt}}
                </a-tag>
                <span slot="action" slot-scope="text, record" >
                    <span  v-if="record.position_pattern*1!=2">
                    <a @click="$refs.positionBindCarListModel.showBindCarList(record)" >绑定车辆列表</a>
                    <a-divider type="vertical" />
                    <a @click="editThis(record.position_id)" v-if="role_editposition==1" >编辑</a>
                    <a-divider type="vertical" v-if="children_type==1&&record.children_type==2 && record.parent_position_id>=0" />
                    <a @click="manualLiftingrod(record)"
                        v-if="children_type==1&&record.children_type==2&&record.parent_position_id==0">绑定母车位</a>
                    <a-popconfirm :title="record.parent_position_status"
                        v-if="children_type==1&&record.children_type==2&&record.parent_position_id>0" ok-text="是"
                        cancel-text="否" @confirm="unBindConfirm(record)" @cancel="delCancel">
                        <a>解绑</a>
                    </a-popconfirm>
                    <a-divider type="vertical" />
                    <a-popconfirm v-if="role_delposition==1" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                    </span>
                    <span  v-if="record.position_pattern*1==2">
                        <a @click="editThis(record.position_id)" v-if="role_editposition==1" >编辑</a>
                    </span>
                </span>
 
            </a-table>
            <space-model :position_id="position_id" :children_type="children_type" :space_type="space_type"
                :visible="spaceVisible" :jz_wsxdsj_customized="jz_wsxdsj_customized" :position_bind_car="position_bind_car" :modelTitle="modelTitle" @closeSpace="closeSpace" />
            <a-modal :title="openTitle" :width="500" :visible="openGateVisible" :maskClosable="false" @ok="handleOk"
                @cancel="handleCancel">
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <div class="add_black">
                        <a-form-model-item label="母车位列表" prop="parent_position_id">
                            <a-select :showSearch="true" @search="searchVal" placeholder="请选择母车位" style="width: 200px" 
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                @change="handleSelectPositionChange" :value="openGate.parent_position_id">
                                <a-select-option v-for="(item,index) in searchList" :value="item.position_id">
                                    {{item.position_num}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </div>
                </a-form-model>
            </a-modal>

            <a-modal title="时限设置" :width="750" :visible="limitFuncVisible" :maskClosable="false" @ok="handleLimitFuncOk"
                @cancel="handleLimitFuncCancel" :confirmLoading="confirmLoading">
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <div class="add_black">
                        <a-form-model-item label="租赁车位时限设置">
                            <a-radio-group  v-model="positionFunc.is_position_lease" @change="onLeaseChange">
                                <a-radio :value="0">关闭</a-radio>
                                <a-radio :value="1">开启</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </div>
                </a-form-model>
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" v-if="positionFunc.is_position_lease*1==1">
                    <div class="add_black">
                        <a-form-model-item label="时限设置">
                            租赁车位 <a-input-number placeholder="请输入大于0的数字" :min="0" :max="10000" style="width: 160px;" v-model="positionFunc.last_lease_day" /> 天后，未办理租赁流程，取消订单
                        </a-form-model-item>
                    </div>
                </a-form-model>
                
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <div class="add_black">
                        <a-form-model-item label="抢购车位时限设置">
                            <a-radio-group  v-model="positionFunc.is_position_robbuy" @change="onRobBuyChange">
                                <a-radio :value="0">关闭</a-radio>
                                <a-radio :value="1">开启</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </div>
                </a-form-model>
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" v-if="positionFunc.is_position_robbuy*1==1">
                    <div class="add_black">
                        <a-form-model-item label="时限设置">
                            抢购车位 <a-input-number placeholder="请输入大于0的数字" :min="0" :max="10000" style="width: 160px;" v-model="positionFunc.last_robbuy_day" /> 天后，未办理抢购流程，取消订单
                        </a-form-model-item>
                    </div>
                </a-form-model>
                
             <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" >
                 <div class="add_black">
                     <a-form-model-item label="抢购/租赁数量设置">
                         小区住户抢购/租赁选择最多车位数量 <a-input-number placeholder="请输入大于0的数字" :min="0" :max="10" style="width: 160px;" v-model="positionFunc.opt_position_num" /> 个车位
                     </a-form-model-item>
                 </div>
             </a-form-model>   
             
            </a-modal>
            
            <positionBindCarList ref="positionBindCarListModel" @ok="retrunOk"/>
            
        </div>
    </div>
</template>

<script>
    import spaceModel from './components/spaceModel.vue';
    import positionBindCarList from './components/positionBindCarList.vue';
    import villageApi from '@/api/community/village';
    const columns = [{
            title: '车库名称',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },
        {
            title: '车位号',
            dataIndex: 'position_num',
            key: 'position_num',
            width:110,
        },
        {
            title: '开始时间',
            dataIndex: 'start_time_str',
            key: 'start_time_str',
            width:120,
        },
        {
            title: '到期时间',
            dataIndex: 'end_time',
            key: 'end_time',
            width:120,
        },
        {
            title: '姓名/手机号',
            dataIndex: 'user_name',
            key: 'user_name',
            width:200,
        },
        {
            title: '车位模式',
            dataIndex: 'position_pattern_txt',
            key: 'position_pattern_txt',
            width:110,
        },
        {
            title: '车位面积',
            dataIndex: 'position_area',
            key: 'position_area',
            width:110,
        },
        {
            title: '出售状态',
            dataIndex: 'position_status_txt',
            width:110,
            key: 'position_status_txt',
            scopedSlots: {
                customRender: 'position_status_txt'
            },
        },
        {
            title: '备注',
            dataIndex: 'position_note',
            key: 'position_note',
           
        },
        {
            title: '操作',
            width:220,
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];
    const columns1 = [{
            title: '车库名称',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },
        {
            title: '车位号',
            dataIndex: 'position_num',
            key: 'position_num',
            width:110,
        },
        {
            title: '开始时间',
            dataIndex: 'start_time_str',
            key: 'start_time_str',
            width:120,
        },
        {
            title: '到期时间',
            dataIndex: 'end_time',
            width:120,
            key: 'end_time',
        },
        {
            title: '姓名/手机号',
            dataIndex: 'user_name',
            key: 'user_name',
            width:200,
        },
        {
            title: '车位模式',
            dataIndex: 'position_pattern_txt',
            key: 'position_pattern_txt',
            width:110,
        },
        {
            title: '出售状态',
            dataIndex: 'position_status_txt',
            width:110,
            key: 'position_status_txt',
            scopedSlots: {
                customRender: 'position_status_txt'
            },
        },
        {
            title: '车位类型',
            dataIndex: 'children_type_txt',
            key: 'children_type_txt',
            width:120,
        },
        {
            title: '所属母车位',
            dataIndex: 'parent_position_num',
            key: 'parent_position_num',
            width:120,
        },
        {
            title: '车位面积',
            dataIndex: 'position_area',
            key: 'position_area',
            width:110,
        },
        {
            title: '备注',
            dataIndex: 'position_note',
            key: 'position_note',
        },
        {
            title: '操作',
            width:210,
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];
    
    export default {
        data() {
            return {
                parentPositionList: [],
                openTitle: '绑定母车位',
                openGateVisible: false,
                labelCol: {
                    span: 5
                },
                wrapperCol: {
                    span: 18
                },
                openGate: {
                    position_id: '',
                    parent_position_id: '',

                },
                pageInfo: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    page: 1,
                    garage_id: undefined,
                    position_num: '',
                    children_type: undefined,
                    position_status: undefined,
                position_pattern: 1,
                position_car_status:undefined,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange: (page, pageSize) => this.onTableChange(page, pageSize) //点击页码事件
                },
                columns1,
                columns,
                tableLoadding: false,
                spaceVisible: false,
                selectedRowKeys: [],
                modelTitle: '',
                spaceList: [],
                garageList: [],
                positionStatus: [{position_status: 0, label:'全部'},{position_status: 1, label:'空置'}, {position_status: 2, label: '已使用'}],
                positionBindStatus: [{position_status: 0, label:'全部'},{position_status: 1, label:'未售出'}, {position_status: 2, label: '已售出'}],
                frequency: false,
                position_id: '',
                children_type: 0,
                space_type: 'add',
                headers: {
                    authorization: 'authorization-text',
                    village_id: 0
                },
                select_names: [],
                select_names_str: '',
                exportLoadding1: false,
                exportLoadding2: false,
                is_show: false,
                patternList: [{
                    name: '真实车位',
                    position_pattern: 1
                }, {
                    name: '虚拟车位',
                    position_pattern: 2
                }],
                childrenPositionList: [{
                    name: '母车位',
                    children_type: 1
                }, {
                    name: '子车位',
                    children_type: 2
                }],
                uploadData: {
                    village_id: 0,
                    system_type:'village',
                },
                searchList: [],
                role_addposition:0,
                role_delposition:0,
                role_editposition:0,
                role_exportposition:0,
                role_importposition:0,
                jz_wsxdsj_customized:0,
                position_bind_car:0,
                limitFuncVisible: false,
                positionFunc:{is_position_lease:0,is_position_robbuy:0,opt_position_num:1,last_robbuy_day:1,last_lease_day:1},
                confirmLoading:false,
            }
        },

        components: {
            spaceModel,
            positionBindCarList
        },

        mounted() {
            this.getSpaceList()
            this.getGarageList()
        },

        methods: {
            handleOk() {
                let that = this
                that.request('community/village_api.Parking/bindChildrenPosition', that.openGate).then((res) => {
                    if (res != '0') {
                        that.$message.success('绑定成功！')
                    } else {
                        that.$message.error('绑定失败！')
                    }
                    that.openGateVisible = false;
                    that.openGate.parent_position_id = '';
                    that.openGate.position_id = '';
                    that.parentPositionList = [];
                    that.getSpaceList()
                })
            },
            retrunOk(){
                that.getSpaceList()
            },
            handleCancel() {
                this.openGate.parent_position_id = '';
                this.openGate.position_id = '';
                this.parentPositionList = [];
                this.openGateVisible = false
            },
            manualLiftingrod(record) {
                let that = this
                that.openGate.position_id = record.position_id
                that.openGate.parent_position_id = '';
                that.openGateVisible = true;
                that.parentPositionList = [];
                that.request('community/village_api.Parking/getParentPositionList', {
                    position_id: record.position_id
                }).then((res) => {
                    that.parentPositionList = res.list
                })
            },
            limitFuncSet(){
                this.limitFuncVisible=true;
            },
            handleLimitFuncCancel(){
                this.limitFuncVisible=false;
            },
            handleLimitFuncOk(){
                if(this.positionFunc.is_position_lease*1>0 && this.positionFunc.last_lease_day*1<1){
                    this.$message.warn('租赁车位时限设置的租赁车位天数必须大于0！')
                    return false;
                }
                if(this.positionFunc.is_position_robbuy*1>0 && this.positionFunc.last_robbuy_day*1<1){
                    this.$message.warn('抢购车位时限设置的抢购车位天数必须大于0！')
                    return false;
                }
                if(this.positionFunc.opt_position_num*1<1 || this.positionFunc.opt_position_num*1>10){
                    this.$message.warn('抢购/租赁数量设置，请设置一个包括1到10在内的数')
                    return false;
                }
                this.confirmLoading=true;
                this.positionFunc.xtype='limit';
                this.request(villageApi.parkingPositionSet, this.positionFunc).then((res) => {
                    this.$message.success('设置成功！')
                    this.getSpaceList();
                    this.handleLimitFuncCancel();
                    this.confirmLoading = false;
                }).catch(e=>{
                    this.confirmLoading = false;
                })
            },
            onLeaseChange(e){
                
            },
            onRobBuyChange(e){
                
            },
            queryThis() {
                if (this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(() => {
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page = 1
                this.getSpaceList()
            },
            clearThis() {
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    garage_id: undefined,
                    position_num: '',
                    position_status: undefined,
                    position_car_status:undefined,
                    pageSize: this.pageInfo.pageSize,
                    total: 0,
                    position_pattern: 1
                }
                this.getSpaceList()
            },
            handleTableChange(pagenation, filters, sorter) {
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getSpaceList()
            },
            onTableChange(page, pageSize) {
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getSpaceList()
                console.log('onTableChange==>', page, pageSize)
            },
            getGarageList() {
                let that = this
                that.request(villageApi.getGarageList, {}).then((res) => {
                    that.garageList = res.list
                })
            },

            bindCarList(record){
                console.log('record',record);
            },
            
            handleSelectChange(value) {
                this.pageInfo.page = 1
                this.pageInfo.current = 1
                console.log(`selected ${value}`);
            },
            handleSelectPositionChange(value) {
                this.openGate.parent_position_id = value
                this.$forceUpdate()
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },

            getSpaceList() {
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getPositionList, that.pageInfo).then((res) => {
                    that.spaceList = res.list
                    that.children_type = res.children_type
                    that.pageInfo.total = res.count
                    that.uploadData.village_id = res.village_id
                    that.tableLoadding = false
                    if(res.role_addposition!=undefined){
                        this.role_addposition=res.role_addposition;
                        this.role_delposition=res.role_delposition;
                        this.role_editposition=res.role_editposition;
                        this.role_exportposition=res.role_exportposition;
                        this.role_importposition=res.role_importposition;
                    }else{
                        this.role_addposition=1;
                        this.role_delposition=1;
                        this.role_editposition=1;
                        this.role_exportposition=1;
                        this.role_importposition=1;
                    }
                    this.jz_wsxdsj_customized=0;
                    if(res.jz_wsxdsj_customized!=undefined){
                        this.jz_wsxdsj_customized=res.jz_wsxdsj_customized;
                    }
                    if(res.position_set!=undefined && res.position_set){
                        this.positionFunc=res.position_set
                    }
                    this.position_bind_car=0;
                    if(res.position_bind_car!=undefined){
                        this.position_bind_car=res.position_bind_car;
                    }
                })
            },

            editThis(record) {
                this.modelTitle = '编辑车位'
                this.space_type = 'edit'
                this.spaceVisible = true
                this.position_id = record + ''
            },

            delConfirm(record) {
                let that = this
                that.request(villageApi.delParkPosition, {
                    position_id: record.position_id
                }).then((res) => {
                    that.$message.success('删除成功！')
                    that.select_names_str = ''
                    that.selectedRowKeys = []
                    that.getSpaceList()
                })
            },
            //解绑
            unBindConfirm(record) {
                let that = this
                that.request('community/village_api.Parking/unBindChildrenPosition', {
                    position_id: record.position_id
                }).then((res) => {
                    that.$message.success('解绑成功！')
                    that.select_names_str = ''
                    that.selectedRowKeys = []
                    that.getSpaceList()
                })
            },
            delCancel() {

            },

            closeSpace(flag) {
                this.position_id = ''
                this.spaceVisible = false
                if (flag) {
                    this.getSpaceList()
                }
            },

            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
                this.select_names = []
                this.select_names_str = ''
                this.spaceList.map(v => {
                    selectedRowKeys.map((item, index) => {
                        if (item == v.position_id) {
                            this.select_names.push(v)
                        }
                    })
                })
                this.select_names.map((v, i) => {
                    if (i + 1 < this.select_names.length) {
                        this.select_names_str += v.position_num + '、'
                    } else {
                        this.select_names_str += v.position_num
                    }
                })
            },

            deleteMany() {
                let that = this
                if (that.selectedRowKeys.length == 0) {
                    that.$message.warn('请选择要删除的项')
                    return
                }
                that.$confirm({
                    title: '提示',
                    content: '确定要删除【' + that.select_names_str + '】这些数据吗',
                    onOk() {
                        that.request(villageApi.delAllParkPosition, {
                            position_id: that.selectedRowKeys
                        }).then((res) => {
                            that.$message.success('删除成功！')
                            that.select_names_str = ''
                            that.selectedRowKeys = []
                            that.getSpaceList()
                        })
                    },
                    onCancel() {},
                });

            },

            addThis() {
                this.modelTitle = '添加车位'
                this.space_type = 'add'
                this.spaceVisible = true
            },

            handleUploadChange(info) {
                console.log('info0513', info)
                if (info.file.status === 'done') {
                    if (info.file.response.status == 1000) {
                        this.$message.success(`上传成功！`);
                        if (info.file.response.data.url) {
                            window.location.href = info.file.response.data.url
                        } else {
                            this.getSpaceList()
                        }
                    } else {
                        this.$message.error(info.file.response.msg);
                    }
                } else if (info.file.status === 'error') {
                    this.$message.error(`上传失败！`);
                }
            },

            downPosition() {
                let that = this
                that.exportLoadding1 = true
                that.request('/community/village_api.Parking/downPosition', that.pageInfo).then((res) => {
                    if (res.error == 0) {
                        window.location.href = res.url
                        this.$message.success('导出成功！')
                    } else {
                        this.$message.error('导出失败！')
                    }
                    that.exportLoadding1 = false
                }).catch(e => {
                    that.exportLoadding1 = false
                })
            },
            downModel() {
                let that = this
                that.exportLoadding2 = true
                that.request('/community/village_api.Parking/downPositionModel', that.pageInfo).then((res) => {
                    if (res.error == 0) {
                        window.location.href = res.url
                        this.$message.success('导出成功！')
                    } else {
                        this.$message.error('导出失败！')
                    }
                    that.exportLoadding2 = false
                }).catch(e => {
                    that.exportLoadding2 = false
                })
            },
            searchVal(e) {
                this.getSearchList(e)
            },

            getSearchList(val) {
                let that = this
                let params = {
                    position_id: that.openGate.position_id,
                    position_num: val
                }
                that.request('/community/village_api.Parking/getParentPositionList', params).then(res => {
                    let timeout =setTimeout(()=>{
                        that.searchList = res.list
                        clearTimeout(timeout)
                        timeout = null
                    }, 300)
                }).catch(e => {})
            },
        },
    }
</script>

<style lang="less" scoped>
    .parking_space {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin: 10px 20px;
            }

            .operation_btn {
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
</style>
