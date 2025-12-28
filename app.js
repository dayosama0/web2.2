const form = document.getElementById("form");
const cityInput = document.getElementById("city");

const statusEl = document.getElementById("status");
const card = document.getElementById("card");

const cityTitle = document.getElementById("cityTitle");
const tempEl = document.getElementById("temp");
const feelsEl = document.getElementById("feels");
const descEl = document.getElementById("desc");
const windEl = document.getElementById("wind");
const countryEl = document.getElementById("country");
const coordsEl = document.getElementById("coords");
const rainEl = document.getElementById("rain");
const rawJsonEl = document.getElementById("rawJson");

const flagImg = document.getElementById("flag");
const countryStatus2 = document.getElementById("countryStatus");
const cName = document.getElementById("cName");
const cCapital = document.getElementById("cCapital");
const cRegion = document.getElementById("cRegion");
const cPop = document.getElementById("cPop");
const cCur = document.getElementById("cCur");


function setStatus(msg) {
  statusEl.textContent = msg;
}

function showCard(show) {
  card.classList.toggle("hidden", !show);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    setStatus("Please enter a city name.");
    showCard(false);
    return;
  }

  setStatus("Loading...");
  showCard(false);

  try {
    const resp = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const json = await resp.json();

    if (!resp.ok || !json.ok) {
      setStatus(json.error || "Request failed.");
      return;
    }

    const d = json.data;

    cityTitle.textContent = `Results for: ${city}`;
    tempEl.textContent = `${d.temperature} °C`;
    feelsEl.textContent = `${d.feels_like} °C`;
    descEl.textContent = d.description;
    windEl.textContent = `${d.wind_speed} m/s`;
    countryEl.textContent = d.country_code;
    coordsEl.textContent = `lat ${d.coordinates.lat}, lon ${d.coordinates.lon}`;
    rainEl.textContent = `${d.rain_3h} mm`;

    rawJsonEl.textContent = JSON.stringify(json, null, 2);

    setStatus("Done ✅");
    showCard(true);
    // --- Extra API call: country info (server-side) ---
  countryStatus2.textContent = "Loading country info...";
  flagImg.classList.add("hidden");

  try {
    const code = d.country_code;
    const resp2 = await fetch(`/api/country?code=${encodeURIComponent(code)}`);
    const json2 = await resp2.json();

    if (!resp2.ok || !json2.ok) {
      countryStatus2.textContent = json2.error || "Country info failed.";
    } else {
      const c = json2.data;

      cName.textContent = c.name ?? "—";
      cCapital.textContent = c.capital ?? "—";
      cRegion.textContent = c.region ?? "—";
      cPop.textContent = c.population ? c.population.toLocaleString() : "—";

      const curText =
        c.currency_code && c.currency_name
          ? `${c.currency_code} (${c.currency_name})`
          : (c.currency_code || "—");
      cCur.textContent = curText;

      if (c.flag_png) {
        flagImg.src = c.flag_png;
        flagImg.classList.remove("hidden");
      }

      countryStatus2.textContent = "Done ✅";
    }
  } 
  catch (e) {
    console.error(e);
    countryStatus2.textContent = "Country info error.";
  }
  } 
  catch (err) {
    console.error(err);
    setStatus("Network/server error. Try again.");
  }
});
