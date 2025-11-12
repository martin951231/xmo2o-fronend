<template>
  <a-modal :title="title" :width="900" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
    <a-card :title="title2">
      <div>
          <div class="header-func">
            使用方法：点击“选中”直接返回对应模块外链代码，或者点击“详细”选择具体的内容外链
          </div>
          <div class="header-title">
            请选择模块： <a @click="selected_url('')"><div class="items-right">点击这里清除选择</div></a>
          </div>
      </div>
      <div class="body-item" v-for="(item,index) in appList" :key="index">
        <div class="items">
          <div class="items-left">{{item.title}}</div>
          <a @click="selected_url(item.url)" v-if="item.url" ><div class="items-right">选中</div></a>
          <a @click="$refs.createModal.navigations(item.title,item.module,cfromModel)" v-if="item.sub && item.module !=''"><div class="items-right">详细</div></a>
        </div>
      </div>
      <function-details ref="createModal" @ok="handleDetailOk"/>
    </a-card>
  </a-modal>
</template>
<script>
    import villageApi from '@/api/community/village';
    import functionDetails from './FunctionDetails'
	import store from '@/store';
    export default {
      name:'FunctionLibrary',
      components: {
        functionDetails
      },
        data() {
            return {
                title: '插入连接或者关键词',
                title2: store.getters.config.house_name+'功能库',
                visible: false,
                index_str:'',
                cfromModel:'',
                confirmLoading: false,
                appList: {
                    title: '',
                    url: '',
                },
            }
        },
        methods: {
            FunctionLibrary(index,cfromModel) {
                this.title='插入连接或者关键词',
                this.index_str=index;
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
                let postUrl=villageApi.getHotWordFuncApplication;
                if(this.cfromModel=='HouseHotWordManage'){
                    postUrl=villageApi.getHotWordFuncApplication;
                }
                this.request(postUrl)
                    .then((res) => {
                        console.log('res', res)
                        this.appList = res.list
                    })
            },
            selected_url(url){
                this.$emit('ok', url,this.index_str,this.cfromModel)
                this.visible = false;
            },
            handleCancel() {
                this.visible = false
            },
            handleDetailOk(url) {
                console.log('url',url,'index_str',this.index_str);
              this.$emit('ok', url,this.index_str,this.cfromModel)
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