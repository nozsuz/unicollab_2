import React from 'react';

const Academic = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">アカデミアの方へ</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3"
            alt="研究者の協力"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">アカデミア間の繋がりの強化</h3>
            <p className="text-gray-600">
              共同研究により研究内容を充実させ、競争的資金や外部資金など大型資金の獲得のチャンスが増えることが期待できます。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3"
            alt="研究発表"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">研究のブラッシュアップ</h3>
            <p className="text-gray-600">
              他の研究者の研究提案書から申請書の書き方を見たり、参画各社との意見交流をすることによって多くのことを学ぶことができます。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3"
            alt="ビジネスミーティング"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">社会実装に向けての展開</h3>
            <p className="text-gray-600">
              社会実装において事業会社との提携により起業する、さらなる事業展開の可能性が期待できます。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-8 mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">学生の方へ</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-white rounded-lg p-6">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3"
              alt="学生の交流"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">コミュニアップ</h4>
            <p className="text-gray-600">
              学生同士でお互いの研究を紹介したり、勉強会や交流会を発足することができます。
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3"
              alt="スキルアップ"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">スキルアップ</h4>
            <p className="text-gray-600">
              申請書の書き方を学ぶことができます。複数の研究提案書を比較したり、参考にしてみてはいかがでしょうか。
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3"
              alt="キャリアアップ"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">キャリアアップ</h4>
            <p className="text-gray-600">
              全国の研究者の研究内容を知ることができるため、研究室選び・キャリア選択のために活用してみてはいかがでしょうか。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academic;