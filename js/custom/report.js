Date.prototype.getCurrentTime = function () {
  return (
    (this.getHours() < 10 ? "0" : "") +
    (this.getHours() > 12 ? this.getHours() - 12 : this.getHours()) +
    "-" +
    (this.getMinutes() < 10 ? "0" : "") +
    this.getMinutes() +
    "-" +
    (this.getSeconds() < 10 ? "0" : "") +
    this.getSeconds() +
    (this.getHours() > 12 ? " PM" : " AM")
  );
};

let today = new Date(); //date object
let current_date = today.getDate();
let current_month = today.getMonth() + 1; //Month starts from 0
let current_year = today.getFullYear();
let current_time = today.getCurrentTime();
let date_time = current_date + "-" + current_month + "-" + current_year + " @ " + current_time;

document.getElementsByTagName("body")[0].onload = async () => {
  loadingStatus(true);
};

const loadDoctors = async() =>{
  try {
    let response = await fetch(`${url}get-user`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        designation: "Doctor", 
      }),
    });

    let data = await response.json();
    const select_doctor = document.getElementById("doctor");
    if (data.status != 'false') {
      const doctors = data.data;
      doctors.map(item => {
        const option = document.createElement('option');
        option.value = item.user_id;
        option.text = item.name;
        select_doctor.appendChild(option);
      })
    }
  }catch(e){
    console.log(e.message)
  }
}

document.getElementById("type").onchange = async (e) => {
  if (e.target.value === 'opd-report') {
    document.getElementById("doctorsDiv").removeAttribute("hidden");
    document.getElementById("doctor").setAttribute("required", true);
    loadDoctors();
  }else{
    document.getElementById("doctorsDiv").setAttribute("hidden", true);
    document.getElementById("doctor").removeAttribute("required");

  }
};

document.getElementById("date-search-btn").onclick = async () => {
  let from = document.getElementById("inputDateFrom").value;
  let to = document.getElementById("inputDateTo").value;
  let type = document.getElementById("type").value;

  let select = document.getElementById("doctor") 
  const { value, selectedOptions: [{ text }] } = select

  let doctor_id = value;
  let doctor_name = text;

  if (from != "" && to != "") {
    loadingStatus(false);
    if (type === "opd-report") {
      opdReport(from, to, doctor_id, doctor_name);
    } else if (type === "ipd-report") {
      ipdReport(from, to);
    }else if(type === "scalp-report"){
      scalpReport(from, to);
    }
  }
};

const ipdReport = async (from, to) => {
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
  let ipdData = data.data;
  console.log(data);
  let all_ipd = new Array();
  if (data.status == "ok") {
    for (key of Object.keys(ipdData)) {
      let { ipd_id, srNo, date, doa, patient_details, dod, dateTimeStamp, status, bedDetails} =
        ipdData[key];
      const bedNo = bedDetails != null ? bedDetails.description : '';
      let ipd = {
        "IPD Id": ipd_id,
        "Sr.No.": srNo,
        date:date,
        "DT A": doa,
        "Bed No": bedNo,
        Name: patient_details.name,
        Age: patient_details.age,
        Sex: patient_details.sex,
        Address: patient_details.address,
        Mobile: patient_details.mobile,
        "DT D": dod,
        "Date & Time": dateTimeStamp,
        status: status,
      };
      all_ipd.push(ipd);
    }
    let reportName = `IPD Report From date: ${from} to ${to} generated on ${date_time}`;
    let pageName = "IPD Report";
    exportExcel(all_ipd, reportName, pageName);
  } else {
    Swal.fire({
      title: "Error Occurred!",
      text: data.message,
      icon: "error",
      confirmButtonColor: "#ea4c62",
      confirmButtonText: "Okay",
    });
  }
  loadingStatus(true);
};

const scalpReport = async (from, to) => {
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
  let scalpData = data.data;
  console.log(data);
  let all_scalp = new Array();
  if (data.status == "ok") {
    for (key of Object.keys(scalpData)) {
      let { scalp_id, srNo, date, doa, patient_details, dod, fees, dateTimeStamp, status} =
        scalpData[key];

      let scalp = {
        "Scalp Id": scalp_id,
        "Sr.No.": srNo,
        date:date,
        "DT A": doa,
        Name: patient_details.name,
        Age: patient_details.age,
        Sex: patient_details.sex,
        Address: patient_details.address,
        Mobile: patient_details.mobile,
        "DT D": dod,
        "Date & Time": dateTimeStamp,
        status: status,
        Fees: fees,
      };
      all_scalp.push(scalp);
    }
    let reportName = `Scalp Report From date: ${from} to ${to} generated on ${date_time}`;
    let pageName = "Scalp Report";
    exportExcel(all_scalp, reportName, pageName);
  } else {
    Swal.fire({
      title: "Error Occurred!",
      text: data.message,
      icon: "error",
      confirmButtonColor: "#ea4c62",
      confirmButtonText: "Okay",
    });
  }
  loadingStatus(true);
};

const opdReport = async (from, to, doctor_id, doctor_name) => {
  let response = await fetch(`${url}get-opd`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      advance_search1: {
        start_date: from,
        end_date: to,
        doctor_id: doctor_id
      },
    }),
  });

  let data = await response.json();
  let opdData = data.data;
  let all_opd = new Array();
  if (data.status == "ok") {
    for (key of Object.keys(opdData)) {
      let fee = 0;
      let { opd_id, srNo, patient_details, services, dateTimeStamp } =
        opdData[key];
      let allServices = JSON.parse(services);
      for (key of Object.keys(allServices)) {
        fee = fee + parseInt(allServices[key]);
      }
      let opd = {
        "OPD Id": opd_id,
        "Sr.No.": srNo,
        Name: patient_details.name,
        Age: patient_details.age,
        Sex: patient_details.sex,
        Address: patient_details.address,
        Mobile: patient_details.mobile,
        "Date & Time": dateTimeStamp,
        Services: JSON.stringify(allServices),
        Fees: fee,
      };
      all_opd.push(opd);
    }
    let reportName = `${doctor_name}'s OPD Report From date: ${from} to ${to} generated on ${date_time}`;
    let pageName = `${doctor_name} - OPD Report`
    exportExcel(all_opd, reportName, pageName);
  } else {
    Swal.fire({
      title: "Error Occurred!",
      text: data.message,
      icon: "error",
      confirmButtonColor: "#ea4c62",
      confirmButtonText: "Okay",
    });
  }
  loadingStatus(true);
};

const exportExcel = async (arrayData, reportName, pageName) => {
  const xls = new XlsExport(arrayData, pageName);
  xls.exportToXLS(reportName + ".xls");
};

const loadingStatus = (state) => {
  if(userRole == 2){
    document.getElementById('date-search-btn').setAttribute('disabled', true);
    Swal.fire({
      title: "Access Denied?",
      text: `You don't have permission to access this page.`,
      icon: "warning",
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: "#ea4c62",
      cancelButtonColor: "#ea4c62",
      confirmButtonText: `Okay!`,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = 'index.html';
      }
    });
  }
  if (state) {
    document.getElementById(
      "date-search-btn"
    ).innerHTML = `<i class="fa-solid fa-download"></i> Download Now`;
  } else {
    document.getElementById(
      "date-search-btn"
    ).innerHTML = `<div id="spinner" class="spinner-border spinner-border-sm text-success mx-2"  role="status">
    <span class="visually-hidden">Downloading...</span>
    </div>`;
  }
};
