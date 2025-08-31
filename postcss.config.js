const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/fantasymaps" : "";

module.exports = {
  plugins: {
    "postcss-url": {
      url: (asset) => {
        // Only modify absolute URLs that start with /
        if (asset.url.startsWith("/") && !asset.url.startsWith("//")) {
          return basePath + asset.url;
        }
        return asset.url;
      },
    },
    autoprefixer: {},
  },
};
