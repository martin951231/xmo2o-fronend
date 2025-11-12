<template>
  <div id="components-layout-demo-basic">
    <a-layout>
      <a-layout style="padding: 0 20px; background: #fff">
        <a-layout-sider>
          <div :style="'margin: 20px 0 10px 0'">
            <span class="add-sort" @click="$refs.createModal.add()" style="margin-right: 10px;">新建分类</span>
            <span class="add-sort" @click="$refs.createModals.add()">添加资产</span>
          </div>
            <template>
              <a-tree :treeData="treeData" default-expand-all :selected-keys="[default_selected]" @select="onSelect">
                <template slot="edit_out" slot-scope="item">
                      <span class="node-title">{{ item.title }} </span>
                      <span class="icon-wrap" style="margin-left: 30px;">
                        <a @click="delAlert(item.id)"><a-icon type="close"/></a>
                      </span>
                      <span class="icon-wrap" style="margin-left: 10px;">
                        <a @click="$refs.createModal.edit(item.id)"><a-icon type="form"/></a>
                      </span>
                </template>
                <template slot="edit_outs" slot-scope="item">
                  <span class="node-title">{{ item.title }} </span>
                  <span class="icon-wrap" style="margin-left: 30px;">
                    <a @click="delAssetsAlert(item.assets_id)"><a-icon type="close"/></a>
                  </span>
                  <span class="icon-wrap" style="margin-left: 10px;">
                    <a @click="$refs.createModals.edit(item.assets_id)"><a-icon type="form"/></a>
                  </span>
                </template>
              </a-tree>
            </template>
        </a-layout-sider>
        <div class="line"></div>
        <a-layout-content v-if="treeData && treeData.length>0 && assetsList">
          <div style="margin-top: 10px;width: 1200px;height: 40px;">
            <a-input-group compact style="width: 270px;float: left">
              <label style="margin-top: 5px;">资产编号：</label><a-input style="width: 200px;" v-model="queryParam.num"/>
            </a-input-group>
            <a-input-group compact style="width: 460px;float: left;margin-left: 25px;">
              <label style="margin-top: 5px;">添加时间：</label>
              <a-range-picker v-if="start_time && end_time" placeholder="添加时间" :value="[date_moment(start_time, dateFormat), date_moment(end_time, dateFormat)]" :format="dateFormat" @change="onChange"/>
              <a-range-picker v-else :format="dateFormat" @change="onChange"/>
            </a-input-group>
            <a-input-group compact style="width: 270px;float: left;">
              <label style="margin-top: 5px;">资产状态：</label>
              <a-select placeholder="请选择资产状态" v-model="queryParam.status" style="width: 160px;">
                <a-select-option value="0" >请选择资产状态</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">领用</a-select-option>
                <a-select-option value="3">租借</a-select-option>
                <a-select-option value="5">报废</a-select-option>
              </a-select>
            </a-input-group>
          </div>
          <div class="edit-content" style="margin-top: -60px;margin-right: 30px;">
            <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
            <a-button  @click="resetList()">重置</a-button>
          </div>
          <div class="board-content">
            <a-button type="primary" class="add-goods" @click="$refs.createModalReceive.add(assets_id)">领用租借</a-button>
            <a-button type="primary" class="add-goods" @click="$refs.createRecycle.add(assets_id)">资产回收</a-button>
            <a-button type="primary" class="add-goods" @click="$refs.createScrap.add(assets_id)">资产报废</a-button>
          </div>
          <a-table
            v-if="assetsList"
            :columns="columns"
            :data-source="assetsList"
            @change="tableChange"
            :pagination="pagination"
            :scroll="{ y: this.clientHeight - 230 }"
            :loading="loading"
          >
            <span slot="record" slot-scope="text, record">
              <a @click="$refs.createRecord.look(record.id)">查看</a>
            </span>
            <span slot="maintain" slot-scope="text, record">
              <a @click="$refs.createMaintain.look(record.id)">查看</a>
            </span>
            <span slot="status" slot-scope="text, record">
              <a-badge :color="text | statusTypeFilter" :text="text | statusFilter" /><br/>
              <div v-if="text == 3" style="color: red;">{{record.msg_day}}</div>
              <div v-if="text == 5" style="color: red;">{{record.record}}</div>
            </span>
            <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
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
      <classify-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
      <assets-info :height='800' :width="1200" ref="createModals" @ok="handleOks"/>
      <receive :height='800' :width="1200" ref="createModalReceive" @ok="handleOks"/>
      <recycle :height='800' :width="1200" ref="createRecycle" @ok="handleOks"/>
      <scrap :height='800' :width="1200" ref="createScrap" @ok="handleOks"/>
      <record :height='800' :width="1200" ref="createRecord" @ok="handleOks"/>
      <maintain :height='1000' :width="1200" ref="createMaintain" @ok="handleOks"/>
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
    import classifyInfo from './ClassifyInfo.vue'
    import assetsInfo from './FixedAssetsInfo.vue'
    import receive from './Receive.vue'
    import recycle from './Recycle.vue'
    import scrap from './Scrap.vue'
    import record from './LeaseReceiveRecord.vue'
    import maintain from './Maintain.vue'
    const statusMap = {
        1: {
            status: 'green',//success
            text: '正常'
        },
        2: {
            status: '#108ee9',//processing
            text: '领用'
        },
        3: {
            status: 'gold',//warning
            text: '租借'
        },
        4: {
            status: 'lime',
            text: '收回'
        },
        5: {
            status: 'volcano',//Error
            text: '报废'
        },
    }

    const data = []
    const sortList = []
    let assets_id=0;
    export default {
        name: 'getClassifyList',
        components: {
            DragBox,
            classifyInfo,
            assetsInfo,
            receive,
            recycle,
            scrap,
            record,
            maintain,
        },
        data() {
            this.cacheData = data.map((item) => ({
                ...item,
            }))
            return {
                form: this.$form.createForm(this),
                id: 1,
                // 查询参数
                queryParam: {
                    assets_id: '0',
                    num:'',
                    status:'0',
                    time:'',
                },
                // 表头
                columns: [
                    {
                        title: '资产编号',
                        dataIndex: 'num',
                        width: '12%',
                        scopedSlots: { customRender: 'num' },
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'add_time',
                        width: '15%',
                        scopedSlots: { customRender: 'add_time' },
                    },
                    {
                        title: '租赁记录',
                        width: '12%',
                        dataIndex: 'record',
                        scopedSlots: { customRender: 'record' },
                    },
                    {
                        title: '维修记录',
                        dataIndex: 'maintain',
                        width: '12%',
                        scopedSlots: { customRender: 'maintain' },
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        width: '12%',
                        scopedSlots: {
                            customRender: 'status',
                        },
                    },
                ],
                data,
                sortList,
                assetsList: [],
                type: '',
                clientHeight: 0,
                loading: false,
                sortLoading: false,
                treeData,
                assets_id:0,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                dateFormat: 'YYYY/MM/DD',
                start_time:'',
                end_time:'',
                imgUrl:require("@/assets/images/blank.png"),
                default_selected:'',
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
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        mounted() {
            this.clientHeight = window.document.body.clientHeight
            window.onresize = () => {
                this.clientHeight = window.document.body.clientHeight
            }
            this.getSortList()
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
                    if (new_arr[0] > 0) {
                        this.queryParam.assets_id = new_arr[1];
                        this.assets_id = this.queryParam.assets_id;
                        this.default_selected =selectedKeys[0];
                        this.getAssetsList();
                    }
                }
            },
            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info);
            },
            onChange(date, dateString) {
                console.log(date, dateString);
                console.log('12312313',dateString);
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
                    this.getAssetsList()
                }
            },
            getSortList() {
                console.log('222', this.queryParam)
                this.sortLoading = true
                this.sortList = []
                this.request(streetCommunityApi.getClassifyNav, this.queryParam).then((res) => {
                    this.sortLoading = false
                    this.treeData = res.menu_list;
                    if(res && res.key.length>0 ){
                        this.queryParam.assets_id = res.key[0].assets_id;
                        this.default_selected = res.key[0].key;
                        assets_id = this.queryParam.assets_id;
                        this.assets_id = this.queryParam.assets_id;
                        this.getAssetsList();
                    }

                })
            },
            // 获得列表
            getAssetsList(changeTab = true) {
                console.log('11111', this.queryParam)
                this.loading = true;
                this.queryParam['page'] = this.page;
                this.request(streetCommunityApi.getAssetsList, this.queryParam).then((res) => {
                    this.assetsList = res.list;
                    console.log(res.list);
                    if (changeTab) {
                        this.tabColumn = res.tabs
                    }
                    if(res.list && res.list.length>0) {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    }
                    this.loading = false
                })
            },

            cancel() {},
            querys() {
                console.log('search', this.queryParam);
                this.getAssetsList()
            },
            // 进行重置
            resetList() {
                this.queryParam.num = '';
                this.queryParam.status = '';
                this.queryParam.time = '';
                this.start_time = '';
                this.end_time = '';
                this.getAssetsList()
            },
            //删除一级分类
            delAlert(cat_id) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除该分类吗？',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        _this.delClassifyNav(cat_id);
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
            delClassifyNav(cat_id){
                this.request(streetCommunityApi.delClassifyNav, {cat_id:cat_id}).then((res) => {
                    if(res)
                    {
                        this.$message.success('操作成功');
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
