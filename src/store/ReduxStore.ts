import {
  Player,
  MatchConfirmed,
  MatchRequest,
  RequestNotification,
} from 'src/services/api/types';

interface ReduxStore {
  playerId: number;
  playerDetails: Player;
  myMatches: {
    isLoading: boolean;
    confirmed: MatchConfirmed[];
    requested: MatchRequest[];
  };
  availableRequests: {
    isLoading: boolean;
    allRequests: MatchRequest[];
    filteredRequests: MatchRequest[];
    filtersApplied: { (req: MatchRequest): boolean }[];
  };
  showModals: {
    showRequestModal: boolean;
    requestModalData: RequestNotification;
    showFilterModal: boolean;
  };
}
