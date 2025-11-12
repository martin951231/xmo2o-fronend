<template>
    <div class="video-player">
        <div :style="{left:showMonitor?rtspParams.left+'px':'0px', top:showMonitor?rtspParams.top+'px':'0px'}" :id="rtspParams.id" class="divPlugin"></div>
    </div>
</template>
<script>
    export default {
        name: "videoPlayer",
        data() {
            return {
                rtspParams: {
                    id: 'divPlugin',
                    port: '',
                    host: '',
                    username: '',
                    password: '',
                    play_url: '',
                    top: '',
                    left: '',
                    gatewayPluginDownload: ''
                },
                showMonitor: true
            };
        },
        created() {},
        mounted() {
            let that = this
            if(that.$route.query.rtspParams){
                that.rtspParams = JSON.parse(that.$route.query.rtspParams)
            }
            if(that.rtspParams && that.rtspParams.host){
                that.videoInitPlugin();
            }
            /*
            window.onresize = function () {
                WebVideoCtrl.I_Resize(600, 400);
            };
            */
        },
        destroyed() {
            this.stopPlayAll()
        },
        methods: {
            videoInitPlugin() {
                let that = this
                let timeout = setTimeout(()=>{
                    clearTimeout(timeout)
                    that.initPlugin()
                }, 1000)
            },
            //插件初始化
            initPlugin() {
                let that = this;
                WebVideoCtrl.I_InitPlugin({
                    bWndFull: true,
                    iWndowType: 1,
                    cbSelWnd: function (xmlDoc) {
                        let iWind = parseInt($(xmlDoc).find(that.rtspParams.id).eq(0).text(), 10);
                        console.log("被选中窗口的索引: " + iWind);
                    },
                    cbEvent: function (iEventType, iParam1, iParam2) {
                        console.log('iEventType===>', iEventType, iParam1, iParam2);
                    },
                    cbInitPluginComplete: function () {
                        WebVideoCtrl.I_InsertOBJECTPlugin(that.rtspParams.id).then(() => {
                            WebVideoCtrl.I_CheckPluginVersion().then((bFlag) => {
                                that.clickLogin(that.rtspParams);
                                if (bFlag) {
                                    alert("请更新HCWebSDKPlugin到最新版本");
                                }
                            });
                        }, (err) => {
                            that.showMonitor = false
                            that.$confirm({
                                title: '提示',
                                content: 'HCWebSDKPlugin插件初始化失败，请先下载插件并完成安装后，在尝试打开监控视频',
                                okText: '立即下载',
                                cancelText: '取消',
                                onOk() {
                                    if(that.rtspParams.gatewayPluginDownload){
                                        window.location.href = that.rtspParams.gatewayPluginDownload
                                    } else {
                                        that.$message.warn('暂无下载链接，请联系管理员')
                                    }
                                },
                                onCancel() {},
                            });
                        });
                    }
                });
            },
            clickLogin(data) {
                let that = this;
                WebVideoCtrl.I_Login(
                data.host,
                1,
                data.port,
                data.username,
                data.password, {
                    timeout: 3000
                }).then(() => {
                    console.log("登录成功");
                    that.realplay()
                }, (oError) => {
                    console.log("登录失败", oError);
                })
            },
            
            clickLogout(){
                let that = this;
                let szDeviceIdentify = that.rtspParams.host;
                WebVideoCtrl.I_Logout(szDeviceIdentify).then(() => {
                    // location.reload()
                    console.log("登出成功");
                }, (oError) => {
                    console.log("登出失败", oError);
                })
            },
            
            // 开始预览
            realplay () {
                let that = this
                let szDeviceIdentify = that.rtspParams.host;
                WebVideoCtrl.I_StartPlay(szDeviceIdentify, {
                    // szUrl: 'rtsp://192.168.0.75:554/dac/realplay/796B5E24-8764-4440-92D4-8496A4A8E6D31/SUB/TCP?streamform=rtp'
                    szUrl: that.rtspParams.play_url
                }).then(() => {
                    console.log("预览成功");
                }, (oError) => {
                    console.log("预览失败: " + oError.errorCode + ":" + oError.errorMsg);
                });
            },
            
            stopPlayAll () {
                let that = this
                WebVideoCtrl.I_StopAllPlay().then(() => {
                    that.clickLogout()
                    console.log("停止全部播放成功");
                }, (oError) => {
                    console.log("停止全部播放失败");
                })
            }
        },
        watch: {
        },
    };
</script>
<style lang="less" scoped>
    .video-player {
        width: 100%;
        height: 100%;
        .divPlugin {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            position: fixed;
        }
    }
</style>