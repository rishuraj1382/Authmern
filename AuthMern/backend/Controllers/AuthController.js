const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../Models/User");

exports.signup = async (req, res) => {
    try{
        //get data
        const {name, email, password, role} = req.body;
        // check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            })
        }
        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);

        }
        catch(err) {
            return res.send(500).json({
                success:false,
                message:"Error in hashing Password",
            });
        }

        // create entry for user
        const user = await  User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User Created Succsessfullly",
        });

    }
    catch(error) {
        //
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User Cannot be registered, Please try again later",
        });

    }
}

exports.login = async (req, res) => {
    try {
        //data fetch
        const { email, password } = req.body;

        // check for registered user
        const user = await User.findOne({ email });

         // if not a registered user
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);

        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }

        // verify password and generate
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "User Logged in successfully",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Login Failure",
                success: false
            })
    }
}

