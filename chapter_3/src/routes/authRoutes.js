import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../db.js"
import crypto from "crypto"



// console.log(crypto.randomBytes(64).toString("hex"));



const router = express.Router()

// Register a new user endpoint /auth/register
router.post("/register", (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "Both fields are required" })
    }

    // encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // save the new user and hashed password to the db
    try {
        const insertUser = db.prepare(`
     INSERT INTO users (username, password)
     VALUES (?, ?)
  `)
        const result = insertUser.run(username, hashedPassword)

        //  now that we have a user, I want to add their first todo for them
        const defaultTodo = `Hello :) Add your first todo!`
        const insertTodo = db.prepare(`
     INSERT INTO todos (user_id, task)
     VALUES (?, ?)
  `)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        console.log(process.env.JWT_SECRET);
        
        // create a token
        const token = jwt.sign(
            { id: result.lastInsertRowid },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )
        res.json({ token })

    } catch (error) {
        console.log("Error in the register function: ", error);
        res.status(500).json({ message: "Server Error" })

    }

})

router.post("/login", (req, res) => {
   const { username, password } = req.body

   try {
     const getUser = db.prepare(`
        SELECT * FROM users
        WHERE username = ?
    `)
    const user = getUser.get(username)

    if(!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if(!passwordIsValid) {
        return res.status(400).json({ message: "Invalid Credentials" })
    }

    console.log(user);
    

    // then we have a successful authentication
       const token = jwt.sign(
           { id: user.id },
           process.env.JWT_SECRET,
           { expiresIn: "24h" }
       )
       res.json({ token })
   } catch (error) {
        console.log("Error in the login function: ", error);
        res.status(500).json({ message: "Server Error" })

   }
})



export default router