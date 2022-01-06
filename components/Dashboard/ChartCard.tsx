import cx from "classnames";
import * as style from "./ChartCard.module.css";
import { Select } from "antd";

import dynamic from "next/dynamic";
import Loader from "../Loader";

const Chart = dynamic(() => import("./Chart"), {
  loading: () => <Loader />,
});

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
        <Chart />
      </div>
    </div>
  );
}
