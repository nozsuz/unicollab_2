import React from 'react';

const Features = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">UniCollabの特徴</h2>
      
      <div className="space-y-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              全国の産官学の繋がりが１カ所に
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              UniCollabは全国のアカデミアの研究者と民間企業の研究者が産学あるいは学学で相互作用できる場です。
              それぞれが持つ強みと研究シーズがこのプラットフォームに蓄積され、次の研究につながります。
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
              alt="研究者の協力"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="lg:order-2">
            <h3 className="text-2xl font-bold text-gray-900">
              シーズを見つける労力と時間を軽減
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              UniCollabは今あなたが求めている研究シーズや研究資材をすぐに見つけることができ、
              その場で詳細を確認できます。また、異分野の研究テーマも閲覧できるため分野融合の研究へと展開可能です。
            </p>
          </div>
          <div className="mt-10 lg:mt-0 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3"
              alt="研究室での作業"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              使い方はあなた次第、可能性は無限大
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              UniCollabは研究提案をするためだけの場ではありません。企業はニーズの紹介、
              アカデミアは臨床検体や技術を持っていることをアピールできます。
              その他にも人材を見つける、学生が研究室を探すなど様々な使い方を創造していきましょう。
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3"
              alt="ビジネスミーティング"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;