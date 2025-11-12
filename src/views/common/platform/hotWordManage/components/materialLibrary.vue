<template>
  <a-modal :title="title" :width="900" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
    <a-card :title="title2">
      <div>
          <div class="header-func">
            使用方法：点击“选中”直接返回对应模块数据，或者点击“详细”选择具体的内容数据
          </div>
          <div class="header-title">
            请选择模块： <a @click="selected_url('')"><div class="items-right">点击这里清除选择</div></a>
          </div>
      </div>
      <div class="body-item" v-for="(item,index) in appList" :key="index">
        <div class="items">
          <div class="items-left">{{item.categoryname}}</div>
          <a @click="selected_url(item)"><div class="items-right">选中</div></a>
          <a @click="$refs.createModal.navigations(item,xtype,cfromModel)"><div class="items-right">详细</div></a>
        </div>
      </div>
      <material-details ref="createModal" @ok="handleDetailOk"/>
    </a-card>
  </a-modal>
</template>
<script>
    import hotWordManageApi from '@/api/common/platform/hotWordManage';
    import materialDetails from './materialDetails'
    export default {
      name:'HotwordMaterialLibrary',
      components: {
        materialDetails
      },
        data() {
            return {
                title: '关键词素材库',
                title2: '',
                visible: false,
                index_str:'',
                cfromModel:'',
                confirmLoading: false,
                appList: {
                    title: '',
                    url: '',
                },
                xtype:1,
            }
        },
        methods: {
            materialLibrary(xtype,index,cfromModel) {
                this.title='关键词素材库';
                this.title2='关键词素材库';
                this.index_str=index;
                this.xtype=xtype;
                if(this.xtype==1){
                    this.title2='文字回复素材库';
                }else if(this.xtype==2){
                    this.title2='音频回复素材库';
                }else if(this.xtype==3){
                    this.title2='图片回复素材库';
                }
                this.visible = true;
                if(cfromModel){
                    this.cfromModel=cfromModel;
                }else{
                    this.cfromModel='';
                }
                this.AppLists();
            },
            AppLists() {
                let _this = this
                let postUrl=hotWordManageApi.getHotWordMaterialLibrary;
                let postArr={xtype:this.xtype};
                this.request(postUrl,postArr)
                    .then((res) => {
                        console.log('res', res)
                        this.appList = res.list
                    })
            },
            selected_url(sdata){
                this.$emit('ok', sdata,'material_category',this.index_str)
                this.visible = false;
            },
            handleCancel() {
                this.visible = false
            },
            handleDetailOk(sdata) {
              this.$emit('ok', sdata,'material_content',this.index_str)
              this.visible = false;
            },
        },
    }
</script>
<style>
  .header-func{
    border: 1px solid #ffdf84;
    background-color: #fbffca;
    padding: 10px;
  }
  .header-title{
    font-size: 17px;
    margin: 10px;
  }
  .body-item{
    margin-top: 10px;
    height: 100%;
  }
  .items{
    height: 30px;
    width: 31.5%;
    float: left;
    background-color: #eee;
    font-size: 15px;
    margin: 5px;
  }
  .items-left{
    float: left;
    padding: 5px 5px 5px 10px;
  }
  .items-right{
    float: right;
    padding: 5px 10px 5px 5px;
  }
</style>