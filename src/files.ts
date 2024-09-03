import mountPackgeJson from "./mount/mount_package.json?raw";
import bash from "./mount/dnsperf.sh?raw";
import bench from "./mount/bench.js?raw";

export const files = {
  "package.json": {
    file: {
      contents: mountPackgeJson,
    },
  },
  "dnsperf.sh": {
    file: {
      contents: bash,
    },
  },
  "bench.js": {
    file: {
      contents: bench,
    },
  },
};

export const hostFiles = {
  hosts: {
    file: {
      contents: `
      127.0.0.1        localhost
      ::1              localhost
      127.0.1.1        myhostname
      `,
    },
  },
};
