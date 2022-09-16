import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/codemirror.css"
import type { AppProps } from "next/app";
import Layout from "../component/Layout";
import { useEffect } from "react";
import SSRProvider from "react-bootstrap/SSRProvider";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    //import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <SSRProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SSRProvider>
  );
}

export default MyApp;
