export interface FindCategoryListParameter {
	sportId: number;
}

export interface FindTournamentListParameter {
	sportId: number;
	categoryId: number;
}

export interface GetSeasonParameter {
	seasonId: number;
}

export interface FindTeamListParameter {
	seasonId: number;
}

export interface FindRoundListParameter {
	seasonId: number;
}

export interface FindMatchListParameter {
	seasonId: number;
}

export interface FindEventListParameter {
	matchId: number;
}
