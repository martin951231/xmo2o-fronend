<template>
  <a-modal :title="title" :width="500" :height="300" :visible="visible" @cancel="closeWindow" :footer="null">
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">

      <a-form-item label="类型名称">
        <a-input field-names="name"
          v-decorator="['name', { initialValue: detail.name,rules: [{ required: true, message: '请输入类型名称!' }] }]"
          placeholder="请输入类型名称" />
      </a-form-item>
      <a-form-item label="类型说明">
        <a-textarea field-names="describe" v-decorator="['describe', { initialValue: detail.describe }]"
          placeholder="请输入类型说明" :auto-size="{ minRows: 2, maxRows: 6 }" />
      </a-form-item>

      <a-form-item label="排序">
        <a-input-number field-names="sort" v-decorator="['sort', { initialValue: detail.sort }]" :min="0"
          style="width:200px" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          提交
        </a-button>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
  import cardMerchantApi from '@/api/card/merchant'
  export default {
    data() {
      return {
        sort_id: 0,
        title:"添加类型",
        visible:false,
        queryParam: {
          sort_id: 0,
          name: '',
          describe: '',
          sort: 0,
        },
        detail: {
          name: "",
          describe: "",
          sort: 0
        },
        edit: false,
        form: this.$form.createForm(this, {
          name: 'coordinated'
        }),
      };
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          this.queryParam.name = values.name;
          this.queryParam.describe = values.describe;
          this.queryParam.sort = values.sort;

          this.submitRequest();
        });
      },
      getData() {
        this.request(cardMerchantApi.getGoodsSortInfo, {
          "sort_id": this.sort_id
        }).then((res) => {

          this.detail = {
            name: "",
            describe: "",
            sort: 0
          } 
          this.form.resetFields();
          this.detail = {
            name: res.name,
            describe: res.describe,
            sort: res.sort
          } 
          this.queryParam.sort_id = this.sort_id
          
          this.visible = true

        })
      },
      closeWindow() {
        this.visible = false
      },
      showEdit(id){
        if(id == 0){
          this.resetForm()
          this.title = "添加类型"
          this.visible = true
        }else{
          this.sort_id = id;
          this.title = "编辑类型"
          this.getData()
        }
      },
      resetForm(){
        this.detail = {
          name: "",
          describe: "",
          sort: 0
        }
        this.form.resetFields();
        this.queryParam.sort_id = 0;
      },
      submitRequest() {
        this.request(cardMerchantApi.getGoodsSortEdit, this.queryParam).then((res) => {
          this.$message.success(this.L('操作成功！'))
          this.visible = false
          this.$emit('loadRefresh');
        })

      }
    },
    mounted() {
      if (this.$route.query.sort_id) {
        this.sort_id = this.$route.query.sort_id
        this.getData()
        this.edit = true
      }else{
        this.edit = false;
        this.resetForm();
      }
    },
    watch: {

      $route(newVal, oldVal) {
        const currentPath = newVal.path
        const lastPath = oldVal.path
        if (currentPath == '/merchant/merchant.card/goodsEdit') {
          const query = newVal.query

          if (query.sort_id) {
            // 编辑
            this.sort_id = query.sort_id
            this.edit = true
            if (
              lastPath == '/merchant/merchant.card/goodsSort' ||
              lastPath == '/merchant/merchant.card/goodsSortEdit' ||
              !oldVal
            ) {
              // 如果上一页是商品列表或编辑页面 或者 刷新当前页（没有上一页） 则请求编辑信息
              this.getData()
            }
          } else {
            // 新增 初始化表单
            this.resetForm()
            this.edit = false
          }
        }
      },
    }
  }
</script>
