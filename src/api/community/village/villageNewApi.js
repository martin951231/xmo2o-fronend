const villageSetApi = {
    /**
     * 新版改动 （v20/public/platform_dev/src/api/community/village/index.js）作为拆分
     */
    //----------------小区设置-------------------------------
    villageInfo : '/community/village_api.VillageConfig/getVillageInfo' ,//基础信息-小区信息
    baseConfig  : '/community/village_api.VillageConfig/baseConfig' ,//基础信息-小区信息

    //----------------人车房管理-------------------------------
    buildingIndex   : '/community/village_api.Building/index', //楼栋管理列表
    roomIndex       : '/community/village_api.Room/index', //房间管理列表
    ownerIndex      : '/community/village_api.Owner/index',//业主管理列表
    ownerReview     : '/community/village_api.Owner/review',//业主申请列表
    ownerUnbid      : '/community/village_api.Owner/unbind', //业主解绑
    familyIndex     : '/community/village_api.FamilyMember/index',//家属列表
    enantIndex      : '/community/village_api.Enant/index', //租客列表
    
    // 楼栋管理
    buildingList: '/community/village_api.Building/index',
    deleteBuilding: '/community/village_api.Building/deleteBuilding',
    buildingInfo: '/community/village_api.Building/buildingInfo',
    updateBuildingStatus: '/community/village_api.Building/updateBuildingStatus',
    saveBuildingButler: '/community/village_api.Building/saveBuildingButler',
    getBuildingButler: 'community/village_api.Building/getBuildingButler',
    updateBuildingInfoByID: 'community/village_api.Building/updateBuildingInfoByID',
    buildingUnitFloor: 'community/village_api.Building/unitFloor',
    buildingFloorLayerRooms: 'community/village_api.Building/floorLayerRooms',
    
    // 公租房楼栋管理
    unitRentalList: '/community/village_api.UnitRental/index',
    deleteUnitRental: '/community/village_api.UnitRental/deleteUnitRental',
    unitRentalInfo: '/community/village_api.UnitRental/unitRentalInfo',
    updateUnitRentalStatus: '/community/village_api.UnitRental/updateUnitRentalStatus',
    saveUnitRentalButler: '/community/village_api.UnitRental/saveUnitRentalButler',
    getUnitRentalButler: 'community/village_api.UnitRental/getUnitRentalButler',
    updateUnitRentalInfoByID: 'community/village_api.UnitRental/updateUnitRentalInfoByID',
    unitRentalFloorList: 'community/village_api.UnitRental/unitRentalFloorList',
    updateUnitRentalFloorStatus: 'community/village_api.UnitRental/updateUnitRentalFloorStatus',
    deleteUnitRentalFloor: 'community/village_api.UnitRental/deleteUnitRentalFloor',
    unitRentalFloorInfo: 'community/village_api.UnitRental/unitRentalFloorInfo',
    saveUnitRentalFloorInfo: 'community/village_api.UnitRental/saveUnitRentalFloorInfo',
    unitRentalLayerList: 'community/village_api.UnitRental/unitRentalLayerList',
    unitRentalLayerInfo: 'community/village_api.UnitRental/unitRentalLayerInfo',
    saveUnitRentalLayerInfo: 'community/village_api.UnitRental/saveUnitRentalLayerInfo',
    updateUnitRentalLayerStatus: 'community/village_api.UnitRental/updateUnitRentalLayerStatus',
    deleteUnitRentalLayer:'community/village_api.UnitRental/deleteUnitRentalLayer',
    // 三方同步接口
    thirdVillageUploadFile :'community/village_api.third.Room/villageUploadFile',
    thirdStartRoomImport   :'community/village_api.third.Room/startRoomImport',
    thirdStartUserImport   :'community/village_api.third.Room/startUserImport',
    thirdStartChargeImport :'community/village_api.third.Room/startChargeImport',
    thirdRefreshProcess    :'community/village_api.third.Room/refreshProcess',
    getHikInfoCommunityRegionsHouses:'community/village_api.Building/getHikInfoCommunityRegionsHouses',
    //业主、家属、租客管理
    ownerList:'/community/village_api.People.Owner/index', //业主列表
    
    // 楼栋管家图片预览
    servicesImgPreview:'/community/village_api.WorkWeiXin/servicesImgPreview', //获取楼栋管家预览图
    
}

export default villageSetApi;