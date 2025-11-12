<template>
  <div class="activity-edit">
    <a-card :bordered="false" v-if="form && Object.keys(form).length">
      <div slot="title" class="title">{{ title }}</div>
      <div class="content">
        <div class="mdoel-title">基本信息</div>

        <a-row :gutter="12" class="row">
          <a-col class="left-title" :span="labelWidth"><span class="required">*</span>活动名称: </a-col>
          <a-col class="right-cont" :span="contentWidth - labelWidth*1.5">
            <a-input  v-model="form.name" placeholder="请输入活动名称" />
          </a-col>
        </a-row>

        <a-row :gutter="12" class="row">
          <a-col class="left-title" :span="labelWidth"><span class="required">*</span> 展示页面: </a-col>
          <a-col class="right-cont" :span="contentWidth">
            <div class="page-item" v-for="(item, index) of showPageList" :key="index">
              <span class="page-item-title">{{ item.business_name }}：</span>
              <a-checkbox-group v-model="item.selected" :options="item.pages"></a-checkbox-group>
              <!--  @change="(val) => onShowPageChange(val, index)" -->
            </div>
          </a-col>
        </a-row>

        <div class="mdoel-title">样式设置</div>

        <div class="alert-style">
          <div class="left">
            <a-row :gutter="12" class="row">
              <a-col class="left-title" :span="labelWidth * 2"><span class="required">*</span> 上传悬浮图标: </a-col>
              <a-col class="right-cont" :span="contentWidth - labelWidth" style="display: flex; align-items: center">
                <a-upload
                  style="width: 150px"
                  list-type="picture-card"
                  :show-upload-list="false"
                  name="img"
                  :multiple="false"
                  @change="(e) => handleUploadChange(e, 'hover_pic')"
                  :action="uploadUrl"
                >
                  <img class="show-img" v-if="form.hover_pic" :src="form.hover_pic" />
                  <div v-else>
                    <a-icon type="plus" />
                    <div>点击上传</div>
                  </div>
                </a-upload>
                <a @click="onlinePicMade('hover_pic')">在线制图</a>
              </a-col>
            </a-row>

            <a-row :gutter="12" class="row">
              <a-col class="left-title" :span="labelWidth * 2"><span class="required">*</span> 上传弹层图片: </a-col>
              <a-col class="right-cont" :span="contentWidth - labelWidth">
                <div style="display: flex; align-items: center">
                  <a-upload
                    style="width: 150px"
                    list-type="picture-card"
                    :show-upload-list="false"
                    name="img"
                    :multiple="false"
                    @change="(e) => handleUploadChange(e, 'alert_pic')"
                    :action="uploadUrl"
                  >
                    <img class="show-img" v-if="form.alert_pic" :src="form.alert_pic" />
                    <div v-else>
                      <a-icon type="plus" />
                      <div>点击上传</div>
                    </div>
                  </a-upload>
                  <a @click="onlinePicMade('alert_pic')">在线制图</a>
                </div>
                <div class="help" style="margin-top: 0px">建议尺寸600*800px，PNG、JPG格式，图片小于2M</div>
              </a-col>
            </a-row>

            <a-row :gutter="12" class="row">
              <a-col class="left-title" :span="labelWidth * 2">
                企业微信成员二维码:
              </a-col>
              <a-col class="right-cont" :span="contentWidth - labelWidth">
                <a-select style="width: 100%" v-model="form.qiye_uid" placeholder="请选择企业微信成员二维码">
                  <a-select-option v-for="item of userList" :key="item.id" :value="Number(item.id)">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row :gutter="12" class="row">
              <a-col class="left-title" :span="labelWidth * 2"> 成员二维码装修: </a-col>
              <a-col class="right-cont" :span="contentWidth - labelWidth">
                <a-select style="width: 100%" v-model="form.qrcode_style">
                  <a-select-option :value="0">无需装修</a-select-option>
                  <a-select-option :value="1">上传模板</a-select-option>
                </a-select>
                <div class="help">
                  <div>(1)无需装修：将直接使用二维码自带的模板样式</div>
                  <div>
                    (2)上传模板：需要自行设计好模板后上传，尺寸为750*1334（注意：模板左下角需距离页面边缘间距20像素预留100*100像素的空白位置，用于放置企业微信成员二维码）
                  </div>
                </div>
              </a-col>
            </a-row>

            <a-row :gutter="12" class="row" v-if="form.qrcode_style == 1">
              <a-col class="left-title" :span="labelWidth * 2"> <span class="required">*</span>上传模板: </a-col>
              <a-col class="right-cont" :span="contentWidth - labelWidth">
                <a-upload
                  list-type="picture-card"
                  :show-upload-list="false"
                  name="img"
                  :multiple="false"
                  @change="(e) => handleUploadChange(e, 'style_tpl_pic')"
                  :action="uploadUrl"
                >
                  <img class="show-img" v-if="form.style_tpl_pic" :src="form.style_tpl_pic" />
                  <div v-else>
                    <a-icon type="plus" />
                    <div>点击上传</div>
                  </div>
                </a-upload>
              </a-col>
            </a-row>

            <!-- <a-row :gutter="12" class="row">
              <a-col class="left-title" :span="labelWidth * 2"> 效果预览: </a-col>
              <a-col class="right-cont" :span="contentWidth - labelWidth">
                <img class="show-img" src="https://picsum.photos/id/200/200/200" />
              </a-col>
            </a-row> -->
          </div>

          <div class="right">
            <div class="box">
              <div class="phone-page">
                <div class="header">店铺详情</div>
                <div v-if="showPage == 1" class="alert-page">
                  <img class="alert-img" :src="form.alert_pic" />
                  <a-icon class="close-img" type="close-circle" />
                </div>
                <div v-if="showPage == 2" class="hover-page">
                  <img class="hover-img" :src="form.hover_pic" />
                  <a-icon class="close-img" theme="filled" type="close-circle" />
                </div>
              </div>
              <div class="page-name">
                {{ showPage == 1 ? '弹层图片' : '悬浮图标'
                }}<a @click="switchAlertImg" style="margin-left: 10px">切换</a>
              </div>
            </div>
          </div>
        </div>

        <a-row :gutter="12" class="row">
          <a-col class="left-title" :span="labelWidth"> 加群后自动回复文案: </a-col>
          <a-col class="right-cont" :span="contentWidth - labelWidth*1.5">
            <a-textarea
              v-model="form.reply_txt"
              placeholder="请输入加群后自动回复文案"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            />
            <div class="help">用户成功添加企业微信成员为微信好友后，会自动发送欢迎语与企业微信群二维码给到用户</div>
          </a-col>
        </a-row>
        <a-row :gutter="12" class="row">
          <a-col class="left-title" :span="labelWidth"> 上传企业微信群二维码: </a-col>
          <a-col class="right-cont" :span="contentWidth">
            <a-upload
              list-type="picture-card"
              :show-upload-list="false"
              name="img"
              :multiple="false"
              @change="(e) => handleUploadChange(e, 'reply_pic')"
              :action="uploadUrl"
              style="margin-top: 10px"
            >
              <img class="show-img" v-if="form.reply_pic" :src="form.reply_pic" />
              <div v-else>
                <a-icon type="plus" />
                <div>点击上传</div>
              </div>
            </a-upload>
            <div class="help" style="margin: 0">加群后自动回复文案和企业微信群二维码需要填写一项</div>
          </a-col>
        </a-row>

        <a-row :gutter="12" class="row">
          <a-col class="left-title" :span="labelWidth">指定使用区域: </a-col>
          <a-col class="right-cont" :span="contentWidth">
            <a-switch v-model="form.is_point_area" checked-children="开" un-checked-children="关" default-checked />
            <div class="help">关闭后展示所有区域</div>
          </a-col>
        </a-row>

        <a-row :gutter="12" class="row">
          <a-col class="left-title" :span="labelWidth">指定店铺: </a-col>
          <a-col class="right-cont" :span="contentWidth">
            <a-switch v-model="form.is_point_store" checked-children="开" un-checked-children="关" default-checked />
            <div class="help">关闭后展示所有店铺</div>
          </a-col>
        </a-row>

        <a-row :gutter="12" class="row">
          <a-col class="left-title" :span="labelWidth">活动状态: </a-col>
          <a-col class="right-cont" :span="contentWidth">
            <a-switch v-model="form.status" checked-children="开" un-checked-children="关" default-checked />
          </a-col>
        </a-row>

        <a-row :gutter="12" class="row" style="margin-top: 40px">
          <a-col class="left-title" :span="labelWidth"></a-col>
          <a-col class="right-cont" :span="contentWidth">
            <a-button @click="onSubmit" style="width: 150px" type="primary" size="large">提 交</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <pic-online ref="picOnline" @finish="getOnlinePic"></pic-online>
  </div>
</template>
<script>
import privateFlowApi from '@/api/common/priviteflow'
import PicOnline from './modules/PicOnline.vue'
export default {
  components: { PicOnline },
  name: 'CommonPrivateFlowActivityEdit',
  inject: ['reload'],
  data() {
    return {
      uploadUrl: '/v20/public/index.php/common/platform.system.config/upload',
      title: '添加活动',
      labelWidth: 4,
      contentWidth: 16,
      activityId: 0,
      form: {
        name: '', // 活动名称
        show_page: [],
        hover_pic: '', // 	悬浮图标
        alert_pic: '', // 	弹层图片
        qiye_uid: '', // 企业用户
        qrcode_style: 0, // 二维码装修风格    0：无需状态    1:上传模板
        style_tpl_pic: '', // 模板图片
        is_point_area: false,
        is_point_store: false,
        status: true,
        reply_txt: '', // 自动回复文本
        reply_pic: '', //	自动回复图片
      },
      showPageList: [],
      showPageArr: {},
      userList: [],
      showPage: 1, // 1是弹层显示效果 2是悬浮图标效果
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.activityId = this.$route.query.id
      this.title = '编辑活动'
      this.getActivityInfo()
    } else {
      this.activityId = 0
      this.title = '添加活动'
      this.getShowPages()
      this.getUserList()
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$set(this, 'form', this.$options.data().form)
    next()
  },
  mounted() {},
  methods: {
    getActivityInfo() {
      this.request(privateFlowApi.getActivityInfo, { id: this.activityId }).then((data) => {
        data.is_point_area = data.is_point_area == 1 ? true : false
        data.is_point_store = data.is_point_store == 1 ? true : false
        data.status = data.status == 1 ? true : false
        this.$set(this, 'form', data)
        this.getShowPages()
        this.getUserList()
      })
    },
    getShowPages() {
      this.request(privateFlowApi.getShowPages).then((data) => {
        this.showPageList = data.map((item) => {
          item.selected = []
          if (item.pages && item.pages.length) {
            item.pages = item.pages.map((item2) => {
              if (this.activityId) {
                if (this.form.show_page & item2.id) {
                  item.selected.push(item2.id)
                }
              }
              return {
                label: item2.name,
                value: item2.id,
              }
            })
          }
          return item
        })
      })
    },
    getUserList() {
      this.request(privateFlowApi.getUserList).then((data) => {
        if (data && data.length) {
          if (!this.activityId) {
            this.form.qiye_uid = Number(data[0].id)
          }
          this.userList = data
        }
      })
    },
    // onShowPageChange(value, index) {
    //   this.showPageList[index].selected = value
    // },
    handleUploadChange(e, name) {
      console.log(e)
      let file = e.file
      if (file.response && file.response.status == 1000) {
        this.$set(this.form, name, file.response.data)
      }
      return file
    },
    switchAlertImg() {
      this.showPage = this.showPage == 1 ? 2 : 1
    },
    onSubmit() {
      let params = { ...this.form }
      if (!params.name) {
        this.$message.error('请输入活动名称')
        return
      }
      params.show_page = []
      for (let i in this.showPageList) {
        if (this.showPageList[i].selected.length) {
          params.show_page = [...params.show_page, ...this.showPageList[i].selected]
        }
      }
      if (!params.show_page.length) {
        this.$message.error('请选择展示页面')
        return
      }
      if (!params.alert_pic || !params.hover_pic) {
        this.$message.error('请上传弹层图片和悬浮图标')
        return
      }
      if (params.qrcode_style == 1 && !params.style_tpl_pic) {
        this.$message.error('请上传模板图片')
        return
      }
      if(!params.reply_txt && !params.reply_pic) {
        this.$message.error('加群后自动回复文案和企业微信群二维码请必须填写一项')
        return
      }
      params.is_point_area = params.is_point_area ? 1 : 0
      params.is_point_store = params.is_point_store ? 1 : 0
      params.status = params.status ? 1 : 0
      if (this.activityId) {
        params.id = this.activityId
      }
      // console.log(params)
      this.request(privateFlowApi.saveActivity, params).then((data) => {
        let title = '添加活动成功'
        if (this.activityId) {
          title = '编辑活动成功'
        }
        this.reload()
        this.$message.success(title)
        this.$router.replace('/common/platform.privateflow/activityList')
      })
    },
    onlinePicMade(type) {
      this.$refs.picOnline.openDialog(type)
    },
    getOnlinePic(e) {
      this.$set(this.form, e.type, e.url)
    },
  },
}
</script>
<style lang="less" scoped>
.activity-edit {
  .title {
    font-size: 28px;
    font-weight: bold;
  }
  .content {
    .mdoel-title {
      color: #1890ff;
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
    }
    .row {
      margin-top: 20px;
      .left-title {
        text-align: right;
        line-height: 32px;
        color: #333333;
      }
    }
    .page-item {
      line-height: 32px;
      .page-item-title {
        color: #999999;
        margin-right: 10px;
      }
    }
    .alert-style {
      display: flex;
      align-items: flex-start;
      .left {
        width: 50%;
      }
      .right {
        flex: 1;
        .box {
          width: 400px;
          margin: auto;
          .phone-page {
            height: 700px;
            border: 1px solid #999999;
            position: relative;
            .header {
              height: 40px;
              background-color: rgba(0, 0, 0, 0.8);
              text-align: center;
              color: #ffffff;
              font-weight: bold;
              font-size: 16px;
              line-height: 40px;
            }
            .alert-page {
              position: relative;
              width: 100%;
              height: 660px;
              background-color: rgba(0, 0, 0, 0.4);
              text-align: center;
              .alert-img {
                position: absolute;
                left: 50px;
                height: 400px;
                width: 300px;
                bottom: 150px;
                // background-color: #ffffff;
                border-radius: 10px;
              }
              .close-img {
                position: absolute;
                font-size: 28px;
                color: #fff;
                bottom: 100px;
              }
            }
            .hover-page {
              .hover-img {
                position: absolute;
                right: 0;
                height: 50px;
                width: 40px;
                top: 120px;
                z-index: 998;
              }
              .close-img {
                position: absolute;
                font-size: 18px;
                top: 115px;
                right: 32px;
                color: #999;
                z-index: 999;
              }
            }
          }
          .page-name {
            height: 30px;
            line-height: 20px;
            color: #6666;
            width: 100%;
            text-align: center;
            margin-top: 10px;
          }
        }
      }
    }
  }
  .required {
    color: red;
    margin-right: 4px;
  }
  .help {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin-top: 10px;
  }
  .show-img {
    width: 102px;
    height: 102px;
  }
}
</style>