let ipd_list = {};
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
 * @param {Object} ipd - The fitness certificate object to append to the list.
 * @returns None
 */
const appendRecords = async (ipd) => {
  document.getElementById("recordsPlace").innerHTML += `
    <div class="alert unread custom-alert-1 alert-dark bg-white" >
      <!-- <i class="mt-0"></i> -->
      <div class="alert-text w-100">
        <div class="card-ipd-head">
          <div class="text-danger fw-bold">${ipd.srNo}</div>
          <div class="text-black">#${ipd.ipd_id}</div>
          <div class="text-danger fw-bold">${ipd.bedDetails.description}</div>
          <div class="badge ${ipd.status == 'admitted' ? 'bg-success' : 'bg-danger'} rounded-pill mb-2 d-inline-block">${ipd.status == "discharge" ? "" : ""}</div>
        </div>
        <div class="ipd-body">
          <div class="ipd-body-left">
            <span class="text-info fw-bold text-truncate">${ipd.patient_details.name}</span>
            <span class="text-truncate">A: ${ipd.doa}</span>
            <span>D: ${ipd.dod == null ? '-' : ipd.dod}</span>
          </div>
          <div class="ipd-body-right">
            <span class="text-truncate text-info fw-bold">${ipd.patient_details.age}/${ipd.patient_details.sex == 'Female' ? "F" : "M"}</span>
            <span class="text-truncate fw-bold text-black-50">${ipd.patient_details.mobile}</span>
          </div>
        </div>
        <p>D/D: <span class="text-truncate fw-bold text-black-50">${ipd.otherDetails != null ? ipd.otherDetails : ''}</span></p>
        <div class="ipd-buttons">
          <!-- <a class="btn m-1 btn-sm btn-info" href="./add-ipd.html?ipdID=${ipd.ipd_id}">Edit</a> -->
          <button class="btn btn-success"${ipd.status == "discharge" ? "hidden" : ""} id="${ipd.ipd_id}" onclick="dischargePopUp(${"id"}, ${"name"});" name="${ipd.patient_details.name}"><i class="fa-solid fa-right-from-bracket"></i> Discharge</button>
          <button class="btn btn-dark" ${ipd.status == "discharge" ? "hidden" : ""} id="${ipd.ipd_id}" onclick="switchBedPopUp(this.id, this.name);" name="${ipd.bedDetails.bed_id}"><i class="fa-solid fa-arrow-right-arrow-left"></i> Switch Bed</button>
          <button class="btn btn-warning" ${ipd.status == "discharge" ? "hidden" : ""} id="${ipd.ipd_id}" onclick="ddPopUp(this.id, this.name);" name="${ipd.otherDetails != null ? ipd.otherDetails : ''}"><i class="fa-solid fa-comment-dots"></i> D/D</button>
          <button class="btn btn-danger" id="${ipd.ipd_id}" onclick="ipdDelete(this.id, this.name);" name="${ipd.patient_id}"><i class="fa-solid fa-trash-can"></i> Delete</button>
        </div>
      </div
    </div>
  `;
}

const ddPopUp = (ipd_id, ddText)=>{
  $('#ddText').val(ddText);
  $('#ipd_id').val(ipd_id)
  $('#ddModel').modal('show');
} 

document.getElementById('dd-btn').addEventListener('click', async(e)=>{
  const valid = document.getElementById('formDD').checkValidity();
  if (valid) {
    e.preventDefault();
    const ipd_id = $('#ipd_id').val();
    const ddText = $('#ddText').val();

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to add D/D`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E0A800',
      cancelButtonColor: '#ea4c62',
      confirmButtonText: `Yes, Add D?D!`
    }).then((result) => {
      if (result.isConfirmed) {
        addDD(ipd_id, ddText);
      }
    })
  }
});

const addDD = async(ipd_id, ddText)=>{
  try {
    const response = await fetch(`${url}dd`, {
      method: 'POST',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        ipd_id: ipd_id,
        otherDetails: ddText
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
          $('#ddModel').modal('hide');
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

const ipdDelete = (ipd_id, patient_id) =>{
  Swal.fire({
    title: 'Are you sure?',
    text: `You want to delete`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#E0A800',
    cancelButtonColor: '#ea4c62',
    confirmButtonText: `Yes, Delete it!`
  }).then((result) => {
    if (result.isConfirmed) {
      deleteIPD(ipd_id, patient_id);
    }
  })
}

const deleteIPD = async(ipd_id, patient_id) => {
  try {
    const response = await fetch(`${url}ipd`, {
      method: 'DELETE',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        ipd_id: ipd_id,
        patient_id: patient_id
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

const dischargePopUp = (ipd_id, name) => {
  document.getElementById("ipd_id").value = ipd_id;
  document.getElementById("name").value = name;
  $('#dischargeModel').modal('show');
}

const filterObjectByIds = async(originalObject, includedIds)=> {
  return Object.fromEntries(
    Object.entries(originalObject).filter(([key]) => includedIds.includes(Number(key)))
  );
}

let bedReceiver;
let donner

const switchBedPopUp = async(ipd_id, name) => {
  const Patient = await filterObjectByIds(ipd_list, ipd_id);
  $('#switchBedModel').modal('show');
  try {
    let response = await fetch(`${url}get-icu`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
    });
    let data = await response.json();
    $('#patientName').val(`${Patient[ipd_id].patient_details.name} - ${Patient[ipd_id].bedDetails.description}`);
    if (data.status == "ok") {
      console.log(data.data);
      data.data.forEach(item => {
        if (name != item.bed_id) {
          $('#newBed').append(new Option(item.description, item.bed_id));
        }        
      });
    }
    bedReceiver = Patient[ipd_id];
  } catch (error) {
    console.log(error);
  }
}

const filterByBedNo = async(records, bed_id) => {
  let filteredRecords;

  for (const key in records) {
    if (records[key].bedNo == bed_id) {
      // Omit 'key' property in the filteredRecords object
      const { [key]: omittedKey, ...filteredRecordWithoutKey } = records[key];
      filteredRecords = filteredRecordWithoutKey;
    }
  }

  return filteredRecords;
};

document.getElementById('newBed').addEventListener('change', async(e)=>{
  const bed_id = parseInt(e.target.value);
  console.log(bed_id);
  const patient = await filterByBedNo(ipd_list, bed_id);

  if (patient != undefined) {
    donner = {type: 'withPatient', bed_id: bed_id, patient: patient}
    $('#bedDonner').attr('hidden', false);
    $('#withPatient').val(`${patient.patient_details.name} - ${patient.bedDetails.description}`)
  }else{
    donner = {type: 'withBed', bed_id: bed_id, patient: null}
    $('#bedDonner').attr('hidden', true);
  }
});

document.getElementById('switchBed-btn').addEventListener('click', async(e)=>{
  try {
    const valid = document.getElementById('formBedSwitch').checkValidity();
    if (valid) {
      e.preventDefault();
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to switch bed`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E0A800',
        cancelButtonColor: '#ea4c62',
        confirmButtonText: `Yes, Switch it!`
      }).then((result) => {
        if (result.isConfirmed) {
          switchBed(bedReceiver, donner);
        }
      })

    }
  } catch (error) {
    console.log(error);
  }
})

const switchBed = async(bedReceiver, donner)=>{
  try {
    const response = await fetch(`${url}switchBed`, {
      method: 'POST',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        receiver: bedReceiver,
        donner: donner,
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
          $('#switchBedModel').modal('hide');
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

document.getElementById("discharge-btn").addEventListener("click", async (e) => {
  try {
    if (window.navigator.onLine) {
      let valid = document.forms["form"].checkValidity();
      if (valid) {
        e.preventDefault();
        let ipd_id = document.getElementById("ipd_id").value;
        let name = document.getElementById("name").value;
        let dod = document.getElementById("dod").value;

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
            discharge(ipd_id, dod);
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
})

const discharge = async (ipd_id, dod) => {
  try {
    const response = await fetch(`${url}ipd`, {
      method: 'PATCH',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        ipd_id: ipd_id,
        dod: dod,
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
      ipd_list = {};
      for await (const ipd of ipdList) {
        ipd_list[ipd.ipd_id] = ipd;
        appendRecords(ipd);
      }
      document.getElementById("processing").style.display = "none";
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
    document.getElementById("date-search-btn").innerHTML = `<i class="fa-solid fa-magnifying-glass  "></i> Search`;
    if (data.status == "ok") {
      ipd_list = {};
      for await (key of Object.keys(ipdList)) {
        let ipd = ipdList[key];
        ipd_list[ipd.ipd_id] = ipd;
        appendRecords(ipd);
      }
      document.getElementById("processing").style.display = "none";
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