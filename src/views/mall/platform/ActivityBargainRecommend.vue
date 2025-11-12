<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <div>
      <a-tabs :activeKey="activeKey" @change="actChange">
        <a-tab-pane key="getLimitedRecommendList" tab="秒杀活动"></a-tab-pane>
        <a-tab-pane key="getGroupRecommendList" tab="拼团活动"></a-tab-pane>
        <a-tab-pane key="getBargainRecommendList" tab="砍价活动"></a-tab-pane>
      </a-tabs>
    </div>
    <!-- 搜索条件 -->
    <a-form-model
      layout="inline"
      :model="searchForm"
      @submit="getLimitedRecommendList"
      @submit.native.prevent>
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-form-model-item label="商品名称">
            <a-input
              v-model="searchForm.keywords"
              placeholder="请输入商品名称"
              class="keywords"
              style="width: 200px;"
            />
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item label="推荐状态">
            <a-select 
              v-model="searchForm.isRecommend"
              placeholder="请选择推荐状态" 
              style="width: 150px"
              @change="isRecommendChange">
              <a-select-option value="1"> 已推荐至首页 </a-select-option>
              <a-select-option value="2"> 未推荐至首页 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item label="选择商家">
            <a-radio
              @click="searchRadioOpt(item.value,'1')"
              v-for="item in merchantOptions"
              :key="item.value"
              :checked="item.value == merchantType?true:false">
              {{item.label}}
            </a-radio>
          </a-form-model-item>
          <a-form-model-item label="选择店铺">
            <a-radio
              @click="searchRadioOpt(item.value,'2')"
              v-for="item in storeOptions"
              :key="item.value"
              :checked="item.value == storeType?true:false">
              {{item.label}}
            </a-radio>
          </a-form-model-item>
        </a-col>

        <a-col>
          <a-form-model-item label="活动时间">
            <a-range-picker
              :value="searchForm.time"
              v-model="searchForm.time"
              format="YYYY-MM-DD"
              @change="onDateRangeChange"
            />
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item>
            <a-button type="primary" html-type="submit"> 查询 </a-button>
            <a-button class="ml-20" @click="resetForm"> 重置 </a-button>
<!--            <a-button type="primary" class="ml-40" @click="exportGoods"> 导出商品 </a-button>-->
            <a-button type="primary"  @click="$refs.createModal.add()" style="margin-left: 20px">轮播图列表</a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <!--  -->
    <section class="mt-20">
      <a-row type="flex" justify="space-between">
        <!-- 数据表 -->
        <a-col :span="30">
          <a-table
            :columns="columnsList"
            :data-source="goodsList"
            :pagination="false"
            :row-selection="searchForm.isRecommend == 1?null:{ selectedRowKeys: goodsSelectedRowKeys, onChange: ongoodsSelectChange }"
            rowKey="goods_id">
            <!-- 商品名称 -->
            <template slot="goods_name" slot-scope="text, record">
              <div class="flex align-center">
                <img class="size-45" :src="record.image" />
                <div class="flex flex-direction justify-between">
                  <span class="flex-1 ml-10">{{ text }} </span>
                  <div class="ml-10" v-if="joinActivityOpt(record.join_activity)">
                    <a-tag color="red">
                      {{joinActivityOpt(record.join_activity)}}
                    </a-tag>
                  </div>
                </div>
              </div>
            </template>
            <!-- 售价 -->
            <template slot="price" slot-scope="text, record">
              <span v-if="record.goods_type == 1">{{record.price}}</span>
              <span v-else>￥{{ record.min_price }} - ￥{{record.max_price}}</span>
            </template>
            <!--活动状态-->
            <template slot="status" slot-scope="text, record">
              <span v-if="record.status == 0">未开始</span>
              <span v-if="record.status == 1">进行中</span>
              <span v-if="record.status == 2">已失效</span>
            </template>
            <!-- 排序 -->
            <template slot="sort_platform" slot-scope="text,record">
              <a-input-number
                :default-value="text?text:0"
                :precision="0"
                :min="0"
                v-model="record.sort_platform"
                @blur="handleSortChange($event,text,record)" />
            </template>
            <!-- 操作 -->
            <template slot="action" slot-scope="text, record">
              <a @click="$refs.createModal.edit(record,activeKey)">首页推荐设置</a>
              <a-button
                v-if="searchForm.isRecommend == 1"
                type="link"
                class="link-btn"
                @click="btnOpt(record,'setFirst')">
                 |{{record.is_first == 1?'取消置顶':'置顶'}}
              </a-button>
            </template>
          </a-table>
          <a-row class="mt-20" type="flex" justify="space-between" align="middle">
            <a-col :span="10" class="ml-20">
              <span v-if="searchForm.isRecommend == 2">
                <a-checkbox
                @change="allCheck"
                :checked="goodsSelectedRowKeys.length == goodsList.length && goodsList.length?true:false"
                :disabled="!goodsList.length?true:false">当页全选</a-checkbox>
              <span>已选 {{goodsSelectedRowKeys.length}}</span>
              <a-button
                class="ml-10" 
                type="primary" 
                >批量推荐至首页</a-button>
              </span>
            </a-col>
            <a-col :span="12" style="text-align: right;">
              <a-pagination
                :current="searchForm.page"
                :pageSize="searchForm.pageSize"
                :total="total"
                show-size-changer
                show-quick-jumper
                :show-total="total => `共 ${total} 条记录`"
                @change="onPageChange"
                @showSizeChange="onPageSizeChange" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </section>
    <set-recommend ref="createModal" @ok="handleOk"/>

    <!-- 弹框 -->
    <a-modal
      v-model="modalVisible"
      :title="modalTitle"
      centered
      :maskClosable="false"
      :width="600"
      @ok="handleOk"
      @cancel="handleCancel">
      <!-- 选择商家 || 店铺 -->
      <template v-if="modalType == 1 || modalType == 2">
        <a-form-model
          layout="inline"
          :model="modalSearchForm"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 22 }" >
          <a-form-model-item label="搜索" :labelAlign="'left'" style="width: 100%;">
            <a-input
              v-model="modalSearchForm.search"
              :placeholder="modalType == 1?'请输入商家名称':'请输入店铺名称'" />
          </a-form-model-item>
        </a-form-model>
        <a-table
          :row-selection="{ selectedRowKeys: modalSelectedRowKeys, onChange: onModalSelectChange }"
          :columns="columns"
          :scroll="{y:400}"
          :data-source="modalTableData"
          :row-key="modalType == 1?'mer_id':'store_id'"
          class="mt-20">
          <template slot="name">
            <span>{{modalType == 1?'商家名称':'店铺名称'}}</span>
          </template>
        </a-table>
      </template>
      <!-- 设置积分 -->
      <template v-if="modalType == 3">
        <a-form-model
          layout="inline"
          ref="scoreForm"
          :model="setIntegralFormData"
          :rules="rules" >
          <a-form-model-item
            label="消费1元得积分"
            help="请填写>0的数字，设置百分比请填写%，如2%"
            prop="score_percent">
            <a-input
              v-model="setIntegralFormData.score_percent"
              placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item
            label="积分最大使用数"
            :help="isIntegral == 2?'请填写>0的整数，如10':''"
            prop="score_max">
            <a-row>
              <a-col>
                <a-radio
                  @click="maxScoreRadio(item.value)"
                  v-for="item in integralOptions"
                  :key="item.value"
                  :checked="item.value == isIntegral?true:false">
                  {{item.label}}
                </a-radio>
              </a-col>
            </a-row>
            <a-input
              type="number"
              v-if="isIntegral == 2"
              v-model="setIntegralFormData.score_max"
              placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <!-- 设置佣金 -->
      <template v-if="modalType == 4">
        <a-form-model
          ref="commissionForm"
          :model="commissionFormData"
          :rules="rules" >
          <a-form-model-item
            v-for="item in commissionOptions"
            :key="item.prop"
            :label="item.label"
            :help="item.help"
            :prop="item.prop"
            :label-col="{span: 8}"
            :wrapper-col="{span: 14}">
            <a-input
              type="number"
              :min="0"
              :max="100"
              v-model="commissionFormData[item.prop]"
              placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <!-- 编辑商品跳转商家后台商品编辑页提示 -->
      <template v-if="modalType == 7">
        <p>
          您当前编辑的商家与之前编辑的商家不同，之前编辑数据将被覆盖，您是否继续编辑？
        </p>
      </template>
    </a-modal>
  </div>
</template>


<script>
  import mallPlatformApi from "@/api/mall/platform/index"
  import { getCookie, setCookie } from '@/utils/util'
  import SetRecommend from './SetRecommend.vue'

  export default {
    name: 'ActivityRecomend',
    components: {
      SetRecommend,
    },
    data() {
      return {
        activeKey:'getLimitedRecommendList',
        searchForm: {
          merList: [],
          storeList: [],
          keyword: '',
          page: 1,
          pageSize: 10,
          isRecommend: '2',
          time: [],
          start_time: '', // 活动开始时间
          end_time: '', // 活动结束时间
        },
        merchantType: 1, // 1 全部商家 2部分商家
        storeType: 1, // 1 全部店铺 2部分店铺
        merchantOptions: [
          {
            label: '全部商家',
            value: 1
          },
          {
            label: '部分商家',
            value: 2
          }
        ],
        storeOptions: [
          {
            label: '全部店铺',
            value: 1
          },
          {
            label: '部分店铺',
            value: 2
          }
        ],
        modalType: '', // 弹框类型 1商家 2店铺 3设置积分 4设置佣金 5上架 6下架 7商品编辑提示
        modalVisible: false,
        modalSearchForm: {
          search: '',
          type: '',
          page: 1,
          pageSize: 10
        },
        columns: [
          {
            dataIndex: 'name',
            slots: { title: 'name' },
            align: 'center'
          },
        ],
        modalTableData: [],
        modalSelectedRowKeys: [],
        goodsList: [],
        sortList: [],
        defaultOpenSort: [],
        defaultSort: [],
        catId: '', // 分类id
        columnsList: [],
        columnsGoods: [
          {
            title: '商品名称',
            dataIndex: 'goods_name',
            scopedSlots: { customRender: 'goods_name' },
            width: '260px',
          },
          {
            title: '商家名称',
            dataIndex: 'mer_name',
            width: '150px',
          },
          {
            title: '店铺名称',
            dataIndex: 'store_name',
            width: '150px',
          },
          {
            title: '活动时间',
            dataIndex: 'time',
            scopedSlots: { customRender: 'price' }
          },
          {
            title: '活动状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'price' }
          },
          {
            title: '原价',
            dataIndex: 'price',
            scopedSlots: { customRender: 'price' }
          },
          {
            title: '活动价',
            dataIndex: 'price',
            scopedSlots: { customRender: 'price' }
          },
          {
            title: '实收金额',
            dataIndex: 'price',
            scopedSlots: { customRender: 'price' }
          },
          // {
          //   title: '总销量',
          //   dataIndex: 'sale_num'
          // },
          // {
          //   title: '当前库存',
          //   dataIndex: 'stock_num',
          //   scopedSlots: { customRender: 'stock_num' }
          // },
          { // 已推荐时显示
            title: '排序',
            dataIndex: 'sort_platform',
            scopedSlots: { customRender: 'sort_platform' },
          },
          { // 已推荐时显示
            title: '推荐时间段',
            dataIndex: 'recommend_time',
            scopedSlots: { customRender: 'recommend_time' },
            width: '150px',
          },
          {
            title: '操作',
            dataIndex: 'goods_id',
            width: '200px',
            scopedSlots: { customRender: 'action' },
          }
        ],
        activityOptions: [
          {
            label: '砍价',
            value: 'bargain'
          },
          {
            label: '拼团',
            value: 'group'
          },
          {
            label: '限时',
            value: 'limited'
          },
          {
            label: '预售',
            value: 'prepare'
          },
          {
            label: '周期购',
            value: 'periodic'
          },
          {
            label: 'N元N件',
            value: 'reached'
          },
          {
            label: '满包邮',
            value: 'shipping'
          },
          {
            label: '满赠',
            value: 'give'
          },
          {
            label: '满减',
            value: 'minus'
          },
          {
            label: '满折',
            value: 'discount'
          }
        ],
        goodsSelectedRowKeys: [],
        total: null,
        currentGoods: '',
        rules: {
          // score_percent: [
          //   { require: true, validator: scorePercentVaild, trigger: 'blur' }
          // ]
        },
        commissionFormData: {
          goods_id: '',
          spread_rate: 0,
          sub_spread_rate: 0,
          third_spread_rate: 0
        },
        merInfo: ''
      }
    },
    computed: {
      modalTitle() {
        let title = ''
        if (this.modalType == 1) {
          title = '选择商家'
        } else if (this.modalType == 2) {
          title = '选择店铺'
        } else if (this.modalType == 3) {
          title = '设置积分'
        } else if (this.modalType == 4) {
          title = '设置佣金'
        } else if (this.modalType == 7) {
          title = '提示'
        }
        return title
      }
    },
    created() {
      this.isRecommendChange()
      // this.goodsCategoryList()
      // this.getGoodsList()
      this.getLimitedRecommendList()
    },
    methods: {
      // 活动列表
      getActList() {
        this.request(mallPlatformApi[this.activeKey], this.searchForm).then((data) => {
          this.goodsList = data.list || []
          this.total = data.count
        })
      },
      //监听日期选择变化
      onDateRangeChange(date, dateString) {
        console.log(date,'date')
        // 更新搜索框表单数据
        this.$set(this.searchForm, 'time', [date[0], date[1]])
        this.$set(this.searchForm, 'start_time', dateString[0])
        this.$set(this.searchForm, 'end_time', dateString[1])
      },
      // 活动tab切换
      actChange(activeKey) {
        this.activeKey = activeKey
        this.getActList()
      },
      // 部分商家 || 部分店铺
      searchRadioOpt(value,modalType) {
        this.modalType = modalType
        if (this.modalType == 1) {
          this.merchantType = value
        } else if (this.modalType == 2) {
          this.storeType = value
        }
        if (value == 2) {
          this.modalVisible = true
        }
        this.getMerOrStoreList()
      },
      // 是否已推荐change
      isRecommendChange() {
        this.columnsList = this.columnsGoods.filter(item => {
          if (this.searchForm.isRecommend == 2) {
            if (item.dataIndex != 'sort_platform' && item.dataIndex != 'recommend_time') {
              return item
            } 
          } else {
            return item
          }
        })

        if (this.searchForm.isRecommend == 2) {
          this.goodsSelectedRowKeys = []
        }
        // 查询列表
      },
      // 获取店铺或商家列表
      getMerOrStoreList() {
        this.modalTableData = []
        this.$set(this.modalSearchForm, 'type', this.modalType)
        this.request(mallPlatformApi.getMerOrStoreList, this.modalSearchForm).then((data) => {
          this.modalTableData = data.list || []
        })
      },
      // 弹框表格多选
      onModalSelectChange(selectedRowKeys) {
        this.modalSelectedRowKeys = selectedRowKeys;
      },
      // // 查询
      // getGoodsList() {
      //   console.log(this.searchForm,'this.searchForm')
      //   this.goodsList = this.$options.data().goodsList
      //   this.$set(this.searchForm, 'cat_id', this.catId)
      //   this.request(mallPlatformApi.getGoodsList, this.searchForm).then((data) => {
      //     this.goodsList = data.list || []
      //     this.total = data.count
      //   })
      // },
      getActivityRecommendList() {
        this.request(mallPlatformApi.getActivityRecommendList, this.queryParam).then((res) => {
            console.log(res.list)
            this.searchHotList = res.list;
            this.pagination.total = res.count;
          }
        )
      },
      getLimitedRecommendList() {
        this.request(mallPlatformApi.getBargainRecommendList, this.queryParam).then((res) => {
            console.log(res.list)
            this.searchHotList = res.list;
            this.pagination.total = res.count;
          }
        )
      },
      // 商品参与的活动
      joinActivityOpt(val) {
        let text = ''
        if (val) {
          text = this.activityOptions.filter(item => item.value == val)[0] || ''
        }
        return text?text['label']:''
      },
      // 获取分类列表
      goodsCategoryList() {
        this.defaultSort = []
        this.defaultOpenSort = []
        this.request(mallPlatformApi.goodsCategoryList, this.searchForm).then((data) => {
          this.sortList = data.list || []
        })
      },
      onSortSelect(e) {
        const { item, key, selectedKeys } = e
        this.catId = key
        this.defaultSort = [key]
        console.log('--------------catId', this.catId)
        this.goodsSelectedRowKeys = []
        this.getGoodsList()
      },
      onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find((key) => this.defaultOpenSort.indexOf(key) === -1)
        if (this.defaultOpenSort.indexOf(latestOpenKey) === -1) {
          this.defaultOpenSort = openKeys
        } else {
          this.defaultOpenSort = latestOpenKey ? [latestOpenKey] : []
        }
      },
      // 重置
      resetForm() {
        Object.assign(this.$data, this.$options.data())
        this.goodsCategoryList()
        this.getGoodsList()
      },
      // 排序
      handleSortChange(e,val,record) {
        let params = {
          goods_id: record.goods_id,
          sort: val
        }
        this.request(mallPlatformApi.goodsSetSort, params).then((data) => {
          this.getGoodsList()
        })
      },
      // 按钮操作
      btnOpt(record, type, modalType = '', singleGoods = true) {
        this.currentGoods = record

        if (type == 'setFirst') {
          this.setFirstOpt(record)
          return
        }
      },
      // 确认编辑商品
      editGoods(isSetTicket = false) {
        this.modalVisible = false
        this.modalType = ''
        let url = location.href.substring(0,location.href.indexOf('#'))
        // 商家登陆token信息
        if (isSetTicket) {
          setCookie('merchant_access_token', this.merInfo.ticket, null)
        }
        window.open(`${url}#/merchant/merchant.mall/editGoods?store_id=${this.currentGoods.store_id}&goods_id=${this.currentGoods.goods_id}`)
      },
      // 设置置顶
      setFirstOpt(record) {
        let params = {
          goods_id: record.goods_id,
          is_first: record.is_first == 1?0:1,
          cat_id: this.catId
        }
        this.request(mallPlatformApi.goodsSetFirst, params).then((data) => {
          this.$message.success('设置成功！')
          this.modalType = ''
          this.getGoodsList()
        })
      },
      // 弹框确认
      handleOk() {
        if (this.modalType == 1) {
          this.$set(this.searchForm, 'merList', this.modalSelectedRowKeys )
        } else if (this.modalType == 2) {
          this.$set(this.searchForm, 'storeList', this.modalSelectedRowKeys )
        }

        // 选择商家 || 店铺
        if (this.modalType == 1 || this.modalType == 2) {
          this.modalVisible = false
          this.modalSelectedRowKeys = []
          this.modalTableData = []
        }

      },
      // 弹框取消
      handleCancel() {
        let formData = ''
        if (this.modalType == 3) {
          formData = 'scoreForm'
        }
        if (this.modalType == 4) {
          formData = 'commissionForm'
        }
        if (formData) {
          this.$refs[formData].clearValidate()
        }

        if (this.currentGoods) {
          this.currentGoods = ''
        }
        if (this.merInfo) {
          this.merInfo = ''
        }
        this.modalType = ''
      },
      // 页码变化
      onPageChange(page, pageSize) {
        this.$set(this.searchForm, 'page', page)
        this.getGoodsList()
      },
      // pageSize变化
      onPageSizeChange(page, pageSize) {
        this.$set(this.searchForm, 'pageSize', pageSize)
        this.getGoodsList()
      },
      // 商品列表多选
      ongoodsSelectChange(selectedRowKeys) {
        this.goodsSelectedRowKeys = selectedRowKeys
      },
      // 当页全选
      allCheck(e) {
        if (e.target.checked) {
          this.goodsSelectedRowKeys = this.goodsList.map(item => item.goods_id)
        } else {
          this.goodsSelectedRowKeys = []
        }
      }
    }
  }
</script>
<style  scoped>
  .keywords {
    width: 300px;
  }
  .link-btn.ant-btn {
    padding: 0 4px;
  }
  .flex-direction {
    flex-direction: column;
  }
</style>