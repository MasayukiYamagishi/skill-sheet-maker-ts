'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // フォームの状態
  const [formData, setFormData] = useState({
    // 基本情報
    name: '',
    nameKana: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    
    // 詳細情報
    department: '',
    joinDate: '',
    toeicScore: '',
    status: 'available'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // パスワード確認
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      setIsLoading(false);
      return;
    }
    
    // ここで実際の登録処理を行う（現在はモックアップなのでスキップ）
    
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3); // 完了ステップ
    }, 1000);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">基本情報</h3>
      
      {/* 名前 */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">氏名 <span className="text-error">*</span></span>
        </label>
        <input
          type="text"
          placeholder="山田 太郎"
          className="form-input"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>
      
      {/* フリガナ */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">フリガナ <span className="text-error">*</span></span>
        </label>
        <input
          type="text"
          placeholder="ヤマダ タロウ"
          className="form-input"
          value={formData.nameKana}
          onChange={(e) => handleInputChange('nameKana', e.target.value)}
          required
        />
      </div>
      
      {/* メールアドレス */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">メールアドレス <span className="text-error">*</span></span>
        </label>
        <input
          type="email"
          placeholder="your-email@example.com"
          className="form-input"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>
      
      {/* パスワード */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">パスワード <span className="text-error">*</span></span>
        </label>
        <input
          type="password"
          placeholder="8文字以上で入力"
          className="form-input"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
          minLength={8}
        />
      </div>
      
      {/* パスワード確認 */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">パスワード（確認） <span className="text-error">*</span></span>
        </label>
        <input
          type="password"
          placeholder="パスワードを再入力"
          className="form-input"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">詳細情報</h3>
      
      {/* 生年月日 */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">生年月日 <span className="text-error">*</span></span>
        </label>
        <input
          type="date"
          className="form-input"
          value={formData.birthDate}
          onChange={(e) => handleInputChange('birthDate', e.target.value)}
          required
        />
      </div>
      
      {/* 性別 */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">性別 <span className="text-error">*</span></span>
        </label>
        <select
          className="form-input"
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          required
        >
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>
      
      {/* 所属部署 */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">所属部署</span>
        </label>
        <input
          type="text"
          placeholder="開発部"
          className="form-input"
          value={formData.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
        />
      </div>
      
      {/* 入社日 */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">入社日</span>
        </label>
        <input
          type="date"
          className="form-input"
          value={formData.joinDate}
          onChange={(e) => handleInputChange('joinDate', e.target.value)}
        />
      </div>
      
      {/* TOEICスコア */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">TOEICスコア</span>
        </label>
        <input
          type="number"
          placeholder="800"
          className="form-input"
          value={formData.toeicScore}
          onChange={(e) => handleInputChange('toeicScore', e.target.value)}
          min="0"
          max="990"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto bg-success rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold">登録完了</h3>
      <p className="text-gray-600">
        アカウントの登録が完了しました。<br />
        ログイン画面に移動してログインしてください。
      </p>
      <Link href="/login" className="btn btn-primary">
        ログイン画面へ
      </Link>
    </div>
  );

  if (currentStep === 3) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md w-full">
            <h1 className="text-4xl font-bold mb-8 text-primary">Orbit</h1>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {renderStep3()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-lg w-full">
          {/* ロゴ */}
          <h1 className="text-4xl font-bold mb-8 text-primary">Orbit</h1>
          
          {/* ステップインジケータ */}
          <div className="steps steps-horizontal w-full mb-8">
            <div className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>基本情報</div>
            <div className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>詳細情報</div>
            <div className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>完了</div>
          </div>
          
          {/* 登録フォーム */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center mb-6">アカウント登録</h2>
              
              <form onSubmit={currentStep === 2 ? handleSubmit : (e) => e.preventDefault()}>
                {/* エラーメッセージ */}
                {error && (
                  <div className="alert alert-error mb-4">
                    <span>{error}</span>
                  </div>
                )}
                
                {/* ステップごとのフォーム */}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                
                {/* ナビゲーションボタン */}
                <div className="flex justify-between mt-6">
                  {currentStep === 1 ? (
                    <Link href="/login" className="btn btn-outline">
                      ログイン画面へ
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-outline"
                    >
                      戻る
                    </button>
                  )}
                  
                  {currentStep === 1 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn btn-primary"
                      disabled={!formData.name || !formData.email || !formData.password}
                    >
                      次へ
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? '登録中...' : '登録完了'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}