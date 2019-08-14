<template>
    <div class="spike-add">
        <breadcrumb :options="['活动管理', '编辑秒杀']"/>
        <div class="main-container">
            <spike-form v-model="form">
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button @click="$router.push({name: 'SpikeList'})">取消</el-button>
            </spike-form>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from "../../../components/widget/breadcrumb";
    import SpikeForm from "../../../components/form/SpikeForm";
    export default {
        components: {SpikeForm, Breadcrumb},
        data () {
            return {
                id: undefined,
                form: {
                    image: undefined,
                    title: undefined,
                    price: undefined,
                    sellCount: 0,
                    startDatetime: undefined,
                    endDatetime: undefined,
                    statusDes: undefined,
                }
            }
        },
        methods: {
            onSubmit () {
                // TODO 创建秒杀
            },
            getSpikeInfo () {
                // TODO 获取秒杀详情
            }
        },
        mounted() {
            this.id = this.$route.params.id;
            this.getSpikeInfo();
        }
    }
</script>

<style scoped>

</style>