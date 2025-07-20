import { config } from './init';
import { context, trace } from '@opentelemetry/api';

export async function tracedEvent(params,handler, errorHandler, useMainSpan = true) {
    let span = null;
    if(useMainSpan) {
        span = config.mainSpan
    }else{
        span = config.initTracer.startSpan(`tracedEvent-${config.appName}`);
    }
    const tracedContext = trace.setSpan(context.active(), span);
    await context.with(tracedContext, async () => {
         const traceInfo = {
                traceId: span.spanContext().traceId,
                spanId: span.spanContext().spanId
            };
       try {
            await handler?.({params,traceInfo});
        }catch (error) {
            const errorWithSpan = {error,traceInfo};
            if(errorHandler) {
            await context.with(tracedContext, async () => {
                await errorHandler?.(errorWithSpan);
            });
            }else{
                console.warn("Add errorHandler to tracedEvent to handle errors", errorWithSpan);
            }
        } finally {
            span.end();
        }
    });
}
        