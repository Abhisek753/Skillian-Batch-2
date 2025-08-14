const User =require("../models/User")

exports.getUsers=async ()=>{
    return await User.find();
}

exports.addUserSocket = async (userData) => {
    try {
        const user = new User(userData); // no await here
        await user.save();
        return user;
    } catch (err) {
        console.error("Error saving user:", err);
        throw err;
    }
}
