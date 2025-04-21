"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const existingUser = await userRepository.findOne({ where: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = userRepository.create({
            username,
            password: hashedPassword,
            email,
        });
        await userRepository.save(user);
        return res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating user" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userRepository.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || "your_jwt_secret_key", { expiresIn: "24h" });
        return res.json({ token });
    }
    catch (error) {
        return res.status(500).json({ message: "Error logging in" });
    }
};
exports.login = login;
//# sourceMappingURL=userController.js.map