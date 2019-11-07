<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>


    <div v-else>
      <div class="sidenav" align="center">
        <p>
          <router-link :to="{ name: 'home'}">Home</router-link>
        </p>
        <p>
          <router-link v-if="logFlag === 'true'" :to="{ name: 'createVenue' }">Add a venue</router-link>
        </p>
        <br><br>
        <h2>Filter Venues:</h2><br>
        <form v-on:submit="getVenuesSorted()">
          <input type="text" v-model="citySelect" placeholder="Search cities"/>
          <br><br>
          <input type="text" v-model="nameSelect" placeholder="Search venue"/>

          <br><br>
          <label id="venueCategoryLabel" for="venueCategory"> Venue Category</label>
          <select name="venueCategory" id="venueCategory" v-model="categorySelect">
            <option v-model="categorySelect" v-for="category in venueCategoryList">{{ category['categoryName'] }}
            </option>
          </select>
          <br><br>
          <label><b>Sort by</b></label>
          <select id="sortOption" v-model="sortMethod">
            <option v-model="categorySelect">Descending mean star rating</option>
            <option v-model="categorySelect">Ascending mean star rating</option>
            <option v-model="categorySelect">Descending mode cost rating</option>
            <option v-model="categorySelect">Ascending mode cost rating</option>
            <option v-if="trackFlag" v-model="categorySelect">Closest venues</option>
            <option v-if="trackFlag" v-model="categorySelect">Furthest venues</option>


          </select>

          <br><br>
          <label>Minimum Number of Stars</label>
          <select id="minimumStars" v-model="minimumStars">
            <option v-model="minimumStars">1 Star</option>
            <option v-model="minimumStars">2 Stars</option>
            <option v-model="minimumStars">3 Stars</option>
            <option v-model="minimumStars">4 Stars</option>
            <option v-model="minimumStars">5 Stars</option>
          </select>

          <br><br>
          <label>Maximum Cost Rating</label>
          <select id="maximumCost" v-model="maximumCost">
            <option v-model="maximumCost">Free</option>
            <option v-model="maximumCost">$</option>
            <option v-model="maximumCost">$$</option>
            <option v-model="maximumCost">$$$</option>
            <option v-model="maximumCost">$$$$</option>
          </select>
          <br><br>

          <input type="submit" value="Search">
        </form>
        <br>
        <div v-if="logFlag == 'true'">
          <form v-on:submit="getVenuesSorted()">

          </form>
          <b>Reset search to clear search fields</b><br><br>
          <form v-on:submit="getVenues">
            <input type="submit" value="Reset Search">
          </form><br><br>
          <form v-on:submit="seeAdminVenues()">
            <input type="submit" value="See my venues">
          </form>
          <br>
        </div>

        <br>


        <div id="divfix2" class="divFix2">
          <button v-if="startIndex > 0" v-on:click="prevPage"> Previous page</button>
          <button v-if="venues.length == 10 && venueLength != startIndex + venues.length " v-on:click="nextPage">Next page</button>
        </div>

        <p><b>Venues: {{startIndex + 1}} - {{startIndex + venues.length}}</b></p>


      </div>


      <div id="venues" align="center">
        <h1>Venues</h1><br><br>
        <!--<table>-->
        <div  v-for="venue in venues">
          <!--<td> {{ venue }}</td>-->
          <h2> {{ venue.venueName }}</h2>
          <img v-bind:src="venue.photo" height="120" width="120" alt="Venue image">
          <p><b>Category: </b>{{ venue.categoryName}}</p>
          <p><b>Mean star rating: </b>{{ venue.meanStarRating }}</p>
          <p><b>Mode cost rating: </b>{{ venue.modeCostRating }}</p>
          <p>
            <router-link :to="{ name: 'venue', params: {id: venue.venueId}}">View venue</router-link>
          </p>
          <br>


        </div>
        <!--</table>-->
      </div>
    </div>
  </div>

</template>

<script>


  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        venues: [],
        citySelect: "",
        nameSelect: "",
        categorySelect: "",
        venueCategoryList: [],
        sortMethod: "",
        minimumStars: "",
        maximumCost: "",
        singleVenue: [],
        logFlag: "",
        isAdmin: "",
        venueAdminId: "",
        lat: "",
        lon: "",
        trackFlag: true,
        startIndex: 0,
        venueCount: 10,
        adminFlag: false,
        venueLength: ""
      }
    },
    mounted: function () {
      this.getVenues();
      this.getVenueCategories();
      this.checkLogIn();
      this.getPosition();
      this.getTotalLength();
    },
    methods: {

      getVenues: function () {
        let url = 'http://localhost:4941/api/v1/';
        this.$http.get(url + 'venues?startIndex=' + this.startIndex + '&count=' + this.venueCount)
          .then(function (venueResponse) {
            // Getting a venue's category
            this.$http.get(url + 'categories')
              .then(function (categoryResponse) {

                for (let i = 0; i < venueResponse.data.length; i++) {

                  for (let j = 0; j < categoryResponse.data.length; j++) {
                    if (venueResponse.data[i]['categoryId'] === categoryResponse.data[j]['categoryId']) {
                      venueResponse.data[i]['categoryName'] = categoryResponse.data[j]['categoryName']
                    }
                  }
                  // Getting a venue's photo
                  if (venueResponse.data[i]['primaryPhoto']) {
                    venueResponse.data[i]['photo'] = url + 'venues/' + venueResponse.data[i]['venueId'] + '/photos/' + venueResponse.data[i]['primaryPhoto'];
                  } else {
                    venueResponse.data[i]['photo'] = 'src/assets/default.png';
                  }
                  if (!venueResponse.data[i]['meanStarRating']) {
                    venueResponse.data[i]['meanStarRating'] = 3;
                  }
                  if (!venueResponse.data[i]['modeCostRating']) {
                    venueResponse.data[i]['modeCostRating'] = 0;
                  }
                }
                this.venues = venueResponse.data;
                console.log(this.venues)
              });

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },


      getPosition: function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
        } else {
          alert('No tracking');
          this.error = "Geolocation is not supported.";
        }

      },
      showPosition: function (position) {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
      },
      showError: function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.trackFlag = false;
            alert("You have not enabled browser location tracking")
        }
      },

      getVenuesSorted: function () {
        event.preventDefault();

        let categoryId = 0;
        for (let i = 0; i < this.venueCategoryList.length; i++) {
          if (this.venueCategoryList[i]['categoryName'] === this.categorySelect) {
            categoryId = i + 1;
          }
        }


        let queryParams = "";

        queryParams += '&startIndex=' + this.startIndex + '&count=' + this.venueCount;

        let url = 'http://localhost:4941/api/v1/venues';
        if (this.citySelect) {
          queryParams += '&city=' + this.citySelect;
        }
        if (this.nameSelect) {
          queryParams += '&q=' + this.nameSelect;
        }
        if (this.categorySelect) {
          queryParams += '&categoryId=' + categoryId
        }

        if (this.sortMethod) {
          if (this.sortMethod === "Descending mean star rating") {
            queryParams += '&sortBy=STAR_RATING';
          }
          if (this.sortMethod === "Ascending mean star rating") {
            queryParams += '&sortBy=STAR_RATING&reverseSort=true';
          }
          if (this.sortMethod === "Descending mode cost rating") {
            queryParams += '&sortBy=COST_RATING&reverseSort=true';
          }
          if (this.sortMethod === "Ascending mode cost rating") {
            queryParams += '&sortBy=COST_RATING';
          }
          if (this.sortMethod === "Closest venues") {
            queryParams += '&myLatitude=' + Number(this.lat) + '&myLongitude=' + Number(this.lon) + '&sortBy=DISTANCE'
          }
          if (this.sortMethod === "Furthest venues") {
            queryParams += '&myLatitude=' + Number(this.lat) + '&myLongitude=' + Number(this.lon) + '&sortBy=DISTANCE&reverseSort=true'
          }
        }

        if (this.minimumStars) {
          if (this.minimumStars === '1 Star') {
            queryParams += '&minStarRating=1'
          }
          if (this.minimumStars === '2 Stars') {
            queryParams += '&minStarRating=2'
          }
          if (this.minimumStars === '3 Stars') {
            queryParams += '&minStarRating=3'
          }
          if (this.minimumStars === '4 Stars') {
            queryParams += '&minStarRating=4'
          }
          if (this.minimumStars === '5 Stars') {
            queryParams += '&minStarRating=5'
          }
        }

        if (this.maximumCost) {
          if (this.maximumCost === 'Free') {
            queryParams += '&maxCostRating=0'
          }
          if (this.maximumCost === '$') {
            queryParams += '&maxCostRating=1'
          }
          if (this.maximumCost === '$$') {
            queryParams += '&maxCostRating=2'
          }
          if (this.maximumCost === '$$$') {
            queryParams += '&maxCostRating=3'
          }
          if (this.maximumCost === '$$$$') {
            queryParams += '&maxCostRating=4'
          }
        }

        if (this.adminFlag) {
          queryParams += '&adminId=' + localStorage.getItem('userId')

        }


        queryParams = queryParams.replace('&', '?');
        url += queryParams;

        this.$http.get(url)
          .then(function (venueResponse) {
            // Getting a venue's category
            this.$http.get(url = 'http://localhost:4941/api/v1/categories')
              .then(function (categoryResponse) {
                for (let i = 0; i < venueResponse.data.length; i++) {
                  for (let j = 0; j < categoryResponse.data.length; j++) {
                    if (venueResponse.data[i]['categoryId'] === categoryResponse.data[j]['categoryId']) {
                      venueResponse.data[i]['categoryName'] = categoryResponse.data[j]['categoryName']
                    }
                  }
                  // Getting a venue's photo
                  if (venueResponse.data[i]['primaryPhoto']) {
                    venueResponse.data[i]['photo'] = 'http://localhost:4941/api/v1/venues/' + venueResponse.data[i]['venueId'] + '/photos/' + venueResponse.data[i]['primaryPhoto'];
                  } else {
                    venueResponse.data[i]['photo'] = 'src/assets/default.png';
                  }
                  if (!venueResponse.data[i]['meanStarRating']) {
                    venueResponse.data[i]['meanStarRating'] = 3;
                  }
                  if (!venueResponse.data[i]['modeCostRating']) {
                    venueResponse.data[i]['modeCostRating'] = 0;
                  }
                }
                this.venues = venueResponse.data;
              });
          }, function (error) {

            console.log(error)
            if (error.PERMISSION_DENIED) {
              alert("You have not enabled browser location tracking")
            } else {
              //alert("You have not enabled browser location tracking")
              alert("City has to be a string")

            }

          });
      },

      getVenueCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (categoryResponse) {
            this.venueCategoryList = categoryResponse.data
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      checkLogIn: function () {
        console.log(localStorage);
        if (localStorage.getItem('authToken')) {
          this.logFlag = 'true';
        } else {
          this.logFlag = 'false';
        }
      },
      checkAdmin: function () {
        if (localStorage.getItem('userId')) {
          this.venueAdminId = localStorage.getItem('userId');
        }
      },
      nextPage: function (event) {

        event.preventDefault();

        this.startIndex += 10;
        //console.log(this.venues);
        this.getVenuesSorted()
      },
      prevPage: function (event) {

        event.preventDefault();
        this.startIndex -= 10;
        this.getVenuesSorted()
      },
      seeAdminVenues: function () {
        this.adminFlag = true;
        this.getVenuesSorted()
      },
      getTotalLength : function () {
        let url = 'http://localhost:4941/api/v1/';
        this.$http.get(url + 'venues')
          .then(function (venueResponse) {
            this.venueLength = venueResponse.data.length;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      }
    }
  }
</script>
