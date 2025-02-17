import { profileChange, profileGet } from "../services/profile.service.js";
import { StatusCodes } from "http-status-codes";


export const handleProfileChange = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const imageUrl = req.file ? req.file.location : null;
    console.log(req.file);
    console.log(req.file.location);

    const profile = await profileChange(req.body, userId, imageUrl); 
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