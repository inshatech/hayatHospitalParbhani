let homePage = ()=>{
  let title = "HMS - Insha Technologies";
  document.getElementById("title").innerHTML = title;
  window.history.pushState('index', title, 'index.html');
  changeUrl(); 
  let pageContent = document.getElementById("page-content");
  pageContent.innerHTML = "";  
  pageContent.innerHTML = `
    <!-- Tiny Slider One Wrapper -->
    <div class="tiny-slider-one-wrapper">
      <div class="tiny-slider-one">
        <!-- Single Hero Slide -->
        <div>
          <div class="single-hero-slide bg-overlay" style="background-image: url('./img/slider/1.jpg')"></div>
        </div>

        <!-- Single Hero Slide -->
        <div>
          <div class="single-hero-slide bg-overlay" style="background-image: url('./img/slider/5.jpg')"></div>
        </div>

        <!-- Single Hero Slide -->
        <div>
          <div class="single-hero-slide bg-overlay" style="background-image: url('./img/slider/4.jpg')"></div>
        </div>

        <!-- Single Hero Slide -->
        <div>
          <div class="single-hero-slide bg-overlay" style="background-image: url('./img/slider/2.jpg')"></div>
        </div>

        <!-- Single Hero Slide -->
        <div>
          <div class="single-hero-slide bg-overlay" style="background-image: url('./img/slider/3.jpg')"></div>
        </div>
      </div>
    </div>

    <div class="pt-3"></div>
    
    <div class="container direction-rtl">
      <div class="card mb-3">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-4">
              <div class="feature-card mx-auto text-center home-link">
                <div class="card mx-auto bg-gray">
                  <h3 class="fa-solid fa-person-circle-plus text-warning"></h3>
                </div>
                <p class="mb-0">Add OPD</p>
              </div>
            </div>

            <div class="col-4">
              <div class="feature-card mx-auto text-center home-link">
                <div class="card mx-auto bg-gray">
                  <h3 class="fa-solid fa-stethoscope text-info"></h3>
                </div>
                <p class="mb-0">OPD&#39;s</p>
              </div>
            </div>

            <div class="col-4">
              <div class="feature-card mx-auto text-center home-link">
                <div class="card mx-auto bg-gray">
                  <h3 class="fa-solid fa-chart-line text-dark"></h3>
                </div>
                <p class="mb-0">Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container direction-rtl">
      <div class="card mb-3">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-4">
              <div class="feature-card mx-auto text-center home-link">
                <div class="card mx-auto bg-gray">
                  <h3 class="fa-solid fa-user-plus text-dark"></h3>
                </div>
                <p class="mb-0">Add IPD</p>
              </div>
            </div>

            <div class="col-4">
              <div class="feature-card mx-auto text-center home-link">
                <div class="card mx-auto bg-gray">
                  <h3 class="fa-solid fa-bed-pulse text-info"></h3>
                </div>
                <p class="mb-0">IPD&#39;s</p>
              </div>
            </div>

            <div class="col-4">
              <div class="feature-card mx-auto text-center home-link">
                <div class="card mx-auto bg-gray">
                  <h3 class="fa-solid fa-chart-line text-success"></h3>
                </div>
                <p class="mb-0">Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pb-3"></div>
  `;
}

homePage();