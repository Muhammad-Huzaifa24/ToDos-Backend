import User from "./model.js"
import { sendEmail } from "../../utils/sendEmail.js"
import bcrypt from "bcryptjs";


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = user.generateAuthToken(); // Corrected function name
        res.status(200).json({ success: true, user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }
        const userExists = await User.findOne({
            email
        });
        if (userExists) {
            return res.status(400).json({ success: true, message: "User already exists" });
        }
        const user = await User.create({ username, email, password });
        res.status(201).json({ success: true, user, message: "Account created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "email is required" })
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Generate token
    const otp = await user.generateOtp();
    await user.save({ validateBeforeSave: false });

    const message = `Your OTP for password reset is: ${otp}. This code will expire in 10 minutes.`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message,
        });
        res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500).json({ success: false, message: "Email could not be sent" });
    }
}

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordToken || user.resetPasswordExpire < Date.now()) {
        return res.status(400).json({ success: false, message: "Invalid OTP or expired" });
    }

    // Compare OTP
    const isMatch = await user.verifyResetToken(otp);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    res.status(200).json({ success: true, message: "OTP verified successfully" });
}

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure OTP is verified before resetting the password
    if (!user.isOtpVerified) {
        return res.status(400).json({ success: false, message: "OTP verification required" });
    }

    user.password = newPassword;
    user.isOtpVerified = false; // Reset flag after password change
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
}

export { login, signUp, forgotPassword, verifyOTP, resetPassword }