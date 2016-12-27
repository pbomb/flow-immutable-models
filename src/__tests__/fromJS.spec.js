// @flow
import { Division } from './models/division';
import { Team } from './models/team';

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
  });
});
