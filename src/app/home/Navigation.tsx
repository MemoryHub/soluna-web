import Link from "next/link";
import { useState } from 'react';
import InviteModal from '../../components/common/InviteModal';

interface NavigationProps {
  onScrollToSection: (index: number) => void;
}

export default function Navigation({ onScrollToSection }: NavigationProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl sm:text-2xl pixel-font text-[#38b2ac]" style={{ marginLeft: '0px' }}>
              SOLUNA AI
            </div>
            <div className="flex items-center space-x-4 sm:space-x-8" style={{ marginRight: '0px' }}>
              <button 
                onClick={() => onScrollToSection(0)}
                className="text-xs sm:text-sm hover:text-[#38b2ac] transition-colors"
              >
                首页
              </button>
              <Link 
                href="/observation-station"
                className="text-xs sm:text-sm hover:text-[#38b2ac] transition-colors"
              >
                AI生命观察站
              </Link>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="text-xs sm:text-sm hover:text-[#38b2ac] transition-colors"
              >
                获取邀请码
              </button>
            </div>
          </div>
        </div>
      </nav>
      <InviteModal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
      />
    </>
  );
}