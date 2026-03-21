/**
 * SportsRadar API 客戶端模組
 *
 * 提供對 SportsRadar 數據服務的訪問接口，支持多種體育項目、賽事、球隊和比賽數據的查詢。
 *
 * @packageDocumentation
 */

import { Err, Ok } from "ts-results";
import { is, validate } from "typia";
import type {
	CategoryData,
	Doc,
	ErrorData,
	EventData,
	FindCategoryListParameter,
	FindEventListParameter,
	FindMatchListParameter,
	FindRoundListParameter,
	FindTeamListParameter,
	FindTournamentListParameter,
	GetSeasonParameter,
	MatchData,
	SeasonData,
	SportData,
	TeamData,
} from "@/types";
import { LanguageType, ProviderType, TimeZoneType } from "@/types";

/**
 * 導出所有常量定義
 * 包含語言類型、時區類型和數據供應商類型
 */
export * from "@/types/constant";

/**
 * SportsRadar 客戶端配置選項
 */
interface Options {
	/**
	 * 語言類型，默認為英文
	 * @default LanguageType.En
	 */
	lang?: LanguageType;

	/**
	 * 時區類型，默認為 UTC
	 * @default TimeZoneType.UTC
	 */
	tz?: TimeZoneType;

	/**
	 * 數據供應商類型，默認為 Bet365
	 * @default ProviderType.Bet365
	 */
	provider?: ProviderType;

	/**
	 * 請求超時時間（毫秒），默認為 30 秒
	 * @default 30000
	 */
	timeout?: number;
}

/**
 * SportsRadar API 客戶端類
 *
 * 提供對 SportsRadar 數據服務的完整訪問接口，支持多種體育項目、賽事、球隊和比賽數據的查詢。
 *
 * @example
 * ```typescript
 * // 創建客戶端實例
 * const client = new SportsRadar({
 *   lang: LanguageType.ZhTw,
 *   tz: TimeZoneType.Shanghai,
 *   provider: ProviderType.Bet365,
 *   timeout: 30000
 * });
 *
 * // 查詢體育項目列表
 * const sports = await client.findSportList();
 * ```
 */
export class SportsRadar {
	private readonly base: string = "https://stats.fn.sportradar.com";
	private readonly lang: LanguageType;
	private readonly tz: TimeZoneType;
	private readonly provider: ProviderType;
	private readonly timeout: number;

	/**
	 * 創建 SportsRadar 客戶端實例
	 *
	 * @param options - 客戶端配置選項
	 * @param options.lang - 語言類型，默認為英文
	 * @param options.tz - 時區類型，默認為 UTC
	 * @param options.provider - 數據供應商類型，默認為 Bet365
	 * @param options.timeout - 請求超時時間（毫秒），默認為 30 秒
	 *
	 * @example
	 * ```typescript
	 * // 使用默認配置
	 * const client = new SportsRadar();
	 *
	 * // 自定義配置
	 * const client = new SportsRadar({
	 *   lang: LanguageType.ZhTw,
	 *   tz: TimeZoneType.Shanghai,
	 *   provider: ProviderType.Bet365,
	 *   timeout: 60000
	 * });
	 * ```
	 */
	constructor(options?: Options) {
		const {
			lang = LanguageType.En,
			tz = TimeZoneType.UTC,
			provider = ProviderType.Bet365,
			timeout = 30 * 1000,
		} = options ?? {};

		this.lang = lang;
		this.tz = tz;
		this.provider = provider;
		this.timeout = timeout;
	}

	/**
	 * 發送 HTTP 請求並處理響應
	 *
	 * @typeParam T - 響應數據的類型
	 * @param input - 請求的 URL 或 Request 對象
	 * @param init - 可選的 RequestInit 配置
	 * @returns 返回包含數據的 Result 對象，成功時包含解析後的數據，失敗時包含錯誤信息
	 *
	 * @throws {Error} 當 HTTP 請求失敗時拋出錯誤
	 * @throws {Error} 當響應數據驗證失敗時拋出錯誤
	 * @throws {Error} 當 SportsRadar 服務返回錯誤時拋出錯誤
	 *
	 * @example
	 * ```typescript
	 * const result = await this.request<SportData[]>("https://api.example.com/sports");
	 * if (result.ok) {
	 *   console.log("成功:", result.val);
	 * } else {
	 *   console.error("失敗:", result.error);
	 * }
	 * ```
	 */
	private async request<T = any, E extends Error = any>(
		input: string | URL | Request,
		init?: RequestInit,
	) {
		try {
			const response = await fetch(input, {
				signal: AbortSignal.timeout(this.timeout),
				...init,
			});

			if (!response.ok) {
				const result = await response.text();
				const err = new Error(`[Fetch] ${response.status}`, {
					cause: result,
				});
				throw err;
			}

			const result = await response.json();

			const valid = validate<{ queryUrl: string; doc: Doc<any>[] }>(result);
			if (!valid.success) {
				const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors.at(0),
				});
				throw err;
			}

			const { data } = valid.data.doc[0];
			if (is<ErrorData>(data)) {
				const { message, code } = data;
				const err = new Error(`[SportsRadar] ${message}`, {
					cause: { url: input, message, code },
				});
				throw err;
			}

			return Ok<T>(data);
		} catch (err: unknown) {
			return Err<E>(err as E);
		}
	}

	/**
	 * 查詢支持的體育項目列表
	 *
	 * @returns 返回體育項目列表的 Result 對象
	 *
	 * @example
	 * ```typescript
	 * const result = await client.findSportList();
	 * if (result.ok) {
	 *   console.log("體育項目:", result.val);
	 * } else {
	 *   console.error("查詢失敗:", result.error);
	 * }
	 * ```
	 */
	public async findSportList() {
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/config_sports/41/0`;
		const result = await this.request(url);

		return result.andThen((i) => {
			const valid = validate<SportData[]>(i);
			if (!valid.success) {
				const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors.at(0),
				});
				return Err(err);
			}
			return Ok(valid.data);
		});
	}

	/**
	 * 查詢指定體育項目的分類列表
	 *
	 * @param params - 查詢參數，包含體育項目 ID
	 * @param params.sportId - 體育項目 ID
	 * @returns 返回分類列表的 Result 對象
	 *
	 * @example
	 * ```typescript
	 * const result = await client.findCategoryList({ sportId: 1 });
	 * if (result.ok) {
	 *   console.log("分類列表:", result.val);
	 * } else {
	 *   console.error("查詢失敗:", result.error);
	 * }
	 * ```
	 */
	public async findCategoryList(params: FindCategoryListParameter) {
		const valid = validate<FindCategoryListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors.at(0),
			});
			return Err(err);
		}

		const { sportId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/config_tree_mini/41/0/${sportId}`;
		const result = await this.request(url);
		return result
			.andThen((i) => {
				const valid = validate<{ realcategories: CategoryData[] }[]>(i);
				if (!valid.success) {
					const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
						cause: valid.errors.at(0),
					});
					return Err(err);
				}
				return Ok(valid.data);
			})
			.map((i) => i.flatMap((i) => i.realcategories));
	}

	/**
	 * 查詢指定體育項目和分類的賽事列表
	 *
	 * @param params - 查詢參數，包含體育項目 ID 和分類 ID
	 * @param params.sportId - 體育項目 ID
	 * @param params.categoryId - 分類 ID
	 * @returns 返回賽事列表的 Result 對象
	 *
	 * @example
	 * ```typescript
	 * const result = await client.findTournamentList({
	 *   sportId: 1,
	 *   categoryId: 10
	 * });
	 * if (result.ok) {
	 *   console.log("賽事列表:", result.val);
	 * } else {
	 *   console.error("查詢失敗:", result.error);
	 * }
	 * ```
	 */
	public async findTournamentList(params: FindTournamentListParameter) {
		const valid = validate<FindTournamentListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors.at(0),
			});
			return Err(err);
		}

		const { sportId, categoryId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/config_tree_mini/41/0/${sportId}/${categoryId}`;
		const result = await this.request(url);
		return result.andThen((i) => {
			const valid = validate<{ realcategories: CategoryData[] }[]>(i);
			if (!valid.success) {
				const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors.at(0),
				});
				return Err(err);
			}
			const data = valid.data.flatMap((i) =>
				i.realcategories.flatMap((j) => j.tournaments),
			);
			return Ok(data);
		});
	}

	/**
	 * 獲取指定賽季的詳細信息
	 *
	 * @param params - 查詢參數，包含賽季 ID
	 * @param params.seasonId - 賽季 ID
	 * @returns 返回賽季詳細信息的 Result 對象
	 *
	 * @example
	 * ```typescript
	 * const result = await client.getSeason({ seasonId: 12345 });
	 * if (result.ok) {
	 *   console.log("賽季信息:", result.val);
	 * } else {
	 *   console.error("查詢失敗:", result.error);
	 * }
	 * ```
	 */
	public async getSeason(params: GetSeasonParameter) {
		const valid = validate<GetSeasonParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors.at(0),
			});
			return Err(err);
		}

		const { seasonId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_season_meta/${seasonId}`;
		const result = await this.request(url);

		return result.andThen((i) => {
			const valid = validate<{
				season: SeasonData;
			}>(i);
			if (!valid.success) {
				const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors.at(0),
				});
				return Err(err);
			}
			return Ok(valid.data.season);
		});
	}

	/**
	 * 查詢指定賽季的球隊列表
	 *
	 * @param params - 查詢參數，包含賽季 ID
	 * @param params.seasonId - 賽季 ID
	 * @returns 返回球隊列表的 Result 對象
	 *
	 * @example
	 * ```typescript
	 * const result = await client.findTeamList({ seasonId: 12345 });
	 * if (result.ok) {
	 *   console.log("球隊列表:", result.val);
	 * } else {
	 *   console.error("查詢失敗:", result.error);
	 * }
	 * ```
	 */
	public async findTeamList(params: FindTeamListParameter) {
		const valid = validate<FindTeamListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors.at(0),
			});
			return Err(err);
		}

		const { seasonId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_season_teams2/${seasonId}`;
		const result = await this.request(url);

		return result.andThen((i) => {
			const valid = validate<{
				teams: TeamData[];
			}>(i);
			if (!valid.success) {
				const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors.at(0),
				});
				return Err(err);
			}
			return Ok(valid.data.teams);
		});
	}

	/**
	 * 查詢指定賽季的輪次列表
	 *
	 * @param params - 查詢參數，包含賽季 ID
	 * @param params.seasonId - 賽季 ID
	 * @returns 返回輪次列表的 Result 對象，過濾重複的輪次
	 *
	 * @example
	 * ```typescript
	 * const result = await client.findRoundList({ seasonId: 12345 });
	 * if (result.ok) {
	 *   console.log("輪次列表:", result.val);
	 * } else {
	 *   console.error("查詢失敗:", result.error);
	 * }
	 * ```
	 */
	public async findRoundList(params: FindRoundListParameter) {
		const valid = validate<FindRoundListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors.at(0),
			});
			return Err(err);
		}

		const { seasonId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_season_fixtures2/${seasonId}`;
		const result = await this.request(url);

		return result.andThen((i) => {
			const valid = validate<{
				matches: MatchData[];
			}>(i);
			if (!valid.success) {
				const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors.at(0),
				});
				return Err(err);
			}

			const set = new Set();
			const data = valid.data.matches
				.filter((k) => {
					if (!k.roundname || set.has(k.roundname._id)) {
						return false;
					}
					set.add(k.roundname._id);
					return true;
				})
				.map((j) => j.roundname);
			return Ok(data);
		});
	}

	/**
	 * 查詢指定賽季的比賽列表
	 *
	 * @param params - 查詢參數，包含賽季 ID
	 * @param params.seasonId - 賽季 ID
	 * @returns 返回比賽列表的 Result 對象
	 *
	 * @example
	 * ```typescript
	 * const result = await client.findMatchList({ seasonId: 12345 });
	 * if (result.ok) {
	 *   console.log("比賽列表:", result.val);
	 * } else {
	 *   console.error("查詢失敗:", result.error);
	 * }
	 * ```
	 */
	public async findMatchList(params: FindMatchListParameter) {
		const valid = validate<FindMatchListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors.at(0),
			});
			return Err(err);
		}

		const { seasonId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_season_fixtures2/${seasonId}`;
		const result = await this.request(url);

		return result.andThen((i) => {
			const valid = validate<{
				matches: MatchData[];
			}>(i);
			if (!valid.success) {
				const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors.at(0),
				});
				return Err(err);
			}
			return Ok(valid.data.matches);
		});
	}

	/**
	 * 查詢指定比賽的事件列表
	 *
	 * @param params - 查詢參數，包含比賽 ID
	 * @param params.matchId - 比賽 ID
	 * @returns 返回比賽事件列表的 Result 對象
	 *
	 * @example
	 * ```typescript
	 * const result = await client.findEventList({ matchId: 98765 });
	 * if (result.ok) {
	 *   console.log("比賽事件:", result.val);
	 * } else {
	 *   console.error("查詢失敗:", result.error);
	 * }
	 * ```
	 */
	public async findEventList(params: FindEventListParameter) {
		const valid = validate<FindEventListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors.at(0),
			});
			return Err(err);
		}

		const { matchId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_match_timeline/${matchId}`;
		const result = await this.request(url);

		return result.andThen((i) => {
			const valid = validate<{
				events: EventData[];
			}>(i);
			if (!valid.success) {
				const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors.at(0),
				});
				return Err(err);
			}
			return Ok(valid.data.events);
		});
	}
}
