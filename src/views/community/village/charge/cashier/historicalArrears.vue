<template>
    <div class="historical_arrears">
        <div class="top_search">
            <a-form :form="searchForm" layout="vertical" hide-required-mark>
                <div class="form_con">
                    <a-form-item class="form_item" style="width: 200px;" label="房间">
                        <a-cascader v-if="refrashForm" :options="singleList" :load-data="loadDataFunc" placeholder="请选择房间" change-on-select
                            @change="setVisionsFunc"/>
                    </a-form-item>

                    <a-form-item class="form_item" label="车位号">
                        <a-input placeholder="请输入车位号" v-model="searchForm.position_num" />
                    </a-form-item>

                    <a-form-item class="form_item" label="所属车库">
                        <a-select default-value="0" placeholder="请选择车库"
                            v-model="searchForm.garage_id">
                            <a-select-option :value="0">
                                全部
                            </a-select-option>
                            <a-select-option :value="item.garage_id" v-for="(item, index) in garageList" :key="index">
                                {{ item.garage_num }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item class="form_item" label="收费项目">
                        <a-select default-value="0" placeholder="请选择项目" v-model="searchForm.project_id"
                            @change="(value)=>handleSelectChange(value, 'project_id')">
                            <a-select-option :value="0">
                                全部
                            </a-select-option>
                            <a-select-option :value="item.id" v-for="(item, index) in projectList" :key="index">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item class="form_item" label="收费标准">
                        <a-select default-value="0" placeholder="收费标准" v-model="searchForm.rule_id">
                            <a-select-option :value="0">
                                全部
                            </a-select-option>
                            <a-select-option :value="item.id" v-for="(item, index) in ruleList"
                                :key="index">
                                {{ item.charge_name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    
                    <a-form-item class="form_item" style="width: 270px;" label="请选择筛选项">
                        <a-select placeholder="请选择筛选项" style="width: 120px" default-value="name"
                            v-model="searchForm.key_val">
                            <a-select-option value="name">
                                姓名
                            </a-select-option>
                            <a-select-option value="phone">
                                电话
                            </a-select-option>
                        </a-select>
                        <a-input style="width: 150px" placeholder="请输入" v-model="searchForm.value" />
                    </a-form-item>
                    
                    <a-form-item class="form_item" label="账单状态">
                        <a-select placeholder="请选择账单状态" v-model="searchForm.order_type">
                            <a-select-option :value="0">全部</a-select-option>
                            <a-select-option :value="1">审核中</a-select-option>
                        </a-select>
                    </a-form-item>
                    
                    <a-form-item style="width: 220px;" class="form_item" label="账单生成时间筛选">
                        <a-range-picker v-if="refrashForm" :allowClear="true" @change="(value, valueStr)=>handleDateChange(value, valueStr, 'order_generate')" />
                    </a-form-item>
                    
                    <a-form-item style="width: 220px;" class="form_item" label="计费时间筛选">
                        <a-range-picker v-if="refrashForm" :allowClear="true" @change="(value, valueStr)=>handleDateChange(value, valueStr, 'charging_time')" />
                    </a-form-item>
                    
                    <a-form-item class="form_item" style="width: 450px;" label="查询">
                        <a-button type="primary" icon="search" @click="searchThis('query')">
                            查询
                        </a-button>
                        
                        <a-button style="margin-left: 10px;" type="default" @click="searchThis('clear')">
                            清空
                        </a-button>
                        
                        <a-button style="margin-left: 10px;" type="primary" icon="transaction" @click="collection" v-if="role_payment==1">
                            收款
                        </a-button>
                        

                    <a-button type="primary" @click="exportHangOrderData()" style="margin-left: 20px;">Excel导出</a-button>
                    </a-form-item>
                </div>
            </a-form>
        </div>
        
        <div class="table_con">
            <a-table
                :rowKey="record=>record.order_id"
                :scroll="{ x: 1500 }"
                :columns="tableColumns"
                :data-source="tableList"
                :pagination="pagination"
                @change="handleTableChange"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :loading="tableLoading" >
                <template slot="action" slot-scope="text, record">
                    <a-button type="link" @click="lookDetail(record)">详情</a-button>
                    <a-divider type='vertical' v-if="role_mdymoney && (!record.my_check_status || record.my_check_status==0)" />
                    <a-button v-if="role_mdymoney && (!record.my_check_status || record.my_check_status==0)" type="link" @click="repaireFee(record)">修改费用</a-button>
                    <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
                    <a-button v-if="record.my_check_status==2" type="link" @click="needCheckOrder(record)">需审核</a-button>
                    <a v-if="record.my_check_status==1" style="color: #808080;">审核中</a>
                </template>
            </a-table>
        </div>
        <a-modal title="请稍等,正在为您导出数据..." :visible="export_tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">导出数据中,请耐心等待,数量越多时间越长。</span>
                <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数量，然后分多次导出。</p>
            </div>
        </a-modal>
        <repaireCharge :visible="repaireVisible" :repaireInfo="repaireInfo" @close="closeThis" />
        <historicalDetails :visible="detailVisible" :repaireInfo="repaireInfo" @close="closeDetail" />
        <collectionModal :visible="collectVisible" :orderList="orderList" :repaireInfo="repaireInfo" @close="closeCollect" />
        
        <a-modal
        :title="checkTitle"
        :width="700"
        :visible="checkVisible"
        :maskClosable="false"
        :confirmLoading="confirmLoading"
        @ok="checkHandleSubmit"
        @cancel="checkHandleCancel">
        <a-spin :spinning="confirmLoading" :height="800">
            <a-form >
            <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                <a-col :span="20">
                <a-radio-group name="radioGroup" :default-value="1" v-model="check_post.status">
                    <a-radio :value="1" name="status">
                    审核通过
                    </a-radio>
                    <a-radio :value="2" name="status">
                    审核不通过
                    </a-radio>
                </a-radio-group>
                </a-col>
                <a-col :span="6">
                </a-col>
            </a-form-item>
            <a-form-item label="审核说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-col :span="20">
                <a-textarea
                    ref="textareax"
                    style="width: 250px;height:120px;"
                    placeholder="请输入审核说明"
                    v-model="check_post.bak"/>
                </a-col>
                <a-col :span="6">
                </a-col>
            </a-form-item>
            </a-form>
        </a-spin>
        <div class="rule_detail" style=" margin-top:10px ;">
            <a-descriptions :title="checkTitleTip" :column="4">
            <a-descriptions-item v-for="(item1,index1) in retrunDetail" :span="2" :label="item1.title" :key="index1">
                {{ item1.value }}
            </a-descriptions-item>
            </a-descriptions>
        </div>
        </a-modal>
    </div>
</template>

<script>
    import villageApi from '@/api/community/village'
    import repaireCharge from '../components/repaireCharge.vue';
    import historicalDetails from '../components/historicalDetails.vue';
    import collectionModal from '../components/collectionModal.vue';
    const tableWidth = 200;
    export default {
        name: 'historicalArrears',
        components: {
            repaireCharge,
            historicalDetails,
            collectionModal
        },
        data() {
            return {
                selectedRowKeys: [],
                orderList: [],
                tableLoading: false,
                tableColumns: [
                    { title: '房间号/车位号', dataIndex: 'number', key: 'number', width: tableWidth, fixed: 'left' },
                    { title: '业主', dataIndex: 'pay_bind_name', key: 'pay_bind_name', width: tableWidth - 50 },
                    { title: '电话', dataIndex: 'pay_bind_phone', key: 'pay_bind_phone', width: tableWidth - 50 },
                    { title: '收费标准', dataIndex: 'charge_name', key: 'charge_name', width: tableWidth + 20 },
                    { title: '收费项目名称', dataIndex: 'project_name', key: 'project_name', width: tableWidth },
                    { title: '实际缴费金额', dataIndex: 'modify_money', key: 'modify_money', width: tableWidth - 50 },
                    { title: '应收费用', dataIndex: 'total_money', key: 'total_money', width: tableWidth - 50 },
                    { title: '计费开始时间', dataIndex: 'service_start_time_txt', key: 'service_start_time_txt', width: tableWidth },
                    { title: '计费结束时间', dataIndex: 'service_end_time_txt', key: 'service_end_time_txt', width: tableWidth },
                    { title: '账单生成时间', dataIndex: 'add_time_txt', key: 'add_time_txt', width: tableWidth },
                    { title: '审核状态', dataIndex: 'check_status_str', key: 'check_status_str', width: tableWidth - 50 },
                    { title: '操作', key: 'action', width: tableWidth, fixed: 'right', dataIndex: '', scopedSlots: { customRender: 'action' } }
                ],
                tableList: [],
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    page: 1,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条` // 显示总数
                },
                garageList: [],
                projectList: [],
                ruleList:[],
                searchForm: {
                    room_id: undefined,
                    position_num: undefined,
                    garage_id: undefined,
                    project_id: undefined,
                    rule_id: undefined,
                    key_val: undefined,
                    value: undefined,
                    order_type: undefined,
                    time_slot: [],
                    service_end_time: '',
                    service_start_time: '',
                },
                get_room_id:0,
                get_position_id:0,
                singleList: [],
                refrashForm: true,
                repaireInfo: {},
                repaireVisible: false,
                detailVisible: false,
                collectVisible: false,
                confirmLoading: false,
                checkVisible: false, // 审核弹
                check_order_record: {},
                retrunDetail: [],
                checkTitle: '作废审核',
                checkTitleTip: '申请作废信息',
                tip: '作废订单',
                jz_open:0,
                export_tips_visible:false,
                excelExportOutFileUrl:'',
                export_out_id:0,
                setTimeoutS:null,
                role_mdymoney:0,
                role_payment:0,
                check_post: {
                    order_id: 0,
                    xtype: 'order_discard',
                    bak: '',
                    status: 1
                },
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
            }
        },
        activated () {
            console.log('fghjk===>',this.$route.query)
            if(this.$route.query && this.$route.query.vacancy_id!=undefined && this.$route.query.vacancy_id){
              this.get_room_id= this.$route.query.vacancy_id*1;
            }
            if(this.$route.query && this.$route.query.position_id!=undefined && this.$route.query.position_id){
              this.get_position_id= this.$route.query.position_id*1;
            }
            this.getProjectList()
            this.getGarageList()
            this.getSingleListByVillage()
            this.getTableList()
        },
        mounted(){

        },
        
        methods: {
            checkHandleCancel () {
                this.checkVisible = false
                this.currentIndex = 0
                this.check_order_record = {}
                this.retrunDetail = []
            },
            checkHandleSubmit () {
                this.check_post.order_id = this.check_order_record.order_id
                const titleStr = this.checkTitle + '确认'
                let contentStr = '您确认审核 通过 '+this.tip+'申请吗？'
                if (this.check_post.status == 2) {
                    contentStr = '您确认审核 不通过 '+this.tip+'申请吗？'
                }
                let that = this
                this.$confirm({
                    title: titleStr,
                    content: contentStr,
                    onOk () {
                        that.request(villageApi.verifyCheckauthApply, that.check_post)
                        .then((res) => {
                            console.log('res', res)
                            that.$message.success('操作成功')
                            that.checkVisible = false
                            that.confirmLoading = false
                            that.getTableList()
                        })
                    },
                    onCancel () {}
                })
            },
            // 导出弹出层
            exportHangOrderData () {
                this.export_tips_visible=true;
                this.tableLoading = true;
                let params = {}
                this.selectedRowKeys = []
                Object.assign(params, this.searchForm)
                params.pageSize = this.pagination.pageSize
                params.page = this.pagination.current
                if(this.get_room_id && (params.room_id==undefined || params.room_id*1<1)){
                    params.room_id=this.get_room_id;
                }
                if(this.get_position_id && (params.position_num==undefined || !params.position_num)){
                    params.position_id=this.get_position_id;
                }
                this.request('/community/village_api.CashierHangOrder/excelExportHangOrders', params).then((res) => {
                        this.export_out_id = res.export_id
                        this.excelExportOutFileUrl= this.excelExportOutFileUrl + '&id=' + res.export_id
                        console.log('excelExportOutFileUrl',this.excelExportOutFileUrl)
                        this.CheckExportOutStatus();
                    }).catch((error) => {
                    this.tableLoading = false
                })
            },
             CheckExportOutStatus () {
                let excelExportOutFileUrlCheck = this.excelExportOutFileUrl + '&ajax=village_ajax'
                console.log('excelExportOutFileUrlCheck',this.excelExportOutFileUrlCheck)
                this.request(excelExportOutFileUrlCheck, {
                        tokenName: 'village_access_token',
                        ajax: 'village_ajax'
                    })
                    .then((res) => {
                        console.log('exportOutStatus',res)
                        if (res.error_code == 0) {
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            window.location.href = this.excelExportOutFileUrl;
                            this.export_tips_visible = false;
                            this.tableLoading = false
                            return false;
                        } else if(res.error_code == 404){
                             this.export_tips_visible = false;
                             this.tableLoading = false
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            this.$message.error(res.error_msg)
                            return false
                        }else {
                            this.setTimeoutS = setTimeout(this.CheckExportOutStatus, 2000);
                        }
                    }).catch((error) => {
                        this.$message.error('出错了，请刷新页面重试！')
                        this.export_tips_visible = false;
                        this.tableLoading = false
                    })
            },
            needCheckOrder (record_tmp) {
                this.checkVisible = true
                this.check_order_record = record_tmp
                const apply_info = []
                // 申请修改订单金额信息
                apply_info.push({ title: '申请时间', value: record_tmp.order_apply_info.opt_time_str })
                apply_info.push({ title: '订单金额', value: record_tmp.order_apply_info.modify_money + '元' })
                apply_info.push({ title: '修改金额', value: record_tmp.order_apply_info.money + '元' })
                apply_info.push({ title: '修改原因', value: record_tmp.order_apply_info.modify_reason })
                this.checkTitle = '订单修改金额审核';
                this.checkTitleTip = '订单修改金额申请信息';
                this.tip = '订单修改金额';
                this.check_post.xtype = 'modify_money_check';
                this.retrunDetail = apply_info
            },
            getProjectList () {
                this.request(villageApi.ChargeProjectList,{type: 'selectdata'}).then((res) => {
                    this.projectList = res.list
                })
            },
            getProjectRuleList (tmp_project_id) {
                this.request(villageApi.ChargeRuleList,{
                    charge_project_id: tmp_project_id,
                    type: 'selectdata'
                }).then((res) => {
                    this.ruleList = res.list
                })
            },
            getGarageList () {
                this.request(villageApi.garageList).then((res) => {
                    this.garageList = res
                })
            },
            // 楼栋号
            getSingleListByVillage () {
                this.request(villageApi.getSingleListByVillage).then(res => {
                    if (res) {
                        const array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            })
                        })
                        this.singleList = array
                    }
                })
            },
            
             // 单元楼
            getFloorList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        resolve(res)
                    })
                })
            },
            // 楼层
            getLayerList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getLayerList, {
                        pid: id
                    }).then(res => {
                        if (res) {
                            resolve(res)
                        }
                    })
                })
            },
            // 房间
            getVacancyList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getVacancyList, {
                        pid: id
                    }).then(res => {
                        if (res) {
                            resolve(res)
                        }
                    })
                })
            },
            async loadDataFunc (selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.loading = true
                setTimeout(function () {
                    targetOption.loading = false
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc (selectedOptions) {
                this.searchForm['room_id'] = undefined
                if (selectedOptions.length == 1) {
                    const options_temp = [...this.singleList]
                    const res = await this.getFloorList(selectedOptions[0])
                    const children = []
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        options_temp['children'] = children
                        return true
                    })
                    options_temp.find(_ => _.value == selectedOptions[0])['children'] = children
                    this.singleList = options_temp
                } else if (selectedOptions.length == 2) {
                    const apps = await this.getLayerList(selectedOptions[1])
                    const options_temp = [...this.singleList]
                    const children = []
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        return true
                    })
                    const product = options_temp.find(item => item.value == selectedOptions[0])
                    product.children.find(item => item.value == selectedOptions[1])['children'] = children
                    this.singleList = options_temp
                } else if (selectedOptions.length == 3) {
                    const apps = await this.getVacancyList(selectedOptions[2])
                    const options_temp = [...this.singleList]
                    const children = []
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        })
                        return true
                    })
                    const product = options_temp.find(item => item.value == selectedOptions[0])
                    const product_1 = product.children.find(item => item.value == selectedOptions[1])
                    product_1.children.find(item => item.value == selectedOptions[2])['children'] = children
                    this.singleList = options_temp
                } else if (selectedOptions.length == 4) {
                    this.searchForm['room_id'] = selectedOptions[3];
                }
            },
            
            handleDateChange(value, valueStr, type){
                if(type == 'order_generate'){
                    this.time_slot = valueStr
                } else {
                    this.service_end_time = valueStr[0]
                    this.service_start_time = valueStr[1]
                }
            },
            
            handleSelectChange(value, type){
                this.searchForm.ruleList = []
                this.searchForm.rule_id = undefined
                this.getProjectRuleList(value)
            },
            
            searchThis(type){
                if(type == 'query'){
                    this.getTableList()
                } else {
                    this.searchForm = {
                        room_id: undefined,
                        position_num: undefined,
                        garage_id: undefined,
                        project_id: undefined,
                        rule_id: undefined,
                        key_val: undefined,
                        value: undefined,
                        order_type: undefined,
                        time_slot: [],
                        service_end_time: '',
                        service_start_time: '',
                    }
                    this.refrashForm = false
                    this.$nextTick(()=>{
                        this.refrashForm = true
                    })
                    this.getTableList()
                }
            },
            
            getTableList(){
                let params = {}
                let that = this
                that.selectedRowKeys = []
                Object.assign(params, this.searchForm)
                params.pageSize = this.pagination.pageSize
                params.page = this.pagination.current
                if(this.get_room_id && (params.room_id==undefined || params.room_id*1<1)){
                    params.room_id=this.get_room_id;
                }
                if(this.get_position_id && (params.position_num==undefined || !params.position_num)){
                    params.position_id=this.get_position_id;
                }
                that.tableLoading = true
                that.request('/community/village_api.CashierHangOrder/getHangPayOrders', params).then(res=>{
                    that.tableList = res.list
                    that.pagination.total = res.count
                    that.tableLoading = false
                    that.role_mdymoney = res.role_mdymoney != undefined ? res.role_mdymoney : 1;
                    that.role_payment = res.role_payment != undefined ? res.role_payment : 1;
                    
                    this.excelExportOutFileUrl=res.excelExportOutFileUrl;
                }).catch(err=>{
                    that.tableLoading = false
                })
            },
            
            handleTableChange(obj){
                this.pagination.pageSize = obj.pageSize
                this.pagination.current = obj.current
                this.getTableList()
            },
            
            repaireFee(record){
                this.repaireVisible = true
                this.repaireInfo = record
            },
            
            lookDetail(record){
                this.detailVisible = true
                this.repaireInfo = record
            },
            
            closeThis(flag){
                this.repaireVisible = false
                this.repaireInfo = {}
                if(flag){
                    this.getTableList()
                }
            },
            
            closeDetail(){
                this.detailVisible = false
                this.repaireInfo = {}
            },
            
            closeCollect(flag){
                this.collectVisible = false
                this.repaireInfo = {}
                this.orderList = []
                if(flag){
                    this.getTableList()
                }
            },
            
            collection(){
                let that = this
                if(that.selectedRowKeys.length == 0){
                    that.$message.warn('请先选择收费项')
                    return
                }
                
                that.orderList = []
                that.tableList.map(v=>{
                    if(that.selectedRowKeys.indexOf(v.order_id) != -1){
                        that.orderList.push(v)
                    }
                })
                
                that.request(villageApi.getMoney, {
                    order_list: that.orderList,
                    model_type: 1
                }).then((res) => {
                    that.repaireInfo = res
                    that.collectVisible = true
                })
            },
            
            onSelectChange(selectedRowKeys){
                this.selectedRowKeys = selectedRowKeys
            }
        }
    }
</script>

<style lang="less" scoped>
    .historical_arrears{
        background: #fff;
        .top_search{
            background: #fff;
            padding: 10px;
            transform: translateX(-10px);
            .form_con{
                display: flex;
                flex-wrap: wrap;
                .form_item{
                    width: 150px;
                    margin-left: 15px;
                    flex-shrink: 0;
                }
            }
        }
        .table_con{
            background: #fff;
        }
    }
</style>