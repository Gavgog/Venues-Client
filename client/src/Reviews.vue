<template>
  <div>
    <div v-if="errorFlag" style="color:red;">
      {{ error }}
    </div>

    <div id="Reviews">
      Reviews For {{venueName}}
      <div id="backButton">
        <router-link :to="{ path: '/venues/' + $route.params.venueId }">
          <div id="button">Back to venue</div>
        </router-link>
      </div>
      <table id="ReviewTable">
        <tr>
          <th> Reviewer </th>
          <th> Review </th>
          <th> Star Rating </th>
          <th> Cost Rating </th>
          <th> TimeStamp </th>
        </tr>
        <tr v-for="review in reviews">
          <td> {{ review.reviewAuthor.username }} </td>
          <td> {{ review.reviewBody }} </td>
          <td> {{ review.starRating }} </td>
          <td> {{ review.costRating }} </td>
          <td> {{ review.timePosted }} </td>
        </tr>
      </table>
      <div class="selectRow"
           v-if="this.$cookie.get('token')"
           data-dismiss="modal"
           v-on:click.prevent="openReview()">

        <p> + Add review </p>
      </div>
    </div>


    <div id="myReview" v-if="this.leaveReview">


      <form id="reviewBox">

        <p id="myTv"> My Review </p>

      <table id="reviewInputTable">
        <tr><td class="itd">
          <label for="fname">Review Comment:</label>
        </td><td>
          <input type="text" v-model="review" id="fname" name="firstname" placeholder="Your review here..">
        </td></tr>


        <tr><td class="itd">
          <label for="SRating">Star Rating out of 5:</label>
        </td><td>
          <input type="text" v-model="star" id="SRating" name="lastname" placeholder="5">
        </td></tr>

        <tr><td class="itd">
          <label for="CRating">Cost Rating out of 5:</label>
        </td><td>
          <input type="text" v-model="cost" id="CRating" name="lastname" placeholder="1">
        </td></tr>


        <tr><td></td><td>
          <input type="submit" value="Submit" class="selectRow"
                 v-if="this.$cookie.get('token')"
                 data-dismiss="modal"
                 v-on:click.prevent="submitReview()">
        </td></tr>
      </table>
      </form>
      <br>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        reviews: [],
        venueName: "",
        leaveReview: false,
        cost:"",
        star: "",
        review: ""
      }
    },
    mounted: function () {
      this.getUsers();
    },
    methods: {


      submitReview: function(){
        let id = this.$route.params.venueId;
        let reviewInfo = {
          reviewBody: this.review,
          starRating: Number(this.star),
          costRating:  Number(this.cost)
        };

        let reviewInfoS = JSON.stringify(reviewInfo);
        console.log(reviewInfoS);

        this.$http.post('http://localhost:4941/api/v1/venues/' + id + '/reviews', reviewInfoS,
          {headers: {
            'X-Authorization': this.$cookie.get('token')
          }}
            ).then(function (response) {
          location.reload();
        },function (error){
          if (error){
            alert(error.statusText);
          } else {
            this.error = error;
            this.errorFlag = true;
          }
        });
      },


      openReview: function() {
        if (!this.leaveReview) this.leaveReview = true;
        else this.leaveReview = false;
      },


      getUsers: function () {
        this.$http.get('http://localhost:4941/api/v1/venues/'+ this.$route.params.venueId +'/reviews')
          .then(function (response) {


            function comparator(a, b) {
              if (a.timePosted < b.timePosted) return -1;
              if (a.timePosted > b.timePosted) return 1;
              return 0;
            }

            let sortedReviews  = response.data.sort(comparator);

            this.reviews = sortedReviews;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
        this.$http.get('http://localhost:4941/api/v1/venues/'+ this.$route.params.venueId )
          .then(function (response) {
            this.venueName = response.data.venueName;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      }
    }
  }
</script>

<style scoped>

  #myTv{
    text-indent:20px;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:36px;
    line-height: 36px;
    width:100%;
  }

  #reviewInputTable{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:20px;
    line-height: 30px;
    width:100%;
  }

  #reviewBox{
    margin:20px;
    background-color: #f2f2f2;
    padding: 20px;
  }

  #Reviews{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:28px;
    line-height: 50px;
    text-indent: 10px;
    background-color: #29B6F6;
    color: white;
  }

  #ReviewTable {
    border-collapse: collapse;
    background-color: #FFFFFF;
    color:black;
    width: 100%;
  }

  #ReviewTable td, #ReviewTable th {
    padding: 8px;
    line-height: 40px;
    font-size:16px;
  }

  #ReviewTable tr:nth-child(even){background-color: #f2f2f2;}

  #ReviewTable th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #29B6F6;
    color: white;
    font-size:22px;
    line-height: 20px;
  }

  #backButton{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:18px;
    line-height: 18px;
    float:right;
    width:150px;
  }

  #button{
    text-align: center;
    margin:0px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    background-color: #29B6F6;
    width:150px;
    height:50px;
    line-height: 50px;
    color:white;
  }

  #button:hover{
    background-color: #81D4FA;
  }

  .selectRow{
    cursor: pointer;
    text-align: center;
    padding-top: 6px;
    padding-bottom: 6px;
    background-color: #29B6F6;
    color: white;
    font-size:22px;
    line-height: 20px;
  }
  .selectRow:hover{
    background-color: #81D4FA;
    color: white;
    font-size:22px;
    line-height: 20px;
  }


  input[type=text], select {
    width: 70%;
    padding: 12px 20px;
    margin-left: auto;
    margin-right:auto;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  input[type=submit] {
    width: 70%;
    background-color: #29B6F6;
    color: white;
    padding: 14px 20px;
    margin-left: auto;
    margin-right:auto;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  input[type=submit]:hover {
    background-color: #81D4FA;
  }


</style>
