/** @type {import('next').NextConfig} */
const nextConfig = {
  // Wir entfernen 'eslint' und 'typescript' hier, um den Config-Fehler zu vermeiden.
  // Stattdessen nutzen wir Webpack, um den 'node:process' Fehler zu beheben.

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        zlib: false,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
      };

      config.plugins.push(
        new (class {
          apply(compiler) {
            compiler.hooks.normalModuleFactory.tap("RemoveNodePrefix", (nmf) => {
              nmf.hooks.beforeResolve.tap("RemoveNodePrefix", (resolve) => {
                if (resolve.request.startsWith("node:")) {
                  resolve.request = resolve.request.substring(5); 
                }
              });
            });
          }
        })()
      );
    }
    return config;
  },
};

export default nextConfig;
