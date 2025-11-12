<template>
  <a-modal :title="title" :width="1100" :height="600" :visible="avisible" @cancel="handelCancle" footer="">
    <div>
      <a-button type="primary" style="margin-bottom: 10px" @click="getAddModel">新建</a-button>
      <a-table :columns="columns" rowKey="id" :data-source="list" :scroll="{ y: 700 }">
        <span slot="sort" slot-scope="text,record">{{ record.sort }}</span>
        <span slot="name" slot-scope="text,record">{{ record.name }}</span>
        <span slot="area_name" slot-scope="text,record">{{ record.area_name }}</span>
        <span slot="pic" slot-scope="text,record">
              <img width="70px" height="30px" :src="record.pic">
        </span>
        <span slot="last_time" slot-scope="last_time,record">{{ record.last_time }}</span>
        <span slot="status" slot-scope="text">
              <a-badge v-if="text == 0" status="error" text="关闭"/>
              <a-badge v-if="text == 1" status="success" text="开启"/>
            </span>
        <span slot="action" slot-scope="text, record">
              <a @click="getOrEdit(record.id,true,1)">查看</a>
              <a-divider type="vertical"/>
              <a @click="getOrEdit(record.id,false,1)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.id)">
                 <a>删除</a>
              </a-popconfirm>
            </span>
      </a-table>
      <decorate-adver-edit ref="adverEditModel" @update="getList"></decorate-adver-edit>
    </div>
  </a-modal>
</template>

<script>
  import employeePlatformApi from "@/api/employee/platform";
  import DecorateAdverEdit from "@/views/employee/platform/modules/decorateAdverEdit";

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      key: 'sort',
      scopedSlots: {customRender: 'sort'},
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      scopedSlots: {customRender: 'name'},
    },
    {
      title: '浏览量',
      dataIndex: 'click_number',
      key: 'click_number'
    },
    {
      title: '城市',
      dataIndex: 'area_name',
      width: 100,
      key: 'area_name',
      scopedSlots: {customRender: 'area_name'},
    },
    {
      title: '图片',
      dataIndex: 'pic',
      key: 'pic',
      scopedSlots: {customRender: 'pic'},
    },
    {
      title: '操作时间',
      dataIndex: 'last_time',
      key: 'last_time',
      scopedSlots: {customRender: 'last_time'},
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      key: 'status',
      scopedSlots: {customRender: 'status'}
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: {customRender: 'action'},
    },
  ];
  export default {
    name: "decorateAdver",
    components: {DecorateAdverEdit},
    data() {
      return {
        avisible: false,
        title: '',
        tab_name: '',
        desc: '',
        cat_id: '',
        cat_key: '',
        columns,
        list: [],
        tab_key: 1,
        activity_id: 0,
        form: this.$form.createForm(this),
        id: '',
        type: 3,
        app_open_type: 2,
        wxapp_open_type: 1,
        currency: 1,
        previewVisible: false,
        previewImage: '',
        app_list: [],
        wxapp_list: [],
        fileList: [],
        length: 0,
        pic: '',
        pic_show: false,
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14},
        },
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'validate_other'});
    },
    created() {
    },
    methods: {
      init() {

      },
      getList(activity_id, titles) {
        this.avisible = true
        this.activity_id = activity_id
        this.title = '配置轮播图'
        this.request(employeePlatformApi.getActivityAdverList, {activity_id: activity_id}).then(res => {
          this.tab_name = res.now_category.cat_name
          this.cat_id = res.now_category.cat_id
          this.cat_key = res.now_category.cat_key
          this.desc = '图片建议尺寸' + res.now_category.size_info
          this.list = res.adver_list
        })
      },
      getOrEdit(id, edited, type) {
        this.$refs.adverEditModel.editOne(id, edited, type, this.activity_id, this.title)
      },
      getAddModel() {
        this.$refs.adverEditModel.editOne(0, false, 1, this.activity_id, this.title)
      },
      delOne(id) {
        this.request(employeePlatformApi.activityAdverDel, {id: id}).then(res => {
            this.$message.success('删除成功')
            this.getList(this.activity_id, this.title)
        })
      },
      handleOk(e) {
        this.avisible = false
      },
      handelCancle() {
          this.avisible = false
      },
      setLinkBases() {
        this.$LinkBases({
          // visible: true,
          source: 'platform', // 必填
          type: 'h5', // 必填
          // 确定按钮
          handleOkBtn: (res) => {
            // 点击按钮事件
            console.log('handleOk', res)
            this.url = res.url
            this.$nextTick(() => {//链接库动态赋值
              this.form.setFieldsValue({
                url: this.url,
              })
            });
          },
        })
      },
    }
  }
</script>

<style scoped>
  .ant-modal-body {
    padding: 24px 0 24px 24px !important;
  }
</style>