let action;
const loadCertificate = async(cert_id) =>{
  let response = await fetch(`${url}get-certificate`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      cert_id: cert_id,
    }),
  });

  let data = await response.json();
  if (data.status == 'ok') {
    document.getElementById('title').innerHTML    = `Update Discharge Certificate for ${data.data[0].name} Date: ${data.data[0].date}`;
    // document.getElementById("date").innerHTML     = `Date: ${data.data[0].date}`;
    document.getElementById("name").innerHTML     = `Patient's Name: ${data.data[0].name}`;
    document.getElementById("age-sex").innerHTML  = `Age/Sex: ${data.data[0].age}/${data.data[0].sex}`;
    document.getElementById("city").innerHTML     = `Address: ${data.data[0].address}`;
    document.getElementById("bedNo").innerHTML    = `Bed No: ${data.data[0].bedNo}`;
    document.getElementById("doa").innerHTML      = `DOA: ${data.data[0].doa}`;
    document.getElementById("dod").innerHTML      = `DOD: ${data.data[0].dod}`;

    let objTod = JSON.parse(data.data[0].tod);
    if (objTod.tod == 0) {
      document.getElementById("tod").innerHTML    = "Discharge";    
    }else if (objTod.tod == 1) {
      document.getElementById("tod").innerHTML    = "Discharge on request";
    } else if (objTod.tod == 2){
      document.getElementById("tod").innerHTML    = "AMA Discharge";
    }else if (objTod.tod == 3){
      document.getElementById("tod").innerHTML    = `Refer to <span class="heading">${objTod.ref}</span>`;
    }

    document.getElementById("diagnosis").innerHTML      = `${data.data[0].diagnosis}`;
    document.getElementById("clinicalNotes").innerHTML  = `${data.data[0].clinicalNotes}`;
    document.getElementById("investigation").innerHTML  = `${data.data[0].investigation}`;
    document.getElementById("treatmentGiven").innerHTML = `${data.data[0].treatmentGiven}`;

    let conditionOD = JSON.parse(data.data[0].conditionOD);
    let cod = "";
    for (const key in conditionOD) {
      if (conditionOD.hasOwnProperty.call(conditionOD, key)) {
        const element = conditionOD[key];
        cod += `${key} ${element} `;
      }
    }

    document.getElementById("cod").innerHTML  = `${cod}`;
    print();
  }else{
    Swal.fire({
      title:'Error Occurred!',
      text:data.message,
      icon:'error',
      confirmButtonColor: '#ea4c62',
      confirmButtonText: 'Okay'
    }).then ((result) => {
      if (result.isConfirmed) {
        if (data.message == 'Authorization failed!') {
          location.assign('../login.html');
        }else{
          location.assign('../add-discharge.html');
        }
      }
    })
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  let url_string  = window.location.href; 
  let url         = new URL(url_string);
  let cert_id   = url.searchParams.get("certId");
  action = url.searchParams.get("action");
  loadCertificate(cert_id)
});

const back = ()=>{
  if (action === "update") {
    location.assign('../list-discharge.html');
  }else{
    window.history.go(-1); return false;
  }
}