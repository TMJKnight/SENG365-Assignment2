<template>
  <div align="center">
    <div class="sidenav">
      <router-link :to="{name: 'user', params: {id: $route.params.id}}"> Back to profile </router-link>
    </div>
    <h2>Edit my profile</h2>
    <form v-on:submit="editUser">
      Given name:<br>
      <input type="text"  v-model="newGivenName"><br>
      Family name:<br>
      <input type="text"  v-model="newFamilyName"><br>
      Password:<br>
      <input type="password"  v-model="newPassword"><br>
      Confirm with old password to update details:<br>
      <input type="password" required v-model="confirmedPassword"><br>
      <input type="submit" value="Submit changes">
    </form>

  </div>
</template>
<script>
export default {
  data () {
    return {
      error: "",
      errorFlag: true,
      newGivenName: "",
      newFamilyName: "",
      newPassword: "",
      singleUser: [],
      confirmedPassword: "",
      userPassword: ""


    }
  },
  mounted: function () {
    this.getUser();

  },
  methods: {
    editUser: function(event) {
      event.preventDefault();
      if (this.newGivenName == "") {
        this.newGivenName = this.singleUser.givenName;
      }
      if (this.newFamilyName == "") {
        this.newFamilyName = this.singleUser.familyName;
      }
      if (this.newPassword == "") {
        this.newPassword = localStorage.getItem('password');
      }
      if (this.confirmedPassword == localStorage.getItem('password')) {
        this.$http.patch('http://localhost:4941/api/v1/users/' + this.$route.params.id, {
          "givenName": this.newGivenName,
          "familyName": this.newFamilyName,
          "password": this.newPassword
        }, {headers: {'X-Authorization': localStorage.getItem('authToken')}})
          .then(function (response) {
            alert("Your profile has been successfully updated");
            this.$router.push('/users/' + this.$route.params.id);
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      } else {
        alert("Your confirmed password is incorrect")
      }
    },
    getUser: function () {
      this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.id,
        {headers: {'X-Authorization': localStorage.getItem('authToken')}})
        .then(function (userResponse) {
          this.singleUser = userResponse.data;
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
    },
    checkPassword: function() {
      if (localStorage.getItem('password')) {
        this.userPassword = localStorage.getItem('password');
      }
    },
  }
}
</script>
