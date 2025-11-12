<template>
    <div class="parking_lot">
        <div class="header_search">
            <div class="search_item">
                <label class="label_title" style="width: 120px;">车库名称：</label>
                <a-input placeholder="请输入车库名称" v-model="pageInfo.garage_name" />
            </div>
            <!--
            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">状态：</label>
                <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                    @change="handleSelectChange" v-model="pageInfo.garage_status">
                    <a-select-option v-for="(item,index) in garageList" :value="item.garage_status">
                        {{item.label}}
                    </a-select-option>
                </a-select>
            </div>
            -->

            <div class="search_item" style="margin-left: 10px;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;" @click="resetThis()">清空</a-button>
                <a-button type="primary" style="margin-left: 50px;" @click="operateLot('add')" v-if="role_addgarage==1">添加</a-button>
                
                <a-button  type="primary" style="margin-left: 20px;" @click="third_aihorse_platform_pop()"  v-if="has_third_aihorse_platform==1">获取智慧停车服务商系统车场信息</a-button>
                
                <!--
                <a-button  style="margin-left: 20px;" @click="operateLot('function')"  v-if="role_garageset==1">车库功能设置</a-button>
                <a-button  style="margin-left: 20px;" @click="operateLot('params')"  v-if="role_garageparam==1">车库参数设置</a-button>
                !-->
                
            </div>
        </div>
        <div class="table_content">
            <a-table :columns="column" :data-source="parklotList" :row-key="record=>record.garage_id" :pagination="pageInfo" :loading="tableLoadding"
            @change="handleTableChange">
                <a-tag  slot="is_month_access" slot-scope="text, record" :color="record.is_month_access==1?'green':'orange'" >
                    {{ record.is_month_access==1?'是':'否' }}
                </a-tag>
                <a-tag  slot="is_month_charge" slot-scope="text, record"  :color="record.is_month_charge==1?'green':'orange'" >
                    {{ record.is_month_charge==1?'是':'否' }}
                </a-tag>
                <span slot="manage" slot-scope="text, record">
                    <a @click="manageThis(record)"  v-if="role_garagemanage==1 && record.park_sys_type=='D3'" >管理</a>
                    <a @click="visibleThirdTypeCharg(record)"  v-if="record.is_third_park_garage*1==1" >查看月租车收费规则</a>
                </span>
                <span slot="passall" slot-scope="text, record">
                    <a @click="passThis(record)">{{record.passage_count}}</a>
                </span>
                <span slot="action" slot-scope="text, record">
                    <span v-if="record.is_third_park_garage*1<1">
                     <a @click="$refs.setGarageDrawer.showVisible(record,role_garageset,role_garageparam)" v-if="role_garageset==1 || role_garageparam==1" >车库配置设置</a>
                     <a-divider type="vertical" v-if="record.park_sys_type=='A11'"/>
                     <a  v-if="record.park_sys_type=='A11'" @click="carType(record.garage_id)">卡类管理</a>
                     <a-divider type="vertical" v-if="role_editgarage==1"/>
                     <a @click="editThis(record)" v-if="role_editgarage==1" >编辑</a>
                    <a-divider type="vertical" v-if="role_editgarage==1 && role_delgarage==1"/>
                    </span>
                    <span v-if="record.is_third_park_garage*1==1" >
                        <a @click="detailThis(record)" >查看详情</a>
                         <a-divider type="vertical"/>
                        <a @click="getThirdGaragePassage(record)" >拉取车道数据</a>
                        <a-divider type="vertical" v-if="role_delgarage==1"/>
                        </span>
                    <a-popconfirm v-if="role_delgarage==1" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <set-garage-drawer ref="setGarageDrawer" @ok="bindOk" />
            <edit-drawer v-if="drawerVisible" :garage_id="garage_id" :drawer_type="drawer_type" :visible="drawerVisible" @closeDrawer="closeDrawer"/>
            <month-manage :garage_id="garage_id" :visible="manageVisible" @closeManage="closeManage"/>
            <temp-manage :garage_id="garage_id" :park_sys_type="park_sys_type" :visible="tempManageVisible" @closeTempManage="closeTempManage"/>
            <passway-list :garage_id="garage_id" :visible="passVisible" @closePass="closePass" />
            <detail-drawer v-if="detailVisible" :garage_id="garage_id" :visible="detailVisible" @closeDrawer="closeDrawer"/>
        </div>
        
        <a-modal :title="'查看车场【'+current_park_garage_name+'】月租车收费规则'" :visible="thirdTypeChargVisible" :width="800" :footer="null" @cancel="handleCancelthirdTypeCharg">
            <div class="search_item">
            <a-table :columns="columnRules" :data-source="carThirdTypeChargRules" :row-key="record=>record.carTypeNo" :pagination="false">
            </a-table>
            </div>
        </a-modal>
        
        <a-modal title="拉取智慧停车服务商系统车场数据信息" :visible="get_tips_visible" :confirm-loading="confirmLoadingThird"  @ok="get_third_aihorse_platform" @cancel="handleThirdAihorsePlatformCancel"
            :width="580">
            <div class="search_item">
                <label class="label_title" style="width: 120px;">请填写车场唯一编号：</label>
                <a-input placeholder="请填写车场唯一编号" v-model="third_park_key"  style="width: 300px;" />
            </div>
            <div v-if="confirmLoadingThird" style="margin-top: 20px;margin-left: 20px;">
                <a-spin size="large" />
                <span style=" margin-left: 25px;">正在拉取数据中，请耐心等候。</span>
                <p style="margin: 15px;">拉取到新的数据将做添加操作，拉取到已有的数据将做更新操作</p>
            </div>
        </a-modal>
        
        <a-modal title="请稍等，正在为您获取车场车道信息数据 . . ." :visible="get_data_tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">正在为您获取车场【{{current_park_garage_name}}】的车道信息数据</span>
                <p style="margin: 15px;">拉取到新的数据将做添加操作，拉取到已有的数据将做更新操作。</p>
            </div>
        </a-modal>
        
    </div>
</template>

<script>
    import editDrawer from './components/editDrawer.vue';
    import detailDrawer from './components/detailDrawer.vue';
    import setGarageDrawer from './components/setGarageDrawer.vue';
    import monthManage from './components/monthManage.vue';
    import tempManage from './components/tempMonthManage';
    import passwayList from './components/passwayList.vue';
    
    import villageApi from '@/api/community/village';
    const columnRules = [
        {
            title: '车辆收费类型',
            dataIndex: 'carTypeNoStr',
            key: 'carTypeNoStr',
        },
        {
            title: '收费月数',
            dataIndex: 'mthNum',
            key: 'mthNum',
            width: 100,
        },
        {
            title: '收费金额',
            dataIndex: 'money',
            key: 'money',
            width: 100,
        },
        {
            title: '说明',
            dataIndex: 'desc',
            key: 'desc',
        },
    ];
    const columns = [
        {
            title: '停车库ID',
            dataIndex: 'garage_id',
            key: 'garage_id',
        },
        {
            title: '车库名称',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },
        {
            title: '车位总数',
            key: 'position_count',
            dataIndex: 'position_count',
        },

        {
            title: '通道总数',
            key: 'passall',
            scopedSlots: {
                customRender: 'passall'
            },
            width: 100
        },
        {
            title: '车库地址',
            key: 'garage_position',
            dataIndex: 'garage_position',
        },

        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];
    const columns1 = [
        {
            title: '停车库ID',
            dataIndex: 'garage_id',
            key: 'garage_id',
        },
        {
            title: '车库名称',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },
        {
            title: '设备类型',
            dataIndex: 'park_sys_type',
            key: 'park_sys_type',
        },
        {
            title: '车位总数',
            key: 'position_count',
            dataIndex: 'position_count',
        },
        {
            title: '绑定月租车规则',
            key: 'manage',
            width: 100,
            scopedSlots: {
                customRender: 'manage'
            },
        },
        {
            title: '通道总数',
            key: 'passall',
            scopedSlots: {
                customRender: 'passall'
            },
            
        },
        {
            title: '车库地址',
            key: 'garage_position',
            dataIndex: 'garage_position',
            width: 220,
        },
        {
            title: '操作',
            key: 'action',
            width: 280,
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];

    export default {
        data() {
            return {
                columns,
                columns1,
                column:columns,
                columnRules,
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
                    garage_name: '',
                    garage_status: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                parklotList: [],
                drawer_type: 'add',
                garage_id: '',
                garageList: [{garage_status: 1, label: '未绑定'}, {garage_status: 2, label: '已绑定'}],
                frequency: false,
                role_addgarage:0,
                role_delgarage:0,
                role_editgarage: 0,
                role_garagemanage:0,
                role_garageparam:0,
                role_garageset:0,
                has_third_aihorse_platform:0,
                get_tips_visible:false,
                confirmLoadingThird:false,
                third_park_key:'',
                detailVisible:false,
                carThirdTypeChargRules:[],
                thirdTypeChargVisible:false,
                current_park_garage_name:'',
                get_data_tips_visible:false,
            }
        },
        
        components: {
            editDrawer,
            monthManage,
            tempManage,
            passwayList,
            setGarageDrawer,
            detailDrawer
        },
        
        mounted(){
            this.getParklotList()
        },

        methods: {
            getParklotList(){
                let that = this
                that.tableLoadding = true
                this.get_tips_visible=false;
                this.confirmLoadingThird=false;
                this.thirdTypeChargVisible = false
                that.request(villageApi.getParkGarageList, that.pageInfo).then((res) => {
                    that.parklotList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                    that.park_sys_type=res.park_sys_type
                    if (res.park_sys_type.includes('D3') || res.park_sys_type.includes('A11')){
                       that.column=this.columns1 
                    }else{
                        that.column=this.columns
                    }
                    if(res.has_third_aihorse_platform!=undefined){
                        this.has_third_aihorse_platform=res.has_third_aihorse_platform*1;
                    }
                    if(this.has_third_aihorse_platform>0){
                        this.columns1 = [
                                {
                                    title: '停车库ID',
                                    dataIndex: 'garage_id',
                                    key: 'garage_id',
                                     width: 120,
                                },
                                {
                                    title: '车库名称',
                                    dataIndex: 'garage_num',
                                    key: 'garage_num',
                                },
                                {
                                    title: '车场唯一编号',
                                    dataIndex: 'third_park_key',
                                    key: 'third_park_key',
                                     width: 120,
                                },
                                {
                                    title: '设备类型',
                                    dataIndex: 'park_sys_type',
                                    key: 'park_sys_type',
                                },
                                {
                                    title: '车位总数',
                                    key: 'position_count',
                                    dataIndex: 'position_count',
                                     width: 120,
                                },
                                {
                                    title: '绑定月租车规则',
                                    key: 'manage',
                                    width: 120,
                                    scopedSlots: {
                                        customRender: 'manage'
                                    },
                                },
                                {
                                    title: '通道总数',
                                    key: 'passall',
                                    width: 100,
                                    scopedSlots: {
                                        customRender: 'passall'
                                    },
                                    
                                },
                                {
                                    title: '车库地址',
                                    key: 'garage_position',
                                    dataIndex: 'garage_position',
                                    width: 220,
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    width: 280,
                                    scopedSlots: {
                                        customRender: 'action'
                                    },
                                },
                            ];
                        that.column=this.columns1 ;
                    }
                    if(res.role_addgarage!=undefined){
                        this.role_addgarage=res.role_addgarage;
                        this.role_delgarage=res.role_delgarage;
                        this.role_editgarage=res.role_editgarage;
                        this.role_garagemanage=res.role_garagemanage;
                        this.role_garageparam=res.role_garageparam;
                        this.role_garageset=res.role_garageset;
                    }else{
                        this.role_addgarage=1;
                        this.role_delgarage=1;
                        this.role_editgarage=1;
                        this.role_garagemanage=1;
                        this.role_garageparam=1;
                        this.role_garageset=1;
                    }
                }).catch(e=>{that.tableLoadding = false})
            },
            carType(garage_id){
                this.garage_id = garage_id+''
                this.tempManageVisible = true  
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
                this.getParklotList()
            },
            bindOk(){
                this.getParklotList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getParklotList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getParklotList()
                console.log('onTableChange==>', page, pageSize)
            },
            resetThis(){
                this.pageInfo = {
                    current: 1,
                    page: 1,
                    garage_name: '',
                    garage_status: undefined,
                    pageSize: this.pageInfo.pageSize,
                    total: 0
                }
                this.getParklotList()
            },
            
            handleSelectChange(value) {
                console.log(value)
                // this.pageInfo.garage_status = value
            },

            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            editThis(record){
                this.drawer_type = 'edit'
                this.drawerVisible = true
                this.garage_id = record.garage_id+'';
            },
            detailThis(record){
                this.drawerVisible = false
                this.thirdTypeChargVisible = false
                this.detailVisible = true
                this.current_park_garage_name='';
                this.garage_id = record.garage_id+'';
            },
            visibleThirdTypeCharg(record){
                this.thirdTypeChargVisible = true
                this.current_park_garage_name=record.garage_num;
                this.carThirdTypeChargRules=record.carThirdTypeChargRules
            },
            handleCancelthirdTypeCharg(){
                this.thirdTypeChargVisible = false
                this.current_park_garage_name='';
                this.carThirdTypeChargRules=[];
                this.get_data_tips_visible=false;
                this.confirmLoadingThird=false;
            },
            manageThis(record){
                this.garage_id = record.garage_id+'';
                this.manageVisible = true
            },
            passThis(record){
                let that = this
                if(record.passage_count == 0){
                    if(record.is_third_park_garage*1==1){
                        this.$message.warn('当前车库暂无通道数据，请点击【获取车道数据】操作获取车道数据！')
                        return false;
                    }
                    this.$confirm({
                        title: '提示',
                        content: '当前车库未绑定通道，请去通道列表绑定',
                        okText: '跳转车道管理页面',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                            that.$router.push('/village/yardManagement/laneManage')
                        },
                        onCancel() {},
                    });
                    return
                }
                this.garage_id = record.garage_id+''
                this.passVisible = true
            },

            delConfirm(record) {
                let that = this
                that.request(villageApi.delParkingGarage, {garage_id: record.garage_id}).then((res) => {
                    that.getParklotList()
                    that.$message.success('删除成功！')
                })
            },

            delCancel() {

            },

            closeDrawer(flag){
                this.garage_id = '';
                this.drawerVisible = false
                this.detailVisible = false
                if(flag){
                    this.getParklotList()
                }
            },
            closeManage(){
                this.garage_id = ''
                this.manageVisible = false
            },
            closeTempManage(){
                this.garage_id = ''
                this.tempManageVisible = false 
            },
            closePass(){
                this.garage_id = ''
                this.passVisible = false
            },
            
            operateLot(type){
                this.drawer_type = type
                this.garage_id = ''
                this.drawerVisible = true
            },
            third_aihorse_platform_pop(){
                this.get_tips_visible=true;
            },
            handleThirdAihorsePlatformCancel(){
                this.get_tips_visible=false;
                this.confirmLoadingThird=false;
                this.third_park_key='';
                this.get_data_tips_visible=false;
                this.current_park_garage_name='';
            },
            get_third_aihorse_platform(){
                this.confirmLoadingThird=true;
                if(!this.third_park_key){
                    this.$message.warn('请填写车场唯一编号！')
                    return
                }
                let postArr={'park_key':this.third_park_key};
                this.request(villageApi.getAihorseThirdGarageInfo,postArr).then((res) => {
                    this.handleThirdAihorsePlatformCancel();
                    this.getParklotList()
                    this.$message.success('操作成功！')
                }).catch((error) => {
                   this.handleThirdAihorsePlatformCancel();
              })
            },
            getThirdGaragePassage(record){
                this.confirmLoadingThird=false;
                this.get_data_tips_visible=true;
                this.current_park_garage_name=record.garage_num;
                  if(!record.third_park_key){
                      this.$message.warn('此车场缺失车场唯一编号信息，无法获取其车道信息')
                      return
                  }
                  let postArr={'park_key':record.third_park_key,'garage_id':record.garage_id};
                  this.request(villageApi.getAihorseGaragePassageList,postArr).then((res) => {
                      this.handleThirdAihorsePlatformCancel();
                      this.getParklotList()
                      let msgTmp='操作成功！';
                      if(res.msg){
                          msgTmp=res.msg;
                      }
                      this.$message.success(msgTmp)
                  }).catch((error) => {
                     this.handleThirdAihorsePlatformCancel();
                })
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
