export interface SwaggerModel {
    swagger?: string;
    info?: { description: string; version: string; title: string };
    host?: string;
    basePath?: string;
    tags?: Array<{ name: string; description: string }>;
    schemes?: string[];
    securityDefinitions?: Record<string, { type: string; name: string; in: string; description?: string }>;
    paths?: Record<string, object>;
}
