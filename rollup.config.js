import pkg from './package.json'

function getAuthors(pkg) {
  const { contributors, author } = pkg
  const authors = new Set()

  if (contributors) {
    contributors.forEach((contributor) => {
      authors.add(contributor.name)
    })
  }
  if (author) authors.add(author.name)

  return Array.from(authors).join(', ')
}

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${getAuthors(pkg)}
  * @license ${pkg.license}
  */`

const name = 'vuecloak'
const globals = {
  'keycloak-js': 'Keycloak'
}

const outputConfigs = {
  cjs: pkg.main,
  es: pkg.module,
  umd: pkg.browser
}

const outputFormats = Object.keys(outputConfigs)

function createOutput(file, format) {
  return { file, format, banner, name, globals }
}

export default {
  input: 'src/index.js',
  output: outputFormats.map(format => createOutput(outputConfigs[format], format)),
  external: ['keycloak-js']
}
