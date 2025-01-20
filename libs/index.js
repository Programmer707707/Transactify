import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

export const hashPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const comparePassword = async(userPassword, password)=>{
    try{
        const isMatch = await bcrypt.compare(userPassword, password);
        return isMatch;
    }
    catch(err){
        console.log(err)
    }
}

export const generateToken = (id) =>{
    return JWT.sign(
        {
            userId: id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );
}