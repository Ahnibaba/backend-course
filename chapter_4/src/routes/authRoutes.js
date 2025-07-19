import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import prisma from "../prismaClient.js"



// console.log(crypto.randomBytes(64).toString("hex"));



const router = express.Router()

// Register a new user endpoint /auth/register
router.post("/register", async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "Both fields are required" })
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if (existingUser) {
        return res.status(400).json({ message: "User already exist" })
    }
    

    // encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // save the new user and hashed password to the db
    try {
          const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
          })
         //  now that we have a user, I want to add their first todo for them
         const defaultTodo = `Hello :) Add your first todo!`
         await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
         })
        
        // create a token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )
        res.json({ token })

    } catch (error) {
        console.log("Error in the register function: ", error);
        res.status(500).json({ message: "Server Error" })

    }

})

router.post("/login", async (req, res) => {
   const { username, password } = req.body

   try {
     const user = await prisma.user.findUnique({
        where: {
            username: username
        }
     })
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