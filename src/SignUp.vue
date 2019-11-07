<template>
<div align="center">
  <div v-if="errorFlag" style="color: red;">
    {{ error }}
    <p><router-link :to="{ name: 'SignUp' }">Try again</router-link></p>
  </div>
  <div v-else>
  <h2>Sign up</h2>

      <form v-on:submit="signUp()">
        Username:<br>
        <input type="text" maxlength="64" required v-model="username"><br>
        First name:<br>
        <input type="text" required v-model="firstName"><br>
        Last name:<br>
        <input type="text" required v-model="lastName"><br>
        Email:<br>
        <input type="text" required v-model="email"><br>
        Password:<br>
        <input type="password" required v-model="password"><br>
        Confirm Password:<br>
        <input type="password" required v-model="confirmedPassword"><br>
        <input type="submit" value="Register">
      </form>

  <div class="sidenav" align="center">
  <router-link :to="{ name: 'home'}">Back to Home</router-link>
  </div>
  </div>
</div>
</template>
<script>


  var validator = require("email-validator");

  export default {
    data (){
      return{
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmedPassword: "",
        error: "",
        errorFlag: ""

      }
    },
    mounted: function() {

    },
    methods: {
      signUp: function () {
        event.preventDefault();
        if (this.password !== this.confirmedPassword) {
          alert('The two passwords do not match');
          this.username = "";
          this.firstName = "";
          this.lastName = "";
          this.email = "";
          this.password = "";
          this.confirmedPassword = "";
          this.router.push('/users');
        } else if (!validator.validate(this.email)) {
          alert('The email is invalid');
          this.username = "";
          this.firstName = "";
          this.lastName = "";
          this.email = "";
          this.password = "";
          this.confirmedPassword = "";
          this.router.push('/users');
        } else {
          this.$http.post('http://localhost:4941/api/v1/users/', {
            "username": this.username,
            "givenName": this.firstName,
            "familyName": this.lastName,
            "email": this.email,
            "password": this.password
          }).then(function (signUpResponse) {
            console.log('Im here');
            this.$http.post('http://localhost:4941/api/v1/users/login/', {
              "username": this.username,
              "email": this.email,
              "password": this.password
            }).then(function (logInResponse) {
              localStorage.setItem('authToken', logInResponse.body.token);
              localStorage.setItem('userId', logInResponse.body.userId);
              localStorage.setItem('password', logInResponse.body.password);
              this.$router.push('/');
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
          }, function (error) {
            this.error = "Username or email already exists";
            alert('"Username or email already exists"');
            this.username = "";
            this.firstName = "";
            this.lastName = "";
            this.email = "";
            this.password = "";
            this.confirmedPassword = "";
            this.router.push('/users');
          });
        }
        }
      }
    }
</script>



