<template>
    <!-- 体育课程 || 体育馆列表 -->
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <!-- <a-button type="default" @click="getLifeToolsList">体育课程列表</a-button> -->
    <a-tabs :active-key="type" @change="changeTabs" size="large">
      <a-tab-pane v-for="pane in typeList" :key="pane.key" :tab="pane.title">
        <a-row>
          <a-input-search placeholder="搜索标题/描述/电话/地址/标签" style="width: 300px" @search="onSearch" />
          <a-select v-model="queryParams.audit_status" style="width: 100px" @change="handleSelectChange">
            <a-select-option value="">全部状态</a-select-option> 
            <a-select-option :value="0">待审核</a-select-option> 
            <a-select-option :value="1">审核成功</a-select-option> 
            <a-select-option :value="2">审核失败</a-select-option> 
          </a-select>
          <router-link :to="'/merchant/merchant.life_tools/Edit?type=' + type">
            <a-button type="primary" style="margin: 10px 10px">
              {{ type == 'course' ? '添加体育课程' : '添加体育馆' }}
            </a-button>
          </router-link>
        </a-row>
        <a-table
          style="background: #ffffff"
          :columns="columns"
          rowKey="tools_id"
          :data-source="dataList"
          @change="changePage"
          :pagination="pagination"
        >
          <!-- 类型 -->
          <span slot="type" slot-scope="text">
            {{ typeMap[text] }}
          </span>
          <!-- 价格 -->
          <span slot="money" slot-scope="text"> ￥{{ text }} </span>
          <!-- 标签 :color="colorMap[index%7]"-->
          <span slot="label_arr" slot-scope="text" style="max-width: 230px;display:inline-block;">
            <a-tag v-for="(tag, index) in text" :key="index" style="margin: 4px;">
              {{ tag }}
            </a-tag>
          </span>
          <!-- 门票 -->
          <span slot="ticket" slot-scope="text, item">
            <router-link :to="'/merchant/merchant.life_tools/TicketList?tools_id=' + text">
              {{ item.type == 'stadium' ? '场馆套餐' : '课程套餐' }}
            </router-link>
          </span>
          <!-- 排序 -->
          <span slot="sort" slot-scope="text, item">
            <a-input-number
              style="width: 60px"
              :min="0"
              :max="10000"
              @blur="changeSort($event, item.tools_id)"
              :default-value="text"
            />
          </span>
          <!-- 是否热门 -->
          <span slot="is_hot" slot-scope="text, item">
            <a-switch
              checked-children="启用"
              un-checked-children="关闭"
              :checked="item.is_hot == 1 ? true : false"
              @change="isHotSwitchChange(item.tools_id, $event)"
            />
          </span>
          <!-- 状态 -->
          <span slot="status" slot-scope="text, item">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="item.status == 1 ? true : false"
              @change="switchChange(item.tools_id, $event)"
            />
          </span>

            <!-- 景区状态 -->
            <a @click="scenicCloseClick(record)" slot="scenic_close" slot-scope="text,record">{{ record.is_close_name }}</a>

          <!-- 審核状态 -->
          <span slot="audit_status" slot-scope="index, item">
            <span v-if="item.audit_status == 0" style="color: #faad14">{{ item.audit_status_text }}</span>
            <span v-else-if="item.audit_status == 1" style="color: #52c41a">{{ item.audit_status_text }}</span>
            <span v-else-if="item.audit_status == 2" style="color: #f5222d">{{ item.audit_status_text }}</span>
          </span>
          <!-- 备注 -->
          <span slot="audit_msg" slot-scope="audit_msg">{{ audit_msg ? audit_msg : '无' }}</span>
          <!-- 操作栏 -->
          <span slot="action" slot-scope="text">
            <a class="inline-block" @click="addEditLifeTools(text)" style="margin-right: 10px">{{ L('编辑') }}</a>
            <a class="inline-block" @click="delLifeTools(text)">{{ L('删除') }}</a>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>
      <a-modal
          destroyOnClose
          title="设置暂停营业"
          :visible="visible"
          :centered="true"
          @cancel="()=>{visible = false}"
          @ok="handleOk"
          okText="提交"
      >
          <div>
              <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-model-item label="是否暂停">
                      <a-switch  v-model="examineParams.is_close" checked-children="是" un-checked-children="否" />
                  </a-form-model-item>
                  <a-form-model-item label="自定义文案">
                      <a-textarea
                          placeholder="请输入文案"
                          v-model="examineParams.is_close_body"
                          :auto-size="{ minRows: 3, maxRows: 6 }"
                      />
                  </a-form-model-item>
              </a-form-model>
          </div>
      </a-modal>
  </div>
</template>

<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
export default {
  components: {},
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      // 体育场馆/课程状态开启/暂停参数
      examineParams: {
          tools_id: '',
          is_close_body: '',
          is_close: false,
      },
      visible: false,
      dataList: [],
      typeList: [
        {
          title: '体育课程',
          key: 'course',
        },
        {
          title: '体育馆',
          key: 'stadium',
        },
      ],
      type: 'course',
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        page: 1,
      },
      queryParams: {
        page_size: 0,
        page: 1,
        keywords: '',
        type: 'course',
        audit_status: ""
      },
      colorMap: ['green', 'cyan', 'blue', 'purple', 'pink', 'red', 'orange'],
      typeMap: {
        stadium: '场馆',
        course: '课程',
      },
      columns: [
        {
          title: this.L('标题'),
          dataIndex: 'title',
        },
        // {
        //   title: this.L('简介'),
        //   dataIndex: 'introduce',
        // },
        {
          title: this.L('类型'),
          dataIndex: 'type',
          key: 'type',
          scopedSlots: {
            customRender: 'type',
          },
        },
        {
          title: this.L('联系电话'),
          dataIndex: 'phone',
          width: 120,
        },
        {
          title: this.L('金额'),
          dataIndex: 'money',
          key: 'money',
          scopedSlots: {
            customRender: 'money',
          },
        },
        {
          title: this.L('点击量'),
          dataIndex: 'view_count',
        },
        {
          title: this.L('标签/教练'),
          dataIndex: 'label_arr',
          key: 'label_arr',
          scopedSlots: {
            customRender: 'label_arr',
          },
        },
          {
              title: this.L('课程状态'),
              dataIndex: 'scenic_close',
              key: 'scenic_close',
              scopedSlots: {
                  customRender: 'scenic_close',
              },
          },
        {
          title: this.L('套餐列表'),
          dataIndex: 'tools_id',
          key: 'ticket',
          scopedSlots: {
            customRender: 'ticket',
          },
        },
        {
          title: this.L('排序'),
          dataIndex: 'sort',
          key: 'sort',
          scopedSlots: {
            customRender: 'sort',
          },
        },

        // {
        //   title: this.L('是否热门'),
        //   dataIndex: 'is_hot',
        //   key: 'is_hot',
        //   scopedSlots: {
        //     customRender: 'is_hot'
        //   },
        // },

        {
          title: this.L('是否启用'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: {
            customRender: 'status',
          },
        },
        {
          title: this.L('审核状态'),
          dataIndex: 'audit_status',
          key: 'audit_status',
          scopedSlots: {
            customRender: 'audit_status',
          },
        },
        {
          title: this.L('审核备注'),
          dataIndex: 'audit_msg',
          key: 'audit_msg',
          scopedSlots: {
            customRender: 'audit_msg',
          },
        },
        {
          title: this.L('提交时间'),
          dataIndex: 'add_audit_time',
        },
        {
          title: this.L('操作'),
          dataIndex: 'tools_id',
          key: 'action',
          width: 100,
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
    }
  },
  mounted() {
    this.getLifeToolsList()
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
 },
  methods: {
      // 景区状态操作按钮
      scenicCloseClick(item){
          this.examineParams.is_close = item.is_close == 1 ? true : false;
          this.examineParams.is_close_body = item.is_close_body;
          this.examineParams.tools_id = item.tools_id;
          this.visible = true;
      },
      //  提交景区状态操作
      handleOk(e) {
          if (this.examineParams.is_close == 1 && this.examineParams.is_close_body == '') {
              this.$message.warning('自定义文案不能为空！')
              return false;
          }
          this.request(lifeToolsMerchantApi.changeCloseStatus, this.examineParams).then((res) => {
              this.$message.success('操作成功！');
              this.visible = false
              this.getLifeToolsList()
          })

      },
    getLifeToolsList() {
      this.queryParams.page_size = this.pagination.pageSize
      this.queryParams.page = this.pagination.current
      this.queryParams.type = this.type
      this.request(lifeToolsMerchantApi.getLifeToolsList, this.queryParams).then((res) => {
        this.dataList = res.data
        this.pagination.total = res.total
      })
    },
    changePage(page, pageSize) {
      this.pagination.current = page.current
      this.getLifeToolsList()
    },
    onSearch(text) {
      this.queryParams.keywords = text
      this.getLifeToolsList()
    },
    delInformation(pigcms_id) {
      this.$confirm({
        title: '确定删除吗？',
        centered: true,
        onOk: () => {
          this.request(lifeToolsMerchantApi.delInformation, {
            pigcms_id,
          }).then((res) => {
            this.$message.success(this.L('操作成功！'))
            this.getLifeToolsList()
          })
        },
        onCancel() {},
      })
    },
    // 改变排序
    changeSort(e, tools_id) {
      const sort = e.currentTarget.value
      this.request(lifeToolsMerchantApi.setLifeToolsAttrs, {
        tools_id,
        sort,
      }).then((res) => {
        this.getLifeToolsList()
      })
    },

    // 改变开关状态
    switchChange(tools_id, status) {
      status = status ? 1 : 0
      this.request(lifeToolsMerchantApi.setLifeToolsAttrs, {
        tools_id,
        status,
      }).then((res) => {
        this.getLifeToolsList()
      })
    },

    // 改变开关状态
    isHotSwitchChange(tools_id, is_hot) {
      is_hot = is_hot ? 1 : 0
      this.request(lifeToolsMerchantApi.setLifeToolsAttrs, {
        tools_id,
        is_hot,
      }).then((res) => {
        this.getLifeToolsList()
      })
    },
    addEditLifeTools(tools_id) {
      this.$router.push({ path: '/merchant/merchant.life_tools/Edit', query: { tools_id: tools_id, type: this.type } })
    },
    delLifeTools(tools_id) {
      this.$confirm({
        title: '确定删除吗？',
        centered: true,
        onOk: () => {
          this.request(lifeToolsMerchantApi.delLifeTools, { tools_id }).then((res) => {
            this.$message.success(this.L('操作成功！'))
            this.getLifeToolsList()
          })
        },
        onCancel() {},
      })
    },
    changeTabs(val) {
      this.type = val
      this.queryParams.keywords = ''
      console.log(val);
      if(val == 'course'){
          this.$set(this.columns[6],'title',this.L('课程状态'))
      }else if(val == 'stadium'){
          this.$set(this.columns[6],'title',this.L('场馆状态'))
      }
      this.getLifeToolsList()
    },
    handleSelectChange(){
        this.$set(this.pagination,'current',1)
        this.$set(this.pagination,'pageSize',10)
        this.getLifeToolsList()
    }
  },
}
</script>
