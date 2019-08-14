<template>
    <el-select v-model="form" placeholder="请选择省份" multiple style="width: 100%;" size="mini" :value="form">
        <el-option v-for="item in options" :key="item.value" :label="item.label"
                   :value="item.value" :disabled="item.isDisabled"/>
    </el-select>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import {provinceAndCityData} from 'element-china-area-data';

    export default {
        name: 'AreaSelector',
        mixins: [vModelMixins],
        props: {
            value: {type: Array, default: () => []},
            disableData: {type: Array, default: () => []}
        },
        data() {
            return {
                provinceAndCityData
            };
        },
        methods: {},
        computed: {
            options() {
                let provinces = Object.assign([], this.provinceAndCityData);
                let area = [];
                this.disableData.forEach((item) => {
                    area = [...area, ...item.area];
                });
                area = area.filter((item) => {
                    return this.form.indexOf(item) === -1;
                });

                let data = [];
                provinces.forEach((province) => {
                    delete province.children;
                    if (area.indexOf(province.value) !== -1) return;
                    data.push(province);
                });
                return data;
            }
        },
    };
</script>

<style scoped>

</style>
