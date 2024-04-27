const path = require("node:path")
const fs = require("node:fs")

function removeLocales(localesPath) {
  try {
    const files = fs.readdirSync(localesPath);
    files
      .filter((file) => file.endsWith(".pak"))
      .forEach((file) => fs.rmSync(path.join(localesPath, file)))
  } catch (err) {
    console.error(`remove locales error: ${err}`)
  }
}

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './resources/icon',
    afterCopy: [
      (buildPath, electronVersion, platform, arch, callback) => {
        // Remove unnecessary locales to reduce installation file.
        const localesPath = path.resolve(buildPath, '..', '..', 'locales')
        removeLocales(localesPath)
        callback()
      }
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './resources/icon.png'
        },
      },
    },
    // {
    //   name: '@electron-forge/maker-rpm',
    //   config: {},
    // },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main/main.js',
            config: 'vite.main.config.mjs',
          },
          {
            entry: 'src/preload/preload.js',
            config: 'vite.preload.config.mjs',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
  ],
};
