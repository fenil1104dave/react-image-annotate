// @flow

import React, { useReducer, useEffect } from "react"
import MainLayout from "../MainLayout"
import type {
  ToolEnum,
  Image,
  Mode,
  MainLayoutState,
  Action
} from "../MainLayout/types"
import SettingsProvider from "../SettingsProvider"
import reducer from "./reducer"
import {Matrix} from "transformation-matrix-js";

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
  onExit: MainLayoutState => any
}

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, -10, -10)

export default ({
  images,
  onImagesChange = () => {},
  allowedArea,
  selectedImage = images.length > 0 ? images[0].src : undefined,
  showPointDistances,
  pointDistancePrecision,
  selectedTool="select",
  showTags = true,
  enabledTools = ["select", "create-point", "create-box", "create-polygon", "create-circle"],
  regionTagList = [],
  regionClsList = [],
  imageTagList = [],
  imageClsList = [],
  taskDescription,
  currentMat = getDefaultMat(),
  changeMat,
  onIhIwChange = () => {},
  onExit,
  setImageLoaded = () =>{},
	handleScaleChange=()=>{}
}: Props) => {

  const [state, dispatchToReducer] = useReducer(reducer, {
    showTags,
    allowedArea,
    selectedImage,
    showPointDistances,
    pointDistancePrecision,
    // selectedTool,
    selectedTool: "create-polygon",
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
		handleScaleChange
  })

  useEffect(() => {
    dispatchToReducer({type: "SELECT_TOOL", selectedTool: selectedTool})
  }, [selectedTool]);

  useEffect(() => {
    if(showTags !== state.showTags) {
      dispatchToReducer({type: "SELECT_TOOL", selectedTool: "show-tags"})
    }
  }, [showTags]);

  useEffect(() => {
    dispatchToReducer({type: "CHANGE_IMAGES", images: images})
  }, [JSON.stringify(images)]);

  useEffect(() => {
    dispatchToReducer({type: "SELECT_IMAGE", image: {src: selectedImage}})
  }, [selectedImage]);

  useEffect(() => {
    dispatchToReducer({type: "CHANGE_CURRENT_MAT", currentMat: currentMat})
  }, [JSON.stringify(currentMat)]);

  
  const dispatch = (action: Action) => {
    if (
      action.type === "HEADER_BUTTON_CLICKED" &&
      (action.buttonName === "Exit" ||
        action.buttonName === "Done" ||
        action.buttonName === "Save" ||
        action.buttonName === "Complete")
    ) {
      onExit({ ...state, history: undefined })
    } else {
      dispatchToReducer(action)
    }
  }

  return (
    <SettingsProvider>
      <MainLayout debug state={state} dispatch={dispatch} />
    </SettingsProvider>
  )
}
