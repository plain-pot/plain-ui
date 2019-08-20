<template>
    <div class="cloudmusic">
        <im-demo-row>
            <im-button @click="emailLogin" label="邮箱登录"/>
        </im-demo-row>
        <im-demo-row>
            <im-button @click="getUserDetail" label="获取用户信息"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "cloudmusic",
        data() {
            return {
                server: 'http://localhost:3000',
            }
        },
        methods: {
            async emailLogin() {
                const {data} = await this.$http.axios({
                    url: `${this.server}/login?email=martsforever@163.com&password=qq450881199`
                })
                console.log('邮箱登录', data)
            },
            async getUserDetail() {
                const {data} = await this.$http.axios({
                    url: `${this.server}/user/detail?uid=1827443181`,
                    withCredentials: true,
                })
                console.log(data)
            }
        }
    }
</script>

<style lang="scss">

</style>
