import Layout from "../Layout";
import Card from "../Card";
import ClusterList from "./ClusterList";
import * as style from './index.module.css'
import Syncing from "./Syncing";
import { Fragment } from "react";
import ChartCard from "./ChartCard";

export default function Dashbaord() {
  return (
    <Layout>
      <div className={style.page}>
        <Card className={style.clusterCard}>
          <Fragment>
            <Syncing />
            <ClusterList />
          </Fragment>
        </Card>
        <Card className={style.backupSizeCard}>
          <ChartCard />
        </Card>
      </div>
    </Layout>
  );
}
