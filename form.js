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
var title;
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
      console.log(error);
    } else {
      featureImageUrl = "";
      assetUrl = "";
      readData();
      setTimeout(function() {
        $(".alert-success").hide();
      }, 3000);
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

function readData() {
  db.once("value").then(data => {
    data.forEach(ele => {
      var dataValues = ele.val();
      var key = ele.key;
      document.getElementById("cardSection").innerHTML += `

     <div class="card mb-3 mt-4 ">
     <div class="card-body">
         <h4 class="card-title text-center text-warning">${
           dataValues.Title
         }</h4>

         <p class="card-text ">Title: ${dataValues.Title}</p>
         <p class="card-text ">Feature Image Url: ${dataValues.FeatureImage}</p>
         <p class="card-text ">Asset Url: ${dataValues.AssetUrl}</p>
         <button type="submit" class="btn btn-primary" onclick="updateData('${key}','${
        dataValues.Title
      }','${dataValues.FeatureImage}','${dataValues.AssetUrl}')">Edit</button>

          <button type="submit" class="btn btn-danger" onclick="deleteData('${key}')">DELETE</button>
    </div>
    </div>`;
    });
  });
}

function updateData(key, title, imgUrl, assetUrl) {
  document.getElementById("firstSection").innerHTML = `

      <form class="border p-4 mb-4" id="form2">

          <div class="form-group">
          <label for="title2" class="h6">Title</label>
          <input type="text" class="form-control" id="title2" placeholder="e.g. Sales Data" >
          <span id="titleError"></span>
        </div>

        <div class="form-group">
          <label for="oldImageUrl" class="h6">Feature Image Url</label>
          <input type="text" class="form-control" id="oldImageUrl" readonly>
          <span id="titleError"></span>
        </div>

        <div class="form-group">
          <label for="oldAssetUrl" class="h6">Asset Url</label>
          <input type="text" class="form-control" id="oldAssetUrl" readonly>
          <span id="titleError"></span>
        </div>

        <!-- Image Upload -->
        <div class="form-group">
          <p><label for="image" class="h6">New Feature Image</label></p>
          <input type="file" class="form-control"  id="newImageUrl">
          <span id="imageError"></span>
        </div>

        <div class="form-group">
          <p><label for="asset" class="h6">New Asset</label></p>
          <input type="file" class="form-control"  id="newAssetUrl">
          <span id="assetError"></span>
        </div>

        <button style="display:none" id="button1" class="btn btn-primary">Submit</button>
        <button type="submit"  style="display:inline-block" id="button2" class="btn btn-success">Update</button>
        <button  style="display:inline-block" id="button3" class="btn btn-danger">Cancel</button>

      </form> `;

  document.getElementById("form2").addEventListener("submit", e => {
    e.preventDefault();
  });
  document.getElementById("button3").addEventListener("click", e => {
    reset();
    readData();
  });
  document.getElementById("button2").addEventListener("click", e => {
    title = document.getElementById("title2").value;
    console.log(title);
    fileInput = document.querySelector("#newImageUrl").files[0];
    var assetInput = document.querySelector("#newAssetUrl").files[0];

    if (fileInput != "" && fileInput != undefined && assetInput != "" && assetInput != undefined) {
      var uploadTask = storage.child("images/" + fileInput.name).put(fileInput);
      firebaseNewFileUpload(uploadTask, "featureImageUrl", key, title);

      var uploadasset = storage
        .child("assets/" + assetInput.name)
        .put(assetInput);
      firebaseNewFileUpload(uploadasset, "assetUrl", key, title);
    }

    else if (fileInput != "" && fileInput != undefined) {
      var uploadTask = storage.child("images/" + fileInput.name).put(fileInput);
      firebaseNewFileUpload(uploadTask, "featureImageUrl", key, title);
    }
    
   else if (assetInput != "" && assetInput != undefined) {
      var uploadasset = storage
        .child("assets/" + assetInput.name)
        .put(assetInput);
      firebaseNewFileUpload(uploadasset, "assetUrl", key, title);
    }
    

  });
  document.getElementById("title2").value = title;
  document.getElementById("oldImageUrl").value = imgUrl;
  document.getElementById("oldAssetUrl").value = assetUrl;
}

function reset() {
  document.getElementById("firstSection").innerHTML = `
    <form id="form" class="border p-4">

      <!-- Title Name  -->

      <div class="form-group">
        <label for="title" class="h6">Title</label>
        <input type="text" class="form-control" id="title" placeholder="e.g. Sales Data" >
        <span id="titleError"></span>
      </div>

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
  `;
  document.getElementById(
    "cardSection"
  ).innerHTML = `<div id="success-msg"></div>`;
}

function deleteData(id) {
  console.log("it runs");
  db.child(id).remove();
  reset();
  readData();
  document.getElementById("success-msg").innerHTML = `
  <div class="alert alert-success" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <strong>Success!</strong> Resource is deleted successfully!
  </div>
  `;
  setTimeout(function() {
    $(".alert-success").hide();
  }, 3000);
}

function firebaseNewFileUpload(
  taskVariable,
  imageAssetUrlVariable,
  key,
  title
) {
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
          updateDatabaseRecord(featureImageUrl, assetUrl, key, title);
          featureImageUrl = "";
          assetUrl = "";
          document.getElementById("success-msg").innerHTML = `
        <div class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <strong>Success!</strong> Resource is updated successfully!
        </div>
        `;
        }
       else if (featureImageUrl != "") {
          updateDatabaseRecord(featureImageUrl, assetUrl, key, title);
          featureImageUrl = "";
          assetUrl = "";
          document.getElementById("success-msg").innerHTML = `
        <div class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <strong>Success!</strong> Resource is updated successfully!
        </div>
        `;
        }
       else if (assetUrl != "") {
          updateDatabaseRecord(featureImageUrl, assetUrl, key, title);
          featureImageUrl = "";
          assetUrl = "";
          document.getElementById("success-msg").innerHTML = `
        <div class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <strong>Success!</strong> Resource is updated successfully!
        </div>
        `;
        }
      });
    }
  );
}

function updateDatabaseRecord(featureImageUrl, assetUrl, id, title) {
  if (featureImageUrl != "" && assetUrl != "" && title != "") {
    var dataUpdate = {
      Title: title,
      FeatureImage: featureImageUrl,
      AssetUrl: assetUrl
    };
    db.child(id).update(dataUpdate);
    console.log("data updated");
    reset();
    readData();
    setTimeout(function() {
      $(".alert-success").hide();
    }, 3000);
  } else if (featureImageUrl != "") {
    var dataUpdate = {
      FeatureImage: featureImageUrl
    };
    db.child(id).update(dataUpdate);
    console.log("data updated");
    reset();
    readData();
    setTimeout(function() {
      $(".alert-success").hide();
    }, 3000);
  } else if (assetUrl != "") {
    var dataUpdate = {
      AssetUrl: assetUrl
    };
    db.child(id).update(dataUpdate);
    console.log("data updated");
    reset();
    readData();
    setTimeout(function() {
      $(".alert-success").hide();
    }, 3000);
  }
}
