<template>
  <div class="create" v-loading="loading">
    <breadcrumb :options="['内容管理', '添加权益']"/>
    <div class="main-container" v-if="level!=111">
      <rights-form
        v-model="form"
        @submit="onSubmit"
        v-on:childDeleteMainWord="deleteMainWord"
        v-on:childAddMainWord="addMainWord"
        v-on:childDeleteSubWord="deleteSubWord"
        v-on:childAddSubWord="addSubWord"
        v-on:childAddMainBig="addMainBig"
        v-on:childAddRightItem="addRightItem"
        v-on:childDelsubBig="delsubBig"
        v-on:childDelRightBig="delRightBig"

        v-on:childAddStar="addStar"
      >
        <el-button type="primary" native-type="submit">立即创建</el-button>
      </rights-form>
    </div>
    <!-- 团长form -->
    <div class="main-container" v-if="level==111">
      <tuan-form
        v-model="form"
        @submit="onSubmit"
        v-on:tuanAddQuestion="addMainBig"
        v-on:tuanAddAnswer="addMainWord"
        v-on:tuanDelAnswer="delAnswer"
      >
        <el-button type="primary" native-type="submit">立即创建</el-button>
      </tuan-form>
    </div>
    <!-- 团长form -->
  </div>
</template>

<script>
import Breadcrumb from '../../../components/widget/breadcrumb';
import rightsForm from '../../../components/form/rightsForm';
import tuanForm from '../../../components/form/tuanForm';
import {mapGetters} from 'vuex';
import rightsManagement from '@/common/apis/rightsManagement';
export default {
    components: {Breadcrumb, rightsForm,tuanForm},
    data() {
        return {
            loading: false,
            form: {
                headPic: '',
                headTitle: '',
                mainTitle:'',
                subTitle:'',
                footerTitle:'',
                maxMoney:'',
                overMoneyTips:'',
                mainContent: [
                    {
                        title: '',
                        content: [
                            // {
                            //     text: 'main文字1',
                            //     isStar: false
                            // },
                            // {
                            //     text: 'main文字2',
                            //     isStar: false
                            // },
                            // {
                            //     text: 'main文字3',
                            //     isStar: false
                            // }
                        ]
                    }
                    // {
                    //     title: 'main标题2',
                    //     content: [
                    //         {
                    //             text: 'main文字11111',
                    //             isStar: false
                    //         },
                    //         {
                    //             text: 'main文字22222',
                    //             isStar: false
                    //         }
                    //     ]
                    // }
                ],
                subContent: [
                    {
                        title: '',
                        icon: '',
                        content: [
                            // {
                            //     text: 'sub文字11111',
                            //     isStar: false
                            // },
                            // {
                            //     text: 'sub文字22222',
                            //     isStar: false
                            // },
                            // {
                            //     text: 'sub文字3333',
                            //     isStar: false
                            // },
                            // {
                            //     text: 'sub文字444444',
                            //     isStar: false
                            // }
                        ]
                    }
                    // {
                    //     title: 'xxx2',
                    //     icon: 'yyy1',
                    //     content: [
                    //         {
                    //             text: 'sub文字11111++',
                    //             isStar: false
                    //         },
                    //         {
                    //             text: 'sub文字22222++',
                    //             isStar: false
                    //         }
                    //     ]
                    // }
                ],
                footerContent: ''
            },
            level:'',
        };
    },
    created(){
        this.level = this.$route.params.level
        this.form.maxMoney = this.$route.params.overData.maxMoney&&this.$route.params.overData.maxMoney*100
        this.form.overMoneyTips = this.$route.params.overData.overMoneyTips

    },
    methods: {
        onSubmit() {
            this.loading = true;
            let data = {
                storeId: this.shop.id,
                level: this.level,
                content: JSON.stringify(this.form)
            };
            rightsManagement
                .create(data)
                .then((res) => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                       this.$router.go(-1)
                    });
                })
                .catch()
                .finally(() => (this.loading = false));
        },
        deleteMainWord(data) {
            console.log(data);
            let mainContentItem = this.form.mainContent[data.mainContentIndex].content;
            mainContentItem.splice(data.contentIndex, 1);
        },
        addMainWord(data) {
            console.log(data);
            let mainContentItem = this.form.mainContent[data.mainContentIndex].content;
            mainContentItem.push({
                text: '',
                isStar: false
            });
        },
        deleteSubWord(data) {
            console.log(data);
            let subContentItem = this.form.subContent[data.subContentIndex].content;
            subContentItem.splice(data.contentIndex, 1);
        },
        addSubWord(data) {
            console.log(data);
            let subContentItem = this.form.subContent[data.subContentIndex].content;
            subContentItem.push({
                text: '',
                isStar: false
            });
        },
        addMainBig() {
            this.form.mainContent.push({
                title: '',
                content: []
            });
        },
        addRightItem() {
            this.form.subContent.push({
                title: '',
                icon:'',
                content: []
            });
        },
        delsubBig(data){
            console.log('del sub big',data.subIndex)
            this.form.subContent.splice(data.subIndex, 1);
        },
        delRightBig(data){
            console.log('del main big ',data.mainIndex)
            this.form.mainContent.splice(data.mainIndex, 1);
        },
        addStar(data) {
            console.log(data.starFlag);
            if (data.starFlag == 'mainStar') {
                let mainContentItem = this.form.mainContent[data.index].content;
                mainContentItem.push({
                    text: '',
                    isStar: true
                });
                console.log(mainContentItem)
            } else if (data.starFlag == 'subStar') {
                let subContentItem = this.form.subContent[data.index].content;
                subContentItem.push({
                    text: '',
                    isStar: true
                });
            }
        },
        delAnswer(data) {
            console.log(data);
            if (data.flag == 'question') {
                this.form.mainContent.splice(data.index2, 1);
            } else if (data.flag == 'answer') {
                let mainContentItem = this.form.mainContent[data.index1].content;
                mainContentItem.splice(data.index2, 1);
            }
        }
    },
    mounted() {},
    computed: {
        ...mapGetters({shop: 'shop'})
    }
};
</script>
<style>
</style>
