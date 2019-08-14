<template>
    <div class="main">
        <div style="margin-top: -100px">
            <h1>404 错误</h1>
            <p>没有找到请求的资源，可能是URL输入错误，或者资源已经被删除。</p>
            <p>您可以尝试以下操作：</p>
            <br>
            <p>
                <el-button type="primary" @click="$router.replace({name: 'Welcome'})">返回首页</el-button>
                <el-button @click="$router.back()">返回上页</el-button>
            </p>
        </div>
    </div>
</template>

<style scoped>
    .main {
        padding:   10px;
        font-size: 16px;
        display: flex;
        justify-content: center;
        text-align: center;
        align-items: center;
    }

    h1 {
        font-weight:   normal;
        font-size:     32px;
        margin-bottom: 0;
    }
</style>
