<template>
  <a-modal :title="title" width="60%" :visible="visible" @cancel="handelCancle" @ok="handleSubmit">
    <div>
      <a-tabs default-active-key="1" @change="editOne" v-model="activeKey" hide-add @edit="onEdit">
        <a-tab-pane key="1" :tab="tab_name">
          <a-table rowKey="id" :columns="columns" :data-source="list" :scroll="{ y: 440 }">
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
              <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.id)" v-if="record.id!=999999">
                 <a>删除</a>
              </a-popconfirm>
               <a v-else style="color: lightgrey">删除</a>
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
            <a-form-item label="商品样式" v-if="system_config && system_config.order_revision == 1">
              <a-select v-decorator="['style', {initialValue: 2}]" style="width: 100%" :options="goodsStyleList"></a-select>
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
        <a-tab-pane key="3" tab="编辑" v-if="edit_show">
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
            <a-form-item label="商品样式" v-if="system_config && system_config.order_revision == 1">
              <a-select v-decorator="['style', {initialValue: detail.style}]" style="width: 100%" :options="goodsStyleList"></a-select>
            </a-form-item>
            <a-form-item label="排序">
              <a-input-number
                      v-decorator="['sort', {initialValue:detail.sort}]"
                      :min="0"/>
              <span class="ant-form-text">
                值越大越靠前
              </span>
            </a-form-item>
            <a-form-item label="状态" help="为你推荐不可关闭">
              <a-switch
                      v-if="detail.id==999999"
                      :disabled="disabled"
                      valuePropName="checked"
                      v-decorator="['status', {initialValue:detail.status,valuePropName: 'checked'}]"
                      checked-children="开启" un-checked-children="关闭"/>
              <a-switch
                      v-else
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
  import mallPlatformApi from "@/api/mall/platform";
  import relatedGoods from "@/views/mall/platform/modules/relatedGoods";

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
    },
    {
      title: '活动标题',
      dataIndex: 'name',
    },
    {
      title: '副标题',
      dataIndex: 'subname',
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
        disabled: true,
        visible: false,
        edit_show: false,
        title: '',
        tab_name: '',
        cat_id: '',
        cat_key: '',
        columns,
        list: [],
        detail: {},
        tab_key: 1,
        form: this.$form.createForm(this),
        id: '',
        activeKey: '1',
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14},
        },
        goodsStyleList: [
          {
            label: '卡牌',
            value: 1,
          },
          {
            label: '列表',
            value: 2,
          },
        ],
        system_config: null,
      }
    },
    created(){
      this.system_config = this.$getCache('system_config')
    },
    methods: {

      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      getEdit(id) {
        this.editOne('3')
        this.edit_show = true
        this.id = id
        this.request(mallPlatformApi.getRecEdit, {id: id}).then(res => {
          res.status = res.status == 1 ? true : false
          this.detail = res
        })
        this.activeKey = '3';
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
        this.request(mallPlatformApi.getRecList).then(res => {
            this.list = res
        })
      },
      handelCancle() {
        this.visible = false
        this.activeKey = '1'
        this.form = this.$form.createForm(this)
        this.edit_show = false
      },
      editOne(e) {
        if (e == '2') {
          this.id = 0
          this.form = this.$form.createForm(this)
        } else if (e == '3') {
          this.edit_show = true
        }
      },

      delOne(id) {
        this.request(mallPlatformApi.delRecAdver, {id: id}).then(res => {
          this.getList(this.cat_key, this.title)
        })
      },
      handleSubmit(e) {
        if (this.activeKey != '1') {
          e.preventDefault();
          this.form.validateFields((err, values) => {
            if (!err) {
              values.start_time = this.start_time
              values.end_time = this.end_time
              values.id = this.id
              if (values.name.length > 4) {
                this.$message.error('标题字数不超过4个字符')
              } else if (values.subname.length > 6) {
                this.$message.error('副标题字数不超过6个字符')
              } else {
                this.request(mallPlatformApi.addOrEditRec, values).then(res => {
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
        } else if (this.activeKey == '1') {
          this.handelCancle()
        }
      },
      getRelatedGoods(e) {
        this.record_id = e
        this.$refs.relatedGoods.openDialog(this.record_id, 2)
      }
    }
  }
</script>