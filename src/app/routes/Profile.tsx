// import { fetchCareerHistoriesByUserId } from '@/api/tauri/careerHistories';
// import { fetchUserQualificationByUserId } from '@/api/tauri/userQualifications';
// import { fetchUserById } from '@/api/tauri/users';
// import { fetchUserSkillsByUserId } from '@/api/tauri/userSkills';
// import Button from '@/components/buttons/Button';
// import { default as CirclePhotoCard } from '@/components/CirclePhotoCard';
// import ErrorDisplay from '@/components/ErrorBoundary';
// import { Icon } from '@/components/icons/Icon';
// import { ErrorCode } from '@/constants/error';
// import { CareerHistory } from '@/types/career';
// import { MbtiFullInfo } from '@/types/mbti';
// import { UserQualification } from '@/types/qualification';
// import { UserSkill } from '@/types/skill';
// import { User } from '@/types/user';
// import { calcAgeJSTLabel } from '@/utils/calcAge';
// import { formatYmdToJa } from '@/utils/format';
// import { fetchMbtiFullInfo } from '@/utils/mbtiHelpers';
// import {
//   Chart as ChartJS,
//   Filler,
//   Legend,
//   LineElement,
//   PointElement,
//   RadialLinearScale,
//   Tooltip,
// } from 'chart.js';
// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';

// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// const Profile = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [user, setUser] = useState<User>();
//   const [careerHistory, setCareerHistory] = useState<CareerHistory[]>([]);
//   const [userQualifications, setUserQualifications] = useState<UserQualification[]>([]);
//   const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
//   const [mbti, setMbti] = useState<MbtiFullInfo | undefined>(undefined);

//   const [error, setError] = useState<string | undefined>(undefined);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   // ユーザ以外の追加データのローディング
//   const [subLoading, setSubLoading] = useState<boolean>(false);

//   if (!id) {
//     return (
//       <ErrorDisplay
//         error="ユーザIDが指定されていません。"
//         backButtonLabel="ユーザ一覧へ戻る"
//         backButtonPath="/users"
//         showBackButton={true}
//       />
//     );
//   }

//   // ユーザ情報取得
//   useEffect(() => {
//     let cancelled = false;

//     const loadUser = async () => {
//       try {
//         setIsLoading(true);
//         const fetched = await fetchUserById(id);
//         if (!fetched) {
//           if (!cancelled) {
//             setError(ErrorCode.USER_NOT_FOUND);
//             setIsLoading(false);
//           }
//           return;
//         }
//         if (!cancelled) {
//           setUser(fetched);
//           setIsLoading(false);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(ErrorCode.USER_FETCH_FAILED);
//           setIsLoading(false);
//         }
//       }
//     };

//     loadUser();
//     return () => {
//       cancelled = true;
//     };
//   }, [id]);

//   // ユーザの経歴・資格・スキル・MBTI情報取得
//   useEffect(() => {
//     if (!user) return;
//     let cancelled = false;

//     const loadSubResources = async () => {
//       try {
//         setSubLoading(true);

//         // 各種APIから経歴, 資格, スキル, MBTI情報を取得
//         const [careersResponse, qualificationResponse, skillResponse, mbtiResponse] =
//           await Promise.all([
//             fetchCareerHistoriesByUserId(user.id),
//             fetchUserQualificationByUserId(user.id),
//             fetchUserSkillsByUserId(user.id),
//             user.mbtiType
//               ? fetchMbtiFullInfo(user.mbtiType, user.mbtiIdentity)
//               : Promise.resolve(undefined),
//           ]);

//         if (!cancelled) {
//           setCareerHistory(careersResponse ?? []);
//           setUserQualifications(qualificationResponse ?? []);
//           setUserSkills(skillResponse ?? []);
//           setMbti(mbtiResponse);
//           setSubLoading(false);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setCareerHistory([]);
//           setUserQualifications([]);
//           setUserSkills([]);
//           setMbti(undefined);
//           setSubLoading(false);
//         }
//         // 必要に応じてエラー処理
//       }
//     };

//     loadSubResources();
//     return () => {
//       cancelled = true;
//     };
//   }, [user]);

//   // ユーザの資格とスキルの詳細情報をマスタから取得する
//   useEffect(() => {}, []);

//   const handleRetry = () => {
//     setError(undefined);
//     setIsLoading(true);
//     // useEffectが再実行されるようにuserをリセット
//     setUser(undefined);
//   };

//   if (error) {
//     return (
//       <ErrorDisplay
//         error={error}
//         onRetry={handleRetry}
//         backButtonLabel="ユーザ一覧へ戻る"
//         backButtonPath="/users"
//         showBackButton={true}
//       />
//     );
//   }

//   if (isLoading || !user) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
//         <p className="text-gray-600">ユーザ情報を読み込み中...</p>
//       </div>
//     );
//   }

//   // TODO: 横幅のサイズを可能な限り768px（Tailwind CSSのmdサイズのブレークポイント）に合うように調整して要素のサイズを変える
//   return (
//     <div className="flex flex-col items-center gap-8">
//       <div className="w-full flex justify-end">
//         <Button label="ユーザ一覧へ戻る" isWide={false} onClick={() => navigate('/users')} />
//       </div>
//       <div className="min-w-192 w-fit flex flex-row justify-center content-center items-start rounded-lg gap-8 p-4  bg-white drop-shadow-lg">
//         <CirclePhotoCard src={user.avatarPath} altText="avatar image" size={128} />
//         <div className="flex flex-col gap-2">
//           <p className="text-sm">ID: {user.userIdentifier}</p>
//           <div className="flex flex-row justify-center content-center items-start gap-24">
//             <div className="flex flex-col justify-center content-center gap-2">
//               <div>
//                 <div className="flex flex-row gap-2 text-3xl font-bold ">
//                   <p>{user.name}</p>
//                 </div>
//                 <div className="flex flex-row gap-2">
//                   <p>{user.nameKana}</p>
//                 </div>
//               </div>
//               <div className="flex flex-row gap-2">
//                 <Icon icon="mail" />
//                 <p>{user.email}</p>
//               </div>
//             </div>
//             <div className="min-w-55 flex flex-col content-end justify-end gap-2">
//               <p>生年月日：{formatYmdToJa(user.birthDate)}</p>
//               <div className="flex flex-row gap-8 content-center">
//                 <p>年齢：{calcAgeJSTLabel(user.birthDate)} </p>
//                 <p>性別：{user.gender}</p>
//               </div>
//               {user.joinedAt && <p>入社日：{formatYmdToJa(user.joinedAt)}</p>}
//               {user.retiredAt && <p>退職日：{formatYmdToJa(user.retiredAt)}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* MBTI */}
//       {subLoading ? (
//         <div className="flex flex-col gap-4">
//           <h2 className="text-heading-h1">MBTI</h2>
//           <div className="min-w-192 w-fit flex justify-center items-center rounded-lg p-8 bg-white drop-shadow-lg">
//             <div className="loading loading-spinner loading-md text-primary"></div>
//             <span className="ml-2">MBTI情報を読み込み中...</span>
//           </div>
//         </div>
//       ) : (
//         mbti &&
//         mbti.type && (
//           <div className="flex flex-col gap-4">
//             <h2 className="text-heading-h1">MBTI</h2>
//             <div className="min-w-192 w-fit flex flex-row justify-between gap-4 rounded-lg p-4 bg-white drop-shadow-lg">
//               <div className="flex flex-col gap-4">
//                 <div className="flex flex-col gap-2">
//                   <div className="flex flex-row gap-4 content-center">
//                     <p className="text-heading-h2">
//                       {mbti.type.code}
//                       {mbti.identity?.code && <span>-{mbti.identity?.code}</span>}
//                     </p>
//                     <p className="text-heading-h2">{mbti.type.code}</p>
//                   </div>
//                   <div>
//                     <p className="break-words">{mbti.type.description}</p>
//                   </div>
//                 </div>
//                 <div className="max-w-115 flex flex-col gap-2">
//                   <p className="text-heading-h3">特徴</p>
//                   <div className="rounded-lg p-4 bg-slate-100">
//                     <ul className="list-disc list-outside text-wrap pl-4">
//                       {mbti.type.features.map((item, index) => (
//                         <li key={index}>{item}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <p className="text-heading-h3">キーワード</p>
//                 <div className="flex flex-col gap-4">
//                   <div className="p-4 rounded-lg bg-slate-100">
//                     <p className="font-bold">ポジティブ</p>
//                     <div className="flex flex-row gap-8">
//                       <ul className="list-disc list-inside">
//                         {mbti.type.positiveKeywords.map((keyword, i) => (
//                           <li key={i}>{keyword}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="p-4 rounded-lg bg-slate-100">
//                     <p className="font-bold">ネガティブ</p>
//                     <div className="flex flex-row gap-8">
//                       <ul className="list-disc list-inside">
//                         {mbti.type.negativeKeywords.map((keyword, i) => (
//                           <li key={i}>{keyword}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )
//       )}

//       {/* スキル */}
//       <div className="flex flex-col gap-4">
//         <h2 className="text-heading-h2">スキル</h2>
//         <div className="min-w-192 flex flex-col p-4 gap-4 rounded-lg bg-white drop-shadow-lg">
//           {subLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="loading loading-spinner loading-md text-primary"></div>
//               <span className="ml-2">スキル情報を読み込み中...</span>
//             </div>
//           ) : userSkills.length > 0 ? (
//             <ul className="flex flex-col gap-2">
//               {userSkills.map((skill, index) => (
//                 <li
//                   className="pl-4 pr-4 pt-2 pb-2 rounded-lg bg-slate-100"
//                   key={`${skill.userId}-${skill.skillId}-${index}`}
//                 >
//                   {skill.skillId}
//                   {skill.version && (
//                     <span className="ml-2 text-sm text-gray-600">
//                       (バージョン: {skill.version})
//                     </span>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500 text-center py-4">スキル情報が登録されていません</p>
//           )}
//         </div>
//       </div>
//       {/* 資格と職歴 */}
//       <div className="flex flex-col gap-4">
//         <h2 className="text-heading-h2">保有資格</h2>
//         <div className="min-w-192 flex flex-col p-4 gap-4 rounded-lg bg-white drop-shadow-lg">
//           {subLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="loading loading-spinner loading-md text-primary"></div>
//               <span className="ml-2">資格情報を読み込み中...</span>
//             </div>
//           ) : userQualifications.length > 0 ? (
//             <ul className="flex flex-col gap-2">
//               {userQualifications.map((qualification, index) => (
//                 <li
//                   className="pl-4 pr-4 pt-2 pb-2 rounded-lg bg-slate-100"
//                   key={`${qualification.userId}-${qualification.qualificationId}-${index}`}
//                 >
//                   {qualification.qualificationId}
//                   {qualification.acquiredAt && (
//                     <span className="ml-2 text-sm text-gray-600">
//                       (取得日: {formatYmdToJa(qualification.acquiredAt)})
//                     </span>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500 text-center py-4">資格情報が登録されていません</p>
//           )}
//         </div>
//       </div>
//       <div className="flex flex-col gap-4">
//         <h2 className="text-heading-h2">学歴・職歴</h2>
//         <div className="min-w-192 flex flex-col p-4 gap-4 rounded-lg bg-white drop-shadow-lg">
//           {subLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="loading loading-spinner loading-md text-primary"></div>
//               <span className="ml-2">経歴情報を読み込み中...</span>
//             </div>
//           ) : careerHistory.length > 0 ? (
//             <>
//               <div className="flex flex-row justify-between">
//                 <p className="w-40 text-center">年月日</p>
//                 <p className="w-full text-center">学歴・職歴</p>
//               </div>
//               <ul className="flex flex-col gap-2">
//                 {careerHistory.map((career, index) => (
//                   <li
//                     className="flex flex-row justify-between pl-4 pr-4 pt-2 pb-2 rounded-lg bg-slate-100"
//                     key={career.id}
//                   >
//                     <div className="w-60">
//                       {career.startedAt && <p>{formatYmdToJa(career.startedAt)}</p>}
//                       {career.endedAt && <p>〜 {formatYmdToJa(career.endedAt)}</p>}
//                     </div>
//                     <div className="w-full">
//                       <p className="font-semibold">{career.title}</p>
//                       {career.role && <p className="text-sm text-gray-600">役割: {career.role}</p>}
//                       {career.scale && (
//                         <p className="text-sm text-gray-600">規模: {career.scale}</p>
//                       )}
//                       {career.description && <p className="text-sm mt-1">{career.description}</p>}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </>
//           ) : (
//             <p className="text-gray-500 text-center py-4">経歴情報が登録されていません</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
