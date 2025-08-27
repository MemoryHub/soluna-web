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

// 绑定邀请码请求类型
export interface BindInvitationCodeRequest {
  code: string;
  user_id: string;
}

export interface UserInfo {
  user_id?: string;
  phone_number?: string;
  username?: string;
  avatar_url?: string;
  token?: string;
  expire_time?: string;
  invite_status?: {
    has_used_codes: boolean;
    used_codes: Array<{ code: string }>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}