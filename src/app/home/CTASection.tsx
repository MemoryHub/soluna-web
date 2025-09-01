import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const socialLinks = [
  { name: "抖音", icon: "/media/dy-logo.png", qrCode: "/media/dy-qrcode.jpg" },
  { name: "视频号", icon: "/media/sph-logo.png", qrCode: "/media/sph-qrcode.jpg" },
  { name: "小红书", icon: "/media/xhs-logo.svg", qrCode: "/media/xhs-qrcode.jpg" },
  { name: "YouTube", icon: "/media/youtube-logo.png", href: "https://www.youtube.com/@Sir.AlexZhang" },
  { name: "X", icon: "/media/x-logo.png", href: "https://x.com/boZhang28340795" }
];

export default function CTASection() {
  const [showQR, setShowQR] = useState<string | null>(null);

  const handleSocialClick = (social: any) => {
    if (social.qrCode) {
      setShowQR(social.qrCode);
    } else if (social.href) {
      window.open(social.href, '_blank');
    }
  };

  const closeQR = () => {
    setShowQR(null);
  };

  return (
    <section className="screen-section min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1f29] to-[#0f172a] flex items-center justify-center py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          关注社交媒体
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 font-mono">
          一起见证AI文明的诞生与成长
        </p>
        
        {/* 白色卡片承托的社交媒体图标 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 sm:p-12 mb-8 sm:mb-12 max-w-2xl mx-auto shadow-2xl shadow-black/30 ring-1 ring-white/10">
          <div className="flex justify-center items-center gap-8 sm:gap-12">
            {socialLinks.map((social, index) => (
              <button
                key={index}
                onClick={() => handleSocialClick(social)}
                className="group relative transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#38b2ac]/50 rounded-2xl"
              >
                <div className="relative">
                  {/* 背景光晕效果 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* 图标容器 */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-xl shadow-black/40 group-hover:shadow-2xl group-hover:shadow-black/60 transition-all duration-300">
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={1200}
                      height={1200}
                      className="w-full h-full object-contain rounded-2xl filter brightness-100 group-hover:brightness-110 transition-all duration-300"
                      style={{ 
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                        imageRendering: 'crisp-edges'
                      }}
                    />
                  </div>
                  
                  {/* 悬停发光边框 */}
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 ring-offset-2 ring-offset-transparent group-hover:ring-white/40 transition-all duration-300 scale-110 opacity-0 group-hover:opacity-100"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <p className="text-gray-400 mb-2 text-sm font-mono">
            SOLUNA AI· 人与AI共生，对立统一，构建数字文明新纪元
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Soluna由拉丁语 “太阳（Sol）” 与 “月亮（Luna）” 组合而成
          </p>
        </div>

        {/* 二维码弹窗 */}
        {showQR && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeQR}
          >
            <div 
              className="bg-gray-900 rounded-2xl p-6 shadow-2xl shadow-black/50 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-mono text-lg">扫码关注</h3>
                <button
                  onClick={closeQR}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="bg-white rounded-xl p-4">
                <Image
                  src={showQR}
                  alt="二维码"
                  width={3000}
                  height={3000}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <p className="text-gray-400 text-center mt-4 text-sm font-mono">
                使用手机扫码关注
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}