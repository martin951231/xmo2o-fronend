<template>
    <div class="equipment_list">
        <div class="search_con">
            <div class="search_item">
                <div class="label">设备编号：</div>
                <div class="value">
                    <a-input style="width: 120px;" placeholder="请输入" v-model="pageInfo.device_no" />
                </div>
            </div>

            <div class="search_item">
                <div class="label">名称：</div>
                <div class="value">
                    <a-input style="width: 120px;" placeholder="请输入" v-model="pageInfo.name" />
                </div>
            </div>
            
            <div class="search_item">
                <div class="label">用户名：</div>
                <div class="value">
                    <a-input style="width: 120px;" placeholder="请输入" v-model="pageInfo.nickname" />
                </div>
            </div>
            
            <div class="search_item">
              <label style="margin-top: 5px;">投放时间：</label>
                      <span>
                        <a-date-picker
                          @change="serviceStartTimeChange"
                          format="YYYY-MM-DD"
                          placeholder="开始投放时间"
                        /> ~
                         <a-date-picker
                          @change="serviceEndTimeChange"
                          format="YYYY-MM-DD"
                          placeholder="结束投放时间"
                        />
                      </span>
           </div>
<!--            <div class="search_item">-->
<!--                <div class="label">投放方式：</div>-->
<!--                <div class="value">-->
<!--                    <a-select style="width: 120px;" v-model="pageInfo.clnt_type">-->
<!--                        <a-select-option :value="0">全部</a-select-option>-->
<!--                        <a-select-option :value="2">微信小程序</a-select-option>-->
<!--                        <a-select-option :value="4">刷卡</a-select-option>-->
<!--                        <a-select-option :value="5">传统无用户</a-select-option>-->
<!--                        <a-select-option :value="6">人脸识别</a-select-option>-->
<!--                        <a-select-option :value="7">二维码</a-select-option>-->
<!--                        <a-select-option :value="8">rfid 标签投递</a-select-option>-->
<!--                    </a-select>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="search_item">-->
<!--                <div class="label">状态：</div>-->
<!--                <div class="value">-->
<!--                    <a-select style="width: 120px;" v-model="pageInfo.status" @change="handleTableChange">-->
<!--                        <a-select-option :value="1">全部</a-select-option>-->
<!--                    </a-select>-->
<!--                </div>-->
<!--            </div>-->
            <a-button type="primary" style="margin-left: 10px;" @click="queryThis">查询</a-button>
        </div>

        <div class="table_con">
            <a-table rowKey="key" :columns="tableColumns" :data-source="tableList" :pagination="pageInfo" :loading="tableLoading" @change="handleTableChange">
                <span slot="str" slot-scope="text">
                    {{ text || '--' }}
                </span>
                <span slot="score" slot-scope="text" style="color: #0ccfa3">
                    {{ text || '--' }}
                </span>
                <template slot="action" slot-scope="record">
                    <a-button v-if="record.show_type == 'parent'" type="link" @click="lookRecord(record)">查看</a-button>
                </template>
            </a-table>
        </div>
        
        <detailModal :equip_id="equip_id" :visible="detailVisible" @close="closeDetail" />
    </div>
</template>

<script>
    import Vue from 'vue';
    import detailModal from './modules/detailModal.vue';
    export default {
        components: {
            detailModal
        },
        data() {
            return {
                pageInfo: {
                    device_no: '',
                    name: '',
                    nickname: '',
                    clnt_type: 0,
                    start_put_time:'',
                    end_put_time:'',
                
                    pageSize: 10,
                    page: 1,
                    current: 1,
                    total: 0,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                tableColumns: [{
                        title: '序号',
                        dataIndex: 'id'
                    },{
                        title: '设备编号',
                        dataIndex: 'device_no',
                    },
                    {
                        title: '名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '投放方式',
                        dataIndex: 'clnt_type_str',
                        scopedSlots: {
                            customRender: 'str'
                        }
                    },
                    {
                        title: '用户名',
                        dataIndex: 'nickname',
                    },
                    {
                        title: '卡号',
                        dataIndex: 'ic_card',
                        scopedSlots: {
                            customRender: 'str'
                        }
                    },
                    {
                        title: '重量（g）',
                        dataIndex: 'weight',
                    },
                    {
                        title: '垃圾类型',
                        dataIndex: 'type'
                    },
                    {
                        title: '积分',
                        dataIndex: 'score',
                        scopedSlots: {
                            customRender: 'score'
                        }
                    },
                    {
                        title: '投放时间',
                        dataIndex: 'put_time'
                    },
                    {
                        title: '操作',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                tableList: [],
                
                bindVisible: false,
                detailVisible: false,
                tableLoading: false,
                equip_id: '',

            }
        },
        mounted() {
            this.pageInfo.page=1;
            this.pageInfo.current=1;
            this.getData()
        },
        methods: {
            handleTableChange({current, pageSize}){
                this.pageInfo.current = current
                this.pageInfo.page = current
                this.pageInfo.pageSize = pageSize
                this.getData();
            },
            
            lookRecord(record){
                this.equip_id = record.id
                this.detailVisible = true
            },
            
            closeDetail(){
                this.equip_id = ''
                this.detailVisible = false
            },

            serviceStartTimeChange(date,dateString){
                console.log('start_put_time',dateString);
                this.pageInfo.start_put_time=dateString;
            },
            serviceEndTimeChange(date,dateString){
                console.log('end_put_time',dateString);
                this.pageInfo.end_put_time=dateString;
            },
            getData(){
                let that = this
                that.tableLoading = true
                that.request('/community/platform.device.GarbageCollectionPut/putList', that.pageInfo).then((res) => {
                    that.tableLoading = false
                    that.pageInfo.total = res.total
                    that.tableList = res.data
                    that.tableList.map((v, i)=>{
                        v.key = 'one' + i
                        v.show_type = "parent"
                        if(!v.children || v.children.length == 0) return
                        v.children.map((item, index)=>{
                            item.key = 'two' + '-' + i + '-' + index
                            item.show_type = "children"
                        })
                    })
                })
            },
            queryThis() {
                this.pageInfo.page=1;
                this.pageInfo.current=1;
                this.getData()
            },
        }
    }
</script>

<style lang="less" scoped>
    .equipment_list {
        padding: 20px;
        background: #ffffff;
        margin-top: 10px;
        .search_con {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            transform: tranlateX(-10px);
            .search_item {
                display: flex;
                align-items: center;
                margin: 10px;
                
                .label {
                    font-size: 14px;
                    color: #666666;
                }

                .value {}
            }
        }
    }
</style>
