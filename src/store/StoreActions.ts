export const SET_PLAYER_ID = 'SET_PLAYER_ID';

// export const setPleyerId = (playerId: number) => dispatch(setPlayerIdAction(playerId));

function setPlayerIdAction(playerId: number) {
  return { type: SET_PLAYER_ID, playerId };
}
