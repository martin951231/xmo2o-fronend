<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-tabs
      :tabBarStyle="{ background: '#fff' }"
      size="large"
      tab-position="top"
      @change="selectClassify"
      :default-active-key="tabKey"
    >
      <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.tab">
        <a-row>
          <div style="padding: 20px">
            <a-row :gutter="16">
              <a-col :span="6" v-for="item in cardList" :key="item.id">
                <a-card style="width: 310px; height: 120px">
                  <a-row>
                    <a-col :span="6">
                      <img width="65" height="65" src="/v20/public/static/life_tools/images/group_all_order.png" />
                    </a-col>
                    <a-col :span="15" style="padding-left: 20px">
                      <a-statistic :value="item.totals" :title="item.title" />
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>
            </a-row>
          </div>
        </a-row>
        <div v-if="navIndex == 0">
          <!-- 筛选 -->
          <a-row style="margin: 10px 0; display: flex; align-items: center">
            <a-select style="width: 120px" :default-value="option1[0].label" @change="handleChange1">
              <a-select-option :value="item.key" v-for="item in option1" :key="item.key">{{
                item.label
              }}</a-select-option>
            </a-select>
            <a-input style="width: 15%" v-model="seatchValue" placeholder="名称/手机号" />
            <div class="flag">
              <p>{{ L('状态:') }}</p>
              <a-select style="width: 120px" :default-value="option2[0].label" @change="handleChange2">
                <a-select-option :value="item.key" v-for="item in option2" :key="item.key">{{
                  item.label
                }}</a-select-option>
              </a-select>
            </div>
            <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="seatch">{{ L('搜索') }}</a-button>
            <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="exportExcal(1)">{{
              L('导出')
            }}</a-button>
          </a-row>
          <!-- 分销员类别 -->
          <div style="padding: 0 10px">
            <a-tabs
              :tabBarStyle="{ background: '#fff' }"
              size="large"
              tab-position="top"
              @change="distributorCategory"
              :default-active-key="tabKey"
            >
              <a-tab-pane v-for="item in tabDistributorCategoryList" :key="item.key" :tab="item.tab"></a-tab-pane
            ></a-tabs>
          </div>
          <!-- 表格 -->
          <a-table
            :rowSelection="{
              onChange: onSelectChange,
              selectedRowKeys: selectedRowKeys,
            }"
            class="aTable"
            :scroll="{x: 1850 , y: 400 }"
            rowKey="user_id"
            :columns="columns"
            :data-source="tabData"
            :pagination="pagination"
          >
            <!-- 手机号 -->
            <span slot="phone" slot-scope="phone">
              <span>{{ phone ? phone : '无' }}</span>
            </span>
            <!-- 邀请人数 -->
            <span slot="invit_num" slot-scope="index, item">
              <span>{{ item.invit_num ? item.invit_num : '无' }} &nbsp;</span>
              <a @click="viewPeople(item)">{{ L('查看') }}</a>
            </span>
            <!-- 分销清单 -->
            <span slot="Distribution_list" slot-scope="index, item">
              <a @click="viewDistribution(item)">{{ L('查看详情') }}</a>
            </span>
            <!-- 状态 -->
            <span slot="audit_status" slot-scope="audit_status">
              <span v-if="audit_status == 0" style="color: #faad14">{{ L('未审核') }}</span>
              <span v-else-if="audit_status == 1" style="color: #52c41a">{{ L('已认证') }}</span>
              <span v-else-if="audit_status == 2" style="color: #f5222d">{{ L('认证失败') }}</span>
            </span>
            <!-- 操作 -->
            <span slot="operation" slot-scope="index, item" class="edit">
              <a @click="showModal(item)">{{ item.audit_status == 0 ? '审核' : '重新审核' }}</a>
              <a style="color: #f5222d" @click="listDelelt(item)">&nbsp;&nbsp;&nbsp;{{ '删除' }}</a>
            </span>
          </a-table>
        </div>
        <!-- 结算单布局开始 -->
        <div v-else>
          <!-- 筛选 -->
          <a-row style="margin: 10px 0; display: flex; align-items: center">
            <a-select
              style="width: 120px"
              v-model="statementParams.search_type"
              @change="statementHandleSelectChange($event, 'list', 'search_type')"
            >
              <a-select-option
                :value="item.key"
                v-for="item in statementOptions.listSearchTypeOptions"
                :key="item.key"
                >{{ item.label }}</a-select-option
              >
            </a-select>
            <a-input style="width: 15%" v-model="statementParams.search_content" placeholder="请输入搜索内容" />
            <div class="flag">
              <p>{{ L('状态:') }}</p>
              <a-select
                style="width: 120px"
                v-model="statementParams.status"
                @change="statementHandleSelectChange($event, 'list', 'status')"
              >
                <a-select-option :value="item.key" v-for="item in statementOptions.listStatusOptions" :key="item.key">{{
                  item.label
                }}</a-select-option>
              </a-select>
            </div>
            <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="statementHandleClick(0)">{{
              L('搜索')
            }}</a-button>
            <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="statementHandleClick(1)">{{
              L('导出')
            }}</a-button>
          </a-row>

          <a-table
            :columns="statementColumns"
            :data-source="statementList"
            rowKey="pigcms_id"
            :pagination="statementPagination"
          >
            <span slot="name" slot-scope="name">
              <a-tooltip v-if="name.length > 15">
                <template slot="title">
                  {{ name }}
                </template>
                {{ name }}
              </a-tooltip>
              <span v-else>{{ name }}</span>
            </span>
            <span slot="nickname" slot-scope="nickname">
              <a-tooltip v-if="nickname.length > 15">
                <template slot="title">
                  {{ nickname }}
                </template>
                {{ nickname }}
              </a-tooltip>
              <span v-else>{{ nickname }}</span>
            </span>
            <span slot="operation" slot-scope="text, record">
              <a @click="showStatementDetailModal(record)">{{ L('查看详情') }}</a>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

    <!-- 审核信息弹出框 -->
    <a-modal
      :maskClosable="false"
      destroyOnClose
      :title="L('审核信息')"
      width="46%"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="提交"
    >
      <div style="padding: 0 40px">
        <div class="info-list">
          <div class="" v-for="(item, index) in arletItem" :key="index">
            <div class="" v-if="item.type == 'image'">
              <div class="info">
                <span>{{ item.title }}：</span>
                <div style="flex: 1">
                  <img
                    @click="previewImageClick(items)"
                    v-for="(items, indexs) in item.show_value"
                    :key="indexs"
                    alt="暂无图片"
                    :src="items"
                  />
                </div>
              </div>
            </div>
            <div v-else class="info">
              <span>{{ item.title }}：</span>
              <span>{{ item.show_value }}</span>
            </div>
          </div>

          <div class="info">
            <span>{{ L('是否审核通过：') }}</span>
            <a-radio-group :options="plainOptions" :default-value="value1" @change="onChange1" />
          </div>

          <div class="info">
            <span>{{ L('驳回原因：') }}</span>
            <a-textarea v-model="submit.audit_msg" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 图片弹出层 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewImageCancel">
      <img alt="暂无图片" style="width: 100%" :src="viewImg" />
    </a-modal>

    <!-- 邀请人数列表弹出框 -->
    <a-modal
      :title="L(titles.nickname + '的邀请人数')"
      width="70%"
      :visible="peopleVisible"
      destroyOnClose
      @cancel="
        () => {
          peopleVisible = false
        }
      "
      :footer="null"
    >
      <div style="padding: 0 10px">
        <a-tabs
          :tabBarStyle="{ background: '#fff' }"
          size="large"
          tab-position="top"
          @change="peopleSelect"
          :default-active-key="tabKey"
        >
          <a-tab-pane v-for="item in tabPeoperList" :key="item.key" :tab="item.tab"></a-tab-pane
        ></a-tabs>
        <!-- 筛选 -->
        <a-row style="margin: 10px 0; display: flex; align-items: center">
          <a-select style="width: 160px" v-model="peopleOptionKey" :defaultValue="peopleOption[0].key" @change="peopleHandleChange">
            <a-select-option :value="item.key" v-for="(item, index) in peopleOption" :key="item.key">{{
              item.label
            }}</a-select-option>
          </a-select>
          <a-input style="width: 22%" v-model="peopleValue" placeholder="昵称/手机号" />
          <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="peopleSearch">{{ L('搜索') }}</a-button>
          <a-button type="primary" style="margin: 10px 10px 10px 3%" @click="exportExcal(2)">{{ L('导出') }}</a-button>
        </a-row>

        <!-- 表格 -->
        <a-table
          rowKey="user_id"
          :columns="peopleColumns"
          :data-source="peopleTabData"
          :pagination="peoplePagination"
          :scroll="{ y: 400 }"
        ></a-table>
      </div>
    </a-modal>

    <!-- 分销清单列表弹出框 -->
    <a-modal
      :title="L(titles.nickname + '的分销清单')"
      destroyOnClose
      width="85%"
      :visible="distributionVisible"
      @cancel="
        () => {
          distributionVisible = false
        }
      "
      :footer="null"
    >
      <div style="padding: 0 10px">
        <a-tabs
          :tabBarStyle="{ background: '#fff' }"
          size="large"
          tab-position="top"
          @change="distributionListSelect"
          :default-active-key="tabKey"
        >
          <a-tab-pane v-for="item in tabDistributionList" :key="item.key" :tab="item.tab"></a-tab-pane
        ></a-tabs>
        <!-- 筛选 -->
        <a-row style="margin: 10px 0; display: flex; align-items: center">
          <div style="display: flex; align-items: center">
            <span>选择日期：</span>
            <a-range-picker v-model="timerPicker" @change="onPickerChange"></a-range-picker>
          </div>
          <a-button
            v-if="distributionIndex == 0"
            type="primary"
            style="margin: 10px 10px 10px 10%"
            @click="settlementSheet"
            >{{ L('生成结算单') }}</a-button
          >
        </a-row>

        <!-- 表格 -->
        <a-table
          :scroll="{ y: 400 }"
          :rowSelection="{
            selectedRowKeys: distributionRowKeys,
            onChange: distributionOnSelectChange,
          }"
          rowKey="id"
          :columns="distributionListColumns"
          :data-source="distributionListTabData"
          :pagination="false"
        >
          <!-- 状态 -->
          <span slot="status" slot-scope="status">
            <span v-if="status == 0">{{ L('待结算') }}</span>
            <span v-else-if="status == 1">{{ L('结算中') }}</span>
            <span v-else-if="status == 2">{{ L('已结算') }}</span>
          </span>
          <!-- 备注 -->
          <span slot="note" slot-scope="note">
            <span>{{ note ? note : L('无') }}</span>
          </span>
          <!-- 操作 -->
          <span slot="operation" slot-scope="index, item" class="edit">
            <a v-if="item.status == 0" @click="remarksClick(item)">{{ L('备注') }}</a>
            <a v-else>{{ L('不可操作') }}</a>
          </span>
        </a-table>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px">
          <a-pagination
            v-model="distributionListpagination.current"
            :page-size-options="distributionListpagination.pageSizeOptions"
            :total="distributionListpagination.total"
            show-size-changer
            :page-size="distributionListpagination.pageSize"
            @change="distributionChangePage"
            @showSizeChange="ondistributionPageSizeChange"
          >
            <template slot="buildOptionText" slot-scope="props">
              <span v-if="props.value <= 100">{{ props.value }}条/页</span>
              <span v-else-if="props.value > 100">全部</span>
            </template>
          </a-pagination>
        </div>
      </div>
    </a-modal>

    <!-- 发送清单 -->
    <a-modal
      :title="L('发送结算单')"
      width="38%"
      :maskClosable="false"
      destroyOnClose
      :visible="settlementVisible"
      @cancel="
        () => {
          settlementVisible = false
        }
      "
      :footer="null"
    >
      <div>
        <a-form
          ref="form"
          :form="form"
          name="basic"
          @submit="handleSubmit"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-item name="name" label="结算单名称">
            <a-input
              v-decorator="['name', { rules: [{ required: true, message: L('请输入结算单名称') }] }]"
              placeholder="请输入结算单名称"
            />
          </a-form-item>
          <a-form-item :label="L('发布单位')">
            <a-input
              v-decorator="['company', { rules: [{ required: true, message: L('请输入发布单位') }] }]"
              placeholder="请输入发布单位"
            />
          </a-form-item>
          <a-form-item :label="L('驳回订单金额')">
            <a-input v-decorator="['reject_money']" placeholder="请输入驳回订单金额" />
          </a-form-item>
          <div class="submit_div">
            <a-button class="submit_btn" type="primary" html-type="submit"> {{ L('确定') }} </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>
    <a-modal
      :title="L('备注')"
      width="30%"
      :maskClosable="false"
      destroyOnClose
      :visible="settlementRemarksVisible"
      @ok="settlementRemarksOk"
      @cancel="
        () => {
          settlementRemarksVisible = false
        }
      "
    >
      <div class="info" style="margin-bottom: 20px">
        <span style="font-weight: bold">{{ L('门票名称：') }}</span>
        <span>{{ noteDetail.tools_title }}</span>
      </div>
      <a-textarea v-model="settlementRemarks" :auto-size="{ minRows: 3, maxRows: 6 }" />
    </a-modal>

    <!-- 结算单详情 -->
    <a-modal
      :title="L('结算单详情')"
      width="70%"
      destroyOnClose
      :visible="statementDetailVisible"
      :footer="null"
      :bodyStyle="{
        maxHeight: '80vh',
        overflowY: 'auto',
      }"
      @cancel="() => (statementDetailVisible = false)"
    >
      <!-- 筛选 -->
      <a-row class="mt-10 mb-10" type="flex" align="middle">
        <a-col :span="18" class="flex align-center" style="display: flex">
          <div class="flex align-center">
            <span>选择日期：</span>
            <a-range-picker @change="onStatementDetailPickerChange"></a-range-picker>
          </div>
          <div class="flex-1 mt-10 mb-10 ml-10 mr-10">
            <a-input-group compact>
              <a-select
                v-model="statementDetailParams.search_type"
                style="width: 30%"
                @change="statementHandleSelectChange($event, 'detail', 'search_type')"
              >
                <a-select-option
                  :value="item.key"
                  v-for="item in statementOptions.detailSearchTypeOptions"
                  :key="item.key"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
              <a-input
                style="width: 60%"
                v-model="statementDetailParams.search_content"
                :placeholder="L('请输入搜索内容')"
              />
            </a-input-group>
          </div>
        </a-col>
        <a-col :span="6" class="flex align-center justify-between">
          <a-button type="primary" class="mt-10 mb-10 ml-10 mr-10" @click="statementDetailSearch(0)">{{
            L('搜索')
          }}</a-button>
          <a-button type="primary" class="mt-10 mb-10 ml-10 mr-10" @click="statementDetailSearch(1)">{{
            L('导出')
          }}</a-button>
        </a-col>
      </a-row>
      <a-table
        :columns="statementDetailColumns"
        :data-source="statementDetailList"
        rowKey="order_id"
        :pagination="statementDetailPagination"
      >
        <span slot="note" slot-scope="note" placement="topLeft">
          <a-tooltip v-if="note.length > 15">
            <template slot="title">
              {{ note }}
            </template>
            {{ note }}
          </a-tooltip>
          <span v-else>{{ note }}</span>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
import Vue from 'vue'
import { statistic } from 'ant-design-vue'
Vue.use(statistic)
export default {
  data() {
    return {
      //tab标签栏
      tabList: [
        {
          key: '0',
          tab: this.L('分销员列表'),
        },
        {
          key: '1',
          tab: this.L('结算单列表'),
        },
      ],
      //邀请人数tab标签栏
      tabPeoperList: [
        {
          key: '0',
          tab: this.L('一级用户'),
        },
        {
          key: '1',
          tab: this.L('二级用户'),
        },
      ],
      //分销员类型tab标签栏
      tabDistributorCategoryList: [
        {
          key: '0',
          tab: this.L('个人分销员'),
        },
        {
          key: '1',
          tab: this.L('企业分销员'),
        },
      ],
      //分销清单tab标签栏
      tabDistributionList: [
        {
          key: '0',
          tab: this.L('待结算'),
        },
        {
          key: '1',
          tab: this.L('结算中'),
        },
        {
          key: '2',
          tab: this.L('已结算'),
        },
      ],
      //下标
      tabKey: '0',
      // 金额卡片
      cardList: [
        {
          totals: 0,
          title: this.L('结算中总金额'),
          id: 0,
        },
        {
          totals: 0,
          title: this.L('已结算总金额'),
          id: 1,
        },
        {
          totals: 0,
          title: this.L('分销订单总数量'),
          id: 2,
        },
        {
          totals: 0,
          title: this.L('分销员总数量'),
          id: 3,
        },
      ],
      //分销员列表请求参数
      queryParams: {
        page_size: 0,
        page: 1,
        nickname: '',
        phone: '',
        type: 0,
        status: null,
        user_ids: '',
        function_type: 0,
      },
      //获取分销员下级用户
      peopleQueryParams: {
        page_size: 0,
        page: 1,
        user_id: '',
        content: '',
        level: 1,
        function_type: 0,
        select_type: 0,
      },
      //获取分销员下级用户
      distributionQueryParams: {
        page_size: 0,
        page: 1,
        user_id: '',
        start_time: '',
        end_time: '',
        status: 0,
        get_all: 0,
      },
      submit: {
        user_id: '',
        audit_status: '',
        audit_msg: '',
      },
      // 选择框1
      option1: [
        {
          key: '0',
          label: '昵称',
        },
        {
          key: '1',
          label: '手机号',
        },
      ],

      option2: [
        {
          key: '0',
          label: '全部',
        },
        {
          key: '1',
          label: '未审核',
        },
        {
          key: '2',
          label: '已认证',
        },
        {
          key: '3',
          label: '认证失败',
        },
      ],
      // 邀请人数选择框
      peopleOption: [
        {
          key: '1',
          label: this.L('昵称'),
        },
        {
          key: '2',
          label: this.L('手机号'),
        },
      ],
      peopleOptionKey: '1',
      peopleNameType: '1',
      peopleValue: '',
      // 分页配置
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        page: 1,
        showSizeChanger: true,
        onChange: this.changePage,
        onShowSizeChange: this.onPageSizeChange,
        pageSizeOptions: ['10', '20', '40', '60', '80', '100'],
        showTotal: (total) => `共 ${total} 条记录`,
      },
      // 邀请人数分页配置
      peoplePagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        page: 1,
        showSizeChanger: true,
        onChange: this.changePage1,
        onShowSizeChange: this.onProplePageSizeChange,
        pageSizeOptions: ['10', '20', '40', '60', '80', '100'],
        showTotal: (total) => `共 ${total} 条记录`,
        // buildOptionText: (total) => (total.value > 100 ? `全部` : `${total.value} 条/页`),
      },
      // 分销清单分页配置
      distributionListpagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        page: 1,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '40', '60', '80', '100', '999'],
      },
      selectedRowKeys: [],
      // 表格配置
      columns: [
        {
          title: this.L('呢称'),
          dataIndex: 'nickname',
          key: 'nickname',
          ellipsis: true,
          scopedSlots: { customRender: 'nickname' },
        },
        {
          title: this.L('手机号'),
          dataIndex: 'phone',
          key: 'phone',
          width: 120,
          scopedSlots: { customRender: 'phone' },
        },
        {
          title: this.L('佣金'),
          dataIndex: 'commission',
          key: 'commission',
          scopedSlots: { customRender: 'commission' },
        },
        {
          title: this.L('邀请奖金'),
          dataIndex: 'invit_money',
          key: 'invit_money',
          scopedSlots: { customRender: 'invit_money' },
        },
        {
          title: this.L('邀请人数'),
          dataIndex: 'invit_num',
          key: 'invit_num',
          scopedSlots: { customRender: 'invit_num' },
        },
        {
          title: this.L('未结算订单'),
          dataIndex: 'count_settled_not_order',
          key: 'count_settled_not_order',
        },
        {
          title: this.L('未结算订单金额'),
          dataIndex: 'price_settled_not',
          key: 'price_settled_not',
          width: 150,
        },
        {
          title: this.L('结算中订单'),
          dataIndex: 'count_settled_in_order',
          key: 'count_settled_in_order',
          scopedSlots: { customRender: 'count_settled_in_order' },
        },
        {
          title: this.L('已结算订单'),
          dataIndex: 'count_settled_order',
          key: 'count_settled_order',
          scopedSlots: { customRender: 'count_settled_order' },
        },
        {
          title: this.L('结算中金额'),
          dataIndex: 'price_settled_in',
          key: 'price_settled_in',
          scopedSlots: { customRender: 'price_settled_in' },
        },
        {
          title: this.L('已结算金额'),
          dataIndex: 'price_settled',
          key: 'price_settled',
          scopedSlots: { customRender: 'price_settled' },
        },
        {
          title: this.L('已结算驳回金额'),
          dataIndex: 'reject_money',
          width: 150,
          key: 'reject_money',
          scopedSlots: { customRender: 'reject_money' },
        },
        {
          title: this.L('状态'),
          dataIndex: 'audit_status',
          key: 'audit_status',
          scopedSlots: { customRender: 'audit_status' },
        },
        {
          title: this.L('分销清单'),
          dataIndex: 'Distribution_list',
          key: 'Distribution_list',
          fixed: 'right',
          scopedSlots: { customRender: 'Distribution_list' },
        },
        {
          title: this.L('操作'),
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          width: 140,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      // 邀请人数表格配置
      peopleColumns: [
        {
          title: this.L('呢称'),
          dataIndex: 'nickname',
          key: 'nickname',
          // align: 'center',
        },
        {
          title: this.L('手机号'),
          dataIndex: 'phone',
          key: 'phone',
          // width: 150,
          // align: 'center',
        },
        {},
        {},
        // {
        //   title: this.L('佣金'),
        //   dataIndex: 'commission',
        //   key: 'commission',
        //   align: 'center',
        // },
        // {
        //   title: this.L('邀请奖金'),
        //   dataIndex: 'invit_money',
        //   key: 'invit_money',
        //   align: 'center',
        // },
        {
          title: this.L('邀请人数'),
          dataIndex: 'invit_num',
          key: 'invit_num',
          // align: 'center',
        },
      ],
      //分销清单列表表格配置
      distributionListColumns: [
        {
          title: this.L('订单号'),
          dataIndex: 'real_orderid',
          key: 'real_orderid',
          ellipsis: true,
          scopedSlots: { customRender: 'real_orderid' },
        },
        {
          title: this.L('门票名称'),
          dataIndex: 'ticket_title',
          key: 'ticket_title',
          ellipsis: true,
          scopedSlots: { customRender: 'ticket_title' },
        },
        {
          title: this.L('景区名称'),
          dataIndex: 'tools_title',
          key: 'tools_title',
          ellipsis: true,
          scopedSlots: { customRender: 'tools_title' },
        },
        {
          title: this.L('购买游客'),
          dataIndex: 'nickname',
          key: 'nickname',
          ellipsis: true,
          scopedSlots: { customRender: 'nickname' },
        },
        {
          title: this.L('手机号'),
          dataIndex: 'phone',
          key: 'phone',
          scopedSlots: { customRender: 'phone' },
        },
        {
          title: this.L('数量'),
          dataIndex: 'num',
          key: 'num',
          ellipsis: true,
          scopedSlots: { customRender: 'num' },
        },
        {
          title: this.L('订单金额'),
          dataIndex: 'price',
          key: 'price',
          ellipsis: true,
          scopedSlots: { customRender: 'price' },
        },
        {
          title: this.L('佣金奖励'),
          dataIndex: 'commission_level_1',
          key: 'commission_level_1',
          ellipsis: true,
          scopedSlots: { customRender: 'commission_level_1' },
        },
        {
          title: this.L('邀请奖励'),
          dataIndex: 'commission_level_2',
          key: 'commission_level_2',
          ellipsis: true,
          scopedSlots: { customRender: 'commission_level_2' },
        },
        {
          title: this.L('状态'),
          dataIndex: 'status',
          key: 'status',
          ellipsis: true,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.L('下单日期'),
          dataIndex: 'add_time',
          key: 'add_time',
          scopedSlots: { customRender: 'add_time' },
        },
        {
          title: this.L('备注'),
          dataIndex: 'note',
          key: 'note',
          ellipsis: true,
          scopedSlots: { customRender: 'note' },
        },
        {
          title: this.L('操作'),
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      // 表格数据
      tabData: [],
      //人数邀请详情表格
      peopleTabData: [],
      distributionListTabData: [],
      plainOptions: [
        {
          value: '0',
          label: this.L('同意'),
        },
        {
          value: '1',
          label: this.L('驳回'),
        },
      ],
      // 审核弹框数据
      arletItem: null,
      viewImg: null,
      visible: false,
      value1: '',
      confirmLoading: false,
      previewVisible: false,
      nameFlag: false,
      seatchValue: '',
      fileList: [],
      previewImage: '',
      previewImgVisible: false,
      peopleVisible: false,
      distributionVisible: false,
      settlementVisible: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      //发送结算单表单
      formState: {
        name: '',
        company: '',
        reject_money: '',
      },
      settlementRemarksVisible: false,
      //发送结算备注
      settlementRemarks: '',
      distributionRowKeys: [],
      titles: {},
      noteDetail: {},
      addSment: {
        user_id: '',
        name: '',
        company: '',
        reject_money: '',
        order_ids: '',
      },
      distributionIndex: 0,
      timer: '',
      //头部导航标签
      navIndex: 0,

      //   结算单列表
      // 搜索条件
      statementParams: {
        // 方法类型（0：查询数据，1：导出数据）默认为0
        function_type: '0',
        // 查询类型：1-昵称 ，2-手机号
        search_type: '1',
        // 0：待确定，1：已确定，2：全部
        search_content: '',
        status: '2',
      },
      // 下拉选options
      statementOptions: {
        listSearchTypeOptions: [
          {
            key: '1',
            label: '昵称',
          },
          {
            key: '2',
            label: '手机号',
          },
        ],
        listStatusOptions: [
          {
            key: '2',
            label: '全部',
          },
          {
            key: '0',
            label: '待确定',
          },
          {
            key: '1',
            label: '已确定',
          },
        ],
        detailSearchTypeOptions: [
          {
            key: '1',
            label: '订单号',
          },
          {
            key: '2',
            label: '门票名称 ',
          },
          {
            key: '3',
            label: '游客',
          },
          {
            key: '4',
            label: '手机号',
          },
        ],
      },
      // 结算单列表
      statementList: [],
      statementColumns: [
        {
          title: this.L('结算单名称'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          ellipsis: true,
        },
        {
          title: this.L('分销员/企业名称'),
          dataIndex: 'nickname',
          scopedSlots: { customRender: 'nickname' },
          ellipsis: true,
        },
        {
          title: this.L('手机号'),
          dataIndex: 'phone',
          scopedSlots: { customRender: 'phone' },
        },
        {
          title: this.L('发布时间'),
          dataIndex: 'create_time',
          scopedSlots: { customRender: 'create_time' },
        },
        {
          title: this.L('订单数量'),
          dataIndex: 'order_count',
          scopedSlots: { customRender: 'order_count' },
        },
        {
          title: this.L('应结金额'),
          dataIndex: 'total_money',
          scopedSlots: { customRender: 'total_money' },
        },
        {
          title: this.L('扣除金额'),
          dataIndex: 'reject_money',
          scopedSlots: { customRender: 'reject_money' },
        },
        {
          title: this.L('结算金额'),
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' },
        },
        {
          title: this.L('状态'),
          dataIndex: 'statement_status_msg',
          scopedSlots: { customRender: 'statement_status_msg' },
        },
        {
          title: this.L('结算时间'),
          dataIndex: 'confirm_time',
        },
        {
          title: this.L('操作'),
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      // 结算单列表分页
      statementPagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        showSizeChanger: true,
        onChange: this.onStatementPaginationChange,
        onShowSizeChange: this.onStatementPaginationPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      // 结算单详情
      statementDetailVisible: false,
      statementDetailParams: {
        // 	结算单id
        pigcms_id: '',
        // 方法类型（0：查询数据，1：导出数据）默认为0
        function_type: '0',
        // 查询类型：1-订单号 ，2-门票名称 ，3-游客， 4-手机号
        search_type: '1',
        // 0：待确定，1：已确定，2：全部
        search_content: '',
        // 开始时间
        start_time: '',
        // 结束时间
        end_time: '',
      },
      statementDetailPagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        showSizeChanger: true,
        onChange: this.onStatementDetailPaginationChange,
        onShowSizeChange: this.onStatementDeatilPaginationPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      statementDetailList: [],
      statementDetailColumns: [
        {
          title: this.L('订单号'),
          dataIndex: 'real_orderid',
        },
        {
          title: this.L('门票名'),
          dataIndex: 'ticket_title',
        },
        {
          title: this.L('景区名称'),
          dataIndex: 'tools_title',
        },
        {
          title: this.L('游客'),
          dataIndex: 'nickname',
        },
        {
          title: this.L('手机号'),
          dataIndex: 'phone',
        },
        {
          title: this.L('数量'),
          dataIndex: 'num',
        },
        {
          title: this.L('金额'),
          dataIndex: 'price',
        },
        {
          title: this.L('佣金'),
          dataIndex: 'commission_level_1',
        },
        {
          title: this.L('邀请奖金'),
          dataIndex: 'commission_level_2',
        },
        {
          title: this.L('状态'),
          dataIndex: 'status_msg',
        },
        {
          title: this.L('下单日期'),
          dataIndex: 'pay_time',
        },
        {
          title: this.L('备注'),
          dataIndex: 'note',
          scopedSlots: { customRender: 'note' },
          ellipsis: true,
        },
      ],
      timerPicker: [],
      peopleSelectIndex: 0
    }
  },
  created() {
    //获取分销员列表统计数据
    this.request(lifeToolsMerchantApi.getAtatisticsInfo).then((res) => {
      this.cardList[0].totals = res.price_settled_in
      this.cardList[1].totals = res.price_settled
      this.cardList[2].totals = res.order_count
      this.cardList[3].totals = res.distributor_count
    })
    this.getLifeToolsList()
  },
  computed: {},
  methods: {
    //列表接口
    getLifeToolsList() {
      this.queryParams.page_size = this.pagination.pageSize
      this.queryParams.page = this.pagination.current
      this.request(lifeToolsMerchantApi.getDistributorList, this.queryParams).then((res) => {
        let arr = res.data
        this.tabData = arr
        this.pagination.total = res.total
      })
    },
    //分销员显示页数变化
    onDistributorPageSizeChange(page, pageSize) {
      console.log(page, pageSize)
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      this.getLifeToolsList()
    },
    //邀请人数显示页数变化
    onPeoplePageSizeChange(page, pageSize) {
      this.peoplePagination.current = 1
      this.peoplePagination.pageSize = pageSize
      this.peopelList()
    },
    onPageSizeChange(page, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      this.getLifeToolsList()
    },
    onProplePageSizeChange(page, pageSize) {
      this.peoplePagination.current = 1
      this.peoplePagination.pageSize = pageSize
      this.peopelList()
    },
    //分销员首页列表事件开始-------------
    //头部大标签页选中事件
    selectClassify(e) {
      this.navIndex = e
      if (this.navIndex == 1) {
        this.$set(this.statementParams, 'function_type', 0)
        this.getStatementList()
      }
    },
    //搜索
    seatch() {
      this.queryParams.function_type = 0
      if (this.nameFlag) {
        this.queryParams.nickname = ''
        this.queryParams.phone = this.seatchValue
      } else {
        this.queryParams.phone = ''
        this.queryParams.nickname = this.seatchValue
      }
      this.getLifeToolsList()
    },
    handleChange1(e) {
      if (e == 0) {
        this.nameFlag = false
      } else if (e == 1) {
        this.nameFlag = true
      }
    },
    handleChange2(e) {
      if (e == 0) {
        this.queryParams.status = null
      } else if (e == 1) {
        this.queryParams.status = 0
      } else if (e == 2) {
        this.queryParams.status = 1
      } else if (e == 3) {
        this.queryParams.status = 2
      }
    },
    //分销类别tab
    distributorCategory(e) {
      this.selectedRowKeys = []
      this.queryParams.type = e
      this.queryParams.function_type = 0
      this.pagination.current = 1
      this.getLifeToolsList()
    },
    //分页筛选事件
    changePage(page, pageSize) {
      this.pagination.current = page
      this.getLifeToolsList()
    },
    //表格选中事件
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    //查看邀请人数
    viewPeople(e) {
      this.titles = e
      this.peopleOptionKey = '1'
      this.peopleNameType = '1'
      this.peopleQueryParams.user_id = e.user_id
      this.peopleQueryParams.level = 1
      this.peopleColumns[2] = {}
      this.peopleColumns[3] = {}
      this.peopleSelectIndex = 0;
      this.peopelList()
      this.peopleVisible = true
    },
    //获取分销员下级用户
    peopelList() {
      this.peopleQueryParams.page_size = this.peoplePagination.pageSize
      this.peopleQueryParams.page = this.peoplePagination.current
      this.request(lifeToolsMerchantApi.getLowerLevel, this.peopleQueryParams).then((res) => {
        this.peopleTabData = res.data
        this.peoplePagination.total = res.total
        if(this.peopleSelectIndex == 0){
           this.peopleColumns[2] = {}
           this.peopleColumns[3] = {}
        }else{
          this.peopleColumns[2] = {
          title: this.L('上级分销员昵称'),
          dataIndex: 'p_nickname',
        }
        this.peopleColumns[3] = {
          title: this.L('上级分销员手机号'),
          dataIndex: 'p_phone',
        }
        }
      })
    },
    //查看分销清单
    viewDistribution(e) {
      this.titles = e
      this.timerPicker = [];
      this.distributionIndex = 0
      this.distributionRowKeys = []
      this.distributionQueryParams.status = 0
      this.distributionQueryParams.user_id = e.user_id
      this.distributionListpagination.pageSize = 10
      this.timer = ''
      this.distributionQueryParams.start_time = ''
      this.distributionQueryParams.end_time = ''
      this.getDistributionOrderLists()
      this.distributionVisible = true
    },
    // 打开弹框
    showModal(item) {
      this.visible = true
      this.arletItem = item.custom_form
      this.submit.user_id = item.user_id
      this.submit.audit_msg = item.audit_msg
    },
    // 打开弹框
    listDelelt(item) {
      this.$confirm({
        title: this.L('确定要删除此行数据吗？'),
        content: this.L('删除将不再显示'),
        centered: true,
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.request(lifeToolsMerchantApi.delDistributor, { user_id: item.user_id }).then((res) => {
              resolve()
              this.$message.success(res.msg)
              this.getLifeToolsList()
            })
          }).catch(() => console.log('Oops errors!'))
        },
      })
    },
    //分销员首页列表事件结束-------------

    //首页列表邀请人数分销清单以及操作事件开始-------------
    //确认提交
    handleOk(e) {
      if (!this.submit.audit_status) {
        this.$message.info('请勾选是否审核通过单选框再提交')
        return
      }
      this.confirmLoading = true
      this.request(lifeToolsMerchantApi.audit, this.submit)
        .then((res) => {
          this.visible = false
          this.confirmLoading = false
          this.submit.audit_status = null
          this.getLifeToolsList()
          this.$message.success(res.msg)
        })
        .catch((err) => {
          this.confirmLoading = false
        })
    },
    //取消弹框
    handleCancel(e) {
      this.visible = false
    },
    //单选事件
    onChange1(e) {
      if (e.target.value == 0) {
        this.submit.audit_status = 1
      } else {
        this.submit.audit_status = 2
      }
    },
    //查看图片
    previewImageClick(item) {
      this.viewImg = item
      this.previewVisible = true
    },
    //关闭图片
    previewImageCancel() {
      this.previewVisible = false
    },
    //首页列表邀请人数分销清单以及操作事件结束-------------

    //邀请人数弹框中的事件开始-------------
    //邀请人数分页筛选事件
    changePage1(page, pageSize) {
      this.peoplePagination.current = page
      this.peopelList()
    },
    //邀请人数列表tabs事件
    peopleSelect(e) {
      this.peopleSelectIndex=e
      if(e == 0){
        this.peopleOption = [{
          key: '1',
          label: this.L('昵称'),
        },
        {
          key: '2',
          label: this.L('手机号'),
        }]
      }else {
        this.peopleOption.push({
          key: '3',
          label: this.L('上级分销员昵称'),
        },{
          key: '4',
          label: this.L('上级分销员手机号'),
        },)
      }
      this.peopleQueryParams.level = parseInt(e) + parseInt(1)
      this.peopleQueryParams.function_type = 0
      this.peopleQueryParams.content = ''
      this.peopleQueryParams.select_type = '1';
      this.peoplePagination.current = 1
      this.peopleOptionKey = '1'
      this.peopleNameType = '1'
      this.peopleValue = ''
      this.peopelList()
    },
    //筛选选择框事件
    peopleHandleChange(e) {
      this.peopleNameType = e
    },
    //邀请人数搜索
    peopleSearch() {
      this.peopleQueryParams.function_type = 0
      this.peopleQueryParams.select_type = this.peopleNameType
      this.peopleQueryParams.content = this.peopleValue
      this.peopelList()
    },
    //邀请人数导出表格
    exportExcal(e) {
      if (e == 1) {
        this.queryParams.user_ids = ''
        if (this.selectedRowKeys.length == 0) {
          this.queryParams.function_type = 1
        } else {
          this.queryParams.function_type = 1
          this.queryParams.user_ids = this.selectedRowKeys.join(',')
        }
        this.request(lifeToolsMerchantApi.getDistributorList, this.queryParams).then((res) => {
          let url = res.file_url
          if (url) {
            window.open(url)
          }
        })
      } else if (e == 2) {
        this.peopleQueryParams.function_type = 1
        this.request(lifeToolsMerchantApi.getLowerLevel, this.peopleQueryParams).then((res) => {
          let url = res.file_url
          if (url) {
            window.open(url)
          }
        })
      }
    },
    //邀请人数单弹框中的事件结束-------------

    //分销清单弹框中的事件开始-------------
    // 分销清单弹框中的列表接口
    getDistributionOrderLists() {
      this.distributionQueryParams.page_size = this.distributionListpagination.pageSize
      this.distributionQueryParams.page = this.distributionListpagination.current
      this.request(lifeToolsMerchantApi.getDistributionOrderList, this.distributionQueryParams).then((res) => {
        this.distributionListTabData = res.data
        this.distributionListpagination.total = res.total
        if (res.total > 100 && res.total) {
          this.distributionListpagination.pageSizeOptions.splice(6, 1, JSON.stringify(res.total))
        } else {
          this.distributionListpagination.pageSizeOptions.splice(6, 1, '120')
        }
      })
    },
    //分销清单分页筛选事件
    distributionOnSelectChange(selectedRowKeys) {
      this.distributionRowKeys = selectedRowKeys
    },
    //多选列表事件
    distributionChangePage(page, pageSize) {
      this.distributionListpagination.current = page
      this.getDistributionOrderLists()
    },
    ondistributionPageSizeChange(page, pageSize) {
      this.distributionListpagination.current = 1
      this.distributionListpagination.pageSize = pageSize
      //显示全部
      if (pageSize > 100) {
        console.log('显示全部')
        this.distributionQueryParams.get_all = 1
        this.distributionQueryParams.page_size = pageSize
        this.distributionQueryParams.page = this.distributionListpagination.current
        this.request(lifeToolsMerchantApi.getDistributionOrderList, this.distributionQueryParams).then((res) => {
          this.distributionListTabData = res.data
          this.distributionListpagination.total = res.total
        })
      } else {
        console.log('页数显示')
        this.distributionQueryParams.get_all = 0
        this.getDistributionOrderLists()
      }
    },
    //分销清单列表tabs事件
    distributionListSelect(e) {
      this.distributionRowKeys = []
      this.distributionIndex = e
      this.distributionQueryParams.status = e
      this.distributionListpagination.current = 1
      this.distributionListpagination.pageSize = 10
      this.distributionQueryParams.get_all = 0
      this.timer = ''
      this.distributionQueryParams.start_time = ''
      this.distributionQueryParams.end_time = ''
      this.timerPicker = [];
      this.getDistributionOrderLists()
    },
    //时间选择器事件
    onPickerChange(date, dateString) {
      // console.log(date, dateString)
      if(dateString[0] && dateString[1]){
        this.timer = dateString[0] + '-' + dateString[1]
      }else{
        this.timer = ''
      }
      this.distributionQueryParams.start_time = dateString[0]
      this.distributionQueryParams.end_time = dateString[1]
      this.getDistributionOrderLists()
    },
    //生成结算单事件
    settlementSheet() {
      this.settlementVisible = true
      let times = this.dayTime();
      // distributionQueryParams
      let user_name = this.$store.state.user.name
      this.$nextTick(() => {
        if (this.timer) {
          this.form.setFieldsValue({
            name: this.timer + ' 结算单',
            company: user_name?user_name: ''
          })
        } else {
          this.form.setFieldsValue({
            name: times + ' 结算单',
            company: user_name?user_name: ''
          })
        }
      })
    },
    dayTime() {
      let time = new Date()
      let year = time.getYear() //获取当前年份(2位)
      let years = time.getFullYear() //获取完整的年份(4位,1970-????)
      let month = time.getMonth() //获取当前月份(0-11,0代表1月)
      let day = time.getDate() //获取当前日(1-31)
      let Dates = time.toLocaleDateString() //获取当前日期
      let toDay = Dates.replace(/\//g,"-")
      return toDay
    },
    //分销清单备注按钮
    remarksClick(e) {
      console.log(e)
      this.settlementRemarksVisible = true
      this.noteDetail = e
    },
    //分销清单备注弹框确定按钮
    settlementRemarksOk() {
      this.request(lifeToolsMerchantApi.editDistributionOrderNote, {
        distribution_order_id: this.noteDetail.id,
        note: this.settlementRemarks,
      }).then((res) => {
        this.$message.success(res.msg)
        this.settlementRemarksVisible = false
        this.getDistributionOrderLists()
      })
    },
    //分销清单弹框中的事件结束-------------

    //分销清单弹框中里的生成结算单事件开始-------------
    //提交发送结算清单
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        //  console.log('Received values of form: ', values)
        if (!err) {
          this.addSment.order_ids = this.distributionRowKeys.join(',')
          this.addSment.user_id = this.titles.user_id
          this.addSment.name = values.name
          this.addSment.reject_money = values.reject_money
          this.addSment.company = values.company
          this.request(lifeToolsMerchantApi.addStatement, this.addSment).then((res) => {
            this.$message.success(res.msg)
            this.getDistributionOrderLists()
            this.settlementVisible = false
          })
        }
      })
    },
    //分销清单弹框中里的生成结算单事件结束-------------

    // 结算单列表和详情筛选条件select change事件
    statementHandleSelectChange(e, type, field) {
      if (type == 'list') {
        this.$set(this.statementParams, field, e)
      }
      if (type == 'detail') {
        this.$set(this.statementDetailParams, field, e)
      }
    },
    // 结算单列表搜索、导出
    statementHandleClick(function_type = 0) {
      if (function_type == 0) this.$set(this.statementPagination, 'current', 1)
      this.$set(this.statementParams, 'function_type', function_type)
      this.getStatementList()
    },
    // 获取结算单列表
    getStatementList() {
      let params = {
        ...this.statementParams,
        page: this.statementPagination.current,
        page_size: this.statementPagination.page_size,
      }
      this.request(lifeToolsMerchantApi.getStatementList, params).then((res) => {
        if (this.statementParams.function_type == 1 && res.file_url) {
          window.open(res.file_url)
        } else {
          this.statementList = res.data
          this.statementPagination.total = res.total
        }
      })
    },
    // 结算单列表分页
    onStatementPaginationChange(page) {
      this.$set(this.statementPagination, 'current', page)
      this.getStatementList()
    },
    onStatementPaginationPageSizeChange(page, pageSize) {
      this.$set(this.statementPagination, 'current', 1)
      this.$set(this.statementPagination, 'pageSize', pageSize)
      this.getStatementList()
    },
    // 结算单列表查看详情
    showStatementDetailModal(current) {
      this.$set(this.statementDetailParams, 'pigcms_id', current.pigcms_id)
      this.$set(this.statementDetailParams, 'function_type', 0)
      this.$set(this.statementDetailPagination, 'current', 1)
      this.$set(this.statementDetailPagination, 'pageSize', 10)
      this.getStatementDetail(true)
    },
    // 获取结算单详情
    getStatementDetail(statementDetailVisible = false) {
      let params = {
        ...this.statementDetailParams,
        page: this.statementDetailPagination.current,
        page_size: this.statementDetailPagination.page_size,
      }
      this.request(lifeToolsMerchantApi.getStatementDetail, params).then((res) => {
        if (this.statementDetailParams.function_type == 1 && res.file_url) {
          window.open(res.file_url)
        } else {
          this.statementDetailList = res.data
          this.statementDetailPagination.total = res.total
        }
        if (statementDetailVisible) {
          this.statementDetailVisible = true
        }
      })
    },
    // 结算单详情选择日期
    onStatementDetailPickerChange(date, dateString) {
      this.$set(this.statementDetailParams, 'start_time', dateString[0])
      this.$set(this.statementDetailParams, 'end_time', dateString[1])
    },
    // 结算单详情搜索导出
    statementDetailSearch(function_type = 0) {
      if (function_type == 0) this.$set(this.statementDetailPagination, 'current', 1)
      this.$set(this.statementDetailParams, 'function_type', function_type)
      this.getStatementDetail()
    },
    // 结算单详情分页
    onStatementDetailPaginationChange(page) {
      this.$set(this.statementDetailPagination, 'current', page)
      this.getStatementDetail()
    },
    onStatementDetailPaginationPageSizeChange(page, pageSize) {
      this.$set(this.statementDetailPagination, 'current', 1)
      this.$set(this.statementDetailPagination, 'pageSize', pageSize)
      this.getStatementDetail()
    },
  },
}
</script>
<style scoped>
.aTable >>> .ant-table-body::-webkit-scrollbar {
    /*webkit内核*/
    display: block;
    width: 14px;
    height: 14px;
    background: #c1c1c1;
}
.aTable >>> table .ant-table-body {
    /* Firefox */
    scrollbar-width: 14px !important;
    display: block;
    width: 14px;
    height: 14px;
    background: #f1f1f1;
    /* IE 10+ */
    -ms-overflow-style: block !important;
}
/* 滚动槽 */
.aTable >>> .ant-table-body::-webkit-scrollbar-track {
    background: #f1f1f1;
}
/* 滚动条滑块 */
.aTable >>> .ant-table-body::-webkit-scrollbar-thumb {
    background: #c1c1c1;
}
</style>
<style lang="less" scoped>

.edit {
  display: flex;
  justify-content: space-between;
}
.flag {
  margin-left: 2%;
  display: inline-flex;
  align-items: center;
  p {
    margin-bottom: 0;
    margin-right: 10px;
  }
}
.info-list {
  .info {
    display: flex;
    margin-bottom: 24px;
    span:first-child {
      display: inline-block;
      width: 100px;
      text-align: right;
      margin-right: 8px;
    }
    img {
      cursor: pointer;
      min-width: 180px;
      width: 35%;
      height: 130px;
      margin-right: 20px;
    }
    .ant-input {
      width: 40%;
    }
  }
}
.submit_div {
  display: flex;
  justify-content: center;
}
</style>