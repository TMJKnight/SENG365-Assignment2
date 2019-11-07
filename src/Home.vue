<template>
  <div>
    <div align="center">
      <h1>Home Page</h1>
    </div>
    <div class="sidenav" align="center">
    <p><router-link :to="{ name: 'venues' }">View venues</router-link></p>

      <p><router-link v-if="logFlag === 'true'" :to="{ name: 'SignUp' }">Register as a new user</router-link></p>
      <p><router-link v-if="logFlag === 'false'" :to="{name: 'user', params: {id: idNum}}"> View my profile</router-link></p>
    <p><router-link v-if="logFlag === 'true'"   :to="{ name: 'login' }">Login</router-link></p>
    <form v-if="logFlag === 'false'" v-on:submit.prevent="logOut()">
      <input type="submit" value="Logout">
    </form>
    </div>
  </div>

</template>

<script>

  export default {
    data() {
      return {
        logFlag: "",
        error: "",
        errorFlag: "",
        idNum: ""
      }
    },
    mounted: function () {
      this.checkLogIn();


    },
    methods: {
      logOut: function () {
        this.$http.post('http://localhost:4941/api/v1/users/logout/', "", {
          headers: {
            'X-Authorization': localStorage.getItem('authToken')
          }
        }).then(function (response) {
          localStorage.clear();
          this.logFlag = 'true';
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        })
      },
      checkLogIn: function() {
        if (localStorage.getItem('authToken')) {
          this.logFlag = 'false';
          this.idNum = localStorage.getItem('userId')
        } else {
          this.logFlag = 'true';
        }
      }
    }
  }
  console.log(localStorage)
</script>
