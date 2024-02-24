import { select, selectAll } from "d3-selection"
import { scaleBand } from "d3-scale"
import { max } from "d3-array"
import { transition } from "d3-transition"
import { easeElasticOut } from "d3-ease"
import { line, curveCatmullRom } from "d3-shape"

export default {
  select,
  selectAll,
  scaleBand,
  max,
  transition,
  easeElasticOut,
  line,
  curveCatmullRom
}