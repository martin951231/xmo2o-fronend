<template>
  <div class="add-code-box">
    <a-steps :current="current" class="steps-title-box">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @submit="handleSubmit">
        <div class="steps-content">
            <div v-if="0==current">
                <a-form-item label="企业微信">
                    <span class="ant-form-text">
                        {{data.corp_name}}
                    </span>
                </a-form-item>
                <a-form-item label="选择分组" has-feedback :required="true">
                    <a-row>
                        <a-col :span="16">
                            <a-tree-select
                                v-model="post_data.code_group_id"
                                style="width: 100%"
                                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                :tree-data="channer_group_options"
                                placeholder="请选择分组"
                                @change="onChange"
                                tree-default-expand-all
                            >
                            </a-tree-select>

                        </a-col>
                    </a-row>
                </a-form-item>
                <a-form-item label="活码名称" :required="true">
                    <a-row>
                        <a-col :span="16">
                            <a-input
                                v-model="post_data.code_name"
                                :maxLength="30"
                                placeholder="请填写活码名称"
                            />
                        </a-col>
                        <a-col :span="8">
                            <div class="txt-tip">限30字符(一旦创建，不可修改)</div>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="自动添加好友">
                    <a-row>
                        <a-col :span="2">
                            <a-switch
                             v-model="post_data.skip_verify"
                            />
                        </a-col>
                        <a-col :span="22">
                            <div class="txt-tip">开启时，业主添加时无需企业成员确认，自动成为好友</div>
                        </a-col>
                    </a-row>
                </a-form-item>
                <a-form-item label="客户标签">
                    <div  v-for="(row, index) in label_data" :key="index">
                        <h4 style="margin-bottom: 0px">
                            {{row['label_group_name']}} :
                        </h4>
                        <div>
                            <a-tag class="tip" v-for="(row1, index1) in row['label_lists']" :key="index1" :color="choose_tag_index[row1['label_id']]==row1['label_id'] ? '#1890ff' : ''" @click="choose_tag(index1, row1)">
                                {{row1.label_name}}
                            </a-tag>
                            <a-button type="primary" ghost size=small icon="plus" @click="$refs.createModalLabel.add(row.label_group_id)">
                                新建标签
                            </a-button>
                        </div>
                    </div>
                    <a-button type="primary" ghost size=small icon="plus" @click="$refs.createModalLabelGroup.add()">
                        新建标签组
                    </a-button>
                </a-form-item>
            </div>
            <div v-if="1==current">
                <a-form-item label="绑定员工" :required="true">
                    <a-row>
                        <a-col :span="14">
                            <a-select
                                v-model="post_data.work_arr"
                                mode="multiple"
                                style="width: 100%"
                                placeholder="请选择绑定员工"
                                option-label-prop="label"
                            >
                                <a-select-option v-for="(item,index2) in work_list" :key="index2" :value="item['wid']" :label="item['name']">
                                    {{item['name']}}
                                </a-select-option>
                            </a-select>
                        </a-col>
                        <a-col :span="10">
                            <div class="txt-tip">多选，绑定员工后，业主加好友时随机从其中选择</div>
                        </a-col>
                    </a-row>
                </a-form-item>
            </div>
            <div v-if="2==current">
                <a-form-item label="扫码推送">
                    <a-row>
                        <a-col :span="2">
                            <a-switch
                             v-model="post_data.is_send"
                            />
                        </a-col>
                        <a-col :span="22">
                            <div class="txt-tip">（关闭后，客户扫该渠道活码，依然可对该客户自动打标签，但仅收到系统的【欢迎语】消息）</div>
                        </a-col>
                    </a-row>
                </a-form-item>
                
                <a-row>
                    <a-col :span="4">
                    </a-col>
                    <a-col :span="13">
                        <a-row>
                            <a-col :span="12">
                               <div class="ant-col ant-col-21 ant-form-item-control-wrapper">
                                   <div class="ant-form-item-control">
                                       <span class="ant-form-item-children">
                                           <div style="width: 900px; background-color: rgb(255, 255, 255);">
                                               <div class="welcome-wrap left-sider-content" style="margin-left: 68px;">
                                                   <img src="data:image/png;base64,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" alt="" style="width: 350px; border-bottom: 1px solid rgb(226, 214, 214);">
                                                   <div class="wel-msg_content_body" v-if="post_data.welcome_tip || post_data.welcome_img || post_data.engine_content_id">
                                                        <div class="welcome-mt" v-if="post_data.welcome_tip">
                                                            <span class="ant-avatar ant-avatar-circle ant-avatar-image" style="width: 36px; height: 36px; line-height: 36px; font-size: 18px; margin-right: 10px; float: left;">
                                                                <img src="../../../../../assets/image/avatar.png"> 
                                                            </span>
                                                            <div v-html="post_data.welcome_tip" class="wel-item-info wel-msg_content_txt" style="display: block; white-space: pre-wrap; word-wrap: break-word;">
                                                                
                                                            </div>
                                                        </div>
                                                        <div class="welcome-mt" v-if="post_data.welcome_img">
                                                            <span class="ant-avatar ant-avatar-circle ant-avatar-image" style="width: 36px; height: 36px; line-height: 36px; font-size: 18px; margin-right: 10px; float: left; object-fit: cover;">
                                                                <img src="../../../../../assets/image/avatar.png">
                                                            </span>
                                                            <img :src="welcome_img" alt="" style="width: 150px; border-radius: 4px;">
                                                        </div>


                                                        <div class="welcome-mt" v-if="post_data.engine_content_id && record">
                                                            <span class="ant-avatar ant-avatar-circle ant-avatar-image" style="width: 36px; height: 36px; line-height: 36px; font-size: 18px; margin-right: 10px; float: left; object-fit: cover;">
                                                                <img src="../../../../../assets/image/avatar.png">
                                                            </span>
                                                            <div class="wel-item-info wel-msg_content_txt">
                                                                <p class="url-title">{{record.title}}</p>
                                                                <div style="overflow: hidden;" v-if="record.share_dsc || record.share_img_txt">
                                                                    <div class="url-text" v-if="record.share_dsc">{{record.share_dsc}}</div>
                                                                    <img v-if="record.share_img_txt" :src="record.share_img_txt" alt="" style="float: right; width: 64px; height: 64px; object-fit: cover;">
                                                                </div>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="12">
                                
                                <div class="wel-pull-right">
                                    <div>
                                        <a-input type="textarea" v-model="post_data.welcome_tip" :maxLength="800" :autosize="{ minRows: 15, maxRows: 18}" placeholder="请填写欢迎语"/>
                                        
                                        <!-- <div v-html="post_data.welcome_tip" style="white-space: pre-wrap;" @input="contenChange($event)" @blur="blurChange" id="textarea1" contenteditable="true" spellcheck="true" data-medium-editor-element="true" role="textbox" aria-multiline="true" data-medium-editor-editor-index="2" medium-editor-index="f60da093-933a-1f66-fa96-e26b426a246d" data-placeholder="" data-medium-focused="true" class="wel-content-editable wel-medium-editor-elementmedium-editor-element">
                                            
                                        </div> -->

                                        <!-- <div style="padding: 0px 15px; margin-top: 10px;">
                                            点击插入：
                                            <a-tag color="orange" @click="addTag()">
                                                客户名称
                                            </a-tag>
                                            <a-icon type="smile" />
                                        </div> -->
                                        <div class="wel-changeType-text">
                                            提示：火狐浏览器可能出现无法正确插入客户名称，请使用谷歌、360浏览器；当前欢迎语最多支持长度1000
                                        </div>
                                    </div>
                                    <div style="margin: 10px 0px; cursor: pointer; float: left;">
                                        <a-popover placement="top" trigger="click" :visible="showPopover" v-if="!imageName">
                                            <template slot="content">
                                            <div class="popover-code-box flex_box">
                                                <a-row>
                                                    <a-col :span="12">
                                                        <div class="item_box" @click="ChooseImg()">
                                                            <!-- <img  class="img_1" src="../../../../../assets/image/pic_logo.png" alt="">
                                                            <div class="text_1">图片上传</div> -->

                                                                <a-upload
                                                                    :action="upload_url"
                                                                    :multiple="false"
                                                                    :show-upload-list="false"
                                                                    @change="handleImageChange"
                                                                >
                                                                <div>
                                                                    <a-icon :type="imgLoading ? 'loading' : 'cloud-upload'" />
                                                                    <div class="ant-upload-text">
                                                                    上传
                                                                    </div>
                                                                </div>
                                                                </a-upload>
                                                        </div>
                                                    </a-col>
                                                    <a-col :span="12">
                                                        <div class="item_box" @click="addLink()">
                                                            <a-icon :type="linkLoading ? 'loading' : 'appstore'" />
                                                            <div class="text_1">功能</div>
                                                        </div>
                                                    </a-col>
                                                </a-row>
                                            </div>
                                            </template>
                                            <a-button type="link" @click="addImgLink()"><a-icon type="plus"/> 添加图文/功能</a-button>
                                        </a-popover>
                                        <div v-else>
                                            <a-icon type="file-image" v-if="addType==1"/>
                                            <a-icon type="appstore" v-if="addType==2"/>
                                            {{imageName}}
                                            <a-icon type="close" @click="closeImageName()"/>
                                        </div>
                                    </div>
                                </div>
                                
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="steps-action">
        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">
            上一步
        </a-button>
        <a-button v-if="current < steps.length - 1" type="primary" @click="next">
            下一步
        </a-button>
        <a-button
            v-if="current == steps.length - 1"
            type="primary"
            @click="completeAdd()"
        >
        <span v-if="code_id">更新</span>
        <span v-else>创建</span>
            
        </a-button>
        </div>
    </a-form>
      <add-label-group :height='800' :width="1200" ref="createModalLabelGroup" @ok="handleLabelGroupOks"/>
      <add-label :height='800' :width="1200" ref="createModalLabel" @ok="handleLabelOks"/>


      <a-modal
      title="选择图片素材"
      :visible="visibleChooseImg"
      :width="900"
      :confirm-loading="confirmLoading"
      @ok="handleChooseImgOk"
      @cancel="handleChooseImgCancel"
    >
        <div class="choose-img-title-box">
            <a-row>
                <a-col :span="10">
                    <div style="padding-right:10px;">
                     <a-tree-select
                        v-model="searchGroup"
                        style="width: 100%"
                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                        :tree-data="groupTreeData"
                        placeholder="所有分组"
                        tree-default-expand-all
                    >
                        <span v-if="key === '0-0-1'" slot="title" slot-scope="{ key, value }" style="color: #08c">
                        Child Node1 {{ value }}
                        </span>
                    </a-tree-select>
                    </div>
                </a-col>
                <a-col :span="6">
                     <a-input-search
                        placeholder="输入要搜索内容"
                        enter-button="搜索"
                        @search="onSearch"
                        />
                </a-col>
                <a-col :span="2">
                        <a-button block>
                        清空
                        </a-button>
                </a-col>
                <a-col :span="6">
                    <div style="text-align: right;">
                     <a-button icon="cloud-upload">本地上传</a-button>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div style="padding-top: 10px;">
            <a-row>
                <a-col :span="4">

                </a-col>
                <a-col :span="1">
                </a-col>
                <a-col :span="4">
                </a-col>
                <a-col :span="1">
                </a-col>
                <a-col :span="4">
                </a-col>
                <a-col :span="1">
                </a-col>
                <a-col :span="4">
                </a-col>
                <a-col :span="1">
                </a-col>
                <a-col :span="4">
                </a-col>
            </a-row>
        </div>
        
    </a-modal>
    <choose-function-info :height='800' :width="1200" ref="createModalChooseFunction" @ok="handleLinkOk"/>
  </div>
</template>
<script>
import villageApi from '@/api/community/village'
import addLabelGroup from "./addLabelGroup";
import addLabel from "./addLabel";
import chooseFunctionInfo from './chooseFunctionInfo.vue';
import { getSystemName } from '@/utils/util'
export default {
  name: 'addCode',
  components: {
    addLabelGroup,
    addLabel,
    chooseFunctionInfo
  },
  data() {
    return {
      form: this.$form.createForm(this),
      upload_url:'/v20/public/index.php/' + villageApi.uploadFile,
      current: 0,
      imgLoading: false,
      linkLoading: false,
      loading: false,
      confirmLoading: false,
      visibleChooseImg: false,
      showPopover: false,
      code_group_id: '',
      post_data: {
          'code_group_id': '',
          'code_name': '',
          'work_arr': [],
          'is_send': true,
          'skip_verify': true,
          'welcome_tip': '',
          'welcome_img': '',
          'welcome_url': '',
          'engine_content_id': 0
      },
      steps: [
        {
          title: '基础设置',
          content: '基础设置',
        },
        {
          title: '员工设置',
          content: '员工设置',
        },
        {
          title: '欢迎语设置',
          content: '欢迎语设置',
        },
      ],
      searchGroup: '',
      groupTreeData: [
        {
            title: 'Node1',
            value: '0-0',
            key: '0-0',
            children: [
            {
                value: '0-0-1',
                key: '0-0-1',
                scopedSlots: {
                // custom title
                title: 'title',
                },
            },
            {
                title: 'Child Node2',
                value: '0-0-2',
                key: '0-0-2',
            },
            ],
        },
        {
            title: 'Node2',
            value: '0-1',
            key: '0-1',
        },
      ],
      work_arr: [],
      label_arr: [],
      data: {
          'corp_name': '演示物业',
          'skip_verify': true
      },
      skip_verify: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
      code_id: 0,
      channel_group_value: [],
      label_data: [],
      channer_group_options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
            },
          ],
        },
      ],
      choose_tag_index: {},
      tags: [],
      work_list: [],
      imageName: '',
      addType: 1,
      tipLabelName: '<span><span class="ant-tag ant-tag-orange" contenteditable="false"> 客户名称 </span></span>',
      record: {},
      welcome_img: '',
      tokenName: '',
      sysName: ''
    };
  },
  activated() {
    var  query = this.$route.query
    this.code_id = query.code_id ? query.code_id : 0;
    this.code_group_id = query.code_group_id ? query.code_group_id : '';
    this.current = 0
    let sysName = getSystemName(location.hash);
    if (sysName) {
        this.tokenName = sysName + '_access_token';
        this.sysName = sysName;
    } else {
        this.sysName = 'village';
    }
    document.title = query.code_id ? '编辑渠道码' : '添加渠道码';
    this.addCodeInfo()
  },
    mounted() {
        var  query = this.$route.query
        this.code_id = query.code_id ? query.code_id : 0;
        this.code_group_id = query.code_group_id ? query.code_group_id : '';
        this.current = 0
        let sysName = getSystemName(location.hash);
        if (sysName) {
            this.tokenName = sysName + '_access_token';
            this.sysName = sysName;
        } else {
            this.sysName = 'village';
        }
        document.title = query.code_id ? '编辑渠道码' : '添加渠道码';
        this.addCodeInfo()
    },
  methods: {
    completeAdd() {
        const {
            form: {
                validateFields
            }
        } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
            if (!errors) {
                console.log('post_data', values);
                console.log('code_group_id', this.code_group_id);
                console.log('post_data1', this.post_data);
                let post_data = JSON.parse(JSON.stringify(this.post_data));
                post_data.skip_verify = this.post_data.skip_verify ? 1 : 2;
                post_data.is_send = this.post_data.is_send ? 1 : 2;
                post_data.tags = this.tags;
                if (this.code_id && !post_data.code_id) {
                    post_data.code_id = this.code_id;
                }
                if (this.tokenName) {
                    post_data.tokenName = this.tokenName;
                }
                this.request(villageApi.addCode, post_data)
                    .then((res) => {
                        if (this.code_id) {
                            this.$message.success('更新成功');
                        } else {
                            this.$message.success('添加成功');
                        }
                        let sysName = this.sysName;
                        let pathInfo = '/'+sysName+'/'+sysName+'.workWx.channelCode/codeIndex';
                        this.$router.push({ path: pathInfo })
                    })
                    .catch((error)=>{
                        this.confirmLoading = false
                    })

                console.log('values', values)

            } else {
                this.confirmLoading = false
            }
        })
    },
    addLink() {
        this.$refs.createModalChooseFunction.chooseInfo();
        this.showPopover = false;
    },
    addImgLink() {
        if (this.showPopover) {
            this.showPopover = false;
        } else {
            this.showPopover = true;
        }
    },
    handleLinkOk(record) {
        console.log('record',record);
        this.addType = 2;
        this.record = record;
        this.imageName = record.title;
        this.post_data.engine_content_id = record.id;
        // this.detail.content = url;
        // this.content = url;
        // console.log('this.detail.content',this.detail.content);
    },
    contenChange(e) {
    const myField = document.querySelector('#textarea');
        if(myField.innerHTML.length > 1000){
            this.$message.warning('当前欢迎语长度最大为1000');
            this.post_data.welcome_tip = myField.innerHTML.slice(0,1000);
            myField.innerHTML = this.post_data.welcome_tip;
        }else {
            this.post_data.welcome_tip = myField.innerHTML;
        }
        // console.log('welcomeContent', this.post_data.welcome_tip);
    },
    closeImageName() {
      this.imageName = '';
      this.post_data.welcome_img = '';
      this.welcome_img = '';
      this.post_data.welcome_url = '';
      this.post_data.engine_content_id = 0;
    },
    handleImageChange(info) {
        if (info.file.status === 'uploading') {
            this.imgLoading = true;
            return;
        }
        if (info.file.status === 'done') {
            if(info.file && info.file.response)
            {
                let res= info.file.response;
                if(res.status === 1000){
                    this.imgLoading = false;
                    this.img = res.data.url;
                    this.post_data.welcome_img = res.data.url;
                    this.welcome_img = res.data.path;
                    this.addType = 1;
                    this.imageName = res.data.name;
                    console.log('imageUrl', this.welcome_img)
                    this.$message.success('上传成功');

                }else{
                    this.imgLoading = false;
                    this.$message.error(res.msg);
                }
            }
            this.imgLoading = false;
        }
    },
    onSearch() {

    },
    ChooseImg() {
        // this.visibleChooseImg = true;
    },
    // ChooseLink() {
    //     this.visibleChooseImg = false;
    // },
    handleChooseImgOk() {
        console.log('弹窗确认',1)
        this.visibleChooseImg = false;
    },
    handleChooseImgCancel() {
        console.log('弹窗取消',1)
        this.visibleChooseImg = false;
    },
    next() {
      if (this.current==0) {
          if (!this.post_data.code_group_id) {
            this.$message.warning('请选择分组!');
            return false
          }
          if (!this.post_data.code_name) {
            this.$message.warning('请填写活码名称!');
            return false
          }

          this.getWorkList();
      }
      if (this.current==1) {
          if (!this.post_data.work_arr || !this.post_data.work_arr[0]) {
            this.$message.warning('请选择绑定员工');
            return false
          }
      }
      this.current++;
    },
    prev() {
      if (this.current==2) {
          this.getWorkList();
      }
      this.current--;
    },
    blurChange(e) {
        var sel,range;
        sel = window.getSelection();    
        this.range = sel.getRangeAt(0);
        let a_toString = window.getSelection().toString();
　　    let b_anchorOffset = window.getSelection().anchorOffset; //开始位置
　　　　let c_focusOffset = window.getSelection().focusOffset;  //结束位置
        console.log('a_toString', a_toString)
        console.log('b_anchorOffset', b_anchorOffset)
        console.log('c_focusOffset', c_focusOffset)
    },
    async addTags() {
      let value = this.tipLabelName;
      const myField = document.querySelector('#textarea');
 
      // const myField = this.$refs.singleText;
 
      console.log('myField--',myField);
 
      if(myField.selectionStart || myField.selectionStart === 0) {
 
        let startPos = myField.selectionStart;
 
        let endPos = myField.selectionEnd;
 
        let welcomeContent = myField.value.substring(0, startPos) + value
 
                    + myField.value.substring(endPos, myField.value.length);

        this.post_data.welcome_tip = "<pre>" + welcomeContent + '</pre>'
 
        await this.$nextTick() // 这句是重点, 圈起来
 
        myField.focus();
 
        myField.setSelectionRange(endPos + value.length, endPos + value.length);
 
      } else {
        let welcomeContent = value;
        this.post_data.welcome_tip = "<pre>" + welcomeContent + '</pre>'
      }

    },
    async addTag() {
        console.log('blurChange', this.range)
        let value = this.tipLabelName;
        let myField = document.querySelector('#textarea');
        var range = this.range;
        console.log('range--',range);
        let selectionStart = range.startOffset;
        let selectionEnd = range.endOffset;
        if(selectionStart || selectionStart === 0) {
        let startPos = selectionStart;
        let endPos = selectionEnd;
        console.log('startPos--',startPos);
        console.log('endPos--',endPos);
        let txts = myField.innerHTML;
        let txt = txts.replace(value, '{客户名称}');
        console.log('txt--',txt);
        console.log('txts--',txts);
        let welcome_tip = txt.substring(0, startPos) + value
                    + txt.substring(endPos, txt.length);
        console.log('welcome_tip1--',welcome_tip);
        welcome_tip = welcome_tip.replace('{客户名称}', value);
        console.log('welcome_tip2--',welcome_tip);
        this.post_data.welcome_tip = myField.innerHTML = welcome_tip;
        await this.$nextTick() // 这句是重点, 圈起来
      } else {
        myField.innerHTML = this.post_data.welcome_tip = value;
      }

    },
    getWorkList() {
        if (this.loading) {
            return false;
        }
        this.loading = true;
        let param = {};
        if (this.tokenName) {
            param.tokenName = this.tokenName;
        }
        this.request(villageApi.getWorkList, param).then((res) => {
            console.log('work_list', res.work_list);
            if (res.work_list) {
                this.work_list = res.work_list;
            } else {
                this.work_list = [];
            }
            this.loading = false
        })
    },
    choose_tag(index, tag) {
        let choose_tag_index = JSON.parse(JSON.stringify(this.choose_tag_index))
        var label_id = tag['label_id'];
        if (label_id && (!choose_tag_index || !choose_tag_index[label_id])) {
            choose_tag_index[label_id] = label_id;
            this.choose_tag_index = choose_tag_index;
        } else if (label_id && choose_tag_index && choose_tag_index[label_id]) {
            var label_id = tag['label_id'];
            delete choose_tag_index[label_id];
            this.choose_tag_index = choose_tag_index;
        }
        if (label_id) {
            this.tags = [];
            for (var i in choose_tag_index) {
                if (choose_tag_index[i]) {
                    this.tags.push(choose_tag_index[i]);
                }
            }
        }
        console.log('choose_tag_index', choose_tag_index);
        console.log('tags', this.tags);
    },
    getLabelData() {
        if (this.loading) {
            return false;
        }
        this.loading = true;
        let param = {};
        if (this.tokenName) {
            param.tokenName = this.tokenName;
        }
        this.request(villageApi.getLabelData, param).then((res) => {
            if (res.label_data) {
                this.label_data = res.label_data;
            } else {
                this.label_data = [];
            }
            this.loading = false
        })
    },
    addCodeInfo() {
        var queryParam = {};
        if (this.code_id) {
            queryParam['code_id'] = this.code_id;
        }
        if (this.loading) {
            return false;
        }
        this.loading = true;
        if (this.tokenName) {
            queryParam.tokenName = this.tokenName;
        }
        this.request(villageApi.addCodeInfo, queryParam).then((res) => {
            console.log(res);
            if (res.label_group) {
                this.channer_group_options = res.label_group;
            } else {
                this.channer_group_options = [];
            }
            if(res.qywx_bind){
                this.data.corp_name = res.qywx_bind.corp_name;
            }else{
                this.data.corp_name = '';
            }
            if (res.channel_group_value) {
                this.channel_group_value = res.channel_group_value;
            } else {
                this.channel_group_value = [];
            }
            if (res.label_data) {
                this.label_data = res.label_data;
            } else {
                this.label_data = [];
            }
            if (res.tipLabelName) {
                this.tipLabelName = res.tipLabelName;
            }
            if (res.post_data) {
                this.post_data = res.post_data;
                if (res.detail.welcome_img_txt) {
                    this.addType = 1;
                    this.welcome_img = res.detail.welcome_img_txt;
                }
                if (res.detail.welcome_img_name) {
                    this.addType = 1;
                    this.imageName = res.detail.welcome_img_name;
                }
            }
            if (this.code_group_id && !this.post_data.code_group_id) {
                this.post_data.code_group_id = this.code_group_id;
            }
            if (res.record) {
                this.record = res.record;
                this.addType = 2;
                this.imageName = res.record.title;
            }
            if (res.detail) {
                if (res.detail['work_id_arr']) {
                    this.work_arr = res.detail['work_id_arr']
                }
                if (res.detail['label_id_arr']) {
                    this.tags = res.detail['label_id_arr']
                }
                if (res.detail['choose_tag_index']) {
                    this.choose_tag_index = res.detail['choose_tag_index']
                }
            }
            this.loading = false
        })
    },
    onChange(value) {
      console.log(value);
      console.log('code_group_id', this.code_group_id);
    },
    handleSubmit() {
        console.log('handleSubmit')
    },
    handleLabelGroupOks(name) {
        console.log('组添加成功', name)
        this.getLabelData();
    },
    handleLabelOks(name) {
        console.log('标签添加成功', name)
        this.getLabelData();
    },
  },
};
</script>

<style>
 .popover-code-box .flex_box{
    width: 100px;
    height: 70px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
.popover-code-box  .item_box {
    width: 50px;
    height: 50px;
    border: 1px solid lightgray;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content:center ;
    margin-left: 4px;
    cursor: pointer;
  }
 .popover-code-box .img_1 {
    width: 18px;
    height: 18px;
    display: block;
  }
 .popover-code-box .img_url {
    width: 50px;
    height: 50px;
  }
  
 .popover-code-box .text_1 {
    font-size: 12px;
  }
</style>
<style scoped>

.add-code-box {
    background-color: white;
}

.steps-title-box {
    padding: 20px 40px 5px;
}
.steps-content {
  margin-top: 16px;
  border-top: 1px solid #e9e9e9;
  background-color: white;
  min-height: 200px;
  padding-top: 10px;
}
.txt-tip {
    display: inline-block;
    color: red;
    margin-left: 10px;
}

.steps-action {
  padding: 24px;
  text-align: center;
}
.ant-tag.tip {
    border-radius: 5px;
}

.welcome-wrap {
    border: 1px solid #e2d6d6;
    display: inline-block;
    height: 550px;
    width: 352px;
    background: #f5f5f5;
    overflow-y: auto;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
}
.welcome-mt {
    margin-bottom: 15px;
    overflow: hidden;
}
.wel-msg_content_body {
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    margin: 20px;
}
.wel-msg_content_body .ant-avatar>img {
    display: block;
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
}
.wel-msg_content_txt {
    line-height: 21px;
    width: calc(100% - 46px);
    border: 1px solid #e9e9e9;
    padding: 10px 16px;
    border-radius: 4px;
    font-size: 14px;
    color: #1a1a1a;
    background: #fff;
    float: left;
    word-break: break-word;
}
.wel-item-info p {
    margin: 0;
    word-break: break-word;
}

.wel-pull-right {
    margin-left: 40px;
    width: 430px;
    max-height: 630px;
    height: 550px;
    background: #fff;
    border: 1px solid #d8d8d8;
    padding: 24px;
    overflow: hidden;
}
.wel-content-editable {
    font-size: 14px;
    line-height: 21px;
    padding: 15px;
    border: 1px solid #d9d9d9;
    height: 110px;
    overflow: auto;
}
.wel-medium-editor-element {
    word-wrap: break-word;
    min-height: 30px;
}
.wel-content-editable p {
    margin: 0;
    word-break: break-word;
}
.wel-ant-tag {
    margin-right: 5px;
    height: 26px;
    line-height: 25px;
    border: 1px solid #d9d9d9;
}
.wel-changeType-text {
    background: #fff2db;
    border: 1px solid #ffdda6;
    border-radius: 2px;
    padding: 7px 27px 6px 10px;
    font-size: 12px;
    width: 100%;
    margin-top: 12px;
    max-width: 673px;
    line-height: 20px;
    margin-bottom: 15px;
}
</style>