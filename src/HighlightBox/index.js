// @flow

import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	'@keyframes borderDance': {
		from: { strokeDashoffset: 0 },
		to: { strokeDashoffset: 100 },
	},
	highlightBox: {
		transition: 'opacity 500ms',
		'&:not(.highlighted)': {
			opacity: 0,
		},
		'&:not(.highlighted):hover': {
			opacity: 0.6,
		},
		'& path': {
			vectorEffect: 'non-scaling-stroke',
			strokeWidth: 2,
			stroke: '#FFF',
			fill: 'none',
			strokeDasharray: 5,
			animationName: '$borderDance',
			animationDuration: '4s',
			animationTimingFunction: 'linear',
			animationIterationCount: 'infinite',
			animationPlayState: 'running',
		},
	},
})

export default ({
	mouseEvents,
	dragWithPrimary,
	zoomWithPrimary,
	zoomOutWithPrimary,
	createWithPrimary,
	onBeginMovePoint,
	onSelectRegion,
	region: r,
	pbox,
}: {
	mouseEvents: any,
	dragWithPrimary: boolean,
	zoomWithPrimary: boolean,
	zoomOutWithPrimary: boolean,
	createWithPrimary: boolean,
	onBeginMovePoint: Function,
	onSelectRegion: Function,
	region: any,
	pbox: { x: number, y: number, w: number, h: number },
}) => {
	const classes = useStyles()
	return (
		<svg
			key={r.id}
			className={classnames(classes.highlightBox, {
				highlighted: r.highlighted,
			})}
			{...mouseEvents}
			{...(!zoomWithPrimary && !zoomOutWithPrimary && !dragWithPrimary
				? {
						onMouseDown: e => {
							if (!r.locked && r.type === 'point' && r.highlighted && e.button === 0) {
								return onBeginMovePoint(r)
							}
							if (e.button === 0 && !createWithPrimary) return onSelectRegion(r)
							mouseEvents.onMouseDown(e)
						},
				  }
				: {})}
			style={{
				...(r.highlighted
					? {
							pointerEvents: r.type !== 'point' ? 'none' : undefined,
							cursor: 'grab',
					  }
					: {
							cursor: !(zoomWithPrimary || zoomOutWithPrimary || dragWithPrimary || createWithPrimary)
								? 'pointer'
								: undefined,
							pointerEvents:
								zoomWithPrimary ||
								zoomOutWithPrimary ||
								dragWithPrimary ||
								(createWithPrimary && !r.highlighted)
									? 'none'
									: undefined,
					  }),
				position: 'absolute',
				left: pbox.x - 5 ? pbox.x - 5 : 0,
				top: pbox.y - 5 ? pbox.y - 5 : 0,
				width: pbox.w + 10 ? pbox.w + 10 : 0,
				height: pbox.h + 10 ? pbox.h + 10 : 0,
			}}
		>
			<path
				d={`M5,5 L${pbox.w ? pbox.w + 5 : 0},5 L${pbox.w ? pbox.w + 5 : 0},${pbox.h ? pbox.h + 5 : 0} L5,${
					pbox.h ? pbox.h + 5 : 0
				} Z`}
			/>
		</svg>
	)
}
