import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { trace } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';

const provider = new WebTracerProvider();

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
    initTracer: null,
}

export function init({appName, apiKey}) {
    config.apiKey = apiKey;
    config.appName = appName;
    config.initTracer = trace.getTracer(appName);
}

