import { Player, MatchRequest, MatchConfirmed } from './types';
import { InputOption } from 'src/components/common/FormTypes';

export default class GameMatcherService {
  private readonly BASE_URL: string =
    'https://api-gamematcher.azurewebsites.net/api/';
  private readonly CLUB_API_URL: string = this.BASE_URL + 'club/';
  private readonly PLAYER_API_URL: string = this.BASE_URL + 'player/';
  private readonly MATCH_API_URL: string = this.BASE_URL + 'match/';

  public getClubs(): Promise<InputOption[]> {
    return fetch(this.CLUB_API_URL)
      .then((res: Response) => res.json())
      .then((res) => res.map((opt: any) => this.formatInputOption(opt)))
      .catch((error: any) => {
        console.error('Failed to retrieve clubs', error);
        return [];
      });
  }

  public addPlayer(player: Player): Promise<number> {
    return fetch(this.PLAYER_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    })
      .then((res: Response) => {
        return res.text().then((text) => +text);
      })
      .catch((error: any) => {
        console.error('Failed to add player', error);
        return -1;
      });
  }

  public updateDeviceToken(
    playerId: number,
    firebaseToken: string,
  ): Promise<boolean> {
    return fetch(this.PLAYER_API_URL + 'token/' + playerId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firebaseToken),
    })
      .then((res: Response) => {
        console.log('Firebase token response', res);
        return res.text().then((text) => text === firebaseToken);
      })
      .catch((error: any) => {
        console.error('Failed to update firebase token', error);
        return false;
      });
  }

  public addMatchRequest(request: MatchRequest): Promise<number> {
    return fetch(this.MATCH_API_URL + 'request', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
      .then((res: Response) => {
        return res.text().then((text) => +text);
      })
      .catch((error: any) => {
        console.error('Failed to add match request', error);
        return -1;
      });
  }

  public confirmMatch(requestId: number, playerId: number): Promise<number> {
    return fetch(this.MATCH_API_URL + 'accept/' + requestId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerId),
    })
      .then((res: Response) => {
        return res.text().then((text) => +text);
      })
      .catch((error) => {
        console.error('Failed to confirm match', error);
        return -1;
      });
  }

  public getMatches(
    playerId: number,
  ): Promise<{
    matchRequests: MatchRequest[];
    matchesConfirmed: MatchConfirmed[];
  }> {
    return fetch(this.PLAYER_API_URL + 'match/' + playerId)
      .then((res: Response) => res.json())
      .then((obj: any) => {
        return {
          matchRequests:
            obj?.MatchRequests?.map(
              (obj: any) =>
                ({
                  id: +obj.Id,
                  hostPlayerId: +obj.HostPlayerId,
                  created: new Date(obj.Created),
                  matchStartTime: new Date(obj.MatchStartTime),
                  lengthInMins: +obj.LengthInMins,
                } as MatchRequest),
            ) || [],
          matchesConfirmed:
            obj?.MatchesConfirmed?.map(
              (obj: any) =>
                ({
                  id: +obj.Id,
                  hostPlayerId: +obj.HostPlayerId,
                  guestPlayerId: +obj.GuestPlayerId,
                  hostPlayerAbility: +obj.HostPlayerAbility,
                  guestPlayerAbility: +obj.GuestPlayerAbility,
                  created: new Date(obj.Created),
                  matchStartTime: new Date(obj.MatchStartTime),
                  lengthInMins: +obj.LengthInMins,
                } as MatchConfirmed),
            ) || [],
        };
      })
      .catch((error) => {
        console.log('Failed to retrieve matches for player', error);
        return { matchRequests: [], matchesConfirmed: [] };
      });
  }

  public getAvailableRequests(playerId: number): Promise<MatchRequest[]> {
    return fetch(this.PLAYER_API_URL + 'request/' + playerId)
      .then((res: Response) => {
        return res.json();
      })
      .then((objArray: any) => {
        return (
          objArray.map(
            (obj: any) =>
              ({
                id: +obj.Id,
                hostPlayerId: +obj.HostPlayerId,
                created: new Date(obj.Created),
                matchStartTime: new Date(obj.MatchStartTime),
                lengthInMins: +obj.LengthInMins,
                hostPlayerAbility: +obj.HostPlayerAbility,
              } as MatchRequest),
          ) || []
        );
      })
      .catch((error) => {
        console.log(
          'Failed to retrieve available match requests for player',
          error,
        );
        return { matchRequests: [], matchesConfirmed: [] };
      });
  }

  public getPlayerDetails(playerId: number): Promise<Player | undefined> {
    return fetch(this.PLAYER_API_URL + playerId)
      .then((res: Response) => {
        return res.json();
      })
      .then((obj: any) => {
        return {
          id: +obj.Id,
          firstName: obj.FirstName,
          lastName: obj.LastName,
          clubId: +obj.ClubId,
          ability: +obj.Ability,
          phoneNumber: obj.PhoneNumber,
        } as Player;
      })
      .catch((error) => {
        console.log(
          'Failed to retrieve available match requests for player',
          error,
        );
        return undefined;
      });
  }

  public updatePlayerDetails(
    playerId: number,
    player: Player,
  ): Promise<number> {
    return fetch(this.PLAYER_API_URL + playerId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    })
      .then((res: Response) => {
        return res.json();
      })
      .then((obj: any) => +obj.Id)
      .catch((error) => {
        console.log(
          'Failed to retrieve available match requests for player',
          error,
        );
        return -1;
      });
  }

  private formatInputOption(option: {
    Label: string;
    Value: any;
  }): InputOption {
    return { label: option.Label, value: +option.Value } as InputOption;
  }
}
