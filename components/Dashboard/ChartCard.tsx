import { Fragment } from "react";
import cx from "classnames";
import Card from "../Card";
import * as style from "./ChartCard.module.css";
import { Select, Progress } from "antd";

const {Option} = Select

enum SelectOptions {
  day = "Today",
  week = "This Week",
  month = "This Month",
}
export default function ChartCard() {
  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <p className={cx(style.backupTitle)}>
          Backup Total Size
        </p>
        <div className={style.selectWrapper}>
          Show:
          <Select className={style.select} defaultValue={SelectOptions.month}>
            {Object.values(SelectOptions).map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className={style.chartWrapper}>
      </div>
    </div>
  );
}
