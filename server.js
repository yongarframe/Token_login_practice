const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const users = [
  {
    user_id: "test",
    user_password: "1234",
    user_name: "테스트 유저",
    user_info: "테스트 유저입니다",
  },
];

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5501", "http://localhost:5501"],
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const secretKey = "ozcodingschool";

// 클라이언트에서 post 요청을 받은 경우
app.post("/", (req, res) => {
  const { userId, userPassword } = req.body;
  const userInfo = users.find(
    (el) => el.user_id === userId && el.user_password === userPassword
  );
  // 유저정보가 없는 경우
  if (!userInfo) {
    res.status(401).send("로그인 실패");
  } else {
    const accessToken = jwt.sign({ userId: userInfo.user_id }, secretKey, {
      expiresIn: 1000 * 60 * 5,
    });
    // console.log(accessToken);
    res.send(accessToken);
    // 1. 유저정보가 있는 경우 accessToken을 발급하는 로직을 작성하세요.(sign)
    // 이곳에 코드를 작성하세요.
    // 2. 응답으로 accessToken을 클라이언트로 전송하세요. (res.send 사용)
    // 이곳에 코드를 작성하세요.
  }
});

// 클라이언트에서 get 요청을 받은 경우
app.get("/", (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const payload = jwt.verify(accessToken, secretKey);

  const userInfo = users.find((el) => el.user_id === payload.userId);
  const { user_id, user_name, user_info } = userInfo;
  return res.json({ user_id, user_name, user_info });
  // 3. req headers에 담겨있는 accessToken을 검증하는 로직을 작성하세요.(verify)
  // 이곳에 코드를 작성하세요.
  // 4. 검증이 완료되면 유저정보를 클라이언트로 전송하세요.(res.send 사용)
  // 이곳에 코드를 작성하세요.
});

app.listen(3000, () => console.log("서버 실행!"));
