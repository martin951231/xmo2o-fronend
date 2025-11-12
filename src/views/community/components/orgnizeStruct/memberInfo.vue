<template>
    <div class="modal_container">
        <a-modal :title="title" :width="1000" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
            @ok="handleSubmit" @cancel="handleCancel">
            <a-spin :spinning="confirmLoading" :height="800">
                 <a-alert v-if="hw_id>0" message="此数据来源于物业后台【人员管理】数据，基本信息统一由物业后修改，因此这里一些基本信息不可修改" type="info" show-icon  style="margin-bottom: 10px;" />
                <a-form-model ref="ruleForm" :model="detail" class="div_box" :labelCol="labelCol"
                    :wrapperCol="wrapperCol" :rules="rules">
                    <a-form-model-item label="编号" prop="job_number">
                        <a-input :disabled="is_edit" placeholder="请输入工号" v-model="detail.job_number" />
                    </a-form-model-item>
                    <a-form-model-item label="姓名" prop="work_name">
                        <a-input :disabled="is_edit" placeholder="请输入姓名" v-model="detail.work_name" />
                    </a-form-model-item>
                    <a-form-model-item label="性别" prop="gender">
                        <a-radio-group v-model="detail.gender"  :disabled="is_edit">
                            <a-radio :value="1">男</a-radio>
                            <a-radio :value="2">女</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="手机号码" prop="phone" extra="此手机号需与注册的手机号一致,才能开门成功">
                        <a-input :disabled="is_edit" placeholder="请输入手机号码" v-model="detail.phone" @change="phoneBlur" />
                    </a-form-model-item>
                    
                    <a-form-model-item label="部门名称"  extra="选择部门名称">
                        <a-input :disabled="true" placeholder="选择部门名称请选择!" v-model="detail.depart_name" style="width: 210px;margin-right: 10px;"/>
                        <a-button v-if="!is_add" type="primary" @click="selectDepartment">选择部门</a-button>
                    </a-form-model-item>
                    <a-form-model-item label="IC卡" prop="ic_card" extra="填写后该用户可通过IC卡进入门禁">
                        <a-input  placeholder="请输入IC卡" v-model="detail.ic_card"
                            style="width: 220px;margin-right: 10px" />
                            <a  v-if="role_type==2 && is_write_iccard==1" @click="rfid_get_card_func" >读取卡号</a>
                    </a-form-model-item>

                    <a-form-model-item label="身份证号"  extra="填写后该用户可通过身份证进入门禁">
                        <a-input :disabled="is_edit" placeholder="请输入身份证号" v-model="detail.id_card" />
                    </a-form-model-item>
                    <a-form-model-item v-if="$store.getters.config && role_type==2" :label="$store.getters.config.house_name+'管理人员身份'" prop="is_worker_admin" :extra="'选择“否”时，有'+$store.getters.config.house_name+'工作人员身份可登录；选择“是”时，有'+$store.getters.config.house_name+'工作人员和'+$store.getters.config.house_name+'管理人员身份可登录'">
                        <a-radio-group v-model="detail.is_worker_admin" style="margin-left: 10px;" :disabled="worker_admin_dis">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="0">否</a-radio>
                        </a-radio-group>
                    </a-form-model-item>

                    <a-form-model-item label="是否可以开门" prop="open_door">
                        <a-radio-group v-model="detail.open_door">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="0">否</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item v-if="role_type==2 && have_sentry_watch>0" label="可以管理岗亭" prop="is_sentry" extra="开启了，员工登录系统后台可以进行岗亭页面的操作管理，开启岗亭管理必须开启小区管理人员身份">
                        <a-radio-group v-model="detail.is_sentry" style="margin-left: 10px;" @change="onSentryChange">
                            <a-radio :value="1">开启</a-radio>
                            <a-radio :value="0">关闭</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="入职时间" prop="job_create_time">
                        <a-date-picker v-if="detail.job_create_time" :disabled="is_edit" placeholder="请选择入职时间"
                            @change="onChange" :value="moment(detail.job_create_time, dateFormat)" :format="dateFormat">
                        </a-date-picker>
                        <a-date-picker v-else :disabled="is_edit" placeholder="请选择入职时间" @change="onChange">
                        </a-date-picker>
                    </a-form-model-item>
                    <a-form-model-item label="账号" prop="account">
                        <a-input @change="accountFoucs" :disabled="is_edit" placeholder="请输入登录账号"
                            v-model="detail.account" />
                    </a-form-model-item>

                    <a-form-model-item label="密码" prop="password" extra="如果不填写密码或为空，则默认密码 123abc"
                        v-if="title == '人员添加'">
                        <a-input :disabled="is_edit" placeholder="请输入登录密码" v-model="detail.password" />
                    </a-form-model-item>

                    <a-form-model-item label="密码" prop="password" extra="如果不填写密码或为空，则密码不做修改" v-else>
                        <a-input :disabled="is_edit" placeholder="请输入登录密码" v-model="detail.password" />
                    </a-form-model-item>

                    <a-form-model-item label="备注" prop="remarks">
                        <a-input  placeholder="请输入内容" v-model="detail.remarks" />
                    </a-form-model-item>

                    <a-form-model-item v-if="title != '人员添加'" label="是否同步企微">
                        <a-input :disabled="true" v-model="detail.qy_txt" />
                    </a-form-model-item>

                    <a-form-model-item v-if="title != '人员添加'" label="企微同步时间">
                        <a-input :disabled="true" v-model="detail.qy_time" />
                    </a-form-model-item>

                    <a-form-model-item v-if="title != '人员添加'" label="企微用户账号" prop="qy_id" extra="对应授权企微中【通讯录】中对应用户【帐号】">
                        <a-input :disabled="!editTrue" v-model="detail.qy_id" style="width: 183px;"/>
                        <span class="icon-wrap" style="margin-left: 10px;" v-if="detail.editQy && !editTrue">
                            <a @click="allowEidt(detail.editQy)"><a-icon type="form"/></a>
                        </span>
                    </a-form-model-item>

                    <a-form-model-item label="上传人脸" v-if="uploadFace.status*1 == 1">
                        <a-button type="primary" @click="uploadPeopleface">上传人脸</a-button>
                    </a-form-model-item>

                    <a-form-model-item label="施工方人员" prop="is_constructor" v-if="jz_open">
                        <a-select v-model="detail.is_constructor" show-search placeholder="请选择是否为施工方人员" style="width: 245px"
                            :options="selects" :filter-option="filterOption">
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </a-spin>
        </a-modal>

        <a-modal :title="title" :width="800" :visible="lookVisiable" :maskClosable="false" @cancel="handleLookCancel"
            :footer="null">
            <div class="look_content">
                <div class="look_item" v-for="(item, index) in propsList" :key="index">
                    <div class="item_title">{{item.name}}:</div>
                    <div v-if="item.type == 1 && item.value">
                        <a-tag v-for="(tags, index) in item.value" :key="index" color="#FCBE79" style="margin-bottom: 5px"> {{tags}}</a-tag>
                    </div>
                    <div class="item_value" v-else>{{item.value?item.value: '暂无'}}</div>
                </div>
            </div>
        </a-modal>

        <a-modal title="请选择组织架构的部门" :width="600" :visible="visible_tree" :maskClosable="false"
                 @ok="handleTSubmit" @cancel="handleTCancel">
          <a-tree v-if="visible_tree"
            :defaultExpandedKeys="[firstKey]"
            :tree-data="treeData"
            :default-selected-keys="selectedkeys"
            :auto-expand-parent="true"
            :default-expand-parent="true"
            @select="onTreeSelect"
          >
          </a-tree>
        </a-modal>

        <a-drawer title="人脸上传" :width="800" :visible="showUploadface" @close="handleUploadCancel">
            <iframe v-if="showUploadface" :src="uploadFace.url" width="100%" height="800px"></iframe>
        </a-drawer>
        <remote-js src="http://127.0.0.1:8008/YOWOCloudRFIDReader.js" @load-js-finish="jsLoadCallBack"></remote-js>
    </div>
</template>

<script>
    // import "http://127.0.0.1:8008/YOWOCloudRFIDReader.js";
    import commonApi from '@/api/community/common'
    import propertyApi from '@/api/community/property/packages';
    import common from '@/utils/variable'
    import moment from 'moment';
    import {
        getSystemName
    } from '@/utils/util'
    export default {
        data() {
            return {
                title: '新建',
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                lookVisiable: false,
                visible: false,
                is_edit: false,
                confirmLoading: false,
                loading: false,
                detail: {
                    group_id: null,
                    job_number: '',
                    work_name: '',
                    gender: 1,
                    phone: '',
                    id_card: '',
                    ic_card: '',
                    job_create_time: null,
                    open_door: 1,
                    account: '',
                    password: '',
                    remarks: '',
                    is_worker_admin:0,
                    wid:0,
                    depart_name:'',
                    department_id:0,
                    qy_id: '',
                    is_sentry:0,
                },
                department_id:0,
                depart_name:'',
                visible_tree:false,
                dateFormat: 'YYYY-MM-DD',
                is_footer: true,
                is_add:true,
                propsList: [],
                rules: {
                    work_name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    account: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }],

                    phone: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }, {
                        validator: this.phoneConfirm
                    }]
                },
                tokenName: '',
                uploadFace: {},
                showUploadface: false,
                isBianhua: true,
                role_type: 0,
                readCardPopVisiable: false,
                rfidreader:null,
                is_write_iccard:0,
                write_iccard_exe_url:'',
                selectedkeys:[],
                firstKey:'',
                editTrue: false,
		hw_id:0,
                jz_open: 0,
                selects: [
                    {'label': '否', 'value': 0},
                    {'label': '是', 'value': 1},
                ],
                have_sentry_watch:0,
                worker_admin_dis:false,
            }
        },
        components: {
            'remote-js': {
                render(createElement) {
                    var self = this
                    return createElement('script', {
                        attrs: {
                            type: 'text/javascript',
                            src: this.src
                        },
                        on: {
                            load: function() {
                                self.$emit('load-js-finish')
                            }
                        }
                    })
                },
                props: {
                    src: {
                        type: String,
                        required: true
                    }
                }
            }
        },
        mounted() {
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }          
        },
        methods: {
            moment,
            allowEidt(editQy) {
                if (editQy) {
                    let that = this;
                    this.$confirm({
                        title: '是否确认修改,如果相关人员已有企微数据请谨慎修改（可能会导致无法正常使用）?',
                        okType: 'danger',
                        cancelText: '取消',
                        okText: '确定',
                        onOk () {
                            if (that.detail.qy_id == '暂无') {
                                that.detail.qy_id = '';
                            }
                            that.editTrue = true
                        }
                    })
                } else {
                    this.editTrue = false
                }
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            phoneConfirm(rule, value, callback) {
                let reg = /^1[3456789]\d{9}$/
                if (!reg.test(value)) {
                    callback('请输入正确的手机号码')
                } else {
                    callback()
                }
            },
            selectDepartment(){
                this.getOrganizationTree()
            },
            getOrganizationTree() {
              this.request(propertyApi.frameworkTissueNav, {
                    tokenName: this.tokenName,'request_xfrom':'organization_edit'
                })
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
                this.depart_name = new_arr[new_arr.length - 2];
            },
            handleTSubmit(){
                if(this.department_id<1){
                    this.$message.error('请选择一个组织架构部门！');
                    return false;
                }
                this.detail.department_id=this.department_id;
                this.detail.depart_name=this.depart_name;
                this.handleTCancel();
            },
            handleTCancel(){
                this.department_id=0;
                this.depart_name='';
                this.visible_tree = false;
            },
            onChange(date, dateString) {
                this.detail.job_create_time = dateString;
            },
            onSentryChange(ee){
                if(ee.target.value==1 || ee.target.value=="1"){
                    this.detail.is_worker_admin=1;
                    this.worker_admin_dis=true;
                }else{
                    this.worker_admin_dis=false;
                }
            },
            addMember(group_id, selectTitle, role_type,is_write_iccard,write_iccard_exe_url) {
                this.write_iccard_exe_url=write_iccard_exe_url;
                if(is_write_iccard==1){
                    this.rfid_get_card_check();
                }
                this.getFrameworkConfig(group_id);
                this.role_type = role_type;
                this.detail.group_id = group_id
                this.is_edit = false
                this.is_write_iccard=is_write_iccard;
                this.is_add=true;
                this.visible_tree=false
                this.detail.department_id=group_id;
                this.detail.depart_name=selectTitle;
                // this.title = '【'+selectTitle+'】'+'添加'
                this.title = '人员添加'
                this.visible = true
		this.hw_id=0;
            },
            getFrameworkConfig(group_id) {
              this.request(propertyApi.getFrameworkConfig, {
                    tokenName: this.tokenName, 'group_id': group_id,
                })
                .then((res) => {
                    this.jz_open = res.jz_open
                    this.have_sentry_watch= res.have_sentry_watch*1;
                    if (res.selects) {
                        this.selects = res.selects
                    }
                })
            },
            phoneBlur() {
                if (this.title == '人员添加' && this.isBianhua) {
                    this.detail.account = this.detail.phone
                }
            },
            handleSubmit() {
                this.confirmLoading = true
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.detail.tokenName = this.tokenName
                        if (this.detail.password == '') {
                            this.detail.password = '123abc'
                        }
                        let url = commonApi.workerAdd;
                        if (this.detail.wid * 1 > 0) {
                            url = commonApi.workerSub
                        }
                        this.request(url, this.detail).then((res) => {
                            if (this.detail.wid * 1 > 0) {
                                if (res.error) {
                                    this.$message.success(res.msg)
                                } else {
                                    this.$message.error(res.msg)
                                }
                            } else {
                                if (res.error) {
                                    this.$message.success(res.msg)
                                } else {
                                    this.$message.error(res.msg)
                                }
                            }
                            this.confirmLoading = false;
                            if (res.error) {
                                this.visible = false;
                                this.$emit('ok', this.detail);
                                this.clearForm();
                                this.$refs.ruleForm.resetFields();
                            }
                        }).catch((error) => {
                            this.confirmLoading = false
                        })
                    } else {
                        this.confirmLoading = false
                        return false;
                    }
                });
            },
            clearForm() {
                this.detail = {
                    group_id: null,
                    job_number: '',
                    work_name: '',
                    gender: 1,
                    phone: '',
                    id_card: '',
                    ic_card: '',
                    job_create_time: null,
                    open_door: 1,
                    account: '',
                    password: '',
                    remarks: '',
                    is_worker_admin:0,
                    wid:0,
                    depart_name:'',
                    department_id:0,
                    is_sentry:0,
                }
                this.visible_tree=false
                this.uploadFace = {}
                this.isBianhua = true
                this.hw_id=0;
            },

            accountFoucs() {
                if (this.detail.account == '') {
                    this.isBianhua = true
                } else {
                    this.isBianhua = false
                }
            },

            handleCancel() {
                this.visible = false
                this.clearForm()
                this.$refs.ruleForm.resetFields();
            },

            editMember(wid, group_id, source_type, selectTitle, role_type,is_write_iccard,write_iccard_exe_url) {
                this.write_iccard_exe_url=write_iccard_exe_url;
                if(is_write_iccard==1){
                    this.rfid_get_card_check();
                }
                this.getFrameworkConfig(group_id);
                this.role_type = role_type;
                this.is_write_iccard=is_write_iccard;
                this.role_type=role_type;
                this.visible_tree=false
                this.is_add=false;
                this.editTrue=false
                this.hw_id=0;
                this.request(commonApi.workerQuery, {
                    wid: wid,
                    group_id: group_id,
                    source_type: source_type,
                    tokenName: this.tokenName
                }).then((res) => {
                    if (source_type == 1) {
                        this.propsList = res
                        this.detail.group_id = group_id
                        this.is_edit = true
                        if (this.propsList[1] && this.propsList[1].value) {
                            this.title = '【' + this.propsList[1].value + '】' + '查看'
                        } else if (this.propsList[2] && this.propsList[2].value) {
                            this.title = '【' + this.propsList[2].value + '】' + '查看'
                        }
                        this.lookVisiable = true
                    } else {
                        this.worker_admin_dis=false;
                        this.detail = res
                        if (this.detail.account == '' || this.detail.account == null || this.detail.account
                            .length == 0) {
                            this.detail.account = this.detail.phone
                        }
                        if(this.detail.is_sentry==1 || this.detail.is_sentry=='1'){
                            this.worker_admin_dis=true;
                        }
                        this.uploadFace = res.upload_face
                        this.detail.group_id = group_id
                        this.is_edit = false
                        if(res.hw_id!=undefined && res.hw_id*1 >0){
                            this.is_edit=true;
                            this.hw_id=res.hw_id*1;
                        }
                        this.title = '【' + this.detail.work_name + '】' + '编辑'
                        this.visible = true
                    }
                })
            },

            uploadPeopleface() {
                this.showUploadface = true
            },

            handleLookCancel() {
                this.lookVisiable = false
                this.propsList = []
            },

            handleUploadCancel() {
                this.showUploadface = false
            },

            rfid_get_card_func() {
                if(this.rfidreader===null){
                    return false;
                }
                let FormatID = '1'; //1为10进制(10DEC) ，0为16进制(8HEX)
                let OrderID = '0'; //0为正常 ，1为倒序
                this.rfidreader.Repeat = 1;
                this.rfidreader.HaltAfterSuccess = 1;
                this.rfidreader.RequestTypeACardNo(FormatID, OrderID);
            },
            jsLoadCallBack(){
                console.log("引入完成。。。。。")
            },
            rfid_get_card_check(){
               let is_rfidreader_ok=true;
                try
                {
                  console.log('YOWORFIDReader',YOWORFIDReader);
                  var rfidreader=YOWORFIDReader.createNew();
                  this.rfidreader=rfidreader;
                }
                catch(e)
                {
                      alert("您在控制台基本配置中开启了IC卡云读写需要安装软件。软件连接失败，请先下载安装！由于软件需要开机自动启动，安装前请关闭360等安全软件。");
                      if(this.write_iccard_exe_url){
                          window.top.location = this.write_iccard_exe_url; 
                      }
                      is_rfidreader_ok=false;
                }
                if(!rfidreader.TryConnect())
                {
                    is_rfidreader_ok=false;
                      alert("浏览器不支持，请更换浏览器后重试！");
                }
                if(is_rfidreader_ok){
                    var _this=this
                    this.rfidreader.onResult(function(resultdata) {
                           console.log('onResult',resultdata);
                           switch (resultdata.FunctionID) {
                               //IC卡读卡器云服务版本号
                               case 14:
                                   console.log(resultdata.strData);
                                   break;
                               case 0:
                                   if (resultdata && resultdata.Result > 0) {
                                       if(resultdata && resultdata.strData){
                                           _this.detail.ic_card = resultdata.strData
                                       } else{
                                           _this.$message.warn("读取失败！")
                                       }
                                   }
                                   break;
                           }
                       })
                }
            },
        }
    }
</script>
<style>
    .ant-form-item label {
        width: 50px;
    }

    .div_box .ant-form-item {
        display: inline-block !important;
        width: 50% !important;
    }

    .look_content {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }

    .look_item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 36%;
        margin: 5px 20px;
    }

    .item_title {
        font-weight: bold;
    }

    .item_value {
        margin-left: 10px;
    }

    .upload_content {
        width: 100%;
        height: 300px;
    }

    .ant-input-number {
        width: 100%;
    }
</style>
