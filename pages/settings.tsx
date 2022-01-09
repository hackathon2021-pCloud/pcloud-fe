import { Button } from "antd";
import { Fragment } from "react";
import AuthCheck from "../components/AuthCheck";
import Setting from '../components/Setting';

export default function Register() {
  return (
    <AuthCheck>
      <Setting />
    </AuthCheck>
  );
}
