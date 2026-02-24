const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "tm_auksion",
    password: "12345",
    port: 5432
});

router.post("/register", async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: "Telefon we parol hökmany!" });
    }

    if (!phone.startsWith("65") && !phone.startsWith("71")) {
        return res.status(400).json({ message: "Diňe TMCell nomer kabul edilýär!" });
    }

    try {
        const checkUser = await pool.query(
            "SELECT * FROM users WHERE phone = $1",
            [phone]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: "Bu nomer eýýäm ulanylan!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (phone, password, crystals) VALUES ($1, $2, $3) RETURNING id, phone, crystals",
            [phone, hashedPassword, 500]
        );

        const token = jwt.sign(
            { id: newUser.rows[0].id },
            "SECRET_KEY",
            { expiresIn: "7d" }
        );

        res.json({
            message: "Registrasiýa üstünlikli!",
            user: newUser.rows[0],
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Serverde ýalňyşlyk!" });
    }
});

module.exports = router;
