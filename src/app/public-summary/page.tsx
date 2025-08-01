'use client';

import { useState } from 'react';
import Link from 'next/link';

// モックデータ
const mockEngineers = [
  {
    id: '1',
    name: '田中',
    status: 'available',
    skills: ['React', 'AWS', 'TypeScript'],
    avatar: '/default-avatar.png'
  },
  {
    id: '2',
    name: '佐藤',
    status: 'available',
    skills: ['Vue', 'AWS', 'Python'],
    avatar: '/default-avatar.png'
  },
  {
    id: '3',
    name: '高橋',
    status: 'available',
    skills: ['Node.js', 'React', 'Docker'],
    avatar: '/default-avatar.png'
  },
  {
    id: '4',
    name: '山田',
    status: 'inProject',
    skills: ['Java', 'Spring', 'MySQL'],
    avatar: '/default-avatar.png'
  },
  {
    id: '5',
    name: '松本',
    status: 'available',
    skills: ['PHP', 'Laravel', 'Vue'],
    avatar: '/default-avatar.png'
  },
  {
    id: '6',
    name: '鈴木',
    status: 'inProject',
    skills: ['C#', '.NET', 'Azure'],
    avatar: '/default-avatar.png'
  }
];

const mockStats = {
  totalEngineers: 50,
  availableEngineers: 12,
  utilizationRate: 76
};

export default function PublicSummaryPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('');

  // スキルの一覧を取得
  const allSkills = Array.from(
    new Set(mockEngineers.flatMap(engineer => engineer.skills))
  ).sort();

  // フィルタリング
  const filteredEngineers = mockEngineers.filter(engineer => {
    const statusMatch = selectedStatus === 'all' || engineer.status === selectedStatus;
    const skillMatch = !selectedSkill || engineer.skills.includes(selectedSkill);
    return statusMatch && skillMatch;
  });

  // ステータス別にグループ化
  const engineersByStatus = {
    available: filteredEngineers.filter(e => e.status === 'available'),
    inProject: filteredEngineers.filter(e => e.status === 'inProject'),
    onLeave: filteredEngineers.filter(e => e.status === 'onLeave'),
    retired: filteredEngineers.filter(e => e.status === 'retired')
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return '営業中';
      case 'inProject': return '案件中';
      case 'onLeave': return '休職中';
      case 'retired': return '退職済み';
      default: return status;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available': return 'badge-success';
      case 'inProject': return 'badge-info';
      case 'onLeave': return 'badge-warning';
      case 'retired': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const EngineerCard = ({ engineer }: { engineer: typeof mockEngineers[0] }) => (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body p-4">
        {/* プロフィール画像と名前 */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{engineer.name}</h3>
            <div className={`badge badge-sm ${getStatusBadgeClass(engineer.status)}`}>
              {getStatusLabel(engineer.status)}
            </div>
          </div>
        </div>
        
        {/* スキル */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">主要スキル</p>
          <div className="flex flex-wrap gap-1">
            {engineer.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="badge badge-outline badge-sm">
                {skill}
              </span>
            ))}
            {engineer.skills.length > 3 && (
              <span className="badge badge-outline badge-sm">
                +{engineer.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* ヘッダー */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">Orbit - エンジニアサマリ</h1>
        </div>
        <div className="flex-none">
          <Link href="/login" className="btn btn-primary">
            ログイン
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-title">登録エンジニア</div>
            <div className="stat-value text-primary">{mockStats.totalEngineers}名</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-title">営業中</div>
            <div className="stat-value text-success">{mockStats.availableEngineers}名</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-title">稼働率</div>
            <div className="stat-value text-info">{mockStats.utilizationRate}%</div>
          </div>
        </div>

        {/* フィルター */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">フィルター</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ステータスフィルター */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ステータス</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">すべて</option>
                  <option value="available">営業中</option>
                  <option value="inProject">案件中</option>
                  <option value="onLeave">休職中</option>
                  <option value="retired">退職済み</option>
                </select>
              </div>

              {/* スキルフィルター */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">スキル</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="">すべてのスキル</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* カンバン形式表示（デスクトップ） */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-6">
            {/* 営業中 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">営業中</h2>
                <div className="badge badge-success">{engineersByStatus.available.length}</div>
              </div>
              <div className="space-y-3">
                {engineersByStatus.available.map(engineer => (
                  <EngineerCard key={engineer.id} engineer={engineer} />
                ))}
              </div>
            </div>

            {/* 案件中 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">案件中</h2>
                <div className="badge badge-info">{engineersByStatus.inProject.length}</div>
              </div>
              <div className="space-y-3">
                {engineersByStatus.inProject.map(engineer => (
                  <EngineerCard key={engineer.id} engineer={engineer} />
                ))}
              </div>
            </div>

            {/* 休職中 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">休職中</h2>
                <div className="badge badge-warning">{engineersByStatus.onLeave.length}</div>
              </div>
              <div className="space-y-3">
                {engineersByStatus.onLeave.map(engineer => (
                  <EngineerCard key={engineer.id} engineer={engineer} />
                ))}
              </div>
            </div>

            {/* 退職済み */}
            <div className="space-y-4">  
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">退職済み</h2>
                <div className="badge badge-error">{engineersByStatus.retired.length}</div>
              </div>
              <div className="space-y-3">
                {engineersByStatus.retired.map(engineer => (
                  <EngineerCard key={engineer.id} engineer={engineer} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* グリッド表示（モバイル・タブレット） */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEngineers.map(engineer => (
              <EngineerCard key={engineer.id} engineer={engineer} />
            ))}
          </div>
        </div>

        {/* エンジニアが見つからない場合 */}
        {filteredEngineers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-gray-600">該当するエンジニアが見つかりませんでした。</p>
            <p className="text-gray-500 text-sm">フィルター条件を変更してお試しください。</p>
          </div>
        )}
      </div>
    </div>    
  );
}