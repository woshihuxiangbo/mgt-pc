<template>
    <div class="spike-add">
        <breadcrumb :options="['活动管理', '创建秒杀']"/>
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
                form: {
                    id: 25,
                    image: 'https://fhimg.52xie.com/uploadfile/2016/0824/20160824040024285.jpg',
                    title: '商品名称',
                    price: 15.30,
                    sellCount: 0,
                    startDatetime: '2018-08-30 16:30:25',
                    endDatetime: '2018-08-30 16:50:25',
                    statusDes: '已结束'
                }
            }
        },
        methods: {
            onSubmit () {
                // TODO 创建秒杀
            }
        }
    }
</script>

<style scoped>

</style>