export interface FormProps {
    open: boolean,
    setOpen:React.Dispatch<React.SetStateAction<string>>,
    mode: "edit" | "create" | ""
}

export interface GenreType {
    name: string
  }