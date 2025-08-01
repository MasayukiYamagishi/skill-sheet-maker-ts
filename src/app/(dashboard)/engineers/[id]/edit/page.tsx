'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// モックデータ
const mockSkills = [
  { id: 1, name: 'JavaScript', category: 'language' },
  { id: 2, name: 'TypeScript', category: 'language' },
  { id: 3, name: 'React', category: 'framework' },
  { id: 4, name: 'Vue.js', category: 'framework' },
  { id: 5, name: 'Next.js', category: 'framework' },
  { id: 6, name: 'Node.js', category: 'runtime' },
  { id: 7, name: 'MySQL', category: 'database' },
  { id: 8, name: 'PostgreSQL', category: 'database' },
  { id: 9, name: 'AWS', category: 'cloud' },
  { id: 10, name: 'Docker', category: 'infrastructure' }
];

const mockQualifications = [
  { id: 1, name: '基本情報技術者試験' },
  { id: 2, name: '応用情報技術者試験' },
  { id: 3, name: 'AWS Solutions Architect' },
  { id: 4, name: 'Oracle Master' },
  { id: 5, name: 'LPIC-1' }
];

const mockProcesses = [
  { id: 1, name: '要件定義' },
  { id: 2, name: '基本設計' },
  { id: 3, name: '詳細設計' },
  { id: 4, name: '実装' },
  { id: 5, name: 'テスト' },
  { id: 6, name: 'リリース' },
  { id: 7, name: '保守運用' }
];

export default function EngineerEditPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // フォームデータ（モック）
  const [formData, setFormData] = useState({
    // 基本情報
    name: '山田太郎',
    nameKana: 'ヤマダタロウ',
    email: 'yamada@example.com',
    birthDate: '1995-04-15',
    gender: 'male',
    phone: '090-1234-5678',
    address: '東京都渋谷区',
    
    // 職務情報
    status: 'available',
    department: '開発部',
    joinDate: '2020-04-01',
    toeicScore: 750,
    
    // スキル情報
    userSkills: [
      { skillId: 1, level: 3, experienceYears: 5 },
      { skillId: 3, level: 4, experienceYears: 3 },
      { skillId: 9, level: 2, experienceYears: 2 }
    ],
    
    // 資格情報
    userQualifications: [
      { qualificationId: 1, obtainedDate: '2021-06-15' },
      { qualificationId: 3, obtainedDate: '2022-03-20' }
    ],
    
    // 経歴情報
    careerHistories: [
      {
        id: 1,
        companyName: 'ABC株式会社',
        position: '開発エンジニア',
        startDate: '2020-04-01',
        endDate: '',
        description: 'Webアプリケーション開発',
        processes: [1, 2, 4, 5],
        skills: [1, 3, 7]
      }
    ]
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // ここで実際の保存処理を行う
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/engineers/${params.id}`);
    }, 1000);
  };

  const renderBasicInfoTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">基本情報</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 名前 */}
        <div className="form-control">
          <label className="form-label">
            <span className="label-text">氏名 <span className="text-error">*</span></span>
          </label>
          <input
            type="text"
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
            className="form-input"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
        
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
        
        {/* 電話番号 */}
        <div className="form-control">
          <label className="form-label">
            <span className="label-text">電話番号</span>
          </label>
          <input
            type="tel"
            className="form-input"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>
      
      {/* 住所 */}
      <div className="form-control">
        <label className="form-label">
          <span className="label-text">住所</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>
      
      <div className="divider"></div>
      
      <h3 className="text-lg font-semibold">職務情報</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 現在の状況 */}
        <div className="form-control">
          <label className="form-label">
            <span className="label-text">現在の状況 <span className="text-error">*</span></span>
          </label>
          <select
            className="form-input"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            required
          >
            <option value="available">営業中</option>
            <option value="inProject">案件中</option>
            <option value="onLeave">休職中</option>
            <option value="retired">退職済み</option>
          </select>
        </div>
        
        {/* 所属 */}
        <div className="form-control">
          <label className="form-label">
            <span className="label-text">所属</span>
          </label>
          <input
            type="text"
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
            className="form-input"
            value={formData.toeicScore}
            onChange={(e) => handleInputChange('toeicScore', parseInt(e.target.value))}
            min="0"
            max="990"
          />
        </div>
      </div>
    </div>
  );

  const renderSkillsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">スキル情報</h3>
        <button className="btn btn-primary btn-sm">
          スキル追加
        </button>
      </div>
      
      {/* 現在のスキル */}
      <div className="space-y-4">
        {formData.userSkills.map((userSkill, index) => {
          const skill = mockSkills.find(s => s.id === userSkill.skillId);
          return (
            <div key={index} className="card bg-base-100 border border-base-300">
              <div className="card-body p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="font-medium">{skill?.name}</p>
                    <p className="text-sm text-gray-500">{skill?.category}</p>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs">レベル</span>
                    </label>
                    <select
                      className="select select-bordered select-sm"
                      value={userSkill.level}
                      onChange={(e) => {
                        const newSkills = [...formData.userSkills];
                        newSkills[index].level = parseInt(e.target.value);
                        handleInputChange('userSkills', newSkills);
                      }}
                    >
                      <option value={1}>1 - 初級</option>
                      <option value={2}>2 - 中級下</option>
                      <option value={3}>3 - 中級</option>
                      <option value={4}>4 - 上級</option>
                      <option value={5}>5 - エキスパート</option>
                    </select>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs">経験年数</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered input-sm"
                      value={userSkill.experienceYears}
                      onChange={(e) => {
                        const newSkills = [...formData.userSkills];
                        newSkills[index].experienceYears = parseInt(e.target.value);
                        handleInputChange('userSkills', newSkills);
                      }}
                      min="0"
                    />
                  </div>
                  
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      const newSkills = formData.userSkills.filter((_, i) => i !== index);
                      handleInputChange('userSkills', newSkills);
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {formData.userSkills.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">スキルが登録されていません</p>
          <button className="btn btn-primary mt-2">
            最初のスキルを追加
          </button>
        </div>
      )}
    </div>
  );

  const renderQualificationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">保有資格</h3>
        <button className="btn btn-primary btn-sm">
          資格追加
        </button>
      </div>
      
      {/* 現在の資格 */}
      <div className="space-y-4">
        {formData.userQualifications.map((userQualification, index) => {
          const qualification = mockQualifications.find(q => q.id === userQualification.qualificationId);
          return (
            <div key={index} className="card bg-base-100 border border-base-300">
              <div className="card-body p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <p className="font-medium">{qualification?.name}</p>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs">取得日</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered input-sm"
                      value={userQualification.obtainedDate}
                      onChange={(e) => {
                        const newQualifications = [...formData.userQualifications];
                        newQualifications[index].obtainedDate = e.target.value;
                        handleInputChange('userQualifications', newQualifications);
                      }}
                    />
                  </div>
                  
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      const newQualifications = formData.userQualifications.filter((_, i) => i !== index);
                      handleInputChange('userQualifications', newQualifications);
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {formData.userQualifications.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">資格が登録されていません</p>
          <button className="btn btn-primary mt-2">
            最初の資格を追加
          </button>
        </div>
      )}
    </div>
  );

  const renderCareerTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">業務経歴</h3>
        <button className="btn btn-primary btn-sm">
          経歴追加
        </button>
      </div>
      
      {/* 現在の経歴 */}
      <div className="space-y-6">
        {formData.careerHistories.map((career, index) => (
          <div key={career.id} className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 会社名 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">会社名</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={career.companyName}
                    onChange={(e) => {
                      const newCareers = [...formData.careerHistories];
                      newCareers[index].companyName = e.target.value;
                      handleInputChange('careerHistories', newCareers);
                    }}
                  />
                </div>
                
                {/* 役職 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">役職</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={career.position}
                    onChange={(e) => {
                      const newCareers = [...formData.careerHistories];
                      newCareers[index].position = e.target.value;
                      handleInputChange('careerHistories', newCareers);
                    }}
                  />
                </div>
                
                {/* 開始日 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">開始日</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={career.startDate}
                    onChange={(e) => {
                      const newCareers = [...formData.careerHistories];
                      newCareers[index].startDate = e.target.value;
                      handleInputChange('careerHistories', newCareers);
                    }}
                  />
                </div>
                
                {/* 終了日 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">終了日</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={career.endDate}
                    onChange={(e) => {
                      const newCareers = [...formData.careerHistories];
                      newCareers[index].endDate = e.target.value;
                      handleInputChange('careerHistories', newCareers);
                    }}
                  />
                </div>
              </div>
              
              {/* 業務内容 */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">業務内容</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={3}
                  value={career.description}
                  onChange={(e) => {
                    const newCareers = [...formData.careerHistories];
                    newCareers[index].description = e.target.value;
                    handleInputChange('careerHistories', newCareers);
                  }}
                />
              </div>
              
              {/* 担当工程 */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">担当工程</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {mockProcesses.map(process => (
                    <label key={process.id} className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={career.processes.includes(process.id)}
                        onChange={(e) => {
                          const newCareers = [...formData.careerHistories];
                          if (e.target.checked) {
                            newCareers[index].processes.push(process.id);
                          } else {
                            newCareers[index].processes = newCareers[index].processes.filter(p => p !== process.id);
                          }
                          handleInputChange('careerHistories', newCareers);
                        }}
                      />
                      <span className="label-text text-sm">{process.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* 削除ボタン */}
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => {
                    const newCareers = formData.careerHistories.filter((_, i) => i !== index);
                    handleInputChange('careerHistories', newCareers);
                  }}
                >
                  この経歴を削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {formData.careerHistories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">業務経歴が登録されていません</p>
          <button className="btn btn-primary mt-2">
            最初の経歴を追加
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href={`/engineers/${params.id}`}
            className="btn btn-ghost btn-sm"
          >
            ← 戻る
          </Link>
          <h1 className="text-2xl font-bold mt-2">エンジニア情報編集</h1>
        </div>
        <div className="space-x-2">
          <button className="btn btn-outline">
            キャンセル
          </button>
          <button
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === 'basic' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          基本情報
        </button>
        <button
          className={`tab ${activeTab === 'skills' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          スキル
        </button>
        <button
          className={`tab ${activeTab === 'qualifications' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('qualifications')}
        >
          資格
        </button>
        <button
          className={`tab ${activeTab === 'career' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('career')}
        >
          経歴
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          {activeTab === 'basic' && renderBasicInfoTab()}
          {activeTab === 'skills' && renderSkillsTab()}
          {activeTab === 'qualifications' && renderQualificationsTab()}
          {activeTab === 'career' && renderCareerTab()}
        </div>
      </div>
    </div>
  );
}