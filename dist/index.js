"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const userController_1 = require("./controllers/userController");
const chatController_1 = require("./controllers/chatController");
const auth_1 = require("./middleware/auth");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((error) => {
    console.error("Error during Data Source initialization:", error);
});
app.post("/api/register", userController_1.register);
app.post("/api/login", userController_1.login);
app.post("/api/chats", auth_1.authenticateToken, chatController_1.saveChat);
app.get("/api/chats", auth_1.authenticateToken, chatController_1.getChats);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map