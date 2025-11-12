<template>
    <div class="view_component">
        <div class="single_desc">
            <a-button class="margin_top_20" style="transform: translateX(20px);" type="default" @click="goBack(0)">
                返回
            </a-button>
            <div class="single_item" v-for="(item,index) in descList" :key="index">
                {{item.key}}：{{item.value?item.value:'暂无'}}
            </div>
        </div>

        <div class="unit_tab">
            <div :class="currentIndex == index?'active':''" class="tab_item" v-for="(item,index) in unitList"
                :key="index" @click="changeTabs(item, index)">
                {{item.floor_name}}
            </div>
        </div>

        <div class="single_level">
            <div v-if="!noData" :class="'layer_nav_'+level_index" class="level_item" v-for="(level_item, level_index) in singleArr" :key="level_index">
                <div class="room_con">
                    <div class="level_name">{{level_item.level}}</div>
                    <div class="room_item" v-for="(room_item, room_index) in level_item.roomList"
                        @click="goDetail(room_item)" :key="room_index">
                        <div class="right_content">
                            <div class="room_title">{{room_item.title}}</div>
                            <div class="room_status" :class="room_item.pay_status == 1?'status_yezhu':room_item.pay_status == 2?'status_kongzhi':room_item.pay_status == 3?'status_zuke':'status_nostatus'">
                                {{room_item.pay_status_txt}}
                            </div>
                            <div class="room_edit">
                                <a-popover title="" placement="right">
                                    <template slot="content">
                                        <a-icon type="edit" @click="showModel(room_item)"/>
                                    </template>
                                    <a-icon type="more" />
                                </a-popover>
                            </div>
                            <div class="props_con">
                                <div class="props_item" v-for="(props, props_index) in room_item.roomProps"
                                    :key="props_index" :style="{width:props.key=='欠费金额'?'75%':'45%'}">
                                    <span style="font-size: 10px;" :style="{color:props.key=='欠费金额'?'red':''}" v-if="!(props.key=='欠费金额' && !props.value)">
                                        <a-tooltip placement="rightTop">
                                            <template slot="title">
                                                <span v-if="props.key!='户主' && props.key!='面积'">{{props.key}}：</span>
                                                {{props.value?props.value:'暂无'}}
                                            </template>
                                            <span v-if="props.key!='户主' && props.key!='面积'">{{props.key}}：</span>
                                            {{props.value?props.value:'暂无'}}
                                        </a-tooltip>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="level_item.roomList.length == 0" class="room_item">
                        <div class="right_content" style="display: flex; align-items: center; justify-content: center;">暂无房间</div>
                    </div>
                </div>
            </div>
            <div v-if="noData" class="no_data" style="width: 100%;height: 300px;display: flex;align-items: center;justify-content: center;font-size: 20px;color: #999999; position: absolute;">
                <span v-if="dataLoading" style="display: flex;flex-direction: column;align-items: center;justify-content: center;color: #999999;">
                    <a-icon type="loading" />
                    加载中...
                </span>
                <span v-else>暂无数据</span>
            </div>
        </div>
        
       <a-modal :title="'修改'+$store.getters.config.room_name+'状态'" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"
            @cancel="handleCancel">
            <span>{{$store.getters.config.room_name}}状态</span>
            <a-radio-group style="margin-left: 20px;" v-model="pay_status" name="radioGroup">
                <a-radio :value="1">业主入住</a-radio>
                <a-radio :value="3">租客入住</a-radio>
                <a-radio :value="2">空置</a-radio>
            </a-radio-group>
       </a-modal>
    </div>
</template>

<script>
    export default {
        props: {
            single_id: {
                type: Number,
                default: 0
            },
            currentLevel: {
                type: Number,
                default: -1
            }
        },
        
        watch: {
            currentLevel(val){
                if(val>=0){
                    document.querySelector('.layer_nav_'+val).scrollIntoView({block: "start", behavior: "smooth"});
                }
            }
        },

        data() {
            return {
                currentIndex: 0,
                descList: [],
                unitList: [],
                singleArr: [],
                visible: false,
                confirmLoading: false,
                pay_status: 1,
                dataLoading: false,
                noData: true
            }
        },

        mounted() {
            this.getUnitList()
            this.getBuildingInfo()
        },

        methods: {
            changeTabs(item, index) {
                if (this.currentIndex == index) {
                    console.log("重复")
                } else {
                    this.currentIndex = index
                    this.getRoomList(item.floor_id, item.single_id)
                }
            },
            goBack() {
                this.$emit('goBack')
            },
            getUnitList() {
                let that = this
                that.request('/community/village_api.cashier/getfloorList', {
                    single_id: that.single_id
                }, 'post').then((res) => {
                    if (res.length > 0) {
                        that.unitList = res
                        that.getRoomList(res[0].floor_id, res[0].single_id)
                        that.currentIndex == 0
                    }
                })
            },

            getRoomList(floor_id, single_id) {
                let that = this
                that.dataLoading = true
                that.singleArr = []
                let arr = []
                that.noData = true
                that.request('/community/village_api.cashier/getVacancyList', {
                    single_id: single_id,
                    floor_id: floor_id
                }, 'post').then((res) => {
                    that.dataLoading = false
                    if(res.length > 0){
                        that.noData = false
                        that.singleArr = res
                        res.map(v=> {
                            arr.push(v.level)
                        })
                        that.$emit('getRoomList', arr)
                    } else {
                        that.noData = true
                    }
                }).catch(e=>{
                    that.dataLoading = false
                })
            },

            goDetail(item) {
                let params = {}
                if (item.pigcms_id) {
                    params.pigcms_id = item.pigcms_id
                }
                if (item.key[3]) {
                    params.room_id = [item.key[3] + '|' + item.title + '|room']
                }
                if(item.key.length > 0){
                    params.room_key = item.key
                }
                params.back_type = 1
                this.$emit('roomInfo', params)
            },

            getBuildingInfo() {
                let that = this
                that.request('/community/village_api.Aockpit/getBuildingInfo', {
                    single_id: that.single_id
                }, 'post').then((res) => {
                    that.descList = res.list
                })
            },

            handleOk(e) {
                this.confirmLoading = true;
                let that = this
                that.request('/community/village_api.Cashier/setVacancyPayStatus', {
                    room_id: that.room_id,
                    pay_status: that.pay_status
                }, 'post').then((res) => {
                    that.$message.success('修改成功！')
                    that.getRoomList(that.unitList[that.currentIndex].floor_id, that.unitList[that.currentIndex].single_id)
                    that.confirmLoading = false
                    that.visible = false
                })
            },
            
            handleCancel(e) {
                this.visible = false;
            },
            
            showModel(room_info){
                console.log(room_info)
                this.pay_status = room_info.pay_status
                this.room_id=room_info.key[3]
                this.visible = true
            }
        },
    }
</script>

<style lang="less" scoped>
    .view_component {
        width: 100%;
        background-color: RGBA(255, 255, 255, .2);
        display: flex;
        align-items: center;
        flex-direction: column;

        .single_desc {
            width: 100%;
            display: flex;
            align-items: center;
            border-radius: 10px;
            padding: 10px 0;
            transform: translateY(10px);
            border: 1px solid #eeeeee;

            .single_item {
                margin-left: 40px;
                // &:nth-child(1) {
                //     margin-left: 10px;
                // }
                // &:nth-last-child(1){
                //     margin-right: 20px;
                // }
            }

            .back_btn {
                background-color: #eeeeee;
                border-radius: 20px;
                cursor: pointer;
                padding: 4px 10px;
            }
        }

        .unit_tab {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            transform: translateY(10px) translateX(-10px);
            flex-wrap: wrap;
            .tab_item {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-size: 12px;
                background-color: #909399;
                padding: 5px 15px;
                cursor: pointer;
                margin-left: 10px;
                margin-top: 10px;
            }

            .active {
                background-color: #409EFF;
            }
        }

        .single_level {
            width: 100%;
            margin-top: 20px;
            
            .level_item {
                width: 100%;
                height: 100%;
                min-height: 100px;
                display: flex;
                margin: 10px 0;
                cursor: pointer;
                .room_con{
                    display: flex;
                    flex-wrap: wrap;
                    height: 100%;
                    min-height: 100px;
                    position: relative;
                    transform: translateX(42px);
                    padding-bottom: 5px;
                    width: 100%;
                    &:hover{
                        background: rgba(64, 158, 255, .3);
                    }
                    .level_name{
                        position: absolute;
                        left: -42px;
                        width: 20px;
                        padding: 0 20px;
                        height: 100%;
                        word-wrap: break-word;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #409EFF;
                        color: #ffffff;
                        font-weight: bold;
                        flex-shrink: 0;
                        line-height: 20px;
                        text-align: center;
                    }
                    .room_item {
                        position: relative;
                        // width: 390px;
                        height: 100px;
                        margin-left: 5px;
                        margin-top: 5px;
                        display: flex;
                       
                        .left_status {
                            width: 70px;
                            height: 100%;
                            background-image: url(../images/icon_zhengchang.png);
                            background-size: 100% 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                    
                            .home_icon {
                                width: 38.14px;
                                height: 32.23px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                    
                                img {
                                    width: 38.14px;
                                    height: 32.23px;
                                }
                            }
                    
                            .home_name {
                                font-size: 12px;
                                color: #FFFFFF;
                                margin-top: 3px;
                            }
                        }
                    
                        .right_content {
                            width: 170px;
                            height: 100%;
                            position: relative;
                            background-color: #F4F5F9;
                            &:hover{
                                background: rgba(64, 158, 255, .4);
                            }
                            .room_title {
                                width: 100%;
                                height: 27px;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                color: #06376C;
                                font-weight: bold;
                                padding: 2px 6px;
                                margin-top: 10px;
                                font-size: 12px;
                                display: inline-block;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                text-align: left;
                            }
                    
                            .room_status {
                                position: absolute;
                                top: -5px;
                                right: -10px;
                                color: #ffffff;
                                font-size: 12px;
                                width: 90px;
                                height: 24px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-bottom-left-radius: 15px;
                                border-bottom-right-radius: 15px;
                                background-size: 100% 100%;
                                transform: scale(.7);
                            }
                            
                            .status_yezhu{
                                border-bottom-left-radius: 20px;
                                border-bottom-right-radius: 20px;
                                background-image: linear-gradient(to top, rgba(26, 81, 217, 1), rgba(26, 81, 217, .7), rgba(26, 81, 217, .5));
                                // background-image: url(../images/icon_house_yezhu.png);
                            }
                            
                            .status_zuke{
                                border-bottom-left-radius: 20px;
                                border-bottom-right-radius: 20px;
                                background-image: linear-gradient(to top, rgba(49, 174, 40, 1), rgba(49, 174, 40, .7), rgba(49, 174, 40, .5));
                                // background-image: url(../images/icon_house_zuke.png);
                            }
                            
                            .status_kongzhi{
                                border-bottom-left-radius: 20px;
                                border-bottom-right-radius: 20px;
                                background-image: linear-gradient(to top, rgba(255, 154, 29, 1), rgba(255, 154, 29, .7), rgba(255, 154, 29, .5));
                                // background-image: url(../images/icon_house_kongzhi.png);
                            }
                            
                            .status_nostatus{
                                border-bottom-left-radius: 20px;
                                border-bottom-right-radius: 20px;
                                background-image: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, .7), rgba(0, 0, 0, .5));
                                // background-image: url(../images/icon_house_kongzhi.png);
                            }
                    
                            .room_edit {
                                position: absolute;
                                cursor: pointer;
                                bottom: 5px;
                                right: 10px;
                                width: 10px;
                                height: 20px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                z-index: 99999;
                                img {
                                    width: 19px;
                                    height: 5px;
                                }
                            }
                    
                            .props_con {
                                width: 96%;
                                height: calc(100%-27px);
                                overflow-y: scroll;
                                display: flex;
                                flex-wrap: wrap;
                                margin: 0 auto;
                                font-size: 12px;
                                transform: translateY(-7px);
                                .props_item {
                                    margin: 1px 3px;
                                    color: #666666;
                                    width: 33%;
                                    font-size: 10px;
                                    display: inline-block;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    text-align: left;
                                }
                            }
                    
                            .props_con::-webkit-scrollbar {
                                display: none;
                                /* Chrome Safari */
                            }
                        }
                    }
                }
            }
        }
    }
</style>
