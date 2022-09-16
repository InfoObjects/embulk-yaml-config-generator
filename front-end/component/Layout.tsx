import React from "react";
import Head from "next/head";
import Header from "./Header";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { pageInfo } from "../utils/global";

type Prop = {
  children: any;
};
const Layout: React.FC<Prop> = ({ children }) => {
  const router = useRouter();
  const pageDetail: any = pageInfo[router.pathname];
  return (
    <>
      <Head>
        <title>{pageDetail.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Header pageDetail={pageDetail} />

      <Container fluid>{children}</Container>
    </>
  );
};

export default Layout;