<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10" style="min-height: 800px;">
    <a-tabs default-active-key="1" @change="tabChange">
      <!-- 微信小程序直播权限申请 -->
      <a-tab-pane key="1" :tab="'设置主播'">
        <a-alert :message="`每个商家支持设置${roles_limit}名主播，请严格按照直播规范，否则系统将回收您的直播权限并做出相应惩罚措施`" type="info" show-icon />

        <div style="display: flex;flex-wrap: wrap;">
          <div v-for="item in roles" class="role-div">
            <img style="width: 150px;" :src="item.headingimg"/>
            <div style="padding-left: 1rem;">
              <p>昵称：{{item.nickname}}</p>
              <p>微信号：{{item.wechat_id}}</p>
              <p>更新时间：{{item.updateTimestamp}}</p>
              <a-popconfirm placement="rightBottom" title="确定删除该主播？" ok-text="确定" cancel-text="取消" @confirm="deleteRole(item.id)">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a-button type="danger">删除</a-button>
              </a-popconfirm>
            </div>
          </div>

          <div v-if="roles.length < roles_limit" class="role-div">
            <a-icon @click="$refs.liveRoleModal.addRole()" type="plus" class="role-plus" />
          </div>
        </div>
        <live-role ref="liveRoleModal" @updateRolesList="getRoles()" />
      </a-tab-pane>


      <a-tab-pane key="3" :tab="'商品库'">
      <!-- 筛选 -->
      <a-alert :message="`每个商家最多支持${goodsLimitCount}个商品入库，还可以添加${leftCount}个商品。商品审核状态系统每隔5分钟自动同步一次，请耐心等待。`" type="info" show-icon />
      <a-row type="flex" style="margin-top:1rem;margin-bottom: 1rem;">
        <a-col>
          <span>商品名称：</span>
          <a-input style="width: 200px" v-model="queryParams.goods_name" placeholder="请输入名称" />
        </a-col>
        <a-col>
          <span>&nbsp;&nbsp;类型：</span>
            <a-select style="width: 120px" v-model="queryParams.goods_type">
              <a-select-option :value="item.key" v-for="(item, index) in option1" :key="item.key">{{
                item.label
              }}</a-select-option>
            </a-select>
        </a-col>
        <a-col>
          <span>&nbsp;&nbsp;订单状态：</span>
            <a-select style="width: 120px" v-model="queryParams.check_status">
              <a-select-option :value="item.key" v-for="(item, index) in option2" :key="item.key">{{
                item.label
              }}</a-select-option>
            </a-select>
        </a-col>
        <a-col :span="8">
          <a-button type="primary" icon="search" style="margin-left: 1rem;" @click="search(1)">搜索</a-button>
          <a-button style="margin-left: 1rem;" @click="search(0)">重置</a-button>
          <a-button v-if="leftCount > 0" type="primary" style="margin-left: 1rem;" @click="addClick">{{ L('添加商品') }}</a-button>
          <a-button v-else style="margin-left: 1rem;" disabled>{{ L('添加商品') }}</a-button>
        </a-col>
          
      </a-row>
      <!-- 数据列表 -->
      <a-table
        style="background: #ffffff"
        :columns="columns"
        rowKey="id"
        :data-source="dataList"
        :pagination="pagination"
      >
        <span slot="path" slot-scope="path">
            <a-tooltip placement="topRight">
              <template slot="title">
                <span>{{path}}</span>
              </template>
              <a-icon type="eye" :style="{ fontSize: '18px'}"/>
              
            </a-tooltip>

            <a-tooltip placement="topRight" @visibleChange="getWxappCode(path)">
              <template slot="title">
                <img style="width: 200px" :src="goodsWxQrcode" />
                <p style="margin-top: 0.5rem;text-align: center;">用微信扫码预览该商品</p>
              </template>
              <a-icon type="qrcode" :style="{ fontSize: '18px',marginLeft:'1rem'}"/>
            </a-tooltip>
        </span>

        <span slot="goods_image" slot-scope="text, record">
          <img style="width: 100px;" :src="record.goods_image"/>
        </span>

        <span slot="goods_type" slot-scope="text, record">
          <span v-if="record.goods_type == 'mall'">商城</span>
          <span v-else-if="record.goods_type == 'shop'">外卖</span>
          <span v-else-if="record.goods_type == 'group'">团购</span>
          <span v-else>未知</span>
        </span>

        <span slot="price" slot-scope="text, record">
          <span v-if="record.price_type == 1">{{ record.price }}</span>
          <span v-else-if="record.price_type == 2">{{ record.price }}-{{ record.price2 }}元</span>
          <span v-else-if="record.price_type == 3">市场价：{{ record.price }}<br/>现价：{{ record.price2 }}</span>
          <span v-else>未知</span>
        </span>

        <span slot="check_status" slot-scope="text, record">
          <span v-if="record.check_status == 0" style="color: #faad14">未审核</span>
          <span v-else-if="record.check_status == 1" style="color: #faad14">审核中</span>
          <span v-else-if="record.check_status == 2" style="color: #52c41a">审核通过</span>
          <span v-else style="color: red">审核失败</span>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-switch
            @change="switchChange($event, record)"
            checked-children="开"
            un-checked-children="关"
            :disabled="record.platform_status == 2 || record.check_status == 1 ? true : false"
            :defaultChecked="record.status == 1 ? true : false"
          />
        </span>
        <!-- 操作栏 -->
        <span slot="operation" slot-scope="text, record">
          <a-popconfirm placement="rightBottom" title="删除后直播间上架的该商品也将被同步删除，不可恢复，是否确认？" ok-text="确定" cancel-text="取消" @confirm="delList(record)">
            <a v-if="record.check_status == 2 || record.check_status == 3" style="color: red; margin-left: 10px" class="inline-block">{{ L('删除') }}</a>
          </a-popconfirm>
          
        </span>
      </a-table>
      </a-tab-pane>


      <a-tab-pane key="2" :tab="'直播间'">
        <a-alert message="直播间数据来源于微信小程序直播，系统自动同步，每5分钟同步一次状态，请耐心等待。" type="info" show-icon />
        <a-button type="primary" @click="$refs.liveRoomModal.addRoom()" style="margin-top: 1rem;margin-bottom: 1rem;">微信扫码直播</a-button>

        <a-table
          style="background: #ffffff"
          :columns="roomColumns"
          :data-source="roomDataList"
          :pagination="roomPagination"
        >
        <span slot="start_date" slot-scope="text, record">
          <a-timeline>
            <a-timeline-item>开始：{{ record.start_date }}</a-timeline-item>
            <a-timeline-item color="red">结束：{{record.end_date}}</a-timeline-item>
          </a-timeline>
        </span>

        <span slot="room_detail" slot-scope="text, record">
          <div style="display:flex;width:500px;padding:0.5rem 0.5rem 0.5rem 0">
            <img style="width: 150px;height:120px" :src="record.share_img"/>
            <div style="padding-left: 1rem;">
              <p style="font-weight:bold;font-size:1.2rem">{{record.name}}</p>
              <p>房间号：{{record.roomid}}</p>
              <p>主播：{{record.anchor_name}}</p>
            </div>
          </div>
        </span>

        <span slot="room_operate" slot-scope="text, record">
          <a @click="$refs.liveRoomShareModal.addRoomShare(record.roomid)">分享</a>
          <a-popconfirm placement="rightBottom" title="直播间删除后不可恢复，是否确认？" ok-text="确定" cancel-text="取消" @confirm="delRoom(record.roomid)">
            <a style="margin-left:1rem;color:red">删除</a>
          </a-popconfirm>
        </span>
        </a-table>

        <live-room ref="liveRoomModal"></live-room>
        <live-room-share ref="liveRoomShareModal"/>
      </a-tab-pane>
    </a-tabs>
    

    <!-- 添加商品编辑弹窗 -->
    <a-modal
      @ok="addShop"
      :centered="true"
      :maskClosable="false"
      destroyOnClose
      width="40%"
      v-model="shopVisible"
      :confirm-loading="confirmLoading"
      title="添加商品"
    >
      <div class="newBox" style="overflow-y: auto">
        <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" :model="form" :rules="rules" ref="ruleForm">
          <a-form-model-item label="选择商品库商品" prop="goods_id">
            <a-button :disabled="lsitType == 'edit' ? true : false" type="primary" @click="openShopList()"
              >选择商品</a-button
            >
          </a-form-model-item>
          <a-form-model-item label="商品名称" prop="goods_name">
            <a-input
              :disabled="lsitType == 'edit' ? true : false"
              style="width: 360px"
              v-model="form.goods_name"
              placeholder="商品名称"
            />
          </a-form-model-item>
          <a-form-model-item label="商品封面图" prop="goods_image">
            <a-upload
              :disabled="lsitType == 'edit' ? true : false"
              action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
              :data="{ upload_dir: 'liveBroadcast/pictures' }"
              list-type="picture-card"
              name="reply_pic"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <div style="color: #888">建议尺寸：300像素 * 300像素，图片大小不得超过1M</div>
          </a-form-model-item>
          <a-form-model-item label="价格形式" prop="price_type">
            <a-radio-group name="radioGroup" :default-value="1" :disabled="lsitType == 'edit' ? true : false" @change="changePriceType">
              <a-radio :value="item.id" v-for="item in priceType" :key="item.id">{{ item.label }}</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-show="form.price_type == 1" label="价格" prop="price">
            <a-input-number v-model="form.price" :min="0" :step="0.1" />
          </a-form-model-item>
          <a-form-model-item v-show="form.price_type == 2" label="价格区间">
            <a-input type="number" style="width: 80px;" v-model="form.price" :min="0" :step="0.1" /> &nbsp;至&nbsp;
            <a-input type="number" style="width: 120px;" addon-after="元" v-model="form.price2" :min="0" :step="0.1" /> 
          </a-form-model-item>
          <a-form-model-item  v-show="form.price_type == 3" label="折扣区间">
            <a-input type="number" style="width: 200px;" addon-before="市场价" addon-after="元" v-model="form.price" :min="0" :step="0.1" /> 

            <a-input type="number" style="width: 200px;margin-left: 1rem;" addon-before="现价" addon-after="元" v-model="form.price2" :min="0" :step="0.1" /> 
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>

    <!-- 新建弹框 -->
    <a-drawer
            title="商品列表"
            width="40%"
            :visible="visible"
            @close="closeGoodsDrawer()"
        >
        <a-row type="flex" style="margin-bottom: 1rem;">
          <a-col>
            <span>商品名称：</span>
            <a-input style="width: 200px;" v-model="addQueryParams.goods_name" placeholder="请输入商品名称" />
          </a-col>
          <a-col>
              <span>&nbsp;&nbsp;类型：</span>
              <a-select style="width: 120px" :default-value="option3[0].label" @change="handleChange1">
                <a-select-option :value="item.key" v-for="(item, index) in option3" :key="item.key">{{
                  item.label
                }}</a-select-option>
              </a-select>
          </a-col>
          <a-col>
            <a-button type="primary" style="margin-left: 1rem;" icon="search" @click="search(2)">搜索</a-button>
            <a-button type="primary" style="margin-left: 1rem;" @click="addListSubmit()">选择</a-button>
          </a-col>
        </a-row>
        <!-- 数据列表 -->
        <a-table
          style="background: #ffffff"
          :columns="columns1"
          rowKey="goods_id"
          :data-source="dataAddList"
          :pagination="pagination1"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys1,
            onChange: onParkingChange1,
          }"
        >
            <span slot="goods_name" slot-scope="text, record" >
                <img style="width: 64px;height: 64px;" :src="record.cover_image"> <br/>
                <span style="word-wrap: break-word;">{{ record.goods_name }}</span>
            </span>

        </a-table>
    </a-drawer>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>

  </div>
</template>
<script>
import LiveBroadcastMerchantApi from '@/api/liveBroadcast/merchant'
import LiveRole from '../modules/LiveRole.vue'
import LiveRoom from '../modules/LiveRoom.vue'
import LiveRoomShare from '../modules/LiveRoomShare.vue'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  components: {
    LiveRole,
    LiveRoom,
    LiveRoomShare
  },
  data() {
    return {
      // 选择框1
      option1: [
        {key: 0,label: '全部'},
        {key: 'shop',label: '快店'},
        {key: 'mall',label: '商城'},
        {key: 'group',label: '团购'},
        // {key: 'village_group',label: '社区团购'},
      ],
      option3: [
        {key: 'shop',label: '快店'},
        {key: 'mall',label: '商城'},
        {key: 'group',label: '团购'},
        // {key: 'village_group',label: '社区团购'}
      ],
      option2: [
        {key: -1,label: '全部'},
        {key: 0,label: '未审核'},
        {key: 1,label: '审核中'},
        {key: 2,label: '审核通过'},
        {key: 3,label: '审核失败'},
      ],
      priceType: [
        {id: 1,label: '一口价'},
        {id: 2,label: '价格区间'},
        {id: 3,label: '显示折扣价'},
      ],
      visible: false,
      titles: '新建',
      //table表格头部
      columns: [
       {
          title: this.L('商品封面'),
          dataIndex: 'goods_image',
          scopedSlots: { customRender: 'goods_image' },
        },
        {
          title: this.L('商品名称'),
          dataIndex: 'goods_name',
          ellipsis: true,
        },
        {
          title: this.L('类型'),
          dataIndex: 'goods_type',
          scopedSlots: { customRender: 'goods_type' },
        },
        {
          title: this.L('价格'),
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
          ellipsis: true,
        },
        {
          title: this.L('审核状态'),
          dataIndex: 'check_status',
          key: 'check_status',
          scopedSlots: { customRender: 'check_status' },
        },
        {
          title: this.L('商品预览'),
          dataIndex: 'path',
          scopedSlots: { customRender: 'path' },
        },
        {
          title: this.L('上架时间'),
          dataIndex: 'create_time',
          ellipsis: true,
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      columns1: [
        {
          title: this.L('商品名称'),
          dataIndex: 'goods_name',
          scopedSlots: { customRender: 'goods_name' },
          customCell: () => {
            return { class: 'text-wrap' }
          },
        },
        {
          title: this.L('原价'),
          dataIndex: 'price',
          ellipsis: true,
        },
        {
          title: this.L('所属店铺'),
          dataIndex: 'store_name',
          ellipsis: true,
        },
      ],
      //列表数据
      goodsLimitCount:0,
      leftCount:0,
      dataList: [],
      dataAddList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
      },
      pagination1: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange1,
        onShowSizeChange: this.onPageSizeChange1,
      },
      selectedRowKeys: [],
      selectedRowKeys1: [],
      listId: 0,
      lsitType: 'add',
      queryParams: {
        check_status: -1,
        goods_name: '',
        goods_type: 0,
        page: 1,
        page_size: 10,
      },
      addQueryParams: {
        goods_name: '',
        goods_type: '',
        page: 1,
        page_size: 10,
      },
      previewVisible: false,
      previewImage: '',
      form: {
        price_type:1,
        goods_name: '',
        goods_image: '',
        price: 0,
        price2: 0,
        goods_type: '',
        store_id: '',
        goods_id: '',
        old_price: '',
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      shopVisible: false,
      fileList: [],
      rules: {
        goods_id:[{ required: true, message: '请选择商品库商品', trigger: 'blur' }],
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_image: [{ required: true, message: '请上传商品图片', trigger: 'blur' }],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
      },
      spin: false,
      confirmLoading: false,

      //添加直播
      roles:[],
      roles_limit:1,
      //预览商品二维码
      goodsWxQrcode:'',
      //直播间列表
      roomColumns:[
        {
          title: this.L('最近开播'),
          dataIndex: 'start_date',
          width:'30%',
          scopedSlots: { customRender: 'start_date' },
        },
        {
          title: this.L('直播间信息'),
          dataIndex: 'name',
          width:'40%',
          scopedSlots: { customRender: 'room_detail' },
        },
        {
          title: this.L('直播状态'),
          dataIndex: 'live_status',
          width:'15%',
        },
        {
          title: this.L('操作'),
          dataIndex: 'roomid',
          width:'15%',
          scopedSlots: { customRender: 'room_operate' },
        },
      ],
      roomPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onRoomPageChange,
      },
      roomDataList:[]
    }
  },
  created() {
    this.getRoles();
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  methods: {
    getWxappCode(path) {
      var url = encodeURIComponent(path)
      this.goodsWxQrcode = '/index.php?g=Index&c=Recognition_wxapp&a=create_page_qrcode' + '&page=' + url;
    },
    //tab切换事件
    tabChange(key){
      if(key == 1){
        this.getRoles();
      }else if(key == 2){
        console.log('获取直播间')
        this.getRoomList();
      }else{
        this.getDataList();
        this.liveGoodsStatusUpdate(true)
      }
    },
    //状态切换
    switchChange(event, item) {
      let _this = this
      this.$confirm({
        title: event
          ? '是否要上架商品（商品开启时，相对直播商品对应上架，每天上架有次数限制，请慎重操作）'
          : '是否要下架商品（商品关闭时，相对直播商品对应下架，每天下架有次数限制，请慎重操作）',
        onOk() {
          let params = {
            id: item.id,
            goods_id: item.goods_id,
            store_id: item.store_id,
            status: event ? 1 : 2,
          }
          _this.request(LiveBroadcastMerchantApi.liveGoodsChangeStatus, params).then((res) => {
            _this.$message.success('操作成功')
            _this.getDataList()
          })
        },
        onCancel() {
          console.log('Cancel')
          _this.dataList = [];
           _this.getDataList()
        },
        class: 'test',
      })
    },
    //搜索
    search(type) {
      //type = 1是列表 2是商品列表的搜索  0:重置列表筛选条件
      if(type == 0){
        this.queryParams={
          check_status: -1,
          goods_name: '',
          goods_type: 0,
          page: 1,
          page_size: 10,
        }
        this.getDataList()
      }
      if (type == 1) {
        this.pagination.current = 1
        this.getDataList()
      }
      if (type == 2) {
        this.pagination1.current = 1
        this.getAddDataList()
      }
    },
    //添加商品类型选择
    handleChange1(e) {
      this.addQueryParams.goods_type = e
      this.pagination1.current = 1
      this.getAddDataList()
    },
    // 获取table数据
    getDataList() {
      ;(this.queryParams.page = this.pagination.current),
        (this.queryParams.page_size = this.pagination.pageSize),
        this.request(LiveBroadcastMerchantApi.liveGoodsList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.goodsLimitCount = res.limit_count
          this.leftCount = res.left_count
          this.$set(this.pagination, 'total', res.total)
        })
    },
    //商品列表
    getAddDataList() {
      this.addQueryParams.page = this.pagination1.current
      this.addQueryParams.page_size = this.pagination1.pageSize
      this.request(LiveBroadcastMerchantApi.goodsList, this.addQueryParams).then((res) => {
        this.dataAddList = res.data
        this.$set(this.pagination1, 'total', res.total)
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getDataList()
    },
    onPageChange1(page, pageSize) {
      this.$set(this.pagination1, 'current', page)
      this.getAddDataList()
    },
    onPageSizeChange1(page, pageSize) {
      this.$set(this.pagination1, 'current', 1)
      this.$set(this.pagination1, 'pageSize', pageSize)
      this.getAddDataList()
    },
    toSetPage(type) {
      const totalPage = Math.ceil(
        (this.pagination.total - (type == 1 ? 1 : this.dataList.length)) / this.pagination.pageSize
      ) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },
    //列表单选多选
    onParkingChange1(selectedRowKeys) {
      this.selectedRowKeys1 = selectedRowKeys
    },
    //点击弹出添加商品列表弹框
    openShopList() {
      this.visible = true
      this.getAddDataList()
    },
    closeGoodsDrawer(){
      this.visible = false;
    },
    //新建
    addClick() {
      this.lsitType = 'add'
      this.shopVisible = true
      this.addQueryParams.goods_type = 'shop'
      this.form.goods_name = ''
      this.form.goods_image = ''
      this.form.price = 0
      this.form.price2 = 0
      this.form.goods_type = ''
      this.form.price_type = 1
      this.form.store_id = 0
      this.form.goods_id = ''
      this.form.old_price = ''
      this.fileList = []
    },
    //编辑
    editList(e) {
      this.lsitType = 'edit'
      this.shopVisible = true
      this.form.id = e.id
      this.form.store_id = e.store_id
      this.form.goods_id = e.goods_id
      this.fileList = [{
         uid: '-1',
          name: 'image.png',
          status: 'done',
          url: e.goods_image
      }]
      this.form.price = e.price
      this.form.goods_name = e.goods_name
      this.form.goods_image = e.goods_image
      this.form.old_price = e.price
      this.form.goods_type = e.goods_type
    },
    // 单个删除
    delList(e) {
      this.request(LiveBroadcastMerchantApi.liveGoodsDelete, {
        id: e.id,
        store_id: e.store_id,
        goods_id: e.goods_id,
      }).then((res) => {
        this.toSetPage(1)
        this.$message.success('删除成功')
        this.getDataList()
      })
    },
   
    //查看图片
    handleCancel() {
      this.previewVisible = false
    },
    //查看图片
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    //图片上传
    handleChange({ fileList }) {
      this.fileList = fileList
      if (fileList[0] && fileList[0].response) {
        this.form.goods_image = fileList[0].response.data
      }
    },
    //确定添加列表商品确定
    addListSubmit() {
      if (this.selectedRowKeys1.length == 1) {
        let arr = this.dataAddList.filter((v) => {
          return v.goods_id == this.selectedRowKeys1[0]
        })[0]
        this.form.goods_name = arr.goods_name
        this.form.price = arr.price
        this.form.old_price = arr.price
        this.form.store_id = arr.store_id
        this.form.goods_id = arr.goods_id
        this.form.goods_type = this.addQueryParams.goods_type
        this.visible = false
        this.selectedRowKeys1 = []
      } else {
        this.$message.warning('未选择或者最多选择一条')
      }
    },
    //添加商品提交审核
    addShop() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.lsitType == 'edit') {
            this.confirmLoading = true;
            this.request(LiveBroadcastMerchantApi.liveGoodsEdit, this.form).then((res) => {
              this.$message.success('修改成功')
              this.shopVisible = false
              this.confirmLoading = false;
              this.getDataList()
            }).catch(err=>{
              this.confirmLoading = false;
            })
          } else {
            this.confirmLoading = true;
            this.request(LiveBroadcastMerchantApi.liveGoodsAdd, this.form).then((res) => {
              this.$message.success('添加成功')
              this.shopVisible = false
              this.confirmLoading = false;
              this.getDataList()
            }).catch(err=>{
              this.confirmLoading = false;
            })
          }
        } else {
          return false
        }
      })
    },
    // 商品状态同步
    liveGoodsStatusUpdate(noShowError = false) {
        if (!noShowError) {
            this.spin = true
        }
        
        this.request(LiveBroadcastMerchantApi.liveGoodsStatusUpdate, {show_error: noShowError?0:1}).then((res) => {
            this.spin = false
            if(!noShowError){
                          this.$notification['success']({
        message: '提示',
        description: res.msg
      });
            }
            this.getDataList()
        }).catch(err => {
            this.spin = false
        })
    },
    //获取主播列表
    getRoles(){
      let _this = this
      _this.request(LiveBroadcastMerchantApi.getRoles, {}).then((res) => {
        _this.roles = res.roles;
        _this.roles_limit = res.limit;
      })
    },
    deleteRole(id){
      let _this = this
      _this.request(LiveBroadcastMerchantApi.delRole, {id:id}).then((res) => {
        _this.getRoles();
      })
    },
    //添加商品切换商品价格类型
    changePriceType(e) {
      this.form.price_type = e.target.value
    },
    //获取直播间列表
    onRoomPageChange(page, pageSize) {
        this.page = page;
        this.$set(this.roomPagination, 'current', page)
        this.getRoomList()
    },
    getRoomList() {
      this.roomPagination.page = this.roomPagination.current
      this.request(LiveBroadcastMerchantApi.getRooms, this.roomPagination).then((res) => {
        this.roomDataList = res.data
        this.roomPagination.total = res.total
      })
    },

    delRoom(roomid) {
      this.request(LiveBroadcastMerchantApi.delRoom, { roomid: roomid }).then((res) => {
        this.getRoomList()
      })
    }
    
  }
}
</script>
<style scoped lang="less">
.center {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.textarea-wrapper {
  position: relative;
  display: block;
  .m-textarea {
    padding: 8px 12px;
    padding-bottom: 25px;
    height: 100%;
  }
  .m-count {
    color: #808080;
    position: absolute;
    font-size: 12px;
    bottom: 0px;
    right: 12px;
  }
}
.newBox {
  max-height: 70vh;
  overflow-y: scroll;
  .customFormWrap {
    padding: 20px 20px 0 20px;
    background: #fafafa;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border: 1px solid rgb(235, 238, 245);
  }
}
.mg {
  margin-right: 20px;
}


.role-div{
  width:28%;
  display:flex;
  border: 1px solid #ddd;
  margin-top: 1rem;
  padding: 1rem;
  margin-left: 2rem;
  min-height: 200px;
}

.role-div:nth-child(3n+1){
  margin-left: 0;
}

.role-plus{
  font-size: 64px;
  font-weight: normal;
  width: 30%;
  margin-left: 35%;
  margin-top: 43px;
}
</style>
