module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  moduleNameMapper: {
    '\\.(png|jpg|css|less|scss|sass)$': 'identity-obj-proxy'
  }
}
