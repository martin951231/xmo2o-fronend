<template>
    <a-drawer title="任务列表" :width="1400" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" 
              @close="handleCancel" placement="right" :after-visible-change="afterVisibleChange">
                    <div class="search-box">
                        <a-row :gutter="48" style="margin-bottom: 20px;margin-left:2px;">
                          <a-col :md="8" :sm="24"  style="padding-left: 0px;padding-right: 1px;width: 420px">
                            <label style="margin-top: 5px;">时间筛选：</label>
                            <a-range-picker @change="dateOnChange" :allowClear='true'  v-model="search.data" style="width: 325px">
                              <a-icon slot="suffixIcon" type="calendar" />
                            </a-range-picker>
                          </a-col>
                          <a-col :md="8" :sm="24"  style="padding-left: 4px; padding-right: 1px;width: 247px;">
                            <label style="margin-top: 5px;">状态：</label>
                            <a-select placeholder="请选择状态" style="width: 150px"  v-model="search.status">
                              <a-select-option value="0">全部</a-select-option>
                              <a-select-option value="1">未指派</a-select-option>
                              <a-select-option value="2">已指派</a-select-option>
                              <a-select-option value="3">已受理</a-select-option>
                              <a-select-option value="4">已处理</a-select-option>
                              <a-select-option value="5">已评价</a-select-option>
                            </a-select>
                          </a-col>
                            <a-col :md="2" :sm="24"  style="padding-left: 0px;padding-right: 1px;width: 90px;margin-left: 20px">
                                <a-button type="primary" icon="search" @click="searchList()">
                                    查询
                                </a-button>
                            </a-col>
                            <a-col :md="2" :sm="24">
                                <a-button  type="primary" @click="resetList()">重置</a-button>
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
                :row-key="record => record.pigcms_id"
        >
        <span slot="status" slot-scope="status,record,index">
          <a-tag v-if="status*1==0" color="red"> 未指派 </a-tag>
          <a-tag v-else-if="status*1==1" color="green"> 已指派 </a-tag>
          <a-tag v-else-if="status*1==2" color="green"> 已受理 </a-tag>
          <a-tag v-else-if="status*1==3" color="green"> 已处理 </a-tag>
          <a-tag v-else-if="status*1==4" color="green"> 业主已评价 </a-tag>
        </span>
        
        <span slot="action" slot-scope="text, record,index">
           <a  @click="show_details_popup(record)">详情</a>
        </span>
        
        </a-table>
        
        <a-modal :width="1000" title="详情" :visible="visible_details" :maskClosable="false" :confirm-loading="confirmLoading"
          :footer="null" @cancel="handle2Cancel" style="z-index: 1000;">
          <div class="modal_box_1">

               <div class="flex_text_box">
                 <div class="text_1">业主姓名：</div>
                 <div class="text_2">{{repairDetail.name}}</div>
               </div>
               <div class="flex_text_box margin_top_10">
                 <div class="text_1">业主编号：</div>
                 <div class="text_2">{{repairDetail.usernum}}</div>
               </div>
                 <div class="flex_text_box">
                   <div class="text_1">上报时间：</div>
                   <div class="text_2">{{repairDetail.time_str}}</div>
                 </div>
                 <div class="flex_text_box margin_top_10">
                   <div class="text_1">上报地址：</div>
                   <div class="text_2">{{repairDetail.address}}</div>
                 </div>
                 <div class="flex_text_box">
                   <div class="text_1">联系方式：</div>
                   <div class="text_2">{{repairDetail.repair_phone}}</div>
                 </div>
                 <div class="flex_text_box margin_top_10">
                   <div class="text_1">状态：</div>
                   <div class="text_2" v-if="repairDetail.status *1==0" style="color: red;">未指派</div>
                   <div class="text_2" v-else-if="repairDetail.status *1==1" style="color: green;">已指派</div>
                   <div class="text_2" v-else-if="repairDetail.status *1==2" style="color: green;">已受理</div>
                   <div class="text_2" v-else-if="repairDetail.status *1==3" style="color: green;">已处理</div>
                   <div class="text_2" v-else-if="repairDetail.status *1==4" style="color: green;">业主已评价</div>
                 </div>
                 
                 <div class="flex_text_box">
                   <div class="text_1">上报内容：</div>
                   <div class="text_2">{{repairDetail.content}}</div>
                 </div>
                 <div class="flex_text_box margin_top_10">
                   <div class="text_1">上报图例：</div>
                   <div class="text_2" v-if="repairDetail.pic && repairDetail.pic.length>0">
                       <img  v-for="(item1,index1) in repairDetail.pic" :src="item1" style="width: 80px;">
                   </div>
                 </div>
                 
                 <div class="flex_text_box">
                   <div class="text_1" >处理人员：</div>
                   <div class="text_2" style="color: green;" v-if="repairDetail.status>0 && repairDetail.worker.is_have_data>0">{{repairDetail.worker.name}} , {{repairDetail.worker.phone}}</div>
                 </div>
                 <div class="flex_text_box margin_top_10">
                   <div class="text_1">处理时间：</div>
                   <div class="text_2" v-if="repairDetail.status>2 && repairDetail.worker.is_have_data>0 && repairDetail.reply_time>0">{{repairDetail.reply_time_str}}</div>
                 </div>
                 
                 <div class="flex_text_box">
                   <div class="text_1" >处理意见：</div>
                   <div class="text_2" style="color: green;" v-if="repairDetail.status>2">{{repairDetail.reply_content}}</div>
                 </div>
                 <div class="flex_text_box margin_top_10">
                   <div class="text_1">处理图例：</div>
                   <div class="text_2" v-if="repairDetail.reply_pic && repairDetail.reply_pic.length>0">
                       <img  v-for="(item1,index1) in repairDetail.reply_pic" :src="item1" style="width: 80px;">
                   </div>
                 </div>
                 
                 <div class="flex_text_box">
                   <div class="text_1" >评论时间：</div>
                   <div class="text_2" style="color: green;" v-if="repairDetail.status>3">{{repairDetail.comment_time_str}}</div>
                 </div>
                 <div class="flex_text_box margin_top_10">
                   <div class="text_1">评分：</div>
                      <div class="text_2" style="color: green;" v-if="repairDetail.status>3">{{repairDetail.score}}</div>
                 </div>
               <div class="flex_text_box">
                 <div class="text_1" >评论内容：</div>
                 <div class="text_2" style="color: green;" v-if="repairDetail.status>3">{{repairDetail.comment}}</div>
               </div>
               <div class="flex_text_box margin_top_10">
                 <div class="text_1">评论图例：</div>
                   <div class="text_2" v-if="repairDetail.comment_pic && repairDetail.comment_pic.length>0">
                       <img  v-for="(item1,index1) in repairDetail.comment_pic" :src="item1" style="width: 80px;">
                   </div>
               </div>      
          </div>
        </a-modal>
        
    </a-drawer>
    
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import moment from 'moment'
    const columns = [
        { title: '业主编号',  dataIndex: 'usernum', key: 'usernum'},
        { title: '报修人', dataIndex: 'name', key: 'name' },
        { title: '状态', dataIndex: 'status', key: 'status',scopedSlots: { customRender: 'status' }},
        {title: '报修内容', dataIndex: 'content', key: 'content'},
        { title: '报修时间',  dataIndex: 'time_str', key: 'time_str'},
        { title: '报修地址',  dataIndex: 'address', key: 'address'},
        { title: '评分',  dataIndex: 'score', key: 'score'},
        { title: '操作人',  dataIndex: '', key: 'action',width:150, scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'houseWorkerOrder',
        filters: {

        },
        components:{
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
              pagination: { pageSize: 10, total:10 ,current:1},
              search: { keyword: '', page: 1,date:'',status:'0',begin_time:'',end_time:''},
              form: this.$form.createForm(this),
                visible: false,
                visible_details: false,
                loading: false,
                data,
                columns,
               key_name:'',
                page: 1,
              search_data:'',
              confirmLoading:false,
              wid:0,
              repairDetail:{},
              dateFormat: 'YYYY-MM-DD HH:mm:ss',
            };
        },
        activated () {

        },
        methods: {
            moment,
            infoV(record){
                this.visible = true;
                this.wid=record.wid;
                this.getList();
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.search['wid']=this.wid;
                this.request(villageApi.getWorkerOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                    })
            },
            show_details_popup(record){
                this.visible_details= true;
                this.request(villageApi.getRepairInfo,{wid:record.wid,bind_id:record.bind_id,repair_id:record.repair_id})
                    .then((res) => {
                        this.repairDetail = res;
                    })
            },
            handleCancel() {
              this.visible = false;
              this.search.begin_time='';
              this.search.end_time='';
              this.search.status='0';
              this.search.date=[];
              this.search.data=[];
              setTimeout(() => {
                this.form = this.$form.createForm(this)
              }, 500)
            },
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return '';
                }
                return moment(time, dateFormat)
            },
            handle2Cancel(){
                this.visible_details= false;
                this.repairDetail= {};
            },
            afterVisibleChange(val) {
              console.log('visible', val);
            },
          keyChange(val){
            if (val=='name'){
              this.key_name='请输入姓名'
            }
            if (val=='phone'){
              this.key_name='请输入电话'
            }
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
          // 日期切换，重新赋值
          dateOnChange(date, dateString) {
            this.search.date = dateString;
            this.search.begin_time=dateString['0'];
            this.search.end_time=dateString['1'];
          },
            // 进行搜索
            searchList() {
              this.page=1;
              let val = {
                current: 1,
                pageSize: 10,
                total: 10
              }
              this.table_change(val)
               // this.getList()
            },
            // 进行重置
            resetList() {
                this.search = {  keyword: '', page: 1 };
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
    .modal_box_1 {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
    
      .flex_text_box {
        width: 50%;
      }
    }
    // 公共样式
    .margin_top_10 {
      margin-top: 10px;
    }
    .flex_text_box {
        display: flex;
        flex-direction: row;
        align-items: center;
    
        .text_1 {
            flex-shrink: 0;
        }
    }
</style>