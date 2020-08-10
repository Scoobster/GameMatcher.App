export interface FormState {
  values: { [key: string]: any };
  errors: { [key: string]: string };
  showInputModal: { [key: string]: boolean };
}

export interface FormProps {
  title: string;
  formInputs: Array<FormInput>;
  onSubmit(Values: any): void;
  submitButtonLabel?: string;
}

export interface FormInput {
  label: string;
  name: string;
  input: InputType;
  initialValue?: any;
  required?: boolean;
  validators?: Array<(val: any) => string>;
  options?: Array<InputOption>;
}

export interface InputOption {
  label: string;
  value: number;
}

export enum InputType {
  Text,
  Number,
  Date,
  Time,
  DateTime,
  Wheel,
  Slider,
}

export class DateTime {
  public date?: Date;
  public time?: Date;

  public combined(): Date {
    if (!this.date || !this.time) return new Date('Invalid');
    return new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate(),
      this.time.getHours(),
      this.time.getMinutes(),
    );
  }

  public isValid(): boolean {
    return !!this.date && !!this.time;
  }
}

export const SQUASH_GRADE_OPTIONS: Array<InputOption> = [
  {
    label: 'Beginner',
    value: 1,
  },
  {
    label: 'F',
    value: 2,
  },
  {
    label: 'E2',
    value: 3,
  },
  {
    label: 'E1',
    value: 4,
  },
  {
    label: 'D2',
    value: 5,
  },
  {
    label: 'D1',
    value: 6,
  },
  {
    label: 'C2',
    value: 7,
  },
  {
    label: 'C1',
    value: 8,
  },
  {
    label: 'B2',
    value: 9,
  },
  {
    label: 'B1',
    value: 10,
  },
  {
    label: 'A2',
    value: 11,
  },
  {
    label: 'A1',
    value: 12,
  },
];
