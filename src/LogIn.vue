<template>
  <div align="center">
    <h2>Login</h2>
    <form v-on:submit="logIn()">
      Username:<br>
      <input type="text"  v-model="username"><br>
      Email:<br>
      <input type="text"  v-model="email"><br>
      Password:<br>
      <input type="password" required v-model="password"><br>
      <input type="submit" value="Login">
    </form>
    <div class="sidenav">
    <router-link :to="{ name: 'home'}">Back to Home</router-link>
    </div>
  </div>
</template>
<script>

  export default {
    data (){
      return{
        username: "",
        email: "",
        password: "",
        error: "",
        errorFlag: ""

      }
    },
    mounted: function () {

    },
    methods:{
      logIn: function () {
        event.preventDefault();
        this.$http.post('http://localhost:4941/api/v1/users/login/', {
          "username": this.username,
          "email": this.email,
          "password": this.password
        }).then(function (logInResponse) {
          console.log(logInResponse)
          localStorage.setItem('authToken', logInResponse.body.token);
          localStorage.setItem('userId', logInResponse.body.userId);
          localStorage.setItem('password', this.password);
          this.$router.push('/');
        }, function (error) {
          if (this.username == "" && this.email == "")
          {
            alert('Please enter your username/email');
          } else {
            alert('Password is incorrect"');
          }
          this.error = error;
          this.errorFlag = true;
          this.username = "";
          this.email = "";
          this.password = "";
          this.router.push('/users/login');
        });
      }
    }
  }

</script>
