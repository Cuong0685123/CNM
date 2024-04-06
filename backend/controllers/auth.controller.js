import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from '../utils/generateToken.js';
export const signup = async (req, res)=> {
    try{
        const {fullName, username, password,confirmPassword,gender } = req.body;
if(password !== confirmPassword){
    return res.status(400).json({error:"Mat Khau khong khop"})
}


const user = await User.findOne({username});
if(user){
    return res.status(400).json({error:"Ten dang nhap da ton tai"})
}

const salt = await bcryptjs.genSalt(10);
const hashedPassword = await bcryptjs.hash(password, salt);

const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

const newUser = new User({
    fullName,
    username,
    password: hashedPassword,
    gender,
    profilePic: gender === "male" ? boyProfilePic : girlProfilePic
});
if(newUser){
await generateTokenAndSetCookie(newUser._id,res);
await newUser.save();
res.status(210).json({
    _id:newUser._id,
    fullName: newUser.fullName,
    username: newUser.username,
    profilePic: newUser.profilePic,
});
}else{
    res.status(400).json({error: "Khong co user"});
}
    }catch(error){
        console.log(`loi khong the dang ki`,error.message);
        res.status(500).json({error:"loi "});

    }
};

export const login = async (req, res)=> {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcryptjs.compare(password, user.password || "");

        if(!user || !isPasswordCorrect){
return res.status(400).json({error:"sai ten dang nhap hoac mat khau"});
        }
        generateTokenAndSetCookie(user._id, res);
res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    profilePic: user.profilePic,
});
    } catch (error) {
        console.log(`loi khong the dang nhap`,error.message);
        res.status(500).json({error:"loi "});
    }
};

export const logout = async (req, res)=> {
    try {
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message:"dang xuat thanh cong"});
    } catch (error) {
        console.log("loi dang xuat",error.message);
        res.status(500).json({error:"loi "});
    }
};