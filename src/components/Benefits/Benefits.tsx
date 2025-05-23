import css from "./Benefits.module.css";
import clsx from "clsx";
import type { Benefit } from "../../types/types";

export default function Benefits(props: Benefit) {
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
