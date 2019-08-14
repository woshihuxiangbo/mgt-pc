<template>
    <div class="item">
        <span class="item-name" :style="{flex: '0 0 ' + labelWidth}">{{label}}</span>
        <span class="value"><slot/></span>
    </div>
</template>

<script>
    export default {
        name: "ListItem",
        props: {
            label: String,
            labelWidth: String
        }
    }
</script>

<style scoped lang="scss">
    .item {
        line-height: 30px;
        display: flex;
        .item-name {
            text-align: right;
            color: #999;
            padding-right: 10px;
        }
        .value {
            flex: 1;
            font-size: 13px;
        }
    }
</style>