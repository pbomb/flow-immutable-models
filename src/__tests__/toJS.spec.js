// @flow
import { Division } from './models/division';
import type { DivisionModelType } from './models/division';
import { League } from './models/league';
import type { LeagueModelType } from './models/league';
import { Team } from './models/team';
import type { TeamModelType } from './models/team';

describe('toJS', () => {
  const blueJacketsJS: TeamModelType = {
    location: 'Columbus',
    nickname: 'Blue Jackets',
    hasWonStanleyCup: false,
    lastCupWin: null,
    players: {
      'Max Power': 19,
      'Abe Froman': 22,
    },
    strengths: ['defense', 'power play'],
  };
  const divisionJS: DivisionModelType = {
    name: 'Metropolitan',
    teams: {
      CBJ: blueJacketsJS,
    },
  };
  const leagueJS: LeagueModelType = {
    name: 'NHL',
    divisions: [divisionJS],
  };

  describe('entire serialization', () => {
    it('serializes a model', () => {
      const blueJackets = Team.fromJS(blueJacketsJS);
      expect(blueJackets.toJS()).toEqual(blueJacketsJS);
    });

    it('serializes a nested model', () => {
      const division = Division.fromJS(divisionJS);
      expect(division.toJS()).toEqual(divisionJS);
    });
  });

  it('serializes a string property', () => {
    const blueJackets = Team.fromJS(blueJacketsJS);
    expect(blueJackets.toJS().nickname).toBe('Blue Jackets');
  });

  it('serializes a boolean property', () => {
    const blueJackets = Team.fromJS(blueJacketsJS);
    expect(blueJackets.toJS().hasWonStanleyCup).toBe(false);
  });

  describe('maybe types', () => {
    it('serializes a simple null value', () => {
      const blueJackets = Team.fromJS(blueJacketsJS);
      expect(blueJackets.toJS().lastCupWin).toBeNull();
    });

    it('serializes a simple non-null value', () => {
      const blueJackets = Team.fromJS(Object.assign({}, blueJacketsJS, { lastCupWin: 1999 }));
      expect(blueJackets.toJS().lastCupWin).toBe(1999);
    });
  });

  describe('arrays', () => {
    it('serializes simple lists to simple arrays', () => {
      const blueJackets = Team.fromJS(blueJacketsJS);
      const serializedStrengths = blueJackets.toJS().strengths;
      expect(serializedStrengths).toEqual(blueJacketsJS.strengths);
    });

    it('serializes nested lists to nested arrays', () => {
      const league = League.fromJS(leagueJS);
      const divisionsJS = league.toJS().divisions;
      expect(divisionsJS).toEqual([divisionJS]);
    });
  });

  describe('object maps', () => {
    it('serializes simple maps to objects', () => {
      const blueJackets = Team.fromJS(blueJacketsJS);
      const serializedPlayers = blueJackets.toJS().players;
      expect(Object.keys(serializedPlayers).length).toEqual(2);
      expect(serializedPlayers['Max Power']).toBe(19);
      expect(serializedPlayers['Abe Froman']).toBe(22);
    });

    it('serializes nested maps to objects', () => {
      const division = Division.fromJS(divisionJS);
      const teamsJS = division.toJS().teams;
      expect(Object.keys(teamsJS).length).toEqual(1);
      expect(teamsJS.CBJ).toEqual(blueJacketsJS);
    });
  });
});
