<template>

  <div>
    <div v-if="errorFlag" style="color:red;">
      {{ error }}
    </div>
    <!-- Vue modal for Reviews  -->

    <div v-if="$route.params.venueId">
      <div id="headerDefault"><img id="headerImage" :src="getImageById($route.params.venueId)"/></div>
      <div id="noBlurBar"></div>

      <div id="headerText"><h2 id="HoverName">
        {{getSingleVenue($route.params.venueId).venueName }}
      </h2></div>


      <div id="greyBar">
        <table id="toptable"><tr>
          <td>
        <div id="backButton">
          <router-link to="/venues">
            <div id="button">Back to venues</div>
          </router-link>
        </div>
          </td><td>
        <div id="reviewsButton">
        <router-link :to="{ path: '/venues/' + $route.params.venueId + '/reviews' }">
          <div id="button">See  or add reviews</div>
        </router-link>
        </div>
      </td></tr></table>

        <div id="ratings">
          Star Rating: {{ Math.round(getSingleVenue($route.params.venueId).meanStarRating) }}
          <span class="dot"></span>
          Cost Rating: {{  Math.round(getSingleVenue($route.params.venueId).modeCostRating) }}
        </div>
      </div>

      <div id="infoBox">
        Details:
        <table id="tableDetails">
          <tr class="trDetails">
            <td class="tdDetails">Category</td>
            <td class="tdDetails">{{venue.category.categoryName}}</td>
          </tr>
          <tr class="trDetails">
            <td class="tdDetails">Admin</td>
            <td class="tdDetails">{{venue.admin.username}}</td>
          </tr>
          <tr class="trDetails">
            <td class="tdDetails">City</td>
            <td class="tdDetails">{{venue.city}}</td>
          </tr>
          <tr class="trDetails">
            <td class="tdDetails">Address</td>
            <td class="tdDetails">{{venue.address}}</td>
          </tr>
          <tr class="trDetails">
            <td class="tdDetails">Date Created</td>
            <td class="tdDetails">{{venue.dateAdded}}</td>
          </tr>
          <tr class="trDetails">
            <td class="tdDetails">Average Rating</td>
            <td class="tdDetails">{{getSingleVenue($route.params.venueId).meanStarRating}}</td>
          </tr>

          <tr class="trDetails" v-if="!bigDesc">
            <td class="tdDetails">Short Description</td>
            <td class="tdDetails" v-on:click.prevent="showDesc">{{venue.shortDescription}} ... click to see long description</td>
          </tr>

          <tr class="trDetails" v-if="bigDesc">
            <td class="tdDetails">Long Description</td>
            <td class="tdDetails" v-on:click.prevent="showDesc">{{venue.longDescription}}</td>
          </tr>

        </table>
        <div class="selectRow"
             v-if="this.$cookie.get('authId') == venue.admin.userId"
             data-dismiss="modal"
             v-on:click.prevent="openEdit()">
          <p> + Edit Your Venue </p>
        </div>
      </div>

      <div id="myVenue" v-if="editOpen">
        <form id="venueBox">
          <table id="Venues">
            <tr>
              <td>Venue Name</td>
              <td><input type="text" v-model="VName"  placeholder="Name"></td>
            </tr>
            <tr>
              <td>Venue Category</td>
              <td><select id="filterBy" v-model="VCat">
                <option v-for="category in categories" v-bind:value="category.categoryId">{{category.categoryName}}</option>
              </select></td>
            </tr>
            <tr>
              <td>City</td>
              <td><input type="text" v-model="VCity"  placeholder="City"></td>
            </tr>
            <tr>
              <td>Short Description</td>
              <td><input type="text" v-model="VShortDesc" placeholder="Short Description"></td>
            </tr>
            <tr>
              <td>Long Description</td>
              <td><input type="text" v-model="VLongDesc"  placeholder="Long Description"></td>
            </tr>
            <tr>
              <td>Address</td>
              <td><input type="text" v-model="VAddress"  placeholder="Venue Address"></td>
            </tr>
            <tr>
              <td>Latitude</td>
              <td><input type="text" v-model="VLat"  placeholder="latitude"></td>
            </tr>
            <tr>
              <td>Longitude</td>
              <td><input type="text" v-model="VLong"  placeholder="longitude"></td>
            </tr>
          </table>
          <br>
          <input type="submit" id="selectRow" value="Submit Changes"
                 v-if="this.$cookie.get('token')"
                 v-on:click.prevent="updateVenue()">
          <br>
        </form>
        <br>

        <div id="NewDP">

          <form id="DPBox">
            <table id="DPInputTable">
              <tr><td class="itd">
                Upload a new picture:
              </td><td>
                <input type="file"  id="fileinput" @change="onFileChanged($event)">
              </td></tr>
            </table>
            <img src="" id="preimg"  alt="">
            <br>

            <p id="SetAsMain">Set as main picture <label class="switch">
            <input type="checkbox" id="setAsMainOnUpload" checked>
            <span class="slider round"></span>
            </label></p>


            <input type="text" placeholder="Description" id="descriptionElement" @change="onFileChanged($event)">
            <br>
            <br>
            <input type="submit" value="Upload" class="selectRow" id="submitupload"
                   v-if="this.$cookie.get('token')"
                   v-on:click.prevent="onUpload()">
            <br>
            <br>
            <input type="submit" value="Delete current primary photo" class="selectRow" id="submitdelete"
                   v-if="this.$cookie.get('token')"
                   data-dismiss="modal"
                   v-on:click.prevent="deletePhoto(getSingleVenue($route.params.venueId).primaryPhoto)">
          </form>

        </div>
      </div>

      <div id="gallery">
        <br>
        <div class="row">

          <div class="column">
          <div v-for="photo in venue.photos.slice(0,(venue.photos.length/3))">
              <div class="imageCard" v-on:click="openImage(photo)">
            <img class="otherimage" :src="getSource(photo.photoFilename)"/>
            <p>{{photo.photoDescription}}</p>
              </div>

            </div>
          </div>

          <div class="column">
            <div v-for="photo in venue.photos.slice((venue.photos.length/3),(2*venue.photos.length/3))">
              <div class="imageCard" v-on:click="openImage(photo)">
                <img class="otherimage" :src="getSource(photo.photoFilename)"/>
                <p>{{photo.photoDescription}}</p>
              </div>

            </div>
          </div>

          <div class="column">
            <div v-for="photo in venue.photos.slice((2*venue.photos.length/3))">

              <div class="imageCard" v-on:click="openImage(photo)">
                <img class="otherimage" :src="getSource(photo.photoFilename)"/>
                <p>{{photo.photoDescription}}</p>
              </div>
            </div>
          </div>


        <div id="darkbg" v-on:click="closeImg()" v-if="imageOpen">
          <img id="largeImg" :src="getSource(enlargendImg)"/>
          <p id="enlargedTxt">{{enlargendImgDesc}}</p>
          <p id="MPbutton" v-if="this.$cookie.get('authId') == venue.admin.userId" v-on:click="makePrimary(enlargendImg)">Make Primary</p>
          <p id="deletebutton" v-if="this.$cookie.get('authId') == venue.admin.userId" v-on:click="deletePhoto(enlargendImg)">Delete</p>

        </div>


          

        </div>
      <br>
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
        bigDesc: false,
        editOpen: false,
        users: [],
        venue: [],

        categories: [],

        VName: "",
        VCat: "",
        VCity: "",
        VShortDesc: "",
        VLongDesc: "",
        VAddress: "",
        VLat: "",
        VLong: "",
        myImageName: "/src/assets/default.jpg",

        enlargendImg: "",
        enlargendImgDesc: "",
        imageOpen: false
      }
    },

    mounted: function () {
      this.getUsers();
      this.getSingleVenue();
      this.getOneVenue();
    },

    methods: {

      getSource: function(name){
        return 'http://localhost:4941/api/v1/venues/' + this.$route.params.venueId + '/photos/' + name;
      },

      openImage: function(photo){
        this.enlargendImg = photo.photoFilename;
        this.enlargendImgDesc = photo.photoDescription;
        this.imageOpen = true;
        console.log("imageopen")
      },

      closeImg: function(){
        this.enlargendImg = "";
        this.imageOpen = false;
      },

      getImageById: function(venueId){

        let venue = this.getSingleVenue(venueId);

        let photo = venue.primaryPhoto;

        if (photo) return 'http://localhost:4941/api/v1/venues/' + venueId + '/photos/' + photo;
        return "/src/assets/default.jpg";
      },

      onFileChanged: function (event) {
        const file = event.target.files[0];
        if (file.size > 20971520) {
          alert('Profile image must be below 20MB');
        } else {
          var reader = new FileReader();
          this.imageType = file.type;
          let preview = document.getElementById('preimg');

          reader.onloadend = (e) => {
            preview.src = reader.result;
            this.selectedFile = reader.result;
          };

          reader.readAsDataURL(file);
        }
      },

      onUpload() {
        console.log(this.imageType);

        let fileElement = document.getElementById('fileinput');
        let file = fileElement.files[0];

        let descriptionElement = document.getElementById('descriptionElement');
        let description = descriptionElement.value;

        let setMainElement = document.getElementById('setAsMainOnUpload');
        let setMain = setMainElement.checked;
        alert(setMain);

        let form = document.getElementById('DPBox');
        let formData = new FormData(form);

        formData.append('photo',file);
        formData.append('description',description);
        if (setMain) formData.append('makePrimary',"true");
        else formData.append('makePrimary',"false");


        //let stringData = JSON.stringify(data);


        this.$http.post('http://localhost:4941/api/v1/venues/'+ this.$route.params.venueId +'/photos',
          formData,
          {headers: {
              'X-Authorization': this.$cookie.get('token'),
              'Content-Type': this.$cookie.get('form-data')
          }})
          .then(function (response) {
            location.reload();
          }, function (error) {
            alert(error.statusText);
            this.errorFlag = true;
          });


        /*
        this.$http.post(
          'http://localhost:4941/api/v1/venues/'+ this.$route.params.venueId +'/photos',
          stringData,
          {headers: {"X-Authorization": this.$cookie.get('token')}}
          ).then(response => {
            console.log(response);
            alert("yes");
          // get body data
          location.reload();
        }, response => {
          alert("not yes");
          // error callback
          console.log("error");
        });
        */

      },

      makePrimary: function(filename){
        console.log("not implemented");//todo fix this

        this.$http.post('http://localhost:4941/api/v1/venues/'+ this.$route.params.venueId +'/photos/' + filename + '/setPrimary',
          {},
          {headers: {'X-Authorization': this.$cookie.get('token')}}
          ).then(function (response) {
            location.reload();
          }, function (error) {
            alert(error.statusText);
            this.errorFlag = true;
          });

      },

      deletePhoto: function(filename){
        console.log("not implemented");//todo fix this

        this.$http.delete('http://localhost:4941/api/v1/venues/'+ this.$route.params.venueId +'/photos/' + filename,
          {headers: {'X-Authorization': this.$cookie.get('token')}}
        ).then(function (response) {
          location.reload();
        }, function (error) {
          alert(error.statusText);
          this.errorFlag = true;
        });

      },


      updateVenue: function (id) {

        console.log(this.VCat);
        let info = {
        };

        if (this.VName) info["venueName"] = this.VName;
        if (this.VCat) info["categoryId"] = this.VCat;
        if (this.VCity) info["city"] = this.VCity;
        if (this.VShortDesc) info["shortDescription"] = this.VShortDesc;
        if (this.VLongDesc) info["longDescription"] = this.VLongDesc;
        if (this.VAddress) info["address"] = this.VAddress;
        if (this.VLat) info["latitude"] = this.VLat;
        if (this.VLong) info["longitude"] = this.VLong;


        /*
        let info = {
          "venueName": this.VName,
          "categoryId": 1,
          "city": this.VCity,
          "shortDescription": this.VShortDesc,
          "longDescription": this.VLongDesc,
          "address": this.VAddress,
          "latitude": Number(this.VLat),
          "longitude": Number(this.VLong)
        };*/


        this.$http.patch('http://localhost:4941/api/v1/venues/' + this.$route.params.venueId ,JSON.stringify(info),{headers: {'X-Authorization': this.$cookie.get('token')}})
          .then(function (response) {
            location.reload();
          }, function (error) {
            alert(error.statusText);
            this.errorFlag = true;
          });

      },

      showDesc: function() {
        if (!this.bigDesc) this.bigDesc = true;
        else this.bigDesc = false;
      },

      openEdit: function() {
        if (!this.editOpen) this.editOpen = true;
        else this.editOpen = false;
      },



      getUsers: function () {

        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            this.users = response.data;
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
        console.log("id = " + id);

        if (id === undefined) id = 1;
        this.$http.get('http://localhost:4941/api/v1/venues/' + id)
          .then(function (response) {
            this.venue = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      }

    },computed:{
      filteredVenues: function () {
        //sorting -------------------------------------------------------------------

        console.log(this.sortT);//these lines need to stay in
        console.log(this.sortB);

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

        /*
                function Comparator(a, b) {
                  if (a[1] < b[1]) return -1;
                  if (a[1] > b[1]) return 1;
                  return 0;
                }

                var myArray = [
                  [1, 'alfred', '\n'],
                  [23, 'berta', '\n'],
                  [2, 'zimmermann', '...'],
                  [4, 'albert', '...'],
                ];

                myArray = myArray.sort(Comparator);
                console.log(myArray);
        */

        let myArray = this.users;
        if(sortByS === 'Star') {
          if (sortTypeS === 'htl') myArray = myArray.sort(ShtlComparator);
          if (sortTypeS === 'lth') myArray = myArray.sort(SlthComparator);
        }else{
          if (sortTypeS === 'htl') myArray = myArray.sort(ChtlComparator);
          if (sortTypeS === 'lth') myArray = myArray.sort(ClthComparator);
        }

        this.users = myArray;


        // filtering -------------------------------------------------------------------
        let conceptName = document.getElementById('filterBy');
        let query = "";

        if (conceptName != null){
          query = conceptName.value;
        }

        if (query === "name") {
          return this.users.filter((user) => {
            return user.venueName.toLowerCase().includes(this.search.toLowerCase())
          });

        } else if (query === "city") {
          return this.users.filter((user) => {
            return user.city.toLowerCase().includes(this.search.toLowerCase())
          });

        } else if (query === "cat") {
          return this.users.filter((user) => {

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
          return this.users.filter((user) => {
            return user.venueName.toLowerCase().includes(this.search.toLowerCase())
          });
        }

      }
    }
  }

</script>


<style scoped>

  #SetAsMain{
    line-height: 30px;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 28px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(31px);
    -ms-transform: translateX(31px);
    transform: translateX(31px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  #deletebutton{
    cursor: pointer;
    margin-left: auto;
    margin-right: auto;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:24px;
    line-height: 26px;
    text-align: center;

    width:250px;
    padding:5px;
    background-color: #f44336;
    border-radius: 5px;
    color:white;
  }

  #MPbutton{
    cursor: pointer;
    margin-left: auto;
    margin-right: auto;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:24px;
    line-height: 26px;
    text-align: center;

    width:250px;
    padding:5px;
    background-color: #29B6F6;
    border-radius: 5px;
    color:white;
  }

  #enlargedTxt{
    margin-left: auto;
    margin-right: auto;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:24px;
    line-height: 26px;
    text-align: center;

    width:250px;
    padding:5px;
    background-color: rgba(0,0,0,0.8);
    border-radius: 5px;
    color:white;
  }

  #largeImg{
    display: block;
    width:80%;
    max-width: 700px;
    max-height: 70%;
    margin: 75px auto auto;
  }

  .row {
    display: -ms-flexbox; /* IE10 */
    display: flex;
    -ms-flex-wrap: wrap; /* IE10 */
    flex-wrap: wrap;
    padding: 0 4px;
  }

  #darkbg{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,0.7);
    z-index: 999;
  }

  /* Create four equal columns that sits next to each other */
  .column {
    -ms-flex: 32%; /* IE10 */
    flex: 32%;
    max-width: 32%;
    padding: 0 4px;
  }

  .column img {
    margin-top: 8px;
    vertical-align: middle;
  }


  #gallery{
    position:relative;
    top:-235px;
    background-color: #607D8B;
  }

  .imageCard{
    cursor: pointer;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:15px;
    line-height: 18px;
    text-align: center;

    width:250px;
    padding:5px;
    margin:20px;
    background-color: rgba(0,0,0,0.5);
    border-radius: 5px;
    color:white;

  }

  .otherimage{
    width:240px;
  }

  #submitdelete {
    width: 100%;
    background-color: #f44336;
    color: white;
    padding: 14px 20px;
    margin-left: auto;
    margin-right:auto;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }


  #DPimg{
    width:100%;
    height:100%;
    border-radius: 100%;
  }

  #preimg{
    height:200px;
    margin-left:auto;
    margin-right:auto;

    background-position: center;
    background-repeat: no-repeat;
    background-size: auto;

    cursor: pointer;
    transition: 0.1s filter linear;
  }

  #NewDP{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:15px;
    line-height: 18px;
    position:relative;
    top:0px;
    margin:20px;
    background-color: #f2f2f2;
    padding: 20px;
    border-radius: 10px;
  }

  #DPBox{
    width:400px;
    margin-left:auto;
    margin-right:auto;
  }

  #myVenue{
    position:relative;
    top:-235px;
  }

  .selectRow{
    font-family: arial, sans-serif;
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
    width: 100%;
    padding: 12px 20px;
    margin-left: auto;
    margin-right:auto;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  input[type=password], select {
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
    width: 100%;
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
    width: 100%;
    background-color: #81D4FA;
    color: white;
    padding: 14px 20px;
    margin-left: auto;
    margin-right:auto;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  #Venues {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  #Venues td, #Venues th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  #Venues tr:nth-child(even){background-color: #f2f2f2;}

  #Venues tr:hover {background-color: #ddd;}

  #Venues th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #4CAF50;
    color: white;
  }


  #toptable{
    padding:0;
    margin:0;
    border:0;
    border-spacing: 0;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  #description{
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 16px;
    line-height: 26px;
  }


  #tableDetails {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    line-height: 14px;
  }

  .tdDetails, .thDetails {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }


  .trDetails:nth-child(even) {
    background-color: #dddddd;
  }

  #infoBox{
    font-family: arial, sans-serif;
    position:relative;
    top:-235px;
    width:100%;
    background-color: #EEE;
    text-indent:10px;
    font-size: 26px;
    line-height: 60px;
  }



  #ratings{
    position:relative;
    float:right;
    width:440px;
    height:60px;
    top:-50px;
    right:0;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 26px;
    line-height: 46px;
    color:white;
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
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    line-height: 22px;
    text-indent:5px;
    font-size: 18px;
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
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    background-color: #29B6F6;
    width:170px;
    height:50px;
    line-height: 50px;
    color:white;
  }

  #button:hover{
    background-color: #81D4FA;
  }



</style>
