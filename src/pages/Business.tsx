import React from 'react';

const Business = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">企業の方へ</h2>

      <div className="text-center mb-16">
        <p className="text-xl text-gray-600">
          UniCollab（ユニコラボ）は大学研究者と企業のマッチングをサポートします。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3"
            alt="セキュアな情報共有"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              秘密保持契約の前段階で、安心・安全・効率的なやりとり
            </h3>
            <p className="text-gray-600">
              初期段階での情報交換を安全に行うことができます。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
            alt="双方向コミュニケーション"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              コンタクトの始まりは、研究者からでも企業からでも
            </h3>
            <p className="text-gray-600">
              双方向のコミュニケーションが可能で、柔軟な連携の開始が可能です。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3"
            alt="効率的なマッチング"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              複数の研究者に一度にアプローチできる
            </h3>
            <p className="text-gray-600">
              効率的な研究者とのマッチングが可能です。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">サービスの特徴</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-white rounded-lg p-6">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3"
              alt="閲覧権限機能"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">閲覧権限機能</h4>
            <p className="text-gray-600">
              重要な情報が流出されないように、本システムではフィルター投稿機能を用意しています。
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3"
              alt="ニーズ登録機能"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">ニーズ登録機能</h4>
            <p className="text-gray-600">
              企業ニーズ登録でより簡単に研究者からのコンタクト申請を受け取れます。
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3"
              alt="その他の特徴"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">その他の特徴</h4>
            <p className="text-gray-600">
              日本語/英語画面切り替え機能を提供しています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;