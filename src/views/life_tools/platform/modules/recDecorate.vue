<template>
  <a-modal :title="title" :width="800" :height="640" :visible="visible" @cancel="handelCancle" @ok="handleSubmit">
    <div>
      <a-tabs default-active-key="1" @change="editOne" v-model="activeKey" hide-add @edit="onEdit">
        <a-tab-pane key="1" :tab="tab_name">
          <a-table :columns="columns" :data-source="list" :scroll="{ y: 440 }">
            <span slot="sort" slot-scope="text,record">{{ record.sort }}</span>
            <span slot="name" slot-scope="text,record">{{ record.name }}</span>
            <span slot="subname" slot-scope="text,record">{{ record.subname }}</span>
            <span slot="type" slot-scope="text,record">{{ record.type_txt }}</span>
            <span slot="status" slot-scope="text,record">
              <a-badge v-if="text == 0" status="error" text="关闭"/>
              <a-badge v-if="text == 1" status="success" text="开启"/>
            </span>
            <a-button slot="related_goods" slot-scope="text,record" type="dashed" @click="getRelatedGoods(record.id)">
              关联商品
            </a-button>
            <span slot="action" slot-scope="text, record">
              <a @click="getEdit(record.id)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.id)">
                 <a>删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="2" tab="添加">
          <a-form
            preserve={false}
            id="components-form-demo-validate-other1"
            :form="form"
            v-bind="formItemLayout"
          >
            <a-form-item label="活动标题" help="标题字数不超过4个字符">
              <a-input
                placeholder="请输入活动标题"
                v-decorator="['name', {rules: [{required: true, message: '请输入活动标题'}]}]"
                :max=4
              />
            </a-form-item>
            <a-form-item label="副标题" help="副标题字数不超过6个字符">
              <a-input
                placeholder="请输入活动副标题"
                v-decorator="['subname', {rules: [{required: true, message: '请输入活动副标题'}]}]"/>
            </a-form-item>
            <a-form-item label="排序">
              <a-input-number
                v-decorator="['sort', {initialValue:0}]"
                :min="0"/>
              <span class="ant-form-text">
                值越大越靠前
              </span>
            </a-form-item>
            <a-form-item label="状态">
              <a-switch
                v-decorator="['status', {initialValue: true,valuePropName: 'checked'}] "
                checked-children="开启" un-checked-children="关闭"/>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane :key="3" tab="编辑" v-if="edit_show">
          <a-form
            id="components-form-demo-validate-other"
            :form="form"
            :data-source="detail"
            v-bind="formItemLayout"
          >
            <a-form-item label="活动标题" help="标题字数不超过4个字符">
              <a-input
                placeholder="请输入活动标题"
                v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入活动标题'}]}]"
              />
            </a-form-item>
            <a-form-item label="副标题" help="副标题字数不超过6个字符">
              <a-input
                placeholder="请输入活动副标题"
                v-decorator="['subname', {initialValue:detail.subname,rules: [{required: true, message: '请输入活动副标题'}]}]"/>
            </a-form-item>
            <a-form-item label="排序">
              <a-input-number
                v-decorator="['sort', {initialValue:detail.sort}]"
                :min="0"/>
              <span class="ant-form-text">
                值越大越靠前
              </span>
            </a-form-item>
            <a-form-item label="状态">
              <a-switch
                valuePropName="checked"
                v-decorator="['status', {initialValue:detail.status,valuePropName: 'checked'}]"
                checked-children="开启" un-checked-children="关闭"/>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <related-goods
        ref="relatedGoods"
        source="platform_rec"
        :selectedList="list"
      />
    </div>
  </a-modal>

</template>

<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import relatedGoods from "@/views/life_tools/platform/modules/relatedGoods";

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      key: 'sort',
      scopedSlots: {customRender: 'sort'},
    },
    {
      title: '活动标题',
      dataIndex: 'name',
      key: 'name',
      scopedSlots: {customRender: 'name'},
    },
    {
      title: '副标题',
      dataIndex: 'subname',
      key: 'subname',
      scopedSlots: {customRender: 'subname'},
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      key: 'status',
      scopedSlots: {customRender: 'status'}
    },
    {
      title: '关联商品',
      dataIndex: 'related_goods',
      width: 120,
      key: 'related_goods',
      scopedSlots: {customRender: 'related_goods'}
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: {customRender: 'action'},
    },
  ];
  export default {
    name: "sixDecorate",
    components: {relatedGoods},
    data() {
      return {
        visible: false,
        edit_show: false,
        title: '',
        tab_name: '',
        cat_id: '',
        cat_key: '',
        columns,
        list: [],
        detail: [],
        tab_key: 1,
        form: this.$form.createForm(this),
        id: '',
        activeKey: '1',
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14},
        },
      }
    },
    methods: {

      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      getEdit(id) {
        this.editOne(3)
        this.edit_show = true
        this.id = id
        this.request(lifeToolsPlatformApi.getRecEdit, {id: id}).then(res => {
          console.log(res)
          this.detail = res
          this.detail.status = this.detail.status == 1 ? true : false
        })
        this.activeKey = 3;
        this.tab_key = 3;
      },

      // 日期切换，重新赋值
      dateOnChange(date, dateString) {
        this.start_time = dateString[0]
        this.end_time = dateString[1]
      },
      getList(cat_key, titles) {
        this.visible = true
        this.cat_key = cat_key
        this.title = titles
        this.tab_name = titles
        this.request(lifeToolsPlatformApi.getRecList).then(res => {
            console.log(res)
            this.list = res
          }
        )
      },
      handelCancle() {
        this.visible = false
      },
      editOne(e) {
        this.tab_key = e
        if (e == 2) {
          this.id = 0
        } else if (e == 3) {
          this.edit_show = true
        }
      },

      delOne(id) {
        this.request(lifeToolsPlatformApi.delRecAdver, {id: id}).then(res => {
          this.getList(this.cat_key, this.title)
        })
      },
      handleSubmit(e) {
        if (this.tab_key != 1) {
          e.preventDefault();
          this.form.validateFields((err, values) => {
            if (!err) {
              console.log(values,'www')
              values.start_time = this.start_time
              values.end_time = this.end_time
              values.id = this.id
              if (values.name.length > 4) {
                this.$message.error('标题字数不超过4个字符')
              } else if (values.subname.length > 6) {
                this.$message.error('副标题字数不超过6个字符')
              } else {
                this.request(lifeToolsPlatformApi.addOrEditRec, values).then(res => {
                  if (this.id > 0) {
                    this.$message.success('编辑成功')
                    setTimeout(() => {
                      this.form = this.$form.createForm(this)
                      this.edit_show = false
                      this.activeKey = '1'
                      this.getList(this.cat_key, this.tab_name)
                      this.$emit('ok', values)
                    }, 1500)
                  } else {
                    this.$message.success('添加成功')
                    setTimeout(() => {
                      this.form = this.$form.createForm(this)
                      this.activeKey = '1'
                      this.getList(this.cat_key, this.tab_name)
                      this.$emit('ok', values)
                    }, 1500)
                  }
                })
              }
            }
          });
        } else if (this.tab_key == 1) {
          this.visible = false
        }
      },
      getRelatedGoods(e) {
        this.record_id = e
        this.$refs.relatedGoods.openDialog(this.record_id, 2)
      }
    }
  }
</script>

<style scoped>

</style>