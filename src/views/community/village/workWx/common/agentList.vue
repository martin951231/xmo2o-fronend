<template>
  <a-modal :title="title" :width="888" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    
    <div data-v-a21a6482="" style="color: rgb(255, 86, 45); margin: 10px 0px 20px 8px;">
        更换自建应用后，之前所配置的自建应用页面需要前往【<a data-v-a21a6482="" target="_blank" href="https://work.weixin.qq.com/wework_admin/loginpage_wx">企业微信后台</a>】重新配置。
    </div>

    <div class="agent-box">
        <a-row :gutter="24">
            <a-col class="gutter-row" :span="8"  v-for="(item,index) in list" :key="index">
                <div class="agent-box-div"  :class="choose_id==item.id?'active':''" @click="choose(item)">
                    <a-row :gutter="24">
                        <a-col class="gutter-row img-box" :span="6">
                            <img style="width: 50px;" :src="item.square_logo_url"/>
                        </a-col>
                        <a-col class="gutter-row txt-box" :span="16">
                            <div class="agent-title" >{{item.name}}</div>
                            <div class="agent-desc">{{item.description}}</div>
                        </a-col>
                    </a-row>
                </div>
            </a-col>
        </a-row>
    </div>

  </a-modal>
</template>

<script>
    import configVillageApi from '@/api/community/village'
    import { getSystemName } from '@/utils/util'
    var treeData = [];
    export default {
        data() {
            return {
                title: '替换应用',
                tokenName: '',
                sysName: '',
                choose_id: 0,
                visible: false,
                confirmLoading: false,
                list: [],
                choose_info: {}
            }
        },
        methods: {
            text_change(e) {
                // console.log('-----',e);
            },
            replaceAgent(id) {
                this.title = '替换应用'
                this.visible = true
                // 当前选中应用id
                this.choose_id = id;
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                }
                this.getAgentList();
            },
            handleSubmit() {
                this.visible = false
                this.$emit('ok', this.choose_info)
            },
            handleCancel() {
                this.visible = false
            },
            getAgentList() {
                var param = {}
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName
                }
                this.request(configVillageApi.getAgentList, param).then((res) => {
                    console.log('获取应用', res)
                    this.list = res.list;
                })
            },
            choose(item) {
              this.choose_id = item.id;
              this.choose_info = item;
            }
        },
    }
</script>
<style>
  
.agent-box {
  padding: 10px;
}
.agent-box .agent-box-div {
  padding:24px;
  border:1px solid #e8e8e8;
  min-width:222px;
  margin-bottom: 20px;
  cursor:pointer;
}
.agent-box .agent-box-div:hover{
  box-shadow: 1px 2px 2px 2px #e8e8e8;
}
.agent-box .agent-box-div .img-box {
    padding: 0px !important;
}
.agent-box .agent-box-div .txt-box {
    padding: 0px !important;
}
.agent-box .agent-box-div.active {
    border: 1px solid #1989fa
}
.agent-box .agent-desc {
  color: rgba(0,0,0,.45);
}
.agent-box .agent-title {
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>