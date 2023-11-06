let ipd_list = {};
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
 * @param {Object} ipd - The fitness certificate object to append to the list.
 * @returns None
 */
const appendRecords = async(ipd) => {
  const bedInfo = await getBedInfo(ipd.bedNo);
  document.getElementById("recordsPlace").innerHTML += `
    <div class="alert unread custom-alert-2 alert-info" role="alert">
      <i class="mt-0">${ipd.srNo}</i>
      <div class="alert-text w-75">
        <h6 class="text-truncate">${ipd.patient_details.name}</h6>
        <span class="text-truncate">ADM: ${ipd.doa}</span>
        <br>
        <span>DC: ${ipd.dod == null ? '-' : ipd.dod}</span>
        <div>
          <!-- <a class="btn m-1 btn-sm btn-info" href="./add-ipd.html?ipdID=${ipd.ipd_id}">Edit</a> -->
          <button class="btn m-1 btn-sm btn-success"${ipd.status == "discharge" ? "hidden":""} id="${ipd.ipd_id}" onclick="dischargePopUp(${"id"}, ${"name"});" name="${ipd.patient_details.name}">Discharge</button>
        </div>
      </div>
      <div class="w-25 text-end">
        <span class="text-truncate"><span class="badge ${ipd.status == 'admitted' ? 'bg-danger':'bg-success'} rounded-pill mb-2 d-inline-block">${ipd.status == "discharge" ? "discharged":ipd.status}</span>
        <br>
        <span class="text-truncate">#${ipd.ipd_id}</span>
        <br>
        <span class="text-truncate">${ipd.patient_details.age}/${ipd.patient_details.sex}</span>
        <br>
        <span>${bedInfo[0].description}</span>
      </div>
    </div>
  `;
}

const dischargePopUp = (ipd_id, name)=>{
  document.getElementById("ipd_id").value = ipd_id;
  document.getElementById("name").value = name;
  $('#dischargeModel').modal('show');
}

document.getElementById("discharge-btn").addEventListener("click", async(e)=>{
  try {
    if (window.navigator.onLine) {
      let valid = document.forms["form"].checkValidity();
      if (valid) {
        e.preventDefault();
        let ipd_id  = document.getElementById("ipd_id").value;
        let name    = document.getElementById("name").value;
        let dod     = document.getElementById("dod").value;

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to discharge ${name}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#E0A800',
          cancelButtonColor: '#ea4c62',
          confirmButtonText: `Yes, Discharge it!`
        }).then ((result) => {
          if (result.isConfirmed) {
            discharge(ipd_id, dod);
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
})

const discharge = async(ipd_id, dod) => {
  try {
    const response = await fetch(`${url}ipd`, {
      method: 'PATCH',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        ipd_id: ipd_id,
        dod:dod,
      }),
    });
    let data = await response.json();
    if (data.status == 'ok') {
      Swal.fire({
        title:'Success!',
        text: data.message,
        icon: 'success',
        confirmButtonColor: '#00b894',
        confirmButtonText: 'Okay!',
      }).then ((result) => {
        if (result.isConfirmed) {
          loadIPD();
          $('#dischargeModel').modal('hide');
        }
      })   
    }else{
      Swal.fire({
        title:'Error Occurred!',
        text:data.message,
        icon:'error',
        confirmButtonColor: '#ea4c62',
        confirmButtonText: 'Okay'
      })
    }
  } catch (error) {
    console.log(error);
  }
}

const getBedInfo = async(bedNo) => {
  try {
    let response = await fetch(`${url}get-icu`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        bed_id: bedNo,
      }),
    });
    let data = await response.json();
    return data.data;
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

const loadIPD = async () =>{
  try {
    let response = await fetch(`${url}get-ipd`, {
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
      const ipdList = data.data;
      document.getElementById("recordsPlace").innerHTML = "";
      document.getElementById("recordsPlace").innerHTML = `
        <div class="processing-div align-center" id="processing">
          <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
            <span class="visually-hidden">Loading...</span>
          </div>Processing...
        </div>
      `;
      document.getElementById("processing").style.display = "none";
      ipd_list = {};
      for (const ipd of ipdList) {
        ipd_list[ipd.ipd_id] = ipd;
        appendRecords(ipd);
      }
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
 * Adds an event listener to the search box that filters the ipd_list object based on the user's input.
 * @returns None
 */
document.getElementById("search-box").onkeyup = () => {
  let query = String(document.getElementById("search-box").value).toLowerCase();
  let searched = [];
  if (query != "") {
    for (key of Object.keys(ipd_list)) {
      if (
        String(ipd_list[key]['patient_details'].name).toLowerCase().search(query) != -1 ||
        String(ipd_list[key]['patient_details'].age).search(query) != -1 ||
        String(ipd_list[key]['patient_details'].sex).toLowerCase().search(query) != -1 ||
        String(ipd_list[key]['patient_details'].city).toLowerCase().search(query) != -1 ||
        String(ipd_list[key].date).search(query) != -1 ||
        String(ipd_list[key].bedNo).toLowerCase().search(query) != -1 
      ) {
        searched.push(ipd_list[key]);
      }
      document.getElementById("recordsPlace").innerHTML = "";
    }
    for (ipd of searched) {
      appendRecords(ipd);
    }
  } else {
    document.getElementById("recordsPlace").innerHTML = "";
    for (key of Object.keys(ipd_list)) {
      let ipd = ipd_list[key];
      appendRecords(ipd);
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
    let response = await fetch(`${url}get-ipd`, {
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
    let ipdList = data.data;
    document.getElementById("recordsPlace").innerHTML = "";
    document.getElementById("date-search-btn").innerHTML = `<i class="fa-solid fa-magnifying-glass  "></i> Search`;
    if (data.status == "ok") {
      for (key of Object.keys(ipdList)) {
        let ipd = ipdList[key];
        ipd_list[ipd.ipd_id] = ipd;
        appendRecords(ipd);
      }
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