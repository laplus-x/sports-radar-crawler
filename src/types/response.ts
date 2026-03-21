export interface SportsRadarResponse<T> {
	queryUrl: string;
	doc: Doc<T>[];
}

export interface Doc<T> {
	event: string;
	_dob: number;
	_maxage: number;
	_configid: string;
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
	cc?: CountryCodeData;
	countrycode?: CountryCodeData;
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
	ioc?: string;
	continentid: number;
	continent: string;
	population?: number;
}

export interface TournamentData {
	_doc: string;
	_id: number;
	_sid: number;
	_rcid: number;
	_isk: number;
	_tid: number;
	_utid: number;
	name: string;
	roundbyround: boolean;
	seasonid?: number;
	currentseason?: number;
	friendly?: boolean;
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
	uid: number;
	virtual: boolean;
	name: string;
	mediumname: string;
	abbr: string;
	nickname?: string;
	iscountry: boolean;
	haslogo: boolean;
	surname: string;
	cc?: CountryCodeData;
	countrycode?: CountryCodeData;
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
	round?: number;
	roundname?: RoundData;
	tobeannounced: boolean;
	postponed: boolean;
	stadiumid: number;
	walkover: boolean;
	retired: boolean;
	comment?: string;
	inlivescore: boolean;
	disqualified: boolean;
	neutralground: boolean;
	canceled: boolean;
	bestof: number;
	periods?: Record<
		string,
		{
			home: number;
			away: number;
		}
	>;
	result: {
		home?: number;
		away?: number;
		period: string;
		winner?: "home" | "away";
	};
	status?: string;
	time: TimestampData;
	numberofperiods?: number;
	_seasonid: number;
}

export interface RoundData {
	_doc: string;
	_id: number;
	displaynumber?: number;
	name: string;
	shortname: string;
	cuproundnumber?: number;
	statisticssortorder: number;
}

export interface EventData {
	_doc: string;
	_id: number;
	_scoutid?: string;
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
	injurytime?: number;
	team: string;
	name: string;
	result?: {
		home: number;
		away: number;
		winner?: "home" | "away";
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
	bases?: Record<
		string,
		{
			occupied: boolean;
			player_id?: number;
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
		starting_base?: number;
		ending_base?: number;
		playerid?: number;
	};
	advancement_type?: string;
	hits?: {
		home: number;
		away: number;
	};
	base_loadout?: Record<string, boolean>;
	run_type?: string;
	runs?: number;
	positionid?: string;
	goaltypeid?: string;
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
	periodnumber?: number;
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
	fullname?: string;
}
