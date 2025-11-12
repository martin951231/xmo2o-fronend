<template>

    <p>  {{store.getters.config.floor_name}}管理  注意了，这里也可以直接从菜单进来，也有可能是从{{$store.getters.config.single_name}}列表过来  </p>
</template>

<script>
export default {
    name: "unitfloor"
}
</script>

<style scoped>

</style>