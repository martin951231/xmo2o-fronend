let customPageDecorateData = [
    {
        type: 'categoryHeader', // 头部
        content: {
            page_title: '', // 页面标题
            bg_color: '#ffffff', // 头部背景色
            page_title_color: '#000000', // 页面标题字体颜色
            main_color: '#000000', // 分类主色调
            is_fixed: '1', // 1 悬浮 2 不悬浮
            share_title: '', // 分享标题
            share_desc: '', // 分享描述
            share_image_wechat: '', // 分享图片小程序
            share_image_h5: '', // 分享图片h5
        },
        rules: [
            {
                name: 'page_title',
                type: 'required',
                errmsg: '请输入页面标题'
            }
        ]
    },
    {
        type: 'titleText', // 标题文本
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
            // 标题文本背景颜色 默认空=transparent
            bg_color: '',
            // 是否显示底部分割线 1 显示 0 不显示
            show_bottom_line: 0
        },
        rules: [
            {
                name: 'title_txt',
                type: 'callBack',
                errmsg: '标题和描述不能同时为空',
                callBack: 'titleTextValidate'
            },
            {
                name: 'desc_txt',
                type: 'callBack',
                errmsg: '标题和描述不能同时为空',
                callBack: 'titleTextValidate'
            }
        ]
    },
    {
        type: 'hotWords', // 热搜
        content: {
            is_show_title: '2', // 热搜标题显隐 1 显示 2 不显示
            list: [], // 热搜词列表
        }
    },
    {
        type: 'swiperNav', // 轮播导航
        content: {
            style_type: '1', // 1大图 2小图
            show_column: '1', // 1 一行轮播 2两行轮播 3三行轮播 4四行轮播
            list: []
        },
        rules: [
            {
                name: 'list',
                type: 'requiredArray',
                errmsg: '请添加轮播导航'
            }, {
                name: 'image',
                type: 'requiredArrayEle',
                errmsg: '请上传轮播导航图片'
            }, {
                name: 'title',
                type: 'requiredArrayEle',
                errmsg: '请输入轮播导航标题'
            }, {
                name: 'badge_val',
                type: 'callBack',
                errmsg: '请输入轮播导航角标',
                callBack: 'badgeValValidate'
            }
        ]
    }, {
        type: 'porcelainArea', // 瓷片区
        content: {
            style_type: '1', // 瓷片样式 1 投影 2 描边
            list: [
                {
                    title: '',
                    sub_title: '',
                    link_url: '',
                    image: '',
                    show_badge: '1',
                    badge_val: ''
                }, {
                    title: '',
                    sub_title: '',
                    link_url: '',
                    image: '',
                    show_badge: '1',
                    badge_val: ''
                }
            ]
        },
        rules: [
            {
                name: 'list',
                type: 'requiredArray',
                errmsg: '请添加瓷片区'
            }, {
                name: 'image',
                type: 'requiredArrayEle',
                errmsg: '请上传瓷片区图片'
            }, {
                name: 'title',
                type: 'requiredArrayEle',
                errmsg: '请输入瓷片区标题'
            }, {
                name: 'badge_val',
                type: 'callBack',
                errmsg: '请输入瓷片区角标',
                callBack: 'badgeValValidate'
            }
        ]
    }, {
        type: 'swiperPic', // 轮播图
        content: {
            list: [
                {
                    title: '',
                    image: '',
                    link_url: ''
                }, {
                    title: '',
                    image: '',
                    link_url: ''
                }
            ],
            show_distance: '1', // 1 有页面边距 2 无页面边距
            duration: 0, // 轮播间隙,
            page_distance: 20, // 页面边距 边距设置为1时才使用
        },
        rules: [
            {
                name: 'list',
                type: 'requiredArray',
                errmsg: '请添加轮播图'
            }, {
                name: 'image',
                type: 'requiredArrayEle',
                errmsg: '请上传轮播图片'
            }
        ]
    }, {
        type: 'magicSquare',
        content: { 
            // 图片间距
            img_distance: 0,
            // 页面边距显隐
            show_distance: '1', // 1 有页面边距 2 无页面边距 暂无此配置项，固定值为1
            // 页面间距
            page_distance: 0,
            // 魔方密度 2 => 2*2 4 => 4*4 5 => 5*5 6 => 6*6 7 => 7*7
            density: '2',
            // 魔方选中的层
            list: []
        },
        rules: [
            {
                name: 'list',
                type: 'requiredArray',
                errmsg: '请选择魔方'
            }, {
                name: 'image',
                type: 'requiredArrayEle',
                errmsg: '请上传魔方图片'
            }
        ]
    }, {
        type: "freeModule", // 自由区块
        content: {
            border_radius: '1', // 1圆角  2 直角
            show_distance: '1', // 边距设置 1显示 2不显示
            style_type: '2', // 区块样式 1显示 2不显示
            bg_type: '1', // 背景设置 1自定义颜色 2图片
            bg_val: '#ffffff',
            page_distance: 20, // 页面边距 边距设置为1时才使用
        },
        rules: [
            {
                name: 'list',
                type: 'requiredArray',
                errmsg: '请装修自由区块',
            },{
                name: 'bg_val',
                type: 'callBack',
                errmsg: '请上传自由区块背景图',
                callBack: 'bgValValidate'
            }
        ]
    }, {
        type: "feedModule", // feed流
        content: {
            list: []
        }
    },
]
export default customPageDecorateData
