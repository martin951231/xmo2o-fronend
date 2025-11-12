import { switchLang as L } from '../../utils/util.js'
let requestDomain = location.protocol + '//' + location.host
const customPage = {
    // 样式类型 is_show对应组件id
    styleTypeOptions: [
        {
            value: '1',
            label: '大图模式',
            icon: 'iconCustomPageStyleType1',
            is_show: [
                'coupon',
                'marketingActivities',
                'mallLimited',
                'mallBargain',
                'mallGroup',
                'mallPeriod',
                'mallGoods',
                'shopGoods',
                'imgAdver',
                'appointGoods',
            ],
        },
        {
            value: '2',
            label: '一行两个',
            icon: 'iconCustomPageStyleType2',
            is_show: [
                'coupon',
                'marketingActivities',
                'mallLimited',
                'mallBargain',
                'mallGroup',
                'mallPeriod',
                'mallGoods',
                'shopGoods',
                'imgAdver',
                'appointGoods',
            ],
        },
        {
            value: '3',
            label: '一行三个',
            icon: 'iconCustomPageStyleType3',
            is_show: ['coupon', 'marketingActivities'],
        },
        {
            value: '4',
            label: '详情列表',
            icon: 'iconCustomPageStyleType4',
            is_show: [
                'mallLimited',
                'mallBargain',
                'mallGroup',
                'mallPeriod',
                'mallGoods',
                'shopGoods',
                'appointGoods',
            ],
        },
        {
            value: '5',
            label: '横向滑动',
            icon: 'iconCustomPageStyleType5',
            is_show: ['mallLimited', 'mallBargain', 'mallGroup', 'mallGoods', 'shopGoods', 'appointGoods'],
        },
        {
            value: '6',
            label: '轮播',
            icon: 'iconCustomPageStyleType6',
            is_show: ['imgAdver'],
        },
        {
            value: '7',
            label: '样式一',
            icon: 'iconCustomPageStyleType7',
            is_show: ['storeHeader'],
        },
        {
            value: '8',
            label: '样式二',
            icon: 'iconCustomPageStyleType8',
            is_show: ['storeHeader'],
        },
    ],
    state: {
        // 上传图片url
        uploadAction: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
        // 微页面装修地址
        platformCustomPage: '/common/platform.custom/customPage',
        merchantCustomPage: '/common/merchant.custom/customPage',
        storeCustomPage: '/common/merchant.custom/customPage',
        refreshCustomPageList: false,
        // true 更新微页面列表
        // 组件id
        componentId: '',
        // 页面信息 formData
        pageInfo: '',
        // 来源 source platform => 平台 merchant => 商家 store => 店铺 source_id
        sourceInfo: '',
        // 默认图
        defaultImg: require('@/assets/customPage/defaultImg.png'),
        // 微页面预览当前选中custom数组的index
        customIndex: -1,
        // 页面头部信息
        pageHeaderInfo: '',
        // 页面类型 homePage 主页装修 customPage 微页面装修 catCustomPage 分类页装修
        pageType: 'homePage',
        // 样式类型
        styleTypeOptions: [],
        /* 
            组件列表信息 
            图片上传，图片地址字段名定义要拼上'_image'，如背景图bg_image
            视频上传，视频地址字段名命名需要拼上'_video'
            rules 校验规则
            type == requiredArray 校验数组不能为空 requiredArrayEle 校验数组里的字段必填 require 校验字段必填
        */
        componentsList: [
            {
                id: 'basicComponent',
                label: '基础组件',
                show: false,
                list: [
                    {
                        type: 'titleText',
                        icon: 'iconCustomPageTitleText',
                        label: '标题文本',
                        content: {
                            title_txt: '', // 输入的标题内容
                            desc_txt: '',
                            // 输入的描述内容
                            // 文本显示位置 left-居左显示 center-居中显示
                            text_align: 'left',
                            // 标题文字大小 large-16号 middle-14号 small-12号
                            title_font_size: '16',
                            // 描述字体大小 large-16号 middle-14号 small-12号
                            desc_font_size: '12',
                            // 标题字体粗细 normal-常规体 bold-加粗体
                            title_font_weight: 'bold',
                            // 描述字体粗细 normal-常规体 bold-加粗体
                            desc_font_weight: 'normal',
                            // 标题颜色
                            title_color: '#323233',
                            // 描述文本颜色
                            desc_color: '#969799',
                            // 背景 1 = 背景色 2 = 背景图片
                            bg_color_style: '1',
                            // 标题文本背景颜色 默认空=transparent
                            bg_color: '',
                            bg_image: '',
                            // 背景透明度
                            bg_color_opacity: 1,
                            // 是否显示底部分割线 1 显示 0 不显示
                            show_bottom_line: 0,
                        },
                        rules: [
                            {
                                name: 'title_txt',
                                type: 'callBack',
                                errmsg: '标题和描述不能同时为空',
                                callBack: 'titleTextValidate',
                            },
                            {
                                name: 'desc_txt',
                                type: 'callBack',
                                errmsg: '标题和描述不能同时为空',
                                callBack: 'titleTextValidate',
                            },
                        ],
                    },
                    {
                        type: 'richText',
                        icon: 'iconCustomPageRichText',
                        label: '富文本',
                        content: {
                            // 富文本背景 1 = 背景色 2 = 背景图片
                            bg_color_style: '1',
                            // 富文本背景颜色
                            bg_color: '#ffffff',
                            bg_image: '',
                            // 背景透明度
                            bg_color_opacity: 1,
                            show_full_screen: 'unfull',
                        },
                    },
                    {
                        type: 'textNav',
                        icon: 'iconCustomPageTextNav',
                        label: '文本导航',
                        content: {
                            // 背景颜色
                            bg_color: '#ffffff',
                            // 文字颜色
                            font_color: '#000000',
                            // 导航列表
                            list: [
                                {
                                    name: '',
                                    link_url: '',
                                },
                            ],
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加文本导航',
                            },
                            {
                                name: 'name',
                                type: 'requiredArrayEle',
                                errmsg: '导航标题不能为空',
                            },
                        ],
                    },
                    {
                        type: 'helpLine',
                        icon: 'iconCustomPageHelpLine',
                        label: '辅助线',
                        content: {
                            // 辅助线样式 solid 实线 dashed 虚线
                            aux_line_style: 'solid',
                            // 辅助线左右边距 noMargin 左右边距0  hasMargin 左右边距30px
                            left_right_margin: 'noMargin',
                            // 辅助线颜色
                            aux_line_color: '#e5e5e5',
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            // 辅助空白高度 范围10px-100px
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'imgAdver',
                        icon: 'iconCustomPageImgAdver',
                        label: '图片广告',
                        content: {
                            // 1 大图模式 2 一行两个 6 轮播图
                            style_type: '1',
                            // 图片列表
                            list: [
                                {
                                    name: '',
                                    link_url: '',
                                    pic: '',
                                },
                            ],
                            // 商品倒角 1 直角 2 圆角
                            pic_radius: '1',
                            // 页面间距 0 30px
                            page_distance: 0,
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加广告',
                            },
                            {
                                name: 'pic',
                                type: 'requiredArrayEle',
                                errmsg: '请添加广告图片',
                            },
                        ],
                    },
                    {
                        type: 'picNav',
                        icon: 'iconCustomPageNav',
                        label: '图文导航',
                        content: {
                            //  1 = 背景色 2 = 背景图片 3 =无背景
                            bg_color_style: '1',
                            // 背景图
                            bg_image: '',
                            // 背景透明度
                            bg_color_opacity: 1,
                            // 背景颜色
                            bg_color: '#ffffff',
                            // 文字颜色
                            font_color: '#000000',
                            // 导航列表
                            list: [
                                {
                                    name: '导航一',
                                    link_url: '',
                                    nav_icon: '',
                                },
                                {
                                    name: '导航二',
                                    link_url: '',
                                    nav_icon: '',
                                },
                                {
                                    name: '导航三',
                                    link_url: '',
                                    nav_icon: '',
                                },
                                {
                                    name: '导航四',
                                    link_url: '',
                                    nav_icon: '',
                                },
                            ],
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加图文导航',
                            },
                            {
                                name: 'nav_icon',
                                type: 'requiredArrayEle',
                                errmsg: '请添加导航图片',
                            },
                        ],
                    },
                    {
                        type: 'customVideo',
                        icon: 'iconCustomPageVideo',
                        label: '视频',
                        content: {
                            // 1 选择视频 2 粘贴视频地址
                            video_type_val: '1',
                            // 1 原视频封面图  2 自定义封面图
                            surface_type_val: '1',
                            choose_video_list: '', // 选取的视频信息
                            choose_surface_list: '', // 视频封面信息
                            paste_video_url: '', // 粘贴的视频地址
                        },
                    },
                    {
                        type: 'customModule',
                        icon: 'iconCustomPageCustomModule',
                        label: '自定义模块',
                        content: {},
                        rules: [
                            {
                                name: 'id',
                                type: 'required',
                                errmsg: '请选择一个自定义页面模块',
                            },
                        ],
                        showList: ['platform', 'merchant', 'store'],
                    },
                    {
                        type: 'onlineService',
                        icon: 'iconCustomPageOnlineService',
                        label: '在线客服',
                        content: {
                            // 在线客服初始文案
                            txt: '在线咨询',
                        },
                        rules: [
                            {
                                name: 'txt',
                                type: 'required',
                                errmsg: '文案不能为空',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'marketingComponent',
                label: '营销组件',
                show: false,
                list: [
                    {
                        type: 'magicSquare',
                        icon: 'iconCustomPageMagicSquare',
                        label: '魔方',
                        content: {
                            // 图片间距
                            img_distance: 0,
                            // 页面间距
                            page_distance: 0,
                            // 魔方密度 2 => 2*2 4 => 4*4 5 => 5*5 6 => 6*6 7 => 7*7
                            density: '2',
                            // 魔方选中的层
                            list: [],
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请选择魔方',
                            },
                            {
                                name: 'image',
                                type: 'requiredArrayEle',
                                errmsg: '请上传魔方图片',
                            },
                        ],
                    },
                    {
                        type: 'enterStore',
                        icon: 'iconCustomPageEnterStore',
                        label: '进入店铺',
                        // 店铺独有
                        showList: ['store'],
                        content: {
                            // 文本内容
                            txt: '进入店铺',
                        },
                    },
                    {
                        type: 'coupon',
                        icon: 'iconCustomPageCoupon',
                        label: '优惠券',
                        content: {
                            // 1 大图模式 2 一行两个 3 一行三个
                            style_type: '1',
                            // 背景颜色 默认红色
                            bg_color: '#e74c2c',
                            // 字体颜色
                            font_color: '#ffffff',
                            // 优惠券面值字体颜色
                            discount_font_color: '#ffffff',
                            // 优惠券虚线颜色
                            dashed_color: '#ffffff',
                            // 失效或已领优惠券显隐 1显示 2 隐藏
                            is_show: 1,
                            // 列表
                            list: [],
                            // 优惠券模块的背景色 1 = 自定义背景色 2 = 背景图
                            bg_color_style_module: '1',
                            bg_color_module: '#ffffff',
                            bg_image_module: '',
                            bg_color_opacity_module: 1,
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加优惠券',
                            },
                        ],
                    },
                    {
                        type: 'marketingActivities',
                        icon: 'iconCustomPageMarketingActivities',
                        label: '营销活动',
                        content: {
                            // 活动标题
                            title: '营销活动',
                            // 1 大图模式 2 一行两个 3 一行三个
                            style_type: '1',
                            // 过期活动显隐 1显示 2 隐藏
                            is_show: 1,
                            // 活动类型 秒杀 = limited 砍价 = bargain 拼团 = group
                            hd_type: '',
                            // 列表
                            list: [],
                        },
                        rules: [
                            {
                                name: 'title',
                                type: 'required',
                                errmsg: '请输入营销活动标题',
                            },
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加营销活动商品',
                            },
                        ],
                        showList: ['platform', 'merchant', 'store'],
                    },
                ],
            },
            {
                id: 'mallComponent',
                label: '商城组件',
                show: false,
                list: [
                    {
                        type: 'mallLimited',
                        icon: 'iconCustomPageMallLimited',
                        label: '秒杀',
                        content: {
                            // 活动标题
                            title: '限时秒杀',
                            // 1 大图模式 2 一行两个 4 详情列表 5 横向滑动
                            style_type: '1',
                            // 售罄商品活动显隐 1显示 2 隐藏
                            is_showSellOut: 1,
                            // 结束活动显隐 1显示 2 隐藏
                            is_showActivityEnd: 1,
                            // 购买按钮样式 1 方形线框 2 方形实心 3 圆角线框 4 圆角实心
                            buyBtn_style: '1',
                            // 购买按钮名称
                            buyBtn_name: '去抢购',
                            // 显示字段 value值最好与接口文档已有字段名保持一致
                            show_filed: [
                                {
                                    value: 'count_down',
                                    label: '抢购倒计时',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'act_stock_num',
                                    label: '剩余库存',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'goods_name',
                                    label: '商品名称',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'orgin_price',
                                    label: '商品原价',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'act_price',
                                    label: '秒杀价',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'reduce_money',
                                    label: '优惠金额',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            // 活动类型 秒杀 = limited 砍价=bargain 拼团=group 周期购 =periodic
                            hd_type: 'limited',
                            hd_type_txt: '秒杀',
                            // 列表
                            list: [],
                        },
                        rules: [
                            {
                                name: 'title',
                                type: 'required',
                                errmsg: '请输入秒杀活动标题',
                            },
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加秒杀活动商品',
                            },
                            {
                                name: 'buyBtn_name',
                                type: 'required',
                                errmsg: '请输入购买按钮名称',
                            },
                        ],
                    },
                    {
                        type: 'mallBargain',
                        icon: 'iconCustomPageMallBargain',
                        label: '砍价',
                        content: {
                            // 活动标题
                            title: '人气砍价',
                            // 1 大图模式 2 一行两个 4 详情列表 5 横向滑动
                            style_type: '1',
                            // 售罄商品活动显隐 1显示 2 隐藏
                            is_showSellOut: 1,
                            // 结束活动显隐 1显示 2 隐藏
                            is_showActivityEnd: 1,
                            // 购买按钮样式 1 方形线框 2 方形实心 3 圆角线框 4 圆角实心
                            buyBtn_style: '1',
                            // 购买按钮名称
                            buyBtn_name: '立即开砍',
                            // 显示字段 value值最好与接口文档已有字段名保持一致
                            show_filed: [
                                {
                                    value: 'count_down',
                                    label: '抢购倒计时',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'bar_num',
                                    label: '已砍人数',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'goods_name',
                                    label: '商品名称',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'act_price',
                                    label: '最低价',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'orgin_price',
                                    label: '商品原价',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'tag',
                                    label: '砍价拿',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            // 活动类型 秒杀 = limited 砍价=bargain 拼团=group 周期购 =periodic
                            hd_type: 'bargain',
                            hd_type_txt: '砍价',
                            // 列表
                            list: [],
                        },
                        rules: [
                            {
                                name: 'title',
                                type: 'required',
                                errmsg: '请输入砍价活动标题',
                            },
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加砍价活动商品',
                            },
                            {
                                name: 'buyBtn_name',
                                type: 'required',
                                errmsg: '请输入购买按钮名称',
                            },
                        ],
                    },
                    {
                        type: 'mallGroup',
                        icon: 'iconCustomPageMallGroup',
                        label: '拼团',
                        content: {
                            // 活动标题
                            title: '超值拼团',
                            // 1 大图模式 2 一行两个 4 详情列表 5 横向滑动
                            style_type: '1',
                            // 售罄商品活动显隐 1显示 2 隐藏
                            is_showSellOut: 1,
                            // 结束活动显隐 1显示 2 隐藏
                            is_showActivityEnd: 1,
                            // 购买按钮样式 1 方形线框 2 方形实心 3 圆角线框 4 圆角实心
                            buyBtn_style: '1',
                            // 购买按钮名称
                            buyBtn_name: '去开团',
                            // 显示字段 value值最好与接口文档已有字段名保持一致
                            show_filed: [
                                {
                                    value: 'count_down',
                                    label: '抢购倒计时',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'nums',
                                    label: '已团人数',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'goods_name',
                                    label: '商品名称',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'act_price',
                                    label: '拼团价',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'orgin_price',
                                    label: '单买价',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'team_num',
                                    label: '几人团',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            // 活动类型 秒杀 = limited 砍价=bargain 拼团=group 周期购 =periodic
                            hd_type: 'group',
                            hd_type_txt: '拼团',
                            // 列表
                            list: [],
                        },
                        rules: [
                            {
                                name: 'title',
                                type: 'required',
                                errmsg: '请输入拼团活动标题',
                            },
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加拼团活动商品',
                            },
                            {
                                name: 'buyBtn_name',
                                type: 'required',
                                errmsg: '请输入购买按钮名称',
                            },
                        ],
                    },
                    {
                        type: 'mallPeriod',
                        icon: 'iconCustomPageMallPeriod',
                        label: '周期购',
                        content: {
                            // 活动标题
                            title: '周期购',
                            // 1 大图模式 2 一行两个 4 详情列表 5 横向滑动
                            style_type: '1',
                            // 售罄商品活动显隐 1显示 2 隐藏
                            is_showSellOut: 1,
                            // 结束活动显隐 1显示 2 隐藏
                            is_showActivityEnd: 1,
                            // 购买按钮样式 1 方形线框 2 方形实心 3 圆角线框 4 圆角实心
                            buyBtn_style: '1',
                            // 购买按钮名称
                            buyBtn_name: '去购买',
                            // 显示字段 value值最好与接口文档已有字段名保持一致
                            show_filed: [
                                {
                                    value: 'goods_name',
                                    label: '商品名称',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            // 活动类型 秒杀 = limited 砍价=bargain 拼团=group 周期购 =periodic
                            hd_type: 'periodic',
                            hd_type_txt: '周期购',
                            // 列表
                            list: [],
                        },
                        rules: [
                            {
                                name: 'title',
                                type: 'required',
                                errmsg: '请输入周期购活动标题',
                            },
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加周期购活动商品',
                            },
                            {
                                name: 'buyBtn_name',
                                type: 'required',
                                errmsg: '请输入购买按钮名称',
                            },
                        ],
                    },
                    {
                        type: 'mallGoodsSearch',
                        icon: 'iconCustomPageSearch',
                        label: '商品搜索',
                        content: {
                            // 框体样式 1 圆角 2 方角
                            style_type: '1',
                            // 文本位置 left 左 center 中
                            text_align: 'left',
                            // 高度
                            height_value: 28,
                            // 背景色
                            bg_color: '#ffffff',
                            // 内容背景色
                            content_bg_color: '#f9f9f9',
                            // 字体颜色
                            font_color: '#A7A7A7',
                        },
                    },
                    {
                        type: 'mallGoods',
                        icon: 'iconCustomPageGoods',
                        label: '商品',
                        content: {
                            // 类型 1 商品 2 商品分组
                            goods_type: '1',
                            // 添加商品商品类型1 商品 2 商品分组
                            goods_type_val: '1',
                            // 商品分组样式 1 顶部菜单 2侧边菜单
                            goods_classify_type: '1',
                            // 是否展示全部分组 1 显示 2不显示
                            show_allClassify: '2',
                            // 商品分组菜单样式 三种样式
                            goods_classify_style: '1',
                            // 1 大图模式 2 一行两个 4 详情列表 5 横向滑动
                            style_type: '1',
                            // 商品样式 1 无边白底 2 卡片投影 3 描边白底
                            goods_style: '1',
                            // 商品倒角 1 圆角 2方角
                            goods_radius: '1',
                            // 文本样式 normal 常规体 bold 加粗体
                            font_weight: 'normal',
                            // 文本对齐 left 左对齐 center 居中对齐
                            text_align: 'left',
                            // 页面间距
                            page_distance: 15,
                            // 商品间距
                            goods_distance: 8,
                            // 显示字段 value值最好与接口文档已有字段名保持一致
                            show_filed: [
                                {
                                    value: 'goods_name',
                                    label: '商品名称',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'goods_desc',
                                    label: '商品描述',
                                    is_checked: true,
                                    is_show: false,
                                },
                                {
                                    value: 'price',
                                    label: '商品价格',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'old_price',
                                    label: '商品原价',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'goods_badge',
                                    label: '商品角标',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            // 购买按钮样式 四种样式
                            buyBtn_style: '1',
                            // 商品角标样式 五种样式
                            goodsBadge_style: '1',
                            // 商品角标自定义样式 上传图片
                            goodsBadge_style_val: '',
                            list: [],
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加商城商品',
                            },
                            {
                                name: 'goodsBadge_style_val',
                                type: 'callBack',
                                errmsg: '请上传商品角标图片',
                                callBack: 'goodsBadgeStyleValValidate',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'shopComponent',
                label: '外卖组件',
                show: false,
                list: [
                    {
                        type: 'shopModules',
                        icon: 'iconcanyin',
                        label: '外卖模块',
                        content: {
                            // 商家详情显隐 1 显示 2 隐藏
                            show_merDetail: '1',
                            // 公告
                            notice: '',
                            // show_num 分组显示商品数量 -1 不限
                            list: [],
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加外卖模块商品分组',
                            },
                        ],
                    },
                    {
                        type: 'shopGoodsSearch',
                        icon: 'iconCustomPageShopGoodsSearch',
                        label: '商品搜索',
                        content: {
                            // 框体样式 1 圆角 2 方角
                            style_type: '1',
                            // 文本位置 left 左 center 中
                            text_align: 'left',
                            // 高度
                            height_value: 28,
                            // 背景色
                            bg_color: '#ffffff',
                            // 内容背景色
                            content_bg_color: '#f9f9f9',
                            // 字体颜色
                            font_color: '#A7A7A7',
                        },
                    },
                    {
                        type: 'shopGoods',
                        icon: 'iconCustomPageShopGoods',
                        label: '商品',
                        content: {
                            // 类型 1 商品 2 商品分组
                            goods_type: '1',
                            // 添加商品商品类型1 商品 2 商品分组
                            goods_type_val: '1',
                            // 商品分组样式 1 顶部菜单 2侧边菜单
                            goods_classify_type: '1',
                            // 是否展示全部分组 1 显示 2不显示
                            show_allClassify: '1',
                            // 商品分组菜单样式 三种样式
                            goods_classify_style: '1',
                            // 1 大图模式 2 一行两个 4 详情列表 5 横向滑动
                            style_type: '1',
                            // 商品样式 1 无边白底 2 卡片投影 3 描边白底
                            goods_style: '1',
                            // 商品倒角 1 圆角 2方角
                            goods_radius: '1',
                            // 文本样式 normal 常规体 bold 加粗体
                            font_weight: 'normal',
                            // 文本对齐 left 左对齐 center 居中对齐
                            text_align: 'left',
                            // 页面间距
                            page_distance: 15,
                            // 商品间距
                            goods_distance: 8,
                            // 显示字段 value值最好与接口文档已有字段名保持一致
                            show_filed: [
                                {
                                    value: 'goods_name',
                                    label: '商品名称',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'goods_desc',
                                    label: '商品描述',
                                    is_checked: true,
                                    is_show: false,
                                },
                                {
                                    value: 'price',
                                    label: '商品价格',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'old_price',
                                    label: '商品原价',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'goods_badge',
                                    label: '商品角标',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            // 购买按钮样式 四种样式
                            buyBtn_style: '1',
                            // 商品角标样式 五种样式
                            goodsBadge_style: '1',
                            // 商品角标自定义样式 上传图片
                            goodsBadge_style_val: '',
                            list: [],
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加外卖商品',
                            },
                            {
                                name: 'goodsBadge_style_val',
                                type: 'callBack',
                                errmsg: '请上传商品角标图片',
                                callBack: 'goodsBadgeStyleValValidate',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'otherComponent',
                label: '其他组件',
                show: false,
                list: [
                    {
                        type: 'notice',
                        icon: 'iconCustomPageNotice',
                        label: '公告',
                        content: {
                            // 背景颜色
                            bg_color: '#FFF3DB',
                            // 文字颜色
                            font_color: '#666666',
                        },
                        rules: [
                            {
                                name: 'noticeTxt',
                                type: 'required',
                                errmsg: '请填写公告内容',
                            },
                        ],
                    },
                    {
                        type: 'contactStore',
                        icon: 'iconCustomPageContactStore',
                        label: '联系店铺',
                        showList: ['store'],
                        content: {
                            // 是否显示拨号按钮 1 显示 2 不显示
                            show_phone_icon: 1,
                            // 是否显示店铺地址按钮 1 显示 2 不显示
                            show_address_icon: 1,
                        },
                    },
                    {
                        type: 'storeMap',
                        icon: 'iconCustomPageMap',
                        label: '地图',
                        content: {},
                    },
                    {
                        type: 'storeHeader',
                        icon: 'iconCustomPageStoreHeader',
                        label: '店铺头部',
                        // 店铺独有
                        showList: ['store'],
                        content: {
                            // 店铺头部背景色
                            bg_color: '#06c1ae',
                            // 7 样式一  8 样式二
                            style_type: '7',
                            bg_img: '',
                        },
                    },
                ],
            },
            {
                id: 'appointComponent',
                label: '预约组件',
                show: false,
                list: [
                    {
                        type: 'appointGoodsSearch',
                        icon: 'iconCustomPageSearch',
                        label: '商品搜索',
                        content: {
                            // 框体样式 1 圆角 2 方角
                            style_type: '1',
                            // 文本位置 left 左 center 中
                            text_align: 'left',
                            // 高度
                            height_value: 28,
                            // 背景色
                            bg_color: '#ffffff',
                            // 背景透明度 0 - 1
                            bg_color_opacity: 1,
                            // 内容背景色
                            content_bg_color: '#f9f9f9',
                            // 字体颜色
                            font_color: '#A7A7A7',
                        },
                    },
                    {
                        type: 'appointGoods',
                        icon: 'iconCustomPageGoods',
                        label: '商品',
                        content: {
                            // 类型 1 商品 2 商品分组
                            goods_type: '1',
                            // 添加商品商品类型1 商品 2 商品分组
                            goods_type_val: '1',
                            // 标题组标题
                            title: '',
                            // 标题组颜色
                            title_color: '#333333',
                            // 用户筛选方式 只有一个的时候页面不用展示
                            goods_sort_style: [],
                            // 商品分组样式 1 顶部菜单 2侧边菜单
                            goods_classify_type: '1',
                            // 是否展示全部分组 1 显示 2不显示
                            show_allClassify: '2',
                            // 商品分组菜单样式 三种样式
                            goods_classify_style: '1',
                            // 1 大图模式 2 一行两个 4 详情列表 5 横向滑动
                            style_type: '1',
                            // 商品样式 1 无边白底 2 卡片投影 3 描边白底
                            goods_style: '1',
                            // 商品倒角 1 圆角 2方角
                            goods_radius: '1',
                            // 文本样式 normal 常规体 bold 加粗体
                            font_weight: 'normal',
                            // 页面间距
                            page_distance: 2,
                            // 商品间距
                            goods_distance: 8,
                            // 显示字段 value值最好与接口文档已有字段名保持一致
                            show_filed: [
                                {
                                    value: 'price',
                                    label: '商品价格',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            // 购买按钮样式 三种样式
                            buyBtn_style: '1',
                            // 购买按钮颜色
                            buyBtn_bg_color: '#FF4E46',
                            list: [],
                        },
                        rules: [
                            {
                                name: 'list',
                                type: 'requiredArray',
                                errmsg: '请添加商品',
                            },
                        ],
                    },
                ],
            },
        ],
        pageMainColor: '#ffffff', // 页面主题色
        subCustomIndex: -1, // 自由区块内组件下标
        activeKey: '1', // 1主页装修 2微页面列表 tab切换
        pageScroll: false, // 页面视图是否需要更新滚动距离
        bgColorStyleOptions: [
            {
                label: '自定义背景色',
                value: '1',
            },
            {
                label: '自定义图片',
                value: '2',
            },
        ],
        appointCustomTemplate: {
            1: {
                id: '',
                source: 'appoint_activity',
                source_id: '',
                page_title: '家政服务',
                title_color: '#000000',
                bg_color_style: '2',
                bg_color: '#f6f6f6',
                bg_image: [requestDomain + '/static/wxapp/custompage/page_bg_image_1.png'],
                bg_color_default: '#f6f6f6',
                bg_color_nav_style: '1',
                bg_color_nav: '#ffffff',
                bg_color_nav_default: '#ffffff',
                bg_image_nav: '',
                bg_color_nav_opacity: 0,
                nav_bottom_display: 0,
                share_title: '',
                share_desc: '',
                share_image_wechat: '',
                share_image_h5: '',
                custom: [
                    {
                        type: 'appointGoodsSearch',
                        icon: 'iconCustomPageSearch',
                        label: '商品搜索',
                        content: {
                            style_type: '1',
                            text_align: 'left',
                            height_value: 28,
                            bg_color: '#ffffff',
                            bg_color_opacity: 0,
                            content_bg_color: '#f9f9f9',
                            font_color: '#A7A7A7',
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'picNav',
                        icon: 'iconCustomPageNav',
                        label: '图文导航',
                        content: {
                            bg_color_style: '3',
                            bg_image: '',
                            bg_color_opacity: 1,
                            bg_color: '#ffffff',
                            font_color: '#000000',
                            list: [
                                {
                                    name: '全屋保洁',
                                    link_url: '',
                                    nav_icon: requestDomain + '/static/wxapp/custompage/pic_nav_image_1.png',
                                },
                                {
                                    name: '保洁清洗',
                                    link_url: '',
                                    nav_icon: requestDomain + '/static/wxapp/custompage/pic_nav_image_2.png',
                                },
                                {
                                    name: '家电维修',
                                    link_url: '',
                                    nav_icon: requestDomain + '/static/wxapp/custompage/pic_nav_image_3.png',
                                },
                                {
                                    name: '消毒杀菌',
                                    link_url: '',
                                    nav_icon: requestDomain + '/static/wxapp/custompage/pic_nav_image_4.png',
                                },
                                {
                                    name: '家电清洗',
                                    link_url: '',
                                    nav_icon: requestDomain + '/static/wxapp/custompage/pic_nav_image_5.png',
                                },
                            ],
                        },
                    },
                    {
                        type: 'imgAdver',
                        icon: 'iconCustomPageImgAdver',
                        label: '图片广告',
                        content: {
                            style_type: '1',
                            list: [
                                {
                                    name: '',
                                    link_url: '',
                                    pic: requestDomain + '/static/wxapp/custompage/img_adver_image_1.png',
                                },
                            ],
                            pic_radius: '2',
                            page_distance: 12,
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'magicSquare',
                        icon: 'iconCustomPageMagicSquare',
                        label: '魔方',
                        content: {
                            img_distance: 8,
                            page_distance: 6,
                            density: '6',
                            list: [
                                {
                                    start: {
                                        x: 1,
                                        y: 1,
                                    },
                                    end: {
                                        x: 2,
                                        y: 2,
                                    },
                                    dataCoord: ['11', '12', '21', '22'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_1.png',
                                },
                                {
                                    start: {
                                        x: 1,
                                        y: 3,
                                    },
                                    end: {
                                        x: 2,
                                        y: 4,
                                    },
                                    dataCoord: ['13', '14', '23', '24'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_2.png',
                                },
                                {
                                    start: {
                                        x: 1,
                                        y: 5,
                                    },
                                    end: {
                                        x: 2,
                                        y: 6,
                                    },
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_3.png',
                                },
                            ],
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'appointGoods',
                        icon: 'iconCustomPageGoods',
                        label: '商品',
                        content: {
                            goods_type: '1',
                            goods_type_val: '1',
                            title: '热门推荐',
                            title_color: '#333333',
                            goods_sort_style: ['create_time', 'views', 'price', 'goods_comment'],
                            goods_classify_type: '1',
                            show_allClassify: '2',
                            goods_classify_style: '1',
                            style_type: '4',
                            goods_style: '1',
                            goods_radius: '1',
                            font_weight: 'bold',
                            page_distance: 4,
                            goods_distance: 8,
                            show_filed: [
                                {
                                    value: 'price',
                                    label: '商品价格',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            buyBtn_style: '1',
                            buyBtn_bg_color: '#48c294',
                            list: [],
                        },
                    },
                ],
            },
            2: {
                id: '',
                source: 'appoint_activity',
                source_id: '',
                page_title: '按摩足疗馆',
                title_color: '#ffffff',
                bg_color_style: '2',
                bg_color: '#f6f6f6',
                bg_image: [requestDomain + '/static/wxapp/custompage/page_bg_image_2.png'],
                bg_color_default: '#f6f6f6',
                bg_color_nav_style: '1',
                bg_color_nav: '#ffffff',
                bg_color_nav_default: '#ffffff',
                bg_image_nav: '',
                bg_color_nav_opacity: 0,
                nav_bottom_display: 0,
                share_title: '',
                share_desc: '',
                share_image_wechat: '',
                share_image_h5: '',
                custom: [
                    {
                        type: 'appointGoodsSearch',
                        icon: 'iconCustomPageSearch',
                        label: '商品搜索',
                        content: {
                            style_type: '1',
                            text_align: 'left',
                            height_value: 28,
                            bg_color: '#ffffff',
                            bg_color_opacity: 0,
                            content_bg_color: '#f9f9f9',
                            font_color: '#A7A7A7',
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'imgAdver',
                        icon: 'iconCustomPageImgAdver',
                        label: '图片广告',
                        content: {
                            style_type: '1',
                            list: [
                                {
                                    name: '',
                                    link_url: '',
                                    pic: requestDomain + '/static/wxapp/custompage/img_adver_image_2.png',
                                },
                            ],
                            pic_radius: '2',
                            page_distance: 12,
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'magicSquare',
                        icon: 'iconCustomPageMagicSquare',
                        label: '魔方',
                        content: {
                            img_distance: 2,
                            page_distance: 6,
                            density: '9',
                            list: [
                                {
                                    start: {
                                        x: 1,
                                        y: 1,
                                    },
                                    end: {
                                        x: 1,
                                        y: 3,
                                    },
                                    dataCoord: ['11', '12', '13'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_4.png',
                                },
                                {
                                    start: {
                                        x: 1,
                                        y: 4,
                                    },
                                    end: {
                                        x: 1,
                                        y: 5,
                                    },
                                    dataCoord: ['14', '15'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_5.png',
                                },
                                {
                                    start: {
                                        x: 1,
                                        y: 6,
                                    },
                                    end: {
                                        x: 1,
                                        y: 7,
                                    },
                                    dataCoord: ['16', '17'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_6.png',
                                },
                                {
                                    start: {
                                        x: 1,
                                        y: 8,
                                    },
                                    end: {
                                        x: 1,
                                        y: 9,
                                    },
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_7.png',
                                    dataCoord: ['18', '19'],
                                },
                                {
                                    start: {
                                        x: 2,
                                        y: 1,
                                    },
                                    end: {
                                        x: 2,
                                        y: 3,
                                    },
                                    dataCoord: ['21', '22', '23'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_8.png',
                                },
                                {
                                    start: {
                                        x: 2,
                                        y: 4,
                                    },
                                    end: {
                                        x: 2,
                                        y: 5,
                                    },
                                    dataCoord: ['24', '25'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_9.png',
                                },
                                {
                                    start: {
                                        x: 2,
                                        y: 6,
                                    },
                                    end: {
                                        x: 2,
                                        y: 7,
                                    },
                                    dataCoord: ['26', '27'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_10.png',
                                },
                                {
                                    start: {
                                        x: 2,
                                        y: 8,
                                    },
                                    end: {
                                        x: 2,
                                        y: 9,
                                    },
                                    dataCoord: ['28', '29'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_11.png',
                                },
                                {
                                    start: {
                                        x: 3,
                                        y: 1,
                                    },
                                    end: {
                                        x: 3,
                                        y: 3,
                                    },
                                    dataCoord: ['31', '32', '33'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_12.png',
                                },
                                {
                                    start: {
                                        x: 3,
                                        y: 4,
                                    },
                                    end: {
                                        x: 3,
                                        y: 5,
                                    },
                                    dataCoord: ['34', '35'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_13.png',
                                },
                                {
                                    start: {
                                        x: 3,
                                        y: 6,
                                    },
                                    end: {
                                        x: 3,
                                        y: 7,
                                    },
                                    dataCoord: ['36', '37'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_14.png',
                                },
                                {
                                    start: {
                                        x: 3,
                                        y: 8,
                                    },
                                    end: {
                                        x: 3,
                                        y: 9,
                                    },
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_15.png',
                                },
                            ],
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'appointGoods',
                        icon: 'iconCustomPageGoods',
                        label: '商品',
                        content: {
                            goods_type: '1',
                            goods_type_val: '1',
                            title: '热门推荐',
                            title_color: '#333333',
                            goods_sort_style: ['create_time', 'views', 'price', 'goods_comment'],
                            goods_classify_type: '1',
                            show_allClassify: '2',
                            goods_classify_style: '1',
                            style_type: '2',
                            goods_style: '1',
                            goods_radius: '1',
                            font_weight: 'bold',
                            page_distance: 2,
                            goods_distance: 5,
                            show_filed: [
                                {
                                    value: 'price',
                                    label: '商品价格',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            buyBtn_style: '1',
                            buyBtn_bg_color: '#fe6e48',
                            list: [],
                        },
                    },
                ],
            },
            3: {
                id: '',
                source: 'appoint_activity',
                source_id: '',
                page_title: '婚纱摄影',
                title_color: '#ffffff',
                bg_color_style: '1',
                bg_color: '#121212',
                bg_image: [],
                bg_color_default: '#f6f6f6',
                bg_color_nav_style: '1',
                bg_color_nav: '#ffffff',
                bg_color_nav_default: '#ffffff',
                bg_image_nav: '',
                bg_color_nav_opacity: 0,
                nav_bottom_display: 0,
                share_title: '',
                share_desc: '',
                share_image_wechat: '',
                share_image_h5: '',
                custom: [
                    {
                        type: 'appointGoodsSearch',
                        icon: 'iconCustomPageSearch',
                        label: '商品搜索',
                        content: {
                            style_type: '1',
                            text_align: 'left',
                            height_value: 28,
                            bg_color: '#ffffff',
                            bg_color_opacity: 0,
                            content_bg_color: '#DEDDDB',
                            font_color: '#6D6D6D',
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'imgAdver',
                        icon: 'iconCustomPageImgAdver',
                        label: '图片广告',
                        content: {
                            style_type: '1',
                            list: [
                                {
                                    name: '',
                                    link_url: '',
                                    pic: requestDomain + '/static/wxapp/custompage/img_adver_image_3.png',
                                },
                            ],
                            pic_radius: '2',
                            page_distance: 12,
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'magicSquare',
                        icon: 'iconCustomPageMagicSquare',
                        label: '魔方',
                        content: {
                            img_distance: 22,
                            page_distance: 12,
                            density: '4',
                            list: [
                                {
                                    start: {
                                        x: 1,
                                        y: 1,
                                    },
                                    end: {
                                        x: 2,
                                        y: 1,
                                    },
                                    dataCoord: ['12', '22'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_16.png',
                                },
                                {
                                    start: {
                                        x: 1,
                                        y: 2,
                                    },
                                    end: {
                                        x: 2,
                                        y: 2,
                                    },
                                    dataCoord: ['13', '23'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_17.png',
                                },
                                {
                                    start: {
                                        x: 1,
                                        y: 3,
                                    },
                                    end: {
                                        x: 2,
                                        y: 3,
                                    },
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_18.png',
                                    dataCoord: ['14', '24'],
                                },
                                {
                                    start: {
                                        x: 1,
                                        y: 4,
                                    },
                                    end: {
                                        x: 2,
                                        y: 4,
                                    },
                                    dataCoord: ['15', '25'],
                                    image: requestDomain + '/static/wxapp/custompage/magic_square_image_19.png',
                                },
                            ],
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'imgAdver',
                        icon: 'iconCustomPageImgAdver',
                        label: '图片广告',
                        content: {
                            style_type: '1',
                            list: [
                                {
                                    name: '',
                                    link_url: '',
                                    pic: requestDomain + '/static/wxapp/custompage/img_adver_image_4.png',
                                },
                            ],
                            pic_radius: '2',
                            page_distance: 12,
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'imgAdver',
                        icon: 'iconCustomPageImgAdver',
                        label: '图片广告',
                        content: {
                            style_type: '1',
                            list: [
                                {
                                    name: '',
                                    link_url: '',
                                    pic: requestDomain + '/static/wxapp/custompage/img_adver_image_5.png',
                                },
                            ],
                            pic_radius: '2',
                            page_distance: 12,
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'appointGoods',
                        icon: 'iconCustomPageGoods',
                        label: '商品',
                        content: {
                            goods_type: '1',
                            goods_type_val: '1',
                            title: '热门推荐',
                            title_color: '#FDCC9C',
                            goods_sort_style: [],
                            goods_classify_type: '1',
                            show_allClassify: '2',
                            goods_classify_style: '1',
                            style_type: '5',
                            goods_style: '1',
                            goods_radius: '1',
                            font_weight: 'bold',
                            page_distance: 4,
                            goods_distance: 4,
                            show_filed: [
                                {
                                    value: 'price',
                                    label: '商品价格',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            buyBtn_style: '1',
                            buyBtn_bg_color: '#000000',
                            list: [],
                        },
                    },
                ],
            },
            4: {
                id: '',
                source: 'appoint_activity',
                source_id: '',
                page_title: '美容美甲',
                title_color: '#ffffff',
                bg_color_style: '2',
                bg_color: '#fcbacb',
                bg_image: [requestDomain + '/static/wxapp/custompage/page_bg_image_3.png'],
                bg_color_default: '#f6f6f6',
                bg_color_nav_style: '1',
                bg_color_nav: '#ffffff',
                bg_color_nav_default: '#ffffff',
                bg_image_nav: '',
                bg_color_nav_opacity: 0,
                nav_bottom_display: 0,
                share_title: '',
                share_desc: '',
                share_image_wechat: '',
                share_image_h5: '',
                custom: [
                    {
                        type: 'appointGoodsSearch',
                        icon: 'iconCustomPageSearch',
                        label: '商品搜索',
                        content: {
                            style_type: '1',
                            text_align: 'left',
                            height_value: 28,
                            bg_color: '#ffffff',
                            bg_color_opacity: 0,
                            content_bg_color: '#f9f9f9',
                            font_color: '#A7A7A7',
                        },
                    },
                    {
                        type: 'helpBlank',
                        icon: 'iconCustomPageHelpBlank',
                        label: '辅助空白',
                        content: {
                            blank_height: 10,
                        },
                    },
                    {
                        type: 'appointGoods',
                        icon: 'iconCustomPageGoods',
                        label: '商品',
                        content: {
                            goods_type: '1',
                            goods_type_val: '1',
                            title: '',
                            title_color: '#333333',
                            goods_sort_style: [],
                            goods_classify_type: '1',
                            show_allClassify: '2',
                            goods_classify_style: '1',
                            style_type: '1',
                            goods_style: '1',
                            goods_radius: '1',
                            font_weight: 'bold',
                            page_distance: 2,
                            goods_distance: 8,
                            show_filed: [
                                {
                                    value: 'price',
                                    label: '商品价格',
                                    is_checked: true,
                                    is_show: true,
                                },
                                {
                                    value: 'buy_btn',
                                    label: '购买按钮',
                                    is_checked: true,
                                    is_show: true,
                                },
                            ],
                            buyBtn_style: '1',
                            buyBtn_bg_color: '#fd5e93',
                            list: [],
                        },
                    },
                ],
            },
        },
    },
    mutations: {
        UPDATE_COMPONENTLIST(state, componentsList) {
            state.componentsList = componentsList
        },
    },
    actions: {
        updateComponentId({ state }, componentId) {
            state.componentId = componentId
        },
        updatePageInfo({ state }, pageInfo) {
            state.pageInfo = pageInfo
        },
        updateSource({ state, commit }, sourceInfo) {
            state.sourceInfo = sourceInfo

            // 组件控制
            // showList 没有 或为空 平台、商家、店铺均有
            // showList 有值不为空 其元素标识该端独有
            let list = state.componentsList || []
            let source = sourceInfo.source || ''

            if (list.length) {
                let componentsListShowId =
                    source == 'appoint_activity'
                        ? ['basicComponent', 'marketingComponent', 'appointComponent']
                        : ['basicComponent', 'marketingComponent', 'mallComponent', 'shopComponent', 'otherComponent']
                list = list.filter((item) => componentsListShowId.find((sItem) => sItem == item.id))
                list = list.filter((item) => {
                    if (item.list && item.list.length) {
                        item.list = item.list.filter((subItem) => {
                            if (source == 'appoint_activity' && subItem.type == 'picNav') {
                                subItem.content.list = subItem.content.list.concat([
                                    {
                                        name: L('导航五'),
                                        link_url: '',
                                        nav_icon: '',
                                    },
                                ])
                            }
                            if (source) {
                                if (subItem.showList && subItem.showList.length) {
                                    if (subItem.showList.indexOf(source) != -1) {
                                        return subItem
                                    }
                                } else {
                                    return subItem
                                }
                            } else {
                                return subItem
                            }
                        })
                    }
                    return item
                })
            }
            commit('UPDATE_COMPONENTLIST', list)
        },
        updateCustomIndex({ state }, customIndex) {
            state.customIndex = customIndex
        },
        updatePageHeaderInfo({ state }, pageHeaderInfo) {
            state.pageHeaderInfo = pageHeaderInfo
        },
        updatePageType({ state }, pageType) {
            state.pageType = pageType
        },
        updateStyleTypeOptions({ state }) {
            state.styleTypeOptions = customPage.styleTypeOptions.filter((item) => {
                if (item.is_show.indexOf(state.componentId) != -1) {
                    item.label = L(item.label)
                    return item
                }
            })
        },
        updateComponentsList({ state }, componentsList) {
            state.componentsList = componentsList
        },
        updateCustomPageList({ state }, refreshCustomPageList) {
            state.refreshCustomPageList = refreshCustomPageList
        },
        updateCustomPageHeader({ state }, customPageHeader) {
            state.customPageHeader = customPageHeader
        },
        updatePageMainColor({ state }, pageMainColor) {
            state.pageMainColor = pageMainColor
        },
        updateSubCustomIndex({ state }, subCustomIndex) {
            state.subCustomIndex = subCustomIndex
        },
        updateActiveKey({ state }, activeKey) {
            state.activeKey = activeKey
        },
        updatePageScroll({ state }, pageScroll) {
            state.pageScroll = pageScroll
        },
    },
}

export default customPage
