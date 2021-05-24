// @flow

import { grey } from '@material-ui/core/colors'

export default {
	paper: {
		boxShadow: 'none',
		margin: 0,
		'& .MuiAutocomplete-listbox': {
			'& .MuiListSubheader-gutters': {
				paddingLeft: '8px',
				lineHeight: '24px',
				fontSize: '0.875rem',
				color: '#000000',
			},
			'& .MuiAutocomplete-groupUl .MuiAutocomplete-option': {
				paddingLeft: 0,
				display: 'flex',
				alignItems: 'center',
				fontWeight: 400,
			},
		},
	},
	option: {
		minHeight: 'auto',
		alignItems: 'flex-start',
		padding: 0,
		'&[aria-selected="true"]': {
			backgroundColor: 'transparent',
		},
		'&[data-focus="true"]': {
			backgroundColor: 'transparent',
		},
	},
	popperDisablePortal: {
		position: 'relative',
		width: 'auto !important',
		maxHeight: 200,
		overflowY: 'auto',
		'&::-webkit-scrollbar ': {
			width: 3,
		},

		/* Track */
		'&::-webkit-scrollbar-track': {
			borderRadius: 10,
		},

		/* Handle */
		'&::-webkit-scrollbar-thumb': {
			background: '#EEEEEE',
			borderRadius: 10,
		},

		/* Handle on hover */
		'&::-webkit-scrollbar-thumb:hover': {
			background: '#EEEEEE',
		},
	},
	item: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
	},
	popper: {
		zIndex: 100,
	},
	label: {
		fontSize: '0.875rem',
		fontWeight: 400,
		color: '#313131',
	},
	button: {
		borderRadius: '3px',
		fontWeight: 'normal',
		fontSize: '14px',
		lineHeight: 'normal',
		border: '0px',
		color: '#FFFFFF',
		backgroundColor: '#F56C6C',
		padding: '8px 24px',
		'&:hover': {
			backgroundColor: '#E14242',
		},
		'&:disabled': {
			background: '#E0E0E0',
			color: '#000D12',
			opacity: 0.24,
		},
	},
	regionInfo: {
		// cursor: 'default',
		// transition: 'opacity 200ms',
		// '&:hover': {
		// 	cursor: 'pointer',
		// },
		// pointerEvents: "none",
		padding: 8,
		'& .name': {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			'& .circle': {
				marginRight: 4,
				boxShadow: '0px 0px 2px rgba(0,0,0,0.4)',
				width: 10,
				height: 10,
				borderRadius: 5,
			},
		},
		'& .tags': {
			display: 'flex',
			'& .tag': {
				// color: grey[700],
				// display: 'inline-block',
				// margin: 1,
				// fontSize: 10,
				// textDecoration: 'underline',
				backgroundColor: 'rgba(37, 99, 235, 0.8)',
				color: '#FFFFFF',
				borderRadius: '2px',
				display: 'flex',
				alignItems: 'center',
			},
			'& .addIcon': {
				cursor: 'pointer',
			},
		},
	},
	open: {
		minWidth: '175px',
		borderRadius: 0,
		'& .MuiAutocomplete-endAdornment': {
			display: 'none',
		},
	},
	closeBtn: {
		fontSize: '12px',
		cursor: 'pointer',
	},
	inputBase: {
		width: '200px !important',
		'& .MuiOutlinedInput-notchedOutline': {
			border: '1px solid #4F46E5',
			boxShadow: '0px 0px 5px #C7D2FE',
			'&:hover': {
				border: '1px solid #4F46E5',
				boxShadow: '0px 0px 5px #C7D2FE',
			},
		},
	},
	searchIcons: {
		paddingTop: '0px',
		paddingBottom: '0px',
		paddingRight: '0px',
	},
}
