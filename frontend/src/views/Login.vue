<template>
  <form class="login-form" @submit.prevent="login">
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button type="submit">登录</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    async login() {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({
            user_name: this.username,
            password: this.password
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });

        // 检查响应是否成功
        if (!res.ok) {
            
          const data = await res.text(); //
          throw new Error(`登录失败，状态码：${res.status}, 错误:${data}`);
        }

        const data = await res.json(); //
        const token = data.token;

        // 保存 token 并跳转
        localStorage.setItem("token", token);
        this.$router.push("/hosts");
      } catch (err) {
        console.error("登录出错：", err);
        alert(err);
      }
    }
  }
};
</script>
