<!DOCTYPE html>
<html>
<head>
  <title>Add Resources</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <style>
    /*#form_Container{display: none;}*/
  </style>
</head>
<body>
<!--   <div id="loginDiv">
    <div class="container">
      <div class="row">
        <div class="col-lg-3"></div>
        <div class="col-lg-6" style="margin-top: 20vh">
          <h4 class="jumbotron">Welcome To Product Road Map Web App!</h4>
          <p id="loginError"></p>
          <div class="form-group">
              <label for="email" class="h6">Email</label>
              <input type="email" class="form-control" id="email" placeholder="example@example.com" >
            </div>


            <div class="form-group">
              <label for="password" class="h6">Password</label>
              <input type="password" class="form-control" id="password">
            </div>

            <div class="form-group">
              <button class="btn btn-primary form-control" onclick="login()">Login</button>
            </div>
        </div>
        <div class="col-lg-3"></div>
      </div>
    </div>
  </div> -->
  <div id="form_Container">
    <div class="container">
      <div class="jumbotron pt-4">
        <h1 class="text-center">Resource Form</h1>
      </div>
      <div class="row">
        <div class="col-lg-6" id="firstSection">
          <form id="form" class="border p-4">

            <!-- Feature Name  -->

            <div class="form-group">
              <label for="title" class="h6">Title</label>
              <input type="text" class="form-control" id="title" placeholder="e.g. Sales Data" >
              <span id="titleError"></span>
            </div>
           
            <!-- Url Dropdown -->
              <!-- <div class="form-group">
                <label for="url" class="h6">Url</label>
                <select  id="url" class="form-control">
                  <option value="">Choose...</option>
                  <option value="www.google.com">Google</option>
                  <option value="www.facebook.com">Facebook</option>
                  <option value="www.instagram.com">Instagram</option>
                </select>
              </div> -->


            <!-- Image Upload -->
            <div class="form-group">
              <p><label for="image" class="h6">Feature Image</label></p>
              <input type="file" class="form-control"  id="image">
              <span id="imageError"></span>
            </div>

            <div class="form-group">
              <p><label for="asset" class="h6">Asset</label></p>
              <input type="file" class="form-control"  id="asset">
              <span id="assetError"></span>
            </div>
            <!-- Button -->
            <div class="form-group">
              <p class="m-3" id="message"></p>
              <button type="submit" class="btn btn-primary form-control" id="submit">Submit</button>
            </div>

          </form>
        </div>

        <!-- prmp-db-admin-sf@trypridesalpha.com -->
        <!-- 203*#hj2khaf7923h4% -->
      
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js" integrity="sha256-BJeo0qm959uMBGb65z40ejJYGSgR7REI4+CW1fNKwOg=" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
      <script src="https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/6.0.2/firebase-database.js"></script>
      <script src="https://www.gstatic.com/firebasejs/6.0.2/firebase-storage.js"></script>
      <script src="https://www.gstatic.com/firebasejs/6.0.2/firebase-auth.js"></script>
      <script src="/office/websites/resources/form.js?v=2"></script>
      </body>
     </html>




