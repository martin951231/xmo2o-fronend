<template>
    <div class="message-suggestions-list-box">
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="5" :sm="24">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">评价人：</p>
                        <a-input style="width: 80%" v-model="search.xname" placeholder="请输入评价人姓名"/>
                    </a-input-group>
                </a-col>
                <a-col :md="5" :sm="24">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">手机号：</p>
                        <a-input style="width: 80%" v-model="search.xphone" placeholder="请输入手机号"/>
                    </a-input-group>
                </a-col>

                <a-col :md="6" :sm="24" class="but-box">
                    <a-button type="primary" icon="search" @click="searchList()">查询</a-button>
                    <a-button  @click="resetList()" style="margin-left: 35px;">重置</a-button>
                </a-col>

            </a-row>
        </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
                :row-key="record => record.operator_id"
        >
            <span slot="evaluate1" slot-scope="evaluate1,record,index">
              <span v-if="record.evaluate1*1 > 0"  @click="$refs.worksorderevaluateModel.qlist(record,1)" style="color:#1890ff;cursor: pointer;font-size: 16px;font-weight: bold"> {{record.evaluate1}} </span>
              <span style="font-size: 16px;" v-else> {{record.evaluate1}} </span>
            </span>
            <span slot="evaluate2" slot-scope="evaluate2,record,index">
              <span v-if="record.evaluate2*1 > 0" @click="$refs.worksorderevaluateModel.qlist(record,2)" style="color:#1890ff;cursor: pointer;font-size: 16px;font-weight: bold"> {{record.evaluate2}} </span>
              <span style="font-size: 16px;" v-else> {{record.evaluate2}} </span>
            </span>
            <span slot="evaluate3" slot-scope="evaluate3,record,index">
              <span v-if="record.evaluate3*1 > 0" @click="$refs.worksorderevaluateModel.qlist(record,3)" style="color:#1890ff;cursor: pointer;font-size: 16px;font-weight: bold"> {{record.evaluate3}} </span>
              <span style="font-size: 16px;" v-else> {{record.evaluate3}} </span>
            </span>
            <span slot="evaluate4" slot-scope="evaluate4,record,index">
              <span v-if="record.evaluate4*1 > 0" @click="$refs.worksorderevaluateModel.qlist(record,4)" style="color:#1890ff;cursor: pointer;font-size: 16px;font-weight: bold"> {{record.evaluate4}} </span>
              <span style="font-size: 16px;" v-else> {{record.evaluate4}} </span>
            </span>
            <span slot="evaluate5" slot-scope="evaluate5,record,index">
              <span v-if="record.evaluate5*1 > 0" @click="$refs.worksorderevaluateModel.qlist(record,5)" style="color:#1890ff;cursor: pointer;font-size: 16px;font-weight: bold"> {{record.evaluate5}} </span>
              <span style="font-size: 16px;" v-else> {{record.evaluate5}} </span>
            </span>
            
        </a-table>
    <worksOrderEvaluateList ref="worksorderevaluateModel" @ok="bindOk" />
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import worksOrderEvaluateList from './worksOrderEvaluateList';
	import store from '@/store';
    const columns = [
        { title: '评价者ID',  dataIndex: 'operator_id', key: 'operator_id'},
        { title: store.getters.config.room_name+'号',  dataIndex: 'roomaddr', key: 'roomaddr'},
        { title: '评价人',  dataIndex: 'log_operator', key: 'log_operator'},
        { title: '手机号', dataIndex: 'log_phone', key: 'log_phone' },
        { title: '一星（数量）', dataIndex: 'evaluate1', key: 'evaluate1',scopedSlots: { customRender: 'evaluate1' }},
        { title: '二星（数量）',  dataIndex: 'evaluate2', key: 'evaluate2',scopedSlots: { customRender: 'evaluate2' }},
        { title: '三星（数量）',   dataIndex: 'evaluate3', key: 'evaluate3',scopedSlots: { customRender: 'evaluate3' }},
        { title: '四星（数量）',   dataIndex: 'evaluate4', key: 'evaluate4',scopedSlots: { customRender: 'evaluate4' }},
        { title: '五星（数量）',  dataIndex: 'evaluate5', key: 'evaluate5',scopedSlots: { customRender: 'evaluate5' }},
    ];
    const data = [];
    export default {
        name: 'workOrderEvaluate',
        filters: {

        },
        components:{
            worksOrderEvaluateList,
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
              pagination: { pageSize: 10, total:10 ,current:1},
              search: { xname: '',xphone:'',page: 1 },
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
              search_data:'',
              confirmLoading:false,
            };
        },
        activated () {
          this.getList()
        },
        methods: {
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getWorkOrderEvaluateList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                    })
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                  this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList()
                }
            },

         bindOk() {
           this.getList()
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
              console.log('searchList')
              this.table_change(val)
            },
            // 进行重置
            resetList() {
                this.search = { xname: '',xphone:'',page: 1 };
                this.getList()
            }

        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
      border: 1px solid #e4dfdf;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
</style>