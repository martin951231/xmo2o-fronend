<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
      <a-row>
        <a-col :span="8">
          <a-input
            placeholder="商城名称"
            style="width: 300px"
            v-model="queryParams.title"
            @search="onSearch"
          />
          <a-button type="primary" style="margin: 10px 10px" @click="onSearch">
            {{ L('搜索') }}
          </a-button>
          <!-- <a-button type="primary" style="margin: 10px 10px" @click="addShoppingMall">
              {{ L('创建商场') }}
          </a-button> -->
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
        <span slot="status" slot-scope="text, item">
            <a-switch v-if="text == 1"  @change="onChangeStatus(item.id)" checked-children="开启" un-checked-children="关闭" default-checked />
            <a-switch v-else  @change="onChangeStatus(item.id)" checked-children="开启" un-checked-children="关闭"/>
        </span>

        <span slot="operate" slot-scope="text,item">
            <a @click="show(item.id)">{{ L('查看') }}</a>
        </span>

        <span slot="bind_store" slot-scope="text,item">
            <a @click="bindStore(item.id)">{{ L('管理') }}</a>
        </span>

        <span slot="bind_admin_user" slot-scope="text,item">
            <a @click="bindAdminUser(item.id)">{{ L('管理') }}</a>
        </span>

        <span slot="shopping_mall_center" slot-scope="text,item">
            <a @click="goCenter(item.id)">{{ L('访问') }}</a>
        </span>

        <span slot="mobile_preview" slot-scope="text,item">
            <a @click="goMobilePreview(item)">{{ L('查看') }}</a>
        </span>
      </a-table>

      <!-- 移动端预览 -->
      <a-modal v-model:visible="mobilePreviewVisible" title="移动端" :footer="null">
         <div class="content">
          <div class="code-box">
            <div class="code">
              <img :src="wxappQrcode" v-if="wxappQrcode" />
              <div>{{ L('小程序') }}</div>
            </div>
            <div class="code">
              <img :src="h5Qrcode" v-if="h5Qrcode" />
              <div>{{ L('H5链接') }}
                <a-icon type="copy" theme="outlined"  v-clipboard:copy="h5Url" v-clipboard:success="copySuccess" v-clipboard:error="copyError"/>  
              </div>
            </div>
          </div>
        </div>
      </a-modal>

      <!-- 查看详情 -->
      <a-drawer
        title="查看详情"
        :width="750"
        :visible="showDrawerVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="closeShowDrawer"
      >
        <shoppingMallDetail v-if="showDrawerVisible" :mall_id="showId" @cancel="closeShowDrawer"/>
      </a-drawer>


      <a-drawer
        title="绑定管理员"
        :width="750"
        :visible="showBindAdminUserVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="closeShowDrawer"
      >
        <bindAdminUser v-if="showBindAdminUserVisible" :mall_id="showId" @cancel="closeShowDrawer"/>
      </a-drawer>

      <a-drawer
        :title="L('创建商场')"
        :width="750"
        :visible="showAddDrawerVisible"
        :body-style="{ paddingBottom: '5px' }"
        @close="closeShowDrawer"
      >
        <EditShoppingMall v-if="showAddDrawerVisible" @refreshList="refreshList"/>
      </a-drawer>
    </div>
  </template>
  
  <script>
  import buildingPlatformApi from '@/api/building/index'
  import shoppingMallDetail from '../modules/shoppingMallDetail'
  import bindAdminUser from '../modules/bindAdminUser'
  import EditShoppingMall from '@/views/building/modules/editShoppingMall'

  export default {
    components: {
        shoppingMallDetail,
        bindAdminUser,
        EditShoppingMall
    },
  
    data() {
      return {
        //查看详情
        showId:0,
        showDrawerVisible:false,
        showAddDrawerVisible:false,
        //查看绑定店铺
        showBindShopVisible:false,

        //查看绑定的管理员
        showBindAdminUserVisible:false,

        //移动端预览
        mobilePreviewVisible:false,
        wxappQrcode: '',
        h5Qrcode: '',
        h5Url : '',

        dataList:[],
        pagination: {
          pageSize: 10,
          total: 0,
          showTotal: (total) => `共 ${total} 条记录`,
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
            title: this.L('商场名称'),
            dataIndex: 'name',
          },
          {
            title: this.L('简称'),
            dataIndex: 'short_name',
          },
          {
            title: this.L('详细地址'),
            dataIndex: 'address',
          },
          // {
          //   title: this.L('联系电话'),
          //   dataIndex: 'phone',
          // },
          // {
          //   title: this.L('负责人'),
          //   dataIndex: 'director',
          // },
          {
            title: this.L('状态'),
            dataIndex: 'status',
            scopedSlots: {
              customRender: 'status',
            },
          },
          {
            title: this.L('绑定管理员'),
            dataIndex: 'bind_admin_user',
            scopedSlots: {
              customRender: 'bind_admin_user',
            },
          },
          {
            title: this.L('商场后台'),
            dataIndex: 'shopping_mall_center',
            scopedSlots: {
              customRender: 'shopping_mall_center',
            },
          },
          {
            title: this.L('移动端'),
            dataIndex: 'mobile_preview',
            scopedSlots: {
              customRender: 'mobile_preview',
            },
          },
          {
            title: this.L('更新时间'),
            dataIndex: 'update_time',
          },
          {
            title: this.L('操作'),
            dataIndex: 'id',
            scopedSlots: {
              customRender: 'operate',
            },
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
      closeShowDrawer(){
        this.showId = 0;
        this.showDrawerVisible = false;
        this.showBindShopVisible = false;
        this.showBindAdminUserVisible = false;
        this.showAddDrawerVisible = false;
      },
      //切换商场状态
      onChangeStatus(id) {
        this.request(buildingPlatformApi.changeShoppingMallStus, {id:id}).then((res) => {
            this.getLists()
        })
      },
      //获取商场列表
      getLists() {
        this.queryParams.page_size = this.pagination.pageSize
        this.queryParams.page = this.pagination.current
        this.request(buildingPlatformApi.getShoppingMallLists, this.queryParams).then((res) => {
          this.dataList = res.data
          this.pagination.total = res.total
        })
      },
      refreshList() {
        this.showAddDrawerVisible = false
        this.pagination.current = 1
        this.getLists()
      },
      // 切换表格分页
      changePage(page, pageSize) {
        this.pagination.current = page.current
        this.getLists()
      },
  
      // 搜索
      onSearch() {
        this.pagination.current = this.pagination.page = 1;
        this.getLists()
      },

      //查看
      show(id){
        this.showId = id;
        this.showDrawerVisible = true;
      },
      //查看绑定的店铺
      bindStore(id){
        this.showId = id;
        this.showBindShopVisible = true;
      },
      //查看绑定的管理员
      bindAdminUser(id){
        this.showId = id;
        this.showBindAdminUserVisible = true;
      },
      goDecorate(id){
        this.$router.replace({
          path: '/system/building.platform/decorate'
        })
      },
      goCenter(id){
        let url = window.location.origin + window.location.pathname  + '#/dialog/building.platform/login?mall_id='+id;
        window.open(url);
      },
      addShoppingMall() {
        this.showAddDrawerVisible = true;
      },
      //移动端预览
      goMobilePreview(item){
        this.wxappQrcode = this.h5Qrcode = this.h5Url = '';

        this.wxappQrcode = item.wxapp_qrcode||'';
        this.h5Qrcode = item.h5_qrcode||'';
        this.h5Url = item.h5_url||'';
        this.mobilePreviewVisible = true;
      },
      copyError() {
        this.$message.error('复制失败！')
      },
      copySuccess() {
        this.$message.success('复制成功！')
      },
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
  .content {
  overflow: hidden;
}
.code-box {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.code {
  margin: 10px 20px;
}
.code img {
  width: 180px;
  height: 180px;
  margin-bottom: 0.5rem;
}
  </style>