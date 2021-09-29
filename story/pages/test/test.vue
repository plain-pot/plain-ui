<template>
  <div>
    <h1>测试全局注册的组件</h1>
    <pl-button @click="showMsg">
      按钮
    </pl-button>
  </div>
</template>

<script>
export default {
  name: "test",
  methods: {
    showMsg() {
      console.log(this)
    },
  },
}
</script>

<style lang="scss">

</style>
