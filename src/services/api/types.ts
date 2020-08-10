export interface Player {
  id?: number;
  firstName: string;
  lastName: string;
  clubId: number;
  ability: number;
  phoneNumber?: string;
  deviceToken?: string;
}

export interface MatchRequest {
  id?: number;
  created?: Date;
  hostPlayerId: number;
  matchStartTime: Date;
  lengthInMins: number;
  abilityMin: number;
  abilityMax: number;
  hostPlayerAbility?: number;
}

export interface RequestNotification {
  id: number;
  created: Date;
  hostPlayerId: number;
  matchStartTime: Date;
  lengthInMins: number;
  hostPlayerAbility: number;
}

export interface MatchConfirmed {
  id: number;
  created: Date;
  hostPlayerId: number;
  guestPlayerId: number;
  hostPlayerAbility: number;
  guestPlayerAbility: number;
  matchStartTime: Date;
  lengthInMins: number;
}
