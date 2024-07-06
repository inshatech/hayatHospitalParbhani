/**
 * An empty object that will be used to store all OPDs.
 */
let allOpds = {};
let updateOpdId;

/**
 * Appends an OPD (Out-Patient Department) object to the parent div in the HTML document.
 * @param {Object} opd - The OPD object to append to the parent div.
 * @returns None
 */
function appendOpd(opd) {
  let opdServices = JSON.parse(opd.services);
  let totalAmount = 0;
  for (key of Object.keys(opdServices)) {
    totalAmount = totalAmount + parseInt(opdServices[key])
  }
  document.getElementById("opd-parent-div").innerHTML += `
    <div class="alert unread custom-alert-1 alert-dark bg-white" >
      <!-- <i class="mt-0"></i> -->
      <div class="alert-text w-100">
        <div class="card-ipd-head">
          <div class="text-black fw-bold">${opd.srNo}</div>
          <div class="text-danger fw-bold">#${opd.opd_id}</div>
          <span class="text-truncate text-info fw-bold">${opd.patient_details.age}/${opd.patient_details.sex == 'Female' ? "F" : "M"}</span>
        </div>
        <div class="ipd-body">
          <div class="ipd-body-left">
            <span class="text-info fw-bold text-truncate">${opd.patient_details.name}</span>
            <span class="text-truncate">A: ${opd.patient_details.address == null ? '-' : opd.patient_details.address}</span>
            <span class="text-truncate">T: ${opd.dateTimeStamp}</span>
          </div>
          <div class="ipd-body-right">
            <span class="text-truncate fw-bolder text-dark">Rs: ${totalAmount}/-</span>
          </div>
        </div>
        <div class="ipd-buttons">
          <button onclick='viewDetails(${opd.opd_id})' id='viewDetailsBtn'; type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#addOPD"><i class="fa-regular fa-eye"></i> View OPD</button>
          <a onclick='printPrescription(${opd.opd_id})' class="btn btn-primary"><i class="fa-solid fa-print"></i> Prescription</a>
          <a onclick='printOpd(${opd.opd_id})' class="btn btn-success"><i class="fa-solid fa-print"></i> Print OPD</a>
        </div>
      </div
    </div>
  `;
}

const printOpd = (opd_id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You want Print!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00b894',
    cancelButtonColor: '#ea4c62',
    confirmButtonText: 'Okay Print!'
  }).then((result) => {
    if (result.isConfirmed) {
      location.assign(`./templates/opd-receipt.html?opdId=${opd_id}`);
    }
  })
}

const printPrescription = async(opd_id)=>{
  const patient = await allOpds[opd_id];
  Swal.fire({
    title: 'Are you sure?',
    text: "You want Print!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00b894',
    cancelButtonColor: '#ea4c62',
    confirmButtonText: 'Okay Print!'
  }).then((result) => {
    if (result.isConfirmed) {
      location.assign(`./templates/prescription.html?patient=${btoa(encodeURIComponent(JSON.stringify(patient)))}`);
    }
  })
}


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
 * Sets an onload event listener on the body element of the document. When the body is loaded,
 * this function sends a POST request to the server to retrieve OPD data. If the request is successful,
 * the retrieved data is used to populate the "opd-parent-div" element with OPD information. If the request
 * fails, an error message is logged to the console. If the user is not authorized, the user is redirected
 * to the login page.
 * @async
 * @returns None
 */
document.getElementsByTagName("body")[0].onload = () => {
  if (userRole != 2) {
    document.getElementById("collection").removeAttribute("hidden");
  }
  loadData();
};

/**
 * Calculates the total amount for services listed in a table with id "serviceTable".
 * The total amount is then set as the value of an input field with id "total-amount".
 * @returns None
 */
const servicesCalculation = () => {
  let table = document.getElementById("serviceTable");
  let sumVal = 0;
  for (var i = 2; i < table.rows.length; i++) {
    sumVal = sumVal + parseInt(table.rows[i].cells[1].innerHTML);
  }
  document.getElementById("total-amount").value = sumVal;
}

/**
 * Adds a new service to the service table with the given service and amount.
 * @returns None
 */
function addService() {
  let service = document.getElementsByName('service')[0].value;
  let amount = document.getElementsByName('amount')[0].value;
  if (service != '' && amount != '') {
    const services = document.getElementById("serviceTable");
    let row = services.insertRow(-1);
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    c1.innerText = service
    c2.innerText = amount
    c3.innerHTML = `<button onclick='removeService()' type="button" id="add-service-btn" class="btn btn-sm m-1 btn-danger"><i class="fa-solid fa-minus"></i></button>`;
    servicesCalculation();
  }
}

document.getElementsByName('service')[0].addEventListener("change", () => {
  let service = document.getElementsByName('service')[0].value;
  let amount
  if (service == 'OPD') {
    amount = 200
  } else if (service == 'ECG') {
    amount = 300
  } else if (service == 'SUGAR') {
    amount = 50
  } else if (service == 'FOLLOW UP') {
    amount = 100
  } else if (service == 'FITNESS RAHAT') {
    amount = 500
  } else if (service == 'FITNESS SPT') {
    amount = 500
  } else if (service == 'OTHERS') {
    amount = '';
  } else if (service == 'Dr Shahnawaz') {
    amount = '500';
  } else if (service == 'Dr Saif Hameed') {
    amount = '500';
  }

  document.getElementsByName('amount')[0].value = amount;
  document.getElementsByName('amount')[0].focus;
});

/**
 * Removes the parent element of the currently active element from the DOM and recalculates
 * the services.
 * @returns None
 */
function removeService() {
  if (userRole != 2) {
    document.activeElement.parentElement.parentElement.remove();
    servicesCalculation();
  }else{
    Swal.fire({
      title: "Access Denied?",
      text: `You don't have permission to perform this.`,
      icon: 'error',
      confirmButtonColor: '#ea4c62',
      confirmButtonText: 'Okay'
    })
  }
}
/**
 * Attaches an onclick event listener to the "add-sticky-btn" element. When clicked, this function
 * deletes all rows in the "serviceTable" element, resets the "form" element, and displays the "add-btn" element.
 * @returns None
 */
document.getElementById("add-sticky-btn").onclick = () => {
  let services = document.getElementById("serviceTable");
  DeleteRows(services);
  document.getElementById("add-btn").style.display = "inline-block";
  document.getElementById("form").reset();
  document.getElementById("add-btn").innerHTML = `<i class="fa-regular fa-paper-plane"></i> Add OPD`;
  document.getElementById("add-btn").value = `Add OPD`;
  document.getElementById("add-btn").className = 'btn btn-success';

  document.getElementById("srNo").disabled = false;
  document.getElementById("date").disabled = false;
  document.getElementsByName("name")[0].disabled = false;
  document.getElementsByName("age")[0].disabled = false;
  document.getElementsByName("sex")[0].disabled = false;
  document.getElementsByName("city")[0].disabled = false;
  document.getElementsByName("address")[0].disabled = false;
  document.getElementsByName("mobile")[0].disabled = false;
  let currentDate = new Date();
  document.getElementById("date").value = currentDate.toISOString().split('T')[0];
}
/**
 * Attaches an event listener to the "add-btn" element that triggers when the button is clicked.
 * The function checks if the user is online, if the form is valid, and if there is at least one service selected.
 * If all conditions are met, the function retrieves the values from the form and displays a confirmation dialog.
 * If the user confirms, the function calls the addOPD function with the retrieved values.
 * @param {Event} e - The event object.
 * @returns None
 */
document.getElementById("add-btn").onclick = async (e) => {
  try {
    if (window.navigator.onLine) {
      let valid = document.forms["form"].checkValidity();
      let serviceCount = document.getElementById("serviceTable").tBodies[0].rows.length
      if (valid && serviceCount > 1) {
        e.preventDefault();
        let srNo = document.getElementById("srNo").value;
        let date = document.getElementById("date").value;
        let name = document.getElementsByName("name")[0].value;
        let age = document.getElementsByName("age")[0].value;
        let sex = document.getElementsByName("sex")[0].value;
        let services = {};
        let table = document.getElementById("serviceTable");
        for (var i = 2; i < table.rows.length; i++) {
          services[table.rows[i].cells[0].innerHTML] = table.rows[i].cells[1].innerHTML;
        }
        let city = document.getElementsByName("city")[0].value;
        let address = document.getElementsByName("address")[0].value;
        let mobile = document.getElementsByName("mobile")[0].value;

        const btnValue = document.getElementById("add-btn").value;
        let btnText;
        let btnColor;

        if (btnValue === "Add OPD") {
          btnText = "Add OPD";
          btnColor = '#00b894'
        } else {
          btnText = "Update OPD";
          btnColor = '#E0A800';
        }

        Swal.fire({
          title: 'Are you sure?',
          text: `You want ${btnText} opd!`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: btnColor,
          cancelButtonColor: '#ea4c62',
          confirmButtonText: `Yes, ${btnText} it!`
        }).then((result) => {
          if (result.isConfirmed) {
            btnValue === "Add OPD" ? addOPD(srNo, date, name, age, sex, services, city, address, mobile) : updateOPD(updateOpdId, services);
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Sends a POST request to the server to add a new OPD entry with the given information.
 * @param {string} name - The name of the patient.
 * @param {number} age - The age of the patient.
 * @param {string} sex - The gender of the patient.
 * @param {string} services - The services provided to the patient.
 * @param {string} city - The city where the patient is located.
 * @param {string} address - The address of the patient.
 * @param {string} mobile - The mobile number of the patient.
 * @returns None
 */
const addOPD = async (srNo, date, name, age, sex, services, city, address, mobile) => {
  try {
    document.getElementById("add-btn").innerHTML = `
      <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
      <span class="visually-hidden">Loading...</span>
      </div>Processing...
    `;
    // let date = new Date();
    // let month = date.getMonth() + 1
    // let day = date.getDate()
    let response = await fetch(`${url}opd`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        srNo: srNo,
        date: date, //`${date.getFullYear()}-${month}-${day}`,
        name: name,
        age: age,
        sex: sex,
        state: 10,
        city: city,
        address: address,
        mobile: mobile,
        services: services,
        other_info: "",
        employee_id: 1,
        doctor_id: 1
      }),
    });
    let data = await response.json();
    let opd_id = data.opd_id;
    if (data.status == 'ok') {
      Swal.fire({
        title: 'Success!',
        text: 'OPD added successfully!',
        icon: 'success',
        confirmButtonColor: '#00b894',
        confirmButtonText: 'Okay Print!',
      }).then((result) => {
        if (result.isConfirmed) {
          let services = document.getElementById("serviceTable");
          DeleteRows(services);
          location.assign(`./templates/opd-receipt.html?opdId=${opd_id}`);
        }
      })
      loadData();
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

const loadData = async () => {
  try {
    let response = await fetch(`${url}get-opd`, {
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
    if (data.status != 'false') {
      let opds = data.data;
      document.getElementById("opd-parent-div").innerHTML = "";
      if (opds.length > 0) {
        let totalAmount = 0;
        for (opd of opds) {
          allOpds[opd["opd_id"]] = opd;
          appendOpd(opd);
          let opdServices = JSON.parse(opd.services);
          for (key of Object.keys(opdServices)) {
            totalAmount = totalAmount + parseInt(opdServices[key])
          }
        }
        document.getElementById("totalCounts").innerText = ` ${data.count}`;
        document.getElementById("collection").innerText = ` ${totalAmount}/-`;
        document.getElementById("form").reset();
        document.getElementById("opd-parent-div").firstElementChild.firstElementChild.innerHTML += '<span class="m-1 badge rounded-pill bg-success">New</span>'
        setTimeout(() => {
          document.getElementById("opd-parent-div").firstElementChild.firstElementChild.lastElementChild.remove()
        }, 10000);
      }
    } else if (data.message != 'Authorization failed!') {
      document.getElementById("opd-parent-div").innerHTML = `
        <div class='noRecords'>
          <img src="./img/bg-img/box.png" alt="image">
          <p>No records found!</p>
        </div>
      `;
    } else {
      window.location = 'login.html';
    }
  } catch (error) {
    console.log(error);
  }
}

const updateOPD = async (updateOpdId, services) => {
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}opd`, {
    method: "PUT",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      opdId: updateOpdId,
      services: services,
      other_info: "",
      employee_id: "",
      doctor_id: "",
    }),
  });
  let data = await response.json();
  if (data.status == 'ok') {
    Swal.fire({
      title: 'Success!',
      text: 'OPD update successfully!',
      icon: 'success',
      confirmButtonColor: '#E0A800',
      confirmButtonText: 'Okay Print!',
      showCancelButton: true,
      cancelButtonColor: '#ea4c62',
    }).then((result) => {
      document.getElementById("add-btn").innerHTML = `<i class="fa-regular fa-paper-plane"></i> Add OPD`;
      document.getElementById("add-btn").value = `Add OPD`;
      document.getElementById("add-btn").className = 'btn btn-success';
      $("#addOPD").modal("hide");
      if (result.isConfirmed) {
        let services = document.getElementById("serviceTable");
        DeleteRows(services);
        location.assign(`./templates/opd-receipt.html?opdId=${updateOpdId}`);
      } else {
        $('#addOPD').modal('hide');
        loadData();
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
}

/**
 * An array of OPDs to be deleted.
 */
let opdsForDelete = [];

/**
 * Toggles the checkbox for the given opd_id and updates the list of opds to delete.
 * @param {string} opd_id - the id of the opd to toggle the checkbox for.
 * @returns None
 */
function CheckBox(opd_id) {
  if (document.getElementById("checkbox" + opd_id).checked) {
    opdsForDelete.push(opd_id);
    document.getElementById(
      "delete-value-label"
    ).innerHTML = `${opdsForDelete.length} item selected`;
    document.getElementsByClassName("delete-footer-div")[0].style.bottom = "3.9rem";
    document.getElementById("delete-all-opds-btn-div").style.display = "none";
    document.getElementById("add-sticky-btn").style.display = "none";
  } else {
    opdsForDelete.forEach((value, index) => {
      if (opd_id === value) {
        opdsForDelete.splice(index, 1);
        document.getElementById(
          "delete-value-label"
        ).innerHTML = `${opdsForDelete.length} item selected`;
        if (opdsForDelete.length === 0) {
          document.getElementsByClassName("delete-footer-div")[0].style.bottom = "-3rem";
          document.getElementById("delete-all-opds-btn-div").style.display = "inline-block";
          document.getElementById("add-sticky-btn").style.display = "inline-block";
        }
      }
    });
  }
}

/**
 * Attaches an onclick event listener to the "footer-delete-btn" element. When clicked,
 * this function will prompt the user to confirm the deletion of the selected OPDs. If
 * confirmed, it will send a DELETE request to the server to delete the selected OPDs.
 * If the request is successful, it will remove the deleted OPDs from the page and display
 * a success message. If the request fails, it will display an error message.
 * @returns None
 */
document.getElementById("footer-delete-btn").onclick = () => {
  try {
    if (opdsForDelete.length > 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#00b894',
        confirmButtonColor: '#ea4c62',
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let response = fetch(`${url}opd`, {
            method: "DELETE",
            headers: {
              Authorization: localStorage.getItem("jwtTempToken"),
            },
            body: JSON.stringify({
              opd_id: opdsForDelete.toString(),
            }),
          });

          let data = await response;
          if (data.status == 200) {
            opdsForDelete.forEach((value) => { document.getElementById("opd-div" + value).remove(); });
            document.getElementsByClassName("delete-footer-div")[0].style.bottom = "-3rem";
            opdsForDelete = [];
            Swal.fire({
              title: 'Success!',
              text: 'OPDs deleted successfully',
              icon: 'success',
              confirmButtonColor: '#00b894',
              confirmButtonText: 'Okay'
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
        }
      });
      document.getElementById("add-sticky-btn").style.display = "inline-block";
      document.getElementById("delete-all-opds-btn").style.display = "inline-block";
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Attaches an onclick event listener to the "delete-all-opds-btn" button. When clicked,
 * a confirmation modal is displayed to the user. If the user confirms, a DELETE request is
 * sent to the server to delete all OPDs. If the request is successful, the "opd-parent-div"
 * element is updated to display a message indicating that no records were found. A success
 * message is also displayed to the user.
 * @returns None
 */
document.getElementById("delete-all-opds-btn").onclick = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: '#00b894',
    confirmButtonColor: '#ea4c62',
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        let response = fetch(`${url}opd`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("jwtTempToken"),
          },
          body: JSON.stringify({
            opd_id: "all",
          }),
        });

        let data = await response;
        if (data.status === 200) {
          document.getElementById("opd-parent-div").innerHTML =
            `<div class='noRecords'>
              <img src="./img/bg-img/box.png" alt="image">
              <p>No records found!</p>
            </div>`;
          Swal.fire({
            title: 'Deleted!',
            text: 'OPDs deleted successfully',
            icon: 'success',
            confirmButtonColor: '#00b894',
            confirmButtonText: 'Okay'
          })
        }
      } catch {
        window.location = "login.html";
      }
    }
  });
};

const dbDateFormatter = async (date) => {
  const dateArray = date.split("-");
  const formattedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
  return formattedDate;
}

/**
 * Displays the details of an OPD record in a modal window.
 * @param {number} opd_id - The ID of the OPD record to display.
 * @returns None
 */
const viewDetails = async (opd_id) => {
  updateOpdId = opd_id;
  document.getElementById("add-btn").innerHTML = '<i class="fa-regular fa-paper-plane"></i> Update OPD';
  document.getElementById("add-btn").value = "Update OPD";
  document.getElementById("add-btn").className = "btn btn-warning text-white";
  document.getElementById("addOpdModalLabel").innerHTML = "OPD Details";
  let opd = allOpds[opd_id];

  document.getElementById("srNo").value = opd.srNo;
  document.getElementById("date").value = await dbDateFormatter(opd.date);
  document.getElementsByName("name")[0].value = opd["patient_details"].name;
  document.getElementsByName("age")[0].value = opd["patient_details"].age;
  document.getElementsByName("sex")[0].value = opd["patient_details"].sex;
  document.getElementsByName("city")[0].value = opd["patient_details"].city;
  document.getElementsByName("address")[0].value = opd["patient_details"].address;
  document.getElementsByName("mobile")[0].value = opd["patient_details"].mobile;

  document.getElementById("srNo").disabled = true;
  document.getElementById("date").disabled = true;
  document.getElementsByName("name")[0].disabled = true;
  document.getElementsByName("age")[0].disabled = true;
  document.getElementsByName("sex")[0].disabled = true;
  document.getElementsByName("city")[0].disabled = true;
  document.getElementsByName("address")[0].disabled = true;
  document.getElementsByName("mobile")[0].disabled = true;

  let services = document.getElementById("serviceTable");
  DeleteRows(services);
  let jsonServices = JSON.parse(opd.services)
  for (key of Object.keys(jsonServices)) {
    let row = services.insertRow(-1);
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    c1.innerText = key
    c2.innerText = jsonServices[key]
    c3.innerHTML = `<button onclick='removeService()' type="button" id="removeServicesBtn" class="btn btn-sm m-1 btn-danger"><i class="fa-solid fa-minus"></i></button>`;
  }
  servicesCalculation();
}

/**
 * Deletes all rows in a table except for the first row.
 * @param {HTMLTableElement} services - The table element to delete rows from.
 * @returns None
 */
function DeleteRows(services) {
  let rowCount = services.tBodies[0].rows.length;
  for (var i = rowCount; i > 1; i--) {
    services.deleteRow(i);
  }
}

/**
 * Adds an event listener to the search box that filters the displayed opds based on the user's input.
 * @returns None
 */
document.getElementById("search-box").onkeyup = () => {
  let query = String(document.getElementById("search-box").value).toLowerCase();
  let searched = [];
  if (query != "") {
    for (key of Object.keys(allOpds)) {
      if (
        String(allOpds[key]["patient_details"].name)
          .toLowerCase()
          .search(query) != -1 ||
        String(allOpds[key]["patient_details"].age).search(query) != -1 ||
        String(allOpds[key]["patient_details"].sex)
          .toLowerCase()
          .search(query) != -1 ||
        String(allOpds[key]["patient_details"].city)
          .toLowerCase()
          .search(query) != -1 ||
        String(allOpds[key]["patient_details"].mobile).search(query) != -1 ||
        String(allOpds[key].date).search(query) != -1
      ) {
        searched.push(allOpds[key]);
      }
      document.getElementById("opd-parent-div").innerHTML = "";
    }
    let totalAmount = 0;
    for (opd of searched) {
      appendOpd(opd);
      let opdServices = JSON.parse(opd.services);
      for (key of Object.keys(opdServices)) {
        totalAmount = totalAmount + parseInt(opdServices[key])
      }
    }
    document.getElementById("collection").innerText = ` ${totalAmount}/-`;;
  } else {
    document.getElementById("opd-parent-div").innerHTML = "";
    let totalAmount = 0;
    for (key of Object.keys(allOpds)) {
      let opd = allOpds[key];
      appendOpd(opd);
      let opdServices = JSON.parse(opd.services);
      for (key of Object.keys(opdServices)) {
        totalAmount = totalAmount + parseInt(opdServices[key])
      }
    }
    document.getElementById("collection").innerText = ` ${totalAmount}/-`;;
  }
};

/**
 * Deletes an OPD with the given ID after confirming with the user.
 * @param {string} opd_id - The ID of the OPD to delete.
 * @returns None
 */
function deleteOpd(opd_id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: '#00b894',
    confirmButtonColor: '#ea4c62',
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        let response = fetch(`${url}get-opd`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("jwtTempToken"),
          },
          body: JSON.stringify({
            opd_id: opd_id,
          }),
        });

        let data = await response;
        if (data.status === 200) {
          document.getElementById("opd-div" + opd_id).remove();
          Swal.fire({
            title: 'Deleted!',
            text: 'OPDs deleted successfully',
            icon: 'success',
            confirmButtonColor: '#00b894',
            confirmButtonText: 'Okay'
          })
        }
      } catch {
        window.location = "login.html";
      }
    }
  });
}

/**
 * Adds an event listener to the "date-search-btn" element that sends a POST request to the server
 * to retrieve OPDs between the specified dates. If successful, the retrieved OPDs are displayed on the page.
 * @returns None
 */
document.getElementById("date-search-btn").onclick = async () => {
  let from = document.getElementById("inputDateFrom").value;
  let to = document.getElementById("inputDateTo").value;
  if (from != "" && to != "") {
    document.getElementById("date-search-btn").innerHTML = `<div id="spinner" class="spinner-border spinner-border-sm text-success mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;
    let response = await fetch(`${url}get-opd`, {
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
    let opds = data.data;
    document.getElementById("opd-parent-div").innerHTML = "";
    document.getElementById("date-search-btn").innerHTML = `<i class="fa-solid fa-magnifying-glass  "></i> Search`;
    if (data.status == "ok") {
      let totalAmount = 0;
      for (key of Object.keys(opds)) {
        let opd = opds[key];
        allOpds[opd["opd_id"]] = opd;
        appendOpd(opd);
        let opdServices = JSON.parse(opd.services);
        for (key of Object.keys(opdServices)) {
          totalAmount = totalAmount + parseInt(opdServices[key])
        }
        document.getElementById("totalCounts").innerText = ` ${data.count}`;
      }
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
};

