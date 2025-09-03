'use client';

import React, { useState, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onRefresh
}: PaginationProps) {
  // 计算总页数
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [inputPage, setInputPage] = useState(currentPage.toString());
  
  // 生成页码数组（简单的分页实现，显示当前页及前后各1页）
  const getPageNumbers = () => {
    const pages = [];
    
    // 始终显示第一页
    if (currentPage > 2) {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
    }
    
    // 显示当前页及前后各1页
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // 始终显示最后一页
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许输入数字
    if (/^\d*$/.test(value)) {
      setInputPage(value);
    }
  };

  const handlePageInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(inputPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      // 输入无效时重置为当前页
      setInputPage(currentPage.toString());
    }
  };

  // 当currentPage变化时更新输入框的值
  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  return (
    <div className="pixel-font flex flex-col items-center gap-4 mt-8 px-2">
      {/* 顶部信息 */}
      <div className="text-xs text-gray-500 font-mono w-full text-center">
        第 {currentPage} 页，共 {totalPages} 页
      </div>
      
      {/* 中间分页器 */}
      <div className="flex flex-wrap items-center justify-center gap-1 w-full">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-2 py-1 text-xs border ${currentPage === 1 ? 'border-gray-700 text-gray-700 cursor-not-allowed' : 'border-[#2d3748] hover:border-[#38b2ac] text-gray-300 hover:text-[#38b2ac] transition-colors'} pixel-button`}
        >
          &lt;
        </button>
        
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`px-3 py-1 text-xs ${typeof page === 'number' 
              ? currentPage === page 
                ? 'bg-[#38b2ac] text-black' 
                : 'border border-[#2d3748] hover:border-[#38b2ac] text-gray-300 hover:text-[#38b2ac]'
              : 'text-gray-500'}
              transition-colors pixel-button`}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 text-xs border ${currentPage === totalPages ? 'border-gray-700 text-gray-700 cursor-not-allowed' : 'border-[#2d3748] hover:border-[#38b2ac] text-gray-300 hover:text-[#38b2ac] transition-colors'} pixel-button`}
        >
          &gt;
        </button>
        
        {/* 页码输入框 */}
        <div className="flex items-center gap-1 mt-2 w-full justify-center">
          <span className="text-xs text-gray-500">跳至</span>
          <input
            type="text"
            value={inputPage}
            onChange={handlePageInputChange}
            onKeyPress={handlePageInputKeyPress}
            className="w-12 px-2 py-1 text-xs bg-gray-800 border border-gray-700 text-center pixel-input"
            placeholder="页码"
            maxLength={totalPages.toString().length}
          />
          <span className="text-xs text-gray-500">页</span>
          <button
            onClick={handleGoToPage}
            className="px-2 py-1 text-xs bg-[#38b2ac] text-black hover:bg-[#2c9789] transition pixel-button"
          >
            确定
          </button>
        </div>
      </div>
      
      {/* 右侧刷新按钮已移至控制面板，此处已不再需要 */}
    </div>
  );
}