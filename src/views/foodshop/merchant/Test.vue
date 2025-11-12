<template>
  <a-modal
    destroyOnClose
    :width="900"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :bodyStyle="{'max-height': '700px',
    'overflow-y': 'auto'}"
  >
    <a-card>
      <a-form @submit="handleSubmit" :form="form" class="form">
        <a-table :columns="columns" :data-source="data">
          <span slot="address" slot-scope="text,record,index">
            <a-form-item>
              <a-input
                v-decorator="[
                     `address[${index}]`,
                    {
                      rules: [{ required: false, message: 'test!', whitespace: true }],
                    },
                  ]"
              />
            </a-form-item>
          </span>
        </a-table>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }" :style="{ textAlign: 'center' }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>
<script>
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '12%',
    scopedSlots: {
      customRender: 'age',
    },
    // defaultSortOrder: 'descend',
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '30%',
    key: 'address',
    scopedSlots: {
      customRender: 'address',
    },
  },
]

const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: '00000',
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: '11111',
  },
]

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      data,
      columns,
      visible: false,
    }
  },
  mounted() {
    let obj = {}
    for (let i = 0; i < this.data.length; i++) {
      this.form.getFieldDecorator('address[' + i + ']')
      obj['address[' + i + ']'] = this.data[i].address
    }
    console.log(obj)
    setTimeout(() => {
      this.form.setFieldsValue(obj)
    }, 0)
  },

  methods: {
    handleCancel() {
      this.visible = false
      this.form = this.$form.createForm(this)
    },
    edit() {
      this.visible = true
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(values)
      })
    },
  },
}
</script>
