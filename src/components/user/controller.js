import User from "./model.js"

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

export { login, signUp }