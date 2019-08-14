<template>
    <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent="onSubmit" :rules="rules">
        <el-form-item label="选择商品">
            <goods-selector @change="onSelectItem" :modal="false"/>
            <div class="goods-info" v-if="item">
                <img :src="item.thumbnail|imgSrc" alt="">
                <div>
                    <p><span>{{item.name}}</span> <span> {{item.skuName | skuFormat}}</span></p>
                    <p>
                        <el-input v-model="form.eventPrice" placeholder="礼包价格">
                            <template slot="prepend">￥</template>
                        </el-input>
                    </p>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="活动名称">
            <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="选择文章">
            <article-selector v-model="form.rule.articleId" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="阅读时间">
            <el-input-number v-model="form.rule.keepTime"/>
        </el-form-item>
        <el-form-item label="有效时间">
            <el-date-picker @change="changeDateRange"
                            v-model="time"
                            type="daterange"
                            range-separator="至"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>

        <el-form-item label="显示时间">
            <el-date-picker v-model="form.showTime" type="datetime" placeholder="选择日期时间"
                            :picker-options="pickerOptions" value-format="timestamp"/>
        </el-form-item>
        <el-form-item label="排序ID">
            <el-input-number v-model="form.sortId"/>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="form.disabled">
                <el-option :value="false" label="启用"/>
                <el-option :value="true" label="禁用"/>
            </el-select>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import ArticleSelector from "../selector/ArticleSelector";
    import GoodsSelector from "@/components/selector/GoodsSelector";

    export default {
        name: "FreeGiftForm",
        components: {GoodsSelector, ArticleSelector},
        mixins: [vModelMixins],
        data() {
            return {
                time: undefined,
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                rules: {},
                item: undefined
            }
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    }
                });
            },
            onSelectItem(item) {
                console.info(item);
                this.item = item;
                this.form.skuId = item.skuId;
            },
            changeDateRange(e) {
                try {
                    this.form.startTime = new Date(e[0]).getTime() / 1000;
                    this.form.endTime = new Date(e[1]).getTime() / 1000;
                } catch (e) {
                    console.info(e);
                }
            },
            formatDateRange () {
                this.time = [
                    new Date(parseInt(this.form.startTime * 1000)),
                    new Date(parseInt(this.form.endTime * 1000))
                ]
            }
        },
        mounted() {
            if (this.form.id !== undefined) {
                this.formatDateRange();
                this.item = {
                    thumbnail: this.form.thumbnail,
                    name: this.form.itemName,
                    skuName: this.form.specName
                };
            }
        },
        watch: {
            value (n) {
                this.form = n;
                this.formatDateRange();
            }
        },
        filters: {
            skuFormat (v) {
                if (v === undefined) {
                    return '-';
                } else if (typeof v === 'string') {
                    return v
                } else {
                    return v.join(' | ')
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .goods-info {
        img {
            height: 50px;
            min-width: 50px;
            display: inline-block;
            margin-right: 10px;
        }

        > div {
            display: inline-block;
        }
    }
</style>