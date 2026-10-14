# HaH 實作說明

## 已實作

- 左側導覽、頂部標題、導覽位置、儀表板殼層。
- `/problems/record` 完整問題狀況紀錄流程。
- 從指定 FHIR DocumentReference 載入 Observation JSON 模板。
- 從指定 FHIR DocumentReference 載入 CSV 並產生動態 radio 群組。
- 根據模板、問題、CSV 選項與 Patient ID 產生 FHIR Observation JSON。
- JSON 檢視、編輯、複製、上傳與真實回應展示。
- FHIR POST 成功後才產生 Observation 連結。

## 主要設定

- Patient ID：`7158c01b-32ba-4fbd-a038-201a0a2a4e2a`
- FHIR base URL：`https://hapi.fhir.org/baseR4`
- Observation template DocumentReference：`0ccce64d-f9a9-4141-a78d-3552f74f32cf`
- CSV detail DocumentReference：`8059f10e-a0a7-4e61-82bc-627edda1f23c`

## Assumptions

1. 問題定義仍須由授權臨床設定供應。本原型僅內建規格提供的「胸部不適」範例；CSV 的 `chest_discomfort` 與 problem code `chest-discomfort` 以正規化比對方式對應，保留設定值 `chest-discomfort`。
2. CSV 使用 `detailName` 作為群組標題，`valueDisplay` 作為選項標籤，`valueCode` 作為儲存值。
3. CSV `system`/`code` 欄位直接作為選項 value coding 的系統與代碼；`SNOMED CT` 與 `localCode` 不被自動轉換為 canonical URL，避免推論不存在的代碼系統。
4. 錄製時間於按下「產生 FHIR JSON」時以 `new Date().toISOString()` 產生。
5. `https//misac/codesystem/patient_problem_detail_code` + detailCode 依照文件方式串接，產生例如 `https//misac/codesystem/patient_problem_detail_codeseverity`。此 URI 缺少冒號，已隔離於 `buildProblemDetailCodeSystem`，送出正式環境前須由文件/臨床設定 owner 確認。
6. 未選擇的細節群組不會產生 component；不為 CSV 未提供的選項新增額外 interpretation。
7. 遠距照護、任務追蹤、文件管理與系統設定為明確標示為規劃中的擴充模組。

## 驗證

- `npx nuxt typecheck` 通過。
- `npx eslint .` 通過。
- `npx nuxt build` 通過。
- 已手動向 `https://hapi.fhir.org/baseR4/Observation` POST 代表性 Observation，伺服器回應 HTTP 201 Created 並建立 Observation ID。

## 未解決問題

- 正式 `Patient` 參照所使用的 canonical code systems 與 Problem detail code-system base URI 需由臨床/文件擁有者確認。
- 尚未實作真正的使用者身份、角色權限、院方系統整合、任務指派與文件管理。
- 本原型直接由瀏覽器呼叫公開 HAPI FHIR endpoint；若後續改用受保護伺服器，應加入 Nuxt server proxy 與存取控制。