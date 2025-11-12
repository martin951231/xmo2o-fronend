<template>
  <div id="components-layout-demo-basic" class="engine-index-box">
    <a-layout>
      <a-layout style="padding: 0 20px; background: #fff">
        <a-layout-sider style="min-width: 300px;">
          <div :style="'margin: 20px 0 10px 0'">
          </div>
          <template>
            <a-tree :treeData="treeData" :auto-expand-parent="autoExpandParent" :expanded-keys="expandedKeys" @expand="onExpand" :selected-keys="[default_selected]" @select="onSelect">
              <template slot="fixed_out" slot-scope="item">
                <span class="node-title title-item" >{{ item.title }} </span>
              </template>
              <template slot="fixed_not_out" slot-scope="item">
                <span class="node-title title-item" >{{ item.title }} </span>
                <div style="float: right;position: absolute;right: 10px;margin-top: -24px;">
                <span class="icon-wrap" v-if="!item.pid && item.is_add" style="margin-left: 3px;">
                    <a-popover style="margin-left: 3px;">
                    <template slot="content">
                      <p>添加</p>
                    </template>
                      <a @click="$refs.createModal.add(item.id)"><a-icon type="plus"/></a>
                    </a-popover>
                  </span>
                <a-popover style="margin-left: 3px;" v-if="item.is_edit">
                  <template slot="content">
                    <p>编辑</p>
                  </template>
                  <a @click="$refs.createModal.edit(item.id)"><a-icon type="form"/></a>
                </a-popover>
                </div>
              </template>
              <template slot="add_out" slot-scope="item">
                <span class="node-title title-item" >{{ item.title }} </span>
                <div style="float: right;position: absolute;right: 10px;margin-top: -24px;">
                  <span class="icon-wrap" style="margin-left: 3px;" v-if="item.is_add">
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
                    <a-popover style="margin-left: 3px;">
                    <template slot="content">
                      <p>添加</p>
                    </template>
                      <a @click="$refs.createModal.add(item.id)"><a-icon type="plus"/></a>
                    </a-popover>
                  </span>
                  <a-popover style="margin-left: 3px;" v-if="item.is_del">
                    <template slot="content">
                      <p>删除</p>
                    </template>
                        <a @click="delAlert(item.id)"><a-icon type="delete"/></a>
                  </a-popover>
                  <a-popover style="margin-left: 3px;" v-if="item.is_edit">
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
        <a-layout-content v-if="treeData && treeData.length>0 && (contentList || codeList)">
          <a-page-header
            class="content-p"
            :title="total_sum_number"
          />
<!--            <a-alert message="" type="info" style="margin:10px 5px 0 5px;">-->
<!--              <div slot="description">-->
<!--                <div>每创建一个渠道码，该码则自动进入【内容引擎】&#45;&#45;【图片类型】&#45;&#45;分组【渠道码】，以素材的方式通过聊天侧边栏快速发送给业主。</div>-->
<!--              </div>-->
<!--            </a-alert>-->
          <div class="card-container">
            <a-tabs v-if="!channel_code" type="card" style="width: 100%" @change="switchType">
              <a-tab-pane key="1" tab="所有">
                <div style="margin: 10px;width: 1200px;height: 40px;">
                  <a-input-group compact style="width: 270px;float: left">
                    <a-input style="width: 200px;" v-model="queryParam.title" placeholder="可输入标题内容"/>
                  </a-input-group>
                  <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
<!--                  <a-button type="primary" @click="batchMove()" class="add-goods">批量移动</a-button>-->
                </div>
                <a-table
                  style="margin: 10px"
                  v-if="contentList"
                  :columns="columns"
                  :row-selection="rowSelection"
                  :data-source="contentList"
                  @change="tableChange"
                  :pagination="pagination"
                  :scroll="{ y: this.clientHeight - 230 }"
                  :loading="loading"
                >
                  <span slot="content" slot-scope="text,record" >
                    <viewer v-if="record.type === 2 || record.type === 3" :images="[text]" :toolbar="false">
                      <img :height="50" v-if="text" :src="text" title="点击放大查看"/>
                    </viewer>
                    <a v-else-if="record.type === 4" :href="text" target="_blank">访问链接</a>
                    <a-popover v-else placement="top">
                        <template slot="content" >
                          <div style="display:block;width:400px;height:100%;word-wrap: break-word;word-break: break-all;">{{text}}</div>
                        </template>
                        <div class='content_text-text'>{{text}}</div>
                    </a-popover>
                  </span>
                <span slot="status" slot-scope="text, record">
                  <a-badge :color="text | statusTypeFilter" :text="text | statusFilter" /><br/>
                  <div v-if="text == 3" style="color: red;">{{record.msg_day}}</div>
                  <div v-if="text == 5" style="color: red;">{{record.record}}</div>
                </span>
                <span slot="action" slot-scope="text, record">
                  <a v-if="record.type === 1" @click="$refs.createModalText.edit(record.id)">编辑</a>
                  <a v-if="record.type === 4" @click="$refs.createModalLibrary.edit(record.id)">编辑</a>
<!--                  <a-divider type="vertical" />-->
<!--                    <a @click="$refs.createModalText.edit(record.id)">移动</a>-->
                  <a-divider type="vertical" v-if="record.type != 4"/>
                    <a-popconfirm
                      class="ant-dropdown-link"
                      title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="delAlertC(record.id)"
                      @cancel="cancel"
                      v-if="record.type != 4"
                    >
                      <a href="#">删除</a>
                    </a-popconfirm>
                </span>
                <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="2" tab="文本">
                <div style="margin: 10px;width: 1200px;height: 40px;">
                  <a-input-group compact style="width: 270px;float: left">
                    <a-input style="width: 200px;" v-model="queryParam.title" placeholder="可输入标题内容"/>
                  </a-input-group>
                  <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
<!--                  <a-button type="primary" class="add-goods" @click="batchMove()">批量移动</a-button>-->
                  <a-button type="primary" class="add-goods" @click="batchDel()">批量删除</a-button>
                  <a-button type="primary" class="add-goods" @click="$refs.createModalImport.add(gid,default_selected)">导入文本</a-button>
                </div>
                <div class="board-content">
                  <a-button type="primary" class="add-goods" @click="$refs.createModalText.add(gid,default_selected)">添加文本</a-button>
                </div>
                <a-table
                  style="margin: 10px"
                  v-if="contentList"
                  :columns="columns_txt"
                  :row-selection="rowSelection"
                  :data-source="contentList"
                  @change="tableChange"
                  :pagination="pagination"
                  :scroll="{ y: this.clientHeight - 230 }"
                  :loading="loading"
                >
                  <span slot="content" slot-scope="text,record">
                    <a-popover placement="top">
                        <template slot="content" >
                          <div style="display:block;width:400px;height:100%;word-wrap: break-word;word-break: break-all;">{{text}}</div>
                        </template>
                        <div class='content_text-text'>{{text}}</div>
                    </a-popover>
                  </span>
                <span slot="status" slot-scope="text, record">
                  <a-badge :color="text | statusTypeFilter" :text="text | statusFilter" /><br/>
                  <div v-if="text == 3" style="color: red;">{{record.msg_day}}</div>
                  <div v-if="text == 5" style="color: red;">{{record.record}}</div>
                </span>
                  <span slot="action" slot-scope="text, record">
                  <a @click="$refs.createModalText.edit(record.id,gid,default_selected)">编辑</a>
<!--                  <a-divider type="vertical" />-->
<!--                    <a @click="$refs.createModalText.edit(record.id)">移动</a>-->
                  <a-divider type="vertical" />
                    <a-popconfirm
                      class="ant-dropdown-link"
                      title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="delAlertC(record.id)"
                      @cancel="cancel"
                    >
                      <a href="#">删除</a>
                    </a-popconfirm>
                </span>
                  <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="3" tab="图片">
                <div style="margin: 10px;width: 1200px;height: 40px;">
                  <a-input-group compact style="width: 270px;float: left">
                    <a-input style="width: 200px;" v-model="queryParam.title" placeholder="可输入标题内容"/>
                  </a-input-group>
                  <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
<!--                  <a-button type="primary" class="add-goods"  @click="batchMove()">批量移动</a-button>-->
                  <a-button type="primary" class="add-goods"  @click="batchDel()">批量删除</a-button>
                </div>
                <div class="board-content">
                  <a-button type="primary" class="add-goods" @click="$refs.createModalFile.add(gid,2,default_selected)">上传图片</a-button>
                </div>
                <a-table
                  style="margin: 10px"
                  v-if="contentList"
                  :columns="columns_txt"
                  :row-selection="rowSelection"
                  :data-source="contentList"
                  @change="tableChange"
                  :pagination="pagination"
                  :scroll="{ y: this.clientHeight - 230 }"
                  :loading="loading"
                >
                  <span slot="content" slot-scope="text,record">
<!--                    <img :height="50" :src="text"/>-->
                    <viewer :images="[text]" :toolbar="false">
                      <img :height="50" v-if="text" :src="text" title="点击放大查看"/>
                    </viewer>
                  </span>
                <span slot="status" slot-scope="text, record">
                  <a-badge :color="text | statusTypeFilter" :text="text | statusFilter" /><br/>
                  <div v-if="text == 3" style="color: red;">{{record.msg_day}}</div>
                  <div v-if="text == 5" style="color: red;">{{record.record}}</div>
                </span>
                  <span slot="action" slot-scope="text, record">
<!--                    <a @click="$refs.createModalText.edit(record.id)">移动</a>-->
                  <a-divider type="vertical" />
                    <a-popconfirm
                      class="ant-dropdown-link"
                      title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="delAlertC(record.id)"
                      @cancel="cancel"
                    >
                      <a href="#">删除</a>
                    </a-popconfirm>
                </span>
                  <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="4" tab="文件">
                <div style="margin: 10px;width: 1200px;height: 40px;">
                  <a-input-group compact style="width: 270px;float: left">
                    <a-input style="width: 200px;" v-model="queryParam.title" placeholder="可输入标题内容"/>
                  </a-input-group>
                  <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
<!--                  <a-button type="primary" class="add-goods"  @click="batchMove()">批量移动</a-button>-->
                  <a-button type="primary" class="add-goods"  @click="batchDel()">批量删除</a-button>
                </div>
                <div class="board-content">
                  <a-button type="primary" class="add-goods" @click="$refs.createModalFile.add(gid,3,default_selected)">上传文件</a-button>
                </div>
                <a-table
                  style="margin: 10px"
                  v-if="contentList"
                  :columns="columns_txt"
                  :row-selection="rowSelection"
                  :data-source="contentList"
                  @change="tableChange"
                  :pagination="pagination"
                  :scroll="{ y: this.clientHeight - 230 }"
                  :loading="loading"
                >
                  <span slot="content" slot-scope="text,record">
<!--                    <img :height="50" :src="text"/>-->
                    <viewer :images="[text]" :toolbar="false">
                      <img :height="50" v-if="text" :src="text" title="点击放大查看"/>
                    </viewer>
                  </span>
                <span slot="status" slot-scope="text, record">
                  <a-badge :color="text | statusTypeFilter" :text="text | statusFilter" /><br/>
                  <div v-if="text == 3" style="color: red;">{{record.msg_day}}</div>
                  <div v-if="text == 5" style="color: red;">{{record.record}}</div>
                </span>
                  <span slot="action" slot-scope="text, record">
<!--                    <a @click="$refs.createModalText.edit(record.id)">移动</a>-->
                  <a-divider type="vertical" />
                    <a-popconfirm
                      class="ant-dropdown-link"
                      title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="delAlertC(record.id)"
                      @cancel="cancel"
                    >
                      <a href="#">删除</a>
                    </a-popconfirm>
                </span>
                  <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="5" tab="功能库">
                <div style="margin: 10px;width: 1200px;height: 40px;">
                  <a-input-group compact style="width: 270px;float: left">
                    <a-input style="width: 200px;" v-model="queryParam.title" placeholder="可输入标题内容"/>
                  </a-input-group>
                  <a-button type="primary" @click="querys()" class="add-goods">查询</a-button>
                </div>
                <div class="board-content">
                  <a-button type="primary" class="add-goods" @click="$refs.createModalLibrary.add(gid,default_selected)">添加功能</a-button>
                </div>
                <a-table
                  style="margin: 10px"
                  v-if="contentList"
                  :columns="columns_library"
                  :data-source="contentList"
                  @change="tableChange"
                  :pagination="pagination"
                  :scroll="{ y: this.clientHeight - 230 }"
                  :loading="loading"
                >
                  <span slot="content" slot-scope="text">
                    <a :href="text" target="_blank">访问链接</a>
                  </span>
                  <span slot="status" slot-scope="text, record">
                    <a-badge :color="text | statusTypeFilter" :text="text | statusFilter" /><br/>
                    <div v-if="text == 3" style="color: red;">{{record.msg_day}}</div>
                    <div v-if="text == 5" style="color: red;">{{record.record}}</div>
                  </span>
                  <span slot="action" slot-scope="text, record">
                  <a @click="$refs.createModalLibrary.edit(record.id,gid,default_selected)">编辑</a>
<!--                  <a-divider type="vertical" />-->
<!--                    <a @click="moves(record.id)">移动</a>-->
                </span>
                  <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
                </a-table>
              </a-tab-pane>
            </a-tabs>
            <a-tabs v-if="channel_code" type="card" style="width: 100%" @change="switchType">
              <a-tab-pane key="3" tab="图片">
                <div style="margin: 10px;width: 1200px;height: 40px;">
                  <a-input-group compact style="width: 270px;float: left">
                    <a-input style="width: 200px;" v-model="queryParams.title" placeholder="可输入标题内容"/>
                  </a-input-group>
                  <a-button type="primary" @click="query_code()" class="add-goods">查询</a-button>
                  <a-button type="primary" class="add-goods"  @click="batchDelChannelCode()">批量删除</a-button>
                </div>
                <a-table
                  style="margin: 10px"
                  v-if="codeList"
                  :columns="columns_txt"
                  :row-selection="rowSelections"
                  :data-source="codeList"
                  @change="tableChanges"
                  :pagination="paginations"
                  :scroll="{ y: this.clientHeights - 230 }"
                  :loading="loadings"
                >
                  <span slot="content" slot-scope="text,record">
                    <img :height="50" :src="text"/>
                  </span>
                  <span slot="action" slot-scope="text, record">
                  <a-divider type="vertical" />
                    <a-popconfirm
                      class="ant-dropdown-link"
                      title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="delChannelCode(record.id)"
                      @cancel="cancel"
                    >
                      <a href="#">删除</a>
                    </a-popconfirm>
                </span>
                  <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
                </a-table>
              </a-tab-pane>
            </a-tabs>
          </div>
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
      <group-info :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
      <content-text :height='800' :width="1200" ref="createModalText" @ok="handleOksContent"/>
      <content-file :height='800' :width="1200" ref="createModalFile" @ok="handleOksFile"/>
      <function-library :height='800' :width="1200" ref="createModalLibrary" @ok="handleOksLibrary"/>
      <import-txt :height='800' :width="1200" ref="createModalImport" @ok="handleOkImport"/>
    </a-layout>
  </div>
</template>

<script>
    const treeData = [
        {
            title: 'parent 1',
            key: '0-0-1',
            children: [
                { title: 'leaf', key: '0-1-1','id':1},
                { title: 'leaf', key: '0-1-2','id':2},
            ],
        },
        {
            title: 'parent 2',
            key: '0-0-2',
            children: [
                { title: 'leaf', key: '0-2-1'},
                { title: 'leaf', key: '0-2-2'},
            ],
        },
    ];
    import DragBox from '@/components/DragBox/DragBox'
    import moment from 'moment';
    import villageApi from '@/api/community/village'
    import groupInfo from "./groupInfo";
    import contentText from "./contentTextInfo";
    import contentFile from "./contentFileInfo";
    import functionLibrary from "./functionLibraryInfo";
    import importTxt from "./contentImportTxt";
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
    let id=0;
    export default {
        name: 'engineIndex',
        components: {
            DragBox,
            groupInfo,
            contentText,
            contentFile,
            functionLibrary,
            importTxt,
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
                    gid: '0',
                    title:'',
                },
                queryParams: {
                    gid: '0',
                    title:'',
                },
                // 表头
                columns: [
                    {
                        title: '全选',
                        dataIndex: 'num',
                        width: '5%',
                    },
                    {
                        title: '标题',
                        dataIndex: 'title',
                        width: '12%',
                    },
                    {
                        title: '内容',
                        dataIndex: 'content',
                        width: '12%',
                        scopedSlots: { customRender: 'content' },
                    },
                    {
                        title: '上传者',
                        dataIndex: 'user',
                        width: '12%',
                    },
                    {
                        title: '所属组',
                        dataIndex: 'name',
                        width: '12%',
                    },
                    {
                        title: '类型',
                        dataIndex: 'type',
                        width: '12%',
                        scopedSlots: { customRender: 'type' },
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'add_time',
                        width: '15%',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: '12%',
                        scopedSlots: {
                            customRender: 'action',
                        },
                    },
                ],
                columns_txt: [
                    {
                        title: '全选',
                        dataIndex: 'num',
                        width: '5%',
                    },
                    {
                        title: '标题',
                        dataIndex: 'title',
                        width: '12%',
                    },
                    {
                        title: '内容',
                        dataIndex: 'content',
                        width: '12%',
                        scopedSlots: { customRender: 'content' },
                    },
                    {
                        title: '上传者',
                        dataIndex: 'user',
                        width: '12%',
                    },
                    {
                        title: '所属组',
                        dataIndex: 'name',
                        width: '12%',
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'add_time',
                        width: '15%',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: '12%',
                        scopedSlots: {
                            customRender: 'action',
                        },
                    },
                ],
                columns_library: [
                    {
                        title: '标题',
                        dataIndex: 'title',
                        width: '12%',
                    },
                    {
                        title: '内容',
                        dataIndex: 'content',
                        width: '12%',
                        scopedSlots: { customRender: 'content' },
                    },
                    {
                        title: '上传者',
                        dataIndex: 'user',
                        width: '12%',
                    },
                    {
                        title: '所属组',
                        dataIndex: 'name',
                        width: '12%',
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'add_time',
                        width: '15%',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: '12%',
                        scopedSlots: {
                            customRender: 'action',
                        },
                    },
                ],
                data,
                sortList,
                contentList: [],
                type: 0,
                clientHeight: 0,
                loading: false,
                sortLoading: false,
                treeData,
                gid:0,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                imgUrl:require("@/assets/images/blank.png"),
                id_arr:[],
                first_gid:'',
                default_selected:'',
                autoExpandParent: true,
                expandedKeys:[],
                channel_code:false,
                codeList:[],
                paginations: { pageSize: 10, total:10 },
                searchs: { page: 1 },
                pages: 1,
                loadings: false,
                clientHeights: 0,
                id_arr_c:[],
                total_sum_number:'',
                total_sum_numbers:'',
                tokenName: '',
                sysName: ''
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
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
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
                        console.log('selectedRowKeys: ',selectedRowKeys);
                        if(selectedRowKeys){
                            this.id_arr = selectedRowKeys;
                        }else{
                            this.id_arr = [];
                        }
                    },
                    getCheckboxProps: record => ({
                        props: {
                            //disabled: record.is_exist === 1, // Column configuration not to be checked
                        },
                    }),
                };
            },
            rowSelections() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRows: ',selectedRows);
                        console.log('selectedRowKeys: ',selectedRowKeys);
                        if(selectedRowKeys){
                            this.id_arr_c = selectedRowKeys;
                        }else{
                            this.id_arr_c = [];
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
            onExpand(expandedKeys) {
              console.log('onExpand', expandedKeys);
              this.expandedKeys = expandedKeys;
              this.autoExpandParent = false;
            },
            onSelect(selectedKeys, info) {
                console.log('111111111',selectedKeys);
                this.page = 1;
                this.pages = 1;
                this.searchs.page = 1;
                if(selectedKeys[0] || this.default_selected) {

                    if(this.default_selected && selectedKeys.length===0){
                        selectedKeys[0] = this.default_selected;
                    }else{
                        this.default_selected = selectedKeys[0];
                    }
                    let new_arr = selectedKeys[0].split('-');
                    console.log('new_arr',new_arr);
                    if (new_arr[2] > 0) {
                        this.queryParam.gid = new_arr[2];
                        this.gid = this.queryParam.gid;
                        this.default_selected =selectedKeys[0];
                        this.getContentList();
                    } else{
                        if(new_arr.length === 2 && new_arr[0]>0){
                            this.queryParam.gid = '';
                            this.gid = this.first_gid;
                            this.getContentList();
                        }else if(new_arr.length === 2 && new_arr[1]>0){
                            //渠道码
                            this.default_selected = selectedKeys[0];
                            this.channel_code=true;
                            this.getChannelCodeList();
                        }
                    }

                }else{
                    this.queryParam.gid = '';
                    this.gid = this.first_gid;
                    this.getContentList();
                }

            },
            switchType(activeKey)
            {
                console.log('activeKey',activeKey-1);
                this.type = activeKey-1;
                this.queryParam.title = '';
                this.getContentList();
            },
            handleOks(vals) {
                console.log('valssssssssss',vals);
                this.default_selected=vals.select_key;
                this.queryParam['gid'] =vals.gid;
                this.getSortList();
            },
            handleOksContent(vals) {
                this.default_selected=vals.select_key;
                this.queryParam['gid'] =vals.gid;
                this.getSortList();
            },
            handleOksFile(vals) {
                this.default_selected=vals.select_key;
                this.queryParam['gid'] =vals.gid;
                this.getSortList();
            },
            handleOksLibrary(vals) {
                this.default_selected=vals.select_key;
                this.queryParam['gid'] =vals.gid;
                this.getSortList();
            },
            handleOkImport(vals){
                this.default_selected=vals.select_key;
                this.queryParam['gid'] =vals.gid;
                this.getSortList();
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getContentList()
                }
            },
            tableChanges(e) {
                if (e.current && e.current>0) {
                    this.pages = e.current;
                    this.getChannelCodeList()
                }
            },
            //批量移动
            batchMove() {

            },
            //批量删除
            batchDel() {
              console.log('id_arr',this.id_arr);
               if(this.id_arr.length>0){
                   var _this = this;
                   this.$confirm({
                       title: '提示',
                       content: '您确定要删除吗？',
                       okText: '是',
                       okType: 'danger',
                       cancelText: '否',
                       onOk() {
                            let param = {
                                'id': _this.id_arr
                            };
                            if (_this.tokenName) {
                                param['tokenName'] = _this.tokenName;
                            }
                           _this.request(villageApi.delContent, param).then((res) => {
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
               }else{
                   this.$confirm({
                       title: '提示',
                       content: '请选择要删除的内容',
                       okText: '是',
                       okType: 'danger',
                       cancelText: '否',
                       onOk() {},
                       onCancel() {
                           console.log('Cancel');
                       },
                   });
               }
            },
            getSortList() {
                console.log('222', this.queryParam)
                this.sortLoading = true
                this.sortList = []
                if (this.tokenName) {
                    this.queryParam['tokenName'] = this.tokenName;
                }
                this.request(villageApi.engineMenuList, this.queryParam).then((res) => {
                    this.sortLoading = false
                    this.treeData = res.menu_list;
                    this.first_gid = res.menu_list[0].id;
                    this.gid = res.menu_list[0].children[0].id;
                    if(res && res.key.length>0 ){
                        if(!this.default_selected){
                            // this.default_selected = res.key_one;
                            this.default_selected = res.menu_list[0].children[0].key;
                            this.queryParam['gid'] = this.first_gid;
                            this.total_sum_numbers = res.total_sum_number;
                        }
                        this.expandedKeys = res.key;
                        if (res && res.choose_data) {
                          this.default_selected = res.choose_data
                        } else {
                          this.default_selected =this.first_gid;
                        }

                        console.log('this.default_selected',this.default_selected);
                        this.getContentList();
                    }

                })
            },
            // 获得列表
            getContentList(changeTab = true) {
                console.log('11111', this.queryParam)
                this.loading = true;
                this.queryParam['page'] = this.page;
                this.queryParam['type'] = this.type;
                if (this.tokenName) {
                    this.queryParam['tokenName'] = this.tokenName;
                }
                this.request(villageApi.getContentList, this.queryParam).then((res) => {
                    this.contentList = res.list;
                    console.log(res.list);
                    if (changeTab) {
                        this.tabColumn = res.tabs
                    }
                    if(res.list && res.list.length>0) {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10

                    }
                    if(res.title_number){
                        this.total_sum_number = res.title_number;
                    }else{
                        this.total_sum_number =this.total_sum_numbers;
                    }
                    this.loading = false
                })
            },
            // 获取渠道码列表
            getChannelCodeList(changeTab = true) {
                console.log('11111', this.queryParams)
                this.loadings = true;
                this.queryParams['page'] = this.page;
                if (this.tokenName) {
                    this.queryParam['tokenName'] = this.tokenName;
                }
                this.request(villageApi.getChannelCodeList, this.queryParams).then((res) => {
                    this.codeList = res.list;
                    console.log(res.list);
                    if (changeTab) {
                        this.tabColumn = res.tabs
                    }
                    if(res.list && res.list.length>0) {
                        this.paginations.total = res.count ? res.count : 0
                        this.paginations.pageSize = res.total_limit ? res.total_limit : 10
                    }
                    this.loadings = false
                })
            },
            //批量删除渠道码
            batchDelChannelCode() {
                if(this.id_arr.length>0){
                    var _this = this;
                    this.$confirm({
                        title: '提示',
                        content: '您确定要删除吗？',
                        okText: '是',
                        okType: 'danger',
                        cancelText: '否',
                        onOk() {
                            let param = {
                                'id': this.id_arr_c
                            };
                            if (this.tokenName) {
                                param['tokenName'] = this.tokenName;
                            }
                            _this.request(villageApi.delChannelCode, param).then((res) => {
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
                }else{
                    this.$confirm({
                        title: '提示',
                        content: '请选择要删除的内容',
                        okText: '是',
                        okType: 'danger',
                        cancelText: '否',
                        onOk() {},
                        onCancel() {
                            console.log('Cancel');
                        },
                    });
                }
            },
            //单个删除渠道码数据
            delChannelCode(id) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除吗？',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        let param = {
                            'id': this.id_arr_c
                        };
                        if (this.tokenName) {
                            param['tokenName'] = this.tokenName;
                        }
                        _this.request(villageApi.delChannelCode, param).then((res) => {
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
            cancel() {},
            querys() {
                console.log('search', this.queryParam);
                this.getContentList()
            },
            query_code() {
                console.log('search', this.queryParams);
                this.getChannelCodeList()
            },
            // 进行重置
            resetList() {
                this.queryParam.num = '';
                this.queryParam.status = '';
                this.queryParam.time = '';
                this.start_time = '';
                this.end_time = '';
                this.getContentList()
            },
            //删除分组
            delAlert(id) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除该分组吗？',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        _this.delNav(id);
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
            delNav(id){
                let param = {
                    'id': id
                };
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(villageApi.delGroup, param).then((res) => {
                    if(res)
                    {
                        this.$message.success('操作成功');
                        this.getSortList();
                    }else{
                        this.$message.error('操作失败');
                    }
                })
            },
            //单个删除数据
            delAlertC(id) {
                var _this = this;
                this.$confirm({
                    title: '提示',
                    content: '您确定要删除吗？',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        _this.delContent(id);
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
            delContent(id){
                let param = {
                    'id': id
                };
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(villageApi.delContent, param).then((res) => {
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
<style>
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
  .content-p{
    border: 1px solid rgb(235, 237, 240);background-color: #ffffff;width: 110%;margin-left: -25px;
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
  .content_text-text{
    width:100px;
    height:80px;
    line-height:25px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    cursor:pointer;
  }
</style>
