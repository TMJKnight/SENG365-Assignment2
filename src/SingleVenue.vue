<template>
  <div v-if="$route.params.id">
    <div id="venue" align="center">
      <div class="sidenav">
        <p><router-link :to="{ name: 'venues'}">Back to Venues</router-link></p>
        <router-link v-if="venueAdminId != singleVenue.admin.userId && !beenReviewed && logFlag" :to="{ name: 'createReview', params: {id: $route.params.id}}">Post a review</router-link>
        <router-link v-if="venueAdminId == singleVenue.admin.userId" :to="{ name: 'editVenue', params: {id: $route.params.id}}">Edit venue</router-link>
        <br><br><div v-if="venueAdminId == singleVenue.admin.userId">
        <label for="fileName">Upload a picture</label>
        <input class="orange--text" type="file" name="file" accept=".jpeg, .png" id="fileName" ref="file"
               v-on:change="newPhoto">
        <button v-if="newVenuePhoto"  type="button" class="Button" v-on:click="uploadPhoto">Upload photo</button><br><br>
        <button  type="button" class="Button" v-on:click="togglePrimary">Make Primary photo</button><br>
        </div>
      </div>
      <!--{{ singleVenue }}-->

      <br/><br/>

      <table>
        <tr>
          <h2>{{singleVenue.venueName}}</h2>
          <img v-bind:src="singleVenue.photo" height="120" width="120" alt="Venue image"><br><br>
          <p><b>Category: </b>{{singleVenue.category.categoryName}}</p>
          <p><b>Administrator: </b>{{singleVenue.admin.username}}<router-link :to="{name: 'user', params: {id: singleVenue.admin.userId}}"> View the admins profile</router-link></p>
          <p><b>City: </b>{{singleVenue.city}}</p>
          <p><b>Address: </b>{{singleVenue.address}}</p>
          <p><b>Date Added: </b>{{singleVenue.dateAdded}}</p>
          <details><summary><b>Description: </b>{{singleVenue.shortDescription}}</summary>
            <p>{{singleVenue.longDescription}}</p>
          </details>
          <br>
          <p><b>Mean Star Rating: </b>{{singleVenue.meanStarRating}}</p>
          <p><b>Mode Cost Rating: </b>{{singleVenue.modeCostRating}}</p>
        </tr>



        <h3>Photo Gallery </h3>
        <div v-for="photo in venuePhotos">
          <div>
          <img v-bind:src="url + 'venues/' + $route.params.id +  '/photos/' + photo['photoFilename']" height="120" width="120" alt="Venue image">
            <button v-if="!photo['isPrimary'] && venueAdminId == singleVenue.admin.userId" v-on:click="makePrimary(photo)">Make Photo Primary </button>
            <button v-if="venueAdminId == singleVenue.admin.userId" v-on:click="deletePhoto(photo)"> Delete photo</button>
          </div>
        </div>

        <h3>Reviews</h3>
        <tr v-for="review in reviews">
          <p><b>Review by: </b>{{review.reviewAuthor.username}}<router-link :to="{name: 'user', params: {id: review.reviewAuthor.userId}}"> View this reviewers profile</router-link></p>
          <p><b>Posted on: </b>{{review.timePosted}}</p>
          <p>{{review.reviewBody}}</p>
          <p><b>Star Rating: </b>{{review.starRating}}</p>
          <p><b>Cost Rating: </b>{{review.costRating}}</p>
          <br>
        </tr>


      </table>

    </div>

  </div>
</template>

<script>

    export default {
      data() {
        return {
          error: "",
          errorFlag: false,
          singleVenue: [],
          reviews: [],
          venueAdminId: "",
          beenReviewed: false,
          logFlag: false,
          reviewId: "",
          venuePhotoUpdate: "",
          photoType: "",
          venuePhoto: "",
          venuePhotoDescription: "",
          makePhotoPrimary: false,
          newVenuePhoto: "",
          venuePhotos: [],
          url: "http://localhost:4941/api/v1/",
          photoFlag: false,
          photoUploadFlag: false
        }
      },
      mounted: function () {
        this.getSingleVenue(this.$route.params.id);
        this.getVenueReview(this.$route.params.id);
        this.checkAdmin();
        this.checkLogIn();

      },
      methods: {
        getSingleVenue: function (venue_id) {
          this.$http.get('http://localhost:4941/api/v1/venues/' + venue_id)
            .then(function (venueResponse) {
              if (venueResponse.data['longDescription'] === "") {
                venueResponse.data['longDescription'] = "No long description available"
              }
              this.venuePhotos = venueResponse.data['photos'];
              this.$http.get('http://localhost:4941/api/v1/venues')
              .then(function (response) {
                for (let i = 0; i < response.data.length; i++) {
                  if (response.data[i]['venueId'] == venue_id) {
                    venueResponse.data['meanStarRating'] = response.data[i]['meanStarRating'];
                    venueResponse.data['modeCostRating'] = response.data[i]['modeCostRating'];

                    // this.$http.get('http://localhost:4941/api/v1/venues/' + venue_id + '/photos')
                    //   .then(function (photoResponse) {
                    //     console.log(photoResponse);
                    //   }, function () {
                    //     this.venuePhoto = require('./assets/default.png')
                    //   });
                    // this.venuePhoto = 'http://localhost:4941/api/v1/venues/' + venue_id + '/photos'

                    if (response.data[i]['primaryPhoto']) {
                     venueResponse.data['photo'] = 'http://localhost:4941/api/v1/venues/' + venue_id + '/photos/' + response.data[i]['primaryPhoto'];
                    } else {
                      venueResponse.data['photo'] = require('./assets/default.png');
                    }
                  }
                }
                this.singleVenue = venueResponse.data;
              });

            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        },
        getVenueReview: function(venue_id) {
          this.$http.get('http://localhost:4941/api/v1/venues/' + venue_id + '/reviews')
            .then(function (reviewResponse) {
              this.reviews = reviewResponse.data;
              for(let i = 0; i < this.reviews.length; i++) {
                console.log('gihgiutymnoh');
                console.log(this.reviews[i]);
                console.log(localStorage.getItem('userId'));
                if (this.reviews[i].reviewAuthor.userId == this.venueAdminId) {
                  this.beenReviewed = true;
                }
              }
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        },
        checkAdmin: function() {
          if (localStorage.getItem('userId')) {
            this.venueAdminId = localStorage.getItem('userId');
          }
        },
        checkLogIn: function() {
          console.log(localStorage);
          if (localStorage.getItem('authToken')) {
            this.logFlag = true;
          } else {
            this.logFlag = false;
          }
        },




        newPhoto: function () {
          // for (let i = 0; i<this.$refs.file.files.length; i++){
          //   this.venuePhotos.push(this.$refs.file.files[i]);
          // }

          var fileName = document.getElementById("fileName").value;
          console.log(fileName);
          var idxDot = fileName.lastIndexOf(".") + 1;
          var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
          if (extFile == "jpeg" || extFile == "png" || extFile == "jpg") {
            this.newVenuePhoto = event.target.files[0];
            var fileSize = this.newVenuePhoto.size;
            if (fileSize / 1024 / 1024 <= 20) {
            } else {
              document.getElementById("fileName").value = "";
              this.newVenuePhoto = null;
              alert("Photo Size cannot be greater than 20MB")
            }
          } else {
            alert("Only jpeg and png files are allowed!");
          }
        },

        uploadPhoto: function (event) {

          event.preventDefault();
          const requestBody = new FormData();
          requestBody.set("description", this.venuePhotoDescription);
          requestBody.set("makePrimary", this.makePhotoPrimary);
          requestBody.set("photo", this.newVenuePhoto);
          let headers = {
            headers: {
              'Content-Type': "multipart/form-data",
              'X-Authorization': localStorage.getItem('authToken')
            }
          };
          this.$http.post(this.url + 'venues/' + this.$route.params.id + '/photos', requestBody, headers)
            .then(response => {
              alert("Photo Has been Added");
              this.makePhotoPrimary = true;
              this.getSingleVenue(this.$route.params.id);
              this.$router.go();
            }, function (error) {
              alert("No file has been chosen");
              console.log(error);
              this.error = error;
              this.errorFlag = true;
            })
        },
        deletePhoto: function (venuePhoto) {
         let headers = {
           headers: {
             'X-Authorization' : localStorage.getItem('authToken')
           }
         };
         this.$http.delete('http://localhost:4941/api/v1/venues/' + this.$route.params.id + '/photos/' + venuePhoto['photoFilename'], headers)
           .then(response => {
             this.getSingleVenue(this.$route.params.id);
           }, function(error){
             alert('Photo could not be deleted');
             this.error = error;
             this.errorFlag = true;
           })
        },
        togglePrimary: function (event) {
          event.preventDefault();
          this.makePhotoPrimary = !this.makePhotoPrimary;
          alert("The Photo Uploaded will be primary: " + this.makePhotoPrimary);
        },

        makePrimary: function (venuePhoto) {
          let headers = {
            headers: {
              'X-Authorization' : localStorage.getItem('authToken')
            }
          };
          this.$http.post('http://localhost:4941/api/v1/venues/' + this.$route.params.id + '/photos/' + venuePhoto['photoFilename'] + '/setPrimary', {}, headers)
            .then(response => {
              this.getSingleVenue(this.$route.params.id);
            }, function (error) {
              alert("Venue photo could not be made primary")
              this.error = error;
              this.errorFlag = true;
            });
        }
      }
    }
</script>
