import { PropsWithChildren } from "react";
import "../styles/globals.css";
import "@tremor/react/dist/esm/tremor.css";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
