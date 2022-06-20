import { h } from "@stencil/core";
import { createProviderConsumer } from "@stencil/state-tunnel";

export interface State {
    layout?: () => void,
    add?: (el: HTMLElement) => void,
    rm?: (el: HTMLElement) => void
}

export default createProviderConsumer<State>(
  {

  },
  (subscribe, child) => (
    <context-consumer subscribe={subscribe} renderer={child} />
  )
);