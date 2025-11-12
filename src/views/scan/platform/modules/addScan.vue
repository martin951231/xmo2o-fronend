<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      width="60%"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="活动名称" required>
          <a-input v-model="formData.name"/>
        </a-form-model-item>
<!--        <a-form-model-item label="活动图片" required>-->
<!--          <a-upload-->
<!--            name="reply_pic"-->
<!--            list-type="picture"-->
<!--            :show-upload-list="false"-->
<!--            :data="{upload_dir: ''}"-->
<!--            action="/v20/public/index.php/common/common.UploadFile/uploadPictures"-->
<!--            @change="handleUploadChange"-->
<!--          >-->
<!--            <img v-if="image" style="width: 120px; height: 120px;" :src="image" alt="image" />-->
<!--            <div v-else>-->
<!--              <a-icon v-if="loading === true" :type="'loading'" />-->
<!--              <a-button> <a-icon type="upload" /> 上传 </a-button>-->
<!--            </div>-->
<!--          </a-upload>-->
<!--        </a-form-model-item>-->
        <a-form-model-item label="赠送余额数量">
          <a-input type="number" v-model="formData.balance_deno" />
        </a-form-model-item>
        <a-form-model-item label="赠送积分数量">
          <a-input type="number" v-model="formData.score_deno" />
        </a-form-model-item>
        <a-form-model-item label="广告地址">
          <a-input v-model="formData.ad_url" />
          <a-button @click="choosePower">功能库</a-button>
        </a-form-model-item>
        <a-form-model-item label="可领取数" required>
          <a-input type="number" v-model="formData.send_num" />
        </a-form-model-item>
        <a-form-model-item label="开始时间" required>
          <a-date-picker
            show-time
            type="date"
            placeholder="活动开始时间"
            style="width: 100%;"
            @change="startTimeChange"
          />
        </a-form-model-item>
        <a-form-model-item label="结束时间" required>
          <a-date-picker
            show-time
            type="date"
            placeholder="活动结束时间"
            style="width: 100%;"
            @change="endTimeChange"
          />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-radio-group v-model="formData.status">
            <a-radio value="1">
              开启
            </a-radio>
            <a-radio value="0">
              关闭
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>

import scanPlatformApi from '@/api/scan/platform/index'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: {
    visible: Boolean,
    title: String
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
      formData: {
        name: '',
        balance_deno: 0,
        score_deno: 0,
        ad_url: '',
        send_num: 0,
        start_time: undefined,
        end_time: undefined,
        status: "1",
      },
      loading: false,
    };
  },
  methods: {
    handleOk() {
      // console.log(this.formData);
      if (this.formData.name.trim() === '') {
        this.$message.error("活动名称必填！");
        return false;
      }
      // if (this.formData.image === '') {
      //   this.$message.error("活动图片必传！");
      //   return false;
      // }
      if (this.formData.balance_deno < 0) {
        this.$message.error("赠送余额数量必须大于等于0！");
        return false;
      }
      if (this.formData.score_deno < 0) {
        this.$message.error("赠送积分数量必须大于等于0！");
        return false;
      }
      if (this.formData.score_deno <= 0 && this.formData.balance_deno <= 0) {
        this.$message.error("赠送积分/余额数量至少有一个大于0！");
        return false;
      }
      if (this.formData.send_num <= 0) {
        this.$message.error("可领取数必须大于0！");
        return false;
      }
      if (this.formData.start_time === undefined) {
        this.$message.error("活动开始时间必填！");
        return false;
      }
      if (this.formData.end_time === undefined) {
        this.$message.error("活动结束时间必填！");
        return false;
      }
      this.request(scanPlatformApi.addData, this.formData).then((res) => {
        this.$message.success('添加成功!', 1)
        setTimeout(() => {
          this.formData = {}
          this.$emit('handleCancel')
          this.$emit('getDataList',false)
        },1000)
      })
    },
    handleCancel() {
      this.$emit('handleCancel')
    },
    // 上传图片
    handleUploadChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        if (info.file.response.status === 1000) {
          let imageUrl = info.file.response.data
          this.$set(this.formData, 'image', imageUrl);
          getBase64(info.file.originFileObj, imageUrl => {
            this.image = imageUrl
            this.loading = false;
          });
        }
      }
    },
    startTimeChange(value, dateString) {
      this.$set(this.formData, 'start_time', dateString);
    },
    endTimeChange(value, dateString) {
      this.$set(this.formData, 'end_time', dateString);
    },
    // 从功能库选择
    choosePower() {
      this.$LinkBases({
        source: 'platform', // 必填
        type: this.bannerLinkType, // 必填
        // 确定按钮
        handleOkBtn: (res) => {
          // 点击按钮事件
          this.$set(this.formData, 'ad_url', res.url);
        },
      })
    },
  },
};
</script>