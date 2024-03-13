import express from "express" 
import { getUsers, createUser } from "../config/database.js" 
import multer from "multer" 
import { genPassword } from "../utils/passwordUtils.js"

const register = express.Router() 
const upload = multer({storage:multer.memoryStorage()})
register.use(express.json()) 
register.use(express.urlencoded({ extended: true })) 

let page = "login"   

register.get("/register", async (req, res) => {
  const allUsers = await getUsers() 
  page = "register" 
    res.render("./layouts/index.ejs", {
      numberOfIteractions: allUsers.length,
      allUsers: allUsers,
      page: page
    }) 
})

register.post("/register", upload.single('profile_pic'), async (req, res) => {

    const user_name = req.body.user_name
    const email = req.body.email
    const password  = req.body.password
    const hash = await genPassword(password)
    const profile_pic = null
    if(req.file){
       profile_pic = req.file.buffer.toString('base64')
    } 
    const newUser = await createUser({
      user_name,
      email,
      password: hash,
      profile_pic}
    )
    res.redirect(`/users/${newUser.user_id}/edit`) 
  }) 

export default register 