<template>
    <div class="card">
        <div class="top-card">
            <div class="title padding">
                <span class="title-left ">{{info.title}}</span>
                <span class="title-right right">{{info.mintitle}}</span>
            </div>
            <div class="content padding">
                <span class="number">88888</span>
                <el-button
                  type="primary" 
                  size="mini" 
                  class="right" 
                  v-if="false"
                  @click="onClick(idx)"
                  >
                    {{info.button}}
                </el-button>
            </div>
            <p class="disc" v-if="info.discTop">{{info.discTop}}</p>
        </div>
        <div class="bottom-card" v-if="info.showBottom">
            <p class="disc" v-for="(item,key) in info.discBottom" :key="key">{{item.name+"："+item.number}}</p>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .right{
        float:right
    } 
    .padding{
        padding:5px 0;
    } 
    .disc{
        font-size: 14px;
        color:#333;
    } 
    .card{
        width: 100%;
        border-radius: 5px;
        box-sizing: border-box;
        border:2px solid #ccc;
        padding: 20px;
        .top-card{
            height: 96px;
            .title-right{
                font-size: 12px;
                color: rgb(34, 34, 34);
                margin-top:3px
            }
        }
        .bottom-card{
            height: 78px;
        }
        .number{
            font-weight: 900;
            font-size: 24px;
        }
    }
</style>
<script>
export default {
    props:{
        info:{
            type:Object,
            required:true
        },
        idx:{
            type:Number,
            required:true
        }
    },
    methods:{
        onClick(idx){
            this.$emit('onclick',idx)
        }
    }
}
</script>



