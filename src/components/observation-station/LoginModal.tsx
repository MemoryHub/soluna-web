'use client';

import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../../services/api';
import Toast from './Toast';
import { securityUtils } from '../../utils/securityUtils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  // 如果弹窗未打开，直接返回null
  if (!isOpen) {
    return null;
  }
  
  const [step, setStep] = useState<'phone' | 'verification'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(''));
  const [countdown, setCountdown] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showLoginSuccessToast, setShowLoginSuccessToast] = useState(false);
  
  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countdown]);
  
  useEffect(() => {
    // 当弹窗打开时，自动聚焦到第一个输入框
    if (isOpen && step === 'phone') {
      setTimeout(() => {
        const phoneInput = document.getElementById('phone-input');
        if (phoneInput) {
          phoneInput.focus();
        }
      }, 100);
    } else if (isOpen && step === 'verification') {
      setTimeout(() => {
        codeInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, step]);
  
  // 处理手机号输入
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许输入数字
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
      setErrorMessage('');
    }
  };
  
  // 处理验证码输入
  const handleCodeInput = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // 自动跳转到下一个输入框
      if (value && index < 5) {
        codeInputsRef.current[index + 1]?.focus();
      }
      
      // 检查是否输入了6位验证码，自动登录
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        // 直接传递完整的验证码进行登录，避免状态更新延迟问题
        handleLogin(fullCode);
      }
    }
  };
  
  // 处理验证码框的键盘事件
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // 处理删除键，删除后跳转到前一个输入框
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };
  
  // 发送验证码
  const handleSendCode = async () => {
    if (phoneNumber.length !== 11) {
      setErrorMessage('请输入正确的11位手机号码');
      return;
    }
    
    setIsSendingCode(true);
    setErrorMessage('');
    
    try {
      const response = await apiService.sendVerificationCode(phoneNumber);
      
      if (response.recode === 200) {
        // 显示成功提示
        setShowSuccessToast(true);
        // 3秒后自动隐藏
        setTimeout(() => setShowSuccessToast(false), 3000);
        
        // 切换到验证码输入界面
        setStep('verification');
        setCountdown(60);
        setVerificationCode(Array(6).fill(''));
        
        // 确保输入框自动聚焦
        setTimeout(() => {
          codeInputsRef.current[0]?.focus();
        }, 100);
      } else {
        setErrorMessage(response.msg || '发送验证码失败，请稍后重试');
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      setErrorMessage('网络错误，请稍后重试');
    } finally {
      setIsSendingCode(false);
    }
  };
  
  // 登录
  const handleLogin = async (fullCode?: string) => {
    // 如果没有传入验证码，则从状态中获取
    const codeToUse = fullCode || verificationCode.join('');
    
    if (codeToUse.length !== 6) {
      setErrorMessage('请输入完整的6位验证码');
      return;
    }
    
    setIsLoggingIn(true);
    setErrorMessage('');
    
    try {
      const response = await apiService.login(phoneNumber, codeToUse);
          
          if (response.recode === 200 && response.data && response.data.encrypted_user_data) {
            try {
              // 解密用户数据
              const encryptedData = response.data.encrypted_user_data;
              const decryptedData = await securityUtils.decrypt(encryptedData);
              
              // 解析JSON数据，添加错误处理和修复逻辑
              let userData;
              try {
                userData = JSON.parse(decryptedData);
              } catch (jsonError) {
                // 类型断言为Error
                const error = jsonError as Error;
                
                // 尝试修复不完整的JSON
                let fixedData = decryptedData;
                
                // 检查并修复缺失的结束大括号
                if (fixedData && fixedData.startsWith('{') && !fixedData.endsWith('}')) {
                  fixedData = fixedData + '}';
                  
                  try {
                    userData = JSON.parse(fixedData);
                  } catch (fixedError) {
                    // 类型断言为Error
                    const fError = fixedError as Error;
                    throw new SyntaxError(`JSON格式错误: ${fError.message}`);
                  }
                } else {
                  throw error;
                }
              }
              
              // 检查userData是否包含必要字段
              if (!userData || typeof userData !== 'object') {
                throw new Error('解密后数据格式错误');
              }
          
          // 保存登录信息到本地存储
          if (userData.token) {
            localStorage.setItem('userToken', userData.token);
          }
          localStorage.setItem('userInfo', JSON.stringify(userData));
          
          // 显示登录成功提示
          setShowLoginSuccessToast(true);
          // 3秒后自动隐藏
          setTimeout(() => setShowLoginSuccessToast(false), 3000);
          
          // 关闭弹窗并通知登录成功
          onClose();
          onLoginSuccess();
          
          // 刷新页面以更新用户信息数据
          window.location.reload();
        } catch (error) {
          if (error instanceof SyntaxError) {
            // 提供更详细的JSON解析错误信息
            setErrorMessage(`数据格式错误: ${error.message}`);
          } else {
            setErrorMessage('登录数据解析失败，请稍后重试');
          }
        }
      } else {
        setErrorMessage(response.msg || '登录失败，请检查验证码是否正确');
        // 清空验证码输入
        setVerificationCode(Array(6).fill(''));
        setTimeout(() => {
          codeInputsRef.current[0]?.focus();
        }, 100);
      }
    } catch (error) {
      setErrorMessage('网络错误，请稍后重试');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // 重新发送验证码
  const handleResendCode = () => {
    if (countdown === 0) {
      handleSendCode();
    }
  };
  
  // 返回手机号输入
  const handleBack = () => {
    setStep('phone');
    setErrorMessage('');
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* 验证码发送成功提示 */}
      <Toast
        message="验证码发送成功，请注意查收"
        isVisible={showSuccessToast}
        onHide={() => setShowSuccessToast(false)}
        duration={3000}
        type="success"
      />
      
      {/* 登录成功提示 */}
      <Toast
        message="登录成功"
        isVisible={showLoginSuccessToast}
        onHide={() => setShowLoginSuccessToast(false)}
        duration={3000}
        type="success"
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn">
        <div className="relative bg-[#0f1419] border-2 border-[#38b2ac] pixel-border w-full max-w-3xl max-h-[90vh] overflow-auto">
          {/* 关闭按钮 */}
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-[#2d3748] hover:bg-[#4a5568] pixel-button z-10 text-white"
          >
            <i className="fa fa-times"></i>
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* 左侧：项目介绍 */}
            <div className="p-6 border-r border-[#2d3748] bg-gradient-to-br from-[#0a0a0a] via-[#1a0b2e] to-[#16213e] relative overflow-hidden">
              {/* 像素化背景装饰 */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-4 h-4 bg-[#38b2ac] animate-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-8 right-4 w-2 h-2 bg-[#4fd1c7] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-16 left-8 w-3 h-3 bg-[#38b2ac] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-8 right-12 w-2 h-2 bg-[#4fd1c7] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>
              
              {/* 网格线条背景 */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(rgba(56, 178, 172, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 178, 172, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* 发光效果 */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#38b2ac] rounded-full opacity-5 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#4fd1c7] rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              <div className="mb-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#38b2ac] to-[#4fd1c7] rounded-sm flex items-center justify-center pixelFloat animate-pulse-slow relative z-10">
                      <i className="fa fa-eye text-xs text-white"></i>
                    </div>
                    <div className="absolute inset-0 w-8 h-8 bg-[#38b2ac] rounded-sm animate-ping opacity-20"></div>
                  </div>
                  <h2 className="text-lg font-bold tracking-wide bg-gradient-to-r from-[#38b2ac] to-[#4fd1c7] bg-clip-text text-transparent">AI生命观察站</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-gray-300">
                    <span className="text-[#38b2ac]">AI生命观察站</span> 是一个实时监控和分析人工智能角色行为的平台。
                  </p>
                  <p className="text-sm leading-relaxed text-gray-300">
                    全球首个拥有真实情感的AI角色诞生，开启人类与数字生命共生的全新时代
                  </p>
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 text-xs bg-[#2d3748] rounded-sm text-gray-300">实时监控</span>
                      <span className="px-2 py-1 text-xs bg-[#2d3748] rounded-sm text-gray-300">角色分析</span>
                      <span className="px-2 py-1 text-xs bg-[#2d3748] rounded-sm text-gray-300">生活轨迹</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 装饰元素 - 技术感动画 */}
              <div className="mt-6 pt-6 border-t border-[#2d3748] relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-[#38b2ac] animate-pulse neonGlow"></div>
                  <span className="text-xs text-gray-400">系统状态</span>
                </div>
                <div className="h-2 bg-[#2d3748]/50 rounded-sm overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-[#38b2ac] to-[#4fd1c7] animate-dataStream" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}></div>
                </div>
                
                {/* 矩阵雨效果 */}
                <div className="absolute top-0 right-0 w-8 h-full overflow-hidden opacity-30">
                  <div className="absolute text-[8px] text-[#38b2ac] animate-matrixRain" style={{ animationDuration: '2s', animationDelay: '0s' }}>0101</div>
                  <div className="absolute text-[8px] text-[#4fd1c7] animate-matrixRain" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>1010</div>
                  <div className="absolute text-[8px] text-[#38b2ac] animate-matrixRain" style={{ animationDuration: '1.8s', animationDelay: '1s' }}>1100</div>
                </div>
              </div>
            </div>
            
            {/* 右侧：登录功能 */}
            <div className="p-6 bg-gradient-to-tl from-[#0f1419] via-[#0a1929] to-[#1a0b2e] relative overflow-hidden">
              {/* 像素化背景装饰 */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-2 w-3 h-3 bg-[#38b2ac] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute top-12 left-6 w-2 h-2 bg-[#4fd1c7] animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute bottom-12 right-8 w-4 h-4 bg-[#38b2ac] animate-pulse" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute bottom-4 left-12 w-2 h-2 bg-[#4fd1c7] animate-pulse" style={{ animationDelay: '1.7s' }}></div>
              </div>
              
              {/* 对角线网格背景 */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(56, 178, 172, 0.1) 10px, rgba(56, 178, 172, 0.1) 11px)`,
                }}></div>
              </div>
              
              {/* 霓虹边框效果 */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#38b2ac] to-transparent animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4fd1c7] to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <h2 className="text-lg font-bold mb-6 tracking-wide bg-gradient-to-r from-[#38b2ac] to-[#4fd1c7] bg-clip-text text-transparent relative z-10">
                {step === 'phone' ? '手机号登录' : '验证码登录'}
              </h2>
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-sm">
                  {errorMessage}
                </div>
              )}
              
              {step === 'phone' ? (
                // 手机号输入界面
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone-input" className="block text-xs mb-2 text-gray-400">
                      手机号码
                    </label>
                    <input
                      id="phone-input"
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneInput}
                      placeholder="请输入11位手机号码"
                      maxLength={11}
                      className="w-full bg-[#1a1f29]/80 border border-[#38b2ac] p-3 text-sm text-white pixel-border focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:shadow-[0_0_15px_rgba(56,178,172,0.5)] transition-all duration-200 hover:bg-[#1a1f29]/60 placeholder-gray-500"
                    />
                  </div>
                  
                  <button
                    onClick={handleSendCode}
                    disabled={isSendingCode || phoneNumber.length !== 11}
                    className={`w-full py-3 font-medium pixel-button transition-colors relative z-10 text-white ${
                      isSendingCode || phoneNumber.length !== 11
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-[#38b2ac] hover:bg-[#4fd1c7]'
                    }`}
                  >
                    {isSendingCode ? (
                      <div className="flex items-center justify-center gap-2">
                        <i className="fa fa-spinner fa-spin"></i>
                        <span>发送中...</span>
                      </div>
                    ) : (
                      '获取验证码'
                    )}
                  </button>
                </div>
              ) : (
                // 验证码输入界面
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs text-gray-400">
                        验证码
                      </label>
                      <button
                        onClick={handleBack}
                        className="text-xs text-[#38b2ac] hover:underline"
                      >
                        <i className="fa fa-arrow-left mr-1"></i> 返回
                      </button>
                    </div>
                    
                    <div className="flex justify-between gap-2">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { codeInputsRef.current[index] = el; }}
                          type="text"
                          value={digit}
                          onChange={(e) => handleCodeInput(index, e.target.value)}
                          onKeyDown={(e) => handleCodeKeyDown(index, e)}
                          maxLength={1}
                          className="w-12 h-12 bg-[#1a1f29]/80 border border-[#38b2ac] text-center text-lg font-bold text-white pixel-border focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:shadow-[0_0_15px_rgba(56,178,172,0.5)] transition-all duration-200 hover:bg-[#1a1f29]/60"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                      className="text-xs text-[#38b2ac] hover:underline disabled:text-gray-500"
                    >
                      {countdown > 0 ? `重新发送(${countdown}s)` : '重新发送验证码'}
                    </button>
                  </div>
                  
                  {isLoggingIn && (
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2 text-[#38b2ac]">
                        <i className="fa fa-spinner fa-spin"></i>
                        <span className="text-sm">登录中...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}