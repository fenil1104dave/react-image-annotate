// @flow

import React, { useEffect, useState } from 'react'
import ImageCanvas from '../ImageCanvas'
import type { MainLayoutState, Action } from './types'
import DropDownIcon from '../assets/images/reviewScreen/dropdown.svg'
import useKey from 'use-key-hook'
import { useSettings } from '../SettingsProvider'
import { Matrix } from 'transformation-matrix-js'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label, Input } from 'reactstrap'

type Props = {
	state: MainLayoutState,
	dispatch: (Action) => any,
}

export default ({ state, dispatch, index, img }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const toggle = () => setDropdownOpen((prevState) => !prevState)
	const settings = useSettings()
	const action = (type, ...params) => (...args) =>
		params.length > 0
			? dispatch({
					type,
					...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
			  })
			: dispatch({ type, ...args[0] })

	const currentImage = state.images.find((img) => img.src === state.selectedImage)

	useKey(() => dispatch({ type: 'CANCEL' }), {
		detectKeys: [27],
	})

	if (state.changeMat === undefined) {
		state.changeMat = (mat) => {
			dispatch({
				type: 'CHANGE_CURRENT_MAT',
				currentMat: mat,
			})
		}
	}

	useEffect(() => {
		state.onImagesChange(state.images)
	}, [JSON.stringify(state.images)])

	return (
		<div style={{ width: '760px' }} className="m-3" id={index}>
			{currentImage.name === img.name ? (
				<>
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
					<ImageCanvas
						{...settings}
						key={state.selectedImage}
						showTags={state.showTags}
						allowedArea={state.allowedArea}
						regionClsList={state.regionClsList}
						regionTagList={state.regionTagList}
						regions={currentImage ? currentImage.regions || [] : []}
						realSize={currentImage ? currentImage.realSize : undefined}
						imageSrc={state.selectedImage}
						pointDistancePrecision={state.pointDistancePrecision}
						createWithPrimary={state.selectedTool.includes('create')}
						dragWithPrimary={state.selectedTool === 'pan'}
						zoomWithPrimary={state.selectedTool === 'zoom'}
						zoomOutWithPrimary={state.selectedTool === 'zoom-out'}
						showPointDistances={state.showPointDistances}
						zoomHistory={state.zoomHistory}
						changeZoomHistory={action('ZOOM_HISTORY', 'region', 'direction')}
						resetZoomHistory={action('RESET_ZOOM_HISTORY')}
						onMouseMove={action('MOUSE_MOVE')}
						onMouseDown={action('MOUSE_DOWN')}
						onMouseUp={action('MOUSE_UP')}
						onChangeRegion={action('CHANGE_REGION', 'region')}
						onBeginRegionEdit={action('OPEN_REGION_EDITOR', 'region')}
						onCloseRegionEdit={action('CLOSE_REGION_EDITOR', 'region')}
						onDeleteRegion={action('DELETE_REGION', 'region')}
						onBeginCircleTransform={action('BEGIN_CIRCLE_TRANSFORM', 'circle', 'directions')}
						onBeginBoxTransform={action('BEGIN_BOX_TRANSFORM', 'box', 'directions')}
						onBeginMovePolygonPoint={action('BEGIN_MOVE_POLYGON_POINT', 'polygon', 'pointIndex')}
						onAddPolygonPoint={action('ADD_POLYGON_POINT', 'polygon', 'point', 'pointIndex')}
						onSelectRegion={action('SELECT_REGION', 'region')}
						onBeginMovePoint={action('BEGIN_MOVE_POINT', 'point')}
						onImageLoaded={action('IMAGE_LOADED', 'image')}
						mat={Matrix.from(state.currentMat)}
						changeMat={state.changeMat}
						onIhIwChange={state.onIhIwChange}
						setImageLoaded={state.setImageLoaded}
						handleScaleChange={state.handleScaleChange}
					/>
				</>
			) : (
				<>
					<div
						className="px-3 py-2 pb-3 d-flex"
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
					<img style={{ width: '100%', height: '100%' }} src={img.src} alt="" />
				</>
			)}
		</div>
	)
}
