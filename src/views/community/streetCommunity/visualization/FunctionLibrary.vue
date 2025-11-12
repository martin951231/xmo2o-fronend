<template>
  <a-modal :title="title" :width="900" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
    <a-card title="街道功能库">
      <div class="header-func">
        使用方法：点击“选中”直接返回对应模块外链代码，或者点击“详细”选择具体的内容外链
      </div>
      <div class="header-title">
        请选择模块：
      </div>
      <div class="body-item" v-for="(item,index) in appList" :key="index">
        <div class="items">
          <div class="items-left">{{item.title}}</div>
          <a  v-if="item.url" @click="selected_url(item.url)"><div class="items-right">选中</div></a>
          <a @click="$refs.createModal.navigations(item.title,item.module)" v-if="item.sub && item.module !=''"><div class="items-right">详细</div></a>
        </div>
      </div>
      <function-details ref="createModal" @ok="handleOk"/>
    </a-card>
  </a-modal>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import functionDetails from './FunctionDetails'
    export default {
      name:'FunctionLibrary',
      components: {
        functionDetails
      },
        data() {
            return {
                title: '插入连接或者关键词',
                visible: false,
                confirmLoading: false,
                appList: {
                    title: '',
                    url: '',
                },
            }
        },
        methods: {
            FunctionLibrary() {
                this.title='插入连接或者关键词',
                this.visible = true;
                this.AppLists();
            },
            AppLists() {
                let _this = this
                this.request(streetCommunityApi.getApplication)
                    .then((res) => {
                        console.log('res', res)
                        this.appList = res.list
                    })
            },
            selected_url(url){
                this.$emit('ok', url)
                this.visible = false;
            },
            handleCancel() {
                this.visible = false
            },
            handleOk(url) {
              this.$emit('ok', url)
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