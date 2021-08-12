"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const hash_1 = __importDefault(require("../../utils/hash"));
const updatePassword = async (req, res) => {
    const { userId } = req.userInfo;
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
        return res.status(400).send({ message: "Insufficient parameters supplied" });
    }
    if (newPassword === "") {
        // 비밀번호 유효성 검사 필요
        return res.status(400).send({ message: "Invalid format" });
    }
    try {
        const hashedPassword = hash_1.default(password);
        const userInfo = await User_1.User.findOne(userId);
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }
        //* 이메일 가입 or 통합 유저 (기존 비밀번호 존재)
        if (userInfo.signUpType === "email" || userInfo.signUpType === "intergration") {
            if (userInfo.password !== hashedPassword) {
                return res.status(404).json({ message: "Incorrect password" });
            }
            const hashedNewPassword = hash_1.default(newPassword);
            userInfo.password = hashedNewPassword;
            await userInfo.save();
        }
        //* 소셜 로그인으로 가입하고 아직 비빌번호를 바꾸지 않은 유저
        else {
            const hashedNewPassword = hash_1.default(newPassword);
            userInfo.password = hashedNewPassword;
            userInfo.signUpType = "intergration";
            // 비밀번호 변경 시 일반 로그인 사용 가능
            await userInfo.save();
        }
        return res.status(201).json({ message: "Update password succeed" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Update password failed" });
    }
};
exports.default = updatePassword;
//# sourceMappingURL=updatePassword.js.map