/**
 * Attaches an event listener to the "add-btn" element that triggers when the button is clicked.
 * The function retrieves data from various form elements and creates an object with the data.
 * The object is then passed to the addFitness function if the form is valid and the user confirms the action.
 * @param {Event} e - The event object.
 * @returns None
 */
document.getElementById("add-btn").onclick = async (e) => {
  try {
    if (window.navigator.onLine) {
      let valid = document.forms["form"].checkValidity();
      if (valid) {
        e.preventDefault();
        // General Info
        let referer = document.getElementById("referer").value;
        let name = document.getElementById("name").value;
        let date = document.getElementById("date").value;
        let age = document.getElementById("age").value;
        let sex = document.getElementById("sex").value;
        let city = document.getElementById("city").value;
        let mobile = document.getElementById("mobile").value;
        let postedFor = document.getElementById("postedFor").value;
        // Complaints
        /**
         * Collects the values of all checked complaint checkboxes and returns an object
         * with the complaint id as the key and the value as either "YES" or "NO".
         * @returns {Object} - An object with the complaint id as the key and the value as either "YES" or "NO".
         */
        const compCollection = document.getElementsByName("complaints");
        let complaints = {};
        for (let i = 0; i < compCollection.length; i++) {
          if (document.getElementsByName("complaints")[i].checked) {
            document.getElementsByName("complaints")[i].value = "YES";
          } else {
            document.getElementsByName("complaints")[i].value = "NO";
          }
          let key = document.getElementsByName("complaints")[i].id;
          let element = document.getElementsByName("complaints")[i].value
          complaints[key] = element;
        }
        // history
        const hisCollection = document.getElementsByName("history");
        let history = {};
        for (let i = 0; i < hisCollection.length; i++) {
          if (document.getElementsByName("history")[i].checked) {
            document.getElementsByName("history")[i].value = "YES";
          } else {
            document.getElementsByName("history")[i].value = "NO";
          }
          let key = document.getElementsByName("history")[i].id;
          let element = document.getElementsByName("history")[i].value
          history[key] = element;
        }
        // personal
        const perCollection = document.getElementsByName("personal");
        let personal = {};
        for (let i = 0; i < perCollection.length; i++) {
          if (document.getElementsByName("personal")[i].checked) {
            document.getElementsByName("personal")[i].value = "YES";
          } else {
            document.getElementsByName("personal")[i].value = "NO";
          }
          let key = document.getElementsByName("personal")[i].id;
          let element = document.getElementsByName("personal")[i].value
          personal[key] = element;
        }
        // examination
        /**
         * Retrieves the values of various medical examination parameters from the HTML document and
         * stores them in an object.
         * @returns {Object} - An object containing the values of the medical examination parameters.
         * The object has the following properties:
         * - BP: The value of the blood pressure parameter.
         * - Blood_Sugar: The value of the blood sugar parameter.
         * - Pulse: The value of the pulse parameter.
         * - ECG: The value of the ECG parameter.
         * - Temp: The value of the temperature parameter.
         */
        let BP = document.getElementById("BP").value;
        let Blood_Sugar = document.getElementById("Blood_Sugar").value;
        let Pulse = document.getElementById("Pulse").value;
        let ECG = document.getElementById("ECG").value;
        let Temp = document.getElementById("Temp").value;
        let examination = { "BP": BP, "Blood_Sugar": Blood_Sugar, "Pulse": Pulse, "ECG": ECG, "Temp": Temp };

        /**
         * Loops through all elements with the name "examination" and updates their value to "YES" if they are checked
         * and "NO" if they are not checked. It then adds the key-value pair to the examination object.
         * @returns None
         */
        const exmCollection = document.getElementsByName("examination");
        for (let i = 0; i < exmCollection.length; i++) {
          if (document.getElementsByName("examination")[i].checked) {
            document.getElementsByName("examination")[i].value = "YES";
          } else {
            document.getElementsByName("examination")[i].value = "NO";
          }
          let key = document.getElementsByName("examination")[i].id;
          let element = document.getElementsByName("examination")[i].value
          examination[key] = element;
        }

        const other = { "RS": "BILATERAL CLEAR", "CVS": "S1 , S2 NORMAL", "P/A": "SOFT NON TENDER", "CNS": "CONSCIOUS" };

        //Opinion
        let opinion = document.getElementById("Opinion").value;

        Swal.fire({
          title: 'Are you sure?',
          text: "You wan't add Fitness!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#00b894',
          cancelButtonColor: '#ea4c62',
          confirmButtonText: 'Yes, add it!'
        }).then((result) => {
          if (result.isConfirmed) {
            addFitness(referer, name, date, age, sex, city, address, mobile, postedFor, complaints, history, personal, examination, other, opinion);
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sends a POST request to the server to add a new fitness record with the given information.
 * @param {string} referer - The name of the referring doctor.
 * @param {string} name - The name of the patient.
 * @param {string} date - The date of the fitness record.
 * @param {number} age - The age of the patient.
 * @param {string} sex - The sex of the patient.
 * @param {string} city - The city of the patient.
 * @param {string} address - The address of the patient.
 * @param {string} mobile - The mobile number of the patient.
 * @param {string} postedFor - The reason for posting the
 */
const addFitness = async (referer, name, date, age, sex, city, address, mobile, postedFor, complaints, history, personal, examination, other, opinion) => {
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}fitness`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      referer: referer,
      name: name,
      date: date,
      age: age,
      sex: sex,
      city: city,
      address: address,
      mobile: mobile,
      postedFor: postedFor,
      complaints: complaints,
      history: history,
      personal: personal,
      examination: examination,
      other: other,
      opinion: opinion
    }),
  });
  let data = await response.json();
  if (data.status == 'ok') {
    Swal.fire({
      title: 'Success!',
      text: 'Fitness added successfully!',
      icon: 'success',
      confirmButtonColor: '#00b894',
      confirmButtonText: 'Okay Print!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById("form").reset();
        autoComplete();
        let fitness_id = data.fitness_id;
        location.assign(`./templates/fitness.html?fitnessId=${fitness_id}`);
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
  document.getElementById("add-btn").innerHTML = `Add Fitness`;
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

const setCheckBox = async (object, checkBoxName) => {
  const personal = JSON.parse(object);
  let index = 0;
  for (const key in personal) {
    if (Object.hasOwnProperty.call(personal, key)) {
      const value = personal[key];
      const checkbox = document.getElementsByName(checkBoxName)[index];
      if (value === "YES" && checkbox.id === key) {
        checkbox.checked = true;
        checkbox.value = "YES";
      }
      index++;
    }
  }
}

const dbDateFormatter = async (date) => {
  const dateArray = date.split("-");
  const formattedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
  return formattedDate;
}

const loadCertificate = async (fitness_id) => {
  try {
    let response = await fetch(`${url}getFitness`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        fitness_id: fitness_id,
      }),
    });

    let data = await response.json();
    if (data.status == 'ok') {
      document.getElementById('title').innerHTML = `Update Fitness Certificate for ${data.data[0].name} Date: ${data.data[0].date}`;

      document.getElementById("referer").value = data.data[0].referer;
      document.getElementById("name").value = data.data[0].name;
      document.getElementById("date").value = await dbDateFormatter(data.data[0].date);
      document.getElementById("age").value = data.data[0].age;
      document.getElementById("sex").value = data.data[0].sex;
      document.getElementById("city").value = data.data[0].city;
      document.getElementById("mobile").value = data.data[0].mobile;
      document.getElementById("postedFor").value = data.data[0].postedFor;

      await setCheckBox(data.data[0].complaints, "complaints");
      await setCheckBox(data.data[0].history, "history");
      await setCheckBox(data.data[0].personal, "personal");
      await setCheckBox(data.data[0].examination, "examination");

      const examination = JSON.parse(data.data[0].examination);

      document.getElementById("BP").value = examination.BP;
      document.getElementById("Blood_Sugar").value = examination.Blood_Sugar;
      document.getElementById("Pulse").value = examination.Pulse;
      document.getElementById("ECG").value = examination.ECG;
      document.getElementById("Temp").value = examination.Temp;

      //Opinion
      document.getElementById("Opinion").value = data.data[0].opinion;


      document.getElementById("add-btn").innerHTML = "Update Fitness";
      document.getElementById("add-btn").value = "Update Fitness";

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

/**
 * Attaches an event listener to the body element of the document that triggers the
 * autoComplete function when the body has finished loading.
 * @returns None
 */
document.getElementsByTagName("body")[0].onload = async () => {
  let url_string = window.location.href;
  let url = new URL(url_string);

  let currentDate = new Date();
  document.getElementById("date").value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
  await autoComplete();

  loadingStatus(true);
  if (url.searchParams.get("fitnessId")) {
    fitness_id = url.searchParams.get("fitnessId");
    loadCertificate(fitness_id);
    loadingStatus(false);
  }
};


/**
 * Fetches fitness data from the server and populates the referer, opinion, and postedFor
 * fields with the appropriate data using the autocomplete function.
 * @returns None
 */
const autoComplete = async () => {
  try {
    let referer = new Array();
    let postedFor = new Array();
    let opinion = new Array();
    let BP = new Array();
    let Pulse = new Array();
    let Blood_Sugar = new Array();
    let ECG = new Array();

    let response = await fetch(`${url}getFitness`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
    });

    let data = await response.json();
    if (data.status == 'ok') {
      const fitnessList = data.data;
      for (i = 0; i < fitnessList.length; i++) {
        if (referer.indexOf(fitnessList[i].referer) === -1) {
          referer.push(fitnessList[i].referer);
        }
        if (postedFor.indexOf(fitnessList[i].postedFor) === -1) {
          postedFor.push(fitnessList[i].postedFor);
        }
        if (opinion.indexOf(fitnessList[i].opinion) === -1) {
          opinion.push(fitnessList[i].opinion);
        }

        let objExamination = JSON.parse(data.data[i].examination);
        if (BP.indexOf(objExamination.BP) === -1) {
          BP.push(objExamination.BP);
        }
        if (Pulse.indexOf(objExamination.Pulse) === -1) {
          Pulse.push(objExamination.Pulse);
        }
        if (Blood_Sugar.indexOf(objExamination.Blood_Sugar) === -1) {
          Blood_Sugar.push(objExamination.Blood_Sugar);
        }
        if (ECG.indexOf(objExamination.ECG) === -1) {
          ECG.push(objExamination.ECG);
        }
      }
    } else if (data.message == 'Authorization failed!') {
      window.location = './login.html';
    }
    autocomplete(document.getElementById("referer"), referer);
    autocomplete(document.getElementById("Opinion"), opinion);
    autocomplete(document.getElementById("postedFor"), postedFor);

    autocomplete(document.getElementById("BP"), BP);
    autocomplete(document.getElementById("Pulse"), Pulse);
    autocomplete(document.getElementById("Blood_Sugar"), Blood_Sugar);
    autocomplete(document.getElementById("ECG"), ECG);
  } catch (error) {
    console.log(error);
  }
}
