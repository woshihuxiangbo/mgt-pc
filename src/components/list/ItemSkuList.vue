<template>
    <div class="item-sku-list">
        <div v-for="(o, i) in options" :key="i" style="display: inline-block">
            <el-radio-group v-model="select" v-for="s in o.sku" @change="onSelectChange" :key="s.id">
                <el-radio-button v-if="s.wholesaleMark && isWholesaleMark" :label="o.spuName + ' ' + s.skuName + '*'  + s.unit"
                                 @click.native.stop="onClick(s, o)"></el-radio-button>

                <el-radio-button v-if="!isWholesaleMark && s.retailMark" :label="o.spuName + ' ' + s.skuName + '*'  + s.unit"
                                 @click.native.stop="onClick(s, o)"></el-radio-button>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ItemSkuList',
        props: {
            options: {type: Array},
            isWholesaleMark: {type: Boolean, default: false}
        },
        data() {
            return {
                select: '',
                data: {}
            };
        },
        methods: {
            async onSelectChange() {
                await this.$nextTick();
                this.$emit('change', {sku: this.data, skuName: this.select});
            },
            onClick(data, o) {
                data.spuId = o.id;
                this.data = data;
            }
        },
        watch: {
            options() {
                this.select = '';
                this.data = {};
            }
        }
    };
</script>

<style scoped lang="scss">
    .item-sku-list {
        .title {
            line-height: 40px;
            font-size: 14px;
            font-weight: 400;
            color: #999;
        }
    }
</style>
