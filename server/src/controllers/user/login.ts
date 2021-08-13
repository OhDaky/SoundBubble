import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { UserToken } from "../../entity/UserToken";
import { checkEmail, checkPassword } from "../../utils/validate";
import { generateAccessToken, generateRefreshToken } from "../token/index";
import hash from "../../utils/hash";

const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    //* 파라미터 검사
    if (!email || !checkEmail(email)) {
      return res.status(400).json({ message: `Invalid email(body), input 'email': ${email}` });
    }
    if (!password || !checkPassword(password)) {
      return res.status(400).json({ message: `Invalid password(body)` });
    }

    //* 유저 조회
    const hashedPassword: string = hash(password);

    const userInfo: User | undefined = await User.findUserByEmail(email, hashedPassword);

    if (!userInfo || (userInfo.signUpType !== "email" && userInfo.signUpType !== "intergration")) {
      // 계정 정보가 없거나, 소셜 로그인으로 가입하고 비밀번호 설정을 안한 유저는 기존 로그인 사용 불가
      return res.status(401).json({ message: "Not authorized" });
    }

    //* 토큰 발급
    const accessToken: string = generateAccessToken(userInfo);
    const refreshToken: string = generateRefreshToken(userInfo);

    //* DB에 리프레시 토큰 저장
    await UserToken.insertToken(userInfo.id, refreshToken);

    return res.status(201).json({ data: { accessToken, userInfo }, message: "Login succeed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to login" });
  }
};

export default login;
