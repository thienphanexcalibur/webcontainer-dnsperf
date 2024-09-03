// run `node index.js` in the terminal
import { query, wellknown } from "dns-query";
import { performance, PerformanceObserver } from "perf_hooks";

const endpoints = await wellknown.endpoints(["@cloudflare"]);
console.log(
  "testing",
  endpoints.map((item) => item.name)
);

const measures = [];
const obs = new PerformanceObserver((list, observer) => {
  const entries = list.getEntries().filter(({ name }) => name === "dns");
  console.log(
    "Query speed",
    entries.map((item) => item.duration),
    "ms"
  );
});
obs.observe({ entryTypes: ["measure"], buffered: true });

performance.mark("dns_before");
const { answers, rcode } = await query(
  { question: { type: "A", name: "google.com" } },
  { endpoints }
);

console.log(answers);
performance.mark("dns_after");

performance.measure("dns", "dns_before", "dns_after");
