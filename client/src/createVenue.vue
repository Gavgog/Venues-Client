<template>

  <div>
    <div v-if="errorFlag" style="color:red;">
      {{ error }}
    </div>
    <!-- Vue modal for Reviews  -->

    <div>

      <div id="headerText"><h2 id="HoverName">
        Create Venue
      </h2></div>


      <div id="myVenue">

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
          <input type="submit" value="Submit Changes"
                 v-if="this.$cookie.get('token')"
                 v-on:click.prevent="createVenue()">
          <br>
        </form>
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
        errorFlag: false,

        categories: "",

        VName: "",
        VCat: "",
        VCity: "",
        VShortDesc: "",
        VLongDesc: "",
        VAddress: "",
        VLat: "",
        VLong: ""
      }
    },

    mounted: function () {
      this.getCategorys();
    },

    methods: {

      getCategorys: function(){
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      createVenue: function (id) {

        let info = {
          "venueName": this.VName,
          "categoryId": Number(this.VCat),
          "city": this.VCity,
          "shortDescription": this.VShortDesc,
          "longDescription": this.VLongDesc,
          "address": this.VAddress,
          "latitude": Number(this.VLat),
          "longitude": Number(this.VLong)
        };


        this.$http.post('http://localhost:4941/api/v1/venues/',
          JSON.stringify(info),
          {headers: {'X-Authorization': this.$cookie.get('token')}})
          .then(function (response) {
            location.reload();
          }, function (error) {
            alert(error.statusText);
            this.errorFlag = true;
          });

      }

    }

  }

</script>


<style scoped>

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


  a:link, a:visited, a:link:active, a:visited:active {
    color: black;
    text-decoration: none;
  }

  #headerText{
    background-color: rgb(0,0,0); /* Fallback color */
    background-image: linear-gradient(141deg, #4CAF50 0%, #8BC34A 51%, #C0CA33 75%);
    color: white;
    font-weight: bold;
    position: relative;
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



</style>
