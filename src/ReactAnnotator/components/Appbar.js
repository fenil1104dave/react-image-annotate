import React, { useState } from 'react'
import LeftArrow from '../../assets/images/reviewScreen/arrowLeft.svg'
import RightArrow from '../../assets/images/reviewScreen/arrowRight.svg'
import BookMarkIcon from '../../assets/images/reviewScreen/bookmark.svg'
import MessageIcon from '../../assets/images/reviewScreen/message.svg'
import CloseIcon from '../../assets/images/reviewScreen/close.svg'
import RectangleIcon from '../../assets/images/reviewScreen/rectangle.svg'
import ZoomIn from '../../assets/images/reviewScreen/zoomIn.svg'
import ZoomOut from '../../assets/images/reviewScreen/zoomOut.svg'
import { Col, CustomInput, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

const Appbar = ({ scale, setScale, onClickTool }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const toggle = () => setDropdownOpen((prevState) => !prevState)
	return (
		<>
			<Col className="d-flex" lg={11}>
				<img
					className="pr-3"
					onClick={() => onClickTool('create-box')}
					disabled={false}
					aria-label="Add Bounding Box"
					src={RectangleIcon}
					alt="RectangleIcon"
					style={{
						cursor: 'pointer',
					}}
				/>{' '}
				<img className="px-3" src={LeftArrow} alt="LeftArrow" />
				<img className="px-3" src={RightArrow} alt="RightArrow" />
				<img className="px-3" src={BookMarkIcon} alt="BookMarkIcon" />
				<img className="px-3" src={MessageIcon} alt="MessageIcon" />
				<img
					className="px-3"
					src={ZoomOut}
					alt="ZoomOut"
					style={{
						cursor: 'pointer',
					}}
					onClick={() => onClickTool('zoom-out')}
					disabled={false}
					aria-label="Zoom Out"
					// onClick={() => {
					// 	if (scale - 25 >= 100) setScale(scale - 25)
					// }}
				/>
				<img
					className="px-3"
					src={ZoomIn}
					alt="ZoomIn"
					style={{
						cursor: 'pointer',
					}}
					onClick={() => onClickTool('zoom')}
					disabled={false}
					aria-label="Zoom In"
					// onClick={() => {
					// 	if (scale + 25 <= 1000) setScale(scale + 25)
					// }}
				/>
				<div className="d-flex px-3">
					<span
						style={{
							color: '#D5D5D5',
							padding: '0 2% 0 0',
							fontSize: '15px',
						}}
					>
						-
					</span>
					<input
						type="range"
						value={scale}
						min={100}
						max={1000}
						step={1}
						onChange={(e) => setScale(e.target.value)}
					/>
					<span
						style={{
							color: '#D5D5D5',
							padding: '0 0 0 2%',
							fontSize: '15px',
							cursor: 'pointer',
						}}
					>
						+
					</span>
				</div>
				<div
					className="px-3"
					style={{
						color: '#FFFFFF',
					}}
				>
					<CustomInput
						type="switch"
						id="exampleCustomSwitch"
						name="customSwitch"
						label="Enable Roll-Over Zoom"
					/>
				</div>
				<div
					className="px-3"
					style={{
						color: '#FFFFFF',
					}}
				>
					<CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Scan Mode" />
				</div>
				<div
					className="px-3"
					style={{
						color: '#FFFFFF',
					}}
				>
					<CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Show Regions" />
				</div>
				<div className="px-3">
					<Dropdown isOpen={dropdownOpen} toggle={toggle}>
						<DropdownToggle
							style={{
								backgroundColor: 'transparent',
								border: '0px',
								padding: '0px',
								margin: '0px',
								fontSize: '15px',
							}}
							caret
						>
							View As
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem header>Nothing Added yet</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</Col>
			<Col>
				<img className="pl-5" src={CloseIcon} alt="CloseIcon" />
			</Col>
		</>
	)
}

export default Appbar
