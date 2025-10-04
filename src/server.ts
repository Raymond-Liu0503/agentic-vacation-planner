import { routeAgentRequest, type Schedule } from "agents";

import { getSchedulePrompt } from "agents/schedule";

import { AIChatAgent } from "agents/ai-chat-agent";
import {
  generateId,
  streamText,
  type StreamTextOnFinishCallback,
  stepCountIs,
  createUIMessageStream,
  convertToModelMessages,
  createUIMessageStreamResponse,
  type ToolSet
} from "ai";
import { openai } from "@ai-sdk/openai";
import { processToolCalls, cleanupMessages } from "./utils";
import { tools, executions } from "./tools";
import { hotelTools } from "./workers/hotel-worker";
import { flightTools } from "./workers/flight-worker";
import { activitiesTools } from "./workers/activities-worker";
import { getMCPConfig } from "./mcp-config";
// import { env } from "cloudflare:workers";

const model = openai("gpt-4o-2024-11-20");
// Cloudflare AI Gateway
// const openai = createOpenAI({
//   apiKey: env.OPENAI_API_KEY,
//   baseURL: env.GATEWAY_BASE_URL,
// });

/**
 * Vacation Planning Agent implementation that coordinates between specialized workers
 */
export class Chat extends AIChatAgent<Env> {
  /**
   * Handles incoming chat messages and manages the response stream
   */
  async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    _options?: { abortSignal?: AbortSignal }
  ) {
    // Connect to Browserbase MCP server for web scraping
    let mcpConnection = null;
    try {
      const mcpConfig = getMCPConfig('production');
      mcpConnection = await this.mcp.connect(mcpConfig.server.url);
      console.log("✅ Connected to Browserbase MCP server");
    } catch (error) {
      console.warn("⚠️ MCP connection failed, using mock data:", error);
      // Continue with mock data if MCP connection fails
    }

    // Pass MCP connection info to tools for enhanced functionality
    const mcpAvailable = mcpConnection !== null;

    // Collect all tools from specialized workers and MCP
    const allTools = {
      ...tools,
      ...hotelTools,
      ...flightTools,
      ...activitiesTools,
      ...this.mcp.getAITools()
    };

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        // Clean up incomplete tool calls to prevent API errors
        const cleanedMessages = cleanupMessages(this.messages);

        // Process any pending tool calls from previous messages
        // This handles human-in-the-loop confirmations for tools
        const processedMessages = await processToolCalls({
          messages: cleanedMessages,
          dataStream: writer,
          tools: allTools,
          executions
        });

        const result = streamText({
          system: `You are a specialized vacation planning agent that helps users plan their trips by coordinating between three specialized workers:

1. **Hotel Worker**: Searches for and finds hotels using web scraping via Browserbase MCP
2. **Flight Worker**: Searches for and finds flights using web scraping via Browserbase MCP  
3. **Activities Worker**: Searches for and finds things to do and attractions using web scraping via Browserbase MCP

Your role is to:
- Understand the user's vacation requirements (destination, dates, budget, preferences)
- Coordinate searches across all three workers to find the best options
- Present comprehensive vacation plans with hotels, flights, and activities
- Help users compare options and make decisions
- Provide detailed information about each recommendation

When a user asks about vacation planning:
1. First gather their requirements (destination, dates, budget, group size, interests)
2. Use the appropriate worker tools to search for options
3. Present a comprehensive plan with multiple options
4. Help them refine their choices based on their preferences

${getSchedulePrompt({ date: new Date() })}

If the user asks to schedule a task, use the schedule tool to schedule the task.
`,

          messages: convertToModelMessages(processedMessages),
          model,
          tools: allTools,
          // Type boundary: streamText expects specific tool types, but base class uses ToolSet
          // This is safe because our tools satisfy ToolSet interface (verified by 'satisfies' in tools.ts)
          onFinish: onFinish as unknown as StreamTextOnFinishCallback<
            typeof allTools
          >,
          stopWhen: stepCountIs(10)
        });

        writer.merge(result.toUIMessageStream());
      }
    });

    return createUIMessageStreamResponse({ stream });
  }
  async executeTask(description: string, _task: Schedule<string>) {
    await this.saveMessages([
      ...this.messages,
      {
        id: generateId(),
        role: "user",
        parts: [
          {
            type: "text",
            text: `Running scheduled task: ${description}`
          }
        ],
        metadata: {
          createdAt: new Date()
        }
      }
    ]);
  }
}

/**
 * Worker entry point that routes incoming requests to the appropriate handler
 */
export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/check-open-ai-key") {
      const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
      return Response.json({
        success: hasOpenAIKey
      });
    }
    if (!process.env.OPENAI_API_KEY) {
      console.error(
        "OPENAI_API_KEY is not set, don't forget to set it locally in .dev.vars, and use `wrangler secret bulk .dev.vars` to upload it to production"
      );
    }
    return (
      // Route the request to our agent or return 404 if not found
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  }
} satisfies ExportedHandler<Env>;
