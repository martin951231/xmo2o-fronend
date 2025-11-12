<template>
    <div class="message-suggestions-box-1">
        <div>
            <a-collapse  >
                <a-collapse-panel  header="注意事项">
                    <p>目前已知情况如下</p>
                    <p>1、目前大华-指纹锁的指纹数据需要到大华云睿平台进行录入，设备添加成功后会进行获取下发</p>
                </a-collapse-panel>
            </a-collapse>
        </div>
        <div class="add-box">
            <a-row >
                <a-col :md="8" :sm="24">
                    <a-button type="primary" @click="$refs.addFingerprintDevice.add()">
                        添加指纹锁
                    </a-button>
                </a-col>
            </a-row>
        </div>
        
        <div class="search-box">
            <a-row :gutter="24">
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 250px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">指纹器编号：</label> <a-input style="width: 150px" placeholder="请输入指纹器编号" v-model="search.device_sn"/>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" style="width: 250px;padding-right: 1px">
                    <a-input-group compact>
                        <label style="margin-top: 5px;">指纹器名称：</label> <a-input style="width: 150px" placeholder="请输入指纹器名称" v-model="search.device_name"/>
                    </a-input-group>
                </a-col>
                <a-col :md="8" :sm="24" class="padding-tp10" >
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                    <a-divider type="vertical"/>
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>
            </a-row>

        </div>
       
        <a-table
            :columns="columns"
            :data-source="data"
            class="components-table-demo-nested"
            :pagination="pagination"
            @change='table_change'
            :loading="loading"  >
      <span slot="action" slot-scope="text, record">
          <a @click="$refs.addFingerprintDevice.edit(record.device_id)">修改设备</a>
          <a-divider type="vertical"/>
          <a-popconfirm
              style="margin-left: 10px"
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="del_device(record.device_id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>

        </a-table>
        
        <add-fingerprint-device ref="addFingerprintDevice" @ok="getList"/>
        
    </div>

</template>
<script>
    import villageDeviceApi from '@/api/community/village/device'
    const columns = [
        { title: '指纹锁ID',      dataIndex: 'device_id',                               key: 'device_id'},
        { title: '指纹锁名称',    dataIndex: 'device_name',                             key: 'camera_name'},
        { title: '指纹锁编号SN',  dataIndex: 'device_sn',                              key: 'device_sn'},
        { title: '指纹锁品牌',    dataIndex: 'brand_txt',                              key: 'brand_txt'},
        { title: '添加时间',      dataIndex: 'add_time_txt',                           key: 'add_time_txt'},
        { title: '操作',          dataIndex: '', scopedSlots: {customRender: 'action'}, key: 'action', width: '300px',},
    ];
    const data = [];
    import addFingerprintDevice from "@/views/community/village/device/fingerprint/addFingerprintDevice";
    export default {
        name: 'fingerprintDeviceList',
        components:{
            addFingerprintDevice,
        },
        data() {
            return {
                pagination : { pageSize: 10, total:10 ,current:1},
                search     : {device_sn:'',device_name:'',page: 1},
                form       : this.$form.createForm(this),
                visible    : false,
                loading    : false,
                data,
                columns,
                page       : 1,
            };
        },
        mounted () {
            this.getList();
        },
        methods: {
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageDeviceApi.getFingerprintDeviceList, this.search)
                    .then((res) => {
                        this.pagination.total    = res.count    ? res.count    : 0
                        this.pagination.pageSize = res.pageSize ? res.pageSize : 10
                        this.data = res.list
                        this.loading = false
                    })
            },
            //删除视频监控
            del_device(device_id){
                this.request(villageDeviceApi.fingerprintDeviceDeleteDevice,{
                    device_id:device_id
                }).then((res)=>{
                    this.$message.success('删除成功');
                    this.getList();
                });
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                if (e.current && e.current>0) {
                    this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList();
                }
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.page=1;
                let val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                console.log('searchList');
                this.table_change(val);
            },
            // 进行重置
            resetList() {
                this.search = {camera_sn:'',device_name:'',page: 1 };
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        margin-top: 10px;
        background-color: white;
    }
    .message-suggestions-box-1 .search-box {
        padding: 0 20px 0;
    }
    .message-suggestions-box-1 .add-box {
        padding: 10px 10px 10px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
        padding-top: 15px;
        padding-bottom: 20px;
    }

    /deep/ .but-box{
        width: 365px !important;padding-left: 0 !important;
    }

</style>