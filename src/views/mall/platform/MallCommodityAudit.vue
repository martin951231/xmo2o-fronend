<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a class="title">商城商品审核</a>
    <!-- 头部导航栏区域 -->
    <a-row style="margin-top: 20px; margin-bottom: 20px">
      <div class="status" style="margin-left: 0">
        <p>商品名称:</p>
        <a-input-search
          placeholder="请输入商品名称"
          v-model="queryParams.keyword"
          style="width: 300px"
          @search="onSearch"
        />
      </div>
      <div class="status">
        <p>状态:</p>
        <a-select style="width: 120px" :default-value="'-1'" @change="handleChangeFlag">
          <a-select-option value="-1"> 全部 </a-select-option>
          <a-select-option value="0"> 待审核 </a-select-option>
          <a-select-option value="1"> 审核成功 </a-select-option>
          <a-select-option value="2"> 审核失败 </a-select-option>
        </a-select>
      </div>
      <a-button type="primary" style="margin: 10px 10px 10px 6%" @click="quickAudit">{{ L('快速审核') }}</a-button>
    </a-row>
    <!-- 表格列表区域开始 -->
    <a-table
      style="background: #ffffff"
      :columns="columns"
      rowKey="goods_id"
      :data-source="dataList"
      @change="changePage"
      :pagination="pagination"
      :rowSelection="{
        onChange: onSelectChange,
        selectedRowKeys: selectedRowKeys,
      }"
    >
      <!-- 商品名称及图片 -->
      <template slot="goods_name" slot-scope="index, item">
        <div class="flex align-center oven">
          <img style="width: 50px; height: 50px; margin-right: 6px" :src="item.image" alt="" />
          <span :title="item.goods_name">{{ item.goods_name }}</span>
        </div>
      </template>
      <!-- 价格 -->
      <span slot="money" slot-scope="text"> ￥{{ text }} </span>
      <span slot="tools_title" slot-scope="index, item">
        <span>{{ item.tools_title }}</span
        >(
        <span v-if="item.tools_audit_status == 0" style="color: #faad14">{{ item.tools_audit_status_text }}</span>
        <span v-else-if="item.tools_audit_status == 1" style="color: #52c41a">{{ item.tools_audit_status_text }}</span>
        <span v-else-if="item.tools_audit_status == 2" style="color: #f5222d">{{ item.tools_audit_status_text }}</span
        >)
      </span>
      <!-- 库存 -->
      <span slot="stock_num" slot-scope="stock_num">{{ stock_num == -1 ? '无限量' : stock_num }} </span>
      <!-- 状态 -->
      <span slot="audit_status" slot-scope="index, item">
        <span v-if="item.audit_status == 0" style="color: #faad14">{{ item.audit_status_text }}</span>
        <span v-else-if="item.audit_status == 1" style="color: #52c41a">{{ item.audit_status_text }}</span>
        <span v-else-if="item.audit_status == 2" style="color: #f5222d">{{ item.audit_status_text }}</span>
      </span>
      <!-- 提交时间 -->
      <span slot="add_audit_time" slot-scope="add_audit_time">{{ add_audit_time ? add_audit_time : '无' }}</span>
      <!-- 备注 -->
      <span slot="audit_msg" slot-scope="audit_msg" :title="audit_msg">{{ audit_msg ? audit_msg : '无' }}</span>
      <!-- 操作 -->
      <a slot="operation" slot-scope="index, item" @click="examine(item)">{{
        item.audit_status == 0 ? '审核' : '重新审核'
      }}</a>
    </a-table>

    <!-- 审核信息 -->
    <a-modal
      destroyOnClose
      :title="L('快速审核')"
      width="46%"
      centered
      :visible="visible"
      @ok="handleOk"
      @cancel="
        () => {
          visible = false
        }
      "
      okText="提交"
    >
      <div style="padding: 0 40px">
        <div class="info">
          <span>{{ L('是否审核通过：') }}</span>
          <a-radio-group :options="plainOptions" :default-value="value1" @change="onExamineChange" />
        </div>

        <div class="info">
          <span>{{ L('驳回原因：') }}</span>
          <a-textarea v-model="examineParams.audit_msg" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import mallPlatformApi from '@/api/mall/platform/index'
import {_updateMenu} from "@/utils/util";
export default {
  components: {},

  data() {
    return {
      //tab标签栏
      tabList: [
        {
          key: 0,
          tab: this.L('体育审核'),
        },
        {
          key: 1,
          tab: this.L('门票审核'),
        },
      ],
      dataList: [],
      visible: false,
      value1: '',
      plainOptions: [
        {
          value: '1',
          label: this.L('同意'),
        },
        {
          value: '2',
          label: this.L('驳回'),
        },
      ],
      selectedRowKeys: [],
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        page: 1,
      },
      queryParams: {
        pageSize: 0,
        page: 1,
        keyword: '',
      },
      //审核提交参数
      examineParams: {
        goods_ids: [],
        audit_msg: '',
        audit_status: '',
      },
      columns: [
        {
          title: this.L('商品名称'),
          dataIndex: 'goods_name',
          key: 'goods_name',
          // ellipsis: true,
          width: 200,
          scopedSlots: {
            customRender: 'goods_name',
          },
        },
        {
          title: this.L('浏览量'),
          dataIndex: 'browse_num',
        },
        {
          title: this.L('商家名称'),
          dataIndex: 'mer_name',
          key: 'mer_name',
          ellipsis: true,
          width: 200,
          scopedSlots: {
            customRender: 'mer_name',
          },
        },

        {
          title: this.L('店铺名称'),
          dataIndex: 'store_name',
          key: 'store_name',
          ellipsis: true,
          width: 200,
          scopedSlots: {
            customRender: 'store_name',
          },
        },

        {
          title: this.L('售价'),
          dataIndex: 'price',
          key: 'price',
          scopedSlots: {
            customRender: 'price',
          },
        },
        {
          title: this.L('当前库存'),
          dataIndex: 'stock_num',
          key: 'stock_num',
          scopedSlots: {
            customRender: 'stock_num',
          },
        },
        {
          title: this.L('提交时间'),
          dataIndex: 'add_audit_time',
          key: 'add_audit_time',
          scopedSlots: {
            customRender: 'add_audit_time',
          },
        },
        {
          title: this.L('状态'),
          dataIndex: 'audit_status',
          key: 'audit_status',
          scopedSlots: {
            customRender: 'audit_status',
          },
        },
        {
          title: this.L('备注'),
          dataIndex: 'audit_msg',
          key: 'audit_msg',
          ellipsis: true,
          scopedSlots: {
            customRender: 'audit_msg',
          },
        },
        {
          title: this.L('操作'),
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: {
            customRender: 'operation',
          },
        },
      ],
      //请求接口路径
      paramsUrl: '',
    }
  },
  created() {
    //根据路由参数判断用哪个接口
    this.paramsUrl = mallPlatformApi.getAuditGoodsList
    this.getLifeToolsList()
    //更新左侧菜单
    _updateMenu(this.$route.path,this)
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  methods: {
    //状态选择框事件
    handleChangeFlag(e) {
      this.pagination.current = 1
      this.queryParams.audit_status = e
      if (e == -1) {
        delete this.queryParams.audit_status
      }
      this.getLifeToolsList()
    },
    //表格选中事件
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    //审核
    examine(item) {
      let params = {
        mer_id: item.mer_id,
      }
      //进行伪登录
      this.request(mallPlatformApi.loginMerchant, params).then((res) => {
        this.$router.push({
          path: '/mall/platform.MallCommodityExamine/goodsAudit',
          query: { goods_id: item.goods_id, store_id: item.store_id, disabled: 1 },
        })
      })
    },
    //快速审核
    quickAudit() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning(this.L('请选择一条或者多条列表再审核'))
        return
      }
      this.visible = true
      this.examineParams.audit_msg = ''
      this.examineParams.audit_status = ''
      this.examineParams.goods_ids = this.selectedRowKeys
    },
    //审核接口
    examineParamsSubmit() {
      this.request(mallPlatformApi.auditGoods, this.examineParams).then((res) => {
        this.$message.success(this.L(res.msg))
        this.selectedRowKeys = []
        this.visible = false
        //更新左侧菜单
        _updateMenu(this.$route.path,this)
        this.getLifeToolsList()
      })
    },

    //审核确定按钮
    handleOk() {
      if (this.examineParams.audit_status == '') {
        this.$message.warning(this.L('请选择是否审核通过单选框'))
        return
      }
      if (this.examineParams.audit_status == 2 && this.examineParams.audit_msg == '') {
        this.$message.warning(this.L('请填写驳回原因'))
        return
      }
      this.examineParamsSubmit()
    },
    //选择通过或不通过
    onExamineChange(e) {
      this.examineParams.audit_status = e.target.value
    },
    getLifeToolsList() {
      this.queryParams.pageSize = this.pagination.pageSize
      this.queryParams.page = this.pagination.current
      this.request(this.paramsUrl, this.queryParams).then((res) => {
        this.dataList = res.data
        this.pagination.total = res.total
      })
    },
    changePage(page, pageSize) {
      this.pagination.current = page.current
      this.getLifeToolsList()
    },
    onSearch(text) {
      this.pagination.current = 1
      this.getLifeToolsList()
    },
  },
}
</script>
<style lang="less" scoped>
.status {
  margin-left: 4%;
  display: inline-flex;
  align-items: center;
  p {
    margin-bottom: 0;
    margin-right: 10px;
  }
}
.title {
  font-size: 20px;
}
.info {
  display: flex;
  margin-bottom: 24px;
  span:first-child {
    display: inline-block;
    width: 100px;
    text-align: right;
    margin-right: 8px;
  }
  .ant-input {
    width: 50%;
  }
}
.oven {
  overflow: hidden; /* 溢出时不显示溢出的内容 */
  text-overflow: ellipsis; /* 发生溢出时使用省略号代替 */
  display: -webkit-box; /* chrome浏览器的私有属性。显示为box。 */
  -webkit-box-orient: vertical; /* 垂直排列元素 */
  -webkit-line-clamp: 1; /* 显示多少行 */
}
</style>
