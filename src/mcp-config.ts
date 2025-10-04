/**
 * MCP Configuration for Vacation Planning Agent
 * Configures Browserbase MCP server for web scraping
 */

export const BROWSERBASE_MCP_CONFIG = {
  // Browserbase MCP Server Configuration
  // Based on: https://mcpservers.org/servers/browserbase/mcp-server-browserbase
  server: {
    // Use the remote hosted URL for better performance
    url: "https://server.smithery.ai/@browserbasehq/mcp-browserbase/mcp", // Replace with your Smithery URL
    
    // Alternative: Use NPM package directly
    command: "npx",
    args: ["@browserbasehq/mcp-server-browserbase"],
    
    // Environment variables for Browserbase (loaded from .dev.vars)
    env: {
      BROWSERBASE_API_KEY: process.env.BROWSERBASE_API_KEY || "",
      BROWSERBASE_PROJECT_ID: process.env.BROWSERBASE_PROJECT_ID || "",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || ""
    }
  },
  
  // Browser configuration
  browser: {
    width: 1920,
    height: 1080,
    stealth: true, // Enable advanced stealth mode
    proxies: false, // Enable if needed for your use case
    keepAlive: true // Keep sessions alive for better performance
  },
  
  // Model configuration
  model: {
    name: "google/gemini-2.0-flash", // Default model
    apiKey: "" // Only needed for custom models
  }
};

/**
 * MCP Server URLs for different environments
 */
export const MCP_ENVIRONMENTS = {
  development: {
    browserbase: "http://localhost:3001/sse", // Local MCP server
    fallback: "npx @browserbasehq/mcp-server-browserbase"
  },
  production: {
    browserbase: "https://server.smithery.ai/@browserbasehq/mcp-browserbase/mcp", // Your Smithery URL
    fallback: "npx @browserbasehq/mcp-server-browserbase"
  }
};

/**
 * Website targets for each worker
 */
export const SCRAPING_TARGETS = {
  hotels: [
    "https://www.booking.com",
    "https://www.expedia.com/hotels",
    "https://www.hotels.com",
    "https://www.agoda.com"
  ],
  flights: [
    "https://www.google.com/flights",
    "https://www.kayak.com/flights",
    "https://www.expedia.com/flights",
    "https://www.skyscanner.com"
  ],
  activities: [
    "https://www.viator.com",
    "https://www.getyourguide.com",
    "https://www.tripadvisor.com/Attractions",
    "https://www.airbnb.com/experiences"
  ]
};

/**
 * Helper function to get MCP configuration based on environment
 */
export function getMCPConfig(environment: 'development' | 'production' = 'development') {
  return {
    ...BROWSERBASE_MCP_CONFIG,
    server: {
      ...BROWSERBASE_MCP_CONFIG.server,
      url: MCP_ENVIRONMENTS[environment].browserbase
    }
  };
}
