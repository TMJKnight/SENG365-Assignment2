<template>
  <div align="center">
    <div class="sidenav">
      <p><router-link :to="{ name: 'home'}">Home</router-link></p>
      <router-link :to="{ name: 'venues'}">Venues</router-link><br>
    </div>
    <h1>Profile</h1><br>
    <table>
      <tr>
        <h2>{{singleUser.username}}</h2>
        <img v-bind:src="userPhoto" height="120" width="120" alt="User image">
        <div v-if="userAdminId == userId">
          <p> <b>Email: </b>{{singleUser.email}}</p>
        </div>
        <p> <b>First name: </b>{{singleUser.givenName}}</p>
        <p> <b>Last name: </b>{{singleUser.familyName}}</p>
      </tr>
    </table>
    <router-link v-if="userAdminId == this.$route.params.id" :to="{ name: 'editUser', params: {id: $route.params.id}}">Edit profile</router-link>
    <br><br><div id="photo" v-if="userAdminId == this.$route.params.id">
      <label for="file">Upload a picture</label>
      <input type="file" name="file" id="file" ref="file" v-on:change="newPhoto">
      <button v-if="photoFlag" type="button" class="Button" v-on:click="uploadPhoto">Upload photo</button><br><br>
    <button type="button" class="Button" v-on:click="deletePhoto">Delete Profile picture</button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        singleUser: [],
        userPhoto: "",
        userAdminId: "",
        userId: "",
        userPhotoUpdate: "",
        photoType: "",
        photoFlag: false
      }
    },
    mounted: function () {
      this.getUser(this.$route.params.id);
      this.checkAdmin();

    },
    methods: {
      getUser: function (user_id) {
        this.$http.get('http://localhost:4941/api/v1/users/' + user_id,
          {headers: {'X-Authorization': localStorage.getItem('authToken')}})
          .then(function (userResponse) {
            this.$http.get('http://localhost:4941/api/v1/users/' + user_id + '/photo')
              .then(function (photoResponse) {
                console.log(photoResponse)
              }, function () {
                this.userPhoto = require('./assets/download.png')
              });
            this.userPhoto = 'http://localhost:4941/api/v1/users/' + user_id + '/photo';
            //this.userPhoto = require('./assets/default.png');
            this.userId = user_id;
            this.singleUser = userResponse.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      checkAdmin: function() {
        if (localStorage.getItem('userId')) {
          this.userAdminId = localStorage.getItem('userId');
          console.log(this.userAdminId)
        }
      },
      newPhoto: function () {
        this.userPhotoUpdate = this.$refs.file.files[0];
        this.photoType = this.$refs.file.files[0].type;
        this.userPhotoUpdate = event.target.files[0];
        this.photoFlag = true;
        console.log(this.userPhotoUpdate.type);
        console.log(this.userPhotoUpdate.size);
      },

      uploadPhoto: function (event) {
        event.preventDefault();
        console.log(this.userPhotoUpdate.type);
        if (!this.userPhotoUpdate) {
          alert("No file has been chosen");
        } else if (this.userPhotoUpdate.type != 'image/png' && this.userPhotoUpdate.type != 'image/jpeg') {
          alert("Image must be in png or jpeg format")
        } else if (this.userPhotoUpdate.size > 20000000) {
          alert("Image size is too large")
        } else {
          this.$http.put('http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo', this.userPhotoUpdate,
            {headers: {'Content-Type': this.photoType,
                'X-Authorization': localStorage.getItem('authToken')}})
            .then(response => {
              this.userPhoto = 'http://localhost:4941/api/v1/users/'  + this.$route.params.id + '/photo';
              this.$router.go();
            }, function(error){
              this.error = error;
              this.errorFlag = true;
            })
        }
      },
      deletePhoto: function (event) {
        event.preventDefault();
        this.$http.delete('http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo',
          {headers: {'X-Authorization': localStorage.getItem('authToken')}})
          .then(response => {
            this.userPhoto =  require('./assets/download.png');
            this.$router.go();
          }, function (error) {
            alert("You already have no photo")
            console.log(this.userPhoto)
            console.log(error)
            this.error = error;
            this.errorFlag = true;
          })
      }

    }
  }
</script>
