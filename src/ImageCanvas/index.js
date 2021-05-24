/* eslint-disable no-unused-vars */
// @flow
import React, { Fragment, useRef, useState, useLayoutEffect } from 'react'
import { Matrix } from 'transformation-matrix-js'
import { cloneDeep } from 'lodash'
import getImageData from 'get-image-data'
import Crosshairs from '../Crosshairs'
import type { Region, PixelRegion, Point, Polygon, Box, Circle } from './region-tools.js'
import { getEnclosingBox } from './region-tools.js'
import { makeStyles } from '@material-ui/core/styles'
import styles from './styles'
import classnames from 'classnames'
import RegionLabel from '../RegionLabel'
import LockIcon from '@material-ui/icons/Lock'
import Paper from '@material-ui/core/Paper'
import HighlightBox from '../HighlightBox'
// import excludePatternSrc from "./xpattern.png"
import excludePatternSrc from './xpattern.js'
import PreventScrollToParents from '../PreventScrollToParents'
import Popper from '@material-ui/core/Popper'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(styles)

const boxCursorMap = [
	['nw-resize', 'n-resize', 'ne-resize'],
	['w-resize', 'grab', 'e-resize'],
	['sw-resize', 's-resize', 'se-resize'],
]

type Props = {
	regions: Array<Region>,
	imageSrc: string,
	onMouseMove?: ({ x: number, y: number }) => any,
	onMouseDown?: ({ x: number, y: number }) => any,
	onMouseUp?: ({ x: number, y: number }) => any,
	dragWithPrimary?: boolean,
	zoomWithPrimary?: boolean,
	zoomOutWithPrimary?: boolean,
	createWithPrimary?: boolean,
	showTags?: boolean,
	realSize?: { width: number, height: number, unitName: string },
	showCrosshairs?: boolean,
	showPointDistances?: boolean,
	pointDistancePrecision?: number,
	regionClsList?: Array<string>,
	regionTagList?: Array<string>,
	allowedArea?: { x: number, y: number, w: number, h: number },

	onChangeRegion: (Region) => any,
	onBeginRegionEdit: (Region) => any,
	onCloseRegionEdit: (Region) => any,
	onDeleteRegion: (Region) => any,
	onBeginBoxTransform: (Box, [number, number]) => any,
	onBeginCircleTransform: (Circle, directions: string) => any,
	onBeginMovePolygonPoint: (Polygon, index: number) => any,
	onAddPolygonPoint: (Polygon, point: [number, number], index: number) => any,
	onSelectRegion: (Region) => any,
	onBeginMovePoint: (Point) => any,
	onImageLoaded: ({ width: number, height: number }) => any,
	handleScaleChange: ({ value: number }) => any,
	setImageLoaded: () => any,
}

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, -10, -10)

export default ({
	regions,
	imageSrc,
	realSize,
	showTags,
	onMouseMove = (p) => null,
	onMouseDown = (p) => null,
	onMouseUp = (p) => null,
	dragWithPrimary = false,
	zoomWithPrimary = false,
	zoomOutWithPrimary = false,
	createWithPrimary = false,
	pointDistancePrecision = 0,
	regionClsList,
	regionTagList,
	showCrosshairs,
	showPointDistances,
	allowedArea,
	zoomHistory,
	onImageLoaded,
	changeZoomHistory,
	resetZoomHistory,
	onChangeRegion,
	onBeginRegionEdit,
	onCloseRegionEdit,
	onBeginCircleTransform,
	onBeginBoxTransform,
	onBeginMovePolygonPoint,
	onAddPolygonPoint,
	onSelectRegion,
	onBeginMovePoint,
	onDeleteRegion,
	mat,
	changeMat,
	onIhIwChange,
	setImageLoaded,
	handleScaleChange,
	rollOverZoom,
}: Props) => {
	const classes = useStyles()
	const popperRef = useRef(null)
	const canvasEl = useRef(null)
	const image = useRef(null)
	const layoutParams = useRef({})
	const excludePattern = useRef(null)
	const [imageLoaded, changeImageLoaded] = useState(false)
	const [dragging, changeDragging] = useState(false)
	const [maskImagesLoaded, changeMaskImagesLoaded] = useState(0)
	const [zoomStart, changeZoomStart] = useState(null)
	const [zoomEnd, changeZoomEnd] = useState(null)
	const mousePosition = useRef({ x: 0, y: 0 })
	const prevMousePosition = useRef({ x: 0, y: 0 })
	// const [mat, changeMat] = useState(getDefaultMat())
	const maskImages = useRef({})

	const innerMousePos = mat.applyToPoint(mousePosition.current.x, mousePosition.current.y)

	const projectRegionBox = (r) => {
		const { iw, ih } = layoutParams.current
		// onIhIwChange(ih, iw);
		const bbox = getEnclosingBox(r, iw, ih)
		const margin = r.type === 'point' ? 15 : 2
		const cbox = {
			x: bbox.x * iw - margin,
			y: bbox.y * ih - margin,
			w: bbox.w * iw + margin * 2,
			h: bbox.h * ih + margin * 2,
		}
		const pbox = {
			...mat.clone().inverse().applyToPoint(cbox.x, cbox.y),
			w: cbox.w / mat.a,
			h: cbox.h / mat.d,
		}
		return pbox
	}

	useLayoutEffect(() => {
		if (image.current === null) {
			image.current = new Image()
			setImageLoaded(false)
			image.current.onload = () => {
				changeImageLoaded(true)
				setImageLoaded(true)
				if (!rollOverZoom) {
					handleScaleChange(100)
				}
				onImageLoaded({
					width: image.current.naturalWidth,
					height: image.current.naturalHeight,
				})
			}
			image.current.src = imageSrc
		}
		const canvas = canvasEl.current
		const { clientWidth, clientHeight } = canvas
		canvas.width = clientWidth
		canvas.height = clientHeight
		const context = canvas.getContext('2d')
		if (excludePattern.current === null) {
			excludePattern.current = {
				image: new Image(),
				pattern: null,
			}
			excludePattern.current.image.onload = () => {
				excludePattern.current.pattern = context.createPattern(excludePattern.current.image, 'repeat')
			}
			excludePattern.current.image.src = excludePatternSrc
		}
		context.save()
		context.transform(...mat.clone().inverse().toArray())

		const fitScale = Math.max(image.current.naturalWidth / clientWidth, image.current.naturalHeight / clientHeight)

		const [iw, ih] = [image.current.naturalWidth / fitScale, image.current.naturalHeight / fitScale]
		onIhIwChange(ih, iw)

		layoutParams.current = {
			iw,
			ih,
			fitScale,
			canvasWidth: clientWidth,
			canvasHeight: clientHeight,
		}

		// context.drawImage(image.current, clientWidth/2 - iw/2, clientHeight/2 - ih/2, iw, ih)
		context.drawImage(image.current, 0, 0, iw, ih)

		if (allowedArea) {
			// Pattern to indicate the NOT allowed areas
			const { x, y, w, h } = allowedArea
			context.save()
			context.globalAlpha = 0.25
			const outer = [
				[0, 0],
				[iw, 0],
				[iw, ih],
				[0, ih],
			]
			const inner = [
				[x * iw, y * ih],
				[x * iw + w * iw, y * ih],
				[x * iw + w * iw, y * ih + h * ih],
				[x * iw, y * ih + h * ih],
			]
			context.moveTo(...outer[0])
			outer.forEach((p) => context.lineTo(...p))
			context.lineTo(...outer[0])
			context.closePath()

			inner.reverse()
			context.moveTo(...inner[0])
			inner.forEach((p) => context.lineTo(...p))
			context.lineTo(...inner[0])

			context.fillStyle = excludePattern.current.pattern || '#f00'
			context.fill()

			context.restore()
		}

		context.save()
		context.globalAlpha = mat.a * 0.5 + 0.5
		context.lineWidth = mat.a * 0.5 + 0.2
		if (context.globalAlpha > 0.6) {
			context.shadowColor = 'black'
			context.shadowBlur = 4
		}
		for (const region of cloneDeep(regions.filter((r) => r.visible || r.visible === undefined)).sort(function (
			a,
			b
		) {
			return (a.zIndex || 0) - (b.zIndex || 0)
		})) {
			switch (region.type) {
				case 'point': {
					context.save()

					context.beginPath()
					context.strokeStyle = region.color
					context.moveTo(region.x * iw - 10, region.y * ih)
					context.lineTo(region.x * iw - 2, region.y * ih)
					context.moveTo(region.x * iw + 10, region.y * ih)
					context.lineTo(region.x * iw + 2, region.y * ih)
					context.moveTo(region.x * iw, region.y * ih - 10)
					context.lineTo(region.x * iw, region.y * ih - 2)
					context.moveTo(region.x * iw, region.y * ih + 10)
					context.lineTo(region.x * iw, region.y * ih + 2)
					context.moveTo(region.x * iw + 5, region.y * ih)
					context.arc(region.x * iw, region.y * ih, 5, 0, 2 * Math.PI)
					context.stroke()
					context.restore()
					break
				}
				case 'box': {
					context.save()

					context.shadowColor = 'black'
					if (region.is_dotted) {
						context.setLineDash([6])
					}
					context.shadowBlur = 4
					context.strokeStyle = region.color
					context.strokeRect(region.x * iw, region.y * ih, region.w * iw, region.h * ih)

					context.restore()
					break
				}
				case 'polygon': {
					context.save()

					context.shadowColor = 'black'
					context.shadowBlur = 4
					context.strokeStyle = region.color

					context.beginPath()
					context.moveTo(region.points[0][0] * iw, region.points[0][1] * ih)
					for (const point of region.points) {
						context.lineTo(point[0] * iw, point[1] * ih)
					}
					if (!region.open) context.closePath()
					context.stroke()
					context.restore()
					break
				}
				case 'circle': {
					context.save()
					context.shadowColor = 'black'
					context.shadowBlur = 4
					context.strokeStyle = region.color
					context.beginPath()
					context.arc(
						region.x * iw,
						region.y * ih,
						Math.sqrt(Math.pow((region.xr - region.x) * iw, 2) + Math.pow((region.yr - region.y) * ih, 2)),
						0,
						2 * Math.PI
					)
					context.stroke()
					context.restore()
					break
				}
				case 'pixel': {
					context.save()

					if (maskImages.current[region.src]) {
						if (maskImages.current[region.src].nodeName === 'CANVAS') {
							context.globalAlpha = 0.6
							context.drawImage(
								maskImages.current[region.src],
								region.sx * iw,
								region.sy * ih,
								region.w * iw,
								region.h * ih
							)
						}
					} else {
						maskImages.current[region.src] = new Image()
						maskImages.current[region.src].onload = () => {
							const img = maskImages.current[region.src]
							const newCanvas = document.createElement('canvas')
							newCanvas.width = img.naturalWidth
							newCanvas.height = img.naturalHeight
							const ctx = newCanvas.getContext('2d')
							ctx.drawImage(img, 0, 0)
							const imgData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
							for (let i = 0; i < imgData.data.length; i += 4) {
								const [r, g, b, a] = imgData.data.slice(i, i + 4)
								const black = r < 10 && g < 10 && b < 10
								imgData.data[i] = 0
								imgData.data[i + 1] = 0
								imgData.data[i + 2] = black ? 255 : 0
								imgData.data[i + 3] = black ? 255 : 0
							}
							ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight)
							ctx.putImageData(imgData, 0, 0)
							maskImages.current[region.src] = newCanvas
							changeMaskImagesLoaded(maskImagesLoaded + 1)
						}
						maskImages.current[region.src].src = region.src
					}

					context.restore()
					break
				}
			}
		}
		context.restore()
		context.restore()
	})

	const zoomIn = (direction, point) => {
		const [mx, my] = [point.x, point.y]
		let scale = typeof direction === 'object' ? direction.to : 1 + 0.2 * direction

		const oldMat = mat.clone()
		if (!zoomHistory || zoomHistory.length == 0) {
			changeZoomHistory(oldMat, 'ADD_NEW')
		}
		// NOTE: We're mutating mat here
		mat.translate(mx, my).scaleU(scale)
		if (mat.a > 1) mat.scaleU(1 / mat.a)
		if (mat.a < 0.1) mat.scaleU(0.1 / mat.a)
		mat.translate(-mx, -my)
		const horizontal_move_limit = (1 / mat.a - 1) * (iw / (1 / mat.a))
		const vertical_move_limit = (1 / mat.d - 1) * (ih / (1 / mat.d))

		if (mat.e < -10) {
			mat.e = -10
		} else if (mat.e > horizontal_move_limit) {
			mat.e = horizontal_move_limit
		}

		if (mat.f < -10) {
			mat.f = -10
		} else if (mat.f > vertical_move_limit) {
			mat.f = vertical_move_limit
		}
		const newMatClone = mat.clone()

		if (
			!(
				Object.keys(oldMat).length === Object.keys(newMatClone).length &&
				Object.keys(oldMat).every((key) => oldMat[key] === newMatClone[key])
			)
		) {
			changeZoomHistory(newMatClone, 'ADD_NEW')
			changeMat(newMatClone)
		}
	}
	const zoomOut = () => {
		if (zoomHistory && zoomHistory.length > 0) {
			const newMat = zoomHistory[0]
			changeZoomHistory(0, '')
			changeMat(Matrix.from(newMat))
		} else {
			changeMat(Matrix.from(getDefaultMat()))
		}
	}
	const resetPosition = () => {
		resetZoomHistory()
		changeMat(Matrix.from(getDefaultMat()))
	}

	const mouseEvents = {
		onMouseMove: (e) => {
			const { left, top } = canvasEl.current.getBoundingClientRect()
			prevMousePosition.current.x = mousePosition.current.x
			prevMousePosition.current.y = mousePosition.current.y
			mousePosition.current.x = e.clientX - left
			mousePosition.current.y = e.clientY - top

			const projMouse = mat.applyToPoint(mousePosition.current.x, mousePosition.current.y)

			if (zoomWithPrimary && zoomStart) {
				changeZoomEnd(projMouse)
			}

			const { iw, ih } = layoutParams.current
			// onIhIwChange(ih, iw);
			onMouseMove({ x: projMouse.x / iw, y: projMouse.y / ih })

			if (dragging) {
				mat.translate(
					prevMousePosition.current.x - mousePosition.current.x,
					prevMousePosition.current.y - mousePosition.current.y
				)

				// const { clientWidth, clientHeight } = canvasEl.current
				// const horizontal_move_limit = ((1/mat.a) - 1) * clientWidth;
				// const vertical_move_limit = ((1/mat.d) - 1) * clientHeight;
				const horizontal_move_limit = (1 / mat.a - 1) * (iw / (1 / mat.a))
				const vertical_move_limit = (1 / mat.d - 1) * (ih / (1 / mat.d))
				// const horizontal_move_limit = iw/2;
				// const vertical_move_limit = ih/2;

				if (mat.e < 0) {
					mat.e = 0
				} else if (mat.e > horizontal_move_limit) {
					mat.e = horizontal_move_limit
				}

				if (mat.f < 0) {
					mat.f = 0
				} else if (mat.f > vertical_move_limit) {
					mat.f = vertical_move_limit
				}

				changeMat(mat.clone())
				// changeForceRenderState(Math.random())
			}
			e.preventDefault()
		},
		onMouseDown: (e, specialEvent = {}) => {
			e.preventDefault()

			if (e.button === 1 || (e.button === 0 && dragWithPrimary)) return changeDragging(true)
			const projMouse = mat.applyToPoint(mousePosition.current.x, mousePosition.current.y)
			if (zoomWithPrimary && e.button === 0) {
				changeZoomStart(projMouse)
				changeZoomEnd(projMouse)
				return
			}
			if (zoomOutWithPrimary && e.button === 0) {
				zoomOut()
			}
			if (e.button === 0) {
				if (specialEvent.type === 'resize-box') {
					// onResizeBox()
				}
				if (specialEvent.type === 'move-region') {
					// onResizeBox()
				}
				const { iw, ih } = layoutParams.current
				// onIhIwChange(ih, iw);
				onMouseDown({ x: projMouse.x / iw, y: projMouse.y / ih })
			}
		},
		onMouseUp: (e) => {
			e.preventDefault()
			const projMouse = mat.applyToPoint(mousePosition.current.x, mousePosition.current.y)
			if (zoomStart) {
				const zoomEnd = projMouse
				if (Math.abs(zoomStart.x - zoomEnd.x) < 10 && Math.abs(zoomStart.y - zoomEnd.y) < 10) {
					zoomIn({ to: 0.75 }, mousePosition.current)
					// if (mat.a < 1) {
					//   // zoomIn({ to: 1 }, mousePosition.current)
					// } else {
					//   zoomIn({ to: 0.25 }, mousePosition.current)
					// }
				} else {
					const { iw, ih } = layoutParams.current
					// onIhIwChange(ih, iw);

					if (zoomStart.x > zoomEnd.x) {
						;[zoomStart.x, zoomEnd.x] = [zoomEnd.x, zoomStart.x]
					}
					if (zoomStart.y > zoomEnd.y) {
						;[zoomStart.y, zoomEnd.y] = [zoomEnd.y, zoomStart.y]
					}

					// The region defined by zoomStart and zoomEnd should be the new transform
					let scale = Math.min((zoomEnd.x - zoomStart.x) / iw, (zoomEnd.y - zoomStart.y) / ih)
					if (scale < 0.1) scale = 0.1
					if (scale > 10) scale = 10

					const newMat = getDefaultMat().translate(zoomStart.x, zoomStart.y).scaleU(scale)
					const newMatClone = newMat.clone()
					changeZoomHistory(newMatClone, 'ADD_NEW')
					changeMat(newMatClone)
				}

				changeZoomStart(null)
				changeZoomEnd(null)
			}
			if (e.button === 1 || (e.button === 0 && dragWithPrimary)) return changeDragging(false)
			if (e.button === 0) {
				const { iw, ih } = layoutParams.current
				// onIhIwChange(ih, iw);
				onMouseUp({ x: projMouse.x / iw, y: projMouse.y / ih })
			}
		},
		onWheel: (e) => {
			if (e.ctrlKey) {
				const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
				zoomIn(direction, mousePosition.current)
			} else {
				prevMousePosition.current.x = mousePosition.current.x
				prevMousePosition.current.y = mousePosition.current.y
				mousePosition.current.x = e.deltaX + prevMousePosition.current.x
				mousePosition.current.y = e.deltaY - prevMousePosition.current.y
				mat.translate(e.deltaX, e.deltaY)
				// ((1 / mat.b) - 1) * ih
				// const horizontal_move_limit = iw/2;
				// const horizontal_left_limit = iw/2;
				// const vertical_move_limit = ih/2;
				const horizontal_move_limit = (1 / mat.a - 1) * (iw / (1 / mat.a))
				const vertical_move_limit = (1 / mat.d - 1) * (ih / (1 / mat.d))

				if (mat.e < -10) {
					mat.e = -10
				} else if (mat.e > horizontal_move_limit) {
					mat.e = horizontal_move_limit
				}

				if (mat.f < -10) {
					mat.f = -10
				} else if (mat.f > vertical_move_limit) {
					mat.f = vertical_move_limit
				}

				changeMat(mat.clone())
			}
			e.preventDefault()
		},
	}

	const { iw, ih } = layoutParams.current
	// onIhIwChange(ih, iw);

	let zoomBox = !zoomStart
		? null
		: {
				...mat.clone().inverse().applyToPoint(zoomStart.x, zoomStart.y),
				w: (zoomEnd.x - zoomStart.x) / mat.a,
				h: (zoomEnd.y - zoomStart.y) / mat.d,
		  }
	if (zoomBox) {
		if (zoomBox.w < 0) {
			zoomBox.x += zoomBox.w
			zoomBox.w *= -1
		}
		if (zoomBox.h < 0) {
			zoomBox.y += zoomBox.h
			zoomBox.h *= -1
		}
	}

	const zoomToRegion = (region) => {
		mat = {
			a: 0.1,
			b: 0,
			c: 0,
			d: 0.1,
			e: region.x * iw - 10,
			f: region.y * ih - 10,
		}
		changeMat(mat)
	}

	const onCloseRegion = (region) => {
		changeMat({ a: 1, b: 0, c: 0, d: 1, e: -10, f: -10 })
		onCloseRegionEdit(region)
	}

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				maxHeight: '100vh',
				position: 'relative',
				overflow: 'hidden',
				cursor: createWithPrimary
					? 'crosshair'
					: dragging
					? 'grabbing'
					: dragWithPrimary
					? 'grab'
					: zoomWithPrimary
					? 'zoom-in'
					: zoomOutWithPrimary
					? 'zoom-out'
					: undefined,
			}}
		>
			{showCrosshairs && <Crosshairs mousePosition={mousePosition} />}
			{regions
				.filter((r) => r.visible || r.visible === undefined)
				.filter((r) => !r.locked)
				.map((r, i) => {
					const pbox = projectRegionBox(r)
					const { iw, ih } = layoutParams.current
					// onIhIwChange(ih, iw);
					return (
						<Fragment key={i}>
							<PreventScrollToParents>
								<HighlightBox
									region={r}
									mouseEvents={mouseEvents}
									dragWithPrimary={dragWithPrimary}
									createWithPrimary={createWithPrimary}
									zoomWithPrimary={zoomWithPrimary}
									zoomOutWithPrimary={zoomOutWithPrimary}
									onBeginMovePoint={onBeginMovePoint}
									onSelectRegion={onSelectRegion}
									pbox={pbox}
								/>
								{r.type === 'box' &&
									!dragWithPrimary &&
									!zoomWithPrimary &&
									!zoomOutWithPrimary &&
									!r.locked &&
									r.highlighted &&
									mat.a < 1.2 &&
									[
										[0, 0],
										[0.5, 0],
										[1, 0],
										[1, 0.5],
										[1, 1],
										[0.5, 1],
										[0, 1],
										[0, 0.5],
										[0.5, 0.5],
									].map(([px, py], i) => (
										<div
											key={i}
											className={classes.transformGrabber}
											{...mouseEvents}
											onMouseDown={(e) => {
												if (e.button === 0)
													return onBeginBoxTransform(r, [px * 2 - 1, py * 2 - 1])
												mouseEvents.onMouseDown(e)
											}}
											style={{
												left: pbox.x - 4 - 2 + pbox.w * px,
												top: pbox.y - 4 - 2 + pbox.h * py,
												cursor: boxCursorMap[py * 2][px * 2],
												borderRadius: px === 0.5 && py === 0.5 ? 4 : undefined,
											}}
										/>
									))}
								{r.type === 'circle' &&
									!dragWithPrimary &&
									!zoomWithPrimary &&
									!zoomOutWithPrimary &&
									!r.locked &&
									r.highlighted &&
									[
										[r.x, r.y],
										[
											(r.x * iw +
												Math.sqrt(
													Math.pow((r.xr - r.x) * iw, 2) + Math.pow((r.yr - r.y) * ih, 2)
												)) /
												iw,
											r.y,
										],
										[
											r.x,
											(r.y * ih +
												Math.sqrt(
													Math.pow((r.xr - r.x) * iw, 2) + Math.pow((r.yr - r.y) * ih, 2)
												)) /
												ih,
										],
										[
											(r.x * iw -
												Math.sqrt(
													Math.pow((r.xr - r.x) * iw, 2) + Math.pow((r.yr - r.y) * ih, 2)
												)) /
												iw,
											r.y,
										],
										[
											r.x,
											(r.y * ih -
												Math.sqrt(
													Math.pow((r.xr - r.x) * iw, 2) + Math.pow((r.yr - r.y) * ih, 2)
												)) /
												ih,
										],
									].map(([px, py], i) => {
										const proj = mat
											.clone()
											.inverse()
											.applyToPoint(px * iw, py * ih)
										return (
											<div
												key={i}
												className={classes.transformGrabber}
												{...mouseEvents}
												onMouseDown={(e) => {
													if (e.button === 0 && i == 0) {
														return onBeginCircleTransform(r, 'MOVE_REGION')
													} else if (e.button === 0 && i != 0) {
														return onBeginCircleTransform(r, 'RESIZE_CIRCLE')
													}
													mouseEvents.onMouseDown(e)
												}}
												style={{
													left: proj.x - 4,
													top: proj.y - 4,
													borderRadius: px === r.x && py === r.y ? 4 : undefined,
												}}
											/>
										)
									})}
								{r.type === 'polygon' &&
									!dragWithPrimary &&
									!zoomWithPrimary &&
									!zoomOutWithPrimary &&
									!r.locked &&
									r.highlighted &&
									r.points.map(([px, py], i) => {
										const proj = mat
											.clone()
											.inverse()
											.applyToPoint(px * iw, py * ih)
										return (
											<div
												key={i}
												{...mouseEvents}
												onMouseDown={(e) => {
													if (e.button === 0 && (!r.open || i === 0))
														return onBeginMovePolygonPoint(r, i)
													mouseEvents.onMouseDown(e)
												}}
												className={classes.transformGrabber}
												style={{
													cursor: !r.open ? 'move' : i === 0 ? 'pointer' : undefined,
													pointerEvents:
														r.open && i === r.points.length - 1 ? 'none' : undefined,
													left: proj.x - 4,
													top: proj.y - 4,
												}}
											/>
										)
									})}
								{r.type === 'polygon' &&
									r.highlighted &&
									!dragWithPrimary &&
									!zoomWithPrimary &&
									!zoomOutWithPrimary &&
									!r.locked &&
									!r.open &&
									r.points.length > 1 &&
									r.points
										.map((p1, i) => [p1, r.points[(i + 1) % r.points.length]])
										.map(([p1, p2]) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2])
										.map((pa, i) => {
											const proj = mat
												.clone()
												.inverse()
												.applyToPoint(pa[0] * iw, pa[1] * ih)
											return (
												<div
													key={i}
													{...mouseEvents}
													onMouseDown={(e) => {
														if (e.button === 0) return onAddPolygonPoint(r, pa, i + 1)
														mouseEvents.onMouseDown(e)
													}}
													className={classes.transformGrabber}
													style={{
														cursor: 'copy',
														left: proj.x - 4,
														top: proj.y - 4,
														border: '2px dotted #fff',
														opacity: 0.5,
													}}
												/>
											)
										})}
							</PreventScrollToParents>
						</Fragment>
					)
				})}
			{showTags &&
				regions
					.filter((r) => r.visible || r.visible === undefined)
					.map((region, index) => {
						const pbox = projectRegionBox(region)
						const { iw, ih } = layoutParams.current
						onIhIwChange(ih, iw)
						let margin = 8
						if (region.highlighted && region.type === 'box') margin += 6
						const labelBoxHeight = region.editingLabels && !region.locked ? 280 : region.tags ? 60 : 50
						const labelBoxWidth = region.editingLabels && !region.locked ? 180 : region.tags ? 60 : 50
						const displayOnTop = pbox.y > labelBoxHeight
						const displayOnLeft = pbox.x > labelBoxWidth
						const coords = displayOnTop
							? {
									left: pbox.x ? pbox.x : 0,
									top: pbox.y ? pbox.y - margin / 2 : 0,
							  }
							: { left: pbox.x ? pbox.x : 0, top: pbox.y && pbox.h ? pbox.y + pbox.h + margin / 2 : 0 }
						if (region.locked) {
							return (
								<div
									style={{
										position: 'absolute',
										...coords,
										zIndex: 10 + (region.editingLabels ? 5 : 0),
									}}
								>
									<Paper
										style={{
											position: 'absolute',
											left: 0,
											...(displayOnTop ? { bottom: 0 } : { top: 0 }),
											zIndex: 10,
											backgroundColor: '#fff',
											borderRadius: 4,
											padding: 2,
											paddingBottom: 0,
											opacity: 0.5,
											pointerEvents: 'none',
										}}
									>
										<LockIcon style={{ width: 16, height: 16, color: '#333' }} />
									</Paper>
								</div>
							)
						}
						// if (!region.showTags) {
						// 	return
						// }
						return (
							<div
								key={index}
								style={{
									position: 'absolute',
									...coords,
									zIndex: 10 + (region.editingLabels ? 5 : 0),
									width: 200,
								}}
								onMouseDown={(e) => e.preventDefault()}
								onMouseUp={(e) => e.preventDefault()}
								onMouseEnter={(e) => {
									if (region.editingLabels) {
										mouseEvents.onMouseUp(e)
										e.button = 1
										mouseEvents.onMouseUp(e)
									}
								}}
							>
								<div
									style={{
										position: 'absolute',
										...(displayOnLeft
											? pbox.w > 180
												? { left: 0 }
												: { right: Math.abs(pbox.w - 180) + 20 }
											: { left: 0 }),
										...(displayOnTop ? { bottom: 0 } : { top: 0 }),
									}}
								>
									<RegionLabel
										allowedClasses={regionClsList}
										allowedTags={regionTagList}
										onOpen={onBeginRegionEdit}
										onChange={onChangeRegion}
										onClose={onCloseRegion}
										onDelete={onDeleteRegion}
										editing={region.editingLabels}
										region={region}
										isEditingLocked={region.locked}
										zoomToRegion={zoomToRegion}
									/>
								</div>
							</div>
						)
					})}

			{zoomWithPrimary && zoomOutWithPrimary && zoomBox !== null && (
				<div
					style={{
						position: 'absolute',
						border: '1px solid #fff',
						pointerEvents: 'none',
						left: zoomBox.x,
						top: zoomBox.y,
						width: zoomBox.w,
						height: zoomBox.h,
					}}
				/>
			)}
			{showPointDistances && (
				<svg
					className={classes.pointDistanceIndicator}
					style={{
						pointerEvents: 'none',
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
						height: '100%',
					}}
				>
					{regions
						.filter((r1) => r1.type === 'point')
						.flatMap((r1, i1) =>
							regions
								.filter((r2, i2) => i2 > i1)
								.filter((r2) => r2.type === 'point')
								.map((r2) => {
									const pr1 = projectRegionBox(r1)
									const pr2 = projectRegionBox(r2)
									const prm = {
										x: (pr1.x + pr1.w / 2 + pr2.x + pr2.w / 2) / 2,
										y: (pr1.y + pr1.h / 2 + pr2.y + pr2.h / 2) / 2,
									}
									let displayDistance
									if (realSize) {
										const { w, h, unitName } = realSize
										displayDistance =
											Math.sqrt(
												Math.pow(r1.x * w - r2.x * w, 2) + Math.pow(r1.y * h - r2.y * h, 2)
											).toFixed(pointDistancePrecision) + unitName
									} else {
										displayDistance =
											(
												Math.sqrt(Math.pow(r1.x - r2.x, 2) + Math.pow(r1.y - r2.y, 2)) * 100
											).toFixed(pointDistancePrecision) + '%'
									}
									return (
										<Fragment>
											<path
												d={`M${pr1.x + pr1.w / 2},${pr1.y + pr1.h / 2} L${pr2.x + pr2.w / 2},${
													pr2.y + pr2.h / 2
												}`}
											/>
											<text x={prm.x} y={prm.y}>
												{displayDistance}
											</text>
										</Fragment>
									)
								})
						)}
				</svg>
			)}
			<PreventScrollToParents style={{ width: '100%', height: '100%' }} {...mouseEvents}>
				<canvas className={classes.canvas} ref={canvasEl} />
			</PreventScrollToParents>
			<div className={classes.zoomIndicator}>{((1 / mat.a) * 100).toFixed(0)}%</div>
		</div>
		// </div>
	)
}
