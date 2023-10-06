// Function to assign customized kmapper color
import * as d3 from "d3"

export function getArticleColor(colorArray) {
  if (colorArray.length === 1) {
    return colorArray[0]
  } else {
    const dynamicColor = d3.scaleLinear()
      .domain([1, 3])
      .range([colorArray[0], colorArray[colorArray.length - 1]])
    return dynamicColor(2)
  }
}