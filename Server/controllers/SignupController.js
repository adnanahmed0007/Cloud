import UserDetaildatabse from "../models/Usermodel.js";
import generateToken from "../util/Generatetoken.js";
import bcrypt from "bcrypt"
const SignupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (name && email && password) {
            const find = await UserDetaildatabse.findOne({ email });
            if (find) {
                return res
                    .status(409)
                    .json({
                        message: "user already regsiter"
                    })
            }
            const hashedPassword = await bcrypt.hash(password, 5);
            const user = new UserDetaildatabse({
                name: name,
                email: email,
                password: hashedPassword,

            })
            await user.save();
            const token = generateToken(user);

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });

        }
        else {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

    }
    catch (e) {
        console.log(e);
    }
}
export default SignupController;