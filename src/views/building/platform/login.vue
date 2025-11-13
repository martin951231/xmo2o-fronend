<template>
 
</template>
<script>
export default {
    beforeCreate() {
        if (typeof this.$route.query.mall_id != 'undefined' && this.$route.query.mall_id > 0) {
            //重定向到商场中心页面
            sessionStorage.setItem("login_mall_id", this.$route.query.mall_id);
            this.$router.replace({
                path: '/common/platform.iframe/menu_999'
            })
        } else {
            this.$message.error('参数有误')
            return false;
        }
    },
}
</script>