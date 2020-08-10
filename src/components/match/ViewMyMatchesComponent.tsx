import React, { Component } from 'react';
import { MatchConfirmed, MatchRequest } from '../../services/api/types';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  dateToString,
  timeToString,
  getSquashGrade,
  timeElapsedString,
  EmptyMatches,
} from '../../helpers';
import GameMatcherService from '../../services/api/GameMatcherService';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationRoutes } from '../../services/navigation/NavigationService';
import { RootStackParamList } from '../../App';

enum DisplayState {
  Confirmed,
  Requested,
}

export interface MyMatchesProps {
  playerId: number;
  showRequestedAsDefault?: boolean;
}

interface MyMatchesState {
  isLoading: boolean;
  displayState: DisplayState;
  playerId: number;
  confirmedMatches: MatchConfirmed[];
  requestedMatches: MatchRequest[];
}

type MyMatchesStackNavigationProps = StackNavigationProp<
  RootStackParamList,
  NavigationRoutes.Matches
>;

export default class ViewMyMatchesComponent extends Component<
  MyMatchesStackNavigationProps,
  MyMatchesState
> {
  private readonly gameMatcherApiService: GameMatcherService = new GameMatcherService();

  constructor(props: any) {
    super(props);
    const myProps: MyMatchesProps = props.route.params;
    this.state = {
      isLoading: true,
      displayState: !!myProps.showRequestedAsDefault
        ? DisplayState.Requested
        : DisplayState.Confirmed,
      playerId: myProps.playerId,
      confirmedMatches: [],
      requestedMatches: [],
    };
  }

  componentDidMount() {
    this.loadMatches();
  }

  private loadMatches = () => {
    this.setState((prevState: any) => ({ ...prevState, isLoading: true }));
    this.gameMatcherApiService.getMatches(this.state.playerId).then((matches) =>
      this.setState((prevState) => ({
        ...prevState,
        isLoading: false,
        confirmedMatches: matches.matchesConfirmed,
        requestedMatches: matches.matchRequests,
      })),
    );
  };

  render() {
    return (
      <>
        <SafeAreaView>
          <View style={styles.fullView}>
            <View style={styles.centerRow}>
              <View style={[styles.flexRow, styles.buttonRow]}>
                {this.state.displayState !== DisplayState.Requested && (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prevState) => ({
                        ...prevState,
                        displayState: DisplayState.Requested,
                      }))
                    }>
                    <Text style={[styles.colorBlack, styles.textAlignLeft]}>
                      Requests
                    </Text>
                  </TouchableOpacity>
                )}
                {this.state.displayState === DisplayState.Requested && (
                  <Text
                    style={[
                      styles.colorBlue,
                      styles.bold,
                      styles.textAlignLeft,
                    ]}>
                    Requests
                  </Text>
                )}
                {this.state.displayState !== DisplayState.Confirmed && (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prevState) => ({
                        ...prevState,
                        displayState: DisplayState.Confirmed,
                      }))
                    }>
                    <Text style={[styles.colorBlack, styles.textAlignRight]}>
                      Confirmed
                    </Text>
                  </TouchableOpacity>
                )}
                {this.state.displayState === DisplayState.Confirmed && (
                  <Text
                    style={[
                      styles.colorBlue,
                      styles.bold,
                      styles.textAlignRight,
                    ]}>
                    Confirmed
                  </Text>
                )}
              </View>
            </View>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={this.loadMatches}
                />
              }>
              {this.state.displayState === DisplayState.Confirmed && (
                <>
                  {this.state.confirmedMatches.length === 0 && (
                    <EmptyMatches label="You have no confirmed matches." />
                  )}
                  {this.state.confirmedMatches.map((match: MatchConfirmed) => (
                    <View
                      key={'confirmed' + match.id}
                      style={[styles.flexRow, styles.matchContainer]}>
                      <Icon
                        name="check-circle"
                        solid
                        style={[styles.matchContainerLeft, styles.icon]}
                      />
                      <View style={styles.matchContainerRight}>
                        <View style={[styles.flexRow, styles.textRow]}>
                          <Text>
                            {dateToString(match.matchStartTime) + '  '}{' '}
                          </Text>
                          <Text style={styles.bold}>
                            {timeToString(match.matchStartTime)}
                          </Text>
                        </View>
                        <Text>
                          Length:{'  '}
                          <Text style={styles.bold}>
                            {match.lengthInMins} mins
                          </Text>
                        </Text>
                        <Text>
                          Opponent grade:{'  '}
                          <Text style={styles.bold}>
                            {getSquashGrade(
                              match.hostPlayerId === this.state.playerId
                                ? match.guestPlayerAbility
                                : match.hostPlayerAbility,
                            )}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
              {this.state.displayState === DisplayState.Requested && (
                <>
                  {this.state.requestedMatches.length === 0 && (
                    <EmptyMatches label="You have no requested matches." />
                  )}
                  {this.state.requestedMatches.map((match: MatchRequest) => (
                    <View
                      key={'request' + match.id}
                      style={[styles.flexRow, styles.matchContainer]}>
                      <Icon
                        name="question-circle"
                        solid
                        style={[styles.matchContainerLeft, styles.icon]}
                      />
                      <View style={styles.matchContainerRight}>
                        <View style={[styles.flexRow, styles.textRow]}>
                          <Text>
                            {dateToString(match.matchStartTime) + '  '}{' '}
                          </Text>
                          <Text style={styles.bold}>
                            {timeToString(match.matchStartTime)}
                          </Text>
                        </View>
                        <Text>
                          Length:{'  '}
                          <Text style={styles.bold}>
                            {match.lengthInMins} mins
                          </Text>
                        </Text>
                        <View style={[styles.flexRow, styles.textRow]}>
                          <Text style={styles.italics}>Pending</Text>
                          <Text>
                            {timeElapsedString(match.created!) + ' ago'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  fullView: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    flexGrow: 1,
  },
  centerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
  buttonRow: {
    justifyContent: 'space-between',
    margin: 12,
    width: 180,
  },
  bold: {
    fontWeight: 'bold',
  },
  colorBlue: {
    color: 'blue',
  },
  colorBlack: {
    color: 'black',
  },
  italics: {
    fontStyle: 'italic',
  },
  textRow: {
    justifyContent: 'space-between',
  },
  textAlignLeft: {
    width: 90,
    paddingLeft: 8,
    textAlign: 'left',
    borderRightWidth: 1,
  },
  textAlignRight: {
    width: 90,
    textAlign: 'right',
    borderLeftWidth: 1,
  },
});
