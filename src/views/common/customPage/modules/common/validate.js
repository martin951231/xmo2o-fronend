// 自定义校验 函数
// rule  type = 'callBack'
let validate = { 
    // 获取对应组件的校验规则根据componentId
    getRules: (data = [],componentId = '') => {
        let rules = []
        if (data.length) {
            data.forEach((item) => {
                if (item.type == componentId && item.rules) {
                    rules = item.rules
                }
            })
        }
        return rules
    },
    // 表单校验 data 需要校验的数据 rules 校验规则,是Array
    validateCheck: (data, rules) => {
        let res = {
            isOk: true,
            errmsg: '',
        }
        if (!rules || !rules.length) {
            return res
        }
        for (let rule of rules) {
            if (!rule || !rule.name || !rule.type) {
                continue
            }

            // 数组校验不为空
            if (rule.type === 'requiredArray') {
                if (data[rule.name] && !data[rule.name].length) {
                    res = {
                        isOk: false,
                        errmsg: rule.errmsg,
                    }
                    if (!res.errmsg) {
                        res.errmsg = this.L('请正确输入所有数据') //默认提示
                    }
                    return res
                }
                continue
            }

            // 数组内的字段校验
            if (
                rule.type === 'requiredArrayEle' &&
                data &&
                data.list &&
                Array.isArray(data.list) &&
                data.list.length
            ) {
                for (let j = 0; j < data.list.length; j++) {
                    if (!data.list[j][rule.name] || !data.list[j][rule.name].trim()) {
                        res = {
                            isOk: false,
                            errmsg: rule.errmsg,
                        }
                        if (!res.errmsg) {
                            res.errmsg = this.L('请正确输入所有数据') //默认提示
                        }
                        return res
                    }
                }
                continue
            }

            // 自定义回调校验
            if (rule.type === 'callBack' && data) {
                res.isOk = validate[rule.callBack](data)
                res.errmsg = rule.errmsg
                if (!res.errmsg) {
                    res.errmsg = this.L('请正确输入所有数据') 
                }
                return res
            }

            // 如果值不存在
            if (
                !data[rule.name] ||
                (data[rule.name] && typeof data[rule.name] == 'string' && !data[rule.name].trim())
            ) {
                // 如果是必填项就返回错误提示，required可以作为type是为了不同的type能给用户不同的提示
                if (rule.type === 'required' || rule.required) {
                    res = {
                        isOk: false,
                        errmsg: rule.errmsg,
                    }
                    if (!res.errmsg) {
                        res.errmsg = this.L('请正确输入所有数据') //默认提示
                    }
                    return res
                }
                // 如果不是必填项就跳过
                continue
            }

            // 发现任何一个错误就立即返回，后面的不再判断
            if (!res.isOk) {
                if (!res.errmsg) {
                    // 默认提示
                    res.errmsg = this.L('请正确输入所有数据')
                }
                return res
            }
        }
        return res
    },
    // 角标校验 角标显示为必填
    badgeValValidate: (data) => {
        let checkResult = true
        if (data && data.list && data.list.length) {
            let list = data.list
            for (let i = 0; i < list.length; i++) {
                if (list[i].show_badge == 1 && list[i].badge_val.toString().trim() == '') {
                    checkResult = false
                    break
                }
            }
        }
        return checkResult
    },
    // 标题文本校验 标题和描述不能同时为空
    titleTextValidate: (data) => {
        let checkResult = true
        if (!data.title_txt.trim() && !data.desc_txt.trim()) {
            checkResult = false
        }
        return checkResult
    },
    // 商品组件角标自定义校验
    goodsBadgeStyleValValidate: (data) => {
        let checkResult = true
        if (data.goodsBadge_style == '5' && !data.goodsBadge_style_val) {
            checkResult = false
        }
        return checkResult
    },
    // 自由区块背景样式校验
    bgValValidate: (data) => {
        let checkResult = true
        if (data.bg_type == '2' && data.bg_val == "") {
            checkResult = false
        }
        return checkResult
    }
}

export default validate
