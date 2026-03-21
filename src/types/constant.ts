/** 語系 */
export const LanguageType = {
	/** 英文 */
	En: "en",
	/** 簡體中文 */
	ZhCn: "zh",
	/** 繁體中文 */
	ZhTw: "zht",
} as const;

export type LanguageType = (typeof LanguageType)[keyof typeof LanguageType];

/** 時區 */
export const TimeZoneType = {
	/** 標準時間 (UTC+0) */
	UTC: "Etc:UTC",
	/** 上海 (UTC+8) */
	Shanghai: "Asia:Shanghai",
} as const;

export type TimeZoneType = (typeof TimeZoneType)[keyof typeof TimeZoneType];

/** 數據供應商 */
export const ProviderType = {
	BetInAction: "betinaction",
	Bet365: "bet365",
} as const;

export type ProviderType = (typeof ProviderType)[keyof typeof ProviderType];
