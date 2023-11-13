let scalp_id;

document.getElementById("add-btn").addEventListener("click", async (e) => {
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
        let otherDetails = "";


        const btnValue = e.target.value;
        console.log(btnValue);
        let conditionLabel;

        if (btnValue === "Add Scalp") {
          conditionLabel = "Add";
          btnColor = '#00b894'
        } else {
          conditionLabel = "Update";
          btnColor = '#E0A800';
        }

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to ${conditionLabel} Scalp!`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: btnColor,
          cancelButtonColor: '#ea4c62',
          confirmButtonText: `Yes, ${conditionLabel} it!`
        }).then((result) => {
          if (result.isConfirmed) {
            btnValue === "Add Scalp" ?
              add_Scalp(srNo, name, date, age, sex, address, city, doa, otherDetails, mobile) :
              update_Scalp(scalp_id, srNo, name, date, age, sex, address, city, doa, otherDetails, mobile);
          }
        })

      }
    }
  } catch (error) {
    console.log(error);
  }
});

const add_Scalp = async (srNo, name, date, age, sex, address, city, doa, otherDetails, mobile) => {
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}scalp`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      srNo: srNo,
      date: date,
      name: name,
      age: age,
      sex: sex,
      city: city,
      state: "10",
      services: "",
      mobile: mobile,
      address: address,
      doa: doa,
      otherDetails: otherDetails,
      employee_id: localStorage.getItem("user_id"),
      doctor_id: 10,
    }),
  });
  let data = await response.json();
  let scalp_id = data.scalp_id;
  if (data.status == 'ok') {
    Swal.fire({
      title: 'Success!',
      text: 'Scalp added successfully!',
      icon: 'success',
      confirmButtonColor: '#00b894',
      confirmButtonText: 'Okay!',
    }).then((result) => {
      if (result.isConfirmed) {
        reset();
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
  document.getElementById("add-btn").innerHTML = `Add Scalp`;
}

const update_Scalp = async (scalp_id, srNo, name, date, age, sex, address, city, doa, otherDetails, mobile) => {
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}scalp`, {
    method: "PUT",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      scalp_id: scalp_id,
      srNo: srNo,
      name: name,
      date: date,
      age: age,
      sex: sex,
      city: city,
      address: address,
      doa: doa,
      otherDetails: otherDetails,
      mobile: mobile,
      employee_id: localStorage.getItem("user_id"),
      doctor_id: 10,
    }),
  });
  let data = await response.json();
  if (data.status == 'ok') {
    Swal.fire({
      title: 'Success!',
      text: 'Scalp update successfully!',
      icon: 'success',
      confirmButtonColor: '#E0A800',
      confirmButtonText: 'Okay!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById("form").reset();
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
  document.getElementById("add-btn").innerHTML = `Add Scalp`;
  document.getElementById("add-btn").value = "Add Scalp";
}

const getTwentyFourHourTime = async (amPmString) => {
  var d = new Date("1/1/2013 " + amPmString);
  return d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
}

const loadScalp = async (scalp_id) => {
  try {
    let response = await fetch(`${url}get-scalp`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        scalp_id: scalp_id,
      }),
    });

    let data = await response.json();
    console.log(data);
    if (data.status == 'ok') {
      document.getElementById('title').innerHTML = `Update Scalp for ${data.data[0].name} Date: ${data.data[0].date}`;

      let oldDate = data.data[0].date;
      const dateArray = oldDate.split("-");
      const date = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);

      document.getElementById("srNo").value = data.data[0].srNo;
      document.getElementById("date").valueAsDate = date;
      document.getElementById("name").value = `${data.data[0].patient_details.name}`;
      document.getElementById("age").value = `${data.data[0].patient_details.age}`;
      document.getElementById("sex").value = `${data.data[0].patient_details.sex}`;
      document.getElementById("city").value = `${data.data[0].patient_details.address}`;
      document.getElementById("mobile").value = `${data.data[0].patient_details.mobile}`;

      let old_doa = data.data[0].doa;
      const doaArray = old_doa.split("-");
      const [doaYear, doaTime, doaTT] = doaArray[2].split(" ");
      let doa24time = await getTwentyFourHourTime(`${doaTime} ${doaTT}`);
      let doa = `${doaYear}-${doaArray[1]}-${doaArray[0]}T${doa24time}`;
      document.getElementById("doa").value = doa;

      document.getElementById("add-btn").innerHTML = "Update Scalp";
      document.getElementById("add-btn").value = "Update Scalp";

      document.getElementById("add-btn").className = "btn btn-warning  w-100 d-flex align-items-center justify-content-center text-white";

      loadingStatus(true);
    } else {
      loadingStatus(true);
      Swal.fire({
        title: 'Error Occurred!',
        text: data.message,
        icon: 'error',
        confirmButtonColor: '#ea4c62',
        confirmButtonText: 'Okay'
      }).then((result) => {
        if (result.isConfirmed) {
          if (data.message == 'Authorization failed!') {
            location.assign('../login.html');
          } else {
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
  if (state) {
    document.getElementById("processing").setAttribute("hidden", true)
    document.getElementById("form").removeAttribute("hidden", true);
  } else {
    document.getElementById("processing").removeAttribute("hidden", true)
    document.getElementById("form").setAttribute("hidden", true);
  }
}

const reset = () => {
  document.getElementById("form").reset();
  let currentDate = new Date();
  document.getElementById("date").value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
}

document.addEventListener("DOMContentLoaded", () => {
  reset();
  let url_string = window.location.href;
  let url = new URL(url_string);
  document.getElementById("add-btn").value = "Add Scalp";
  loadingStatus(true);
  if (url.searchParams.get("scalpID")) {
    scalp_id = url.searchParams.get("scalpID");
    loadScalp(scalp_id);
    loadingStatus(false);
  }
}); 