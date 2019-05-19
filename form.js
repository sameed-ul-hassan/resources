// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAHilP36aqXKE3tNB3qi-X0ovrUvQNDS3c",
    authDomain: "tryp-resources.firebaseapp.com",
    databaseURL: "https://tryp-resources.firebaseio.com",
    projectId: "tryp-resources",
    storageBucket: "tryp-resources.appspot.com",
    messagingSenderId: "566459512204",
    appId: "1:566459512204:web:a414dd8fee842c48"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let db = firebase.database().ref("Resources Form Data");
  let storage = firebase.storage().ref();
  let downloadurl;
  var title = "";
  var fileInput;
  let featureImageUrl = "";
  let assetUrl = "";
  
  firebase
    .auth()
    .signInWithEmailAndPassword("resource-db-admin@tryprides.com", "zxcv%@bnm}")
    .catch(function(error) {
      // Handle Errors here.
  
      var errorCode = error.code;
      var errorMessage = error.message;
  
      if (errorCode === "auth/wrong-password") {
        displayErrorWithMessage(
          "loginError",
          "Either Email or Password is wrong"
        );
      } else {
        console.log(errorMessage);
      }
    });
  
  firebase.auth().onAuthStateChanged(user => {
    var user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
      console.log("valid user");
    } else {
      console.log("don't be smart login first");
    }
  });
  
  document.getElementById("submit").addEventListener("click", e => {
    removeErrorAlerts();
    title = document.getElementById("title").value;
    fileInput = document.querySelector("#image").files[0];
  
    // var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    // if(!allowedExtensions.exec(fileInput.name)){
    //     document.getElementById("message").innerHTML = `
    //       <div class="alert alert-danger mt-4">
    //               <strong>Warning!</strong> Please upload file having extensions .jpeg/.jpg/.png/.gif only.
    //               </div>
    //     `;
    // }else{
  
    //     return fileInput;
    // }
    var assetInput = document.querySelector("#asset").files[0];
    e.preventDefault();
    formValidate();
    imageAssetUpload(fileInput, assetInput);
    form.reset();
  });
  
  function imageAssetUpload(fileInput, assetInput) {
    var metadata = {
      contentType: "image/jpeg"
    };
  
    var uploadTask = storage
      .child("images/" + fileInput.name)
      .put(fileInput, metadata);
    firebaseFileUpload(uploadTask, "featureImageUrl");
  
    // var storageRef = firebase.storage.ref("images/" + fileInput.name);
  
    var uploadasset = storage.child("assets/" + assetInput.name).put(assetInput);
    firebaseFileUpload(uploadasset, "assetUrl");
  }
  
  function createDatabaseRecord(title, featureImageUrl, assetUrl) {
    var formData = {
      Title: title,
      FeatureImage: featureImageUrl,
      AssetUrl: assetUrl
    };
  
    db.push().update(formData, function(error) {
      if (error) {
          console.log(error)
        } else {
          featureImageUrl = "";
          assetUrl = "";
        }
      });
  }
  
  function firebaseFileUpload(taskVariable, imageAssetUrlVariable) {
    taskVariable.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      error => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
  
          case "storage/canceled":
            break;
  
          case "storage/unknown":
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        taskVariable.snapshot.ref.getDownloadURL().then(downloadURL => {
          // return downloadURL;
  
          if (imageAssetUrlVariable == "featureImageUrl") {
            featureImageUrl = downloadURL;
          } else if (imageAssetUrlVariable == "assetUrl") {
            assetUrl = downloadURL;
          }
  
          if (assetUrl != "" && featureImageUrl != "") {
            createDatabaseRecord(title, featureImageUrl, assetUrl);
            featureImageUrl = "";
            assetUrl = "";
            document.getElementById("message").innerHTML = `
          <div class="alert alert-success" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <strong>Success!</strong> Form is submitted successfully!
          </div>
          `;
          }
        });
      }
    );
  }
  
  function formValidate() {
    var error = false;
    if (document.getElementById("title").value == "") {
      error = true;
      displayErrorWithMessage("titleError", "Please enter title.");
    }
    if (document.getElementById("image").value == "") {
      error = true;
      displayErrorWithMessage("imageError", "Please upload Feature Image.");
    }
  
    if (document.getElementById("asset").value == "") {
      error = true;
      displayErrorWithMessage("assetError", "Please upload Asset File.");
    }
  
    if (error == true) {
      return false;
    } else {
      return true;
    }
  }
  
  function displayErrorWithMessage(divID, message) {
    var alertID = divID + "Alert";
  
    $("#" + divID).html(`
                    <div id="${alertID}" class="alert alert-danger mt-4">
                    <strong>Warning!</strong> ${message}
                    </div>
                    `);
  
    $("#" + alertID).show();
  }
  
  function removeErrorAlerts() {
    $(".alert-danger").hide();
    console.log("clear msg");
  }
  