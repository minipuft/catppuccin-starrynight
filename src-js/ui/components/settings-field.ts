// Type definitions for StarryNight in-built settings framework
// This is a trimmed subset of the original spcr-settings typings – we only
// implement the shapes needed by our own theme.

export interface ISettingsFieldHidden {
  type: "hidden";
  defaultValue: any;
}

export interface ISettingsFieldInput {
  type: "input";
  description?: string;
  defaultValue: any;
  inputType?: string;
  events?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
}

export interface ISettingsFieldDropdown {
  type: "dropdown";
  description?: string;
  defaultValue: string;
  options: string[];
  events?: Partial<React.SelectHTMLAttributes<HTMLSelectElement>>;
}

export interface ISettingsFieldButton {
  type: "button";
  description?: string;
  value: any;
  events?: Partial<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}

export interface ISettingsFieldToggle {
  type: "toggle";
  description?: string;
  defaultValue: boolean;
  events?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
}

export type ISettingsField =
  | ISettingsFieldHidden
  | ISettingsFieldDropdown
  | ISettingsFieldInput
  | ISettingsFieldButton
  | ISettingsFieldToggle;

export type NewValueTypes = boolean | string;
