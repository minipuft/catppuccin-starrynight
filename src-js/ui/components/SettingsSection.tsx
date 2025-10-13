// Use Spicetify's provided React instead of bundled external
// ESBuild marks react/react-dom as external → converts to require() at runtime
// Spicetify environment doesn't support require() (no CommonJS runtime)
const React = (window as any).Spicetify?.React;
const ReactDOM = (window as any).Spicetify?.ReactDOM;
const { useState } = React || {}; // Destructure hooks after runtime resolution

import {
  ISettingsField,
  ISettingsFieldButton,
  ISettingsFieldDropdown,
  ISettingsFieldInput,
  ISettingsFieldToggle,
} from "./SettingsField";
import { settings } from "@/config";

/**
 * StarryNight-internal replica of the SettingsSection helper from the
 * spcr-settings package. We keep just the functionality we need (dropdowns,
 * toggles, inputs and buttons) so we can remove the npm dependency.
 */
export class SettingsSection {
  public settingsFields: { [nameId: string]: ISettingsField } =
    this.initialSettingsFields;
  private stopHistoryListener: any;
  public setRerender: Function | null = null; // Made public for modal usage

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
    events?: ISettingsFieldDropdown["events"],
    labels?: string[] // Optional user-friendly labels for display
  ) => {
    this.settingsFields[nameId] = {
      type: "dropdown",
      description,
      defaultValue: options[defaultIndex],
      options,
      labels, // Store labels if provided
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

  /* ----- generic storage helpers (use TypedSettingsManager) -------- */
  getFieldValue = <T,>(nameId: string): T | undefined => {
    // Read from TypedSettingsManager instead of direct LocalStorage
    // TypedSettingsManager handles all storage access and type conversion
    return settings.get(nameId as any) as T | undefined;
  };

  setFieldValue(nameId: string, newValue: any) {
    // Write through TypedSettingsManager instead of direct LocalStorage
    // This ensures onChange() callbacks fire and systems update automatically
    settings.set(nameId as any, newValue);
  }

  /* ---------------------- React wrappers ----------------------------- */
  public FieldsContainer = () => { // Made public for modal usage
    const [nonce, setNonce] = (useState as any)(0);
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
    const [value, setVal] = (useState as any)(initial);

    const setValue = (v: any) => {
      setVal(v);

      // Use TypedSettingsManager for all storage operations
      // This automatically triggers onChange() callbacks → ThemeLifecycleCoordinator → systems
      settings.set(nameId as any, v);

      // No longer need: Direct LocalStorage write (removed)
      // No longer need: Deprecated CustomEvent emission (removed)
      // TypedSettingsManager.set() handles onChange() callbacks automatically
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
        // Use labels if provided, otherwise use options as display text
        const displayLabels = field.labels || field.options;
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
                {displayLabels[i]}
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
