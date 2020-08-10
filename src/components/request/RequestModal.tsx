import React, { Component } from 'react';
import { RequestNotification } from '../../services/api/types';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { timeToString, dateToString, getSquashGrade } from '../../helpers';

export interface RequestModalProps {
  request: RequestNotification;
  onAction(accepted: boolean, requestId?: number): void;
}

export default class RequestModal extends Component<RequestModalProps, any> {
  render() {
    return (
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.modal}>
          <Text style={[styles.bold, styles.modalTitle]}>
            Squash match request
          </Text>
          <View style={[styles.center, styles.content]}>
            <View style={styles.buttonRow}>
              <Text>Player Id: </Text>
              <Text>{this.props.request.hostPlayerId}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Text>Date: </Text>
              <Text>{dateToString(this.props.request.matchStartTime)}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Text>Time: </Text>
              <Text>{timeToString(this.props.request.matchStartTime)}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Text>Length of play: </Text>
              <Text>{this.props.request.lengthInMins}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Text>Host player ability: </Text>
              <Text>
                {getSquashGrade(this.props.request.hostPlayerAbility)}
              </Text>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => this.props.onAction(false)}>
              <Text style={styles.colorGrey}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.onAction(true, this.props.request.id)}>
              <Text style={styles.colorBlue}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
    color: 'black',
  },
  modal: {
    backgroundColor: 'white',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorBlue: {
    color: 'blue',
  },
  colorGrey: {
    color: 'grey',
  },
  modalTitle: {
    paddingBottom: 12,
    fontSize: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    margin: 8,
    width: '100%',
  },
});
