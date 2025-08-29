"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import { apiService } from '../services/api';
import LoginModal from '../components/observation-station/LoginModal';
import Toast from '../components/observation-station/Toast';
import { UserInfo } from '../types/user_request/user_request';



interface UserContextType {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  login: (onSuccess?: () => void) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginSuccessCallback, setLoginSuccessCallback] = useState<(() => void) | undefined>(undefined);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  // 检查用户登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfoString = localStorage.getItem('userInfo');
      const userToken = localStorage.getItem('userToken');
      
      if (userInfoString && userToken) {
        try {
          const parsedUserInfo = JSON.parse(userInfoString);
          setUserInfo(parsedUserInfo);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('解析用户信息失败:', error);
          localStorage.removeItem('userInfo');
          localStorage.removeItem('userToken');
        }
      }
    };
    
    checkLoginStatus();
    
    // 监听localStorage变化以实现跨组件状态同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userInfo' || e.key === 'userToken') {
        checkLoginStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 处理登录 - 使用更安全的方式管理回调函数
  const login = (onSuccess?: () => void) => {
    setTimeout(() => {
      setLoginSuccessCallback(() => {
        // 返回一个新的函数，这个函数会在组件更新完成后执行
        return () => {
          if (onSuccess) {
            // 使用setTimeout确保回调函数不会在渲染期间执行
            setTimeout(onSuccess, 0);
          }
        };
      });
      setIsLoginModalOpen(true);
    }, 0);
  };

  // 处理登录成功
  const handleLoginSuccess = () => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      try {
        const parsedUserInfo = JSON.parse(userInfoString);
        setUserInfo(parsedUserInfo);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        
        // 执行回调函数 - 使用setTimeout确保不会在渲染期间执行
        if (loginSuccessCallback) {
          setTimeout(() => {
            loginSuccessCallback();
            setLoginSuccessCallback(undefined);
          }, 0);
        }
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  };

  // 处理登出
  const logout = async () => {
    try {
      // 调用后端登出接口
      const response = await apiService.logout();
      if (response.recode === 200) {
        setLogoutMessage('登出成功');
        setShowLogoutToast(true);
         // 清除本地存储
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        setUserInfo(null);
        setIsLoggedIn(false);
      } else {
        setLogoutMessage('登出失败: ' + (response.msg || '未知错误'));
        setShowLogoutToast(true);
      }
    } catch (error) {
      console.error('登出失败:', error);
      setLogoutMessage('登出失败: 网络错误');
      setShowLogoutToast(true);
    }
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
      {/* 登录弹窗在Provider中统一渲染 */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {/* 登出Toast提示 */}
      <Toast
        message={logoutMessage}
        isVisible={showLogoutToast}
        onHide={() => setShowLogoutToast(false)}
        type="success"
        duration={3000}
      />
    </UserContext.Provider>
  );
};

// 自定义hook，供组件使用
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};