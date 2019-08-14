<template>
    <div class="md-item" :style="{width: width}">
        <img :src="item.thumbnail | imgSrc" alt="">
        <p class="md-title">{{item.name}}</p>
        <p class="md-title">{{item.skuName}}</p>
        <slot/>
    </div>
</template>

<script>
    export default {
        name: "GoodsItemCard",
        props: {
            item: {type: Object, required: true},
            width: {type: String, default: '150px'},
            height: {type: String, default: '150px'},
            showSkuName: Boolean
        }
    }
</script>

<style scoped lang="scss">
    .md-item {
        display: inline-block;
        overflow: hidden;
        padding: 5px;

        &:hover {
            background-color: #f6f6f6;
        }

        > img {
            width: 100%;
        }

        .md-title {
            display: block;
            overflow: hidden;
            height: 28px;
            line-height: 28px;
            text-overflow: ellipsis;
            white-space: normal;
            border-radius: 10px;
        }
    }
</style>