// @flow
import { Division } from './models/division';
import { Team } from './models/team';

describe('toJS', () => {
  it('serializes a model', () => {
    const blueJacketsJS = {
      location: 'Columbus',
      nickname: 'Blue Jackets',
      hasWonStanleyCup: false,
      lastCupWin: null,
      strengths: ['defense'],
    };
    const blueJackets = Team.fromJS(blueJacketsJS);
    expect(blueJackets.toJS()).toEqual(blueJacketsJS);
  });

  it('serializes a nested model', () => {
    const divisionJS = {
      name: 'Metropolitan',
      teams: [{
        location: 'Columbus',
        nickname: 'Blue Jackets',
        hasWonStanleyCup: false,
        lastCupWin: null,
        strengths: ['defense'],
      }],
    };
    const division = Division.fromJS(divisionJS);
    expect(division.toJS()).toEqual(divisionJS);
  });
});
