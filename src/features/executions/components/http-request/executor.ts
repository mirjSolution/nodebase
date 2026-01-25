import type { NodeExecutor } from "@/features/executions/types";
import { da } from "date-fns/locale";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  const result = await step.run("http_request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contextType = response.headers.get("content-type");
    const responseData = contextType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusTest: response.statusText,
        data: responseData,
      },
    };
  });
  return result;
};
