import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { MatchRequest } from '../../services/api/types';
import { RootStackParamList } from '../../App';
import NavigationService, {
  NavigationRoutes,
} from '../../services/navigation/NavigationService';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import GameMatcherService from '../../services/api/GameMatcherService';
import {
  timeElapsedString,
  getSquashGrade,
  timeToString,
  dateToString,
  EmptyMatches,
} from '../../helpers';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface FindMatchesProps {
  playerId: number;
}

interface FindMatchesState {
  isLoading: boolean;
  playerId: number;
  requests: MatchRequest[];
  filteredRequests: MatchRequest[];
  filtersActive: boolean;
  showFilterModal: boolean;
}

type FindMatchesStackNavigationProps = BottomTabNavigationProp<
  RootStackParamList,
  NavigationRoutes.Find
>;

export default class FindMatchRequestsComponent extends Component<
  FindMatchesStackNavigationProps,
  FindMatchesState
> {
  private readonly gameMatcherApiService: GameMatcherService = new GameMatcherService();

  constructor(props: any) {
    super(props);
    const myProps: FindMatchesProps = props.route.params;
    this.state = {
      isLoading: true,
      playerId: myProps.playerId,
      requests: [],
      filteredRequests: [],
      filtersActive: false,
      showFilterModal: false,
    };
  }

  componentDidMount() {
    this.loadRequests();
  }

  private loadRequests = () => {
    this.setState((prevState) => ({ ...prevState, isLoading: true }));
    this.gameMatcherApiService
      .getAvailableRequests(this.state.playerId)
      .then((requests) =>
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
          requests: requests,
          filteredRequests: requests,
        })),
      );
  };

  public toggleFilterModal = (show: boolean) => {
    this.setState((prevState) => ({ ...prevState, showFilterModal: show }));
  };

  render() {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this.loadRequests}
          />
        }>
        {this.state.filteredRequests.length === 0 && (
          <EmptyMatches
            label="There are no available match requests."
            subLabel={
              this.state.filtersActive
                ? 'Try changing your filters.'
                : undefined
            }
          />
        )}
        {this.state.filteredRequests.map((match: MatchRequest) => (
          <View key={'confirmed' + match.id}>
            <TouchableOpacity
              onPress={() =>
                NavigationService.displayRequestModal({
                  id: match.id!,
                  hostPlayerId: match.hostPlayerId,
                  hostPlayerAbility: match.hostPlayerAbility!,
                  created: match.created!,
                  matchStartTime: match.matchStartTime,
                  lengthInMins: match.lengthInMins,
                })
              }>
              <View style={[styles.flexRow, styles.matchContainer]}>
                <Icon
                  name="question-circle"
                  solid
                  style={[styles.matchContainerLeft, styles.icon]}
                />
                <View style={styles.matchContainerRight}>
                  <View style={[styles.flexRow, styles.textRow]}>
                    <Text>{dateToString(match.matchStartTime) + '  '} </Text>
                    <Text style={styles.bold}>
                      {timeToString(match.matchStartTime)}
                    </Text>
                  </View>
                  <Text>
                    Length:{'  '}
                    <Text style={styles.bold}>{match.lengthInMins} mins</Text>
                  </Text>
                  <View style={[styles.flexRow, styles.textRow]}>
                    <Text>
                      Opponent grade:{'  '}
                      <Text style={styles.bold}>
                        {getSquashGrade(match.hostPlayerAbility!)}
                      </Text>
                    </Text>
                    <Text>{timeElapsedString(match.created!) + ' ago'}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  matchContainer: {
    minWidth: '90%',
    marginVertical: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchContainerLeft: {
    marginRight: 8,
  },
  matchContainerRight: {
    marginLeft: 4,
    flexGrow: 1,
  },
  icon: {
    fontSize: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: 'black',
  },
  textRow: {
    justifyContent: 'space-between',
  },
});
