// @flow

import React, { useReducer, useEffect, useState } from 'react'
import MainLayout from '../MainLayout'
import type { ToolEnum, Image, Mode, MainLayoutState, Action } from '../MainLayout/types'
import SettingsProvider from '../SettingsProvider'
import RightSidebar from './components/RightSidebar'
import LeftSideBar from './components/LeftSidebar'
import AppBar from './components/Appbar'
import reducer from './reducer'
import { Matrix } from 'transformation-matrix-js'
import { Row } from 'reactstrap'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label, Input } from 'reactstrap'
import DropDownIcon from '../assets/images/reviewScreen/dropdown.svg'

type Props = {
	taskDescription: string,
	allowedArea?: { x: number, y: number, w: number, h: number },
	regionTagList?: Array<string>,
	regionClsList?: Array<string>,
	imageTagList?: Array<string>,
	imageClsList?: Array<string>,
	enabledTools?: Array<string>,
	showTags?: boolean,
	selectedImage?: string,
	images: Array<Image>,
	showPointDistances?: boolean,
	pointDistancePrecision?: number,
	onExit: (MainLayoutState) => any,
}

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, -10, -10)

export default ({
	images,
	onImagesChange = () => {},
	allowedArea,
	selectedImage = images.length > 0 ? images[0].src : undefined,
	showPointDistances,
	pointDistancePrecision,
	selectedTool = 'select',
	showTags = true,
	enabledTools = ['create-box'],
	regionTagList = [],
	regionClsList = [],
	imageTagList = [],
	imageClsList = [],
	taskDescription,
	currentMat = getDefaultMat(),
	changeMat,
	onIhIwChange = () => {},
	onExit,
	setImageLoaded = () => {},
	handleScaleChange = () => {},
	scale,
	handleClick,
	activeImg,
}: Props) => {
	const [state, dispatchToReducer] = useReducer(reducer, {
		showTags,
		allowedArea,
		selectedImage,
		showPointDistances,
		pointDistancePrecision,
		// selectedTool,
		selectedTool: 'create-polygon',
		mode: null,
		taskDescription,
		images,
		onImagesChange,
		labelImages: imageClsList.length > 0 || imageTagList.length > 0,
		regionClsList,
		regionTagList,
		imageClsList,
		imageTagList,
		currentMat,
		changeMat,
		onIhIwChange,
		enabledTools,
		history: [],
		setImageLoaded,
		handleScaleChange,
	})

	useEffect(() => {
		dispatchToReducer({ type: 'SELECT_TOOL', selectedTool: selectedTool })
	}, [selectedTool])

	useEffect(() => {
		if (showTags !== state.showTags) {
			dispatchToReducer({ type: 'SELECT_TOOL', selectedTool: 'show-tags' })
		}
	}, [showTags])

	useEffect(() => {
		dispatchToReducer({ type: 'CHANGE_IMAGES', images: images })
	}, [JSON.stringify(images)])

	useEffect(() => {
		dispatchToReducer({ type: 'SELECT_IMAGE', image: { src: selectedImage } })
	}, [selectedImage])

	useEffect(() => {
		dispatchToReducer({ type: 'CHANGE_CURRENT_MAT', currentMat: currentMat })
	}, [JSON.stringify(currentMat)])

	useEffect(() => {
		const parentEle = document.getElementById('ImageDisplay')
		const ele = document.getElementById(activeImg)
		parentEle.scrollTo({
			top: ele.offsetTop - 60,
			behavior: 'smooth',
		})
	})

	const handleScroll = (event) => {
		const parentEle = document.getElementById('ImageDisplay')
		const activeImg = Math.ceil(
			(event.target.scrollTop + window.innerHeight / 2) / (parentEle.scrollHeight / images.length)
		)
	}

	const dispatch = (action: Action) => {
		if (
			action.type === 'HEADER_BUTTON_CLICKED' &&
			(action.buttonName === 'Exit' ||
				action.buttonName === 'Done' ||
				action.buttonName === 'Save' ||
				action.buttonName === 'Complete')
		) {
		} else {
			dispatchToReducer(action)
		}
	}

	const handleImageChange = (index) => {
		dispatchToReducer({ type: 'SELECT_IMAGE', image: { src: images[index].src } })
		handleClick(index)
	}
	const action = (type: string, ...params: Array<string>) => (...args: any) =>
		params.length > 0
			? dispatch(
					({
						type,
						...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
					}: any)
			  )
			: dispatch({ type, ...args[0] })
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const toggle = () => setDropdownOpen((prevState) => !prevState)

	return (
		<SettingsProvider>
			<div
				className="m-0 p-0"
				style={{
					overflow: 'hidden',
				}}
			>
				<Row style={{ backgroundColor: '#02435D' }} className="p-3">
					<AppBar
						enabledTools={state.enabledTools}
						showTags={state.showTags}
						selectedTool={state.selectedTool}
						onClickTool={action('SELECT_TOOL', 'selectedTool')}
						scale={parseInt(scale)}
						setScale={handleScaleChange}
					/>
				</Row>
				<div className="d-flex" style={{ height: window.innerHeight }}>
					<LeftSideBar
						onClick={handleImageChange}
						onClickTool={action('SELECT_TOOL', 'selectedTool')}
						active={selectedImage}
						data={images}
					/>
					<div
						onScroll={handleScroll}
						id="ImageDisplay"
						style={{
							backgroundColor: '#E5E5E5',
							overflowY: 'scroll',
							width: '800px',
						}}
					>
						<div
							className="px-3 py-2 d-flex"
							//  style={{ color: '#02435D', opacity: 0.5 }}
						>
							{/* {currentImage.name} */}
							<Dropdown className="mx-3" isOpen={dropdownOpen} toggle={toggle}>
								<DropdownToggle
									style={{
										width: '100%',
										textAlign: 'left',
										backgroundColor: '#F0F4F6',
										color: '#02435D',
									}}
								>
									<div className="d-flex justify-content-between">
										<span className="mr-3">Select Record Level Tags</span>
										<img src={DropDownIcon} alt="icon" />
									</div>
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem header>Nothing Added yet</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<FormGroup className="mx-3" check>
								<Label check>
									<Input type="checkbox" name="check1" /> Not Sure
								</Label>
							</FormGroup>
							<FormGroup className="mx-3" check>
								<Label check>
									<Input type="checkbox" name="check1" /> No Defect
								</Label>
							</FormGroup>
						</div>
						{state.images.map((img, index) => (
							<MainLayout debug state={state} dispatch={dispatch} img={img} index={index} />
						))}
					</div>
					<RightSidebar />
				</div>
			</div>
		</SettingsProvider>
	)
}
