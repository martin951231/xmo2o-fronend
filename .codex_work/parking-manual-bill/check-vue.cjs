const fs = require('fs')
const compiler = require('vue-template-compiler')
const babel = require('@babel/core')
for (const name of ['cashierOrderList', 'manualBillModal']) {
  const path = 'src/views/community/village/charge/cashier/' + name + '.vue'
  const sfc = compiler.parseComponent(fs.readFileSync(path, 'utf8'))
  const result = compiler.compile(sfc.template.content)
  if (result.errors.length) throw new Error(path + ': ' + result.errors.join('\n'))
  babel.transformSync(sfc.script.content, { filename: path + '.js' })
  console.log('PASS Vue template and script compilation: ' + path)
}
