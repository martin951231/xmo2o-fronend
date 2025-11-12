<template>
  <div id="components-layout-demo-basic" >
    <a-layout>
      <a-layout style="padding: 0 20px; background: #fff;">
        <a-layout-sider style="min-width: 300px;">
          <div :style="'margin:10px 5px 5px 5px'">
              <a-input style="width: 180px;height: 28px" placeholder="搜索成员、部门" v-model="queryParam.con"/>
            <a-button type="primary"  style="height: 28px;" class="add-goods" @click="search_all()">搜索</a-button>
          </div>
          <template>
            <a-tree :treeData="treeData" :default-expand-all="defaultExpandAll" :selected-keys="[default_selected]" @select="onSelect" >
              <template slot="edit_out" slot-scope="item">
                <span class="node-title" id="title-item">{{ item.title }} </span>
                <div style="float: right;position: absolute;right: 10px;margin-top: -24px;">
                <span class="icon-wrap" >
                        <a @click="delAlert(item.id)"><a-icon type="close"/></a>
                      </span>
                      <span class="icon-wrap" style="margin-left: 10px;">
                        <a @click="$refs.createModal.edit(item.id)"><a-icon type="form"/></a>
                      </span>
                </div>
              </template>
              <template slot="edit_outs" slot-scope="item">
                <span class="node-title">{{ item.title }} </span>
                <span class="icon-wrap" style="margin-left: 30px;">
                    <a @click="delAlert(item.assets_id)"><a-icon type="close"/></a>
                  </span>
                <span class="icon-wrap" style="margin-left: 10px;">
                    <a @click="$refs.createModal.edit(item.assets_id)"><a-icon type="form"/></a>
                  </span>
              </template>
            </a-tree>
          </template>
        </a-layout-sider>
        <div class="line"></div>
        <a-layout-content v-if="treeData && treeData.length>0 && workerList">
          <div style="margin-top: 10px;width: 1200px;height: 40px;">
            <a-input-group compact style="width: 270px;">
              <label style="margin-top: 5px;font-size: 20px;font-weight:bold;">{{treeData[0].title}}（共{{pagination.total}}人）</label>
            </a-input-group>
          </div>
          <hr style="color: #ddd;"/>
          <div class="board-content" style="margin-top: 5px">
            <a-button type="primary" class="add-goods" @click="$refs.createModal.add(id)">添加子组织</a-button>
            <a-button type="primary" class="add-goods" @click="$refs.createModals.add(id,{party_member_show:party_member_show})">添加人员</a-button>
            <a-button type="danger" class="add-goods" @click="delete_all()">批量删除</a-button>
          </div>
          <a-table
            v-if="workerList"
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="workerList"
            @change="tableChange"
            :pagination="pagination"
            rowKey="worker_id"
            :scroll="{ y: this.clientHeight - 230 }"
            :loading="loading"
          >
              <span slot="tags" slot-scope="tags" >
                <a-tag v-for="tags in tags" color="#FCBE79" style="margin-bottom: 5px"> {{tags}} </a-tag>
              </span>
              <span slot="grid_member_label"  slot-scope="name, record">
                <div>{{record.grid_member_label.name}}</div>
                <a-tag class="grid_member_label_0719" v-if="record.grid_member_label.status == 1" :color="record.grid_member_label.color" > {{record.grid_member_label.tips}} </a-tag>
              </span>

            <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModals.edit(record.worker_id,0,{party_member_show:party_member_show})">查看</a>
              <a @click="$refs.createModals.edit(record.worker_id,assets_id,{party_member_show:party_member_show})" style="margin-left: 20px">编辑</a>
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="是"
            cancel-text="否"
            @confirm="deleteConfirm(record.worker_id)"
            @cancel="cancel"
            style="margin-left: 20px"
          >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
          </a-table>
        </a-layout-content>
        <a-layout-content v-else>
          <div style="width: 98%;">
            <div style="text-align: center;margin-top:15%">
              <img :src="imgUrl">
              <p style="color: #0a0a0a;font-size: 16px">您还没有添加任何数据</p>
              <p style="color: #626262;margin-top:-50px;font-size: 14px">您需要添加分类，再添加资产</p>
            </div>
            <div style="text-align: center;margin-top:-30px">
              <a-button type="primary" class="add-goods" @click="$refs.createModal.add()">立即添加</a-button>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <child-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
      <member-info  :width="1200" ref="createModals" @ok="handleOks"/>
      <member-look :height='800' :width="1200" ref="createModalLook" @ok="handleOks"/>
    </a-layout>
  </div>
</template>

<script>
    const treeData = [
        {
            title: 'parent 1',
            key: '0-1',
            children: [
                { title: 'leaf', key: '1-1','id':1},
                { title: 'leaf', key: '1-2','id':2},
            ],
        },
        {
            title: 'parent 2',
            key: '0-2',
            children: [
                { title: 'leaf', key: '2-1'},
                { title: 'leaf', key: '2-2'},
            ],
        },
    ];
    import DragBox from '@/components/DragBox/DragBox'
    import moment from 'moment';
    import streetCommunityApi from '@/api/community/streetCommunity'
    import childInfo from './childInfo.vue'
    import memberInfo from './MemberInfo.vue'
    import memberLook from './MemberLook.vue'

    const data = []
    const sortList = []
    let assets_id=0;
    export default {
        name: 'OrganizationList',
        components: {
            DragBox,
            childInfo,
            memberInfo,
            memberLook,
        },
        data() {
            this.cacheData = data.map((item) => ({
                ...item,
            }))
            return {
                form: this.$form.createForm(this),
                id: 0,
                // 查询参数
                queryParam: {
                    assets_id: '0',
                    num:'',
                    status:'0',
                    time:'',
                    con:'',
                },
                // 表头
                columns: [
                    {
                        title: '编号',
                        dataIndex: 'work_num',
                        width: '8%',
                    },
                    {
                        title: '姓名',
                        dataIndex: 'work_name',
                    },
                    {
                        title: '手机号码',
                        width: '8%',
                        dataIndex: 'work_phone',
                    },
                    {
                        title: '账号',
                        dataIndex: 'work_account',
                    },
                    {
                        title: '职务',
                        dataIndex: 'work_job',

                    },
                    {
                        title: '部门',
                        dataIndex: 'organization_txt',
                        width: '20%',
                      scopedSlots: { customRender: 'tags' }
                    },
                  {
                    title: '标签',
                    dataIndex: 'grid_member_label',
                    scopedSlots: { customRender: 'grid_member_label' }
                  },
                    {
                        title: '操作',
                        key: 'action',
                        dataIndex: '',
                      width: '13%',
                        scopedSlots: {
                            customRender: 'action'
                        }
                    },
                ],
                data,
                sortList,
                workerList: [],
                type: '',
                defaultExpandAll:true,
                clientHeight: 0,
                loading: false,
                sortLoading: false,
                treeData,
                assets_id:0,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 ,con:''},
                page: 1,
                dateFormat: 'YYYY/MM/DD',
                start_time:'',
                end_time:'',
                workers_id_arr:[],
                imgUrl:require("@/assets/images/blank.png"),
                default_selected:'',
                autoExpandParent: true,
                party_member_show:0,
            }
        },
        watch: {
            $route: {
                handler() {
                    this.queryParam.store_id = this.$route.query.store_id
                    this.queryParam.sort_id = 0
                    this.getSortList()
                },
                deep: true,
            },
        },
        created() {
        },
        mounted() {
            this.clientHeight = window.document.body.clientHeight
            window.onresize = () => {
                this.clientHeight = window.document.body.clientHeight
            }
            this.getSortList()
        },
        computed: {
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRows: ',selectedRows);
                        if(selectedRows != []){
                            this.workers_id_arr = selectedRows;
                        }
                    },
                    getCheckboxProps: record => ({
                        props: {
                            //disabled: record.is_exist === 1, // Column configuration not to be checked
                        },
                    }),
                };
            },
        },
        methods: {
            moment,
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return ''
                }
                return moment(time, dateFormat);
            },
            onSelect(selectedKeys, info) {
                if(selectedKeys[0]) {
                    let new_arr = selectedKeys[0].split('-');
                    if(new_arr.length == 2)
                        this.queryParam.id = 0;
                    else
                        this.queryParam.id = new_arr[new_arr.length-1];
                    this.id = this.queryParam.id;
                    this.default_selected =selectedKeys[0];
                    this.queryParam.con = '';
                    this.getworkerList();
                }
            },
            onCheck(checkedKeys, info) {

            },
            onChange(date, dateString) {
                this.start_time=dateString[0];
                this.end_time=dateString[1];
                this.queryParam.time = dateString;
            },
            handleOks() {
                this.getSortList();
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getworkerList()
                }
            },
            getSortList() {
                this.sortLoading = true
                this.sortList = []
                this.request(streetCommunityApi.getTissueNav).then((res) => {
                    this.sortLoading = false;
                    this.treeData = res.menu_list;
                    this.party_member_show=0;
                   if(res.party_member_show){
                       this.party_member_show=res.party_member_show;
                   }
                    if(res && res.key.length>0 ){
                        this.queryParam.assets_id = res.key[0].assets_id;
                        this.default_selected = res.key[0].key;
                        assets_id = this.queryParam.assets_id;
                        this.assets_id = this.queryParam.assets_id;
                        this.getworkerList();
                    }
                    
                })
            },
            search_all(){
                this.getworkerList();
            },
            // 获得列表
            getworkerList(changeTab = true) {
                this.loading = true;
                this.queryParam['page'] = this.page;
                this.request(streetCommunityApi.getMemberList, this.queryParam).then((res) => {
                    if(this.queryParam.con != '' && res.list.length > 0){
                        let new_arr = res.list[0].organization_ids.split(',');
                        this.default_selected = '0-'+res.street_id+'-'+new_arr[0];
                        this.defaultExpandAll = true;
                    }else{
                        if(res.organization_id && res.organization_id>0){
                            this.default_selected = '0-'+res.street_id+'-'+res.organization_id;
                            this.defaultExpandAll = true;
                        }
                    }
                    this.workerList = res.list;
                    if (changeTab) {
                        this.tabColumn = res.tabs
                    }
                    if(res.list && res.list.length>0) {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    }else{
                        this.pagination.total = 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    }
                    this.loading = false;
                })
            },

            cancel() {},
            querys() {
                console.log('search', this.queryParam);
                this.getworkerList()
            },
            // 进行重置
            resetList() {
                this.queryParam.num = '';
                this.queryParam.status = '';
                this.queryParam.time = '';
                this.start_time = '';
                this.end_time = '';
                this.getworkerList()
            },
            //删除
            delAlert(id) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除该部门吗？',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        _this.delClassifyNav(id);
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
            //删除工作人员
            deleteConfirm(id){
                this.request(streetCommunityApi.delWorker,{'worker_id':id})
                    .then((res) => {
                        this.$message.success('删除成功');
                        this.getworkerList();
                    })
            },
            //批量删除工作人员
            delete_all(){
                let that = this
                if(that.workers_id_arr == ''){
                    that.$message.error('请选择删除的数据');
                    return false;
                }
                that.$confirm({
                    title: '提示',
                    content: '确定要删除选中的数据吗？',
                    onOk() {
                        that.request(streetCommunityApi.delWorker,{
                            worker_id:that.workers_id_arr
                        }).then((res)=>{
                            that.$message.success('删除成功');
                            that.getworkerList();
                        });
                    },
                    onCancel() {},
                });
                
            },
            delClassifyNav(id){
                this.request(streetCommunityApi.delBranch, {id:id}).then((res) => {
                    if(res)
                    {
                        this.$message.success('操作成功');
                        this.id=0;
                        this.queryParam.id=0;
                        this.getSortList();
                    }else{
                        this.$message.error('操作失败');
                    }
                })
            },
            //删除资产 （二级分类）
            delAssetsAlert(assets_id) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除该分类吗？',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        _this.delAssets(assets_id);
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
            delAssets(assets_id){
                this.request(streetCommunityApi.delAssets, {assets_id:assets_id}).then((res) => {
                    if(res)
                    {
                        this.$message.success('操作成功');
                        this.getSortList();
                    }else{
                        this.$message.error('操作失败');
                    }
                })
            }
        },
    }
</script>
<style scoped>

  .grid_member_label_0719{
    margin-top: 5px !important;
  }
  #title-item{
    max-width: 160px;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical; 
    word-break: break-all;
    white-space: normal;
  }
  .line{
    border-right: 1px solid #ddd;height: 98%;margin-top: 10px;margin-left: 10px;
  }
  .board-content{
    margin-top: 40px;
  }
  .detail-content >>> .ant-drawer-body {
    padding: 0;
  }
  .add-sort {
    color: #1890ff;
    border: 1px solid #1890ff;
    border-radius: 12px;
    padding: 2px 18px;
    background-color: #1890ff21;
    cursor: pointer;
  }

  #components-layout-demo-basic {
    text-align: left;
    background: #ffffff;
    height: 100%;
  }

  #components-layout-demo-basic .ant-layout {
    height: 100%;
  }

  #components-layout-demo-basic .ant-layout-header,
  #components-layout-demo-basic .ant-layout-footer {
    background: #ffffff;
    color: #fff;
    height: 80px;
  }

  #components-layout-demo-basic .ant-layout-sider {
    background: #ffffff;
    color: #fff;
  }

  #components-layout-demo-basic .ant-layout-content {
    background: #ffffff;
    color: #fff;
    min-height: 120px;
    line-height: 120px;
    padding-left: 20px;
  }

  #components-layout-demo-basic > .ant-layout {
    margin-bottom: 48px;
  }

  #components-layout-demo-basic > .ant-layout:last-child {
    margin: 0;
  }
  #components-layout-demo-basic .add-goods {
    margin: 0 20px;
  }
  #components-layout-demo-basic >>> .ant-btn-group {
    line-height: 80px;
  }
  #components-layout-demo-basic .edit-content {
    float: right;
    /* margin-right: 60px; */
  }
  #components-layout-demo-basic >>> .ant-tabs {
    display: inline-block;
  }
  #components-layout-demo-basic >>> .ant-layout-content {
    line-height: 70px;
  }
  .ant-pro-page-header-wrap-children-content,
  .ant-pro-page-header-wrap-children-content >>> .ant-tabs {
    width: 100%;
  }
  .message-suggestions-list-box {
    position: relative;
  }
  .search-input {
    position: absolute;
    right: 0;
    bottom: 36px;
  }
  .right-c {
    display: flex;
  }
  .goods-image {
    width: 48px;
    margin-right: 5px;
    height: 48px;
    border-radius: 4px;
  }
  .img-wrap {
    position: relative;
  }
  .yxj {
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 48px;
    line-height: 48px;
    font-size: 12px;
    text-align: center;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
  .cat-list {
    position: absolute;
    width: 100%;
    left: 0;
    top: 20px;
    bottom: 90px;
    overflow-y: scroll;
  }
  .add-new-cat {
    position: absolute;
    text-align: center;
    width: 100%;
    left: 0;
    height: 50px;
  }
</style>
