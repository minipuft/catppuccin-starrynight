// Custom type definitions for spcr-settings v1.3.1
// Based on actual implementation analysis

declare module "spcr-settings" {
  interface ISettingsFieldBase {
    type: string;
    description?: string;
    defaultValue?: any;
  }

  interface ISettingsFieldButton extends ISettingsFieldBase {
    type: "button";
    value: string;
    events?: {
      onClick?: (e?: any) => void;
    };
  }

  interface ISettingsFieldInput extends ISettingsFieldBase {
    type: "input";
    defaultValue: string;
    inputType?: string;
    events?: {
      onChange?: (e?: any) => void;
    };
  }

  interface ISettingsFieldToggle extends ISettingsFieldBase {
    type: "toggle";
    defaultValue: boolean;
    events?: {
      onChange?: (e?: any) => void;
      onClick?: (e?: any) => void;
    };
  }

  interface ISettingsFieldDropdown extends ISettingsFieldBase {
    type: "dropdown";
    defaultValue: string;
    options: string[];
    events?: {
      onSelect?: () => void;
      onChange?: (e?: any) => void;
    };
  }

  interface ISettingsFieldHidden extends ISettingsFieldBase {
    type: "hidden";
    defaultValue: any;
  }

  type ISettingsField =
    | ISettingsFieldButton
    | ISettingsFieldInput
    | ISettingsFieldToggle
    | ISettingsFieldDropdown
    | ISettingsFieldHidden;

  export class SettingsSection {
    public name: string;
    public settingsId: string;
    public settingsFields: { [nameId: string]: ISettingsField };

    constructor(
      name: string,
      settingsId: string,
      initialSettingsFields?: { [key: string]: ISettingsField }
    );

    // Core methods
    pushSettings(): Promise<void>;
    rerender(): void;

    // Field creation methods
    addButton(
      nameId: string,
      description: string,
      value: string,
      onClick?: () => void,
      events?: ISettingsFieldButton["events"]
    ): void;

    addInput(
      nameId: string,
      description: string,
      defaultValue: string,
      onChange?: () => void,
      inputType?: string,
      events?: ISettingsFieldInput["events"]
    ): void;

    addToggle(
      nameId: string,
      description: string,
      defaultValue: boolean,
      onChange?: () => void,
      events?: ISettingsFieldToggle["events"]
    ): void;

    addDropDown(
      nameId: string,
      description: string,
      options: string[],
      defaultIndex: number,
      onSelect?: () => void,
      events?: ISettingsFieldDropdown["events"]
    ): void;

    addHidden(nameId: string, defaultValue: any): void;

    // Value access methods
    getFieldValue(nameId: string): any;
    setFieldValue(nameId: string, newValue: any): void;
  }
}
