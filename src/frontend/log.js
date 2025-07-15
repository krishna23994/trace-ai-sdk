import { trace } from "@opentelemetry/api";
import { config } from "./init";

const apiUrl = "https://api.example.com/logs";

function getTraceInfo() {
    const span = trace.getActiveSpan();
    const traceInfo = {
        traceId: span?.spanContext()?.traceId || `default-${config.appName}-trace`,
        spanId: span?.spanContext()?.spanId || `default-${config.appName}-span`
    };
    return traceInfo
}

function sendLog(level, message, metadata = {}) {
    const logEntry = {
        level,
        message,
        ...getTraceInfo(),
        timestamp: new Date().toISOString(),
        metadata,
        source: "browser",
        appName: config.appName
    };

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-api-key': config.apiKey },
        body: JSON.stringify(logEntry),
    }).catch((err) => {
    });
}

export const log = {
    info: (message, metadata) => sendLog("info", message, metadata),
    debug: (message, metadata) => sendLog("debug", message, metadata),
    error: (message, metadata) => sendLog("error", message, metadata),
    warn: (message, metadata) => sendLog("warn", message, metadata),
};