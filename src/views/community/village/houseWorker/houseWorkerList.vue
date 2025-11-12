<template>
    <div class="message-suggestions-list-box">
        <div class="search-box" >
          <a-row :gutter="48" style="margin-bottom: 12px">

                <label style="margin-top: 5px;margin-left: 35px;">姓名：</label> <a-input style="width: 180px;" placeholder="请输入姓名" v-model="search.xname"/>
                <label style="margin-top: 5px;margin-left: 15px;">手机号：</label> <a-input style="width: 180px;margin-right: 15px;" placeholder="请输入手机号" v-model="search.phone"/>
           
              <a-button type="primary" icon="search" @click="searchList()">
                查询
              </a-button>

              <a-tooltip placement="top">
                  <template slot="title">
                      <span>按照楼宇系统小区模式需要的数据格式把所有工作人员进行导出</span>
                  </template>
                  <a-button style="margin-left: 10px;" type="primary" icon="download" @click="exportRoomDataForLouYu" :loading="loading" >导出楼宇工作人员格式数据</a-button>
              </a-tooltip>

		</a-row>
        </div>
        
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
                :row-key="record => record.wid"
        >
<!--            <span slot="id_card" slot-scope="id_card,record,index">-->
<!--              <p style="margin-bottom: 2px;"><span>身份证号：</span> {{record.id_card ? record.id_card :'暂无'}}</p>-->
<!--              <p style="margin-bottom: 2px;"><span>IC卡号：</span> {{record.ic_card ? record.ic_card :'暂无'}}</p>-->
<!--            </span>-->
            <span slot="status" slot-scope="status,record,index">
              <a-tag v-if="status*1==1" color="green"> 正常 </a-tag>
              <a-tag v-else-if="status*1==4" color="red"> 已禁用 </a-tag>
              <a-tag v-else-if="status*1==0 && !record.openid" color="pink"> 暂未绑定微信号 </a-tag>
              <a-tag v-else> 关闭 </a-tag>
            </span>
            <span slot="open_door" slot-scope="open_door,record,index">
              <span v-if="open_door*1 > 0" style="color:green"> 可以 </span>
              <a-tag v-else> 不可以 </a-tag>
            </span>
            <span slot="action" slot-scope="text, record,index">
              <a v-if="record.openid && record.openid.length>5 && role_bindwx>0" @click="cancelBindOpenid(record)" style="color:#f0ad4e">解绑微信</a>
              <a-divider type="vertical" v-if="record.status*1!=4 && role_disable>0" />
              <a  v-if="record.status*1!=4 && role_disable>0" @click="disableAccount(record)">禁用账号</a>
              <a-divider type="vertical"  v-if="record.status*1!=4" /> 
              <a  v-if="record.status*1!=4" @click="$refs.houseWorkerEdit.editAccount(record)">查看/编辑</a>
              <a-divider type="vertical" v-if="role_disable>0" /> 
              
              <a-popconfirm  v-if="role_del" class="ant-dropdown-link" title=" 确认删除 ? " ok-text=" 是 " cancel-text=" 否 "
                  @confirm="deleteConfirm(record)" >
                  <a href="#">删除</a>
              </a-popconfirm>

            </span>
        </a-table>
        
        <a-modal :width="500" title="扫描二维码绑定微信号" :visible="visible_img" :maskClosable=false :confirm-loading="confirmLoading" @ok="handleImgCancel" @cancel="handleImgCancel">
          <div class="modal_box">
            <div class="flex_text_box margin_top_10">
                  <img :src="srcUrl" v-if="srcUrl">
                  <p  v-if="img_errmsg">{{img_errmsg}}</p>
             </div>
          </div>
        </a-modal>
        <house-worker-order ref="houseWorkerOrder" />
        <house-worker-edit ref="houseWorkerEdit" @ok="bindOk" />
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import commonApi from '@/api/community/common'
    import { Collapse } from 'ant-design-vue';
    import houseWorkerOrder from "@/views/community/village/houseWorker/houseWorkerOrder";
    import houseWorkerEdit from "@/views/community/village/houseWorker/houseWorkerEdit";
    import Vue from "vue";
    import {ref} from "@vue/composition-api";
    const columns = [
        { title: '姓名',  dataIndex: 'name', key: 'name'},
        { title: '电话', dataIndex: 'list_phone', key: 'list_phone' },
        { title: '账号', dataIndex: 'account', key: 'account'},
        // {title: '个人证件信息', dataIndex: 'id_card', key: 'id_card', scopedSlots: { customRender: 'id_card' } },
        // { title: '入职时间',  dataIndex: 'create_time_str', key: 'create_time_str'},
        { title: '职务类型',  dataIndex: 'type_name', key: 'type_name'},
        { title: '状态',   dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }},
        // { title: '处理次数', width:70,  dataIndex: 'num', key: 'num'},
        // { title: '被评论数', width:70,  dataIndex: 'reply_count', key: 'reply_count'},
        // { title: '评分', width:70,  dataIndex: 'score_mean', key: 'score_mean'},
        { title: '可否开门',   dataIndex: 'open_door', key: 'open_door' , scopedSlots: { customRender: 'open_door' }},
        { title: '操作人',  dataIndex: 'wid', key: 'wid',  scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'houseWorkerList',
        filters: {

        },
        components:{
            houseWorkerOrder,
            houseWorkerEdit,
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
              pagination: { pageSize: 10, total:10 ,current:1},
              search: { xname: '',phone:'',page: 1 },
              //form: this.$form.createForm(this),
                visible: false,
                visible_img: false,
                loading: false,
                data,
                columns,
              key_name:'',
                page: 1,
              search_data:'',
              srcUrl:'',
              img_errmsg:'',
              confirmLoading:false,
              role_bindwx:0,
              role_disable:0,
              role_del:0,
            };
        },
        activated () {
          this.getList()
        },
        methods: {
            // 获取列表信息
             exportRoomDataForLouYu(){
               this.loading = true
                 this.request('/community/village_api.HouseWorker/exportAllWorkers', {}).then(res => {
                    var downloadPath = res.url
                    var downloadLink = document.createElement('a')
                    downloadLink.style.display = 'none' // 使其隐藏
                    downloadLink.href = downloadPath
                    downloadLink.download = ''
                    downloadLink.click()
                    downloadLink.remove()
                    this.loading = false
                }).catch((error)=>{
                    this.loading = false
                })
            },
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getWorkerList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.role_bindwx = res.role_bindwx
                        this.role_disable = res.role_disable
                        this.role_del= res.role_del
                        this.loading = false
                    })
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

         handleImgCancel(){
             this.visible_img = false;
             this.srcUrl = '';
             this.getList()
         },
         getRecognition(record){
             let qrcode_id=record.wid+3900000000;
             this.request(villageApi.getRecognition,{qrcode_id:qrcode_id})
                 .then((res) => {
                     this.visible_img=true;
                     if(res.ticket){
                         this.srcUrl = res.ticket;
                         this.img_errmsg='';
                     }else{
                        this.srcUrl = '';
                        this.img_errmsg=res.msg; 
                     }
                 })
         },
         bindOk() {
           this.getList()
         },
         disableAccount(record){
             let wid=record.wid;
             var _this=this;
             this.$confirm({
               title: '禁用确认',
               content: '确认禁用该工作人员？会清除该工作人员的所有信息和绑定的微信，但会保留账号方便以后调用任务查看，删除不可恢复。请慎重使用。',
               onOk() {
                   _this.request(villageApi.disableWorkerAccount,{wid:wid})
                     .then((res) => {
                         console.log('res', res)
                       _this.$message.success('操作成功')
                       _this.getList()
                     })
               },
               onCancel() {},
             });
         },
         cancelBindOpenid(record){
             let wid=record.wid;
             var _this=this;
             let tipscontent='您确定要取消该工作人员的微信绑定关系吗？'
             if(record.hw_id!=undefined && record.hw_id*1>0){
                 tipscontent='您确定要取消该工作人员的微信绑定关系吗？取消后也会同步取消关联小区账号的绑定。'
             }
             this.$confirm({
               title: '取消微信绑定确认',
               content: tipscontent,
               onOk() {
                   _this.request(villageApi.cancelWorkerAccount,{wid:wid})
                     .then((res) => {
                         console.log('res', res)
                       _this.$message.success('操作成功')
                       _this.getList()
                     })
               },
               onCancel() {},
             });
         },
         //删除工作人员
         deleteConfirm(record) {
             this.loading = true;
             this.request(commonApi.workerDel, {
                 wid: [record.wid],
                 group_id: record.group_id,
                 department_id:record.department_id,
                 tokenName:'village_access_token'
             }).then(res=>{
                 this.loading = false;
                 if(res.error){
                     this.$message.success(res.msg)
                     this.getList()
                 } else{
                     this.$message.error(res.msg)
                 }
             }).catch((error)=>{
                this.loading = false;
            })
         },
          // 日期切换，重新赋值
          dateOnChange(date, dateString) {
            this.search.date = dateString;
            console.log('search', this.search);
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