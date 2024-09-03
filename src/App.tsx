import React, { FunctionComponent, useLayoutEffect, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { files, hostFiles } from "./files";
import "./style.css";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { start } from "repl";

const App: FunctionComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    async function installDependencies(
      instance: WebContainer,
      terminal: Terminal
    ) {
      // Install dependencies
      const installProcess = await instance.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );
      // Wait for install command to exit
      return installProcess.exit;
    }

    async function runDnsBench(instance: WebContainer, terminal: Terminal) {
      const process = await instance.spawn("node", ["bench.js"]);
      process.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );
      return process.exit;
    }

    async function startShell(instance: WebContainer, terminal: Terminal) {
      const shellProcess = await instance.spawn("jsh");
      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );
      const input = shellProcess.input.getWriter();
      terminal.onData((data) => {
        input.write(data);
      });
      return shellProcess;
    }
    const init = async () => {
      const webcontainerInstance = await WebContainer.boot();
      // webcontainerInstance.on("server-ready", (port, url) => {
      //   iframeRef.current!.src = url;
      // });
      await webcontainerInstance.mount(files);
      // await webcontainerInstance.mount(hostFiles, { mountPoint: "/etc" });

      const terminal = new Terminal({
        convertEol: true,
      });

      terminal.open(terminalRef.current);

      const exitCode1 = await installDependencies(
        webcontainerInstance,
        terminal
      );
      await runDnsBench(webcontainerInstance, terminal);

      await startShell(webcontainerInstance, terminal);
      // if (exitCode1 !== 0 || exitCode2 !== 0) {
      //   console.log("Installation failed");
      // }
    };
    init();
  }, []);

  return <div ref={terminalRef} />;
};

export default App;
