import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_KEY_TOKEN, BEARER_TOKEN_TOKEN } from "./auth.tokens";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    readonly apiKey = inject(API_KEY_TOKEN, { optional: true });
    readonly bearerToken = inject(BEARER_TOKEN_TOKEN, { optional: true });

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req; if (this.apiKey) {
            authReq = authReq.clone({ setHeaders: { 'api_key': this.apiKey } });
        } else if (this.bearerToken) {
            const token = typeof this.bearerToken === 'function' ? this.bearerToken() : this.bearerToken;
            authReq = authReq.clone({ setHeaders: { 'Authorization': `Bearer ${token}` } });
        }

        return next.handle(authReq);
    }
}
