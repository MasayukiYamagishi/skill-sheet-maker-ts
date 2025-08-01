'use client';

import { useState } from 'react';
import Link from 'next/link';

// モックデータ
const mockUser = {
  id: '1',
  name: '山田太郎',
  email: 'yamada@example.com',
  avatar: '/default-avatar.png',
  status: 'available',
  completionRate: 80,
  lastUpdated: '2024-07-15'
};

const mockActivities = [
  {
    id: 1,
    type: 'profile_update',
    description: 'プロフィール情報を更新しました',
    date: '2024-07-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'skill_add',
    description: 'React Native のスキルを追加しました',
    date: '2024-07-12T14:20:00Z'
  },
  {
    id: 3,
    type: 'qualification_add',
    description: 'AWS Solutions Architect の資格を追加しました',
    date: '2024-07-10T09:15:00Z'
  },
  {
    id: 4,
    type: 'career_update',
    description: '現在の業務経歴を更新しました',
    date: '2024-07-08T16:45:00Z'
  }
];

const mockMissingItems = [
  { item: 'プロフィール画像', description: 'プロフィール画像をアップロードしてください' },
  { item: 'MBTI診断', description: '性格診断を完了してください' },
  { item: '業務経歴', description: '詳細な業務経歴を追加してください' }
];

const mockStats = {
  totalSkills: 12,
  totalQualifications: 3,
  totalProjects: 5,
  experienceYears: 4
};

export default function MyProfilePage() {
  const [showMissingItems, setShowMissingItems] = useState(true);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile_update':
        return (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'skill_add':
        return (
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'qualification_add':
        return (
          <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        );
      case 'career_update':
        return (
          <div className="w-8 h-8 bg-info rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* ウェルカムメッセージ */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          こんにちは、{mockUser.name}さん
        </h1>
        <p className="text-gray-600 mt-2">
          最終更新: {new Date(mockUser.lastUpdated).toLocaleDateString('ja-JP')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム - メイン情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* プロフィール完成度 */}
          <div className="card bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-white">プロフィール完成度</h2>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-white mb-2">
                    {mockUser.completionRate}%
                  </div>
                  <progress 
                    className="progress progress-primary bg-white/30 w-full" 
                    value={mockUser.completionRate} 
                    max="100"
                  ></progress>
                </div>
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={() => setShowMissingItems(!showMissingItems)}
                >
                  不足項目を確認する
                </button>
              </div>
            </div>
          </div>

          {/* 不足項目（条件付き表示） */}
          {showMissingItems && mockMissingItems.length > 0 && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">
                  <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.793-1.256 2.793-2.793 0-.886-.365-1.695-.953-2.275L16.5 9.793c-.536-.896-1.676-1.195-2.556-.67L12 10.793l-1.944-1.67c-.88-.525-2.02-.226-2.556.67L5.5 13.732c-.588.58-.953 1.389-.953 2.275C4.547 17.744 5.803 19 7.343 19z" />
                  </svg>
                  完了していない項目
                </h3>
                <div className="space-y-3">
                  {mockMissingItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.item}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setShowMissingItems(false)}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 統計情報 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat bg-base-100 rounded-lg shadow-lg p-4">
              <div className="stat-title text-xs">スキル数</div>
              <div className="stat-value text-2xl text-primary">{mockStats.totalSkills}</div>
            </div>
            <div className="stat bg-base-100 rounded-lg shadow-lg p-4">
              <div className="stat-title text-xs">資格数</div>
              <div className="stat-value text-2xl text-success">{mockStats.totalQualifications}</div>
            </div>
            <div className="stat bg-base-100 rounded-lg shadow-lg p-4">
              <div className="stat-title text-xs">プロジェクト</div>
              <div className="stat-value text-2xl text-info">{mockStats.totalProjects}</div>
            </div>
            <div className="stat bg-base-100 rounded-lg shadow-lg p-4">
              <div className="stat-title text-xs">経験年数</div>
              <div className="stat-value text-2xl text-warning">{mockStats.experienceYears}年</div>
            </div>
          </div>

          {/* 最近の活動 */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">最近の活動</h3>
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右カラム - クイックアクション */}
        <div className="space-y-6">
          {/* プロフィール概要 */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="avatar mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-lg">{mockUser.name}</h3>
              <p className="text-gray-600 text-sm">{mockUser.email}</p>
              <div className="mt-3">
                <div className="badge badge-success badge-sm">
                  {mockUser.status === 'available' ? '営業中' : 'その他'}
                </div>
              </div>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <Link 
                  href="/engineers/edit/1" 
                  className="btn btn-primary btn-block justify-start"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  プロフィール編集
                </Link>
                
                <button className="btn btn-outline btn-block justify-start">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  スキル追加
                </button>
                
                <button className="btn btn-outline btn-block justify-start">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  資格追加
                </button>
                
                <Link 
                  href="/engineers/1" 
                  className="btn btn-outline btn-block justify-start"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  プレビュー表示
                </Link>
                
                <button className="btn btn-outline btn-block justify-start">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF出力
                </button>
              </div>
            </div>
          </div>

          {/* ヘルプ・サポート */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-sm">ヘルプ・サポート</h3>
              <div className="space-y-2">
                <button className="btn btn-ghost btn-sm btn-block justify-start text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  よくある質問
                </button>
                <button className="btn btn-ghost btn-sm btn-block justify-start text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  お問い合わせ
                </button>
                <button className="btn btn-ghost btn-sm btn-block justify-start text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ユーザーガイド
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}