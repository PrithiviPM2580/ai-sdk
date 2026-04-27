import { MODELS } from "@/constants"
import { Speed, Task } from "@/types"

export function selectModel(task: Task, speed: Speed = "balanced") {
  return MODELS.TOOL
}
