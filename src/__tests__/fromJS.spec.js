// @flow
import { Division } from './models/division';
import { Team } from './models/team';
import { MaybeObjectMap } from './models/maybeObjectMap';
import { MaybeArray } from './models/maybeArray';

describe('fromJS', () => {
  describe('arrays', () => {
    it('converts simple arrays to simple lists', () => {
      const blueJacketsJS = {
        location: 'Columbus',
        nickname: 'Blue Jackets',
        hasWonStanleyCup: false,
        lastCupWin: null,
        strengths: ['defense'],
      };
      const blueJackets = Team.fromJS(blueJacketsJS);
      expect(blueJackets.strengths.toArray()).toEqual(['defense']);
    });

    it('converts nested arrays to nested model lists', () => {
      const divisionJS = {
        name: 'Metropolitan',
        teams: {
          CBJ: {
            location: 'Columbus',
            nickname: 'Blue Jackets',
            hasWonStanleyCup: false,
            lastCupWin: null,
            players: {},
            strengths: ['defense'],
          },
        },
      };
      const division = Division.fromJS(divisionJS);
      const blueJackets = division.teams.first();
      expect(division.teams.size).toBe(1);
      const nextBlueJackets = blueJackets.setStrengths(blueJackets.strengths.push('goaltending'));
      expect(nextBlueJackets.strengths.toArray()).toEqual(['defense', 'goaltending']);
    });

    it('initializes populated maybe arrays', () => {
      const maybeArray = MaybeArray.fromJS({
        ary: ['a', 'b'],
      });
      const ary = maybeArray.ary;
      if (!ary) {
        throw new Error('maybe array was not initialized');
      }
      expect(ary.get(0)).toBe('a');
      expect(ary.get(1)).toBe('b');
    });

    it('leaves null arrays as null', () => {
      const maybeArray = MaybeArray.fromJS({
        ary: null,
      });
      expect(maybeArray.ary).toBeNull();
    });
  });

  describe('object maps', () => {
    it('converts simple object maps to Immutable Maps', () => {
      const blueJacketsJS = {
        location: 'Columbus',
        nickname: 'Blue Jackets',
        hasWonStanleyCup: false,
        lastCupWin: null,
        players: {
          'Max Power': 19,
          'Abe Froman': 22,
        },
        strengths: ['defense'],
      };
      const blueJackets = Team.fromJS(blueJacketsJS);
      expect(blueJackets.players.get('Max Power')).toBe(19);
      expect(blueJackets.players.get('Abe Froman')).toBe(22);
    });

    it('initializes populated maybe object maps', () => {
      const maybeMap = MaybeObjectMap.fromJS({
        maap: { a: 1, b: 2 },
      });
      const maap = maybeMap.maap;
      if (!maap) {
        throw new Error('maybe map was not initialized');
      }
      expect(maap.get('a')).toBe(1);
      expect(maap.get('b')).toBe(2);
    });

    it('leaves null objects maps as null', () => {
      const maybeMap = MaybeObjectMap.fromJS({
        maap: null,
      });
      expect(maybeMap.maap).toBeNull();
    });
  });
});
