<template>
    <section class="section">
        <top-header/>
        <main class="section-main">
            <aside-menu></aside-menu>
            <main-content>
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </main-content>
        </main>
    </section>
</template>

<script>
    import TopHeader from '@/components/layout/TopHeader';
    import AsideMenu from '@/components/layout/AsideMenu';
    import MainContent from '@/components/layout/MainContent';
    import {mapGetters} from 'vuex';

    export default {
        name: 'MainContainer',
        components: {
            MainContent,
            AsideMenu,
            TopHeader
        }
    };
</script>

<style scoped lang="scss">
    .section {
        height: 100%;
        display: flex;
        flex-direction: column;

        > main {
            flex: 1;
        }
    }

    .section-main {
        margin-top: 60px;
        display: flex;
    }
</style>
