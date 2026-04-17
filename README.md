# Weather App

A modern, responsive weather application built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- Real-time weather data from OpenWeather API
- 5-day forecast with hourly breakdowns
- Search by city name or use geolocation
- Responsive design (mobile-first)
- Dark mode support
- Type-safe API responses
- Server-side data fetching with caching

## Setup Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

**Getting an API Key:**
1. Sign up at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
2. Navigate to [API Keys](https://home.openweathermap.org/api_keys)
3. Generate a new API key (free tier: 1000 calls/day)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Main weather page
├── components/
│   ├── empty-state.tsx      # Empty state UI
│   ├── error-message.tsx    # Error display
│   ├── forecast-grid.tsx    # 5-day forecast cards
│   ├── search-bar.tsx       # Search with geolocation
│   ├── weather-card.tsx     # Current weather display
│   └── weather-icon.tsx     # Weather icon component
├── lib/
│   ├── api.ts               # OpenWeather API functions
│   ├── utils.ts             # Utility functions
│   └── weather-service.ts   # Data processing layer
├── types/
│   └── weather.ts           # TypeScript interfaces
├── env.example              # Environment variable template
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json             # Dependencies
```

## Architecture Decisions

### Server vs Client Components
- **Server Components**: Data fetching (`lib/api.ts`, `lib/weather-service.ts`), main page content
- **Client Components**: Search bar (uses browser geolocation, React state), error messages (no data needed)

### Data Fetching
- All API calls use server-side fetching with Next.js 15 `fetch` caching
- Cache duration: 5 minutes for weather data, 24 hours for geocoding
- Proper error handling with typed error responses

### Styling
- Tailwind CSS v4 with utility-first approach
- Responsive breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Dark mode support via `dark:` modifiers
- Consistent spacing with `p-4`, `gap-4`, `max-w-screen-xl`

### Type Safety
- All API responses defined in `types/weather.ts`
- No `any` types used
- Strict TypeScript configuration

## API Reference

### `lib/api.ts`

```typescript
// Get weather by city name
getWeatherByCity(city: string): Promise<CurrentWeatherResponse>

// Get weather by coordinates
getWeatherByCoords(lat: number, lon: number): Promise<CurrentWeatherResponse>

// Get 5-day forecast by city
getForecastByCity(city: string): Promise<ForecastResponse>

// Get 5-day forecast by coordinates
getForecastByCoords(lat: number, lon: number): Promise<ForecastResponse>

// Geocode city name to coordinates
geocodeCity(city: string): Promise<GeocodingResult[]>
```

### `lib/weather-service.ts`

```typescript
// Fetch and process weather data
fetchWeatherByCity(city: string): Promise<{ current, forecast }>
fetchWeatherByCoords(lat: number, lon: number): Promise<{ current, forecast }>
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |

## License

MIT License - feel free to use for personal or commercial projects.
