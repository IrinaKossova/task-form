import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends React.Component {
  render() {
    return (
      <Html>
        <Head>
        <link rel="icon" href="/favicon.ico"/>
        <title>Создать Задачу</title>
        </Head>
        <body className="font-sans bg-official-blue-light text-official-blue">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;