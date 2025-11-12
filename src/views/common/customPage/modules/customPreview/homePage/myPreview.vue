<template>
    <!-- 个人中心预览 -->
    <div v-if="pageInfo" class="myPage">
        <!-- 头部 -->
        <div
            class="headerWrap"
            :style="[
                { backgroundColor: styleInfo.background_color },
                { backgroundImage: styleInfo.background_image },
                { color: styleInfo.color },
            ]"
        >
            <!-- 顶部导航 -->
            <div
                class="mainHeader"
                :class="{
                    boxShadow: styleInfo.background_color == '#ffffff',
                }"
            >
                <div class="mainTitle text-center">
                    {{ pageHeaderInfo && pageHeaderInfo.page_title ? pageHeaderInfo.page_title : '' }}
                </div>
            </div>
            <!-- 用户信息 -->
            <div class="flex align-center userInfoWrap">
                <div class="avatar"></div>
                <div class="ml-10 flex flex-column">
                    <span class="nickName">{{ L('用户昵称') }}</span>
                    <span class="userDesc">{{ L('这个人比较懒还没介绍自己') }}~</span>
                </div>
            </div>
            <!-- 资产 积分 优惠券 -->
            <div class="flex justify-between">
                <div
                    class="flex-1 flex flex-column align-center justify-center userExtra"
                    v-for="(item, index) in userExtraOptions"
                    :key="index"
                >
                    <span class="value">{{ item.value }}</span>
                    <span class="label">{{ item.label }}</span>
                </div>
            </div>
            <!-- 会员卡 -->
            <div class="vipWrap" v-if="pageInfo.vip_display && pageInfo.vip_display == '1'">
                <div class="vipBg flex align-center justify-between">
                    <div class="vipInfo flex flex-column">
                        <span>{{ L('开通会员卡') }}</span>
                        <span>{{ L('开卡送会员开卡礼券') }}</span>
                    </div>
                    <div class="vipBtn">{{ L('去开卡') }}</div>
                </div>
            </div>
        </div>

        <!-- 会员储值 -->
        <div
            class="vipStoredWrap flex align-center justify-between"
            v-if="pageInfo.vip_stored_value_display && pageInfo.vip_stored_value_display == '1'"
        >
            <div class="flex align-center flex-1 no-wrap">
                <div class="flex align-center">
                    <img src="@/assets/customPage/customPageVipStoredIcon.png" alt="" />
                    <span class="vipStoredText">{{ L('会员储值') }}</span>
                </div>
                <div class="flex-1 no-wrap vipStoredSubname">
                    <span>
                        {{ pageInfo.vip_store_value_subname }}
                    </span>
                </div>
            </div>
            <div class="rightIcon">
                <a-icon type="right" />
            </div>
        </div>

        <!-- 广告位 -->
        <div
            class="adverWrap flex align-center justify-center flex-column pointer"
            v-if="!pageInfo.adver || !pageInfo.adver.length"
        >
            <span>{{ L('点击编辑广告位') }}</span>
            <span>{{ L('建议尺寸720x210') }}</span>
        </div>

        <div class="adverWrapHave" v-if="pageInfo.adver && pageInfo.adver.length">
            <a-carousel autoplay>
                <div v-for="(item, index) in pageInfo.adver" :key="index" class="adverImg">
                    <img :src="item.image_url" alt="" />
                </div>
            </a-carousel>
        </div>

        <!-- 活动中心 -->
        <div class="activityWrap" v-if="pageInfo.activity && pageInfo.activity.length">
            <div class="activityTitle">
                <span>{{ L('活动中心') }}</span>
            </div>
            <div class="activityList flex align-center flex-wrap">
                <div
                    v-for="(item, index) in pageInfo.activity"
                    :key="index"
                    class="activityItem flex flex-column align-center flex-wrap"
                >
                    <img
                        :src="item.icon_type == 1 ? getDefaultIcon(item.type) : item.icon_url"
                        alt=""
                        class="activityItemIcon"
                    />
                    <span class="activityItemName">{{ item.name }}</span>
                </div>
            </div>
        </div>

        <!-- 业务配置 -->
        <div class="businessWrap" v-if="pageInfo.business && pageInfo.business.length">
            <div
                v-for="(item, index) in pageInfo.business"
                :key="index"
                class="businessItem flex align-center justify-between"
            >
                <img
                    :src="item.icon_type == 1 ? getDefaultIcon(item.type) : item.icon_url"
                    alt=""
                    class="businessItemIcon"
                />
                <span class="businessItemName flex-1 no-wrap">{{ item.name }}</span>
                <div class="rightIcon">
                    <a-icon type="right" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userExtraOptions: [
                {
                    value: '0',
                    label: this.L('资产'),
                },
                {
                    value: '0',
                    label: this.L('积分'),
                },
                {
                    value: '0',
                    label: this.L('优惠券'),
                },
            ],
        }
    },
    computed: {
        styleInfo() {
            let pageInfo = this.pageInfo
            let background_color = '#ffffff',
                background_image
            if (pageInfo.head_style == 1) {
                background_color = pageInfo.head_style_value || ''
            } else {
                background_color = pageInfo.head_style_value || ''
                background_image = pageInfo.head_style_img ? `url(${pageInfo.head_style_img})` : ''
            }
            let obj = {
                background_color,
                background_image,
                color: pageInfo.font_color == 1 ? '#000000' : '#ffffff',
            }
            return obj
        },
        pageInfo() {
            let info = this.$store.state.customPage.pageInfo
                ? JSON.parse(JSON.stringify(this.$store.state.customPage.pageInfo))
                : ''
            if (info.activity) {
                info.activity = info.activity.length ? info.activity.filter((item) => item.checked == true) : []
            }
            if (info.business) {
                info.business = info.business.length ? info.business.filter((item) => item.checked == true) : []
            }
            return info
        },
        pageHeaderInfo() {
            return this.$store.state.customPage.pageHeaderInfo
        },
    },
    methods: {
        // 获取默认图标
        getDefaultIcon(icon) {
            return require(`@/assets/customPage/${icon}Icon.png`)
        },
    },
}
</script>

<style scoped>
.myPage {
    width: 100%;
    min-height: 667px;
    background: #f9f9f9;
    box-shadow: 0px 0px 12px 4px rgba(231, 231, 231, 0.42);
    box-sizing: border-box;
}
/* 头部配置 */
.mainHeader {
    position: relative;
    width: 100%;
    height: 64px;
    box-sizing: border-box;
    background: transparent url(~@/assets/customPage/customPreviewHeaderBg.png) no-repeat top left;
}
.boxShadow {
    box-shadow: 0px 1px 0px 0px #f7f7f7;
}
.mainTitle {
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    font-weight: bold;
    color: #000000;
}
.headerWrap {
    position: relative;
    width: 100%;
    min-height: 262px;
    overflow: hidden;
    background-color: transparent;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
.userInfoWrap {
    margin-top: 40px;
    padding: 0 26px;
    width: 100%;
    font-weight: 400;
}
.avatar {
    width: 62px;
    height: 62px;
    background: #e6e6e6 url(~@/assets/customPage/customAvatarBg.png) no-repeat center center;
    border: 1px solid #f2f2f2;
    border-radius: 50%;
    box-sizing: border-box;
}
.nickName,
.userExtra .value {
    font-size: 20px;
}
.userDesc {
    font-size: 14px;
}
.userExtra {
    margin-top: 28px;
}
.userExtra .label {
    margin-bottom: 26px;
    font-size: 14px;
}
.vipWrap {
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
}
.vipBg {
    padding: 0 15px 0 20px;
    width: 335px;
    height: 52px;
    background: url(~@/assets/customPage/customPageVipBg.png) no-repeat left top;
    box-sizing: border-box;
}
.vipInfo span:first-child {
    font-size: 14px;
    font-weight: bold;
    color: #3d3a43;
}
.vipInfo span:last-child {
    font-size: 12px;
    font-weight: 400;
    color: #686153;
}
.vipBtn {
    width: 72px;
    height: 22px;
    line-height: 22px;
    background: #ffa93a;
    border-radius: 11px;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
}

/* 会员储值 */
.vipStoredWrap {
    padding: 0 10px 0 20px;
    margin: 10px;
    height: 63px;
    background: #ffffff;
    border-radius: 10px;
    box-sizing: border-box;
}
.vipStoredText {
    margin: 4px 24px 0 5px;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
}
.vipStoredSubname {
    margin-top: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
}
.rightIcon {
    margin-left: 5px;
    color: #999999;
    font-size: 10px;
}

/* 广告位 */
.adverWrap {
    margin: 16px 10px 10px;
    height: 136px;
    background: #ecf1f7;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #b0b8c1;
    line-height: 22px;
    box-sizing: border-box;
}
.adverWrapHave {
    margin: 16px 10px 10px;
    height: 105px;
    border-radius: 10px;
    box-sizing: border-box;
}
.adverImg {
    width: 100%;
    height: 105px;
    line-height: 105px;
    text-align: center;
    overflow: hidden;
    border-radius: 10px;
    box-sizing: border-box;
}
.adverImg img {
    width: 100%;
    height: 105px;
}

/* 活动中心 */
.activityWrap {
    padding: 13px 0;
    margin: 10px;
    background: #ffffff;
    border-radius: 10px;
}
.activityTitle {
    padding: 0 13px;
    font-size: 14px;
    font-weight: bold;
    color: #222222;
    display: flex;
}
.activityTitle span {
    padding: 7px 0 13px;
    width: 100%;
    border-bottom: 1px solid #ededed;
    box-sizing: border-box;
}
.activityList {
    padding: 14px 0;
}
.activityItem {
    padding: 13px 4px 0;
    width: 25%;
    box-sizing: border-box;
    overflow: hidden;
}
.activityItemIcon {
    width: 25px;
    height: 25px;
}
.activityItemName {
    margin-top: 10px;
    max-width: 100%;
    font-size: 13px;
    font-weight: 500;
    color: #222222;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 业务配置 */
.businessWrap {
    margin: 10px;
    padding: 0 10px;
    background: #ffffff;
    border-radius: 10px;
}
.businessItem {
    padding: 20px 0 20px 17px;
    border-bottom: 1px solid rgba(241, 241, 241, 1);
    font-size: 14px;
    font-weight: bold;
    color: #222222;
}
.businessItem:last-child {
    border-bottom: none;
}
.businessItemIcon {
    margin-right: 10px;
    width: 20px;
    height: 20px;
}
.businessItemName {
    margin-right: 10px;
}
.businessWrap .rightIcon {
    color: #222222;
    font-size: 12px;
}
</style>