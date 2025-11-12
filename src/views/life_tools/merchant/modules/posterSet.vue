<template>
  <div>
    <a-modal
      :bodyStyle="{background: '#EEEEEE'}"
      :width="800"
      :visible="showPosterModal"
      :closable="false"
      :maskClosable="false"
    >
      <div>
        <a-row>
          <a-col :span="9">
            <div class="showPoster">
              <div class="img_poster">
                <img
                  style="width: 220px; height: 220px;"
                  src="../static/images/background_posterSet.png"
                  alt=""
                >
                <div class="scan_img_absolute" v-show="detailData.share_type == 2">
                  <img
                    style="width: 50px; height: 50px;"
                    src="../static/images/scan_posterSet.png"
                    alt=""
                  >
                  <div class="scan_img_absolute_intro"><p style="margin-bottom: 0px;">打开微信扫一扫</p><p style="margin-bottom: 0px;">即可快速购票</p></div>
                </div>
              </div>

              <div style="padding: 16px 20px 12px 19px; display: flex; justify-content: space-between;">
                <div>
                  <div class="title_price">
                    <p class="title" style="margin-bottom: 0px;">日照海洋公园</p>
                    <p class="price" style="margin-bottom: 0px;" v-show="detailData.status_show_price == 1"><span class="symbol">￥</span><span>299</span><span class="unit">起</span></p>
                  </div>
                  <div class="scan_img" v-show="detailData.share_type == 1">
                    <img
                      src="../static/images/scan_posterSet.png"
                      alt=""
                      style="width: 30px; height: 30px;"
                    >
                    <div class="scan_img_intro"><p style="margin-bottom: 0px;">打开微信扫一扫</p><p style="margin-bottom: 0px;">即可快速购票</p></div>
                  </div>
                </div>
                <div class="avatar" v-show="detailData.status_show_avatar == 1">

                  <img
                    src="../static/images/avatar_posterSet.png"
                    alt=""
                    style="width: 40px; height: 40px;"
                  >
                </div>
              </div>

            </div>

          </a-col>
          <a-col :span="15">
            <a-form-model :model="detailData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
              <a-form-model-item label="海报类型：" :colon="false">
                <a-radio-group v-model="detailData.share_type">
                  <a-radio :value="1"> 横式模板 </a-radio>
                  <a-radio :value="2"> 二维码内嵌模板</a-radio>
                </a-radio-group>
              </a-form-model-item>

              <a-form-model-item label="是否显示分销者头像：" :colon="false">
                <a-radio-group v-model="detailData.status_show_avatar">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="是否显示价格：" :colon="false">
                <a-radio-group v-model="detailData.status_show_price">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-form-model>
          </a-col>
        </a-row>

      </div>
      <template slot="footer" style="background: #EEEEEE">
        <a-button type="primary" @click.stop="onSave">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
  data () {
    return {

      labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 7
        }
      },
      wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 14
        }
      },
      detailData: {
        share_type: '',
        status_show_avatar: '',
        status_show_price: ''
      }
    }
  },
  props: {
      showPosterModal: {
        type: Boolean,
        default: false
      },
      statusShowPrice: {
        type: Number,
        default: 0
      },
      statusShowAvatar: {
        type: Number,
        default: 0
      },
      shareType: {
        type: Number,
        default: 2
      }
  },
  watch: {
    showPosterModal (val) {
      if (val) {
        this.detailData = {
          share_type: this.shareType,
          status_show_avatar: this.statusShowAvatar,
          status_show_price: this.statusShowPrice
        }
      }
    }
  },
  methods: {
    onSave () {
      console.log(this.formData)
      this.$emit('onClosePosterModal', this.detailData)
    }
  }
}
</script>
<style lang="less" scoped>
.showPoster{
  width: 220px;
  background: #FFFFFF;
  position: relative;
  border-radius: 5px;
  .avatar{
    img {
      border-radius: 50%;
    }
  }
  .title_price{
    .title{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #1C1C1C;
      margin-bottom: 0px;
    }
    .price{
      font-size: 17px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #FC2528;
      .symbol {
        font-size: 14px;
      }
      .unit{
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #959595;
    }
    }
  }
  .scan_img{
    display: flex;
    align-items: center;
    .scan_img_intro{
      margin-left: 9px;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #939393;
    }
  }

  .img_poster{
    width: 220px;
    height: 220px;
    position: relative;
    .scan_img_absolute{
      position: absolute;
      background: rgba(0, 0, 0, 0.5);
      width: 220px;
      height: 220px;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 5px 5px 0 0;
      .scan_img_absolute_intro{
        margin-left: 9px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
</style>
