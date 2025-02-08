import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProposals, updateProposal, ResearchProposal } from '../utils/proposalStorage';

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

const EditProposal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
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
    if (!id) {
      navigate('/academic/dashboard');
      return;
    }

    const proposals = getProposals();
    const proposal = proposals.find(p => p.id === id);

    if (!proposal) {
      navigate('/academic/dashboard');
      return;
    }

    if (proposal.status !== 'draft') {
      alert('公開済みの提案書は編集できません');
      navigate('/academic/dashboard');
      return;
    }

    setFormData({
      title: proposal.title,
      field: proposal.field,
      summary: proposal.summary,
      background: proposal.background,
      objective: proposal.objective,
      approach: proposal.approach,
      expectedOutcome: proposal.expected_outcome,
      collaboration: proposal.collaboration,
      budget: proposal.budget,
      period: proposal.period
    });

    if (proposal.images) {
      setImages(proposal.images);
    }
  }, [id, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsProcessing(true);

    try {
      const updated = await updateProposal(id, {
        ...formData,
        expected_outcome: formData.expectedOutcome,
        images: images.length > 0 ? images : undefined
      });

      if (!updated) {
        throw new Error('提案書の更新に失敗しました');
      }
      
      alert('研究提案書を保存しました');
      navigate('/academic/dashboard');
    } catch (error) {
      console.error('Error updating proposal:', error);
      alert('保存中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">研究提案書の編集</h1>
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

export default EditProposal;