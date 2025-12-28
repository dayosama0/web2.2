const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

if (!OPENWEATHER_API_KEY) {
  console.warn("WARNING: OPENWEATHER_API_KEY is missing in .env");
}

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

/**
 * GET /api/weather?city=Astana
 * Server-side fetch to OpenWeather and returns only required fields.
 */
app.get("/api/weather", async (req, res) => {
  try {
    const city = (req.query.city || "").trim();

    if (!city) {
      return res.status(400).json({
        ok: false,
        error: "City is required. Example: /api/weather?city=Astana",
      });
    }

    // Using OpenWeather "Current Weather Data" endpoint
    const url =
      "https://api.openweathermap.org/data/2.5/weather" +
      `?q=${encodeURIComponent(city)}` +
      `&appid=${encodeURIComponent(OPENWEATHER_API_KEY)}` +
      "&units=metric";

    const resp = await fetch(url);

    // OpenWeather often returns JSON error with code/message
    const data = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({
        ok: false,
        error: data?.message || "OpenWeather request failed",
      });
    }

    // Map OpenWeather response -> required fields
    const result = {
      temperature: data?.main?.temp ?? null,
      description: data?.weather?.[0]?.description ?? null,
      coordinates: {
        lat: data?.coord?.lat ?? null,
        lon: data?.coord?.lon ?? null,
      },
      feels_like: data?.main?.feels_like ?? null,
      wind_speed: data?.wind?.speed ?? null,
      country_code: data?.sys?.country ?? null,
      rain_3h: data?.rain?.["3h"] ?? 0, // If no rain in response -> 0
    };

    return res.json({ ok: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      error: "Server error. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// GET /api/country?code=KZ
// Extra API (server-side only): RestCountries (no API key)
app.get("/api/country", async (req, res) => {
  try {
    const code = (req.query.code || "").trim();
    if (!code) {
      return res.status(400).json({ ok: false, error: "Country code is required" });
    }

    const url = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!resp.ok || !Array.isArray(data) || !data[0]) {
      return res.status(502).json({ ok: false, error: "Country API request failed" });
    }

    const c = data[0];

    const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : null;
    const currencyName = currencyCode ? c.currencies[currencyCode]?.name : null;

    return res.json({
      ok: true,
      data: {
        name: c.name?.common ?? null,
        capital: c.capital?.[0] ?? null,
        region: c.region ?? null,
        population: c.population ?? null,
        currency_code: currencyCode,
        currency_name: currencyName,
        flag_png: c.flags?.png ?? null
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error (country)" });
  }
});