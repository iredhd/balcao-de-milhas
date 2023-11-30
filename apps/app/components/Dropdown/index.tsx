import { useState } from "react";
import { useTheme } from "react-native-paper";
import DropDown, {DropDownPropsInterface} from "react-native-paper-dropdown";
import { useToggle } from "../../hooks";
import { PaperSelect, PaperSelectProps } from 'react-native-paper-select';

export interface DropdownProps {
    label: string
    value: string
    selected: string | string[]
    onSelection: () => void
    options: Array<{id: string, value: string}>
    multiselect: boolean
}

export const Dropdown = (props: DropdownProps) => {
    const [isVisible, isVisibleControls] = useToggle(false)
    const theme = useTheme()
    const [showDropDown, setShowDropDown] = useState(false);

    const arrayList = props.options.map(item => ({_id: item.id, value: item.value}))

    const selectedArrayList = arrayList.filter(item => typeof props.selected === "string" ? props.selected === item._id : props.selected.includes(item._id)) 

    return (
        <PaperSelect
            {...props}
            value={props.value || ''}
            theme={theme}
            arrayList={arrayList}
            selectedArrayList={selectedArrayList}
            multiEnable={props.multiselect || false}
            dialogCloseButtonText="Cancelar"
            dialogDoneButtonText="Selecionar"
            textInputMode="outlined"
            searchText="Buscar"
        />
    )
}