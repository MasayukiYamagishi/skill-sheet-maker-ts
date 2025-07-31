import Layout from '@/components/layout/Layout';
import UserCard from '@/components/users/UserCard';
import {
  MdDownload,
  MdFilterList,
  MdPersonAdd,
  MdSearch,
} from 'react-icons/md';

// モックデータ
const mockUser = {
  name: '管理者',
  email: 'admin@example.com',
};

const mockEngineers = [
  {
    id: '1',
    name: '山田太郎',
    email: 'taro.yamada@example.com',
    status: 'available' as const,
    lastUpdated: '2024/07/31',
    profileImage: undefined,
  },
  {
    id: '2',
    name: '鈴木花子',
    email: 'hanako.suzuki@example.com',
    status: 'inProject' as const,
    lastUpdated: '2024/07/30',
    profileImage: undefined,
  },
  {
    id: '3',
    name: '田中次郎',
    email: 'jiro.tanaka@example.com',
    status: 'available' as const,
    lastUpdated: '2024/07/29',
    profileImage: undefined,
  },
  {
    id: '4',
    name: '佐藤三郎',
    email: 'saburo.sato@example.com',
    status: 'onLeave' as const,
    lastUpdated: '2024/07/25',
    profileImage: undefined,
  },
];

export default function EngineersPage() {
  const handlePdfExport = (userId: string) => {
    console.log(`PDF出力: ${userId}`);
    // 実際のPDF出力処理はここに実装
  };

  const handleBulkPdfExport = () => {
    console.log('一括PDF出力');
    // 実際の一括PDF出力処理はここに実装
  };

  return (
    <Layout user={mockUser} userRole='admin'>
      <div className='space-y-6'>
        {/* ページヘッダー */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-neutral'>エンジニア一覧</h1>
            <p className='text-base-content/70 mt-1'>
              登録されているエンジニアの管理
            </p>
          </div>

          {/* アクションボタン */}
          <div className='flex items-center gap-2'>
            <button className='btn btn-outline btn-sm'>
              <MdDownload className='h-4 w-4' />
              CSV出力
            </button>
            <button
              className='btn btn-primary btn-sm'
              onClick={handleBulkPdfExport}
            >
              <MdDownload className='h-4 w-4' />
              一括PDF
            </button>
            <button className='btn btn-primary'>
              <MdPersonAdd className='h-5 w-5' />
              新規登録
            </button>
          </div>
        </div>

        {/* 検索・フィルターエリア */}
        <div className='card bg-base-100 shadow-lg'>
          <div className='card-body p-4'>
            <div className='flex flex-col lg:flex-row gap-4'>
              {/* 検索バー */}
              <div className='flex-1'>
                <div className='relative'>
                  <MdSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50' />
                  <input
                    type='text'
                    placeholder='名前、メールアドレスで検索...'
                    className='input input-bordered w-full pl-10'
                  />
                </div>
              </div>

              {/* フィルター */}
              <div className='flex flex-wrap gap-3'>
                <select className='select select-bordered select-sm'>
                  <option>すべての状態</option>
                  <option>営業中</option>
                  <option>案件中</option>
                  <option>休職中</option>
                  <option>退職済み</option>
                </select>

                <select className='select select-bordered select-sm'>
                  <option>すべてのスキル</option>
                  <option>JavaScript</option>
                  <option>TypeScript</option>
                  <option>React</option>
                  <option>Vue.js</option>
                  <option>Python</option>
                </select>

                <button className='btn btn-ghost btn-sm'>
                  <MdFilterList className='h-4 w-4' />
                  高度な検索
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 一括操作エリア */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <label className='label cursor-pointer'>
              <input type='checkbox' className='checkbox checkbox-sm' />
              <span className='label-text ml-2'>全選択</span>
            </label>
            <div className='text-sm text-base-content/70'>
              {mockEngineers.length}件中 {mockEngineers.length}件を表示
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <button className='btn btn-ghost btn-sm' disabled>
              選択した項目をPDF出力
            </button>
          </div>
        </div>

        {/* エンジニアリスト */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4'>
          {mockEngineers.map((engineer) => (
            <div key={engineer.id} className='flex items-center gap-3'>
              <input type='checkbox' className='checkbox checkbox-sm' />
              <div className='flex-1'>
                <UserCard
                  user={engineer}
                  showActions={true}
                  onPdfExport={handlePdfExport}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ページネーション */}
        <div className='flex justify-center'>
          <div className='join'>
            <button className='join-item btn btn-outline'>«</button>
            <button className='join-item btn btn-outline'>前へ</button>
            <button className='join-item btn btn-active'>1</button>
            <button className='join-item btn btn-outline'>2</button>
            <button className='join-item btn btn-outline'>3</button>
            <button className='join-item btn btn-outline'>次へ</button>
            <button className='join-item btn btn-outline'>»</button>
          </div>
        </div>

        {/* フッター統計 */}
        <div className='stats stats-horizontal shadow-lg'>
          <div className='stat'>
            <div className='stat-title'>総エンジニア数</div>
            <div className='stat-value text-primary'>
              {mockEngineers.length}
            </div>
          </div>
          <div className='stat'>
            <div className='stat-title'>営業中</div>
            <div className='stat-value text-success'>
              {mockEngineers.filter((e) => e.status === 'available').length}
            </div>
          </div>
          <div className='stat'>
            <div className='stat-title'>案件中</div>
            <div className='stat-value text-info'>
              {mockEngineers.filter((e) => e.status === 'inProject').length}
            </div>
          </div>
          <div className='stat'>
            <div className='stat-title'>その他</div>
            <div className='stat-value text-warning'>
              {
                mockEngineers.filter(
                  (e) => e.status === 'onLeave' || e.status === 'retired'
                ).length
              }
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
