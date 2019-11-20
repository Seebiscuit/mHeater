import { Point } from "./interfaces/Point";
import { Grid } from './interfaces/Grid';
import { fileURLToPath } from "url";
export function areEqual(obj1, obj2) {
	return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
};

export function sortPoint(a: Point, b: Point) {
	return calcDistance(a.x, a.y) - calcDistance(b.x, b.y)
}

export function calculateGridHits(sourceGrid: Array<Grid>, coords: Array<Point> | null, rowSize: number, columnSize: number, cellSide:number) {
	const totalWidth = columnSize * cellSide
	const totalLength = rowSize * cellSide
	const grid = [...sourceGrid].map(cell => ({...cell, hits: 0}))
	let sortedCoordMap;

	if (coords && coords.length) {
		sortedCoordMap = coords.slice().sort(sortPoint)
			
		sortedCoordMap.forEach(point => {
			const numberOfColumns = Math.floor(point.x / cellSide)
			const numberOfRows = Math.floor(point.y / cellSide)

			const fullRows = columnSize * numberOfRows

			if (numberOfColumns + fullRows  >= grid.length) {
				console.info("Point is outside of grid")
				return  // Point is outside of grid, continue
			}

			grid[numberOfColumns + fullRows].hits++
		})
	}

	return grid
}

export function calculateGridColor(sourceGrid: Array<Grid>) {
	const grid = [...sourceGrid]
	const sortedGrid = grid.slice()
		.sort((a,b) => a.hits - b.hits)

	const minimum = sortedGrid[0].hits, maximum = sortedGrid[sortedGrid.length - 1].hits

	return grid.map(cell => Object.assign(cell, { color: calculateHeatmapColor(minimum, maximum, cell.hits) }))

}

function calcDistance(x: number, y: number) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

function calculateHeatmapColor(minimum: number, maximum: number, value: number): string {
	const SENSITIVITY = 3, CUTOFF = 2

	const ratio = SENSITIVITY * (value-minimum) / (maximum - minimum)
	const g = Math.floor(Math.max(0, 255*(1 - ratio)))
	const r = Math.floor(Math.max(0, 255*(ratio - 1)))
	const b = 255 - g - r

	if (value < CUTOFF) return `rgb(2, 133, 0)` // pleasing green background

	return `rgb(${r}, ${g}, ${b})`
}
