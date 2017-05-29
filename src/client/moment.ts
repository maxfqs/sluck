// Moment is loaded by cdn but we declare it here so we can use typescript
import {Moment} from "moment"

declare const moment: (...args: any[]) => Moment
export default moment
