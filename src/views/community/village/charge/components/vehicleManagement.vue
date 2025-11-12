<template>
    <a-drawer title="车辆列表" placement="right" :width="widthDrawer" :closable="true" :visible="drawer_visible" @close="onClose">
    <div class="vehicle_management">

        <div class="table_content">
            <a-table :columns="columns"  :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="vehicleList" >
            </a-table>
        </div>
    </div>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '车位号',
            dataIndex: 'position_num',
            key: 'position_num',
        },
       {
            title: '车牌号码',
            dataIndex: 'car_number',
            key: 'car_number',
        },{
            title: '停车到期时间',
            dataIndex: 'end_time',
            key: 'end_time',
        },{
            title: '车主姓名',
            dataIndex: 'car_user_name',
            key: 'car_user_name',
        },{
            title: '车主手机号',
            dataIndex: 'car_user_phone',
            key: 'car_user_phone',
        },{
            title: '与车主关系',
            dataIndex: 'relationship',
            key: 'relationship',
        },
    ];
    export default {
        data() {
            return {
                columns,
                vehicleVisible: false,
                selectedRowKeys: [],
                modelTitle: '',
                drawer_visible: false,
                widthDrawer: 1000,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    search_value: '',
                    search_type: '',
                    //showSizeChanger: true, // 显示可改变每页数量
                   // pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                frequency: false,
                vehicleList: [],
                tableLoadding: false,
                vehicle_type: 'add',
                searchType: [{search_type: 1, label: '车牌号'}, {search_type: 3, label: '车位号'}],
                car_id: '',
                headers: {
                    authorization: 'authorization-text'
                },
                exportLoadding1: false,
                exportLoadding2: false,
                exportLoadding3: false,
                exportLoadding4: false,
                clearSelect: true,
                uploadData: {village_id: 0}
            }
        },
        
        components: {
        },

        methods: {
            onClose() {
                this.drawer_visible = false
                // setTimeout(() => {
                //     this.post.id = 0;
                //     this.form = this.$form.createForm(this)
                // }, 500)
            },
            search_btn(user_info){
                this.drawer_visible = true;
                if(user_info.position_id!=undefined && user_info.position_id){
                    this.pageInfo.search_value=user_info.position_id;
                    this.pageInfo.search_type=4;
                }else{
                    this.pageInfo.search_value='';
                    this.pageInfo.search_type='';
                }
                this.getVehicleList()
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
                this.getVehicleList()
            },
            clearThis(){
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    search_value: '',
                    search_type: '',
                    pageSize: 20,
                    total: 0
                }
                this.clearSelect = false
                let timeout = setTimeout(()=>{
                    this.clearSelect = true
                    clearTimeout(timeout)
                }, 100)
                this.getVehicleList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getVehicleList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getVehicleList()
                console.log('onTableChange==>', page, pageSize)
            },
            getVehicleList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getCarlist, that.pageInfo).then((res) => {
                    that.vehicleList = res.list
                    that.pageInfo.total = res.count
                    that.uploadData.village_id = res.village_id
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            handleSelectChange(value) {
                this.pageInfo.search_type = value
                console.log(`selected ${value}`);
            },

            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            editThis(record){
                this.modelTitle = '编辑车辆'
                this.vehicle_type = 'edit'
                this.car_id = record+''
                this.vehicleVisible = true
            },
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.delCar, {car_id: record.car_id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.getVehicleList()
                })
            },
            
            delBindConfirm(record){
                console.log("record=======>", record)
            },

            delCancel() {

            },

            closeVehicle(flag){
                this.car_id = ''
                this.vehicleVisible = false
                if(flag){
                    this.getVehicleList()
                }
            },
            
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },
            
            handleUploadChange(info){
                if (info.file.status === 'done') {
                    if(info.file.response.status == 1000){
                        this.$message.success(`上传成功！`);
                        if (info.file.response.data.url){
                            window.location.href = info.file.response.data.url
                        } else{
                            this.getVehicleList()
                        }
                    } else {
                        this.$message.error(info.file.response.msg);
                    }
                } else if (info.file.status === 'error') {
                    this.$message.error(`上传失败！`);
                }
            },
            
            addThis(){
                this.modelTitle = '添加车辆'
                this.vehicle_type = 'add'
                this.vehicleVisible = true
            },
            
            downCar(){
                let that = this
                that.exportLoadding1 = true
                that.request('/community/village_api.Parking/downCar', that.pageInfo).then((res) => {
                    if(res.error == 0){
                        window.location.href = res.url
                        this.$message.success('导出成功')
                    } else{
                        this.$message.error('导出失败')
                    }
                    that.exportLoadding1 = false
                }).catch(e=>{
                    that.exportLoadding1 = false
                })
            },
            
            downModel(){
                let that = this
                that.exportLoadding2 = true
                that.request('/community/village_api.Parking/downCarModel', that.pageInfo).then((res) => {
                    if(res.error == 0){
                        window.location.href = res.url
                        that.$message.success('导出成功')
                    } else{
                        that.$message.error('导出失败')
                    }
                    that.exportLoadding2 = false
                }).catch(e=>{
                    that.exportLoadding2 = false
                })
            },
            parkWhite(){
                let that = this
                that.exportLoadding4 = true
                that.request('/community/village_api.Parking/allAddParkWhite',{}).then((res) => {
                    if(res){
                        this.$message.success('同步成功！')
                    } else {
                        this.$message.error('同步失败！')
                    }
                    that.exportLoadding4 = false
                }).catch(e=>{
                    that.exportLoadding4 = false
                })
            },
            synchronization(){
                let that = this
                that.exportLoadding3 = true
                that.request('/community/village_api.Parking/sysParkCarDevice',{}).then((res) => {
                    if(res.retval.code == 1){
                        this.$message.success('同步成功！')
                    } else {
                        this.$message.error('同步失败！')
                    }
                    that.exportLoadding3 = false
                }).catch(e=>{
                    that.exportLoadding3 = false
                })
            }
        },
    }
</script>

<style lang="less" scoped>
    .vehicle_management {
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
            
            .operation_btn{
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
    
</style>
