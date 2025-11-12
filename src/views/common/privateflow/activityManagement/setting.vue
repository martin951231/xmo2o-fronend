<template>
    <div class="activity-list">
        <p class="title">{{title}}</p>
        <div class="content">
            <a-avatar style="backgroundColor: #87d068" icon="user" :size="50"/>
            <p class="desc">{{desc}}</p>
            <p v-if="account">账号：{{account}}</p>
            <p v-if="password">密码：{{password}}</p>
            <a-button style="margin-top: 15px" type="primary" @click="go()">{{btn_txt}}</a-button>
        </div>
    </div>
</template>

<script type="text/javascript">
    import privateFlowApi from '@/api/common/priviteflow'

    export default {
        name: 'Setting',
        components: {},
        data() {
            return {
                title: "绑定企业微信，打造私域流量",
                desc: "",
                btn_txt: "",
                btn_api: "",
                account:"",
                password:""
            }
        },
        mounted() {
            this.isBind();
        },
        methods: {
            isBind() {
                this.request(privateFlowApi.isBind, {}).then((data) => {
                    if (data.is_bind) {
                        this.desc = "已绑定企业微信，点击下方按钮去管理更多功能";
                        this.btn_txt = "去管理";
                        this.btn_api = privateFlowApi.getLoginUrl;
                        this.account = data.account;
                        this.password = data.password;
                    } else {
                        this.desc = "请先绑定企业微信后，才可管理企业微信私域流量相关功能";
                        this.btn_txt = "绑定企业微信";
                        this.btn_api = privateFlowApi.register;
                    }
                })
            },
            go(){
                this.request(this.btn_api, {}).then((data) => {
                    this.account = data.account;
                    this.password = data.password;
                    window.open(data.url);
                })
            }
        }
    }
</script>


<style lang="less" scoped>
    .activity-list {
        padding: 10px;
        height: 800px;
        background: #FFFFFF;
        text-align: center;
    }

    .content {
        width: 36%;
        margin-left: 32%;
        height: 378px;
        border: 1px solid #DDDDDD;
        padding: 57px 65px 10px 65px;
        line-height: 25px;
    }

    .title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-top: 100px;
    }

    .desc {
        color: #999999;
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>