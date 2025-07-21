import { trace } from "@opentelemetry/api";
import { config } from "./init";

const apiUrl = "http://localhost:5000/v1/logs";

function getTraceInfo() {
    const span = trace.getActiveSpan();
    const traceInfo = {
        "trace_id": span?.spanContext()?.traceId || `default-${config.appName}-trace`,
        spanId: span?.spanContext()?.spanId || `default-${config.appName}-span`
    };
    return traceInfo
}

const normalizeMetadata = (metadata) => {
    if (typeof metadata === "object" && !Array.isArray(metadata)) {
        return Object.entries(metadata).reduce((acc, [key, value]) => {
            acc[key] = typeof value === "string" ? value : JSON.stringify(value);
            return acc;
        }, {});
    }
    return metadata;
}

function sendLog(level, message, metadata = {}) {
    const logEntry = {
        level,
        message,
        ...getTraceInfo(),
        timestamp: new Date().toISOString(),
        metadata: normalizeMetadata(metadata),
        source: "browser",
        appName: config.appName
    };

    if (config.pushForLogLevel.includes(level)) {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", 'x-api-key': config.apiKey },
            body: JSON.stringify(logEntry),
        }).catch((err) => {
        });
    }else{
        console.warn(`Log level ${level} is not configured for pushing.`, logEntry);
    }
}

export const log = {
    info: (message, metadata) => sendLog("info", message, metadata),
    debug: (message, metadata) => sendLog("debug", message, metadata),
    error: (message, metadata) => sendLog("error", message, metadata),
    warn: (message, metadata) => sendLog("warn", message, metadata),
};