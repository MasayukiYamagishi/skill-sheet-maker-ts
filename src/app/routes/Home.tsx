const Home = () => {
  // const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center gap-8'>
      <h1 className='text-heading-h1'>Welcome!</h1>
      {/* 後でちゃんとしたボタンとかに切り替えること。 */}
      {/* <Button
        label='ユーザー一覧表示テスト'
        isWide={false}
        onClick={() => navigate('/users')}
      /> */}
      {/* ここに統計情報を表示できるとベスト。表示のタイミングでバックエンド経由でデータをfetchする */}
      <div className='min-w-192 flex flex-col items-center gap-4'>
        <h2 className='text-heading-h2'>統計情報</h2>
        <div className='flex flex-row justify-center items-center gap-2 p-4 rounded-lg bg-base-100 drop-shadow-lg'>
          <p className='text-center text-lg'>
            統計情報１
            <br />
            登録されている受講生
            <br /> or <br />
            社員の数
          </p>
          <div className='flex flex-col gap-2'>
            <p className='text-center text-lg'>
              統計情報２ <br />
              今月のユーザ数増減
            </p>
            <p className='text-center text-lg'>
              統計情報３ ユーザ数の推移
              <br />
              （直近半年か１年。選択できるといいかも）
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
