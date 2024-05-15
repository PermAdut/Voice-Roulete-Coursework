import { InputProps } from "./Registartion";

export default function RegistrationInput(props: InputProps) {
  return (
    <input
      onChange={(event) => {
        props.setValue(event.target.value);
      }}
      type={props.type}
      value={props.value}
      placeholder={props.placeholder}
    />
  );
}
