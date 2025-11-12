const packageStreetCommunityComponents = {
  // 动态引入的页面组件 功能套餐管理
  'streetCommunityPartyBranchList': () => import('@/views/community/streetCommunity/partyAffairsManagement/partyBranchList'),
  'streetCommunitythreeMeetings': () => import('@/views/community/streetCommunity/partyAffairsManagement/threeMeetings'),
  'streetCommunitypartyMembersManagement': () => import('@/views/community/streetCommunity/partyAffairsManagement/partyMembersManagement'),
  'streetComunityList': () => import('@/views/community/streetCommunity/contentTable/comunityList'),
  'streetComunityHouseList': () => import('@/views/community/streetCommunity/contentTable/comunityHouseList'),
}
export default packageStreetCommunityComponents