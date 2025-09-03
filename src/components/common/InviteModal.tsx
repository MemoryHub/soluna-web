'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div 
        className={`relative bg-[#1a1f29] border border-[#2d3748] rounded-lg p-6 max-w-lg w-full mx-4 transform transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <i className="fa fa-times text-lg"></i>
        </button>

        {/* 标题 */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#38b2ac] mb-2">获取邀请码</h2>
          <p className="text-gray-300 text-sm">邀请码用于激活新的AI生命</p>
        </div>

        {/* 二维码区域 */}
        <div className="text-center mb-4">
          <div className="inline-block bg-white p-3 rounded-lg">
            <Image
              src="/media/dy-qrcode.jpg"
              alt="抖音二维码"
              width={240}
              height={240}
              className="rounded"
            />
          </div>
          <p className="text-sm text-gray-300 mt-2 font-medium">抖音扫码关注「AI大博子」</p>
          <p className="text-xs text-gray-400 mt-1">或抖音搜索：AI大博子</p>
        </div>

        {/* 操作步骤 */}
        <div className="bg-[#2d3748]/50 rounded-lg p-4">
          <h3 className="text-md font-semibold text-white mb-3 text-center">如何获取邀请码</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-start">
              <span className="text-[#38b2ac] font-bold mr-2">1.</span>
              <span>扫码关注抖音「AI大博子」</span>
            </div>
            <div className="flex items-start">
              <span className="text-[#38b2ac] font-bold mr-2">2.</span>
              <span>私信发送关键词「邀请码」</span>
            </div>
            <div className="flex items-start">
              <span className="text-[#38b2ac] font-bold mr-2">3.</span>
              <span>主播会回复你的专属邀请码</span>
            </div>
            <div className="flex items-start">
              <span className="text-[#38b2ac] font-bold mr-2">4.</span>
              <span>使用邀请码生成你的AI角色</span>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            当AI拥有情感，人类将找到真正的共生伙伴。
          </p>
        </div>
      </div>
    </div>
  );
}