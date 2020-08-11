// @flow

import React, { useEffect, useState, useCallback } from 'react'
import Annotator from '../Annotator'
import { Row } from 'reactstrap'
import cloneDeep from 'lodash/cloneDeep'
import RightSidebar from '../ReactAnnotator/components/RightSidebar'
import LeftSideBar from '../ReactAnnotator/components/LeftSidebar'
import AppBar from './components/Appbar'
import Test1 from '../assets/images/reviewScreen/testImg/test1.bmp'
import Test2 from '../assets/images/reviewScreen/testImg/test2.bmp'
import Test3 from '../assets/images/reviewScreen/testImg/test3.bmp'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label, Input } from 'reactstrap'
import DropDownIcon from '../assets/images/reviewScreen/dropdown.svg'

const data = [
	{
		src: Test1,
		name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp',
	},
	{
		src: Test2,
		name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp',
	},
	{
		src: Test3,
		name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp',
	},
]

export default (props: any) => {
	const inferenceData = {
		data: [],
	}

	const [scale, setScale] = useState(100)
	const [activeImg, setActiveImg] = useState(0)

	const handleClick = useCallback((index) => {
		setActiveImg(index)
	}, [])

	const [currentMat, setMat] = useState({ a: 1, b: 0, c: 0, d: 1, e: -10, f: -10 })
	const [ih, changeIh] = useState(0)
	const [iw, changeIw] = useState(0)
	const [showTags, toggleShowTags] = useState(true)
	// const [imageBefore, setImageBefore] = useState('')
	const [imageAfter, setImageAfter] = useState('')

	// useEffect(() => {
	// 	if (defaultData) {
	// 		defaultData.org_files.forEach((item) => {
	// 			let src = item.resized_file ? item.resized_file : item.file
	// 			if (item.is_primary) setImageAfter(src)
	// 			// else setImageBefore(src)
	// 		})
	// 	}
	// }, [defaultData])
	// const getRandomColor = () => {
	// 	var letters = '0123456789ABCDEF'
	// 	var color = '#'
	// 	for (var i = 0; i < 6; i++) {
	// 		color += letters[Math.floor(Math.random() * 16)]
	// 	}
	// 	return color
	// }
	const getRegions = useCallback(() => {
		let data = inferenceData.data
		const regions = []
		for (let i = 0; i < data.length; i++) {
			let region = {
				type: 'box',
				x: data[i]['extra_model_output']['bounding_box']['xmin'],
				y: data[i]['extra_model_output']['bounding_box']['ymin'],
				w:
					data[i]['extra_model_output']['bounding_box']['xmax'] -
					data[i]['extra_model_output']['bounding_box']['xmin'],
				h:
					data[i]['extra_model_output']['bounding_box']['ymax'] -
					data[i]['extra_model_output']['bounding_box']['ymin'],
				id: i.toString(),
				color: 'black',
				locked: true,
				cls: data[i]['predicted_defect']['name'],
				showTags: false,
				tags: [
					'x: ' + data[i]['extra_model_output']['x']['value'].toString(),
					'y: ' + data[i]['extra_model_output']['y']['value'].toString(),
					'area: ' + data[i]['extra_model_output']['area']['value'].toString(),
				],
			}
			regions.push(region)
		}
		return regions
	}, [inferenceData])

	const [afterSawingImages, setAfterSawingImages] = useState([])

	// useEffect(() => {
	// 	if (defaultData) {
	// 		let primaryFile = ''
	// 		defaultData.org_files.forEach((item) => {
	// 			if (item.is_primary) primaryFile = item
	// 		})
	// 		setAfterSawingImages([
	// 			{
	// 				src: primaryFile.resized_file
	// 					? `${BACKEND_URL}${primaryFile.resized_file}`
	// 					: `${BACKEND_URL}${primaryFile.file}`,
	// 				name: primaryFile.name,
	// 				regions: getRegions(),
	// 			},
	// 		])
	// 	}
	// }, [defaultData, getRegions])

	const toggleRegionTags = (image_index, region_index) => {
		let tempAfterSawingImages = cloneDeep(afterSawingImages) //[ ...afterSawingImages ]  //afterSawingImages.slice() //Object.assign({},afterSawingImages);
		for (let i = 0; i < tempAfterSawingImages[image_index]['regions'].length; i++) {
			if (i !== region_index) {
				tempAfterSawingImages[image_index]['regions'][i]['showTags'] = false
				tempAfterSawingImages[image_index]['regions'][i]['color'] = 'black'
				tempAfterSawingImages[image_index]['regions'][i]['zIndex'] = 1
			} else {
				tempAfterSawingImages[image_index]['regions'][i]['showTags'] = !tempAfterSawingImages[image_index][
					'regions'
				][i]['showTags']
				if (tempAfterSawingImages[image_index]['regions'][i]['showTags']) {
					tempAfterSawingImages[image_index]['regions'][i]['color'] = 'red'
					tempAfterSawingImages[image_index]['regions'][i]['zIndex'] = 10
				} else {
					tempAfterSawingImages[image_index]['regions'][i]['color'] = 'black'
					tempAfterSawingImages[image_index]['regions'][i]['zIndex'] = 1
				}
			}
		}
		setAfterSawingImages(tempAfterSawingImages)
	}

	const changeMat = (mat) => {
		setMat(mat)
		setScale(((1 / mat.a) * 100).toFixed(0))
	}
	const moveToPoint = (box) => {
		changeMat({
			a: 0.1,
			b: 0,
			c: 0,
			d: 0.1,
			e: box['xmin'] * iw - 10,
			f: box['ymin'] * ih - 10,
		})
		// toggleShowTags(true)
		// setScale(1000);
	}
	const handleScaleChange = (value) => {
		// setScale(value)
		let newMat = {
			a: 100 / value,
			b: currentMat['b'],
			c: currentMat['c'],
			d: 100 / value,
			e: currentMat['e'],
			f: currentMat['f'],
		}
		const horizontal_move_limit = (1 / newMat.a - 1) * (iw / (1 / newMat.a))
		const vertical_move_limit = (1 / newMat.d - 1) * (ih / (1 / newMat.d))

		if (newMat.e < -10) {
			newMat.e = -10
		} else if (newMat.e > horizontal_move_limit) {
			newMat.e = horizontal_move_limit
		}

		if (newMat.f < -10) {
			newMat.f = -10
		} else if (newMat.f > vertical_move_limit) {
			newMat.f = vertical_move_limit
		}
		changeMat(newMat)
	}
	const onIhIwChange = (ih, iw) => {
		changeIh(ih)
		changeIw(iw)
	}

	const [selectedTool, setSelectedTool] = useState('pan')
	const handleToolChange = (tool) => {
		setSelectedTool(tool)
	}

	const [dropdownOpen, setDropdownOpen] = useState(false)
	const toggle = () => setDropdownOpen((prevState) => !prevState)

	const [regions, setRegions] = useState([])
	useEffect(() => {
		let data = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					id: 3,
					file_set: 174,
					ml_model: 1,
					defects: [1, 2],
					file_labels: [
						{
							id: 2,
							file: 175,
							file_set_label: 3,
							is_user_feedback: false,
							label: {
								defects: [
									{
										defect_id: 1,
										region_id: 'uuid-1',
										coordinates: { x_max: 0.3, x_min: 0.1, y_max: 0.5, y_min: 0.2 },
									},
								],
							},
							created_by: 3,
							created_ts: '2020-08-11T07:40:23.099104Z',
							updated_by: 3,
							updated_ts: '2020-08-11T09:35:18.226756Z',
						},
					],
					created_by: 3,
					created_ts: '2020-08-11T07:36:47.775962Z',
					updated_by: 3,
					updated_ts: '2020-08-11T07:36:47.776008Z',
				},
			],
		}
		if (data) {
			console.log('ReviewData -> data', data)
			const { results } = data
			console.log('ReviewData -> results', results)
			const regions = []
			for (let i = 0; i < results.length; i++) {
				const { file_labels } = results[i]
				console.log('ReviewData -> file_labels', file_labels)
				file_labels.forEach((fileLabel) => {
					const { defects } = fileLabel.label
					defects.forEach((defect) => {
						console.log('ReviewData -> defect', defect)
						const { coordinates } = defect
						console.log('coordinates', coordinates)
						const region = {
							type: 'box',
							x: coordinates.x_min,
							y: coordinates.y_min,
							w: coordinates.x_max - coordinates.x_min,
							h: coordinates.x_max - coordinates.y_min,
							id: i.toString(),
							locked: true,
							visible: true,
							color: '#ff0',
						}
						regions.push(region)
						console.log('region', region)
					})
				})
			}
			setRegions(regions)
			console.log('regions', regions)
		}
	}, [data])
	const handleRegionChange = ({ X, Y, width, height }) => {
		console.log(X, Y, width, height)
	}

	return (
		<div
			className="m-0 p-0"
			style={{
				overflow: 'hidden',
			}}
		>
			<Row style={{ backgroundColor: '#02435D' }} className="p-3">
				<AppBar
					showTags={showTags}
					onClickTool={handleToolChange}
					scale={parseInt(scale)}
					setScale={handleScaleChange}
					imgNavigation={setActiveImg}
					activeImg={activeImg}
					dataLength={data.length}
				/>
			</Row>
			<div className="d-flex">
				<LeftSideBar onClick={handleClick} active={activeImg} data={data} />
				<div
					id="ImageDisplay"
					style={{
						backgroundColor: '#E5E5E5',
						width: '800px',
					}}
				>
					<div className="m-3">
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
						<Annotator
							{...props}
							selectedTool={selectedTool}
							showTags={showTags}
							taskDescription="Draw region around the defects"
							onImagesChange={setAfterSawingImages}
							images={data}
							selectedImage={data[activeImg].src}
							currentMat={currentMat}
							changeMat={changeMat}
							handleScaleChange={handleScaleChange}
							regions={regions}
							handleRegionChange={handleRegionChange}
						/>
					</div>
				</div>
				<RightSidebar />
			</div>
		</div>
	)
}
