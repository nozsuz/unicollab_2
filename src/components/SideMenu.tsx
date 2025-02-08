import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  unreadCount?: number;
}

// アカウントタイプに応じたメニュー項目の定義
const getMenuItems = (accountType: 'academic' | 'business'): MenuItem[] => {
  // アカウントタイプ固有のメニュー項目
  const dashboardItem: MenuItem = accountType === 'academic' ? {
    path: '/academic/dashboard',
    label: 'マイページ',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  } : {
    path: '/business/dashboard',
    label: 'マイページ',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  };

  // メッセージ（共通）
  const messageItem: MenuItem = {
    path: accountType === 'academic' ? '/messages/academic' : '/messages/business',
    label: 'メッセージ',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    unreadCount: 2
  };

  // プロジェクト（共通）
  const projectItem: MenuItem = {
    path: accountType === 'academic' ? '/projects/academic' : '/projects/business',
    label: 'プロジェクト',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  };

  // シーズ・ニーズ一覧（共通）
  const listingItem: MenuItem = {
    path: '/listings',
    label: 'シーズ・ニーズ',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  };

  // 研究費情報（アカデミアのみ）
  const fundingItem: MenuItem = {
    path: '/funding',
    label: '研究費情報',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  // ヘルプ
  const helpItem: MenuItem = {
    path: '/help',
    label: 'ヘルプ',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  // メニュー項目の順序を設定（アカウントタイプに応じて）
  const menuItems = [
    dashboardItem,
    listingItem,
    messageItem,
    projectItem
  ];

  // 研究費情報はアカデミアのみに表示
  if (accountType === 'academic') {
    menuItems.push(fundingItem);
  }

  // ヘルプは共通
  menuItems.push(helpItem);

  return menuItems;
};

const SideMenu = () => {
  const location = useLocation();
  // 現在のパスからアカウントタイプを判断
  const accountType = location.pathname.includes('/business/') || 
                     location.pathname === '/messages/business' ||
                     location.pathname === '/projects/business'
                     ? 'business' : 'academic';
  const menuItems = getMenuItems(accountType);

  return (
    <>
      {/* デスクトップ用メニュー */}
      <div className="hidden md:block fixed right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-l-lg overflow-hidden z-10">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group relative ${
              location.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'
            }`}
          >
            <div className="w-6 h-6 relative">
              {item.icon}
              {item.unreadCount && item.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {item.unreadCount}
                </span>
              )}
            </div>
            <span className="hidden group-hover:block whitespace-nowrap text-sm font-medium">
              {item.label}
              {item.unreadCount && item.unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {item.unreadCount}
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>

      {/* モバイル用メニュー */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-14">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded-full relative ${
                location.pathname === item.path 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={item.label}
            >
              {item.icon}
              {item.unreadCount && item.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {item.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideMenu;