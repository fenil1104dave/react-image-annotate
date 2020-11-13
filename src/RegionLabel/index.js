// @flow

import React, { useState, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import styles from './styles'
import classnames from 'classnames'
import type { Region } from '../ImageCanvas/region-tools.js'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import TrashIcon from '@material-ui/icons/Delete'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CustomizedCheckbox from '../Checkbox'

const useStyles = makeStyles(styles)

type Props = {
	region: Region,
	editing?: boolean,
	allowedClasses?: Array<string>,
	allowedTags?: Array<string>,
	cls?: string,
	tags?: Array<string>,
	onDelete: Region => null,
	onChange: Region => null,
	onClose: Region => null,
	onOpen: Region => null,
}

export default ({
	region,
	editing,
	allowedClasses = ['Laptop', 'Mouse', 'Compuda'],
	allowedTags = ['Dog', 'Cat', 'Woof', 'Electronic Device'],
	onDelete,
	onChange,
	onClose,
	onOpen,
	isEditingLocked = false,
	zoomToRegion,
}: Props) => {
	const classes = useStyles()
	const [value, setValue] = useState([])
	const [inputValue, setInputValue] = useState('')
	const [tags, setTags] = useState([])

	useEffect(() => {
		if (region.tags && region.tags.length) {
			const t = region.tags.map(c => c.value)
			const temp = allowedTags.filter(c => !t.includes(c.value))
			setTags([...temp, ...region.tags])
			const r = [...region.tags.map(c => ({ label: c.label, value: c.value, type: c.type }))]
			setValue(r)
		} else {
			setTags([...allowedTags])
		}
	}, [region.tags, allowedTags])

	const handleApplyClick = () => {
		onChange({
			...region,
			tags: value ? value.map(t => t) : [],
		})
		onClose(region)
	}

	return (
		<Paper
			onClick={() => (!editing && !isEditingLocked ? onOpen(region) : null)}
			className={classnames(classes.regionInfo, {
				highlighted: region.highlighted,
				[classes.open]: editing,
			})}
		>
			{!editing ? (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<ZoomInIcon fontSize="small" onClick={() => zoomToRegion(region)} />
					{region.cls && (
						<div className="name">
							<div className="circle" style={{ backgroundColor: region.color }} />
							{region.cls}
						</div>
					)}
					{region.tags && (
						<div className="tags">
							{region.tags.map(t => (
								<div key={t.label} className="tag">
									{t.label}
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				tags.length > 0 && (
					<Box>
						<Autocomplete
							open
							id={region.id}
							disablePortal
							multiple
							classes={{
								paper: classes.paper,
								option: classes.option,
								popperDisablePortal: classes.popperDisablePortal,
							}}
							onChange={(e, newValue) => setValue(newValue)}
							value={value}
							renderTags={() => {}}
							limitTags={0}
							groupBy={option => option.type}
							getOptionSelected={(option, value) => option.value === value.value}
							getOptionLabel={option => option.label || ''}
							options={tags
								.sort((a, b) => -b.label.localeCompare(a.label))
								.sort((a, b) => -b.type.localeCompare(a.type))
								.map(c => ({ value: c.value, label: c.label, type: c.type }))}
							inputValue={inputValue}
							onInputChange={(event, value, reason) => {
								if (reason !== 'reset') {
									setInputValue(value)
								}
							}}
							renderInput={params => {
								return (
									<TextField
										{...params}
										variant="standard"
										placeholder="Search"
										className={classes.inputBase}
									/>
								)
							}}
							renderOption={(option, { selected }) => (
								<>
									<CustomizedCheckbox checked={selected} />
									<Typography className={classes.label}>{option.label}</Typography>
								</>
							)}
						/>
						<Box display="flex" justifyContent="space-between" alignItems="center">
							<Button disabled={!value.length} className={classes.button} onClick={handleApplyClick}>
								Apply
							</Button>
							<IconButton onClick={() => onDelete(region)} variant="outlined">
								<TrashIcon />
							</IconButton>
						</Box>
					</Box>
				)
			)}
		</Paper>
	)
}
