// @flow

import React, { useEffect, useState } from 'react'
import ImageCanvas from '../ImageCanvas'
import type { MainLayoutState, Action } from './types'
import useKey from 'use-key-hook'
import { useSettings } from '../SettingsProvider'
import { Matrix } from 'transformation-matrix-js'

type Props = {
	state: MainLayoutState,
	dispatch: (Action) => any,
}

export default ({ state, dispatch, index, img }) => {
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
		<div style={{ width: '760px', height: '760px' }} className="m-3 px-2" id={index}>
			{currentImage.name === img.name ? (
				<>
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
					<img style={{ width: '100%', height: '100%' }} src={img.src} alt="" />
				</>
			)}
		</div>
	)
}
