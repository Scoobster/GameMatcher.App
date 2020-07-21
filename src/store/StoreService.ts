import { Player } from '../api/types';
import AsyncStorage from '@react-native-community/async-storage';

export default class StoreService {
  private readonly PLAYER_ID: string = 'player_id';
  private readonly FIREBASE_TOKEN: string = 'firebase_token';
  private readonly PLAYER_INFO: string = 'player_key';

  public async getPlayerId(): Promise<number> {
    try {
      const playerId = await AsyncStorage.getItem(this.PLAYER_ID);
      if (!!playerId) {
        return +playerId;
      }
      return -1;
    } catch (error) {
      console.error('Failed to retrieve player id', error);
      return -1;
    }
  }

  public setPlayerId(playerId: number): void {
    AsyncStorage.setItem(this.PLAYER_ID, playerId.toString());
  }

  public async getFirebaseToken(): Promise<string> {
    try {
      const token = await AsyncStorage.getItem(this.FIREBASE_TOKEN);
      if (!!token) {
        return token;
      }
      return '';
    } catch (error) {
      console.error('Failed to retrieve firebase token', error);
      return '';
    }
  }

  public setFirebaseToken(token: string): void {
    AsyncStorage.setItem(this.FIREBASE_TOKEN, token);
    console.log('Firebase token saved to AsyncStorage');
  }

  public async getPlayerInfo(): Promise<Player | null> {
    try {
      const player = await AsyncStorage.getItem(this.PLAYER_INFO);
      if (!!player) {
        return JSON.parse(player);
      }
      return null;
    } catch (error) {
      console.error('Failed to retrieve firebase token', error);
      return null;
    }
  }

  public setPlayerInfo(player: Player): void {
    AsyncStorage.setItem(this.PLAYER_INFO, JSON.stringify(player));
  }
}
