import { initTracer } from './init';
import { context, trace } from '@opentelemetry/api';

export async function tracedEvent(eventName, handler) {
    const tracer = initTracer;
    const span = tracer.startSpan(eventName);
    const tracedContext = trace.setSpan(context.active(), span);
    context.with(tracedContext, async () => {
       try {
            await handler?.();
        } finally {
            span.end();
        }
    });
}
        