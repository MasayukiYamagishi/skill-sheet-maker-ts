import StatCard from '@/components/common/StatCard';
import Layout from '@/components/layout/Layout';
import { SIZES } from '@/constants/styles';
import { STATS_LABELS } from '@/constants/ui';
import {
  MdBarChart,
  MdNotifications,
  MdPeople,
  MdPersonAdd,
} from 'react-icons/md';

// モックデータ
const mockUser = {
  name: '管理者',
  email: 'admin@example.com',
};

const mockStats = [
  {
    title: STATS_LABELS.totalEngineers,
    value: 120,
    change: 15,
    trend: 'up' as const,
    icon: <MdPeople className={SIZES.iconXl} />,
  },
  {
    title: STATS_LABELS.available,
    value: 28,
    change: 5,
    trend: 'up' as const,
    icon: <MdPersonAdd className={SIZES.iconXl} />,
  },
  {
    title: STATS_LABELS.utilizationRate,
    value: '85%',
    change: -2,
    trend: 'down' as const,
    icon: <MdBarChart className={SIZES.iconXl} />,
  },
];

const mockActivities = [
  {
    id: 1,
    message: '山田太郎さんがプロフィールを更新しました',
    time: '2時間前',
    type: 'update',
  },
  {
    id: 2,
    message: '新規エンジニア2名が登録されました',
    time: '5時間前',
    type: 'new',
  },
  {
    id: 3,
    message: '鈴木花子さんがスキル情報を追加しました',
    time: '1日前',
    type: 'update',
  },
  {
    id: 4,
    message: '田中次郎さんのステータスが「案件中」に更新されました',
    time: '2日前',
    type: 'status',
  },
];

export default function HomePage() {
  return (
    <Layout user={mockUser} userRole='admin'>
      <div className='space-y-6'>
        {/* ページヘッダー */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-neutral'>Dashboard</h1>
            <p className='text-base-content/70 mt-1'>
              エンジニア管理システムの概要
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='badge badge-primary badge-sm'>最新</div>
          </div>
        </div>

        {/* 統計カード */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {mockStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* メインコンテンツエリア */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* エンジニア数推移グラフ */}
          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body'>
              <h2 className='card-title text-neutral mb-4'>エンジニア数推移</h2>

              {/* グラフエリア（プレースホルダー） */}
              <div className='h-64 bg-base-200 rounded-lg flex items-center justify-center'>
                <div className='text-center'>
                  <MdBarChart className='h-16 w-16 text-base-content/30 mx-auto mb-2' />
                  <p className='text-base-content/50'>グラフエリア</p>
                  <p className='text-sm text-base-content/40'>（実装予定）</p>
                </div>
              </div>

              {/* 期間選択タブ */}
              <div className='tabs tabs-boxed mt-4'>
                <a className='tab tab-active'>1ヶ月</a>
                <a className='tab'>3ヶ月</a>
                <a className='tab'>6ヶ月</a>
                <a className='tab'>1年</a>
              </div>
            </div>
          </div>

          {/* 最近の活動 */}
          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='card-title text-neutral'>最近の活動</h2>
                <MdNotifications className='h-5 w-5 text-base-content/50' />
              </div>

              <div className='space-y-3'>
                {mockActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className='flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors'
                  >
                    <div className='w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0'></div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm text-neutral leading-relaxed'>
                        {activity.message}
                      </p>
                      <p className='text-xs text-base-content/50 mt-1'>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-4'>
                <button className='btn btn-ghost btn-sm w-full'>
                  すべて表示
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 追加情報カード */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* クイックアクション */}
          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body'>
              <h2 className='card-title text-neutral mb-4'>
                クイックアクション
              </h2>
              <div className='grid grid-cols-2 gap-3'>
                <button className='btn btn-outline btn-primary'>
                  <MdPersonAdd className='h-4 w-4' />
                  新規登録
                </button>
                <button className='btn btn-outline btn-secondary'>
                  <MdBarChart className='h-4 w-4' />
                  レポート
                </button>
                <button className='btn btn-outline'>CSV出力</button>
                <button className='btn btn-outline'>設定</button>
              </div>
            </div>
          </div>

          {/* システム情報 */}
          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body'>
              <h2 className='card-title text-neutral mb-4'>システム情報</h2>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-base-content/70'>最終データ更新</span>
                  <span className='font-medium'>2024/07/31 14:30</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-base-content/70'>バックアップ</span>
                  <span className='font-medium text-success'>正常</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-base-content/70'>システム状態</span>
                  <span className='font-medium text-success'>稼働中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
