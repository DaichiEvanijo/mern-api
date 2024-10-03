const User = require("../model/User");

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(404).json({ "message": "No users found" });
    const filteredUsers = users.map(user => ({
        _id:user._id,
        username:user.username,
        roles:user.roles
    }))
    res.json(filteredUsers);
}
// oder
// const users = await User.find().select('-password -refreshToken').exec()
//   res.json(users)


const deleteUser = async (req, res) => {
    const {id} = req.params
    if (!id) return res.status(400).json({ "message": "User ID required"});
    const user = await User.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(404).json({ "message": `User ID ${id} not found` });
    }
    const result = await user.deleteOne({ _id: id });
    res.json(result);
}

// const getUser = async (req, res) => {
//     const {id} = req.params
//     if (!id) return res.status(400).json({ "message": "User ID required"});
//     const user = await User.findOne({ _id: id }).select('-password -refreshToken').exec();
//     if (!user) {
//         return res.status(404).json({ "message": `User ID ${id} not found` });
//     }
//     res.json(user);
// }

module.exports = {
    getAllUsers,
    deleteUser,
    // getUser
}