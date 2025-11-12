<template>
    <div class="message-suggestions-list-box">
        <div class="search-box">
            <div class="message-tips-box">
                <a-collapse accordion>
                    <a-collapse-panel key="1" header="操作说明">

                        <p>
                            在收费项目管理模块，需根据物业后台添加的收费科目创建所需的收费项目，并且根据收费项目创建不同的收费标准，收费标准支持多种收费模式设置，每个收费标准可单独或批量绑定到{{$store.getters.config.room_name}}/车位。<br>
                            1、在收费项目管理模块，创建收费项目时没有收费科目选项。需要到【物业平台】去创建收费科目。<br>
                            2、在创建好收费项目，进入【收费标准管理】页面创建收费标准。<br>
                            3、在创建收费标准时，进入【预缴周期管理】页面创建预缴周期。<br>
                            4、在创建好的收费标准，进入【绑定费用对象】页面绑定{{$store.getters.config.room_name}}/车位信息，每个收费标准可单独或批量绑定到{{$store.getters.config.room_name}}/车位。<br>
                            5、删除收费标准时，会将该收费标准对应已绑定的{{$store.getters.config.room_name}}和车场解除绑定，以及对应的未缴费账单会变更为作废账单。<br><br>
                            例：当前有收费标准名称为【水费】和【电费】两个收费标准，当删除收费标准名称为【水费】的收费标准时，仅作废【水费】对应的未缴费账单，【电费】对应的未缴费账单不会被作废<br>
                            再比如水费有高层和底层区别，在创建高层水费和底层水费标准的时候，在不同的收费项目下创建收费标准，
                            在创建的收费标准来绑定楼层、{{$store.getters.config.room_name}}。比如建议一个高层水费和底层水费项目
                        </p>
                    </a-collapse-panel>
                </a-collapse>
            </div>
            <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">项目名称：</p>
                        <a-input style="width: 70%" v-model="search.keyword"/>
                    </a-input-group>
                </a-col>
                <a-col :md="2" :sm="24">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="2" :sm="24">
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>
                <a-button type="primary" class="lbsf" @click="jumpTo()" v-if="oldVersion">
                    老版收费管理
                </a-button>
            </a-row>

        </div>
        <div class="add-box">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24" v-if="role_additem==1">
                    <a-button type="primary" @click="$refs.PopupAddModel.add()">
                        添加
                    </a-button>
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
        >
            <span slot="status" slot-scope="text, record">
                <div v-if="record.status == 2" style="color: red;">关闭</div>
                <div v-if="record.status == 1" style="color: #1890ff;">开启</div>
            </span>
            <span slot="standard" slot-scope="text, record">
               <a @click="changeVisible(record.id,1,record.subject, record.charge_type)" v-if="role_manageitem==1">管理</a>
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="pointer cr-primary" @click="checkQrcode(record.qrcode)" v-if="record.charge_type=='qrcode'">收费二维码</span><span v-if="record.charge_type=='qrcode'"> | </span>
                <a  @click="$refs.PopupEditModel.edit(record.id)" v-if="role_edititem==1">编辑</a><span  v-if="role_edititem==1 && role_delitem==1"> | </span>

              <a-popconfirm
                class="ant-dropdown-link"
                title="确认删除该收费项目?"
                ok-text="确认删除"
                cancel-text="取消"
                @confirm="deleteConfirm(record.id)"
                @cancel="cancel"
                v-if="role_delitem==1"
                >
               <a href="#">删除</a>
            </a-popconfirm>

            </span>
        </a-table>
        <a-drawer
            :title="drawerTitle"
            width="85%"
            :visible="visible"
            :body-style="{ paddingBottom: '80px' }"
            @close="onClose"
        >
            <ruleList v-if="visible" ref="ruleModel" @ok="ruleList"/>
        </a-drawer>
        <a-modal v-model="qrcodeVisible" title="收费二维码" centered :footer="null">
            <img class="qrcode-img" :src="qrcodeImg" />
        </a-modal>
        <projectInfo ref="PopupAddModel" @ok="addActive"/>
        <projectInfo ref="PopupEditModel" @ok="editActive"/>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import projectInfo from './projectInfo';
    import ruleList from './ruleList';
    import { Collapse } from 'ant-design-vue';

    const columns = [
        { title: '项目ID',  dataIndex: 'id', key: 'id'},
        { title: '收费项目名称',  dataIndex: 'name', key: 'name'},
        { title: '所属收费科目', dataIndex: 'subject', key: 'subject' },
        { title: '收费模式', dataIndex: 'type_txt', key: 'type_txt' },
        { title: '收费标准管理', dataIndex: 'start_end_time_txt', key: 'start_end_time_txt', scopedSlots: { customRender: 'standard' },},
        {title: '状态', dataIndex: 'status', key: 'status' , scopedSlots: { customRender: 'status' },},
        {title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' },},
    ];
    const data = [];
    export default {
        name: 'projectList',
        filters: {

        },
        components:{
            projectInfo,
            ruleList,
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
                reply_content: '',
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                search: { keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                oldVersion: '',
                drawerTitle: '',
                role_additem:0,
                role_delitem:0,
                role_edititem:0,
                role_manageitem:0,
                qrcodeVisible: false,
                qrcodeImg: '',
            };
        },
        activated () {
            this.getList(1)
        },
        methods: {
            // 跳转老板收费管理
            jumpTo() {
              var oldVersion = this.oldVersion
              window.open(oldVersion)
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            // 获取列表信息
            getList(t=0) {
                this.loading = true;
                if(t == 1){
                    this.$set(this.pagination, 'current', 1);
                }
                this.search['page'] = this.pagination.current;
                this.search['limit'] = this.pagination.pageSize;
                this.request(villageApi.ChargeProjectList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                        this.data = res.list;
                        this.loading = false;
                        this.oldVersion = res.oldVersion
                        if(res.role_additem!=undefined){
                            this.role_additem=res.role_additem;
                            this.role_delitem=res.role_delitem;
                            this.role_edititem=res.role_edititem;
                            this.role_manageitem=res.role_manageitem;
                        }else{
                            this.role_additem=1;
                            this.role_delitem=1;
                            this.role_edititem=1;
                            this.role_manageitem=1;
                        }
                    })
            },
            // 添加
            addActive(val) {
                this.getList(1);
            },
            //编辑
            editActive(val){
                this.getList();
            },

            //规则列表
            ruleList(){
                this.getList();
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.$set(_this.pagination, 'current', e.current)
                    _this.getList()
                }
            },

            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.$set(this.pagination, 'current', 1)
                this.getList()
            },
            // 进行重置
            resetList() {
                this.$set(this.pagination, 'current', 1)
                this.search = {  keyword: '', page: 1 };
                this.getList()
            },
          cancel() {

          },
          deleteConfirm(id){
            this.title = '删除';
            this.request(villageApi.deleteProjectId,{id:id}).then((data) => {
                  this.getList()
                  this.$message.success('删除成功!')
            });
            // this.request(villageApi.ChargeRuleDel,{'id':id})
            //   .then((res) => {
            //     _this.List(_this.charge_project_id,1);
            //     _this.$message.success('删除成功')
            //   })
          },
            onClose () {
                this.visible = false
            },
            changeVisible (value, type, name, charge_type) {
                this.drawerTitle = name
                this.charge_type = charge_type
                this.visible = true
                setTimeout(() => {
                    this.$refs.ruleModel.List(value, type, charge_type)
                }, 500)
            },
            checkQrcode(url) {
                this.qrcodeImg = url
                this.qrcodeVisible = true
            }
        }
    };
</script>
<style lang="less" scoped>
    .message-tips-box {
        margin-bottom: 15px;
    }
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
    .qrcode-img {
        width: 400px;
        height: 400px;
        margin-left: 50%;
        transform: translateX(-200px);
    }
</style>