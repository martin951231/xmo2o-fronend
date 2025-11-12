<template>
    <a-drawer title="绑定车辆列表" :width="1000" :visible="drawerVisible" @close="handleSubCancel">
    <div class="vehicle_management">

        <div class="table_content">
            <a-table :columns="columns" :row-key="record=>record.car_id" :pagination="pageInfo"  @change='table_change'
            :loading="tableLoadding"
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
            title: '车辆编号',
            dataIndex: 'car_id',
            key: 'car_id',
        },{
            title: '车牌号码',
            dataIndex: 'car_number',
            key: 'car_number',
        },{
            title: '业主姓名',
            dataIndex: 'car_user_name',
            key: 'car_user_name',
        },{
            title: '业主手机号',
            dataIndex: 'car_user_phone',
            key: 'car_user_phone',
        },{
            title: '绑定时间',
            dataIndex: 'bind_position_time_str',
            key: 'bind_position_time_str',
        },
    ];
    export default {
        data() {
            return {
                columns,
                drawerVisible: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 20,
                    total:20,
                    position_id:0,
                },
                vehicleList: [],
                tableLoadding:false,
            }
        },
    
        methods: {
            showBindCarList(record){
                console.log('record',record)
                this.pageInfo.position_id=record.position_id;
                this.pageInfo.garage_id=record.garage_id;
                this.drawerVisible=true;
                this.getVehicleList();
            },
            getVehicleList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getCarBindPositionList, that.pageInfo).then((res) => {
                    that.vehicleList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                     that.columns=columns;
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            table_change(e) {
                if (e.current && e.current>0) {
                    this.pageInfo.current = e.current;
                    this.pageInfo.page = e.current;
                    this.getVehicleList()
                }
            },
            handleSubCancel() {
                this.drawerVisible=false;
            },

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
