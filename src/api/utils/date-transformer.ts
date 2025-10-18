import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

export function transformDates(obj: unknown): unknown {

    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => transformDates(item));
    }

    const transformed: { [key: string]: unknown } = {};
    for (const key of Object.keys(obj)) {
        const value = (obj as Record<string, unknown>)[key];
        if (typeof value === 'string' && ISO_DATE_REGEX.test(value)) {
            transformed[key] = new Date(value);
        } else {
            transformed[key] = transformDates(value);
        }
    }
    return transformed;
}

@Injectable()
export class DateInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        return next.handle(req).pipe(
            map(event => {
                if (event instanceof HttpResponse && event.body) {
                    return event.clone({ body: transformDates(event.body) });
                }
                return event;
            })
        );
    }
}
