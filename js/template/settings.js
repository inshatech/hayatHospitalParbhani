let settingsPage = ()=>{
  let title = "Settings";
  document.getElementById("title").innerHTML = title;
  window.history.pushState('index.html', title, 'settings');
  changeUrl(); 
  let pageContent = document.getElementById("page-content");
  pageContent.className ="page-content-wrapper py-3";
  pageContent.innerHTML = "";
  pageContent.innerHTML = `
    <div class="container">
      <!-- Setting Card-->
      <div class="card mb-3 shadow-sm">
        <div class="card-body direction-rtl">
          <p class="mb-2">Settings</p>

          <div class="single-setting-panel">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked>
              <label class="form-check-label" for="flexSwitchCheckDefault">Availability Status</label>
            </div>
          </div>

          <div class="single-setting-panel">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault2" checked>
              <label class="form-check-label" for="flexSwitchCheckDefault2">Send Me Notifications</label>
            </div>
          </div>

          <div class="single-setting-panel">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="darkSwitch">
              <label class="form-check-label" for="darkSwitch">Dark Mode</label>
            </div>
          </div>

          <div class="single-setting-panel">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="rtlSwitch">
              <label class="form-check-label" for="rtlSwitch">RTL Mode</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Setting Card-->
      <div class="card mb-3 shadow-sm">
        <div class="card-body direction-rtl">
          <p class="mb-2">Account Setup</p>

          <div class="single-setting-panel">
            <a href="#" id="profile-page">
              <div class="icon-wrapper">
                <i class="bi bi-person"></i>
              </div>
              Profile
            </a>
          </div>

          <div class="single-setting-panel">
            <a href="user-profile.html">
              <div class="icon-wrapper bg-warning">
                <i class="bi bi-pencil"></i>
              </div>
              Update Bio
            </a>
          </div>

          <div class="single-setting-panel">
            <a href="change-password.html">
              <div class="icon-wrapper bg-info">
                <i class="bi bi-lock"></i>
              </div>
              Change Password
            </a>
          </div>

          <div class="single-setting-panel">
            <a href="language.html">
              <div class="icon-wrapper bg-success">
                <i class="bi bi-globe2"></i>
              </div>
              Language
            </a>
          </div>

          <div class="single-setting-panel">
            <a href="privacy-policy.html">
              <div class="icon-wrapper bg-danger">
                <i class="bi bi-shield-lock"></i>
              </div>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <!-- Setting Card-->
      <div class="card shadow-sm">
        <div class="card-body direction-rtl">
          <p class="mb-2">Register &amp; Logout</p>

          <div class="single-setting-panel">
            <a href="register.html">
              <div class="icon-wrapper bg-primary">
                <i class="bi bi-person"></i>
              </div>
              Create New Account
            </a>
          </div>

          <div class="single-setting-panel">
            <a href="login.html">
              <div class="icon-wrapper bg-danger">
                <i class="bi bi-box-arrow-right"></i>
              </div>
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("profile-page").onclick = () =>{
    profilePage();
  }

}