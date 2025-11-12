<template>
    <a-drawer title="绑定车位列表" :width="1100" :visible="drawerPVisible" @close="handleSubCancel">
    <div class="vehicle_management">

        <div class="table_content">
            <a-table :columns="columns" :row-key="record=>record.position_id" :pagination="pageInfo" 
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
            title: '车库名称',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },{
            title: '车位号',
            dataIndex: 'position_num',
            key: 'position_num',
        },{
            title: '到期时间',
            dataIndex: 'end_time_str',
            key: 'end_time_str',
        },{
            title: '业主姓名',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '业主手机号',
            dataIndex: 'phone',
            key: 'phone',
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
                drawerPVisible: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    car_id:0,
                    garage_id:0,
                },
                vehicleList: [],
                tableLoadding:false
            }
        },
    
        methods: {
            showBindPositionList(record){
                console.log('record',record)
                this.pageInfo.car_id=record.car_id;
                this.pageInfo.garage_id=record.garage_id;
                this.drawerPVisible=true;
                this.getVehicleList();
            },
            getVehicleList(){
                let that = this
                that.tableLoadding = true
                that.pageInfo.xtype='position';
                that.request(villageApi.getCarBindPositionList, that.pageInfo).then((res) => {
                    that.vehicleList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                     that.columns=columns;
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            

            handleSubCancel() {
                this.drawerPVisible=false;
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
