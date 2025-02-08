import React, { useState } from 'react';

interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    organization: string;
    title: string;
  };
  content: string;
  timestamp: string;
  unread: boolean;
  relatedTo?: {
    type: 'need' | 'project';
    title: string;
    id: string;
  };
}

const BusinessMessages = () => {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: {
        name: '山田 太郎',
        organization: '東京大学',
        title: '教授',
      },
      content: 'ご提示いただいた研究ニーズに関して、当研究室の技術が活用できる可能性があると考えております。詳細についてディスカッションさせていただければ幸いです。',
      timestamp: '2024-01-26T10:30:00',
      unread: true,
      relatedTo: {
        type: 'need',
        title: '新規がん免疫療法の開発',
        id: '1'
      }
    },
    {
      id: '2',
      sender: {
        name: '佐藤 美咲',
        organization: '京都大学',
        title: '准教授',
      },
      content: '共同研究プロジェクトの進捗について、最新の実験結果をご報告させていただきたく存じます。',
      timestamp: '2024-01-25T15:45:00',
      unread: true,
      relatedTo: {
        type: 'project',
        title: 'がん微小環境の解析と創薬への応用',
        id: '2'
      }
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 md:pb-12">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">メッセージ</h1>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 sm:p-6 ${message.unread ? 'bg-indigo-50' : ''}`}
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              {/* アバター */}
              <div className="flex-shrink-0">
                {message.sender.avatar ? (
                  <img
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-base sm:text-lg">
                      {message.sender.name[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* メッセージ内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                      {message.sender.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {message.sender.organization} - {message.sender.title}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                    {new Date(message.timestamp).toLocaleString('ja-JP', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </div>
                </div>

                {message.relatedTo && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {message.relatedTo.type === 'need' ? '研究ニーズ' : 'プロジェクト'}:
                      {' '}{message.relatedTo.title}
                    </span>
                  </div>
                )}

                <div className="mt-2">
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-none">
                    {message.content}
                  </p>
                </div>
                <div className="mt-3 sm:mt-4 flex space-x-2 sm:space-x-4">
                  <button className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    返信する
                  </button>
                  <button className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    詳細を見る
                  </button>
                  {message.relatedTo && (
                    <button className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      {message.relatedTo.type === 'need' ? 'ニーズ' : 'プロジェクト'}を見る
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessMessages;