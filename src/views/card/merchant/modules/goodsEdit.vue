<template>
  <a-modal :title="title" :width="900" :height="640" :visible="visible" @cancel="closeWindow" :footer="null">
    <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">





      <div style="margin-top: 30px;"></div>

      <a-form-item label="商品名称">
        <a-input v-decorator="['name', { initialValue: detail.name,rules: [{ required: true, message: '请输入商品名称!' }] }]"
          placeholder="请输入商品名称" />
      </a-form-item>

      <a-form-item label="有效日期">

        <a-range-picker @change="rangePickerChange" style="width: 260px;"
          v-decorator="['expiry_date', { initialValue: [moment(detail.start_time, this.dateFormat), moment(detail.end_time, this.dateFormat)],rules: [{ required: true, message: '请选择开始和截止日期!' }] }]"
          :format="dateFormat" />

      </a-form-item>

      <a-form-item label="商品分类">
        <a-select style="width: 200px"
          v-decorator="['sort_id', { initialValue: detail.sort_id,rules: [{ required: true, message: environ.type.message }] }]"
          :placeholder="environ.type.message" @change="selectHandleChange">



          <a-select-option v-for="item in sortList" :key="item.sort_id">
            {{ item.name }}
          </a-select-option>

        </a-select>

      </a-form-item>




      <a-form-item label="库存">
        <a-input-number :min="0" style="width:200px"
          v-decorator="['stock_num' , { initialValue: detail.stock_num,rules: [{ required: true, message: '请输入商品库存!' }] }]"
          placeholder="请输入商品库存" />
      </a-form-item>




      <a-form-item label="商品图片">

        <a-upload action="/v20/public/index.php/common/common.UploadFile/uploadPictures" name="reply_pic"
          :data="updateData" list-type="picture-card" :file-list="fileList" @preview="handlePreview"
          v-decorator="['reply_pic' , { rules: [{ required: environ.image.isrequired, message: '请上传图片!' }] }]"
          @change="upLoadChange($event)">
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              上传图片
            </div>
          </div>
        </a-upload>

        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>

      </a-form-item>






      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>


</template>

<script>
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  import moment from 'moment';
  import cardMerchantApi from '@/api/card/merchant'
  export default {
    data() {
      return {
        title: "添加商品",
        visible: false, 
        environ: {
          image: {
            isrequired: true
          },
          type: {
            message: "请选择商品类型"
          }
        },
        formLayout: 'horizontal',
        form: this.$form.createForm(this, {
          name: 'coordinated'
        }),
        previewVisible: false,
        previewImage: '',
        fileList: [],
        updateData: {
          "upload_dir": "merchant/card/goods"
        },
        sortList: [],
        image: "",
        defaultTime: [],
        dateFormat: "YYYY-MM-DD",
        start_time: "",
        end_time: "",
        goods_id: 0,
        saveData: {
          goods_id: 0
        },
        detail: {
          name: "",
          sort_id: "",
          stock_num: 0,
          start_time: "",
          end_time: ""
        },
        edit: false
      };
    },
    created() {
      
    },
    mounted() {
      if (this.$route.query.goods_id) {
        this.goods_id = this.$route.query.goods_id
        this.getDetail()
        this.edit = true
      } else {
        this.resetForm()
        this.edit = false
      }
    },
    methods: {
      moment,


      closeWindow() {
        this.visible = false
      },

      getSortList() {
        this.request(cardMerchantApi.getGoodsSortSelect, {}).then((res) => {
          if (res.length == 0) {
            this.environ.type.message = '请先新建商品类型';
          } else {
            this.environ.type.message = '请选择商品类型';
          }
          this.sortList = res
        });
      },

      //下拉
      selectHandleChange(value) {

      },
      selecthandleBlur() {
        console.log('blur');
      },
      selecthandleFocus() {
        console.log('focus');
      },



      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!this.start_time || !this.end_time) {
              this.$message.error('请选择开始和截止日期！');
              return false;
            }
            if (!this.image) {
              this.$message.error('请上传商品图片！');
              return false;
            }


            this.saveData.goods_id = this.goods_id;
            this.saveData.name = values.name;
            this.saveData.sort_id = values.sort_id;
            this.saveData.stock_num = values.stock_num;
            this.saveData.start_time = this.start_time;
            this.saveData.end_time = this.end_time;
            this.saveData.image = this.image;

            this.request(cardMerchantApi.goodsEdit, this.saveData).then((res) => {
              this.$message.success('提交成功');
              this.visible = false
              this.$emit('loadRefresh');
            });
          }
        });
      },




      handleCancel() {
        this.previewVisible = false;
      },
      async handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
      },
      upLoadChange(info) {

        let fileList = [...info.fileList]
        if (fileList.length) {
          fileList = fileList.slice(-1)
          fileList = fileList.map((file) => {
            if (file.response) {

              this.image = file.response.data
              // console.log(this.images)
            }
            return file
          })

          this.fileList = fileList
        } else {
          this.fileList = []
        }
      },

      rangePickerChange(dates, dateStrings) {
        this.start_time = dateStrings[0];
        this.end_time = dateStrings[1];
      },
      getDetail() {
        this.request(cardMerchantApi.getGoodsDetail, {
          goods_id: this.goods_id
        }).then((res) => {
          this.form.resetFields();
          this.detail.name = res.name;
          this.detail.sort_id = res.sort_id == 0 ? '' : res.sort_id;
          this.detail.stock_num = res.stock_num;
          this.start_time = res.start_time
          this.end_time = res.end_time
          this.detail.start_time = moment(res.start_time, this.dateFormat);
          this.detail.end_time = moment(res.end_time, this.dateFormat);
          this.image = res.image_text

          this.fileList[0] = {
            uid: res.goods_id,
            name: res.name,
            status: "done",
            url: res.image
          };

          this.visible = true
        });
      },
      resetForm() {
        this.detail.name = "";
        this.detail.sort_id = "";
        this.detail.stock_num = 0;
        this.form.resetFields();


        var today = new Date();
        today.setTime(today.getTime());
        var todayTime = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        this.start_time = todayTime;
        this.end_time = todayTime;
        this.detail.start_time = moment(this.start_time, this.dateFormat);
        this.detail.end_time = moment(this.end_time, this.dateFormat);
        this.image = "";
        this.fileList = [];
        this.goods_id = 0;
        this.saveData = {}

      },
      showEdit(id) {
        this.getSortList();
        if (id == 0) {
          this.resetForm()
          this.title = "添加商品"
          this.environ.image.isrequired = true
          this.visible = true
        } else {
          this.goods_id = id;
          this.title = "编辑商品"
          this.environ.image.isrequired = false
          this.getDetail()
        }


      }

    },
    watch: {

      $route(newVal, oldVal) {
        const currentPath = newVal.path
        const lastPath = oldVal.path
        if (currentPath == '/merchant/merchant.card/goodsEdit') {
          const query = newVal.query

          if (query.goods_id) {
            // 编辑
            this.goods_id = query.goods_id
            this.edit = true
            if (
              lastPath == '/merchant/merchant.card/goodsList' ||
              lastPath == '/merchant/merchant.card/goodsEdit' ||
              !oldVal
            ) {
              // 如果上一页是商品列表或编辑页面 或者 刷新当前页（没有上一页） 则请求编辑信息
              this.getDetail()
            }
          } else {
            // 新增 初始化表单
            this.resetForm()
            this.edit = false
          }
        }
      },
    }
  };
</script>

<style>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-upload-list {
    margin-bottom: 0 !important;
  }
</style>
