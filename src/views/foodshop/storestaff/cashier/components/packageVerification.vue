<template>
  <!-- 团购核销 -->
  <a-modal
    v-model="showModal"
    wrapClassName="borderradius"
    :footer="null"
    :title="null"
    :centered="true"
    width="43%"
    :maskClosable="false"
    :closable="false"
    :bodyStyle="{ padding: 0 }"
    destroyOnClose
  >
    <div class="alert_wrapper">
      <div class="change_diners_wrapper">
        <div class="title_container">
          <div class="leftempty_box"></div>
          <div class="title_font">{{ L('团购核销') }}</div>
          <div class="closeicon" @click="closemodel()">
            <img src="../../../../../assets/storestaff/close.png" alt="" />
          </div>
        </div>
        <div class="bottom_container">
          <div class="vip_account_search_container">
            <div class="search_color_content">
              <input class="vip_input" type="number" v-model="searchContent" :placeholder="L('请输入团购核销码')" />
              <div class="delbtn" @click="delfnc()">
                <img src="../../../../../assets/storestaff/greydel.png" alt="" />
              </div>
            </div>
            <div
              class="searchresult"
              :class="searchContent.trim() != '' ? '' : 'greysearch'"
              @click="verificationOpt()"
            >
              {{ L('核销') }}
            </div>
          </div>
          <div class="list" v-if="verificPackageList && verificPackageList.length">
            <template v-for="(item, index) in verificPackageList">
              <div :key="index" class="package_item">
                <span class="package_name">{{ item.package_name }}</span>
                <span class="package_status">{{ L('已核销') }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    ORDER_ID: {
      type: [String, Number],
      default: '',
    },
    verificPackageList: {
      // 已核销套餐列表
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      searchContent: '',
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    closemodel() {
      this.searchContent = ''
      this.$emit('closemodel')
    },
    delfnc() {
      this.searchContent = ''
    },
    // 团购核销
    verificationOpt() {
      if (this.searchContent.trim() == '') return
      if (!this.ORDER_ID) return

      let params = {
        order_id: this.ORDER_ID,
        group_pass: this.searchContent,
      }

      this.request('/foodshop/storestaff.order/verificationPackage', params).then((res) => {
        this.$message.success(this.L('核销成功') + '！')
        this.searchContent = ''
        // 更新核销列表
        this.$emit('updateVerificPackageList')
      })
    },
  },
}
</script>

<style scoped lang="less">
@rem: 192; //定义页面尺寸
.change_diners_wrapper {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  .title_container {
    width: 100%;
    height: 100 / @rem * 1rem;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 40 / @rem * 1rem;
    .title_font {
      font-size: 32 / @rem * 1rem;
      font-weight: bold;
      color: #222222;
    }
    .leftempty_box {
      width: 20 / @rem * 1rem;
      height: 20 / @rem * 1rem;
    }
    .closeicon {
      cursor: pointer;
      width: 20 / @rem * 1rem;
      height: 20 / @rem * 1rem;
      display: flex;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .bottom_container {
    width: 100%;
    background-color: #ffffff;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 29 / @rem * 1rem;
    .vip_account_search_container {
      width: 100%;
      height: 125 / @rem * 1rem;
      display: flex;
      align-items: center;
      .search_color_content {
        width: 400 / @rem * 1rem;
        height: 70 / @rem * 1rem;
        background-color: #f0f0f0;
        border-radius: 4 / @rem * 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 20 / @rem * 1rem;
        .vip_input {
          width: 240 / @rem * 1rem;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 26 / @rem * 1rem;
          font-weight: 500;
          color: #333333;
        }
        .vip_input::placeholder {
          font-size: 20 / @rem * 1rem;
        }
      }

      .searchresult {
        cursor: pointer;
        width: 100 / @rem * 1rem;
        height: 70 / @rem * 1rem;
        background: #fea017;
        border-radius: 4 / @rem * 1rem;
        font-size: 24 / @rem * 1rem;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
        line-height: 70 / @rem * 1rem;
        margin-left: 15 / @rem * 1rem;
      }

      .greysearch {
        background: #c8c5c8;
      }
    }
    .list {
      max-height: 600 / @rem * 1rem;
      padding-bottom: 20 / @rem * 1rem;
      width: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      .package_item {
        margin-bottom: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 26 / @rem * 1rem;
        line-height: 36 / @rem * 1rem;
        color: #333333;
        .package_name {
          flex: 1;
          margin-right: 10px;
          white-space: pre-wrap;
          word-break: break-all;
          word-wrap: break-word;
        }
        .package_status {
          color: #c8c5c8;
        }
      }
    }
  }
}
</style>
