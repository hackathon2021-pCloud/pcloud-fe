import { Select, Progress } from "antd";
import cx from 'classnames'
import * as style from "./Syncing.module.css";

enum SelectOptions {
  day = "Today",
  week = "This Week",
  month = "This Month",
}
const {Option} = Select
export default function Syncing() {
  return (
    <section className={style.syncing}>
      <div className={style.header}>
        <p className={cx(style.syncState, "textMedium13")}>
          8 Clusters is syncing
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
      <Progress
        strokeColor="#2ED47A"
        percent={50}
        status="active"
        showInfo={false}
      />
    </section>
  );
}
