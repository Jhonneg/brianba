import jwt from "jsonwebtoken";
import redis from "redis";

(async () => {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URI,
  });
  redisClient.on("error", console.error);

  await redisClient.connect();

  await redisClient.set("key", "value");
  const value = await redisClient.get("key");

  console.log(value);
})();

const token = jwt.sign({ foo: "bar" }, "shhhhh");

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => user[0])
          .catch((err) => Promise.reject("unable to get user"));
      } else {
        Promise.reject("Wrong credentials");
      }
    })
    .catch((err) => Promise.reject("Wrong credentials"));
};
function getAuthTokenId() {
  console.log("auth ok");
}
function signToken(email) {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT-SECRET", { expiresIn: "2days" });
}
function setToken(key, value) {
  return Promise.resolve(redisClient.set(key, value));
}
function createSessions(user) {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token };
    })
    .catch(console.log);
}
const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId()
    : handleSignin(db, bcrypt, req, res)
        .then((data) =>
          data.id && data.email ? createSessions(data) : Promise.reject(data)
        )
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

export default signinAuthentication;
