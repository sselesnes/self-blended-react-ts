import css from "./Benefits.module.css";
import clsx from "clsx";

interface BenefitsProps {
  name: string;
  color: string;
}

export default function Benefits(props: BenefitsProps) {
  return (
    <li>
      <h3
        className={clsx(css.benefit, { [css.colored]: props.color })}
        style={{ color: props.color }}
      >
        {props.name}
      </h3>
    </li>
  );
}
