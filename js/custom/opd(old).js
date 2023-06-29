let allOpds = {};

function appendOpd(opd) {
  document.getElementById(
    "opd-parent-div"
  ).innerHTML += `<div id='opd-div${opd.opd_id}' class="card-body direction-rtl">
    <div>
    <input onclick="CheckBox(${opd.opd_id})" class="form-check-input" id="checkbox${opd.opd_id}" type="checkbox" value="${opd.opd_id}" aria-label="Checkbox for following text input">
    </div>
    <div class='name-div'>
      <h6 class='h6-name-tag' >${opd["patient_details"].name}</h6>
        <label for="">Age : ${opd["patient_details"].age}</label>
        <label for="">Sex : ${opd["patient_details"].sex}</label>
    </div>
    <div class="sub-card-body">

      <div class="card-column">
        <div>
          <label for="">City</label>
          <label class='opd-card-label' for="">${opd["patient_details"].city}</label>
        </div>
        <div>
          <label for="">Address</label>
          <label class='opd-card-label' for="">${opd["patient_details"].address}</label>
        </div>
      </div>

      <div class="card-column">
        <div>
          <label for="">Date</label>
          <label class='opd-card-label' for="">${opd.date}</label>
        </div>

      </div>

      <div class="card-column">
        <div>
          <label for="">Mobile</label>
          <label class='opd-card-label' for="">${opd["patient_details"].mobile}</label>
        </div>

      </div>

    </div>

    <div class="sub-card-body">
      <button onclick='viewDetails(${opd.opd_id})' id='viewDetailsBtn' type="button" class="btn btn-primary"

      data-bs-toggle="modal"
      data-bs-target="#addnewcontact">View Details</button>

      <a onclick='deleteOpd(${opd.opd_id})' class="btn btn-danger">Delete</a>

    </div>
  </div>`;
}

document.getElementsByTagName("body")[0].onload = async () => {
  console.log(localStorage.getItem("jwtTempToken"));
  try {
    let response = await fetch(`${url}get-opd`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
    });

    let data = await response.json();
    if(data.status != 'false'){
      let opds = data.data;
      document.getElementById("opd-parent-div").innerHTML = "";
      if (opds.length > 0) {
        for (opd of opds) {
          allOpds[opd["opd_id"]] = opd;
          appendOpd(opd);
        }
      }
  
      console.log(allOpds);
    } else if(data.message != 'Authorization failed!'){
      document.getElementById("opd-parent-div").innerHTML =
        `<h5>${data.message}</h5>`;
    }else{
      window.location = 'login.html';
    }
  } catch {
    window.location = "login.html";
  }
};

document.getElementById("add-sticky-btn").onclick = () => {
  document.getElementsByClassName('input-group mb-3 services-div')[0].innerHTML = `<div class="input-group-text services-header" id="basic-addon1">Services
  <button type="button" id="plus-btn" class="service-plus-btn"><i class="fa-solid fa-plus"></i></button>
</div>

<div class="services-subdiv">
  <div class="form-group service-select-div">
    <select class="form-select" id="services-select" name="service" aria-label="Default select example">
      <option disabled selected>Select service</option>
      <option value="Suger">Suger</option>
      <option value="ECG">ECG</option>
      <option value="OPD">OPD</option>
    </select>
    <input class="form-control" id="exampleInputnumber" type="number" placeholder="00">
  </div>
</div>`
  document.getElementById("addOpdModalLabel").innerHTML = "Add New OPD";
  document.getElementById("add-btn").style.display = "block";
  let input = document
    .getElementById("add-opd-modal-body")
    .querySelectorAll("input", "select");
  for (elem of input) {
    elem.value = '';
    elem.disabled = false;
  }
  let select = document
    .getElementById("add-opd-modal-body")
    .querySelectorAll("select");
  for (elem of select) {
    elem.disabled = false;
  }
};

document.getElementById("add-btn").onclick = async () => {
  let name = document.getElementsByName("name")[0].value;
  let age = document.getElementsByName("age")[0].value;
  let sex = document.getElementsByName("sex")[0].value;
  let services = {};
  let allservicesdiv = document.getElementsByClassName(
    "form-group service-select-div"
  );
  for (servicediv of allservicesdiv) {
    let service = servicediv.firstElementChild.value;
    let amount = servicediv.lastElementChild.value;
    services[service] = amount;
  }
  let city = document.getElementsByName("city")[0].value;
  let address = document.getElementsByName("address")[0].value;
  let mobile = document.getElementsByName("mobile")[0].value;

  if (
    name != "" &&
    age != "" &&
    sex != "" &&
    city != "" &&
    address != "" &&
    mobile != ""
  ) {
    try {
      console.log("working...");
      document.getElementById(
        "add-btn"
      ).innerHTML = `<div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...`;
      let date = new Date();
      let response = await fetch(`${url}opd`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("jwtTempToken"),
        },
        body: JSON.stringify({
          name: name,
          age: age,
          date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
          sex: sex,
          city: city,
          address: address,
          mobile: mobile,
          services: services,
        }),
      });
      let data = await response.json();
      console.log(data);
      if (data.status === "ok") {
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Successfully added !",
        });

        let response = await fetch(`${url}get-opd`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            // name:'Authorization',
            Authorization: localStorage.getItem("jwtTempToken"),
          },
        });

        let data = await response.json();
        let opds = data.data;
        if (data.status === "ok") {
          document.getElementById("add-btn").innerHTML = `Add`;
          document.getElementById("opd-parent-div").innerHTML = ``;
          allOpds = []
          for (key in Object.keys(opds)) {
            allOpds[opd["opd_id"]] = opds[key];
            appendOpd(opds[key]);
          }
        }

        console.log(allOpds);
      }
    } catch {
      window.location = "login.html";
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Warning...",
      button: "blue",
      text: "Please the blank fields !",
    });
  }
};

document.getElementById("plus-btn").onclick = () => {
  document.getElementsByClassName(
    "input-group mb-3 services-div"
  )[0].innerHTML += `<div class="form-group service-select-div">
  <select class="form-select" id="services-select" name="service" aria-label="Default select example">
    <option disabled selected>Select service</option>
    <option value="Suger">Suger</option>
    <option value="ECG">ECG</option>
    <option value="OPD">OPD</option>
  </select>
  <input class="form-control" id="exampleInputnumber" type="number" placeholder="00">
</div>
`;
};

let opdsForDelete = [];

function CheckBox(opd_id) {
  if (document.getElementById("checkbox" + opd_id).checked) {
    opdsForDelete.push(opd_id);
    console.log(opdsForDelete);
    document.getElementById(
      "delete-value-label"
    ).innerHTML = `${opdsForDelete.length} item selected`;
    document.getElementsByClassName("delete-footer-div")[0].style.bottom = "0";
    document.getElementById("delete-all-opds-btn-div").style.display = "none";
  } else {
    opdsForDelete.forEach((value, index) => {
      if (opd_id === value) {
        opdsForDelete.splice(index, 1);
        document.getElementById(
          "delete-value-label"
        ).innerHTML = `${opdsForDelete.length} item selected`;
        if (opdsForDelete.length === 0) {
          document.getElementsByClassName("delete-footer-div")[0].style.bottom =
            "-3rem";
          document.getElementById("delete-all-opds-btn-div").style.display =
            "inline-block";
        }
      }
    });
  }
}

document.getElementById("footer-delete-btn").onclick = () => {
  if (opdsForDelete.length > 0) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(0 37 244)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = fetch(`${url}get-opd`, {
            method: "DELETE",
            headers: {
              // Authorization: localStorage.getItem("jwtTempToken"),
              Authorization: "hgjhghjfhdgfshcj",
            },
            body: JSON.stringify({
              opd_id: opdsForDelete.toString(),
            }),
          });

          let data = await response;
          console.log(data);
          if (data.status === 200) {
            opdsForDelete.forEach((value) => {
              document.getElementById("opd-div" + value).remove();
            });
            document.getElementsByClassName(
              "delete-footer-div"
            )[0].style.bottom = "-3rem";
            opdsForDelete = [];
            Swal.fire("Deleted!", `OPDs deleted successfully`, "success");
          }
        } catch {
          window.location = "login.html";
        }
      }
    });
  }
};

document.getElementById("delete-all-opds-btn").onclick = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(0 37 244)",
    cancelButtonColor: "#d33",
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
        console.log(data);
        if (data.status === 200) {
          document.getElementById("opd-parent-div").innerHTML =
            "<h5>No records found </h5>";
          Swal.fire("Deleted!", `OPDs deleted successfully`, "success");
        }
      } catch {
        window.location = "login.html";
      }
    }
  });
};

function viewDetails(opd_id) {
  document.getElementById("add-btn").style.display = "none";
  document.getElementById("addOpdModalLabel").innerHTML = "OPD Details";
  let opd = allOpds[opd_id];
  console.log(opd);
  document.getElementsByName("name")[0].value = opd["patient_details"].name;
  document.getElementsByName("age")[0].value = opd["patient_details"].age;
  document.getElementsByName("sex")[0].value = opd["patient_details"].sex;
  document.getElementsByName("city")[0].value = opd["patient_details"].city;
  document.getElementsByName("address")[0].value =
    opd["patient_details"].address;
  document.getElementsByName("mobile")[0].value = opd["patient_details"].mobile;
  document.getElementsByClassName('input-group mb-3 services-div')[0].innerHTML = `
  <table class="w-100" id="dataTable">
  <thead>
    <tr>
      <th>Services</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
  </table>`;
  let jsonServices = JSON.parse(opd.services)
  for (key of Object.keys(jsonServices)){
    console.log('data is',jsonServices[0])
    document.getElementsByTagName('tbody')[0].innerHTML += `
    <tr>
    <td>${key}</td>
    <td>${jsonServices[key]}</td>
  </tr>`;
  }
  

  let input = document
    .getElementById("add-opd-modal-body")
    .querySelectorAll("input", "select");
  for (elem of input) {
    console.log(elem);
    elem.disabled = true;
  }
  let select = document
    .getElementById("add-opd-modal-body")
    .querySelectorAll("select");
  for (elem of select) {
    console.log(elem);
    elem.disabled = true;
  }

  console.log(JSON.parse(opd.services));
}

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
    for (opd of searched) {
      appendOpd(opd);
    }
  } else {
    document.getElementById("opd-parent-div").innerHTML = "";
    for (key of Object.keys(allOpds)) {
      let opd = allOpds[key];
      appendOpd(opd);
    }
  }
};

function deleteOpd(opd_id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(0 37 244)",
    cancelButtonColor: "#d33",
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
        console.log(data);
        if (data.status === 200) {
          document.getElementById("opd-div" + opd_id).remove();
          Swal.fire("Deleted!", `OPDs deleted successfully`, "success");
        }
      } catch {
        window.location = "login.html";
      }
    }
  });
}

document.getElementById("date-search-btn").onclick = async () => {
  let from = document.getElementById("inputDateFrom").value;
  let to = document.getElementById("inputDateTo").value;
  console.log(from, to);
  if (from != "" && to != "") {
    document.getElementById(
      "date-search-btn"
    ).innerHTML = `<div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
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
    console.log(data);
    let opds = data.data;
    console.log("data is : ", opds);
    if (data.status != "false") {
      document.getElementById("opd-parent-div").innerHTML = "";
      for (key of Object.keys(opds)) {
        let opd = opds[key];
        appendOpd(opd);
      }
    } else {
      document.getElementById(
        "date-search-btn"
      ).innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
      Swal.fire("Warning!", `${data.message}`, "warning");
    }
  }
};
