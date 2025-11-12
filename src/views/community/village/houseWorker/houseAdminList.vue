<template>
    <a-drawer title="老版管理员数据" :width="1400" :visible="visible" :maskClosable="false"
              @close="handleCancel" placement="right">
              <p><a  style="margin-left: 50px;" class="ant-btn ant-btn-primary" :href="src_href" target="_blank">Excel导出</a></p>
    <div class="message-suggestions-list-box" style="margin-top: 5px;">
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
                :row-key="record => record.id"
        >
            <span slot="action" slot-scope="text, record,index">
              <a  @click="editAccount(record)">编辑</a>
              <a-divider type="vertical"/>
              <a  @click="synFrameWork(record)">同步数据</a>
            </span>
        </a-table>
        <a-modal :width="800" title="编辑" :visible="visible_edit" :maskClosable=false :confirm-loading="confirmLoading" @cancel="handle2Cancel" @ok="handleSubmit">
                <a-card>
                  <a-form :form="form">
                    <a-form-item label="登录账号" :labelCol="labelCol" :required="true">
                      <a-col :span="18">
                        <a-input
                          style="width: 300px"
                          placeholder="请输入登录账号"
                          autocomplete="off"
                          name="account"
                          v-model="post.account"   :disabled="accountAisabled"/>
                          <!--<p style="color: #DA2626;">请输入英文大小写字母、数字、下划线，至少3位以上作为登录账号</p>-->
                      </a-col>
                    </a-form-item>
                    <a-form-item label="登录密码" :labelCol="labelCol" :required="true">
                      <a-col :span="18">
                        <a-input-password 
                          style="width: 300px"
                          :placeholder="editRecord.set_pwd == 1 ? ' 如果不需修改密码则不填写' :'请填写登录密码' "
                          name="password"
                          autocomplete="new-password"
                          v-model="post.pwd" />
                        <!-- <p style="color: #DA2626;">请输入英文大小写字母、数字、下划线，至少3位以上作为登录密码</p> -->
                      </a-col>
                      <a-col :span="6">
                      </a-col>
                    </a-form-item>
                    <a-form-item label="姓名" :labelCol="labelCol" :required="true">
                      <a-col :span="18">
                        <a-input
                          style="width: 300px"
                          placeholder="请输入姓名"
                          autocomplete="off"
                          name="realname"
                          v-model="post.realname"  @blur="validateInput"/>
                      </a-col>
                      <a-col :span="6">
                      </a-col>
                    </a-form-item>
                    <a-form-item label="手机号" :labelCol="labelCol" :required="true">
                      <a-col :span="18">
                        <a-input
                          style="width: 300px"
                          placeholder="请输入手机号"
                          autocomplete="off"
                          name="phone"
                          :max-length="11"
                          v-model="post.phone"  @blur="validateInput"/>
                      </a-col>
                      <a-col :span="6">
                      </a-col>
                    </a-form-item>
                    <a-form-item label="备注信息" :labelCol="labelCol" >
                      <a-col :span="20">
                        <a-textarea
                          ref="textareax"
                          autocomplete="off"
                          :rows="8"
                          style="width: 300px"
                          placeholder="请输入备注信息"
                          name="remarks"
                          v-model="post.remarks"/>
                      </a-col>
                      <a-col :span="6">
                      </a-col>
                    </a-form-item>
                  </a-form>
                </a-card>
        </a-modal>
        
        
        <a-modal title="请选择同步数据到组织架构的部门" :width="600" :visible="visible_tree" :maskClosable="false" :confirmLoading="confirmxLoading"
                 @ok="handleTSubmit" @cancel="handleTCancel">
          <a-tree v-if="visible_tree"
            :defaultExpandedKeys="[firstKey]"
            :tree-data="treeData"
            :default-selected-keys="[]"
            :auto-expand-parent="true"
            :default-expand-parent="true"
            @select="onTreeSelect"
          >
          </a-tree>
        </a-modal>
        
    </div>
    </a-drawer>
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    
    const columns = [
        { title: '编号',  dataIndex: 'id', key: 'id'},
        { title: '登录账号', dataIndex: 'account', key: 'account' },
        { title: '姓名', dataIndex: 'realname', key: 'realname'},
        {title: '手机号', dataIndex: 'phone', key: 'phone' },
        { title: '备注',  dataIndex: 'remarks', key: 'remarks' },
        { title: '权限分组',  dataIndex: 'group_name', key: 'group_name'},
        { title: '操作',  dataIndex: '', key: '',width:150, scopedSlots: { customRender: 'action' }},
    ];
    
    const data = [];
    export default {
        name: 'houseAdminList',
        filters: {

        },
        components:{
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                  xs: {
                    span: 10
                  },
                  sm: {
                    span:3
                  }
                },
              pagination: { pageSize: 10, total:10 ,current:1},
              search: { keyword: '',key_val:'name',key_val1:'paytime',page: 1 },
              form: this.$form.createForm(this),
                visible: false,
                visible_edit: false,
                loading: false,
                data,
                columns,
              key_name:'',
                page: 1,
              search_data:'',
              confirmLoading:false,
              confirmxLoading:false,
              accountAisabled:true,
              is_edit_worker:true,
              editRecord:{},
              src_href:'/shequ.php?g=House&c=Role&a=role_export',
              post:{
                  account:'',
                  pwd:'',
                  realname:'',
                  phone:'',
                  remarks:'',
              },
              group_id:0,
              visible_tree:false,
              treeData:[],
              firstKey: '',
              department_id:0,
              selectTitle:'',
              recordV:[]
            };
        },
        activated () {
          
        },
        methods: {
            adminList(){
                this.visible=true;
                this.getList()
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getAdminRoleList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                    })
            },
            synFrameWork(recordV){
                this.recordV=recordV;
                this.getOrganizationTree()
            },
            getOrganizationTree() {
              this.request(villageApi.getOrganizationTree)
                .then((res) => {
                  this.treeData = res.menu_list
                  console.log('resTree', this.treeData)
                  if(res.menu_list[0].key){
                      this.firstKey = res.menu_list[0].key
                      res.menu_list[0].disabled=true
                      console.log('firstKey', this.firstKey)
                  }
                  this.visible_tree = true
                })
            },
            onTreeSelect(selectedKeys,einfo){
                let new_arr = selectedKeys[0].split('-');
                this.department_id = new_arr[new_arr.length - 1];
                this.department_id=this.department_id*1;
                this.selectTitle = new_arr[new_arr.length - 2];
            },
            handleTSubmit(){
                if(this.department_id<1){
                    this.$message.error('请选择一个组织架构部门！');
                    return false;
                }
                let _this=this;
                let contentTmp='您确定将账号为【'+this.recordV.account+'】姓名为【'+this.recordV.realname+'】 的数据同步到组织架构的【'+this.selectTitle+'】部门下？';
                let postArr={admin_id:this.recordV.id,account:this.recordV.account};
                postArr.department_id=this.department_id;
                this.$confirm({
                  title: '同步数据确认',
                  content: contentTmp,
                  onOk() {
                      _this.confirmxLoading=true;
                      _this.request(villageApi.synAdminToWorker,postArr)
                        .then((res) => {
                          _this.$message.success('操作成功')
                          setTimeout(() => {
                              _this.confirmxLoading=false;
                            _this.visible_tree = false;
                            _this.getList()
                          }, 1500)
                        }).catch(err => {
                           _this.confirmxLoading=false;
                        })
                  },
                  onCancel() {},
                });
            },
            handleTCancel(){
                this.department_id=0;
                this.recordV=[];
                this.visible_tree = false;
                
            },
            handleSubmit() {
                    if(!this.post.account || this.post.account.length<1){
                        this.$message.error('请输入登录账号!');
                        return false;
                    }
                    if(this.is_set_pwd==0 && (!this.post.pwd || this.post.account.pwd<1)){
                        this.$message.error('请输入登录密码!');
                        return false;
                    }
                    if(!this.post.phone || this.post.phone.length<1){
                        this.$message.error('请输入手机号!');
                        return false;
                    }
                    let phoneReg =/^1[23456789]\d{9}$/
                    if(!phoneReg.test(this.post.phone)){
                        this.$message.error('手机号格式不正确！');
                         return false;
                    }
                    if(!this.post.realname || this.post.realname.length<1){
                        this.$message.error('请输入姓名!');
                        return false;
                    }
                    this.post.id=this.editRecord.id;
                    this.loading = true;
                    this.request(villageApi.saveHouseAdminEdit,this.post)
                        .then((res) => {
                            this.loading = false
                           if(res.is_haved_account && res.is_haved_account==1){
                               this.accountAisabled=false;
                               this.$message.error('此账号【'+this.post.account+'】已经存在了，请修改！');
                           }else if(res.is_haved_phone && res.is_haved_phone==1){
                               this.$message.error('此手机号【'+this.post.phone+'】已经存在了，请修改！');
                           }else{
                               this.$message.success('保存成功!');
                               setTimeout(() => {
                                 this.form = this.$form.createForm(this)
                                 this.visible_edit = false;
                                 this.is_edit_worker=false;
                                 this.editRecord={};
                                 this.post={
                                     account:'',
                                     pwd:'',
                                     realname:'',
                                     phone:'',
                                     remarks:'',
                                 };
                                 this.group_id=0;
                                 this.getList();
                               }, 1500)
                           }
                        }).catch(error => {
                            this.loading = false
                        })
                    
            },
            validateInput(e){
                let xv=e.target.value;
                let t_name=e.target.name;
                 console.log('name', t_name);
                 console.log('value', xv);
                  xv=xv.trim();
                if(!this.is_edit_worker){
                      return false;
                }
                if(t_name=='account'){
                        if(!xv || xv.length<1){
                            //this.$message.error('请输入登录账号!');
                            e.target.focus();
                            return false;
                        }
                        let accountReg = /^[A-Za-z0-9_]+$/
                        if(!this.accountAisabled && !accountReg.test(xv)){
                            this.$message.error('登录账号必须是英文大小写字母、数字、下划线组成');
                            e.target.focus();
                             return false;
                        }
                        if(!this.accountAisabled && xv.length<3){
                            this.$message.error('请保持登录账号长度至少3位以上!');
                            e.target.focus();
                             return false;
                        }
                     if(!this.accountAisabled && xv.length>90){
                         this.$message.error('登录账号长度太长了，请小于90个字符！');
                         e.target.focus();
                         return false;
                     }
                     this.post.account=xv;
                }else if(t_name=='password'){
                    if(this.is_set_pwd==0 && (!xv || xv.length<1)){
                           //this.$message.error('请输入登录密码!');
                           e.target.focus();
                           return false;
                       }
                       let accountReg = /^[A-Za-z0-9_]+$/
                       if(this.is_set_pwd==0 && !accountReg.test(xv)){
                           this.$message.error('登录密码必须是英文大小写字母、数字、下划线组成');
                           e.target.focus();
                            return false;
                       }
                       if(this.is_set_pwd==0 && xv.length<3){
                           this.$message.error('请保持登录密码长度至少3位以上!');
                           e.target.focus();
                            return false;
                       }
                    if(this.is_set_pwd==0 && xv.length>32){
                        this.$message.error('登录密码长度太长了，请小于32个字符！');
                        e.target.focus();
                         return false;
                    }
                    if(xv){
                        this.post.pwd=xv;
                    }else{
                        this.post.pwd='';
                    }
                }else if(t_name=='realname'){
                    if(!xv || xv.length<1){
                        //this.$message.error('请输入姓名!');
                        e.target.focus();
                        return false;
                    }
                    if(xv.length>10){
                        this.$message.error('您输入的姓名长度太长了，请小于10个字符！');
                        e.target.focus();
                         return false;
                    }
                    this.post.realname=xv;
                }else if(t_name=='phone'){
                    if(!xv || xv.length<1){
                        //this.$message.error('请输入手机号!');
                        e.target.focus();
                        return false;
                    }
                    let phoneReg =/^1[23456789]\d{9}$/
                    if(!phoneReg.test(xv)){
                        this.$message.error('请输入正确的手机号格式！');
                        e.target.focus();
                         return false;
                    }
                    this.post.phone=xv;
                }
            },
          keyChange(val){

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
            handleCancel() {
              this.visible = false;
            },
         handle2Cancel(){
             this.visible_edit = false;
             this.is_edit_worker=false;
             this.editRecord={};
             this.post={
                 account:'',
                 pwd:'',
                 realname:'',
                 phone:'',
                 remarks:'',
             };
             this.group_id=0;
         },
         editAccount(record){
            this.visible_edit = true;
            this.editRecord=record;
            this.post.account=record.account;
            this.post.realname=record.realname;
            this.post.phone=record.phone;
            this.is_set_pwd=record.set_pwd*1;
            this.post.remarks=record.remarks ? record.remarks:'';
            this.group_id=record.group_id*1;
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