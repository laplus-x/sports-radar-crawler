import { describe, test } from "vitest";
import { SportsRadar } from "@/main";
import { LanguageType, ProviderType, TimeZoneType } from "@/types";

describe("SportsRadar", () => {
	const lang = LanguageType.En;
	const tz = TimeZoneType.UTC;
	const provider = ProviderType.Bet365;
	const client = new SportsRadar({ lang, tz, provider });
	describe("Options", () => {
		test("findSportList", async () => {
			const result = await client.findSportList();
			console.log(result);
		});

		test("findCategoryList", async () => {
			const result = await client.findCategoryList({ sportId: 1 });
			console.log(result);
		});

		test("findTournamentList", async () => {
			const result = await client.findTournamentList({
				sportId: 1,
				categoryId: 33,
			});
			console.log(result);
		});
	});

	describe("Season", () => {
		test("getSeason", async () => {
			const result = await client.getSeason({
				seasonId: 130757,
			});
			console.log(result);
		});

		test("findTeamList", async () => {
			const result = await client.findTeamList({
				seasonId: 130757,
			});
			console.log(result);
		});

		test("findRoundList", async () => {
			const result = await client.findRoundList({
				seasonId: 131631,
			});
			console.log(result);
		});

		test("findMatchList", async () => {
			const result = await client.findMatchList({
				seasonId: 130757,
			});
			console.log(result);
		});

		test("findEventList", async () => {
			const result = await client.findEventList({
				matchId: 55307741,
			});
			console.log(result);
		});
	});
});
