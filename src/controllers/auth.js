import pool from "../../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE phone=$1",
      [phone]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: "Bu telefon öň ulanylan!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (phone, password, crystals) VALUES ($1, $2, $3)",
      [phone, hashed, 500]
    );

    res.json({ msg: "Hasap döredildi!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE phone=$1",
      [phone]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ msg: "Telefon tapylmady!" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) return res.status(400).json({ msg: "Parol ýalňyş!" });

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
