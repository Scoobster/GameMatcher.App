import { Player } from './types';

export default class GameMatcherService {
  private readonly BASE_URL: string =
    'https://api-gamematcher.azurewebsites.net/api/';

  public addPlayer(player: Player): Promise<number> {
    return fetch(this.BASE_URL + 'player', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    })
      .then((res) => {
        return res.text().then((text) => +text);
      })
      .catch((error) => {
        console.error('Failed to add player', error);
        return -1;
      });
  }

  public updateDeviceToken(
    playerId: number,
    firebaseToken: string,
  ): Promise<boolean> {
    return fetch(this.BASE_URL + 'player/token/' + playerId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firebaseToken),
    })
      .then((res) => {
        return res.text().then((text) => text === firebaseToken);
      })
      .catch((error) => {
        console.error('Failed to update firebase token', error);
        return false;
      });
  }
}
