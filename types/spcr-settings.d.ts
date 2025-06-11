declare module "spcr-settings" {
  export class SettingsSection {
    constructor(name: string, id: string);

    addDropDown(
      id: string,
      label: string,
      options: string[],
      defaultIndex: number
    ): void;

    addToggle(id: string, label: string, defaultValue: boolean): void;

    addInput(id: string, label: string, defaultValue: string): void;

    getFieldValue(key: string): any;

    setFieldValue(key: string, value: any): void;
  }
}
