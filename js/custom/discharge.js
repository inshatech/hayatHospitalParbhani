let cert_id;

document.getElementById("add-btn").addEventListener("click", async(e)=>{
  try {
    if (window.navigator.onLine) {
      let valid = document.forms["form"].checkValidity();
      if (valid) {
        e.preventDefault();

        let srNo = document.getElementById("srNo").value;
        let name = document.getElementById("name").value;
        let date = document.getElementById("date").value;
        let age = document.getElementById("age").value;
        let sex = document.getElementById("sex").value;
        let address = document.getElementById("city").value;
        let city = "";
        let doa = document.getElementById("doa").value;
        let dod = document.getElementById("dod").value;
        let bedNo = document.getElementById("bedNo").value;
        
        let todValue = document.getElementById("tod").value;
        let referDoctor = document.getElementById("referDoctor").value;

        let tod = {"tod": todValue, "ref": referDoctor};

        let diagnosis = document.getElementById("diagnosis").value;
        let clinicalNotes = document.getElementById("clinicalNotes").value;
        let investigation = document.getElementById("investigation").value;
        let treatmentGiven = document.getElementById("treatmentGiven").value;

        let gc = document.getElementById("gc").value;
        let bp = document.getElementById("bp").value;
        let pr = document.getElementById("pr").value;
        let rs = document.getElementById("rs").value;
        let cvs = document.getElementById("cvs").value;
        let cns = document.getElementById("cns").value;  

        let conditionOD = {"GC": gc, "BP": bp, "pr": pr, "RS": rs, "cvs": cvs, "cns": cns};
        
        const btnValue = e.target.value;
        let conditionLabel;

        if (btnValue === "Generate Discharge") {
          conditionLabel = "Generate";
          btnColor = '#00b894'
        }else{
          conditionLabel = "Update";
          btnColor = '#E0A800';
        }

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to ${conditionLabel} discharge!`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: btnColor,
          cancelButtonColor: '#ea4c62',
          confirmButtonText: `Yes, ${conditionLabel} it!`
        }).then ((result) => {
          if (result.isConfirmed) {
            btnValue === "Generate Discharge" ? generateDischarge(srNo, name, date, age, sex, address, city, doa, dod, bedNo, tod, diagnosis, clinicalNotes, investigation, treatmentGiven, conditionOD): updateDischarge(cert_id, srNo, name, date, age, sex, address, city, doa, dod, bedNo, tod, diagnosis, clinicalNotes, investigation, treatmentGiven, conditionOD);
          }
        })

      }
    }
  } catch (error) {
    console.log(error);
  }
});

const generateDischarge = async(srNo, name, date, age, sex, address, city, doa, dod, bedNo, tod, diagnosis, clinicalNotes, investigation, treatmentGiven, conditionOD)=>{
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}discharge-certificate`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({ 
      srNo:srNo,
      date:date,
      patient_id:"",
      name:name,
      age:age,
      sex:sex,
      city:city,
      address:address,
      doa:doa,
      dod:dod,
      bedNo:bedNo,
      tod:tod,
      diagnosis:diagnosis,
      clinicalNotes:clinicalNotes,
      investigation:investigation,
      treatmentGiven:treatmentGiven,
      conditionOD:conditionOD,
      employee_id:localStorage.getItem("user_id"),
      doctor_id: 10,
    }),
  });
  let data = await response.json();
  let cert_id = data.cert_id;
  if (data.status == 'ok') {
    Swal.fire({
      title:'Success!',
      text: 'Discharge generated successfully!',
      icon: 'success',
      confirmButtonColor: '#00b894',
      confirmButtonText: 'Okay Print!',
    }).then ((result) => {
      if (result.isConfirmed) {
        document.getElementById("form").reset();
        // autoComplete(); 
        location.assign(`./templates/discharge-certificate.html?certId=${cert_id}`);
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
  document.getElementById("add-btn").innerHTML = `Generate Discharge`;
}

const updateDischarge = async(cert_id, srNo, name, date, age, sex, address, city, doa, dod, bedNo, tod, diagnosis, clinicalNotes, investigation, treatmentGiven, conditionOD) => {
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}discharge-certificate`, {
    method: "PUT",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      certId:cert_id,
      srNo:srNo,
      date:date,
      patient_id:"",
      name:name,
      age:age,
      sex:sex,
      city:city,
      address:address,
      doa:doa,
      dod:dod,
      bedNo:bedNo,
      tod:tod,
      diagnosis:diagnosis,
      clinicalNotes:clinicalNotes,
      investigation:investigation,
      treatmentGiven:treatmentGiven,
      conditionOD:conditionOD,
      employee_id:localStorage.getItem("user_id"),
      doctor_id: 10,
    }),
  });
  let data = await response.json();
  if (data.status == 'ok') {
    Swal.fire({
      title:'Success!',
      text: 'Discharge update successfully!',
      icon: 'success',
      confirmButtonColor: '#E0A800',
      confirmButtonText: 'Okay Print!',
    }).then ((result) => {
      if (result.isConfirmed) {
        document.getElementById("form").reset();
        // autoComplete(); 
        location.assign(`./templates/discharge-certificate.html?certId=${cert_id}&action=update`);
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
  document.getElementById("add-btn").innerHTML = `Generate Discharge`;
  document.getElementById("add-btn").value = "Generate Discharge";
}

document.getElementById("tod").addEventListener("change", (e)=>{
  let value = e.target.value;
  referDiv(value);
});

const referDiv = (value=0)=>{
  if (value == 3) {
    document.getElementById("referDiv").removeAttribute("hidden", true);
  }else{
    document.getElementById("referDiv").setAttribute("hidden", true);
  }
}

const getTwentyFourHourTime = async(amPmString) => {
  var d = new Date("1/1/2013 " + amPmString); 
  return d.getHours() + ':' + d.getMinutes();
}

const loadCertificate = async(cert_id) =>{
  try {
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
  
      let oldDate = data.data[0].date;
      const dateArray = oldDate.split("-");
      const date = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);
      
      document.getElementById("srNo").value     = data.data[0].srNo;
      document.getElementById("date").valueAsDate     = date;    
      document.getElementById("name").value     = `${data.data[0].name}`;
      document.getElementById("age").value      = `${data.data[0].age}`;
      document.getElementById("sex").value      = `${data.data[0].sex}`;
      document.getElementById("city").value     = `${data.data[0].address}`;
      document.getElementById("bedNo").value    = `${data.data[0].bedNo}`;
  
      let old_doa = data.data[0].doa;
      const doaArray = old_doa.split("-");
      const [doaYear, doaTime, doaTT] = doaArray[2].split(" ");
      let doa24time =  await getTwentyFourHourTime(`${doaTime} ${doaTT}`);
      let doa = `${doaYear}-${doaArray[1]}-${doaArray[0]}T${doa24time}`;
      document.getElementById("doa").value      = doa;
  
      let old_dod = data.data[0].dod;
      const dodArray = old_dod.split("-");
      const [dodYear, dodTime, dodTT] = dodArray[2].split(" ");
      let dod24time =  await getTwentyFourHourTime(`${doaTime} ${doaTT}`);
      let dod = `${dodYear}-${dodArray[1]}-${dodArray[0]}T${dod24time}`;
      document.getElementById("dod").value      = dod;
  
      let objTod = JSON.parse(data.data[0].tod);
      document.getElementById("tod").value            = `${objTod.tod}`;
      referDiv(objTod.tod);
      document.getElementById("referDoctor").value    = `${objTod.ref}`;
  
      document.getElementById("diagnosis").innerHTML      = `${data.data[0].diagnosis}`;
      document.getElementById("clinicalNotes").innerHTML  = `${data.data[0].clinicalNotes}`;
      document.getElementById("investigation").innerHTML  = `${data.data[0].investigation}`;
      document.getElementById("treatmentGiven").innerHTML = `${data.data[0].treatmentGiven}`;
  
      let conditionOD = JSON.parse(data.data[0].conditionOD);
      document.getElementById("gc").value     = `${conditionOD.GC}`;
      document.getElementById("bp").value     = `${conditionOD.BP}`;
      document.getElementById("pr").value     = `${conditionOD.pr}`;
      document.getElementById("rs").value     = `${conditionOD.RS}`;
      document.getElementById("cvs").value     = `${conditionOD.cvs}`;
      document.getElementById("cns").value     = `${conditionOD.cns}`;
  
      document.getElementById("add-btn").innerHTML = "Update Discharge";
      document.getElementById("add-btn").value = "Update Discharge";
      
      document.getElementById("add-btn").className = "btn btn-warning  w-100 d-flex align-items-center justify-content-center text-white";
      
      loadingStatus(true);
    }else{  
      loadingStatus(true);
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
  } catch (error) {
    loadingStatus(true);
    console.log(error);
  }
}

const loadingStatus = (state) => {
  if(state){
    document.getElementById("processing").setAttribute("hidden", true)
    document.getElementById("form").removeAttribute("hidden", true);
  }else{
    document.getElementById("processing").removeAttribute("hidden", true)
    document.getElementById("form").setAttribute("hidden", true);
  }
}
// document.getElementById("diagnosis").onchange = ()=>{
//   if (e.keyCode == 13) {
//     e.preventDefault();
//     this.value = this.value.substring(0, this.selectionStart) + "" + "\n" + this.value.substring(this.selectionEnd, this.value.length);
//   }
// }

const autoComplete = async ()=>{
  try {
    let bedNo = new Array();
    let clinicalNotes = new Array();
    let diagnosis = new Array();
    let treatmentGiven = new Array();
    let ref = new Array();

    let response = await fetch(`${url}get-certificate`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
    });

    let data = await response.json();
    if (data.status == 'ok') {
      const dischargeList = data.data;
      for (i = 0; i < dischargeList.length; i++) {
        if (bedNo.indexOf(dischargeList[i].bedNo) === -1) {
          bedNo.push(dischargeList[i].bedNo);
        }
        if (clinicalNotes.indexOf(dischargeList[i].clinicalNotes) === -1){
          clinicalNotes.push(dischargeList[i].clinicalNotes);
        }
        if (diagnosis.indexOf(dischargeList[i].diagnosis) === -1){
          diagnosis.push(dischargeList[i].diagnosis);
        }
        if (treatmentGiven.indexOf(dischargeList[i].treatmentGiven) === -1){
          treatmentGiven.push(dischargeList[i].treatmentGiven);
        }
        let objTod = JSON.parse(data.data[i].tod);
        if (ref.indexOf(objTod.ref) === -1) {
          ref.push(objTod.ref);
        }
      }

    }else if(data.message == 'Authorization failed!'){
      window.location = './login.html';
    }
    autocomplete(document.getElementById("bedNo"), bedNo);
    autocomplete(document.getElementById("clinicalNotes"), clinicalNotes);
    autocomplete(document.getElementById("diagnosis"), diagnosis);
    autocomplete(document.getElementById("treatmentGiven"), treatmentGiven);
    autocomplete(document.getElementById("referDoctor"), ref);
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  referDiv();
  let url_string  = window.location.href; 
  let url         = new URL(url_string);
  let currentDate = new Date();
  document.getElementById("date").value = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,"0")}-${String(currentDate.getDate()).padStart(2,"0")}`;
  document.getElementById("add-btn").value = "Generate Discharge";
  loadingStatus(true);
  if (url.searchParams.get("certId")) {
    cert_id   = url.searchParams.get("certId");
    loadCertificate(cert_id);
    loadingStatus(false);
  }
  autoComplete();
}); 