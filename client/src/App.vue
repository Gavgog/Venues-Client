<template>
  <div  id = "app">


  <div id="navbar">
    <div id="nameBadge">
    <router-link to="/" >
    <h1 id="headr">VenueConnect</h1>
    </router-link>
    </div>


    <div id="userInfo">
      <div v-if="this.$cookie.get('token')">
        <h3 id="logio" >
          <table><tr><td>
        <router-link id="acc" :to="{ path: '/users/' + this.$cookie.get('authId')}">
          Account
        </router-link>
          </td><td>
        <div v-on:click="toggleBox" id="logo">
          Logout
        </div>
          </td>
          </tr></table>
        </h3>

      </div>


      <div v-if="!this.$cookie.get('token')"  v-on:click="toggleBox" >
        <h3 id="logio logi">Login</h3>
      </div>

    </div>

  </div>

    <div id="spacerbar">
    </div>



    <div id="loginBox">

      <p v-model="loginerror"></p>

      <h2>Login</h2>

      <form>
        Username
        <input type="text" name="userName" v-model="username" placeholder="Username">
        Email
        <input type="text" name="Email" v-model="useremail" placeholder="Email">
        Password
        <input type="password" name="password" v-model="password" placeholder="Password">
        <br><br>
        <button class="loginbutton" data-id="create.submit"
                data-dismiss="modal"
                v-on:click.prevent="login()">Login</button>

        <button class="loginbutton" data-id="create.submit"
                data-dismiss="modal"
                v-on:click.prevent="showRegister()">Create account</button>
      </form>

    </div>

    <div id="registerBox">

      <p v-model="loginerror"></p>

      <h2>Register</h2>

      <form>
        Username
        <input type="text" name="userName" v-model="username" placeholder="Username">
        Given name
        <input type="text" name="userName" v-model="givenname" placeholder="Given Name">
        Family name
        <input type="text" name="userName" v-model="familyname" placeholder="Family Name">
        Email
        <input type="text" name="Email" v-model="useremail" placeholder="Email">
        Password
        <input type="password" name="password" v-model="password" placeholder="Password">
        Confirm Password
        <input type="password" name="password" v-model="password2" placeholder="Confirm Password">
        <br><br>
        <button class="loginbutton" data-id="create.submit"
                data-dismiss="modal"
                v-on:click.prevent="register()">Register</button>
      </form>

    </div>



    <div id="body">
    <router-view></router-view>
    </div>

    <div id="backgroundol" v-on:click="closeBox">
    </div>

    <div id="background">
    </div>

  </div>
</template>

<style scoped>

  #nameBadge{
    width:150px;
  }

  #logi:hover{
    text-shadow: 0px 0px 5px #ffffff;  }
  #logo:hover{
    text-shadow: 0px 0px 5px #ffffff;  }
  #acc:hover{
    text-shadow: 0px 0px 5px #ffffff;
  }

  #loginBox{
    z-index:999;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 18px;
    font-style: normal;
    font-variant: normal;
    display:none;
    background-color: rgba(255,255,255,0.9);
    position:fixed;
    padding:20px;
    top:65px;
    right:5px;
    width:350px;
  }

  #registerBox{
    z-index:999;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 18px;
    font-style: normal;
    font-variant: normal;
    display:none;
    background-color: rgba(255,255,255,0.9);
    position:fixed;
    padding:20px;
    top:65px;
    right:5px;
    width:350px;
  }

  #userInfo{
    display: inline;
    position:fixed;
    width:250px;
    height:60px;
    top:-7px;
    right:0;
  }

  #backgroundol{
    position:fixed;
    width:102%;
    height:102%;
    top:-1%;
    left:-1%;
    background-color: rgba(255,255,255,0.60);
    z-index:-998;
  }

  #background{
    position:fixed;
    width:102%;
    height:102%;
    top:-1%;
    left:-1%;
    background-image: url("/src/assets/background.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-filter: blur(2px); /* Safari */
    filter: blur(2px);
    z-index:-999;
  }

  #navbar{
    width:100%;
    height:60px;
    left:0;
    top:0;
    position: fixed;
    background-color: #29B6F6;
    z-index:99999;
    border-bottom: #039BE5 solid 1px;
  }

  #spacerbar{
    width:100%;
    height:100px;
    left:0;
    top:0;
  }

  #body{
    border-radius: 10px;
    margin-left:auto;
    margin-right:auto;
    width:1000px;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 10px grey;
  }

  #headr{
    color:white;
    width:150px;
    text-indent: 30px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 24px;
    font-style: normal;
    font-variant: normal;
    font-weight: 700;
    line-height: 28px;
  }

  #logio{
    cursor: pointer;
    top:0;
    color:white;
    margin-right:10px;
    text-indent: 10px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 24px;
    font-style: normal;
    font-variant: normal;
    font-weight: 700;
    line-height: 24px;
  }
  a:link, a:visited, a:link:active, a:visited:active {
    color: black;
    text-decoration: none;
  }
  input[type=text], select {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  input[type=password], select {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .loginbutton{
    width: 100%;
    background-color: #29B6F6;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }


  .loginbutton:hover {
    background-color: #81D4FA;
  }

</style>

<script>
  export default {
    data() {
      return {
        error: "",
        loginerror: "no errors",
        errorFlag: false,
        userlogged: "",
        username: "",
        givenname: "",
        familyname: "",
        useremail: "",
        password: "",
        password2: ""
      }
    },
    mounted: function () {
      this.getUsers();
    },
    methods: {
      login: function () {// login-------------------------------------------------------
        let userInfo = {
          username: this.username,
          email: this.useremail,
          password: this.password
        };

        console.log(userInfo);
        this.$http.post('http://localhost:4941/api/v1/users/login',JSON.stringify(userInfo),{}).then(function (response) {
          this.$cookie.set('authId', response.body.userId);
          this.$cookie.set('token', response.body.token);
          location.reload();
        },function (error){
          if (error.status == 400){
            alert(error.statusText);
            this.loginerror = "ya dun fucked up and got the wrong details fam";
          } else {
            alert(error.statusText);
            this.error = error;
            this.errorFlag = true;
          }
        });
      },

      register: function () {// register-------------------------------------------------------
        let userInfo = {
          "username": this.username,
          "givenName": this.givenname,
          "familyName": this.familyname,
          "email": this.useremail,
          "password": this.password
        };

        if (this.password2 != this.password){
          alert("Password and Confirm Password must be the same");
          return;
        }


        console.log(JSON.stringify(userInfo));
        this.$http.post('http://localhost:4941/api/v1/users/',JSON.stringify(userInfo),{}).then(function (response) {
          this.$cookie.set('authId', response.body.userId);
          this.login()
        },function (error){
            alert(error.statusText);
            this.error = error;
            this.errorFlag = true;

        });
      },

      toggleBox: function () {// toggle box-------------------------------------------------------
        // this method decides what needs to happen when the login/logout button is pressed

        if(!this.$cookie.get('token')) {// if user is not currently logged in

          let element = document.getElementById('loginBox'),
            style = window.getComputedStyle(element),
            display = style.getPropertyValue('display');

          if (display == "none") {
            document.getElementById('loginBox').style.display = 'block';
            document.getElementById('registerBox').style.display = 'none';
          } else {
            document.getElementById('loginBox').style.display = 'none';
            document.getElementById('registerBox').style.display = 'none';
          }

        } else {// user is currently logged in
          console.log('logging out with token: ' + this.$cookie.get('token'));

          this.$http.post('http://localhost:4941/api/v1/users/logout',{},{
            headers: {'X-Authorization': this.$cookie.get('token')}}
            ).then(function (response) {
            this.$cookie.delete('token');
            this.$cookie.delete('authId');
            location.reload();
          },function (error){
            alert(error.status);
            this.loginerror = "ya dun fucked up and got the wrong details fam";
            this.error = error;
            this.errorFlag = true;

          });

        }



      },

      showRegister: function () {
        let element = document.getElementById('registerBox'),
          style = window.getComputedStyle(element),
          display = style.getPropertyValue('display');

        if (display == "none") {
          document.getElementById('registerBox').style.display = 'block';
          document.getElementById('loginBox').style.display = 'none';
        }else{
          document.getElementById('loginBox').style.display = 'none';
          document.getElementById('registerBox').style.display = 'none';
        }
      },

      closeBox: function () {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('registerBox').style.display = 'none';
      },

      getUsers: function () {// get venues
        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            this.users = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
/*
      getUserDetails: function () { // get one users details
        console.log( this.$cookie.get('authId'));
        let result = null;
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$cookie.get('authId'))
          .then(function (response) {
            result = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
            return "error";

          });
        console.log(result);
        return result;
      }*/


    }
  }
</script>
