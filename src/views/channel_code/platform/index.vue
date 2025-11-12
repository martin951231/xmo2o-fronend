<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
      <a-row>
        <a-col :span="8">
          <a-input
            placeholder="请输入渠道码标题"
            style="width: 300px"
            v-model="queryParams.title"
            @search="onSearch"
          />
          <a-button type="primary" style="margin: 10px 10px" @click="onSearch">
            {{ L('搜索') }}
          </a-button>
        </a-col>
        <a-col :span="8" :offset="8">
          <a-button type="primary" style="margin: 10px 10px; float: right" @click="addChannelCode">
            {{ L('创建渠道码') }}
          </a-button>
        </a-col>
      </a-row>
  
      <a-table
        style="background: #ffffff;margin-top: 20px"
        :columns="columns"
        rowKey="id"
        :data-source="dataList"
        @change="changePage"
        :pagination="pagination"
      >

      <span slot="reply_type" slot-scope="text">
        <span v-if="text == 0">文字内容</span>
        <span v-else>图文内容</span>
      </span>

      <span slot="qrcode_type" slot-scope="text">
        <span v-if="text == 0">永久</span>
        <span v-else>临时</span>
      </span>

      <span slot="qrcode" slot-scope="text,item">
        <a-icon type="qrcode" style="font-size: 1rem;" @click="showQrcode(item)"/>
      </span>

      <span slot="status" slot-scope="text, item">
        <a-switch v-if="text == 1"  @change="onChangeStatus(item.chanel_id)" checked-children="开启" un-checked-children="关闭" default-checked />
        <a-switch v-else  @change="onChangeStatus(item.chanel_id)" checked-children="开启" un-checked-children="关闭"/>
      </span>

        <!-- 操作栏 -->
        <span slot="operate" slot-scope="text,item">
          <a @click="editChannelCode(item.chanel_id)">{{ L('编辑') }}</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除渠道码吗，删除后无法恢复?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="delChannelCode(item.chanel_id)"
          >
            <a>{{ L('删除') }}</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            {{ L('更多') }}  <a-icon type="down" />
          </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a :href="item.qrcode" target="_blank">下载渠道码</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="showStatisticsData(item)">统计数据</a>
              </a-menu-item>
            </a-menu>
        </a-dropdown>
        </span>
      </a-table>

      <a-drawer
        :title="drawerTitle"
        :width="750"
        :visible="drawerVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="closeDrawer"
      >
        <add-channel-code v-if="drawerVisible" :channel_id="channel_id" @cancel="closeDrawer" @refresh="getLists"/>
      </a-drawer>

      <!-- 预览 -->
      <a-modal
          :title="L('二维码')"
          :visible="qrcodePreviewVisible"
          :destroyOnClose="true"
          :footer="null"
          :width="550"
          @cancel="qrcodePreviewVisible = false"
          >
          <div class="mt-10 flex align-center justify-center">
              <img class="codeImg" :src="qrcodeUrl" alt="">
          </div>
      </a-modal>

      <!-- 数据统计 -->
      <a-drawer
        title="统计数据"
        :width="1000"
        :visible="statisticsVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="statisticsVisible = false"
      >
        <statistics-data v-if="statisticsVisible" :statiistics_item="statiistics_item"/>
      </a-drawer>
      
    </div>
  </template>
  
  <script>
  import channelCodeApi from '@/api/channel_code/index'

  import addChannelCode from  '../modules/add.vue'
  import statisticsData from  '../modules/statistics.vue'

  export default {
    components: {
      addChannelCode,
      statisticsData
    },
  
    data() {
      return {
        channel_id:0,
        drawerVisible:false, //创建编辑渠道码盒子
        drawerTitle : '创建渠道码',
        selectedRowKeys: [], // 选中的数据列表
        dataList: [], // 列表
        qrcodePreviewVisible:false,
        qrcodeUrl:'',

        statiistics_item:0,
        statisticsVisible:false,

        pagination: {
          pageSize: 10,
          total: 0,
          current: 1,
          page: 1,
        },
        queryParams: {
          page_size: 0,
          page: 1,
          title: '',
        },
        columns: [
          {
            title: this.L('ID'),
            dataIndex: 'chanel_id',
            width:200
          },
          {
            title: this.L('渠道码标题'),
            dataIndex: 'title',
            width:200
          },
          {
            title: this.L('有效期'),
            dataIndex: 'qrcode_type',
            scopedSlots: {
              customRender: 'qrcode_type',
            },
            width:200
          },
          {
            title: this.L('回复内容'),
            dataIndex: 'reply_type',
            scopedSlots: {
              customRender: 'reply_type',
            },
            width:200
          },
          {
            title: this.L('二维码'),
            dataIndex: 'qrcode',
            scopedSlots: {
              customRender: 'qrcode',
              },
              width:200
            },
          {
            title: this.L('状态'),
            dataIndex: 'status',
            scopedSlots: {
              customRender: 'status',
            },
            width:200
          },
          {
            title: this.L('最后修改时间'),
            dataIndex: 'last_time',
            width:200
          },
          {
            title: this.L('操作'),
            dataIndex: 'id',
            scopedSlots: {
              customRender: 'operate',
            },
            width:200
          },
        ],
      }
    },
    watch: {
      $route() {
        this.getLists()
      },
    },
    mounted() {
      this.getLists()
    },
    methods: {
      onChangeStatus(channel_id) {
        this.request(channelCodeApi.platformChangeStatus, {chanel_id:channel_id}).then((res) => {
          this.getLists()
        })
      },
      // 数据列表
      getLists() {
        this.queryParams.page_size = this.pagination.pageSize
        this.queryParams.page = this.pagination.current
        this.request(channelCodeApi.platformList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.pagination.total = res.total
        })
      },
  
      // 切换表格分页
      changePage(page, pageSize) {
        this.pagination.current = page.current
        this.getLists()
      },
  
      // 搜索活动名称
      onSearch() {
        this.getLists()
      },
      // 新建列表
      addChannelCode() {
        this.drawerTitle = '创建渠道码';
        this.channel_id = 0;
        this.drawerVisible = true;
      },
      editChannelCode(channel_id){
        this.drawerTitle = '编辑渠道码';
        this.channel_id = channel_id;
        this.drawerVisible = true;
      },
      delChannelCode(channel_id){
        this.request(channelCodeApi.platformDel, {chanel_id:channel_id}).then((res) => {
          this.getLists()
        })
      },
      showQrcode(item){
        this.qrcodePreviewVisible = true;
        this.qrcodeUrl = item.qrcode;
      },
      showStatisticsData(item){
        this.statiistics_item = item;
        this.statisticsVisible = true;
      },
      closeDrawer(){
        this.drawerVisible = !this.drawerVisible;
      }
    },
  }
  </script>
  <style>
  .copyInput {
    display: flex;
    align-items: center;
  }
  .copyInput button{
    margin-left: 10px;
  }
  </style>