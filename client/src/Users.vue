<template>

  <div>
    <div v-if="errorFlag" style="color:red;">
      {{ error }}
    </div>
    <!-- Vue modal for Reviews  -->

    <div v-if="$route.params.userId">


      <div id="headerText"><h2 id="HoverName"><br>
        <div id="dp" v-on:click.prevent="openEditDP()"><img :src="this.profilePicture" id="DPimg"></div>
        {{this.username}}
      </h2></div>


      <div id="infoBox">


        User Details:
        <table id="tableDetails">
          <tr class="trDetails">
            <td class="tdDetails">Given Name</td>
            <td class="tdDetails">{{this.userdetails.givenName}}</td>
          </tr>
          <tr class="trDetails">
            <td class="tdDetails">Last Name</td>
            <td class="tdDetails">{{this.userdetails.familyName}}</td>
          </tr>
          <tr class="trDetails">
            <td class="tdDetails">Email</td>
            <td class="tdDetails">{{this.userdetails.email}}</td>
          </tr>

        </table>

        <div class="selectRow"
             v-if="isMe()"
             data-dismiss="modal"
             v-on:click.prevent="openEdit()">
          <p> + Edit Details </p>
        </div>
      </div>

      <div id="myReview" v-if="this.editOpen">

        <form id="reviewBox">


          <table id="reviewInputTable">
            <tr><td class="itd">
              <label for="fname">New Given Name</label>
            </td><td>
              <input type="text" v-model="newGname" id="fname" name="firstname" placeholder="fist name">
            </td></tr>


            <tr><td class="itd">
              <label for="SRating">New Family Name</label>
            </td><td>
              <input type="text" v-model="newFname" id="SRating" name="lastname" placeholder="last name">
            </td></tr>

            <tr><td class="itd">
              <label for="CRating">New Password</label>
            </td><td>
              <input type="password" v-model="newpass" id="CRating"  placeholder="password">
            </td></tr>


            <tr><td></td><td>
              <input type="submit" value="Submit Changes" class="selectRow"
                     v-if="this.$cookie.get('token')"
                     data-dismiss="modal"
                     v-on:click.prevent="updateInfo()">
            </td></tr>
          </table>
        </form>
        <br>
      </div>


      <div id="NewDP" v-if="this.DPeditOpen">

        <form id="DPBox" v-if="isMe()">
          <table id="DPInputTable">
            <tr><td class="itd">
              Select a new display picture:
            </td><td>
              <input type="file"  @change="onFileChanged($event)">
            </td></tr>
          </table>
          <img src="" id="preimg"  alt="Image preview...">
          <br>
          <input type="submit" value="Upload" class="selectRow" id="submitupload"
                 v-if="this.$cookie.get('token')"
                  v-on:click.prevent="onUpload()">
          <br>
          <input type="submit" value="Delete" class="selectRow" id="submitdelete"
                 v-if="this.$cookie.get('token')"
                 data-dismiss="modal"
                 v-on:click.prevent="deleteDP()">
        </form>
        <p v-if="!isMe()">you cant edit someone else's profile picture</p>
      </div>
      <br>



    </div>

    <div v-else><h1> Come back with a user to view </h1></div>



  </div>
</template>


<script>

  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        editOpen: false,
        DPeditOpen: false,
        search: "",
        username: "",
        userdetails: "",
        newpass: "",
        newGname: "",
        newFname: "",
        imageType: "",
        selectedFile: null,
        profilePicture: null
      }
    },

    mounted: function () {
      this.getUserinfo();
      this.getDP();
    },

    methods: {

      getDP: function (){
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.userId + '/photo'
          ,{},{headers: {
              'X-Authorization': this.$cookie.get('token')
            }})
          .then(function (response) {
            console.log(response.data);
            this.profilePicture =  response.data;
          }, function (error) {
          console.log('no dp');
          });
      },

      deleteDP: function(){
        this.$http.delete('http://localhost:4941/api/v1/users/' + this.$cookie.get('authId') + "/photo"
          ,{
          headers: {"X-Authorization": this.$cookie.get('token')}
        }).then(function (response) {
            location.reload();
          }, function (error) {
            console.log(error);
          });
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
            console.log(this.selectedFile);
          };

          reader.readAsDataURL(file);
        }
      },

      onUpload() {
        console.log(this.imageType);
        console.log(this.selectedFile);

        this.$http.put('http://localhost:4941/api/v1/users/'+ this.$cookie.get('authId') +'/photo',this.selectedFile,{
          headers: {
              "X-Authorization": this.$cookie.get('token'),
              "Content-Type": this.imageType
            }
          }).then(response => {
          // get body data
          console.log("might work");
          location.reload();
        }, response => {
          // error callback
          console.log("error")
        });
      },


      isMe: function (){
        let myId = this.$cookie.get('authId');
        let pageId = this.$route.params.userId;

        if (myId == pageId) {
          return true;
        }
        return false;
      },

      getUserinfo: function () {
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.userId,{headers: {
              'X-Authorization': this.$cookie.get('token')
          }})
          .then(function (response) {
            console.log(response.data);
            this.userdetails = response.data;
            this.username = response.data.username;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },

      updateInfo: function () {

        let newInfo = {};

        if (this.newGname) newInfo['givenName'] = this.newGname;
        if (this.newFname) newInfo['familyName'] = this.newFname;
        if (this.newpass) newInfo['password'] = this.newpass;


        let infoS = JSON.stringify(newInfo);
        this.$http.patch('http://localhost:4941/api/v1/users/' + this.$route.params.userId
          ,infoS,{headers: {
              'X-Authorization': this.$cookie.get('token')
            }})
          .then(function (response) {
            console.log(response.data);
            this.userdetails = response.data;
            this.username = response.data.username;
            location.reload()
          }, function (error) {
            alert('you are not allowed to edit this user');
            this.error = error;
            this.errorFlag = true;
          });

      },


      openEdit: function(){
        this.openEditDP();
        if (!this.editOpen) this.editOpen = true;
        else this.editOpen = false;
      },
      openEditDP: function(){
        if (!this.DPeditOpen) this.DPeditOpen = true;
        else this.DPeditOpen = false;
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

    }

  }

</script>


<style scoped>

#DPimg{
  width:100%;
  height:100%;
  border-radius: 100%;
}

#preimg{
  width:200px;
  height:200px;
  border-radius: 100%;
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

  #dp{
    width:200px;
    height:200px;
    border-radius: 100%;
    margin-left:auto;
    margin-right:auto;
    background-image: url("/src/assets/defaultDP.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
    transition: 0.1s filter linear;
  }

  #dp:hover{
    filter: blur(5px);
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
  #reviewInputTable{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size:20px;
    line-height: 30px;
    width:100%;
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
    width:100%;
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

#submitupload {
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


#submitupload:hover{
  background-color: #81D4FA;

}

#submitdelete:hover{
  background-color: #ef9a9a;

}


#reviewBox{
    position:relative;
    top:0px;
    margin:20px;
    background-color: #f2f2f2;
    padding: 20px;
    border-radius: 10px;
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
    top:-35px;
    width:100%;
    background-color: #EEE;
    text-indent:10px;
    font-size: 26px;
    line-height: 60px;
  }
  #HoverName{
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 42px;
    font-style: normal;
    font-variant: normal;
    font-weight: 700;
    line-height: 50px;
  }




  a:link, a:visited, a:link:active, a:visited:active {
    color: black;
    text-decoration: none;
  }

  #headerText{
    background-color: rgb(0,0,0); /* Fallback color */
    background-image: linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%); /* Black w/opacity/see-through */
    color: white;
    font-weight: bold;
    left: 0;
    top:0;
    z-index: 2;
    padding: 0px;
    text-align: center;
    text-shadow: #FFF 0 0 2px;
  }

</style>
