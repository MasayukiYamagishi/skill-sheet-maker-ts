'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // フォームデータ
  const [systemSettings, setSystemSettings] = useState({
    companyName: '株式会社サンプル',
    logoImage: null as File | null,
    theme: 'light',
    language: 'ja',
    timezone: 'Asia/Tokyo',
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
  });

  const handleSystemSettingChange = (field: string, value: any) => {
    setSystemSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBackupSettingChange = (field: string, value: any) => {
    setBackupSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    // ここで実際の保存処理を行う
    setTimeout(() => {
      setIsLoading(false);
      // 成功メッセージ表示など
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSystemSettingChange('logoImage', file);
    }
  };

  const renderUsersTab = () => (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>ユーザー管理</h3>

      {/* 一括操作 */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <h4 className='card-title text-base'>一括操作</h4>
          <p className='text-sm text-gray-600 mb-4'>
            ユーザー情報のインポート・エクスポートを行います
          </p>
          <div className='flex flex-wrap gap-3'>
            <button className='btn btn-outline'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
                />
              </svg>
              CSVインポート
            </button>
            <button className='btn btn-outline'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                />
              </svg>
              CSVエクスポート
            </button>
          </div>
        </div>
      </div>

      {/* 権限設定 */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <h4 className='card-title text-base'>権限設定</h4>
          <p className='text-sm text-gray-600 mb-4'>
            管理者権限の追加・変更を行います
          </p>

          {/* 管理者一覧 */}
          <div className='overflow-x-auto'>
            <table className='table table-zebra'>
              <thead>
                <tr>
                  <th>名前</th>
                  <th>メールアドレス</th>
                  <th>権限</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className='font-medium'>管理者太郎</div>
                  </td>
                  <td>admin@example.com</td>
                  <td>
                    <div className='badge badge-error'>スーパー管理者</div>
                  </td>
                  <td>
                    <button className='btn btn-ghost btn-xs' disabled>
                      編集不可
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='font-medium'>営業花子</div>
                  </td>
                  <td>sales@example.com</td>
                  <td>
                    <div className='badge badge-warning'>一般管理者</div>
                  </td>
                  <td>
                    <button className='btn btn-ghost btn-xs'>権限変更</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='card-actions justify-end mt-4'>
            <button className='btn btn-primary btn-sm'>管理者追加</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>システム設定</h3>

      {/* アプリケーション設定 */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <h4 className='card-title text-base'>アプリケーション設定</h4>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* 会社名 */}
            <div className='form-control'>
              <label className='form-label'>
                <span className='label-text'>会社名</span>
              </label>
              <input
                type='text'
                className='form-input'
                value={systemSettings.companyName}
                onChange={(e) =>
                  handleSystemSettingChange('companyName', e.target.value)
                }
              />
            </div>

            {/* テーマ */}
            <div className='form-control'>
              <label className='form-label'>
                <span className='label-text'>テーマ</span>
              </label>
              <select
                className='form-input'
                value={systemSettings.theme}
                onChange={(e) =>
                  handleSystemSettingChange('theme', e.target.value)
                }
              >
                <option value='light'>ライト</option>
                <option value='dark'>ダーク</option>
                <option value='auto'>自動</option>
              </select>
            </div>

            {/* 言語 */}
            <div className='form-control'>
              <label className='form-label'>
                <span className='label-text'>言語</span>
              </label>
              <select
                className='form-input'
                value={systemSettings.language}
                onChange={(e) =>
                  handleSystemSettingChange('language', e.target.value)
                }
              >
                <option value='ja'>日本語</option>
                <option value='en'>English</option>
              </select>
            </div>

            {/* タイムゾーン */}
            <div className='form-control'>
              <label className='form-label'>
                <span className='label-text'>タイムゾーン</span>
              </label>
              <select
                className='form-input'
                value={systemSettings.timezone}
                onChange={(e) =>
                  handleSystemSettingChange('timezone', e.target.value)
                }
              >
                <option value='Asia/Tokyo'>Asia/Tokyo (JST)</option>
                <option value='UTC'>UTC</option>
                <option value='America/New_York'>America/New_York (EST)</option>
              </select>
            </div>
          </div>

          {/* ロゴ画像 */}
          <div className='form-control'>
            <label className='form-label'>
              <span className='label-text'>ロゴ画像</span>
            </label>
            <input
              type='file'
              className='file-input file-input-bordered'
              accept='image/*'
              onChange={handleFileUpload}
            />
            <div className='label'>
              <span className='label-text-alt'>
                推奨サイズ: 200x50px, PNG/JPG形式
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* メール設定 */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <h4 className='card-title text-base'>メール設定</h4>
          <p className='text-sm text-gray-600 mb-4'>
            システムから送信されるメールの設定を行います
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='form-control'>
              <label className='form-label'>
                <span className='label-text'>SMTPサーバー</span>
              </label>
              <input
                type='text'
                className='form-input'
                placeholder='smtp.example.com'
              />
            </div>

            <div className='form-control'>
              <label className='form-label'>
                <span className='label-text'>ポート</span>
              </label>
              <input type='number' className='form-input' placeholder='587' />
            </div>

            <div className='form-control'>
              <label className='form-label'>
                <span className='label-text'>ユーザー名</span>
              </label>
              <input
                type='text'
                className='form-input'
                placeholder='your-email@example.com'
              />
            </div>

            <div className='form-control'>
              <label className='form-label'>
                <span className='label-text'>パスワード</span>
              </label>
              <input
                type='password'
                className='form-input'
                placeholder='••••••••'
              />
            </div>
          </div>

          <div className='card-actions justify-end mt-4'>
            <button className='btn btn-outline btn-sm'>テストメール送信</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>バックアップ設定</h3>

      {/* 自動バックアップ設定 */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <h4 className='card-title text-base'>自動バックアップ</h4>

          <div className='form-control'>
            <label className='label cursor-pointer justify-start space-x-3'>
              <input
                type='checkbox'
                className='checkbox'
                checked={backupSettings.autoBackup}
                onChange={(e) =>
                  handleBackupSettingChange('autoBackup', e.target.checked)
                }
              />
              <span className='label-text'>自動バックアップを有効にする</span>
            </label>
          </div>

          {backupSettings.autoBackup && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
              <div className='form-control'>
                <label className='form-label'>
                  <span className='label-text'>バックアップ頻度</span>
                </label>
                <select
                  className='form-input'
                  value={backupSettings.backupFrequency}
                  onChange={(e) =>
                    handleBackupSettingChange('backupFrequency', e.target.value)
                  }
                >
                  <option value='daily'>毎日</option>
                  <option value='weekly'>毎週</option>
                  <option value='monthly'>毎月</option>
                </select>
              </div>

              <div className='form-control'>
                <label className='form-label'>
                  <span className='label-text'>保持期間（日）</span>
                </label>
                <input
                  type='number'
                  className='form-input'
                  value={backupSettings.retentionDays}
                  onChange={(e) =>
                    handleBackupSettingChange(
                      'retentionDays',
                      parseInt(e.target.value)
                    )
                  }
                  min='1'
                  max='365'
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 手動バックアップ */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <h4 className='card-title text-base'>手動バックアップ</h4>
          <p className='text-sm text-gray-600 mb-4'>
            必要に応じて手動でバックアップを作成できます
          </p>

          <div className='card-actions justify-start'>
            <button className='btn btn-primary'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12'
                />
              </svg>
              今すぐバックアップ
            </button>
          </div>
        </div>
      </div>

      {/* バックアップ履歴 */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <h4 className='card-title text-base'>バックアップ履歴</h4>

          <div className='overflow-x-auto'>
            <table className='table table-zebra'>
              <thead>
                <tr>
                  <th>作成日時</th>
                  <th>種類</th>
                  <th>サイズ</th>
                  <th>ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024-07-15 02:00:00</td>
                  <td>
                    <div className='badge badge-primary'>自動</div>
                  </td>
                  <td>125.3 MB</td>
                  <td>
                    <div className='badge badge-success'>完了</div>
                  </td>
                  <td>
                    <button className='btn btn-ghost btn-xs'>
                      ダウンロード
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>2024-07-14 02:00:00</td>
                  <td>
                    <div className='badge badge-primary'>自動</div>
                  </td>
                  <td>123.1 MB</td>
                  <td>
                    <div className='badge badge-success'>完了</div>
                  </td>
                  <td>
                    <button className='btn btn-ghost btn-xs'>
                      ダウンロード
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>2024-07-13 14:30:00</td>
                  <td>
                    <div className='badge badge-secondary'>手動</div>
                  </td>
                  <td>122.8 MB</td>
                  <td>
                    <div className='badge badge-success'>完了</div>
                  </td>
                  <td>
                    <button className='btn btn-ghost btn-xs'>
                      ダウンロード
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>ログ管理</h3>

      {/* ログレベル設定 */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <h4 className='card-title text-base'>ログレベル設定</h4>

          <div className='form-control'>
            <label className='form-label'>
              <span className='label-text'>ログレベル</span>
            </label>
            <select className='form-input'>
              <option value='debug'>DEBUG</option>
              <option value='info' selected>
                INFO
              </option>
              <option value='warning'>WARNING</option>
              <option value='error'>ERROR</option>
            </select>
          </div>
        </div>
      </div>

      {/* 最近のログ */}
      <div className='card bg-base-100 border border-base-300'>
        <div className='card-body'>
          <div className='flex justify-between items-center mb-4'>
            <h4 className='card-title text-base'>最近のログ</h4>
            <div className='flex space-x-2'>
              <button className='btn btn-outline btn-sm'>フィルター</button>
              <button className='btn btn-outline btn-sm'>エクスポート</button>
            </div>
          </div>

          <div className='overflow-x-auto max-h-96'>
            <table className='table table-pin-rows table-xs'>
              <thead>
                <tr>
                  <th>時刻</th>
                  <th>レベル</th>
                  <th>メッセージ</th>
                  <th>ユーザー</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='text-xs'>2024-07-15 14:30:25</td>
                  <td>
                    <div className='badge badge-info badge-xs'>INFO</div>
                  </td>
                  <td className='text-xs'>ユーザーログイン成功</td>
                  <td className='text-xs'>yamada@example.com</td>
                </tr>
                <tr>
                  <td className='text-xs'>2024-07-15 14:28:10</td>
                  <td>
                    <div className='badge badge-warning badge-xs'>WARN</div>
                  </td>
                  <td className='text-xs'>ログイン試行失敗（3回目）</td>
                  <td className='text-xs'>unknown@example.com</td>
                </tr>
                <tr>
                  <td className='text-xs'>2024-07-15 14:25:45</td>
                  <td>
                    <div className='badge badge-success badge-xs'>INFO</div>
                  </td>
                  <td className='text-xs'>プロフィール更新</td>
                  <td className='text-xs'>suzuki@example.com</td>
                </tr>
                <tr>
                  <td className='text-xs'>2024-07-15 14:20:00</td>
                  <td>
                    <div className='badge badge-error badge-xs'>ERROR</div>
                  </td>
                  <td className='text-xs'>データベース接続エラー</td>
                  <td className='text-xs'>system</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='container mx-auto px-4 py-6 max-w-6xl'>
      {/* ヘッダー */}
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center space-x-4'>
          <button
            className='btn btn-ghost btn-circle'
            onClick={() => router.push('/dashboard')}
            title='ダッシュボードに戻る'
          >
            <MdArrowBack className='text-xl' />
          </button>
          <h1 className='text-2xl font-bold'>設定</h1>
        </div>
        <div className='flex items-center space-x-3'>
          <button
            className='btn btn-outline'
            onClick={() => router.push('/dashboard')}
          >
            <MdArrowBack className='text-sm mr-2' />
            ダッシュボードに戻る
          </button>
          <button
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? '保存中...' : '設定を保存'}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* サイドタブ */}
        <div className='lg:col-span-1'>
          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body p-0'>
              <div className='menu'>
                <li>
                  <button
                    className={`${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                      />
                    </svg>
                    ユーザー管理
                  </button>
                </li>
                <li>
                  <button
                    className={`${activeTab === 'system' ? 'active' : ''}`}
                    onClick={() => setActiveTab('system')}
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    システム設定
                  </button>
                </li>
                <li>
                  <button
                    className={`${activeTab === 'backup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('backup')}
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12'
                      />
                    </svg>
                    バックアップ
                  </button>
                </li>
                <li>
                  <button
                    className={`${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logs')}
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    ログ管理
                  </button>
                </li>
              </div>
            </div>
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className='lg:col-span-3'>
          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body'>
              {activeTab === 'users' && renderUsersTab()}
              {activeTab === 'system' && renderSystemTab()}
              {activeTab === 'backup' && renderBackupTab()}
              {activeTab === 'logs' && renderLogsTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
