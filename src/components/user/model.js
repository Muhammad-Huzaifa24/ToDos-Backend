import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OTPGenerator } from "../../utils/otpGenerator.js"

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        profilePicture: {
            type: String,
            default: ""
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        isOtpVerified: {

        }
    },
    { timestamps: true }
);

// Add methods to schema
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Generate and hash password reset token using bcrypt
userSchema.methods.generateOtp = async function () {
    const otp = OTPGenerator();
    const salt = await bcrypt.genSalt(10);
    this.resetPasswordToken = await bcrypt.hash(otp, salt);

    // Set expiration time (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return otp;
};

// Verify OTP using bcrypt
userSchema.methods.verifyResetToken = async function (enteredOtp) {
    const isMatch = bcrypt.compare(enteredOtp, this.resetPasswordToken);
    if (isMatch) {
        this.isOtpVerified = true; // Mark OTP as verified
        this.resetPasswordToken = undefined; // Clear token after verification
        this.resetPasswordExpire = undefined;
        await this.save({ validateBeforeSave: false });
    }
    return isMatch;
};

const User = mongoose.model("User", userSchema);
export default User;
