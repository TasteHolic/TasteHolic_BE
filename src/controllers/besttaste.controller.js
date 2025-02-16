import { StatusCodes } from "http-status-codes";
import { getBestTaste } from "../services/besttaste.service.js";

export const handleGetBestTaste = async (req,res,next) => {
    try {
        const cocktails = await getBestTaste();
        res.status(StatusCodes.OK).success(cocktails);
      } catch (error) {
        console.error("오류 발생:", error.message);
        return res.status(500).json({ error: "서버 오류" });
      }
}
