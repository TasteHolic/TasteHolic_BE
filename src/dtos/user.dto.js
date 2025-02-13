import Joi from "joi";

export const bodyToUserRegister = (body) => {
  const date = new Date().toISOString();

  return {
    email: body.email,
    password: body.password,
    passwordConfirm: body.passwordConfirm, // ✅ 비밀번호 확인 필드 추가
    nickname: body.nickname,
    termsAgreement: body.termsAgreement,   // ✅ 필수 약관 동의 추가
    privacyAgreement: body.privacyAgreement,
    ageAgreement: body.ageAgreement,
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

// ✅ 회원가입 검증 스키마 수정
export const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    passwordConfirm: Joi.string().valid(Joi.ref("password")).required() // ✅ 비밀번호 확인 추가
      .messages({ "any.only": "비밀번호가 일치하지 않습니다." }),
    nickname: Joi.string().required(),
    termsAgreement: Joi.boolean().valid(true).required()   // ✅ 필수 약관 동의 추가
      .messages({ "any.only": "이용 약관에 동의해야 합니다." }),
    privacyAgreement: Joi.boolean().valid(true).required()
      .messages({ "any.only": "개인정보 처리 방침에 동의해야 합니다." }),
    ageAgreement: Joi.boolean().valid(true).required()
      .messages({ "any.only": "만 19세 이상임을 동의해야 합니다." }),
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
