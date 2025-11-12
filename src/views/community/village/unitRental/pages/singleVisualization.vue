<template>
    <div class="single_view">
        <div class="left_single" v-if="showSingle">
            <div class="single_item" :class="index == currentSingle? 'single_item_active':''" @click.stop="switchSingle(item, index)" v-for="(item, index) in singleList" :key="index">{{item.single_name}}</div>
        </div>
        <div class="right_content" :style="{width: showSingle? 'calc(100% - 160px)': 'calc(100% - 10px)', marginLeft: showSingle? '0px': '10px'}">
            <div class="top_unit">
                <div class="unit_item" :class="unit_index == currentUnit? 'unit_item_active':''" @click.stop="switchUnit(unit_item, unit_index)" v-for="(unit_item, unit_index) in unitList" :key="unit_index">
                    <div class="unit_name">{{unit_item.unit_name}}</div>
                    <div class="operation">
                        <a-icon type="edit" />
                        <a-icon type="delete" style="color: red;margin-left: 10px;" />
                    </div>
                </div>
            </div>
            <div class="layer_content">
                <div class="left_room_structure">
                    <div class="layer_item" v-for="(layer_item, layer_index) in [...roomStructure, ...roomStructure, ...roomStructure]" :key="layer_index">
                        <div class="layer_left_content">
                            <div class="layer_name_vertical">
                                {{layer_item.layer_name}}
                                <a-icon type="edit" theme="twoTone" />
                                <a-icon type="delete" style="color: red;" />
                            </div>
                        </div>
                        <div class="layer_left_txt">
                            <div class="layer_name_vertical">
                                {{layer_item.layer_name}}
                            </div>
                        </div>
                        <div class="room_item" v-for="(room_item, room_index) in layer_item.room_list" :key="room_index">
                            <div class="status_icon">欠费</div>
                            <div class="room_title">1栋1{{$store.getters.config.floor_name}}1701室</div>
                            <div class="room_props" v-for="(props, props_index) in room_item.room_props" :key="props_index">
                                {{props.label}}:{{props.value}}
                            </div>
                            <!-- <div class="room_edit">
                                <a-icon type="edit" theme="twoTone" />
                            </div> -->
                        </div>
                        <div class="layer_right_txt">
                            <div class="layer_name_vertical">
                                {{layer_item.layer_name}}
                            </div>
                        </div>
                        <div class="layer_right_content">
                            <div class="layer_name_vertical">
                                {{layer_item.layer_name}}
                                <a-icon type="edit" theme="twoTone" />
                                <a-icon type="delete" style="color: red;" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right_layer_nav" :style="{width:isTrigger?'100px':'0'}">
                    <div class="trigger_content">
                        <div class="trigger" @click="triggerThis">
                            {{isTrigger?'折叠':'展开'}}
                        </div>
                        <div class="layer_nav_desc" v-if="isTrigger">
                            楼层导航
                        </div>
                        <div :class="index == currentLayer? 'layer_item_active':''"  @click.stop="switchLayer(item, index)" :style="{display:isTrigger?'flex':'none'}" class="layer_item" v-for="(item, index) in layerList" :key="index">
                            {{item.layer_name}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import store from '@/store';
    export default defineComponent({
        setup(props, context) {
            let singleList =ref([
                {single_id: 0, single_name: '第一十二栋'},
                {single_id: 1, single_name: '二栋'},
                {single_id: 2, single_name: '三栋'},
                {single_id: 3, single_name: '四栋'},
                {single_id: 4, single_name: '五栋'},
                {single_id: 5, single_name: '六栋'}
            ])
            let unitList = ref([
                {unit_id: 0, unit_name: '一'+store.getters.config.floor_name},
                {unit_id: 1, unit_name: '二'+store.getters.config.floor_name},
                {unit_id: 2, unit_name: '三'+store.getters.config.floor_name},
                {unit_id: 3, unit_name: '四'+store.getters.config.floor_name},
                {unit_id: 4, unit_name: '五'+store.getters.config.floor_name},
                {unit_id: 5, unit_name: '六'+store.getters.config.floor_name}
            ])
            let layerList = ref([
                {layer_id: 0, layer_name: '1'},
                {layer_id: 1, layer_name: '2'},
                {layer_id: 2, layer_name: '3'},
                {layer_id: 3, layer_name: '4'},
                {layer_id: 4, layer_name: '5'},
                {layer_id: 5, layer_name: '6'},
                {layer_id: 0, layer_name: '7'},
                {layer_id: 1, layer_name: '8'},
                {layer_id: 2, layer_name: '9'},
                {layer_id: 3, layer_name: '10'},
                {layer_id: 4, layer_name: '11'},
                {layer_id: 5, layer_name: '12'},
                {layer_id: 0, layer_name: '13'},
                {layer_id: 1, layer_name: '14'},
                {layer_id: 2, layer_name: '15'},
                {layer_id: 3, layer_name: '16'},
                {layer_id: 4, layer_name: '17'}
            ])
            let roomStructure = ref([
                {layer_id: 17, layer_name: '第17层', room_list: [{
                    room_id: 0,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1701'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}, {label:'欠费状态', value: '欠费10元'}]
                },{
                    room_id: 1,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1702'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 2,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1703'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 3,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1704'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 4,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1705'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 5,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1706'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 6,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1707'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 7,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1708'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                }]},
                {layer_id: 16, layer_name: '16层', room_list: [{
                    room_id: 0,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1601'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 1,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1602'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 2,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1603'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 3,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1604'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                }]},
                {layer_id: 15, layer_name: '15层', room_list: [{
                    room_id: 0,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1501'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 1,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1502'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 2,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1503'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                },{
                    room_id: 3,
                    room_status: 0,
                    room_props: [{label: '房间名', value: '1504'}, {label: '住户',value: '张三， 李四'}, {label:'面积', value: '120㎡'}, {label:'售价', value: '200万元'}]
                }]},
            ])
            
            let showSingle = ref(true)
            
            let isTrigger = ref(true)
            
            const triggerThis = ()=>{
                isTrigger.value = !isTrigger.value
            }
            
            let currentLayer = ref(-1)
            let currentUnit = ref(-1)
            let currentSingle = ref(-1)
            
            const switchLayer = (item, index) => {
                if(currentLayer.value==index){
                    console.log("重复")
                    return
                }
                currentLayer.value = index
            }
            
            const switchUnit = (item, index) => {
                if(currentUnit.value==index){
                    console.log("重复")
                    return
                } 
                currentUnit.value = index
                currentLayer.value = -1
            }
            
            const switchSingle = (item, index) => {
                if(currentSingle.value==index){
                    console.log("重复")
                    return
                }
                currentUnit.value = -1
                currentLayer.value = -1
                currentSingle.value = index
            }
            
            return{
                singleList,
                unitList,
                roomStructure,
                isTrigger,
                triggerThis,
                showSingle,
                layerList,
                currentLayer,
                currentUnit,
                currentSingle,
                switchLayer,
                switchUnit,
                switchSingle
            }
        }
    })
</script>

<style lang="less" scoped>
    .single_view{
        width: 100%;
        display: flex;
        .left_single{
            width: 160px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: column;
            
            .single_item{
                padding: 10px 0px;
                width: 90%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
                background-color: rgba(238, 238, 238, 1);
                cursor: pointer;
                color: #666666;
                font-weight: bold;
                &:nth-child(1){
                    margin-top: 60px;
                }
                &:hover{
                    background-color: rgba(64, 158, 255, 1);
                    color: #ffffff;
                }
            }
            
            .single_item_active{
                background-color: rgba(64, 158, 255, 1);
                color: #ffffff;
            }
        }
        .right_content{
            width: calc(100% - 160px);
            .top_unit{
                height: 60px;
                display: flex;
                align-items: center;
                .unit_item{
                    width: 160px;
                    padding: 10px 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    margin-left: 15px;
                    background-color: rgba(238, 238, 238, 1);
                    cursor: pointer;
                    color: #666666;
                    font-weight: bold;
                    &:nth-child(1){
                        margin-left: 0;
                    }
                    &:hover{
                        background-color: rgba(64, 158, 255, 1);
                        color: #ffffff;
                    }
                }
                .unit_item_active{
                    background-color: rgba(64, 158, 255, 1);
                    color: #ffffff;
                }
            }
            .layer_content{
                height: calc(100vh - 120px);
                display: flex;
                background-color: #ffffff;
                overflow-y: scroll;
                
                &::-webkit-scrollbar{
                    width: 0;
                }
                
                .left_room_structure{
                    width: calc(100% - 100px);
                    margin-left: 46px;
                    .layer_item{
                        width: 100%;
                        margin: 10px 0;
                        padding: 3px 0;
                        display: flex;
                        flex-wrap: wrap;
                        position: relative;
                        border-top: 1px solid #dddddd;
                        border-bottom: 1px solid #dddddd;
                        &:hover{
                            background-color: rgba(64, 158, 255, .1);
                            border-top: 2px solid black;
                            border-bottom: 2px solid black;
                            border-image: linear-gradient(to top, rgba(64, 158, 255, .1), rgba(64, 158, 255, .3)) 10;
                            padding: 1px 0;
                            .layer_left_content{
                                height: calc(100% + 4px);
                                width: 42px;
                                left: -42px;
                                top: 0;
                                background-color: rgba(64, 158, 255, .1);
                                position: absolute;
                                z-index: 99999;
                                display: block;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: #333333;
                                border-top: 2px solid black;
                                border-bottom: 2px solid black;
                                border-left: 2px solid black;
                                border-image: linear-gradient(to top, rgba(64, 158, 255, .1), rgba(64, 158, 255, .3)) 10;
                                transform: translateY(-2px);
                                cursor: pointer;
                                .layer_name_vertical{
                                    width: 20px;
                                    word-wrap: break-word;
                                }
                            }
                            .layer_right_content{
                                height: calc(100% + 4px);
                                width: 42px;
                                right: -42px;
                                top: 0;
                                background-color: rgba(64, 158, 255, .1);
                                position: absolute;
                                z-index: 99999;
                                display: block;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                border-top: 2px solid black;
                                border-bottom: 2px solid black;
                                border-right: 2px solid black;
                                border-image: linear-gradient(to top, rgba(64, 158, 255, .1), rgba(64, 158, 255, .3)) 10;
                                transform: translateY(-2px);
                                .layer_name_vertical{
                                    width: 20px;
                                    word-wrap: break-word;
                                }
                            }
                            .layer_left_txt{
                                display: none;
                            }
                            .layer_right_txt{
                                display: none;
                            }
                        }
                        .layer_left_content{
                            display: none;
                        }
                        .layer_right_content{
                            display: none;
                        }
                        .layer_left_txt{
                            height: 100%;
                            width: 42px;
                            left: -42px;
                            top: 0;
                            background-color: #ffffff;
                            position: absolute;
                            z-index: 99999;
                            display: block;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #333333;
                            cursor: pointer;
                            border-left: 1px solid #dddddd;
                            border-top: 1px solid #dddddd;
                            border-bottom: 1px solid #dddddd;
                            height: calc(100% + 2px);
                            transform: translateY(-1px);
                            .layer_name_vertical{
                                width: 20px;
                                word-wrap: break-word;
                            }
                        }
                        
                        .layer_right_txt{
                            border-right: 1px solid #dddddd;
                            border-top: 1px solid #dddddd;
                            border-bottom: 1px solid #dddddd;
                            height: 100%;
                            width: 42px;
                            right: -42px;
                            top: 0;
                            background-color: #ffffff;
                            position: absolute;
                            z-index: 99999;
                            display: block;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #333333;
                            cursor: pointer;
                            height: calc(100% + 2px);
                            transform: translateY(-1px);
                            .layer_name_vertical{
                                width: 20px;
                                word-wrap: break-word;
                            }
                        }
                        
                        .room_item{
                            width: 200px;
                            height: 107px;
                            background-color: #ffffff;
                            border: 1px solid #eeeeee;
                            margin-left: 5px;
                            margin-top: 3px;
                            margin-bottom: 3px;
                            display: flex;
                            flex-wrap: wrap;
                            padding: 5px;
                            align-content: flex-start;
                            position: relative;
                            .status_icon{
                                position: absolute;
                                top: -2px;
                                right: 20px;
                                width: 42px;
                                height: 20px;
                                background-color: rgba(245, 108, 108, .8);
                                color: #eeeeee;
                                font-size: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .room_title{
                                position: absolute;
                                top: 5px;
                                left: 5px;
                                color: #333333;
                                font-size: 12px;
                                font-weight: bold;
                            }
                            .room_edit{
                                position: absolute;
                                bottom: 5px;
                                right: 5px;
                                color: #666666;
                                font-size: 12px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                            }
                            .room_props{
                                display: inline-block;
                                width: 50%;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                font-size: 12px;
                                margin: 2px 0;
                                color: #666666;
                                transform: translateY(25px);
                            }
                        }
                    }
                }
                .right_layer_nav{
                    width: 100px;
                    background-color: #f6f6f6;
                    border-radius: 30px;
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999999;
                    box-shadow: 1px 1px 1px 1px #dddddd;
                    .trigger_content{
                        width: 100%;
                        height: 100%;
                        position: relative;
                        display: flex;
                        flex-wrap: wrap;
                        align-content: flex-start;
                        padding: 10px 0;
                        .layer_nav_desc{
                            width: 100%;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            color: #333333;
                        }
                        .layer_item{
                            width: 35px;
                            height: 35px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 10px;
                            margin-top: 5px;
                            margin-bottom: 5px;
                            border-radius: 50%;
                            background-color: #eeeeee;
                            cursor: pointer;
                            font-weight: bolder;
                            &:hover{
                                background-color: rgba(64, 158, 255, 1);
                                color: #ffffff;
                            }
                        }
                        
                        .layer_item_active{
                            background-color: #409EFF;
                            color: #ffffff;
                        }
                        
                        .trigger{
                            position: absolute;
                            bottom: 50%;
                            left: -22px;
                            height: 54px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: rgba(123, 123, 123, .5);
                            color: #ffffff;
                            width: 22px;
                            word-wrap: break-word;
                            font-size: 14px;
                            cursor: pointer;
                            text-align: center;
                            z-index: 9999999;
                            &:hover{
                                background-color: rgba(123, 123, 123, .5);
                            }
                        }
                    }
                }
            }
        }
    }
</style>