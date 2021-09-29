<template>
  <div>
    <h1>测试全局注册的组件</h1>
    <demo-row title="Message Service">
      <pl-button @click="showMsg">
        (with context) message
      </pl-button>
      <pl-button @click="showMsg2">
        (without context) message
      </pl-button>
    </demo-row>
    <demo-row title="Notification Service">
      <pl-button @click="showNotice">
        (with context) notice
      </pl-button>
      <pl-button @click="showNotice2">
        (without context) notice
      </pl-button>
    </demo-row>
  </div>
</template>

<script>
import {$$notice, $$message} from "plain-ui";

export default {
  name: "test",
  methods: {
    showMsg() {
      this.$message('show message')
    },
    showMsg2() {
      $$message('show message')
    },
    showNotice() {
      this.$notice('show notice')
    },
    showNotice2() {
      $$notice('show notice')
    },
  },
}
</script>

<style lang="scss">

</style>
