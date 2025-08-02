'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // ここで実際の認証処理を行う（現在はモックアップなのでスキップ）

    setTimeout(() => {
      setIsLoading(false);
      router.push('/home');
    }, 1000);
  };

  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md w-full'>
          {/* ロゴ */}
          <h1 className='text-4xl font-bold mb-8 text-primary'>Orbit</h1>

          {/* ログインフォーム */}
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title justify-center mb-6'>ログイン</h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* エラーメッセージ */}
                {error && (
                  <div className='alert alert-error'>
                    <span>{error}</span>
                  </div>
                )}

                {/* メールアドレス */}
                <div className='form-control'>
                  <label className='form-label'>
                    <span className='label-text'>メールアドレス</span>
                  </label>
                  <input
                    type='email'
                    placeholder='your-email@example.com'
                    className='form-input'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* パスワード */}
                <div className='form-control'>
                  <label className='form-label'>
                    <span className='label-text'>パスワード</span>
                  </label>
                  <input
                    type='password'
                    placeholder='パスワードを入力'
                    className='form-input'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* ログインボタン */}
                <div className='form-control mt-6'>
                  <button
                    type='submit'
                    className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'ログイン中...' : 'ログイン'}
                  </button>
                </div>
              </form>

              {/* 新規登録リンク */}
              <div className='text-center mt-4'>
                <p className='text-sm text-gray-600'>
                  アカウントをお持ちでない方
                </p>
                <Link
                  href='/register'
                  className='link link-primary font-medium'
                >
                  新規登録
                </Link>
              </div>
            </div>
          </div>

          {/* ゲストアクセス */}
          <div className='mt-6'>
            <Link
              href='/public-summary'
              className='btn btn-outline btn-primary'
            >
              サマリを見る（ゲスト）
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
