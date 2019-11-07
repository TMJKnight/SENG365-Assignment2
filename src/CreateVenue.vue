<template>
  <div align="center">
    <div class="sidenav">
      <router-link :to="{ name: 'home'}">Back to Home</router-link>
    </div>
    <div >
  <h2>Create a venue:</h2>
      <form v-on:submit="createVenue">
        Venue Name:<br>
        <input type="text" required v-model="venueName"><br>
        <!-- Insert category fields -->
        Venue Category:<br>
        <select name="venueCategory" required id="venueCategory" v-model="categorySelect">
          <option v-model="categorySelect" v-for="category in venueCategoryList">{{ category['categoryName'] }}</option>
        </select><br>
        City:<br>
        <input type="text" required v-model="city"><br>
        Short Description:<br>
        <input type="text" required v-model="shortDescription"><br>
        Long Description:<br>
        <input type="text" required v-model="longDescription"><br>
        Address:<br>
        <input type="text" required v-model="address"><br>
        Latitude:<br>
        <input type="text" required v-model="latitude"><br>
        Longitude:<br>
        <input type="text" required v-model="longitude"><br>
        <input type="submit" value="Add venue">
      </form>
  </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        error: "",
        errorFlag: false,
        venueName: "",
        categoryId: "",
        city: "",
        shortDescription: "",
        longDescription: "",
        address: "",
        latitude: "",
        longitude: "",
        venueCategoryList: [],
        categorySelect: ""

      }
    },
    mounted: function () {
      this.checkLogin();
      this.getVenueCategories();
    },
    methods: {
      createVenue: function (event) {
        event.preventDefault();


        let categoryId = 0;
        for (let i = 0; i < this.venueCategoryList.length; i++) {
          if (this.venueCategoryList[i]['categoryName'] === this.categorySelect){
            categoryId = i + 1;
          }
        }
        this.latitude = Number(this.latitude);
        this.longitude = Number(this.longitude);
        this.$http.post('http://localhost:4941/api/v1/venues/', {
          "venueName": this.venueName,
          "categoryId": categoryId,
          "city": this.city,
          "shortDescription": this.shortDescription,
          "longDescription": this.longDescription,
          "address": this.address,
          "latitude": this.latitude,
          "longitude": this.longitude
        }, {headers: {'X-Authorization': localStorage.getItem('authToken')}})
          .then(function (response) {
            alert('Venue has been successfully added');
            this.$router.push('/venues')
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      checkLogin: function () {
        if (! localStorage.getItem('authToken')) {
          this.errorFlag = "Not logged in!";
          this.errorFlag = true;
          this.$router.push('/');
        }
      },

      getVenueCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (categoryResponse) {
              this.venueCategoryList = categoryResponse.data
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
    }
  }

</script>
