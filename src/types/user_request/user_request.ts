// 登录请求类型
export interface LoginRequest {
  phone_number: string;
  verification_code: string;
}

// 发送验证码请求类型
export interface SendVerificationCodeRequest {
  phone_number: string;
}

// 登录响应数据类型
export interface LoginResponseData {
  encrypted_user_data: string;
}

//登出请求类型
export interface LogoutRequest {
  token: string;
}