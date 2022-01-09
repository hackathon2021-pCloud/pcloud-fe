import { useUser } from "@auth0/nextjs-auth0";
import { Button, Collapse } from "antd";
import { Fragment } from "react";
import Card from "../Card";
import BasicLayout from "../Layout";
import { KeyOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Key from './Key.svg'
import * as style from './index.module.css'
import Input from "../Input";
import formatDate from "../../client-utils/formatDate";

export default function Register() {
  const { user } = useUser();
  const router = useRouter;
  console.log(Key)

  return (
    <BasicLayout title="Setting">
      <Fragment>
        <h1 className="textMedium15">Keys</h1>
        <Card className={style.keyCard}>
          <div className={style.keyCardHeader}>
            <div
              className={style.keyCardHeaderName}
              style={{ display: "flex", alignItems: "center" }}
            >
              <svg
                height="32"
                aria-hidden="true"
                viewBox="0 0 24 24"
                version="1.1"
                width="32"
                data-view-component="true"
                className="octicon octicon-key"
              >
                <path d="M16.75 8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"></path>
                <path
                  fillRule="evenodd"
                  d="M15.75 0a8.25 8.25 0 00-7.851 10.79L.513 18.178A1.75 1.75 0 000 19.414v2.836C0 23.217.784 24 1.75 24h1.5A1.75 1.75 0 005 22.25v-1a.25.25 0 01.25-.25h2.735a.75.75 0 00.545-.22l.214-.213A.875.875 0 009 19.948V18.5a.25.25 0 01.25-.25h1.086c.464 0 .91-.184 1.237-.513l1.636-1.636A8.25 8.25 0 1015.75 0zM9 8.25a6.75 6.75 0 114.288 6.287.75.75 0 00-.804.168l-1.971 1.972a.25.25 0 01-.177.073H9.25A1.75 1.75 0 007.5 18.5v1H5.25a1.75 1.75 0 00-1.75 1.75v1a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-2.836a.25.25 0 01.073-.177l7.722-7.721a.75.75 0 00.168-.804A6.73 6.73 0 019 8.25z"
                ></path>
              </svg>
              <p className="textMedium14Black">
                SHA256:tlJ9HyM/XosSQzJ9xorEAo/n8mchb59h9UfV+s8ZgeA
              </p>
            </div>
            <Button danger>Delete</Button>
          </div>
          <div className={style.keyCardContent}>
            <Input
              label="Creater"
              value={user.email}
              type="showing"
              onChange={() => {}}
              className={style.keyCardInfo}
            />
            <Input
              label="Created Date"
              value={formatDate(Number(new Date("2022-01-01")))}
              type="showing"
              onChange={() => {}}
              className={style.keyCardInfo}
            />
            <Input
              label="Last Used"
              value={formatDate(Number(new Date("2022-01-09")))}
              type="showing"
              onChange={() => {}}
              className={style.keyCardInfo}
            />
          </div>
          <Collapse bordered={false} className={style.keyContent}>
            <Collapse.Panel header="Content" key="1">
              <pre>
                -----BEGIN PUBLIC KEY-----
                MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs9jLGd5lDqLbOFBsqqOY
                jap3RJyMW3MM6oo1PX3C2CogTKJTYh7tXbN/Lem5Ot2MImA9uPKuln1DSadSYLbg
                XORa3yCjXdyDB4nxNg7kE/Uiy7Gn4rPn3/crD/quEo/NEmW/ULzUh/rxBNBlZwUJ
                8BZ+08xh6ev3JhN/NtL+pSwfrRLabQ2fF4sj1gwYbJlft2kJA0dPDOU23rUvSWbv
                AUIuylsOBhvRpl0Mwma/Dq1ZyrzRWN0fgrSXRC8HDCArWiln3qpPBaxWqd28x4dL
                rXB1LwnbSGaJ4iSo5PGex2+Qn0dvuWxHiZZF95t8QAFEjgxm0VtlBxbFZ7sbP+KC
                /wIDAQAB -----END PUBLIC KEY-----
              </pre>
            </Collapse.Panel>
          </Collapse>
        </Card>
        <Card className={style.keyCard}>
          <div className={style.keyCardHeader}>
            <div
              className={style.keyCardHeaderName}
              style={{ display: "flex", alignItems: "center" }}
            >
              <svg
                height="32"
                aria-hidden="true"
                viewBox="0 0 24 24"
                version="1.1"
                width="32"
                className="octicon octicon-key"
              >
                <path d="M16.75 8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"></path>
                <path
                  fillRule="evenodd"
                  d="M15.75 0a8.25 8.25 0 00-7.851 10.79L.513 18.178A1.75 1.75 0 000 19.414v2.836C0 23.217.784 24 1.75 24h1.5A1.75 1.75 0 005 22.25v-1a.25.25 0 01.25-.25h2.735a.75.75 0 00.545-.22l.214-.213A.875.875 0 009 19.948V18.5a.25.25 0 01.25-.25h1.086c.464 0 .91-.184 1.237-.513l1.636-1.636A8.25 8.25 0 1015.75 0zM9 8.25a6.75 6.75 0 114.288 6.287.75.75 0 00-.804.168l-1.971 1.972a.25.25 0 01-.177.073H9.25A1.75 1.75 0 007.5 18.5v1H5.25a1.75 1.75 0 00-1.75 1.75v1a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-2.836a.25.25 0 01.073-.177l7.722-7.721a.75.75 0 00.168-.804A6.73 6.73 0 019 8.25z"
                ></path>
              </svg>
              <p className="textMedium14Black">
                SHA256:AldtflWKQbLsM2OhwfVuh09rzGQo4hhrGhMvW7fF5N8
              </p>
            </div>
            <Button danger>Delete</Button>
          </div>
          <div className={style.keyCardContent}>
            <Input
              label="Creater"
              value={user.email}
              type="showing"
              onChange={() => {}}
              className={style.keyCardInfo}
            />
            <Input
              label="Created Date"
              value={formatDate(Number(new Date("2022-01-05")))}
              type="showing"
              onChange={() => {}}
              className={style.keyCardInfo}
            />
            <Input
              label="Last Used"
              value={formatDate(Number(new Date("2022-01-08")))}
              type="showing"
              onChange={() => {}}
              className={style.keyCardInfo}
            />
          </div>
          <Collapse bordered={false} className={style.keyContent}>
            <Collapse.Panel header="Content" key="1">
              <pre>
                -----BEGIN PUBLIC KEY-----
                MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs9jLGd5lDqLbOFBsqqOY
                jap3RJyMW3MM6oo1PX3C2CogTKJTYh7tXbN/Lem5Ot2MImA9uPKuln1DSadSYLbg
                XORa3yCjXdyDB4nxNg7kE/Uiy7Gn4rPn3/crD/quEo/NEmW/ULzUh/rxBNBlZwUJ
                8BZ+08xh6ev3JhN/NtL+pSwfrRLabQ2fF4sj1gwYbJlft2kJA0dPDOU23rUvSWbv
                AUIuylsOBhvRpl0Mwma/Dq1ZyrzRWN0fgrSXRC8HDCArWiln3qpPBaxWqd28x4dL
                rXB1LwnbSGaJ4iSo5PGex2+Qn0dvuWxHiZZF95t8QAFEjgxm0VtlBxbFZ7sbP+KC
                /wIDAQAB -----END PUBLIC KEY-----
              </pre>
            </Collapse.Panel>
          </Collapse>
        </Card>
      </Fragment>
    </BasicLayout>
  );
}
