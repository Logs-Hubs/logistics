import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Il repo ha un secondo package-lock.json (progetto principale in ../); questo pin
  // evita che Turbopack cerchi di indovinare la workspace root e sbagli.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
