import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from "../config/config.js";


export async function registerController(req, res) {
    
    const { email,password, fullname:{ firstname, lastname},  role = "user" } = req.body;

    const isUserAlreadyExist = await UserModel.findOne({ email });

    if (isUserAlreadyExist) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await new UserModel({
        email,
        password: hash,
        fullname: {
            firstname,
            lastname
        },
        role
    });
    await user.save();

   const token = jwt.sign({
        id: user._id,
        role: user.role,
        fullname: user.fullname
    }, config.JWT_SECRET, { expiresIn: '2d' });

    res.cookie('token', token)

    res.status(201).json({
    message: "user register succesfully",
    user: {
      email: user.email,
      _id: user._id,
      fullname: user.fullname,
    },
  });
}

export async function loginController(req, res) {

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({
        id: user._id,
        role: user.role,
        fullname: user.fullname
    }, config.JWT_SECRET, { expiresIn: '2d' });
    
    res.cookie("token", token );

    res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
        }
    })
}

export async function googleAuthCallback(req, res) {
        const user = req.user;

        const isUserAlreadyExists = await UserModel.findOne({
            $or:[
                {email: user.emails[0].value},
                {googleId: user.id}
            ],
            if(isUserAlreadyExists){
            const token = jwt.sign({
                id: isUserAlreadyExists._id,
                role: isUserAlreadyExists.role,
                fullname: isUserAlreadyExists.fullname
            }, config.JWT_SECRET, { expiresIn: '2d' });

            res.cookie("token", token);

            return res.status(200).json({
                message: "Google authentication successful",
                user: {
                    id: isUserAlreadyExists._id,
                    email: isUserAlreadyExists.email,
                    fullname: isUserAlreadyExists.fullname,
                    role: isUserAlreadyExists.role
                }
            })
            }
        });

        const newUser = await UserModel.create({
            googleId: user.id,
            email: user.emails[0].value,
            fullname:{
                firstname: user.name.givenName,
                lastname: user.name.familyName,
            }
        })

        const token =jwt.sign({
            id: newUser._id,
            role: newUser.role,
        }, config.JWT_SECRET)

        res.cookie("token", token);

        res.status(201).json({
            message: "Google authentication successful",
            user: {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                role: newUser.role
            }
        })

}
