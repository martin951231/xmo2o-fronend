<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-button type="primary" class="Abutton" @click="showModalhandle">+ 新建一级</a-button>
    <a-table
          :columns="columns"
          :data-source="dataForm"
          rowKey="cat_id"
          :pagination="true">
        <template slot="expandIcon" slot-scope="props">
          <template v-if="props.record.copyChildren && props.record.copyChildren.length">
            <div role="button" tabindex="0" :title="L(!props.expanded?'展开行':'关闭行')" 
            class="ant-table-row-expand-icon" :class="!props.expanded?'ant-table-row-collapsed': 'ant-table-row-expanded'" @click="expandClick($event,props)"></div>
          </template>
          <template v-else>
            <span class="ant-table-row-indent indent-level-2" style="padding-left: 26px;"></span>
          </template>
        </template>
      <template slot="pcImg" slot-scope="text, record">
        <a-button class="pcButton" v-if="record.level === 1" @click="showModal(record, 'pc')">设置轮播图</a-button>
      </template>
      <template slot="webImg" slot-scope="text, record">
        <a-button class="pcButton" v-if="record.level === 1" @click="showModal(record, 'wap')">设置轮播图</a-button>
      </template>
      <!-- 设置参数 -->
      <template slot="Parm" slot-scope="text, record">
        <a-button class="pcButton" v-if="record.level === 2" @click="setClassifyModal(record.cat_id)">设置参数</a-button>
      </template>
      <!-- /设置参数 -->
      <!-- 开关 -->
      <template slot="status" slot-scope="text, record">
        <a-switch checked-children="开" un-checked-children="关" @change="switchHandle($event, record)" :checked="record.status === 1 ? true : false"></a-switch>
      </template>
      <!-- /开关 -->
      <!-- 排序 -->
      <template slot="sort" slot-scope="text, record">
        <a-input  style="width: 4.125rem;text-align: center;" v-if="record.level === 1||record.level === 3||record.level === 2" v-model="record.sort" @blur="pointerMove($event,record)"></a-input>
      </template>
      <!-- /排序 -->
      <!-- 操作 -->
      <template slot="editOrMore" slot-scope="text, record">
        <a slot="editOrMore" class="editOrMore" @click="editClassifyhandle(record)">编辑</a>
        <a-divider type="vertical" />
        <a slot="editOrMore" class="editOrMore" v-if="record.level === 1 || record.level === 2" @click="showNextClass(record)">新增下级分类</a>
        <a-divider type="vertical" v-show="record.level === 1 || record.level === 2"/>
        <a slot="editOrMore" class="editOrMore" @click="showConfirm(record)">删除</a>
      </template>
     <!-- /操作 -->
     <!-- 图标 -->
      <template slot="image" slot-scope="text, record"  v-if="record.level === 2 || record.level === 3" >
          <a-button
                 v-if="!record.image"
                 class="pcButton"
                 @click="AddImage(record)"
                 >+</a-button>
         <img
              v-else
               :src="record.image"
               class="Picimage_tubiao"
               @click="AddImage(record)"/>

      </template>
     <!-- /图标 -->
    </a-table>
    <!-- 设置新建分类弹窗 -->
    <a-modal title="新建分类" :visible="visible" :confirm-loading="confirmLoading" @ok="handleTypeOk" @cancel="handleCancel">
      <template>
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
          <a-form-item label="分类名称">
            <a-input v-decorator="['cat_name', { rules: [{ required: true, message: '分类名称' }] }]" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item label="状态">
            <a-switch v-decorator="['status', { initialValue: true, valuePropName: 'checked' }]" checked-children="开" un-checked-children="关" />
          </a-form-item>
        </a-form>
      </template>
    </a-modal>
    <!-- /设置新建分类弹窗 -->
    <!-- 设置轮播弹窗 -->
    <template>
      <div>
        <a-modal v-model="swipperVisible" title="添加轮播图" @ok="handleOk" :width="900" :footer="null">
          <template>
            <a-button size="small" type="primary"  @click="showAddModal('add')" style="margin-bottom: 15px;">添加轮播</a-button>
            <div style="height: 500px;overflow-y:scroll">
              <a-table :columns="column" :data-source="bannerData" :rowKey="bannerData.id" :scroll="{x:true,y:380}" >
                <!-- 插入图片 -->
                <template slot="image" slot-scope="text, record">
                  <img :src="record.image" style="width: 20rem;height:7.5rem;border: 1px solid #CCCCCC;" />
                  <br />
                  链接：{{ record.url }}
                </template>
                <!-- 排序 -->
                <template slot="sort" slot-scope="text, record">
                  <a-input slot="id" style="width: 3.125rem;text-align: center;" v-model="record.sort" @change="swipperSerialMove($event,record)"></a-input>
                </template>
                <!--/ 排序 -->
                <template slot-scope="text, record" slot="editAndMore">
                  <a-button class="editOrMore" @click="showAddModal('edit', record)">编辑</a-button>
                  <a-button class="editOrMore" @click="showSwipperConfirm(record)">删除</a-button>
                </template>
              </a-table>
            </div>
          </template>
        </a-modal>
      </div>
    </template>
    <!-- /设置轮播弹窗 -->
    <!-- 添加轮播图弹窗 -->
    <template>
      <div>
        <a-modal v-model="bannerVisible" :title="swiperTypeIsAdd ? '添加轮播图' : '编辑轮播图'" @ok="handleYesOk" cancelText="关闭" okText="添加" okType="primary" :width="800" >
          <template>
              <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="轮播图片">
                  <!-- 调用图片 -->
                  <choose-image ref="chooseImage" :name="uploadName" :max="max" :upload_dir="upload_dir" :type="uploadType" @callback="callBack" />
                  <!-- /调用图片 -->
                  <a-button style="width: 200px" @click="chooseImage">添加轮播图片</a-button>
                  <br />
                  <span>pc:" 建议使用1200*420"</span>
                  <span>web:" 建议使用640*240"</span>
                  <br />
                  <img v-for="(items, index) in imageList" :key="index" :src="items" style="width: 20rem;height:7.5rem;border: 1px solid #CCCCCC;" />
                </a-form-item>
                <a-form-item label="链接地址" style="margin-top: -25px;">
                  <a-input placeholder="请填写链接地址" style="width: 280px" v-model="swipper_url" />
                  <a-button @click="choosePower" style="margin-left: 5px;">功能库</a-button>
                </a-form-item>
              </a-form>
          </template>
        </a-modal>
      </div>
    </template>
    <!-- /添加轮播图弹窗 -->
    <!-- 设置参数 -->
    <template>
      <div>
        <a-modal v-model="classifyVisible" title="设置参数" @ok="classifyHandleOk" :width="800">
          <div class="classify_div">
              <div v-for="(items, index) in classifyList" :key="index" v-dragging="{ list: classifyList, item: items, group: 'knowTab' }" style="margin-top: 10px;">
                <div class="classifyLabel">
                  <div>参数名：</div>
                  <div style="position: relative;">
                    <input class="Input" v-model="items.cat_spec_name" />
                    <div class="circle" @click="classifyAllDelete(index)">X</div>
                  </div>
                  <a-checkbox style="margin-left: 20px;" @change="checkChange(items)" v-model="items.is_must == 0 ? false : true">必填</a-checkbox>
                </div>
                <div style="margin-top: 15px;">参数值：</div>
                <div class="classifyLabel" style="margin-top: -20px;margin-left: 55px;">
                  <div style="position: relative; margin-right: 15px;  margin-bottom: 10px; display: flex;flex-direction:row-reverse;" v-for="(it, idx) in items.property_list" :key="idx">
                    <input class="Input" v-model="it.name" />
                    <div class="circle" @click="classifyDelete(items.property_list, it, idx)">X</div>
                  </div>
                  <a-button class="margins" type="Dashed" size="small" @click="addList(items, index)">添加参数值</a-button>
                </div>
              </div>
            <a-button class="marg" type="Dashed" size="small" @click="addListItem">添加参数项目</a-button>
           </div>
        </a-modal>
      </div>
    </template>
    <!-- /设置参数 -->
    <!-- 点击类型的编辑 弹窗 -->
    <template>
      <div>
        <a-modal v-model="edit_swipper_visible" title="编辑" @ok="editHandleOk">
          <template>
            <a-form :form="typeform" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
              <a-form-item label="分类名称"><a-input v-decorator="['cat_name', { rules: [{ required: true, message: '分类名称' }] }]" placeholder="请输入名称" /></a-form-item>
              <a-form-item label="状态">
                <a-switch v-decorator="['status', { initialValue: true, valuePropName: 'checked' }]" checked-children="开" un-checked-children="关"  />
              </a-form-item>
            </a-form>
          </template>
        </a-modal>
      </div>
    </template>
    <!-- /点击类型的编辑 弹窗 -->
    <!-- 点击更多 新增下级分类 删除-->
    <template>
      <div>
        <a-modal v-model="nextClassVisible" title="下级分类" @ok="nextClassHandleOk">
          <template>
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
              <a-form-item label="分类名称"><a-input v-decorator="['cat_name', { rules: [{ required: true, message: '分类名称' }] }]" placeholder="请输入名称" /></a-form-item>
              <!-- 上级分类 -->
              <a-form-item label="状态">
                <a-switch v-decorator="['status', { initialValue: true, valuePropName: 'checked' }]" checked-children="开" un-checked-children="关" />
              </a-form-item>
            </a-form>
          </template>
        </a-modal>
      </div>
    </template>
    <!-- 添加图标弹窗 -->
    <template>
      <choose-image ref="AddImage" :name="uploadName1" :max="max1" :upload_dir="upload_dir" :type="uploadType1" @callback="Addpicture" />
    </template>
  </div>
 </template>
<script>
import packageCategory from '@/api/mall/mallGoodsCategory/index.js';
import ChooseImage from '@/components/ChooseImage/ChooseImage';
const columns = [
  {
    title: '分类名称',
    dataIndex: 'cat_name',
    key: 'cat_name'
  },
  {
    title: 'pc轮播',
    dataIndex: 'pcImg',
    key: 'pcImg',
    align:'center',
    width: '10%',
    scopedSlots: { customRender: 'pcImg' }
  },
  {
    title: 'web轮播图',
    dataIndex: 'webImg',
    width: '10%',
    align:'center',
    key: 'webImg',
    scopedSlots: { customRender: 'webImg' }
  },
  {
    title: '参数',
    dataIndex: 'Parm',
    key: 'Parm',
    align:'center',
    width: '10%',
    scopedSlots: { customRender: 'Parm' }
  },
  {
    title: '图标',
    dataIndex: 'image',
    key: 'image',
    width: '10%',
    align:'center',
    scopedSlots: { customRender: 'image' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align:'center',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
     align:'center',
    width: '15%',
    scopedSlots: { customRender: 'sort' }
  },
  {
    title: '操作',
    dataIndex: 'editOrMore',
    key: '',
    align:'center',
    width: '15%',
    scopedSlots: { customRender: 'editOrMore' }
  }
];
const column = [
  {
    title: '轮播图',
    dataIndex: 'image',
    key: 'image',
    width: '50%',
    scopedSlots: { customRender: 'image' }
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: '30%',
    scopedSlots: { customRender: 'sort' }
  },
  {
    title: '操作',
    key: 'editAndMore',
    dataIndex: 'editAndMore',
    width: '30%',
    scopedSlots: { customRender: 'editAndMore' }
  }
];
const plainOptions = ['必填'];
const defaultCheckedList = ['必填'];

export default {
  name: 'aaa',
  components: {
    ChooseImage
  },
  data() {
    return {
      typeform: this.$form.createForm(this, { name: 'coordinated' }),
      dataForm: [],
      columns,
      swipperVisible: false,
      visible: false,
      confirmLoading: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      column,
      bannerData: [],
      bannerVisible: false,
      userName: '',
      headers: {
        authorization: 'authorization-text'
      },
      classifyVisible: false,
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      plainOptions,
      imageList: [],
      upload_dir: '/mall/goods/images', // 上传图片、视频的路径
      uploadName: 'goods_img', //上传后回传回来的标识
      max: 1, // 最多上传 goods_img 5 , goods_video 1,
      uploadType: 'image',
      addorEditType: {}, // 新增或者编辑分类要传递的参数值
      cur_record: {}, // 当前点击的record
      cur_type: '',
      swipper_url: '',
      edit_swipper_visible: false,
      nextClassVisible: false, //下级分类弹窗
      deletVisible: false,
      swiperTypeIsAdd: false, // 轮播图是否是新增或者编辑弹框
      cur_swiper_record: {
        id: ''
      },
      cur_record_id: '',
      classifyList: [
        {
          cat_spec_name: '大小', //属性名
          is_must: 0, //是否必填
          is_filter: 1, //是否过滤选项
          property_list: [
            //属性值
            {
              name: 'S'
            },
            {
              name: 'M'
            },
            {
              name: 'L'
            }
          ]
        },
        {
          cat_spec_name: '颜色',
          is_must: 1,
          is_filter: 1,
          property_list: [
            {
              name: '蓝色'
            },
            {
              name: '白色'
            },
            {
              name: '红色'
            }
          ]
        }
      ],
      chooseClissifyVisible: false,
      serialData:[],
      SerialSwipperData:[],
      total:null,
      searchForm: {
        page: 1,
        pageSize: 10,
      },
      uploadName1: 'goods_img', //上传后回传回来的标识
      max1: 1, // 最多上传 goods_img 5 , goods_video 1,
      uploadType1: 'image',
      PictureList:[] ,//图标
      ImgList:[], //上传图片请求接口 的 list
      serialList:[],
      bannerLinkType: 'h5', // 功能库链接类型 h5 || pc
    };
  },
  mounted() {
    this.loadList();
    this.$dragging.$on('dragged', (value) => {
      //因为我这在排序的时候不需要做处理，所以空着就行
      console.log(value);
    })
  },


  methods: {
    // 请求分类展示
    loadList() {
      this.request(packageCategory.getSearchHotList, this.searchForm).then(res => {
        // console.log(res);
        this.dataForm = res.list.map(v => {
          if (v.children) {
            // 如果 children 存在，赋值给 copyChildren
            v.copyChildren = v.children;
            v.copyChildren.forEach(s=>{
              if(s.children){
                s.copyChildren = s.children
              }
            })

            // 清空一级分类的 children
            v.children = [];
          }
          return v;
        });


        this.total = res.count
        // console.log(this.dataForm);
      });
    },

    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.searchForm, 'page', page)
      this.loadList()
    },
    // pageSize变化
    onPageSizeChange(page, pageSize) {
      this.$set(this.searchForm, 'pageSize', pageSize)
      this.loadList()
    },

    // 轮播图bannerList
    refreshBannerList(record, type) {
      // console.log(record, type);
      this.cur_record = record;
      // console.log(record);
      this.cur_type = type;
      this.request(packageCategory.bannerList, {
        cat_id: record.cat_id,
        type: type === 'pc' ? 1 : 2
      }).then(res => {
        this.bannerData = res;
        // console.log(res)
      });
    },
    goUrl(url) {
      if (!url) return;
      this.$router.push({ path: url, query: { store_id: this.store_id } });
    },
    onChange(checked) {
      // console.log(`a-switch to ${checked}`);
    },
    switchHandle(val, record) {
      // toDo 对this.dataForm进行操作
      if (val) {
        record.status = 1;
      } else {
        record.status = 0;
      }
      this.request(packageCategory.saveStatus,{cat_id:record.cat_id,status:record.status}).then(res=>{
        this.loadList()
      })

    },
    // 增加新建分类
    showModalhandle() {
      this.visible = true;
      // console.log(this.dataForm);
    },
    handleCancel(e) {
      console.log('Clicked cancel button');
      this.visible = false;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
        }
      });
    },
    handleSelectChange(value) {
      // console.log(value);
      this.addorEditType['cat_fid'] = value;
    },
    // 编辑 类型弹框
    editClassifyhandle(record) {
      // console.log(this.typeform, record);
      this.cur_record = record;
      this.edit_swipper_visible = true;
      this.$nextTick(() => {
        this.typeform.setFieldsValue({
          status: record.status == 1 ? true : false,
          cat_name: record.cat_name,
        });
      });
    },
    // 编辑 更多分类列表
    editHandleOk() {
      // console.log(this.cur_record);
      const {
        typeform: { validateFields }
      } = this;
      validateFields((errors, values) => {
        if (!errors) {
          this.request(packageCategory.addOrEditCategory, {
            cat_fid: this.cur_record.cat_fid,
            status: values.status,
            cat_id: this.cur_record.cat_id,
            cat_name: values.cat_name,
            level: this.cur_record.level,
            sort:this.cur_record.sort
          }).then(res => {
            this.edit_swipper_visible = false;
            this.$message.success('编辑成功！')
            this.loadList();
          });
        }
      });
    },
    // 设置轮播图
    showModal(record, type) {
      this.swipperVisible = true;
      this.bannerLinkType = type && type.toLowerCase() == 'wap'?'pc':'h5'
      this.refreshBannerList(record, type);
    },
    handleOk(e) {
      this.visible = false;
    },
    handleTypeOk(e) {
      const {
        form: { validateFields }
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          this.request(packageCategory.addOrEditCategory, {
            cat_id: values.cat_id,
            cat_fid: values.cat_fid,
            cat_name: values.cat_name,
            status: values.status,
            url: '',
            sort: '',
            level: '1'
          }).then(res => {
            this.confirmLoading = false;
            this.$message.success('添加成功！')
            this.loadList();
            this.visible = false;
            this.form.resetFields()
          });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 添加或者编辑轮播图
    showAddModal(type, record) {
      if (type == 'add') {
        this.swiperTypeIsAdd = true;
        this.swipper_url = '';
        this.imageList = [];
        this.cur_swiper_record.id = ''
      } else {
        this.cur_swiper_record = record;
        this.swiperTypeIsAdd = false;
        this.imageList = record.image.split();
        this.swipper_url = record.url;
      }
      this.bannerVisible = true;
    },
    // 轮播图弹框新增或者编辑
    handleYesOk(e) {
      const {
        form: { validateFields }
      } = this;
      // console.log(this.cur_record);
      this.bannerVisible = false;0
      validateFields((errors, values) => {
        if (!errors) {
          this.request(packageCategory.addOrEditBanner, {
            id: this.cur_swiper_record.id,
            cat_id: this.cur_record.cat_id,
            type: this.cur_type == 'pc' ? 1 : 2,
            image: this.imageList[0],
            url: this.swipper_url,
            sort: ''
          }).then(res => {
            this.refreshBannerList(this.cur_record, this.cur_type);
          });
        }
      });
    },
    emitEmpty() {
      this.$refs.userNameInput.focus();
      this.userName = '';
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    // 添加图片
    uploadCallback(e) {
      const { max } = this;
      const { name } = e;
      let list = this.formData.goods_img.concat(e.list);
      this.$set(this.formData, name, list.slice(-max));
    },
    // 从功能库选择
    choosePower() {
        this.$LinkBases({
            // visible: true,
            source: 'platform', // 必填
            type: this.bannerLinkType, // 必填
            // 确定按钮
            handleOkBtn: (res) => {
                // 点击按钮事件
                console.log('handleOk',res)
                this.swipper_url = res.url
            },
            // handleCancelBtn: () => {
            //   console.log('handleCancel')
            // }
      })
    },
    // 设置参数弹框
    setClassifyModal(cat_id) {
      this.classifyVisible = true;
      this.cur_record_id = cat_id;
      this.request(packageCategory.propertyList, { cat_id: cat_id }).then(res => {
        this.classifyList = res;
      });
    },
    // 设置参数弹框请求数据
    classifyHandleOk(e) {
      let spec_list = this.classifyList.map(item => {
        let propertyArr = [];
        item.property_list.forEach((it) => {
          propertyArr.push(it.name)
        })
        return {
         is_must: item.is_must,
         cat_spec_name:item.cat_spec_name,
         property_list: propertyArr
        }
      })
      let params = {
        cat_id: this.cur_record_id,
        spec_list
      };
      // console.log(11111111, params);
      this.classifyVisible = false;
      this.request(packageCategory.addOrEditProperty,params).then((res)=>{
        this.classifyList = res;
      })
    },

    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length;
      this.checkAll = checkedList.length === plainOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    },
    // 点击+ 添加轮播图片
    chooseImage() {
      this.$refs.chooseImage.openDialog();
    },
    callBack(val) {
      this.imageList = val.list;
    },
    //点击更多 弹窗 下级分类 删除
    showNextClass(record) {
      this.nextClassVisible = true;
      this.cur_record = record;
    },
    //点击弹窗确定 下级分类  弹窗消失
    nextClassHandleOk() {
      this.nextClassVisible = false;
      // 请求下级分类的接口
      const {
        form: { validateFields }
      } = this;
      validateFields((errors, values) => {
        if (!errors) {
          this.request(packageCategory.addOrEditCategory, {
            cat_fid: this.cur_record.cat_id,
            cat_name: values.cat_name,
            status: values.status,
            level: this.cur_record.level + 1
          }).then(res => {
            // console.log(res);
            this.$message.success('新建下级成功！')
            this.loadList();
            this.form.resetFields()
          });
        }
      });
    },
    //点击更多 弹窗 删除
    showConfirm(record) {
      // console.log(record);
      this.$confirm({
        title: '你确定要删除吗?',
        onOk: () => {
          this.request(packageCategory.delCategory, { cat_id: record.cat_id,level:record.level }).then(res => {
            console.log(res);
            if(res==100){
              this.$message.warn('该分类下存在商品，请先删除商品后再来删除该分类！');
            }else if(res==200){
              this.$message.warn('该分类存在子分类，不能被删除！');
            } else{
              this.$message.success('操作成功！')
            }
            this.loadList();
          });
        },
        onCancel() {},
        class: 'test'
      });
    },
    //轮播删除
    showSwipperConfirm(record) {
      // console.log(record);
      this.$confirm({
        title: '你确定要删除吗?',
        onOk: () => {
          this.request(packageCategory.delBanner, { id: record.id }).then(res => {
            // console.log(res);
            this.refreshBannerList(this.cur_record, this.cur_type);
          });
        },
        onCancel() {},
        class: 'test'
      });
    },
    // 点击添加参数值
    addList(item, index) {
      item.property_list.push({
        name: ''
      });
    },
    // 点击添加参数项目
    addListItem() {
      this.classifyList.push({
        cat_spec_name: '',
        is_must: 0,
        property_list: [{ name: '' }]
      });
    },
    // 删除当前的项
    classifyDelete(property_list, it, idx) {
      if (property_list.length > 0) {
        property_list.splice(idx, 1);
      }
    },
    // 删除整个项
    classifyAllDelete(index){
      if(this.classifyList.length > 0) {
        this.classifyList.splice(index, 1)
      }
    },
    checkChange(item) {
      item.is_must == 0 ? (item.is_must = 1) : (item.is_must = 0);
    },
    //点击排序筛选参数
    addChooseClassify() {
      this.ChooseVisible = true
    },
    chooseHandleOk(e) {
      this.visible = false;
    },
  // 一级分类排序
    pointerMove(e, record){
      this.request(packageCategory.addOrEditCategory, {
        cat_id:record.cat_id,
        cat_name:record.cat_name,
        status:record.status,
        sort:record.sort,
        level:record.level
      }).then(res => {
       this.serialData = res;
       this.loadList();
       console.log(1314,this.serialData);
      });

    },
    // 排序
    swipperSerialMove(type,record){
      this.request(packageCategory.addOrEditBanner, {
        id:record.id,
        cat_id:this.cur_record.cat_id,
        type:this.cur_type == 'pc' ? 1 : 2,
        image:record.image,
        url:record.url,
        sort:record.sort
      }).then(res => {
        this.SerialSwipperData = res;
      });
    },

    // 点击 图标 添加弹窗
    AddImage(record){
      this.currrnt_record = record
      this.$refs.AddImage.openDialog();
    },

    // 调用chooseimage组件
    Addpicture(val,record){
      console.log(123,this.currrnt_record)
      this.PictureList = val.list;
      this.ImgList = this.PictureList[0];
      if(this.ImgList.hasOwnProperty('selected')){
        this.ImgList =this.ImgList['img']
      }
      let reply_pic = this.ImgList.replace(/[^]+upload/,'/upload');
      console.log(reply_pic)
      this.request(packageCategory.uploadPictures, {
         reply_pic:reply_pic,
         upload_dir:this.upload_dir
      }).then(res => {
        this.request(packageCategory.addOrEditCategory, {
          cat_id:this.currrnt_record.cat_id,
          cat_name:this.currrnt_record.cat_name,
          status:this.currrnt_record.status,
          sort:this.currrnt_record.sort,
          level:this.currrnt_record.level,
          cat_fid:this.currrnt_record.cat_fid,
          image:reply_pic,
          url:this.upload_dir
        }).then(res => {
         this.serialList = res;
         this.loadList();
         console.log(1314,this.serialList);
        });
      });

    },
    expandClick(e,props){
      props.record.children = props.record.copyChildren
      props.onExpand(props.record, e)
    },
  }
};
</script>
<style lang="less" scoped="scoped">
 .ant-form-item{
    margin-bottom: 0;
 }
 .ant-table td { white-space: nowrap; }
.classify_div{
  height: 200px;
   overflow-y: scroll;
 }
.Abutton {
  margin-bottom: 25px;
}
.pcButton {
  color: #1890ff;
  border: 1px dashed #ccc;
  // display: block;
}
.editOrMore {
  border: 0;
  color: #1890ff;
  margin-left: 5px;
}
.statusSwitch {
  margin-left: 3.125rem;
  color: #000000;
}
.classify {
  color: #1890ff;
}
.circle {
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  top: -10px;
  left: 150px;
  border: 1px solid #cccccc;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  font-size: 16px;
  line-height: 1;
  color: #fff;
}
.classifyLabel {
  display: flex;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.circles {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 118px;
  left: 215px;
  border: 1px solid #cccccc;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  font-size: 16px;
  color: #fff;
  line-height: 1;
}
.Input {
  cursor: pointer;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.margins {
  margin-left: 20px;
  color: #1890ff;
}
.MAR {
  margin-left: 20px;
}
.marg {
  margin-bottom: 20px;
  margin-right: 10px;
  color: #1890ff;
}
.Picimage_tubiao{
  width: 3.125rem;
  height: 3.125rem;
  // display: none;
}
.Picimage_tubiao:hover{
  content: url("../../../../src/assets/image/replace.png");
}
</style>
