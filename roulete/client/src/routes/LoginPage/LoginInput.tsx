import { InputProps } from "./LoginPage";

export default function LoginInput(props: InputProps) {
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
