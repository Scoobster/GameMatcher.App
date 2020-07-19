import {Player} from './types';

export default class GameMatcherService {
  private readonly BASE_URL: string = 'https://localhost:44388/api/';

  public addPlayer(player: Player): Promise<number> {
    return fetch(this.BASE_URL + 'player', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(player),
    })
      .then((res) => {
        return +res.text;
      })
      .catch((error) => {
        console.error(error);
        return -1;
      });
  }
}
