import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  ISettingsField,
  ISettingsFieldButton,
  ISettingsFieldDropdown,
  ISettingsFieldInput,
  ISettingsFieldToggle,
} from "./settings-field";

/**
 * StarryNight-internal replica of the SettingsSection helper from the
 * spcr-settings package. We keep just the functionality we need (dropdowns,
 * toggles, inputs and buttons) so we can remove the npm dependency.
 */
export class SettingsSection {
  public settingsFields: { [nameId: string]: ISettingsField } =
    this.initialSettingsFields;
  private stopHistoryListener: any;
  private setRerender: Function | null = null;

  constructor(
    public name: string,
    public settingsId: string,
    public initialSettingsFields: { [key: string]: ISettingsField } = {}
  ) {}

  /** Mounts the section when the user visits the Spotify settings route */
  pushSettings = async () => {
    // ensure defaults saved once
    Object.entries(this.settingsFields).forEach(([nameId, field]) => {
      if (field.type !== "button" && this.getFieldValue(nameId) === undefined) {
        this.setFieldValue(nameId, (field as any).defaultValue);
      }
    });

    // wait for History API
    while (!(window as any).Spicetify?.Platform?.History?.listen) {
      await new Promise((r) => setTimeout(r, 100));
    }

    // (re)register listener
    if (this.stopHistoryListener) this.stopHistoryListener();
    this.stopHistoryListener = (
      window as any
    ).Spicetify.Platform.History.listen((e: any) => {
      if (e.pathname === "/preferences") this.render();
    });

    // initial render if already on settings
    if (
      (window as any).Spicetify.Platform.History.location.pathname ===
      "/preferences"
    ) {
      await this.render();
    }
  };

  rerender = () => {
    this.setRerender?.(Math.random());
  };

  /* --------------------- internal render helpers --------------------- */
  private async render() {
    // wait for known element to ensure settings UI mounted
    while (!document.getElementById("desktop.settings.selectLanguage")) {
      if (
        (window as any).Spicetify.Platform.History.location.pathname !==
        "/preferences"
      )
        return;
      await new Promise((r) => setTimeout(r, 100));
    }

    const container = document.querySelector(
      ".main-view-container__scroll-node-child main div"
    );
    if (!container)
      return console.error("[StarryNight] settings container not found");

    let host = Array.from(container.children).find(
      (c) => c.id === this.settingsId
    ) as HTMLElement | undefined;
    if (!host) {
      host = document.createElement("div");
      host.id = this.settingsId;
      container.appendChild(host);
    }

    ReactDOM.render(<this.FieldsContainer />, host);
  }

  /* ----------------------- field creators ---------------------------- */
  addDropDown = (
    nameId: string,
    description: string,
    options: string[],
    defaultIndex: number,
    _onSelect?: () => void, // unused – consistent signature
    events?: ISettingsFieldDropdown["events"]
  ) => {
    this.settingsFields[nameId] = {
      type: "dropdown",
      description,
      defaultValue: options[defaultIndex],
      options,
      events,
    } as ISettingsFieldDropdown;
  };

  /** Toggle (checkbox) */
  addToggle = (
    nameId: string,
    description: string,
    defaultValue: boolean,
    events?: ISettingsFieldToggle["events"]
  ) => {
    this.settingsFields[nameId] = {
      type: "toggle",
      description,
      defaultValue,
      events,
    } as ISettingsFieldToggle;
  };

  /** Text / number / color input */
  addInput = (
    nameId: string,
    description: string,
    defaultValue: string,
    inputType: string = "text",
    events?: ISettingsFieldInput["events"]
  ) => {
    this.settingsFields[nameId] = {
      type: "input",
      description,
      defaultValue,
      inputType,
      events,
    } as ISettingsFieldInput;
  };

  /* ----- generic storage helpers (use Spicetify.LocalStorage) -------- */
  private storageKey(nameId: string) {
    return `${this.settingsId}.${nameId}`;
  }
  getFieldValue = <T,>(nameId: string): T | undefined => {
    return JSON.parse(
      (window as any).Spicetify?.LocalStorage.get(this.storageKey(nameId)) ||
        "null"
    )?.value;
  };
  setFieldValue(nameId: string, newValue: any) {
    (window as any).Spicetify?.LocalStorage.set(
      this.storageKey(nameId),
      JSON.stringify({ value: newValue })
    );
  }

  /* ---------------------- React wrappers ----------------------------- */
  private FieldsContainer = () => {
    const [nonce, setNonce] = useState(0);
    this.setRerender = setNonce;

    return (
      <div className="x-settings-section" key={nonce}>
        <h2 className="TypeElement-cello-textBase-type">{this.name}</h2>
        {Object.entries(this.settingsFields).map(([nameId, field]) => (
          <this.Field key={nameId} nameId={nameId} field={field} />
        ))}
      </div>
    );
  };

  private Field = ({
    nameId,
    field,
  }: {
    nameId: string;
    field: ISettingsField;
  }) => {
    const id = `${this.settingsId}.${nameId}`;
    const initial =
      field.type === "button"
        ? (field as ISettingsFieldButton).value
        : this.getFieldValue<any>(nameId) ?? (field as any).defaultValue;
    const [value, setVal] = useState<any>(initial);

    const setValue = (v: any) => {
      setVal(v);
      this.setFieldValue(nameId, v);
    };

    if (field.type === "hidden") return <></>;

    const Label = (
      <label className="TypeElement-viola-textSubdued-type" htmlFor={id}>
        {field.description || ""}
      </label>
    );

    let Control: React.ReactElement | null = null;

    switch (field.type) {
      case "dropdown":
        Control = (
          <select
            className="main-dropDown-dropDown"
            id={id}
            {...field.events}
            onChange={(e) => {
              const idx = (e.currentTarget as HTMLSelectElement).selectedIndex;
              const newVal = field.options[idx];
              setValue(newVal);
              field.events?.onChange?.(e);
            }}
          >
            {field.options.map((opt, i) => (
              <option key={opt} value={opt} selected={opt === value}>
                {opt}
              </option>
            ))}
          </select>
        );
        break;
      case "toggle":
        Control = (
          <label className="x-settings-secondColumn x-toggle-wrapper">
            <input
              id={id}
              className="x-toggle-input"
              type="checkbox"
              checked={!!value}
              {...(field as ISettingsFieldToggle).events}
              onClick={(e) => {
                const checked = (e.currentTarget as HTMLInputElement).checked;
                setValue(checked);
                (field as ISettingsFieldToggle).events?.onClick?.(e);
              }}
            />
            <span className="x-toggle-indicatorWrapper">
              <span className="x-toggle-indicator"></span>
            </span>
          </label>
        );
        break;
      case "input":
        Control = (
          <input
            className="x-settings-input"
            id={id}
            dir="ltr"
            value={value as string}
            type={(field as ISettingsFieldInput).inputType || "text"}
            {...(field as ISettingsFieldInput).events}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              (field as ISettingsFieldInput).events?.onChange?.(e);
            }}
          />
        );
        break;
      case "button":
        Control = (
          <button
            id={id}
            className="Button-sc-y0gtbx-0 Button-small-buttonSecondary-useBrowserDefaultFocusStyle x-settings-button"
            {...(field as ISettingsFieldButton).events}
            onClick={(e) => {
              (field as ISettingsFieldButton).events?.onClick?.(e);
            }}
            type="button"
          >
            {value}
          </button>
        );
        break;
      default:
        Control = null;
    }

    return (
      <div className="x-settings-row">
        <div className="x-settings-firstColumn">{Label}</div>
        <div className="x-settings-secondColumn">{Control}</div>
      </div>
    );
  };
}
