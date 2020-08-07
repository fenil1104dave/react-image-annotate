// @flow

import React, { useEffect, useState, useCallback } from 'react'
import Annotator from '../Annotator'
import { Row } from 'reactstrap'
import cloneDeep from 'lodash/cloneDeep'
import RightSidebar from '../ReactAnnotator/components/RightSidebar'
import LeftSideBar from '../ReactAnnotator/components/LeftSidebar'
import AppBar from './components/Appbar'
import useNativeLazyLoading from '@charlietango/use-native-lazy-loading'
import { useInView } from 'react-intersection-observer'
import Test1 from '../assets/images/reviewScreen/testImg/test1.bmp'
import Test2 from '../assets/images/reviewScreen/testImg/test2.bmp'
import Test3 from '../assets/images/reviewScreen/testImg/test3.bmp'

const data = [
	{
		img: Test1,
		name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp',
	},
	{
		img: Test2,
		name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp',
	},
	{
		img: Test3,
		name: '84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp',
	},
]

export default (props: any) => {
	const inferenceData = {
		data: [],
	}

	const [scale, setScale] = useState(100)
	const [activeImg, setActiveImg] = useState(1)

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
	const [image2Loaded, setImage2Loaded] = useState(false)
	const onIhIwChange = (ih, iw) => {
		changeIh(ih)
		changeIw(iw)
	}

	const supportsLazyLoading = useNativeLazyLoading()
	const [ref, inView] = useInView({
		triggerOnce: true,
		rootMargin: '200px 0px',
	})
	useEffect(() => {
		const parentEle = document.getElementById('ImageDisplay')
		const ele = document.getElementById(activeImg)
		parentEle.scrollTo({
			top: ele.offsetTop,
			behavior: 'smooth',
		})
	})

	const handleScroll = (event) => {
		const parentEle = document.getElementById('ImageDisplay')
		const activeImg = Math.ceil(
			(event.target.scrollTop + window.innerHeight / 2) / (parentEle.scrollHeight / data.length)
		)
	}
	return (
		<div
			className="m-0 p-0"
			style={{
				overflow: 'hidden',
			}}
		>
			<Row style={{ backgroundColor: '#02435D' }} className="p-3">
				<AppBar />
			</Row>
			<div className="d-flex" style={{ height: window.innerHeight }}>
				<LeftSideBar onClick={handleClick} active={activeImg} data={data} />
				<div
					ref={!supportsLazyLoading ? ref : undefined}
					//data-inview={inView}
					onScroll={handleScroll}
					id="ImageDisplay"
					style={{
						backgroundColor: '#E5E5E5',
						overflow: 'scroll',
					}}
				>
					{data.map(({ img, name }, index) => (
						<div key={index} className="m-3" id={index + 1}>
							<div className="px-3 py-2" style={{ color: '#02435D', opacity: 0.5 }}>
								{name}
							</div>
							{inView || supportsLazyLoading ? (
								<Annotator
									{...props}
									selectedTool="pan"
									showTags={showTags}
									selectedImage={img} //"https://image.shutterstock.com/image-photo/beautiful-landscape-mountain-layer-morning-600w-753385105.jpg"
									taskDescription="Draw region around the defects"
									images={afterSawingImages}
									onImagesChange={setAfterSawingImages}
									setImageLoaded={setImage2Loaded}
									// images={[
									// 	{
									// 		src: `${BACKEND_URL}${img2}`,
									// 		name: img2,
									// 		regions: this.state.regions,
									// 	},
									// ]}
									// images={[{ src: data.viaKey, name: name }]}
									// regionClsList={["Man Face", "Woman Face"]}
									// onExit={handleVIAEditor}
									currentMat={currentMat}
									changeMat={changeMat}
									handleScaleChange={handleScaleChange}
								/>
							) : null}
						</div>
					))}
				</div>

				<RightSidebar />
			</div>
		</div>
	)
}
