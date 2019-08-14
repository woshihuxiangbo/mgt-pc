<template>
    <div class="region-selector">
        <el-cascader :options="regionData" v-model="location" @change="handleChange"/>
    </div>
</template>

<script>
    import {regionData, CodeToText, TextToCode} from 'element-china-area-data';

    export default {
        name: "RegionSelector",
        props: {
            value: {type: Array}
        },
        data() {
            return {
                location: [],
                regionData
            }
        },
        methods: {
            handleChange(data) {
                let l = [];
                for (let i in data) {
                    l.push(CodeToText[data[i]])
                }
                this.$emit('change', l);
                this.$emit('input', l);
            },
            locationTextToCode() {
                let data = this.value;
                let list = [];
                try {
                    list.push(TextToCode[data[0]].code);
                    list.push(TextToCode[data[0]][data[1]].code);
                    list.push(TextToCode[data[0]][data[1]][data[2]].code);
                } catch (e) {
                }
                this.location = list;
            },
        },
        watch: {
            value() {
                this.locationTextToCode();
            }
        },
        created() {
            this.locationTextToCode();
        }
    }
</script>

<style scoped lang="scss">
    .region-selector {

    }
</style>