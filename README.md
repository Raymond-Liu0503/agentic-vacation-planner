# 🏖️ Vacation Planning Agent

![npm i agents command](./npm-agents-banner.svg)

<a href="https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/agents-starter"><img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare"/></a>

An AI-powered vacation planning agent that coordinates between three specialized workers to help users plan complete trips. Built with Cloudflare's Agent platform and powered by [`agents`](https://www.npmjs.com/package/agents), this agent searches for hotels, flights, and activities using real-time web scraping via Browserbase MCP.

## ✨ Features

- 🏨 **Hotel Search**: Real-time hotel search from Booking.com, Expedia, Hotels.com
- ✈️ **Flight Search**: Live flight data from Google Flights, Kayak, Expedia
- 🎯 **Activity Discovery**: Find attractions and activities from Viator, GetYourGuide, TripAdvisor
- 💰 **Budget Filtering**: All results respect your budget constraints
- 🔄 **Smart Coordination**: Main agent orchestrates all three workers
- 🌐 **Real Web Scraping**: Uses Browserbase MCP for live data from booking sites
- 📱 **Modern UI**: Responsive chat interface with dark/light theme
- ⚡️ **Real-time Streaming**: Live responses as the agent searches
- 🛠️ **Tool Integration**: Human-in-the-loop confirmation for important actions

## 🚀 Quick Start

### Prerequisites

- **Cloudflare account** - [Sign up here](https://dash.cloudflare.com/sign-up)
- **OpenAI API key** - [Get one here](https://platform.openai.com/api-keys)
- **Browserbase account** (optional) - [Sign up here](https://browserbase.com) for real web scraping

### Option 1: Deploy to Cloudflare (Recommended)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/agents-starter)

1. Click the deploy button above
2. Connect your GitHub account
3. Set your environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `BROWSERBASE_API_KEY`: (Optional) Your Browserbase API key
   - `BROWSERBASE_PROJECT_ID`: (Optional) Your Browserbase project ID
4. Deploy and start planning vacations!

### Option 2: Run Locally

1. **Clone and install**:

   ```bash
   git clone <your-repo-url>
   cd cloudflare-agentic
   npm install
   ```

2. **Set up environment**:
   Create a `.dev.vars` file:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here

   # Optional: For real web scraping
   BROWSERBASE_API_KEY=your_browserbase_api_key
   BROWSERBASE_PROJECT_ID=your_browserbase_project_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run locally**:

   ```bash
   npm start
   ```

   Open [http://localhost:5174](http://localhost:5174) in your browser

4. **Deploy to production**:
   ```bash
   npm run deploy
   ```

## 🎯 How to Use

### Basic Vacation Planning

Simply ask the agent to plan your trip:

```
Plan a trip to Paris from March 15-20, 2024. I'm traveling with my spouse, budget is $3000 total, and we're interested in culture and food.
```

### Specific Searches

Ask for specific components:

```
Find me hotels in Tokyo under $200/night with a pool
```

```
What flights are available from LAX to Tokyo on December 1st?
```

```
What cultural activities can I do in Tokyo?
```

### Budget-Aware Planning

The agent respects your budget constraints:

```
Plan a budget trip to Barcelona for 4 days, maximum $500 total
```

## 🏗️ Architecture

### Three Specialized Workers

1. **🏨 Hotel Worker** (`src/workers/hotel-worker.ts`)
   - Searches Booking.com, Expedia, Hotels.com, Agoda
   - Filters by price, amenities, location
   - Returns booking links and ratings

2. **✈️ Flight Worker** (`src/workers/flight-worker.ts`)
   - Searches Google Flights, Kayak, Expedia, Skyscanner
   - Filters by price, stops, airline, class
   - Returns flight times and booking links

3. **🎯 Activities Worker** (`src/workers/activities-worker.ts`)
   - Searches Viator, GetYourGuide, TripAdvisor, Airbnb Experiences
   - Filters by interests, price, duration
   - Returns activity details and booking links

### Main Agent Coordination

The main agent (`src/server.ts`) orchestrates all three workers:

- Understands user requirements
- Coordinates searches across workers
- Presents comprehensive vacation plans
- Handles budget optimization

## 🔧 Configuration

### Environment Variables

| Variable                 | Required | Description                            |
| ------------------------ | -------- | -------------------------------------- |
| `OPENAI_API_KEY`         | ✅       | Your OpenAI API key for AI responses   |
| `BROWSERBASE_API_KEY`    | ❌       | For real web scraping (optional)       |
| `BROWSERBASE_PROJECT_ID` | ❌       | Your Browserbase project ID (optional) |
| `GEMINI_API_KEY`         | ❌       | For enhanced performance (optional)    |

### MCP Configuration

The agent uses Browserbase MCP for real web scraping. Configuration is in `src/mcp-config.ts`:

```typescript
export const BROWSERBASE_MCP_CONFIG = {
  server: {
    url: "https://server.smithery.ai/@browserbasehq/mcp-browserbase/mcp",
    env: {
      BROWSERBASE_API_KEY: process.env.BROWSERBASE_API_KEY,
      BROWSERBASE_PROJECT_ID: process.env.BROWSERBASE_PROJECT_ID,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY
    }
  }
};
```

## 📁 Project Structure

```
├── src/
│   ├── app.tsx                    # React chat UI
│   ├── server.ts                  # Main vacation planning agent
│   ├── tools.ts                   # Tool definitions and vacation planning
│   ├── mcp-config.ts              # Browserbase MCP configuration
│   ├── utils.ts                   # Helper functions
│   ├── styles.css                 # UI styling
│   └── workers/                   # Specialized workers
│       ├── hotel-worker.ts        # Hotel search and booking
│       ├── flight-worker.ts       # Flight search and booking
│       └── activities-worker.ts   # Activities and attractions
├── .dev.vars                      # Environment variables
├── wrangler.jsonc                 # Cloudflare Workers configuration
├── VACATION_PLANNING_README.md    # Detailed setup guide
├── MCP_SETUP_GUIDE.md            # MCP configuration guide
└── prompts.md                     # Development prompts used
```

## 🧪 Testing the Agent

### Local Testing

1. **Start the development server**:

   ```bash
   npm start
   ```

2. **Open your browser** to [http://localhost:5174](http://localhost:5174)

3. **Try these example queries**:

   **Complete vacation planning**:

   ```
   Plan a trip to Toronto from Ottawa, October 20-23, 2025. Budget is $1000 total, interested in culture and food.
   ```

   **Hotel search only**:

   ```
   Find me hotels in Paris under $300/night with a spa
   ```

   **Flight search only**:

   ```
   What flights are available from New York to London on December 15th?
   ```

   **Activities search only**:

   ```
   What outdoor activities can I do in Vancouver?
   ```

### Deployed Testing

If you've deployed to Cloudflare:

1. **Visit your deployed URL** (provided after deployment)
2. **Test the same queries** as above
3. **Check the console** for detailed logging of worker coordination

### Expected Behavior

- **With MCP**: Real web scraping from booking sites
- **Without MCP**: Enhanced mock data with realistic delays
- **All cases**: Budget filtering and comprehensive results

## 🔍 Debugging

### Console Logs

The agent provides detailed logging:

```
🔍 Searching hotels with params: {...}
✅ Hotel search completed, found 3 hotels
🔍 Searching flights with params: {...}
✅ Flight search completed, found 3 flights
🔍 Searching activities with params: {...}
✅ Activities search completed, found 4 activities
```

### Common Issues

1. **"Technical issues" error**: Usually MCP connection problems - check Browserbase credentials
2. **No results**: Check budget constraints - they might be too restrictive
3. **Slow responses**: Normal with real web scraping - mock data is faster

### MCP Troubleshooting

If you want real web scraping:

1. **Get Browserbase credentials** from [browserbase.com](https://browserbase.com)
2. **Set up Smithery** at [smithery.ai](https://smithery.ai) for hosted MCP
3. **Update `.dev.vars`** with your credentials
4. **Restart the server** to pick up new environment variables

## 🛠️ Customization Guide

### Adding New Workers

Create a new worker in `src/workers/`:

```typescript
// src/workers/restaurant-worker.ts
import { tool, type ToolSet } from "ai";
import { z } from "zod/v3";

export class RestaurantWorker {
  async searchRestaurants(
    params: RestaurantSearchParams
  ): Promise<RestaurantResult[]> {
    // Your search logic here
  }
}

export const searchRestaurantsTool = tool({
  description: "Search for restaurants in a destination",
  inputSchema: z.object({
    destination: z.string(),
    cuisine: z.string().optional(),
    budget: z.object({ min: z.number(), max: z.number() }).optional()
  }),
  execute: async (params) => {
    const worker = new RestaurantWorker();
    const results = await worker.searchRestaurants(params);
    return { success: true, restaurants: results };
  }
});

export const restaurantTools = {
  searchRestaurants: searchRestaurantsTool
} satisfies ToolSet;
```

Then add to `src/server.ts`:

```typescript
import { restaurantTools } from "./workers/restaurant-worker";

const allTools = {
  ...tools,
  ...hotelTools,
  ...flightTools,
  ...activitiesTools,
  ...restaurantTools, // Add your new worker
  ...this.mcp.getAITools()
};
```

### Adding New Tools

Add tools in `src/tools.ts`:

```typescript
// Auto-executing tool
const getWeather = tool({
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string(),
    units: z.enum(["celsius", "fahrenheit"]).optional()
  }),
  execute: async ({ location, units = "celsius" }) => {
    // Your weather API call here
    return `Weather in ${location}: 22°${units === "celsius" ? "C" : "F"}`;
  }
});

// Confirmation-required tool
const bookHotel = tool({
  description: "Book a hotel room",
  inputSchema: z.object({
    hotelId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    guests: z.number()
  })
  // No execute function = requires confirmation
});

// Add to executions object
export const executions = {
  bookHotel: async ({ hotelId, checkIn, checkOut, guests }) => {
    // Your booking logic here
    return `Hotel ${hotelId} booked for ${checkIn} to ${checkOut}`;
  }
};
```

### Modifying the UI

Customize the chat interface in `src/app.tsx`:

- **Theme colors**: Edit `src/styles.css`
- **Message rendering**: Modify the message components
- **Tool confirmations**: Update the confirmation dialogs
- **New controls**: Add buttons or inputs to the header

### Using Different AI Models

The agent uses OpenAI by default, but you can switch to other providers:

#### Cloudflare Workers AI

1. **Install the provider**:

   ```bash
   npm install workers-ai-provider
   ```

2. **Add AI binding** to `wrangler.jsonc`:

   ```jsonc
   {
     "ai": {
       "binding": "AI"
     }
   }
   ```

3. **Update server.ts**:

   ```typescript
   import { createWorkersAI } from "workers-ai-provider";

   const workersai = createWorkersAI({ binding: env.AI });
   const model = workersai("@cf/deepseek-ai/deepseek-r1-distill-qwen-32b");
   ```

#### Anthropic Claude

1. **Install the provider**:

   ```bash
   npm install @ai-sdk/anthropic
   ```

2. **Update server.ts**:

   ```typescript
   import { anthropic } from "@ai-sdk/anthropic";

   const model = anthropic("claude-3-5-sonnet-20241022");
   ```

## 🎯 Example Use Cases

### 1. **Travel Agency Assistant**

- Complete vacation planning with hotels, flights, and activities
- Budget optimization and price comparison
- Real-time availability checking
- Booking confirmations and modifications

### 2. **Event Planning Assistant**

- Venue search and booking
- Catering and entertainment options
- Guest accommodation recommendations
- Transportation and logistics

### 3. **Business Travel Coordinator**

- Corporate hotel and flight booking
- Meeting room reservations
- Expense tracking and reporting
- Travel policy compliance

### 4. **Adventure Travel Specialist**

- Outdoor activity recommendations
- Equipment rental and guides
- Safety and weather considerations
- Group booking coordination

### 5. **Luxury Travel Concierge**

- High-end hotel and resort selection
- Private transportation and tours
- Exclusive experiences and dining
- Personalized itinerary creation

## 📚 Additional Resources

- **[Cloudflare Agents Documentation](https://developers.cloudflare.com/agents/)**
- **[Browserbase MCP Documentation](https://mcpservers.org/servers/browserbase/mcp-server-browserbase)**
- **[AI SDK Documentation](https://sdk.vercel.ai/docs/introduction)**
- **[Smithery MCP Hosting](https://smithery.ai)**

## 🚀 Deployment Options

### Cloudflare Workers (Recommended)

- **One-click deploy**: Use the deploy button above
- **Custom domain**: Add your own domain in Cloudflare dashboard
- **Global edge**: Fast responses worldwide
- **Automatic scaling**: Handles traffic spikes automatically

### Other Platforms

- **Vercel**: Deploy as a serverless function
- **Netlify**: Use Netlify Functions
- **Railway**: Deploy with persistent storage
- **Render**: Full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cloudflare** for the amazing Workers platform
- **Browserbase** for web scraping capabilities
- **Smithery** for MCP hosting
- **OpenAI** for AI capabilities
- **Vercel AI SDK** for the excellent AI integration

---

**Happy vacation planning! 🏖️✈️🏨**
