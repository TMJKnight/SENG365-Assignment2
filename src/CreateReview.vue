<template>
    <div align="center">
      <div class="sidenav">
      <p><router-link :to="{ name: 'venue', params: {id: $route.params.id}}">Back to Venue</router-link></p>
    </div>
      <h2>Post a review:</h2>
      <form v-on:submit="createReview">
        Review:<br>
        <textarea type="text" rows="8" cols="50" required v-model="reviewBody"><br></textarea><br>
        <label>Star rating</label>
        <select required v-model="starRating">
          <option value=1 v-model="starRating">1 Star</option>
          <option value=2 v-model="starRating">2 Stars</option>
          <option value=3 v-model="starRating">3 Stars</option>
          <option value=4 v-model="starRating">4 Stars</option>
          <option value=5 v-model="starRating">5 Stars</option>
        </select>

        <br><br>
        <label>Cost Rating</label>
        <select  requiredv-model="costRating">
          <option value=0 v-model="costRating">Free</option>
          <option value=1 v-model="costRating">$</option>
          <option value=2 v-model="costRating">$$</option>
          <option value=3 v-model="costRating">$$$</option>
          <option value=4 v-model="costRating">$$$$</option>
        </select><br>


        <input type="submit" value="Submit review">
      </form>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        reviewBody: "",
        starRating: "",
        costRating: "",
        beenReviewed: false
      }
    },
    mounted: function () {

    },
    methods: {
      createReview: function (event) {
        event.preventDefault()

        this.starRating = Number(this.starRating);
        this.costRating = Number(this.costRating);
        this.$http.post('http://localhost:4941/api/v1/venues/' + this.$route.params.id + '/reviews', {
          "reviewBody": this.reviewBody,
          "starRating": this.starRating,
          "costRating": this.costRating
        }, {headers: {'X-Authorization': localStorage.getItem('authToken')}})
          .then(function (response) {
            console.log("herhe")
            alert('Review has been successfully Added');
            this.beenReviewed = true;
            this.$router.push('/venues/' + this.$route.params.id)
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      }
    }
  }

</script>
