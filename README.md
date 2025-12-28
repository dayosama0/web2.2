# web2.2
# Weather & Location App

This project is a backend-focused web application that retrieves and displays real-time weather data using external APIs.  
All third-party API communication is handled strictly on the server side to ensure security and clean architecture.

Features
- Server-side weather data fetching (OpenWeather API)
- Additional server-side API integration (Country information)
- Clean and responsive user interface
- Secure handling of API keys using environment variables

Technologies Used
- Node.js
- Express.js
- HTML5, CSS3, JavaScript
- OpenWeather API (Weather data)
- RestCountries API (Country information)

Setup Instructions
1. Clone the repository
git clone <https://github.com/dayosama0/web2.2.git>
cd weather-app

2. Install dependencies
npm install

3. Create environment variables
Create a .env file in the root of the project:
OPENWEATHER_API_KEY=ae4ae605e1771aba8418db25ddeeb24a
PORT=3000

4. Run the application
npm run dev
or
node server.js

5. Open in browser
arduino
http://localhost:3000

API Usage Details
Weather API (Server-side)
Endpoint:
GET /api/weather?city=CityName
Returned data:

temperature
description
coordinates (latitude, longitude)
feels-like temperature
wind speed
country code
rain volume for the last 3 hours
The server fetches data from OpenWeather API, processes it, and returns a clean JSON response.

Additional API: Country Information (Server-side)
Endpoint:
GET /api/country?code=COUNTRY_CODE
Returned data:
country name
capital
region
population
currency
flag

This API is implemented using the RestCountries service and does not require an API key.

Key Design Decisions
Server-side API calls only
All external API requests are made on the backend to protect API keys and follow best practices.

Processed JSON responses
The server does not expose raw third-party API responses. Data is filtered and structured before being sent to the frontend.

Responsive design
The UI adapts to different screen sizes using CSS Grid and media queries.

Modular architecture
Clear separation between backend logic and frontend presentation.

Weather data displayed for a selected city
Country information section
API response from /api/weather endpoint

Conclusion
This project demonstrates proper backend architecture, secure API integration, and clean frontend display while following industry best practices for modern web applications.
