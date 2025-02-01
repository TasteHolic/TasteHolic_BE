import { StatusCodes } from "http-status-codes";
import { bodyToBar } from "../dtos/mybar.dto.js";
import { myBarPost, myBarGet, myBarDelete } from "../services/mybar.service.js";


export const handleMyBarPost = async (req, res, next) => {
    console.log("마이바 추가를 요청했습니다!");
    console.log("body:", req.body); 
  
    try {
      const bar = await myBarPost(bodyToBar(req.body));
      res.status(StatusCodes.OK).success(bar);
    } catch (err) {
      next(err);  // 에러가 발생하면 next로 넘겨서 에러 미들웨어로 전달
    }
  };

export const handleMyBarGet = async (req, res) => {
    console.log("마이바 조회를 요청했습니다!");
  
    const bar = await myBarGet();
    res.status(StatusCodes.OK).success(bar);
};

export const handleMyBarDelete = async (req, res, next) => {
    console.log("마이바 삭제를 요청했습니다!");

    try {
        const bar = await myBarDelete(
            parseInt(req.params.barId));
        res.status(StatusCodes.OK).success(bar);
      } catch (err) {
        next(err);  // 에러가 발생하면 next로 넘겨서 에러 미들웨어로 전달
    }
};