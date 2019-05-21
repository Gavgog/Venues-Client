<template>

  <div>
    <div v-if="errorFlag" style="color:red;">
      {{ error }}
    </div>
    <!-- Vue modal for Reviews  -->


    <div id="users">

      <div id="searchBar">
        <div id="filterBar">
          Search by:
          <select id="filterBy">
            <option value="name">Name</option>
            <option value="city">City</option>
            <option value="cat">Category</option>
          </select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Sort by:
          <select id="sortBy"  v-model="sortB">
            <option value="Star">Star Rating</option>
            <option value="Cost">Cost Rating</option>
          </select>
          <select id="sortType"  v-model="sortT">
            <option value="htl">Highest to Lowest</option>
            <option value="lth">Lowest to Highest</option>
          </select>
          <input type="submit" value="Advanced search" class="selectRow" id="Asearch"
                 v-on:click.prevent="openAS()">
        </div>



        <div id="advancedSearch" v-if="advancedOpen">
          <div id="advancedBar">
          Max Cost rating:
          <select id="maxCost" v-model="maxCost">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4 (None)</option>
          </select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Min Star Rating:
          <select id="minStar"  v-model="minStar">
            <option value="0">0 (None)</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>


          <div id="advancedBar2">
            <input type="submit" v-if="this.$cookie.get('token')" value="See only Venues I admin" class="selectRow" id="Myvenues"
                   v-on:click.prevent="onlyViA()">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Category:
            <select id="catChoose"  v-model="catChoose">
              <option value="All">All</option>
              <option v-for="category in categories" v-bind:value="category.categoryId">{{category.categoryName}}</option>
            </select>
            <input autofocus id="citySearch" type="text" v-model="searchCity" placeholder="City"/>
          </div>

        </div>

        <input autofocus id="search" type="text" v-model="search" placeholder="Search Venues"/>

      </div>

      <div v-if="advancedOpen"><br><br><br><br><br><br><br><br></div>




      <div v-for="venue in filteredVenues" id="venueCard">
        <router-link :to="{ path: '/venues/' + venue.venueId }">
          <table id="venue2">
            <tr id="venue3">
              <td>
                <h2 id="VName"> {{ venue.venueName }}</h2>
                <p id="desc"> {{venue.shortDescription}}</p>
                <table>
                  <tr>
                    <td>
                      <p class="info">{{venue.city}}<span class="dot"></span></p>
                    </td><td>
                      <p class="info">{{categories[Number(venue.categoryId) - 1].categoryName}}<span class="dot"></span></p>
                    </td><td>
                    <p class="info">Star Rating: {{venue.meanStarRating}} / 5 <span class="dot"></span></p>
                    </td><td>
                      <p class="info">Cost Rating: {{venue.modeCostRating}} / 5</p>
                    </td>

                  </tr>
                </table>
              </td>

              <td style="float:right;">
                <img id="image" :src="getImageById(venue.venueId)">
              </td>

            </tr>
          </table>
        </router-link>

      </div>

    </div>


  </div>
</template>


<script>

  export default {
    data() {
      return {
        error: "",
        search: "",
        sortT: "Highest to Lowest",
        sortB: "Star Rating",
        errorFlag: false,
        showModal: false,
        advancedOpen: false,
        onlyMyVenues: false,
        minStar: 0,
        maxCost: 4,
        users: [],
        venue: [],
        categories: [],
        catChoose: "All",
        admins: [],
        searchCity: ""
      }
    },

    mounted: function () {
      this.getUsers();
      this.getSingleVenue();
      this.getOneVenue();
    },

    methods: {

      getImageById: function(venueId){

        let venue = this.getSingleVenue(venueId);

        let photo = venue.primaryPhoto;

        if (photo) return 'http://localhost:4941/api/v1/venues/' + venueId + '/photos/' + photo;
        return "/src/assets/default.jpg";
      },

      openAS: function() {
        if (!this.advancedOpen) this.advancedOpen = true;
        else this.advancedOpen = false;
      },

      onlyViA: function(){
        if (!this.onlyMyVenues) this.onlyMyVenues = true;
        else this.onlyMyVenues = false;
      },

      getUsers: function () {

        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            this.users = response.data;

            for (let i = 0; i < this.users.length; i++) {
              let vanueId = this.users[i].venueId;
              this.$http.get('http://localhost:4941/api/v1/venues/' + vanueId).then(function (response) {

                  this.admins[vanueId] = response.data.admin.userId;
                  console.log("venue of id " + vanueId + " has admin of id "+ this.admins[vanueId]);

                }, function (error) {
                  this.admins[i] = 0;
                });
            }


          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },

      getSingleVenue: function (id) {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users [i].venueId == id) {
            return this.users[i];
          }
        }
      },

      getOneVenue: function (id) {
        id = this.$route.params.venueId;

        if (id === undefined) id = 1;
        this.$http.get('http://localhost:4941/api/v1/venues/' + id)
          .then(function (response) {
            this.venue = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },




    },computed:{
      filteredVenues: function () {
        //sorting -------------------------------------------------------------------

        console.log(this.sortT);//these lines need to stay in
        console.log(this.sortB);
        console.log(this.minStar);//these lines need to stay in
        console.log(this.maxCost);
        console.log(this.admins);

        function ShtlComparator(a, b) {
          if (b.meanStarRating == null) return -1;
          if (a.meanStarRating == null) return 1;
          if (a.meanStarRating > b.meanStarRating) return -1;
          if (a.meanStarRating < b.meanStarRating) return 1;
          return 0;
        }

        function SlthComparator(a, b) {
          if (b.meanStarRating == null) return -1;
          if (a.meanStarRating == null) return 1;
          if (a.meanStarRating < b.meanStarRating) return -1;
          if (a.meanStarRating > b.meanStarRating) return 1;
          return 0;
        }
        function ChtlComparator(a, b) {
          if (b.modeCostRating == null) return -1;
          if (a.modeCostRating == null) return 1;
          if (a.modeCostRating > b.modeCostRating) return -1;
          if (a.modeCostRating < b.modeCostRating) return 1;
          return 0;
        }

        function ClthComparator(a, b) {
          if (b.modeCostRating == null) return -1;
          if (a.modeCostRating == null) return 1;
          if (a.modeCostRating < b.modeCostRating) return -1;
          if (a.modeCostRating > b.modeCostRating) return 1;
          return 0;
        }


        let sortBy = document.getElementById('sortBy');
        let sortType = document.getElementById('sortType');
        let sortTypeS = "htl";
        let sortByS = "Star";

        if (sortBy != null){
          sortByS = sortBy.value;
        }

        if (sortType != null){
          sortTypeS = sortType.value;
        }

        console.log(sortByS + " " + sortTypeS);

        let myArray = this.users;
        if(sortByS === 'Star') {
          if (sortTypeS === 'htl') myArray = myArray.sort(ShtlComparator);
          if (sortTypeS === 'lth') myArray = myArray.sort(SlthComparator);
        }else{
          if (sortTypeS === 'htl') myArray = myArray.sort(ChtlComparator);
          if (sortTypeS === 'lth') myArray = myArray.sort(ClthComparator);
        }



        // filtering -------------------------------------------------------------------
        let conceptName = document.getElementById('filterBy');
        let query = "";

        if (conceptName != null){
          query = conceptName.value;
        }


        //Avanced Filtering--------------------------------------------------------------------
        let finalArray = [];

        for (let i = 0; i < myArray.length; i ++){
          if (myArray[i].meanStarRating < Number(this.minStar)) continue;
          if (myArray[i].modeCostRating > Number(this.maxCost)) continue;

          if (this.catChoose !== "" && this.catChoose !=="All"){
            if (myArray[i].categoryId !== this.catChoose) continue;
          }
          if (this.searchCity !== ""){
            if (!myArray[i].city.toLowerCase().includes(this.searchCity.toLowerCase())) continue;
          }



          if (this.onlyMyVenues){
            let venue_admin = this.admins[myArray[i].venueId];
            let current_user = this.$cookie.get('authId');

            console.log("my id " + current_user + " venue id " + venue_admin);

            console.log(venue_admin + '  ' + current_user);
            if (venue_admin != current_user) continue;

          }
          finalArray.push(myArray[i]);
        }


        if (query === "name") {
          return finalArray.filter((user) => {
            return user.venueName.toLowerCase().includes(this.search.toLowerCase())
          });

        } else if (query === "city") {
          return finalArray.filter((user) => {
            return user.city.toLowerCase().includes(this.search.toLowerCase())
          });

        } else if (query === "cat") {
          return finalArray.filter((user) => {

            let id = user.categoryId - 1;
            let category = this.categories[id];

            let categoryName = "";
            try {
              if (category != undefined || category != null) categoryName = category.categoryName.toLowerCase();
            }catch(e){
              categoryName = "";
            }
            return categoryName.includes(this.search.toLowerCase());
          });



        }else{
          return finalArray.filter((user) => {
            return user.venueName.toLowerCase().includes(this.search.toLowerCase())
          });
        }

      }
    }
  }

</script>


<style scoped>

  #advancedSearch{
    background-color: #29B6F6;
    z-index: 150;
  }

  #advancedBar{
    height:60px;
  }

  #advancedBar2{
  height:60px;
  }

  .selectRow{
    cursor: pointer;
    text-align: center;
    padding-top: 6px;
    padding-bottom: 6px;
    margin-bottom:5px;
    background-color: #29B6F6;
    color: white;
    font-size:22px;
    line-height: 20px;
  }

  input[type=submit] {
    background-color: #29B6F6;
    color: white;
    padding: 14px 20px;
    margin-left: auto;
    margin-right:auto;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

select{

    width:130px;
    height:100%;
    background-color: #29B6F6;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    line-height: 30px;
    text-indent:5px;
    color:white;
    font-size: 20px;
    font-style: normal;
    font-variant: normal;
    font-weight: 500;
    border:none;
  }

  .selectRow:hover{
    background-color: #81D4FA;
    color: white;
    font-size:22px;
    line-height: 20px;
  }



  .dot {
    height: 5px;
    width: 5px;
    margin: 3px;
    margin-left: 15px;
    background-color: #aaa;
    border-radius: 50%;
    display: inline-block;
  }

  #filterBy{
    width:150px;
    height:100%;
    background-color: #29B6F6;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    line-height: 30px;
    text-indent:5px;
    color:white;
    font-size: 24px;
    font-style: normal;
    font-variant: normal;
    font-weight: 500;
    border:none;
  }

  #sortBy{
    width:130px;
    height:100%;
    background-color: #29B6F6;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    line-height: 30px;
    text-indent:5px;
    color:white;
    font-size: 20px;
    font-style: normal;
    font-variant: normal;
    font-weight: 500;
    border:none;
  }

  #sortType{
    width:190px;
    height:100%;
    background-color: #29B6F6;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    line-height: 30px;
    text-indent:5px;
    color:white;
    font-size: 20px;
    font-style: normal;
    font-variant: normal;
    font-weight: 500;
    border:none;
  }

  #searchBar{
    width:100%;
    height:120px;
    background-color: #29B6F6;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    line-height: 30px;
    text-indent:20px;
    color:white;
    font-size: 24px;
    font-style: normal;
    font-variant: normal;
    font-weight: 500;
    border:none;
    margin:0;
  }

  #filterBar{
    line-height: 30px;
    width:calc(100% - 4px);
    height:70px;
    background-color: rgba(255,255,255,0);
    border:none;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    text-indent:20px;
    color:white;
    font-size: 24px;
    font-style: normal;
    font-variant: normal;
    font-weight: 500;
  }

  #search{
    position: relative;
    top:5px;
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #29B6F6;
    font-size: 16px;
    background-color: white;
    background-image: url('https://www.w3schools.com/css/searchicon.png');
    background-position: 10px 10px;
    background-repeat: no-repeat;
    padding: 12px 20px 12px 40px;
  }

  #citySearch{
    box-sizing: border-box;
    border: 2px solid #29B6F6;
    font-size: 16px;
    background-color: white;
    background-image: url('https://www.w3schools.com/css/searchicon.png');
    background-position: 10px 10px;
    background-repeat: no-repeat;
    padding: 12px 20px 12px 40px;
  }

  #desc {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 16px;
    font-style: normal;
    font-variant: normal;
    line-height: 28px;
    color: #424242;
  }

  .info {
    text-indent: 7px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 16px;
    font-style: normal;
    font-variant: normal;
    line-height: 28px;
    color: #424242;
  }

  #VName {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 28px;
    font-style: normal;
    font-variant: normal;
    font-weight: 700;
    line-height: 28px;
  }

  #venueCard {
    text-indent: 10px;
    padding: 0px;
    margin: 10px;
    border:none;
    position: inherit;
    width: calc(100% - 20px);
    background-color: #FAFAFA;
  }

  #venue2 {
    padding: 0px;
    margin: 0px;
    border:none;
    width:100%;
  }

  #venue3 {
    padding: 0px;
    margin: 0px;
    border:none;
    width: 100%;
  }

  #venueCard:hover {
    background-color: #F1F1F1;
  }

  #image {
    height: 100%;
    width: 300px;
    object-fit: cover;
  }

  #headerImage {
    background-image: url("/src/assets/default.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 400px;
    object-fit: cover;
  }

  #noBlurBar{
    position:relative;
    top:-5px;
    width:100%;
    height:20px;
    background:#FFFFFF;
  }

  a:link, a:visited, a:link:active, a:visited:active {
    color: black;
    text-decoration: none;
  }

  #headerText{
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0, 0.5); /* Black w/opacity/see-through */
    color: white;
    font-weight: bold;
    position: relative;
    top: -125px;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    padding: 0px;
    text-align: center;
  }

  #HoverName{
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 72px;
    font-style: normal;
    font-variant: normal;
    font-weight: 700;
    line-height: 80px;
  }

  #greyBar{
    background-color: #aaa; /* Black w/opacity/see-through */
    color: white;
    font-weight: bold;
    position: relative;
    top: -200px;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    padding: 0px;
  }

  #button{
    text-align: center;
    margin:10px;
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



</style>
