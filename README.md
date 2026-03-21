# Sports Radar Crawler

一個用於爬取 Sports Radar 網站體育賽事資料的 TypeScript 工具庫。

## ⚠️ 重要提醒

**此專案僅為實驗性質，不建議在生產環境中使用。**

- 此工具庫未經過完整的測試與驗證
- API 端點可能隨時變更，導致功能失效
- 缺乏完整的錯誤處理與重試機制
- 不保證資料的準確性與即時性

## 功能特色

- 支援多種體育項目資料爬取
- 提供完整的 TypeScript 類型定義
- 支援多種語言與時區設定
- 簡潔的 API 設計

## 安裝

```bash
npm install sports-radar-crawler
```

## 使用方法

### 基本設定

```typescript
import {
  SportsRadar,
  LanguageType,
  TimeZoneType,
  ProviderType,
} from "sports-radar-crawler";

const client = new SportsRadar({
  lang: LanguageType.En, // 語言設定
  tz: TimeZoneType.UTC, // 時區設定
  provider: ProviderType.Bet365, // 數據供應商
  timeout: 30000, // 請求超時時間（毫秒）
});
```

### 取得運動項目列表

```typescript
const sports = await client.findSportList();
console.log(sports);
```

### 取得賽季資訊

```typescript
const season = await client.getSeason({
  seasonId: 130757,
});
console.log(season);
```

### 取得賽季中的隊伍列表

```typescript
const teams = await client.findTeamList({
  seasonId: 130757,
});
console.log(teams);
```

### 取得賽季中的比賽列表

```typescript
const matches = await client.findMatchList({
  seasonId: 130757,
});
console.log(matches);
```

### 取得比賽中的事件列表

```typescript
const events = await client.findEventList({
  matchId: 55307741,
});
console.log(events);
```

## 支援的資料類型

### 運動項目 (Sport)

- 運動項目 ID
- 名稱
- 是否為賽季項目

### 賽季 (Season)

- 賽季 ID
- 名稱與縮寫
- 開始與結束時間
- 比賽類型設定

### 隊伍 (Team)

- 隊伍基本資訊
- 隊伍名稱與暱稱
- 所屬國家/地區

### 比賽 (Match)

- 比賽基本資訊
- 主客隊資訊
- 比賽時間與狀態
- 比分與賽況

### 事件 (Event)

- 比賽中的各種事件
- 進球、犯規、換人等
- 時間戳記與詳細描述

## 設定選項

### 語言設定

```typescript
import { LanguageType } from "sports-radar-crawler";

const languages = {
  En: "en", // 英文
  ZhCn: "zh", // 簡體中文
  ZhTw: "zht", // 繁體中文
};
```

### 時區設定

```typescript
import { TimeZoneType } from "sports-radar-crawler";

const timezones = {
  UTC: "Etc:UTC", // 標準時間 (UTC+0)
  Shanghai: "Asia:Shanghai", // 上海 (UTC+8)
};
```

### 數據供應商

```typescript
import { ProviderType } from "sports-radar-crawler";

const providers = {
  BetInAction: "betinaction",
  Bet365: "bet365",
};
```

## 錯誤處理

所有方法都會返回 `Result<T, Error>` 類型，建議使用以下方式處理：

```typescript
import { Ok, Err } from "ts-results";

const result = await client.findSportList();

if (result.ok) {
  console.log("成功取得資料:", result.val);
} else {
  console.error("取得資料失敗:", result.val);
}
```

## 開發

### 環境設定

1. 安裝依賴：

```bash
npm install
```

2. 執行測試：

```bash
npm test
```

3. 建置專案：

```bash
npm run build
```

### 測試

專案包含測試案例，使用 Vitest 進行測試：

```bash
npm run test
```

## 授權

MIT License

## 免責聲明

此工具庫僅供學習與研究使用。使用者需自行承擔使用風險，作者不對因使用此工具庫而產生的任何問題負責。

## 相關連結

- [Sports Radar 網站](https://s5.sir.sportradar.com)
- [TypeScript 官方文件](https://www.typescriptlang.org/)
- [ts-results](https://github.com/vultix/ts-results)
