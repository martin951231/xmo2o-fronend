<template>
  <a-modal :title="title" :width="500" :style="{'height':'500px'}" :visible="visible" @cancel="closeWindow" @ok="handleSubmit">
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
      <a-form-item label="分类名">
        <a-input 
          v-decorator="['cat_name', { initialValue: detail.cat_name,rules: [{ required: true, message: '请输入分类名!' }] }]"
          placeholder="请输入分类名" />
      </a-form-item>
      <a-form-item label="排序值">
          <a-input-number
          v-decorator="['sort', { initialValue: detail.sort }]"
          placeholder="请输入排序值" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import moment from 'moment';
  export default {
    name: 'categoryEdit',
    components: {
    },
    data() {
      return {
        title: "添加分类",
        //是否显示弹窗
        visible: false,
        selectDate: null,
        formLayout: 'horizontal',
        form: this.$form.createForm(this, {
          name: 'coordinated'
        }),
        detail: {
          cat_id: 0,
          cat_name: '',
          sort: 0,
          type: ''
        },
      }
    },
    methods: {
      moment,
      //关闭窗口
      closeWindow() {
        this.visible = false
      },
      add(id = 0, type = '') {
        this.selectDate = null;
        this.form.resetFields();
        if (id) {
          this.request(lifeToolsPlatformApi.getCategoryDetail, {
            cat_id: id
          }).then((res) => {
              this.title = '编辑分类'
              this.detail = res

          })

      } else {
          this.title = '添加分类'
          this.detail.cat_id = 0;
          this.detail.cat_name = '';
          this.detail.sort = 0;
          this.detail.type = type;
      }  
      this.visible = true
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
        values.type = this.detail.type
        values.cat_id = this.detail.cat_id
          this.request(lifeToolsPlatformApi.categoryEdit, values).then((res) => {
            this.$message.success(res.msg)
            this.visible = false
            this.$emit('loadRefresh');
          })
        }
      });
    },
  }
  }
</script>
