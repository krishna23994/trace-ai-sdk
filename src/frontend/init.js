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
    mainSpan: null,
    pushForLogLevel: ['info', 'debug', 'error', 'warn'],
}

export function init({appName, apiKey, pushForLogLevel}) {
    config.apiKey = apiKey;
    config.appName = appName;
    config.pushForLogLevel = pushForLogLevel || config.pushForLogLevel;
    if(!config.initTracer){
    const initTracer = trace.getTracer(appName);
    config.initTracer = initTracer;
    config.mainSpan = initTracer.startSpan(appName);
    }
}
   

