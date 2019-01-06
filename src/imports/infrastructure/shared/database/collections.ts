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

export const ComicInfoCollection = {
  name: 'comic_info',
  schema: {
    title: 'ComicInfo schema',
    description: 'describes comic info',
    version: 0,
    type: 'object',
    properties: {
      id: {
        type: 'string',
        primary: true
      },
      name: {
        type: 'string',
      },
      coverDataUrl: {
        type: 'string',
      },
      source: {
        type: 'string',
      },
      pageUrl: {
        type: 'string',
      },
      catalog: {
        type: 'string',
      },
      author: {
        type: 'string',
      },
      lastUpdated: {
        type: 'string',
      },
      summary: {
        type: 'string',
      },
    },
    required: [
      'name',
      'coverDataUrl',
      'source',
      'pageUrl',
      'catalog',
      'author',
      'lastUpdated',
      'summary',
    ]
  }
}

export default [
  ConfigCollection,
  ComicInfoCollection,
]
