import React from "react";
import { SwitchProps } from "./Switch.types";

export default function Switch({checked, onChange, id}: SwitchProps) {
  return (
    <div className="switch-button">
      <input
        type="checkbox"
        name="switch-button"
        id={id.toString()}
        checked={checked}
        onChange={onChange}
        className="switch-button__checkbox"
      />

      <label htmlFor={id.toString()} className="switch-button__label"></label>
    </div>
  );
}
