document.getElementById("sideNav").innerHTML = `
  <div class="offcanvas offcanvas-start" id="affanOffcanvas" data-bs-scroll="true" tabindex="-1" aria-labelledby="affanOffcanvsLabel">
    <button class="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    <div class="offcanvas-body p-0">
      <div class="sidenav-wrapper">
        <!-- Sidenav Profile -->
        <div class="sidenav-profile bg-gradient">
          <div class="sidenav-style1"></div>

          <!-- User Thumbnail -->
          <div class="user-profile">
            <img src="./img/users/user.jpg" alt="">
          </div>

          <!-- User Info -->
          <div class="user-info">
            <h6 class="user-name mb-0" id="name-sideNav"></h6>
            <span id="details-sideNav"></span>
          </div>
        </div>

        <!-- Sidenav Nav -->
        <ul class="sidenav-nav ps-0">
          <li>
            <a href="home.html"><i class="fa-solid fa-house-flag"></i> Home</a>
          </li>
          <li>
            <a href="opd.html"><i class="fa-solid fa-stethoscope"></i> OPD&#39;s</a>
          </li>
          <li>
            <a href="ipd.html"><i class="fa-solid fa-bed-pulse"></i> IPD&#39;s</a>
          </li>
          <li>
            <a href="settings.html"><i class="fa-solid fa-sliders"></i> Settings</a>
          </li>
          <li>
            <div class="night-mode-nav">
            <i class="fa-solid fa-lightbulb"></i> Night Mode
              <div class="form-check form-switch">
                <input class="form-check-input form-check-success" id="darkSwitch" type="checkbox">
              </div>
            </div>
          </li>
          <li>
            <a href="login.html"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
          </li>
        </ul>

        <!-- Social Info -->
        <div class="social-info-wrap">
          <a href="#">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="#">
            <i class="bi bi-twitter"></i>
          </a>
          <a href="#">
            <i class="bi bi-linkedin"></i>
          </a>
        </div>

        <!-- Copyright Info -->
        <div class="copyright-info">
          <p>
            Powered By: <a href="https://www.inshatech.com" target="_blank">Insha Technologies</a>
          </p>
        </div>
      </div>
    </div>
  </div>
`;