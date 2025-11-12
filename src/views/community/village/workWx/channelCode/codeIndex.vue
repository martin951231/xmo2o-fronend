<template>
  <div id="components-layout-demo-basic" class="code-index-box">
    <a-layout>
      <a-layout style="padding: 0 20px; background: #fff">
        <a-layout-sider style="min-width: 300px;">
          <div :style="'margin: 20px 0 10px 0'">
          </div>
          <template>
            <a-tree :treeData="treeData" :auto-expand-parent="autoExpandParent" :expanded-keys="expandedKeys" @expand="onExpand" :selected-keys="choose_data"  @select="onSelect">
              <template slot="add_out" slot-scope="item">
                <span class="node-title title-item" >{{ item.title }} </span>
                <div style="float: right;position: absolute;right: 10px;margin-top: -24px;">
                  <span class="icon-wrap" style="margin-left: 3px;">
                     <a-popover style="margin-left: 3px;">
                      <template slot="content">
                        <p>添加</p>
                      </template>
                      <a @click="$refs.createModal.add(item.id)"><a-icon type="plus"/></a>
                     </a-popover>
                  </span>
                </div>
              </template>
              <template slot="edit_out" slot-scope="item">
                <span class="node-title title-item" id="title-item">{{ item.title }} </span>
                <div style="float: right;position: absolute;right: 10px;margin-top: -24px;">
                  <span class="icon-wrap" v-if="!item.pid && item.is_add" style="margin-left: 3px;">
                    <a-popover style="margin-left: 10px;">
                    <template slot="content">
                      <p>添加</p>
                    </template>
                      <a @click="$refs.createModal.add(item.id)"><a-icon type="plus"/></a>
                    </a-popover>
                  </span>
                  <a-popover style="margin-left: 10px;" v-if="item.is_del">
                    <template slot="content">
                      <p>删除</p>
                    </template>
                        <a @click="delGroup(item.id)"><a-icon type="delete"/></a>
                  </a-popover>
                  <a-popover style="margin-left: 10px;" v-if="item.is_edit">
                    <template slot="content">
                      <p>编辑</p>
                    </template>
                    <a @click="$refs.createModal.edit(item.id)"><a-icon type="form"/></a>
                  </a-popover>
                </div>
              </template>
            </a-tree>
          </template>
        </a-layout-sider>
        <div class="line"></div>
        <a-layout-content v-if="treeData && treeData.length>0">
            <a-alert message="" type="info" style="margin:10px 15px 0 0;">
              <div slot="description">
                <div>1、可以生成带参数的二维码名片，支持活码功能，即随机选取设置的活码成员推给业主。加企业微信为好友后，可以给微信联系人自动回复相应欢迎消息和打标签。</div>
                <!-- <div style="padding-top:3px">2、每创建一个渠道活码，该码则自动进入【内容引擎】--【图片类型】--分组【渠道码】，以素材的方式通过聊天侧边栏快速发送给业主。</div> -->
                <div style="padding-top:3px">2、如果企业在企业微信后台为相关成员配置了可用的欢迎语，使用第三方系统配置欢迎语，则均不起效，推送的还是企业微信官方的。</div>
              </div>
            </a-alert>
          <div class="card-container">
              <div style="margin: 10px;width: 1200px;line-height: 40px;display:flex;">
                <a-input-group compact style="width: 200px;line-height: 30px;">
                  活码名称：<a-input style="width: 130px;" v-model="queryParam.code_name" placeholder="可输入活码名称"/>
                </a-input-group>

                <a-input-group compact style="width: 260px;float: left;margin-left:10px;">
                  <label style="margin-top: 5px;">选择成员：</label>
                  <a-select placeholder="请选择成员" v-model="queryParam.work_id" style="width: 160px;">
                    <a-select-option value="0">全部成员</a-select-option>
                    <a-select-option v-for="(item1,index1) in work_list" :key="index1" :value="item1.wid">{{item1.name}}</a-select-option>
                  </a-select>
                </a-input-group>

                <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
                <a-popconfirm
                  class="ant-dropdown-link"
                  title="一旦删除不可回复，是否确认删除?"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="batchDelData()"
                >
                      <a-button type="primary" class="add-goods">批量删除</a-button>
                </a-popconfirm>
                <a-button type="primary" class="add-goods" @click="batchUploadCode()">批量下载</a-button>
                <!-- <a-button type="primary" class="add-goods" @click="batchEditWel()">批量编辑欢迎语</a-button> -->
              </div>
              <div class="board-content" style="margin: 0;padding:0;;line-height: 30px;">
                <a-button type="primary" class="add-goods" @click="addCode()">添加</a-button>
              </div>
              <a-table
                style="margin: 10px"
                v-if="dataList"
                :row-selection="rowSelection"
                :columns="columns"
                :data-source="dataList"
                rowKey="code_id"
                @change="tableChange"
                :pagination="pagination"
                :scroll="{ y: this.clientHeight - 230 }"
                :loading="loading"
              >
              <span slot="code_url" slot-scope="text,record">
                  <viewer :images="[record.code_url]" :toolbar="false"  v-if="record.code_url">
                    <img :height="50" :src="record.code_url" title="点击放大查看"/>
                  </viewer>
              </span>
              <span slot="skip_verify" slot-scope="text">
                <div v-if="text == 1">自动通过</div>
                <div v-else>需要验证</div>
              </span>
              <span slot="label_txt" slot-scope="text, record">
                <div class="label-tag-tip" v-if="record.label_arr && record.label_arr[0]">

                   <a-popover title="所属标签">
                      <template slot="content">
                        <a-tag color="#1890ff" class="tip" v-for="(items,indexs) in record.label_arr" :key="indexs">{{items.label_name}}</a-tag>
                      </template>
                      <span v-for="(item1,index1) in record.label_arr" :key="index1">
                        <a-tag color="#1890ff" class="tip"   v-if="index1 < 2">{{item1.label_name}}</a-tag>
                      </span>
                    </a-popover>

                  
                </div>
                <div v-else> 暂无标签 </div>
              </span> 

                <span slot="action" slot-scope="text, record">
                    <a @click="addCode(record.code_id)" style="margin-right:10px;" v-if="record.is_operation">编辑</a>
                    <a-divider type="vertical" v-if="record.is_operation"/>
                    <a @click="updateCode(record)" v-if="record.code_url" style="margin-right:10px;">下载</a>
                    <a-divider type="vertical" v-if="record.code_url && record.is_operation"/>
                    <!-- <a @click="$refs.createModalText.edit(record.code_id)">移动</a> -->
                    <!-- <a-divider type="vertical" /> -->
                      <a-popconfirm
                        title="确认删除?"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="delCode(record.code_id)"
                        @cancel="cancel"
                        v-if="record.is_operation"
                      >
                        <a href="#">删除</a>
                      </a-popconfirm>
                </span>

              </a-table>
          </div>
        </a-layout-content>
        <a-layout-content v-else>
          <div style="width: 98%;">
            <div style="text-align: center;margin-top:15%">
              <img :src="imgUrl">
              <p style="color: #0a0a0a;font-size: 16px">您还没有添加任何数据</p>
              <p style="color: #626262;margin-top:-50px;font-size: 14px">您需要添加分组，再添加渠道活码</p>
            </div>
            <div style="text-align: center;margin-top:-30px">
              <a-button type="primary" class="add-goods" @click="addCode()">立即添加</a-button>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <group-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
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
        }
    ];
    import DragBox from '@/components/DragBox/DragBox'
    import villageApi from '@/api/community/village'
    import groupInfo from "./groupInfo";
    import { getSystemName } from '@/utils/util'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import 'viewerjs/dist/viewer.css'
    Vue.use(Viewer)
    const statusMap = {
        1: {
            status: 'green',//success
            text: '正常'
        },
        2: {
            status: '#108ee9',//processing
            text: '领用'
        },
    }

    const data = []
    const sortList = []
    let assets_id=0;
    export default {
        name: 'codeIndex',
        components: {
            DragBox,
            groupInfo,
        },
        computed: {
          // 表格选择操作
          rowSelection() {
            return {
              onChange: this.onSelectChange,
              getCheckboxProps: (record) => ({
                props: {
                  disabled: !record.is_operation === true,
                },
              }),
            }
          },
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
                    code_name: '',
                    work_id:'',
                },
                // 表头
                columns: [
                    {
                        title: '二维码',
                        dataIndex: 'code_url',
                        width: '10%',
                        scopedSlots: { customRender: 'code_url' },
                    },
                    {
                        title: '活码名称',
                        dataIndex: 'code_name',
                        width: '10%',
                        scopedSlots: { customRender: 'code_name' },
                    },
                    {
                        title: '分组',
                        dataIndex: 'group_name',
                        width: '10%',
                        scopedSlots: { customRender: 'group_name' },
                    },
                    {
                        title: '自动添加好友',
                        dataIndex: 'skip_verify',
                        width: '12%',
                        scopedSlots: { customRender: 'skip_verify' },
                    },
                    {
                        title: '标签',
                        dataIndex: 'label_txt',
                        width: '15%',
                        scopedSlots: { customRender: 'label_txt' },
                    },
                    {
                        title: '客户数',
                        dataIndex: 'customer_num',
                        width: '10%',
                        scopedSlots: { customRender: 'customer_num' },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: '20%',
                        scopedSlots: {
                            customRender: 'action',
                        },
                    },
                ],
                data,
                sortList,
                dataList: [],
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
                autoExpandParent: true,
                expandedKeys: ['0-0-1'],
                choose_data: ['0-0-1'],
                choose_id: 0,
                selectedRowKeys: [],
                work_list: [],
                tokenName: '',
                sysName: ''
            }
        },
        activated() {
            let sysName = getSystemName(location.hash);
            if (sysName) {
              this.tokenName = sysName + '_access_token';
              this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
            this.getSortList();
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
        },
        methods: {
            batchEditWel() {
              
            },
            onExpand(expandedKeys) {
              console.log('onExpand', expandedKeys);
              this.expandedKeys = expandedKeys;
              this.autoExpandParent = false;
            },
            batchDelData() {
              let selectedRowKeys = this.selectedRowKeys;
              if (!selectedRowKeys || !selectedRowKeys[0]) {
                  this.$message.warning('请选择删除对象');
                  return false;
              }
              let param = {
                code_id_arr: selectedRowKeys,
                tokenName: this.tokenName
              };
              this.request(villageApi.batchDelCode, param).then((res) => {
                  this.$message.success('删除成功');
                  this.getSortList();
              })
            },
            delGroup(id) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除吗？',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        let param = {
                          id: id,
                          tokenName: _this.tokenName
                        };
                        _this.request(villageApi.delCodeGroup, param).then((res) => {
                            if(res)
                            {
                                _this.$message.success('操作成功');
                                _this.getSortList();
                            }else{
                                _this.$message.error('操作失败');
                            }
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
            batchUploadCode() {
              let selectedRowKeys = this.selectedRowKeys;
              if (!selectedRowKeys || !selectedRowKeys[0]) {
                  this.$message.warning('请选择下载对象');
                  return false;
              }
              let param = {
                code_id_arr: selectedRowKeys, 
                code_group_id: this.choose_id,
                tokenName: this.tokenName
              };
              this.request(villageApi.uploadCode, param).then((res) => {
                  if (res && res.down_url) {
                    this.$message.success('正在跳转下载...');
                    setTimeout(function() {
                      window.open(res.down_url);    
                    },1000)
                  }
              })
            },
            onSelectChange(selectedRowKeys, selectedRows) {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              this.selectedRowKeys = [];
              if (selectedRows && selectedRows[0]) {
                  for (var i in selectedRows) {
                      if (selectedRows[i]) {
                          this.selectedRowKeys.push(selectedRows[i]['code_id']);
                      }
                  }
              }
            },
            addCode(code_id) {
                let sysName = this.sysName;
                let pathInfo = '/'+sysName+'/'+sysName+'.workWx.channelCode/addCode';
                let query = {};
                if (code_id) {
                  query['code_id'] = code_id;
                }
                if (this.choose_id) {
                  query['code_group_id'] = this.choose_id;
                }
                this.$router.push({ path: pathInfo, query: query })
            },
            updateCode(record) {
               console.log('record', record)
               this.getUrlBase64(record.code_url).then(base64 => {
                let link = document.createElement('a')
                link.href = base64
                link.download = record.group_name +'_'+ record.code_name + '.png'
                link.click()
              })
            },
            getUrlBase64(url) {
              return new Promise(resolve => {
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext('2d')
                let img = new Image()
                img.crossOrigin = 'Anonymous' //允许跨域
                img.src = url
                img.onload = function() {
                  canvas.height = 300
                  canvas.width = 300
                  ctx.drawImage(img, 0, 0, 300, 300)
                  let dataURL = canvas.toDataURL('image/png')
                  canvas = null
                  resolve(dataURL)
                }
              })
            },
            delCode(code_id) {
              let param = {
                code_id: code_id,
                tokenName: this.tokenName
              };
              this.request(villageApi.delCode, param).then((res) => {
                  this.$message.success('删除成功');
                  this.getSortList();
              })
            },
            onSelect(selectedKeys, info) {
              console.log('selectedKeys', selectedKeys)
              console.log('info', info)
              this.choose_data = selectedKeys;
              if(selectedKeys[0]) {
                  let new_arr = selectedKeys[0].split('-');
                  if (new_arr[0] > 0) {
                      this.queryParam.id = new_arr[0];
                      this.choose_id = this.queryParam.id;
                      this.channelCodeList();
                  } else {
                      this.queryParam.id = 0;
                      this.choose_id = 0;
                      this.channelCodeList();
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
            handleOks(val) {
                console.log('val',val)
                this.getSortList();
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.channelCodeList()
                }
            },
            getSortList() {
                console.log('222')
                this.sortLoading = true
                var _this = this;
                this.sortList = []
                let param = {
                  tokenName: this.tokenName
                };
                if (this.choose_id && !this.queryParam['id']) {
                   param['id'] = this.choose_id;
                } else if (!this.choose_id && this.queryParam['id']) {
                   param['id'] = 0;
                }
                this.request(villageApi.channelMenuList, param).then((res) => {
                    this.sortLoading = false
                    this.treeData = res.menu_list;
                    if (res && res.expandedKeys) {
                        this.expandedKeys = res.expandedKeys
                    }
                    if (res && res.choose_data) {
                        this.choose_data = res.choose_data
                    }
                    if (res && res.choose_id) {
                        this.choose_id = res.choose_id
                    }
                    this.channelCodeList();
                })
            },
            // 获得列表
            channelCodeList() {
                console.log('11111', this.queryParam)
                this.loading = true;
                this.queryParam['page'] = this.page;
                if (this.choose_id && !this.queryParam['id']) {
                   this.queryParam['id'] = this.choose_id;
                } else if (!this.choose_id && this.queryParam['id']) {
                   this.queryParam['id'] = 0;
                }
                this.queryParam['tokenName'] = this.tokenName;
                this.request(villageApi.channelCodeList, this.queryParam).then((res) => {
                    this.dataList = res.list;
                    console.log(res.list);
                    if(res.list && res.list.length>0) {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    }
                    if(res.work_list) {
                        this.work_list = res.work_list
                    }
                    this.selectedRowKeys = [];
                    this.loading = false
                })
            },

            cancel() {},
            querys() {
                console.log('search', this.queryParam);
                this.channelCodeList()
            },
            // 进行重置
            resetList() {
                this.queryParam.work_id = 0;
                this.queryParam.code_name = '';
                this.channelCodeList()
            },
        },
    }
</script>
<style scoped>
  .title-item{
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
    margin: 0 5px;
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
    /*line-height: 70px;*/
  }
  .ant-pro-page-header-wrap-children-content,
  .ant-pro-page-header-wrap-children-content >>> .ant-tabs {
    width: 100%;
  }
  .ant-popover-inner-content {
    padding: 12px 12px 1px !important;
  }

  .label-tag-tip .ant-tag.tip {
      border-radius: 5px;
      margin: 5px 5px 0 0;
  }
  .ant-tabs-nav-wrap{
    background: #FAFAFA;
    height: 98%;
    border-right: 1px solid #eee;
  }
  .card-container {
    margin-top: 10px;
    padding: 5px;
  }
  .card-container > .ant-tabs-card > .ant-tabs-content {
    height: 100%;
    margin-top: -16px;
  }

  .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    /*background: #fff;*/
    /*width: 1260px;*/
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar {
    border-color: #eee;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent;
    /*background: transparent;*/
    margin-right: auto;
    width: 100px;
    text-align: center;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
    border-color: #eee;
    /*background: #fff;*/
  }
</style>
