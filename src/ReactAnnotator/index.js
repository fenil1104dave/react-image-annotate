// @flow

import React,{useEffect,useState,useCallback} from "react"
import Annotator from "../Annotator"
import Theme from "../Theme"
import {defaultData} from '../Annotator/data'
import cloneDeep from 'lodash/cloneDeep'
																			const BACKEND_URL = 'https://stm-api.sixsense.ai'

export default (props: any) => {
  const inferenceData = {
	  data:[]
  }
  
	const [scale, setScale] = useState(100)

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
  
  const img2 = 'https://image.shutterstock.com/image-photo/beautiful-landscape-mountain-layer-morning-600w-753385105.jpg'
  return (
    <Theme>
      <Annotator {...props} selectedTool="pan"
				showTags={showTags}
				selectedImage={img2} //"https://image.shutterstock.com/image-photo/beautiful-landscape-mountain-layer-morning-600w-753385105.jpg"
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
				handleScaleChange={handleScaleChange} />
    </Theme>
  )
}


