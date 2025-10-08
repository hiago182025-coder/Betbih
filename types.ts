// Fix: Created full content for types.ts to define data structures for the application.
export interface TeamFeatures {
  name: string;
  elo: number;
  eloMomentum: number;
  xgPer90: number;
  xgOpenPlayPer90: number;
  xgSetPiecesPer90: number;
  xaPer90: number;
  shotsPer90: number;
  conversionRate: number;
  xgaPer90: number;
  foulsPerPossessionLost: number;
  cardsPerGame: number;
  possession: number;
  highPressSuccessRate: number;
}

export type AnalysisFocus = 'standard' | 'defensive' | 'offensive' | 'upset';

export interface MatchData {
  id?: string;
  competition: string;
  matchday: number;
  date?: string;
  time?: string;
  homeTeam: TeamFeatures;
  awayTeam: TeamFeatures;
  context: string;
  homeFormation?: string;
  awayFormation?: string;
  h2hHistory?: string;
  analysisFocus: AnalysisFocus;
}

export interface BetSuggestion {
  market: string;
  selection: string;
  odds: number;
  confidence: 1 | 2 | 3 | 4 | 5;
  supporting_factors: string[];
  main_risks: string[];
}

export interface MultiBetLeg {
  market: string;
  selection: string;
  odds: number;
}

export interface MultiBet {
  title: string;
  combined_odds: number;
  legs: MultiBetLeg[];
  rationale: string;
}

export interface ValueBet {
    market: string;
    selection:string;
    ai_odds: number;
    rationale: string;
}

export interface ProbabilityDistribution {
    outcome: {
        home_win: number;
        draw: number;
        away_win: number;
    };
    correct_scores: {
        score: string;
        probability: number;
    }[];
}

export interface GameNarrative {
    title: string;
    description: string;
}

export interface GeminiApiResponse {
  analysis: string;
  single_bets: BetSuggestion[];
  multi_bet: MultiBet;
  value_bets: ValueBet[];
  probability_distribution: ProbabilityDistribution;
  game_narratives: GameNarrative[];
}
