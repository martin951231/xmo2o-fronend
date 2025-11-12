<template>
    <a-drawer   :width="1000" :visible="visible"  @close="handleSubCancel">
       <div>

           <a-tabs default-active-key="1">
               <a-tab-pane key="1">
                  <span slot="tab">  <a-icon type="highlight" /> 变更详细  </span>

                   <a-table :columns="infoColumns" :data-source="list"   rowKey="id">
                       
                   </a-table>
                   
              </a-tab-pane>
             <a-tab-pane key="2">
              <span slot="tab">  <a-icon type="alert" />  操作源  </span>
                 <div>
                     <p>注意：这套识别程序的数据库是免费IP数据库、IP离线地址库，因此有误差、获取不到一些数据在所难免。仅供参考作用。</p>
                 </div>
                 <a-descriptions size="small" :column="2">
                     <a-descriptions-item label="操作时间">
                         {{logExtend.add_time }}
                     </a-descriptions-item>
                     <a-descriptions-item label="操作来源">
                         {{logExtend.country}}
                     </a-descriptions-item>
                     <a-descriptions-item label="操作账号">
                         {{ logExtend.account }}
                     </a-descriptions-item>
                     <a-descriptions-item label="账号名称">
                         {{ logExtend.realname }}
                     </a-descriptions-item>
                     <a-descriptions-item label="省份">
                         {{logExtend.province }}
                     </a-descriptions-item>
                     <a-descriptions-item label="城市">
                         {{ logExtend.city }}
                     </a-descriptions-item>
                     <a-descriptions-item label="浏览器">
                         {{ logExtend.browser_name }}
                     </a-descriptions-item>
                     <a-descriptions-item label="浏览器版本">
                         {{ logExtend.browser_version }}
                     </a-descriptions-item>

                     <a-descriptions-item label="操作系统">
                         {{ logExtend.os }}
                     </a-descriptions-item>
                     <a-descriptions-item label="操作系统版本">
                         {{ logExtend.os_version }}
                     </a-descriptions-item>
                     <a-descriptions-item label="ISP">
                         {{ logExtend.isp }}
                     </a-descriptions-item>
                     <a-descriptions-item label="model">
                         {{ logExtend.model }}
                     </a-descriptions-item>
                     <a-descriptions-item label="制造商">
                         {{ logExtend.manufacturer }}
                     </a-descriptions-item>
                     <a-descriptions-item label="备注">
                         <a> {{ logExtend.reson }}</a>
                     </a-descriptions-item>

                 </a-descriptions>
                 
               </a-tab-pane>
           </a-tabs>

           <div
               :style="{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#fff',
                  textAlign: 'right',
                  zIndex: 1,
                }">
               <a-button :style="{ marginRight: '8px' }" @click="handleSubCancel">关闭页面</a-button>

           </div>
       </div>
          
 
    </a-drawer>
</template>

<script>
import villageApi from '@/api/community/village';

const  infoColumns = [
    {
        title: '变更字段',
        dataIndex: 'field',
        key: 'field',
    },
    {
        title: '变更前值',
        dataIndex: 'old_val',
        key: 'old_val',
    },
    {
        title: '变更后值',
        dataIndex: 'new_val',
        key: 'new_val',
    }
];


export default{
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        log_fid: {
            type: Number,
            default: 0
        }
    },

    watch:{
        // log_fid: {
        //     handler (val) {
        //         if( this.visible){
        //             this.getDetailInfo()
        //         }
        //     }
        // },
        visible: {
            handler (val) {
                    this.getDetailInfo()
            }
        }
    },

    data(){
        return {
            infoColumns,
            list: [],
            logExtend:[]
        }
    },

    methods: {
        countChange(){
            
        },
        getDetailInfo(){
            let that = this
            if(that.log_fid){
                that.request(villageApi.villageSettingLogDetailApi, {log_fid: that.log_fid}).then((res) => {
                    that.list = res.logInfo
                    that.logExtend = res.logExtend
                })
            }
        },
        handleSubCancel(e) {
            this.$emit('closeDrawer', false)
        },
        handleCodeCancel(){

        },

        
    },
}
</script>

<style lang="less" scoped>
 .widthinput{
     //float: left;
 }
</style>
