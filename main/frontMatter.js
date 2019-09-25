const frontmatter = require('front-matter');
const YAML = require('yaml');

exports.createFrontMatter = function(attributes) {
  return `---\n${YAML.stringify(attributes)}---\n`;
};

exports.parseFrontMatter = function(content) {
  return frontmatter(content);
};
