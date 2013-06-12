basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  '../app/lib/angular-1.0.5/angular.js',
  'lib/angular-1.0.5/angular-mocks.js',
  '../app/constants.js',
  '../app/modules/**/*.js',
  'support/**/*.js',
  'unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

reporters = ['dots', 'junit'];

junitReporter = {
  outputFile: 'output/unit.xml',
  suite: 'unit'
};
