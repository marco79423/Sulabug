export const ConfigCollection = {
  name: 'config',
  schema: {
    title: 'config schema',
    description: 'describes configuration',
    version: 0,
    type: 'object',
    properties: {
      id: {
        type: 'string',
        primary: true
      },
      downloadFolderPath: {
        type: 'string',
      },
      comicInfoDatabasePath: {
        type: 'string',
      },
    },
    required: ['downloadFolderPath', 'comicInfoDatabasePath']
  }
}


export default [
  ConfigCollection,
]
