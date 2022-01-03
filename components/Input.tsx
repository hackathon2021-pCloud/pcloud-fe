import cx from 'classnames'
import { ChangeEvent } from 'react';
import * as style from "./Input.module.css";

export default function Input({
  value,
  label,
  type,
  onChange,
  className
}: {
  value: string;
  label: string;
  type: "showing" | "editing";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string
}) {
  return (
    <label className={cx(style.wrapper, style[type], className)}>
      <span className={style.label}>{label}</span>
      <input disabled={type === 'showing'} value={value} className={style.input} onChange={onChange}/>
    </label>
  );
}
