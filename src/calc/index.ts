import add from './add'
import subtract from './subtract'
import multiply from './multiply'
import divide from './divide'
import {genFormula,checkResult} from './genQuestion'

const calc = {
  add,
  subtract,
  multiply,
  divide,
  genFormula,
  checkResult
}

export default calc
export { add, subtract, multiply, divide,genFormula,checkResult }
