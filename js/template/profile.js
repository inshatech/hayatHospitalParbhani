let profilePage = ()=>{
  onLoad();
  let title = "Profile";
  document.getElementById("title").innerHTML = title;
  window.history.pushState('settings', title, 'profile');
  changeUrl();
  let pageContent = document.getElementById("page-content");
  pageContent.className ="page-content-wrapper py-3";
  pageContent.innerHTML = "";
  pageContent.innerHTML = `
    <div class="container">
      <!-- User Information-->
      <div class="card user-info-card mb-3">
        <div class="card-body d-flex align-items-center">
          <div class="user-profile me-3" ><img id="profile-image" src="img/bg-img/2.jpg" alt=""><i class="bi bi-pencil"></i>
            <form action="#">
              <input class="form-control" type="file">
            </form>
          </div>
          <div class="user-info">
            <div class="d-flex align-items-center">
              <h5 class="mb-1" id="profile-name">Demo</h5><span class="badge bg-warning ms-2 rounded-pill" id="profile-role">Pro</span>
            </div>
            <p class="mb-0" id="profile-designation">UX/UI Designer</p>
          </div>
        </div>
      </div>
      <!-- User Meta Data-->
      <div class="card user-data-card">
        <div class="card-body">
          <form>
            <div class="form-group mb-3">
              <label class="form-label" for="Username">Name</label>
              <input class="form-control" id="username" type="text" placeholder="Name">
            </div>
            <div class="form-group mb-3">
              <label class="form-label" for="email">Email Address</label>
              <input class="form-control" id="email" type="text" placeholder="Email Address" readonly>
            </div>
            <div class="form-group mb-3">
              <label class="form-label" for="mobile">Mobile</label>
              <input class="form-control" id="mobile" type="text" placeholder="Mobile" readonly>
            </div>
            <div class="form-group mb-3">
              <label class="form-label" for="address">Address</label>
              <input class="form-control" id="address" type="text" placeholder="Address">
            </div>
            <button class="btn btn-success w-100" id="edit-btn">Update Now</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

const onLoad = async () => {
  console.log("working...");
  try {
      let response = await fetch(`${url}get-user`, {
          method: "POST",
          headers: {
              Accept: "*/*",
              Authorization: localStorage.getItem("jwtTempToken"),
          },
          body: JSON.stringify({
              user_id: localStorage.getItem("user_id"),
          }),
      });

      let data = await response.json();
      console.log(data);
      if(data.status != 'false'){
        console.log(data.data[0].name);
        localStorage.setItem('username',data.data[0].name)
        document.getElementById("profile-image").src = data.data[0].image;
        document.getElementById("username").value = data.data[0].name;
        document.getElementById("profile-name").innerHTML = data.data[0].name;
        document.getElementById("designation").value = data.data[0].designation;
        document.getElementById("designation-label").innerHTML = data.data[0].designation;
        document.getElementById("email").value = data.data[0].email;
        document.getElementById("mobile").value = data.data[0].mobile;
        document.getElementById("address").value = data.data[0].address;
        let boxes = document.getElementsByTagName("input");
        for (box in boxes) {
          boxes[box].disabled = true;
        }
      }else{
        window.location = 'login.html';
      }
  } catch {
  }
};

document.getElementById("edit-btn").onclick = async (e) => {
  e.preventDefault(e);
  let editbtn = document.getElementById("edit-btn");
  document.getElementById("change-password-btn").disabled = true;

  if (editbtn.innerHTML === "Edit") {
      
      editbtn.innerHTML = "Save";
      let boxes = document.getElementsByTagName("input");
      for (box in boxes) {
          boxes[box].disabled = false;
      }
  } else {
      editbtn.innerHTML = `<div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
      <span class="visually-hidden">Loading...</span>
      </div>`
      let imagesrc = document.getElementById("profile-image").src;
      let username = document.getElementById("username").value;
      let designation = document.getElementById("designation").value;
      let email = document.getElementById("email").value;
      let mobile = document.getElementById("mobile").value;
      let address = document.getElementById("address").value;

      if (
          username != "" &&
          designation != "" &&
          email != "" &&
          mobile != "" &&
          address != ""
      ) {
          try {
              let response = await fetch(`${url}user`, {
                  method: "PUT",
                  headers: {
                      Accept: "*/*",
                      Authorization: localStorage.getItem("jwtTempToken"),
                  },
                  body: JSON.stringify({
                      user_id: localStorage.getItem("user_id"),
                      name: username,
                      designation: designation,
                      mobile: mobile,
                      email: email,
                      address: address,
                      role: 0,
                      permissions: { Read: true, Write: true },
                  }),
              });

              let data = await response.json();
              console.log(data);
              if (data.status === "ok") {
                  let boxes = document.getElementsByTagName("input");
                  for (box in boxes) {
                      boxes[box].disabled = true;
                  }
                  editbtn.innerHTML = "Edit";
                  document.getElementById("change-password-btn").disabled = false;
              }
          } catch {
              window.location = "login.html";
          }
      }
  }
};
