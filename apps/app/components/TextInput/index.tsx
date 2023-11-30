import { TextInput as RNTextInput, TextInputProps } from "react-native-paper";

export const TextInput = (props: TextInputProps) => {
    return (
        <RNTextInput mode="outlined" {...props} />
    )
}