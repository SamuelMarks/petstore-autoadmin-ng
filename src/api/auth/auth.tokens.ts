import { InjectionToken } from "@angular/core";

/** Injection token for the API key */
export const API_KEY_TOKEN = new InjectionToken<string>('API_KEY');
/** Injection token for the Bearer token (can be a string or a function that returns a string) */
export const BEARER_TOKEN_TOKEN = new InjectionToken<string | (() => string)>('BEARER_TOKEN');
