'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // ログイン処理をシミュレート（2秒待機）
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // ダッシュボードに遷移
    router.push('/dashboard');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10'>
      <div className='w-full max-w-md'>
        {/* ロゴ・タイトル */}
        <div className='text-center mb-8'>
          <div className='w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4'>
            <MdPerson className='text-3xl text-white' />
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
            Orbit
          </h1>
          <p className='text-base-content/70 mt-2'>エンジニア管理システム</p>
        </div>

        {/* ログインフォーム */}
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title text-center justify-center mb-6'>ログイン</h2>
            
            <form onSubmit={handleLogin} className='space-y-4'>
              {/* メールアドレス */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>メールアドレス</span>
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    className='input input-bordered w-full pl-10'
                    placeholder='admin@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <MdPerson className='absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50' />
                </div>
              </div>

              {/* パスワード */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>パスワード</span>
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className='input input-bordered w-full pl-10 pr-10'
                    placeholder='パスワードを入力'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <MdLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50' />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              {/* ログインボタン */}
              <div className='form-control mt-6'>
                <button
                  type='submit'
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'ログイン中...' : 'ログイン'}
                </button>
              </div>
            </form>

            {/* 追加リンク */}
            <div className='divider'>または</div>
            
            <div className='space-y-2 text-center'>
              <a href='/summary' className='btn btn-outline btn-secondary w-full'>
                公開サマリーを見る
              </a>
              <p className='text-xs text-base-content/50 mt-4'>
                ※ 現在はデモ版です。<br />
                メールアドレスとパスワードは何でもログインできます。
              </p>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className='text-center mt-8 text-sm text-base-content/50'>
          <p>© 2024 Orbit Engineering Management System</p>
        </div>
      </div>
    </div>
  );
}
