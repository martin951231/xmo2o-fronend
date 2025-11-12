<template>
    <div class="basic_set">
        <a-tabs :default-active-key="currentIndex" @change="callback" tabPosition="left">
          <a-tab-pane :key="index" v-for="(item,index) in tabList" :tab="item.name">
            <component v-if="currentIndex == index" :is="item.component" />
          </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import propertyApi from '@/api/community/property/packages';
import baseCongig from './commponents/baseConfig.vue';
import parameterSet from './commponents/parameterSet.vue';
import abChinaSet from './commponents/abChinaSet.vue';
export default {
    name:"propertyConfigSet",
    components: {
        baseCongig,
        parameterSet,
        abChinaSet
    },
    data(){
        return{
            tabList: [
                {name: '基本设置', component:'baseCongig'},
                {name: '参数设置', component:'parameterSet'}
            ],
            currentIndex: 0
        }
    },
    mounted(){
        this.getAnChina()
    },
    methods: {
        callback(key) {
            this.currentIndex = key
        },
        getAnChina(){
            this.request(propertyApi.showAbChina).then((res) => {
                if(res.abchina==1){
                    this.tabList = [
                        {name: '基本设置', component:'baseCongig'},
                        {name: '参数设置', component:'parameterSet'},
                        {name: '农行参数设置', component:'abChinaSet'}
                    ];
                }
            })
        }
    },
}
</script>

<style scoped>
    .basic_set{
        width: 100%;
        padding: 20px;
        background-color: #ffffff;
    }
</style>