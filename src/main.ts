function main() {
  const properties = PropertiesService.getScriptProperties()
  const env = properties.getProperty('ENV_KEY')
}

global.main = main