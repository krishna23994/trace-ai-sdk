import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { trace } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';

const provider = new WebTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

provider.register({
    propagator: new W3CTraceContextPropagator(),
})

registerInstrumentations({
    instrumentations:[
        new FetchInstrumentation({
            propagateTraceHeaderCorsUrls: /.*/,
        }),
        new XMLHttpRequestInstrumentation({
            propagateTraceHeaderCorsUrls: /.*/,
        })
    ]
})

export const config = {
    apiKey: '',
    appName: '',
}

export const initTracer = null;

export function init({appName, apiKey}) {
    config.apiKey = apiKey;
    config.appName = appName;
    initTracer = trace.getTracer(appName);
}

