import { Point } from "./interfaces/Point";

export function areEqual(obj1, obj2) {
	return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
};

export function sortPoint(a: Point, b: Point) {
	return calcDistance(a.x, a.y) - calcDistance(b.x, b.y)
}

function calcDistance(x: number, y: number) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}