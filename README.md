accessToken, refreshTokenの作り方
terminal開く→node→require("crypto").randomBytes(64).toString("hex")


const ROLES_LIST = {
  "Admin":5150,
  "Editor":1984,
  "User":2001,
}
Username:Daichi Password:Aa$12345 roles:[2001, 5150]
Username:Takahiro Password:Bb$12345 roles:[2001]
Username:David Password:Cc$12345 roles:[2001]
Username:John Password:Dd$12345 roles:[2001]
Username:Stefanie Password:Ee$12345 roles:[2001]

