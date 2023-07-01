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
          }else{
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
          }else{
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
          }else{
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
        let examination = {"BP": BP, "Blood_Sugar": Blood_Sugar, "Pulse": Pulse, "ECG": ECG, "Temp": Temp};

        /**
         * Loops through all elements with the name "examination" and updates their value to "YES" if they are checked
         * and "NO" if they are not checked. It then adds the key-value pair to the examination object.
         * @returns None
         */
        const exmCollection = document.getElementsByName("examination");
        for (let i = 0; i < exmCollection.length; i++) {
          if (document.getElementsByName("examination")[i].checked) {
            document.getElementsByName("examination")[i].value = "YES";
          }else{
            document.getElementsByName("examination")[i].value = "NO";
          }
          let key = document.getElementsByName("examination")[i].id;
          let element = document.getElementsByName("examination")[i].value
          examination[key] = element;
        }

        const other = {"RS":"BILATERAL CLEAR", "CVS":"S1 , S2 NORMAL", "P/A": "SOFT NON TENDER", "CNS": "CONSCIOUS"};

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
        }).then ((result) => {
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
const addFitness = async(referer, name, date, age, sex, city, address, mobile, postedFor, complaints, history, personal, examination, other, opinion) => {
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
      title:'Success!',
      text: 'Fitness added successfully!',
      icon: 'success',
      confirmButtonColor: '#00b894',
      confirmButtonText: 'Okay Print!',
    }).then ((result) => {
      if (result.isConfirmed) {
        document.getElementById("form").reset();
        autoComplete();
        let fitness_id = data.fitness_id; 
        location.assign(`./templates/fitness.html?fitnessId=${fitness_id}`);
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
  document.getElementById("add-btn").innerHTML = `Add Fitness`;
}

/**
 * Attaches an event listener to the body element of the document that triggers the
 * autoComplete function when the body has finished loading.
 * @returns None
 */
document.getElementsByTagName("body")[0].onload = async () => {
  let currentDate = new Date();
  document.getElementById("date").value = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,"0")}-${String(currentDate.getDate()).padStart(2,"0")}`;
  autoComplete();
};


/**
 * Fetches fitness data from the server and populates the referer, opinion, and postedFor
 * fields with the appropriate data using the autocomplete function.
 * @returns None
 */
const autoComplete = async ()=>{
  try {
    let referer = new Array();
    let postedFor = new Array();
    let opinion = new Array();

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
        if (postedFor.indexOf(fitnessList[i].postedFor) === -1){
          postedFor.push(fitnessList[i].postedFor);
        }
        if (opinion.indexOf(fitnessList[i].opinion) === -1){
          opinion.push(fitnessList[i].opinion);
        }
      }
    }else if(data.message == 'Authorization failed!'){
      window.location = './login.html';
    }
    
    autocomplete(document.getElementById("referer"), referer);
    autocomplete(document.getElementById("Opinion"), opinion);
    autocomplete(document.getElementById("postedFor"), postedFor);
  } catch (error) {
    console.log(error);
  }
}
