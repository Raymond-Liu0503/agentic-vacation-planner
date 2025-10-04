# MCP Setup Guide for Vacation Planning Agent

This guide will help you set up the Browserbase MCP server to enable real web scraping for hotels, flights, and activities.

## Current Status

The vacation planning agent is currently running with **mock data** for demonstration purposes. To enable real web scraping, you need to set up the Browserbase MCP server.

## Step 1: Get Browserbase Credentials

1. **Sign up at Browserbase**:
   - Go to [browserbase.com](https://browserbase.com)
   - Create an account
   - Create a new project

2. **Get your credentials**:
   - API Key: `bb_live_...` (you already have this)
   - Project ID: `76090e59-b76e-47dc-bbd1-5de8084acbc2` (you already have this)

## Step 2: Set up Smithery (Recommended)

The easiest way to use Browserbase MCP is through Smithery's hosted service:

1. **Go to Smithery**:
   - Visit [smithery.ai](https://smithery.ai)
   - Sign up for an account

2. **Configure your MCP server**:
   - Enter your Browserbase API key and project ID
   - Get your hosted MCP URL (looks like `https://your-smithery-url.com`)

3. **Update your configuration**:
   - Replace the MCP URL in `src/mcp-config.ts`
   - Uncomment the MCP connection code in `src/server.ts`

## Step 3: Alternative - Local MCP Server

If you prefer to run the MCP server locally:

1. **Install the MCP server**:

   ```bash
   npm install -g @browserbasehq/mcp-server-browserbase
   ```

2. **Run the server**:

   ```bash
   npx @browserbasehq/mcp-server-browserbase \
     --browserWidth 1920 \
     --browserHeight 1080 \
     --proxies \
     --advancedStealth
   ```

3. **Update configuration** to use local server

## Step 4: Enable MCP in Your Agent

Once you have your MCP server running:

1. **Update `src/server.ts`**:

   ```typescript
   // Uncomment these lines:
   const mcpConnection = await this.mcp.connect(
     "https://your-smithery-url.com" // or local URL
   );
   ```

2. **Update worker files**:
   - Uncomment MCP connection code in each worker
   - Replace mock data with real web scraping

3. **Test the connection**:
   ```bash
   npm start
   ```

## Step 5: Test Real Web Scraping

Once MCP is connected, test with:

```
User: "Find me hotels in Paris for March 15-20, 2024"

Agent: [Will now scrape real data from Booking.com, Expedia, etc.]
```

## Troubleshooting

### Common Issues

1. **MCP Connection Failed**:
   - Check your Browserbase API key and project ID
   - Verify the MCP server URL is correct
   - Ensure your Browserbase project is active

2. **No Search Results**:
   - Check if the MCP server is running
   - Verify network connectivity
   - Check Browserbase usage limits

3. **Rate Limiting**:
   - Browserbase has usage limits on free tier
   - Consider upgrading for higher limits

### Debug Mode

Enable debug logging:

```bash
DEBUG=vacation-agent:* npm start
```

## Current Mock Data

Until MCP is set up, the agent uses realistic mock data:

- **Hotels**: 2-3 sample hotels with prices, ratings, amenities
- **Flights**: 2-3 sample flights with airlines, times, prices
- **Activities**: 2-3 sample activities with descriptions, prices

This allows you to test the agent's coordination and planning capabilities without needing the MCP server.

## Next Steps

1. **Set up MCP server** using the steps above
2. **Test with real data** to see live scraping in action
3. **Customize scraping targets** in `src/mcp-config.ts`
4. **Add more booking sites** as needed

The agent is fully functional with mock data, so you can start using it immediately while setting up the MCP server in the background.
