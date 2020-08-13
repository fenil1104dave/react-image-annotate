// @flow

import React, { useEffect, useState } from 'react'
import ImageCanvas from '../ImageCanvas'

import useKey from 'use-key-hook'
import { useSettings } from '../SettingsProvider'
import { Matrix } from 'transformation-matrix-js'

export default ({ state, dispatch, regions }: Props) => {
	const settings = useSettings()

	const action = (type: string, ...params: Array<string>) => (...args: any) =>
		params.length > 0
			? dispatch(
					({
						type,
						...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
					}: any)
			  )
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

	useEffect(() => {
		state.setCurrentRegions(currentImage && currentImage.regions ? currentImage.regions : [])
	}, [currentImage])

	const currentRegions = currentImage && currentImage.regions ? currentImage.regions : []
	return (
		<div style={{ width: '760px', height: '700px' }} className="m-3 px-2">
			<ImageCanvas
				{...settings}
				key={state.selectedImage}
				showTags={state.showTags}
				allowedArea={state.allowedArea}
				regionClsList={state.regionClsList}
				regionTagList={state.regionTagList}
				regions={[...currentRegions, ...regions]}
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
		</div>
	)
}
