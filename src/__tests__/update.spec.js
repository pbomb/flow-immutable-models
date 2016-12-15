// @flow
import * as Immutable from 'immutable';
import { Division } from './models/division';
import { Team } from './models/team';

describe('update', () => {
  it('updates simple values', () => {
    const division = Division.fromJS({ name: 'Metropolitan' });
    const nextDivision = division.update('name', name => `${name}-next`);
    expect(nextDivision).not.toBe(division);
    expect(nextDivision.name).toBe('Metropolitan-next');
  });

  it('updates collections', () => {
    const division = Division.fromJS({
      name: 'Metropolitan',
      teams: [{
        location: 'Columbus',
        nickname: 'Blue Jackets',
        hasWonStanleyCup: false,
        lastCupWin: null,
        strengths: ['defense'],
      }],
    });
    const blueJackets = division.teams.first();
    const rangers = Team.fromJS({
      location: 'New York',
      nickname: 'Rangers',
      hasWonStanleyCup: true,
      lastCupWin: 1994,
      strengths: ['goaltending'],
    });
    const nextDivision = division.update('teams', (teams: Immutable.List<Team>) =>
      teams.push(rangers)
    );
    expect(nextDivision).not.toBe(division);
    expect(nextDivision.name).toBe('Metropolitan');
    expect(nextDivision.teams.size).toBe(2);
    expect(nextDivision.teams.get(0)).toBe(blueJackets);
    expect(nextDivision.teams.get(1)).toBe(rangers);
  });
});

describe('udpateIn', () => {
  it('updates nested value', () => {
    const division = Division.fromJS({
      name: 'Metropolitan',
      teams: [{
        location: 'Columbus',
        nickname: 'Blue Jackets',
        hasWonStanleyCup: false,
        lastCupWin: null,
        strengths: ['defense'],
      }, {
        location: 'New York',
        nickname: 'Rangers',
        hasWonStanleyCup: true,
        lastCupWin: 1994,
        strengths: ['goaltending'],
      }],
    });
    const blueJackets = division.teams.get(0);
    const rangers = division.teams.get(1);
    const nextDivision = division.updateIn(['teams', 1], (team: Team) =>
      team.setLocation('New York City')
    );
    expect(nextDivision).not.toBe(division);
    expect(nextDivision.name).toBe('Metropolitan');
    expect(nextDivision.teams.size).toBe(2);
    expect(nextDivision.teams.get(0)).toBe(blueJackets);
    expect(nextDivision.teams.get(1)).not.toBe(rangers);
    expect(nextDivision.teams.get(1).location).toBe('New York City');
    expect(nextDivision.teams.get(1).nickname).toBe('Rangers');
  });
});
