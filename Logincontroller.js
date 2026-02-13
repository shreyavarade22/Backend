const Loginmodal = require('./Loginmodel');
const Signupmodal = require('./signupmodel');

// ================= LOGIN USER =================
const loginuser = async (req, res) => {
    try {
        console.log("=".repeat(50));
        console.log("🔐 LOGIN REQUEST RECEIVED");
        console.log("=".repeat(50));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("-".repeat(50));

        const { username, password, role } = req.body;

        // Validate required fields
        if (!username || !password) {
            console.log("❌ Missing credentials");
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        // First check if user exists in signup collection
        console.log("🔍 Checking signup database...");
        const signupUser = await Signupmodal.findOne({ username });

        if (!signupUser) {
            console.log("❌ User not found in signup database");
            return res.status(401).json({
                success: false,
                message: "Account not found. Please sign up first."
            });
        }

        // Verify password
        if (signupUser.password !== password) {
            console.log("❌ Invalid password for user:", username);
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Verify role
        if (role && signupUser.role !== role) {
            console.log(`❌ Role mismatch. Expected: ${role}, Found: ${signupUser.role}`);
            return res.status(403).json({
                success: false,
                message: `You don't have access as ${role}`
            });
        }

        // Check if login record exists
        let loginRecord = await Loginmodal.findOne({ userId: signupUser._id });

        if (loginRecord) {
            // Update existing login record
            loginRecord.lastLogin = new Date();
            await loginRecord.save();
            console.log("✅ Updated existing login record");
        } else {
            // Create new login record
            loginRecord = new Loginmodal({
                username: signupUser.username,
                password: signupUser.password,
                role: signupUser.role,
                userId: signupUser._id,
                lastLogin: new Date()
            });
            await loginRecord.save();
            console.log("✅ Created new login record");
        }

        // Generate simple token (in production, use JWT)
        const token = Buffer.from(`${signupUser._id}:${signupUser.username}:${Date.now()}`).toString('base64');

        // Remove sensitive data
        const userData = {
            _id: signupUser._id,
            fullName: signupUser.fullName,
            email: signupUser.email,
            username: signupUser.username,
            mobileNumber: signupUser.mobileNumber,
            role: signupUser.role
        };

        console.log("✅ Login successful for:", username);
        console.log("🆔 User ID:", signupUser._id);
        console.log("👤 Role:", signupUser.role);
        console.log("⏰ Last Login:", new Date().toLocaleString());
        console.log("=".repeat(50));

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userData
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ================= VERIFY TOKEN =================
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // Decode token
        const decoded = Buffer.from(token, 'base64').toString('ascii');
        const [userId, username] = decoded.split(':');

        const user = await Signupmodal.findById(userId);

        if (!user || user.username !== username) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        res.status(200).json({
            success: true,
            valid: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("❌ Token verification error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ================= LOGOUT USER =================
const logoutuser = async (req, res) => {
    try {
        console.log("🚪 Logout request received");
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("❌ Logout error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ================= GET ALL LOGINS =================
const getalllogins = async (req, res) => {
    try {
        console.log("📋 Fetching all login records...");
        const data = await Loginmodal.find()
            .populate('userId', 'fullName email mobileNumber')
            .select('-password');

        console.log(`✅ Found ${data.length} login records`);
        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        console.error("❌ Error getting login records:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ================= DELETE LOGIN RECORD =================
const deletelogin = async (req, res) => {
    try {
        console.log("🗑️ Deleting login record ID:", req.params._id);
        const data = await Loginmodal.deleteOne({ _id: req.params._id });

        if (data.deletedCount > 0) {
            console.log("✅ Login record deleted successfully");
            res.status(200).json({
                success: true,
                message: "Login record deleted successfully"
            });
        } else {
            console.log("❌ Login record not found");
            res.status(404).json({
                success: false,
                message: "Login record not found"
            });
        }
    } catch (error) {
        console.error("❌ Error deleting login record:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    loginuser,
    logoutuser,
    verifyToken,
    getalllogins,
    deletelogin
};