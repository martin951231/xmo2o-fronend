<template>
  <div class="pic-online">
    <a-modal v-model="visible" title="在线制图" @ok="handleOk" width="70%" destroyOnClose>
      <div class="content">
        <div class="left">
          <a-row :gutter="16" class="row">
            <a-col class="left-title" :span="labelWidth"> {{ type == 'alert_pic' ? '背景底图' : '悬浮底图' }} : </a-col>
            <a-col class="right-cont" :span="contentWidth">
              <div class="pic-con">
                <div
                  class="pic"
                  :style="type == 'alert_pic' ? '' : 'width:100px;height:100px'"
                  v-for="(item, index) of picList"
                  :key="item.id"
                  :class="item.selected ? 'active' : ''"
                >
                  <img @click="handlePicSelected(index)" :src="item.pic" />
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row :gutter="16" class="row" v-if="type == 'alert_pic'">
            <a-col class="left-title" :span="labelWidth"><span class="cr-red">*</span> 主标题: </a-col>
            <a-col class="right-cont" :span="contentWidth">
              <a-input v-model="title" placeholder="请输入主标题"></a-input>
            </a-col>
          </a-row>
          <a-row :gutter="16" class="row" v-if="type == 'alert_pic'">
            <a-col class="left-title" :span="labelWidth"><span class="cr-red">*</span> 副标题: </a-col>
            <a-col class="right-cont" :span="contentWidth">
              <a-input v-model="subTitle" placeholder="请输入副标题"></a-input>
            </a-col>
          </a-row>
        </div>
        <div class="right">
          <div class="show-img" v-if="type == 'alert_pic'">
            <img :src="selectPic" />
            <div class="text-cont" :style="titleStyle">
              <div class="title">{{ title }}</div>
              <div class="sub-title">{{ subTitle }}</div>
            </div>
          </div>
          <div class="show-img2" v-else>
            <img :src="selectPic" />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import privateFlowApi from '@/api/common/priviteflow'
export default {
  name: 'PrivateFlowPicOnline',
  data() {
    return {
      labelWidth: 4,
      contentWidth: 16,
      visible: false,
      type: '',
      alertPics: [],
      hoverPics: [],
      picList: [],
      title: '',
      subTitle: '',
      selectPic: '',
      selectPicId: '',
      titleStyle: '',
    }
  },
  watch: {
    selectPicId(val) {
      if (this.type == 'alert_pic') {
        if (val == 1) {
          this.titleStyle = 'top:80px'
        } else if (val == 2) {
          this.titleStyle = 'top:280px;color: #ffffff'
        } else if (val == 3) {
          this.titleStyle = 'top:200px;color: #ffffff'
        } else if (val == 4) {
          this.titleStyle = 'top:160px'
        } else {
          this.titleStyle = ''
        }
      }
    },
  },
  methods: {
    openDialog(type) {
      this.title = ''
      this.subTitle = ''
      this.type = type
      if (type == 'alert_pic') {
        this.getAlertPic()
      }
      if (type == 'hover_pic') {
        this.getHoverPic()
      }
      this.visible = true
    },
    getAlertPic() {
      if (!this.alertPics.length) {
        this.request(privateFlowApi.alertTemplates).then((data) => {
          this.alertPics = data.map((item, index) => {
            item.selected = false
            if (index == 0) {
              this.selectPic = item.pic
              this.selectPicId = item.id
              item.selected = true
            }
            return item
          })
          this.picList = JSON.parse(JSON.stringify(this.alertPics))
        })
      } else {
        this.picList = JSON.parse(JSON.stringify(this.alertPics))
        this.selectPic = this.alertPics[0].pic
        this.selectPicId = this.alertPics[0].id
      }
    },
    getHoverPic() {
      if (!this.hoverPics.length) {
        this.request(privateFlowApi.hoverTemplates).then((data) => {
          this.hoverPics = data.map((item, index) => {
            item.selected = false
            if (index == 0) {
              this.selectPic = item.pic
              this.selectPicId = item.id
              item.selected = true
            }
            return item
          })
          this.picList = JSON.parse(JSON.stringify(this.hoverPics))
        })
      } else {
        this.picList = JSON.parse(JSON.stringify(this.hoverPics))
        this.selectPic = this.hoverPics[0].pic
        this.selectPicId = this.hoverPics[0].id
      }
    },
    handlePicSelected(i) {
      this.picList.forEach((item, index) => {
        item.selected = false
        if (index == i) {
          item.selected = true
          this.selectPic = item.pic
          this.selectPicId = item.id
        }
      })
      this.$set(this, 'picList', this.picList)
    },
    handleOk() {
      if (this.type == 'alert_pic') {
        if (!this.title || !this.subTitle) {
          this.$message.error('请输入主标题和副标题')
          return
        } else {
          this.request(privateFlowApi.makeupPic, {
            title: this.title,
            sub_title: this.subTitle,
            tpl_id: this.selectPicId,
          }).then((data) => {
            this.$emit('finish', { url: data.url, type: this.type })
          })
        }
      } else {
        this.$emit('finish', { url: this.selectPic, type: this.type })
      }
      this.visible = false
    },
  },
}
</script>
<style scoped>
.content {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-height: 500px;
  overflow: auto;
}
.left {
  width: 50%;
  margin-right: 20px;
}
.right {
  width: 40%;
}
.row {
  margin-top: 20px;
}
.left-title {
  text-align: right;
  line-height: 32px;
  color: #333333;
}
.pic-con {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.pic-con .pic {
  width: 120px;
  height: 160px;
  padding: 20px;
  margin-right: 20px;
}
.pic-con .active {
  border: 1px solid red;
}
.pic-con .pic img {
  width: 100%;
  height: 100%;
}
.show-img {
  width: 360px;
  height: 480px;
  position: relative;
}
.show-img img {
  width: 100%;
  height: 100%;
}
.text-cont {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  color: red;
  text-align: center;
}
.text-cont .title {
  font-size: 24px;
  font-weight: bold;
}
.text-cont .sub-title {
  font-size: 18px;
  margin-top: 10px;
}
.show-img2 {
  width: 200px;
}
.show-img2 img {
  width: 100%;
  height: auto;
}
</style>