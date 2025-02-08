import React from 'react';
import { useParams } from 'react-router-dom';

interface NeedDetail {
  id: number;
  title: string;
  company: string;
  department: string;
  location: string;
  description: string;
  background: string;
  field: string;
  requiredTechnology: string;
  approach: string;
  expectedOutcome: string;
  scope: string;
  schedule: string;
  budget: string;
  targetPartner: string;
  requiredExpertise: string;
  desiredExperience: string;
  intellectualProperty: string;
  nda: string;
  additionalInfo: string;
  image: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

const NeedDetail = () => {
  const { id } = useParams();

  // 実際のアプリケーションではAPIから取得する
  const needData: NeedDetail = {
    id: 1,
    title: "持続可能な包装材の開発に関する共同研究",
    company: "環境ソリューション株式会社",
    department: "研究開発部",
    location: "東京都千代田区",
    description: "環境負荷の少ない生分解性プラスチックの効率的な製造方法の確立を目指しています。",
    background: `現在、世界的な環境規制の強化に伴い、プラスチック使用量の削減が求められています。
    特に包装材料における環境負荷の低減は喫緊の課題となっており、
    生分解性と実用性を両立する新素材の開発が必要とされています。`,
    field: "化学・材料工学",
    requiredTechnology: `
    - 生分解性プラスチックの製造技術
    - 材料強度評価技術
    - 環境負荷評価手法`,
    approach: `
    - ナノテクノロジーを活用した新規材料設計
    - 既存の生分解性プラスチック製造プロセスの改良
    - バイオマス由来原料の活用`,
    expectedOutcome: `
    - 新規包装材料の試作品開発
    - 製造プロセスの確立
    - 特許出願
    - 実用化に向けたロードマップの作成`,
    scope: "共同研究（期間：1-2年）",
    schedule: "2024年4月開始希望",
    budget: "年間2000万円程度",
    targetPartner: "大学・公的研究機関",
    requiredExpertise: "高分子化学・材料工学における専門知識と実績",
    desiredExperience: "類似材料の開発経験",
    intellectualProperty: "共同出願を想定（詳細は協議）",
    nda: "必要に応じて締結",
    additionalInfo: "定期的な進捗報告会を予定",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3",
    contact: {
      name: "環境 太郎",
      email: "contact@example.com",
      phone: "03-XXXX-XXXX"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* ヘッダー部分 */}
        <div className="relative h-64">
          <img
            src={needData.image}
            alt={needData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                {needData.field}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">{needData.title}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* 企業情報 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {needData.company}
              </h2>
              <p className="text-gray-600">
                {needData.department} | {needData.location}
              </p>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              コンタクトする
            </button>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">概要</h3>
              <p className="text-gray-600 whitespace-pre-line">{needData.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">背景および課題</h3>
              <p className="text-gray-600 whitespace-pre-line">{needData.background}</p>
            </div>
          </div>

          {/* 技術要件 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">技術要件</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">求める技術または知識</h4>
                <p className="text-gray-600 whitespace-pre-line">{needData.requiredTechnology}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">想定するアプローチ</h4>
                <p className="text-gray-600 whitespace-pre-line">{needData.approach}</p>
              </div>
            </div>
          </div>

          {/* 連携条件 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">連携の条件</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">求める成果</h4>
                <p className="text-gray-600 whitespace-pre-line">{needData.expectedOutcome}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">共同研究のスコープ</h4>
                  <p className="text-gray-600">{needData.scope}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">期間およびスケジュール</h4>
                  <p className="text-gray-600">{needData.schedule}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">予算規模</h4>
                  <p className="text-gray-600">{needData.budget}</p>
                </div>
              </div>
            </div>
          </div>

          {/* パートナー条件 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">パートナーに求める条件</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">対象機関</h4>
                <p className="text-gray-600">{needData.targetPartner}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">求める専門性</h4>
                <p className="text-gray-600">{needData.requiredExpertise}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">希望する実績</h4>
                <p className="text-gray-600">{needData.desiredExperience}</p>
              </div>
            </div>
          </div>

          {/* その他の情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">その他の情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">知的財産権の扱い</h4>
                <p className="text-gray-600">{needData.intellectualProperty}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">機密保持契約（NDA）</h4>
                <p className="text-gray-600">{needData.nda}</p>
              </div>
            </div>
          </div>

          {/* 連絡先情報 */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">連絡先情報</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">担当者名:</span> {needData.contact.name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">メールアドレス:</span> {needData.contact.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">電話番号:</span> {needData.contact.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedDetail;