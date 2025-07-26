import { FunctionCall, FunctionResponse } from "@google/genai";
import { z } from "zod";

export type ToolDefinition = {
  name: string;
  description: string;
  schema: z.ZodType<any, any>;
  handler: (args: any) => Promise<any>;
};

// Tool registry
export const toolsMap: Record<string, ToolDefinition> = {};

export function registerTool(tool: ToolDefinition) {
  toolsMap[tool.name] = tool;
}

export function getFunctionDeclarations() {
  return Object.values(toolsMap).map(tool => {
    const jsonSchema = z.toJSONSchema(tool.schema);
    console.log("jsonSchema", jsonSchema);
    return {
      name: tool.name,
      description: tool.description,
      parametersJsonSchema: jsonSchema
    };
  });
}

export const handleFunctionCall = async (functionCalls: FunctionCall[]): Promise<FunctionResponse[]> => {
  const responses: FunctionResponse[] = [];

  for (const functionCall of functionCalls) {
    console.log("functionCall", functionCall);

    const { name, args, id } = functionCall;
    if (!name) continue;

    const tool = toolsMap[name];
    if (!tool) {
      console.warn(`No tool registered for function name: ${name}`);
      continue;
    }

    const schema = tool.schema;
    const parsed = schema.safeParse(args);

    if (!parsed.success) {
      console.error(`Validation failed for ${name}`, parsed.error);
      continue;
    }

    try {
      const result = await tool.handler(parsed.data);
      console.log("tool call", name, result);

      responses.push({
        id,
        name,
        response: result,
      });
    } catch (err) {
      console.error(`Error executing tool ${name}:`, err);
    }
  }

  return responses;
};


registerTool({
  name: "get_weather",
  description: "Returns current weather for a given city",
  schema: z.object({ location: z.string().optional().describe("City name") }),
  handler: async ({ location }) => {
    return { forecast: `It’s sunny in ${location}`, temperature: "32°C" };
  },
});

registerTool({
  name: "calculate_sum",
  description: "Calculates the sum of two numbers",
  schema: z.object({ a: z.number(), b: z.number() }),
  handler: async ({ a, b }) => {
    return { result: a + b };
  },
});
