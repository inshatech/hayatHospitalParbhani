let ipd_id;

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
        let mobile = document.getElementById("mobile").value;
        let address = document.getElementById("city").value;
        let city = "";
        let doa = document.getElementById("doa").value;
        let bedNo = document.getElementById("bedNo").value;
        let otherDetails = "";
      
        
        const btnValue = e.target.value;
        console.log(btnValue);
        let conditionLabel;

        if (btnValue === "Add IPD") {
          conditionLabel = "Add";
          btnColor = '#00b894'
        }else{
          conditionLabel = "Update";
          btnColor = '#E0A800';
        }

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to ${conditionLabel} IPD!`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: btnColor,
          cancelButtonColor: '#ea4c62',
          confirmButtonText: `Yes, ${conditionLabel} it!`
        }).then ((result) => {
          if (result.isConfirmed) {
            btnValue === "Add IPD" ? 
            add_IPD(srNo, name, date, age, sex, address, city, doa, bedNo, otherDetails, mobile): 
            update_IPD(ipd_id, srNo, name, date, age, sex, address, city, doa, bedNo, otherDetails, mobile);
          }
        })

      }
    }
  } catch (error) {
    console.log(error);
  }
});

const add_IPD = async(srNo, name, date, age, sex, address, city, doa, bedNo, otherDetails, mobile)=>{
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}ipd`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({ 
      srNo:srNo,
      date:date,
      name:name,
      age:age,
      sex:sex,
      city:city,
      state:"10",
      services:"",
      mobile:mobile,
      address:address,
      doa:doa,
      bedNo:bedNo,
      otherDetails:otherDetails,
      employee_id:localStorage.getItem("user_id"),
      doctor_id: 10,
    }),
  });
  let data = await response.json();
  let cert_id = data.cert_id;
  if (data.status == 'ok') {
    Swal.fire({
      title:'Success!',
      text: 'IPD added successfully!',
      icon: 'success',
      confirmButtonColor: '#00b894',
      confirmButtonText: 'Okay!',
    }).then ((result) => {
      if (result.isConfirmed) {
        reset();
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
  document.getElementById("add-btn").innerHTML = `Add IPD`;
}

const update_IPD = async(ipd_id, srNo, name, date, age, sex, address, city, doa, bedNo, otherDetails, mobile) => {
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}ipd`, {
    method: "PUT",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      ipd_id:ipd_id,
      srNo:srNo,
      name:name,
      date:date,
      age:age,
      sex:sex,
      city:city,
      address:address,
      doa:doa,
      bedNo:bedNo,
      otherDetails:otherDetails,
      mobile:mobile,
      employee_id:localStorage.getItem("user_id"),
      doctor_id: 10,
    }),
  });
  let data = await response.json();
  if (data.status == 'ok') {
    Swal.fire({
      title:'Success!',
      text: 'IPD update successfully!',
      icon: 'success',
      confirmButtonColor: '#E0A800',
      confirmButtonText: 'Okay!',
    }).then ((result) => {
      if (result.isConfirmed) {
        document.getElementById("form").reset();
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
  document.getElementById("add-btn").innerHTML = `Add IPD`;
  document.getElementById("add-btn").value = "Add IPD";
}

const addBedPopUp = () => {
  $('#bedModel').modal('show');
} 

document.getElementById("addBed-btn").addEventListener("click", async(e)=>{
  try {
    if (window.navigator.onLine) {
      let valid = document.forms["form"][1].checkValidity();
      if (valid) {
        e.preventDefault();
        let bed_no  = document.getElementById("bed_no").value;
        let bed_name    = document.getElementById("bed_name").value;

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to add ${bed_name}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#E0A800',
          cancelButtonColor: '#ea4c62',
          confirmButtonText: `Yes, Add it!`
        }).then ((result) => {
          if (result.isConfirmed) {
            addBed(bed_no, bed_name);
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
})

const askDeleteBed = ()=>{
  try {
    const bed_id = document.getElementById('bedNo').value;
    if (!bed_id == "") {
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to delete this bed?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E0A800',
        cancelButtonColor: '#ea4c62',
        confirmButtonText: `Yes, Add it!`
      }).then ((result) => {
        if (result.isConfirmed) {
          deleteBed(bed_id);
        }
      })
    }else{
      Swal.fire({
        title:'Error Occurred!',
        text:"Please select bed number",
        icon:'error',
        confirmButtonColor: '#ea4c62',
        confirmButtonText: 'Okay'
      })
    }
    
  } catch (error) {
    console.log(error);
  }
}

const deleteBed = async(bed_id)=> {
  try {
    const response = await fetch(`${url}icu`, {
      method: 'DELETE',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        bed_id: bed_id,
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
          loadBeds();
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

const addBed = async(bed_no, bed_name) => {
  try {
    const response = await fetch(`${url}icu`, {
      method: 'POST',
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        bedNo: bed_no,
        description:bed_name,
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
          loadBeds();
          $('#bedModel').modal('hide');
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

const getTwentyFourHourTime = async(amPmString) => {
  var d = new Date("1/1/2013 " + amPmString); 
  return d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
}

const loadIPD = async(ipd_id) =>{
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
    console.log(data);
    if (data.status == 'ok') {
      document.getElementById('title').innerHTML    = `Update IPD for ${data.data[0].name} Date: ${data.data[0].date}`;
  
      let oldDate = data.data[0].date;
      const dateArray = oldDate.split("-");
      const date = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);
      
      document.getElementById("srNo").value     = data.data[0].srNo;
      document.getElementById("date").valueAsDate     = date;    
      document.getElementById("name").value     = `${data.data[0].patient_details.name}`;
      document.getElementById("age").value      = `${data.data[0].patient_details.age}`;
      document.getElementById("sex").value      = `${data.data[0].patient_details.sex}`;
      document.getElementById("city").value     = `${data.data[0].patient_details.address}`;
      document.getElementById("mobile").value     = `${data.data[0].patient_details.mobile}`;
      document.getElementById("bedNo").value    = `${data.data[0].bedNo}`;
  
      let old_doa = data.data[0].doa;
      const doaArray = old_doa.split("-");
      const [doaYear, doaTime, doaTT] = doaArray[2].split(" ");
      let doa24time =  await getTwentyFourHourTime(`${doaTime} ${doaTT}`);
      let doa = `${doaYear}-${doaArray[1]}-${doaArray[0]}T${doa24time}`;
      document.getElementById("doa").value      = doa;
  
      document.getElementById("add-btn").innerHTML = "Update IPD";
      document.getElementById("add-btn").value = "Update IPD";
      
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

const loadBeds = async() => {
  try {
    let response = await fetch(`${url}get-icu`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
    });  
    let data = await response.json();
    const bedNo  = document.getElementById("bedNo");
    bedNo.innerHTML = "<option selected></option>";
    if (data.status == "ok") {
      data.data.forEach((bed) => {
        let bedOpt = document.createElement('option');
        let bedStatus = bed['status'];
        bedOpt.value = bed["bed_id"];
        bedStatus == 2 ? bedOpt.innerHTML = bed["description"] + " (In Service)": bedOpt.innerHTML =bed["description"]
        bedStatus == 2 ? bedOpt.disabled = true: "";
        bedNo.appendChild(bedOpt);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const reset = ()=>{
  document.getElementById("form").reset();
  loadBeds();
  let currentDate = new Date();
  document.getElementById("date").value = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,"0")}-${String(currentDate.getDate()).padStart(2,"0")}`;
}

document.addEventListener("DOMContentLoaded", ()=>{
  reset();
  let url_string  = window.location.href; 
  let url         = new URL(url_string);
  document.getElementById("add-btn").value = "Add IPD";
  loadingStatus(true);
  if (url.searchParams.get("ipdID")) {
    ipd_id   = url.searchParams.get("ipdID");
    loadIPD(ipd_id);
    loadingStatus(false);
    document.getElementById("bedNo").setAttribute("disabled", true)
  }
}); 