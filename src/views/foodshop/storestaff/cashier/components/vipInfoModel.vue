<template>
  <div class="change_diners_wrapper">
    <div class="title_container">
      <div class="leftempty_box"></div>
      <div class="title_font">{{ modelTitle }}</div>
      <div class="closeicon" @click="closemodel()"><img src="@/assets/storestaff/close.png" alt="" /></div>
    </div>
    <div class="bottom_container">
      <div class="vip_account_search_container">
        <div class="search_color_content">
          <input ref="cardRef" v-if="actionType == 'internalCard'" class="vip_input" type="number" v-model="searchContent" :placeholder="L('请输入一卡通卡号/手机号')" />
          <input ref="cardRef" v-else class="vip_input" type="number" v-model="searchContent" :placeholder="L('请输入手机号,会员卡号')" />
          <div class="delbtn" @click="delfnc()"><img src="@/assets/storestaff/greydel.png" alt="" /></div>
        </div>
        <div class="searchresult" :class="searchContent ? '' : 'greysearch'" @click="getinfo()">{{ L('查询') }}</div>
        <template v-if="actionType == 'internalCard' && internalCardInfo">
            <div class="confirm_use" @click="useVip()">{{ L('确认使用') }}</div>
        </template>
        <template v-else-if="actionType == 'membership' && modelInfo.uid">
            <div class="confirm_use" @click="useVip()">{{ L('确认使用') }}</div>
        </template>
      </div>

      <div class="vip_info_container" v-if="actionType == 'internalCard' && internalCardInfo">
        <div class="infohear_box">{{ L('一卡通信息') }}</div>
        <div class="infobody_box" v-for="(item,index) in internalCardInfo.internal_card_ids" :key="index">
          <div class="value_items">
            <div class="key ios_fit">{{ L('卡号名称') }}</div>
            :
            <div class="value">{{ item.card_name }}</div>
          </div>
          <div class="value_items">
            <div class="key">{{ L('手机号码') }}</div>
            :
            <div class="value">{{ item.phone }}</div>
          </div>
          <div class="value_items">
            <div class="key">{{ L('卡号') }}</div>
            :
            <div class="value">{{ item.card_id }}</div>
          </div>
          <div class="value_items lastitem">
            <div class="key">{{ L('余额') }}</div>
            :
            <div class="value">
              <span>{{ L('￥') }}</span>
              {{ item.balance_money }}
            </div>
          </div>
        </div>
      </div>

      <div class="vip_info_container" v-else-if="actionType == 'membership' && modelInfo.id">
        <div class="infohear_box">{{ L('用户信息') }}</div>
        <div class="infobody_box">
          <div class="value_items">
            <div class="key ios_fit">{{ L('姓名') }}</div>
            :
            <div class="value">{{ modelInfo.name }}</div>
          </div>
          <div class="value_items">
            <div class="key">{{ L('手机号码') }}</div>
            :
            <div class="value">{{ modelInfo.phone }}</div>
          </div>
          <div class="value_items">
            <div class="key">{{ L('会员卡号') }}</div>
            :
            <div class="value">{{ modelInfo.id }}</div>
          </div>
          <div class="value_items">
            <div class="key">{{ L('实体卡号') }}</div>
            :
            <div class="value" v-if="modelInfo.physical_id">{{ modelInfo.physical_id }}</div>
            <div class="value" v-else>{{ L('无') }}</div>
          </div>
          <div class="value_items">
            <div class="key">{{ L('会员折扣') }}</div>
            :
            <div class="value">{{ L('X1折', { X1: parseFloat(modelInfo.card_discount) }) }}</div>
          </div>
          <div class="value_items blackfont">
            <div class="key">{{ L('可用平台积分') }}</div>
            :
            <div class="value">{{ modelInfo.score_count }}</div>
          </div>
          <div class="value_items lastitem">
            <div class="key">{{ L('储值余额') }}</div>
            :
            <div class="value">
              <span>{{ L('￥') }}</span>
              {{ modelInfo.card_money }}
            </div>
          </div>
        </div>
      </div>

      <div class="noinfo" v-if="tiptext">{{ tiptext }}</div>

      <div class="bottom_content_btn">
        <div class="btnwrapper" v-if="(loginInfo.uid && actionType == 'membership') || (internalCardInfo && internalCardInfo.useCard == true)">
          <div class="icombox"><img src="../../../../../assets/storestaff/exitout.png" alt="" /></div>
          <div class="exit_btn" @click="signOut()">{{ L('退出登录') }}</div>
        </div>
      </div>
    </div>
    <a-modal
      :title="L('一卡通密码')"
      v-model="passwordVisible"
      @ok="passwordHandleOk"
    >
      <a-input-password :placeholder="L('请输入密码')" v-model="password" ref="cardPwdRef"/>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    loginInfo: Object,
  },
  data() {
    return {
      modelInfo: '',
      searchContent: '',
      tiptext: '',
      modelTitle: this.L('会员卡'),
      actionType: 'membership',//操作类型 membership 会员卡，internalCard 一卡通
      passwordVisible: false,
      password: '',
      internalCardInfo: "",
    }
  },
  created() {
    this.$nextTick(() => {
        $('.vip_input').focus()
    });
    if (this.loginInfo.uid) {
      this.searchContent = this.loginInfo.phone
      this.getinfo()
    }
  },
  methods: {
    closemodel() {
      this.$emit('closemodel')
    },

    getinfo() {
      if (!this.searchContent) return
      if(this.actionType == 'internalCard'){
        //一卡通逻辑
        this.request('/storestaff/appapi.config/internalCard', {
            phone: this.searchContent,
            password: this.password,
          }).then((res) => {
            if(res.need_password){
              this.passwordVisible = true;
              this.$nextTick(()=>{
                this.$refs.cardPwdRef.focus();
              })
              return
            }
            if(res.internal_card_ids && res.internal_card_ids.length > 0){
              this.internalCardInfo = res
              this.passwordVisible = false;
            }
        })
      }else{
        this.request('/storestaff/storestaff.merchantCard/getUserCard', {
            keyword: this.searchContent,
          }).then((res) => {
            console.log(res, '-----------------------查询结果--------------------')
            if (res.id) {
              this.tiptext = ''
              this.modelInfo = res
            } else {
              this.modelInfo = ''
              this.tiptext = this.L('没有查询到信息')
            }
        })
      }
    },

    delfnc() {
      this.searchContent = ''
    },

    useVip() {
      if(this.actionType == 'internalCard'){
        this.internalCardInfo.useCard = true;
        this.internalCardInfo.keyword = this.searchContent;
        this.$emit('saveInternalCard', this.internalCardInfo)
      }else{
        this.$emit('saveuid', this.modelInfo)
      }
      this.closemodel()
    },

    signOut() {
      if(this.actionType == 'internalCard'){
        this.$emit('saveInternalCard', null)
      }else{
        this.$emit('saveuid', {})
      }
      this.modelInfo = ''
      this.internalCardInfo = ''
      this.searchContent = ''
      this.closemodel()
    },
    //更新数据
    updateModelData(actionType,internalCardInfo){
      this.searchContent = '';
      this.actionType = actionType;
      if(actionType == 'internalCard'){
        this.modelTitle = this.L('一卡通')
      }else{
        this.modelTitle = this.L('会员卡')
      }
      if(internalCardInfo){
        this.internalCardInfo = internalCardInfo
      }
      this.$nextTick(()=>{
        this.$refs.cardRef.focus();
      })
    },
    //输入密码确认框
    passwordHandleOk(){
      this.getinfo();
    },
  },
}
</script>

<style lang="less" scoped>
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
        flex: 1;
        height: 70 / @rem * 1rem;
        background-color: #f0f0f0;
        border-radius: 4 / @rem * 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 20 / @rem * 1rem;
        .vip_input {
          width: 100%;
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
      .confirm_use {
        cursor: pointer;
        width: 130 / @rem * 1rem;
        height: 70 / @rem * 1rem;
        background: #00cbb3;
        border-radius: 4 / @rem * 1rem;
        font-size: 24 / @rem * 1rem;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
        line-height: 70 / @rem * 1rem;
        margin-left: 15 / @rem * 1rem;
      }
    }
    .vip_info_container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .infohear_box {
        width: 100%;
        box-sizing: border-box;
        height: 55 / @rem * 1rem;
        background-color: #eeeeee;
        line-height: 55 / @rem * 1rem;
        padding: 0 20 / @rem * 1rem;
        font-size: 20 / @rem * 1rem;
        font-weight: bold;
        color: #333333;
      }
      .infobody_box {
        width: 100%;
        padding: 0 20 / @rem * 1rem;
        padding-top: 30 / @rem * 1rem;
        border: solid 1px #ececec;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        .value_items {
          display: flex;
          align-items: flex-start;
          width: 50%;
          font-size: 18 / @rem * 1rem;
          height: 60 / @rem * 1rem;
          .key {
            width: 85 / @rem * 1rem;
            height: 30 / @rem * 1rem;
            line-height: 30 / @rem * 1rem;
            font-size: 18 / @rem * 1rem;
            font-weight: 500;
            color: #666666;
            text-align-last: justify;
            text-align: justify;
            text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
          }
          .value {
            width: calc(100% - 100 / @rem * 1rem);
            line-height: 30 / @rem * 1rem;
            font-size: 18 / @rem * 1rem;
            margin-left: 10 / @rem * 1rem;
            font-weight: 500;
            color: #666666;
          }
          .ios_fit:after {
            content: '';
            display: inline-block;
            width: 100%;
            height: 0;
          }
        }

        .blackfont {
          .key {
            width: 123 / @rem * 1rem;
            font-size: 20 / @rem * 1rem;
            font-weight: 500;
            color: #333333;
          }
          .value {
            width: calc(100% - 130 / @rem * 1rem);
            font-weight: 500;
            color: #333333;
          }
        }

        .lastitem {
          .key {
            font-size: 20 / @rem * 1rem;
            font-weight: 500;
            color: #333333;
          }
          .value {
            font-size: 20 / @rem * 1rem;
            font-weight: 500;
            color: #ef2e05;
          }
        }
      }
    }
    .noinfo {
      width: 100%;
      text-align: center;
      height: 80 / @rem * 1rem;
      line-height: 80 / @rem * 1rem;
    }

    .bottom_content_btn {
      width: 100%;
      // height: 50 / @rem * 1rem;
      padding: 20 / @rem * 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .btnwrapper {
        cursor: pointer;
        width: 240 / @rem * 1rem;
        height: 70 / @rem * 1rem;
        background: #dcdcdc;
        border-radius: 10 / @rem * 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .icombox {
          width: 23 / @rem * 1rem;
          height: 23 / @rem * 1rem;
          display: flex;
          margin-top: 1 / @rem * 1rem;
          margin-right: 10 / @rem * 1rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .exit_btn {
          font-size: 24px;
          height: 70 / @rem * 1rem;
          line-height: 70 / @rem * 1rem;
          font-weight: bold;
          color: #666666;
        }
      }
    }
  }
}
</style>
