// @flow
import * as Immutable from 'immutable';
import { Division } from './models/division';
import { defaultTeamValues, Team } from './models/team';
import type { TeamModelType } from './models/team';

describe('update', () => {
  it('updates simple values', () => {
    const division = Division.fromJS({ name: 'Metropolitan' });
    const nextDivision = division.update('name', name => `${name}-next`);
    expect(nextDivision).not.toBe(division);
    expect(nextDivision.name).toBe('Metropolitan-next');
  });

  it('updates collections', () => {
    const team: TeamModelType = Object.assign(
      {},
      {
        location: 'Columbus',
        nickname: 'Blue Jackets',
        hasWonStanleyCup: false,
        lastCupWin: null,
        strengths: ['defense'],
      },
      defaultTeamValues
    );
    const division = Division.fromJS({
      name: 'Metropolitan',
      teams: { CBJ: team },
    });
    const blueJackets = division.teams.first();
    const rangers = Team.fromJS({
      location: 'New York',
      nickname: 'Rangers',
      hasWonStanleyCup: true,
      lastCupWin: 1994,
      strengths: ['goaltending'],
    });
    const nextDivision = division.update('teams', (teams: Immutable.Map<string, Team>) =>
      teams.set('NYR', rangers)
    );
    expect(nextDivision).not.toBe(division);
    expect(nextDivision.name).toBe('Metropolitan');
    expect(nextDivision.teams.size).toBe(2);
    expect(nextDivision.teams.get('CBJ')).toBe(blueJackets);
    expect(nextDivision.teams.get('NYR')).toBe(rangers);
  });
});

describe('udpateIn', () => {
  it('updates nested value', () => {
    const division = Division.fromJS({
      name: 'Metropolitan',
      teams: {
        CBJ: Object.assign(
          {},
          {
            location: 'Columbus',
            nickname: 'Blue Jackets',
            hasWonStanleyCup: false,
            lastCupWin: null,
            strengths: ['defense'],
          },
          defaultTeamValues
        ),
        NYR: Object.assign(
          {},
          {
            location: 'New York',
            nickname: 'Rangers',
            hasWonStanleyCup: true,
            lastCupWin: 1994,
            strengths: ['goaltending'],
          },
          defaultTeamValues
        ),
      },
    });
    const blueJackets = division.teams.get('CBJ');
    const rangers = division.teams.get('NYR');
    const nextDivision = division.updateIn(['teams', 'NYR'], (team: Team) =>
      team.setLocation('New York City')
    );
    expect(nextDivision).not.toBe(division);
    expect(nextDivision.name).toBe('Metropolitan');
    expect(nextDivision.teams.size).toBe(2);
    expect(nextDivision.teams.get('CBJ')).toBe(blueJackets);
    expect(nextDivision.teams.get('NYR')).not.toBe(rangers);
    expect(nextDivision.teams.get('NYR').location).toBe('New York City');
    expect(nextDivision.teams.get('NYR').nickname).toBe('Rangers');
  });
});
