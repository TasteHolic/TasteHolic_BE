import Joi from "joi";

export const bodyToUserRegister = (body) => {
  const date = new Date().toISOString();
  
  return {
    email: body.email,
    password: body.password,
    nickname: body.nickname,
    createdAt: date,
    updatedAt: date,
  };
};

export const bodyToUserLogin = (body) => {
  return {
    email: body.email,
    password: body.password,
  };
};

export const responseFromUser = (user) => {
  return {
    data: user,
  };
};

export const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    nickname: Joi.string().required(),
  });
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};