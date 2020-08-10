import React, { Component } from 'react';
import {
  FormProps,
  FormState,
  InputType,
  DateTime,
  FormInput,
} from './FormTypes';
import {
  StyleSheet,
  View,
  Button,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { WheelPicker } from 'react-native-wheel-picker-android';
import { dateToString, timeToString } from '../../helpers';

const DATE_PICKER = '_DATE';
const TIME_PICKER = '_TIME';

export default class FormComponent extends Component<FormProps, FormState> {
  private readonly formProps: FormProps;

  constructor(props: FormProps) {
    super(props);
    this.formProps = props;
  }

  componentDidMount() {
    this.initialiseForm();
  }

  componentWillReceiveProps() {
    this.initialiseForm();
  }

  private initialiseForm = () => {
    let values: { [key: string]: any } = {};
    let showModals: { [key: string]: any } = {};
    this.formProps.formInputs.forEach((formInput) => {
      if (!!formInput.initialValue) {
        values[formInput.name] = formInput.initialValue;
      }
      if (
        formInput.input === InputType.Date ||
        formInput.input === InputType.Time ||
        formInput.input === InputType.Wheel
      ) {
        showModals[formInput.name] = false;
      }
      if (formInput.input === InputType.DateTime) {
        showModals[formInput.name + DATE_PICKER] = false;
        showModals[formInput.name + TIME_PICKER] = false;
      }
    });

    this.setState({
      values: values,
      errors: {},
      showInputModal: showModals,
    });
  };

  private isFormInputValid(
    formInput: FormInput,
    errors: { [key: string]: string },
  ): boolean {
    errors[formInput.name] = '';

    // If field is required, check for value
    if (
      formInput.required &&
      (!this.state.values[formInput.name] ||
        this.state.values[formInput.name].length === 0)
    ) {
      errors[formInput.name] = 'Required. This value cannot be left blank.';
    }

    // If type is DateTime, check for date and time individually
    else if (formInput.required && formInput.input === InputType.DateTime) {
      const dateTime: DateTime = this.state.values[formInput.name];

      if (!dateTime.date) {
        errors[formInput.name] = 'Required: Date. Please enter a date.';
      }

      if (!dateTime.time) {
        errors[formInput.name] = 'Required: Time. Please enter a time.';
      }
    }

    // Finally check all the given validation functions
    else if (!!formInput.validators && formInput.validators.length > 0) {
      formInput.validators.forEach((validatorFn) => {
        const errorMessage = validatorFn(this.state.values[formInput.name]);
        if (!!errorMessage && errorMessage.length > 0) {
          errors[formInput.name] = errorMessage;
        }
      });
    }

    return !errors[formInput.name] || errors[formInput.name].length === 0;
  }

  private isValid(): boolean {
    let isValid: boolean = true;
    let errors: { [key: string]: string } = {};

    for (let formInput of this.formProps.formInputs) {
      const formInputValid = this.isFormInputValid(formInput, errors);
      if (!formInputValid) {
        isValid = false;
      }
    }

    this.setState((prevState) => ({
      ...prevState,
      errors: errors,
    }));
    return isValid;
  }

  private onChange(
    formInputName: string,
    value: any,
    toggleModal: boolean = false,
  ) {
    let stateCopy = { ...this.state };
    stateCopy.values[formInputName] = value;
    this.isFormInputValid(
      this.formProps.formInputs.find((i) => i.name === formInputName)!,
      stateCopy.errors,
    );

    if (toggleModal) {
      stateCopy.showInputModal[formInputName] = !stateCopy.showInputModal[
        formInputName
      ];
    }

    this.setState(stateCopy);
  }

  private onDateTimeChange(
    formInputName: string,
    value: Date,
    isTime: boolean,
  ) {
    let dateTime: DateTime = this.state.values[formInputName] || new DateTime();

    let stateCopy = { ...this.state };

    if (isTime) {
      dateTime.time = value;
      stateCopy.showInputModal[formInputName + TIME_PICKER] = !stateCopy
        .showInputModal[formInputName + TIME_PICKER];
    } else {
      dateTime.date = value;
      stateCopy.showInputModal[formInputName + DATE_PICKER] = !stateCopy
        .showInputModal[formInputName + DATE_PICKER];
    }
    stateCopy.values[formInputName] = dateTime;
    this.setState(stateCopy);
  }

  private toggleInputModal(formInputName: string) {
    let stateCopy = { ...this.state };
    stateCopy.showInputModal[formInputName] = !stateCopy.showInputModal[
      formInputName
    ];
    this.setState(stateCopy);
  }

  private beforeSubmit(): void {
    if (this.isValid()) this.formProps.onSubmit(this.state.values);
  }

  public render() {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.headerText}>{this.formProps.title}</Text>
        </View>
        <View style={styles.body}>
          {this.formProps.formInputs.map((formInput) => (
            <View style={styles.formRow} key={formInput.name}>
              <Text style={styles.inputLabel}>
                {formInput.required
                  ? formInput.label
                  : formInput.label + ' (Optional)'}
              </Text>
              {formInput.input === InputType.Text && (
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { minWidth: '70%' }]}
                    value={this.state?.values[formInput.name]?.toString()}
                    onChangeText={(val) => this.onChange(formInput.name, val)}
                  />
                </View>
              )}
              {formInput.input === InputType.Number && (
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={this.state?.values[formInput.name]?.toString()}
                    onChangeText={(val) => this.onChange(formInput.name, val)}
                  />
                </View>
              )}
              {formInput.input === InputType.Slider && (
                <View style={styles.inputRow}>
                  <View style={styles.inputDateText}>
                    <View style={styles.inputRow}>
                      <Text style={styles.sliderLabel}>
                        {formInput.options![0].label}
                      </Text>
                      {!!this.state?.values[formInput.name] && (
                        <Text style={[styles.sliderLabel, styles.bold]}>
                          {
                            formInput.options![
                              this.state.values[formInput.name] - 1
                            ].label
                          }
                        </Text>
                      )}
                      <Text style={styles.sliderLabel}>
                        {
                          formInput.options![formInput.options!.length - 1]
                            .label
                        }
                      </Text>
                    </View>
                    <Slider
                      style={styles.slider}
                      minimumTrackTintColor="blue"
                      thumbTintColor="blue"
                      minimumValue={1}
                      maximumValue={formInput.options!.length}
                      step={1}
                      value={this.state?.values[formInput.name]}
                      onValueChange={(val) =>
                        this.onChange(formInput.name, val)
                      }
                    />
                  </View>
                </View>
              )}
              {formInput.input === InputType.Date && (
                <View style={styles.inputRow}>
                  {this.state?.showInputModal[formInput.name] && (
                    <DateTimePicker
                      mode="date"
                      value={new Date()}
                      onChange={(_, date) => {
                        if (!!date) this.onChange(formInput.name, date, true);
                      }}
                    />
                  )}
                  <Text
                    style={[styles.input, styles.inputDateText]}
                    onPress={() => this.toggleInputModal(formInput.name)}>
                    {!!this.state?.values[formInput.name]
                      ? dateToString(this.state.values[formInput.name])
                      : 'Please choose a date.'}
                  </Text>
                  <Icon
                    name="calendar-alt"
                    style={styles.icon}
                    onPress={() => this.toggleInputModal(formInput.name)}
                  />
                </View>
              )}
              {formInput.input === InputType.Time && (
                <View style={styles.inputRow}>
                  {this.state?.showInputModal[formInput.name] && (
                    <DateTimePicker
                      mode="time"
                      value={new Date()}
                      onChange={(_, time) => {
                        if (!!time) this.onChange(formInput.name, time, true);
                      }}
                    />
                  )}
                  <Text
                    style={[styles.input, styles.inputDateText]}
                    onPress={() => this.toggleInputModal(formInput.name)}>
                    {!!this.state?.values[formInput.name]
                      ? timeToString(this.state.values[formInput.name])
                      : 'Please choose a time.'}
                  </Text>
                  <Icon
                    name="clock"
                    style={styles.icon}
                    onPress={() => this.toggleInputModal(formInput.name)}
                  />
                </View>
              )}
              {formInput.input === InputType.DateTime && (
                <>
                  <View style={styles.inputRow}>
                    {this.state?.showInputModal[
                      formInput.name + DATE_PICKER
                    ] && (
                      <DateTimePicker
                        mode="date"
                        value={new Date()}
                        onChange={(_, date) => {
                          if (!!date)
                            this.onDateTimeChange(formInput.name, date, false);
                        }}
                      />
                    )}
                    <Text
                      style={[styles.input, styles.inputDateText]}
                      onPress={() =>
                        this.toggleInputModal(formInput.name + DATE_PICKER)
                      }>
                      {!!this.state?.values[formInput.name]?.date
                        ? dateToString(this.state.values[formInput.name].date)
                        : 'Please choose a date.'}
                    </Text>
                    <Icon
                      name="calendar-alt"
                      style={styles.icon}
                      onPress={() =>
                        this.toggleInputModal(formInput.name + DATE_PICKER)
                      }
                    />
                  </View>
                  <View style={styles.inputRow}>
                    {this.state?.showInputModal[
                      formInput.name + TIME_PICKER
                    ] && (
                      <DateTimePicker
                        mode="time"
                        value={new Date()}
                        onChange={(_, time) => {
                          if (!!time)
                            this.onDateTimeChange(formInput.name, time, true);
                        }}
                      />
                    )}
                    <Text
                      style={[styles.input, styles.inputDateText]}
                      onPress={() =>
                        this.toggleInputModal(formInput.name + TIME_PICKER)
                      }>
                      {!!this.state?.values[formInput.name]?.time
                        ? timeToString(this.state.values[formInput.name].time)
                        : 'Please choose a time.'}
                    </Text>
                    <Icon
                      name="clock"
                      style={styles.icon}
                      onPress={() =>
                        this.toggleInputModal(formInput.name + TIME_PICKER)
                      }
                    />
                  </View>
                </>
              )}
              {formInput.input === InputType.Wheel && (
                <View style={styles.inputRow}>
                  {this.state?.showInputModal[formInput.name] && (
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={true}>
                      <View style={styles.center}>
                        <View style={styles.modal}>
                          <Text style={[styles.bold, styles.modalTitle]}>
                            {formInput.label}
                          </Text>
                          <WheelPicker
                            data={formInput.options!.map((o) => o.label)}
                            selectedItem={formInput.options?.findIndex(
                              (o) =>
                                o.value === this.state?.values[formInput.name],
                            )}
                            onItemSelected={(res: number) => {
                              const value: number = formInput.options![res]
                                .value;
                              this.onChange(formInput.name, value);
                            }}
                            selectedItemTextFontFamily="initial"
                            itemTextFontFamily="initial"
                          />
                          <View style={styles.inputRow}>
                            <TouchableOpacity
                              onPress={() =>
                                this.toggleInputModal(formInput.name)
                              }>
                              <Text style={styles.colorBlue}>Confirm</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  )}
                  <Text
                    style={[styles.input, styles.inputDateText]}
                    onPress={() => this.toggleInputModal(formInput.name)}>
                    {!!this.state?.values[formInput.name]
                      ? formInput.options?.find(
                          (o) => o.value === this.state.values[formInput.name],
                        )?.label
                      : 'Please select an item.'}
                  </Text>
                  <Icon
                    name="bars"
                    style={styles.icon}
                    onPress={() => this.toggleInputModal(formInput.name)}
                  />
                </View>
              )}
              {!!this.state?.errors[formInput.name] && (
                <Text style={styles.error}>
                  {this.state.errors[formInput.name]}
                </Text>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={() => this.beforeSubmit()}>
            <View style={styles.submitButton}>
              <Text style={styles.submitButtonText}>
                {this.props.submitButtonLabel || 'Submit'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    padding: 16,
  },
  headerText: {
    fontSize: 28,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  body: {
    paddingBottom: 24,
    minHeight: '100%',
  },
  formRow: {
    margin: 12,
  },
  inputLabel: {
    fontWeight: 'bold',
    paddingLeft: 4,
  },
  inputRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  input: {
    borderBottomColor: 'blue',
    borderBottomWidth: 1,
  },
  inputDateText: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  icon: {
    fontSize: 32,
    paddingRight: 12,
    paddingLeft: 24,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  slider: {
    color: 'blue',
    width: '100%',
    marginTop: 8,
  },
  sliderLabel: {
    marginTop: 'auto',
    color: 'grey',
    width: 72,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: 'black',
  },
  error: {
    color: 'red',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 52,
    backgroundColor: 'blue',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  submitButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  modalTitle: {
    paddingBottom: 12,
  },
});
