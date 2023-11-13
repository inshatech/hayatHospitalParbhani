let scalp_list = {};
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
 * @param {Object} scalp - The fitness certificate object to append to the list.
 * @returns None
 */
const appendRecords = async (scalp) => {
  document.getElementById("recordsPlace").innerHTML += `
    <div class="alert unread custom-alert-1 alert-dark bg-white" >
      <!-- <i class="mt-0"></i> -->
      <div class="alert-text w-100">
        <div class="card-ipd-head">
          <div class="text-danger fw-bold">${scalp.srNo}</div>
          <div class="text-black">#${scalp.scalp_id}</div>
          <div class="badge ${scalp.status == 'admitted' ? 'bg-success' : 'bg-danger'} rounded-pill mb-2 d-inline-block">${scalp.status == "discharge" ? "" : ""}</div>
          <span class="text-truncate text-info fw-bold">${scalp.patient_details.age}/${scalp.patient_details.sex == 'Female' ? "F" : "M"}</span>
        </div>
        <div class="ipd-body">
          <div class="ipd-body-left">
            <span class="text-info fw-bold text-truncate">${scalp.patient_details.name}</span>
            <span class="text-truncate">A: ${scalp.doa}</span>
            <span>D: ${scalp.dod == null ? '-' : scalp.dod}</span>
          </div>
          <div class="ipd-body-right">
            <span class="text-truncate fw-bold text-black-50">${scalp.patient_details.mobile}</span>
            <span class="text-truncate fw-bolder text-dark">Rs: ${scalp.fees == null ? 0 : scalp.fees}/-</span>
          </div>
        </div>
        <div>
          <!-- <a class="btn m-1 btn-sm btn-info" href="./add-scalp.html?scalpID=${scalp.scalp_id}">Edit</a> -->
          <button class="btn btn-success"${scalp.status == "discharge" ? "hidden" : ""} id="${scalp.scalp_id}" onclick="dischargePopUp(${"id"}, ${"name"});" name="${scalp.patient_details.name}"><i class="fa-solid fa-right-from-bracket"></i> Discharge</button>
        </div>
      </div
    </div>
  `;
}

const dischargePopUp = (scalp_id, name) => {
  document.getElementById("scalp_id").value = scalp_id;
  document.getElementById("name").value = name;
  $('#dischargeModel').modal('show');
}

document.getElementById("discharge-btn").addEventListener("click", async (e) => {
  try {
    if (window.navigator.onLine) {
      let valid = document.forms["form"].checkValidity();
      if (valid) {
        e.preventDefault();
        let scalp_id = document.getElementById("scalp_id").value;
        let name = document.getElementById("name").value;
        let dod = document.getElementById("dod").value;
        let fees = document.getElementById("fees").value;

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to discharge ${name}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#E0A800',
          cancelButtonColor: '#ea4c62',
          confirmButtonText: `Yes, Discharge it!`
        }).then((result) => {
          if (result.isConfirmed) {
            discharge(scalp_id, dod, fees);
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
})

const discharge = async (scalp_id, dod, fees) => {
  try {
    const response = await fetch(`${url}scalp`, {
      method: 'PATCH',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        scalp_id: scalp_id,
        dod: dod,
        fees: fees
      }),
    });
    let data = await response.json();
    if (data.status == 'ok') {
      Swal.fire({
        title: 'Success!',
        text: data.message,
        icon: 'success',
        confirmButtonColor: '#00b894',
        confirmButtonText: 'Okay!',
      }).then((result) => {
        if (result.isConfirmed) {
          loadIPD();
          $('#dischargeModel').modal('hide');
        }
      })
    } else {
      Swal.fire({
        title: 'Error Occurred!',
        text: data.message,
        icon: 'error',
        confirmButtonColor: '#ea4c62',
        confirmButtonText: 'Okay'
      })
    }
  } catch (error) {
    console.log(error);
  }
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
  loadIPD();
}

const loadIPD = async () => {
  try {
    let response = await fetch(`${url}get-scalp`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        status: 'admitted',
      }),
    });

    let data = await response.json();
    if (data.status == 'ok') {
      const scalpList = data.data;
      document.getElementById("recordsPlace").innerHTML = "";
      document.getElementById("recordsPlace").innerHTML = `
        <div class="processing-div align-center" id="processing">
          <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
            <span class="visually-hidden">Loading...</span>
          </div>Processing...
        </div>
      `;
      scalp_list = {};
      let totalAmount = 0;
      for await (const scalp of scalpList) {
        scalp_list[scalp.scalp_id] = scalp;
        totalAmount = totalAmount + parseInt(scalp.fees == null ? 0 : scalp.fees);
        appendRecords(scalp);
      }
      document.getElementById("processing").style.display = "none";
      document.getElementById("totalCounts").innerText = ` ${data.count}`;
      document.getElementById("collection").innerText = ` ${totalAmount}/-`;
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
 * Adds an event listener to the search box that filters the scalp_list object based on the user's input.
 * @returns None
 */
document.getElementById("search-box").onkeyup = () => {
  let query = String(document.getElementById("search-box").value).toLowerCase();
  let searched = [];
  if (query != "") {
    for (key of Object.keys(scalp_list)) {
      if (
        String(scalp_list[key]['patient_details'].name).toLowerCase().search(query) != -1 ||
        String(scalp_list[key]['patient_details'].age).search(query) != -1 ||
        String(scalp_list[key]['patient_details'].sex).toLowerCase().search(query) != -1 ||
        String(scalp_list[key]['patient_details'].city).toLowerCase().search(query) != -1 ||
        String(scalp_list[key].date).search(query) != -1
      ) {
        searched.push(scalp_list[key]);
      }
      document.getElementById("recordsPlace").innerHTML = "";
    }
    for (scalp of searched) {
      appendRecords(scalp);
    }
  } else {
    document.getElementById("recordsPlace").innerHTML = "";
    for (key of Object.keys(scalp_list)) {
      let scalp = scalp_list[key];
      appendRecords(scalp);
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
  document.getElementById("recordsPlace").innerHTML = "";
  document.getElementById("recordsPlace").innerHTML = `
    <div class="processing-div align-center" id="processing">
      <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
        <span class="visually-hidden">Loading...</span>
      </div>Processing...
    </div>
  `;
  let from = document.getElementById("inputDateFrom").value;
  let to = document.getElementById("inputDateTo").value;
  if (from != "" && to != "") {
    document.getElementById("date-search-btn").innerHTML = `<div id="spinner" class="spinner-border spinner-border-sm text-success mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;
    let response = await fetch(`${url}get-scalp`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        between_date: {
          start_date: from,
          end_date: to,
        },
      }),
    });

    let data = await response.json();
    let scalpList = data.data;
    document.getElementById("date-search-btn").innerHTML = `<i class="fa-solid fa-magnifying-glass  "></i> Search`;
    if (data.status == "ok") {
      scalp_list = {};
      let totalAmount = 0;
      for await (key of Object.keys(scalpList)) {
        let scalp = scalpList[key];
        scalp_list[scalp.scalp_id] = scalp;
        totalAmount = totalAmount + parseInt(scalp.fees == null ? 0 : scalp.fees);
        appendRecords(scalp);
      }
      document.getElementById("processing").style.display = "none";
      document.getElementById("totalCounts").innerText = ` ${data.count}`;
      document.getElementById("collection").innerText = ` ${totalAmount}/-`;
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