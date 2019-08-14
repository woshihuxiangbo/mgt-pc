<template>
    <div class="md-item-brief">
        <img :src="data.thumbnail|imgSrc" alt="">
        <p>{{data.name}}</p>
    </div>
</template>

<script>
    export default {
        name: 'ItemBrief',
        props: {
            data: {
                type: Object, default: () => {
                    return {};
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .md-item-brief {
        img {
            width: 100px;
            height: 100px;
            border-radius: 5px;
        }
        p {
            line-height: 30px;
            margin: 0;
            padding: 0;
        }
    }
</style>
