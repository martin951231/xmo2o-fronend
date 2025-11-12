<template>
    <div class="third-data-important-index-box">
         <div class="card-container">
            <a-tabs type="card"  :activeKey="cardActiveKey" @change="callback">
                <a-tab-pane key="roomUploadPage" tab="房产信息导入">
                    
                </a-tab-pane>
                <a-tab-pane key="userUploadPage" tab="客户信息导入" force-render>
                   
                </a-tab-pane>
                <a-tab-pane key="chargeUploadPage" tab="收费信息导入">
                    
                </a-tab-pane>
            </a-tabs>
         </div>
        <div class="tab_components">
            <room-upload-page :is="currentTab" v-if="visible" :key="currentTab" />
        </div>
    </div>
</template>
<script>
    import roomUploadPage   from './components/roomUploadPage'
    import userUploadPage   from './components/userUploadPage'
    import chargeUploadPage from './components/chargeUploadPage'
    export default {
      name: 'thirdDataImportIndex',
      components: {
        roomUploadPage,
        userUploadPage,
        chargeUploadPage,
      },
      data () {
        return {
          cardActiveKey : 'roomUploadPage',
          visible       : true,
          currentTab    : 'roomUploadPage',
        }
      },
      methods: {
         callback(key) {
            this.currentTab    = key
            this.cardActiveKey = key
         },
         closeRoomUploadPage(key) {
            this.roomUploadPageVisbile = false
         }
      }
    }

</script>
<style lang="less" scoped>
 .third-data-important-index-box {
    background-color: #ffffff;
    padding: 20px;
    height: 100%;
 }
</style>