// @flow

import React, { useState, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import styles from './styles'
import classnames from 'classnames'
import type { Region } from '../ImageCanvas/region-tools.js'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import Box from '@material-ui/core/Box'
import SortIcon from '@material-ui/icons/Sort'
import HistoryIcon from '@material-ui/icons/History'
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
	onDelete: (Region) => null,
	onChange: (Region) => null,
	onClose: (Region) => null,
	onOpen: (Region) => null,
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
			const t = region.tags.map((c) => c.value)
			const temp = allowedTags.filter((c) => !t.includes(c.value))
			setTags([...temp, ...region.tags])
			const r = [...region.tags.map((c) => ({ label: c.label, value: c.value, type: c.type }))]
			setValue(r)
		} else {
			setTags([...allowedTags])
		}
	}, [region.tags, allowedTags])

	const handleApplyClick = (value) => {
		setValue(value)
		onChange({
			...region,
			tags: value ? value.map((t) => t) : [],
		})
		onClose(region)
	}

	const deleteDefectTag = (defectValue) => {
		handleApplyClick(value.filter((x) => x.value !== defectValue))
	}

	return (
		<Box
			className={classnames(classes.regionInfo, {
				highlighted: region.highlighted,
			})}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				{region.cls && (
					<div className="name">
						<div className="circle" style={{ backgroundColor: region.color }} />
						{region.cls}
					</div>
				)}

				<div className="tags">
					{region.tags
						? region.tags.map((t) => (
								<Box my={0.4} px={1} mx={0.2} key={t.label} className="tag">
									<Typography style={{ marginRight: '5px', fontSize: '12px' }}>{t.label}</Typography>
									{t.type !== 'Ai Defect' && (
										<CloseIcon
											className={classes.closeBtn}
											onClick={() => deleteDefectTag(t.value)}
										/>
									)}
								</Box>
								// <div key={t.label} className="tag">
								// 	{t.label}
								// </div>
						  ))
						: ''}
					<Box onClick={() => onOpen(region)} my={0.4} px={1} mx={0.2} className="tag addIcon">
						{region.tags && region.tags.length !== 0 ? (
							''
						) : (
							<Typography style={{ marginRight: '5px', fontSize: '12px' }}>Add</Typography>
						)}
						<AddIcon className={classes.closeBtn} />
					</Box>
					<Box onClick={() => onDelete(region)} my={0.4} px={1} mx={0.2} className="tag addIcon">
						<DeleteIcon className={classes.closeBtn} />
					</Box>
				</div>
			</div>
			{editing && (
				<Paper>
					<Box p={1}>
						<Autocomplete
							open
							freeSolo
							id={region.id}
							disablePortal
							multiple
							classes={{
								paper: classes.paper,
								option: classes.option,
								popperDisablePortal: classes.popperDisablePortal,
							}}
							onChange={(e, newValue) => handleApplyClick(newValue)}
							value={value}
							renderTags={() => {}}
							limitTags={0}
							groupBy={(option) => option.type}
							getOptionSelected={(option, value) => option.value === value.value}
							getOptionLabel={(option) => option.label || ''}
							options={tags
								.sort((a, b) => -b.label.localeCompare(a.label))
								.sort((a, b) => -b.type.localeCompare(a.type))
								.map((c) => ({ value: c.value, label: c.label, type: c.type }))}
							inputValue={inputValue}
							onInputChange={(event, value, reason) => {
								if (reason !== 'reset') {
									setInputValue(value)
								}
							}}
							renderInput={(params) => {
								return (
									<TextField
										{...params}
										fullWidth
										variant="outlined"
										placeholder="Search..."
										className={classes.inputBase}
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<>
													{params.InputProps.endAdornment}
													<IconButton
														className={classes.searchIcons}
														aria-label="sort search"
														onClick={() => {}}
													>
														<SortIcon />
													</IconButton>
													<IconButton
														className={classes.searchIcons}
														aria-label="search history"
														onClick={() => {}}
													>
														<HistoryIcon />
													</IconButton>
												</>
											),
										}}
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
					</Box>
				</Paper>
			)}
		</Box>
	)
}
