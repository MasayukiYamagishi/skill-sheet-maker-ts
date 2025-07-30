// import { fetchUser } from '@/api/tauri/users';

// import Button from '@/components/buttons/Button';
// import IconButton from '@/components/buttons/IconButton';
// import IconLabelButton from '@/components/buttons/IconLabelButton';
// import CirclePhotoCard from '@/components/CirclePhotoCard';
// import { UserStatusBadgeClass, UserStatusConst } from '@/constants/constants';
// import { User } from '@/types/user';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Users = () => {
//   const navigate = useNavigate();
//   const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
//   const [users, setUsers] = useState<User[]>([]);

//   // ユーザ全件取得
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const fetched = await fetchUser();
//         setUsers(fetched);
//       } catch (error) {
//         console.error('ユーザ情報の取得に失敗しました: ', error);
//       }
//     };

//     loadUsers();
//   }, []);

//   const handleSelectAll = () => {
//     if (selectedUsers.length === users.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(users.map((u) => u.id));
//     }
//   };

//   const handleSelectUser = (userId: string) => {
//     setSelectedUsers((prev) =>
//       prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
//     );
//   };

//   const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
//   const hasSelection = selectedUsers.length > 0;
//   const hasActiveForBusinessUser = users.some(
//     (user) => selectedUsers.includes(user.id) && user.status === 'inProject',
//   );

//   return (
//     <div className="container mx-auto p-4 flex flex-col gap-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">ユーザー一覧</h1>
//         <Button label="ホームへ戻る" isWide={false} onClick={() => navigate('/')} />
//       </div>

//       {/* Actions Header */}
//       <div className="card bg-base-100 shadow-md p-4">
//         <div className="flex justify-between items-center">
//           <div className="form-control">
//             <label className="input input-bordered flex items-center gap-2">
//               <input type="text" className="grow" placeholder="検索" />
//               <IconButton icon="search" onClick={() => console.log('search')} />
//             </label>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               label={isAllSelected ? '全選択解除' : '全選択'}
//               isWide={false}
//               onClick={handleSelectAll}
//             />
//             {hasSelection && (
//               <Button label="選択解除" isWide={false} onClick={() => setSelectedUsers([])} />
//             )}
//             <Button
//               label="サマリPDF出力"
//               isWide={false}
//               disabled={!hasActiveForBusinessUser}
//               onClick={() => console.log('Download summary PDF')}
//             />
//           </div>
//         </div>
//       </div>

//       {/* User List */}
//       <div className="flex flex-col gap-3">
//         {/* List Body */}
//         {users.map((user) => (
//           <div
//             key={user.userIdentifier}
//             className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
//             onClick={() => navigate(`/profile/${user.id}`)}
//           >
//             <div className="card-body p-3 flex flex-row items-center gap-4">
//               <div className="w-auto" onClick={(e) => e.stopPropagation()}>
//                 <input
//                   type="checkbox"
//                   className="checkbox"
//                   checked={selectedUsers.includes(user.id)}
//                   onChange={() => handleSelectUser(user.id)}
//                 />
//               </div>
//               <CirclePhotoCard src={user.avatarPath} altText={`${user.name}'s avatar`} size={48} />
//               <div className="w-2/12 font-semibold">{`${user.name} `}</div>
//               <div className="w-4/12 text-gray-500">{user.email}</div>
//               <div className="w-2/12 flex justify-center">
//                 <div className={UserStatusBadgeClass[user.status]}>
//                   {UserStatusConst[user.status]}
//                 </div>
//               </div>
//               <div className="w-2/12 flex justify-center" onClick={(e) => e.stopPropagation()}>
//                 <IconLabelButton
//                   icon="download"
//                   label="PDF出力"
//                   onClick={() => console.log(`PDF for ${user.name}`)}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Users;
