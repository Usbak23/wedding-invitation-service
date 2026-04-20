"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("../src/app.module");
const swagger_route_1 = require("../src/routes/swagger.route");
const exception_filter_1 = require("../src/middlewares/exception.filter");
const app_logger_1 = require("../src/middlewares/app-logger");
let app;
async function createApp() {
    if (app)
        return app;
    app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new app_logger_1.AppLogger()
    });
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new exception_filter_1.GlobalExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3001',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    });
    (0, swagger_route_1.setupSwagger)(app);
    await app.init();
    return app;
}
async function handler(req, res) {
    const nestApp = await createApp();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    expressApp(req, res);
}
//# sourceMappingURL=index.js.map