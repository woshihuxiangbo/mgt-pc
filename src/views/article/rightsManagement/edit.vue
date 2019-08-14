<template>
  <div class="create" v-loading="loading">
    <breadcrumb :options="['内容管理', '权益编辑']"/>
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
        <el-button type="primary" native-type="submit">立即编辑</el-button>
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
        <el-button type="primary" native-type="submit">立即编辑</el-button>
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
    components: {Breadcrumb, rightsForm, tuanForm},
    data() {
        return {
            loading: false,
            form: {
                headPic: '',
                headTitle: '',
                mainTitle:'',
                subTitle:'',
                footerTitle:'',
                maxMoney:0,
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
            id: '',
            level:'',
            formData:null,
        };
    },
    created() {
        let data = JSON.parse(this.$route.params.content)
        console.log(data)
        data.maxMoney = data.maxMoney/100
        this.form = data
        this.id = this.$route.params.id;
        this.level = this.$route.params.level;
    },
    methods: {
        onSubmit() {
            this.loading = true;
            let formData = this.form
            formData.maxMoney && (formData.maxMoney = formData.maxMoney*100);

            let data = {
                id: this.id,
                content: JSON.stringify(formData)
            };
            rightsManagement
                .edit(data)
                .then((res) => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                       this.$notify({
                            title: '编辑成功',
                            message: '此条编辑成功',
                            type: 'success'
                        });
                        this.$router.go(-1)
                    });
                })
                .catch()
                .finally(() => (this.loading = false));
        },
        deleteMainWord(data) {
            let mainContentItem = this.form.mainContent[data.mainContentIndex].content;
            mainContentItem.splice(data.contentIndex, 1);
        },
        addMainWord(data) {
            let mainContentItem = this.form.mainContent[data.mainContentIndex].content;
            mainContentItem.push({
                text: '',
                isStar: false
            });
        },
        deleteSubWord(data) {
            let subContentItem = this.form.subContent[data.subContentIndex].content;
            subContentItem.splice(data.contentIndex, 1);
        },
        addSubWord(data) {
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
                icon: '',
                content: []
            });
        },
        delsubBig(data) {
            console.log('del sub big', data.subIndex);
            this.form.subContent.splice(data.subIndex, 1);
        },
        delRightBig(data) {
            console.log('del main big ', data.mainIndex);
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
                console.log(mainContentItem);
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
