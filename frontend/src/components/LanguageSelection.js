import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

function LanguageSelection ({ curLang, handleLanguageChange, runtimeVersions }) {
    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="code-language-selection">Compiler</InputLabel>
            <Select
                labelId="code-language-selection"
                id="code-language-selection"
                value={curLang}
                label="Code Language"
                onChange={handleLanguageChange}
            >
                {Object.keys(runtimeVersions).map((language) => (
                    <MenuItem key={language} value={language}>
                        {language} {runtimeVersions[language]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default LanguageSelection
