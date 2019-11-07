<template>
  <div align="center">
  <div class="sidenav">
    <p><router-link :to="{ name: 'venue', params: {id: $route.params.id}}">Back to Venue</router-link></p>
  </div>
  <div >
    <h2>Edit a venue:</h2>
    <form v-on:submit="updateVenue">
      Venue Name:<br>
      <input type="text"  v-model="vName"><br>
      <!-- Insert category fields -->
      Venue Category:<br>
      <select name="venueCategory" required id="venueCategory" v-model="categorySelect">
        <option v-model="categorySelect" required v-for="category in venueCategoryList">{{ category['categoryName'] }}</option>
      </select><br>
      City:<br>
      <input type="text"  v-model="venueCity"><br>
      Short Description:<br>
      <input type="text"  v-model="venueShortDescription"><br>
      Long Description:<br>
      <input type="text"  v-model="venueLongDescription"><br>
      Address:<br>
      <input type="text"  v-model="venueAddress"><br>
      Latitude:<br>
      <input type="text"  v-model="venueLatitude"><br>
      Longitude:<br>
      <input type="text"  v-model="venueLongitude"><br>
      <input type="submit" value="Edit venue">
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
        vName: "",
        categoryId: "",
        venueCity: "",
        venueShortDescription: "",
        venueLongDescription: "",
        venueAddress: "",
        venueLatitude: "",
        venueLongitude: "",
        venueCategoryList: [],
        categorySelect: "",
        singleVenue: [],

      }
    },
    mounted: function () {
      this.checkLogin();
      this.getSingleVenue();
      this.getVenueCategories();
    },
    methods: {
      checkLogin: function() {
        if (!localStorage.getItem('authToken')) {
          this.error = "Not logged in!";
          this.errorFlag = true;
          //this.$router.push('/venues');
        }
      },
      updateVenue: function(event) {
        event.preventDefault();
        let categoryId = 0;
        for (let i = 0; i < this.venueCategoryList.length; i++) {
          if (this.venueCategoryList[i]['categoryName'] === this.categorySelect){
            categoryId = i + 1;
          }
        }
        if (this.vName === "") {
          this.vName = this.singleVenue.venueName;
        }
        if (this.venueCity === "") {
          this.venueCity = this.singleVenue.city;
        }
        if (this.venueShortDescription === "") {
          this.venueShortDescription = this.singleVenue.shortDescription;
        }
        if (this.venueLongDescription === "") {
          this.venueLongDescription = this.singleVenue.longDescription;
        }
        if (this.venueAddress === "") {
          this.venueAddress = this.singleVenue.address;
        }
        if (this.venueLatitude === "") {
          this.venueLatitude = this.singleVenue.latitude;
        }
        if (this.venueLongitude === "") {
          this.venueLongitude = this.singleVenue.longitude;
        }
        if (this.venueCity === "") {
          this.venueCity = this.singleVenue.city;
        }
        if (this.categorySelect === "") {
          this.categorySelect = this.singleVenue.categoryName;
        }
        this.venueLatitude = Number(this.venueLatitude);
        this.venueLongitude = Number(this.venueLongitude);

        this.$http.patch('http://localhost:4941/api/v1/venues/' + this.$route.params.id, {
          "venueName": this.vName,
          "categoryId": categoryId,
          "city": this.venueCity,
          "shortDescription": this.venueShortDescription,
          "longDescription": this.venueLongDescription,
          "address": this.venueAddress,
          "latitude": this.venueLatitude,
          "longitude": this.venueLongitude
        }, {headers: {'X-Authorization': localStorage.getItem('authToken')}})
          .then(function (response) {
            alert("The venue has been successfully edited");
            this.$router.push('/venues/' + this.$route.params.id);
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getSingleVenue: function () {
        this.$http.get('http://localhost:4941/api/v1/venues/' + this.$route.params.id)
          .then(function (venueResponse) {
            if (venueResponse.data['longDescription'] === "") {
              venueResponse.data['longDescription'] = "No long description available"
            }
            this.singleVenue = venueResponse.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
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
