<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-form-model
      :rules="rules"
      ref="ruleForm"
      :model="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 18 }"
      @submit="handleSubmit"
    >
      <a-form-model-item label="活动名称" prop="name">
        <a-input style="width: 450px" v-model="form.name" placeholder="请输入活动名称" />
      </a-form-model-item>
      <a-form-model-item label="绑定店铺" prop="store_id">
        <a-select style="width: 450px" @change="categorySelectChange" placeholder="请选择店铺" v-model="form.store_id">
          <a-select-option v-for="item in storeList" :key="item.store_id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="POI_ID">
        <a-input style="width: 450px" v-model="form.poi_id" placeholder="请输入POI_ID" />
        <div>设置后，则探店活动发布视频关联POI_ID</div>
      </a-form-model-item>
      <a-form-model-item label="抖音用户UID">
        <a-input style="width: 450px" v-model="form.store_douyin_id" placeholder="请输入抖音用户UID" />
        <div>用户探店活动页跳转店铺抖音主页</div>
      </a-form-model-item>
      <a-form-model-item label="关联优惠券" prop="coupon_ids">
        <a-select
          style="width: 450px"
          @change="couponSelectChange"
          mode="multiple"
          v-model="form.coupon_ids"
          placeholder="请选择优惠券"
        >
          <a-select-option v-for="item in couponList" :key="item.coupon_id">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <div>可以选择多种优惠券，每次发视频只能领取一张</div>
      </a-form-model-item>
      <a-form-model-item label="用户最多参与次数" prop="video_num">
        <a-input-number
          style="width: 450px"
          id="inputNumber"
          v-model="form.video_num"
          placeholder="请输入用户最多参与次数"
        />
      </a-form-model-item>
      <a-form-model-item label="活动详情" prop="content">
        <rich-text :info.sync="form.content" />
      </a-form-model-item>
      <a-form-model-item label="关联视频素材" prop="material_ids">
        <a-select style="width: 450px" mode="multiple" v-model="form.material_ids" placeholder="请选择视频素材">
          <a-select-option v-for="item in materialList" :key="item.id">
            {{ item.material_name }}
          </a-select-option>
        </a-select>
        <div>视频可以多选，用户发视频会随机发送一个</div>
      </a-form-model-item>
      <a-form-model-item label="状态">
        <a-switch
          checked-children="开"
          un-checked-children="关"
          :checked="form.status == 1 ? true : false"
          @change="switchChange"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit"> 提交 </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import douyinMerchantApi from '@/api/douyin/merchant'
import RichText from '@/components/RichText/RichText'
export default {
  data() {
    return {
      title: '添加活动',
      storeList: [], // 店铺列表
      couponList: [], // 优惠券列表
      materialList: [], //视频素材列表
      form: {
        id: '',
        name: '', // 活动
        content: '',
        video_num: '', // 发视频的次数
        store_id: '', // 店铺的选择
        coupon_ids: [], // 关联优惠券，多个以英文逗号隔开或数组
        material_ids: [], //素材ID，多个以英文逗号隔开或数组，一期不做
        poi_id: '',
        store_douyin_id: '', //店铺抖音号
        status: 1, //状态：0=关闭，1=开启
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称！' }],
        store_id: [{ required: true, message: '请选择店铺！' }],
        store_douyin_id: [{ required: true, message: '请输入店铺抖音号！' }],
        coupon_ids: [{ required: true, message: '请选择优惠券' }],
        video_num: [{ required: true, message: '请输入用户最多参与次数！' }],
        content: [{ required: true, message: '请输入活动详情！' }],
        material_ids: [{ required: true, message: '请选择视频素材！' }],
      },
      detail: '',
      tools_id: 0,
    }
  },
  components: {
    RichText,
  },
  mounted() {
    this.resetForm()
    if (this.$route.query.tools_id) {
      this.title = '编辑活动'
      this.tools_id = this.$route.query.tools_id

      this.getLifeToolsDetail()
    } else {
      this.title = '添加活动'
    }
  },
  watch: {
    $route(newVal, oldVal) {
      console.log(newVal, oldVal, '-------123132213123------------', newVal.query.tools_id)
      const currentPath = newVal.path
      const lastPath = oldVal.path
      if (currentPath == '/douyin/merchant.Actiyity/ActivityAdd') {
        console.log(132313)
        const query = newVal.query

        if (query.tools_id) {
          this.tools_id = query.tools_id
          this.getLifeToolsDetail()
          this.resetForm()

          if (lastPath == '/douyin/merchant.Activity/ActivityList' || !oldVal) {
            // 如果上一页是商品列表或编辑页面 或者 刷新当前页（没有上一页） 则请求编辑信息
            this.tools_id = query.tools_id
            this.getLifeToolsDetail()
            this.resetForm()
          }
        } else {
          // 新增 初始化表单
          this.resetForm()
        }
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy(true)
    next()
  },
  methods: {
    // 清空数据
    resetForm() {
      // 获取分类列表
      this.getStoreList()
      this.getCouponList()
      this.getMaterialList()
      this.$refs.ruleForm.resetFields()
    },

    // 获取编辑的详情
    getLifeToolsDetail() {
      this.request(douyinMerchantApi.getActivityDetail, {
        id: this.tools_id,
      }).then((res) => {
        // 获取分类列表
        this.getStoreList()
        this.getCouponList()
        this.getMaterialList()
        res.coupon_ids.map((val, index) => {
          res.coupon_ids[index] = Number(val)
        })
        res.material_ids.map((val, index) => {
          res.material_ids[index] = Number(val)
        })
        console.log(res, '-----------详情------------')
        this.detail = res
        this.form = res
      })
    },

    // 获取店铺分类列表
    getStoreList() {
      this.request(douyinMerchantApi.getStoreList, {}).then((res) => {
        console.log(res, '-------获取店铺列表---------------')
        this.storeList = res
      })
    },

    // 获取优惠券列表
    getCouponList() {
      this.request(douyinMerchantApi.getCouponList, {}).then((res) => {
        console.log(res, '-------获取优惠券列表---------------')
        this.couponList = res
      })
    },
    // 获取视频素材列表
    getMaterialList() {
      this.request(douyinMerchantApi.getSourceMaterialLists, {}).then((res) => {
        console.log(res, '-------获取视频素材列表---------------')
        this.materialList = res.data
      })
    },
    // 选择店铺分类
    categorySelectChange(value) {
      console.log(`selected ${value}`)
      // this.form.cat_id = val
    },
    // 选择优惠券
    couponSelectChange(value) {
      console.log(`selected ${value}`)
    },
    // 改变开关状态
    switchChange(status) {
      status = status ? 1 : 0
      this.form.status = status
    },
    handleSubmit(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate((valid) => {
        console.log(this.form)
        if (valid) {
          if (this.detail) {
            this.form.id = this.tools_id
            this.form.status = this.detail.status
          }
          this.request(douyinMerchantApi.addOrEditActivity, this.form).then((res) => {
            this.resetForm()
            this.$message.success(this.L('操作成功！'))
            this.$router.push({
              path: '/douyin/merchant.Activity/ActivityList',
            })
            this.$destroy(true)
          })
        }
      })
    },
  },
}
</script>

<style type="text/css">
.ant-upload-list-picture-card-container {
  /* margin: 10px 8px 8px 0 !important; */
}
</style>
