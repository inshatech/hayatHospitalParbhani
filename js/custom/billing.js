let serviceRates = {};

/**
 * Calculates the total sum of the services listed in the service table and updates the grand total field.
 * @returns None
 */
const servicesCalculation = ()=>{
  let table = document.getElementById("serviceTable");
  let sumVal = 0;
  for(var i = 2; i < table.rows.length; i++){
    sumVal = sumVal + parseFloat(table.rows[i].cells[3].innerHTML);
  }
  document.getElementById("sTotal").value = sumVal;
  let paid = parseFloat(document.getElementById("paid").value);
  let discount = parseFloat(document.getElementById("discount").value);
  document.getElementById("gTotal").value = parseFloat(sumVal) - paid - discount;
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
 * Adds a new service to the service table with the given service name, rate, and quantity.
 * Calculates the total cost of the service and updates the table accordingly.
 * @returns None
 */
const addService = ()=>{
  let serviceName = document.getElementById('serviceName').value;
  let rate        = document.getElementById('rate').value;
  let qty         = document.getElementById('qty').value;

  if (serviceName != '' && rate != '' && qty != ''){
    const serviceTable = document.getElementById("serviceTable");
    let row = serviceTable.insertRow(-1);

    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    let c4 = row.insertCell(3);
    let c5 = row.insertCell(4);

    c1.innerText = serviceName
    c2.innerText = rate
    c3.innerText = qty
    c4.innerText = parseFloat(rate) * parseFloat(qty);
    c5.innerHTML = `<button onclick='removeService()' type="button" id="add-service-btn" class="btn m-1 btn-danger"><i class="fa-solid fa-minus"></i></button>`;

    document.getElementById('serviceName').value = '';
    document.getElementById('rate').value = '';
    document.getElementById('qty').value = '';

    document.getElementById('serviceName').focus();

    servicesCalculation();
  }
};

/**
 * Adds event listeners to the "paid" and "discount" elements that trigger the servicesCalculation function.
 * @param None
 * @returns None
 */
document.getElementById("paid").addEventListener("change", servicesCalculation);
document.getElementById("discount").addEventListener("change", servicesCalculation);

/**
 * Adds an event listener to the "serviceName" element that listens for the "Enter" key to be pressed.
 * When the "Enter" key is pressed, the "rate" element is focused.
 * @param {Event} e - The event object.
 * @returns None
 */
document.getElementById("serviceName").addEventListener("keypress", (e)=>{
  if (e.key === "Enter") {
    // Cancel the default action, if needed
    e.preventDefault();
    // Trigger the button element with a click
    document.getElementById('rate').focus();
  }
});

/**
 * Adds an event listener to the "rate" element that listens for the "Enter" key to be pressed.
 * When the "Enter" key is pressed, the "qty" element is focused.
 * @param {Event} e - The event object.
 * @returns None
 */
document.getElementById("rate").addEventListener("keypress", (e)=>{
  if (e.key === "Enter") {
    // Cancel the default action, if needed
    e.preventDefault();
    // Trigger the button element with a click
    document.getElementById('qty').focus();
  }
});

/**
 * Adds an event listener to the "qty" element that listens for the "Enter" key to be pressed.
 * When the "Enter" key is pressed, the "addService" function is called and the default behavior
 * of the event is prevented.
 * @param {Event} e - The event object.
 * @returns None
 */
document.getElementById("qty").addEventListener("keypress", (e)=>{
  if (e.key === "Enter") {
    // Cancel the default action, if needed
    e.preventDefault();
    // Trigger the button element with a click
    addService();
  }
});

/**
 * Removes the parent element of the currently active element from the DOM and recalculates
 * the services.
 * @returns None
 */
function removeService(){
  document.activeElement.parentElement.parentElement.remove();
  servicesCalculation();
}

/**
 * Adds an event listener to the document that waits for the DOM to be fully loaded.
 * Once the DOM is loaded, it calls the servicesCalculation function, resets the form with id "form",
 * and calls the autoComplete function.
 * @returns None
 */
document.addEventListener("DOMContentLoaded", ()=>{
  servicesCalculation();
  document.getElementById("form").reset();
  autoComplete();
});

/**
 * Attaches an event listener to the "add-btn" element that generates a bill if the form is valid and the user confirms.
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

        let name = document.getElementById("name").value;
        let date = document.getElementById("date").value;
        let age = document.getElementById("age").value;
        let sex = document.getElementById("sex").value;
        let address = document.getElementById("address").value;
        let city = document.getElementById("city").value;
        let mobile = document.getElementById("mobile").value;
        let doa = document.getElementById("doa").value;
        let dod = document.getElementById("dod").value;
        let bedNo = document.getElementById("bedNo").value;
        let paid  = document.getElementById("paid").value;
        let gTotal = document.getElementById("gTotal").value;
        let discount = document.getElementById("discount").value;

        /**
         * Extracts data from an HTML table and stores it in a services object.
         * @param {Object} services - An object to store the extracted data.
         * @param {Object} table - The HTML table element to extract data from.
         * @returns None
         */
        let services = {};
        let table = document.getElementById("serviceTable");
        for(var i = 2; i < table.rows.length; i++){
          services[i-2] = {"service":table.rows[i].cells[0].innerHTML, "rate":table.rows[i].cells[1].innerHTML, "qty":table.rows[i].cells[2].innerHTML, "total":table.rows[i].cells[3].innerHTML};
        }

        Swal.fire({
          title: 'Are you sure?',
          text: "You want Generate bill!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#00b894',
          cancelButtonColor: '#ea4c62',
          confirmButtonText: 'Yes, generate it!'
        }).then ((result) => {
          if (result.isConfirmed) {
            generateBill(name, date, age, sex, address, city, mobile, doa, dod, bedNo, gTotal, paid, discount, services);
          }
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Generates a bill for a patient and sends a POST request to the server.
 * @param {string} name - The name of the patient.
 * @param {string} date - The date of the bill.
 * @param {number} age - The age of the patient.
 * @param {string} sex - The sex of the patient.
 * @param {string} address - The address of the patient.
 * @param {string} city - The city of the patient.
 * @param {string} mobile - The mobile number of the patient.
 * @param {string} doa - The date of admission of the patient.
 * @param {string} dod - The date of discharge of the patient.
 *
 */
const generateBill = async(name, date, age, sex, address, city, mobile, doa, dod, bedNo, gTotal, paid, discount, services)=>{
  document.getElementById("add-btn").innerHTML = `
    <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Processing...
  `;
  let response = await fetch(`${url}billing`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      date:date,
      patient_id:"",
      name:name,
      age:age,
      sex:sex,
      city:city,
      address:address,
      mobile:mobile,
      doa:doa,
      dod:dod,
      bedNo:bedNo,
      services:services,
      gTotal:gTotal,
      paid:paid,
      discount:discount,
      employee_id:localStorage.getItem("user_id"),
    }),
  });
  let data = await response.json();
  let bill_id = data.bill_id;
  if (data.status == 'ok') {
    Swal.fire({
      title:'Success!',
      text: 'Bill generated successfully!',
      icon: 'success',
      confirmButtonColor: '#00b894',
      confirmButtonText: 'Okay Print!',
    }).then ((result) => {
      if (result.isConfirmed) {
        document.getElementById("form").reset();
        let services = document.getElementById("serviceTable");
        DeleteRows(services);
        autoComplete(); 
        location.assign(`./templates/bill.html?billId=${bill_id}`);
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
  document.getElementById("add-btn").innerHTML = `Generate Bill`;
}

/**
 * Fetches data from the server and populates the autocomplete fields for bed numbers and service names.
 * @returns None
 */
const autoComplete = async ()=>{
  try {
    let bedNo = new Array();
    let serviceName = new Array();

    let response = await fetch(`${url}get-bill`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
    });

    let data = await response.json();
    if (data.status == 'ok') {
      /**
       * Loops through an array of bills and extracts unique bed numbers and service names
       * along with their corresponding rates.
       * @param {Array} data - the array of bills to extract data from
       * @returns None
       */
      const bills = data.data;
      for (i = 0; i < bills.length; i++) {
        if (bedNo.indexOf(bills[i].bedNo) === -1) {
          bedNo.push(bills[i].bedNo);
        }
        /**
         * Parses the services from a bill object and creates an object of service rates.
         * @param {string} bills - The bill object containing the services to parse.
         * @returns {Object} An object containing the service rates for each unique service.
         */
        const services = JSON.parse(bills[i].services);
        services.forEach(element => {
          if (serviceName.indexOf(element.service) === -1) {
            serviceName.push(element.service);
            serviceRates[element.service] = element.rate;
          }
        });
      }
    }else if(data.message == 'Authorization failed!'){
      window.location = './login.html';
    }
    
    autocomplete(document.getElementById("bedNo"), bedNo);
    autocomplete(document.getElementById("serviceName"), serviceName);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Adds an event listener to the "serviceName" element that listens for changes to the value.
 * When the value changes, the function retrieves the corresponding rate from the "serviceRates" object
 * and sets the value of the "rate" element to that rate.
 * @returns None
 */
document.getElementById("serviceName").addEventListener("change", ()=>{
  let service = document.getElementById("serviceName").value;
  
  for (const key in serviceRates) {
    if (Object.hasOwnProperty.call(serviceRates, key)) {
      const element = serviceRates[key];
      if (service == key) {
        document.getElementById("rate").value = element;
      }
    }
  }
})