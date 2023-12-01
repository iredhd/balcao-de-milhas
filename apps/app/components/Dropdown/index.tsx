import { useState } from "react";
import { useTheme } from "react-native-paper";
import DropDown, {DropDownPropsInterface} from "react-native-paper-dropdown";
import { useToggle } from "../../hooks";
import { PaperSelect } from 'react-native-paper-select';

export interface DropdownProps {
    label: string
    value: string
    selected: string | string[]
    onSelection: (selected: {selectedList: Array<{id: string, value: string}>, text: string}) => void
    options: Array<{id: string, value: string}>
    multiselect?: boolean
    hideSearchBox?: boolean
}

export const Dropdown = (props: DropdownProps) => {
    const theme = useTheme()

    const arrayList = props.options.map(item => ({_id: item.id, value: item.value}))

    const selectedArrayList = !props.selected ? [] : arrayList.filter(item => typeof props.selected === "string" ? props.selected === item._id : props.selected.includes(item._id)) 
    
    return (
        <PaperSelect
            {...props}
            value={props.value || ''}
            theme={theme}
            arrayList={arrayList}
            onSelection={(value) => {
                props.onSelection({
                    text: value.text,
                    selectedList: value.selectedList.map(item => ({
                        id: item._id,
                        value: item.value
                    }))
                })
            }}
            selectedArrayList={selectedArrayList}
            multiEnable={props.multiselect || false}
            dialogCloseButtonText="Cancelar"
            dialogDoneButtonText="Selecionar"
            textInputMode="outlined"
            searchText="Buscar"
            checkboxProps={{
                checkboxColor: theme.colors.primary
            }}
        />
    )
}