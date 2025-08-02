'use client';

import { useState } from 'react';

// 営業中ユーザーの詳細ダミーデータ
const mockAvailableEngineers = [
  {
    id: '1',
    initials: 'T.K',
    birthdate: '1990-05-15',
    age: 34,
    gender: '男性',
    education: '大学卒業（情報工学科）',
    skills: ['React', 'TypeScript', 'AWS', 'Node.js', 'Docker'],
    specialties: ['フロントエンド開発', 'SPA構築', 'マイクロサービス'],
    selfPR: 'フロントエンド開発を中心に8年の経験があります。React/TypeScriptを用いた大規模SPAの設計・開発が得意です。',
    salesComment: 'フロントエンド領域のエキスパート。チームリードの経験もあり、技術力・コミュニケーション能力ともに優秀です。',
    lastUpdated: '2024-07-25',
    avatar: '/default-avatar.png',
  },
  {
    id: '2',
    initials: 'S.M',
    birthdate: '1988-11-22',
    age: 36,
    gender: '女性',
    education: '大学院卒業（コンピュータサイエンス専攻）',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS', 'Kubernetes'],
    specialties: ['バックエンド開発', 'マイクロサービス', 'データベース設計'],
    selfPR: 'バックエンド開発において10年以上の経験を持ち、大規模システムの設計・運用に携わってきました。',
    salesComment: 'バックエンドのスペシャリスト。アーキテクチャ設計から運用まで幅広く対応可能で、信頼性の高いエンジニアです。',
    lastUpdated: '2024-07-28',
    avatar: '/default-avatar.png',
  },
  {
    id: '3',
    initials: 'T.Y',
    birthdate: '1992-03-08',
    age: 32,
    gender: '男性',
    education: '専門学校卒業（情報システム科）',
    skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker'],
    specialties: ['フルスタック開発', 'API設計', 'データ分析'],
    selfPR: 'フルスタック開発者として、フロントエンドからバックエンドまで幅広く対応可能です。',
    salesComment: 'フルスタック開発者。幅広い技術スタックに対応でき、小規模〜中規模プロジェクトに最適です。',
    lastUpdated: '2024-07-30',
    avatar: '/default-avatar.png',
  },
  {
    id: '4',
    initials: 'M.R',
    birthdate: '1985-09-12',
    age: 39,
    gender: '男性',
    education: '大学卒業（経営情報学部）',
    skills: ['Vue.js', 'Nuxt.js', 'Firebase', 'GCP', 'TypeScript'],
    specialties: ['フロントエンド開発', 'UI/UX設計', 'プロジェクト管理'],
    selfPR: 'フロントエンド開発とプロジェクト管理の両方で経験を積んできました。チームをまとめることが得意です。',
    salesComment: 'フロントエンド技術とマネジメントスキルを併せ持つ貴重な人材。プロジェクトリーダーとしても活躍できます。',
    lastUpdated: '2024-07-26',
    avatar: '/default-avatar.png',
  },
  {
    id: '5',
    initials: 'K.A',
    birthdate: '1993-12-03',
    age: 31,
    gender: '女性',
    education: '大学卒業（数学科）',
    skills: ['Python', 'TensorFlow', 'scikit-learn', 'AWS', 'SQL'],
    specialties: ['機械学習', 'データ分析', 'AI開発'],
    selfPR: 'データサイエンスと機械学習の分野で5年の経験があります。ビジネス課題を技術で解決することにやりがいを感じています。',
    salesComment: 'データサイエンス領域のエキスパート。AI・機械学習案件において即戦力となる人材です。',
    lastUpdated: '2024-07-29',
    avatar: '/default-avatar.png',
  },
  {
    id: '6',
    initials: 'H.S',
    birthdate: '1989-07-18',
    age: 35,
    gender: '男性',
    education: '大学卒業（電子工学科）',
    skills: ['C#', '.NET Core', 'Azure', 'SQL Server', 'Blazor'],
    specialties: ['エンタープライズ開発', 'Webアプリケーション', 'クラウド移行'],
    selfPR: 'エンタープライズ向けシステム開発において豊富な経験があります。レガシーシステムの modernization も得意です。',
    salesComment: 'エンタープライズ開発のエキスパート。大規模な基幹システムの開発・移行案件に最適な人材です。',
    lastUpdated: '2024-07-27',
    avatar: '/default-avatar.png',
  },
];

// 問い合わせ情報
const contactInfo = {
  phone: '03-1234-5678',
  email: 'sales@orbit-engineering.com',
};

// 年齢計算関数
const calculateAge = (birthdate: string): number => {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// 日付フォーマット関数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const EngineerSummaryCard = ({ engineer }: { engineer: typeof mockAvailableEngineers[0] }) => (
  <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-l-success'>
    <div className='card-body p-6'>
      {/* ヘッダー部分 */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center space-x-4'>
          <div className='avatar'>
            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
              <span className='text-white text-xl font-bold'>{engineer.initials}</span>
            </div>
          </div>
          <div>
            <h3 className='text-xl font-bold text-gray-800'>{engineer.initials}</h3>
            <div className='badge badge-success badge-lg'>営業中</div>
          </div>
        </div>
        <div className='text-right text-sm text-gray-500'>
          最終更新: {formatDate(engineer.lastUpdated)}
        </div>
      </div>

      {/* 基本情報 */}
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className='space-y-2'>
          <div className='text-sm'>
            <span className='font-medium text-gray-600'>生年月日:</span>
            <span className='ml-2'>{formatDate(engineer.birthdate)}</span>
          </div>
          <div className='text-sm'>
            <span className='font-medium text-gray-600'>年齢:</span>
            <span className='ml-2'>{calculateAge(engineer.birthdate)}歳</span>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm'>
            <span className='font-medium text-gray-600'>性別:</span>
            <span className='ml-2'>{engineer.gender}</span>
          </div>
          <div className='text-sm'>
            <span className='font-medium text-gray-600'>最終学歴:</span>
            <span className='ml-2 text-xs'>{engineer.education}</span>
          </div>
        </div>
      </div>

      {/* 得意なスキル */}
      <div className='mb-4'>
        <h4 className='font-medium text-gray-700 mb-2'>得意なスキル</h4>
        <div className='flex flex-wrap gap-2'>
          {engineer.skills.map((skill, index) => (
            <span key={index} className='badge badge-outline badge-info'>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 得意分野 */}
      <div className='mb-4'>
        <h4 className='font-medium text-gray-700 mb-2'>得意分野</h4>
        <div className='flex flex-wrap gap-2'>
          {engineer.specialties.map((specialty, index) => (
            <span key={index} className='badge badge-primary badge-outline'>
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* 自己PR */}
      <div className='mb-4'>
        <h4 className='font-medium text-gray-700 mb-2'>自己PR</h4>
        <p className='text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg'>
          {engineer.selfPR}
        </p>
      </div>

      {/* 営業用コメント */}
      <div className='mb-6'>
        <h4 className='font-medium text-gray-700 mb-2'>営業用コメント</h4>
        <p className='text-sm text-gray-600 leading-relaxed bg-blue-50 p-3 rounded-lg border-l-4 border-l-primary'>
          {engineer.salesComment}
        </p>
      </div>

      {/* 問い合わせボタン */}
      <div className='flex gap-3'>
        <a
          href={`mailto:${contactInfo.email}?subject=エンジニア${engineer.initials}についてのお問い合わせ`}
          className='btn btn-primary flex-1'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
          </svg>
          メールで問い合わせ
        </a>
        <div className='btn btn-outline flex-1 cursor-default'>
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
          </svg>
          {contactInfo.phone}
        </div>
      </div>
    </div>
  </div>
);

export default function SummaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  // すべてのスキルを抽出
  const allSkills = Array.from(
    new Set(mockAvailableEngineers.flatMap(engineer => engineer.skills))
  ).sort();

  // フィルタリング
  const filteredEngineers = mockAvailableEngineers.filter(engineer => {
    const matchesSearch = engineer.initials.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         engineer.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkillFilter = !skillFilter || engineer.skills.includes(skillFilter);
    
    return matchesSearch && matchesSkillFilter;
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-200 to-base-300'>
      {/* ヘッダー */}
      <div className='navbar bg-base-100 shadow-lg'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
            営業中エンジニア サマリー
          </h1>
        </div>
        <div className='flex-none'>
          <div className='badge badge-success badge-lg'>
            {mockAvailableEngineers.length}名営業中
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        {/* コンタクト情報ヘッダー */}
        <div className='alert alert-info mb-8'>
          <div className='flex items-center space-x-2'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <span>お問い合わせ: メール {contactInfo.email} | 電話 {contactInfo.phone}</span>
          </div>
        </div>

        {/* フィルター */}
        <div className='card bg-base-100 shadow-lg mb-8'>
          <div className='card-body'>
            <h2 className='card-title mb-4'>検索・フィルター</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>キーワード検索</span>
                </label>
                <input
                  type='text'
                  className='input input-bordered'
                  placeholder='イニシャル、スキル、得意分野で検索...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>スキルフィルター</span>
                </label>
                <select
                  className='select select-bordered'
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                >
                  <option value=''>すべてのスキル</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* エンジニアカード一覧 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {filteredEngineers.map(engineer => (
            <EngineerSummaryCard key={engineer.id} engineer={engineer} />
          ))}
        </div>

        {/* 検索結果が空の場合 */}
        {filteredEngineers.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <p className='text-gray-600 text-lg'>該当するエンジニアが見つかりませんでした。</p>
            <p className='text-gray-500'>検索条件を変更してお試しください。</p>
          </div>
        )}
      </div>
    </div>
  );
}