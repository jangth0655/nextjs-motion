import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }: AppProps) {
  const fetcher = async (url: string) => await (await fetch(url)).json();

  return (
    <SWRConfig value={{ fetcher }}>
      <div className="">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
