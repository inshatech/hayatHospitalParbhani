let pathName = window.location.pathname.replace('/', '');
let headerArea;
if (pathName == 'settings.html' || pathName == 'opd.html' || pathName == 'add-fitness.html' || pathName == 'list-fitness.html' || pathName == 'add-ipd.html' || pathName == 'list-ipds.html' || pathName == 'add-discharge.html' || pathName == 'list-discharge.html' || pathName == 'add-scalp.html' || pathName == 'list-scalps.html' || pathName == 'dd.html') {
  let path = pathName.replace('.html', '');
  let title = path.toUpperCase()
  headerArea = `
    <!-- Dark mode switching -->
    <div class="dark-mode-switching">
      <div class="d-flex w-100 h-100 align-items-center justify-content-center">
        <div class="dark-mode-text text-center"><i class="bi bi-moon"></i>
          <p class="mb-0">Switching to dark mode</p>
        </div>
        <div class="light-mode-text text-center"><i class="bi bi-brightness-high"></i>
          <p class="mb-0">Switching to light mode</p>
        </div>
      </div>
    </div>
    <!-- RTL mode switching -->
    <div class="rtl-mode-switching">
      <div class="d-flex w-100 h-100 align-items-center justify-content-center">
        <div class="rtl-mode-text text-center"><i class="bi bi-text-right"></i>
          <p class="mb-0">Switching to RTL mode</p>
        </div>
        <div class="ltr-mode-text text-center"><i class="bi bi-text-left"></i>
          <p class="mb-0">Switching to default mode</p>
        </div>
      </div>
    </div>
    <div class="header-area" id="headerArea">
      <div class="container">
        <!-- Header Content-->
        <div class="header-content header-style-four position-relative d-flex align-items-center justify-content-between">
          <!-- Back Button-->
          <div class="back-button"><a href="index.html"><i class="bi bi-arrow-left-short"></i></a></div>
          <!-- Page Title-->
          <div class="page-heading">
            <h6 class="mb-0">${title}</h6>
          </div>
          <!-- User Profile-->
          <div class="user-profile-wrapper">
          
          </div>
        </div>
      </div>
    </div>
  `;
} else {
  headerArea = `
  <div class="container">
    <!-- Header Content -->
    <div class="header-content header-style-five position-relative d-flex align-items-center justify-content-between">

      <!-- Logo Wrapper -->
      <div class="logo-wrapper">
        <a href="index.html">
          <img src="img/logo/logo.png" alt="">
        </a>
      </div>

      <!-- Navbar Toggler -->
      <div class="navbar--toggler" id="affanNavbarToggler" data-bs-toggle="offcanvas" data-bs-target="#affanOffcanvas"
        aria-controls="affanOffcanvas">
        <span class="d-block"></span>
        <span class="d-block"></span>
        <span class="d-block"></span>
      </div>
    </div>
  </div>
`;
}
document.getElementById("headerArea").innerHTML = headerArea;