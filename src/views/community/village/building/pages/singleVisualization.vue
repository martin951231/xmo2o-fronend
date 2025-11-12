<template>
    <div class="single_view">
        <pageLoading v-if="dataLoading" />
        <div class="left_single" v-if="showSingle">
            <div class="single_title">
                {{$store.getters.config.house_name}}导航
            </div>
            <div class="single_scroll_view">
                <div class="single_item" :class="index == currentSingle? 'single_item_active':''"
                    @click.stop="switchSingle(item, index)" v-for="(item, index) in singleList" :key="index">
                    {{item.single_name}}</div>
            </div>
        </div>
        <div class="right_content"
            :style="{width: showSingle? 'calc(100% - 160px)': 'calc(100% - 10px)', marginLeft: showSingle? '0px': '10px'}">
            <div v-if="have_filter_data && have_filter_data.is_filter==1" style="margin: 20px 10px 10px;">
                <label style="margin-top: 5px;">房屋类型：</label>
                <a-select show-search placeholder="请选择" style="width: 200px"  v-model="house_type">
                    <a-select-option v-for="(item,index) in have_filter_data.room_type_list" :value="item.key">
                        {{item.value}}
                    </a-select-option>
                </a-select>
                
                <label style="margin-top: 5px;margin-left:30px;">出售状态：</label>
                <a-select show-search placeholder="请选择" style="width: 200px"  v-model="sell_status">
                    <a-select-option v-for="(item,index) in have_filter_data.sell_status_list" :value="item.key">
                        {{item.value}}
                    </a-select-option>
                </a-select>
                <a-button type="primary" @click="queryThisUnit" style="margin-top: 5px;margin-left:20px;">查询</a-button>
            </div>
            <div class="top_unit" v-if="unitList.length>0">
                <div class="unit_item" :class="unit_index == currentUnit? 'unit_item_active':''"
                    @click.stop="switchUnit(unit_item, unit_index)" v-for="(unit_item, unit_index) in unitList"
                    :key="unit_index">
                    <a-popover placement="top">
                        <template slot="content" v-if="unit_item.allowEdit || unit_item.allowDelete">
                            <span @click.stop="editUnit(unit_item)" v-if="unit_item.allowEdit" style="cursor: pointer;color: #409EFF;" >
                                编辑{{$store.getters.config.floor_name}}<a-icon type="edit" />
                            </span>
                            <a-divider v-if="unit_item.allowDelete" type="vertical" />
                            <span @click.stop="deleteUnit(unit_item)" v-if="unit_item.allowDelete" style="cursor: pointer;color: red;">
                                删除{{$store.getters.config.floor_name}}<a-icon type="delete" />
                            </span>
                        </template>
                        <template slot="content" v-else>
                            当前{{$store.getters.config.floor_name}}不可编辑
                        </template>
                        <div class="unit_name">{{unit_item.floor_name}}</div>
                    </a-popover>
                </div>
            </div>
            <div class="layer_content"
                :style="{height: unitList.length>0?'calc(100vh - 120px)':'calc(100vh - 80px)', marginTop:unitList.length>0?'0px':'10px' }">
                <div class="left_room_structure" style="position: relative;" v-if="hasData">
                    <div class="layer_item" v-for="(layer_item, layer_index) in roomStructure" :key="layer_index" :class="'layer_nav_'+layer_index">
                        <a-popover placement="top">
                            <template slot="content" v-if="layer_item.allowEdit || layer_item.allowDelete">
                                <span @click.stop="editLayer(layer_item)" style="cursor: pointer;color: #409EFF;" v-if="layer_item.allowEdit">
                                    编辑楼层<a-icon type="edit" />
                                </span>
                                <a-divider v-if="layer_item.allowDelete" type="vertical"/>
                                <span style="cursor: pointer;color: red;" @click.stop="deleteLayer(layer_item)"  v-if="layer_item.allowDelete">
                                    删除楼层<a-icon type="delete" />
                                </span>
                            </template>
                            <template slot="content" v-else>
                                当前楼层不可编辑
                            </template>
                            <div class="layer_left_content">
                                <div class="layer_name_vertical">
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                            {{layer_item.layer_name}}
                                        </template>
                                        {{layer_item.layer_name.length>5?layer_item.layer_name.substring(0, 5)+'...': layer_item.layer_name}}
                                    </a-tooltip>
                                </div>
                            </div>
                        </a-popover>
                        <div class="layer_left_txt">
                            <div class="layer_name_vertical">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        {{layer_item.layer_name}}
                                    </template>
                                    {{layer_item.layer_name.length>5?layer_item.layer_name.substring(0, 5)+'...': layer_item.layer_name}}
                                </a-tooltip>
                            </div>
                        </div>
                        <div class="room_item" v-for="(room_item, room_index) in layer_item.rooms" :key="room_index" @click="getRoominfo(room_item)" style="cursor: pointer">
                            <div class="status_icon" v-if="room_item.money&&room_item.money.tag">{{room_item.money.tag}} </div>
                            <div class="room_title">
                               {{room_item.room?room_item.room+'室':'暂无'}}
                            </div>
                            <div class="room_props" v-for="(props, props_index) in room_item.roomProps"
                                :key="props_index">
                                <a-tooltip placement="rightTop">
                                    <template slot="title">
                                        {{props.label}}:{{props.value}}
                                    </template>
                                    <span
                                        :style="{color:(props.color ? props.color:'')}">{{props.label}}:{{props.value}}</span>
                                </a-tooltip>
                            </div>
                            
                            <div v-if="room_item.lease_tips && room_item.lease_tips.value" class="room_props" style="width: 96%;">
                               <span
                                    :style="{color:(room_item.lease_tips.color ? room_item.lease_tips.color:'')}">{{room_item.lease_tips.label}}:{{room_item.lease_tips.value}}</span>
                            </div>
                            
                        </div>
                        <div class="room_item" v-if="layer_item.rooms.length <= 0">
                            <p>该楼层暂无添加{{$store.getters.config.room_name}}</p>
                        </div>
                        <div class="layer_right_txt">
                            <div class="layer_name_vertical">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        {{layer_item.layer_name}}
                                    </template>
                                    {{layer_item.layer_name.length>5?layer_item.layer_name.substring(0, 5)+'...': layer_item.layer_name}}
                                </a-tooltip>
                            </div>
                        </div>
                        <a-popover placement="leftTop">
                            <template slot="content" v-if="layer_item.allowEdit || layer_item.allowDelete">
                                <span @click.stop="editLayer(layer_item)" style="cursor: pointer;color: #409EFF;" v-if="layer_item.allowEdit" >
                                    编辑楼层<a-icon type="edit" />
                                </span>
                                <a-divider v-if="layer_item.allowDelete" type="vertical"/>
                                <span style="cursor: pointer;color: red;" @click.stop="deleteLayer(layer_item)" v-if="layer_item.allowDelete">
                                    删除楼层<a-icon type="delete" />
                                </span>
                            </template>
                            <template slot="content" v-else>
                                当前楼层不可编辑
                            </template>
                            <div class="layer_right_content">
                                <div class="layer_name_vertical">
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                            {{layer_item.layer_name}}
                                        </template>
                                        {{layer_item.layer_name.length>5?layer_item.layer_name.substring(0, 5)+'...': layer_item.layer_name}}
                                    </a-tooltip>
                                </div>
                            </div>
                        </a-popover>
                    </div>
                </div>

                <div :style="{transform: showSingle?'translateX(-75px) translateY(-30px)':''}" class="no_data"
                    style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;" v-if="!hasData && !dataLoading">
                    <span style="font-size: 20px;color: #8a8a8a;transform: translateY(-90px);">暂无数据</span>
                </div>
                
                <div :style="{transform: showSingle?'translateX(-75px) translateY(-30px)':''}" class="no_data"
                    style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;" v-if="dataLoading">
                    <span style="z-index: 99999999999; font-size: 20px;color: #ffffff;transform: translateY(-90px); display:flex; align-items:center; justify-content:center; flex-direction:column;">
                        <a-icon style="font-size: 27px;color: #ffffff;" type="loading" />
                        <div style="margin-top: 10px;">加载中...</div>
                    </span>
                </div>

                <div class="right_layer_nav" :style="{width:isTrigger?'100px':'0'}"
                    v-if="layerList.length>0 && hasData">
                    <div class="trigger_content">
                        <div class="trigger_icon" @click="triggerThis">
                            {{isTrigger?'折叠':'展开'}}
                        </div>
                        <div class="layer_nav_desc" v-if="isTrigger">
                            楼层导航
                        </div>
                        <div :class="index == currentLayer? 'layer_item_active':''"
                            @click.stop="switchLayer(item, index)" :style="{display:isTrigger?'flex':'none'}"
                            class="layer_item" v-for="(item, index) in layerList" :key="index">
                            {{ item.layer_name.length > 3 ? item.layer_name.substring(0,2) : item.layer_name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <unitEdit :visible="unitEditVisible" :floor_id="floor_id" @exit="closeUnitDrawer" />
        <layerEdit :visible="layerEditVisible" :layer_id="layer_id" @exit="closeLayerDrawer" />
        <roomInfo :visible="roomVisible" :title="roomDrawerTitle" :roomId="roomId" @closeRoom="onRoomClose" />
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import pageLoading from "../components/pageLoading.vue"
    import unitEdit from "../components/unitEdit.vue"
    import layerEdit from "../components/layerEdit.vue"
    import roomInfo from "../components/roomInfo.vue"
	import store from '@/store';
    export default defineComponent({
        props: {
            singleId: {
                type: [String, Number],
                default: 0
            }
        },
        components: {
            pageLoading,
            unitEdit,
            layerEdit,
            roomInfo
        },
        setup(props, context) {
            let showSingle = ref(false)
            let unitList = ref([])
            let singleList = ref([])
            let currentLayer = ref(0)
            let currentUnit = ref(0)
            let current_floor_id= ref(0)
            let currentSingle = ref(0)
            let dataLoading = ref(false)
            let hasData = ref(false)
            let pageSingleId = ref(0)
            let have_filter_data= ref({})
            let house_type=ref(0);
            let sell_status=ref(0);
            onMounted(()=>{
                if(!pageSingleId.value){
                    showSingle.value = true
                    getBuildingList()
                }
            })
            // 获取楼栋
            const getBuildingList = () => {
                Vue.prototype.request(villageNew.buildingList, {}).then((res) => {
                    singleList.value = res.building
                    if (singleList.value && singleList.value[0]) {
                        currentSingle.value = 0
                        pageSingleId.value = singleList.value[0].id
                        getUnitFloor(singleList.value[0].id)
                    }
                }).catch(e => {

                })
            }
            // 切换单元
            const switchUnit = (item, index) => {
                /*
                if (currentUnit.value == index) {
                    console.log("重复")
                    return
                }
                */
                currentUnit.value = index
                currentLayer.value = 0
                floorLayerRooms(item);
            }
            // 获取单元
            const getUnitFloor = (single_id) => {
                let unitParam = {}
                if (single_id) {
                    unitParam['single_id'] = single_id;
                } else if (props.singleId) {
                    unitParam['single_id'] = props.singleId;
                }
                Vue.prototype.request(villageNew.buildingUnitFloor, unitParam).then((res) => {
                    if (res.unit) {
                        unitList.value = res.unit
                        if(res.have_filter_data){
                            have_filter_data.value=res.have_filter_data
                        }
                        if (unitList.value[0]) {
                            currentUnit.value = 0
                            floorLayerRooms(unitList.value[0])
                        } else {
                            hasData.value = false
                            Vue.prototype.$message.warn('该'+store.getters.config.single_name+'下没有'+store.getters.config.floor_name)
                        }
                    }
                }).catch(e => {})
            }
            let layerList = ref([])
            let roomStructure = ref([])
            // 获取房屋楼层
            const floorLayerRooms = (item) => {
                let floorParam = {}
                if (item.floor_id) {
                    floorParam['floor_id'] = item.floor_id;
                    current_floor_id.value=item.floor_id;
                }else if(current_floor_id.value){
                    floorParam['floor_id'] =  current_floor_id.value;
                }
                floorParam.house_type=house_type.value;
                floorParam.sell_status=sell_status.value;
                dataLoading.value = true
                hasData.value = false
                Vue.prototype.request(villageNew.buildingFloorLayerRooms, floorParam).then((res) => {
                    console.log('floorParam', res)
                    if (res.layer) {
                        dataLoading.value = false
                        layerList.value = res.layer
                        layerList.value.reverse()
                        roomStructure.value = res.layer
                        if (roomStructure.value && roomStructure.value.length > 0) {
                            hasData.value = true
                        } else {
                            hasData.value = false
                        }
                    }
                }).catch(e => {
                    dataLoading.value = false
                    hasData.value = false
                })
            }
            
            const queryThisUnit = () => {
               floorLayerRooms({floor_id:current_floor_id.value})
            }
            
            if (props.singleId) {
                showSingle.value = false
                pageSingleId.value = props.singleId
                getUnitFloor()
            }

            watch(() => props.singleId, (val) => {
                if (val) {
                    showSingle.value = false
                    pageSingleId.value = val
                    getUnitFloor(val)
                } else {
                    clearData()
                }
            }, {
                deep: true
            })
            
            let isTrigger = ref(true)

            const triggerThis = () => {
                isTrigger.value = !isTrigger.value
            }

            const switchLayer = (item, index) => {
                if (currentLayer.value == index) {
                    console.log("重复")
                    return
                }
                currentLayer.value = index
                document.querySelector('.layer_nav_'+index).scrollIntoView({block: "start", behavior: "smooth"});
            }

            const switchSingle = (item, index) => {
                if (currentSingle.value == index) {
                    console.log("重复")
                    return
                }
                currentUnit.value = 0
                currentLayer.value = 0
                currentSingle.value = index
                pageSingleId.value = item.id
                getUnitFloor(item.id)
            }
            
            //单元操作
            let unitEditVisible = ref(false)
            let floor_id = ref(0)
            const editUnit = (item) => {
                floor_id.value = item.floor_id
                unitEditVisible.value = true
            }
            
            const closeUnitDrawer = (flag)=>{
                unitEditVisible.value = false
                if(flag == 'unit'){
                    getUnitFloor(pageSingleId.value)
                }
            }

            const deleteUnit = (item) => {
                let {
                    floor_id
                } = item
                Vue.prototype.$confirm({
                    title: '提示',
                    content: '确定要删除当前'+store.getters.config.floor_name+'吗？',
                    onOk() {
                        Vue.prototype.request('/community/village_api.Building/deleteFloor', {floor_id: item.floor_id}).then((res) => {
                            Vue.prototype.$message.success('删除成功！')
                            getUnitFloor(pageSingleId.value)
                        }).catch(e=>{
                        })
                    },
                    onCancel() {}
                });
            }
            
            //楼层操作
            let layerEditVisible = ref(false)
            let layer_id = ref(0)
            const editLayer = (item) => {
                layer_id.value = item.id
                layerEditVisible.value = true
            }
            
            const closeLayerDrawer = (flag)=>{
                layerEditVisible.value = false
                if(flag == 'layer'){
                    floorLayerRooms(unitList.value[currentUnit.value])
                }
            }
            
            const deleteLayer = (item) => {
                let {
                    layer_id
                } = item
                Vue.prototype.$confirm({
                    title: '提示',
                    content: '确定要删除当前楼层吗？',
                    onOk() {
                        Vue.prototype.request('/community/village_api.Building/deleteLayer', {layer_id: item.id}).then((res) => {
                            Vue.prototype.$message.success('删除成功！')
                            floorLayerRooms(unitList.value[currentUnit.value])
                        }).catch(e=>{
                        })
                    },
                    onCancel() {}
                });
            }

            //房间操作
            let roomVisible = ref(false)
            let roomDrawerTitle = ref(store.getters.config.room_name+'信息')
            let roomId = ref('')
            const getRoominfo = (item) => {
                roomVisible.value = true
                roomDrawerTitle.value = item.room + ' 号'+store.getters.config.room_name+'信息'
                roomId.value = item.pigcms_id
            }
            
            const onRoomClose = () => {
                roomVisible.value = false
            }
               
            const clearData = () => {
                singleList.value = []
                unitList.value = []
                layerList.value = []
                roomStructure.value = []
                currentUnit.value = 0
                currentLayer.value = 0
                currentSingle.value = 0
                dataLoading.value = false
                pageSingleId.value = 0
            }

            return {
                pageSingleId,
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
                switchSingle,
                getBuildingList,
                floorLayerRooms,
                getUnitFloor, 
                clearData,
                dataLoading,
                hasData,
                //单元
                unitEditVisible,
                floor_id,
                editUnit,
                closeUnitDrawer,
                deleteUnit,
                //楼层
                layerEditVisible,
                layer_id,
                editLayer,
                closeLayerDrawer,
                deleteLayer,
                //房间
                getRoominfo,
                roomVisible,
                onRoomClose,
                roomDrawerTitle,
                roomId,
                have_filter_data,
                house_type,
                sell_status,
                current_floor_id,
                queryThisUnit,
            }
        }
    })
</script>

<style lang="less" scoped>
    .single_view {
        width: 100%;
        background-color: #ffffff;
        display: flex;

        .left_single {
            width: 160px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: column;

            .single_title{
                width: 90%;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666666;
                font-weight: bold;
                font-size: 14px;
            }
            
            .single_scroll_view{
                width: 100%;
                height: calc(100vh - 120px);
                overflow-y: scroll;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-direction: column;
                &::-webkit-scrollbar {
                    width: 0;
                }
                .single_item {
                    padding: 17px 0px;
                    width: 90%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 5px;
                    background-color: rgba(238, 238, 238, 1);
                    cursor: pointer;
                    color: #666666;
                    font-weight: bold;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    &:nth-child(1) {
                        margin-top: 0px;
                    }
                
                    &:hover {
                        background-color: rgba(64, 158, 255, 1);
                        color: #ffffff;
                    }
                }
                
                .single_item_active {
                    background-color: rgba(64, 158, 255, 1);
                    color: #ffffff;
                }
            }
        }

        .right_content {
            width: calc(100% - 160px);
            
            .top_unit::-webkit-scrollbar {
                width: 14px;
                height: 14px;
            }
             
            .top_unit::-webkit-scrollbar-track,
            .top_unit::-webkit-scrollbar-thumb {
                border-radius: 0;
                border: 5px solid transparent;
            }
             
            // .top_unit::-webkit-scrollbar-track {
            //     box-shadow: 1px 1px 5px rgba(0,0,0,0.01) inset;
            // }
             
            .top_unit::-webkit-scrollbar-thumb {
                min-height: 20px;
                background-clip: content-box;
                box-shadow: 0 0 0 5px rgba(0,0,0,.1) inset;
            }
             
            .top_unit::-webkit-scrollbar-corner {
                background: transparent;
            }

            .top_unit {
                height: 60px;
                display: flex;
                align-items: flex-end;
                width: calc(100% - 10px);
                overflow-x: scroll;
                .unit_item {
                    padding: 5px 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 3px;
                    background-color: rgba(238, 238, 238, 1);
                    cursor: pointer;
                    color: #666666;
                    font-weight: bold;
                    flex-shrink: 0;
                    .unit_name {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    &:nth-child(1) {
                        margin-left: 5px;
                    }

                    &:hover {
                        background-color: rgba(64, 158, 255, 1);
                        color: #ffffff;
                    }
                }

                .unit_item_active {
                    background-color: rgba(64, 158, 255, 1);
                    color: #ffffff;
                }
            }

            .layer_content {
                height: calc(100vh - 120px);
                display: flex;
                background-color: #ffffff;
                overflow-y: scroll;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .left_room_structure {
                    margin-left: 46px;
                    width: calc(100% - 100px);

                    .layer_item {
                        width: 100%;
                        min-height: 120px;
                        margin: 10px 0;
                        padding: 3px 0;
                        display: flex;
                        flex-wrap: wrap;
                        position: relative;
                        border-top: 1px solid #dddddd;
                        border-bottom: 1px solid #dddddd;

                        &:nth-child(1) {
                            margin-top: 0;
                        }

                        &:hover {
                            background-color: #99CCFF;
                            border-top: 2px solid black;
                            border-bottom: 2px solid black;
                            border-image: linear-gradient(to top,rgba(64, 158, 255, .3), rgba(64, 158, 255, .1), rgba(64, 158, 255, .3)) 10;
                            padding: 1px 0;

                            .layer_left_content {
                                height: calc(100% + 4px);
                                width: 42px;
                                left: -42px;
                                top: 0;
                                background-color: rgba(64, 158, 255, .1);
                                position: absolute;
                                z-index: 9;
                                display: block;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: #333333;
                                border-top: 2px solid black;
                                border-bottom: 2px solid black;
                                border-left: 2px solid black;
                                border-image: linear-gradient(to top,rgba(64, 158, 255, .3), rgba(64, 158, 255, .1), rgba(64, 158, 255, .3)) 10;
                                transform: translateY(-2px);
                                cursor: pointer;

                                .layer_name_vertical {
                                    width: 20px;
                                    font-weight: bold;
                                    word-wrap: break-word;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    text-align: center;
                                }
                            }

                            .layer_right_content {
                                height: calc(100% + 4px);
                                width: 42px;
                                right: -42px;
                                top: 0;
                                background-color: rgba(64, 158, 255, .1);
                                position: absolute;
                                z-index: 9;
                                display: block;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                border-top: 2px solid black;
                                border-bottom: 2px solid black;
                                border-right: 2px solid black;
                                border-image: linear-gradient(to top,rgba(64, 158, 255, .3), rgba(64, 158, 255, .1), rgba(64, 158, 255, .3)) 10;
                                transform: translateY(-2px);

                                .layer_name_vertical {
                                    width: 20px;
                                    font-weight: bold;
                                    word-wrap: break-word;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    text-align: center;
                                }
                            }

                            .layer_left_txt {
                                display: none;
                            }

                            .layer_right_txt {
                                display: none;
                            }
                        }

                        .layer_left_content {
                            display: none;
                        }

                        .layer_right_content {
                            display: none;
                        }

                        .layer_left_txt {
                            height: 100%;
                            width: 42px;
                            left: -42px;
                            top: 0;
                            background-color: #ffffff;
                            position: absolute;
                            z-index: 9;
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

                            .layer_name_vertical {
                                width: 20px;
                                word-wrap: break-word;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                text-align: center;
                            }
                        }

                        .layer_right_txt {
                            border-right: 1px solid #dddddd;
                            border-top: 1px solid #dddddd;
                            border-bottom: 1px solid #dddddd;
                            height: 100%;
                            width: 42px;
                            right: -42px;
                            top: 0;
                            background-color: #ffffff;
                            position: absolute;
                            z-index: 9;
                            display: block;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #333333;
                            cursor: pointer;
                            height: calc(100% + 2px);
                            transform: translateY(-1px);

                            .layer_name_vertical {
                                width: 20px;
                                word-wrap: break-word;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                text-align: center;
                            }
                        }

                        .room_item {
                            width: 220px;
                            height: 132px;
                            background-color: #ffffff;
                            border: 1px solid #dddddd;
                            margin-left: 5px;
                            margin-top: 3px;
                            margin-bottom: 3px;
                            display: flex;
                            flex-wrap: wrap;
                            padding: 5px;
                            align-content: flex-start;
                            position: relative;

                            &:hover {
                                background-color: #409eff;
                                color: #ffffff;
                                .room_title ,.room_props {
                                    color: #ffffff;
                                }
                            }
                            
                            .status_icon {
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

                            .room_title {
                                position: absolute;
                                top: 5px;
                                left: 5px;
                                color: #333333;
                                font-size: 12px;
                                font-weight: bold;
                                width: 75%;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }

                            .room_edit {
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

                            .room_props {
                                display: inline-block;
                                width: 50%;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                font-size: 12px;
                                margin: 1px 0;
                                color: #666666;
                                transform: translateY(25px);
                            }
                        }
                    }
                }

                .right_layer_nav {
                    width: 100px;
                    background-color: #CCCCCC;
                    border-radius: 30px;
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9;
                    box-shadow: 1px 1px 1px 1px #dddddd;
                    .trigger_content {
                        width: 100%;
                        // height: 100%;
                        min-height: 100px;
                        position: relative;
                        display: flex;
                        flex-wrap: wrap;
                        align-content: flex-start;
                        padding: 10px 0;

                        .layer_nav_desc {
                            width: 100%;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            color: #333333;
                        }

                        .layer_item {
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
                            border: 1px solid #dddddd;

                            &:hover {
                                background-color: rgba(64, 158, 255, 1);
                                color: #ffffff;
                            }
                        }

                        .layer_item_active {
                            background-color: #409eff;
                            color: #ffffff;
                        }

                        // /deep/ .layout.ant-layout .trigger{
                        //     line-height: 30px;
                        //     padding: 0px;
                        // }

                        .trigger_icon {
                            position: absolute;
                            top: 24%;
                            left: -22px;
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
                            z-index: 9;
                            line-height: 30px;

                            &:hover {
                                background-color: rgba(123, 123, 123, .7);
                            }
                        }
                    }
                }
            }
        }
    }
</style>
