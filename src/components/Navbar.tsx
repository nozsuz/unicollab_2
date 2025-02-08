import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface AccountType {
  id: string;
  type: 'academic' | 'business';
  name: string;
  organization: string;
  role: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<AccountType>({
    id: '1',
    type: 'academic',
    name: '山田 太郎',
    organization: '東京大学',
    role: '教授'
  });

  const accounts: AccountType[] = [
    {
      id: '1',
      type: 'academic',
      name: '山田 太郎',
      organization: '東京大学',
      role: '教授'
    },
    {
      id: '2',
      type: 'business',
      name: '鈴木 一郎',
      organization: 'ファーマテック株式会社',
      role: '研究開発部長'
    }
  ];

  const handleAccountSwitch = (account: AccountType) => {
    setCurrentAccount(account);
    setIsAccountMenuOpen(false);
    // アカウントタイプに応じてダッシュボードに遷移
    navigate(account.type === 'academic' ? '/academic/dashboard' : '/business/dashboard');
  };

  const handleDashboardClick = () => {
    // 現在のアカウントタイプに応じてダッシュボードに遷移
    navigate(currentAccount.type === 'academic' ? '/academic/dashboard' : '/business/dashboard');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">UniCollab</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/features"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                特徴
              </Link>
              <Link
                to="/academic"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                アカデミアの方へ
              </Link>
              <Link
                to="/business"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                企業の方へ
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* マイページアイコン */}
            <button
              onClick={handleDashboardClick}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* アカウント切り替えボタン */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600">{currentAccount.name[0]}</span>
                  </div>
                  <span className="ml-2">{currentAccount.name}</span>
                </div>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    isAccountMenuOpen ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* アカウント切り替えメニュー */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => handleAccountSwitch(account)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                          currentAccount.id === account.id ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600">{account.name[0]}</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                            <p className="text-xs text-gray-500">
                              {account.organization} - {account.role}
                            </p>
                          </div>
                          {currentAccount.id === account.id && (
                            <svg
                              className="ml-auto h-5 w-5 text-indigo-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => navigate('/settings/accounts')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        アカウント設定
                      </button>
                      <button
                        onClick={() => {
                          // ログアウト処理
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleDashboardClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              参加登録
            </button>
          </div>

          {/* モバイルメニューボタン */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">メニューを開く</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/features"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            特徴
          </Link>
          <Link
            to="/academic"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            アカデミアの方へ
          </Link>
          <Link
            to="/business"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            企業の方へ
          </Link>

          {/* モバイル用アカウント切り替え */}
          <div className="border-t border-gray-200 pt-4">
            <div className="px-4">
              <p className="text-sm font-medium text-gray-500">現在のアカウント</p>
              <div className="mt-2 flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">{currentAccount.name[0]}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{currentAccount.name}</p>
                  <p className="text-xs text-gray-500">
                    {currentAccount.organization} - {currentAccount.role}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    handleAccountSwitch(account);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                >
                  {account.name} - {account.organization}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate('/settings/accounts');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              >
                アカウント設定
              </button>
              <button
                onClick={() => {
                  // ログアウト処理
                  navigate('/');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;