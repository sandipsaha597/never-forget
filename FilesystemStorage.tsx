import * as FileSystem from "expo-file-system";
let options = {
  storagePath: `${FileSystem.documentDirectory}database`,
  toFileName: (name) => name.split(":").join("-"),
  fromFileName: (name) => name.split("-").join(":"),
};

// init directory: make sure our database path exists on startup
FileSystem.getInfoAsync(options.storagePath)
  .then(async ({ exists }) => {
    return (
      !exists && (await FileSystem.makeDirectoryAsync(options.storagePath))
    );
  })
  .catch((e) => {
    console.warn("Error creating database path", e);
  });

const pathForKey = (key) => `${options.storagePath}/${options.toFileName(key)}`;

const FilesystemStorage = {
  config: (customOptions: any) => {
    options = {
      ...options,
      ...customOptions,
    };
  },

  setItem: (key: string, value: any, callback?: any) =>
    FileSystem.writeAsStringAsync(pathForKey(key), value)
      .then(() => callback && callback())
      .catch((error: any) => callback && callback(error)),

  getItem: (key: string, callback?: any) =>
    FileSystem.readAsStringAsync(pathForKey(options.toFileName(key)))
      .then((data: any) => {
        callback && callback(null, data);
        if (!callback) {
          return data;
        }
      })
      .catch((error: any) => {
        callback && callback(error);
        if (!callback) {
          throw error;
        }
      }),

  removeItem: (key: string, callback?: any) =>
    FileSystem.deleteAsync(pathForKey(options.toFileName(key)))
      .then(() => callback && callback())
      .catch((error: any) => {
        callback && callback(error);
        if (!callback) {
          throw error;
        }
      }),

  getAllKeys: (callback: any) =>
    FileSystem.getInfoAsync(options.storagePath)
      .then(async ({ exists }: any) =>
        exists ? true : await FileSystem.makeDirectoryAsync(options.storagePath)
      )
      .then(() =>
        FileSystem.readDirectoryAsync(options.storagePath)
          .then((files: any) =>
            files.map((file: any) => options.fromFileName(file))
          )
          .then((files: any) => {
            callback && callback(null, files);
            if (!callback) {
              return files;
            }
          })
      )
      .catch((error: any) => {
        callback && callback(error);
        if (!callback) {
          throw error;
        }
      }),
};

// FilesystemStorage.clear = (callback) =>
//   FilesystemStorage.getAllKeys((error, keys) => {
//     if (error) {
//       throw error;
//     }

//     if (Array.isArray(keys) && keys.length) {
//       const removedKeys = [];

//       keys.forEach(key => {
//         FilesystemStorage.removeItem(key, error => {
//           removedKeys.push(key);
//           if (error && callback) {
//             callback(error, false);
//           }
//           if (removedKeys.length === keys.length && callback) {
//             callback(null, true);
//           }
//         })
//       });
//       return true
//     }

//     callback && callback(null, false);
//     return false
//   }).catch(error => {
//     callback && callback(error);
//     if (!callback) {
//       throw error
//     }
//   });

export default FilesystemStorage;
