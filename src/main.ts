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

interface Options {
	lang?: LanguageType;
	tz?: TimeZoneType;
	provider?: ProviderType;
	timeout?: number;
}

/**
 * 網站: https://s5.sir.sportradar.com
 */
export class SportsRadar {
	private readonly base: string = "https://stats.fn.sportradar.com";
	private readonly lang: LanguageType;
	private readonly tz: TimeZoneType;
	private readonly provider: ProviderType;
	private readonly timeout: number;

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

	private async request<T>(...[input, init = {}]: Parameters<typeof fetch>) {
		try {
			const response = await fetch(input, {
				signal: AbortSignal.timeout(this.timeout),
				...init,
			});

			if (!response.ok) {
				throw new Error(`[Fetch] ${response.status}`, {
					cause: response.text(),
				});
			}

			const result = await response.json();

			const valid = validate<{ queryUrl: string; doc: Doc<any>[] }>(result);
			if (!valid.success) {
				throw new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
					cause: valid.errors,
				});
			}

			const { data } = valid.data.doc[0];
			if (is<ErrorData>(data)) {
				const { message, code } = data;
				throw new Error(`[SportsRadar] ${message}`, {
					cause: { url: input, message, code },
				});
			}

			return Ok<T>(data);
		} catch (err: unknown) {
			return Err(err);
		}
	}

	public async findSportList() {
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/config_sports/41/0`;
		const result = await this.request<SportData[]>(url);
		return result;
	}

	public async findCategoryList(params: FindCategoryListParameter) {
		const valid = validate<FindCategoryListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors,
			});
			return Err(err);
		}

		const { sportId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/config_tree_mini/41/0/${sportId}`;
		const result =
			await this.request<{ realcategories: CategoryData[] }[]>(url);
		return result.map((i) => i.flatMap((i) => i.realcategories));
	}

	public async findTournamentList(params: FindTournamentListParameter) {
		const valid = validate<FindTournamentListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors,
			});
			return Err(err);
		}

		const { sportId, categoryId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/config_tree_mini/41/0/${sportId}/${categoryId}`;
		const result =
			await this.request<{ realcategories: CategoryData[] }[]>(url);
		return result.map((i) =>
			i.flatMap((i) => i.realcategories.flatMap((j) => j.tournaments)),
		);
	}

	public async getSeason(params: GetSeasonParameter) {
		const valid = validate<GetSeasonParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors,
			});
			return Err(err);
		}

		const { seasonId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_season_meta/${seasonId}`;
		const result = await this.request<{
			season: SeasonData;
		}>(url);

		return result.map((i) => i.season);
	}

	public async findTeamList(params: FindTeamListParameter) {
		const valid = validate<FindTeamListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors,
			});
			return Err(err);
		}

		const { seasonId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_season_teams2/${seasonId}`;
		const result = await this.request<{
			teams: TeamData[];
		}>(url);

		return result.map((i) => i.teams);
	}

	public async findRoundList(params: FindRoundListParameter) {
		const valid = validate<FindRoundListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors,
			});
			return Err(err);
		}

		const { seasonId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_season_fixtures2/${seasonId}`;
		const result = await this.request<{
			matches: MatchData[];
		}>(url);

		const set = new Set();
		return result.map((i) =>
			i.matches
				.filter((k) => {
					if (!k.roundname || set.has(k.roundname._id)) {
						return false;
					}
					set.add(k.roundname._id);
					return true;
				})
				.map((j) => j.roundname),
		);
	}

	public async findMatchList(params: FindMatchListParameter) {
		const valid = validate<FindMatchListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors,
			});
			return Err(err);
		}

		const { seasonId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_season_fixtures2/${seasonId}`;
		const result = await this.request<{
			matches: MatchData[];
		}>(url);

		return result.map((i) => i.matches);
	}

	public async findEventList(params: FindEventListParameter) {
		const valid = validate<FindEventListParameter>(params);
		if (!valid.success) {
			const err = new Error(`[Typia] ${valid.errors.at(0)?.description}`, {
				cause: valid.errors,
			});
			return Err(err);
		}

		const { matchId } = params;
		const url = `${this.base}/${this.provider}/${this.lang}/${this.tz}/gismo/stats_match_timeline/${matchId}`;
		const result = await this.request<{
			events: EventData[];
		}>(url);

		return result.map((i) => i.events);
	}
}
