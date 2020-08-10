import React from 'react'
import CloudBtn from '../../assets/images/reviewScreen/uploadCloud.svg'
import EditBtn from '../../assets/images/reviewScreen/editBtn.svg'
import { Row, Col } from 'reactstrap'

const Metadata = () => {
	return (
		<div className="mx-1 my-4">
			<div className="clearfix">
				<span style={{ fontSize: '16px', color: '#02435D' }}>Metadata</span>
				<div className="float-right">
					<img className="px-2" src={CloudBtn} alt="cloud" />
					<img className="px-2" src={EditBtn} alt="edit" />
				</div>
			</div>
			<div
				style={{
					border: '1px solid #DDDDDD',
					width: '100%',
					height: '1px',
				}}
			/>
			<Row className="my-2">
				<Col
					style={{
						color: '#9F9F9F',
					}}
				>
					Image Record Name
				</Col>
				<Col style={{ fontWeight: 500, color: '#434343' }}>
					84PMBG64X05_Tray017_R002C004_BCF2MCF10_Backlight Burr Backlight Burr 1_Bottom SMI Burr RTR.bmp
				</Col>
			</Row>
			<Row className="my-2">
				<Col
					style={{
						color: '#9F9F9F',
					}}
				>
					Folder
				</Col>
				<Col style={{ fontWeight: 500, color: '#434343' }}>B-001</Col>
			</Row>
			<Row className="my-2">
				<Col
					style={{
						color: '#9F9F9F',
					}}
				>
					Loat ID
				</Col>
				<Col style={{ fontWeight: 500, color: '#434343' }}>84PMYF35G02</Col>
			</Row>
			<Row className="my-2">
				<Col
					style={{
						color: '#9F9F9F',
					}}
				>
					Tray ID
				</Col>
				<Col style={{ fontWeight: 500, color: '#434343' }}>Tray002</Col>
			</Row>
			<Row className="my-2">
				<Col
					style={{
						color: '#9F9F9F',
					}}
				>
					Row & Column
				</Col>
				<Col style={{ fontWeight: 500, color: '#434343' }}>R003C001 </Col>
			</Row>
			<Row className="my-2">
				<Col
					style={{
						color: '#9F9F9F',
					}}
				>
					Machine ID
				</Col>
				<Col style={{ fontWeight: 500, color: '#434343' }}>KLA345</Col>
			</Row>
			<Row className="my-2">
				<Col
					style={{
						color: '#9F9F9F',
					}}
				>
					Processing Time
				</Col>
				<Col style={{ fontWeight: 500, color: '#434343' }}>1/20/2020 19:49:28</Col>
			</Row>
			<Row className="my-2 px-3">
				<Col style={{ fontWeight: 500, color: '#434343', textAlign: 'right' }}>Show More</Col>
			</Row>
		</div>
	)
}

export default Metadata
