<script setup>
import { onMounted, ref, computed, watch } from "vue"
import d3 from "../../d3-importer.js"
import { useScreenSizeStore } from "../../stores/screenSize.js"
import { useGraphStore } from "../../stores/graph.js"
import { createDetailsMapGraph } from "../../utils/createDetailsMapGraph.js"
import { debounce } from "../../utils/debounce.js"

const props = defineProps(["sizes"])

// Use stores
const screenSize = useScreenSizeStore()
const graph = useGraphStore()

onMounted(() => {
  getAvailableModalWidth()
  // Create the static, screen-dependent map elements
  createStaticMapElements()
  drawDynamicMap()
  // console.log("detailsMapGraph", graph.detailsMapGraph)

  tooltip.value = d3.select("#details-tooltip")
})

function getAvailableModalWidth() {
  const modalContent = d3.select("#details-map")
  mapWidth.value = modalContent.style("width").replace("px", "")
}

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

// Redraw the map in case of screen re-sizes
function redrawMap() {
  getAvailableModalWidth()
  // Create the static, screen-dependent map elements
  createStaticMapElements()
  drawDynamicMap()
}

// The main functions handling the creation of the map ///////////////
//////////////////////////////////////////////////////////////////////

// Creating the static, only screen-dependent map elements
function createStaticMapElements() {
  d3.select("#svg-details-chart").remove()
  initiateSvg()
  addMapGroups()
}

function drawDynamicMap() {
  drawTitle()
  drawFirstGroupContent()
}

// Main SVG //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const svg = ref(null)
const ctr = ref(null)
const ctrMargin = 0

// The total height of the usable map area shouldn't be the same as the total screen height
// A fraction of the available screen height is used to account for header elements and avoid...
// a map that is not completely visible
const mapHeight = computed(() => {
  const firstChildren = graph.detailsMapGraph.children.length

  let maxSecondChildren = d3.max(
    graph.detailsMapGraph.children.map((child) => {
      return graph.detailsMapGraph.type === "works"
        ? child.data.children.length
        : child.children.length
    })
  )
  maxSecondChildren = maxSecondChildren ? maxSecondChildren : 2

  const firstGroupBaseDistance =
    graph.detailsMapGraph.type === "works" ? elementBaseDistance : worksBaseDistance
  const secondGroupBaseDistance =
    graph.detailsMapGraph.type === "works" ? worksBaseDistance : elementBaseDistance

  let finalDesktopHeight = null

  if (graph.detailsMapGraph.type === "works") {
    finalDesktopHeight =
      firstChildren >= maxSecondChildren
        ? titleGroupHeight + firstChildren * firstGroupBaseDistance
        : titleGroupHeight + maxSecondChildren * secondGroupBaseDistance
  } else {
    finalDesktopHeight =
      firstChildren > maxSecondChildren
        ? titleGroupHeight + firstChildren * firstGroupBaseDistance
        : titleGroupHeight + maxSecondChildren * secondGroupBaseDistance
  }

  return screenSize.isMobile
    ? titleGroupHeight +
        firstGroupBaseDistance * graph.detailsMapGraph.children.length +
        maxSecondChildren * secondGroupBaseDistance
    : finalDesktopHeight
})

const mapWidth = ref(null)

// SVG initiation with container /////////////////////////////////////
function initiateSvg() {
  // Draw <svg> canvas
  svg.value = d3
    .select("#details-map")
    .append("svg")
    .attr("id", "svg-details-chart")
    .attr("viewBox", `0 0 ${mapWidth.value} ${mapHeight.value}`)

  // Add <g> container with margins to avoid overlapping
  ctr.value = svg.value
    .append("g")
    .attr("id", "details-chart-container")
    .attr("transform", `translate(${ctrMargin}, ${ctrMargin})`)
}

function addMapGroups() {
  addTitleGroup()
  addFirstGroup()
  addSecondGroup()
}

// Groups ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

const titleGroup = ref(null)
const firstGroup = ref(null)
const secondGroup = ref(null)

const theBlack = "#333447"
const theBlue = "#514efd"
const theGrey = "lightgrey"
const lineWidth = "1.5px"
const titleGroupHeight = props.sizes.worksBandwidth * 5
const elementBaseDistance = props.sizes.worksBandwidth * 3
const worksBaseDistance = props.sizes.worksBandwidth * 1.5
const circleRadius = props.sizes.worksBandwidth * 0.5
const textElementXOffset = props.sizes.worksBandwidth * 0.5 * 2

const transitionDuration = 1000
const easeAnimation = d3.easeElasticOut.amplitude(1.0).period(0.4)

function getSecondGroupTranslation() {
  if (screenSize.isMobile) {
    let nrOfChildren = graph.detailsMapGraph.children.length

    const baseDistance =
      graph.detailsMapGraph.type === "works" ? elementBaseDistance : worksBaseDistance

    const extraDistance =
      graph.detailsMapGraph.type === "works"
        ? nrOfChildren * baseDistance
        : nrOfChildren * baseDistance + worksBaseDistance * 1.5

    return `translate(0, ${titleGroupHeight + extraDistance})`
  } else {
    return `translate(${mapWidth.value * 0.5}, ${titleGroupHeight})`
  }
}

function addTitleGroup() {
  titleGroup.value = ctr.value.append("g").attr("transform", `translate(0, 0)`)
}

function addFirstGroup() {
  firstGroup.value = ctr.value.append("g").attr("transform", `translate(0, ${titleGroupHeight})`)
}

function addSecondGroup() {
  secondGroup.value = ctr.value.append("g").attr("transform", getSecondGroupTranslation())
}

// Draw titles ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function drawTitle() {
  if (graph.detailsMapGraph.type === "works") {
    drawWorksTitleAndMetadata()
  } else if (graph.detailsMapGraph.type === "sdgs") {
    drawSdgTitle()
  } else {
    drawFieldTitle()
  }
}

function drawWorksTitleAndMetadata() {
  const theTitleGroup = titleGroup.value
    .append("g")
    .attr("class", "title-group")
    .attr("transform", `translate(0,-${props.sizes.worksBandwidth * 2})`)

  theTitleGroup.append("rect").attr("class", "title-rect")

  theTitleGroup.append("text").attr("class", "title").text(graph.detailsMapGraph.data.title)

  const titleLink = theTitleGroup
    .append("a")
    .attr("xlink:href", graph.detailsMapGraph.data.openAlexId)
    .attr("target", "_blank")

  titleLink
    .append("rect")
    .attr("class", "title-rect-overlay")
    .append("title")
    .text(graph.detailsMapGraph.data.title)

  theTitleGroup
    .selectAll(".title-rect,.title-rect-overlay")
    .attr("width", mapWidth.value)
    .attr("height", props.sizes.worksBandwidth)

  theTitleGroup.selectAll(".title-rect").attr("stroke", theBlack).attr("fill", theBlack)

  theTitleGroup.selectAll(".title-rect-overlay").attr("fill-opacity", 0).attr("cursor", "pointer")

  theTitleGroup
    .selectAll(".title")
    .attr("x", 5)
    .attr("y", props.sizes.worksBandwidth * 0.85)
    .style("font-size", props.sizes.workTitle)
    .attr("fill", "white")

  titleGroup.value
    .select(".title-group")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", "translate(0,0)")

  // Adding year and journal
  titleGroup.value
    .append("g")
    .attr("class", "title-metadata")
    .attr("transform", `translate(0, ${props.sizes.worksBandwidth * 2})`)
    .append("a")
    .attr("xlink:href", graph.detailsMapGraph.data.doi)
    .attr("target", "_blank")
    .append("text")
    .text(
      `${graph.detailsMapGraph.data.year}${
        graph.detailsMapGraph.data.source.name ? `: ${graph.detailsMapGraph.data.source.name}` : ""
      } - ${graph.detailsMapGraph.data.doi}`
    )
    .style("font-size", `${props.sizes.field * 0.85}px`)
    .attr("fill", theBlack)
}

function drawSdgTitle() {
  const theTitleGroup = titleGroup.value
    .append("g")
    .attr("class", "title-group")
    .attr("transform", `translate(0,-${props.sizes.worksBandwidth * 4})`)

  const sdgLink = theTitleGroup
    .append("a")
    .attr("xlink:href", graph.detailsMapGraph.data.url)
    .attr("target", "_blank")

  const sdgGroup = sdgLink
    .append("g")
    .attr("transform", `translate(${props.sizes.worksBandwidth}, ${props.sizes.worksBandwidth})`)

  sdgGroup.append("circle").attr("r", circleRadius).attr("stroke", theBlack).attr("fill", theBlack)

  sdgGroup
    .append("text")
    .text(`SDG ${graph.detailsMapGraph.data.id}`)
    .attr("x", textElementXOffset)
    .attr("y", 0)
    .style("font-size", `${props.sizes.sdgId}px`)
    .attr("dominant-baseline", "text-after-edge")
    .attr("text-anchor", "start")

  sdgGroup
    .append("rect")
    .attr("x", textElementXOffset)
    .attr("y", 0)
    .attr("fill", graph.detailsMapGraph.data.color)
    .attr("opacity", 0.4)
    .attr("width", graph.detailsMapGraph.data.labelBbox.width)
    .attr("height", graph.detailsMapGraph.data.labelBbox.height)

  sdgGroup
    .append("text")
    .text(graph.detailsMapGraph.data.name)
    .attr("x", textElementXOffset)
    .attr("y", 0)
    .attr("dominant-baseline", "text-before-edge")
    .style("font-size", props.sizes.sdgLabel)
    .attr("text-anchor", "start")

  titleGroup.value
    .select(".title-group")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", "translate(0,0)")
}

function drawFieldTitle() {
  const theTitleGroup = titleGroup.value
    .append("g")
    .attr("class", "title-group")
    .attr("transform", `translate(0,-${props.sizes.worksBandwidth * 4})`)

  const fieldLink = theTitleGroup
    .append("a")
    .attr("xlink:href", graph.detailsMapGraph.data.url)
    .attr("target", "_blank")

  const fieldGroup = fieldLink
    .append("g")
    .attr("transform", `translate(${props.sizes.worksBandwidth}, ${props.sizes.worksBandwidth})`)

  fieldGroup
    .append("circle")
    .attr("r", circleRadius)
    .attr("stroke", theBlack)
    .attr("fill", theBlack)

  fieldGroup
    .append("text")
    .text(graph.detailsMapGraph.data.name)
    .attr("x", textElementXOffset)
    .attr("y", 0)
    .style("font-size", `${props.sizes.field}px`)
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "start")

  titleGroup.value
    .select(".title-group")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", "translate(0,0)")
}

// Draw first group //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function drawFirstGroupContent() {
  if (graph.detailsMapGraph.type === "works") {
    drawElementLinesInFirstGroup(
      graph.detailsMapGraph.children,
      drawElementsInFirstGroup,
      drawWorksInSecondGroup
    )
  } else {
    drawWorkLinesInFirstGroup(
      graph.detailsMapGraph.children,
      drawWorksInFirstGroup,
      drawElementsInSecondGroup
    )
  }
}

function drawElementLinesInFirstGroup(data, callback1, callback2) {
  firstGroup.value
    .selectAll(".first-group-line")
    .data(data)
    .join((enter) =>
      enter
        .append("line")
        .attr("class", (_, i) => ["first-group-line", `element-${i}`].join(" "))
        .attr("stroke", (d) => (d.data.children.length ? theGrey : null))
        .attr("stroke-width", lineWidth)
        .attr("x1", textElementXOffset * 1.5)
        .attr("y1", (_, i) => i * elementBaseDistance)
        .attr("x2", () => (screenSize.isMobile ? mapWidth.value * 0.9 : mapWidth.value * 0.4))
        .attr("y2", (_, i) => i * elementBaseDistance)
    )

  callback1(data, addElementMouseEvents, addElementExpandClickEvents) // callback1 is drawElementsInFirstGroup()
  callback2(drawElementToWorksConnectionsInFirstGroup, addShownWorksMouseEvents) // callback2 is drawWorksInSecondGroup()
}

function drawElementsInFirstGroup(data, callback1, callback2) {
  firstGroup.value
    .selectAll(".first-group-element")
    .data(data)
    .join((enter) =>
      enter
        .append("g")
        .attr("class", (_, i) => ["first-group-element", `element-${i}`].join(" "))
        .attr("transform", `translate(0, -${elementBaseDistance * 2})`)
        .each(function (d, i) {
          if (d.type === "sdg") {
            // Trick to get the labelBox data of the SDG
            const sdg = graph.homeMapGraph.sdgs.find((sdg) => sdg.id === d.data.id)

            const sdgLabelGroup = d3
              .select(this)
              .append("g")
              .attr("class", ["group-element", `element-${i}`].join(" "))
              .attr("data-index", i)
              .attr("cursor", "pointer")

            sdgLabelGroup
              .append("circle")
              .attr("data-id", (d) => d.id)
              .attr("cx", circleRadius * 1.1)
              .attr("cy", 0)
              .attr("r", circleRadius)
              .attr("stroke", theBlack)
              .attr("fill", theBlack)

            // Add SDG ID
            sdgLabelGroup
              .append("text")
              .attr("class", "sdg-group-id")
              .attr("x", textElementXOffset * 1.5)
              .attr("y", 0)
              .text((d) => `SDG ${d.data.id}`)
              .style("font-size", `${props.sizes.sdgId}px`)
              .attr("dominant-baseline", "text-after-edge")
              .attr("text-anchor", "start")
            // Add rectangle for SDG label
            sdgLabelGroup
              .append("rect")
              .attr("x", textElementXOffset * 1.5)
              .attr("y", 0)
              .attr("fill", (d) => d.data.color)
              .attr("opacity", 0.4)
              .attr("width", sdg.labelBbox.width)
              .attr("height", sdg.labelBbox.height)
            // Add SDG label
            sdgLabelGroup
              .append("text")
              .text((d) => d.data.name)
              .attr("x", textElementXOffset * 1.5)
              .attr("y", 0)
              .attr("dominant-baseline", "text-before-edge")
              .style("font-size", props.sizes.sdgLabel)
              .attr("text-anchor", "start")
          } else {
            // Add field
            const fieldLabelGroup = d3
              .select(this)
              .append("g")
              .attr("class", ["group-element", `element-${i}`].join(" "))
              .attr("data-index", i)
              .attr("cursor", "pointer")

            fieldLabelGroup
              .append("circle")
              .attr("data-id", (d) => d.id)
              .attr("cx", circleRadius * 1.1)
              .attr("cy", 0)
              .attr("r", circleRadius)
              .attr("stroke", theBlack)
              .attr("fill", theBlack)

            fieldLabelGroup
              .append("text")
              .attr("class", "field-group-name")
              .attr("x", textElementXOffset * 1.5)
              .attr("y", 0)
              .text((d) => d.data.name)
              .style("font-size", `${props.sizes.field}px`)
              .attr("dominant-baseline", () =>
                d.data.children.length ? "text-after-edge" : "middle"
              )
              .attr("text-anchor", "start")
          }

          // Add element children circle
          const circleGroup = d3
            .select(this)
            .append("g")
            .attr("class", ["group-element", `element-${i}`].join(" "))
            .attr("data-index", i)
            .attr(
              "transform",
              `translate(${screenSize.isMobile ? mapWidth.value * 0.9 : mapWidth.value * 0.4},0)`
            )
            .attr("cursor", "pointer")

          if (d.data.children.length) {
            // Add actual circle with count, if children are available
            circleGroup
              .append("circle")
              .attr("r", circleRadius * 1.4)
              .attr("stroke", theBlack)
              .attr("fill", theBlack)

            circleGroup
              .append("text")
              .text((d) => d.data.children.length)
              .attr("fill", "white")
              .style("font-size", `${props.sizes.field}px`)
              .attr("dominant-baseline", "middle")
              .attr("text-anchor", "middle")
          }
        })
    )

  firstGroup.value
    .selectAll(".first-group-element")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", (_, i) => `translate(0, ${i * elementBaseDistance})`)

  callback1() // callback1 is addElementMouseEvents()
  callback2() // callback2 is addElementExpandClickEvents()
}

function elementColor(type) {
  return type === "mouseover" ? theBlue : theBlack
}

function lineColor(type) {
  return type === "mouseover" ? theBlue : theGrey
}

function lineWwidth(type) {
  return type === "mouseover" ? "2.5px" : lineWidth
}

function fontWeight(type) {
  return type === "mouseover" ? "bold" : "regular"
}

function addElementMouseEvents() {
  firstGroup.value.selectAll(".group-element").on("mouseover mouseout", function (event) {
    const index = d3.select(this).attr("data-index")

    if (graph.detailsMapGraph.children[index].data.children.length) {
      // Highlighting and setting back the lines
      d3.selectAll(`line.element-${index}`)
        .attr("stroke", lineColor(event.type))
        .attr("stroke-width", lineWwidth(event.type))
    }

    // Highlighting and setting back connection lines
    d3.selectAll(`.connection-line-${index}`)
      .attr("stroke", lineColor(event.type))
      .attr("stroke-width", lineWwidth(event.type))

    // Highlighting and setting back shown works
    if (index === clickedFirstGroupElement.value) {
      d3.selectAll(".shown-work-rect")
        .attr("stroke", elementColor(event.type))
        .attr("fill", elementColor(event.type))
    }

    // Highlighting and setting back element circles
    d3.selectAll(`.element-${index} circle`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))
    // Highlighting and setting back SDGs
    d3.selectAll(`.element-${index} .sdg-group-id`)
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))
    // // Highlighting and setting back fields
    d3.selectAll(`.element-${index} .field-group-name`)
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))
  })
}

const clickedFirstGroupElement = ref(null)

const worksInSecondGroup = ref([])
const elementsInSecondGroup = ref([])

watch(
  () => clickedFirstGroupElement.value,
  () => {
    if (graph.detailsMapGraph.type === "works") {
      drawWorksInSecondGroup(drawElementToWorksConnectionsInFirstGroup, addShownWorksMouseEvents)
    } else {
      drawElementsInSecondGroup(drawWorkToElementsConnections, addShownElementsMouseEvents)
    }
  }
)

function addElementExpandClickEvents() {
  firstGroup.value.selectAll(".group-element").on("click", function () {
    const index = d3.select(this).attr("data-index")

    graph.detailsMapGraph.children[index].data.children.length
      ? (clickedFirstGroupElement.value = index)
      : (clickedFirstGroupElement.value = null)

    if (graph.detailsMapGraph.children[index].data.children.length) {
      const shownWorks = graph.detailsMapGraph.children[index].data.children
      worksInSecondGroup.value = shownWorks
    } else {
      worksInSecondGroup.value = []
    }
  })
}

function addWorkExpandClickEvents() {
  firstGroup.value.selectAll(".group-element").on("click", function () {
    const index = d3.select(this).attr("data-index")

    graph.detailsMapGraph.children[index].children.length
      ? (clickedFirstGroupElement.value = index)
      : (clickedFirstGroupElement.value = null)

    if (graph.detailsMapGraph.children[index].children.length) {
      const shownElements = graph.detailsMapGraph.children[index].children
      elementsInSecondGroup.value = shownElements
    } else {
      elementsInSecondGroup.value = []
    }
  })
}

function drawWorksInSecondGroup(callback1, callback2) {
  const shownWorksSelection = secondGroup.value
    .selectAll(".shown-work")
    .data(worksInSecondGroup.value, function (d) {
      return d
    })

  const enterShownWorks = shownWorksSelection
    .enter()
    .append("g")
    .attr("class", "shown-work")
    .attr("transform", `translate(0, -${worksBaseDistance * 2})`)

  // Add rectangles
  enterShownWorks
    .append("rect")
    .attr("class", "shown-work-rect")
    .attr("data-id", (_, i) => i)

  // Add work title
  enterShownWorks
    .append("text")
    .attr("class", "shown-work-title")
    .text((d) => d.title)

  // Adding an overlay rectangle in order to handle mouse events
  enterShownWorks
    .append("rect")
    .attr("class", "shown-work-overlay")
    .data(worksInSecondGroup.value, function (_, i) {
      return i
    })

  // Merge the enter and update selections
  const updateShownWorks = enterShownWorks.merge(shownWorksSelection)

  // Update the attributes of the text elements based on the new data
  updateShownWorks.select(".shown-work-title").text((d) => d.title)

  // Update the attributes of the overlay elements based on the new data
  updateShownWorks.select(".shown-work-overlay title").text((d) => d.title)

  // Select the elements that need to be removed
  const exitShownWorks = shownWorksSelection.exit()

  // Remove them from the DOM
  exitShownWorks.remove()

  secondGroup.value
    .selectAll(".shown-work-rect,.shown-work-overlay")
    .attr("width", () => {
      return screenSize.isMobile ? mapWidth.value * 0.9 : mapWidth.value * 0.5
    })
    .attr("height", props.sizes.worksBandwidth)

  secondGroup.value.selectAll(".shown-work-rect").attr("stroke", theBlack).attr("fill", theBlack)

  // Handling the overlay rect element for handling mouse events as well
  secondGroup.value
    .selectAll(".shown-work-overlay")
    .attr("class", "shown-work-overlay")
    .attr("data-id", (_, i) => i)
    .attr("fill-opacity", 0)
    .attr("cursor", "pointer")

  secondGroup.value
    .selectAll(".shown-work-title")
    .attr("x", 5)
    .attr("y", props.sizes.worksBandwidth * 0.85)
    .style("font-size", props.sizes.workTitle)
    .attr("fill", "#f7f7f7")

  secondGroup.value
    .selectAll(".shown-work")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", (_, i) => {
      return `translate(0, ${worksBaseDistance * i})`
    })

  callback1() // callback1 is drawElementToWorksConnectionsInFirstGroup()
  callback2(addShwonWorksClickEvents) // callback2 is addShownWorksMouseEvents()
}

function getElementToWorksConnectionLinesData(index) {
  // Starting point (0)
  const x0 = screenSize.isMobile
    ? mapWidth.value * 0.9 + circleRadius * 1.5
    : mapWidth.value * 0.4 + circleRadius * 1.5

  const y0 = index * elementBaseDistance

  // First control point (1)
  const x1 = screenSize.isMobile ? mapWidth.value * 0.96 : mapWidth.value * 0.4 + circleRadius * 4

  // Second control point (2)
  const x2 = screenSize.isMobile ? mapWidth.value * 0.96 : mapWidth.value * 0.4 + circleRadius * 8

  const y2 = screenSize.isMobile
    ? graph.detailsMapGraph.children.length * elementBaseDistance +
      (worksInSecondGroup.value.length - 1) * 0.5 * worksBaseDistance +
      props.sizes.worksBandwidth * 0.5
    : props.sizes.worksBandwidth * 0.5

  // End point (3)
  const x3 = screenSize.isMobile ? mapWidth.value * 0.92 : mapWidth.value * 0.495

  const y3 = screenSize.isMobile
    ? graph.detailsMapGraph.children.length * elementBaseDistance +
      (worksInSecondGroup.value.length - 1) * 0.5 * worksBaseDistance +
      props.sizes.worksBandwidth * 0.5
    : (worksInSecondGroup.value.length - 1) * 0.5 * worksBaseDistance +
      props.sizes.worksBandwidth * 0.5

  const linePoints = [
    { x: x0, y: y0 }, // Starting point (0)
    { x: x1, y: y0 }, // First control point (1)
    { x: x2, y: y2 }, // Second control point (2)
    { x: x3, y: y3 } // End point (3)
  ]

  return [linePoints]
}

function drawQuadraticCurve(coordinates) {
  const lineGenerator = d3
    .line()
    .x((d) => d.x) // set the x accessor
    .y((d) => d.y) // set the y accessor
    .curve(d3.curveCatmullRom.alpha(0.5))
  return lineGenerator(coordinates) // generate the path data string
}

function drawElementToWorksConnectionsInFirstGroup() {
  const connectionLinesData = clickedFirstGroupElement.value
    ? getElementToWorksConnectionLinesData(clickedFirstGroupElement.value)
    : []

  d3.selectAll(".connection-line").remove()

  firstGroup.value
    .selectAll(".connection-line")
    .data(connectionLinesData)
    .join(
      (enter) =>
        enter
          .append("path")
          .attr(
            "class",
            ["connection-line", `connection-line-${clickedFirstGroupElement.value}`].join(" ")
          )
          .attr("d", (d) => drawQuadraticCurve(d))
          .attr("stroke", "white")
          .attr("fill", "none")
          .attr("stroke-width", lineWidth),
      (update) => update,
      (exit) => exit
    )

  firstGroup.value
    .selectAll(".connection-line")
    .transition()
    .duration(transitionDuration * 0.3)
    .attr("stroke", theGrey)
}

const tooltip = ref(null)

function fillTooltip(data) {
  tooltip.value.select(".tooltip-title").text(data.title)
  tooltip.value
    .select(".tooltip-citation")
    .text(`${data.year}${data.source.name ? `: ${data.source.name}` : ""}`)
}

function showHideTooltip(type, DOMRect) {
  // console.log(DOMRect)
  tooltip.value.style("visibility", type === "mouseover" ? "visible" : "hidden")
  tooltip.value
    .style("width", `${mapWidth.value}px`)
    .style("left", `${(screenSize.width - screenSize.modalWidth) / 2}px`)
    // .style("left", `${DOMRect.left + DOMRect.width / 2 - 450}px`)
    .style("top", `${DOMRect.top - 85}px`)
  // 450 is half of the tooltip's width as set in the <style>
}

function addShownWorksMouseEvents(callback) {
  secondGroup.value
    .selectAll(".shown-work-overlay")
    .on("mouseover mouseout", function (event, data) {
      const elementIndex = clickedFirstGroupElement.value
      const workIndex = d3.select(this).attr("data-id")

      // Highlighting and setting back shown work
      d3.select(`.shown-work-rect[data-id='${workIndex}']`)
        .attr("stroke", elementColor(event.type))
        .attr("fill", elementColor(event.type))

      d3.selectAll(`line.element-${elementIndex}`)
        .attr("stroke", lineColor(event.type))
        .attr("stroke-width", lineWwidth(event.type))

      // Highlighting and setting back connection lines
      d3.selectAll(`.connection-line-${elementIndex}`)
        .attr("stroke", lineColor(event.type))
        .attr("stroke-width", lineWwidth(event.type))
      // Highlighting and setting back element circles
      d3.selectAll(`.element-${elementIndex} circle`)
        .attr("stroke", elementColor(event.type))
        .attr("fill", elementColor(event.type))
      // Highlighting and setting back SDGs
      d3.selectAll(`.element-${elementIndex} .sdg-group-id`)
        .attr("fill", elementColor(event.type))
        .attr("font-weight", fontWeight(event.type))
      // // Highlighting and setting back fields
      d3.selectAll(`.element-${elementIndex} .field-group-name`)
        .attr("fill", elementColor(event.type))
        .attr("font-weight", fontWeight(event.type))

      fillTooltip(data)
      showHideTooltip(event.type, this.getBoundingClientRect())
    })

  callback() // callback is addShwonWorksClickEvents()
}

function addShwonWorksClickEvents() {
  secondGroup.value.selectAll(".shown-work-overlay").on("click", async function () {
    tooltip.value.style("visibility", "hidden")

    const workIndex = d3.select(this).attr("data-id")

    // E.g. {type: 'works', root: {...}, sizes: {...} }
    const inputObj = {
      type: "works",
      root: worksInSecondGroup.value[workIndex],
      sizes: props.sizes
    }

    const detailsData = await createDetailsMapGraph(inputObj)
    graph.setDetailsMapGraph(detailsData)

    worksInSecondGroup.value = []
    clickedFirstGroupElement.value = null

    createStaticMapElements()
    drawDynamicMap()
  })
}

function drawWorkLinesInFirstGroup(data, callback1, callback2) {
  callback1(data, addWorkMouseEvents, addWorkExpandClickEvents) // callback1 is drawWorksInFirstGroup()

  firstGroup.value
    .selectAll(".first-group-line")
    .data(data)
    .join((enter) =>
      enter
        .append("line")
        .attr("class", (_, i) => ["first-group-line", `element-${i}`].join(" "))
        .attr("stroke", (d) => (d.children.length ? theGrey : null))
        .attr("stroke-width", lineWidth)
        .attr("x1", screenSize.isMobile ? mapWidth.value * 0.75 : mapWidth.value * 0.45)
        .attr("y1", (_, i) => i * worksBaseDistance + props.sizes.worksBandwidth * 0.5)
        .attr(
          "x2",
          screenSize.isMobile
            ? mapWidth.value * 0.9 - circleRadius * 1.5 * 2
            : mapWidth.value * 0.5 - circleRadius * 1.5
        )
        .attr("y2", (_, i) => i * worksBaseDistance + props.sizes.worksBandwidth * 0.5)
    )

  callback2(drawWorkToElementsConnections, addShownElementsMouseEvents) // callback2 is drawElementsInSecondGroup()
}

function drawWorksInFirstGroup(data, callback1, callback2) {
  firstGroup.value
    .selectAll(".first-group-element")
    .data(data)
    .join((enter) =>
      enter
        .append("g")
        .attr("class", (_, i) => ["first-group-element", `element-${i}`].join(" "))
        .attr("transform", `translate(0, -${worksBaseDistance * 2})`)
        .each(function (d, i) {
          const workGroup = d3
            .select(this)
            .append("g")
            .attr("class", ["group-element", `element-${i}`].join(" "))
            .attr("data-index", i)

          // Add rectangles
          workGroup.append("rect").attr("class", "first-group-work-rect").attr("data-id", i)

          // Add work title
          workGroup
            .append("text")
            .attr("class", "first-group-work-title")
            .attr("data-id", (d) => d.id)
            .text((d) => d.title)
          // Adding an overlay rectangle in order to handle mouse events
          workGroup.append("rect").attr("class", "first-group-work-overlay")
          // .each(function () {
          //   d3.select(this)
          //     .append("title")
          //     .text((d) => d.title)
          // })

          const circleGroup = d3
            .select(this)
            .append("g")
            .attr("class", ["group-element", `element-${i}`].join(" "))
            .attr("data-index", i)
            .attr(
              "transform",
              `translate(${
                screenSize.isMobile
                  ? mapWidth.value * 0.9 - circleRadius * 1.5
                  : mapWidth.value * 0.5
              },${props.sizes.worksBandwidth * 0.5})`
            )
            .attr("cursor", "pointer")

          if (d.children.length) {
            // Add actual circle with count, if children are available
            circleGroup
              .append("circle")
              .attr("class", "first-group-work-circle")
              .attr("r", circleRadius * 1.4)
              .attr("stroke", theBlack)
              .attr("fill", theBlack)

            circleGroup
              .append("text")
              .text((d) => d.children.length)
              .attr("fill", "#f7f7f7")
              .style("font-size", `${props.sizes.field}px`)
              .attr("dominant-baseline", "middle")
              .attr("text-anchor", "middle")
          }
        })
    )

  // Handling the <rect> elements inside each g.work
  firstGroup.value
    .selectAll(".first-group-work-rect,.first-group-work-overlay")
    .attr("width", () => {
      return screenSize.isMobile ? mapWidth.value * 0.75 : mapWidth.value * 0.45
    })
    .attr("height", props.sizes.worksBandwidth)

  // Setting the background work-rect's colors separately
  firstGroup.value
    .selectAll(".first-group-work-rect")
    .attr("stroke", theBlack)
    .attr("fill", theBlack)

  // Handling the overlay rect element for handling mouse events as well
  firstGroup.value
    .selectAll(".first-group-work-overlay")
    .attr("fill-opacity", 0)
    .attr("cursor", "pointer")

  // Handling the <text> elements of the work title
  firstGroup.value
    .selectAll(".first-group-work-title")
    .attr("x", 5)
    .attr("y", props.sizes.worksBandwidth * 0.85)
    .style("font-size", props.sizes.workTitle)
    .attr("fill", "white")

  // Positioning each <g> element with class "work" along the yScaleWorks
  firstGroup.value
    .selectAll(".first-group-element")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", (_, i) => {
      return `translate(0, ${worksBaseDistance * i})`
    })

  callback1() // callback1 is addWorkMouseEvents()
  callback2() // callback is addWorkExpandClickEvents()
}

function addWorkMouseEvents() {
  firstGroup.value.selectAll(".group-element").on("mouseover mouseout", function (event, data) {
    const index = d3.select(this).attr("data-index")

    if (graph.detailsMapGraph.children[index].children.length) {
      // Highlighting and setting back the lines
      d3.selectAll(`line.element-${index}`)
        .attr("stroke", lineColor(event.type))
        .attr("stroke-width", lineWwidth(event.type))
    }

    // Highlighting and setting back connection lines
    d3.selectAll(`.connection-line-${index}`)
      .attr("stroke", lineColor(event.type))
      .attr("stroke-width", lineWwidth(event.type))

    // Highlighting and setting back shown elements
    if (index === clickedFirstGroupElement.value) {
      d3.selectAll(".shown-element-circle")
        .attr("stroke", elementColor(event.type))
        .attr("fill", elementColor(event.type))

      d3.selectAll(".shown-sdg-group-id, .shown-field-group-name")
        .attr("fill", elementColor(event.type))
        .attr("font-weight", fontWeight(event.type))
    }

    // Highlighting and setting back work circles
    d3.selectAll(`.element-${index} .first-group-work-circle`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))

    // Highlighting and setting back first group works
    d3.selectAll(`.element-${index} .first-group-work-rect`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))

    fillTooltip(data)
    showHideTooltip(event.type, this.getBoundingClientRect())
  })
}

function drawElementsInSecondGroup(callback1, callback2) {
  // No update function for shown elements. The SDG groups and the field groups differ too much
  d3.selectAll(".shown-element").remove()

  const shownElementsSelection = secondGroup.value
    .selectAll(".shown-element")
    .data(elementsInSecondGroup.value, function (d) {
      return d
    })

  const enterShownElements = shownElementsSelection
    .enter()
    .append("g")
    .attr("class", "shown-element")
    .attr("data-id", (_, i) => i)
    .attr(
      "transform",
      `translate(${screenSize.isMobile ? mapWidth.value * 0.85 : mapWidth.value * 0.15}, -${
        elementBaseDistance * 2
      })`
    )

  enterShownElements.each(function (d, i) {
    if (d.type === "sdg") {
      // Trick to get the labelBox data of the SDG
      const sdg = graph.homeMapGraph.sdgs.find((sdg) => sdg.id === d.data.id)

      const sdgLabelGroup = d3
        .select(this)
        .append("g")
        .attr("class", ["group-element", `element-${i}`].join(" "))
        .attr("data-index", i)
        .attr("cursor", "pointer")

      sdgLabelGroup
        .append("circle")
        .attr("class", "shown-element-circle")
        .attr("data-id", (d) => d.id)
        .attr("r", circleRadius)
        .attr("stroke", theBlack)
        .attr("fill", theBlack)

      // Add SDG ID
      sdgLabelGroup
        .append("text")
        .attr("class", "shown-sdg-group-id")
        .text((d) => `SDG ${d.data.id}`)
        .attr("x", () => {
          return screenSize.isMobile ? -textElementXOffset : textElementXOffset
        })
        .attr("y", 0)
        .style("font-size", `${props.sizes.sdgId}px`)
        .attr("dominant-baseline", "text-after-edge")
        .attr("text-anchor", () => {
          return screenSize.isMobile ? "end" : "start"
        })
      // Add rectangle for SDG label
      sdgLabelGroup
        .append("rect")
        .attr(
          "x",
          screenSize.isMobile ? -(sdg.labelBbox.width + textElementXOffset) : textElementXOffset
        )
        .attr("y", 0)
        .attr("fill", (d) => d.data.color)
        .attr("opacity", 0.4)
        .attr("width", sdg.labelBbox.width)
        .attr("height", sdg.labelBbox.height)
      // Add SDG label
      sdgLabelGroup
        .append("text")
        .text((d) => d.data.name)
        .attr("x", () => {
          return screenSize.isMobile ? -textElementXOffset : textElementXOffset
        })
        .attr("y", 0)
        .attr("dominant-baseline", "text-before-edge")
        .style("font-size", props.sizes.sdgLabel)
        .attr("text-anchor", () => {
          return screenSize.isMobile ? "end" : "start"
        })
    } else {
      // Add field
      const fieldLabelGroup = d3
        .select(this)
        .append("g")
        .attr("class", ["group-element", `element-${i}`].join(" "))
        .attr("data-index", i)
        .attr("cursor", "pointer")

      fieldLabelGroup
        .append("circle")
        .attr("class", "shown-element-circle")
        .attr("data-id", (d) => d.id)
        .attr("r", circleRadius)
        .attr("stroke", theBlack)
        .attr("fill", theBlack)

      fieldLabelGroup
        .append("text")
        .attr("class", "shown-field-group-name")
        .text((d) => d.data.name)
        .attr("x", () => {
          return screenSize.isMobile ? -textElementXOffset : textElementXOffset
        })
        .attr("y", 0)
        .style("font-size", `${props.sizes.field}px`)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", () => {
          return screenSize.isMobile ? "end" : "start"
        })
    }
  })

  secondGroup.value
    .selectAll(".shown-element")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", (_, i) => {
      return `translate(${
        screenSize.isMobile ? mapWidth.value * 0.9 - circleRadius * 1.5 : mapWidth.value * 0.15
      }, ${elementBaseDistance * i})`
    })

  callback1() // callback1 is drawWorkToElementsConnections()
  callback2(addShwonElementsClickEvents) // callback2 is addShownElementsMouseEvents()
}

function getWorksToElementsConnectionLinesData(index) {
  // Starting point (0)
  const x0 = screenSize.isMobile ? mapWidth.value * 0.9 : circleRadius * 1.5
  const y0 = index * worksBaseDistance + props.sizes.worksBandwidth * 0.5

  // First control point (1)
  const x1 = screenSize.isMobile ? mapWidth.value * 0.95 : mapWidth.value * 0.1

  // Second control point (2)
  const x2 = screenSize.isMobile ? mapWidth.value * 0.95 : mapWidth.value * 0.1
  const y2 = screenSize.isMobile
    ? graph.detailsMapGraph.children.length * worksBaseDistance +
      elementsInSecondGroup.value.length * 0.5 * elementBaseDistance +
      elementBaseDistance * 0.25
    : (elementsInSecondGroup.value.length - 1) * 0.5 * elementBaseDistance

  // End point (3)
  const x3 = screenSize.isMobile ? mapWidth.value * 0.9 : mapWidth.value * 0.14

  const y3 = screenSize.isMobile
    ? graph.detailsMapGraph.children.length * worksBaseDistance +
      elementsInSecondGroup.value.length * 0.5 * elementBaseDistance +
      elementBaseDistance * 0.25
    : (elementsInSecondGroup.value.length - 1) * 0.5 * elementBaseDistance

  const linePoints = [
    { x: x0, y: y0 }, // Starting point (0)
    { x: x1, y: y0 }, // First control point (1)
    { x: x2, y: y2 }, // Second control point (2)
    { x: x3, y: y3 } // End point (3)
  ]

  return [linePoints]
}

function drawWorkToElementsConnections() {
  const connectionLinesData = clickedFirstGroupElement.value
    ? getWorksToElementsConnectionLinesData(clickedFirstGroupElement.value)
    : []

  const groutToAppendTo = screenSize.isMobile ? firstGroup.value : secondGroup.value

  d3.selectAll(".connection-line").remove()

  groutToAppendTo
    .selectAll(".connection-line")
    .data(connectionLinesData)
    .join(
      (enter) =>
        enter
          .append("path")
          .attr(
            "class",
            ["connection-line", `connection-line-${clickedFirstGroupElement.value}`].join(" ")
          )
          .attr("d", (d) => drawQuadraticCurve(d))
          .attr("stroke", "white")
          .attr("fill", "none")
          .attr("stroke-width", lineWidth),
      (update) => update,
      (exit) => exit
    )

  groutToAppendTo
    .selectAll(".connection-line")
    .transition()
    .duration(transitionDuration * 0.3)
    .attr("stroke", theGrey)
}

function addShownElementsMouseEvents(callback) {
  secondGroup.value.selectAll(".shown-element").on("mouseover mouseout", function (event) {
    const workIndex = clickedFirstGroupElement.value

    // Highlighting and setting back shown element circle
    d3.select(this)
      .select(".shown-element-circle")
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))

    // Highlighting and setting back shown element labels
    d3.select(this)
      .select(".shown-sdg-group-id, .shown-field-group-name")
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))

    // Highlighting and setting back work to circle line
    d3.selectAll(`line.element-${workIndex}`)
      .attr("stroke", lineColor(event.type))
      .attr("stroke-width", lineWwidth(event.type))

    // Highlighting and setting back connection lines
    d3.selectAll(`.connection-line-${workIndex}`)
      .attr("stroke", lineColor(event.type))
      .attr("stroke-width", lineWwidth(event.type))

    // Highlighting and setting back work circles
    d3.selectAll(`.element-${workIndex} .first-group-work-circle`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))

    // Highlighting and setting back work
    d3.selectAll(`.element-${workIndex} .first-group-work-rect`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))
  })

  callback() // callback is addShwonElementsClickEvents()
}

function addShwonElementsClickEvents() {
  secondGroup.value.selectAll(".shown-element").on("click", async function () {
    const elementIndex = d3.select(this).attr("data-id")

    let root = elementsInSecondGroup.value[elementIndex].data

    // Trick to add labelBox info of relevant SDG
    if (elementsInSecondGroup.value[elementIndex].type === "sdg") {
      const sdg = graph.homeMapGraph.sdgs.find((sdg) => sdg.id === root.id)
      root.labelBbox = sdg.labelBbox
    }

    // E.g. {type: 'sdgs', root: {...}, sizes: {...} }
    const inputObj = {
      type: `${elementsInSecondGroup.value[elementIndex].type}s`,
      root: root,
      sizes: props.sizes
    }

    const detailsData = await createDetailsMapGraph(inputObj)
    graph.setDetailsMapGraph(detailsData)

    elementsInSecondGroup.value = []
    clickedFirstGroupElement.value = null

    createStaticMapElements()
    drawDynamicMap()
  })
}
</script>

<template>
  <div id="details-tooltip">
    <div class="tooltip-title"></div>
    <div class="tooltip-citation"></div>
  </div>
  <div id="details-map"></div>
</template>

<style scoped>
#details-tooltip {
  text-align: center;
  visibility: hidden;
  position: fixed;
  z-index: 15;
  background-color: rgba(247, 247, 247, 0.9);
  border-radius: 0px;
  padding: 5px;
}

.tooltip-citation {
  font-size: 0.85rem;
}
</style>
