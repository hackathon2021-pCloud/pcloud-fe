import Layout from "../Layout";
import Card from "../Card";
import ClusterList from "./ClusterList";
import * as style from './index.module.css'
import Syncing from "./Syncing";
import { Fragment } from "react";
import ChartCard from "./ChartCard";
import PriceChartCard from './PriceChartCard';

export default function Dashbaord() {
  return (
    <Layout title="Dashboard">
      <div className={style.page}>
        <Card className={style.clusterCard}>
          <Fragment>
            <Syncing />
            <ClusterList />
          </Fragment>
        </Card>
        <div className={style.cardList}>
          <Card className={style.backupSizeCard}>
            <PriceChartCard />
          </Card>
          <Card className={style.backupSizeCard}>
            <ChartCard />
          </Card>
        </div>
      </div>
    </Layout>
  );
}
