<template>
    <div class="goods-info-mini">
        <div class="image">
            <img :src="option.thumbnail | imgSrc" alt="" height="120px">
        </div>
        <div class="info">
            <p>{{option.name}} <span style="color: #777">{{option.spuName}}</span></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'GoodsInfoMini',
        props: {
            option: Object
        }
    };
</script>

<style scoped>

</style>