<template>
    <div class="top_tab">
       <div class="tab_list">
           <a-tabs default-active-key="text_resources" @change="callback" size="large" >
             <a-tab-pane :key="item.value" :tab="item.label" v-for="(item,index) in tabList">
                <component v-if="item.value == currentKey" :params="params" :is="item.component" />
             </a-tab-pane>
           </a-tabs>
       </div>
    </div>
</template>
<script>
    import text_material from "./components/text_material";
    import img_material from "./components/img_material";
    import audio_material from "./components/audio_material";
    export default {
        name: 'hotWordMaterialManageList',
        filters: {

        },
        components:{
            text_material,
            img_material,
            audio_material
        },
        data() {
            return {
                tabList: [{label: '文字素材', value: 'text_resources', component: 'text_material'}, {label: '图片素材', value: 'img_resources',  component: 'img_material'}, {label: '音频素材', value: 'audio_resources',  component: 'audio_material'}],
                currentKey: 'text_resources',
                params: {
                    test: '123'
                }
            };
        },
       
        methods: {
          callback(key){
              this.currentKey = key
          }
        }
    };
</script>
<style lang="less" scoped>
    .top_tab{
        background-color: #ffffff;
        padding: 20px;
    }
</style>