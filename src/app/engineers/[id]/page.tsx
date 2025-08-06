import StatusBadge from '@/components/common/StatusBadge';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import {
  MdAccountCircle,
  MdArrowBack,
  MdCalendarToday,
  MdDownload,
  MdEdit,
  MdEmail,
} from 'react-icons/md';

// モックデータ
const mockUser = {
  name: '管理者',
  email: 'admin@example.com',
};

const mockEngineer = {
  id: 'a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab',
  name: '山田太郎',
  nameKana: 'ヤマダ タロウ',
  email: 'taro.yamada@example.com',
  birthDate: '1996年7月15日',
  age: 28,
  gender: '男',
  status: 'available' as const,
  joinDate: '2024年4月1日',
  endDate: '未設定',
  profileImage: undefined,
  mbti: {
    type: 'INTP-T',
    name: '論理学者',
    description: '論理的で独特な視点を持つ発明家',
    traits: [
      '一人でディベート',
      'アイデアや可能性について1日中熟考する',
      '考えすぎて行動を起こせない',
    ],
    positiveKeywords: [
      'ユニーク',
      '独創性',
      '想像力',
      '好奇心旺盛',
      '控えめ',
      '客観的',
      'パターン分析',
    ],
    negativeKeywords: [
      '面倒くさがり屋',
      '警戒心',
      '一人の時間',
      '怖いもの知らず',
    ],
  },
  skills: [
    { category: '言語', items: ['JavaScript', 'TypeScript', 'Python'] },
    { category: 'フレームワーク', items: ['React', 'Next.js', 'Vue.js'] },
    { category: 'データベース', items: ['MySQL', 'PostgreSQL'] },
    { category: 'その他', items: ['AWS', 'Docker', 'Git'] },
  ],
  qualifications: [
    {
      name: 'ITパスポート',
      obtainedDate: '2020年3月',
      isNational: true,
    },
    {
      name: '基本情報技術者試験',
      obtainedDate: '2021年10月',
      isNational: true,
    },
  ],
  careerHistory: [
    {
      company: 'ABC株式会社',
      position: '開発エンジニア',
      startDate: '2019年4月1日',
      endDate: '現在',
      processes: [
        '要件定義',
        '基本設計',
        '詳細設計',
        'プログラミング',
        'テスト',
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    },
  ],
};

interface PageProps {
  params: { id: string };
}

export default function EngineerDetailPage({ params }: PageProps) {
  return (
    <Layout user={mockUser} userRole='admin'>
      <div className='space-y-6'>
        {/* ヘッダー */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/engineers' className='btn btn-ghost btn-circle'>
              <MdArrowBack className='h-5 w-5' />
            </Link>
            <div>
              <h1 className='text-2xl font-bold text-neutral'>
                エンジニア詳細
              </h1>
              <p className='text-base-content/70'>ID: {mockEngineer.id}</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <button className='btn btn-outline'>
              <MdEdit className='h-4 w-4' />
              編集
            </button>
            <button className='btn btn-primary'>
              <MdDownload className='h-4 w-4' />
              PDF出力
            </button>
          </div>
        </div>

        {/* プロフィール情報 */}
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body p-6'>
            <div className='flex flex-col lg:flex-row gap-6'>
              {/* プロフィール画像 */}
              <div className='flex justify-center lg:justify-start'>
                <div className='avatar'>
                  <div className='w-32 h-32 rounded-full'>
                    {mockEngineer.profileImage ? (
                      <img
                        src={mockEngineer.profileImage}
                        alt={`${mockEngineer.name}のプロフィール画像`}
                        className='rounded-full object-cover'
                      />
                    ) : (
                      <MdAccountCircle className='w-32 h-32 text-base-content/30' />
                    )}
                  </div>
                </div>
              </div>

              {/* 基本情報 */}
              <div className='flex-1'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h2 className='text-3xl font-bold text-neutral mb-1'>
                      {mockEngineer.name}
                    </h2>
                    <p className='text-lg text-base-content/70 mb-2'>
                      {mockEngineer.nameKana}
                    </p>
                    <StatusBadge status={mockEngineer.status} size='lg' />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-center gap-2 text-sm'>
                    <MdEmail className='h-4 w-4 text-base-content/50' />
                    <span>{mockEngineer.email}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <MdCalendarToday className='h-4 w-4 text-base-content/50' />
                    <span>生年月日: {mockEngineer.birthDate}</span>
                  </div>
                  <div className='text-sm'>
                    <span className='text-base-content/70'>年齢: </span>
                    <span className='font-medium'>{mockEngineer.age}歳</span>
                  </div>
                  <div className='text-sm'>
                    <span className='text-base-content/70'>性別: </span>
                    <span className='font-medium'>{mockEngineer.gender}</span>
                  </div>
                  <div className='text-sm'>
                    <span className='text-base-content/70'>受講開始日: </span>
                    <span className='font-medium'>{mockEngineer.joinDate}</span>
                  </div>
                  <div className='text-sm'>
                    <span className='text-base-content/70'>
                      受講終了予定日:{' '}
                    </span>
                    <span className='font-medium'>{mockEngineer.endDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MBTI情報 */}
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body p-6'>
            <h3 className='text-2xl font-bold text-neutral mb-4'>MBTI</h3>

            <div className='mb-6'>
              <div className='flex items-center gap-4 mb-3'>
                <h4 className='text-3xl font-bold text-primary'>
                  {mockEngineer.mbti.type}
                </h4>
                <div className='badge badge-primary badge-lg'>
                  {mockEngineer.mbti.name}
                </div>
              </div>
              <p className='text-lg text-base-content/80'>
                {mockEngineer.mbti.description}
              </p>
            </div>

            <div className='mb-6'>
              <h5 className='text-lg font-semibold text-neutral mb-3'>特徴</h5>
              <ul className='list-disc list-inside space-y-1'>
                {mockEngineer.mbti.traits.map((trait, index) => (
                  <li key={index} className='text-base-content/80'>
                    {trait}
                  </li>
                ))}
              </ul>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h5 className='text-lg font-semibold text-success mb-3'>
                  ポジティブキーワード
                </h5>
                <div className='flex flex-wrap gap-2'>
                  {mockEngineer.mbti.positiveKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className='badge badge-success badge-outline'
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className='text-lg font-semibold text-warning mb-3'>
                  ネガティブキーワード
                </h5>
                <div className='flex flex-wrap gap-2'>
                  {mockEngineer.mbti.negativeKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className='badge badge-warning badge-outline'
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* スキル情報 */}
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body p-6'>
            <h3 className='text-2xl font-bold text-neutral mb-4'>スキル</h3>

            <div className='alert alert-info mb-4'>
              <span className='text-sm'>
                工程中のため、スキル情報を表示できません
              </span>
            </div>
          </div>
        </div>

        {/* 保有資格 */}
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body p-6'>
            <h3 className='text-2xl font-bold text-neutral mb-4'>保有資格</h3>

            <div className='space-y-3'>
              {mockEngineer.qualifications.map((qualification, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-base-200 rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <div className='badge badge-primary badge-sm'>
                      {qualification.isNational ? '国家資格' : '民間資格'}
                    </div>
                    <span className='font-medium'>{qualification.name}</span>
                  </div>
                  <span className='text-sm text-base-content/70'>
                    取得: {qualification.obtainedDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 学歴・職歴 */}
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body p-6'>
            <h3 className='text-2xl font-bold text-neutral mb-4'>学歴・職歴</h3>

            <div className='space-y-4'>
              {mockEngineer.careerHistory.map((career, index) => (
                <div key={index} className='border-l-4 border-primary pl-4'>
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2'>
                    <div>
                      <h4 className='text-lg font-semibold text-neutral'>
                        {career.company} - {career.position}
                      </h4>
                      <p className='text-sm text-base-content/70'>
                        {career.startDate} - {career.endDate}
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
                    <div>
                      <h5 className='font-medium text-neutral mb-2'>
                        担当工程
                      </h5>
                      <div className='flex flex-wrap gap-1'>
                        {career.processes.map((process, idx) => (
                          <div
                            key={idx}
                            className='badge badge-outline badge-sm'
                          >
                            {process}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className='font-medium text-neutral mb-2'>
                        使用技術
                      </h5>
                      <div className='flex flex-wrap gap-1'>
                        {career.technologies.map((tech, idx) => (
                          <div
                            key={idx}
                            className='badge badge-primary badge-sm'
                          >
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
