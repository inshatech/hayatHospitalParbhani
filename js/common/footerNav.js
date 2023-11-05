document.getElementById("footerNav").innerHTML = `
  <div class="container px-0">
    <!-- Footer Content -->
    <div class="footer-nav position-relative">
      <ul class="h-100 d-flex align-items-center justify-content-between ps-0">
        <li id="index">
          <a href="index.html">
            <i class="fa-solid fa-house-flag"></i>
            <span>Home</span>
          </a>
        </li>

        <li  id="opd">
          <a href="opd.html">
          <i class="fa-solid fa-stethoscope"></i>
            <span>OPD</span>
          </a>
        </li>

        <li  id="ipd">
          <a href="list-ipds.html">
            <i class="fa-solid fa-bed-pulse"></i>
            <span>IPD</span>
          </a>
        </li>

        <li  id="reports">
          <a href="reports.html">
            <i class="fa-solid fa-clipboard-list"></i>
            <span>Reports</span>
          </a>
        </li>

        <li  id="settings">
          <a href="settings.html">
            <i class="fa-solid fa-sliders"></i>
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
`;