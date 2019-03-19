export const UserProfileCollection = {
  name: 'user_profile',
  schema: {
    title: 'user profile schema',
    description: 'describes user profile',
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
    },
    required: ['downloadFolderPath']
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
      lastUpdatedChapter: {
        type: 'string',
      },
      lastUpdatedTime: {
        type: 'string',
      },
      summary: {
        type: 'string',
      },
      chapters: {
        type: "array",
        uniqueItems: true,
        items: {
          type: "object",
          properties: {
            id: {
              type: 'string',
            },
            order: {
              type: 'number',
              min: 0,
            },
            name: {
              type: 'string',
            },
            sourcePageUrl: {
              type: 'string',
            },
          }
        },
        required: [
          'id',
          'order',
          'name',
          'sourcePageUrl',
        ]
      }
    },
    required: [
      'name',
      'coverDataUrl',
      'source',
      'pageUrl',
      'catalog',
      'author',
      'lastUpdatedChapter',
      'lastUpdatedTime',
      'summary',
      'chapters',
    ]
  }
}

export default [
  UserProfileCollection,
  ComicInfoCollection,
]
