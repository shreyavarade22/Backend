const usermodal = require('./signupmodel');

const adduser = async (req, res) => {
    try {
        console.log("=".repeat(50));
        console.log("📝 SIGNUP REQUEST RECEIVED");
        console.log("=".repeat(50));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("-".repeat(50));

        const { fullName, email, username, mobileNumber, password, confirmPassword, role } = req.body;

        // Validate all fields
        const missingFields = [];
        if (!fullName) missingFields.push('fullName');
        if (!email) missingFields.push('email');
        if (!username) missingFields.push('username');
        if (!mobileNumber) missingFields.push('mobileNumber');
        if (!password) missingFields.push('password');
        if (!confirmPassword) missingFields.push('confirmPassword');

        if (missingFields.length > 0) {
            console.log("❌ Missing fields:", missingFields);
            return res.status(400).json({ 
                success: false,
                message: "All fields are required",
                missingFields: missingFields
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            console.log("❌ Passwords do not match");
            return res.status(400).json({ 
                success: false,
                message: "Passwords do not match" 
            });
        }

        // Check for existing user
        console.log("🔍 Checking for existing user...");
        const existingUser = await usermodal.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username },
                { mobileNumber: mobileNumber }
            ]
        });

        if (existingUser) {
            let field = '';
            if (existingUser.email === email.toLowerCase()) field = 'Email';
            else if (existingUser.username === username) field = 'Username';
            else if (existingUser.mobileNumber === mobileNumber) field = 'Mobile number';
            
            console.log(`❌ ${field} already exists:`, existingUser[field.toLowerCase()]);
            return res.status(400).json({ 
                success: false,
                message: `${field} already exists` 
            });
        }

        // Create new user
        console.log("✅ No existing user found. Creating new user...");
        const newUser = new usermodal({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            username: username.trim(),
            mobileNumber: mobileNumber.trim(),
            password: password,
            confirmPassword: confirmPassword,
            role: role || 'Receptionist'
        });

        console.log("💾 Saving to database...");
        const savedUser = await newUser.save();
        
        console.log("=".repeat(50));
        console.log("✅ USER SAVED SUCCESSFULLY!");
        console.log("=".repeat(50));
        console.log("User ID:", savedUser._id);
        console.log("Full Name:", savedUser.fullName);
        console.log("Email:", savedUser.email);
        console.log("Username:", savedUser.username);
        console.log("Mobile:", savedUser.mobileNumber);
        console.log("Role:", savedUser.role);
        console.log("Created At:", savedUser.createdAt);
        console.log("=".repeat(50));
        
        res.status(201).json({ 
            success: true,
            message: "User registered successfully",
            userId: savedUser._id 
        });

    } catch (error) {
        console.error("❌ ERROR SAVING USER:");
        console.error("=".repeat(50));
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            console.error(`Duplicate key error on field: ${field}`);
            return res.status(400).json({ 
                success: false,
                message: `${field} already exists` 
            });
        }
        
        console.error("Full Error:", error);
        console.error("=".repeat(50));
        
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// ================= GET USERS =================
const getuser = async (req, res) => {
    try {
        console.log("📋 FETCHING ALL USERS...");
        const data = await usermodal.find().select('-password -confirmPassword');
        console.log(`✅ Found ${data.length} users in database`);
        
        if (data.length > 0) {
            console.log("📊 Sample User:");
            console.log(JSON.stringify(data[0], null, 2));
        }
        
        res.status(200).json({ 
            success: true,
            count: data.length,
            data 
        });
    } catch (error) {
        console.error("❌ Error getting users:", error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// ================= DELETE USER =================
const deleteuser = async (req, res) => {
    try {
        console.log("🗑️ DELETING USER ID:", req.params._id);
        const data = await usermodal.deleteOne({ _id: req.params._id });

        if (data.deletedCount > 0) {
            console.log("✅ User deleted successfully");
            res.status(200).json({ 
                success: true,
                message: "User Deleted Successfully" 
            });
        } else {
            console.log("❌ User not found");
            res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

module.exports = { adduser, getuser, deleteuser };