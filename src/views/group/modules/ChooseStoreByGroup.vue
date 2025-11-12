<template>
  <div>
    <!-- 设置团购推荐选择绑定的店铺弹窗 -->
    <a-modal
      :visible="dialogVisible"
      title="选择店铺"
      centered
      :maskClosable="false"
      :width="600"
      @ok="chooseStoreOk"
      @cancel="chooseStoreCancel"
    >
      <template>
        <a-form-model layout="inline" :model="modalSearchForm" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
          <!-- 省市区选择 -->
          <a-row>
            <a-col :span="10" class="mr-10">
              <a-cascader
                v-model="searchForm.areaList"
                :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"
                :options="areaList"
                placeholder="请选择省市区"
                @change="onAreaChange"
              />
            </a-col>
            <a-col :span="10" class="mr-20">
              <a-input
                v-model="modalSearchForm.keyword"
                @keyup.enter.native="selectStoreList()"
                placeholder="输入店铺名称"
              />
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="selectStoreList()">
                查询
              </a-button>
            </a-col>
          </a-row>
        </a-form-model>
        <a-table
          :row-selection="{ selectedRowKeys: modalSelectedRowKeys, onChange: onModalSelectChange }"
          :columns="columns"
          :scroll="{ y: 400 }"
          :data-source="modalTableData"
          :row-key="'store_id'"
          class="mt-20"
        >
          <template slot="name">
            <span>店铺名称</span>
          </template>
        </a-table>
      </template>
    </a-modal>
    <!-- 选择店铺弹窗 end -->
  </div>
</template>

<script>
import groupMerchantApi from '@/api/group/merchant/index'
export default {
  props: {
    // 打开弹框
    visible: {
      type: Boolean,
      default: false
    },
    storeIdArr: {
      type: [Array, Object],
      default: () => {}
    },
    groupId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    visible(newVal, oldVal) {
      this.dialogVisible = newVal
      this.modalSearchForm.group_id = this.groupId
      this.modalSelectedRowKeys = this.storeIdArr
      this.storeIds = this.storeIdArr
      this.modalSearchForm.keyword = ''
      this.modalSearchForm.city_id = ''
      this.modalSearchForm.area_id = ''
      this.modalSearchForm.province_id = ''
      this.modalSearchForm.page = 1
      this.getAllArea()
      this.selectStoreList()
    }
  },
  mounted() {
    this.dialogVisible = this.visible
    this.modalSelectedRowKeys = this.storeIds
    this.getAllArea()
    this.selectStoreList()
  },
  data() {
    return {
      dialogVisible: false, // 设置店铺弹窗
      areaList: [], // 省市区列表
      searchForm: {
        storeIdArray: [], // 店铺id列表
        areaList: []
      },
      storeIds: this.storeIdArr || [], // 店铺id

      // 筛选店铺列表参数
      modalSearchForm: {
        province_id: '', // 省份id
        city_id: '', // 城市id
        area_id: '', // 区域id
        keyword: '', // 关键词搜索
        page: 1 // 当前页码
      },
      columns: [
        {
          dataIndex: 'name',
          slots: { title: 'name' },
          align: 'center'
        }
      ],
      modalTableData: [], // 商家店铺信息
      curStoreList: [], // 选中的店铺列表
      modalSelectedRowKeys: []
    }
  },
  methods: {
    // 获取店铺列表
    selectStoreList() {
      this.modalTableData = []
      this.request(groupMerchantApi.getMerchantStoreList, this.modalSearchForm).then(data => {
        this.modalTableData = data.list || []
      })
    },
    //获取地区信息
    getAllArea() {
      this.request(groupMerchantApi.getAllArea).then(response => {
        this.areaList = response
      })
    },
    // 选择地区完成后的回调
    onAreaChange(value) {
      this.modalSearchForm.province_id = value[0]
      this.modalSearchForm.city_id = value[1]
      this.modalSearchForm.area_id = value[2]
      this.selectStoreList()
    },
    // 选择套餐
    onExpandedRowChange(e, record) {
      let curStoreId = record.store_id // 当前店铺id
      const result = this.storeIds.findIndex(item => item.store_id == curStoreId)
      if (result > -1) {
        this.storeIds[result].package_id = curPackageId
      } else {
        this.storeIds.push({
          curStoreId,
        })
      }
    },
    // 店铺选择--弹窗确定
    chooseStoreOk() {
      this.$set(this.searchForm, 'storeIdArray', this.modalSelectedRowKeys)
      this.curStoreList = []

      this.modalSelectedRowKeys.forEach(item => {
        this.modalTableData.forEach(subItem => {
          if (item == subItem.store_id) {
            this.curStoreList.push(subItem)
          }
        })
      })
      this.$emit('submit', { storeIds: this.storeIds })
    },
    // 店铺选择--弹窗取消
    chooseStoreCancel() {
      this.modalTableData = []
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    },
    // 店铺选择--表格选择
    onModalSelectChange(modalSelectedRowKeys) {
      this.storeIds = []
      this.modalSelectedRowKeys = modalSelectedRowKeys
      this.modalSelectedRowKeys.forEach(item => {
        this.storeIds.push(item)
      })
    }
  }
}
</script>

<style scoped></style>
