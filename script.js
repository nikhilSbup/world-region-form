const countryInput = document.getElementById("country");
const countryList = document.getElementById("countries");
const stateInput = document.getElementById("state");
const stateList = document.getElementById("states");
const cityInput = document.getElementById("city");
const cityList = document.getElementById("cities");

// Fetch all countries
async function loadCountries() {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
  const data = await res.json();
  data.data.forEach(c => {
    const option = document.createElement("option");
    option.value = c.name;
    countryList.appendChild(option);
  });
}
loadCountries();

// Load states when country selected
countryInput.addEventListener("change", async () => {
  stateInput.value = "";
  cityInput.value = "";
  stateList.innerHTML = "";
  cityList.innerHTML = "";
  stateInput.disabled = true;
  cityInput.disabled = true;

  const country = countryInput.value;
  if (!country) return;

  const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ country })
  });
  const data = await res.json();
  if (data.data && data.data.states.length > 0) {
    data.data.states.forEach(s => {
      const option = document.createElement("option");
      option.value = s.name;
      stateList.appendChild(option);
    });
    stateInput.disabled = false;
  }
});

// Load cities when state selected
stateInput.addEventListener("change", async () => {
  cityInput.value = "";
  cityList.innerHTML = "";
  cityInput.disabled = true;

  const country = countryInput.value;
  const state = stateInput.value;
  if (!country || !state) return;

  const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ country, state })
  });
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    data.data.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      cityList.appendChild(option);
    });
    cityInput.disabled = false;
  }
});

// Validate only allowed values
document.getElementById("registrationForm").addEventListener("submit", (e) => {
  const validCountry = [...countryList.options].some(opt => opt.value === countryInput.value);
  const validState = [...stateList.options].some(opt => opt.value === stateInput.value);
  const validCity = [...cityList.options].some(opt => opt.value === cityInput.value);

  if (!validCountry || !validState || !validCity) {
    e.preventDefault();
    alert("Please select valid Country, State, and City from the list!");
  }
});
