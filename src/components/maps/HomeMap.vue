<script setup>
import { onMounted, ref, watch, computed } from "vue"
// eslint-disable-next-line
import * as d3 from "d3"
import { useGraphStore } from "../../stores/graph.js"
import { useScreenSizeStore } from "../../stores/screenSize.js"
import { useSearchStore } from "../../stores/search.js"
import { debounce } from "../../utils/debounce.js"
import { NModal } from "naive-ui"
import ThePaginator from "../layout/ThePaginator.vue"
import DetailsMapContainer from "./DetailsMapContainer.vue"

// Use stores
const screenSize = useScreenSizeStore()
const graph = useGraphStore()
const search = useSearchStore()

onMounted(() => {
  // Create the static, screen-dependent map elements
  createStaticMapElements()

  // If the /map?q=<query> route is accessed directly, numberOfGraphs equals 0...
  // and below watcher wouldn't trigger the map creation...
  // so we wait for the search component to create the graph and trigger the watcher

  // If the component is mounted after searching on the home page,...
  // numberOfGraphs is not 0, the graph has been created, and the map can be drawn
  graph.numberOfGraphs === 0 ? null : drawDynamicMap()
})

watch(
  // If a new graph has been created (based on a new search),...
  // the old map gets removed and a new one is drawn
  () => graph.numberOfGraphs,
  () => {
    if (graph.homeMapGraph) {
      redrawMap()
    } else {
      d3.select("#svg-chart").remove()
    }
  }
)

const debouncedRedraw = debounce(() => {
  redrawMap()
}, 500)

watch(
  // If the screen is being resized,...
  // it waits for completion of the event...
  // and only then re-draws the map
  () => screenSize.width,
  () => {
    debouncedRedraw()
  }
)

// The main functions handling the creation of the map ///////////////
//////////////////////////////////////////////////////////////////////

// Creating the static, only screen-dependent map elements
function createStaticMapElements() {
  initiateSvg()
  setXScale()
  addMapGroups()
}

// Creating the data-dependent, dynamic map elements
function drawDynamicMap() {
  setYScaleWorks(drawWorks)
  drawSdgWorkLines(drawSDGs)
  drawFieldWorkLines(drawFields)
  addClickEvents()
}

// Redraw the map in case of new searches or screen re-sizes
function redrawMap() {
  d3.select("#svg-chart").remove()
  createStaticMapElements()
  drawDynamicMap()
}

// Main SVG //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const svg = ref(null)
const ctr = ref(null)

// The total height of the usable map area shouldn't be the same as the total screen height
// A fraction of the available screen height is used to account for header elements and avoid...
// a map that is not completely visible
const heightFraction = 0.85
const totalHeight = computed(() => screenSize.height * heightFraction - screenSize.ctrMarginV * 2)

// For smaller screens, only a fraction of the available width should be used for the map
const mobileWidthFraction = 0.8

// SVG initiation with container /////////////////////////////////////
function initiateSvg() {
  // Draw <svg> canvas
  svg.value = d3
    .select("#home-map")
    .append("svg")
    .attr("id", "svg-chart")
    .attr("viewBox", `0 0 ${screenSize.width} ${screenSize.height * heightFraction}`)

  // Add <g> container with margins to avoid overlapping
  ctr.value = svg.value
    .append("g")
    .attr("id", "chart-container")
    .attr("transform", `translate(${screenSize.ctrMarginH}, ${screenSize.ctrMarginV})`)
}

// xScale ////////////////////////////////////////////////////////////
// There will always be three bands across the map width...
// SDGs, works, and fields
const xScale = ref(null)

function setXScale() {
  xScale.value = d3
    .scaleBand()
    .domain(["sdgs", "works", "fields"])
    .align(0.5)
    .range([0, screenSize.width - screenSize.ctrMarginH * 2])
}

// yScale ///////////////////////////////////////////////////////////
const yScaleWorks = ref(null)

// A helper function that creates and inserts dummy works
function createDummyWorks(worksDomain, delta) {
  // Create an array of dummy works with increasing ids
  const dummyWorks = Array.from({ length: delta }, (_, i) => i + worksDomain.length)
  // If the screen size is mobile, append the dummy works at the end
  if (screenSize.isMobile) {
    return [...worksDomain, ...dummyWorks]
  }
  // Otherwise, split the dummy works into two halves and insert them at both ends
  const half = Math.ceil(delta / 2)
  const firstHalf = dummyWorks.slice(0, half)
  const secondHalf = dummyWorks.slice(half)
  return [...firstHalf, ...worksDomain, ...secondHalf]
}

function getYScaleWorksDomain() {
  // Get all the work IDs of the search results for the domain
  let worksDomain = graph.homeMapGraph.works.map((work) => work.id)
  // A certain amount of works is expected (search.pageSize)
  // If there are fewer results, we add dummy works to get a consistent height of the drawn work rectangles
  const delta = search.pageSize - worksDomain.length
  if (delta > 0) {
    // Call the helper function to create and insert the dummy works
    worksDomain = createDummyWorks(worksDomain, delta)
  }
  return worksDomain
}

function getYScaleWorksRange() {
  // For small screens, the works are drawn in the bottom half of the available map height
  // On bigger screens, the works are drawn across the available map height
  return screenSize.isMobile ? [totalHeight.value * 0.5, totalHeight.value] : [0, totalHeight.value]
}

function setYScaleWorks(callback) {
  if (graph.homeMapGraph.works) {
    // No check for works as without works there's no map at all
    yScaleWorks.value = d3
      .scaleBand()
      .domain(getYScaleWorksDomain())
      .paddingInner(0.25)
      .align(0.5)
      .range(getYScaleWorksRange())

    callback(graph.homeMapGraph.works, addWorkMouseEvents) // callback is drawWorks()
  }
}

// Draw elements /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const theBlack = "#333447"
const theBlue = "#514efd"
const theGrey = "lightgrey"
const workLineWidth = "1.5px"

// Function to determine the element font size
function getFontSize(element) {
  // The base size is 95% of the height of the work title rectangles!!
  const baseSize = yScaleWorks.value.bandwidth() * 0.95

  if (element === "work-title") {
    return `${baseSize}px`
  } else if (element === "sdg-id") {
    return screenSize.isMobile ? `${baseSize * 0.75}px` : `${baseSize}px`
  } else if (element === "sdg-label") {
    return screenSize.isMobile ? `${baseSize * 0.65}px` : `${baseSize * 0.8}px`
  } else if (element === "field") {
    return screenSize.isMobile ? `${baseSize * 0.75}px` : `${baseSize}px`
  }
}

const sizes = computed(() => {
  return {
    workTitle: getFontSize("work-title").replace("px", ""),
    sdgId: getFontSize("sdg-id").replace("px", ""),
    sdgLabel: getFontSize("sdg-label").replace("px", ""),
    field: getFontSize("field").replace("px", ""),
    worksBandwidth: yScaleWorks.value.bandwidth(),
    worksRange: getYScaleWorksRange()
  }
})

// Handling the bouncing animation when a map is drawn
const transitionDuration = 1000
// The amplitude determines how far the curve goes above or below the endpoints,...
// while the period determines how often the curve oscillates.
const easeAnimation = d3.easeElasticOut.amplitude(1.0).period(0.4)

// Element groups ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const sdgsGroup = ref(null)
const worksGroup = ref(null)
const fieldsGroup = ref(null)
const sdgPathsGroup = ref(null)
const fieldPathsGroup = ref(null)

// Add the needed map groups
function addMapGroups() {
  addSDGsGroup(xScale.value, addSdgPathsGroup)
  addWorksGroup(xScale.value)
  addFieldsGroup(xScale.value, addFieldPathsGroup)
}

function addSDGsGroup(xScaleFunction, callback) {
  // Adding the SDGs group
  sdgsGroup.value = ctr.value
    .append("g")
    .attr("class", "sdgs-group")
    .attr("transform", `translate(${xScaleFunction("sdgs")}, 0)`)

  callback() // callback is addSdgPathsGroup()
}

function addWorksGroup(xScaleFunction) {
  // Adding the works group
  worksGroup.value = ctr.value
    .append("g")
    .attr("class", "works-group")
    .attr("transform", `translate(${xScaleFunction("works")}, 0)`)
}

function addFieldsGroup(xScaleFunction, callback) {
  // Adding the fields group
  fieldsGroup.value = ctr.value
    .append("g")
    .attr("class", "fields-group")
    .attr("transform", `translate(${xScaleFunction("fields")}, 0)`)

  callback() // callback is addFieldPathsGroup()
}

function addSdgPathsGroup() {
  sdgPathsGroup.value = sdgsGroup.value.append("g").attr("class", "sdg-paths-group")
}

function addFieldPathsGroup() {
  fieldPathsGroup.value = fieldsGroup.value.append("g").attr("class", "field-paths-group")
}

// Draw works ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

const workTranslationX = computed(() => {
  return screenSize.isMobile ? `-${xScale.value.bandwidth() * mobileWidthFraction}` : 0
})

function addElementClasses(links) {
  return links.map((link) => {
    return link.type === "sdg" ? `sdg-${link.id}` : `field-${dataName(link.id)}`
  })
}

function drawWorks(data, callback) {
  worksGroup.value
    .selectAll(".work")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", "work")
          .attr("transform", `translate(${workTranslationX.value}, ${totalHeight.value * 0.5})`)
          .each(function () {
            // Add rectangles
            d3.select(this)
              .append("rect")
              .attr("class", (d) => ["work-rect", ...addElementClasses(d.links)].join(" "))
              .attr("data-id", (d) => d.id)
            // Add work title
            d3.select(this)
              .append("text")
              .attr("class", "work-title")
              .attr("data-id", (d) => d.id)
              .text((d) => d.title)
            // Adding an overlay rectangle in order to handle mouse events
            d3.select(this)
              .append("rect")
              .attr("class", "work-overlay")
              .each(function () {
                // Adding a title element to achieche a standard HTML tooltip
                // Yes, I like the style of the standard tooltips!!
                d3.select(this)
                  .append("title")
                  .text((d) => d.title)
              })
          }),
      (update) => update,
      (exit) => exit
    )

  // Handling the <rect> elements inside each g.work
  worksGroup.value
    .selectAll(".work-rect,.work-overlay")
    .attr("width", () => {
      return screenSize.isMobile
        ? xScale.value.bandwidth() + 2 * xScale.value.bandwidth() * mobileWidthFraction
        : xScale.value.bandwidth()
    })
    .attr("height", yScaleWorks.value.bandwidth())

  // Setting the background work-rect's colors separately
  worksGroup.value.selectAll(".work-rect").attr("stroke", theBlack).attr("fill", theBlack)

  // Handling the overlay rect element for handling mouse events as well
  worksGroup.value
    .selectAll(".work-overlay")
    .attr("class", (d) => ["work-overlay", ...addElementClasses(d.links)].join(" "))
    .attr("data-id", (d) => d.id)
    .attr("data-type", "works")
    .attr("data-index", (_, i) => i)
    .attr("fill-opacity", 0)
    .attr("cursor", "pointer")

  // Handling the <text> elements of the work title
  worksGroup.value
    .selectAll(".work-title")
    .attr("x", xScale.value.bandwidth() * 0.01)
    .attr("y", yScaleWorks.value.bandwidth() * 0.85)
    .style("font-size", getFontSize("work-title"))
    .attr("fill", "white")

  // Positioning each <g> element with class "work" along the yScaleWorks
  worksGroup.value
    .selectAll(".work")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", (d) => {
      return `translate(${workTranslationX.value}, ${yScaleWorks.value(d.id)})`
    })

  callback() // callback is addWorkMouseEvents()
}

function elementColor(type) {
  return type === "mouseover" ? theBlue : theBlack
}

function lineColor(type) {
  return type === "mouseover" ? theBlue : theGrey
}

function lineWidth(type) {
  return type === "mouseover" ? "2.5px" : workLineWidth
}

function fontWeight(type) {
  return type === "mouseover" ? "bold" : "regular"
}

// Add work mouse events
function addWorkMouseEvents() {
  worksGroup.value.selectAll(".work-overlay").on("mouseover mouseout", function (event) {
    // Get the current work
    const workId = d3.select(this).attr("data-id")

    // Highlighting and setting back the work
    d3.select(`.work-rect[data-id='${workId}']`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))

    // Highlighting and setting back the work lines
    d3.selectAll(`.work-line-${workId}`)
      .attr("stroke", lineColor(event.type))
      .attr("stroke-width", lineWidth(event.type))

    // Highlighting and setting back element circles
    d3.selectAll(`.work-element-${workId} circle`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))

    // Highlighting and setting back SDGs
    d3.selectAll(`.sdg.work-element-${workId} .sdg-id`)
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))

    // Highlighting and setting back fields
    d3.selectAll(`.field.work-element-${workId} .field-name`)
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))
  })
}

// Calculate the circular values to place SDG and field elements
//////////////////////////////////////////////////////////////////////
// You might want to look up the Pythagorean theorem to follow!!

const adjacent = computed(() => {
  // The adjacent is also the desired x coordinate of the center point of the big circle the elements are drawn on
  // For small screens, this center is moved far away so the radius will be very big and the elements are drawn almost on a straight line
  return screenSize.isMobile ? screenSize.width * mobileAdjecentFactor : screenSize.width * 1.5
})
const mobileAdjecentFactor = 50 // Will be used later as well

const countercathete = computed(() => {
  // The countercathete defines the desired y-axis distance of the first circle element from the imaginary center of the big circle
  // The first circle element will be drawn almost at the top of the available map area and the imaginary center of the big circle...
  // is either in the middle of the top half of the map area (on small screen) or in the middle of the map area (on big screens)
  return screenSize.isMobile ? totalHeight.value * 0.225 : totalHeight.value * 0.45
})

const radius = computed(() => {
  // The radius is the hypotenuse
  return Math.sqrt(Math.pow(adjacent.value, 2) + Math.pow(countercathete.value, 2))
})
const alpha = computed(() => {
  return Math.tan(countercathete.value / adjacent.value) * (180 / Math.PI) // In degrees
})

// The starting angle of the SDG elements (on a regular cartesian coordinate system)
const sdgStart = computed(() => {
  return graph.homeMapGraph.sdgs.length > 1 ? 180 - alpha.value : 180
})

// Gaps between SDG elements (in degrees)
const sdgDegrees = computed(() => {
  let degrees = null
  if (graph.homeMapGraph.sdgs) {
    degrees =
      graph.homeMapGraph.sdgs.length > 1
        ? (alpha.value * 2) / (graph.homeMapGraph.sdgs.length - 1)
        : 1
  }
  return degrees
})

// The starting angle of the field elements (on a regular cartesian coordinate system)
const fieldStart = computed(() => {
  return graph.homeMapGraph.fields.length > 1 ? alpha.value : 0
})

// Gaps between field elements (in degrees)
const fieldDegrees = computed(() => {
  let degrees = null
  if (graph.homeMapGraph.fields) {
    degrees =
      graph.homeMapGraph.fields.length > 1
        ? (alpha.value * 2) / (graph.homeMapGraph.fields.length - 1)
        : 1
  }
  return degrees
})

// Fraction to handle distance between works and circle elements (on bigger screens)...
// or distance between circle elements and screen edge (on smaller screens)
// It's a fraction of the xScale.bandwidth()
const elementDistanceFraction = computed(() => {
  return screenSize.isMobile ? 0.8 : 0.25
})

// The radius of the circle elements
const circleElementRadius = computed(() => {
  return yScaleWorks.value.bandwidth() * 0.5
})

// The text offset of the circle labels
const textElementXOffset = computed(() => {
  return circleElementRadius.value * 2
})

function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

// To convert from Polar Coordinates (r,θ) to Cartesian Coordinates (x,y):
// x = r * cos(θ)
// y = r * sin(θ)

// Function to the the x coordinate of an element on the big circle
function getCircularX(element, startDegree, radius, angle, i) {
  const circularX = radius * Math.cos(degToRad(startDegree) + degToRad(angle * i))

  // Depending on the startDegree, circularX might have a negative value (e.g. for SDGs)!!
  const centerAdjustment = element === "sdg" ? adjacent.value : -adjacent.value

  const margin =
    element === "sdg"
      ? xScale.value.bandwidth() * (1 - elementDistanceFraction.value)
      : xScale.value.bandwidth() * elementDistanceFraction.value

  return centerAdjustment + circularX + margin
}

// Function to get the y coordinate of an element on the big circle
function getCircularY(startDegree, radius, angle, i) {
  // The circularY is negative because our imaginary center of the big circle is in the middle...
  // of the available map area for the elements but the actual SVG 0/0 is top left
  const circularY = -(radius * Math.sin(degToRad(startDegree) + degToRad(angle * i)))

  // Adjustment for y center + the calculated circularY
  return screenSize.isMobile
    ? totalHeight.value * 0.25 + circularY
    : totalHeight.value * 0.5 + circularY
}

// Draw lines between SDGs/fields and works ////////////////////////
//////////////////////////////////////////////////////////////////////

// Function to draw the actual curved line along the given coordinates
// The coordinates are given as an array of objects {x: <x>, y: <y>}
function drawQuadraticCurve(coordinates) {
  const lineGenerator = d3
    .line()
    .x((d) => d.x) // set the x accessor
    .y((d) => d.y) // set the y accessor
    .curve(d3.curveCatmullRom.alpha(0.6))
  return lineGenerator(coordinates) // generate the path data string
}

// The first control points are close the the circle elements but have a slightly shorter radius
const controlPointRadius = computed(() =>
  screenSize.isMobile
    ? radius.value + xScale.value.bandwidth() * (1 - elementDistanceFraction.value) * 0.5
    : radius.value * 0.995
)

// Draw SDG-work lines ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function createSdgLinesData() {
  const lineData = []

  graph.homeMapGraph.sdgs.forEach((sdg, i) => {
    // The starting coordinates
    const x0 = getCircularX("sdg", sdgStart.value, radius.value, sdgDegrees.value, i)
    const y0 = getCircularY(sdgStart.value, radius.value, sdgDegrees.value, i)

    // The first control point coordinates
    const x1 = getCircularX("sdg", sdgStart.value, controlPointRadius.value, sdgDegrees.value, i)
    const y1 = getCircularY(sdgStart.value, controlPointRadius.value, sdgDegrees.value, i)

    // The second control point x coordinate
    const x2 = screenSize.isMobile
      ? xScale.value.bandwidth() * (1 - elementDistanceFraction.value) * 0.75
      : xScale.value.bandwidth()

    // The end x coordinate
    const x3 = screenSize.isMobile
      ? xScale.value.bandwidth() * (1 - elementDistanceFraction.value)
      : xScale.value.bandwidth()

    graph.sdgWorkNodes[sdg.id].works.forEach((work) => {
      const coordObj = {
        id: sdg.id,
        work: work,
        coordinates: [
          { x: x0, y: y0 }, // Starting point
          { x: x1, y: y1 }, // First control point
          {
            // Second control point
            x: x2,
            y: yScaleWorks.value(work) + yScaleWorks.value.bandwidth() * 0.5
          },
          {
            // End point
            x: x3,
            y: yScaleWorks.value(work) + yScaleWorks.value.bandwidth() * 0.5
          }
        ]
      }

      lineData.push(coordObj)
    })
  })
  return lineData
}

function drawSdgWorkLines(callback) {
  if (graph.homeMapGraph.sdgs) {
    const sdgWorkLinesData = createSdgLinesData()

    sdgPathsGroup.value
      .selectAll(".sdg-line")
      .data(sdgWorkLinesData)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", (d) => ["sdg-line", `sdg-${d.id}`, `work-line-${d.work}`].join(" "))
            .attr("d", (d) => drawQuadraticCurve(d.coordinates))
            .attr("stroke", "white")
            .attr("fill", "none")
            .attr("stroke-width", workLineWidth),
        (update) => update,
        (exit) => exit
      )

    sdgsGroup.value
      .selectAll(".sdg-line")
      .transition()
      .duration(transitionDuration * 1.5)
      .attr("stroke", theGrey)

    callback(graph.homeMapGraph.sdgs, measureSdgLabels, updateSdgLabels, addSdgMouseEvents) // callback is drawSDGs
  }
}

// Draw SDGs /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function getSdgId(d) {
  return `SDG ${d.id}`
}

function addSdgWorkClasses(sdg) {
  return graph.sdgWorkNodes[sdg].works.map((work) => `work-element-${work}`)
}

function addSdgLabels(selection, className) {
  selection
    .append("text")
    .attr("class", className)
    .text((d) => d.name)
    .attr("x", () => {
      return screenSize.isMobile ? textElementXOffset.value : -textElementXOffset.value
    })
    .attr("y", 0)
    .attr("dominant-baseline", "text-before-edge")
    .style("font-size", () => getFontSize("sdg-label"))
    .attr("text-anchor", () => {
      return screenSize.isMobile ? "start" : "end"
    })
}

function measureSdgLabels(data) {
  // A function to get the BBox data of the created SDG labels and...
  // ...add the data to the graph
  sdgsGroup.value
    .selectAll(".sdg-dummy-label")
    .join(data)
    .each(function (d) {
      d.labelBbox = this.getBBox()
    })
}

function updateSdgLabels(data) {
  // Remove dummy labels used for measurements
  d3.selectAll(".sdg-dummy-label").remove()

  // Selection of all the SDG group elements
  const sdgGs = sdgsGroup.value.selectAll(".sdg").data(data).join("g")

  // Adding a rect element to each SDG g element...
  // ...using the bbox measurements of the dummy labels created earlier!!
  sdgGs
    .append("rect")
    .attr("x", (d) => {
      return screenSize.isMobile
        ? textElementXOffset.value
        : -(d.labelBbox.width + textElementXOffset.value)
    })
    .attr("y", 0)
    .attr("fill", (d) => d.color)
    .attr("opacity", "0.4")
    .attr("width", (d) => d.labelBbox.width)
    .attr("height", (d) => d.labelBbox.height)

  // Adding new SDG labels
  addSdgLabels(sdgGs, "sdg-label")
}

function drawSDGs(data, callback1, callback2, callback3) {
  sdgsGroup.value
    .selectAll(".sdg")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", (d) => ["sdg", `sdg-${d.id}`, ...addSdgWorkClasses(d.id)].join(" "))
          .attr("data-id", (d) => d.id)
          .attr("data-type", "sdgs")
          .attr("data-index", (_, i) => i)
          // Start position of the SDG elements
          .attr(
            "transform",
            (_, i) =>
              `translate(${getCircularX(
                "sdg",
                180,
                screenSize.isMobile
                  ? screenSize.width * mobileAdjecentFactor
                  : screenSize.width * 1.25,
                0,
                i
              )}, ${getCircularY(
                180,
                screenSize.isMobile
                  ? screenSize.width * mobileAdjecentFactor
                  : screenSize.width * 1.25,
                0,
                i
              )})`
          )
          .attr("cursor", "pointer")
          .each(function () {
            // Add circles
            d3.select(this)
              .append("circle")
              .attr("class", "sdg-circle")
              .attr("data-id", (d) => d.id)
              .attr("r", circleElementRadius.value)
              .attr("stroke", theBlack)
              .attr("fill", theBlack)
            // Add SDG ID
            d3.select(this)
              .append("text")
              .attr("class", "sdg-id")
              .attr("data-id", (d) => d.id)
              .text((d) => getSdgId(d))
              .attr("x", () => {
                return screenSize.isMobile ? textElementXOffset.value : -textElementXOffset.value
              })
              .attr("y", 0)
              .style("font-size", getFontSize("sdg-id"))
              .attr("dominant-baseline", "text-after-edge")
              .attr("text-anchor", () => {
                return screenSize.isMobile ? "start" : "end"
              })
            // Add SDG dummy labels for measurements only
            addSdgLabels(d3.select(this), "sdg-dummy-label")
          }),
      (update) => update,
      (exit) => exit
    )

  // Positioning the SDG <g> elements, incl. animation
  sdgsGroup.value
    .selectAll(".sdg")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr(
      "transform",
      (_, i) =>
        `translate(${getCircularX(
          "sdg",
          sdgStart.value,
          radius.value,
          sdgDegrees.value,
          i
        )}, ${getCircularY(sdgStart.value, radius.value, sdgDegrees.value, i)})`
    )

  callback1(data) // callback1 is measureSdgLabels()
  callback2(graph.homeMapGraph.sdgs) // callback2 is updateSdgLabels()
  callback3() // callback2 is addSdgMouseEvents()
}

// Adding the SDG mouse events
function addSdgMouseEvents() {
  sdgsGroup.value.selectAll(".sdg").on("mouseover mouseout", function (event) {
    // Get the current SDG
    const sdgId = d3.select(this).attr("data-id")

    // Highlighting and setting back the SDG
    d3.select(this)
      .select(".sdg-circle")
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))

    d3.select(this)
      .select(".sdg-id")
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))

    // Highlighting and setting back the work lines
    d3.selectAll(`.sdg-line.sdg-${sdgId}`)
      .attr("stroke", lineColor(event.type))
      .attr("stroke-width", lineWidth(event.type))

    // Highlighting and setting back the works
    d3.selectAll(`.work-rect.sdg-${sdgId}`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))
  })
}

// Draw field-work lines ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function createFieldLinesData() {
  const lineData = []

  graph.homeMapGraph.fields.forEach((field, i) => {
    // The starting coordinates
    const x0 = getCircularX("field", fieldStart.value, radius.value, -fieldDegrees.value, i)
    const y0 = getCircularY(fieldStart.value, radius.value, -fieldDegrees.value, i)

    // The first control point coordinates
    const x1 = getCircularX(
      "field",
      fieldStart.value,
      controlPointRadius.value,
      -fieldDegrees.value,
      i
    )
    const y1 = getCircularY(fieldStart.value, controlPointRadius.value, -fieldDegrees.value, i)

    // The second control point x coordinate
    const x2 = screenSize.isMobile ? xScale.value.bandwidth() * 0.85 : 0

    // The ending x coordinate
    const x3 = screenSize.isMobile ? xScale.value.bandwidth() * elementDistanceFraction.value : 0

    graph.fieldWorkNodes[field.name].works.forEach((work) => {
      const coordObj = {
        id: field.name,
        work: work,
        coordinates: [
          { x: x0, y: y0 }, // Starting point
          { x: x1, y: y1 }, // First control point
          {
            // Second control point
            x: x2,
            y: yScaleWorks.value(work) + yScaleWorks.value.bandwidth() * 0.5
          },
          {
            // End point
            x: x3,
            y: yScaleWorks.value(work) + yScaleWorks.value.bandwidth() * 0.5
          }
        ]
      }
      lineData.push(coordObj)
    })
  })
  return lineData
}

function drawFieldWorkLines(callback) {
  if (graph.homeMapGraph.fields) {
    const fieldWorkLinesData = createFieldLinesData()

    fieldPathsGroup.value
      .selectAll(".field-line")
      .data(fieldWorkLinesData)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", (d) =>
              ["field-line", `field-${dataName(d.id)}`, `work-line-${d.work}`].join(" ")
            )
            .attr("d", (d) => drawQuadraticCurve(d.coordinates))
            .attr("stroke", "white")
            .attr("fill", "none")
            .attr("stroke-width", workLineWidth),
        (update) => update,
        (exit) => exit
      )

      fieldsGroup.value
      .selectAll(".field-line")
      .transition()
      .duration(transitionDuration * 1.5)
      .attr("stroke", "lightgrey")

    callback(graph.homeMapGraph.fields, addFieldMouseEvents) // callback is drawFields()
  }
}

// Draw Fields /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function addFieldWorkClasses(field) {
  return graph.fieldWorkNodes[field].works.map((work) => `work-element-${work}`)
}

function dataName(name) {
  return name.replace(/[()"\s]/g, "")
}

function drawFields(data, callback) {
  fieldsGroup.value
    .selectAll(".field")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", (d) =>
            ["field", `field-${dataName(d.name)}`, ...addFieldWorkClasses(d.name)].join(" ")
          )
          .attr("data-name", (d) => dataName(d.name))
          .attr("data-type", "fields")
          .attr("data-index", (_, i) => i)
          .attr(
            "transform",
            (_, i) =>
              `translate(${getCircularX(
                "field",
                0,
                screenSize.isMobile
                  ? screenSize.width * mobileAdjecentFactor
                  : screenSize.width * 1.25,
                0,
                i
              )}, ${getCircularY(
                0,
                screenSize.isMobile
                  ? screenSize.width * mobileAdjecentFactor
                  : screenSize.width * 1.25,
                0,
                i
              )})`
          )
          .attr("cursor", "pointer")
          .each(function () {
            // Add circles
            d3.select(this)
              .append("circle")
              .attr("class", "field-circle")
              .attr("data-name", (d) => dataName(d.name))
              .attr("r", circleElementRadius.value)
              .attr("stroke", theBlack)
              .attr("fill", theBlack)
            // Add field
            d3.select(this)
              .append("text")
              .attr("class", "field-name")
              .attr("data-name", (d) => dataName(d.name))
              .text((d) => d.name)
              .attr("x", () => {
                return screenSize.isMobile ? -textElementXOffset.value : textElementXOffset.value
              })
              .attr("y", 0)
              .style("font-size", getFontSize("field"))
              .attr("fill", theBlack)
              .attr("dominant-baseline", "middle")
              .attr("text-anchor", () => {
                return screenSize.isMobile ? "end" : "start"
              })
          }),
      (update) => update,
      (exit) => exit
    )

  // Positioning the field <g> elements, incl. animation
    fieldsGroup.value
    .selectAll("g.field")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr(
      "transform",
      (_, i) =>
        `translate(${getCircularX(
          "field",
          fieldStart.value,
          radius.value,
          -fieldDegrees.value,
          i
        )}, ${getCircularY(fieldStart.value, radius.value, -fieldDegrees.value, i)})`
    )

  callback() // callback is addFieldMouseEvents()
}

function addFieldMouseEvents() {
  fieldsGroup.value.selectAll(".field").on("mouseover mouseout", function (event) {
    // Get the current field
    const fieldName = d3.select(this).attr("data-name")

    // Highlighting and setting back the field
    d3.select(this)
      .select(".field-circle")
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))

    d3.select(this)
      .select(".field-name")
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))

    // Highlighting and setting back the work lines
    d3.selectAll(`.field-line.field-${fieldName}`)
      .attr("stroke", lineColor(event.type))
      .attr("stroke-width", lineWidth(event.type))

    // Highlighting and setting back the works
    d3.selectAll(`.work-rect.field-${fieldName}`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))
  })
}

// Add click events //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const showModal = ref(false)
const modalInput = ref(null)

function showDetailsMap(obj) {
  modalInput.value = obj
  showModal.value = true
}

function addClickEvents() {
  ctr.value.selectAll(".work-overlay,.sdg,.field").on("click", function () {
    const type = d3.select(this).attr("data-type")
    const index = d3.select(this).attr("data-index")
    const root = graph.homeMapGraph[type][index]
    showDetailsMap({ type, root, sizes }) // The modalInput
  })
}
</script>

<template>
  <n-modal
    id="details-modal"
    :style="{ width: screenSize.modalWidth }"
    v-model:show="showModal"
    :mask-closable="true"
    preset="card"
    destroy-on-close
    :on-after-leave="graph.resetDetailsMapGraph"
  >
    <DetailsMapContainer v-if="showModal" :input-obj="modalInput" />
  </n-modal>
  <div id="home-map"></div>
  <div>
    <ThePaginator />
  </div>
</template>
