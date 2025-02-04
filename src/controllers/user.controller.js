const { registerUser } = require('../services/user.service');
const { validateRegisterInput } = require('../dtos/user.dto');

// 회원가입 컨트롤러
exports.registerUser = async (req, res) => {
  const { email, password, nickname } = req.body;
  
  // 입력 값 검증
  const validationError = validateRegisterInput(email, password, nickname);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
  
  try {
    const result = await registerUser(email, password, nickname);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

