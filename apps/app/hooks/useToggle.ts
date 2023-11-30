import { useCallback, useState } from "react"

export type UseToggleControls = {
    setFalse: () => void,
    setTrue: () => void,
    toggle: () => void
}

export type UseToggleReturn = [boolean, UseToggleControls]

export const useToggle = (initialValue: boolean): UseToggleReturn => {
    const [value, setValue] = useState(initialValue || false)
    
    const setFalse = useCallback(() => {
        setValue(false)
    }, [])

    const setTrue = useCallback(() => {
        setValue(true)
    }, [])

    const toggle = useCallback(() => {
        setValue(state => !state)
    }, [])

    return [
        value,
        {
            setFalse,
            setTrue,
            toggle
        }
    ]
}