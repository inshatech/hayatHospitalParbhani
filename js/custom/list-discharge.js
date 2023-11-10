let discharge_list = {};
/**
 * Returns today's date in the format of "YYYY-MM-DD".
 * @returns {string} - today's date in the format of "YYYY-MM-DD".
 */
const todaysDate = () => {
  let date = new Date();
  let month = date.getMonth() + 1
  let day = date.getDate();
  let todaysDate = `${date.getFullYear()}-${month}-${day}`;
  return todaysDate;
}

/**
 * Appends a fitness certificate record to the list of records displayed on the page.
 * @param {Object} dischargeCertificate - The fitness certificate object to append to the list.
 * @returns None
 */
function appendRecords(dischargeCertificate) {
  document.getElementById("recordsPlace").innerHTML += `
    <div class="alert unread custom-alert-1 alert-dark bg-white" >
      <!-- <i class="mt-0"></i> -->
      <div class="alert-text w-100">
        <div class="card-ipd-head">
          <div class="text-danger fw-bold">${dischargeCertificate.srNo}</div>
          <div class="text-black">#${dischargeCertificate.cert_id}</div>
          <div class="text-danger fw-bold">${dischargeCertificate.bedNo}</div>
        </div>
        <div class="ipd-body">
          <div class="ipd-body-left">
            <span class="text-info fw-bold text-truncate">${dischargeCertificate.name}</span>
            <span class="text-truncate">A: ${dischargeCertificate.doa}</span>
            <span>D: ${dischargeCertificate.dod == null ? '-' : dischargeCertificate.dod}</span>
            <span>T: ${dischargeCertificate.dateTimeStamp} (${dischargeCertificate.timeAgo})</span>
          </div>
          <div class="ipd-body-right">
            <span class="text-truncate text-info fw-bold">${dischargeCertificate.age}/${dischargeCertificate.sex == 'Female' ? "F" : "M"}</span>
            <!-- <span class="text-truncate fw-bold text-black-50">${dischargeCertificate.mobile}</span> -->
          </div>
        </div>
        <div>
          <a class="btn m-1 btn-info" href="./add-discharge.html?certId=${dischargeCertificate.cert_id}"><i class="fa-solid fa-pen-to-square"></i> Update</a>
          <a class="btn m-1 btn-success" href="./templates/discharge-certificate.html?certId=${dischargeCertificate.cert_id}"><i class="fa-solid fa-print"></i> Print</a>
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
    let response = await fetch(`${url}get-certificate`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        date: todaysDate(),
      }),
    });

    let data = await response.json();
    if (data.status == 'ok') {
      document.getElementById("processing").style.display = "none";
      const dischargeList = data.data;
      for (const dischargeCertificate of dischargeList) {
        discharge_list[dischargeCertificate.cert_id] = dischargeCertificate;
        appendRecords(dischargeCertificate);
      }
      document.getElementById("totalCounts").innerText = ` ${data.count}`;
    } else if (data.message != 'Authorization failed!') {
      document.getElementById("processing").style.display = "none";
      document.getElementById("recordsPlace").innerHTML += `
        <div class='noRecords'>
          <img src="./img/bg-img/box.png" alt="image">
          <p>No records found!</p>
        </div>
      `;
    } else {
      window.location = './login.html';
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Adds an event listener to the search box that filters the discharge_list object based on the user's input.
 * @returns None
 */
document.getElementById("search-box").onkeyup = () => {
  let query = String(document.getElementById("search-box").value).toLowerCase();
  let searched = [];
  if (query != "") {
    for (key of Object.keys(discharge_list)) {
      if (
        String(discharge_list[key].name).toLowerCase().search(query) != -1 ||
        String(discharge_list[key].age).search(query) != -1 ||
        String(discharge_list[key].sex).toLowerCase().search(query) != -1 ||
        String(discharge_list[key].city).toLowerCase().search(query) != -1 ||
        String(discharge_list[key].date).search(query) != -1 ||
        String(discharge_list[key].bedNo).toLowerCase().search(query) != -1 ||
        String(discharge_list[key].referer).toLowerCase().search(query) != -1
      ) {
        searched.push(discharge_list[key]);
      }
      document.getElementById("recordsPlace").innerHTML = "";
    }
    for (dischargeCertificate of searched) {
      appendRecords(dischargeCertificate);
    }
  } else {
    document.getElementById("recordsPlace").innerHTML = "";
    for (key of Object.keys(discharge_list)) {
      let dischargeCertificate = discharge_list[key];
      appendRecords(dischargeCertificate);
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
    let response = await fetch(`${url}get-certificate`, {
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
    let dischargeList = data.data;
    document.getElementById("recordsPlace").innerHTML = "";
    document.getElementById("date-search-btn").innerHTML = `<i class="fa-solid fa-magnifying-glass  "></i> Search`;
    if (data.status == "ok") {
      for (key of Object.keys(dischargeList)) {
        let dischargeCertificate = dischargeList[key];
        discharge_list[dischargeCertificate.cert_id] = dischargeCertificate;
        appendRecords(dischargeCertificate);
      }
      document.getElementById("totalCounts").innerText = ` ${data.count}`;
    } else {
      Swal.fire({
        title: 'Error Occurred!',
        text: data.message,
        icon: 'error',
        confirmButtonColor: '#ea4c62',
        confirmButtonText: 'Okay'
      })
    }
  }
}