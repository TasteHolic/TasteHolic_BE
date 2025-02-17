import { bestTasteList } from "../repositories/besttaste.repository.js";

export const getBestTaste = async(req,res,next) => {
    return await bestTasteList();
  }