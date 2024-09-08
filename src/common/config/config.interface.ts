export interface Config {
  throttler: ThrottlerConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  nest: NestConfig;
  helmet: HelmetConfig;
  compression: CompressionConfig;
}

export interface CompressionConfig {
  enabled: boolean;
}

export interface HelmetConfig {
  enabled: boolean;
}

export interface NestConfig {
  port: number;
}

export interface ThrottlerConfig {
  ttl: number;
  limit: number;
}

export interface CorsConfig {
  enabled: boolean;
  origin?: string | string[]; // Specifies allowed origins, could be a string or an array of strings
  methods?: string | string[]; // Specifies allowed methods
  preflightContinue?: boolean; // Indicates if the preflight request should pass to the next handler
  optionsSuccessStatus?: number; // Status code to return for successful OPTIONS requests
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}
