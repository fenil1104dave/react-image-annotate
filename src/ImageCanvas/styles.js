import { grey } from '@material-ui/core/colors'

export default {
	canvas: { width: '100%', height: '100%' },
	transformGrabber: {
		width: 8,
		height: 8,
		border: '2px solid #FFF',
		position: 'absolute',
	},
	zoomIndicator: {
		position: 'absolute',
		bottom: 16,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.4)',
		color: '#fff',
		opacity: 0.5,
		fontWeight: 'bolder',
		fontSize: 14,
		padding: 4,
	},
	pointDistanceIndicator: {
		'& text': {
			fill: '#fff',
		},
		'& path': {
			vectorEffect: 'non-scaling-stroke',
			strokeWidth: 2,
			opacity: 0.5,
			stroke: '#FFF',
			fill: 'none',
			strokeDasharray: 5,
			animationDuration: '4s',
			animationTimingFunction: 'linear',
			animationIterationCount: 'infinite',
			animationPlayState: 'running',
		},
	},
	paperBox: {
		padding: '3% 0 3% 7%',
		background: '#A9A9A9',
		borderRadius: '4px',
		width: '105px',
		opacity: 0.7,
	},
	papperBoxFont: {
		fontSize: '11px',
		fontWeight: 500,
		fontFamily: 'Roboto',
		color: '#FFFFFF',
	},
}
