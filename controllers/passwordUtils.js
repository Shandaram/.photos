import bcrypt from "bcrypt";

async function genPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

function validPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export { validPassword, genPassword };
