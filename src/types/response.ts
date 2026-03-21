export interface SportsRadarResponse<T> {
	queryUrl: string;
	doc: Doc<T>[];
}

export interface Doc<T> {
	event: string;
	_dob: number;
	_maxage: number;
	_configid?: string;
	data: T | ErrorData;
}

export interface ErrorData {
	_doc: string;
	message: string;
	code: number;
	name: string;
}

export interface SportData {
	_doc: string;
	_id: number;
	_sid: number;
	name: string;
	_sk: boolean;
}

export interface CategoryData {
	_doc: string;
	_id: number;
	_sid: number;
	_rcid: number;
	name: string;
	cc?: null | CountryCodeData;
	countrycode?: null | CountryCodeData;
	tournaments: TournamentData[];
	uniquetournaments: Record<string, TournamentData>;
	_sk: boolean;
}

export interface CountryCodeData {
	_doc: string;
	_id: number;
	a2: string;
	name: string;
	a3: string;
	ioc: null | string;
	continentid: number;
	continent: string;
	population: null | number;
}

export interface TournamentData {
	_doc: string;
	_id: number;
	_sid: number;
	_rcid: number;
	_isk?: null | number;
	_tid?: null | number;
	_utid: number;
	name: string;
	roundbyround?: null | boolean;
	seasonid?: null | number;
	currentseason: null | number;
	friendly?: null | boolean;
	_sk: boolean;
}

export interface TimestampData {
	_doc: string;
	time: string;
	date: string;
	tz: string;
	tzoffset: number;
	uts: number;
}

export interface SeasonData {
	_id: string;
	_doc: string;
	_utid: number;
	_sid: number;
	name: string;
	abbr: string;
	start: TimestampData;
	end: TimestampData;
	neutralground: boolean;
	friendly: boolean;
	currentseasonid: number;
	year: string;
	coverage: {
		lineups: boolean;
	};
	h2hdefault: {
		matchid: number;
		teamidhome: number;
		teamidaway: number;
	};
}

export interface TeamData {
	_doc: string;
	_id: number;
	_sid: number;
	uid?: number;
	virtual?: boolean;
	name: string;
	mediumname: string;
	abbr: string;
	nickname: null | string;
	iscountry: boolean;
	haslogo: boolean;
	surname?: null | string;
	cc?: null | CountryCodeData;
	countrycode?: null | CountryCodeData;
}

export interface MatchData {
	_doc: string;
	_doctype: string;
	_id: number;
	_sid: number;
	_rcid: number;
	_tid: number;
	_utid: number;
	week: number;
	teams: {
		home: TeamData;
		away: TeamData;
	};
	round: null | number;
	roundname?: null | RoundData;
	tobeannounced: boolean;
	postponed: boolean;
	stadiumid: number;
	walkover: boolean;
	retired: boolean;
	comment: null | string;
	inlivescore: boolean;
	disqualified: boolean;
	neutralground: boolean;
	canceled: boolean;
	bestof?: null | number;
	periods: null | Record<
		string,
		{
			home: number;
			away: number;
		}
	>;
	result: {
		home: null | number;
		away: null | number;
		period: string;
		winner: null | "home" | "away";
	};
	status: null | string;
	time: TimestampData;
	numberofperiods: null | number;
	_seasonid: number;
}

export interface RoundData {
	_doc: string;
	_id: number;
	displaynumber: null | number;
	name: string;
	shortname: string;
	cuproundnumber: null | number;
	statisticssortorder: number;
}

export interface EventData {
	_doc: string;
	_id: number;
	_scoutid: null | string;
	_sid: number;
	_rcid: number;
	_tid: number;
	_dc: boolean;
	_typeid: string;
	uts: number;
	updated_uts: number;
	type: string;
	matchid: number;
	disabled: number;
	time: number;
	seconds: number;
	injurytime: null | number;
	team: string;
	name: string;
	result?: {
		home: null | number;
		away: null | number;
		winner?: null | "home" | "away";
	};
	status?: {
		_doc: string;
		_id: number;
		name: string;
		shortName: string;
	};
	period?: number;
	inning_half?: string;
	batter_count?: {
		balls: number;
		strikes: number;
		outs: number;
		pcount: number;
		errors: number;
	};
	atbat?: {
		number: number;
		pitchnumber: number;
	};
	bases?: null | Record<
		string,
		{
			occupied: boolean;
			player_id?: null | number;
		}
	>;
	batter?: {
		playerid: number;
	};
	pitcher?: {
		playerid: number;
	};
	X?: number;
	Y?: number;
	pitch?: {
		speed_mph: number;
		type: number;
	};
	ball_type?: string;
	home?: {
		hits: number;
		errors: number;
	};
	away?: {
		hits: number;
		errors: number;
	};
	strike_type?: string;
	ball?: {
		speed_mph: number;
		angle: number;
		direction: number;
		distance: number;
		x: number;
		y: number;
	};
	out_type?: string;
	base?: number;
	defense?: Record<
		string,
		{
			playerid: number;
		}
	>;
	player_type?: string;
	playerid?: number;
	commentary?: string;
	runner?: {
		starting_base?: null | number;
		ending_base?: null | number;
		playerid?: null | number;
	};
	advancement_type?: string;
	hits?: {
		home: number;
		away: number;
	};
	base_loadout?: Record<string, boolean>;
	run_type?: string;
	runs?: number;
	positionid?: null | string;
	goaltypeid?: null | string;
	scorer?: PersonData;
	assists?: PersonData[];
	header?: boolean;
	owngoal?: boolean;
	penalty?: boolean;
	periodscore?: {
		home: number;
		away: number;
	};
	matchStatus?: {
		_doc: string;
		_id: number;
		name: string;
		shortName: string;
	};
	periodnumber?: null | number;
	pointtype?: string;
	pointflag?: string;
	pointflagtranslation?: string;
	error_type?: string;
	playerout?: PersonData;
	playerin?: PersonData;
	shirtnumbers?: {
		in: string;
		out: string;
	};
}

export interface PositionData {
	_id: string;
	_type: string;
	name: string;
	shortname: string;
	abbr: string;
}

export interface PersonData {
	_doc: string;
	_id: number;
	name: string;
	birthdate: TimestampData;
	nationality: CountryCodeData;
	position: PositionData;
	primarypositiontype: string;
	haslogo: boolean;
	fullname?: null | string;
}
