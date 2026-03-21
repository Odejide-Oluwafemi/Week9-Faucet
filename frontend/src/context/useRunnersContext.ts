import { useContext } from "react";
import { RunnersContext } from "./runnersContextDef.ts";

export const useRunnersContext = () => useContext(RunnersContext);
