<template>
  <a-modal :title="title" :width="1000" :height="640" :visible="visible" @cancel="handelCancle" @ok="handleSubmit">
    <div>
      <a-tabs default-active-key="1" @change="editOne" v-model="activeKey" hide-add @edit="onEdit">
        <a-tab-pane key="1" :tab="tab_name">
          <a-table rowKey="id" :columns="columns" :data-source="list" :scroll="{ y: 440 }">
            <span slot="sort" slot-scope="text,record">{{ record.sort }}</span>
            <span slot="name" slot-scope="text,record">{{ record.name }}</span>
            <span slot="subname" slot-scope="text,record">{{ record.subname }}</span>
            <span slot="type" slot-scope="text,record">{{ record.type_txt }}</span>
            <span slot="start_time" slot-scope="text,record">{{ record.start_time }}</span>
            <span slot="end_time" slot-scope="text,record">{{ record.end_time }}</span>
            <a-button slot="related_goods" slot-scope="text,record" type="dashed"
                      @click="getRelatedGoods(record.id,record.type)">
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

        <a-tab-pane key="2" tab="添加" @tabClick="editOne">
          <a-form
            id="components-form-demo-validate-other1"
            :form="form"
            v-bind="formItemLayout"
          >
            <a-form-item label="活动标题" help="标题字数不超过4个字符">
              <a-input
                placeholder="请输入活动标题"
                v-decorator="['name', {rules: [{required: true, message: '请输入活动标题'}]}]"
              />
            </a-form-item>
            <a-form-item label="副标题" help="标题字数不超过6个字符">
              <a-input
                placeholder="请输入活动副标题"
                v-decorator="['subname', {rules: [{required: true, message: '请输入活动副标题'}]}]"/>
            </a-form-item>
            <a-form-item label="活动类型" help="活动商品低于四个则不再首页展示">
              <a-select placeholder="请选择活动类型"
                        v-decorator="['type', {rules: [{required: true, message: '请选择活动类型'}]}]">
                <a-select-option value="group">
                  拼团活动
                </a-select-option>
                <a-select-option value="bargain">
                  砍价活动
                </a-select-option>
                <a-select-option value="limited">
                  秒杀活动
                </a-select-option>
                <a-select-option value="live">
                  直播活动
                </a-select-option>
                <a-select-option value="video">
                  短视频活动
                </a-select-option>
                <!--<a-select-option value="rec">
                  自定义商品推荐
                </a-select-option>-->
              </a-select>
            </a-form-item>
            <a-form-item label="展示时间">
              <a-range-picker
                @change="dateOnChange"
                format="YYYY-MM-DD HH:mm"
                :ranges="{
                  今日: [moment(), moment()],
                  昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                  近七天: [moment().subtract(7, 'days'), moment()],
                  近30天: [moment().subtract(30, 'days'), moment()],
                }"
                :allowClear="true"
                v-model="search_data"
                style=" width: 320px"
              >
                <a-icon slot="suffixIcon" type="calendar"/>
              </a-range-picker>
            </a-form-item>
            <a-form-item label="排序">
              <a-input-number
                v-decorator="['sort', {initialValue:0}]"
                :min="0"/>
              <span class="ant-form-text">
                值越大越靠前
              </span>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            </a-form-item>
          </a-form>

        </a-tab-pane>
        <a-tab-pane :key="3" tab="编辑" v-if="edit_show">
          <a-form
            id="components-form-demo-validate-other"
            :form="form"
            v-bind="formItemLayout"
          >
            <a-form-item label="活动标题">
              <a-input
                placeholder="请输入活动标题"
                v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入活动标题'}]}]"
                :max=4
              />
            </a-form-item>
            <a-form-item label="副标题">
              <a-input
                placeholder="请输入活动副标题"
                v-decorator="['subname', {initialValue:detail.subname,rules: [{required: true, message: '请输入活动副标题'}]}]"/>
            </a-form-item>
            <a-form-item label="活动类型" help="活动商品低于四个则不再首页展示">
              <a-select placeholder="请选择活动类型"
                        v-decorator="['type', {initialValue:detail.type,rules: [{required: true, message: '请选择活动类型'}]}]">
                <a-select-option value="group">
                  拼团活动
                </a-select-option>
                <a-select-option value="bargain">
                  砍价活动
                </a-select-option>
                <a-select-option value="limited">
                  秒杀活动
                </a-select-option>
                <a-select-option value="live">
                  直播活动
                </a-select-option>
                <a-select-option value="video">
                  短视频活动
                </a-select-option>
                <!--<a-select-option value="rec">
                  自定义商品推荐
                </a-select-option>-->
              </a-select>
            </a-form-item>
            <a-form-item label="展示时间">
              <a-range-picker
                @change="dateOnChange"
                format="YYYY-MM-DD HH:mm"
                :ranges="{
                  今日: [moment(), moment()],
                  昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                  近七天: [moment().subtract(7, 'days'), moment()],
                  近30天: [moment().subtract(30, 'days'), moment()],
                }"
                :allowClear="true"
                v-model="search_data"
                style=" width: 320px"
              >
                <a-icon slot="suffixIcon" type="calendar"/>
              </a-range-picker>
            </a-form-item>
            <a-form-item label="排序">
              <a-input-number
                v-decorator="['sort', {initialValue:0}]"
                :min="0"/>
              <span class="ant-form-text">
                值越大越靠前
              </span>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <related-goods
        ref="relatedGoods"
        source="platform_six"
        :selectedList="list"
      />
    </div>
  </a-modal>

</template>

<script>
  import mallPlatformApi from "@/api/mall/platform";
  import moment from "moment";
  import relatedGoods from "../modules/relatedGoods"

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
      title: '浏览量',
      dataIndex: 'click_number',
      width: 80,
      key: 'click_number'
    },
    {
      title: '副标题',
      dataIndex: 'subname',
      key: 'subname',
      scopedSlots: {customRender: 'area_name'},
    },
    {
      title: '活动类型',
      dataIndex: 'type_txt',
      key: 'type_txt',
      scopedSlots: {customRender: 'type_txt'}
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      width: '150px',
      scopedSlots: {customRender: 'start_time'},
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      width: '150px',
      scopedSlots: {customRender: 'end_time'},
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
        record_id: '',
        type: '',
        start_time: '',
        end_time: '',
        search_data: [moment().subtract(7, 'days'), moment()],
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
    watch: {
      refresh(val) {
        this.search_data = []
      },
    },
    mounted() {
      this.initList()
    },
    methods: {
      moment,
      initList() {
        //默认查询7天的订单数据
        this.search_data = [moment().subtract(7, 'days'), moment()]
        this.start_time = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm')
        this.end_time = moment().format('YYYY-MM-DD HH:mm')
      },
      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      getEdit(id) {
        this.id = id
        this.editOne(3)
        this.edit_show = true
        this.request(mallPlatformApi.getSixEdit, {id: id}).then(res => {
          this.detail = res
          this.start_time = res.start_time
          this.end_time = res.end_time
          this.search_data = [moment(this.start_time), moment(this.end_time)]
          console.log(this.start_time)
          console.log(this.end_time)
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
        this.request(mallPlatformApi.getSixList).then(res => {
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
        this.request(mallPlatformApi.delSixAdver, {id: id}).then(res => {
          this.getList(this.cat_key, this.title)
        })
      },
      handleSubmit(e) {
        if (this.activeKey != 1) {
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
                this.request(mallPlatformApi.addOrEditSixAdver, values).then(res => {
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
                    if (res == 100) {
                      this.$message.error('改活动类型已经添加过')
                    } else {
                      this.$message.success('添加成功')
                    }
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
        } else if (this.activeKey == 1) {
          this.visible = false
        }
      },
      getRelatedGoods(e, t) {
        this.record_id = e
        this.type = t
        if (t == 'limited' || t == 'group' || t == 'bargain') {
          this.visible = false
          this.$router.push('/mall/platform.mallActivityRecommend/getLimitedRecommendList')
        } else {
          this.$refs.relatedGoods.openDialog(this.record_id, 1, this.title)
        }
      }
    }
  }
</script>

<style scoped>

</style>