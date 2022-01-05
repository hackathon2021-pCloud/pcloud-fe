import { useUser } from "@auth0/nextjs-auth0";
import { Select, Progress } from "antd";
import cx from 'classnames'
import useUserClusters from "../../client-utils/useUserClusters";
import * as style from "./Syncing.module.css";

enum SelectOptions {
  day = "Today",
  week = "This Week",
  month = "This Month",
}
const {Option} = Select
export default function Syncing() {
  const {user} = useUser() 
  const userClusterSwr = useUserClusters(user.sub);

  const clusterCount = userClusterSwr.data?.clusterInfos?.length || 0;

  return (
    <section className={style.syncing}>
      <div className={style.header}>
        <p className={cx(style.syncState, "textMedium13")}>
          {clusterCount} Clusters is syncing
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
        percent={clusterCount === 0 ? 0 : 75}
        status="active"
        showInfo={false}
      />
    </section>
  );
}
