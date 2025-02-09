import { StatusCodes } from "http-status-codes";
import { bodyToBar } from "../dtos/mybar.dto.js";
import {
  myBarPost,
  myBarGet,
  myBarDelete,
  myBarSearch,
} from "../services/mybar.service.js";
import { authenticateUser } from "./user.controller.js";

export const handleMyBarPost = async (req, res, next) => {
  console.log("마이바 추가를 요청했습니다!");
  console.log("body:", req.body);

  try {
    const user = authenticateUser(req);

    const bar = await myBarPost(bodyToBar(req.body, user.id));
    res.status(StatusCodes.OK).success(bar);
  } catch (err) {
    next(err); // 에러가 발생하면 next로 넘겨서 에러 미들웨어로 전달
  }
};

export const handleMyBarGet = async (req, res, next) => {
  try {
    const user = authenticateUser(req);

    const bar = await myBarGet(user.id); // repository에서 user.id로 조회
    res.status(StatusCodes.OK).json({ success: bar });
  } catch (err) {
    next(err);
  }
};

export const handleMyBarDelete = async (req, res, next) => {
  console.log("마이바 삭제를 요청했습니다!");

  try {
    const user = authenticateUser(req);

    const bar = await myBarDelete(parseInt(req.params.barId));
    res.status(StatusCodes.OK).success(bar);
  } catch (err) {
    next(err); // 에러가 발생하면 next로 넘겨서 에러 미들웨어로 전달
  }
};

export const handleMyBarSearch = async (req, res, next) => {
  console.log("마이바에 있는 술 레시피 검색을 요청했습니다!");

  try {
    const user = authenticateUser(req);

    const bar = await myBarSearch(user.id); // repository에서 user.id로 조회
    res.status(StatusCodes.OK).json({ success: bar });
  } catch (err) {
    next(err); // 에러가 발생하면 next로 넘겨서 에러 미들웨어로 전달
  }
};
