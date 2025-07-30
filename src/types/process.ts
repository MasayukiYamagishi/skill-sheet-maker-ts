/** ==========================
 *   担当工程マスタ
 * ==========================
 */

/** 担当工程ID（master_processes） */
export type ProcessId = number;

/** 担当工程マスタ. */
export type ProcessMaster = {
  id: ProcessId;
  name: string; // 例: '要件定義'
};
