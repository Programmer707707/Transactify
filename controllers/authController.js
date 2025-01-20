import {pool} from '../libs/database.js';
import {hashPassword, comparePassword, generateToken} from '../libs/index.js';

export const signUpUser = async (req, res) => {
    try {
        const { firstName, email, password } = req.body;
        if (!firstName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const userExist = await pool.query({
            text: 'SELECT EXISTS (SELECT 1 FROM tbluser WHERE email=$1)',
            values: [email],
        });

        if (userExist.rows[0].exists) {  // Fix: `userExist.rows[0].userExists` should be `userExist.rows[0].exists`
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);  // Ensure async hash
        const newUser = await pool.query(
            'INSERT INTO tbluser (firstName, email, password) VALUES($1, $2, $3) RETURNING *',
            [firstName, email, hashedPassword]
        );

        newUser.rows[0].password = undefined;  // Fix: Use `newUser` here instead of `user`

        res.status(201).json({
            status: "success",
            message: "User account created successfully",
            user: newUser.rows[0],
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const signInUser = async (req,res)=>{
    try{
        const {email, password} = req.body;

        const result = await pool.query({
            text: 'SELECT * FROM tbluser WHERE email=$1',
            values: [email]
        });

        const user = result.rows[0]

        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        const isMatch = await comparePassword(password, user?.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = await generateToken(user.id);

        user.password = undefined;

        res.status(200).json({
            status: "success",
            message: "User signed in successfully",
            token,
            user
        });
    }catch(e){
        console.log(e)
    }
}

// export const signInUser = async (req,res)=>{
//     try{
        
//     }catch(e){
//         console.log(e)
//     }
// }