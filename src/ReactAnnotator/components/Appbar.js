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

const Appbar = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const toggle = () => setDropdownOpen((prevState) => !prevState)
	return (
		<>
			<Col className="d-flex" lg={11}>
				<img className="pr-4" src={RectangleIcon} alt="RectangleIcon" />{' '}
				<img className="px-4" src={LeftArrow} alt="LeftArrow" />
				<img className="px-4" src={RightArrow} alt="RightArrow" />
				<img className="px-4" src={BookMarkIcon} alt="BookMarkIcon" />
				<img className="px-4" src={MessageIcon} alt="MessageIcon" />
				<img className="px-4" src={ZoomIn} alt="ZoomIn" />
				<img className="px-4" src={ZoomOut} alt="ZoomOut" />
				<div className="d-flex px-4">
					<span
						style={{
							color: '#D5D5D5',
							padding: '0 2% 0 0',
							fontSize: '15px',
						}}
					>
						-
					</span>
					<input type="range" />
					<span
						style={{
							color: '#D5D5D5',
							padding: '0 0 0 2%',
							fontSize: '15px',
						}}
					>
						+
					</span>
				</div>
				<div
					className="px-4"
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
					className="px-4"
					style={{
						color: '#FFFFFF',
					}}
				>
					<CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Scan Mode" />
				</div>
				<div
					className="px-4"
					style={{
						color: '#FFFFFF',
					}}
				>
					<CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Show Regions" />
				</div>
				<div className="px-4">
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
