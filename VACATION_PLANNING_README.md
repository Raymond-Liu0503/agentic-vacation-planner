# Vacation Planning Agent

A specialized AI agent that helps users plan complete vacations by coordinating between three specialized workers: hotels, flights, and activities. The agent uses the [Browserbase MCP server](https://mcpservers.org/servers/browserbase/mcp-server-browserbase) for web scraping to find real-time data from booking sites.

## Architecture

### Main Agent (Chat)

- **Role**: Coordinates between specialized workers
- **Responsibilities**:
  - Understands user requirements
  - Orchestrates searches across all workers
  - Presents comprehensive vacation plans
  - Helps users make decisions

### Specialized Workers

#### 1. Hotel Worker (`src/workers/hotel-worker.ts`)

- **Purpose**: Find and book hotels
- **Data Sources**: Booking.com, Expedia, Hotels.com, Agoda
- **Capabilities**:
  - Search hotels by destination, dates, budget
  - Filter by amenities and preferences
  - Get real-time pricing and availability
  - Provide booking links

#### 2. Flight Worker (`src/workers/flight-worker.ts`)

- **Purpose**: Find and book flights
- **Data Sources**: Google Flights, Kayak, Expedia, Skyscanner
- **Capabilities**:
  - Search flights by origin, destination, dates
  - Filter by price, stops, airline, class
  - Compare multiple options
  - Provide booking links

#### 3. Activities Worker (`src/workers/activities-worker.ts`)

- **Purpose**: Find things to do and attractions
- **Data Sources**: Viator, GetYourGuide, TripAdvisor, Airbnb Experiences
- **Capabilities**:
  - Search activities by interests and location
  - Filter by price, duration, age groups
  - Get reviews and ratings
  - Provide booking links

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- Cloudflare account
- Browserbase account (for web scraping)
- OpenAI API key

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Update `.dev.vars` with your API keys:

```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# Browserbase Configuration (required for web scraping)
BROWSERBASE_API_KEY=your_browserbase_api_key_here
BROWSERBASE_PROJECT_ID=your_browserbase_project_id_here

# Optional: Gemini API key for better performance
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Get Browserbase Credentials

1. Sign up at [browserbase.com](https://browserbase.com)
2. Create a new project
3. Get your API key and project ID
4. Add them to `.dev.vars`

### 5. Deploy to Cloudflare

```bash
# Deploy to production
npm run deploy

# Or run locally
npm start
```

## Usage Examples

### Basic Vacation Planning

```
User: "I want to plan a trip to Paris from March 15-20, 2024. I'm traveling with my spouse, budget is $3000 total, and we're interested in culture and food."

Agent: I'll help you plan your Paris vacation! Let me search for flights, hotels, and activities that match your preferences and budget.

[Agent coordinates searches across all three workers and presents comprehensive options]
```

### Specific Searches

```
User: "Find me hotels in Tokyo under $200/night with a pool"

Agent: [Uses hotel worker to search and present options]

User: "What flights are available from LAX to Tokyo on December 1st?"

Agent: [Uses flight worker to search and present options]

User: "What cultural activities can I do in Tokyo?"

Agent: [Uses activities worker to search and present options]
```

## Features

### Web Scraping with Browserbase MCP

- **Real-time Data**: Gets current prices and availability
- **Multiple Sources**: Searches across major booking sites
- **Screenshots**: Captures booking pages for verification
- **Stealth Mode**: Avoids detection by booking sites

### Intelligent Coordination

- **Budget Optimization**: Balances costs across hotels, flights, and activities
- **Preference Matching**: Matches user interests to available options
- **Conflict Resolution**: Ensures dates and locations align
- **Recommendation Engine**: Suggests complementary activities

### User Experience

- **Natural Language**: Understands complex vacation requirements
- **Interactive Planning**: Asks clarifying questions when needed
- **Visual Results**: Presents options with images and details
- **Booking Integration**: Provides direct links to book

## Configuration

### MCP Server Setup

The agent uses the Browserbase MCP server for web scraping. Configuration is in `src/mcp-config.ts`:

```typescript
export const BROWSERBASE_MCP_CONFIG = {
  server: {
    url: "https://your-smithery-url.com", // Your Smithery URL
    env: {
      BROWSERBASE_API_KEY: "",
      BROWSERBASE_PROJECT_ID: "",
      GEMINI_API_KEY: ""
    }
  },
  browser: {
    width: 1920,
    height: 1080,
    stealth: true,
    keepAlive: true
  }
};
```

### Worker Configuration

Each worker can be configured independently in their respective files:

- `src/workers/hotel-worker.ts`
- `src/workers/flight-worker.ts`
- `src/workers/activities-worker.ts`

## Development

### Adding New Data Sources

1. Update `SCRAPING_TARGETS` in `src/mcp-config.ts`
2. Modify the worker's `performSearch` method
3. Update the data extraction logic

### Adding New Workers

1. Create new worker class extending `AIChatAgent`
2. Add tools for the worker
3. Update `wrangler.jsonc` with new Durable Object
4. Import and use in main server

### Testing

```bash
# Run tests
npm test

# Run with specific environment
NODE_ENV=development npm start
```

## Troubleshooting

### Common Issues

1. **MCP Connection Failed**
   - Check Browserbase API keys
   - Verify network connectivity
   - Check MCP server URL

2. **No Search Results**
   - Verify destination names are correct
   - Check date formats (YYYY-MM-DD)
   - Ensure budget ranges are reasonable

3. **Rate Limiting**
   - Browserbase handles rate limiting automatically
   - Consider upgrading plan for higher limits

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=vacation-agent:*
```

## API Reference

### Main Tools

- `planVacation`: Comprehensive vacation planning
- `searchHotels`: Hotel search and booking
- `searchFlights`: Flight search and booking
- `searchActivities`: Activity search and booking

### Worker Tools

Each worker exposes specific tools for their domain:

- Hotel: `searchHotels`, `getHotelDetails`, `checkAvailability`
- Flight: `searchFlights`, `getFlightDetails`, `checkFlightAvailability`
- Activities: `searchActivities`, `getActivityDetails`, `checkActivityAvailability`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:

- Check the [Browserbase MCP documentation](https://mcpservers.org/servers/browserbase/mcp-server-browserbase)
- Review Cloudflare Workers documentation
- Open an issue in this repository
