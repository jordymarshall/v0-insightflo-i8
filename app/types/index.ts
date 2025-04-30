import { RefObject } from "react";

export type TextareaRef = RefObject<HTMLTextAreaElement | null>;

export interface WorkflowResponse {
  workflowId: string;
  message: string;
  text: string;
}
