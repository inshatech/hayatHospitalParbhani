let fitness_list = {};
/**
 * Returns today's date in the format of "YYYY-MM-DD".
 * @returns {string} - today's date in the format of "YYYY-MM-DD".
 */
const todaysDate = ()=>{
  let date = new Date();
  let month = date.getMonth() + 1
  let day = date.getDate();
  let todaysDate = `${date.getFullYear()}-${month}-${day}`;
  return todaysDate;
}

/**
 * Appends a fitness certificate record to the list of records displayed on the page.
 * @param {Object} fitnessCertificate - The fitness certificate object to append to the list.
 * @returns None
 */
function appendRecords(fitnessCertificate){
  document.getElementById("recordsPlace").innerHTML += `
    <div class="alert unread custom-alert-1 alert-dark bg-white" >
      <!-- <i class="mt-0"></i> -->
      <div class="alert-text w-100">
        <div class="card-ipd-head">
          <div class="text-black">#${fitnessCertificate.fitness_id}</div>
          <div class="text-danger fw-bold">${fitnessCertificate.mobile}</div>
          <span class="text-truncate text-info fw-bold">${fitnessCertificate.age}/${fitnessCertificate.sex == 'Female' ? "F" : "M"}</span>
        </div>
        <div class="ipd-body">
          <div class="ipd-body-left">
            <span class="text-info fw-bold text-truncate">${fitnessCertificate.name}</span>
            <span class="text-truncate">R: ${fitnessCertificate.referer == null ? '-' : fitnessCertificate.referer}</span>
            <span class="text-truncate">P: ${fitnessCertificate.postedFor}</span>
            <span class="text-truncate">T: ${fitnessCertificate.dateTimeStamp}</span>
          </div>
          <div class="ipd-body-right">
          <!-- <span class="text-truncate text-info fw-bold">${fitnessCertificate.age}/${fitnessCertificate.sex == 'Female' ? "F" : "M"}</span>
            <span class="text-truncate fw-bold text-black-50">${fitnessCertificate.mobile}</span> -->
          </div>
        </div>
        <div class="ipd-buttons">
          <a class="btn btn-info" href="./add-fitness.html?fitnessId=${fitnessCertificate.fitness_id}"><i class="fa-solid fa-pen-to-square"></i> Update</a>
          <a class="btn btn-success" href="./templates/fitness.html?fitnessId=${fitnessCertificate.fitness_id}"><i class="fa-solid fa-print"></i> Print</a>
        </div>
      </div
    </div>
  `;
}

/**
 * Sets an onload event listener on the body element of the document. When the body is loaded,
 * sends a POST request to the server to retrieve fitness data for the current date. If the request
 * is successful, the retrieved data is used to populate the fitness list and append records to the
 * page. If the request fails due to an authorization error, the user is redirected to the login page.
 * @async
 * @returns None
 */
document.getElementsByTagName("body")[0].onload = async () => {
  try {
    let response = await fetch(`${url}getFitness`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      // body: JSON.stringify({
      //   date: todaysDate(),
      // }),
    });

    let data = await response.json();
    if (data.status == 'ok') {
      document.getElementById("processing").style.display = "none";
      const fitnessList = data.data;
      for (const fitnessCertificate of fitnessList) {
        fitness_list[fitnessCertificate.fitness_id] = fitnessCertificate;
        appendRecords(fitnessCertificate);
      }
      document.getElementById("totalCounts").innerText = ` ${data.count}`;
    }else if(data.message != 'Authorization failed!'){
      document.getElementById("processing").style.display = "none";
      document.getElementById("recordsPlace").innerHTML +=`
        <div class='noRecords'>
          <img src="./img/bg-img/box.png" alt="image">
          <p>No records found!</p>
        </div>
      `;
    }else{
      window.location = './login.html';
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Adds an event listener to the search box that filters the fitness_list object based on the user's input.
 * @returns None
 */
document.getElementById("search-box").onkeyup = () => {
  let query = String(document.getElementById("search-box").value).toLowerCase();
  let searched = [];
  if (query != "") {
    for (key of Object.keys(fitness_list)) {
      if (
        String(fitness_list[key].name).toLowerCase().search(query) != -1 ||
        String(fitness_list[key].age).search(query) != -1 ||
        String(fitness_list[key].sex).toLowerCase().search(query) != -1 ||
        String(fitness_list[key].city).toLowerCase().search(query) != -1 ||
        String(fitness_list[key].date).search(query) != -1 ||
        String(fitness_list[key].mobile).search(query) != -1 ||
        String(fitness_list[key].referer).toLowerCase().search(query) != -1
      ) {
        searched.push(fitness_list[key]);
      }
      document.getElementById("recordsPlace").innerHTML = "";
    }
    for (fitnessCertificate of searched) {
      appendRecords(fitnessCertificate);
    }
  } else {
    document.getElementById("recordsPlace").innerHTML = "";
    for (key of Object.keys(fitness_list)) {
      let fitnessCertificate = fitness_list[key];
      appendRecords(fitnessCertificate);
    }
  }
}

/**
 * Attaches an onclick event listener to the "date-search-btn" element. When clicked, this function
 * sends a POST request to the server to retrieve fitness data between the specified dates. If the
 * request is successful, the retrieved data is displayed on the page. If the request fails, an error
 * message is displayed to the user.
 * @returns None
 */
document.getElementById("date-search-btn").onclick = async () => {
  let from = document.getElementById("inputDateFrom").value;
  let to = document.getElementById("inputDateTo").value;
  if (from != "" && to != "") {
    document.getElementById("date-search-btn").innerHTML = `<div id="spinner" class="spinner-border spinner-border-sm text-success mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;
    let response = await fetch(`${url}getFitness`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        between_dates: {
          start_date: from,
          end_date: to,
        },
      }),
    });

    let data = await response.json();
    let fitnessList = data.data;
    document.getElementById("recordsPlace").innerHTML = "";
    document.getElementById("date-search-btn").innerHTML = `<i class="fa-solid fa-magnifying-glass  "></i> Search`;
    if (data.status == "ok") {
      for (key of Object.keys(fitnessList)) {
        let fitnessCertificate = fitnessList[key];
        fitness_list[fitnessCertificate.fitness_id] = fitnessCertificate;
        appendRecords(fitnessCertificate);
      }
      document.getElementById("totalCounts").innerText = ` ${data.count}`;
    } else {
      Swal.fire({
        title:'Error Occurred!',
        text:data.message,
        icon:'error',
        confirmButtonColor: '#ea4c62',
        confirmButtonText: 'Okay'
      })
    }
  }
}