let treatment_list = {};
let ipd_id;

const appendRecords = async (treatment) => {
  document.getElementById("recordsPlace").innerHTML += `
    <li class="timeline-item mb-5">
      <span class="timeline-icon">
        <i class="fas fa-circle-check text-success fa-sm fa-fw"></i>
      </span>

      <h5 class="fw-bold">${treatment.title}</h5>
      <p class="text-muted mb-2 fw-bold"><i class="fa-regular fa-clock"></i> ${treatment.dateTimeStamp}</p>
      <p class="text-muted mb-2 fw-bold"><i class="fa-solid fa-user-nurse"></i> ${treatment.byDoctor}</p>
      <pre>
        <p>${treatment.description}</p>
      </pre>
    </li>
  `;
}

document.getElementById("treatment-btn").addEventListener("click", async (e) => {
  try {
    if (window.navigator.onLine) {
      let valid = document.forms["form"].checkValidity();
      if (valid) {
        e.preventDefault();
        let title = document.getElementById("title").value;
        let byDoctor = document.getElementById("byDoctor").value;
        let description = document.getElementById("description").value;

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to Add Treatment`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#E0A800',
          cancelButtonColor: '#ea4c62',
          confirmButtonText: `Yes, Add it!`
        }).then((result) => {
          if (result.isConfirmed) {
            addTreatment(ipd_id, title, byDoctor, description);
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
})

const addTreatment = async(ipd_id, title, byDoctor, description) => {
  try {
    const response = await fetch(`${url}treatment`, {
      method: 'POST',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        ipd_id: ipd_id,
        title: title,
        byDoctor: byDoctor,
        description: description,
        employee_id:localStorage.getItem("user_id"),
        doctor_id: 10,
        otherDetails:""
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
          $('#treatmentModel').modal('hide');
          document.getElementById("form").reset();
          loadTreatment(ipd_id);
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

const loadTreatment = async(ipd_id)=>{
  try {
    let response = await fetch(`${url}get-treatment`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        ipd_id: ipd_id,
      }),
    });

    let data = await response.json();
    if (data.status == 'ok') {
      const ipdList = data.data;
      document.getElementById("recordsPlace").innerHTML = "";
      treatment_list = {};
      for await (const treatment of ipdList) {
        treatment_list[treatment.treatment_id] = treatment;
        appendRecords(treatment);
      }

    } else if (data.message != 'Authorization failed!') {
      document.getElementById("recordsPlace").innerHTML += `
        <div class='noRecords'>
          <img src="./img/bg-img/box.png" alt="image">
          <p>No records found!</p>
        </div>
      `;
    } else {
      window.location = './login.html';
    }
    loadingStatus(false);
  } catch (error) {
    loadingStatus(false);
    console.log(error);
  }
}

const loadPatient = async(ipd_id)=>{
  try {
    let response = await fetch(`${url}get-ipd`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        ipd_id: ipd_id,
      }),
    });

    let data = await response.json();
    if (data.status == 'ok') {
      const ipd = data.data[0];
      document.getElementById('patient-info').innerHTML = `
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
          </div
        </div>
      `;
    }    
  } catch (error) {
    console.log(error);
  }
}

const loadingStatus = (state) => {
  if(state){
    document.getElementById("processing").removeAttribute("hidden", true)
    document.getElementById("patient-info").setAttribute("hidden", true);
    document.getElementById("recordsPlace").setAttribute("hidden", true);
  }else{
    document.getElementById("processing").setAttribute("hidden", true)
    document.getElementById("patient-info").removeAttribute("hidden", true);
    document.getElementById("recordsPlace").removeAttribute("hidden", true);
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  let url_string  = window.location.href; 
  let url         = new URL(url_string);
  loadingStatus(true);
  if (url.searchParams.get("ipdID")) {
    ipd_id   = url.searchParams.get("ipdID");
    loadPatient(ipd_id);
    loadTreatment(ipd_id);
  }
});