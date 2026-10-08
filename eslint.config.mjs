import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber mutates buffers and seeds random geometry by design (inside useFrame/useMemo).
    files: ["src/components/three/**/*.tsx"],
    rules: { "react-hooks/immutability": "off", "react-hooks/purity": "off" },
  },
  {
    // Mount detection and URL-param hydration intentionally set state once in an effect.
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "public/**"] },
];

export default config;
