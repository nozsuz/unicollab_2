import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">UniCollab</span>
          <span className="block text-indigo-600 mt-2">産官学の研究者をつなぐプラットフォーム</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          全国のアカデミアの研究者と民間企業の研究者が産学あるいは学学で相互作用できる場です。
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/features"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              詳しく知る
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
              alt="研究者のコラボレーション"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">全国の産官学の繋がり</h3>
              <p className="mt-2 text-base text-gray-500">
                それぞれが持つ強みと研究シーズがこのプラットフォームに蓄積され、次の研究につながります。
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
              alt="研究室での実験"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">シーズを見つける</h3>
              <p className="mt-2 text-base text-gray-500">
                今あなたが求めている研究シーズや研究資材をすぐに見つけることができ、その場で詳細を確認できます。
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
              alt="ビジネスミーティング"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">無限の可能性</h3>
              <p className="mt-2 text-base text-gray-500">
                研究提案、ニーズの紹介、技術のアピール、人材探しなど、様々な使い方が可能です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;