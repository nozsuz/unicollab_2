import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveProposal } from '../utils/proposalStorage';
import { extractTextFromPDF } from '../utils/pdfParser';
import { generateProposalFromText, ProposalData } from '../utils/openaiService';

// 連携形態の選択肢
const COLLABORATION_TYPES = [
  { value: 'joint_research', label: '共同研究' },
  { value: 'technical_transfer', label: '技術移転' },
  { value: 'license', label: 'ライセンス契約' },
  { value: 'commissioned_research', label: '委託研究' },
  { value: 'academic_collaboration', label: '学学連携' }
];

// 予算規模の選択肢
const BUDGET_RANGES = [
  { value: 'under_1m', label: '100万円未満/年' },
  { value: '1m_5m', label: '100-500万円/年' },
  { value: '5m_10m', label: '500-1000万円/年' },
  { value: '10m_50m', label: '1000-5000万円/年' },
  { value: 'over_50m', label: '5000万円以上/年' },
  { value: 'negotiable', label: '応相談' }
];

// 研究期間の選択肢
const RESEARCH_PERIODS = [
  { value: 'under_1y', label: '1年未満' },
  { value: '1y_2y', label: '1-2年' },
  { value: '2y_3y', label: '2-3年' },
  { value: '3y_5y', label: '3-5年' },
  { value: 'over_5y', label: '5年以上' },
  { value: 'negotiable', label: '応相談' }
];

// 研究分野の選択肢
const RESEARCH_FIELDS = [
  { value: 'medical', label: '医学・薬学' },
  { value: 'engineering', label: '工学' },
  { value: 'chemistry', label: '化学' },
  { value: 'it', label: '情報工学' }
];

const NewProposal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ProposalData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    field: '',
    summary: '',
    background: '',
    objective: '',
    approach: '',
    expectedOutcome: '',
    collaboration: '',
    budget: '',
    period: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Maximum 3 images
    if (images.length + files.length > 3) {
      alert('画像は最大3枚までアップロードできます');
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setPreviewData(null);
      
      const text = await extractTextFromPDF(file);
      console.log('Extracted text:', text);
      
      const proposal = await generateProposalFromText(text);
      console.log('Generated proposal:', proposal);
      
      setPreviewData(proposal);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('PDFの処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyPreview = () => {
    if (!previewData) return;
    
    const fieldValue = previewData.field ? mapFieldToValue(previewData.field) : '';
    
    setFormData(prev => ({
      ...prev,
      title: previewData.title || '',
      field: fieldValue,
      summary: previewData.summary || '',
      background: previewData.background || '',
      objective: previewData.objective || '',
      approach: previewData.approach || '',
      expectedOutcome: previewData.expectedOutcome || ''
    }));
    
    setPreviewData(null);
  };

  const mapFieldToValue = (field: string): string => {
    const fieldMap: { [key: string]: string } = {
      '医学・薬学': 'medical',
      '工学': 'engineering',
      '化学': 'chemistry',
      '情報工学': 'it'
    };
    
    const normalizedField = field.toLowerCase();
    for (const [key, value] of Object.entries(fieldMap)) {
      if (normalizedField.includes(key.toLowerCase())) {
        return value;
      }
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await saveProposal({
        ...formData,
        expected_outcome: formData.expectedOutcome,
        images: images.length > 0 ? images : undefined
      });
      
      alert('研究提案書を保存しました');
      navigate('/academic/dashboard');
    } catch (error) {
      console.error('Error saving proposal:', error);
      alert('保存中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">研究提案書の作成</h1>
        <p className="mt-2 text-gray-600">PDFファイルをアップロードするか、必要な情報を入力してください</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">PDFファイルからの自動生成</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>PDFを処理中です。しばらくお待ちください...</span>
            </div>
          )}
        </div>

        {previewData && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">プレビュー</h3>
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">タイトル</h4>
                <p className="text-gray-900">{previewData.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">研究分野</h4>
                <p className="text-gray-900">{previewData.field}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">概要</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{previewData.summary}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">背景</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{previewData.background}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">目的</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{previewData.objective}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">アプローチ</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{previewData.approach}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">期待される成果</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{previewData.expectedOutcome}</p>
              </div>
              <div className="pt-4">
                <button
                  onClick={applyPreview}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  この内容を適用する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            研究タイトル
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="field" className="block text-sm font-medium text-gray-700">
            研究分野
          </label>
          <select
            name="field"
            id="field"
            value={formData.field}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">選択してください</option>
            {RESEARCH_FIELDS.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            研究概要
          </label>
          <textarea
            name="summary"
            id="summary"
            rows={3}
            value={formData.summary}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="background" className="block text-sm font-medium text-gray-700">
            研究背景
          </label>
          <textarea
            name="background"
            id="background"
            rows={3}
            value={formData.background}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-gray-700">
            研究目的
          </label>
          <textarea
            name="objective"
            id="objective"
            rows={3}
            value={formData.objective}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="approach" className="block text-sm font-medium text-gray-700">
            研究アプローチ
          </label>
          <textarea
            name="approach"
            id="approach"
            rows={3}
            value={formData.approach}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="expectedOutcome" className="block text-sm font-medium text-gray-700">
            期待される成果
          </label>
          <textarea
            name="expectedOutcome"
            id="expectedOutcome"
            rows={3}
            value={formData.expectedOutcome}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            研究画像（最大3枚）
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            disabled={images.length >= 3}
          />
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`研究画像 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="collaboration" className="block text-sm font-medium text-gray-700">
            希望する連携形態
          </label>
          <select
            name="collaboration"
            id="collaboration"
            value={formData.collaboration}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">選択してください</option>
            {COLLABORATION_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              予算規模
            </label>
            <select
              name="budget"
              id="budget"
              value={formData.budget}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">選択してください</option>
              {BUDGET_RANGES.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700">
              研究期間
            </label>
            <select
              name="period"
              id="period"
              value={formData.period}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">選択してください</option>
              {RESEARCH_PERIODS.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/academic/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isProcessing}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            {isProcessing ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProposal;