const mongoose = require('mongoose');
const User = require('../models/User');


// Get one user by ID
exports.getOneUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .populate({
                path: 'rdv_ids',
                populate: {
                    path: 'client_id artist_id',
                    select: 'name' // Adjust as per your User model or schema for Rdv
                }
            })
            .exec();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const response = {
            email: user.email,
            lastname: user.lastname,
            firstname: user.firstname,
            adresse: user.adresse,
            phoneNumber: user.phoneNumber,
            role: user.role,
            rdvs: user.rdv_ids
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Update a user by ID
exports.updateUserById = async (req, res) => {
    try {
        const updateData = req.body;

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


