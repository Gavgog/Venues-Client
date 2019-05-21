<template>
  <div>
    <div id="jumbotron">
      <br><br><br><br><br>
      <h2 id="jumboText">Welcome to VenueConnect</h2>
    </div>


    <table id="jumboboard">

      <tr>
        <td>
        <router-link to="/venues" >
          View Venues
        </router-link>
        </td>
      </tr>

      <tr>
        <td>
        <router-link to="/newVenue" >
          Create New Venue
        </router-link>
        </td>
      </tr>



    </table>
<br>

  </div>
</template>

<style scoped>

#jumbotron{
  background-image: linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%);
  position:relative;

  left:0;
  width:100%;
  height:250px;
}

#jumboText{
  text-align: center;
  background-color: rgba(1,1,1,0.3);
  color: white;
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  position:relative;
  top:0px;
  font-size: 72px;
  line-height:100px;
  border-collapse: collapse;
  text-shadow: #FFF 0 0 2px;
}

  a:link, a:visited, a:link:active, a:visited:active {
    color: black;
    text-decoration: none;
  }
#jumboboard {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  font-size: 24px;
  line-height:30px;
  border-collapse: collapse;
  width: 100%;
}

#jumboboard td, #jumboboard th {
  border: 1px solid #ddd;
  padding: 8px;
}

#jumboboard tr:nth-child(even){background-color: #f2f2f2;}

#jumboboard tr:hover {background-color: #ddd;}

#jumboboard th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #29B6F6;
  color: white;
}

</style>
