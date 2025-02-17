import { profileChange, profileGet } from "../services/profile.service.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const handleProfileChange = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const imageUrl = req.file ? req.file.location : null;
    
    const updateData = { ...req.body };
    
    if (!imageUrl && !req.body.imageUrl) {
      delete updateData.imageUrl; 
    }

    if (!updateData.nickname) {
      delete updateData.nickname; 
    }

    if (!updateData.message) {
      delete updateData.message; 
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
    } else {
      delete updateData.password;
    }

    const profile = await profileChange(updateData, userId, imageUrl);
    res.status(StatusCodes.OK).success(profile);
  } catch (err) {
    next(err);
  }
};


export const handleUserInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await profileGet(userId); 
    res.status(StatusCodes.OK).success(profile);
  } catch (err) {
    next(err);
  }
};